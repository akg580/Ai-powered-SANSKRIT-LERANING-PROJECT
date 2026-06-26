// src/App.jsx — Devavāṇī v4.0
// Light/Beige default · Dark toggle · Gen-Z interactive · Clear sections
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth }     from "./contexts/AuthContext.jsx";
import { useProgress } from "./contexts/ProgressContext.jsx";
import AuthScreen      from "./components/AuthScreen.jsx";
import LoadingScreen   from "./components/LoadingScreen.jsx";
import UserAvatar      from "./components/UserAvatar.jsx";
import "./styles.css";

/* ── THEME HOOK ─────────────────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("dv-theme") || "light"; } catch { return "light"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("dv-theme", theme); } catch {}
  }, [theme]);
  const toggle = useCallback((t) => setTheme(t), []);
  return { theme, toggle };
}

/* ── CATEGORY COLORS ────────────────────────────────────────────────── */
const CC = {
  grammar:"#0D9488",phonetics:"#2563EB",varga:"#D97706",special:"#7C3AED",
  core:"#D6410A",sutra:"#C8860A",pratyahara:"#0D9488",articulation:"#B45309",
  sthana:"#B45309",effort:"#64748B",duration:"#0D9488",tone:"#7C3AED",
  nasality:"#DB2777",samjna:"#C8860A",meter:"#3A8050",position:"#2563EB",
  operation:"#D6410A",agama:"#0D9488",upasarga:"#D97706",morphology:"#7C3AED",
  process:"#2563EB",architecture:"#64748B",vedic:"#7C3AED",philosophy:"#64748B",
  history:"#BE123C",rule:"#65A30D",precision:"#D6410A",shorthand:"#0D9488",
  theory:"#64748B",method:"#0D9488",classification:"#D97706",conflict:"#D6410A",
  sutratype:"#C8860A",optionality:"#0D9488",
};

