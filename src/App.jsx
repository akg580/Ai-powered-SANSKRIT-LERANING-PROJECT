// src/App.jsx — Devavāṇī Sanskrit Platform v3.0
// Enterprise revamp: Cosmos UI · Glassmorphism · Structured chapters · Full animations
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth }     from "./contexts/AuthContext.jsx";
import { useProgress } from "./contexts/ProgressContext.jsx";
import AuthScreen      from "./components/AuthScreen.jsx";
import LoadingScreen   from "./components/LoadingScreen.jsx";
import UserAvatar      from "./components/UserAvatar.jsx";
import "./styles.css";

/* ══════════════════════════════════════════════════════════════════════════
   DATA — Category Colors
══════════════════════════════════════════════════════════════════════════ */
const CC = {
  grammar:"#18A999", phonetics:"#2563EB", varga:"#F59E0B", special:"#8B5CF6",
  core:"#FF6B35",    sutra:"#f5a623",     pratyahara:"#00C9A7", articulation:"#C2410C",
  sthana:"#D97706",  effort:"#475569",    duration:"#00C9A7",   tone:"#7C3AED",
  nasality:"#EC4899", samjna:"#f5a623",   meter:"#3A8050",      position:"#2563EB",
  operation:"#FF6B35", agama:"#18A999",   upasarga:"#F59E0B",   morphology:"#8B5CF6",
  process:"#2563EB",  architecture:"#475569", vedic:"#8B5CF6",  philosophy:"#7B8498",
  history:"#BE123C",  rule:"#65A30D",     precision:"#FF6B35",  shorthand:"#00C9A7",
  theory:"#475569",   method:"#00C9A7",   classification:"#F59E0B", conflict:"#FF6B35",
  sutratype:"#f5a623", optionality:"#18A999",
};

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTER DATA
══════════════════════════════════════════════════════════════════════════ */
const CHAPTERS = [
  {
    id:1, num:"Ch 1", title:"Saṃjñā Prakaraṇa",
    subtitle:"Technical Names, Markers & Operating Labels",
    icon:"🏷️", color:"#18A999",
    concepts:[
      {term:"संज्ञा (Saṃjñā)", meaning:"A technical name assigned by Pāṇini so later rules can operate with precision and economy.", example:"वृद्धि, गुण, संयोग, इत्, लोप — labels used again and again", cat:"samjna", sutra:""},
      {term:"वृद्धि संज्ञा", meaning:"वृद्धिरादैच्: ā, ai, au receive the name Vṛddhi. It marks the strongest vowel grade.", example:"आ · ऐ · औ = वृद्धि", cat:"samjna", sutra:"1.1.1"},
      {term:"गुण संज्ञा", meaning:"अदेङ् गुणः: a, e, o receive the name Guṇa. It marks the middle vowel grade.", example:"अ · ए · ओ = गुण", cat:"samjna", sutra:"1.1.2"},
      {term:"इक् and Guṇa/Vṛddhi", meaning:"इको गुणवृद्धी: i, u, ṛ, ḷ are the vowels that take Guṇa and Vṛddhi substitutes in many operations.", example:"इ→ए/ऐ · उ→ओ/औ · ऋ→अर्/आर्", cat:"sutra", sutra:"1.1.3"},
      {term:"सवर्ण (Savarṇa)", meaning:"तुल्यास्यप्रयत्नं सवर्णम्: sounds with the same place and effort are called Savarṇa.", example:"अ and आ are savarṇa; इ and ई are savarṇa", cat:"phonetics", sutra:"1.1.9"},
      {term:"संयोग (Saṃyoga)", meaning:"हलोनन्तराः संयोगः: two or more consonants with no intervening vowel form a consonant cluster.", example:"भक्त = क्+त · पुष्प = ष्+प", cat:"phonetics", sutra:"1.1.7"},
      {term:"इत् संज्ञा", meaning:"Markers attached to roots or suffixes for grammar-work. They guide operations and are then removed.", example:"णिच् has ण् and च् as technical markers", cat:"core", sutra:"1.3.2-9"},
      {term:"लोप (Lopa)", meaning:"अदर्शनं लोपः: disappearance from pronunciation, not loss of grammatical force.", example:"It-markers disappear after doing their work", cat:"operation", sutra:"1.1.60"},
      {term:"प्रत्याहार", meaning:"आदिरन्त्येन सहेता: a compact sound-group made from a starting sound plus a final It-marker.", example:"अच् = vowels · हल् = consonants · इक् = इ उ ऋ ऌ", cat:"pratyahara", sutra:"1.1.71"},
      {term:"अधिकार and अनुवृत्ति", meaning:"A heading or carried-forward word supplies context to many following rules.", example:"One word continues across several sūtras to avoid repetition", cat:"architecture", sutra:"method"},
    ],
    quiz:[
      {q:"Which sounds are called Vṛddhi by 1.1.1?", opts:["अ ए ओ","आ ऐ औ","इ उ ऋ","य र ल व"], ans:1, exp:"वृद्धिरादैच् gives Vṛddhi-saṃjñā to आ, ऐ, औ."},
      {q:"Which sounds are called Guṇa by 1.1.2?", opts:["अ ए ओ","आ ऐ औ","इ उ ऋ","क ख ग"], ans:0, exp:"अदेङ् गुणः gives Guṇa-saṃjñā to अ, ए, ओ."},
      {q:"What does Saṃjñā do in Pāṇini's grammar?", opts:["Adds decoration","Names a technical category for later rules","Cancels rules","Means translation"], ans:1, exp:"A Saṃjñā is a technical label that lets later rules refer to a class precisely."},
      {q:"अदर्शनं लोपः means:", opts:["Sound becomes long","A marker disappears from pronunciation","A vowel becomes Guṇa","A rule is optional"], ans:1, exp:"Lopa is non-appearance. The item is not pronounced but its grammatical effect can remain."},
    ],
    vedic:[
      {dev:"अथ शब्दानुशासनम् ।", roman:"atha śabdānuśāsanam", trans:"Now begins the discipline of words.", source:"Mahābhāṣya — Patañjali", rel:"Saṃjñā is the opening machinery of this discipline: first define the technical names, then operate with them."},
      {dev:"वृद्धिरादैच् ।", roman:"vṛddhir ādaic", trans:"Ā, ai, au are called Vṛddhi.", source:"Aṣṭādhyāyī 1.1.1", rel:"The first sūtra begins with a Saṃjñā. Pāṇini starts by naming the grammar's operating categories."},
      {dev:"अदेङ् गुणः ।", roman:"adeṅ guṇaḥ", trans:"A, e, o are called Guṇa.", source:"Aṣṭādhyāyī 1.1.2", rel:"Guṇa and Vṛddhi become reusable labels for vowel strengthening throughout the system."},
    ],
    levels:{
      easy:[
        {q:"Saṃjñā means:", opts:["Technical name","Past tense","Compound","Vedic metre"], ans:0, exp:"Saṃjñā is a technical label used by later rules."},
        {q:"Vṛddhi sounds are:", opts:["आ ऐ औ","अ ए ओ","इ उ ऋ","क ख ग"], ans:0, exp:"1.1.1 names आ, ऐ, औ as Vṛddhi."},
        {q:"Guṇa sounds are:", opts:["आ ऐ औ","अ ए ओ","य र ल व","श ष स"], ans:1, exp:"1.1.2 names अ, ए, ओ as Guṇa."},
        {q:"A cluster of consonants with no vowel between is:", opts:["Guṇa","Saṃyoga","Lopa","Pragṛhya"], ans:1, exp:"हलोनन्तराः संयोगः defines Saṃyoga."},
        {q:"It-markers are finally:", opts:["Pronounced loudly","Removed by lopa","Changed to nouns","Always long"], ans:1, exp:"It-markers guide grammar and then disappear."},
      ],
      medium:[
        {q:"इको गुणवृद्धी applies to which basic vowel group?", opts:["इ उ ऋ ऌ","अ आ ए","य र ल व","क च ट"], ans:0, exp:"इक् = इ, उ, ऋ, ऌ. These receive Guṇa/Vṛddhi substitutes."},
        {q:"Savarṇa depends mainly on:", opts:["Same place and effort","Same meaning","Same gender","Same chapter"], ans:0, exp:"तुल्यास्यप्रयत्नं सवर्णम् defines Savarṇa by place and effort."},
        {q:"Why are Saṃjñā rules important?", opts:["They shorten and stabilize later rules","They add stories","They remove examples","They replace pronunciation"], ans:0, exp:"Once a class is named, Pāṇini can use the compact label everywhere."},
        {q:"Pratyāhāra is formed by:", opts:["Ādi + final It-marker","Two nouns","A verb ending","A Vedic accent"], ans:0, exp:"आदिरन्त्येन सहेता creates a compact sound-group."},
      ],
      hard:[
        {q:"The key innovation of Saṃjñā is:", opts:["Pronunciation guide","Grammar can refer to classes instead of listing every member","Color coding","Word order"], ans:1, exp:"Without Saṃjñā, every rule would need to list every sound explicitly — the system would be impossibly large."},
        {q:"Lopa's key insight is:", opts:["Sound is deleted forever","Form disappears but grammatical effect persists","Always Vedic","Creates new words"], ans:1, exp:"This distinction — phonetic absence vs grammatical presence — is Pāṇini's solution to sound-alternation puzzles."},
      ],
    },
  },
  {
    id:2, num:"Ch 2", title:"Sandhi Prakaraṇa",
    subtitle:"Sound Junction Rules · Vowel, Consonant & Visarga Sandhi",
    icon:"🔗", color:"#2563EB",
    concepts:[
      {term:"संहिता (Saṃhitā)", meaning:"Close phonetic contact between words or morphemes. The prerequisite for all Sandhi operations.", example:"संहितायाम् — Aṣṭādhyāyī 6.1.72", cat:"core", sutra:"6.1.72"},
      {term:"सवर्णदीर्घः (Vowel Coalescence)", meaning:"अकः सवर्णे दीर्घः — when a vowel meets its own family (savarṇa), both merge into one long vowel.", example:"राम + अर्थम् = रामार्थम् (a+a→ā)", cat:"sutra", sutra:"6.1.101"},
      {term:"यण् संधि (Semivowel Sandhi)", meaning:"इको यणचि — ik vowels (i,u,ṛ,ḷ) become the corresponding semivowels (y,v,r,l) before any vowel.", example:"इ→य् · उ→व् · ऋ→र् · ऌ→ल्", cat:"phonetics", sutra:"6.1.77"},
      {term:"गुण संधि (Guṇa Sandhi)", meaning:"When अ/आ precedes इ/ई, both merge to ए. Before उ/ऊ → ओ. Before ऋ → अर्.", example:"देव + इन्द्रः = देवेन्द्रः (a+i→e)", cat:"grammar", sutra:"6.1.87"},
      {term:"वृद्धि संधि (Vṛddhi Sandhi)", meaning:"When अ/आ precedes ए/ऐ → ऐ. Before ओ/औ → औ. The diphthong strengthening rule.", example:"एक + एक = एकैक (a+e→ai)", cat:"grammar", sutra:"6.1.88"},
      {term:"परसवर्ण (Assimilation)", meaning:"A consonant takes the class of the following consonant. The final stops assimilate in place of articulation.", example:"तत् + च = तच्च (t→c before c)", cat:"phonetics", sutra:"8.4.58"},
      {term:"विसर्ग संधि (Visarga Sandhi)", meaning:"Visarga behaves differently before vowels, voiced sounds, and sibilants. Context-sensitive transformation.", example:"रामः + अगच्छत् = रामो ऽगच्छत्", cat:"phonetics", sutra:"8.3.15"},
      {term:"प्रकृतिभाव (No-Sandhi zones)", meaning:"Some environments intentionally block sandhi so the original form remains visible and grammatically transparent.", example:"Special Vedic or grammatical environments may preserve source form", cat:"rule", sutra:""},
    ],
    quiz:[
      {q:"अ + अ usually becomes:", opts:["अ","आ","ए","ओ"], ans:1, exp:"सवर्णदीर्घ: same vowels combine into a long vowel."},
      {q:"इ before another vowel may become:", opts:["य्","व्","र्","ल्"], ans:0, exp:"यण् sandhi: इ/ई → य् before a vowel."},
      {q:"देव + इन्द्रः becomes:", opts:["देवेन्द्रः","देविन्द्रः","देवोन्द्रः","देवन्द्रः"], ans:0, exp:"अ/आ + इ/ई commonly gives ए by Guṇa sandhi."},
      {q:"Sandhi mainly helps Sanskrit:", opts:["Flow smoothly in speech","Avoid meaning","Remove grammar","Create random spelling"], ans:0, exp:"Sandhi makes sound transitions smooth while staying rule-governed."},
    ],
    vedic:[
      {dev:"संहितायाम् ।", roman:"saṃhitāyām", trans:"In close phonetic contact.", source:"Aṣṭādhyāyī 6.1.72", rel:"Sandhi begins when sounds are in saṃhitā, close contact. This is the doorway into sound transformation."},
      {dev:"इको यणचि ।", roman:"iko yaṇ aci", trans:"Ik vowels become Yaṇ before a vowel.", source:"Aṣṭādhyāyī 6.1.77", rel:"A compact sandhi rule: इ उ ऋ ऌ turn into य् व् र् ल् before अच्."},
      {dev:"अकः सवर्णे दीर्घः ।", roman:"akaḥ savarṇe dīrghaḥ", trans:"A vowel becomes long before its savarṇa vowel.", source:"Aṣṭādhyāyī 6.1.101", rel:"The cleanest entry point into vowel sandhi: same family plus same family becomes the long member."},
    ],
    levels:{
      easy:[
        {q:"Sandhi means:", opts:["Sound joining","Root list","Case ending","Translation"], ans:0, exp:"Sandhi is rule-governed sound joining."},
        {q:"अ + अ =", opts:["आ","ऐ","ओ","य"], ans:0, exp:"Same vowel family combines into long आ."},
        {q:"इ + अ often becomes:", opts:["य","व","र","ल"], ans:0, exp:"इ becomes य् before a vowel in Yaṇ sandhi."},
        {q:"उ + अ often becomes:", opts:["य","व","र","ल"], ans:1, exp:"उ becomes व् before a vowel in Yaṇ sandhi."},
      ],
      medium:[
        {q:"अकः सवर्णे दीर्घः handles:", opts:["Same-family vowel joining","Consonant clusters","Visarga only","Case endings"], ans:0, exp:"It lengthens same-family vowel contact."},
        {q:"Guṇa sandhi result for अ + इ is:", opts:["ए","ऐ","ओ","औ"], ans:0, exp:"अ/आ + इ/ई gives ए."},
        {q:"Vṛddhi sandhi result for अ + ए is:", opts:["ए","ऐ","ओ","आ"], ans:1, exp:"अ/आ + ए/ऐ gives ऐ."},
        {q:"परसवर्ण means:", opts:["Assimilation to the following class","Long vowel","No change","A suffix"], ans:0, exp:"The sound takes the class/place of the following consonant."},
      ],
      hard:[
        {q:"In इको यणचि, इक् is the:", opts:["Replaceable vowel group","Result group","Exception","Case ending"], ans:0, exp:"इक् vowels are replaced by corresponding Yaṇ semivowels before अच्."},
        {q:"Sandhi must be learned with conditions because:", opts:["Same sounds may behave differently by environment","It is random","Rules never apply","Only spelling matters"], ans:0, exp:"Pāṇini's sandhi is context-sensitive and condition-driven."},
      ],
    },
  },
  {
    id:3, num:"Ch 3", title:"Māheśvara Sūtras & Pratyāhāras",
    subtitle:"14 Drum-Formulas · 42 Abbreviations · Shiva's Cosmic Encoding",
    icon:"🥁", color:"#FF6B6B",
    concepts:[
      {term:"14 माहेश्वर सूत्र", meaning:"Sound-strings from Shiva's ḍamaru. Purpose: create Pratyāhāras — compact sound-class codes.", example:"①अ इ उ ण् ②ऋ ऌ क् ③ए ओ ङ् ④ऐ औ च् ⑤ह य व र ट् ⑥ल ण् ⑦ञ म ङ ण न म् ⑧झ भ ञ् ⑨घ ढ ध ष् ⑩ज ब ग ड द श् ⑪ख फ छ ठ थ च ट त व् ⑫क प य् ⑬श ष स र् ⑭ह ल्", cat:"core", sutra:""},
      {term:"इत् संज्ञा (1.3.3+1.3.9)", meaning:"Final consonant = marker. Named by हलन्त्यम्, deleted by तस्य लोपः", example:"'अ इ उ ण्' → ण् is It-marker", cat:"core", sutra:"1.3.3"},
      {term:"प्रत्याहार (1.1.71)", meaning:"Ādi+Antya-It = all sounds between. Sūtra: आदिरन्त्येन सहेता", example:"अ+च् = अच् (9 vowels) · ह+ल् = हल् (33 consonants)", cat:"core", sutra:"1.1.71"},
      {term:"42 प्रत्याहार", meaning:"~42 standard abbreviations. One It → multiple Pratyāhāras possible.", example:"From क् (sūtra 2): अक्·इक्·उक् — three from one It", cat:"pratyahara", sutra:""},
      {term:"Key Pratyāhāras", meaning:"Most used in the Aṣṭādhyāyī — essential vocabulary for reading any rule.", example:"अच्=9 vowels · हल्=33 consonants · इक्=इउऋऌ · यण्=यरलव", cat:"pratyahara", sutra:""},
    ],
    quiz:[
      {q:"How many Māheśvara Sūtras?", opts:["9","12","14","42"], ans:2, exp:"14 from Shiva's 14-beat ḍamaru."},
      {q:"'अच्' includes:", opts:["All consonants","All 9 vowels","Short vowels only","Semi-vowels"], ans:1, exp:"अ(sūtra 1)+च्(sūtra 4 It) = all 9 vowels."},
      {q:"An It-marker is:", opts:["Vowel in words","Coding marker, then deleted","A prefix","Compound vowel"], ans:1, exp:"Named by 1.3.3, deleted by 1.3.9."},
      {q:"Standard Pratyāhāras:", opts:["14","22","33","42"], ans:3, exp:"42 standard Pratyāhāras from the 14 sūtras."},
    ],
    vedic:[
      {dev:"नृत्तावसाने नटराजराजो ननाद ढक्कां नवपञ्चवारम् ।", roman:"nṛttāvasāne naṭarājarājo nanāda ḍhakkāṃ navapañcavāram", trans:"At the close of the cosmic dance, the King of dancers sounded his drum fourteen times.", source:"Traditional verse on the Māheśvara Sūtras", rel:"Nava-pañca = 9+5 = 14 drum beats = 14 Sūtras. Each beat encodes a group of sounds. The cosmic dance encodes the entire sound system of Sanskrit."},
      {dev:"आदिरन्त्येन सहेता ।", roman:"ādirantyen sahetā", trans:"The first sound, combined with the last marker, encompasses all sounds between.", source:"Aṣṭādhyāyī 1.1.71", rel:"Five syllables defining ALL 42 Pratyāhāras at once. The most economical meta-rule in linguistics history."},
    ],
    levels:{
      easy:[
        {q:"How many Māheśvara Sūtras?", opts:["9","12","14","42"], ans:2, exp:"14 sūtras from Shiva's 14-beat ḍamaru."},
        {q:"'अच्' represents:", opts:["All consonants","All 9 vowels","Short vowels","Semi-vowels"], ans:1, exp:"अ(sūtra 1)+च्(sūtra 4 It) = all 9 vowels between."},
        {q:"'आदिरन्त्येन सहेता' defines:", opts:["Dhātu","ALL 42 Pratyāhāras: Ādi+Antya-It = group between","Upasarga","Lopa"], ans:1, exp:"Five syllables defining the entire Pratyāhāra system."},
      ],
      medium:[
        {q:"Sūtras 1.3.3 + 1.3.9 together:", opts:["Define vowels","NAME the It (1.3.3) then DELETE it (1.3.9)","Create Pratyāhāras","Define Sandhi"], ans:1, exp:"Two-step It system: name then delete. Enables coding without leaving artifacts."},
        {q:"'इक्' (इ उ ऋ ऌ) is formed from:", opts:["Sūtra 1 only","इ(sūtra 1 start)+क्(sūtra 2 It)","Random","4 sūtras"], ans:1, exp:"इक् covers the 4 short non-a vowels used in 'इको यणचि.'"},
      ],
      hard:[
        {q:"The 14 sūtras are in a specific order because:", opts:["Shiva's choice","Every Pratyāhāra has unique Ādi+It code — reordering creates conflicts","Recitation convenience","Random"], ans:1, exp:"Combinatorially optimal. Every sound-group needed has exactly one unambiguous code."},
        {q:"Without Pratyāhāras, one rule mentioning 'any vowel' would require:", opts:["9 entries","162 entries (9 vowels × 18 variants each)","42 entries","1 entry"], ans:1, exp:"Patañjali's mathematical proof: the compression ratio justifies the entire 14-sūtra system."},
      ],
    },
  },
  {
    id:4, num:"Ch 4", title:"Sthāna · Karaṇa · Prayatna",
    subtitle:"8 Places · Tongue Instrument · Articulation Effort",
    icon:"👄", color:"#F59E0B",
    concepts:[
      {term:"8 स्थान", meaning:"8 vocal-tract locations for sound production.", example:"Uras·Kaṇṭha·Śiras·Jihvāmūla·Tālu·Mūrdhā·Danta·Oṣṭha + Nāsikā", cat:"sthana", sutra:"Śikṣā"},
      {term:"करण (Karaṇa)", meaning:"Tongue part that REACHES the Sthāna.", example:"Guttural=tongue-root · Palatal=mid-tongue · Dental=tongue-tip", cat:"articulation", sutra:"TP 2.48"},
      {term:"5 आभ्यन्तर प्रयत्न", meaning:"Internal efforts: ①स्पृष्ट(stops) ②ईषत्-स्पृष्ट(semi-v) ③विवृत(vowels) ④संवृत(short-a) ⑤ईषत्-विवृत(sibilants)", example:"क=Spṛṣṭa · य=Īṣat-spṛṣṭa · अ=Vivṛta", cat:"effort", sutra:""},
      {term:"11 बाह्य प्रयत्न", meaning:"External: ①Vivāra+Śvāsa+Aghoṣa=Khar ②Saṃvāra+Nāda+Ghoṣa=Haś ③Udātta+Anudātta+Svarita", example:"क=Khar (unvoiced) · ग=Haś (voiced)", cat:"effort", sutra:""},
      {term:"सवर्ण (1.1.9)", meaning:"तुल्यास्यप्रयत्नं सवर्णम् — same Sthāna + same Abhyantara Prayatna.", example:"अ and आ = Savarṇa · इ and ई = Savarṇa", cat:"samjna", sutra:"1.1.9"},
    ],
    quiz:[
      {q:"Kavarga Sthāna:", opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"], ans:1, exp:"अकुहविसर्जनीयानां कण्ठः."},
      {q:"Alpaprāṇa in a Varga:", opts:["2nd·4th","1st·3rd·5th","All 5","5th only"], ans:1, exp:"1st, 3rd, 5th = Alpaprāṇa. 2nd, 4th = Mahāprāṇa."},
      {q:"Two sounds are Savarṇa when:", opts:["Same duration","Same Sthāna+same Abhyantara Prayatna","Same suffix","Same prefix"], ans:1, exp:"1.1.9: tulyāsyaprayatnaṃ savarṇam."},
      {q:"Sanskrit phonetics predates Western IPA because:", opts:["Coincidence","Both describe the SAME physical reality — 2500 years apart","Western borrowing","Tradition"], ans:1, exp:"Sanskrit phonetics is empirically correct science of the vocal tract — 2500 years before Western linguistics."},
    ],
    vedic:[
      {dev:"अकुहविसर्जनीयानां कण्ठः ।", roman:"akuhavisarjanīyānāṃ kaṇṭhaḥ", trans:"Kaṇṭha for अ, Kavarga, ह, Visarga.", source:"Pāṇinīya Śikṣā 13", rel:"Pāṇini's own phonetics manual maps every Sanskrit sound to its exact place of articulation."},
      {dev:"यत्र जायते स स्थानम् । येन जायते स करणम् ॥", roman:"yatra jāyate sa sthānam · yena jāyate sa karaṇam", trans:"WHERE a sound is born = Sthāna. BY WHAT it is born = Karaṇa.", source:"Taittirīya Prātiśākhya 2.48", rel:"Elegant couplet distinguishing Sthāna (place, fixed) from Karaṇa (tongue instrument, variable)."},
    ],
    levels:{
      easy:[
        {q:"Kavarga Sthāna:", opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"], ans:1, exp:"अकुहविसर्जनीयानां कण्ठः."},
        {q:"Ṭavarga Sthāna:", opts:["Kaṇṭha","Tālu","Mūrdhā","Danta"], ans:2, exp:"Mūrdhā (cerebral) for ṛ·Ṭavarga·र·ṣ."},
      ],
      medium:[
        {q:"'Khar' consonants share which Bāhya Prayatna?", opts:["Saṃvāra+Nāda+Ghoṣa","Vivāra+Śvāsa+Aghoṣa","All three","None"], ans:1, exp:"Khar = Vivāra(open cords)+Śvāsa(breathed)+Aghoṣa(unvoiced)."},
        {q:"Abhyantara Prayatna is crucial for grammar because:", opts:["Only phonetic","Savarṇa (1.1.9) requires shared Abhyantara — determines ALL vowel substitutions","Vedic recitation","Tradition"], ans:1, exp:"Savarṇa requires matching Abhyantara Prayatna. This determines ALL sandhi substitutions."},
      ],
      hard:[
        {q:"Karaṇa beyond Sthāna is needed because:", opts:["Redundant","Multiple sounds share one Sthāna but differ in HOW tongue reaches it — complete articulatory specification","Decoration","Tradition"], ans:1, exp:"Both ह and क share Kaṇṭha, but their tongue configurations differ. Sthāna+Karaṇa = complete specification."},
      ],
    },
  },
  {
    id:5, num:"Ch 5", title:"Vowel System & Strengthening",
    subtitle:"18 Forms · Savarṇa · Guṇa · Vṛddhi · Laghu-Guru",
    icon:"🎵", color:"#8B5CF6",
    concepts:[
      {term:"18 भेद per vowel", meaning:"3 durations × 3 tones × 2 nasality = 18. Diphthongs=12 (no Hrasva). ऌ=12.", example:"अ→18 forms · ए→12 forms · ऌ→12 forms", cat:"theory", sutra:""},
      {term:"ह्रस्व-दीर्घ-प्लुत (1.2.27)", meaning:"Three durations: ऊकालोऽज्झ्रस्वदीर्घप्लुतः.", example:"Hrasva(1 mātrā):अइउऋऌ · Dīrgha(2):आईऊएओऐऔ · Pluta(3+):रा३म!", cat:"duration", sutra:"1.2.27"},
      {term:"उदात्त-अनुदात्त-स्वरित", meaning:"Three Vedic pitch accents — Bāhya Prayatna of VOWELS only.", example:"उदात्त=raised · अनुदात्त=low · स्वरित=circumflex blend", cat:"tone", sutra:"1.2.29-31"},
      {term:"गुण (1.1.2)", meaning:"अदेङ् गुणः — अ, ए, ओ. First-level strengthening.", example:"उप+इन्द्र=उपेन्द्र (a+i→e)", cat:"samjna", sutra:"1.1.2"},
      {term:"वृद्धि (1.1.1)", meaning:"वृद्धिरादैच् — आ, ऐ, औ. Second-level strengthening. FIRST sūtra of Aṣṭādhyāyī!", example:"इ→ऐ · उ→औ · ऋ→आर्", cat:"samjna", sutra:"1.1.1"},
      {term:"उरण् रपरः (1.1.51)", meaning:"When ṛ undergoes Guṇa/Vṛddhi → insert र् (no retroflex Guṇa exists).", example:"महा+ऋषि = महर्षि (a+ṛ→ar)", cat:"sutra", sutra:"1.1.51"},
      {term:"लघु/गुरु (1.4.10-11)", meaning:"ह्रस्वं लघु · संयोगे गुरु — basis of Sanskrit meter.", example:"'जल' में 'ज'=Laghu · 'जलप्रवाह' में 'ल'=Guru (before cluster प्र)", cat:"meter", sutra:"1.4.10-11"},
    ],
    quiz:[
      {q:"Guṇa vowels:", opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"], ans:1, exp:"अ ए ओ = Guṇa (1.1.2)."},
      {q:"महा+ऋषि=महर्षि demonstrates:", opts:["Guṇa only","Uraṇ Rapharaḥ — r inserted with ṛ","Vṛddhi","Lopa"], ans:1, exp:"1.1.51: a+ṛ→ar (r inserted because no retroflex Guṇa)."},
      {q:"Tapara restricts vowel to:", opts:["All 18 variants","Exact duration only","Long only","Vedic only"], ans:1, exp:"1.1.70: exact duration. अत् = only short अ."},
      {q:"Short vowel before cluster becomes:", opts:["Laghu","Guru","Pluta","Anunāsika"], ans:1, exp:"1.4.11: saṃyoge guru."},
    ],
    vedic:[
      {dev:"वृद्धिरादैच् ।", roman:"vṛddhirādaic", trans:"Ā, AI, and AU are called Vṛddhi.", source:"Aṣṭādhyāyī 1.1.1 — The FIRST sūtra", rel:"The very first sūtra is a DEFINITION, not an operation. The entire grammar begins by naming its vocabulary."},
      {dev:"अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।", roman:"agnim īḷe purohitaṃ yajñasya devam ṛtvijam", trans:"I praise Agni, the household priest, the divine officiant of the sacrifice.", source:"Ṛgveda 1.1.1 — First verse of the entire Ṛgveda", rel:"The first verse of the Ṛgveda demonstrates Guṇa in action — Pāṇini placed the Guṇa sūtra at 1.1.2 for this very reason."},
    ],
    levels:{
      easy:[
        {q:"Guṇa vowels (1.1.2):", opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"], ans:1, exp:"अ ए ओ = Guṇa. First-level strengthened vowels."},
        {q:"Vṛddhi vowels (1.1.1):", opts:["अ ए ओ","इ ई उ","आ ऐ औ","ए ओ only"], ans:2, exp:"आ ऐ औ = Vṛddhi. Sūtra 1.1.1 = FIRST sūtra!"},
        {q:"Each short vowel (like अ) has how many forms?", opts:["3","9","12","18"], ans:3, exp:"3 durations × 3 tones × 2 nasality = 18 phonetically distinct forms."},
      ],
      medium:[
        {q:"महा+ऋषि=महर्षि demonstrates:", opts:["Guṇa only","Uraṇ Rapharaḥ (1.1.51) — r inserted with ṛ","Vṛddhi","Vowel drop"], ans:1, exp:"No retroflex Guṇa vowel exists, so r is inserted: a+ṛ→ar."},
        {q:"Diphthongs (ए ओ ऐ औ) have how many forms?", opts:["6","12","18","24"], ans:1, exp:"Only 12 — no Hrasva (short) form exists for diphthongs."},
      ],
      hard:[
        {q:"Vṛddhi (1.1.1) as FIRST sūtra signals:", opts:["Most common","Grammar begins with DEFINITIONS — 'what is Vṛddhi?' must be known before any operation","Most beautiful","Tradition"], ans:1, exp:"The Aṣṭādhyāyī begins with vocabulary definitions before procedures."},
      ],
    },
  },
  {
    id:6, num:"Ch 6", title:"Varṇa Samāmnāya",
    subtitle:"The Sanskrit Sound Inventory · Phonemes · Ūṣma & Ayogavāha",
    icon:"🔤", color:"#06B6D4",
    concepts:[
      {term:"9 स्वर (Svara/Vowels)", meaning:"अ इ उ ऋ ऌ + 4 diphthongs ए ऐ ओ औ = 9 core vowels. Each with Hrasva/Dīrgha variants.", example:"a-ā, i-ī, u-ū, ṛ-ṝ, ḷ, e, ai, o, au", cat:"phonetics", sutra:""},
      {term:"5 वर्ग (Consonant Classes)", meaning:"5 × 5 = 25 stop consonants organized by place of articulation. Each row = same Sthāna.", example:"क-वर्ग · च-वर्ग · ट-वर्ग · त-वर्ग · प-वर्ग", cat:"varga", sutra:""},
      {term:"4 अन्तःस्थ (Semivowels)", meaning:"य र ल व — between vowels and consonants. Abhyantara Prayatna = Īṣat-spṛṣṭa.", example:"य=palatal · र=cerebral · ल=dental · व=labial", cat:"phonetics", sutra:""},
      {term:"4 ऊष्म (Sibilants/Fricatives)", meaning:"श ष स ह — 'warm' sounds with Ūṣman (heat/friction).", example:"श=palatal · ष=cerebral · स=dental · ह=guttural", cat:"phonetics", sutra:""},
      {term:"अयोगवाह", meaning:"Sounds without independent Sthāna — Anusvāra (ं), Visarga (ः), Jihvāmūlīya, Upadhmānīya.", example:"रामं · देवः — inherited Sthāna from host sound", cat:"phonetics", sutra:""},
    ],
    quiz:[
      {q:"How many core vowels in Sanskrit?", opts:["5","7","9","11"], ans:2, exp:"9 core vowels: a i u ṛ ḷ e ai o au."},
      {q:"Semivowels are:", opts:["क ग न","य र ल व","श ष स ह","ए ओ ऐ"], ans:1, exp:"य र ल व = Antaḥstha (semivowels)."},
      {q:"How many stop consonants in 5 Vargas?", opts:["20","25","30","35"], ans:1, exp:"5 Vargas × 5 each = 25 stop consonants."},
      {q:"Ayogavāha sounds:", opts:["Have fixed Sthāna","Inherit Sthāna from host sound","Have no Sthāna","Only nasals"], ans:1, exp:"Ayogavāhas are phonetically flexible — their Sthāna depends on environment."},
    ],
    vedic:[
      {dev:"ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।", roman:"īśāvāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat", trans:"All this, whatever moves in this moving world, is pervaded by the Lord.", source:"Īśāvāsyopaniṣad 1", rel:"The first verse uses every major sound class — a showcase of the complete Sanskrit phoneme system."},
    ],
    levels:{
      easy:[
        {q:"How many core vowels?", opts:["5","7","9","12"], ans:2, exp:"9 core vowels."},
        {q:"Semivowels are:", opts:["क ग न","य र ल व","श ष स ह","ए ओ ऐ"], ans:1, exp:"य र ल व = Antaḥstha."},
      ],
      medium:[
        {q:"5 Vargas × 5 consonants each =", opts:["20","25","30","35"], ans:1, exp:"25 stop consonants total."},
      ],
      hard:[
        {q:"Anusvāra's Sthāna is:", opts:["Fixed at Kaṇṭha","Nasal of following consonant's class","Always Tālu","No Sthāna"], ans:1, exp:"Anusvāra inherits the nasal place from the consonant that follows it."},
      ],
    },
  },
  {
    id:7, num:"Ch 7", title:"Dhātu & Pratyaya",
    subtitle:"Verbal Roots · Suffixes · Morphology of Sanskrit Words",
    icon:"🌿", color:"#EC4899",
    concepts:[
      {term:"धातु (Dhātu / Root)", meaning:"The minimal meaningful unit of a verb. ~2000 roots listed in Pāṇini's Dhātupāṭha.", example:"√भू (to be) · √कृ (to do) · √गम् (to go)", cat:"morphology", sutra:""},
      {term:"प्रत्यय (Pratyaya / Suffix)", meaning:"A suffix appended to a root or nominal base. Carries It-markers for operational guidance.", example:"क्त → past participle: गत, भूत, कृत", cat:"morphology", sutra:"3.1.1"},
      {term:"लकार (Lakāra / Tense-Mood Markers)", meaning:"10 abstract markers for tense and mood. Named with L + consonant.", example:"लट्=Present · लिट्=Perfect · लुट्=1st Future · लृट्=2nd Future", cat:"process", sutra:"3.2.123"},
      {term:"तिङ् (Tiṅ / Verbal Endings)", meaning:"18 verb endings: 9 Parasmaipada + 9 Ātmanepada × 3 persons × 3 numbers.", example:"पठ+ति=he reads · पठ+न्ति=they read · पठ+सि=you read", cat:"morphology", sutra:"3.4.77"},
      {term:"उपसर्ग (Upasarga / Prefix)", meaning:"22 verbal prefixes that modify root meaning. Counted in Pāṇini's grammar.", example:"प्र+गम्=to go forward · अप+गम्=to go away · उप+गम्=to approach", cat:"upasarga", sutra:"1.4.59"},
    ],
    quiz:[
      {q:"Dhātupāṭha contains approximately:", opts:["500","1000","2000","5000"], ans:2, exp:"Pāṇini listed ~2000 verbal roots in the Dhātupāṭha."},
      {q:"How many Lakāras?", opts:["6","8","10","12"], ans:2, exp:"10 Lakāras for tense and mood."},
      {q:"Tiṅ endings cover:", opts:["3 persons only","3 persons × 3 numbers × 2 padas = 18","Only present tense","Nominal forms"], ans:1, exp:"18 Tiṅ endings: 9 Parasmai + 9 Ātmane."},
      {q:"Upasargas are:", opts:["Case endings","Verbal prefixes modifying root meaning","Nominal suffixes","Accents"], ans:1, exp:"22 Upasargas as per 1.4.59."},
    ],
    vedic:[
      {dev:"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।", roman:"karmaṇy evādhikāras te mā phaleṣu kadācana", trans:"Your right is to action alone, never to the fruits thereof.", source:"Bhagavad Gītā 2.47", rel:"The word 'karma' derives from √kṛ (to do) — the most foundational Dhātu in Sanskrit. Grammar and philosophy share roots."},
    ],
    levels:{
      easy:[
        {q:"√भू means:", opts:["To know","To be / to become","To go","To say"], ans:1, exp:"√भू = to be, to become. One of the most fundamental roots."},
        {q:"Upasargas are:", opts:["Case endings","Verbal prefixes","Noun suffixes","Accents"], ans:1, exp:"Upasargas modify verbal root meaning."},
      ],
      medium:[
        {q:"लट् Lakāra indicates:", opts:["Perfect","Present tense","Future","Imperative"], ans:1, exp:"लट् = Present tense (vartamāna)."},
      ],
      hard:[
        {q:"It-markers on Pratyayas serve to:", opts:["Decorate","Guide operational rules without appearing in output","Change meaning","Indicate accent"], ans:1, exp:"Pratyaya It-markers silently direct sandhi, accent, and substitution rules."},
      ],
    },
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
══════════════════════════════════════════════════════════════════════════ */
const CMS_KEY = "devavani.chapters.v3";

function cloneChapters(v) { return JSON.parse(JSON.stringify(v)); }

function cleanTitle(term) {
  return term.replace(/\s*\([^)]*\)/g,"").replace(/\s+—.*$/g,"").trim();
}

function getSubchapters(ch) {
  return ch.concepts.map((c, i) => ({
    id: `${ch.id}.${i+1}`,
    title: cleanTitle(c.term),
    concepts: [c],
  }));
}

function loadChapters() {
  try {
    const saved = localStorage.getItem(CMS_KEY);
    if (!saved) return cloneChapters(CHAPTERS);
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : cloneChapters(CHAPTERS);
  } catch { return cloneChapters(CHAPTERS); }
}

function saveChapters(ch) {
  try { localStorage.setItem(CMS_KEY, JSON.stringify(ch)); } catch {}
}

/* ══════════════════════════════════════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════════════════════════════════════ */
function ProgressBar({ value, max, color, h = 6 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="pbar-wrap" style={{ height: h }}>
      <div className="pbar-fill" style={{ width: `${pct}%`, height: h, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
    </div>
  );
}

function CategoryTag({ cat, color }) {
  const c = color || CC[cat] || "var(--gold-vivid)";
  return (
    <span className="tag" style={{ color: c, borderColor: `${c}55`, background: `${c}14`, fontSize: 10 }}>
      {cat}
    </span>
  );
}

function SutraRef({ sutra }) {
  if (!sutra) return null;
  return (
    <span className="sutra-badge">
      <span>📜</span>{sutra}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLASHCARD
══════════════════════════════════════════════════════════════════════════ */
function FlipCard({ concept, index }) {
  const [flipped, setFlipped] = useState(false);
  const c = CC[concept.cat] || "var(--gold-vivid)";
  return (
    <div
      className={`flashcard-wrap animate-fade-up delay-${Math.min(index+1,6)}`}
      onClick={() => setFlipped(x => !x)}
      role="button"
      aria-label={`Flashcard: ${concept.term}`}
    >
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="flashcard-front glass-card">
          <div className="flashcard-hint">Click to reveal</div>
          <div className="flashcard-term">{concept.term}</div>
          {concept.sutra && (
            <div className="flashcard-roman" style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
              Sūtra {concept.sutra}
            </div>
          )}
          <div style={{ marginTop: 16, display:"flex", gap: 8, flexWrap:"wrap", justifyContent:"center" }}>
            <CategoryTag cat={concept.cat} />
          </div>
        </div>
        <div className="flashcard-back" style={{ borderColor: `${c}55` }}>
          <div className="flashcard-hint" style={{ color: c }}>Meaning</div>
          <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7, marginBottom: 12, textAlign:"center" }}>
            {concept.meaning}
          </div>
          <div className="concept-example" style={{ borderLeft: `3px solid ${c}` }}>
            {concept.example}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   QUIZ VIEW
══════════════════════════════════════════════════════════════════════════ */
function QuizView({ chapter, onScore }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = chapter.quiz;
  const current = questions[qi];

  function choose(i) {
    if (answered) return;
    setSel(i);
    setAnswered(true);
    if (i === current.ans) setScore(s => s + 1);
  }

  function next() {
    if (qi + 1 >= questions.length) {
      setDone(true);
      onScore?.(score + (sel === current.ans ? 1 : 0), questions.length);
    } else {
      setQi(q => q + 1);
      setSel(null);
      setAnswered(false);
    }
  }

  if (done) {
    const final = score;
    const pct = Math.round((final / questions.length) * 100);
    const passed = pct >= 75;
    return (
      <div className="score-display animate-scale-in">
        <div className="score-circle" style={{ borderColor: passed ? "var(--teal)" : "var(--saffron)", margin:"0 auto 20px" }}>
          <div className="score-number" style={{ color: passed ? "var(--teal)" : "var(--saffron)" }}>{pct}%</div>
          <div className="score-label">{final}/{questions.length}</div>
        </div>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:8 }}>
          {passed ? "✨ Excellent!" : "Keep Practising"}
        </h3>
        <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:20 }}>
          {passed ? "Chapter mastered! Earning XP…" : `Score ≥75% to master. You got ${pct}%.`}
        </p>
        <button className="btn btn-primary" onClick={() => { setQi(0); setSel(null); setAnswered(false); setScore(0); setDone(false); }}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-wrap animate-fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, fontSize:13, color:"var(--text-muted)" }}>
        <span>Question {qi + 1} of {questions.length}</span>
        <span className="badge badge-gold">Score: {score}</span>
      </div>
      <div style={{ height:3, background:"var(--border-faint)", borderRadius:3, marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((qi)/questions.length)*100}%`, background:"linear-gradient(90deg,var(--gold-deep),var(--gold-vivid))", transition:"width 0.4s", borderRadius:3 }} />
      </div>
      <div className="quiz-question">
        <span className="text-devanagari" style={{ fontSize:16 }}>{current.q}</span>
      </div>
      <div className="quiz-options">
        {current.opts.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option ${sel === i ? (i === current.ans ? "correct" : "wrong") : ""} ${answered && i === current.ans && sel !== i ? "correct" : ""}`}
            onClick={() => choose(i)}
            disabled={answered}
          >
            <span className="quiz-option-letter" style={{ color: sel === i ? (i === current.ans ? "var(--teal)" : "var(--saffron)") : "var(--text-muted)" }}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-devanagari" style={{ fontSize:14 }}>{opt}</span>
          </button>
        ))}
      </div>
      {answered && (
        <div className="quiz-explanation animate-fade-in">
          <strong>{sel === current.ans ? "✅ Correct!" : "❌ Not quite."}</strong> {current.exp}
        </div>
      )}
      {answered && (
        <button className="btn btn-primary w-full" onClick={next}>
          {qi + 1 >= questions.length ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LEVEL TEST
══════════════════════════════════════════════════════════════════════════ */
function LevelTest({ chapter, onXP, levelBadges, onBadge }) {
  const [level, setLevel] = useState(null);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = level ? (chapter.levels?.[level] || []) : [];
  const current = questions[qi];

  const xpMap = { easy: 10, medium: 20, hard: 40 };

  function choose(i) {
    if (answered) return;
    setSel(i);
    setAnswered(true);
    if (i === current.ans) setScore(s => s + 1);
  }

  function next() {
    if (qi + 1 >= questions.length) {
      setDone(true);
      const earned = (score + (sel === current.ans ? 1 : 0)) * xpMap[level];
      onXP?.(earned);
      onBadge?.(chapter.id, level);
    } else {
      setQi(q => q + 1);
      setSel(null);
      setAnswered(false);
    }
  }

  if (!level) {
    return (
      <div className="animate-fade-up">
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, marginBottom:6 }}>🏆 Mastery Test</h3>
        <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:20 }}>Choose your challenge level to earn XP badges</p>
        <div className="level-grid">
          {[
            { id:"easy",   icon:"🌱", name:"Beginner",  desc:`${chapter.levels?.easy?.length||0} questions · ${xpMap.easy}XP each`,  color:"var(--teal)"  },
            { id:"medium", icon:"⚡", name:"Intermediate", desc:`${chapter.levels?.medium?.length||0} questions · ${xpMap.medium}XP each`, color:"var(--gold-vivid)" },
            { id:"hard",   icon:"🔥", name:"Advanced",  desc:`${chapter.levels?.hard?.length||0} questions · ${xpMap.hard}XP each`,  color:"var(--saffron)" },
          ].map(l => {
            const hasBadge = levelBadges?.[chapter.id]?.includes(l.id);
            return (
              <button
                key={l.id}
                className="level-card"
                onClick={() => l.id === "easy" || chapter.levels?.[l.id]?.length ? setLevel(l.id) : null}
                style={{ border: `1.5px solid ${hasBadge ? l.color : "var(--border-faint)"}`, background: hasBadge ? `${l.color}0d` : "var(--surface-1)" }}
              >
                <div className="level-icon">{hasBadge ? "🥇" : l.icon}</div>
                <div className="level-name" style={{ color: l.color }}>{l.name}</div>
                <div className="level-desc">{l.desc}</div>
                {hasBadge && <div style={{ fontSize:10, color:l.color, fontWeight:700, marginTop:6 }}>Badge Earned!</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (done) {
    const final = score;
    const xp = final * xpMap[level];
    return (
      <div className="score-display animate-scale-in">
        <div className="score-circle" style={{ borderColor:"var(--gold-vivid)", margin:"0 auto 20px" }}>
          <div className="score-number" style={{ color:"var(--gold-vivid)" }}>{xp}</div>
          <div className="score-label">XP Earned</div>
        </div>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:8 }}>
          🥇 {level.charAt(0).toUpperCase() + level.slice(1)} Badge Earned!
        </h3>
        <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:20 }}>
          {final}/{questions.length} correct at {level} level
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setLevel(null); setQi(0); setSel(null); setAnswered(false); setScore(0); setDone(false); }}>
            Try Another Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap animate-fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, fontSize:13, color:"var(--text-muted)" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setLevel(null)}>← Back</button>
        <span>{level} · Q{qi+1}/{questions.length}</span>
      </div>
      <div className="quiz-question">
        <span className="text-devanagari" style={{ fontSize:16 }}>{current.q}</span>
      </div>
      <div className="quiz-options">
        {current.opts.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option ${sel === i ? (i === current.ans ? "correct" : "wrong") : ""} ${answered && i === current.ans && sel !== i ? "correct" : ""}`}
            onClick={() => choose(i)}
            disabled={answered}
          >
            <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
            <span className="text-devanagari" style={{ fontSize:14 }}>{opt}</span>
          </button>
        ))}
      </div>
      {answered && (
        <div className="quiz-explanation animate-fade-in">
          <strong>{sel === current.ans ? "✅ Correct!" : "❌ Not quite."}</strong> {current.exp}
        </div>
      )}
      {answered && (
        <button className="btn btn-primary w-full" onClick={next}>
          {qi + 1 >= questions.length ? "Finish & Claim Badge →" : "Next →"}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   VEDIC TEXTS VIEW
══════════════════════════════════════════════════════════════════════════ */
function VedicView({ vedic }) {
  if (!vedic?.length) return (
    <div style={{ textAlign:"center", padding:"48px 24px", color:"var(--text-muted)" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>📜</div>
      <p>No Vedic sources for this chapter yet.</p>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {vedic.map((v, i) => (
        <div key={i} className={`vedic-card animate-fade-up delay-${i+1}`}>
          <div className="vedic-dev">{v.dev}</div>
          <div className="vedic-roman">{v.roman}</div>
          <div className="vedic-translation">"{v.trans}"</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
            <span className="vedic-source-badge">📚 {v.source}</span>
          </div>
          {v.rel && <div className="vedic-connection">💡 {v.rel}</div>}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTER DETAIL
══════════════════════════════════════════════════════════════════════════ */
function ChapterDetail({ ch, chapters, onBack, onNavigate }) {
  const { scores, completed, recordScore, recordLevelBadge, addXP, levelBadges } = useProgress();
  const [tab, setTab] = useState("concepts");
  const [activeSub, setActiveSub] = useState(null);

  const isDone = completed?.has?.(ch.id);
  const chScore = scores?.[ch.id] || 0;
  const subchapters = getSubchapters(ch);
  const chIdx = chapters.findIndex(c => c.id === ch.id);
  const prevCh = chIdx > 0 ? chapters[chIdx - 1] : null;
  const nextCh = chIdx < chapters.length - 1 ? chapters[chIdx + 1] : null;

  const TABS = [
    { k:"concepts",   label:"📖 Learn",     desc:"Structured content" },
    { k:"flashcards", label:"🎴 Flashcards", desc:"Flip & test" },
    { k:"quiz",       label:"⚡ Quick Quiz", desc:"Score ≥75%" },
    { k:"test",       label:"🏆 Mastery",    desc:"Earn badges + XP" },
    { k:"vedic",      label:"📜 Sources",    desc:"Vedic connections" },
    { k:"watch",      label:"🎬 Watch",      desc:"Video lectures" },
  ];

  function jumpTo(id) {
    setTab("concepts");
    setActiveSub(id);
    setTimeout(() => {
      document.getElementById(`sub-${id}`)?.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 80);
  }

  return (
    <div className="app-layout" style={{ minHeight:"calc(100vh - var(--nav-h))" }}>
      {/* Sidebar — subchapter navigation */}
      <aside className="sidebar">
        <div className="sidebar-section-label">Subchapters</div>
        {subchapters.map(sub => (
          <button
            key={sub.id}
            className={`sidebar-chapter ${activeSub === sub.id ? "active" : ""}`}
            onClick={() => jumpTo(sub.id)}
            style={{ "--ch-color": ch.color }}
          >
            <span className="ch-num" style={{ color: ch.color }}>{sub.id}</span>
            <span className="ch-title">{sub.title}</span>
          </button>
        ))}
        <div className="divider" />
        <div className="sidebar-section-label">Navigation</div>
        {prevCh && (
          <button className="sidebar-chapter" onClick={() => onNavigate(prevCh)}>
            <span className="ch-icon">←</span>
            <span className="ch-title" style={{ fontSize:11 }}>{prevCh.title}</span>
          </button>
        )}
        {nextCh && (
          <button className="sidebar-chapter" onClick={() => onNavigate(nextCh)}>
            <span className="ch-icon" style={{ color: nextCh.color }}>→</span>
            <span className="ch-title" style={{ fontSize:11 }}>{nextCh.title}</span>
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="main-content">
        <div className="content-inner">
          {/* Breadcrumb */}
          <div className="chapter-breadcrumb animate-fade-in">
            <button onClick={onBack}>All Chapters</button>
            <span>›</span>
            <span style={{ color: ch.color }}>{ch.icon} {ch.title}</span>
          </div>

          {/* Chapter hero */}
          <div className="chapter-hero animate-fade-up">
            <div className="chapter-hero-icon" style={{ background:`${ch.color}18`, border:`2px solid ${ch.color}44` }}>
              <span style={{ fontSize:30 }}>{ch.icon}</span>
            </div>
            <div className="label-caps" style={{ color: ch.color, marginBottom:8 }}>{ch.num}</div>
            <h1 style={{ fontSize:"clamp(22px,4vw,32px)", marginBottom:8, lineHeight:1.2 }}>{ch.title}</h1>
            <p style={{ fontSize:15, color:"var(--text-secondary)", marginBottom:16 }}>{ch.subtitle}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:20 }}>
              <span className="badge badge-gold">📚 {ch.concepts.length} concepts</span>
              <span className="badge badge-success">❓ {ch.quiz.length} quiz questions</span>
              {isDone && <span className="badge badge-success">✅ Mastered</span>}
              {chScore > 0 && <span className="badge badge-gold">+{chScore * 15}XP earned</span>}
            </div>
            {chScore > 0 && <ProgressBar value={chScore} max={ch.quiz.length} color={ch.color} h={5} />}
          </div>

          {/* Subchapter pills (mobile-friendly) */}
          <div className="subchapter-nav">
            {subchapters.map(sub => (
              <button
                key={sub.id}
                className={`sub-nav-btn ${activeSub === sub.id ? "active" : ""}`}
                onClick={() => jumpTo(sub.id)}
                style={activeSub === sub.id ? { background:`${ch.color}1a`, borderColor:`${ch.color}55`, color:ch.color } : {}}
              >
                <span style={{ fontSize:11, fontWeight:800, color: ch.color }}>{sub.id}</span>
                {sub.title}
              </button>
            ))}
          </div>

          {/* Tab bar */}
          <div className="tab-bar">
            {TABS.map(t => (
              <button
                key={t.k}
                className={`tab-btn ${tab === t.k ? "active" : ""}`}
                onClick={() => setTab(t.k)}
                style={tab === t.k ? { color: ch.color, borderBottomColor: ch.color } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "concepts" && (
            <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
              {subchapters.map((sub, si) => (
                <section key={sub.id} id={`sub-${sub.id}`} className="subchapter-section">
                  <div className="subchapter-heading">
                    <span
                      className="subchapter-badge"
                      style={{ background:`${ch.color}20`, color:ch.color, border:`1px solid ${ch.color}55` }}
                    >
                      {sub.id}
                    </span>
                    <div>
                      <h2 style={{ fontSize:20, margin:0, lineHeight:1.2 }}>{sub.title}</h2>
                      <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:3 }}>
                        Subchapter {sub.id} · Chapter {ch.id}
                      </div>
                    </div>
                  </div>
                  {sub.concepts.map((c, ci) => {
                    const catColor = CC[c.cat] || "var(--gold-vivid)";
                    return (
                      <div
                        key={ci}
                        className={`concept-card animate-fade-up delay-${ci+1}`}
                        style={{ borderLeftColor: catColor }}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                          <h3 className="concept-term">
                            <span className="concept-term-dev">{c.term}</span>
                          </h3>
                          <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
                            <CategoryTag cat={c.cat} />
                            <SutraRef sutra={c.sutra} />
                          </div>
                        </div>
                        <p className="concept-meaning">{c.meaning}</p>
                        <div className="concept-example">{c.example}</div>
                      </div>
                    );
                  })}
                </section>
              ))}
              {/* Chapter nav */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12, marginTop:8 }}>
                <button
                  className="glass-card"
                  style={{ padding:"16px", textAlign:"left", cursor:prevCh?"pointer":"not-allowed", opacity:prevCh?1:0.4, border:"none" }}
                  disabled={!prevCh}
                  onClick={() => prevCh && onNavigate(prevCh)}
                >
                  <div className="label-caps" style={{ marginBottom:6 }}>← Previous Chapter</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{prevCh ? `${prevCh.icon} ${prevCh.title}` : "Start of course"}</div>
                </button>
                <button
                  className="glass-card"
                  style={{ padding:"16px", textAlign:"left", cursor:nextCh?"pointer":"not-allowed", opacity:nextCh?1:0.4, border:`1px solid ${nextCh?.color || "var(--border-faint)"}55` }}
                  disabled={!nextCh}
                  onClick={() => nextCh && onNavigate(nextCh)}
                >
                  <div className="label-caps" style={{ color:nextCh?.color || "var(--text-muted)", marginBottom:6 }}>Next Chapter →</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{nextCh ? `${nextCh.icon} ${nextCh.title}` : "Course complete!"}</div>
                </button>
              </div>
            </div>
          )}

          {tab === "flashcards" && (
            <div>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:20 }}>Click each card to reveal the meaning and example.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
                {ch.concepts.map((c, i) => <FlipCard key={i} concept={c} index={i} />)}
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:20 }}>Score ≥ 75% to mark this chapter as mastered.</p>
              <div className="glass-card" style={{ padding:24 }}>
                <QuizView chapter={ch} onScore={(s, t) => recordScore?.(ch.id, s, t)} />
              </div>
            </div>
          )}

          {tab === "test" && (
            <div className="glass-card" style={{ padding:24 }}>
              <LevelTest chapter={ch} onXP={addXP} levelBadges={levelBadges} onBadge={recordLevelBadge} />
            </div>
          )}

          {tab === "vedic" && (
            <div>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:20 }}>Vedic verses and sūtras connecting grammar to sacred tradition.</p>
              <VedicView vedic={ch.vedic} />
            </div>
          )}

          {tab === "watch" && (
            <div className="glass-card" style={{ padding:40, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>📺</div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:24, marginBottom:8 }}>Watch: {ch.title}</h3>
              <p style={{ color:"var(--text-secondary)", fontSize:15, lineHeight:1.7, marginBottom:24, maxWidth:440, margin:"0 auto 24px" }}>
                Lectures by <strong style={{ color:"var(--gold-vivid)" }}>Pushpa Dikshit</strong> · Aṣṭādhyāyī Sahajabodha · Pauspi Prakriyā method
              </p>
              <a
                href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ textDecoration:"none", background:"linear-gradient(135deg,#FF0000,#CC0000)" }}
              >
                ▶ Open YouTube Playlist
              </a>
              <div style={{ marginTop:20, fontFamily:"var(--font-dev)", color:"var(--gold-vivid)", fontSize:20, opacity:0.7 }}>ॐ पाणिनये नमः</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CHAPTERS LIST SCREEN
══════════════════════════════════════════════════════════════════════════ */
function ChaptersScreen({ chapters, onOpen }) {
  const { scores, completed } = useProgress();

  return (
    <div className="main-content">
      <div className="content-inner" style={{ maxWidth:"100%" }}>
        <div style={{ marginBottom:28 }}>
          <div className="label-caps" style={{ marginBottom:8 }}>Curriculum</div>
          <h1 style={{ fontSize:"clamp(24px,4vw,36px)", marginBottom:8 }}>All Chapters</h1>
          <p style={{ color:"var(--text-muted)", fontSize:15 }}>
            {chapters.length} modules · Pushpa Dikshit's Aṣṭādhyāyī Sahajabodha · Pauspi Prakriyā method
          </p>
        </div>
        <div className="chapters-grid">
          {chapters.map((ch, idx) => {
            const done = completed?.has?.(ch.id);
            const cs = scores?.[ch.id] || 0;
            const subs = getSubchapters(ch);
            const pct = ch.quiz.length > 0 ? Math.round((cs / ch.quiz.length) * 100) : 0;
            return (
              <button
                key={ch.id}
                className={`chapter-card animate-fade-up delay-${Math.min(idx+1,6)} ${done ? "completed" : ""}`}
                style={{ "--ch-color":ch.color, "--ch-color-subtle":`${ch.color}14` }}
                onClick={() => onOpen(ch)}
              >
                <div className="ch-card-header">
                  <div className="ch-card-icon">
                    <span style={{ fontSize:22 }}>{ch.icon}</span>
                  </div>
                  <div className="ch-card-meta">
                    <div className="ch-card-num" style={{ color:ch.color }}>{ch.num}</div>
                    <div className="ch-card-title">{ch.title}</div>
                  </div>
                  {done && <span style={{ fontSize:18, flexShrink:0 }}>✅</span>}
                </div>
                <p className="ch-card-subtitle">{ch.subtitle}</p>
                <div className="ch-card-tags">
                  {subs.slice(0, 4).map(s => (
                    <span key={s.id} className="tag" style={{ color:ch.color, borderColor:`${ch.color}44`, background:`${ch.color}10`, fontSize:10 }}>
                      {s.id}
                    </span>
                  ))}
                  {subs.length > 4 && (
                    <span className="tag" style={{ color:"var(--text-muted)", borderColor:"var(--border-faint)", background:"var(--surface-1)", fontSize:10 }}>
                      +{subs.length - 4} more
                    </span>
                  )}
                </div>
                <div className="ch-card-footer">
                  <span>📚 {ch.concepts.length} terms</span>
                  <span>❓ {ch.quiz.length} questions</span>
                  {cs > 0 && <span style={{ color:ch.color, fontWeight:700 }}>🏅 {cs*15}XP</span>}
                </div>
                {cs > 0 && <div style={{ marginTop:10 }}><ProgressBar value={cs} max={ch.quiz.length} color={ch.color} h={4} /></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GLOSSARY SCREEN
══════════════════════════════════════════════════════════════════════════ */
function GlossaryScreen({ chapters, onOpen }) {
  const [q, setQ] = useState("");
  const [catF, setCatF] = useState("all");

  const all = chapters.flatMap(ch =>
    ch.concepts.map(c => ({ ...c, chTitle: ch.title, chapter: ch }))
  );
  const cats = [...new Set(all.map(t => t.cat))].sort();
  const filtered = all.filter(t => {
    const matchCat = catF === "all" || t.cat === catF;
    const matchQ = !q || t.term.toLowerCase().includes(q.toLowerCase()) || t.meaning.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="main-content">
      <div className="content-inner">
        <div style={{ marginBottom:24 }}>
          <div className="label-caps" style={{ marginBottom:8 }}>Reference</div>
          <h1 style={{ fontSize:"clamp(22px,4vw,32px)", marginBottom:6 }}>📖 Glossary</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14 }}>{all.length} terms across {chapters.length} chapters</p>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search terms or meanings…"
            aria-label="Search glossary"
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${catF === "all" ? "active" : ""}`} onClick={() => setCatF("all")}>All</button>
          {cats.map(c => (
            <button
              key={c}
              className={`filter-pill ${catF === c ? "active" : ""}`}
              onClick={() => setCatF(c === catF ? "all" : c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:12 }}>{filtered.length} results</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map((t, i) => {
            const cc = CC[t.cat] || "var(--gold-vivid)";
            return (
              <button
                key={i}
                className={`glossary-item animate-fade-up delay-${Math.min(i+1,6)}`}
                style={{ borderLeftColor: cc }}
                onClick={() => onOpen(t.chapter)}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>
                      {t.term}
                    </span>
                    {t.sutra && <span style={{ fontSize:11, color:"var(--text-muted)", fontStyle:"italic" }}>({t.sutra})</span>}
                  </div>
                  <CategoryTag cat={t.cat} color={cc} />
                </div>
                <div style={{ fontSize:13, color:"var(--text-secondary)", marginBottom:6, lineHeight:1.6 }}>{t.meaning}</div>
                <div style={{ fontSize:12, color:cc, background:`${cc}14`, padding:"4px 10px", borderRadius:6, display:"inline-block", fontFamily:"var(--font-dev)" }}>
                  {t.example}
                </div>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:6 }}>→ {t.chTitle}</div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"var(--text-muted)" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <p>No terms match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROGRESS SCREEN
══════════════════════════════════════════════════════════════════════════ */
function ProgressScreen({ chapters, onOpen }) {
  const { scores, completed, totalXP, streak, syncing } = useProgress();
  const tc = chapters.length;
  const donePct = tc > 0 ? Math.round((completed?.size / tc) * 100) : 0;

  return (
    <div className="main-content">
      <div className="content-inner">
        <div style={{ marginBottom:24 }}>
          <div className="label-caps" style={{ marginBottom:8 }}>Your Journey</div>
          <h1 style={{ fontSize:"clamp(22px,4vw,32px)", marginBottom:6 }}>📈 My Progress</h1>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color: syncing ? "var(--gold-vivid)" : "var(--teal)" }}>
            {syncing ? "⏳ Saving to cloud…" : "✅ All progress saved"}
          </div>
        </div>

        {/* Hero summary */}
        <div className="progress-hero animate-fade-up">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:24 }}>
            {[
              { v:`${completed?.size||0}/${tc}`, l:"Chapters Done",  c:"var(--gold-vivid)" },
              { v:`${totalXP||0} XP`,           l:"Experience",      c:"var(--teal)" },
              { v:`🔥 ${streak||0}`,             l:"Day Streak",      c:"var(--saffron)" },
              { v:`${donePct}%`,                 l:"Overall Mastery", c:"var(--lotus)" },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="stat-value" style={{ color:s.c }}>{s.v}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:8, display:"flex", justifyContent:"space-between", fontSize:14 }}>
            <span style={{ fontWeight:600 }}>Overall Mastery</span>
            <span style={{ color:"var(--gold-vivid)", fontWeight:700 }}>{donePct}%</span>
          </div>
          <div className="pbar-wrap" style={{ height:10 }}>
            <div className="pbar-fill" style={{ width:`${donePct}%`, height:10 }} />
          </div>
        </div>

        {/* Chapter list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {chapters.map(ch => {
            const s = scores?.[ch.id] || 0;
            const done = completed?.has?.(ch.id);
            const pct = ch.quiz.length > 0 ? Math.round((s / ch.quiz.length) * 100) : 0;
            return (
              <button
                key={ch.id}
                className="glass-card"
                style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer", border:`1.5px solid ${done ? ch.color+"66" : "var(--border-faint)"}`, textAlign:"left", width:"100%", fontFamily:"var(--font-body)" }}
                onClick={() => onOpen(ch)}
              >
                <span style={{ fontSize:20, flexShrink:0 }}>{ch.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, gap:8 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {ch.title}
                    </span>
                    <span style={{ fontSize:12, color:ch.color, fontWeight:700, flexShrink:0 }}>{pct}%</span>
                  </div>
                  <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={4} />
                  <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>
                    {s}/{ch.quiz.length} questions · {s * 15}XP
                  </div>
                </div>
                {done && <span style={{ fontSize:16, flexShrink:0 }}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOME SCREEN
══════════════════════════════════════════════════════════════════════════ */
function HomeScreen({ chapters, onOpen }) {
  const { scores, completed, totalXP, streak } = useProgress();
  const { userProfile } = useAuth();
  const firstName = (userProfile?.displayName || "").split(" ")[0] || "Scholar";
  const next = chapters.find(ch => !completed?.has?.(ch.id));
  const inProg = chapters.filter(ch => (scores?.[ch.id] > 0) && !completed?.has?.(ch.id)).slice(0, 3);
  const done = [...(completed || [])].length;
  const pct = chapters.length > 0 ? Math.round((done / chapters.length) * 100) : 0;

  return (
    <div style={{ paddingBottom:80 }}>
      {/* HERO */}
      <section className="hero-section">
        <span className="hero-om" aria-hidden="true">ॐ</span>
        <div className="hero-sub animate-fade-up">देवभाषा — Language of the Cosmos</div>
        <h1 className="hero-title animate-fade-up delay-1">
          नमस्ते, {firstName}
        </h1>
        <p className="hero-desc animate-fade-up delay-2">
          Master Pāṇini's Aṣṭādhyāyī through structured chapters, interactive flashcards, and levelled quizzes. The world's most precise grammar system awaits.
        </p>

        {/* Stats */}
        <div className="stats-grid animate-fade-up delay-3">
          {[
            { v:`${done}/${chapters.length}`, l:"Chapters", c:"var(--gold-vivid)" },
            { v:`${totalXP||0}`,              l:"XP Earned",  c:"var(--teal)" },
            { v:`🔥 ${streak||0}`,            l:"Streak",     c:"var(--saffron)" },
            { v:`${pct}%`,                    l:"Mastery",    c:"var(--lotus)" },
          ].map(s => (
            <div key={s.l} className="stat-card">
              <div className="stat-value" style={{ color:s.c }}>{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="main-content" style={{ paddingTop:0 }}>
        <div className="content-inner" style={{ maxWidth:"100%" }}>
          {/* Continue where you left off */}
          {next && (
            <div style={{ marginBottom:32 }}>
              <div className="label-caps" style={{ marginBottom:12 }}>Continue Learning</div>
              <button
                className="continue-card animate-fade-up"
                style={{ borderColor:next.color }}
                onClick={() => onOpen(next)}
              >
                <div style={{ width:48, height:48, borderRadius:12, background:`${next.color}20`, border:`2px solid ${next.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                  {next.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div className="label-caps" style={{ color:next.color, marginBottom:4 }}>Up Next</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"var(--text-primary)", marginBottom:3 }}>{next.title}</div>
                  <div style={{ fontSize:13, color:"var(--text-muted)" }}>{next.subtitle}</div>
                </div>
                <span style={{ fontSize:20, color:next.color, flexShrink:0 }}>→</span>
              </button>
            </div>
          )}

          {/* In progress */}
          {inProg.length > 0 && (
            <div style={{ marginBottom:32 }}>
              <div className="label-caps" style={{ marginBottom:12 }}>In Progress</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {inProg.map(ch => {
                  const s = scores?.[ch.id] || 0;
                  const pctCh = Math.round((s / ch.quiz.length) * 100);
                  return (
                    <button key={ch.id} className="glass-card" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", cursor:"pointer", border:`1px solid ${ch.color}44`, textAlign:"left", fontFamily:"var(--font-body)", width:"100%" }} onClick={() => onOpen(ch)}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{ch.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", marginBottom:4 }}>{ch.title}</div>
                        <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={3} />
                      </div>
                      <span style={{ fontSize:12, color:ch.color, fontWeight:700 }}>{pctCh}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div style={{ marginBottom:32 }}>
            <div className="label-caps" style={{ marginBottom:12 }}>All Chapters</div>
            <div className="chapters-grid">
              {chapters.slice(0, 6).map((ch, idx) => {
                const done = completed?.has?.(ch.id);
                return (
                  <button
                    key={ch.id}
                    className={`chapter-card animate-fade-up delay-${Math.min(idx+1,6)}`}
                    style={{ "--ch-color":ch.color }}
                    onClick={() => onOpen(ch)}
                  >
                    <div className="ch-card-header">
                      <div className="ch-card-icon"><span style={{ fontSize:22 }}>{ch.icon}</span></div>
                      <div className="ch-card-meta">
                        <div className="ch-card-num" style={{ color:ch.color }}>{ch.num}</div>
                        <div className="ch-card-title">{ch.title}</div>
                      </div>
                      {done && <span>✅</span>}
                    </div>
                    <p className="ch-card-subtitle">{ch.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════════════════════════════════ */
function ProfileScreen({ chapters, onOpen }) {
  const { user, userProfile, updateUserProfile, signOut } = useAuth();
  const { scores, completed, totalXP, streak, syncing, resetProgress, exportProgress } = useProgress();
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || "",
    bio: userProfile?.bio || "",
    learningGoal: userProfile?.learningGoal || "",
    preferredScript: userProfile?.preferredScript || "Devanagari + Roman",
    dailyTarget: userProfile?.dailyTarget || 20,
    avatarColor: userProfile?.avatarColor || "#f5a623",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const mastery = chapters.length ? Math.round(((completed?.size||0) / chapters.length) * 100) : 0;

  useEffect(() => {
    if (userProfile) setForm({ displayName:userProfile.displayName||"", bio:userProfile.bio||"", learningGoal:userProfile.learningGoal||"", preferredScript:userProfile.preferredScript||"Devanagari + Roman", dailyTarget:userProfile.dailyTarget||20, avatarColor:userProfile.avatarColor||"#f5a623" });
  }, [userProfile]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try { await updateUserProfile?.(form); setMsg("Profile saved successfully."); }
    catch(err) { setMsg(err?.message || "Could not save."); }
    finally { setSaving(false); }
  }

  return (
    <div className="main-content">
      <div className="content-inner">
        <div className="label-caps" style={{ marginBottom:16 }}>Account</div>
        {/* Avatar hero */}
        <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:28 }} className="animate-fade-up">
          <div className="profile-avatar" style={{ background:`linear-gradient(135deg,${form.avatarColor},${form.avatarColor}cc)`, color:"#0a0b14" }}>
            {(form.displayName || user?.email || "U").slice(0,2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize:22, marginBottom:4 }}>{form.displayName || "Sanskrit Learner"}</h2>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>{user?.email}</div>
            <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
              <span className="xp-badge">⭐ {totalXP||0} XP</span>
              <span className="streak-badge">🔥 {streak||0} day streak</span>
              <span className="badge badge-success">{syncing?"⏳ Saving":"✅ Synced"}</span>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {/* Profile form */}
          <div className="glass-card" style={{ padding:22 }}>
            <div className="label-caps" style={{ marginBottom:14 }}>Profile & Preferences</div>
            <form onSubmit={save}>
              <div className="form-field">
                <label className="form-label">Display Name</label>
                <input className="form-input" value={form.displayName} onChange={e => setForm(f=>({...f,displayName:e.target.value}))} />
              </div>
              <div className="form-field">
                <label className="form-label">Learning Goal</label>
                <input className="form-input" value={form.learningGoal} onChange={e => setForm(f=>({...f,learningGoal:e.target.value}))} placeholder="e.g. Read the Aṣṭādhyāyī" />
              </div>
              <div className="form-field">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="Your Sanskrit journey…" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div className="form-field">
                  <label className="form-label">Script</label>
                  <select className="form-select" value={form.preferredScript} onChange={e => setForm(f=>({...f,preferredScript:e.target.value}))}>
                    <option>Devanagari + Roman</option>
                    <option>Devanagari only</option>
                    <option>Roman only</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Daily Target (min)</label>
                  <input className="form-input" type="number" min="5" step="5" value={form.dailyTarget} onChange={e => setForm(f=>({...f,dailyTarget:e.target.value}))} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Avatar Color</label>
                <input type="color" value={form.avatarColor} onChange={e => setForm(f=>({...f,avatarColor:e.target.value}))} style={{ width:"100%", height:40, borderRadius:8, border:"none", padding:4, cursor:"pointer", background:"transparent" }} />
              </div>
              {msg && <div style={{ padding:"10px 14px", background:msg.includes("saved")?"var(--teal-lt)":"var(--saffron-lt)", borderRadius:8, fontSize:13, color:msg.includes("saved")?"var(--teal)":"var(--saffron)", marginBottom:12 }}>{msg}</div>}
              <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                {saving ? "Saving…" : "Save Profile"}
              </button>
            </form>
          </div>

          {/* Stats + actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div className="glass-card" style={{ padding:22 }}>
              <div className="label-caps" style={{ marginBottom:14 }}>Progress Vault</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[{v:`${completed?.size||0}/${chapters.length}`,l:"Chapters"},{v:`${totalXP||0}XP`,l:"Experience"},{v:`🔥${streak||0}`,l:"Streak"},{v:`${mastery}%`,l:"Mastery"}].map(s=>(
                  <div key={s.l} className="stat-card"><div className="stat-value" style={{ fontSize:18 }}>{s.v}</div><div className="stat-label">{s.l}</div></div>
                ))}
              </div>
              <div className="pbar-wrap" style={{ height:6, marginBottom:8 }}>
                <div className="pbar-fill" style={{ width:`${mastery}%`, height:6 }} />
              </div>
              <div style={{ fontSize:12, color:"var(--text-muted)" }}>{mastery}% of curriculum mastered</div>
            </div>
            <div className="glass-card" style={{ padding:22 }}>
              <div className="label-caps" style={{ marginBottom:14 }}>Account Actions</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button className="btn btn-ghost w-full" onClick={() => { const d={profile:userProfile,progress:exportProgress?.(),at:new Date().toISOString()}; navigator.clipboard?.writeText(JSON.stringify(d,null,2)); setMsg("Data copied to clipboard."); }}>
                  📋 Export My Data
                </button>
                <button className="btn btn-ghost w-full" onClick={() => { if(window.confirm("Reset all progress?")) { resetProgress?.(); setMsg("Progress reset."); } }}>
                  🔄 Reset Progress
                </button>
                <button className="btn btn-ghost w-full" style={{ color:"var(--saffron)", borderColor:"rgba(255,107,53,0.30)" }} onClick={() => signOut?.()}>
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { loaded: progressLoaded } = useProgress();
  const [chapters, setChapters] = useState(loadChapters);
  const [nav, setNav] = useState("home");
  const [activeChap, setActiveChap] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth gates
  if (authLoading || (user && !progressLoaded))
    return <LoadingScreen message={authLoading ? "Checking account…" : "Loading progress…"} />;
  if (!user) return <AuthScreen />;

  function openChapter(ch) { setActiveChap(ch); setNav("chapter"); setSidebarOpen(false); }
  function goTo(page) { setNav(page); if (page !== "chapter") setActiveChap(null); setSidebarOpen(false); }

  const activeChapter = activeChap ? chapters.find(c => c.id === activeChap.id) || activeChap : null;

  const NAV = [
    { id:"home",     icon:"🏠", label:"Home"     },
    { id:"chapters", icon:"📚", label:"Chapters"  },
    { id:"progress", icon:"📈", label:"Progress"  },
    { id:"glossary", icon:"📖", label:"Glossary"  },
    { id:"profile",  icon:"👤", label:"Profile"   },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Cosmos mandala */}
      <div className="cosmos-mandala" aria-hidden="true">ॐ</div>

      {/* TOP NAV */}
      <nav className="top-nav" aria-label="Primary navigation">
        <button
          className="nav-brand"
          onClick={() => goTo("home")}
          style={{ background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"none" }}
        >
          <div className="nav-brand-icon">🕉️</div>
          <div>
            <div className="nav-brand-text">Devavāṇī</div>
            <div className="nav-brand-sub">Sanskrit · Pāṇini · Aṣṭādhyāyī</div>
          </div>
        </button>

        {/* Desktop nav links */}
        <ul className="nav-links" role="list">
          {NAV.map(n => (
            <li key={n.id}>
              <button
                className={`nav-link ${(nav === n.id || (nav === "chapter" && n.id === "chapters")) ? "active" : ""}`}
                onClick={() => goTo(n.id)}
                aria-current={nav === n.id ? "page" : undefined}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Breadcrumb for chapter */}
          {nav === "chapter" && activeChapter && (
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", fontSize:12, fontFamily:"var(--font-body)" }} onClick={() => goTo("chapters")}>
                Chapters
              </button>
              <span>›</span>
              <span style={{ color:activeChapter.color, fontWeight:600, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {activeChapter.title}
              </span>
            </div>
          )}
          <UserAvatar totalChapters={chapters.length} onNavigate={goTo} />
          {/* Mobile menu toggle */}
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(x => !x)}
            style={{ background:"var(--surface-1)", border:"1px solid var(--border-faint)", borderRadius:8, padding:"8px 10px", cursor:"pointer", fontSize:18, color:"var(--text-secondary)", display:"none" }}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar menu */}
      {sidebarOpen && (
        <div
          className="sidebar open"
          style={{ zIndex:160, paddingTop:16 }}
          aria-label="Navigation menu"
        >
          <div className="sidebar-section-label">Navigation</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`sidebar-chapter ${nav === n.id ? "active" : ""}`}
              onClick={() => goTo(n.id)}
            >
              <span className="ch-icon">{n.icon}</span>
              <span className="ch-title">{n.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main style={{ flex:1 }}>
        {nav === "home" && <HomeScreen chapters={chapters} onOpen={openChapter} />}
        {nav === "chapters" && !activeChap && <ChaptersScreen chapters={chapters} onOpen={openChapter} />}
        {nav === "chapter" && activeChapter && (
          <ChapterDetail
            key={activeChapter.id}
            ch={activeChapter}
            chapters={chapters}
            onBack={() => goTo("chapters")}
            onNavigate={openChapter}
          />
        )}
        {nav === "progress" && <ProgressScreen chapters={chapters} onOpen={openChapter} />}
        {nav === "glossary" && <GlossaryScreen chapters={chapters} onOpen={openChapter} />}
        {nav === "profile" && <ProfileScreen chapters={chapters} onOpen={openChapter} />}
      </main>

      {/* BOTTOM NAV (mobile) */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`bottom-nav-btn ${(nav === n.id || (nav === "chapter" && n.id === "chapters")) ? "active" : ""}`}
              onClick={() => goTo(n.id)}
              aria-current={nav === n.id ? "page" : undefined}
            >
              <span className="bnav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}