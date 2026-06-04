# 🕉️ Aṣṭādhyāyī Sahajabodha
### Interactive Sanskrit Grammar Learning Platform

> Based on Pushpa Dikshit's lecture series | Pauspi Prakriyā Method  
> 📺 Source: https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs

---

## 🚀 Quick Start (VS Code)

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **VS Code** → https://code.visualstudio.com

### Steps

```bash
# 1. Open this folder in VS Code terminal (Ctrl+` to open terminal)

# 2. Install dependencies
npm install

# 3. Start the dev server (opens browser automatically)
npm run dev
```

The app opens at **http://localhost:3000**

---

## 📁 Project Structure

```
ashtadhyayi-sahajabodha/
├── public/
│   └── favicon.svg          # 🕉️ Om icon
├── src/
│   ├── main.jsx             # React entry point
│   └── App.jsx              # 🏛️ Full platform (1344 lines)
├── index.html               # HTML shell
├── package.json             # Dependencies
├── vite.config.js           # Vite config
└── README.md                # This file
```

---

## 🎓 Platform Features

### 12 Chapters covering:
| # | Section | Topics |
|---|---------|--------|
| 1 | §1-2 | Dhātu & Pratipadika |
| 2 | §3-8 | Varṇamātrikā — The Alphabet |
| 3 | §12-18 | Āyogavāha & Anupūrvī |
| 4 | §19-21 | Māheśvara Sūtras & Pratyāhāras |
| 5 | §22-23 | Sthāna & Karaṇa |
| 6 | §24 | Prayatna — Articulation Effort |
| 7 | §25-33 | Savarṇa & 18 Vowel Forms |
| 8 | §34-39 | Guṇa · Vṛddhi · Tapara · Laghu-Guru |
| 9 | §40-58 | Morphological Saṃjñās |
| 10 | §56-71 | Upasarga & Saṃhitā |
| 11 | §72-85 | Lopa · Luk-Ślu-Lup · Bahulam |
| 12 | §86-96 | Architecture of Aṣṭādhyāyī |

### Each chapter has 6 tabs:
- 📚 **Concepts** — All terms with sūtra references
- 🃏 **Flashcards** — Flip cards (tap to reveal)
- ❓ **Quiz** — 4 standard questions
- 📋 **Test** — 3 levelled tests (Easy/Medium/Hard, 5 Qs each)
- 📜 **Vedic** — Ṛgveda, Upaniṣad & śāstra verses with grammar connections
- 📺 **Watch** — Link to source YouTube lectures

### 6 Navigation Screens:
- 🏠 Home — Dashboard & quick access
- 📚 Chapters — All 12 modules
- 🔊 Pronunciation Studio — IPA, IAST, articulation guide
- 🗺️ Mind Maps — Visual concept clusters
- 📈 Progress — XP, streaks, per-chapter stats
- 📖 Glossary — Searchable dictionary of all terms

---

## 🏗️ Build for Production

```bash
npm run build
# Output goes to /dist folder
# Deploy to Netlify, Vercel, GitHub Pages etc.
```

---

## 📚 Source References

| Text | Usage |
|------|-------|
| Pāṇini's Aṣṭādhyāyī | Primary sūtras referenced throughout |
| Patañjali's Mahābhāṣya | Meta-commentary & philosophical notes |
| Pāṇinīya Śikṣā | Articulation / Sthāna rules |
| Taittirīya Upaniṣad (Śīkṣāvallī) | Phonetics foundation |
| Ṛgveda Prātiśākhya | Duration & accent system |
| Taittirīya Prātiśākhya | Āyogavāha treatment |
| Ṛgveda (1.1.1, 1.164.45, 10.71.3) | Vedic grammar examples |
| Chāndogya Upaniṣad | Sound philosophy |

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool (fast HMR)
- **Pure CSS-in-JS** — No external CSS libraries needed
- **Zero external dependencies** beyond React

---

*ॐ पाणिनये नमः — Ohm Pannini namah*