/* ── CHAPTERS DATA ──────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    id:1,num:"I",title:"Saṃjñā Prakaraṇa",
    subtitle:"Technical Names, Markers & Operating Labels",
    icon:"🏷️",color:"#0D9488",
    concepts:[
      {term:"संज्ञा (Saṃjñā)",meaning:"A technical name assigned by Pāṇini so later rules can operate with precision and economy. Every major label in the grammar is first introduced as a Saṃjñā.",example:"वृद्धि · गुण · संयोग · इत् · लोप — all labels used again and again",cat:"samjna",sutra:""},
      {term:"वृद्धि संज्ञा",meaning:"वृद्धिरादैच्: ā, ai, au receive the technical name Vṛddhi. It marks the strongest vowel grade — used in causative, possessive, and patronymic formations.",example:"आ · ऐ · औ  →  named Vṛddhi",cat:"samjna",sutra:"1.1.1"},
      {term:"गुण संज्ञा",meaning:"अदेङ् गुणः: a, e, o receive the name Guṇa. It marks the middle vowel grade — used in present tense strong-grade forms.",example:"अ · ए · ओ  →  named Guṇa",cat:"samjna",sutra:"1.1.2"},
      {term:"इक् and Guṇa/Vṛddhi",meaning:"इको गुणवृद्धी: i, u, ṛ, ḷ are the vowels that take Guṇa and Vṛddhi substitutes in sandhi and morphological operations.",example:"इ→ए/ऐ · उ→ओ/औ · ऋ→अर्/आर्",cat:"sutra",sutra:"1.1.3"},
      {term:"सवर्ण (Savarṇa)",meaning:"तुल्यास्यप्रयत्नं सवर्णम्: sounds with the same place (sthāna) and internal effort (abhyantara prayatna) are called homogeneous.",example:"अ and आ are savarṇa · इ and ई are savarṇa",cat:"phonetics",sutra:"1.1.9"},
      {term:"संयोग (Saṃyoga)",meaning:"हलोनन्तराः संयोगः: two or more consecutive consonants with no vowel between form a conjunct consonant cluster.",example:"भक्त → क्+त cluster · पुष्प → ष्+प cluster",cat:"phonetics",sutra:"1.1.7"},
      {term:"इत् संज्ञा",meaning:"Markers attached to roots or suffixes that guide grammatical operations and then disappear. Defined by 1.3.2–9, deleted by 1.3.9.",example:"णिच् → ण् and च् are It-markers · they guide causative formation",cat:"core",sutra:"1.3.2-9"},
      {term:"लोप (Lopa)",meaning:"अदर्शनं लोपः: disappearance from pronunciation without loss of grammatical force.",example:"It-markers disappear after doing their work",cat:"operation",sutra:"1.1.60"},
      {term:"प्रत्याहार",meaning:"आदिरन्त्येन सहेता: a compact sound-group formed from a starting sound plus a final It-marker from the Māheśvara Sūtras.",example:"अच् = all 9 vowels · हल् = all 33 consonants · इक् = इ उ ऋ ऌ",cat:"pratyahara",sutra:"1.1.71"},
      {term:"अधिकार and अनुवृत्ति",meaning:"A header rule (adhikāra) and its carried-forward words (anuvṛtti) supply implicit context to all following rules, eliminating repetition.",example:"One key word continues silently across multiple sūtras",cat:"architecture",sutra:"method"},
    ],
    quiz:[
      {q:"Which sounds are called Vṛddhi by sūtra 1.1.1?",opts:["अ ए ओ","आ ऐ औ","इ उ ऋ","य र ल व"],ans:1,exp:"वृद्धिरादैच् gives Vṛddhi-saṃjñā to ā (आ), ai (ऐ), au (औ)."},
      {q:"Which sounds are called Guṇa by sūtra 1.1.2?",opts:["अ ए ओ","आ ऐ औ","इ उ ऋ","क ख ग"],ans:0,exp:"अदेङ् गुणः names a (अ), e (ए), o (ओ) as Guṇa."},
      {q:"What is the PRIMARY purpose of a Saṃjñā?",opts:["Adds decorative labels","Names a class so later rules can reference it precisely","Cancels earlier rules","Provides pronunciation guides"],ans:1,exp:"A Saṃjñā is a technical label. Once defined, ALL later rules can refer to the class by name."},
      {q:"अदर्शनं लोपः (1.1.60) means:",opts:["Sound becomes long","Phonetic disappearance only","Item disappears from pronunciation; grammatical force may remain","A vowel becomes Guṇa"],ans:2,exp:"Lopa = non-appearance. Phonetic form absent, grammatical conditioning persists."},
    ],
    vedic:[
      {
        dev:"अथ शब्दानुशासनम् ।",
        roman:"atha śabdānuśāsanam",
        trans:"Now begins the discipline of words.",
        source:"Mahābhāṣya — Patañjali, opening verse",
        rel:"The entire grammar begins with a Saṃjñā (technical label) — not a rule, not a conjugation. Pāṇini's first act is to NAME his vocabulary. This is the architectural insight of Chapter 1: define your terms before operating with them."
      },
      {
        dev:"वृद्धिरादैच् ।",
        roman:"vṛddhir ādaic",
        trans:"Ā, ai, au are called Vṛddhi.",
        source:"Aṣṭādhyāyī 1.1.1 — The FIRST sūtra of 4000",
        rel:"The very first sūtra of the Aṣṭādhyāyī is a Saṃjñā-sūtra — a naming rule, not an operation. By calling ā/ai/au 'Vṛddhi,' Pāṇini creates a reusable label that appears in hundreds of later rules without re-listing these sounds each time. This IS economy of grammar."
      },
      {
        dev:"अदेङ् गुणः ।",
        roman:"adeṅ guṇaḥ",
        trans:"A, e, o are called Guṇa.",
        source:"Aṣṭādhyāyī 1.1.2",
        rel:"The second sūtra is also a Saṃjñā. Together, sūtras 1.1.1 and 1.1.2 define the entire vowel-strengthening system in 8 syllables. Every Guṇa sandhi (देव+इन्द्रः=देवेन्द्रः) and Vṛddhi operation (causatives, patronymics) in the grammar depends on these two names defined here in Ch.1."
      },
      {
        dev:"तत्र तत्र नियन्त्रितानां शब्दानां संज्ञा कर्तव्या ।",
        roman:"tatra tatra niyantritānāṃ śabdānāṃ saṃjñā kartavyā",
        trans:"Wherever terms are regulated, a technical name (Saṃjñā) must be given.",
        source:"Vyākaraṇa Mahābhāṣya — Patañjali's commentary principle",
        rel:"Patañjali articulates why Saṃjñā is the foundational chapter: without naming a class precisely, no rule can operate precisely. This principle is what makes the Aṣṭādhyāyī a generative system rather than a mere word-list. Ch.1 Saṃjñā enables Ch.2 Sandhi, Ch.3 Pratyaya, and every subsequent operation."
      },
      {
        dev:"हलोऽनन्तराः संयोगः ।",
        roman:"halo'nantarāḥ saṃyogaḥ",
        trans:"Consecutive consonants (with no vowel between) are called Saṃyoga (cluster).",
        source:"Aṣṭādhyāyī 1.1.7",
        rel:"Saṃyoga is itself a Saṃjñā — a technical label for consonant clusters. This label is then used in the Guru-Laghu meter rule (1.4.11: saṃyoge guru) to determine syllable weight in Vedic metre. One Saṃjñā from Ch.1 powers both phonetics (Ch.4 Sthāna) and poetics (Laghu-Guru meter in Ch.6)."
      },
      {
        dev:"तुल्यास्यप्रयत्नं सवर्णम् ।",
        roman:"tulyāsyaprayatnaṃ savarṇam",
        trans:"Sounds with the same place and same internal effort are called Savarṇa (homogeneous).",
        source:"Aṣṭādhyāyī 1.1.9",
        rel:"Savarṇa-Saṃjñā is defined here in Ch.1, but it does its work in Ch.2: अकः सवर्णे दीर्घः (6.1.101) — 'an ak-vowel becomes long before its Savarṇa.' Without the Ch.1 definition, the Ch.2 sandhi rule is meaningless. This cross-chapter dependency demonstrates why Pāṇini structured his grammar with definitions first."
      },
      {
        dev:"अदर्शनं लोपः ।",
        roman:"adarśanaṃ lopaḥ",
        trans:"Non-appearance is called Lopa.",
        source:"Aṣṭādhyāyī 1.1.60",
        rel:"Lopa-Saṃjñā (non-appearance) is defined here in Ch.1 and used everywhere: It-markers disappear by Lopa (1.3.9), Vikaraṇa suffixes disappear by Luk-Lopa in Ananta class roots (Ch.3 Pratyaya), and sandhi-deleted sounds in Ch.2 also invoke this name. One definition, infinite application — the power of Saṃjñā."
      },
    ],
    levels:{
      easy:[
        {q:"Saṃjñā means:",opts:["Technical name / label","Past tense form","A compound word","A Vedic metre"],ans:0,exp:"Saṃjñā = technical label used by later rules."},
        {q:"Vṛddhi sounds (1.1.1) are:",opts:["आ ऐ औ","अ ए ओ","इ उ ऋ","क ख ग"],ans:0,exp:"1.1.1 vṛddhirādaic names आ, ऐ, औ."},
        {q:"Guṇa sounds (1.1.2) are:",opts:["आ ऐ औ","अ ए ओ","य र ल व","श ष स"],ans:1,exp:"1.1.2 adeṅ guṇaḥ names अ, ए, ओ."},
        {q:"It-markers are eventually:",opts:["Pronounced loudly","Removed by lopa","Changed to nouns","Kept as long vowels"],ans:1,exp:"It-markers guide grammar then disappear by lopa (1.3.9)."},
      ],
      medium:[
        {q:"इको गुणवृद्धी (1.1.3) applies to:",opts:["इ उ ऋ ऌ","अ आ ए","य र ल व","क च ट त"],ans:0,exp:"इक् = इ, उ, ऋ, ऌ. These receive Guṇa/Vṛddhi substitutes."},
        {q:"Savarṇa (1.1.9) is defined by:",opts:["Same place AND same internal effort","Same meaning","Same gender","Same chapter"],ans:0,exp:"तुल्यास्यप्रयत्नं — same sthāna + same abhyantara prayatna = savarṇa."},
      ],
      hard:[
        {q:"The key innovation of Saṃjñā over listing is:",opts:["Pronunciation guide","Classes referenced by compact label — avoids enumerating every member in every rule","Color-coding sounds","Word-order specification"],ans:1,exp:"Without Saṃjñā, every rule would list every sound individually. With it, 'इक्' covers 4 in one syllable."},
        {q:"Lopa's key technical insight (1.1.60):",opts:["Sound deleted forever","Phonetic absence ≠ grammatical absence — form disappears but conditioning effect persists","Only applies to Vedic","Creates new forms"],ans:1,exp:"This enables Pāṇini to model alternations where a morpheme 'disappears' yet still triggers sandhi or accent."},
      ],
    },
  },
  {
    id:2,num:"II",title:"Sandhi Prakaraṇa",
    subtitle:"Sound Junction Rules · Vowel · Consonant · Visarga",
    icon:"🔗",color:"#2563EB",
    concepts:[
      {term:"संहिता (Saṃhitā)",meaning:"Close phonetic contact — the prerequisite environment for ALL sandhi operations.",example:"संहितायाम् — Aṣṭādhyāyī 6.1.72 — the doorway into sandhi",cat:"core",sutra:"6.1.72"},
      {term:"सवर्णदीर्घः — Vowel Coalescence",meaning:"अकः सवर्णे दीर्घः: when a vowel meets its savarṇa family member, both merge into ONE long vowel.",example:"रामः + अर्थम् → रामार्थम् (a+a→ā)",cat:"sutra",sutra:"6.1.101"},
      {term:"यण् संधि — Semivowel Sandhi",meaning:"इको यणचि: ik-vowels (i,u,ṛ,ḷ) become corresponding semivowels (y,v,r,l) before any vowel.",example:"इ→य् · उ→व् · ऋ→र् · ऌ→ल् (before vowels)",cat:"phonetics",sutra:"6.1.77"},
      {term:"गुण संधि",meaning:"When अ/आ precedes इ/ई → ए; before उ/ऊ → ओ; before ऋ → अर्.",example:"देव + इन्द्रः → देवेन्द्रः (a+i→e)",cat:"grammar",sutra:"6.1.87"},
      {term:"वृद्धि संधि",meaning:"When अ/आ precedes ए/ऐ → ऐ; before ओ/औ → औ. The strong-grade diphthong rule.",example:"एक + एक → एकैक (a+e→ai)",cat:"grammar",sutra:"6.1.88"},
      {term:"परसवर्ण — Place Assimilation",meaning:"A final stop consonant assimilates to the class of the following consonant.",example:"तत् + च → तच्च (dental t → palatal c before c)",cat:"phonetics",sutra:"8.4.58"},
      {term:"विसर्ग संधि",meaning:"Visarga (ः) undergoes different transformations before vowels, voiced sounds, and sibilants.",example:"रामः + अगच्छत् → रामो ऽगच्छत्",cat:"phonetics",sutra:"8.3.15"},
      {term:"प्रकृतिभाव — No-Sandhi Zones",meaning:"Certain environments explicitly BLOCK sandhi — original form preserved for grammatical transparency.",example:"Dual endings, some Vedic forms, specific particle junctions",cat:"rule",sutra:""},
    ],
    quiz:[
      {q:"अ + अ produces which result by sandhi?",opts:["अ stays short","आ (long merger)","ए (guṇa)","ओ (guṇa)"],ans:1,exp:"सवर्णदीर्घ (6.1.101): same-family vowels merge into one long vowel."},
      {q:"इ before a vowel becomes:",opts:["य्","व्","र्","ल्"],ans:0,exp:"यण् sandhi (6.1.77): इ/ई → य् semivowel before any vowel."},
      {q:"देव + इन्द्रः → देवेन्द्रः. What sandhi?",opts:["Vṛddhi sandhi","Guṇa sandhi (a+i→e)","Yaṇ sandhi","Visarga sandhi"],ans:1,exp:"अ/आ + इ/ई → ए by Guṇa sandhi."},
      {q:"Saṃhitā (6.1.72) is:",opts:["A type of vowel","The prerequisite contact-condition for all sandhi","A consonant cluster","The name for long vowels"],ans:1,exp:"Saṃhitā = close phonetic contact. ALL sandhi rules presuppose this condition."},
    ],
    vedic:[
      {
        dev:"विश्वामित्रस्य रक्षति ब्रह्मेदं भारतं जनम् ।",
        roman:"viśvāmitrasya rakṣati brahmedaṃ bhārataṃ janam",
        trans:"This sacred knowledge of Viśvāmitra protects the people of Bhārata.",
        source:"Ṛgveda 3.53.12",
        rel:"ब्रह्म+इदम् → ब्रह्मेदम् is Guṇa sandhi (Ch.2): a + i → e (6.1.87). But the word 'ब्रह्म' itself is a Pratipadika whose Savarṇa-membership (Ch.1: 1.1.9) determines which sandhi rule applies. Ch.1 Savarṇa + Ch.2 Guṇa sandhi operating together in one word."
      },
      {
        dev:"तमेव शरणं गच्छ सर्वभावेन भारत ।",
        roman:"tam eva śaraṇaṃ gaccha sarvabhāvena bhārata",
        trans:"Take refuge in Him alone with all your being, O Bhārata.",
        source:"Bhagavad Gītā 18.62",
        rel:"तम्+एव: Visarga of 'तम्' disappears before 'एव' — Visarga Sandhi (Ch.2, 8.3.15). शरणम्+गच्छ: Anusvāra (Ch.2) before 'ग्'. सर्व+भावेन: a+ā→ā Sāvarṇadīrgha (6.1.101, Ch.2). Three distinct sandhi rules from Ch.2 in one verse, all enabled by Ch.1's definition of Savarṇa and Saṃhitā."
      },
      {
        dev:"योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।",
        roman:"yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
        trans:"Established in yoga, perform your actions, abandoning attachment, O Dhanañjaya.",
        source:"Bhagavad Gītā 2.48",
        rel:"धनञ्जय: this name itself is a sandhi form — धनम्+जय → धनञ्जय. The anusvāra (ṃ) of 'dhanam' assimilates to the palatal class before 'j' (Parasavarṇa, Ch.2: 8.4.58). त्यक्त्वा: √त्यज्+क्त्वा — Kṛt pratyaya (Ch.3) applied to root, with ज्+क् cluster (Saṃyoga from Ch.1 Saṃjñā) triggering specific changes."
      },
      {
        dev:"इन्द्र इद्धर्योः सचा संमिश्ल आ वचोयुजा ।",
        roman:"indra iddharayoḥ sacā saṃmiśla ā vacoyujā",
        trans:"Indra indeed, with his two bays, accompanied with speech-yoked praises.",
        source:"Ṛgveda 1.7.2",
        rel:"इन्द्रः+इत् → इन्द्र+इत् → इन्द्रेत् (Guṇa sandhi a+i→e, Ch.2). Then इन्द्र+इद् → इन्द्रिद् with Visarga absorbed. संमिश्ल: Parasavarṇa assimilation — anusvāra before 'म' takes labial nasal (Ch.2: 8.4.58). This Ṛgvedic verse is a Vedic sandhi laboratory, demonstrating multiple Ch.2 rules applied continuously in oral tradition."
      },
      {
        dev:"उपैति सर्वं जगत् ।",
        roman:"upaiti sarvaṃ jagat",
        trans:"The entire universe comes to [Him].",
        source:"Bhagavad Gītā 11.21 (partial)",
        rel:"उप+एति: उपसर्ग (prefix) + √इ root. The sandhi here is Vṛddhi: a+e→ai (6.1.88, Ch.2) would give 'उपैति.' But wait — this is also Ch.3 Pratyaya: √इ + लट् + ति. Sandhi (Ch.2) AND suffix application (Ch.3) operate on the same word simultaneously. सर्वम्+जगत्: Anusvāra before 'ज्' — visarga sandhi (Ch.2). Cumulative grammar visible at every junction."
      },
      {
        dev:"नमस्ते सते सर्वलोकाश्रयाय ।",
        roman:"namaste sate sarvalokāśrayāya",
        trans:"Salutation to You, the Existent, the refuge of all worlds.",
        source:"Viṣṇu Sahasranāma — closing verse",
        rel:"सर्व+लोक+आश्रयाय: three-way sandhi chain — (1) a+a→ā (Sāvarṇadīrgha 6.1.101), then (2) the compound itself uses Samāsa. नमस्+ते: Visarga of 'नमः' before 'त' (dental) → becomes 's' (Visarga sandhi 8.3.15, Ch.2). This chain of sandhi demonstrates why Ch.1 Savarṇa must be defined BEFORE Ch.2 sandhi can operate."
      },
      {
        dev:"अकः सवर्णे दीर्घः ।",
        roman:"akaḥ savarṇe dīrghaḥ",
        trans:"An ak-vowel before its Savarṇa becomes long.",
        source:"Aṣṭādhyāyī 6.1.101 — core vowel sandhi rule",
        rel:"This single sūtra contains three Saṃjñās from Ch.1: (1) 'अक्' = Pratyāhāra from Māheśvara Sūtras (Ch.4), (2) 'सवर्ण' = defined at 1.1.9 (Ch.1), (3) 'दीर्घ' = defined at 1.2.27 (Ch.6). Ch.2 sandhi is literally impossible to state without Ch.1 definitions. This is the cumulative architecture of the Aṣṭādhyāyī in one sūtra."
      },
    ],
    levels:{
      easy:[
        {q:"Sandhi means:",opts:["Sound joining / junction","Root listing","A case ending","A translation"],ans:0,exp:"Sandhi = rule-governed sound junction at word or morpheme boundaries."},
        {q:"अ + अ by savarṇadīrgha =",opts:["आ","ऐ","ओ","य"],ans:0,exp:"Same-family vowels merge: a+a → ā."},
      ],
      medium:[
        {q:"Guṇa sandhi: अ/आ + इ/ई →",opts:["ए","ऐ","ओ","औ"],ans:0,exp:"अ/आ + इ/ई → ए — Guṇa (middle-grade) merger."},
        {q:"Vṛddhi sandhi: अ/आ + ए/ऐ →",opts:["ए","ऐ","ओ","आ"],ans:1,exp:"अ/आ + ए/ऐ → ऐ — Vṛddhi (strong-grade) merger."},
      ],
      hard:[
        {q:"Why does Pāṇini define Savarṇa in Ch.1 BEFORE treating sandhi?",opts:["Coincidence","Ch.1's Savarṇa is USED by savarṇadīrgha in Ch.6 — definitions precede their applications","Alphabetical","Tradition"],ans:1,exp:"The Aṣṭādhyāyī is architecturally sequenced: Saṃjñā (Ch.1) → Sandhi (Ch.6). Definitions must precede use."},
      ],
    },
  },
  {
    id:3,num:"III",title:"Pratyaya Prakaraṇa",
    subtitle:"Suffixation Science · 4 Suffix Types · 6-Step Word Formation · It-Saṃjñā",
    icon:"🔩",color:"#7C3AED",
    concepts:[
      {term:"प्रत्यय (Pratyaya) — The Suffix",meaning:"Pratyaya literally means 'that which follows' (परश्च — 3.1.1). Every suffix in Pāṇini's system is a Pratyaya — a coded element appended to a root (Dhātu) or stem (Pratipadika) to generate meaning. The Third Chapter of the Aṣṭādhyāyī is exclusively reserved for Pratyayas applied to Dhātus (verb roots). No other chapter handles this — it is the mandatory starting point for all verbal word formation.",example:"√पठ् + लट् → पठति (he reads) · √भू + क्त → भूत (been/past) · √गम् + ण्वुल् → गामक (one who goes)",cat:"core",sutra:"3.1.1"},
      {term:"4 प्रत्यय के प्रकार — Four Types of Suffixes",meaning:"Chapter 3 organises all suffixes into four distinct departments, each with a separate function in the derivation pipeline: ①Sanādi Pratyaya — create new secondary roots (Sanadyanta Dhātus). ②Vikaraṇa Pratyaya — process helpers, inserted between root and final suffix. ③Kṛt Pratyaya — applied to roots to create nominal stems (Pratipadikas). ④Tiṅ Pratyaya — the 18 personal endings that create complete verb forms (Tinanta). Understanding this four-fold architecture is the master key to Paninian morphology.",example:"①San→pipathiṣati ②Śap(vikaraṇa)→bhava+ti ③Ṇvul→kāraka ④Ti→gacchati",cat:"process",sutra:"3.1-3.4"},
      {term:"सनादि प्रत्यय (Sanādi Pratyaya) — Root-Creating Suffixes",meaning:"The 12 Sanādi suffixes (San, Kam, Kyac, Ṇic, Yan, Kyaṅ, Ṅich, Kvin, Kvip, Cvi, Ḍu, Āṇ) are applied to existing Upadesha Dhātus or Pratipadikas (nominal stems) to create brand-new roots called Sanadyanta Dhātus. These receive Dhātu-saṃjñā (root status) by sūtra 3.1.32 (Sanadyanta Dhatavah), allowing them to undergo full conjugation. This mechanism makes Sanskrit's vocabulary theoretically infinite.",example:"√पठ् + सन् = पिपठिषति (desires to read) · √कृ + णिच् = कारयति (causes to do) · √पुत्र(noun) + क्यच् = पुत्रीयति (wishes for a son)",cat:"process",sutra:"3.1.5-32"},
      {term:"विकरण प्रत्यय (Vikaraṇa Pratyaya) — Process Helpers",meaning:"Vikaraṇas are grammatical bridges — Prakriti-Pratyaya-madhya-patitam (they sit between the root and final suffix). They create the Aṅga (verbal stem) and determine whether the root belongs to the Ajanta class (a-ending stem: √bhū+Śap→bhava) or the Ananta class (consonant-ending stem: Vikaraṇa dropped by Luk). Without the Vikaraṇa, the final word cannot be correctly formed.",example:"√भू + शप् + ति = भव+ति = भवति · √अद् + शप् dropped(Luk) → अत्ति (eats) · √रुध् + श्नम् → रुणद्धि",cat:"process",sutra:"3.1.68-86"},
      {term:"कृत् प्रत्यय (Kṛt Pratyaya) — Noun-from-Root Suffixes",meaning:"Kṛt suffixes are applied directly to verbal roots under the Dhātu adhikāra (3.1.91), converting roots into Pratipadika (nominal base) forms. The resulting Pratipadika is not yet a fully usable word — it must receive Su-vibhakti (nominal case endings) to become a Subanta (fully declined word). Kṛt forms include agent nouns, action nouns, past participles, infinitives, and gerunds.",example:"√पठ् + ण्वुल् = पाठक (reader) · √कृ + क्त = कृत (done) · √गम् + तुमुन् = गन्तुम् (to go) · √दृश् + क्तवतु = दृष्टवत् (who has seen)",cat:"morphology",sutra:"3.1.91-3.3"},
      {term:"तिङ् प्रत्यय (Tiṅ Pratyaya) — Verbal Personal Endings",meaning:"The 18 Tiṅ suffixes (9 Parasmaipada: Tip,Tas,Jhi,Sip,Thas,Tha,Mip,Vas,Mas + 9 Ātmanepada: Te,Ātām,Jha,Thās,Āthām,Dhvam,Iṭ,Vahi,Mahiṅ) are the final endings that transform a root into a complete, grammatically functional verb (Tinanta). Crucially, Tiṅ endings are NOT applied directly to the root. First, one of the 10 Lakāras is applied; then the Lakāra is REPLACED by the Tiṅ suffix via the rule Lasyah (5.47).",example:"√गम् + लट् → गम्+शप्+ति → गच्छति · √भू + लोट् + तु = भवतु (let it be) · √पठ् + लङ् → अपठत्",cat:"morphology",sutra:"3.4.77-112"},
      {term:"10 लकार — Ten Tense-Mood Markers",meaning:"Pāṇini encodes tense and mood through 10 abstract markers starting with ल (La). They divide into Sārvadhatuka (4: Lat·Lot·Lang·Vidhiling — trigger Guṇa) and Ārdhadhatuka (6: Lit·Lut·Lun·Rin·Āshirling·Lṛt — trigger Vṛddhi or different processes). The लेट् (Let) Lakāra is uniquely Vedic — it operates under the 'Bahulam' principle (irregular application: sometimes present, sometimes absent).",example:"लट्=पठति · लिट्=पपाठ · लुट्=पठिता · लृट्=पठिष्यति · लेट्=Vedic only · लोट्=पठतु · लङ्=अपठत् · लिङ्=पठेत् · लुङ्=अपाठीत् · लृङ्=अपठिष्यत्",cat:"process",sutra:"3.2.123-3.4"},
      {term:"सार्वधातुक और आर्धधातुक (Sārvadhatuka & Ārdhadhatuka)",meaning:"This critical classification determines which phonological operations apply to the root BEFORE the suffix is processed. Sārvadhatuka ('for all roots') suffixes — identified by Śit marker or Tiṅ suffixes of Lat·Lot·Lang·Vidhiling — trigger Guṇa (mid-grade vowel) operations. Ārdhadhatuka ('for half the root-set') suffixes — all others including Lit·Lut·Lun — trigger Vṛddhi or different phonological operations.",example:"पठ+ति: ति=Sārvadhatuka → Guṇa applies → पठति · पपाठ: Lit=Ārdhadhatuka → Vṛddhi → pa+pāṭh+a · करोति: Sārvadhatuka triggers u→o(Guṇa)",cat:"classification",sutra:"3.4.113-116"},
      {term:"धातु-अधिकार (Dhātu Adhikāra 3.1.91 'धातोः')",meaning:"Pāṇini establishes a single overarching header at 3.1.91 — 'dhātoḥ' (from/to a root) — which by Anuvṛtti (carry-forward principle) silently extends its authority over ALL subsequent sūtras in Chapter 3. This means every suffix rule automatically applies 'in the context of a root' without repetition. This is Pāṇini's Laghavam (minimal rule length) principle at its most powerful — one word governs hundreds of rules.",example:"3.1.91 dhātoḥ → All Kṛt sūtras (3.1.92 onwards) carry 'dhātoḥ' implicitly · Every Tiṅ sūtra in 3.4 also inherits this authority",cat:"architecture",sutra:"3.1.91"},
      {term:"6-Step Word Formation (Dhātu-Prakriyā)",meaning:"Pushpa Dikshit's Pauspi Process articulates 6 mandatory steps for generating any Sanskrit verbal form: ①Dhātu-saṃgyā — identify/designate the base as a root. ②It-saṃgyā — identify and remove the anubandha (It-marker) sounds. ③Satyādi internal operations — apply 4 inner-layer changes (Sattva: retroflex-ṣ→dental-s; Natva: retroflex-ṇ→dental-n; Numagama: nasal insertion for Idit roots; Upadha-dīrgha: penultimate vowel lengthening). ④Suffix Addition — apply one of the 10 Lakāras. ⑤Replacement — replace Lakāra with correct Tiṅ suffix via 'Lasyah.' ⑥Classification — classify Tiṅ as Sārvadhatuka vs Ārdhadhatuka to determine further phonological operations.",example:"√गम्: ①dhātu ②m̐ deleted ③natva→gam ④+lṛṭ ⑤→iṣyati suffix ⑥ārdhadhatuka → gamiṣyati (will go)",cat:"process",sutra:"3.1-3.4"},
      {term:"इत्-संज्ञा (It-Saṃjñā) — Anubandha Technical Markers",meaning:"Anubandhas are silent technical markers embedded in roots and suffixes of the Dhātupāṭha. Key rules: 1.3.2 (Upadeśe'janunāsika it) — nasalised vowels in upadesha = It. 1.3.3 (Halantam) — final consonants = It. 1.3.9 (Tasya lopaḥ) — these are then deleted. BUT crucially: even after deletion, the root RETAINS its classification from the deleted marker. Roots with short-i marker = Idit. Roots with u-marker = Udit. Ṅit roots = Ātmanepada. This 'memory' of deleted markers drives ALL subsequent grammatical decisions.",example:"√वद्: final 'द्' deleted but root remembered as ḍit · √धुञ्: nasalized ñ deleted, root remembered as Ṅit → Ātmanepada · √कृ: ṛ anubandha → Udit → specific substitutions",cat:"samjna",sutra:"1.3.2-9"},
      {term:"पद-निर्णय (Pada-Nirṇaya) — Voice Determination",meaning:"After the 6-step process, the grammar determines Parasmaipada (active, 9 endings) vs Ātmanepada (middle, 9 endings) based on 4 Anubandha criteria: ①Anudātta-Ḍit roots → Ātmanepada. ②Svarita-Jit roots → Ubhayapada (both voices possible). ③Residual rule: roots without these markers → Parasmaipada by default. Upasargas (prefixes) and the phala (who benefits from the action) can also override the default voice.",example:"√याच्: Ḍit → याचते (Ātmane) · √वृ: Jit → वृणोति/वृणुते (Ubhayapada) · √पठ्: no marker → पठति (Parasmaipada)",cat:"process",sutra:"1.3.12-78"},
      {term:"अजन्त और अनन्त वर्ग (Ajanta & Ananta Root Classes)",meaning:"The 1930 primary roots divide into: ①Ajanta Class (1700 roots, 4 Gaṇas: Bhvadi·Divadi·Tudadi·Churadi) — Vikaraṇa creates an 'a'-ending stem (Ajanta = 'a-ending'): uniform, easy to apply. ②Ananta/Anajanta Class (230 roots, 6 Gaṇas: Adadi·Svadi·Rudhadi·Tanadi·Kryadi·Tanadi-Yant) — Vikaraṇa is deleted (Luk), leaving a consonant-ending stem with different grammatical rules including special substitutions in Ātmanepada.",example:"√भू(Bhvadi)+शप्=भव(a-ending)→भवति · √अद्(Adadi):Śap→Luk→अत्ति · √रुध्(Rudhadi)+श्नम्→रुणद्धि",cat:"classification",sutra:"3.1.68-77"},
    ],
    quiz:[
      {q:"The Third Chapter of Aṣṭādhyāyī is exclusively reserved for:",opts:["Nominal case endings (Subanta)","Suffixes applied to verbal roots (Dhātu-Pratyaya)","Compound words (Samāsa)","Vedic accent rules"],ans:1,exp:"Chapter 3 is the mandatory starting point for all root-based suffixation (Dhātu-pratyaya). No other chapter handles this (3.1 to 3.4). — Pushpa Dikshit."},
      {q:"Which Pratyaya type are 'process helpers' inserted between root and final suffix?",opts:["Kṛt Pratyaya","Sanādi Pratyaya","Vikaraṇa Pratyaya","Tiṅ Pratyaya"],ans:2,exp:"Vikaraṇas are Prakriti-Pratyaya-madhya-patitam — they sit between the root and the final suffix (Tiṅ/Kṛt) to create the Aṅga (stem). Without them the final word cannot form."},
      {q:"√पठ् + सन् creates:",opts:["पठति (present tense)","पिपठिषति (desires to read) — a new Sanadyanta root","पाठक (reader, Kṛt form)","पठितुम् (infinitive)"],ans:1,exp:"San is a Sanādi suffix. Adding it to √paṭh creates the secondary root pipathiṣ with Dhātu-saṃjñā (3.1.32), expressing desire-to-do."},
      {q:"Tiṅ suffixes are applied to a root by:",opts:["Directly attaching to the root","First applying a Lakāra, then replacing it with a Tiṅ suffix via Lasyah (5.47)","Using Vikaraṇa alone","Attaching after Kṛt suffix"],ans:1,exp:"Two-step Tiṅ process: (1) Apply Lakāra to root. (2) Replace Lakāra with Tiṅ suffix via 'Lasyah.' Direct root attachment is incorrect — the Lakāra intermediate is mandatory."},
      {q:"लेट् (Let) Lakāra is unique because:",opts:["It forms future tense","It is used exclusively in Vedic texts and operates under Bahulam (irregular) principle","It creates nominal stems","It is the imperative mood marker"],ans:1,exp:"Let Lakāra is Exclusively Vedic. It operates under 'Bahulam' — suffix application is irregular, sometimes present and sometimes absent, unlike the other 9 Lakāras."},
      {q:"After It-saṃjñā deletion (Lopa), the root classification is:",opts:["Permanently lost","Remembered — root retains its It-based name (Idit, Udit, Ṅit) driving all future grammatical operations","Changed to a new category","Irrelevant after this point"],ans:1,exp:"Critical insight from Pushpa Dikshit: 'Even after deletion, the system remembers.' Idit/Udit/Ṅit classifications drive Numagama, Ātmanepada, vowel operations, and more."},
      {q:"Sārvadhatuka vs Ārdhadhatuka classification determines:",opts:["Only accent","Whether Guṇa or Vṛddhi and other phonological operations apply to root before suffix processing","Only the chapter used","Whether Sandhi applies"],ans:1,exp:"Sārvadhatuka → Guṇa operations. Ārdhadhatuka → Vṛddhi and other processes. This is the most critical grammatical decision in all verb formation (3.4.113-116)."},
      {q:"The Dhātu Adhikāra sūtra (3.1.91 'धातोः') functions by:",opts:["Listing all 1930 roots","Extending authority over ALL Ch.3 suffixation rules via Anuvṛtti — one word governs hundreds of rules","Naming the 10 Lakāras","Defining Sandhi rules"],ans:1,exp:"By Anuvṛtti (carry-forward), 'dhātoḥ' silently applies to every rule in Chapter 3. This is Pāṇini's Laghavam (minimal rule length) at its most powerful."},
    ],
    vedic:[
      {
        dev:"अग्ने नय सुपथा राये अस्मान् विश्वानि देव वयुनानि विद्वान् ।",
        roman:"agne naya supathā rāye asmān viśvāni deva vayunāni vidvān",
        trans:"O Agni, lead us to prosperity by a good path; O God, knowing all our deeds.",
        source:"Ṛgveda 1.189.1 / Īśāvāsyopaniṣad 18 (closing prayer)",
        rel:"नय = √नी + लोट् (Lot Lakāra, Sārvadhatuka) + Tiṅ 'hi' = imperative 'lead.' Cumulative grammar: Ch.1 Saṃjñā names the Lot Lakāra; Ch.2 sandhi joins 'nay+a' smoothly (Yaṇ sandhi: i→y); Ch.3 Pratyaya applies — Lot Lakāra placed on root, then replaced by Tiṅ 'hi' via Lasyah (step 5 of the 6-step Dhātu-prakriyā). Three chapters active in one Vedic imperative."
      },
      {
        dev:"इन्द्रं विश्वा अवीवृधन् समुद्रव्यचसं गिरः ।",
        roman:"indraṃ viśvā avīvṛdhan samudravyacasaṃ giraḥ",
        trans:"All songs have magnified Indra, ocean-vast, with their hymns.",
        source:"Ṛgveda 1.11.1",
        rel:"अवीवृधन् = √वृध् + णिच् (Sanādi causative, Ch.3.1.26) → Sanadyanta root वीवृध् + लुङ् (Lung/Ārdhadhatuka) + 3rd plural Tiṅ. Demonstrates simultaneously: Ch.1 It-saṃjñā of ण् in णिच् (guides causative formation); Ch.2 sandhi (ā+ī→ī Sāvarṇadīrgha); Ch.3 Sanādi + Ārdhadhatuka classification + Tiṅ-ādesha. Four chapters in one compound Ṛgvedic verb form."
      },
      {
        dev:"सत्यमेव जयते नानृतम् ।",
        roman:"satyam eva jayate nānṛtam",
        trans:"Truth alone triumphs, not falsehood.",
        source:"Muṇḍakopaniṣad 3.1.6 / Indian National Motto",
        rel:"जयते = √जि + लट् (Sārvadhatuka) + 'te' (Ātmanepada Tiṅ). Ch.1: root √जि has Svarita-Jit It-saṃjñā → Ubhayapada (both voices). Ch.3 Pada-Nirṇaya selects Ātmanepada because the victory benefits the subject. न+अनृतम् → नानृतम्: Ch.2 Sāvarṇadīrgha (a+a→ā). सत्यम्+एव: Ch.2 Visarga sandhi (ḥ before e becomes '). Ch.1 Saṃjñā → Ch.2 Sandhi → Ch.3 Pada-Nirṇaya: all three chapters operating in two words."
      },
      {
        dev:"भवतु शुभम् ।",
        roman:"bhavatu śubham",
        trans:"Let there be auspiciousness.",
        source:"Traditional Vedic blessing — Upaniṣadic invocations",
        rel:"भवतु = √भू (Bhvadi/Ajanta class, Ch.3) + लोट् (Sārvadhatuka, Ch.3) + Vikaraṇa शप् (Ch.3.1.68) → bhava (a-ending Ajanta stem) + 'tu' (3rd sg Tiṅ). The Guṇa operation (u→o in bhava) is triggered because Lot is Sārvadhatuka (Ch.3 classification) — and Guṇa itself is named in Ch.1 sūtra 1.1.2. The Ch.1 Guṇa-Saṃjñā, the Ch.3 Sārvadhatuka-classification, and Ch.3 Vikaraṇa all cooperate in this two-syllable blessing."
      },
      {
        dev:"पिपठिषामि वेदम् ।",
        roman:"pipathiṣāmi vedam",
        trans:"I desire to study/read the Veda.",
        source:"Pāṇinīya grammatical example — Pushpa Dikshit's canonical teaching",
        rel:"पिपठिषामि = √पठ् + सन् (Ch.3 Sanādi Pratyaya 3.1.7) → new Sanadyanta root पिपठिष् (root-status by 3.1.32: Sanadyanta Dhatavah) + लट् + 'mi' (1st sg Tiṅ). It-saṃjñā (Ch.1) of 'न्' in सन् guides the reduplication (pi-paṭh). Ch.2 sandhi creates the 'pi' vowel pattern. Ch.3 Sanādi mechanism, Ch.1 anubandha memory, and Ch.2 vowel rules all converge in one word expressing the desire to learn the very texts that contain these rules."
      },
      {
        dev:"कृण्वन्तो विश्वमार्यम् ।",
        roman:"kṛṇvanto viśvam āryam",
        trans:"Let us make the entire world noble.",
        source:"Ṛgveda 9.63.17 — the Vedic rallying cry",
        rel:"कृण्वन्तः = √कृ (Kryadi class — Ananta/Anajanta, Ch.3) + लोट् + Vikaraṇa 'u' (Śnu, Ch.3.1.73 — NOT dropped by Luk, unlike Ajanta). विश्वम्+आर्यम्: Ch.2 Sāvarṇadīrgha (a+ā→ā). This verse demonstrates the Ajanta vs Ananta contrast (Ch.3) — the Vikaraṇa remains in Kryadi class, producing 'kṛṇu' stem. Mastering this distinction is, as Pushpa Dikshit insists, the gateway to all Sanskrit conjugation."
      },
      {
        dev:"असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ।",
        roman:"asato mā sad gamaya · tamaso mā jyotir gamaya · mṛtyor māmṛtaṃ gamaya",
        trans:"Lead me from the unreal to the Real. From darkness to Light. From death to Immortality.",
        source:"Bṛhadāraṇyaka Upaniṣad 1.3.28 — the great prayer",
        rel:"गमय = √गम् + णिच् (Causative Sanādi, Ch.3) → गम्+अय → 'gamaya' (cause to go/lead). Ch.1 It-saṃjñā: 'ण्' in णिच् is an It-marker (guides causative formation, then deleted by Lopa 1.3.9). Ch.2 sandhi: गम्+अय (the 'a' of णिच् joins the Vikaraṇa 'ay'). The most famous prayer in the Upaniṣads is built entirely on Ch.3 Sanādi (causative) Pratyaya mechanics operating on the root √गम् — the same root that appears in examples throughout Chapters 1-3."
      },
      {
        dev:"धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।",
        roman:"dharmakṣetre kurukṣetre savetā yuyutsavaḥ",
        trans:"In the holy field of Dharma, in the field of Kuru, assembled desiring to fight.",
        source:"Bhagavad Gītā 1.1 — the opening verse",
        rel:"युयुत्सवः = √युध् + सन् (Ch.3 Sanādi: desire to fight) → Sanadyanta root युयुत्स् (with reduplication by Ch.1 It-saṃjñā rules) + उ (Kṛt suffix, Ch.3) → युयुत्सु + plural = युयुत्सवः. Ch.2 sandhi: धर्म+क्षेत्रे (compound junction). This opening verse of the Gītā uses Ch.3 Sanādi Pratyaya for its most dramatic word: 'those desiring battle' — desire expressed through √यु+San, the very mechanism Pushpa Dikshit uses to introduce Sanādi suffixes."
      },
    ],
    levels:{
      easy:[
        {q:"How many types of Pratyaya are in Chapter 3?",opts:["2","3","4","6"],ans:2,exp:"4 types: Sanādi (new roots), Vikaraṇa (process helpers), Kṛt (nominal stems from roots), Tiṅ (verbal endings)."},
        {q:"Tiṅ Pratyaya creates:",opts:["Nominal stems (pratipadikas)","Complete verb forms (Tinanta) — e.g. gacchati, paṭhati","New roots","Adjectives only"],ans:1,exp:"Tiṅ = the 18 personal endings that turn a root into a complete usable verb (Tinanta) — the final step of verbal formation."},
        {q:"Which Lakāra is exclusively Vedic?",opts:["लट् (Lat)","लोट् (Lot)","लेट् (Let)","लिट् (Lit)"],ans:2,exp:"Let (लेट्) is used ONLY in Vedic texts and operates under Bahulam (irregular) principle — as Pushpa Dikshit emphasises."},
        {q:"The Dhātu-Adhikāra sūtra is:",opts:["1.1.1 Vṛddhi","3.1.91 धातोः","6.1.77 Yaṇ","1.1.9 Savarṇa"],ans:1,exp:"3.1.91 'dhātoḥ' is the single header sūtra whose authority covers all Chapter 3 suffix rules via Anuvṛtti."},
        {q:"√पठ् + क्त = ?",opts:["पठति","पठितुम्","पठित (past participle)","पाठक"],ans:2,exp:"Kṛt suffix 'kt' applied to √paṭh gives 'paṭhita' (read, past passive participle) — a Pratipadika (nominal stem)."},
      ],
      medium:[
        {q:"Vikaraṇa Pratyaya is called a 'process helper' because:",opts:["It creates new roots","It sits between root and final suffix forming the Aṅga stem — without it the word cannot form","It replaces the Lakāra","It applies only in Vedic"],ans:1,exp:"Vikaraṇas are Prakriti-Pratyaya-madhya-patitam — positioned between root and final suffix. They form the verbal stem (Aṅga) and determine Ajanta/Ananta class behaviour."},
        {q:"Sanadyanta Dhatavah (3.1.32) means:",opts:["Primary roots are enumerated","Forms created by Sanādi suffixes receive Dhātu-status (root status) and can undergo full conjugation","Sanādi are deleted after use","Only in Vedic"],ans:1,exp:"3.1.32 grants Dhātu-saṃjñā to Sanadyanta forms — this is why pipathiṣ (desire-to-read) can be conjugated like a primary root."},
        {q:"Pada-Nirṇaya chooses Ātmanepada when the root is:",opts:["Udātta pitch only","Marked as Anudātta-Ḍit or Ṅit in the Dhātupāṭha","Without any anubandha","In the Bhvadi class"],ans:1,exp:"Anudātta-Ḍit and Ṅit anubandha markers classify a root for Ātmanepada endings. Svarita-Jit → Ubhayapada. No special marker → Parasmaipada by default."},
        {q:"What are the 4 Satvādi Catuṣṭaya (inner-layer operations)?",opts:["Sandhi·Savarṇa·Guṇa·Vṛddhi","Sattva·Natva·Numagama·Upadha-dīrgha","Lopa·Āgama·Ādesha·Svara","Lakāra·Tiṅ·Kṛt·Sanādi"],ans:1,exp:"The 4 Antaraṅga operations before suffixation: Sattva (retroflex-ṣ→dental-s), Natva (retroflex-ṇ→dental-n), Numagama (nasal insertion for Idit roots), Upadha-dīrgha (penultimate vowel lengthening)."},
      ],
      hard:[
        {q:"Why does Pāṇini NOT apply Tiṅ suffixes directly to the root?",opts:["Tradition only","The Lakāra intermediate carries tense/mood information AND triggers the Sārvadhatuka/Ārdhadhatuka classification that governs ALL phonological operations — skipping it produces systematically incorrect forms","Roots cannot take endings","Tiṅ only work after Kṛt"],ans:1,exp:"The Lakāra is not just a tense marker — it IS the classifier determining phonological environment for all downstream operations. This is the deepest architectural insight in Chapter 3."},
        {q:"After Lopa (deletion), the Anubandha system's deepest contribution is:",opts:["Decoration only","The root retains its It-based classification-name even after the marker is deleted — this 'memory' enables hundreds of downstream rules to apply correctly","Only affects pronunciation","Only relevant in the Dhātupāṭha listing"],ans:1,exp:"As Pushpa Dikshit emphasises: 'Even after deletion, the system remembers.' Idit/Udit/Ṅit/Ḍit — all from deleted markers — drive Numagama, Ātmanepada, vowel operations, and more throughout the entire grammar."},
      ],
    },
  },
  {
    id:4,num:"IV",title:"Māheśvara Sūtras",
    subtitle:"14 Drum-Formulas · 42 Pratyāhāra Codes · Shiva's Encoding",
    icon:"🥁",color:"#E11D48",
    concepts:[
      {term:"14 Māheśvara Sūtras",meaning:"Sound-strings from Shiva's ḍamaru drum. Their sole purpose: enable Pratyāhāra abbreviation codes for the entire grammar.",example:"①अइउण् ②ऋऌक् ③एओङ् ④ऐऔच् ⑤हयवरट् ⑥लण् ⑦ञमङणनम् ⑧झभञ् ⑨घढधष् ⑩जबगडदश् ⑪खफछठथचटतव् ⑫कपय् ⑬शषसर् ⑭हल्",cat:"core",sutra:""},
      {term:"It-saṃjñā (1.3.3 + 1.3.9)",meaning:"Final consonant of each sūtra = It-marker. Named by हलन्त्यम् (1.3.3), deleted by तस्य लोपः (1.3.9).",example:"'अ इ उ ण्' → ण् is the It-marker, deleted after use",cat:"core",sutra:"1.3.3"},
      {term:"Pratyāhāra Rule (1.1.71)",meaning:"आदिरन्त्येन सहेता: starting sound + last It-marker = abbreviation for ALL sounds between them in the sūtra-sequence.",example:"अ (sūtra 1 start) + च् (sūtra 4 It) = अच् = all 9 vowels",cat:"core",sutra:"1.1.71"},
      {term:"42 Standard Pratyāhāras",meaning:"~42 standard abbreviations from 14 sūtras. One It-marker can head multiple Pratyāhāras depending on starting sound.",example:"From sūtra 2 marker क्: अक् · इक् · उक् — three distinct groups",cat:"pratyahara",sutra:""},
      {term:"Essential Pratyāhāras",meaning:"The most-used abbreviations — core vocabulary for reading any rule of the Aṣṭādhyāyī.",example:"अच्=9 vowels · हल्=33 consonants · इक्=इउऋऌ · यण्=यरलव · झल्=hard/sibilants",cat:"pratyahara",sutra:""},
    ],
    quiz:[
      {q:"How many Māheśvara Sūtras?",opts:["9","12","14","42"],ans:2,exp:"14 sūtras from Śiva's 14-beat ḍamaru — nava-pañca (9+5=14)."},
      {q:"'अच्' covers:",opts:["All 33 consonants","All 9 vowels","Short vowels only","4 semivowels"],ans:1,exp:"अ (sūtra 1) + च् (sūtra 4 It) = all sounds between = 9 vowels."},
      {q:"An It-marker is:",opts:["A vowel in compounds","A coding marker that guides grammar then disappears","A verbal prefix","A compound vowel"],ans:1,exp:"Named by 1.3.3, deleted by 1.3.9. Enables compact coding without phonetic artifacts."},
      {q:"Standard Pratyāhāra count:",opts:["14","22","33","42"],ans:3,exp:"~42 standard Pratyāhāras from the 14 combinatorially arranged sūtras."},
    ],
    vedic:[
      {
        dev:"नृत्तावसाने नटराजराजो ननाद ढक्कां नवपञ्चवारम् । काव्यालपन्तं प्रतिपद्य बोधं शिष्यार्थसिद्ध्यै स्वमनुस्मरेत ॥",
        roman:"nṛttāvasāne naṭarājarājo nanāda ḍhakkāṃ navapañcavāram · kāvyālapantaṃ pratipadya bodhaṃ śiṣyārthasiddhyai svamanusmareta",
        trans:"At the close of the cosmic dance, the King of Dancers sounded his drum fourteen times. Having received that illumination of speech/poetry, [Pāṇini] composed [the grammar] for the benefit of his students, to be ever remembered.",
        source:"Traditional invocatory verse — Pāṇini-sūtra preamble",
        rel:"नवपञ्च = 9+5 = 14 — the 14 Māheśvara Sūtras. The Pratyāhāras these 14 sūtras generate are themselves Saṃjñās (Ch.1) — compact technical labels like 'अच्' and 'हल्.' So Māheśvara Sūtras (Ch.4) are the PHONOLOGICAL foundation of all Saṃjñā (Ch.1), and both together enable Sandhi rules (Ch.2) and Pratyaya-application (Ch.3). The ḍamaru beat encodes Chapters 1–4 simultaneously."
      },
      {
        dev:"आदिरन्त्येन सहेता ।",
        roman:"ādirantyen sahetā",
        trans:"The starting sound together with the final marker encompasses all sounds between.",
        source:"Aṣṭādhyāyī 1.1.71 — the Pratyāhāra-formation rule",
        rel:"Five syllables define ALL 42 Pratyāhāras at once. Every single Sandhi rule in Ch.2 uses Pratyāhāras: 'इको यणचि' — here 'इक्' and 'अच्' are both Pratyāhāras from Māheśvara Sūtras (Ch.4). Every Pratyaya rule in Ch.3 uses them too: 'अचि' in many Kṛt rules. Māheśvara Sūtras (Ch.4) are the phonological vocabulary that makes Chapters 2 and 3 writable in compact form."
      },
      {
        dev:"ॐ तत्सत् ।",
        roman:"oṃ tat sat",
        trans:"Om — That — Existence-Truth.",
        source:"Bhagavad Gītā 17.23 — the three syllables of Brahman",
        rel:"ॐ is itself a Pratyāhāra-class sound — it contains all sounds of the Māheśvara Sūtras compressed into one phoneme. Phonetically: अ (sūtra 1) + उ (sūtra 1) + म् (sūtra 7 anusvāra). 'त्+अ+त्' = Ananta class root (Ch.3 concept: consonant-ending stem). The three syllables of the most sacred mantra are fully analysable only after learning Ch.4 (sound encoding) + Ch.3 (root formation) + Ch.1 (Saṃjñā)."
      },
      {
        dev:"इको यणचि ।",
        roman:"iko yaṇ aci",
        trans:"Ik-vowels become Yaṇ semivowels before any vowel.",
        source:"Aṣṭādhyāyī 6.1.77 — Ch.2 Sandhi rule",
        rel:"This Ch.2 Sandhi rule contains THREE Pratyāhāras from the Māheśvara Sūtras (Ch.4): (1) 'इक्' = इ उ ऋ ऌ [from sūtra-1 start + sūtra-2 It क्], (2) 'यण्' = य र ल व [sūtra-5 start + sūtra-5 It ट्], (3) 'अच्' = all 9 vowels [sūtra-1 start + sūtra-4 It च्]. Without the Māheśvara Sūtras (Ch.4), this 5-syllable rule cannot be decoded. Chapters 4 and 2 are architecturally inseparable."
      },
      {
        dev:"हलन्त्यम् ।",
        roman:"halantam",
        trans:"The final consonant [of an upadesha form] is [named as] It.",
        source:"Aṣṭādhyāyī 1.3.3 — the It-identification rule",
        rel:"'हल्' in 'हलन्त्यम्' is a Pratyāhāra from Māheśvara Sūtras (Ch.4): ह (sūtra 5 start) + ल् (sūtra 14 It) = all 33 consonants. So Ch.4 Pratyāhāra 'हल्' is used inside the Ch.1 It-saṃjñā rule itself! Māheśvara Sūtras (Ch.4) are actually deployed before Ch.1 definitions can even be stated — they are the presuppositional layer on which all of Ch.1 rests."
      },
      {
        dev:"तपसा ब्रह्म विजिज्ञासस्व ।",
        roman:"tapasā brahma vijijñāsasva",
        trans:"Seek to know Brahman through tapas (intense discipline).",
        source:"Taittirīya Upaniṣad 3.2",
        rel:"विजिज्ञासस्व = वि + √ज्ञा + सन् (Sanādi, Ch.3: desire to know) + आत्मनेपद Tiṅ 'sva'. Ch.4: 'ज्ञ' is a Saṃyoga (Ch.1 Saṃjñā: हलोऽनन्तराः संयोगः), and its Sthāna and Prayatna are analysed in Ch.5 (phonetics). Ch.1 Saṃjñā + Ch.3 Sanādi + Ch.4 Pratyāhāra for consonant classification + Ch.5 phonetics — all four chapters active in one compound Vedic verb. The discipline of tapas itself demands cumulative grammatical knowledge."
      },
      {
        dev:"प्रत्याहारेण सर्वे वर्णाः गृह्यन्ते ।",
        roman:"pratyāhāreṇa sarve varṇāḥ gṛhyante",
        trans:"By the Pratyāhāra technique, all sounds are captured [in compact codes].",
        source:"Vyākaraṇa Mahābhāṣya — Patañjali's meta-comment on the Māheśvara Sūtras",
        rel:"Patañjali's summary of why the Māheśvara Sūtras (Ch.4) are indispensable: they compress the entire phonological inventory into 42 codes. 'गृह्यन्ते' = √ग्रह् + Kṛt Pratyaya (Ch.3) in passive voice — showing Ch.3 Pratyaya applied to explain Ch.4's function. 'वर्णाः' = phonemes, whose Sthāna and Karaṇa are detailed in Ch.5. The grammar is a self-referential system: its rules are themselves analysable by its own rules."
      },
    ],
    levels:{
      easy:[
        {q:"Māheśvara Sūtra count:",opts:["9","12","14","42"],ans:2,exp:"14 sūtras."},
        {q:"'अच्' represents:",opts:["All consonants","All 9 vowels","Short vowels","4 semivowels"],ans:1,exp:"अ+च् = all 9 vowels."},
      ],
      medium:[
        {q:"1.3.3 + 1.3.9 together:",opts:["Define vowels","NAME the It (1.3.3) then DELETE it (1.3.9)","Create Pratyāhāras","Define Sandhi"],ans:1,exp:"Two-step: mark the It, use it, delete it."},
        {q:"'इक्' is formed from:",opts:["Sūtra 1 alone","इ (sūtra 1 start) + क् (sūtra 2 It-marker)","Four sūtras","Random grouping"],ans:1,exp:"इक् used in key rule इको यणचि (6.1.77)."},
      ],
      hard:[
        {q:"The 14 sūtras are in a specific order because:",opts:["Tradition only","Every Pratyāhāra needed has a unique Ādi+It code — reordering creates ambiguity","Recitation convenience","Shiva's arbitrary choice"],ans:1,exp:"Combinatorial proof: the sequence is the UNIQUE arrangement where every needed sound-group has exactly one unambiguous code."},
      ],
    },
  },
  {
    id:5,num:"V",title:"Sthāna · Karaṇa · Prayatna",
    subtitle:"8 Vocal Places · Tongue as Instrument · Articulation Effort",
    icon:"👄",color:"#D97706",
    concepts:[
      {term:"8 Sthāna — Vocal Places",meaning:"Eight locations in the vocal tract where sounds originate.",example:"क-वर्ग→Kaṇṭha · च-वर्ग→Tālu · ट-वर्ग→Mūrdhā · त-वर्ग→Danta · प-वर्ग→Oṣṭha",cat:"sthana",sutra:"Śikṣā 13"},
      {term:"Karaṇa — The Tongue Instrument",meaning:"The tongue-part or lip-configuration that REACHES the sthāna. Sthāna is fixed place; Karaṇa is the moving instrument.",example:"Guttural=tongue-root · Palatal=mid-tongue · Cerebral=curled tip · Dental=flat tip",cat:"articulation",sutra:"TP 2.48"},
      {term:"5 Abhyantara Prayatna",meaning:"Five internal articulatory efforts: ①Spṛṣṭa (stop) ②Īṣat-spṛṣṭa (semivowel) ③Vivṛta (vowel-open) ④Saṃvṛta (short-a narrow) ⑤Īṣat-vivṛta (sibilant).",example:"क=Spṛṣṭa · य=Īṣat-spṛṣṭa · अ=Vivṛta · श=Īṣat-vivṛta",cat:"effort",sutra:""},
      {term:"11 Bāhya Prayatna",meaning:"Eleven external features: Vivāra/Saṃvāra (cord openness), Śvāsa/Nāda (breath/voice), Aghoṣa/Ghoṣa (voiceless/voiced), plus three pitch accents.",example:"क=Vivāra+Śvāsa+Aghoṣa (Khar) · ग=Saṃvāra+Nāda+Ghoṣa (Haś)",cat:"effort",sutra:""},
      {term:"Savarṇa via Sthāna+Prayatna",meaning:"1.1.9 तुल्यास्यप्रयत्नं सवर्णम्: same Sthāna + same Abhyantara Prayatna = savarṇa.",example:"अ and आ: same Kaṇṭha, same Vivṛta effort → savarṇa",cat:"samjna",sutra:"1.1.9"},
    ],
    quiz:[
      {q:"Sthāna of Kavarga (क ख ग घ ङ)?",opts:["Tālu","Kaṇṭha (guttural)","Danta","Mūrdhā"],ans:1,exp:"अकुहविसर्जनीयानां कण्ठः — Kavarga, अ, ह, Visarga are all guttural."},
      {q:"Alpaprāṇa consonants in a Varga:",opts:["2nd and 4th","1st, 3rd, and 5th","All five","5th only"],ans:1,exp:"1st (क), 3rd (ग), 5th (ङ) = Alpaprāṇa. 2nd (ख), 4th (घ) = Mahāprāṇa (aspirated)."},
      {q:"Two sounds are Savarṇa (1.1.9) when:",opts:["Same written form","Same Sthāna + same Abhyantara Prayatna","Same sūtra","Same suffix"],ans:1,exp:"tulyāsyaprayatnaṃ — equality of place AND internal effort defines homogeneity."},
      {q:"Sanskrit phonetics is remarkable because:",opts:["Script only","Describes the same vocal-tract physics that modern IPA codified — 2500 years earlier","Purely theoretical","Only Sanskrit"],ans:1,exp:"Pāṇini's Śikṣā is empirical phonetics — places, instruments, and efforts map directly to modern articulatory phonetics."},
    ],
    vedic:[
      {
        dev:"अकुहविसर्जनीयानां कण्ठः ।",
        roman:"akuhavisarjanīyānāṃ kaṇṭhaḥ",
        trans:"Kaṇṭha (the throat) is the place of articulation for अ, Kavarga (क ख ग घ ङ), ह, and Visarga.",
        source:"Pāṇinīya Śikṣā 13 — Pāṇini's own phonetics manual",
        rel:"This sūtra maps the guttural Sthāna. But it uses Pratyāhāras from the Māheśvara Sūtras (Ch.4): 'अकुहविसर्जनीयानाम्' is a compact reference. The Savarṇa-Saṃjñā (Ch.1: 1.1.9) defines two sounds as Savarṇa ONLY when they share this same Sthāna AND same Abhyantara Prayatna — so Ch.5 phonetics is the EMPIRICAL BASIS for Ch.1's theoretical definition. Grammar → Phonetics → Grammar: the system is circular and self-consistent."
      },
      {
        dev:"यत्र जायते स स्थानम् येन जायते स करणम् ॥",
        roman:"yatra jāyate sa sthānam · yena jāyate sa karaṇam",
        trans:"WHERE a sound is born = Sthāna. BY WHAT it is born = Karaṇa.",
        source:"Taittirīya Prātiśākhya 2.48",
        rel:"This elegant couplet distinguishes Sthāna (fixed anatomical place in vocal tract) from Karaṇa (moving tongue/lip instrument). The distinction matters for Ch.2 Sandhi: Parasavarṇa assimilation (8.4.58) works by place — a stop takes the Sthāna of the following stop. Without Ch.5's Sthāna map, the Ch.2 assimilation rule has no physical basis. Phonetics (Ch.5) is the empirical ground for phonology (Ch.2)."
      },
      {
        dev:"प्रयत्नो द्विधा — आभ्यन्तरश्च बाह्यश्च ।",
        roman:"prayatno dvidhā — ābhyantaraśca bāhyaśca",
        trans:"Articulatory effort is of two kinds — internal (Abhyantara) and external (Bāhya).",
        source:"Pāṇinīya Śikṣā — classification of Prayatna",
        rel:"This two-fold Prayatna is the foundation of Ch.1's Savarṇa (1.1.9: tulyāsyaprayatnaṃ savarṇam). The Abhyantara Prayatna determines vowel vs consonant class; the Bāhya Prayatna determines voicing (Ghoṣa/Aghoṣa), aspiration, and pitch accent. The Sārvadhatuka/Ārdhadhatuka distinction (Ch.3) and the Guṇa/Vṛddhi operations (Ch.1 Saṃjñā) all depend on these physical distinctions mapped in Ch.5."
      },
      {
        dev:"ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ।",
        roman:"oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt",
        trans:"We meditate on that excellent glory of the divine Sun; may He illuminate our intellects.",
        source:"Ṛgveda 3.62.10 — the Gāyatrī Mantra, recited daily for millennia",
        rel:"The Gāyatrī is 24 syllables in Gāyatrī metre (8+8+8). Every syllable demonstrates Ch.5 Sthāna: भ=Oṣṭha(labial), व=Oṣṭha(labial), र=Mūrdhā(cerebral), स=Danta(dental), त=Danta, ग=Kaṇṭha(guttural), ध=Danta, म=Oṣṭha, च=Tālu(palatal). The entire vocal tract is engaged — Pāṇini's Śikṣā (Ch.5) is an anatomical map of this very mantra. Syllable weight (Laghu-Guru, Ch.6) determines the metre: 'ta-jjal-lān' = the physical basis of Vedic sound."
      },
      {
        dev:"वागर्थाविव संपृक्तौ वागर्थप्रतिपत्तये । जगतः पितरौ वन्दे पार्वतीपरमेश्वरौ ॥",
        roman:"vāgarthāviva saṃpṛktau vāgarthapratipattaye · jagataḥ pitarau vande pārvatīparameśvarau",
        trans:"I venerate the parents of the universe, Pārvatī and Parameśvara, who are as inseparably united as word (vāk) and meaning (artha), so that I may properly understand word and meaning.",
        source:"Kālidāsa — Raghuvaṃśa 1.1, the most celebrated Sanskrit invocation",
        rel:"वाग्+अर्थौ → वागर्थौ: Visarga sandhi (Ch.2) — 'वाच्' before 'अ' → ग् (voiced Parasavarṇa 8.4.58). The sandhi REQUIRES knowing that ग् and च् share the PALATAL Sthāna (Ch.5) — assimilation is place-based. संपृक्तौ: √पृच् + क्त (Kṛt Ch.3) in compound. This verse literally says 'word and meaning are inseparable' — as are phonetics (Ch.5) and grammar (Ch.1-3)."
      },
      {
        dev:"शं नो मित्रः शं वरुणः शं नो भवत्वर्यमा ।",
        roman:"śaṃ no mitraḥ śaṃ varuṇaḥ śaṃ no bhavatv aryamā",
        trans:"May Mitra be auspicious to us; may Varuṇa be auspicious; may Aryaman be auspicious to us.",
        source:"Ṛgveda 1.90.9 / Taittirīya Upaniṣad — Śānti-pāṭha",
        rel:"श्+अं → शम्: Anusvāra is an Ayogavāha — it has no independent Sthāna (Ch.5/Ch.7) but takes the nasal Sthāna of the following sound. Before 'न' (dental) → dental nasal. मित्र: त=Danta, र=Mūrdhā — two adjacent Sthānas in one word. वरुण: व=Oṣṭha, र=Mūrdhā, ण=Mūrdhā — retroflex influence across the word (Natva, Ch.3 inner operation). Ch.5 Sthāna knowledge shows WHY ण appears in 'varuṇa' — the cerebral cascade from 'r' to 'ṇ'."
      },
      {
        dev:"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।",
        roman:"sarve bhavantu sukhinaḥ sarve santu nirāmayāḥ",
        trans:"May all be happy; may all be free from illness.",
        source:"Bṛhadāraṇyaka Upaniṣad — Universal peace prayer",
        rel:"भवन्तु = √भू + लोट् (Ch.3 Sārvadhatuka) + Vikaraṇa शप् + 3rd plural Tiṅ 'antu'. The Guṇa (u→o→bhava) is triggered by Sārvadhatuka (Ch.3) — whose classification depends on knowing that शप् is the Sārvadhatuka Vikaraṇa of Bhvadi (Ajanta) class. सन्तु = √अस् + लोट् + 'antu': Adadi class (Ananta/Ch.3), Vikaraṇa dropped (Luk). सुखिनः: Ch.2 Visarga→nasal before 'स्'. सर्वे: Pluta/Dīrgha vowel 'e' (Ch.6 duration). Five chapters operating in eight words."
      },
    ],
    levels:{
      easy:[
        {q:"Kavarga Sthāna:",opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"],ans:1,exp:"Gutturals at Kaṇṭha."},
        {q:"Tavarga Sthāna:",opts:["Kaṇṭha","Tālu","Mūrdhā","Danta"],ans:2,exp:"ṭavarga at Mūrdhā — cerebral place."},
      ],
      medium:[
        {q:"'Khar' consonant class shares:",opts:["Saṃvāra+Nāda+Ghoṣa","Vivāra+Śvāsa+Aghoṣa (unvoiced, breathed)","All three","No shared feature"],ans:1,exp:"Khar = unaspirated voiceless: open cords + breath + voiceless."},
      ],
      hard:[
        {q:"Why is BOTH Sthāna AND Karaṇa needed?",opts:["Redundant","Multiple sounds share one Sthāna (ह and क both at Kaṇṭha) — Karaṇa disambiguates tongue-configuration","Tradition","Script-based"],ans:1,exp:"ह and क share Kaṇṭha but differ in tongue-root configuration. Sthāna+Karaṇa+Prayatna = complete articulatory spec."},
      ],
    },
  },
  {
    id:6,num:"VI",title:"Vowel System & Strengthening",
    subtitle:"18 Variants per Vowel · Guṇa · Vṛddhi · Laghu-Guru Meter",
    icon:"🎵",color:"#8B5CF6",
    concepts:[
      {term:"18 Forms per Vowel",meaning:"Each short vowel (like अ) has 3 durations × 3 pitch accents × 2 nasality variants = 18 phonetically distinct forms. Diphthongs have 12.",example:"अ → 18 forms · ए → 12 forms (no Hrasva diphthong) · ऌ → 12 forms",cat:"theory",sutra:""},
      {term:"Hrasva · Dīrgha · Pluta (1.2.27)",meaning:"Three durations. Hrasva=1 mātrā, Dīrgha=2 mātrā, Pluta=3+ mātrā (used in calling, special contexts).",example:"Hrasva: अइउऋऌ · Dīrgha: आईऊएओऐऔ · Pluta: रा३म!",cat:"duration",sutra:"1.2.27"},
      {term:"Udātta · Anudātta · Svarita",meaning:"Three Vedic pitch accents — Bāhya Prayatna of vowels only. Udātta=raised, Anudātta=low, Svarita=circumflex blend.",example:"उदात्त=high pitch · अनुदात्त=low pitch · स्वरित=falling blend",cat:"tone",sutra:"1.2.29-31"},
      {term:"Guṇa and Vṛddhi Operations",meaning:"Guṇa: replace ik-vowel with a/e/o. Vṛddhi: replace with ā/ai/au. The two strengthening grades applied throughout morphology.",example:"इ→अ(Guṇa)/आ(Vṛddhi) · उ→ओ/औ · ऋ→अर्/आर्",cat:"samjna",sutra:"1.1.1-2"},
      {term:"Uraṇ Rapharaḥ (1.1.51)",meaning:"When ṛ undergoes Guṇa or Vṛddhi substitution, insert a following र् — because no retroflex Guṇa vowel exists.",example:"महा + ऋषि → महर्षि (a+ṛ→ar, with र् inserted)",cat:"sutra",sutra:"1.1.51"},
      {term:"Laghu and Guru (1.4.10-11)",meaning:"ह्रस्वं लघु: short vowel = Laghu. संयोगे गुरु: short before consonant cluster = Guru. The metrical distinction.",example:"'ज' in जल = Laghu · 'ज' in जल्प = Guru (before ल्+प cluster)",cat:"meter",sutra:"1.4.10-11"},
    ],
    quiz:[
      {q:"Guṇa vowels (1.1.2):",opts:["आ ऐ औ","अ ए ओ","इ ई उ ऊ","ऋ ॠ ऌ"],ans:1,exp:"अ ए ओ = Guṇa (middle grade)."},
      {q:"महा + ऋषि → महर्षि demonstrates:",opts:["Simple Guṇa","Uraṇ Rapharaḥ (1.1.51): र् inserted with ṛ-substitution","Vṛddhi sandhi","Vowel deletion"],ans:1,exp:"No retroflex Guṇa vowel exists, so र् is inserted: a+ṛ→ar."},
      {q:"A short vowel before a cluster becomes:",opts:["Laghu","Guru (positionally heavy)","Pluta","Anunāsika"],ans:1,exp:"1.4.11 saṃyoge guru — position before cluster makes syllable heavy."},
      {q:"Vṛddhi vowels (1.1.1):",opts:["अ ए ओ","इ ई उ","आ ऐ औ","ए ओ only"],ans:2,exp:"1.1.1 (FIRST sūtra): आ ऐ औ = Vṛddhi."},
    ],
    vedic:[
      {
        dev:"वृद्धिरादैच् ।",
        roman:"vṛddhirādaic",
        trans:"Ā, ai, and au are called Vṛddhi.",
        source:"Aṣṭādhyāyī 1.1.1 — The very FIRST sūtra of 4000",
        rel:"The Aṣṭādhyāyī opens with this Saṃjñā (Ch.1) defining Vṛddhi vowels. But Vṛddhi is a phonetic reality — आ, ऐ, औ are the strongest vowel grades because they have the widest aperture (Vivṛta prayatna, Ch.5 phonetics). Pāṇini names them first because every causative formation (√कृ+णिच्→कारयति), patronymic (दाशरथि), and Vṛddhi sandhi (Ch.2: 6.1.88) depends on recognising these three sounds as one class. Ch.1 Saṃjñā names what Ch.5 phonetics physically describes."
      },
      {
        dev:"अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।",
        roman:"agnim īḷe purohitaṃ yajñasya devam ṛtvijam",
        trans:"I praise Agni, the household priest, the divine officiant of the sacrifice.",
        source:"Ṛgveda 1.1.1 — the opening verse of the entire Ṛgveda",
        rel:"ईळे = √ईड् + लट् (Sārvadhatuka, Ch.3) + Ātmanepada 'e'. The root vowel ई is a Dīrgha (long) vowel — 2 mātrās (Ch.6: 1.2.27). ऋत्विजम् = √ऋ+क्विप् (Kṛt, Ch.3) + nominal compound. The ṛ vowel (1 mātrā Hrasva) is followed by a Saṃyoga (Ch.1: 1.1.7) making the syllable Guru (Ch.6: 1.4.11). This first verse of the Ṛgveda encodes Ch.1 Saṃjñā, Ch.2 Sandhi, Ch.3 Pratyaya, Ch.5 Sthāna, and Ch.6 duration — the entire cumulative grammar in one anuṣṭubh line."
      },
      {
        dev:"इको यणचि ।",
        roman:"iko yaṇ aci",
        trans:"Ik-vowels (i, u, ṛ, ḷ) become the corresponding Yaṇ semivowels before any vowel.",
        source:"Aṣṭādhyāyī 6.1.77 — the core Yaṇ sandhi rule",
        rel:"This Ch.2 sandhi rule operates on vowels classified in Ch.6: इक् vowels (i,u,ṛ,ḷ) have Hrasva/Dīrgha forms (Ch.6 duration). The Yaṇ conversion (i→y, u→v, ṛ→r, ḷ→l) is phonetically explained by Ch.5 Sthāna — the semivowel य shares Tālu-Sthāna with इ; व shares Oṣṭha with उ. But why does only the Hrasva-duration form trigger Yaṇ while the rule is stated without Tapara? Because Ch.6 teaches that all duration-variants of the same vowel are covered by the generic name. Ch.6 duration system powers Ch.2 Sandhi scope."
      },
      {
        dev:"उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
        roman:"uddhared ātmanātmānaṃ nātmānam avasādayet",
        trans:"One should uplift oneself through the self; let one not degrade oneself.",
        source:"Bhagavad Gītā 6.5",
        rel:"उद्धरेत् = उत् + √हृ + लिङ् (Optative/Potential, Ārdhadhatuka, Ch.3) + 3rd sg Parasmaipada. The root √हृ has ṛ vowel — exactly the Hrasva ṛ discussed in Ch.6 (1 mātrā). In Ārdhadhatuka environment (Liṅ), the ṛ undergoes Guṇa → 'ar' (Uraṇ Rapharaḥ 1.1.51, Ch.6): उद्+धर्+एत् → उद्धरेत्. Ch.6 Guṇa operation + Ch.3 Ārdhadhatuka classification + Ch.2 Sandhi (उत्+√हृ junction) all visible. The philosophy of self-upliftment is itself encoded through the grammar of vowel strengthening."
      },
      {
        dev:"महर्षीणां भृगुरहं गिरामस्म्यकशरः ।",
        roman:"maharṣīṇāṃ bhṛgur ahaṃ girām asmy ekam akṣaram",
        trans:"Among the great sages I am Bhṛgu; among words I am the one syllable (Om).",
        source:"Bhagavad Gītā 10.25",
        rel:"महर्षीणाम् = महा + ऋषि → महर्षि: this is the canonical example of Uraṇ Rapharaḥ (1.1.51, Ch.6): a+ṛ→ar (no retroflex Guṇa vowel exists). So Ch.6 teaches: when ṛ takes Guṇa, insert र् after 'a.' एकम्+अक्षरम्: Ch.2 Sāvarṇadīrgha (a+a→ā). अक्षर literally means 'imperishable' but grammatically = 'syllable unit' — the fundamental unit of Ch.6 duration system (mātrā). Kṛṣṇa identifying himself with 'the one syllable Om' is a declaration about Ch.6's foundational concept: the syllable as the unit of sound measurement."
      },
      {
        dev:"ह्रस्वं लघु ।",
        roman:"hrasvaṃ laghu",
        trans:"A short [vowel-containing syllable] is Laghu (light).",
        source:"Aṣṭādhyāyī 1.4.10 — the metrical weight rule",
        rel:"This Ch.6 sūtra defines Laghu (light syllable) using the Hrasva-Saṃjñā from 1.2.27 (also Ch.6: short = 1 mātrā). The companion rule 1.4.11 (saṃyoge guru) says a syllable before a Saṃyoga (Ch.1 Saṃjñā: 1.1.7) is Guru. Together these rules create Vedic metre — the Gāyatrī (24 syllables), Triṣṭubh (44), Jagatī (48) are all defined by Laghu-Guru patterns. Ch.6 duration + Ch.1 Saṃyoga-Saṃjñā + Ch.4 Pratyāhāra 'हल्' (consonant) = the complete system of Sanskrit prosody."
      },
      {
        dev:"गायत्री छन्दसां माता सावित्री ब्राह्मणैः स्मृता ।",
        roman:"gāyatrī chandasāṃ mātā sāvitrī brāhmaṇaiḥ smṛtā",
        trans:"Gāyatrī is the mother of metres; by the learned it is known as Sāvitrī.",
        source:"Traditional verse on Vedic prosody",
        rel:"The Gāyatrī metre is 3 pādas of 8 syllables each = 24 syllables. Each syllable's Laghu (light) or Guru (heavy) weight is determined by Ch.6 rules: Hrasva vowel = Laghu (1.4.10); short vowel before Saṃyoga = Guru (1.4.11). The word 'गायत्री' itself: गा (Guru: long ā), य (Laghu: short a), त्री (Guru: long ī). Ch.6 duration system (Hrasva, Dīrgha, Pluta from 1.2.27) + Ch.1 Saṃyoga-Saṃjñā (1.1.7) = the entire science of Vedic metre (Chandas). Grammar IS poetry."
      },
      {
        dev:"अहं वैश्वानरो भूत्वा प्राणिनां देहमाश्रितः ।",
        roman:"ahaṃ vaiśvānaro bhūtvā prāṇināṃ deham āśritaḥ",
        trans:"Having become Vaiśvānara (the fire of digestion), I dwell in the body of all living beings.",
        source:"Bhagavad Gītā 15.14",
        rel:"भूत्वा = √भू + क्त्वा (Kṛt Pratyaya, Ch.3: gerund 'having become'). Here Guṇa applies: √bhū (u vowel, Hrasva, Ch.6) + Sārvadhatuka environment → u→o (Guṇa, Ch.1 Saṃjñā 1.1.2) → bho + tvā → bhūtvā (but here Dīrgha applies instead because of the ktvā suffix environment — a Ch.6 duration alternation). वैश्वानरः: Vṛddhi derivation (ai from ai, Ch.6 Vṛddhi grade). The entire verse spans Ch.1 Guṇa/Vṛddhi Saṃjñā, Ch.3 Kṛt, and Ch.6 duration — the Bhagavad Gītā's grammar is a running demonstration of the Aṣṭādhyāyī."
      },
    ],
    levels:{
      easy:[
        {q:"Guṇa vowels:",opts:["आ ऐ औ","अ ए ओ","इ ई उ ऊ","ऋ ॠ"],ans:1,exp:"1.1.2: अ ए ओ = Guṇa."},
        {q:"Vṛddhi vowels:",opts:["अ ए ओ","इ ई उ","आ ऐ औ","ए ओ only"],ans:2,exp:"1.1.1: आ ऐ औ = Vṛddhi."},
      ],
      medium:[
        {q:"महा+ऋषि→महर्षि: rule used:",opts:["Guṇa only","Uraṇ Rapharaḥ 1.1.51","Vṛddhi","Vowel drop"],ans:1,exp:"No retroflex Guṇa exists → र् inserted after Guṇa vowel."},
      ],
      hard:[
        {q:"Vṛddhi as the FIRST sūtra signals:",opts:["Most common rule","Grammar begins with DEFINITIONS before operations — vocabulary before procedures","Tradition","Alphabetical order"],ans:1,exp:"The architecture: define vocabulary (Ch.1-2) before using it in operations (Ch.3-8)."},
      ],
    },
  },
  {
    id:7,num:"VII",title:"Varṇa Samāmnāya",
    subtitle:"Complete Sanskrit Sound Inventory · Phoneme Classes · Ayogavāha",
    icon:"🔤",color:"#0891B2",
    concepts:[
      {term:"9 Svara — Core Vowels",meaning:"अ इ उ ऋ ऌ + four diphthongs ए ऐ ओ औ = 9 core vowel phonemes.",example:"Short: अ इ उ ऋ ऌ · Long: आ ई ऊ ॠ · Diphthongs: ए ऐ ओ औ",cat:"phonetics",sutra:""},
      {term:"5 Varga — 25 Stop Consonants",meaning:"Five rows of 5 consonants organized by place of articulation. Each row = same Sthāna, varying in voicing and aspiration.",example:"क-वर्ग(guttural) · च-वर्ग(palatal) · ट-वर्ग(cerebral) · त-वर्ग(dental) · प-वर्ग(labial)",cat:"varga",sutra:""},
      {term:"4 Antaḥstha — Semivowels",meaning:"य र ल व — sounds between vowels and consonants. Abhyantara Prayatna = Īṣat-spṛṣṭa (slight contact).",example:"य=palatal · र=cerebral · ल=dental lateral · व=labial semivowel",cat:"phonetics",sutra:""},
      {term:"4 Ūṣma — Fricatives",meaning:"श ष स ह — 'warm' sounds (ūṣman=heat/friction). Each at a distinct sthāna.",example:"श=palatal · ष=cerebral · स=dental · ह=guttural fricative",cat:"phonetics",sutra:""},
      {term:"Ayogavāha — Non-Independent Sounds",meaning:"Sounds without own fixed Sthāna: Anusvāra (ं), Visarga (ः), Jihvāmūlīya, Upadhmānīya. Inherit Sthāna from host sound.",example:"रामं — Anusvāra takes nasal class of next consonant · देवः — Visarga",cat:"phonetics",sutra:""},
    ],
    quiz:[
      {q:"Core vowel phonemes in Sanskrit:",opts:["5","7","9","14"],ans:2,exp:"9 core vowels: a i u ṛ ḷ e ai o au."},
      {q:"Four Antaḥstha (semivowels):",opts:["क ग न","य र ल व","श ष स ह","ए ओ ऐ औ"],ans:1,exp:"य र ल व = Antaḥstha."},
      {q:"5 Vargas × 5 consonants =",opts:["20","25","30","35"],ans:1,exp:"25 stop consonants covering all 5 places of articulation."},
      {q:"Ayogavāha sounds are special because:",opts:["Most complex articulation","Lack independent Sthāna — inherit from surrounding context","Always long","Only Vedic"],ans:1,exp:"Ayogavāha = 'going without a yoke' — phonetically floating, they take the Sthāna of their environment."},
    ],
    vedic:[
      {
        dev:"ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।",
        roman:"īśāvāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat",
        trans:"All this — whatever exists in this moving world — is to be clothed in (pervaded by) the Lord.",
        source:"Īśāvāsyopaniṣad 1 — the opening verse of the Upaniṣad",
        rel:"This single verse engages all 5 Sthānas (Ch.5/Ch.7): ईश=Kaṇṭha(guttural)+Tālu; वास्य=Oṣṭha(labial)+Danta; सर्व=Danta+Mūrdhā; जगत्=Tālu+Kaṇṭha+Danta. The vowel inventory (Ch.7): इ(palatal), आ(guttural), अ(guttural), उ(labial) all appear. ईशावास्यम्: Ch.2 Yaṇ sandhi (ā+ā→ā, Sāvarṇadīrgha). इदम्+सर्वम्: Visarga sandhi (Ch.2). The entire phoneme inventory of Ch.7 is acoustically present — this verse IS the Varṇa-Samāmnāya embodied."
      },
      {
        dev:"अग्निर्मूर्धा दिवः ककुत् पतिः पृथिव्या अयम् ।",
        roman:"agnir mūrdhā divaḥ kakut patiḥ pṛthivyā ayam",
        trans:"Agni is the head of heaven, the summit; he is the lord of this earth.",
        source:"Ṛgveda 8.44.16 — hymn to Agni",
        rel:"This verse is a Sthāna-tour: अ+ग्(Kaṇṭha/guttural), न्(Danta/nasal), र्(Mūrdhā/cerebral), म्(Oṣṭha/labial), ध्(Danta), ह्(Kaṇṭha/guttural Ūṣma), द्(Danta), व्(Oṣṭha), क्(Kaṇṭha), त्(Danta), प्(Oṣṭha), पृ(Mūrdhā/ṛ-vowel Ch.7), थ्(Danta), य(Tālu). All 5 Sthānas and all Varṇa-classes (Svara, Varga, Antaḥstha, Ūṣma) from Ch.7 appear in 10 words. The Ṛgveda was composed with full phonemic consciousness — the system Ch.7 describes was the compositional framework."
      },
      {
        dev:"यो वाचं विदधाति सर्वदा ।",
        roman:"yo vācaṃ vidadhāti sarvadā",
        trans:"Who gives / dispenses speech always.",
        source:"Ṛgveda 10.125.3 (Devī Sūkta — Vāc speaking of herself)",
        rel:"वाचम् = वाच् (root √वच् with Kṛt Ch.3 nominal) + accusative ending (Su-vibhakti, Ch.8). वाच् ends in 'च्' — palatal (Tālu Sthāna, Ch.5/Ch.7). विदधाति = वि + √धा + लट् (Ch.3 Sārvadhatuka) + 3rd sg Tiṅ. The Devī Sūkta is Speech (Vāc) describing herself — the goddess of language describing the phoneme-inventory (Ch.7) through the grammar (Ch.1-6) that structures her own utterances. The speaker IS the spoken."
      },
      {
        dev:"चत्वारि शृङ्गा त्रयो अस्य पादा द्वे शीर्षे सप्त हस्तासो अस्य ।",
        roman:"catvāri śṛṅgā trayo asya pādā dve śīrṣe sapta hastāso asya",
        trans:"Four horns, three feet, two heads, seven hands — thus is this bull (Speech).",
        source:"Ṛgveda 4.58.3 — the famous 'Bull of Speech' verse",
        rel:"This is the Ṛgveda's own description of the Sanskrit phoneme system (Ch.7): 'four horns' = 4 sound classes (Svara/vowels, Sparśa/stops, Antaḥstha/semivowels, Ūṣma/fricatives); 'three feet' = 3 durations Hrasva/Dīrgha/Pluta (Ch.6); 'two heads' = 2 voices Parasmaipada/Ātmanepada (Ch.3 Pada-Nirṇaya); 'seven hands' = 7 vibhaktis (cases, Ch.8). Ancient Vedic seers encoded the entire grammatical system in one verse about Speech as a cosmic Bull. Ch.7 Varṇa inventory is explicitly metaphored here."
      },
      {
        dev:"अनित्यं हि स्थितं सर्वं स्वरूपेण स्वरः स्मृतः ।",
        roman:"anityaṃ hi sthitaṃ sarvaṃ svarūpeṇa svaraḥ smṛtaḥ",
        trans:"All that exists is impermanent; a vowel is remembered by its own form/nature.",
        source:"Vyākaraṇa-śāstra traditional verse on Svara (vowel) definition",
        rel:"This verse defines Svara (vowel, Ch.7) as self-luminous — a vowel can be pronounced alone, while consonants (Vyañjana/Sparśa) need a vowel to be heard. This is the phonetic foundation of Ch.7's vowel/consonant distinction. स्वर = स्व+र (self+sound): the word itself encodes the definition. स्वरूपेण: Ch.2 instrumental sandhi. The philosophical claim (all is impermanent) and the grammatical claim (vowels are self-standing) are stated in the same breath — grammar and Vedānta share the same language."
      },
      {
        dev:"शं नो देवीरभिष्टय आपो भवन्तु पीतये ।",
        roman:"śaṃ no devīr abhiṣṭaya āpo bhavantu pītaye",
        trans:"May the divine waters be auspicious to us for drinking and for invigoration.",
        source:"Ṛgveda 10.9.4 / Taittirīya Āraṇyaka — Āpo Hīṣṭhā hymn",
        rel:"भवन्तु = √भू + लोट् (Ch.3 Sārvadhatuka) + Vikaraṇa शप् + 3rd plural Tiṅ 'antu'. Here the full phoneme inventory engages: भ(Oṣṭha/voiced), व(Oṣṭha/semivowel — Antaḥstha class Ch.7), न्(Danta/nasal), त(Danta/stop — Tavarga Ch.7), उ(Oṣṭha/vowel). पीतये: दीर्घ ई (Ch.6) + Kṛt suffix. देवीः: ई = Dīrgha palatal vowel (Ch.6 + Ch.7). The 5 Varga stop classes (Ch.7) and 4 Antaḥstha semivowels (Ch.7) and Ūṣma fricatives (Ch.7) all appear in this eight-word peace-invocation that has been recited before every yajña for 3000 years."
      },
      {
        dev:"अयुर्दा अग्ने हविषा वृधान आयुर्यज्ञेन नमसा विधेम ।",
        roman:"āyurdā agne haviṣā vṛdhāna āyur yajñena namasā vidhema",
        trans:"O Agni, life-giver, growing by oblations — may we attend thee with lifespan, sacrifice, and reverence.",
        source:"Ṛgveda 1.31.2 — Agni Sūkta",
        rel:"हविषा = हविस् + instrumental: 'स्' (dental Ūṣma, Ch.7) + sandhi. वृधान = √वृध् + Kṛt आन (Ch.3 present participle) + Ātmanepada form. The root √वृध् contains ṛ-vowel (Hrasva Ch.6) at Mūrdhā Sthāna (Ch.5/Ch.7). विधेम = वि + √धा + लिङ् (Ārdhadhatuka Ch.3) + 1st plural: Guṇa of ā→e (Ch.6/Ch.1 Guṇa Saṃjñā). हविस्: 'ष्' is a cerebral Ūṣma (Ch.7) — appears because 'हु' root has Mūrdhā influence (Natva/Sattva Ch.3 inner operations). Six chapters converge in one Vedic hemistich about offering."
      },
    ],
    levels:{
      easy:[
        {q:"Core vowels in Sanskrit:",opts:["5","7","9","12"],ans:2,exp:"9 core vowels."},
        {q:"Semivowels (Antaḥstha):",opts:["क ग न","य र ल व","श ष स ह","ए ओ ऐ औ"],ans:1,exp:"य र ल व."},
      ],
      medium:[
        {q:"Ūṣma sounds are:",opts:["Stop consonants","Fricatives: श ष स ह","Semivowels","Vowels"],ans:1,exp:"Ūṣman = heat/friction. श ष स ह are Sanskrit's four fricatives."},
      ],
      hard:[
        {q:"Why are Ayogavāha called 'non-independent'?",opts:["They are short","They phonetically anchor to context — no independent vocal-tract configuration","Always silent","Script-based"],ans:1,exp:"Their Sthāna is inherited, not intrinsic — 'going without their own yoke.'"},
      ],
    },
  },
  {
    id:8,num:"VIII",title:"Dhātu & Pratyaya",
    subtitle:"~2000 Verbal Roots · Suffixes · Morphology of Sanskrit Words",
    icon:"🌿",color:"#DB2777",
    concepts:[
      {term:"धातु (Dhātu) — Verbal Root",meaning:"The minimal meaningful unit underlying all verbs. ~2000 roots listed in Pāṇini's Dhātupāṭha, each with inherent meaning, accent, and class.",example:"√भू (to be) · √कृ (to do) · √गम् (to go) · √वद् (to speak)",cat:"morphology",sutra:"1.3.1"},
      {term:"प्रत्यय (Pratyaya) — Suffix",meaning:"Any suffix appended to a root or nominal base. परश्च (3.1.1) — always follows. Carries It-markers that silently direct sandhi and substitution rules.",example:"क्त→past participle: गत · भूत · कृत · उक्त",cat:"morphology",sutra:"3.1.1"},
      {term:"10 Lakāra — Tense-Mood Markers",meaning:"Ten abstract markers for tense and mood. Each starts with ल (La). Real endings derived from these by subsequent rules.",example:"लट्=Present · लिट्=Perfect · लुट्=1st Future · लोट्=Imperative · लिङ्=Optative",cat:"process",sutra:"3.2.123"},
      {term:"18 Tiṅ — Verbal Endings",meaning:"18 personal endings: 9 Parasmaipada (active) + 9 Ātmanepada (middle) × 3 persons × 3 numbers.",example:"पठ+ति=he reads · पठ+न्ति=they read · पठ+सि=you read · पठ+मि=I read",cat:"morphology",sutra:"3.4.77"},
      {term:"22 Upasarga — Verbal Prefixes",meaning:"Pre-verbal particles that modify root meaning. Counted in 1.4.59. Same root + different upasarga = different meaning.",example:"√गम्: प्र+गम्=go forward · अप+गम्=go away · उप+गम्=approach · नि+गम्=enter",cat:"upasarga",sutra:"1.4.59"},
      {term:"Parasmai vs Ātmanepada",meaning:"Two voice paradigms: Parasmaipada (action for another) and Ātmanepada (action for oneself). Some roots take both (Ubhayapadin).",example:"√पच्: पचति (Parasmai) vs पचते (Ātmane, cooks for himself)",cat:"morphology",sutra:"1.3.12"},
    ],
    quiz:[
      {q:"Dhātupāṭha lists approximately:",opts:["500 roots","1000 roots","2000 roots","5000 roots"],ans:2,exp:"~2000 verbal roots listed with class, meaning, and accent."},
      {q:"How many Lakāras?",opts:["6","8","10","12"],ans:2,exp:"10 Lakāras — abstract tense-mood codes."},
      {q:"18 Tiṅ endings cover:",opts:["3 persons only","3 persons × 3 numbers × 2 padas = 18","Present tense only","Nominal forms"],ans:1,exp:"9 Parasmaipada + 9 Ātmanepada = 18 endings."},
      {q:"Upasargas are:",opts:["Case endings","Verbal prefixes that modify root meaning (1.4.59)","Nominal suffixes","Pitch accents"],ans:1,exp:"22 upasargas per 1.4.59 — meaning-transforming verbal prefixes."},
    ],
    vedic:[
      {
        dev:"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
        roman:"karmaṇy evādhikāras te mā phaleṣu kadācana · mā karmaphalaheturbhūr mā te saṅgo'stv akarmaṇi",
        trans:"Your entitlement is to action alone, never to the fruits thereof. Let not the fruit of action be your motive; nor let there be attachment to inaction.",
        source:"Bhagavad Gītā 2.47 — the most quoted Sanskrit śloka",
        rel:"कर्मणि = √कृ (Ch.8 Dhātu, the most fundamental root) + क्त (Kṛt Ch.3 past nominal) + 7th vibhakti. भूः = √भू + लोट् 2nd sg Parasmaipada — root √भू (Bhvadi Ajanta Ch.3) + Vikaraṇa Śap + Tiṅ 'hi' (becomes ø by Lopa). अस्तु = √अस् + लोट् — Adadi/Ananta class (Ch.3 Ananta: Vikaraṇa dropped by Luk). अकर्मणि = negation prefix + कर्मन् (same Kṛt base). This one śloka: Ch.1 Saṃjñā (Lopa of hi), Ch.2 Sandhi (karmaphala+hetu+r+bhūḥ), Ch.3 Pratyaya (Kṛt, Sārvadhatuka/Ārdhadhatuka, Ajanta/Ananta), Ch.6 Vowel (bhū→bhava Guṇa), Ch.8 Dhātu (√kṛ, √bhū, √as). All eight chapters in one verse."
      },
      {
        dev:"सत्यं ज्ञानमनन्तं ब्रह्म ।",
        roman:"satyaṃ jñānam anantaṃ brahma",
        trans:"Brahman is Truth, Knowledge, Infinite.",
        source:"Taittirīya Upaniṣad 2.1.1 — the great definition of Brahman",
        rel:"ज्ञानम् = √ज्ञा (Ch.8 Dhātu: to know) + ल्युट् (Kṛt Ch.3: action noun suffix) → jñā+na+m. The root √ज्ञा has Ā-vowel (Dīrgha, Ch.6). सत्यम् = √अस् + क्त्यन् (Kṛt) → 'sat' + 'ya' (Sārvadhatuka Vikaraṇa process, Ch.3) → satya. अनन्तम् = अन् (negative prefix, related to Upasarga Ch.8) + अन्त (end) — the prefix system demonstrated. Ch.1 Saṃjñā underlies each, Ch.2 Sandhi joins them (satyam+jñānam: m stays as anusvāra before 'jñ'), Ch.3 Kṛt derives the nouns, Ch.8 roots provide the foundation. The definition of the Infinite uses finite grammatical tools."
      },
      {
        dev:"तत्त्वमसि ।",
        roman:"tat tvam asi",
        trans:"That thou art.",
        source:"Chāndogya Upaniṣad 6.8.7 — the great Mahāvākya",
        rel:"असि = √अस् (Ch.8 Dhātu: to be) + लट् (Sārvadhatuka, Ch.3) + 2nd sg Parasmaipada Tiṅ 'si'. Root √अस् is Adadi class (Ananta: Vikaraṇa dropped by Luk, Ch.3). No Vikaraṇa means no Ajanta 'a'-ending stem. त्वम् = nominative of 'tvad' (pronoun — not a verbal root, but a Pratipadika, Ch.8). तत् = that (pronoun Pratipadika). The most famous three-word philosophical statement in world literature: two Pratipadikas (Ch.8 nominal) + one Tinanta verb (Ch.3 Tiṅ on Ch.8 Dhātu). The Upaniṣad's deepest truth stated through the simplest grammar."
      },
      {
        dev:"अहं ब्रह्मास्मि ।",
        roman:"ahaṃ brahmāsmi",
        trans:"I am Brahman.",
        source:"Bṛhadāraṇyaka Upaniṣad 1.4.10 — the second great Mahāvākya",
        rel:"अस्मि = √अस् (Ch.8 Dhātu) + लट् (Sārvadhatuka Ch.3) + 1st sg Parasmaipada 'mi'. ब्रह्म+अस्मि → ब्रह्मास्मि: Ch.2 Sāvarṇadīrgha (a+a→ā). अहम्: anusvāra before 'ब्' takes labial nasal (Ch.2 Parasavarṇa, Ch.7 Oṣṭha Sthāna). This four-syllable Mahāvākya: Ch.7 Varṇa inventory (all four Oṣṭha+Kaṇṭha+Danta sounds), Ch.2 Sandhi, Ch.3 Tiṅ, Ch.8 √अस् Dhātu. The assertion 'I AM Brahman' uses the most primal Dhātu √अस् — to be. The Upaniṣad chose the verb 'be' for a reason: √अस् is the foundation of all existence and all grammar."
      },
      {
        dev:"प्रज्ञानं ब्रह्म ।",
        roman:"prajñānaṃ brahma",
        trans:"Consciousness is Brahman.",
        source:"Aitareya Upaniṣad 3.3 — the third Mahāvākya",
        rel:"प्रज्ञानम् = प्र (Upasarga/prefix, Ch.8: 22 Upasargas per 1.4.59) + √ज्ञा (Dhātu Ch.8: to know) + ल्युट् (Kṛt Ch.3: abstract noun suffix) → pra+jñā+na+m. The prefix 'प्र' (forward, intensely) modifies √ज्ञā's meaning from 'know' to 'know supremely/consciousness.' This is the Upasarga mechanism (Ch.8): same root + different prefix = different meaning. All four Mahāvākyas together demonstrate: Ch.8 Dhātu (√अस्, √ज्ञा, √कृ) + Ch.8 Upasarga (प्र, वि, अव) + Ch.3 Kṛt/Tiṅ = the four grand utterances that constitute Advaita Vedānta."
      },
      {
        dev:"यो वै भूमा तत्सुखम् नाल्पे सुखमस्ति ।",
        roman:"yo vai bhūmā tat sukham · nālpe sukham asti",
        trans:"That which is infinite — that is happiness. There is no happiness in the finite.",
        source:"Chāndogya Upaniṣad 7.23.1",
        rel:"भूमा = √भू (Ch.8 Dhātu: to be/become/exist) + मन् (Kṛt suffix Ch.3: forming abstract nouns) → bhūman (infinitude). The same root √भू that makes 'भवतु' (let there be, Ch.3 Sārvadhatuka example) also generates 'भूमन्' — infinite being — through a different Kṛt suffix. अस्ति = √अस् (Ch.8) + Tiṅ 3rd sg. न+अल्पे → नाल्पे: Ch.2 Sāvarṇadīrgha. This verse demonstrates how one Dhātu (√भू) generates both the most commonplace verb (bhavati, 'it exists') and the most exalted philosophical concept (bhūman, 'the Infinite') — entirely through the Pratyaya system of Ch.3 operating on Ch.8 Dhātu."
      },
      {
        dev:"विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥",
        roman:"vidyā dadāti vinayaṃ vinayād yāti pātratām · pātratvād dhanam āpnoti dhanād dharmaṃ tataḥ sukham",
        trans:"Knowledge gives humility; from humility one attains worthiness; from worthiness one acquires wealth; from wealth comes dharma; from that, happiness.",
        source:"Hitopadeśa — the most beloved Sanskrit proverb",
        rel:"This śloka showcases ALL eight chapters: ददाति=√दा+Tiṅ(Ch.8+Ch.3); विनयम्=वि+√नी+Kṛt(Ch.8 Upasarga+Ch.3); याति=√या+Tiṅ (Ch.8 root Ch.3); पात्रताम्=Taddhita suffix (Ch.8 Nominal); आप्नोति=आ+√आप्+Vikaraṇa+Tiṅ (Svadi/Ananta class Ch.3, Ch.8); धर्मम्=√धृ+Kṛt 'man' suffix (Ch.3, Ch.8). विनयाद्+याति: Ch.2 Visarga sandhi (d+y→dy). विद्या=√विद्+Kṛt 'yā' (Ch.3). Every word is a grammar lesson; every grammar lesson leads to this verse. The śloka that is an invitation to study Sanskrit — itself proves that Sanskrit is worth studying."
      },
    ],
    levels:{
      easy:[
        {q:"√भू means:",opts:["To know","To be / become","To go","To speak"],ans:1,exp:"√भू = to be, to become."},
        {q:"Upasargas are:",opts:["Case endings","Verbal prefixes modifying root meaning","Noun suffixes","Pitch accents"],ans:1,exp:"22 Upasargas per 1.4.59."},
        {q:"लट् Lakāra indicates:",opts:["Perfect","Present tense","Future","Imperative"],ans:1,exp:"लट् = Present tense (vartamāna)."},
      ],
      medium:[
        {q:"Ātmanepada endings used when:",opts:["Action benefits another","Action benefits the agent (reflexive)","Past tense only","Intransitive only"],ans:1,exp:"Ātmane = 'for oneself.' Used when action primarily benefits the agent."},
      ],
      hard:[
        {q:"It-markers on Pratyayas serve to:",opts:["Decorate","Silently direct phonological/accentual rules without appearing in output","Change root meaning","Indicate number"],ans:1,exp:"Pratyaya It-markers are operational guides — trigger sandhi, substitution, and accent rules, then disappear by lopa."},
      ],
    },
  },
];

/* ── UTILITIES ──────────────────────────────────────────────────────── */
function cleanTitle(t) { return t.replace(/\s*\([^)]*\)/g,"").replace(/\s+[—–].*$/,"").trim(); }
function getSubchapters(ch) { return ch.concepts.map((c,i)=>({id:`${ch.id}.${i+1}`,title:cleanTitle(c.term),concept:c})); }

