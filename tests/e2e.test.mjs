import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

async function getFreePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
}

const APP_PORT = Number(process.env.E2E_APP_PORT) || await getFreePort();
const DEBUG_PORT = Number(process.env.E2E_DEBUG_PORT) || await getFreePort();
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const results = [];
const networkUrls = [];
const consoleErrors = [];
let viteProcess;
let browserProcess;
let client;
let cleanedUp = false;

function log(message) {
  console.log(`[e2e] ${message}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`ok - ${name}`);
  } catch (err) {
    results.push({ name, ok: false, error: err });
    console.error(`not ok - ${name}`);
    console.error(`  ${err.stack || err.message}`);
    try {
      const text = await bodyText();
      console.error(`  body: ${text.slice(0, 500).replace(/\s+/g, " ")}`);
    } catch {
      // ignore diagnostics failure
    }
  }
}

async function waitFor(fn, label, timeout = 10000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeout) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err) {
      lastError = err;
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? ` (${lastError.message})` : ""}`);
}

async function waitForHttp(url, label) {
  await waitFor(async () => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }, label, 30000);
}

function spawnVite() {
  const viteCommand = process.platform === "win32"
    ? join(process.cwd(), "node_modules", ".bin", "vite.cmd")
    : join(process.cwd(), "node_modules", ".bin", "vite");
  const command = process.platform === "win32" ? "cmd.exe" : viteCommand;
  const args = process.platform === "win32"
    ? ["/d", "/c", viteCommand, "--host", "127.0.0.1", "--port", String(APP_PORT), "--strictPort"]
    : ["--host", "127.0.0.1", "--port", String(APP_PORT), "--strictPort"];
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, VITE_E2E_AUTH: "1", BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => process.stdout.write(`[vite] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[vite] ${chunk}`));
  return child;
}

function findChrome() {
  for (const path of CHROME_PATHS) {
    if (path && existsSync(path)) return path;
  }
  throw new Error("Chrome or Edge executable not found. Set CHROME_PATH to run e2e tests.");
}

function spawnBrowser() {
  const chrome = findChrome();
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${DEBUG_PORT}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  child.stderr.on("data", (chunk) => process.stderr.write(`[browser] ${chunk}`));
  return child;
}

async function getWebSocketUrl() {
  const listUrl = `http://127.0.0.1:${DEBUG_PORT}/json/list`;
  return waitFor(async () => {
    try {
      const response = await fetch(listUrl);
      if (!response.ok) return false;
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
      return page?.webSocketDebuggerUrl || false;
    } catch {
      return false;
    }
  }, "Chrome page debugging websocket", 15000);
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Map();

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method && this.handlers.has(message.method)) {
        for (const handler of this.handlers.get(message.method)) handler(message.params || {});
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(handler);
  }

  close() {
    this.ws.close();
  }
}

async function connectBrowser() {
  const wsUrl = await getWebSocketUrl();
  const ws = new WebSocket(wsUrl);
  await once(ws, "open");
  const cdp = new CdpClient(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  cdp.on("Runtime.consoleAPICalled", (event) => {
    if (["error", "assert"].includes(event.type)) {
      const text = event.args?.map((arg) => arg.value || arg.description || "").join(" ");
      if (!text.includes("Download the React DevTools")) consoleErrors.push(text);
    }
  });
  cdp.on("Runtime.exceptionThrown", (event) => {
    consoleErrors.push(event.exceptionDetails?.text || "Unhandled browser exception");
  });
  cdp.on("Network.requestWillBeSent", (event) => {
    networkUrls.push(event.request.url);
  });
  return cdp;
}

async function evaluate(expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  }
  return result.result.value;
}

function literal(value) {
  return JSON.stringify(value);
}

async function bodyText() {
  return evaluate("document.body.innerText");
}

async function hasText(text) {
  return evaluate(`document.body.innerText.includes(${literal(text)})`);
}

async function waitForText(text, timeout = 10000) {
  await waitFor(() => hasText(text), `text "${text}"`, timeout);
}

