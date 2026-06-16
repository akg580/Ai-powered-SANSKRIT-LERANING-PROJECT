import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(path, "utf8");
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
    console.error(`not ok - ${name}`);
    console.error(`  ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const packageJson = JSON.parse(read("package.json"));
const gitignore = read(".gitignore");
const app = read("src/App.jsx");
const authContext = read("src/contexts/AuthContext.jsx");
const progressContext = read("src/contexts/ProgressContext.jsx");
const runtimeConfig = read("src/firebase/runtimeConfig.js");

test("package exposes complete test scripts", () => {
  assert(packageJson.scripts.test, "missing npm test");
  assert(packageJson.scripts["test:static"], "missing npm run test:static");
  assert(packageJson.scripts["test:e2e"], "missing npm run test:e2e");
  assert(packageJson.scripts["test:build"], "missing npm run test:build");
});

test("private Firebase config is ignored and no longer imported", () => {
  assert(gitignore.includes("src/firebase/config.js"), "src/firebase/config.js is not ignored");
  assert(!authContext.includes("../firebase/config"), "AuthContext still imports ignored config.js");
  assert(!progressContext.includes("../firebase/config"), "ProgressContext still imports ignored config.js");
});

test("tracked Firebase runtime uses env vars and no committed project key", () => {
  assert(runtimeConfig.includes("VITE_FIREBASE_API_KEY"), "runtimeConfig does not read Vite env vars");
  assert(!runtimeConfig.includes("AIzaSyDJ"), "runtimeConfig contains the local Firebase API key");
  assert(runtimeConfig.includes("isE2EAuthMode"), "runtimeConfig missing e2e auth mode");
});

test("lesson data includes aligned chapter 1 and chapter 2 content", () => {
  assert(app.includes("Saṃjñā Prakaraṇa"), "Chapter 1 is not aligned to Saṃjñā");
  assert(app.includes("Sandhi Prakaraṇa"), "Chapter 2 is not aligned to Sandhi");
  assert(app.includes("सवर्णदीर्घ"), "Sandhi subchapter missing savarṇadīrgha");
  assert(app.includes("इको यणचि"), "Sandhi sources missing iko yaṇ aci");
});

test("chapter learning actions are present", () => {
  for (const label of ["Open & Learn", "View Cards", "Practice Fast", "Earn Mastery"]) {
    assert(app.includes(label), `missing learning action: ${label}`);
  }
});

test("git no longer tracks local Firebase config", () => {
  const output = execFileSync("git", ["ls-files", "src/firebase/config.js"], { encoding: "utf8" }).trim();
  assert(output === "", "src/firebase/config.js is still tracked by git");
});

if (failures.length) {
  console.error(`\n${failures.length} static test(s) failed:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nStatic tests passed.");