/* ── MICRO COMPONENTS ───────────────────────────────────────────────── */
function ProgressBar({value,max,color,h=5}){
  const pct=max>0?Math.min(100,Math.round((value/max)*100)):0;
  return(<div className="pbar" style={{height:h}}>
    <div className="pbar-fill pbar-fill--static" style={{width:`${pct}%`,height:h,background:`linear-gradient(90deg,${color}88,${color})`}}/>
  </div>);
}
function CatTag({cat}){
  const c=CC[cat]||"var(--gold-vivid)";
  return <span className="tag" style={{color:c,borderColor:`${c}44`,background:`${c}10`,fontSize:9}}>{cat}</span>;
}
function SutraRef({sutra}){
  if(!sutra) return null;
  return <span className="sutra-ref">📜 {sutra}</span>;
}

/* ── THEME TOGGLE ───────────────────────────────────────────────────── */
function ThemeToggle({theme,onToggle}){
  return(
    <div className="theme-toggle" role="group" aria-label="Theme selector">
      <button className={`theme-toggle-btn${theme==="light"?" active":""}`} onClick={()=>onToggle("light")} aria-label="Light mode" title="Light mode">☀️</button>
      <button className={`theme-toggle-btn${theme==="system"?" active":""}`}
        onClick={()=>{ const s=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"; onToggle(s); }}
        aria-label="System theme" title="System theme">🖥️</button>
      <button className={`theme-toggle-btn${theme==="dark"?" active":""}`} onClick={()=>onToggle("dark")} aria-label="Dark mode" title="Dark mode">🌙</button>
    </div>
  );
}

/* ── FLASHCARD ──────────────────────────────────────────────────────── */
function FlipCard({concept,index}){
  const [flipped,setFlipped]=useState(false);
  const c=CC[concept.cat]||"var(--gold-vivid)";
  return(
    <div className="fc-wrap anim-fade-up" style={{animationDelay:`${index*0.06}s`}}
      onClick={()=>setFlipped(x=>!x)} role="button" tabIndex={0}
      onKeyDown={e=>e.key==="Enter"&&setFlipped(x=>!x)}
      aria-label={`Flashcard: ${concept.term}`}>
      <div className={`fc-inner${flipped?" flipped":""}`}>
        <div className="fc-face fc-front">
          <div className="fc-hint">tap to reveal</div>
          <div className="fc-term">{concept.term}</div>
          {concept.sutra&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-muted)",marginTop:6}}>Sūtra {concept.sutra}</div>}
          <div style={{marginTop:12,display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap"}}>
            <CatTag cat={concept.cat}/>
          </div>
          <div style={{marginTop:10,fontSize:10,color:"var(--text-faint)"}}>click to flip ↺</div>
        </div>
        <div className="fc-face fc-back">
          <div className="fc-hint" style={{color:c}}>meaning</div>
          <div style={{fontSize:13,color:"var(--text-primary)",lineHeight:1.7,marginBottom:12,textAlign:"center"}}>{concept.meaning}</div>
          <div className="concept-example" style={{borderLeft:`3px solid ${c}`,fontSize:13}}>{concept.example}</div>
          <div style={{marginTop:10,fontSize:10,color:"var(--text-faint)"}}>click to flip back ↺</div>
        </div>
      </div>
    </div>
  );
}

/* ── QUIZ ───────────────────────────────────────────────────────────── */
function QuizView({chapter,onScore}){
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const questions=chapter.quiz;
  const cur=questions[qi];

  function choose(i){ if(answered)return; setSel(i); setAnswered(true); if(i===cur.ans)setScore(s=>s+1); }
  function next(){
    const ns=score+(sel===cur.ans?1:0);
    if(qi+1>=questions.length){setDone(true);onScore?.(ns,questions.length);}
    else{setQi(q=>q+1);setSel(null);setAnswered(false);}
  }
  function reset(){setQi(0);setSel(null);setAnswered(false);setScore(0);setDone(false);}

  if(done){
    const pct=Math.round((score/questions.length)*100);
    const passed=pct>=75;
    return(
      <div className="score-wrap anim-scale-in">
        <div className="score-circle" style={{borderColor:passed?"var(--teal)":"var(--saffron)"}}>
          <div className="score-num" style={{color:passed?"var(--teal)":"var(--saffron)"}}>{pct}%</div>
          <div style={{fontSize:10,color:"var(--text-muted)",letterSpacing:"0.06em"}}>{score}/{questions.length}</div>
        </div>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:22,marginBottom:8}}>{passed?"✨ Excellent!":"Keep going!"}</h3>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>{passed?"Chapter mastered — XP logged.":`Need ≥75%. Got ${pct}%.`}</p>
        <button className="btn btn-primary" onClick={reset}>🔄 Try again</button>
      </div>
    );
  }
  return(
    <div className="quiz-wrap anim-fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,fontSize:12,color:"var(--text-muted)"}}>
        <span style={{fontFamily:"var(--font-mono)"}}>Q {qi+1} / {questions.length}</span>
        <span className="badge badge-gold">Score: {score}</span>
      </div>
      <div style={{height:3,background:"var(--border-faint)",borderRadius:3,marginBottom:18,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(qi/questions.length)*100}%`,background:"linear-gradient(90deg,var(--gold-mid),var(--gold-vivid))",transition:"width 0.4s",borderRadius:3}}/>
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-opts">
        {cur.opts.map((opt,i)=>(
          <button key={i}
            className={`quiz-opt${sel===i?(i===cur.ans?" correct":" wrong"):""}${answered&&i===cur.ans&&sel!==i?" correct":""}`}
            onClick={()=>choose(i)} disabled={answered}>
            <span className="quiz-letter" style={{color:sel===i?(i===cur.ans?"var(--teal)":"var(--saffron)"):"var(--text-muted)"}}>
              {String.fromCharCode(65+i)}
            </span>
            <span style={{fontFamily:"var(--font-dev)",fontSize:14}}>{opt}</span>
          </button>
        ))}
      </div>
      {answered&&(
        <div className="quiz-exp anim-fade-in">
          <strong style={{color:sel===cur.ans?"var(--teal)":"var(--saffron)"}}>{sel===cur.ans?"✅ Correct!":"❌ Not quite."}</strong> {cur.exp}
        </div>
      )}
      {answered&&<button className="btn btn-primary btn-w" onClick={next} style={{marginTop:4}}>{qi+1>=questions.length?"See results →":"Next →"}</button>}
    </div>
  );
}

/* ── LEVEL TEST ─────────────────────────────────────────────────────── */
function LevelTest({chapter,onXP,levelBadges,onBadge}){
  const [level,setLevel]=useState(null);
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const questions=level?(chapter.levels?.[level]||[]):[];
  const cur=questions[qi];
  const xpMap={easy:10,medium:20,hard:40};
  const colorMap={easy:"var(--teal)",medium:"var(--gold-vivid)",hard:"var(--saffron)"};

  function choose(i){if(answered)return;setSel(i);setAnswered(true);if(i===cur.ans)setScore(s=>s+1);}
  function next(){
    const ns=score+(sel===cur.ans?1:0);
    if(qi+1>=questions.length){setDone(true);onXP?.(ns*xpMap[level]);onBadge?.(chapter.id,level);}
    else{setQi(q=>q+1);setSel(null);setAnswered(false);}
  }
  function reset(){setLevel(null);setQi(0);setSel(null);setAnswered(false);setScore(0);setDone(false);}

  if(!level){
    const lvls=[
      {id:"easy",icon:"🌱",name:"Beginner",xp:xpMap.easy,color:"var(--teal)",q:chapter.levels?.easy?.length||0},
      {id:"medium",icon:"⚡",name:"Intermediate",xp:xpMap.medium,color:"var(--gold-vivid)",q:chapter.levels?.medium?.length||0},
      {id:"hard",icon:"🔥",name:"Advanced",xp:xpMap.hard,color:"var(--saffron)",q:chapter.levels?.hard?.length||0},
    ];
    return(
      <div className="anim-fade-up">
        <div style={{marginBottom:18}}>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:5}}>🏆 Mastery Test</h3>
          <p style={{fontSize:13,color:"var(--text-muted)"}}>Choose difficulty to earn XP and unlock a badge.</p>
        </div>
        <div className="level-grid">
          {lvls.map(l=>{
            const earned=levelBadges?.[chapter.id]?.includes(l.id);
            return(
              <button key={l.id} className={`level-card${earned?" earned":""}`}
                style={{"--accent-color":`${l.color}14`}}
                onClick={()=>l.q>0&&setLevel(l.id)}>
                <div className="level-icon">{earned?"🥇":l.icon}</div>
                <div className="level-name" style={{color:l.color}}>{l.name}</div>
                <div className="level-desc">{l.q} questions · {l.xp}XP each</div>
                {earned&&<div style={{fontSize:10,color:l.color,fontWeight:700,marginTop:6}}>Badge earned ✓</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if(done){
    const xp=score*xpMap[level];
    return(
      <div className="score-wrap anim-scale-in">
        <div className="score-circle" style={{borderColor:colorMap[level]}}>
          <div className="score-num" style={{color:colorMap[level]}}>{xp}</div>
          <div style={{fontSize:10,color:"var(--text-muted)",letterSpacing:"0.08em",textTransform:"uppercase"}}>XP Earned</div>
        </div>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:22,marginBottom:8}}>
          🥇 {level.charAt(0).toUpperCase()+level.slice(1)} Badge!
        </h3>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>{score}/{questions.length} correct</p>
        <button className="btn btn-ghost btn-sm" onClick={reset}>Try another level</button>
      </div>
    );
  }
  return(
    <div className="quiz-wrap anim-fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button className="btn btn-ghost btn-sm" onClick={reset}>← Back</button>
        <span style={{fontSize:12,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{level} · Q{qi+1}/{questions.length}</span>
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-opts">
        {cur.opts.map((opt,i)=>(
          <button key={i}
            className={`quiz-opt${sel===i?(i===cur.ans?" correct":" wrong"):""}${answered&&i===cur.ans&&sel!==i?" correct":""}`}
            onClick={()=>choose(i)} disabled={answered}>
            <span className="quiz-letter">{String.fromCharCode(65+i)}</span>
            <span style={{fontFamily:"var(--font-dev)",fontSize:14}}>{opt}</span>
          </button>
        ))}
      </div>
      {answered&&<div className="quiz-exp anim-fade-in"><strong style={{color:sel===cur.ans?"var(--teal)":"var(--saffron)"}}>{sel===cur.ans?"✅ Correct!":"❌ Not quite."}</strong> {cur.exp}</div>}
      {answered&&<button className="btn btn-primary btn-w" onClick={next} style={{marginTop:4}}>{qi+1>=questions.length?"Finish →":"Next →"}</button>}
    </div>
  );
}

/* ── VEDIC VIEW ─────────────────────────────────────────────────────── */
function VedicView({vedic}){
  if(!vedic?.length) return(
    <div style={{textAlign:"center",padding:"48px 24px",color:"var(--text-muted)"}}>
      <div style={{fontSize:44,marginBottom:12}}>📜</div>
      <p>No Vedic sources for this chapter yet.</p>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {vedic.map((v,i)=>(
        <div key={i} className={`vedic-card anim-fade-up d${i+1}`}>
          <div className="vedic-dev">{v.dev}</div>
          <div className="vedic-roman">{v.roman}</div>
          <div className="vedic-trans">"{v.trans}"</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:v.rel?10:0}}>
            <span className="vedic-source">📚 {v.source}</span>
          </div>
          {v.rel&&<div className="vedic-conn">💡 {v.rel}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── CHAPTER DETAIL ─────────────────────────────────────────────────── */
function ChapterDetail({ch,chapters,onBack,onNavigate}){
  const {scores,completed,recordScore,recordLevelBadge,addXP,levelBadges}=useProgress();
  const [tab,setTab]=useState("concepts");
  const [activeSub,setActiveSub]=useState(null);
  const isDone=completed?.has?.(ch.id);
  const chScore=scores?.[ch.id]||0;
  const subs=getSubchapters(ch);
  const chIdx=chapters.findIndex(c=>c.id===ch.id);
  const prevCh=chIdx>0?chapters[chIdx-1]:null;
  const nextCh=chIdx<chapters.length-1?chapters[chIdx+1]:null;
  const TABS=[
    {k:"concepts",label:"📖 Learn",count:ch.concepts.length},
    {k:"flashcards",label:"🎴 Flashcards",count:null},
    {k:"quiz",label:"⚡ Quiz",count:ch.quiz.length},
    {k:"test",label:"🏆 Mastery",count:null},
    {k:"vedic",label:"📜 Sources",count:ch.vedic?.length},
    {k:"watch",label:"🎬 Watch",count:null},
  ];
  function jumpTo(id){
    setTab("concepts");setActiveSub(id);
    setTimeout(()=>{ document.getElementById(`sub-${id}`)?.scrollIntoView({behavior:"smooth",block:"start"}); },80);
  }
  return(
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-label">Subchapters</div>
        {subs.map(sub=>(
          <button key={sub.id} className={`sidebar-item${activeSub===sub.id?" active":""}`} onClick={()=>jumpTo(sub.id)}>
            <span className="sidebar-item-icon" style={{color:ch.color,fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700}}>{sub.id}</span>
            <span className="sidebar-item-text">{sub.title}</span>
          </button>
        ))}
        <div className="divider"/>
        <div className="sidebar-label">Navigate</div>
        {prevCh&&<button className="sidebar-item" onClick={()=>onNavigate(prevCh)}><span className="sidebar-item-icon">←</span><span className="sidebar-item-text" style={{fontSize:11}}>{prevCh.title}</span></button>}
        {nextCh&&<button className="sidebar-item" onClick={()=>onNavigate(nextCh)}><span className="sidebar-item-icon" style={{color:nextCh.color}}>→</span><span className="sidebar-item-text" style={{fontSize:11}}>{nextCh.title}</span></button>}
      </aside>
      <div className="main-content">
        <div className="content-inner">
          <div className="breadcrumb anim-fade-in">
            <button className="breadcrumb-btn" onClick={onBack}>All Chapters</button>
            <span>›</span>
            <span style={{color:ch.color,fontWeight:600}}>{ch.icon} {ch.title}</span>
          </div>
          <div className="ch-hero anim-fade-up">
            <div style={{width:54,height:54,borderRadius:"var(--r-md)",background:`${ch.color}14`,border:`2px solid ${ch.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:14,transition:"transform 0.3s var(--ease-spring)",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.10) rotate(-5deg)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0deg)"}>{ch.icon}</div>
            <div className="label-caps" style={{color:ch.color,marginBottom:6}}>Chapter {ch.num}</div>
            <h1 style={{fontSize:"clamp(18px,3.5vw,28px)",marginBottom:7,lineHeight:1.2}}>{ch.title}</h1>
            <p style={{fontSize:14,color:"var(--text-muted)",marginBottom:14,maxWidth:520}}>{ch.subtitle}</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
              <span className="badge badge-gold">📚 {ch.concepts.length} concepts</span>
              <span className="badge badge-teal">❓ {ch.quiz.length} questions</span>
              {isDone&&<span className="badge badge-teal">✅ Mastered</span>}
              {chScore>0&&<span className="badge badge-gold">+{chScore*15} XP</span>}
            </div>
            {chScore>0&&<div style={{maxWidth:300}}><ProgressBar value={chScore} max={ch.quiz.length} color={ch.color} h={4}/></div>}
          </div>

          <div className="sub-pills">
            {subs.map(sub=>(
              <button key={sub.id}
                className={`sub-pill${activeSub===sub.id?" active":""}`}
                onClick={()=>jumpTo(sub.id)}
                style={activeSub===sub.id?{background:`${ch.color}12`,borderColor:`${ch.color}55`,color:ch.color}:{}}>
                <span style={{fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700,color:ch.color}}>{sub.id}</span>
                {sub.title}
              </button>
            ))}
          </div>

          <div className="tab-bar">
            {TABS.map(t=>(
              <button key={t.k} className={`tab-btn${tab===t.k?" active":""}`}
                onClick={()=>setTab(t.k)}
                style={tab===t.k?{color:ch.color,borderBottomColor:ch.color,background:`${ch.color}0d`}:{}}>
                {t.label}
                {t.count!=null&&<span style={{fontSize:10,background:"var(--surface-2)",padding:"1px 6px",borderRadius:"99px",marginLeft:4}}>{t.count}</span>}
              </button>
            ))}
          </div>

          {tab==="concepts"&&(
            <div style={{display:"flex",flexDirection:"column",gap:36}}>
              {subs.map((sub,si)=>(
                <section key={sub.id} id={`sub-${sub.id}`} className="sub-section">
                  <div className="sub-section-head">
                    <span className="sub-badge" style={{background:`${ch.color}10`,color:ch.color,borderColor:`${ch.color}44`}}>{sub.id}</span>
                    <div>
                      <h2 style={{fontSize:18,margin:0}}>{sub.title}</h2>
                      <div style={{fontSize:11,color:"var(--text-faint)",marginTop:2}}>Subchapter {sub.id}</div>
                    </div>
                  </div>
                  {(()=>{
                    const c=sub.concept;
                    const cc=CC[c.cat]||"var(--gold-vivid)";
                    return(
                      <div className="concept-card anim-fade-up" style={{borderLeftColor:cc}}
                        onMouseEnter={e=>{e.currentTarget.style.borderLeftWidth="5px";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderLeftWidth="3px";}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:7,marginBottom:8}}>
                          <h3 className="concept-term">{c.term}</h3>
                          <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap"}}>
                            <CatTag cat={c.cat}/><SutraRef sutra={c.sutra}/>
                          </div>
                        </div>
                        <p className="concept-meaning">{c.meaning}</p>
                        <div className="concept-example">{c.example}</div>
                      </div>
                    );
                  })()}
                </section>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginTop:8}}>
                <button className="card card-interactive" style={{padding:"14px 16px",textAlign:"left",border:"none",cursor:prevCh?"pointer":"not-allowed",opacity:prevCh?1:0.4,fontFamily:"var(--font-body)"}}
                  disabled={!prevCh} onClick={()=>prevCh&&onNavigate(prevCh)}>
                  <div className="label-caps" style={{marginBottom:5}}>← Previous</div>
                  <div style={{fontSize:13,fontWeight:700}}>{prevCh?`${prevCh.icon} ${prevCh.title}`:"Start of course"}</div>
                </button>
                <button className="card card-interactive" style={{padding:"14px 16px",textAlign:"left",border:`1.5px solid ${nextCh?.color||"var(--border-soft)"}44`,cursor:nextCh?"pointer":"not-allowed",opacity:nextCh?1:0.4,fontFamily:"var(--font-body)"}}
                  disabled={!nextCh} onClick={()=>nextCh&&onNavigate(nextCh)}>
                  <div className="label-caps" style={{color:nextCh?.color||"var(--text-muted)",marginBottom:5}}>Next →</div>
                  <div style={{fontSize:13,fontWeight:700}}>{nextCh?`${nextCh.icon} ${nextCh.title}`:"Course complete! 🎉"}</div>
                </button>
              </div>
            </div>
          )}

          {tab==="flashcards"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Click any card to flip and reveal the meaning.</p>
              <div className="fc-grid">{ch.concepts.map((c,i)=><FlipCard key={i} concept={c} index={i}/>)}</div>
            </div>
          )}

          {tab==="quiz"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Score ≥75% to mark chapter as mastered.</p>
              <div className="section-box">
                <QuizView chapter={ch} onScore={(s,t)=>recordScore?.(ch.id,s,t)}/>
              </div>
            </div>
          )}

          {tab==="test"&&(
            <div className="section-box">
              <LevelTest chapter={ch} onXP={addXP} levelBadges={levelBadges} onBadge={recordLevelBadge}/>
            </div>
          )}

          {tab==="vedic"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Vedic sūtras and verses connecting grammar to sacred tradition.</p>
              <VedicView vedic={ch.vedic}/>
            </div>
          )}

          {tab==="watch"&&(
            <div className="section-box" style={{textAlign:"center",padding:"44px 28px"}}>
              <div style={{fontSize:52,marginBottom:14}}>📺</div>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:24,marginBottom:8}}>Watch: {ch.title}</h3>
              <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.75,marginBottom:24,maxWidth:420,margin:"0 auto 24px"}}>
                Lectures by <strong style={{color:"var(--gold-vivid)"}}>Pushpa Dikshit</strong> · Aṣṭādhyāyī Sahajabodha series · Pauspi Prakriyā method
              </p>
              <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{textDecoration:"none",background:"linear-gradient(135deg,#FF0000,#CC0000)",boxShadow:"0 4px 20px rgba(255,0,0,0.22)"}}>
                ▶ Open YouTube Playlist
              </a>
              <div style={{marginTop:22,fontFamily:"var(--font-dev)",color:"var(--gold-vivid)",fontSize:20,opacity:0.65}}>ॐ पाणिनये नमः</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CHAPTERS SCREEN ────────────────────────────────────────────────── */
