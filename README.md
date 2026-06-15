# 🕉️ Aṣṭādhyāyī Sahajabodha v2
### Interactive Sanskrit Grammar Platform with Auth & Cloud Progress Sync

> Based on **Pushpa Dikshit's** lecture series | Pauspi Prakriyā Method  
> 📺 https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs

---

## 🚀 Quick Start (VS Code — 3 steps)

```bash
# 1. Open this folder in VS Code and open terminal (Ctrl+` / Cmd+`)

# 2. Install dependencies
npm install

# 3. Start dev server (opens http://localhost:3000 automatically)
npm run dev
```

**Requires:** Node.js 18+ from https://nodejs.org

---

## 🔥 Firebase Setup (for Auth + Progress Sync)

1. Go to https://console.firebase.google.com → **Add project**
2. Left sidebar → **Build → Authentication → Get started → Email/Password → Enable**
3. Left sidebar → **Build → Firestore Database → Create database → Start in test mode**
4. Click `</>` (Web) → Register app → copy the `firebaseConfig` object
5. Paste your config into **`src/firebase/config.js`** replacing the placeholder values

Without Firebase setup the app shows an error on load. The app works fully once Firebase is configured.

---

## 📁 Project Structure

```
ashtadhyayi-sahajabodha/
├── src/
│   ├── App.jsx                        ← 🏛️ Main platform (877 lines)
│   ├── main.jsx                       ← React entry + Provider wrappers
│   ├── firebase/
│   │   └── config.js                  ← ⚠️ ADD YOUR FIREBASE CONFIG HERE
│   ├── contexts/
│   │   ├── AuthContext.jsx            ← Signup · Login · Logout · onAuthStateChanged
│   │   └── ProgressContext.jsx        ← Firestore sync · XP · Streak · Badges
│   └── components/
│       ├── AuthScreen.jsx             ← Login / Signup / Password Reset UI
│       ├── UserAvatar.jsx             ← Top-nav user menu + stats dropdown
│       └── LoadingScreen.jsx          ← Spinning Om loading screen
├── public/
│   └── favicon.svg                    ← 🕉️ Om icon
├── index.html
├── package.json                       ← React 18 + Firebase 10 + Vite 5
├── vite.config.js
├── firestore.rules                    ← Paste into Firebase Console → Firestore → Rules
└── README.md
```

---

## 🎓 What's Inside

### 7 Chapters
| # | Section | Topics |
|---|---------|--------|
| 1 | §1-2 | Dhātu & Pratipadika — Verbal Roots & Nominal Stems |
| 2 | §3-8 | Varṇamātrikā — 9 Vowels · 33 Consonants · 5 Vargas |
| 3 | §19-21 | Māheśvara Sūtras & Pratyāhāras — 14 Drum-Formulas · 42 Abbreviations |
| 4 | §22-24 | Sthāna · Karaṇa · Prayatna — 8 Places · Articulation Effort |
| 5 | §25-39 | Vowel System — 18 Forms · Guṇa · Vṛddhi · Laghu-Guru |
| 6 | §40-71 | Morphological Operations — Sthānī · Ādeśa · Āgama · Upasarga |
| 7 | §72-96 | Architecture — Lopa · Bahulam · 7 Sūtra Types · Laghava |

### Each Chapter has 6 tabs:
| Tab | Content |
|-----|---------|
| 📚 Concepts | All terms with sūtra references and examples |
| 🃏 Flashcards | 3D flip cards (tap to reveal) |
| ❓ Quiz | 4 standard questions with explanations |
| 📋 Test | **3 levelled tests** — Easy 🟢 / Medium 🟡 / Hard 🔴 (5 Qs each, badges at ≥80%) |
| 📜 Vedic | Ṛgveda · Upaniṣads · Prātiśākhya verses with IAST, translation, source links & grammar connection notes |
| 📺 Watch | Link to source YouTube playlist |

### Auth & Progress System:
- ✅ Email/Password signup & login
- ✅ Password strength meter + validation
- ✅ Forgot password (email reset)
- ✅ Progress synced to Firestore in real-time
- ✅ XP points (15/correct quiz, 10-40/correct level test)
- ✅ Daily streak tracking (localStorage + Firestore)
- ✅ Level badges (Easy/Medium/Hard per chapter)
- ✅ Debounced auto-save (1.2s after last change)
- ✅ Cross-device sync via Firestore onSnapshot listener

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool (fast HMR) |
| **Firebase Auth 10** | Email/password authentication |
| **Firestore** | Real-time progress database |
| **Pure CSS-in-JS** | Zero external CSS libraries |

---

## 🚢 Deploy Free

```bash
npm run build      # creates /dist folder
# → drag /dist to netlify.com/drop
# → or deploy to Vercel, GitHub Pages, Firebase Hosting
```

---

## 📚 Vedic Sources Referenced

| Text | Used For |
|------|---------|
| Ṛgveda (1.1.1, 1.164.45, 10.71.3) | Grammar examples in Vedic context |
| Taittirīya Upaniṣad 1.2.1 (Śīkṣāvallī) | Phonetics foundation |
| Chāndogya Upaniṣad (2.23.4, 4.10.4) | Sound philosophy / 'अ' as Brahman |
| Kaṭha Upaniṣad | OM / the primal syllable |
| Pāṇinīya Śikṣā | Sthāna (place of articulation) rules |
| Taittirīya Prātiśākhya | Āyogavāha treatment |
| Ṛgveda Prātiśākhya | Duration system (mātrā) |
| Mahābhāṣya — Patañjali | Lopa philosophy, grammar's purpose |
| Aṣṭādhyāyī sūtras | Direct sūtra references throughout |

---

*ॐ पाणिनये नमः — May Pāṇini illuminate our path*