async function clickText(text) {
  const clicked = await evaluate(`
    (() => {
      const needle = ${literal(text)};
      const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
      const isVisible = (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      };
      const nodes = [...document.querySelectorAll('button, a, [role="button"]')]
        .filter((node) => !node.disabled && isVisible(node));
      const el = nodes.find((node) => normalize(node.innerText) === needle)
        || nodes.find((node) => normalize(node.innerText).includes(needle));
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const detail = { text: normalize(el.innerText), tag: el.tagName.toLowerCase() };
      const eventOptions = { bubbles: true, cancelable: true, view: window };
      el.dispatchEvent(new PointerEvent('pointerdown', { ...eventOptions, pointerId: 1, buttons: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', eventOptions));
      el.dispatchEvent(new PointerEvent('pointerup', { ...eventOptions, pointerId: 1, buttons: 0 }));
      el.dispatchEvent(new MouseEvent('mouseup', eventOptions));
      el.click();
      return detail;
    })()
  `);
  assert(clicked, `Clickable text not found: ${text}`);
  log(`click "${text}" -> "${String(clicked.text).slice(0, 80)}"`);
  await delay(150);
}

async function setInput(index, value) {
  const ok = await evaluate(`
    (() => {
      const el = document.querySelectorAll('input')[${index}];
      if (!el) return false;
      el.focus();
      const previousValue = el.value;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, ${literal(value)});
      if (el._valueTracker) el._valueTracker.setValue(previousValue);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()
  `);
  assert(ok, `Input not found at index ${index}`);
  await delay(75);
}

async function setInputByLabel(labelText, value) {
  const ok = await evaluate(`
    (() => {
      const label = [...document.querySelectorAll('label')]
        .find((node) => node.innerText && node.innerText.includes(${literal(labelText)}));
      const el = label?.querySelector('input, textarea, select');
      if (!el) return false;
      el.focus();
      const previousValue = el.value;
      const prototype = el instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : el instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
      setter.call(el, ${literal(value)});
      if (el._valueTracker) el._valueTracker.setValue(previousValue);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()
  `);
  assert(ok, `Input not found for label: ${labelText}`);
  await delay(100);
}

async function clearInputs() {
  await evaluate(`
    [...document.querySelectorAll('input')].forEach((el) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  `);
  await delay(75);
}

async function submitActiveForm() {
  const ok = await evaluate(`
    (() => {
      const form = document.querySelector('form');
      if (!form) return false;
      form.requestSubmit();
      return true;
    })()
  `);
  assert(ok, "Active form not found");
  await delay(200);
}