function ChaptersScreen({chapters,onOpen}){
  const {scores,completed}=useProgress();
  return(
    <div className="main-content">
      <div className="content-inner" style={{maxWidth:"100%"}}>
        <div style={{marginBottom:24}}>
          <div className="label-caps" style={{marginBottom:7}}>Curriculum</div>
          <h1 style={{fontSize:"clamp(22px,4vw,32px)",marginBottom:7}}>All Chapters</h1>
          <p style={{fontSize:14,color:"var(--text-muted)"}}>{chapters.length} modules · Pushpa Dikshit's Aṣṭādhyāyī Sahajabodha · Pauspi Prakriyā method</p>
        </div>
        <div className="ch-grid">
          {chapters.map((ch,idx)=>{
            const done=completed?.has?.(ch.id);
            const cs=scores?.[ch.id]||0;
            const subs=getSubchapters(ch);
            return(
              <button key={ch.id}
                className={`ch-card anim-fade-up d${Math.min(idx+1,6)}${done?" done":""}`}
                style={{"--ch-accent":ch.color,background:"var(--surface-0)"}}
                onClick={()=>onOpen(ch)}>
                <div className="ch-card-top">
                  <div className="ch-icon-wrap" style={{background:`${ch.color}10`,borderColor:`${ch.color}30`}}>
                    <span style={{fontSize:20}}>{ch.icon}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div className="ch-num" style={{color:ch.color}}>{ch.num} — Chapter {ch.id}</div>
                    <div className="ch-title">{ch.title}</div>
                  </div>
                  {done&&<span style={{fontSize:16,flexShrink:0}}>✅</span>}
                </div>
                <div className="ch-sub">{ch.subtitle}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"10px 0"}}>
                  {subs.slice(0,4).map(s=>(
                    <span key={s.id} className="tag" style={{color:ch.color,borderColor:`${ch.color}33`,background:`${ch.color}0c`,fontSize:9}}>{s.id}</span>
                  ))}
                  {subs.length>4&&<span className="tag" style={{color:"var(--text-muted)",borderColor:"var(--border-faint)",background:"var(--surface-1)",fontSize:9}}>+{subs.length-4}</span>}
                </div>
                <div className="ch-footer">
                  <span>📚 {ch.concepts.length}</span>
                  <span>❓ {ch.quiz.length} Qs</span>
                  {cs>0&&<span style={{color:ch.color,fontWeight:700}}>🏅 {cs*15}XP</span>}
                </div>
                {cs>0&&<div style={{marginTop:10}}><ProgressBar value={cs} max={ch.quiz.length} color={ch.color} h={3}/></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── GLOSSARY ───────────────────────────────────────────────────────── */
function GlossaryScreen({chapters,onOpen}){
  const [q,setQ]=useState("");
  const [catF,setCatF]=useState("all");
  const all=chapters.flatMap(ch=>ch.concepts.map(c=>({...c,chTitle:ch.title,chColor:ch.color,chapter:ch})));
  const cats=[...new Set(all.map(t=>t.cat))].sort();
  const filtered=all.filter(t=>{
    const mC=catF==="all"||t.cat===catF;
    const mQ=!q||t.term.toLowerCase().includes(q.toLowerCase())||t.meaning.toLowerCase().includes(q.toLowerCase());
    return mC&&mQ;
  });
  return(
    <div className="main-content">
      <div className="content-inner">
        <div style={{marginBottom:22}}>
          <div className="label-caps" style={{marginBottom:7}}>Reference</div>
          <h1 style={{fontSize:"clamp(20px,3.5vw,30px)",marginBottom:5}}>📖 Glossary</h1>
          <p style={{fontSize:13,color:"var(--text-muted)"}}>{all.length} terms · {chapters.length} chapters</p>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms, meanings, sūtras…"/>
        </div>
        <div className="filter-row">
          <button className={`filter-pill${catF==="all"?" active":""}`} onClick={()=>setCatF("all")}>All</button>
          {cats.map(c=><button key={c} className={`filter-pill${catF===c?" active":""}`} onClick={()=>setCatF(c===catF?"all":c)}>{c}</button>)}
        </div>
        <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:10}}>{filtered.length} results</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {filtered.map((t,i)=>{
            const cc=CC[t.cat]||"var(--gold-vivid)";
            return(
              <button key={i} className={`gloss-item anim-fade-up d${Math.min(i+1,6)}`}
                style={{borderLeftColor:cc}} onClick={()=>onOpen(t.chapter)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                  <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"var(--font-display)",fontSize:15,fontWeight:700,color:"var(--text-primary)"}}>{t.term}</span>
                    {t.sutra&&<span style={{fontSize:10,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>({t.sutra})</span>}
                  </div>
                  <CatTag cat={t.cat}/>
                </div>
                <div style={{fontSize:12,color:"var(--text-secondary)",marginBottom:5,lineHeight:1.6}}>{t.meaning}</div>
                <div style={{fontSize:12,color:cc,background:`${cc}0d`,padding:"3px 10px",borderRadius:6,display:"inline-block",fontFamily:"var(--font-dev)"}}>{t.example}</div>
                <div style={{fontSize:10,color:"var(--text-faint)",marginTop:5}}>→ {t.chTitle}</div>
              </button>
            );
          })}
          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"48px 24px",color:"var(--text-muted)"}}>
              <div style={{fontSize:40,marginBottom:10}}>🔍</div>
              <p>No terms match "{q}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PROGRESS SCREEN ────────────────────────────────────────────────── */
function ProgressScreen({chapters,onOpen}){
  const {scores,completed,totalXP,streak,syncing}=useProgress();
  const tc=chapters.length;
  const donePct=tc>0?Math.round(((completed?.size||0)/tc)*100):0;
  return(
    <div className="main-content">
      <div className="content-inner">
        <div style={{marginBottom:22}}>
          <div className="label-caps" style={{marginBottom:7}}>Your Journey</div>
          <h1 style={{fontSize:"clamp(20px,3.5vw,30px)",marginBottom:5}}>📈 Progress</h1>
          <div style={{fontSize:12,color:syncing?"var(--gold-vivid)":"var(--teal)"}}>{syncing?"⏳ Saving…":"✅ All progress saved"}</div>
        </div>
        <div className="prog-hero anim-fade-up">
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:20}}>
            {[{v:`${completed?.size||0}/${tc}`,l:"Chapters",c:"var(--gold-vivid)"},{v:`${totalXP||0} XP`,l:"Experience",c:"var(--teal)"},{v:`🔥 ${streak||0}`,l:"Streak",c:"var(--saffron)"},{v:`${donePct}%`,l:"Mastery",c:"var(--lotus)"}].map(s=>(
              <div key={s.l} className="stat-chip"><div className="stat-val" style={{color:s.c}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
            <span style={{fontWeight:600}}>Overall Mastery</span>
            <span style={{color:"var(--gold-vivid)",fontWeight:700}}>{donePct}%</span>
          </div>
          <div className="pbar" style={{height:8}}><div className="pbar-fill" style={{width:`${donePct}%`,height:8}}/></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {chapters.map(ch=>{
            const s=scores?.[ch.id]||0;
            const done=completed?.has?.(ch.id);
            const pct=ch.quiz.length>0?Math.round((s/ch.quiz.length)*100):0;
            return(
              <button key={ch.id} className="card card-interactive"
                style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",border:`1.5px solid ${done?ch.color+"55":"var(--border-soft)"}`,textAlign:"left",width:"100%",fontFamily:"var(--font-body)"}}
                onClick={()=>onOpen(ch)}>
                <span style={{fontSize:20,flexShrink:0}}>{ch.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:7}}>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.title}</span>
                    <span style={{fontSize:12,color:ch.color,fontWeight:700,flexShrink:0}}>{pct}%</span>
                  </div>
                  <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={3}/>
                  <div style={{fontSize:10,color:"var(--text-faint)",marginTop:3}}>{s}/{ch.quiz.length} questions · {s*15}XP</div>
                </div>
                {done&&<span style={{fontSize:16,flexShrink:0}}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── HOME SCREEN ────────────────────────────────────────────────────── */
function HomeScreen({chapters,onOpen}){
  const {scores,completed,totalXP,streak}=useProgress();
  const {userProfile}=useAuth();
  const firstName=(userProfile?.displayName||"").split(" ")[0]||"Scholar";
  const nextCh=chapters.find(ch=>!completed?.has?.(ch.id));
  const inProg=chapters.filter(ch=>(scores?.[ch.id]>0)&&!completed?.has?.(ch.id)).slice(0,3);
  const done=[...(completed||[])].length;
  const pct=chapters.length>0?Math.round((done/chapters.length)*100):0;
  return(
    <div style={{paddingBottom:80}}>
      <section className="hero-wrap">
        <div className="anim-fade-up">
          <span className="hero-om" aria-hidden="true">ॐ</span>
        </div>
        <div className="hero-sub anim-fade-up d1">देवभाषा — Language of the Cosmos</div>
        <h1 className="hero-title anim-fade-up d2">
          नमस्ते, <span>{firstName}</span>
        </h1>
        <p className="hero-desc anim-fade-up d3">
          Master Pāṇini's Aṣṭādhyāyī through structured chapters, 3D flashcards, and levelled quizzes.
        </p>
        <div className="stats-row anim-fade-up d4">
          {[{v:`${done}/${chapters.length}`,l:"Chapters",c:"var(--gold-vivid)"},{v:`${totalXP||0}`,l:"XP Earned",c:"var(--teal)"},{v:`🔥 ${streak||0}`,l:"Streak",c:"var(--saffron)"},{v:`${pct}%`,l:"Mastery",c:"var(--lotus)"}].map(s=>(
            <div key={s.l} className="stat-chip">
              <div className="stat-val" style={{color:s.c}}>{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="main-content" style={{paddingTop:0}}>
        <div className="content-inner" style={{maxWidth:"100%"}}>
          {nextCh&&(
            <div style={{marginBottom:28}}>
              <div className="label-caps" style={{marginBottom:10}}>Continue Learning</div>
              <button className="continue-card" style={{borderColor:nextCh.color}} onClick={()=>onOpen(nextCh)}>
                <div style={{width:46,height:46,borderRadius:12,background:`${nextCh.color}16`,border:`2px solid ${nextCh.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"transform 0.22s var(--ease-spring)"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12) rotate(-5deg)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0deg)"}>{nextCh.icon}</div>
                <div style={{flex:1}}>
                  <div className="label-caps" style={{color:nextCh.color,marginBottom:3}}>Up Next</div>
                  <div style={{fontSize:15,fontWeight:700,color:"var(--text-primary)",marginBottom:2}}>{nextCh.title}</div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{nextCh.subtitle}</div>
                </div>
                <span style={{fontSize:20,color:nextCh.color,flexShrink:0}}>→</span>
              </button>
            </div>
          )}

          {inProg.length>0&&(
            <div style={{marginBottom:28}}>
              <div className="label-caps" style={{marginBottom:10}}>In Progress</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {inProg.map(ch=>{
                  const s=scores?.[ch.id]||0;
                  const p=Math.round((s/ch.quiz.length)*100);
                  return(
                    <button key={ch.id} className="card card-interactive"
                      style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",border:`1.5px solid ${ch.color}33`,textAlign:"left",fontFamily:"var(--font-body)",width:"100%"}}
                      onClick={()=>onOpen(ch)}>
                      <span style={{fontSize:18,flexShrink:0}}>{ch.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--text-primary)",marginBottom:5}}>{ch.title}</div>
                        <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={3}/>
                      </div>
                      <span style={{fontSize:12,color:ch.color,fontWeight:700}}>{p}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className="label-caps">All Chapters</div>
              <span style={{fontSize:12,color:"var(--text-muted)"}}>{chapters.length} modules</span>
            </div>
            <div className="ch-grid">
              {chapters.map((ch,idx)=>{
                const isDone=completed?.has?.(ch.id);
                return(
                  <button key={ch.id}
                    className={`ch-card anim-fade-up d${Math.min(idx+1,6)}${isDone?" done":""}`}
                    style={{"--ch-accent":ch.color,background:"var(--surface-0)"}}
                    onClick={()=>onOpen(ch)}>
                    <div className="ch-card-top">
                      <div className="ch-icon-wrap" style={{background:`${ch.color}10`,borderColor:`${ch.color}30`}}>
                        <span style={{fontSize:20}}>{ch.icon}</span>
                      </div>
                      <div style={{flex:1}}>
                        <div className="ch-num" style={{color:ch.color}}>{ch.num}</div>
                        <div className="ch-title">{ch.title}</div>
                      </div>
                      {isDone&&<span style={{fontSize:14}}>✅</span>}
                    </div>
                    <div className="ch-sub">{ch.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider-ornament"><span>ॐ</span></div>
          <div className="section-box section-box--gold anim-fade-up" style={{padding:"20px 22px",marginBottom:28}}>
            <div className="section-header" style={{marginBottom:10}}>
              <span style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700}}>💡 Did you know?</span>
              <span className="badge badge-gold">Pāṇini</span>
            </div>
            <div style={{fontFamily:"var(--font-dev)",fontSize:17,color:"var(--text-primary)",marginBottom:6,lineHeight:1.9}}>अष्टाध्यायी — चार हजार सूत्र</div>
            <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.7,margin:0}}>
              Pāṇini's Aṣṭādhyāyī contains ~4,000 sūtras averaging just 2–3 syllables each. Written ~400 BCE, it remains the most compact and complete grammatical description of any language ever produced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROFILE SCREEN ─────────────────────────────────────────────────── */
function ProfileScreen({chapters}){
  const {user,userProfile,updateUserProfile,signOut}=useAuth();
  const {scores,completed,totalXP,streak,syncing,resetProgress}=useProgress();
  const [form,setForm]=useState({displayName:"",bio:"",learningGoal:"",preferredScript:"Devanagari + Roman",dailyTarget:20,avatarColor:"#C8860A"});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const mastery=chapters.length?Math.round(((completed?.size||0)/chapters.length)*100):0;

  useEffect(()=>{
    if(userProfile) setForm({
      displayName:userProfile.displayName||"",bio:userProfile.bio||"",
      learningGoal:userProfile.learningGoal||"",preferredScript:userProfile.preferredScript||"Devanagari + Roman",
      dailyTarget:userProfile.dailyTarget||20,avatarColor:userProfile.avatarColor||"#C8860A",
    });
  },[userProfile]);

  async function save(e){
    e.preventDefault();setSaving(true);
    try{await updateUserProfile?.(form);setMsg("Profile saved ✓");}
    catch(err){setMsg(err?.message||"Could not save.");}
    finally{setSaving(false);}
  }

  return(
    <div className="main-content">
      <div className="content-inner">
        <div className="label-caps" style={{marginBottom:16}}>Account</div>
        <div className="section-box anim-fade-up" style={{marginBottom:14,padding:"20px 22px"}}>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div className="prof-avatar" style={{background:`linear-gradient(135deg,${form.avatarColor},${form.avatarColor}bb)`,color:"#fff"}}>
              {(form.displayName||user?.email||"U").slice(0,2).toUpperCase()}
            </div>
            <div>
              <h2 style={{fontSize:20,marginBottom:3}}>{form.displayName||"Sanskrit Learner"}</h2>
              <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:8}}>{user?.email}</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <span className="xp-pill">⭐ {totalXP||0} XP</span>
                <span className="streak-pill">🔥 {streak||0} day streak</span>
                <span className="badge badge-teal">{syncing?"⏳ Saving":"✅ Synced"}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(256px,1fr))",gap:14}}>
          <div className="section-box">
            <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Profile & Preferences</span></div>
            <form onSubmit={save}>
              <div className="form-field"><label className="form-label">Display Name</label><input className="form-input" value={form.displayName} onChange={e=>setForm(f=>({...f,displayName:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Learning Goal</label><input className="form-input" value={form.learningGoal} onChange={e=>setForm(f=>({...f,learningGoal:e.target.value}))} placeholder="e.g. Read the Aṣṭādhyāyī in 1 year"/></div>
              <div className="form-field"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Your Sanskrit journey…"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div className="form-field"><label className="form-label">Script</label>
                  <select className="form-select" value={form.preferredScript} onChange={e=>setForm(f=>({...f,preferredScript:e.target.value}))}>
                    <option>Devanagari + Roman</option><option>Devanagari only</option><option>Roman only</option>
                  </select>
                </div>
                <div className="form-field"><label className="form-label">Daily Target (min)</label><input className="form-input" type="number" min="5" step="5" value={form.dailyTarget} onChange={e=>setForm(f=>({...f,dailyTarget:e.target.value}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Avatar Colour</label>
                <input type="color" value={form.avatarColor} onChange={e=>setForm(f=>({...f,avatarColor:e.target.value}))} style={{width:"100%",height:38,border:"none",borderRadius:8,padding:3,cursor:"pointer",background:"transparent"}}/>
              </div>
              {msg&&<div style={{padding:"9px 12px",background:msg.includes("✓")?"var(--teal-lt)":"var(--saffron-lt)",borderRadius:8,fontSize:12,color:msg.includes("✓")?"var(--teal)":"var(--saffron)",marginBottom:10}}>{msg}</div>}
              <button type="submit" className="btn btn-primary btn-w" disabled={saving}>{saving?"Saving…":"Save Profile"}</button>
            </form>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="section-box">
              <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Progress Vault</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[{v:`${completed?.size||0}/${chapters.length}`,l:"Chapters"},{v:`${totalXP||0}XP`,l:"XP"},{v:`🔥${streak||0}`,l:"Streak"},{v:`${mastery}%`,l:"Mastery"}].map(s=>(
                  <div key={s.l} className="stat-chip"><div className="stat-val" style={{fontSize:17}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>
                ))}
              </div>
              <div className="pbar" style={{height:5,marginBottom:6}}><div className="pbar-fill" style={{width:`${mastery}%`,height:5}}/></div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>{mastery}% of curriculum complete</div>
            </div>
            <div className="section-box">
              <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Account Actions</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <button className="btn btn-ghost btn-w" onClick={()=>{const d={profile:userProfile,at:new Date().toISOString()};navigator.clipboard?.writeText(JSON.stringify(d,null,2));setMsg("Copied ✓");}}>📋 Export My Data</button>
                <button className="btn btn-ghost btn-w" onClick={()=>{if(window.confirm("Reset all progress? Cannot be undone.")){resetProgress?.();setMsg("Progress reset.");}}}>🔄 Reset Progress</button>
                <button className="btn btn-ghost btn-w" style={{color:"var(--saffron)",borderColor:"rgba(214,65,10,0.25)"}} onClick={()=>signOut?.()}>🚪 Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN APP ───────────────────────────────────────────────────────── */
export default function App(){
  const {user,loading:authLoading}=useAuth();
  const {loaded:progressLoaded}=useProgress();
  const {theme,toggle:toggleTheme}=useTheme();
  const [chapters]=useState(CHAPTERS);
  const [nav,setNav]=useState("home");
  const [activeChap,setActiveChap]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  if(authLoading||(user&&!progressLoaded))
    return <LoadingScreen message={authLoading?"Checking account…":"Loading progress…"}/>;
  if(!user) return <AuthScreen/>;

  function openChapter(ch){setActiveChap(ch);setNav("chapter");setSidebarOpen(false);}
  function goTo(page){setNav(page);if(page!=="chapter")setActiveChap(null);setSidebarOpen(false);}

  const activeChapter=activeChap?chapters.find(c=>c.id===activeChap.id)||activeChap:null;

  const NAV=[
    {id:"home",  icon:"🏠",label:"Home"},
    {id:"chapters",icon:"📚",label:"Chapters"},
    {id:"progress",icon:"📈",label:"Progress"},
    {id:"glossary",icon:"📖",label:"Glossary"},
    {id:"profile", icon:"👤",label:"Profile"},
  ];

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* ── TOP NAV ── */}
      <nav className="top-nav" aria-label="Primary navigation">
        <button className="nav-brand" onClick={()=>goTo("home")} aria-label="Go home">
          <div className="nav-brand-icon">🕉️</div>
          <div>
            <div className="nav-brand-name">Devavāṇī</div>
            <div className="nav-brand-tagline">Sanskrit · Pāṇini · Aṣṭādhyāyī</div>
          </div>
        </button>

        <ul className="nav-links" role="list">
          {NAV.map(n=>(
            <li key={n.id}>
              <button
                className={`nav-link${(nav===n.id||(nav==="chapter"&&n.id==="chapters"))?" active":""}`}
                onClick={()=>goTo(n.id)}
                aria-current={nav===n.id?"page":undefined}>
                <span>{n.icon}</span>{n.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {nav==="chapter"&&activeChapter&&(
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--text-muted)",background:"var(--surface-2)",border:"1px solid var(--border-soft)",padding:"4px 10px",borderRadius:"var(--r-pill)"}}>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",fontSize:11,fontFamily:"var(--font-body)",padding:0,transition:"color var(--t-fast)"}}
                onClick={()=>goTo("chapters")}
                onMouseEnter={e=>e.currentTarget.style.color="var(--gold-vivid)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"}>
                Chapters
              </button>
              <span>›</span>
              <span style={{color:activeChapter.color,fontWeight:600,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeChapter.title}</span>
            </div>
          )}

          <ThemeToggle theme={theme} onToggle={toggleTheme}/>
          <UserAvatar totalChapters={chapters.length} onNavigate={goTo}/>

          <button
            className="menu-btn btn btn-icon btn-ghost"
            aria-label="Open menu"
            onClick={()=>setSidebarOpen(x=>!x)}
            style={{display:"none",fontSize:18,padding:"7px 10px"}}>
            ☰
          </button>
        </div>
      </nav>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen&&(
        <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)} aria-hidden="true"/>
      )}

      {/* ── MOBILE SLIDE-IN SIDEBAR ── */}
      {sidebarOpen&&(
        <div className="sidebar open" style={{zIndex:160,paddingTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 10px 10px"}}>
            <div className="sidebar-label" style={{padding:0}}>Navigation</div>
            <button onClick={()=>setSidebarOpen(false)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--text-muted)",padding:0}}>✕</button>
          </div>
          {NAV.map(n=>(
            <button key={n.id}
              className={`sidebar-item${nav===n.id?" active":""}`}
              onClick={()=>goTo(n.id)}>
              <span className="sidebar-item-icon">{n.icon}</span>
              <span className="sidebar-item-text">{n.label}</span>
            </button>
          ))}
          <div className="divider"/>
          <div style={{padding:"4px 10px"}}>
            <div className="sidebar-label" style={{padding:"0 0 8px"}}>Theme</div>
            <ThemeToggle theme={theme} onToggle={(t)=>{toggleTheme(t);}}/>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{flex:1}}>
        {nav==="home"     &&<HomeScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="chapters" &&!activeChap&&<ChaptersScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="chapter"  &&activeChapter&&(
          <ChapterDetail
            key={activeChapter.id}
            ch={activeChapter}
            chapters={chapters}
            onBack={()=>goTo("chapters")}
            onNavigate={openChapter}/>
        )}
        {nav==="progress" &&<ProgressScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="glossary" &&<GlossaryScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="profile"  &&<ProfileScreen chapters={chapters}/>}
      </main>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {NAV.map(n=>(
            <button key={n.id}
              className={`bnav-btn${(nav===n.id||(nav==="chapter"&&n.id==="chapters"))?" active":""}`}
              onClick={()=>goTo(n.id)}
              aria-current={nav===n.id?"page":undefined}>
              <span className="bi">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}