async function clickAvatar() {
  const ok = await evaluate(`
    (() => {
      const nav = document.querySelector('nav');
      const button = nav?.lastElementChild?.querySelector('button');
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  assert(ok, "Avatar button not found");
}

async function answerQuiz(answers) {
  for (let index = 0; index < answers.length; index++) {
    const answer = answers[index];
    await waitForText(answer);
    await clickText(answer);
    await waitForText("Explanation:");
    await clickText(index === answers.length - 1 ? "See Results" : "Next");
  }
}

async function setup() {
  viteProcess = spawnVite();
  await waitForHttp(APP_URL, "Vite app");
  browserProcess = spawnBrowser();
  client = await connectBrowser();
  await client.send("Page.navigate", { url: APP_URL });
  await waitForText("Aṣṭādhyāyī", 15000);
  log(`Loaded ${APP_URL} with text: ${(await bodyText()).slice(0, 160).replace(/\s+/g, " ")}`);
}

async function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  try {
    if (client) client.close();
  } catch {
    // ignore cleanup errors
  }
  for (const child of [browserProcess, viteProcess]) {
    if (!child || child.killed) continue;
    if (process.platform === "win32" && child.pid) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      child.kill();
    }
  }
}

const globalTimeout = setTimeout(async () => {
  console.error("E2E suite timed out; cleaning up browser and dev server.");
  await cleanup();
  process.exit(1);
}, 120000);

await setup();

await test("auth validation, signup, reset, and login flows", async () => {
  await clickText("Sign In");
  await submitActiveForm();
  await waitForText("Enter a valid email");
  await waitForText("Password required");

  await clickText("Create Account");
  await clearInputs();
  await setInput(0, "Test Scholar");
  await setInput(2, "weak");
  await setInput(3, "different");
  await submitActiveForm();
  await waitForText("Enter a valid email");
  await waitForText("Min 8 chars");

  await clearInputs();
  await setInput(0, "Test Scholar");
  await setInput(1, "test@example.com");
  await setInput(2, "Strong123");
  await setInput(3, "Mismatch123");
  await submitActiveForm();
  await waitForText("Passwords do not match");

  await clickText("Sign In");
  await clickText("Forgot your password?");
  await setInput(0, "reset@example.com");
  await submitActiveForm();
  await waitForText("Reset email sent");

  await clickText("Back to Sign In");
  await setInput(0, "learner@example.com");
  await setInput(1, "Strong123");
  await submitActiveForm();
  await waitForText("CONTINUE LEARNING");
});

await test("global navigation opens every main page", async () => {
  await clickText("Chapters");
  await waitForText("All Chapters");
  await waitForText("Sandhi Prakaraṇa");

  await clickText("Progress");
  await waitForText("My Progress");
  await waitForText("Overall Mastery");

  await clickText("Glossary");
  await waitForText("Glossary");
  await waitForText("53 terms across");

  await clickText("Home");
  await waitForText("CONTINUE LEARNING");
});

await test("chapter sections, subchapters, cards, sources, and watch page", async () => {
  await clickText("Chapters");
  await clickText("Sandhi Prakaraṇa");
  await waitForText("SUBCHAPTERS");
  await waitForText("Sandhi Prakaraṇa");

  await clickText("2.4");
  await waitForText("सवर्णदीर्घ");

  await clickText("View Cards");
  await waitForText("Tap each card");
  await evaluate("document.querySelector('[style*=perspective]')?.click()");
  await waitForText("Pāṇini");

  await clickText("Sources");
  await waitForText("इको यणचि");

  await clickText("Watch");
  await waitForText("Open YouTube Playlist");
});

await test("Sandhi quiz records progress and unlocks completion UI", async () => {
  await clickText("Practice Fast");
  await answerQuiz(["आ", "य्", "देवेन्द्रः", "Flow smoothly in speech"]);
  await waitForText("Excellent");

  await clickText("Progress");
  await waitForText("1/7");
  await waitForText("60XP");
});

await test("progress and glossary entries deep-link back into chapters", async () => {
  await clickText("Progress");
  await clickText("Sandhi Prakaraṇa");
  await waitForText("SUBCHAPTERS");

  await clickText("Glossary");
  await setInput(0, "visarga");
  await waitForText("विसर्ग सन्धि");
  await clickText("Open chapter");
  await waitForText("Sandhi Prakaraṇa");
});

await test("profile system saves user settings and exposes progress", async () => {
  await clickText("Profile");
  await waitForText("USER SYSTEM");
  await setInputByLabel("Display name", "Profile Scholar");
  await setInputByLabel("Learning goal", "Study one Sanskrit concept daily");
  await setInputByLabel("Daily target", "30");
  await clickText("Save Profile");
  await waitForText("Profile saved");
  await waitForText("PROGRESS VAULT");
  await waitForText("CHAPTER PROGRESS");
});

await test("admin CMS can create, edit, and preview content", async () => {
  await clickText("Admin");
  await waitForText("Content command center");
  await clickText("Add Chapter");
  await waitForText("New Sanskrit Chapter");
  await setInputByLabel("Title", "CMS Test Chapter");
  await setInputByLabel("Subtitle", "Managed from the admin CMS");
  await setInputByLabel("Subchapter title", "CMS Test Subchapter");
  await setInputByLabel("Explanation", "This content was edited through the CMS.");
  await clickText("Preview");
  await waitForText("CMS Test Chapter");
  await waitForText("CMS Test Subchapter");
  await waitForText("This content was edited through the CMS.");
});

await test("logout returns to auth screen", async () => {
  await clickAvatar();
  await waitForText("Sign Out");
  await clickText("Sign Out");
  await waitForText("Sign In");
});

await test("e2e mode does not call Firebase network APIs", async () => {
  const forbidden = networkUrls.filter((url) => (
    url.includes("identitytoolkit.googleapis.com")
    || url.includes("firestore.googleapis.com")
    || url.includes("securetoken.googleapis.com")
  ));
  assert(forbidden.length === 0, `Unexpected Firebase network calls: ${forbidden.join(", ")}`);
});

await test("browser console has no runtime errors", async () => {
  assert(consoleErrors.length === 0, `Console errors:\n${consoleErrors.join("\n")}`);
});

await cleanup();
clearTimeout(globalTimeout);

const failed = results.filter((result) => !result.ok);
if (failed.length) {
  console.error(`\n${failed.length} e2e test(s) failed.`);
  process.exit(1);
}

console.log("\nE2E tests passed.");
