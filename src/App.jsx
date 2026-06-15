// src/App.jsx — Ashtadhyayi Sahajabodha v2 (Auth + Progress Sync)
import { useState } from "react";
import { useAuth }     from "./contexts/AuthContext.jsx";
import { useProgress } from "./contexts/ProgressContext.jsx";
import AuthScreen      from "./components/AuthScreen.jsx";
import LoadingScreen   from "./components/LoadingScreen.jsx";
import UserAvatar      from "./components/UserAvatar.jsx";

const T={
  bg:"#FAF6EF",bgCard:"#FFFDF7",bgAlt:"#F3EDD8",bgDeep:"#EDE3C8",
  border:"#E2D5B5",borderDk:"#C9B98A",
  text:"#2C1A0E",textMid:"#6B4F2A",textSoft:"#A08850",
  gold:"#B8860B",goldLt:"#D4A843",saffron:"#C8503A",green:"#4A7C59",
  blue:"#3B6B9A",teal:"#2A7F7F",purple:"#7B4F8A",orange:"#C8703A",
  pink:"#9B4A6A",olive:"#6B7A3A",slate:"#5A6E8A",
  shadow:"0 2px 12px rgba(44,26,14,0.10)",
};
const CC={
  grammar:T.green,phonetics:T.blue,varga:T.orange,special:T.purple,
  core:T.saffron,sutra:T.gold,pratyahara:T.teal,articulation:"#8B5E3C",
  sthana:"#9B6B30",effort:"#607080",duration:T.teal,tone:"#7B50A0",
  nasality:T.pink,samjna:T.gold,meter:"#3A8050",position:T.blue,
  operation:T.saffron,agama:T.green,upasarga:T.orange,morphology:T.purple,
  process:T.blue,architecture:T.slate,vedic:T.purple,philosophy:T.textMid,
  history:"#8B5A30",rule:T.olive,precision:T.saffron,shorthand:T.teal,
  theory:T.slate,method:T.teal,classification:T.orange,conflict:T.saffron,
  sutratype:T.gold,optionality:T.green,
};

const CHAPTERS=[
  {id:1,num:"§1-2",title:"Dhātu & Pratipadika",subtitle:"Verbal Roots & Nominal Stems",icon:"🌱",color:"#4A7C59",accent:"#EDF5EF",
   concepts:[
    {term:"धातु (Dhātu)",meaning:"Words denoting action. Sūtra 1.3.1: भुवादयो धातवः",example:"भू·पठ्·लिख्·गम्·हस्",cat:"grammar",sutra:"1.3.1"},
    {term:"औपदेशिक धातु",meaning:"1,930 original roots in Dhātupāṭha, 10 Gaṇas",example:"Gaṇa 1→भवति · Gaṇa 6→पठति · Gaṇa 10→चोरयति",cat:"grammar",sutra:""},
    {term:"सनाद्यन्त धातु (3.1.32)",meaning:"Derivative roots via 12 suffixes: सन्·यङ्·णिच् etc.",example:"पठ्+सन्=पिपठिषति · भू+णिच्=भावयति",cat:"grammar",sutra:"3.1.32"},
    {term:"प्रातिपदिक (1.2.45)",meaning:"Meaningful words — neither root nor suffix",example:"पुस्तक·घर·गाय·कृष्ण·राम",cat:"grammar",sutra:"1.2.45"},
    {term:"कृत्तद्धितसमासाश्च (1.2.46)",meaning:"Kṛdanta+Taddhitānta+Samāsa are also Pratipadika",example:"पठित(kṛdanta)·पाठक(taddhita)·राजपुरुष(samāsa)",cat:"grammar",sutra:"1.2.46"},
    {term:"त्रिमुनि",meaning:"Three foundational sages of Sanskrit grammar",example:"पाणिनि(Sūtras)·कात्यायन(Vārttikas)·पतञ्जलि(Mahābhāṣya)",cat:"history",sutra:""},
    {term:"10 गण",meaning:"10 root-classes, each with a vikaraṇa (class-marker)",example:"1=शप् · 2=Ø(Luk) · 3=श्लु · 6=श · 10=णिच्",cat:"grammar",sutra:""},
   ],
   quiz:[
    {q:"How many Dhātus in Pāṇini's Dhātupāṭha?",opts:["500","1,930","3,978","42"],ans:1,exp:"1,930 Aupadeshika Dhātus in 10 Gaṇas."},
    {q:"Which sūtra defines Dhātu?",opts:["1.2.45","1.3.1","3.1.32","1.1.1"],ans:1,exp:"Bhuvādayo dhātavaḥ (1.3.1)."},
    {q:"Curādi Gaṇa (Group 10) vikaraṇa:",opts:["शप्","श्ना","णिच्","उ"],ans:2,exp:"Curādi uses णिच् — all causatives belong here."},
    {q:"'Kṛttaddhitasamāsāśca' adds to Pratipadika:",opts:["All words","Kṛdanta+Taddhitānta+Samāsa","Only nouns","Suffixes"],ans:1,exp:"1.2.46 extends 1.2.45 to include all three derived categories."},
   ],
   vedic:[
    {dev:"चत्वारि वाक् परिमिता पदानि तानि विदुर्ब्राह्मणा ये मनीषिणः ।",roman:"catvāri vāk parimitā padāni tāni viduḥ brāhmaṇā ye manīṣiṇaḥ",
     trans:"Speech has four measured forms; the wise Brāhmaṇas know them all.",source:"Ṛgveda 1.164.45",link:"https://sacred-texts.com/hin/rigveda/rv01164.htm",
     rel:"The four levels of speech (Parā·Paśyantī·Madhyamā·Vaikharī) map onto Pāṇini's system. Dhātus carry meaning at the Paśyantī level; Pratipadikas bring it to Vaikharī (spoken)."},
    {dev:"अथ शब्दानुशासनम् ।",roman:"atha śabdānuśāsanam",trans:"Now begins the discipline of words.",
     source:"Mahābhāṣya — Patañjali",link:"https://sacred-texts.com/hin/",
     rel:"Patañjali's opening. The word 'atha' itself is an Avyaya Pratipadika — showing the system in action from the very first word."},
    {dev:"भूवादयो धातवः ।",roman:"bhūvādayo dhātavaḥ",trans:"Bhū and words like it are Dhātus.",
     source:"Aṣṭādhyāyī 1.3.1",link:"https://ashtadhyayi.com/sutraani/1/3/1",
     rel:"Six syllables covering all 1,930 roots via Anuvṛtti. Supreme economy — the foundational Saṃjñā-sūtra."},
   ],
   levels:{
    easy:[
      {q:"Which is a Dhātu?",opts:["पुस्तक","भू","रामः","लेखनी"],ans:1,exp:"भू (to be) is a Dhātu. The others are Pratipadikas."},
      {q:"How many roots in Dhātupāṭha?",opts:["500","1,930","3,000","42"],ans:1,exp:"1,930 Aupadeshika Dhātus in 10 Gaṇas."},
      {q:"'Trimuni' refers to:",opts:["3 vowels","Pāṇini+Kātyāyana+Patañjali","3 Gaṇas","3 Pratyāhāras"],ans:1,exp:"Three sages: Pāṇini·Kātyāyana·Patañjali."},
      {q:"Sūtra for Dhātu:",opts:["1.2.45","1.3.1","3.1.32","1.1.1"],ans:1,exp:"Bhuvādayo dhātavaḥ (1.3.1)."},
      {q:"'पठित' is:",opts:["Dhātu","Kṛdanta Pratipadika","Simple noun","Upasarga"],ans:1,exp:"पठ्+क्त = पठित — Kṛdanta Pratipadika."},
    ],
    medium:[
      {q:"Sūtra 3.1.32 creates:",opts:["Original 1930 roots","Derivative roots via San·Nic·Yaṅ","Pratipadikas","Compounds"],ans:1,exp:"Atideshika Dhātus — formed by adding 12 suffixes to existing roots."},
      {q:"Which is NOT part of Pañcāṅga?",opts:["Dhātupāṭha","Gaṇapāṭha","Lipipāṭha","Liṅgānuśāsana"],ans:2,exp:"'Lipipāṭha' doesn't exist. 5 parts: Sūtra+Dhātu+Gaṇa+Uṇādi+Liṅga."},
      {q:"Why 1.2.45 excludes 'pratyaya'?",opts:["Suffixes are Dhātus","Suffix alone lacks independent meaning","Convention","Grammar"],ans:1,exp:"Pratipadika must be 'arthavat' — independently meaningful."},
      {q:"Adādi Gaṇa (Group 2) is special because:",opts:["Most roots","Śap vikaraṇa undergoes LUK deletion","Uses Nic","Only Vedic"],ans:1,exp:"Group 2: Śap undergoes Luk, signaling specific stem operations."},
      {q:"'पठित' demonstrates:",opts:["Dhātu usage","Kṛdanta — kta suffix on root = Pratipadika","Upasarga","Sandhi"],ans:1,exp:"पठ्+क्त = Kṛdanta. Kṛdantas are Pratipadika per 1.2.46."},
    ],
    hard:[
      {q:"'पठ्+सन् → पिपठिष' is called:",opts:["Aupadeshika","Atideshika / Sanādyanta Dhātu","Pratipadika","Āgama"],ans:1,exp:"New root from San suffix = Atideshika Dhātu, takes its own conjugational endings."},
      {q:"1.2.45 vs 1.2.46 relationship:",opts:["Both equal","1.2.45 defines core; 1.2.46 EXTENDS via Anuvṛtti","1.2.46 cancels","Unrelated"],ans:1,exp:"1.2.46 uses Anuvṛtti of 'Pratipadikam' from 1.2.45 — perfect economy."},
      {q:"Why is 1.3.1 a Saṃjñā Sūtra?",opts:["Performs phonetics","Defines/names the technical term 'Dhātu'","Resolves conflict","Governs sūtras"],ans:1,exp:"Saṃjñā sūtras assign technical labels. Without 'Dhātu', no rule could refer to all verbal roots."},
      {q:"22 Upasargas × 1930 roots shows grammar is:",opts:["A fixed list","GENERATIVE — finite rules produce infinite outputs","Only descriptive","An error"],ans:1,exp:"22×1930 = 42,460+ compounds. Plus sanādyanta×tenses×persons = unlimited productivity."},
      {q:"Curādi (Group 10) using णिच् means all verbs are:",opts:["Passive","CAUSATIVE — णिच् itself signals causation","Desiderative","Intensive"],ans:1,exp:"Curādi roots with णिच्: चोरयति, पाठयति, भावयति — all causative."},
    ],
   }},
  {id:2,num:"§3-8",title:"Varṇamātrikā",subtitle:"9 Vowels · 33 Consonants · 5 Varga Groups",icon:"🔤",color:"#3B6B9A",accent:"#EBF1F8",
   concepts:[
    {term:"स्वर (Svara/Ach)",meaning:"9 independent vowels. 'स्वयं राजन्ते' — self-luminous",example:"अ  इ  उ  ऋ  ऌ  ए  ओ  ऐ  औ",cat:"phonetics",sutra:""},
    {term:"व्यञ्जन (Hal)",meaning:"33 consonants. Manifest only with vowel support",example:"25 sparśa + 4 antaḥstha + 4 ūṣma = 33",cat:"phonetics",sutra:""},
    {term:"5 वर्ग",meaning:"25 stops in 5 groups by Sthāna. Pattern: UV·AUV·V·AV·Nasal",example:"क-वर्ग:क ख ग घ ङ · च-वर्ग:च छ ज झ ञ · ट-वर्ग:ट ठ ड ढ ण · त-वर्ग:त थ द ध न · प-वर्ग:प फ ब भ म",cat:"varga",sutra:""},
    {term:"उदित् — कु चु टु तु पु",meaning:"Varga shorthand. 'उ'=It-marker → deleted. कु = entire Kavarga",example:"कु=क ख ग घ ङ · चु=च छ ज झ ञ",cat:"shorthand",sutra:""},
    {term:"अन्तःस्थ (Yaṇ)",meaning:"4 semi-vowels — between vowels and consonants",example:"य  र  ल  व",cat:"phonetics",sutra:""},
    {term:"ऊष्म (Śal)",meaning:"4 sibilants+aspirate — friction sounds",example:"श  ष  स  ह",cat:"phonetics",sutra:""},
   ],
   quiz:[
    {q:"How many Svaras?",opts:["7","9","11","33"],ans:1,exp:"9: अ इ उ ऋ ऌ ए ओ ऐ औ."},
    {q:"Why Svaras are placed first?",opts:["Convention","Pradhāna — self-sufficient","Shorter","Random"],ans:1,exp:"Svayam rājante — independent precedes dependent."},
    {q:"Total Vyañjanas:",opts:["25","29","33","42"],ans:2,exp:"25 Sparśa+4 Antaḥstha+4 Ūṣma = 33."},
    {q:"'Udit' names (Ku…) represent:",opts:["One consonant","Entire 5-letter Varga","A vowel","A prefix"],ans:1,exp:"'उ' = It-marker → entire group of 5."},
   ],
   vedic:[
    {dev:"शीक्षां व्याख्यास्यामः । वर्णः स्वरः । मात्रा बलम् ।",roman:"śīkṣāṃ vyākhyāsyāmaḥ · varṇaḥ svaraḥ · mātrā balam",
     trans:"We shall explain Phonetics: Sound, Pitch, Duration, Force, Modulation, Continuity.",
     source:"Taittirīya Upaniṣad 1.2.1",link:"https://sacred-texts.com/hin/tmu/tmu04.htm",
     rel:"Oldest systematic phonetics text — predating Pāṇini. Defines exact categories forming the Varṇamātrikā. The alphabet is cosmic sound-structure mapped to the vocal tract."},
    {dev:"अकारो वाव ब्रह्म ।",roman:"akāro vāva brahma",trans:"The letter 'अ' indeed IS Brahman.",
     source:"Chāndogya Upaniṣad 2.23.4",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"'अ' placed FIRST because it represents Brahman — ground of all sound. Every consonant adds 'अ' to itself (क=क्+अ). Cosmic significance of Svaras preceding Vyañjanas."},
    {dev:"ॐ खं ब्रह्म ।",roman:"oṃ khaṃ brahma",trans:"Om, space, is Brahman.",
     source:"Chāndogya Upaniṣad 4.10.4",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"OM = अ+उ+म maps onto 3 primary Sthānas: Kaṇṭha(अ), Oṣṭha(उ), lip-closure(म). The Varṇamātrikā is cosmology mapped onto the vocal tract."},
   ],
   levels:{
    easy:[
      {q:"How many Svaras in Sanskrit?",opts:["7","9","11","33"],ans:1,exp:"9 independent vowels (Ach): अ इ उ ऋ ऌ ए ओ ऐ औ."},
      {q:"Kavarga is produced at:",opts:["Tālu","Danta","Kaṇṭha","Mūrdhā"],ans:2,exp:"Kavarga = guttural at Kaṇṭha (throat)."},
      {q:"Total consonants (Hal):",opts:["25","29","33","42"],ans:2,exp:"25 Sparśa+4 Antaḥstha+4 Ūṣma = 33."},
      {q:"Semi-vowels (Yaṇ) are:",opts:["श ष स ह","य र ल व","क ख ग घ","अ इ उ"],ans:1,exp:"य र ल व = 4 semi-vowels."},
      {q:"'Udit' names represent:",opts:["One consonant","Entire 5-letter Varga","A vowel","A prefix"],ans:1,exp:"'उ' = It-marker → entire group of 5."},
    ],
    medium:[
      {q:"Why Svaras placed FIRST in Varṇamātrikā?",opts:["Convention","Pradhāna — independent, self-sufficient","Shorter","Historical"],ans:1,exp:"Svayam rājante svarāḥ — independent entities precede dependent ones."},
      {q:"ए ऐ ओ औ are called 'sandhyakṣara' because:",opts:["Long","Junction of two vowels: a+i=e, a+u=o","Nasal","Only compounds"],ans:1,exp:"ए=अ+इ · ओ=अ+उ. Two Sthānas used simultaneously — junction letters."},
      {q:"'Anyag bhavati vyañjanam' means:",opts:["Primary","Depend on vowels — cannot stand alone","Nasals","Vedic only"],ans:1,exp:"Vyañjana = manifests (vi+añj) only WITH vowel help. Apradhāna (secondary)."},
      {q:"Why exactly 5 Vargas?",opts:["Arbitrary","Exactly 5 places produce stop consonants","Tradition","Vedic"],ans:1,exp:"5 Sthānas: Kaṇṭha·Tālu·Mūrdhā·Danta·Oṣṭha. Each produces exactly 5 stop consonants."},
      {q:"Total Vyañjanas:",opts:["25","29","33","42"],ans:2,exp:"25 Sparśa+4 Antaḥstha+4 Ūṣma = 33."},
    ],
    hard:[
      {q:"OM (अ+उ+म) maps onto which 3 Sthānas?",opts:["Random","Kaṇṭha(अ)+Oṣṭha(उ)+Nāsikā-closure(म)","All 5 Vargas","Tālu+Mūrdhā+Danta"],ans:1,exp:"OM traverses the entire vocal tract — hence Chāndogya UP says 'OM khaṃ Brahma.'"},
      {q:"Udit Saṃjñā ('उ' in Ku) is technically:",opts:["Pratyāhāra","It-marker signaling 'entire Varga'","Anuvṛtti","Adhikāra"],ans:1,exp:"'उ' = It-marker. Its presence triggers: entire 5-member Varga is meant."},
      {q:"Alternating Alpa-Mahā pattern in each Varga reflects:",opts:["Random","Natural biomechanics of aspiration in the vocal tract","Vedic tradition","Grammar convention"],ans:1,exp:"Phonetic reality: unaspirated-aspirated-unaspirated-aspirated-nasal. Grammar mirrors the body's phonetic rhythm."},
      {q:"Taittirīya Prātiśākhya 'pūrve svarāḥ' reflects:",opts:["Convenience","Pradhāna before Apradhāna — cause before effect","Length order","Vedic tradition"],ans:1,exp:"Universal Indian principle: CAUSE precedes EFFECT, INDEPENDENT precedes DEPENDENT."},
      {q:"Sanskrit has exactly 9 core vowels because:",opts:["Arbitrary","3 basic positions × 3 forms = 9 — complete coverage of vocal tract","Historical","Vedic tradition"],ans:1,exp:"3 Sthānas (Kaṇṭha/Tālu/Oṣṭha) × short/diphthong-1/diphthong-2 = 9. Complete and non-redundant."},
    ],
   }},
  {id:3,num:"§19-21",title:"Māheśvara Sūtras & Pratyāhāras",subtitle:"14 Drum-Formulas · 42 Abbreviations",icon:"🥁",color:"#C8503A",accent:"#FCF0EE",
   concepts:[
    {term:"14 माहेश्वर सूत्र",meaning:"Sound-strings from Shiva's ḍamaru. Purpose = create Pratyāhāras",example:"①अ इ उ ण् ②ऋ ऌ क् ③ए ओ ङ् ④ऐ औ च् ⑤ह य व र ट् ⑥ल ण् ⑦ञ म ङ ण न म् ⑧झ भ ञ् ⑨घ ढ ध ष् ⑩ज ब ग ड द श् ⑪ख फ छ ठ थ च ट त व् ⑫क प य् ⑬श ष स र् ⑭ह ल्",cat:"core",sutra:""},
    {term:"इत् संज्ञा (1.3.3+1.3.9)",meaning:"Final consonant = marker. Named by हलन्त्यम्, deleted by तस्य लोपः",example:"'अ इ उ ण्' → ण् is It-marker",cat:"core",sutra:"1.3.3"},
    {term:"प्रत्याहार (1.1.71)",meaning:"Ādi+Antya-It = all sounds between. Sūtra: आदिरन्त्येन सहेता",example:"अ+च् = अच् (9 vowels) · ह+ल् = हल् (33 consonants)",cat:"core",sutra:"1.1.71"},
    {term:"42 प्रत्याहार",meaning:"~42 standard abbreviations. One It → multiple Pratyāhāras",example:"From क् (sūtra 2): अक्·इक्·उक् — three from one It",cat:"pratyahara",sutra:""},
    {term:"Key Pratyāhāras",meaning:"Most used in the Aṣṭādhyāyī",example:"अच्=9 vowels · हल्=33 consonants · इक्=इउऋऌ · यण्=यरलव",cat:"pratyahara",sutra:""},
   ],
   quiz:[
    {q:"How many Māheśvara Sūtras?",opts:["9","12","14","42"],ans:2,exp:"14 from Shiva's 14-beat ḍamaru."},
    {q:"'अच्' includes:",opts:["All consonants","All 9 vowels","Short vowels only","Semi-vowels"],ans:1,exp:"अ(sūtra 1)+च्(sūtra 4 It) = all 9 vowels."},
    {q:"An It-marker is:",opts:["Vowel in words","Coding marker, then deleted","A prefix","Compound vowel"],ans:1,exp:"Named by 1.3.3, deleted by 1.3.9."},
    {q:"Standard Pratyāhāras:",opts:["14","22","33","42"],ans:3,exp:"42 standard Pratyāhāras from the 14 sūtras."},
   ],
   vedic:[
    {dev:"नृत्तावसाने नटराजराजो ननाद ढक्कां नवपञ्चवारम् ।",roman:"nṛttāvasāne naṭarājarājo nanāda ḍhakkāṃ navapañcavāram",
     trans:"At the close of the cosmic dance, the King of dancers sounded his drum fourteen times.",
     source:"Traditional verse on the Māheśvara Sūtras",link:"https://ashtadhyayi.com",
     rel:"Nava-pañca = 9+5 = 14 drum beats = 14 Sūtras. Each beat encodes a group of sounds. The cosmic dance encodes the entire sound system of Sanskrit."},
    {dev:"आदिरन्त्येन सहेता ।",roman:"ādirantyen sahetā",trans:"The first sound, combined with the last marker, encompasses all sounds between.",
     source:"Aṣṭādhyāyī 1.1.71",link:"https://ashtadhyayi.com/sutraani/1/1/71",
     rel:"Five syllables defining ALL 42 Pratyāhāras at once. The most economical meta-rule in linguistics history."},
    {dev:"सिद्धे शब्दार्थसम्बन्धे लोकतो ऽर्थप्रयुक्ते शब्दप्रयोगे शास्त्रेण धर्मनियमः क्रियते ।",
     roman:"siddhe śabdārthasambandhe lokato arthaprayukte śabdaprayoge śāstreṇa dharmaniyamaḥ kriyate",
     trans:"Given that word-meaning relations are established in common usage, grammar establishes the dharma of correct word use.",
     source:"Mahābhāṣya Paspaśāhnika — Patañjali",link:"https://sacred-texts.com",
     rel:"Patañjali explains WHY grammar exists: not to CREATE language but to REGULATE it. The Māheśvara Sūtras are the foundation of this regulation."},
   ],
   levels:{
    easy:[
      {q:"How many Māheśvara Sūtras?",opts:["9","12","14","42"],ans:2,exp:"14 sūtras from Shiva's 14-beat ḍamaru."},
      {q:"'अच्' represents:",opts:["All consonants","All 9 vowels","Short vowels","Semi-vowels"],ans:1,exp:"अ(sūtra 1)+च्(sūtra 4 It) = all 9 vowels between."},
      {q:"An It-marker is:",opts:["A vowel","Marker for coding, then deleted","A prefix","Compound vowel"],ans:1,exp:"Named by halaṃtyam (1.3.3), deleted by tasya lopaḥ (1.3.9)."},
      {q:"'आदिरन्त्येन सहेता' defines:",opts:["Dhātu","ALL 42 Pratyāhāras: Ādi+Antya-It = group between","Upasarga","Lopa"],ans:1,exp:"Five syllables defining the entire Pratyāhāra system."},
      {q:"How many standard Pratyāhāras?",opts:["14","22","33","42"],ans:3,exp:"42 standard Pratyāhāras from the 14 sūtras."},
    ],
    medium:[
      {q:"Sūtras 1.3.3 + 1.3.9 together:",opts:["Define vowels","NAME the It (1.3.3) then DELETE it (1.3.9)","Create Pratyāhāras","Define Sandhi"],ans:1,exp:"Two-step It system: name then delete. Enables coding without leaving artifacts."},
      {q:"'इक्' (इ उ ऋ ऌ) is formed from:",opts:["Sūtra 1 only","इ(sūtra 1 start)+क्(sūtra 2 It)","Random","4 sūtras"],ans:1,exp:"इक् covers the 4 short non-a vowels used in 'इको यणचि.'"},
      {q:"One It-marker yields MULTIPLE Pratyāhāras by:",opts:["Changing the It","Choosing different Ādi starting sounds","Adding letters","Lopa"],ans:1,exp:"Same क् yields: अक्(from अ), इक्(from इ), उक्(from उ). Three from one It."},
      {q:"'Anubandha' is a synonym of:",opts:["Pratyāhāra","It — the marker consonant","Upasarga","Āgama"],ans:1,exp:"Both 'अनुबन्ध' and 'इत्' = temporary coding marker."},
      {q:"Hal Pratyāhāra spans sūtras:",opts:["1 to 4","5 to 14","1 to 14","3 to 12"],ans:1,exp:"ह starts in sūtra 5, ल् is It of sūtra 14. Covers all 33 consonants."},
    ],
    hard:[
      {q:"The 14 sūtras are in a specific order because:",opts:["Shiva's choice","Every Pratyāhāra has unique Ādi+It code — reordering creates conflicts","Recitation convenience","Random"],ans:1,exp:"Combinatorially optimal. Every sound-group needed has exactly one unambiguous code."},
      {q:"In 'इको यणचि', roles of इक्·यण्·अच्:",opts:["All targets","इक्=Avidhimān(condition), यण्=Vidhimān(target), अच्=Nimitta(trigger)","All triggers","Random"],ans:1,exp:"Three grammatical roles in 5 syllables: condition BECOMES target BEFORE trigger."},
      {q:"Scientific basis of sūtras' ordering:",opts:["Divine only","5-4-3-2-1 distribution reflects sandhi interaction frequency","Arbitrary","Mnemonic"],ans:1,exp:"Vowels (most-used in sandhi) come first. Most-needed Pratyāhāras are shortest to write."},
      {q:"Repetition of ह in sūtras 5 and 14 is:",opts:["Error","Intentional — enables different ranges for Hal Pratyāhāra","Random","Pronunciation guide"],ans:1,exp:"Every repetition serves a specific Pratyāhāra need. No redundancy in Pāṇini."},
      {q:"Without Pratyāhāras, one rule mentioning 'any vowel' would require:",opts:["9 entries","162 entries (9 vowels × 18 variants each)","42 entries","1 entry"],ans:1,exp:"Patañjali's mathematical proof: the compression ratio justifies the entire 14-sūtra system."},
    ],
   }},
  {id:4,num:"§22-24",title:"Sthāna · Karaṇa · Prayatna",subtitle:"8 Places · Tongue Instrument · Articulation Effort",icon:"👄",color:"#C8703A",accent:"#FAF0E8",
   concepts:[
    {term:"8 स्थान",meaning:"8 vocal-tract locations for sound production",example:"Uras·Kaṇṭha·Śiras·Jihvāmūla·Tālu·Mūrdhā·Danta·Oṣṭha+Nāsikā",cat:"sthana",sutra:"Śikṣā"},
    {term:"करण (Karaṇa)",meaning:"Tongue part that REACHES the Sthāna. जिह्वामूलेन·जिह्वामध्येन·जिह्वाग्रेण",example:"Guttural=tongue-root · Palatal=mid-tongue · Dental=tongue-tip",cat:"articulation",sutra:"TP 2.48"},
    {term:"5 आभ्यन्तर प्रयत्न",meaning:"Internal efforts: ①स्पृष्ट(stops) ②ईषत्-स्पृष्ट(semi-v) ③विवृत(vowels) ④संवृत(short-a) ⑤ईषत्-विवृत(sibilants)",example:"क=Spṛṣṭa · य=Īṣat-spṛṣṭa · अ=Vivṛta",cat:"effort",sutra:""},
    {term:"11 बाह्य प्रयत्न",meaning:"External: ①Vivāra+Śvāsa+Aghoṣa=Khar ②Saṃvāra+Nāda+Ghoṣa=Haś ③Udātta+Anudātta+Svarita",example:"क=Khar (unvoiced) · ग=Haś (voiced)",cat:"effort",sutra:""},
    {term:"सवर्ण (1.1.9)",meaning:"तुल्यास्यप्रयत्नं सवर्णम् — same Sthāna + same Abhyantara Prayatna",example:"अ and आ = Savarṇa · इ and ई = Savarṇa",cat:"samjna",sutra:"1.1.9"},
    {term:"अकुहविसर्जनीयानां कण्ठः",meaning:"Kaṇṭha for अ, Kavarga, ह, Visarga — from Pāṇinīya Śikṣā",example:"क ख ग घ ङ ह : — all guttural",cat:"sthana",sutra:"Śikṣā 13"},
   ],
   quiz:[
    {q:"Kavarga Sthāna:",opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"],ans:1,exp:"अकुहविसर्जनीयानां कण्ठः."},
    {q:"Alpaprāṇa in a Varga:",opts:["2nd·4th","1st·3rd·5th","All 5","5th only"],ans:1,exp:"1st, 3rd, 5th = Alpaprāṇa. 2nd, 4th = Mahāprāṇa."},
    {q:"Two sounds are Savarṇa when:",opts:["Same duration","Same Sthāna+same Abhyantara Prayatna","Same suffix","Same prefix"],ans:1,exp:"1.1.9: tulyāsyaprayatnaṃ savarṇam."},
    {q:"ह conjunct with semi-vowel → Sthāna:",opts:["Kaṇṭha","Tālu","Uras (chest)","Mūrdhā"],ans:2,exp:"Conjunct ह shifts to Uras (chest cavity)."},
   ],
   vedic:[
    {dev:`अकुहविसर्जनीयानां कण्ठः । इचुयशानां तालु ।
ऋटुरषाणां मूर्धा । लृतुलसानां दन्ताः ।`,
     roman:"akuhavisarjanīyānāṃ kaṇṭhaḥ · icuyaśānāṃ tālu · ṛṭuraṣāṇāṃ mūrdhā · lṛtulusānāṃ dantāḥ",
     trans:"Kaṇṭha for अ·Kavarga·ह | Tālu for इ·Chavarga·य·श | Mūrdhā for ṛ·Ṭavarga·र·ṣ | Danta for ḷ·Tavarga·ल·स",
     source:"Pāṇinīya Śikṣā verses 13-17",link:"https://sacred-texts.com/hin/",
     rel:"Pāṇini's own phonetics manual — maps every Sanskrit sound to its exact place of articulation. Makes all phonological operations in the Aṣṭādhyāyī predictable."},
    {dev:"यत्र जायते स स्थानम् । येन जायते स करणम् ॥",roman:"yatra jāyate sa sthānam · yena jāyate sa karaṇam",
     trans:"WHERE a sound is born = Sthāna. BY WHAT it is born = Karaṇa.",
     source:"Taittirīya Prātiśākhya 2.48",link:"https://sacred-texts.com",
     rel:"Elegant couplet distinguishing Sthāna (place, fixed) from Karaṇa (tongue instrument, variable). Predating Pāṇini — shows continuity of Indian phonetic science."},
    {dev:"प्राणो वाव शरीरं वायुर्वाव बलम् ।",roman:"prāṇo vāva śarīraṃ vāyurvāva balam",
     trans:"Prāṇa (breath) is the body; Vāyu (wind) is strength.",
     source:"Chāndogya Upaniṣad 1.11.5",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"The Upaniṣadic understanding of breath as life-force directly informs the Bāhya Prayatna classification into Alpaprāṇa and Mahāprāṇa. Grammar and Vedānta share the same breath."},
   ],
   levels:{
    easy:[
      {q:"Kavarga Sthāna:",opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"],ans:1,exp:"अकुहविसर्जनीयानां कण्ठः."},
      {q:"Ṭavarga Sthāna:",opts:["Kaṇṭha","Tālu","Mūrdhā","Danta"],ans:2,exp:"Mūrdhā (cerebral) for ṛ·Ṭavarga·र·ṣ."},
      {q:"Alpaprāṇa letters:",opts:["2nd·4th","1st·3rd·5th","All 5","5th only"],ans:1,exp:"1st, 3rd, 5th = Alpaprāṇa. 2nd, 4th = Mahāprāṇa."},
      {q:"Savarṇa (1.1.9) means:",opts:["Both long","Same Sthāna+same Abhyantara Prayatna","Both voiced","Both nasals"],ans:1,exp:"Tulyāsyaprayatnam = same place + same internal effort."},
      {q:"ह conjunct with semi-vowel → Sthāna:",opts:["Kaṇṭha","Tālu","Uras (chest)","Mūrdhā"],ans:2,exp:"Conjunct ह shifts to Uras (chest resonance)."},
    ],
    medium:[
      {q:"Karaṇa for Palatal sounds (Chavarga):",opts:["Tongue root","Mid-tongue (Jihvāmadhya)","Tongue tip","Lips"],ans:1,exp:"Jihvāmadhya reaches up to the Tālu to produce च छ ज झ ञ."},
      {q:"'Khar' consonants share which Bāhya Prayatna?",opts:["Saṃvāra+Nāda+Ghoṣa","Vivāra+Śvāsa+Aghoṣa","All three","None"],ans:1,exp:"Khar = Vivāra(open cords)+Śvāsa(breathed)+Aghoṣa(unvoiced)."},
      {q:"ए and ऐ share 'Kaṇṭha+Tālu' because:",opts:["They are long","Diphthongs: ए=अ(Kaṇṭha)+इ(Tālu) — both places used","Tradition","Random"],ans:1,exp:"Sandhyakṣara: the mouth moves from Kaṇṭha to Tālu during articulation."},
      {q:"Abhyantara Prayatna is crucial for grammar because:",opts:["Only phonetic","Savarṇa (1.1.9) requires shared Abhyantara — determines ALL vowel substitutions","Vedic recitation","Tradition"],ans:1,exp:"Savarṇa requires matching Abhyantara Prayatna. This determines ALL sandhi substitutions."},
      {q:"How many primary Sthānas?",opts:["5","6","7","8"],ans:3,exp:"8: Uras+Kaṇṭha+Śiras+Jihvāmūla+Tālu+Mūrdhā+Danta+Oṣṭha."},
    ],
    hard:[
      {q:"ए·ऐ share Kaṇṭha+Tālu; ओ·औ share Kaṇṭha+Oṣṭha because:",opts:["Random","Diphthongs combine two component Sthānas: ए=अ(K)+इ(T), ओ=अ(K)+उ(O)","Tradition","Convention"],ans:1,exp:"Each diphthong combines two Sthānas — reflecting the two vowel-components that created it."},
      {q:"'Samānahāraṇasya sthānam' means Āyogavāhas:",opts:["Have Nāsikā always","Inherit HOST sound's Sthāna — dynamic Sthāna assignment","Fixed Sthāna","Throat always"],ans:1,exp:"Āyogavāhas are phonetically flexible: their Sthāna depends on their environment."},
      {q:"Karaṇa beyond Sthāna is needed because:",opts:["Redundant","Multiple sounds share one Sthāna but differ in HOW tongue reaches it — complete articulatory specification","Decoration","Tradition"],ans:1,exp:"Both ह and क share Kaṇṭha, but their tongue configurations differ. Sthāna+Karaṇa = complete specification. Centuries before IPA."},
      {q:"Ṛgveda Prātiśākhya defines mātrā as:",opts:["Weight unit","Time to pronounce one short vowel — basis for Hrasva/Dīrgha/Pluta","Consonant duration","Type of Ūṣma"],ans:1,exp:"The RP definition feeds directly into Pāṇini's 1.2.27. Unbroken continuity from Vedic to Classical grammar."},
      {q:"Sanskrit phonetics (5 Sthānas×5 stops) aligns with modern IPA because:",opts:["Coincidence","Both describe the SAME physical reality — the human vocal tract","Western borrowing","Tradition"],ans:1,exp:"Sanskrit phonetics is empirically correct science of the vocal tract — 2500 years before Western linguistics."},
    ],
   }},
  {id:5,num:"§25-39",title:"Vowel System & Strengthening",subtitle:"18 Forms · Savarṇa · Guṇa · Vṛddhi · Laghu-Guru",icon:"🎵",color:"#B8860B",accent:"#FDF3DC",
   concepts:[
    {term:"18 भेद per vowel",meaning:"3 durations × 3 tones × 2 nasality = 18. Diphthongs=12 (no Hrasva). ऌ=12",example:"अ→18 forms · ए→12 forms · ऌ→12 forms",cat:"theory",sutra:""},
    {term:"ह्रस्व-दीर्घ-प्लुत (1.2.27)",meaning:"Three durations: ऊकालोऽज्झ्रस्वदीर्घप्लुतः",example:"Hrasva(1 mātrā):अइउऋऌ · Dīrgha(2):आईऊएओऐऔ · Pluta(3+):रा³म!",cat:"duration",sutra:"1.2.27"},
    {term:"उदात्त-अनुदात्त-स्वरित",meaning:"Three Vedic pitch accents — Bāhya Prayatna of VOWELS only",example:"उदात्त=raised · अनुदात्त=low · स्वरित=circumflex blend",cat:"tone",sutra:"1.2.29-31"},
    {term:"गुण (1.1.2)",meaning:"अदेङ् गुणः — अ, ए, ओ. First-level strengthening",example:"उप+इन्द्र=उपेन्द्र (a+i→e) · गो+अश्व=गवाश्व",cat:"samjna",sutra:"1.1.2"},
    {term:"वृद्धि (1.1.1)",meaning:"वृद्धिरादैच् — आ, ऐ, औ. FIRST sūtra of Aṣṭādhyāyī!",example:"इ→ऐ · उ→औ · ऋ→आर्",cat:"samjna",sutra:"1.1.1"},
    {term:"उरण् रपरः (1.1.51)",meaning:"When ṛ undergoes Guṇa/Vṛddhi → insert र् (no retroflex Guṇa exists)",example:"महा+ऋषि = महर्षि (a+ṛ→ar)",cat:"sutra",sutra:"1.1.51"},
    {term:"तपर (1.1.70)",meaning:"तपरस्तत्कालस्य — vowel+त् = ONLY that duration",example:"अत् = only short अ (not ā, not ā³)",cat:"precision",sutra:"1.1.70"},
    {term:"लघु/गुरु (1.4.10-11)",meaning:"ह्रस्वं लघु · संयोगे गुरु — basis of Sanskrit meter",example:"'जल' में 'ज'=Laghu · 'जलप्रवाह' में 'ल'=Guru (before cluster प्र)",cat:"meter",sutra:"1.4.10-11"},
   ],
   quiz:[
    {q:"Guṇa vowels:",opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"],ans:1,exp:"अ ए ओ = Guṇa (1.1.2)."},
    {q:"महा+ऋषि=महर्षि demonstrates:",opts:["Guṇa only","Uraṇ Rapharaḥ — r inserted with ṛ","Vṛddhi","Lopa"],ans:1,exp:"1.1.51: a+ṛ→ar (r inserted because no retroflex Guṇa)."},
    {q:"Tapara restricts vowel to:",opts:["All 18 variants","Exact duration only","Long only","Vedic only"],ans:1,exp:"1.1.70: exact duration. अत् = only short अ."},
    {q:"Short vowel before cluster becomes:",opts:["Laghu","Guru","Pluta","Anunāsika"],ans:1,exp:"1.4.11: saṃyoge guru."},
   ],
   vedic:[
    {dev:"वृद्धिरादैच् ।",roman:"vṛddhirādaic",trans:"Ā, AI, and AU are called Vṛddhi.",
     source:"Aṣṭādhyāyī 1.1.1 — The FIRST sūtra",link:"https://ashtadhyayi.com/sutraani/1/1/1",
     rel:"The very first sūtra is a DEFINITION, not an operation. The entire grammar begins by naming its vocabulary. 'Before you can DO anything, you must KNOW the names.'"},
    {dev:"अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।",roman:"agnim īḷe purohitaṃ yajñasya devam ṛtvijam",
     trans:"I praise Agni, the household priest, the divine officiant of the sacrifice.",
     source:"Ṛgveda 1.1.1 — First verse of the entire Ṛgveda",link:"https://sacred-texts.com/hin/rigveda/rv01001.htm",
     rel:"The first verse of the Ṛgveda demonstrates Guṇa in action. 'agni + īḷe' involves vowel Sandhi using the Guṇa principle — Pāṇini placed the Guṇa sūtra at 1.1.2 specifically for this."},
    {dev:"ह्रस्वं त्वेकमात्रं भवति । दीर्घं द्विमात्रम् । प्लुतं त्रिमात्रम् ॥",
     roman:"hrasvaṃ tv ekamātraṃ bhavati · dīrghaṃ dvimātram · plutaṃ trimātram",
     trans:"Short = one mātrā · Long = two mātrās · Protracted = three mātrās.",
     source:"Ṛgveda Prātiśākhya 1.4-6",link:"https://sacred-texts.com",
     rel:"Same three-fold duration system as Pāṇini's 1.2.27 — unbroken continuity of Sanskrit phonetic science from Ṛgvedic times through Pāṇini and beyond."},
   ],
   levels:{
    easy:[
      {q:"Guṇa vowels (1.1.2):",opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"],ans:1,exp:"अ ए ओ = Guṇa. First-level strengthened vowels."},
      {q:"Vṛddhi vowels (1.1.1):",opts:["अ ए ओ","इ ई उ","आ ऐ औ","ए ओ only"],ans:2,exp:"आ ऐ औ = Vṛddhi. Sūtra 1.1.1 = FIRST sūtra!"},
      {q:"'उप+इन्द्र=उपेन्द्र' is:",opts:["Vṛddhi","Guṇa: a+i→e","Lopa","Samprasāraṇa"],ans:1,exp:"a+i=e is Guṇa. ए is the Guṇa vowel at the palatal position."},
      {q:"Pluta vowels are used for:",opts:["All words","Distant calling or Vedic chanting","Only compounds","Only Vedic"],ans:1,exp:"Pluta (3+ mātrās) = रा³म! — calling from far away."},
      {q:"Each short vowel (like अ) has how many forms?",opts:["3","9","12","18"],ans:3,exp:"3 durations × 3 tones × 2 nasality = 18 phonetically distinct forms."},
    ],
    medium:[
      {q:"महा+ऋषि=महर्षि demonstrates:",opts:["Guṇa only","Uraṇ Rapharaḥ (1.1.51) — r inserted with ṛ","Vṛddhi","Vowel drop"],ans:1,exp:"No retroflex Guṇa vowel exists, so r is inserted: a+ṛ→ar."},
      {q:"Tapara restricts vowel to:",opts:["All 18 variants","Exact duration only","Long only","All savarṇas"],ans:1,exp:"1.1.70: 'अत्' = ONLY short अ. Not ā, not ā³."},
      {q:"Vṛddhi (1.1.1) as FIRST sūtra signals:",opts:["Most common","Grammar begins with DEFINITIONS — 'what is Vṛddhi?' must be known before any operation","Most beautiful","Tradition"],ans:1,exp:"The Aṣṭādhyāyī begins with vocabulary definitions before procedures. Deliberate organizational choice."},
      {q:"Diphthongs (ए ओ ऐ औ) have how many forms?",opts:["6","12","18","24"],ans:1,exp:"Only 12 — no Hrasva (short) form exists for diphthongs."},
      {q:"Laghu syllable requires:",opts:["Any vowel","Short vowel NOT before Saṃyoga — sūtra 1.4.10","Long vowel","A nasal"],ans:1,exp:"Hrasva + no following cluster = Laghu. Critical for Sanskrit meter."},
    ],
    hard:[
      {q:"Why is Guṇa specifically अ+ए+ओ?",opts:["Arbitrary","Phonetic midpoints of 3 vowel positions: Kaṇṭha(अ), Kaṇṭha+Tālu(ए), Kaṇṭha+Oṣṭha(ओ)","Tradition","Leftover vowels"],ans:1,exp:"Not arbitrary — the 'balanced' intermediate forms at each of the 3 basic vowel positions."},
      {q:"Why Vṛddhi BEFORE Guṇa in sūtras (1.1.1 before 1.1.2)?",opts:["Alphabetical","Vipratiṣedha: Guṇa (later sūtra) WINS over Vṛddhi in conflicts — placement creates hierarchy","Tradition","Vṛddhi more common"],ans:1,exp:"Para (later) sūtra wins per 1.4.2. By placing Guṇa after Vṛddhi, Guṇa overrides Vṛddhi in operational contexts."},
      {q:"Savarṇagrāhaka+Tapara+Vidhimān creates:",opts:["Naming system","Three-level scope control: default=all 18; Tapara=one duration; Vidhimān=exact sound","Pratyāhāras","Sandhi only"],ans:1,exp:"Three-tier precision system. Together they provide complete scope control for every vowel reference in every sūtra."},
      {q:"Sanskrit meter (Anuṣṭubh, Gāyatrī) is built on:",opts:["Upasarga system","Guru-Laghu distinction (1.4.10-11) — grammar sūtras ARE the foundation of Sanskrit poetry","Lopa rules","Dhātu classification"],ans:1,exp:"Every Sanskrit verse meter is defined by Guru-Laghu sequences. Definitions from grammar sūtras 1.4.10-11. Grammar IS the foundation of Sanskrit literature."},
      {q:"'Svara' originally meant 'musical note' before 'vowel.' This reveals:",opts:["Coincidence","IDENTITY of vowel and musical note — grammar and music share the same phonetic foundation: Nāda Brahman","Unrelated terms","Modern usage"],ans:1,exp:"Svara = self-shining sound. Same concept at different scales. Nāda Brahman: cosmic sound as substrate of both music and language. Grammar IS music."},
    ],
   }},
  {id:6,num:"§40-71",title:"Morphological Operations",subtitle:"Saṃyoga · Sthānī · Ādeśa · Āgama · Upasarga",icon:"🔧",color:"#3B6B9A",accent:"#EBF1F8",
   concepts:[
    {term:"संयोग",meaning:"2+ consonants with NO intervening vowel. Critical for Guru and sandhi",example:"पुष्प:ष्+प · भक्त:क्+त · मत्स्य:त्+स्+य",cat:"phonetics",sutra:""},
    {term:"उपधा",meaning:"Penultimate letter — 'workbench' for Guṇa/Vṛddhi",example:"पठ्→Upadhā=अ · लिख्→Upadhā=इ",cat:"position",sutra:""},
    {term:"स्थानी-आदेश-निमित्त",meaning:"Original·Substitute·Trigger — Ādeśa inherits Sthānī's properties (Sthānivadbhāva)",example:"प्रति+एकः: इ=Sthānī · य्=Ādeśa · अ=Nimitta",cat:"operation",sutra:""},
    {term:"आगम: Tit·Kit·Mit",meaning:"AUGMENT: added without replacing. Tit=beginning · Kit=end · Mit=after final vowel",example:"Tit: path+tavya→pathitavya · Mit: vad+num→vand",cat:"agama",sutra:""},
    {term:"सम्प्रसारण (1.1.45)",meaning:"YaN semi-vowels→IK vowels. Reverse of vowel→semivowel sandhi",example:"वप्→उप्ते(व→उ) · यज्→इज्ते(य→इ) · ग्रह्→गृहीते",cat:"process",sutra:"1.1.45"},
    {term:"22 उपसर्ग (1.4.59)",meaning:"Parādi → Upasarga ONLY when joined to verb (Kriyāyoge)",example:"प्र+हार=attack · सम्+हार=destroy · वि+हार=wander · उप+हार=gift",cat:"upasarga",sutra:"1.4.59"},
   ],
   quiz:[
    {q:"Upadhā in 'पठ्':",opts:["प्","ठ्","अ","Whole root"],ans:2,exp:"Letter before final ठ् = अ = Upadhā."},
    {q:"Samprasāraṇa: व→?",opts:["उ","इ","ṛ","ḷ"],ans:0,exp:"वप्→उप्ते: व→उ."},
    {q:"An Āgama is:",opts:["A deletion","Added WITHOUT replacing anything","A substitution","A prefix"],ans:1,exp:"'Mitra' — joins without evicting. Purely additive."},
    {q:"हर् + वि = ?",opts:["Prahāra","Vihāra (roam)","Samhāra","Upahāra"],ans:1,exp:"Vi+harati = Vihāra = to roam/wander."},
   ],
   vedic:[
    {dev:"यज्ञेन वाचः पदवीयमायन् । तामन्वविन्दन्नृषिषु प्रविष्टाम् ।",roman:"yajñena vācaḥ padavīyam āyan · tāmanvavindan ṛṣiṣu praviṣṭām",
     trans:"Through sacrifice they reached the pathway of speech. They found it established in the seers.",
     source:"Ṛgveda 10.71.3 — Jñānasūkta",link:"https://sacred-texts.com/hin/rigveda/rv10071.htm",
     rel:"The Jñānasūkta is about language and knowledge. The seers 'distributed' (vyadadhuḥ) speech — exactly what Pāṇini's system of substitutions (Sthānī-Ādeśa) and augments (Āgama) formalizes."},
    {dev:"उपसर्गाः क्रियायोगे ।",roman:"upasargāḥ kriyāyoge",trans:"The 22 Prādi particles are called Upasargas when joined to a verb.",
     source:"Aṣṭādhyāyī 1.4.59",link:"https://ashtadhyayi.com/sutraani/1/4/59",
     rel:"Five words encoding a profound insight: the SAME particle has different grammatical identity depending on syntactic context. Standing alone = Nipāta. With verb = Upasarga. Context transforms essence."},
    {dev:"प्र देवत्रा ब्रह्माण्यृच्यसे ।",roman:"pra devatrā brahāṇy ṛcyase",trans:"You are praised with Brahman-hymns in the divine realm.",
     source:"Ṛgveda 1.1.3 (Agni Sūkta)",link:"https://sacred-texts.com/hin/rigveda/rv01001.htm",
     rel:"'प्र' (pra) appears as Upasarga in the very first hymn of the Ṛgveda — the particle of 'forward motion' that Pāṇini systematically documented as one of 22 Prādi prefixes."},
   ],
   levels:{
    easy:[
      {q:"Sthānī is:",opts:["New element","Original element being replaced","Trigger","Augment"],ans:1,exp:"Sthānī = original sound a rule will replace with an Ādeśa."},
      {q:"Samprasāraṇa: व→?",opts:["उ","इ","ṛ","ḷ"],ans:0,exp:"य→इ · व→उ · र→ṛ · ल→ḷ. So वप्→उप्ते."},
      {q:"How many Upasargas?",opts:["10","14","22","42"],ans:2,exp:"22 Prādi particles: Pra·Para·Apa·Sam…"},
      {q:"'Vihāra' means:",opts:["Attack","Destroy","Roam/relax","Gift"],ans:2,exp:"Vi+harati = Vihāra = to roam or relax."},
      {q:"'Mit' augment attaches:",opts:["At beginning","At end","After final vowel of root","Before first consonant"],ans:2,exp:"Mit inserts AFTER the root's final vowel."},
    ],
    medium:[
      {q:"Sthānivadbhāva means the Ādeśa:",opts:["Is completely new","Inherits the Sthānī's properties for subsequent rules","Deletes Sthānī","Creates new roots"],ans:1,exp:"Like replacing a gear: the new gear (Ādeśa) must fit all the same connectors as the old (Sthānī)."},
      {q:"Samprasāraṇa operates 'against' normal sandhi because:",opts:["Error","Normal: vowel+vowel→semivowel. Samprasāraṇa: semivowel in root→vowel. OPPOSITE direction for different reasons","Random","Vedic only"],ans:1,exp:"Normal sandhi = PHONOLOGICAL. Samprasāraṇa = MORPHOLOGICAL. Same sounds, opposite direction."},
      {q:"Three augment positions (Tit·Kit·Mit) cover:",opts:["Random","ALL logically possible insertion points: left edge, right edge, vowel nucleus","Tradition","Grammar convention"],ans:1,exp:"Tit=left, Kit=right, Mit=nucleus. Together they exhaust all possible augmentation sites."},
      {q:"'उप+हार=उपहार' (gift) because:",opts:["Random","Upa = near/toward — bringing near = offering/gift","Grammar rule","Tradition"],ans:1,exp:"Upa- = proximity/nearness. Spatial metaphor of prefix creates semantic shift."},
      {q:"Parādi+noun becomes 'Gati Saṃjñā' (not Upasarga) showing:",opts:["Error","SAME sound has DIFFERENT identity in different syntactic contexts","They are prepositions","Tradition"],ans:1,exp:"Prādi+verb = Upasarga. Prādi+noun = Gati Saṃjñā. Grammar recognizes context-dependence."},
    ],
    hard:[
      {q:"The ordered derivation Dvirbhāva→Abhyāsa-mod→Sandhi shows:",opts:["Simple forms","Krama (ordered pipeline): each stage receives previous stage's output — computational grammar 2500 years ago","Random","Vedic only"],ans:1,exp:"Stage 1: double root → Stage 2: modify first copy → Stage 3: Sandhi cleans junctions. A computational pipeline."},
      {q:"Why is Sthānivadbhāva (1.1.56) critical?",opts:["Tradition","Without it, after substitution ALL rules referring to original's properties would fail — maintains grammatical continuity","Simplification","Preference"],ans:1,exp:"The entire derivational chain is only possible if Sthānivadbhāva ensures each step's output can be processed by subsequent rules."},
      {q:"22 Upasargas × 1930 roots shows grammar is:",opts:["A fixed list","GENERATIVE: 42,460+ compound verbs from finite rules","Only descriptive","Historical"],ans:1,exp:"Finite rules × finite inputs = infinite outputs. Plus Sanādyanta×tenses×persons = unlimited productive capacity."},
      {q:"Pāṇini's grammar anticipated what modern linguists call:",opts:["A dictionary","Derivational Morphology with Cyclicity and Trace Theory — 2500 years before modern linguistics","A word list","Translation system"],ans:1,exp:"All of: Derivational Morphology + Cyclic Rule Application + Trace Theory (deleted elements leave traces). The Aṣṭādhyāyī is a fully worked-out theory of derivational morphology."},
      {q:"Upasarga+Verb must be a SINGLE lexical unit because:",opts:["Tradition","Upasargas modify the verb's meaning at the LEXICAL level — creating a new word, not a phrase","Grammar convenience","Vedic practice"],ans:1,exp:"English: 'break up' = phrasal (syntactic). Sanskrit: pra+bhū = prabhu (new WORD 'lord'). The semantic fusion is complete at the lexical level."},
    ],
   }},
  {id:7,num:"§72-96",title:"Deletion, Optionality & Architecture",subtitle:"Lopa · Luk-Ślu-Lup · Bahulam · 7 Sūtra Types · Laghava",icon:"🏛️",color:"#5A6E8A",accent:"#EEF1F6",
   concepts:[
    {term:"लोप (1.1.60)",meaning:"अदर्शनं लोपः — non-perception. Eternal but invisible. Patañjali: 'nāsto lopaḥ'",example:"It-markers in Māheśvara Sūtras are lopa'd after use",cat:"operation",sutra:"1.1.60"},
    {term:"लुक्-श्लु-लुप् (1.1.61)",meaning:"Three coded deletions triggering DIFFERENT subsequent behaviors",example:"लुक्=Adādi stem-changes · श्लु=Juhoty-ādi reduplication · लुप्=Taddhita gender-felt",cat:"operation",sutra:"1.1.61"},
    {term:"बाहुलक (Bahulam)",meaning:"4-fold Vedic flexibility: ①applies ②doesn't apply ③optional ④different result",example:"'बहुलं छन्दसि' covers ALL Vedic irregularities with one principle",cat:"vedic",sutra:""},
    {term:"7 प्रकार के सूत्र",meaning:"Seven functional sūtra-types",example:"①संज्ञा ②परिभाषा ③विधि ④नियम ⑤अधिकार ⑥अतिदेश ⑦निषेध",cat:"architecture",sutra:""},
    {term:"अनुवृत्ति",meaning:"Carrying words FORWARD from previous sūtras — Pāṇini's most powerful economy tool",example:"Word in sūtra N flows into sūtras N+1, N+2…silently",cat:"architecture",sutra:""},
    {term:"अर्धमात्रा-लाघव",meaning:"'ardhamātrālāghavena putrotsavaṃ…' — saving half a syllable = son's birth joy",example:"Every technique (Pratyāhāra·Anuvṛtti·It) serves THIS one principle",cat:"philosophy",sutra:""},
    {term:"विप्रतिषेधे परं (1.4.2)",meaning:"When two equal sūtras conflict, the LATER (para) one wins",example:"Exception: Pūrvasiddha (8.2.1) reverses this in the Tripādī",cat:"conflict",sutra:"1.4.2"},
   ],
   quiz:[
    {q:"Lopa (1.1.60):",opts:["Adding sound","Non-perception — invisible but present","Doubling","Augment"],ans:1,exp:"Adarśanaṃ = non-visibility. NOT destruction."},
    {q:"Total sūtras in Aṣṭādhyāyī:",opts:["1000","2000","3,978","5000"],ans:2,exp:"3,978 sūtras in 8 Adhyāyas × 4 Pādas."},
    {q:"Anuvṛtti is:",opts:["Repeat every word","Carry words forward from earlier sūtras","Add suffixes","Delete sounds"],ans:1,exp:"State once → flows forward. Key economy tool."},
    {q:"Vipratiṣedhe paraṃ kāryam:",opts:["Earlier wins","Later wins in equal conflict","Both apply","Neither applies"],ans:1,exp:"Para (later) sūtra wins. Exception: Pūrvasiddha."},
   ],
   vedic:[
    {dev:"अदर्शनं लोपः ।",roman:"adarśanaṃ lopaḥ",trans:"Non-perception is Lopa.",
     source:"Aṣṭādhyāyī 1.1.60",link:"https://ashtadhyayi.com/sutraani/1/1/60",
     rel:"A profound philosophical statement masquerading as grammar. Lopa = 'adarśana' (unperceived), not destroyed. The element exists eternally in the grammar's logic. Compare Vedānta: Brahman is not absent — merely unperceived beneath māyā."},
    {dev:"अर्धमात्रालाघवेन पुत्रोत्सवं मन्यन्ते वैयाकरणाः ।",roman:"ardhamātrālāghavena putrotsavaṃ manyante vaiyākaraṇāḥ",
     trans:"Grammarians celebrate saving even half a mātrā with the joy of a son's birth.",
     source:"Traditional proverb — Mahābhāṣya tradition",link:"https://sacred-texts.com",
     rel:"Captures the ENTIRE spirit of the Aṣṭādhyāyī. Every technique — Anuvṛtti, Adhikāra, Pratyāhāras, It-markers — exists to save syllables. Pāṇini compressed millions of words of grammar into 3,978 sūtras."},
    {dev:"एकः शब्दः सम्यगधीतः सुप्रयुक्तः स्वर्गे लोके च कामधुक् भवति ।",
     roman:"ekaḥ śabdaḥ samyagadhītaḥ suprayuktaḥ svarge loke ca kāmadhuk bhavati",
     trans:"One word, well-studied and properly used, becomes a wish-fulfilling cow in both heavenly and earthly realms.",
     source:"Mahābhāṣya Paspaśāhnika — Patañjali",link:"https://sacred-texts.com",
     rel:"Patañjali's profound statement on why grammar matters: correct word-use is kāmadhuk (wish-fulfilling). The entire architecture of the Aṣṭādhyāyī serves this one purpose."},
   ],
   levels:{
    easy:[
      {q:"Lopa (1.1.60) means:",opts:["Adding sound","Non-perception — invisible but present","Doubling","A prefix"],ans:1,exp:"Adarśanaṃ = non-visibility. NOT destruction."},
      {q:"Bahulam provides:",opts:["Binary (yes/no)","4 modes: applies/doesn't/optional/different","3 modes","Unlimited"],ans:1,exp:"4-fold flexibility for Vedic diversity."},
      {q:"Total sūtras in Aṣṭādhyāyī:",opts:["1000","2000","3,978","5000"],ans:2,exp:"3,978 sūtras in 8 Adhyāyas × 4 Pādas = 32 Pādas."},
      {q:"'Ardhamātrālāghavena…' celebrates:",opts:["Grammar difficulty","Saving half a syllable = son's birth joy","Vedic texts","Suffix importance"],ans:1,exp:"The supreme Laghava (brevity) principle."},
      {q:"Vipratiṣedhe paraṃ kāryam (1.4.2):",opts:["Earlier wins","Later wins in equal conflict","Both apply","Neither applies"],ans:1,exp:"Para (later) sūtra wins in equal-authority conflict."},
    ],
    medium:[
      {q:"Why THREE deletion terms (Luk·Ślu·Lup) rather than just Lopa?",opts:["Tradition","Each is a CODED SIGNAL telling subsequent rules HOW to behave: Luk=adādi-changes, Ślu=reduplication, Lup=gender-felt","Redundancy","Historical"],ans:1,exp:"Information encoding: each term triggers different downstream cascades. Three codes, three behaviors."},
      {q:"Patañjali's 'nāsto lopaḥ' means:",opts:["Error","Lopa ≠ destruction. Deleted element continues LOGICALLY in grammar, revived by Sthānivadbhāva","Tradition","Contradiction"],ans:1,exp:"Conceptual invisibility, not ontological destruction. Parallels the Vedāntic concept of māyā."},
      {q:"Paribhāṣā sūtras are 'rules about rules' because:",opts:["Redundancy","Without meta-rules, operational rules would be ambiguous — Paribhāṣā defines HOW to interpret all other sūtras","Tradition","Decoration"],ans:1,exp:"Tapara (1.1.70) doesn't DO anything itself — it CONTROLS how all other vowel-mentioning rules work."},
      {q:"Adhikāra sūtra is:",opts:["Naming rule","Governing rule at section-start — all following rules inherit its context","Deletion rule","Optional rule"],ans:1,exp:"Once stated, it dominates all subsequent rules until another Adhikāra appears. 'Aṅgasya' governs hundreds."},
      {q:"'Bouquet of flowers' analogy means the Aṣṭādhyāyī is:",opts:["Beautiful","Modular — clusters (Prakaraṇas) that can be studied independently","Complex","Fragrant"],ans:1,exp:"NOT a linear monolith — thematic clusters that are semi-independent modules."},
    ],
    hard:[
      {q:"Lopa as 'non-existence without non-being' anticipates:",opts:["String theory","Zero morpheme / null allomorph — theoretically present but phonetically null, cornerstone of 20th-century linguistics","Quantum mechanics","Programming"],ans:1,exp:"Patañjali's concept = 'zero morpheme' of modern morphology. This insight from ~200 BCE became a cornerstone of 20th-century structural linguistics."},
      {q:"Tripādī (Ch.7-8) uses Pūrvasiddha because:",opts:["Tradition","Tripādī = phonological surface operations requiring morphological operations (Ch.1-6) to be ALREADY COMPLETE","Grammar error","Complexity"],ans:1,exp:"Deep structure (morphology, Ch.1-6) must complete before shallow structure (phonology, Tripādī) applies. The grammar's structure mirrors the derivational sequence."},
      {q:"Patañjali's 'atha śabdānuśāsanam' signals:",opts:["A title","'Atha' = beginning-after-prerequisites. Grammar is the CULMINATION of all Vedāṅga tradition — śabdānuśāsana = dharmic governance of words","Random word","Traditional greeting"],ans:1,exp:"The entire Vedāṅga tradition preceded the Aṣṭādhyāyī. 'Anuśāsana' = dharmic discipline. Grammar is a moral enterprise in Indian tradition."},
      {q:"Pāṇini's Anuvṛtti creates what computer scientists call:",opts:["A database","Context-free grammar with persistent context — individual sūtras look context-free but carry inherited state from earlier sūtras","Word processor","Translator"],ans:1,exp:"Pāṇini's Anuvṛtti = persistent state variables (context from previous sūtras) combined with compact individual rules. The Aṣṭādhyāyī as the world's first formal programming language."},
      {q:"'Ekā api mātrā rakṣyate' (Vedic) and 'ardhamātrālāghavena' (Pāṇini) express:",opts:["Different traditions","SAME PRINCIPLE from OPPOSITE ANGLES: Vedic = preserve every mātrā in recitation; Pāṇini = use no extra mātrā in description","No relation","Historical coincidence"],ans:1,exp:"Both flow from Vedic understanding that sound (śabda) is Brahman — every unit of sound deserves infinite respect, whether in preservation or description."},
    ],
   }},
];

/* ── UTILITY ─────────────────────────────────────────────────────────── */
function PBar({value,max,color="#B8860B",h=6}){
  const p=max>0?Math.min(100,Math.round((value/max)*100)):0;
  return <div style={{background:"#EDE3C8",borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${p}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.5s ease"}}/>
  </div>;
}
function Badge({text,color}){const c=color||"#A08850";return(
  <span style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",padding:"2px 8px",borderRadius:99,background:c+"22",color:c,border:`1px solid ${c}40`,whiteSpace:"nowrap"}}>{text}</span>
);}
function Pill({text,active,color,onClick}){return(
  <button onClick={onClick} style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${active?color:"#E2D5B5"}`,background:active?color:"#FFFDF7",color:active?"#fff":"#6B4F2A",fontSize:12,cursor:"pointer",fontWeight:active?700:500,transition:"all 0.15s"}}>{text}</button>
);}

/* ── FLIP CARD ───────────────────────────────────────────────────────── */
function FlipCard({concept}){
  const[f,setF]=useState(false);const cc=CC[concept.cat]||"#A08850";
  return(
    <div onClick={()=>setF(x=>!x)} style={{cursor:"pointer",perspective:900,height:180}}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.55s ease",transform:f?"rotateY(180deg)":"rotateY(0)"}}>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#FFFDF7",border:"1.5px solid #E2D5B5",borderRadius:12,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:4}}>
            <Badge text={concept.cat} color={cc}/>
            {concept.sutra&&<span style={{fontSize:10,color:"#A08850",fontStyle:"italic",flexShrink:0}}>{concept.sutra}</span>}
          </div>
          <div>
            <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,fontWeight:700,color:"#2C1A0E",marginBottom:4}}>{concept.term}</div>
            <div style={{fontSize:11,color:"#A08850"}}>Tap to reveal →</div>
          </div>
        </div>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:`linear-gradient(135deg,${cc}14,${cc}06)`,border:`1.5px solid ${cc}55`,borderRadius:12,padding:14,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
          <div style={{fontSize:12,color:"#2C1A0E",lineHeight:1.55,overflow:"hidden"}}>{concept.meaning}</div>
          <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:12,color:cc,padding:"5px 10px",background:cc+"18",borderRadius:6,borderLeft:`3px solid ${cc}`}}>{concept.example}</div>
        </div>
      </div>
    </div>
  );
}

/* ── STANDARD QUIZ ───────────────────────────────────────────────────── */
function QuizView({chapter,onScore}){
  const[step,setStep]=useState(0);const[sel,setSel]=useState(null);
  const[rev,setRev]=useState(false);const[ans,setAns]=useState([]);const[done,setDone]=useState(false);
  const q=chapter.quiz[step];const total=chapter.quiz.length;
  const C=chapter.color;
  function pick(i){if(!rev){setSel(i);setRev(true);}}
  function next(){const a=[...ans,sel===q.ans];setAns(a);if(step+1>=total){onScore&&onScore(a.filter(Boolean).length,total);setDone(true);}else{setStep(s=>s+1);setSel(null);setRev(false);}}
  function reset(){setStep(0);setSel(null);setRev(false);setAns([]);setDone(false);}
  if(done){const sc=ans.filter(Boolean).length;const p=Math.round((sc/total)*100);
    return(<div style={{textAlign:"center",padding:"28px 0"}}>
      <div style={{fontSize:48,marginBottom:10}}>{p>=75?"🏆":p>=50?"💪":"📖"}</div>
      <div style={{fontSize:32,fontWeight:800,color:C}}>{sc}/{total}</div>
      <div style={{fontSize:14,color:"#6B4F2A",margin:"8px 0 18px"}}>{p>=75?"Excellent! Chapter mastered.":p>=50?"Good progress!":"Review and retry."}</div>
      <button onClick={reset} style={{padding:"11px 26px",borderRadius:99,background:C,border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Try Again</button>
    </div>);}
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <span style={{fontSize:12,color:"#A08850",whiteSpace:"nowrap"}}>Q {step+1}/{total}</span>
      <div style={{flex:1}}><PBar value={step} max={total} color={C} h={5}/></div>
      <span style={{fontSize:12,color:C,fontWeight:700}}>{Math.round((step/total)*100)}%</span>
    </div>
    <div style={{background:"#F3EDD8",border:"1px solid #E2D5B5",borderRadius:12,padding:"16px 18px",marginBottom:16,fontSize:15,fontWeight:600,color:"#2C1A0E",lineHeight:1.5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {q.opts.map((opt,i)=>{let bg="#FFFDF7",bdr="#E2D5B5",col="#2C1A0E";
        if(rev){if(i===q.ans){bg="#E8F5EA";bdr="#4A7C59";col="#2A5C39";}else if(i===sel){bg="#FDE8E8";bdr="#B03030";col="#8B2020";}}
        else if(sel===i){bg=C+"15";bdr=C;}
        return(<button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${bdr}`,borderRadius:10,padding:"12px 14px",color:col,fontSize:13,textAlign:"left",cursor:rev?"default":"pointer",transition:"all 0.2s",fontWeight:i===sel?700:400}}>{opt}</button>);})}
    </div>
    {rev&&<div style={{marginTop:12,padding:"12px 14px",background:"#FFFBF0",border:"1px solid #C9B98A",borderRadius:10,fontSize:13,color:"#6B4F2A",lineHeight:1.55}}>💡 <strong>Explanation:</strong> {q.exp}</div>}
    {rev&&<button onClick={next} style={{marginTop:12,width:"100%",padding:13,borderRadius:10,background:C,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{step+1>=total?"See Results 🎯":"Next →"}</button>}
  </div>);
}

/* ── LEVEL TEST ──────────────────────────────────────────────────────── */
const LM={
  easy:{label:"Easy",desc:"Basic recall",xp:10,color:"#4A7C59",emoji:"🟢",badge:"Beginner"},
  medium:{label:"Medium",desc:"Application & analysis",xp:20,color:"#C8703A",emoji:"🟡",badge:"Practitioner"},
  hard:{label:"Hard",desc:"Deep synthesis",xp:40,color:"#C8503A",emoji:"🔴",badge:"Scholar"},
};
function LevelTest({chapter,onXP,levelBadges,onBadge}){
  const[level,setLevel]=useState(null);const[step,setStep]=useState(0);
  const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);
  const[ans,setAns]=useState([]);const[done,setDone]=useState(false);
  const[lvlSc,setLvlSc]=useState({});
  function start(l){setLevel(l);setStep(0);setSel(null);setRev(false);setAns([]);setDone(false);}
  if(!level){return(<div>
    <div style={{background:"#F3EDD8",borderRadius:12,padding:"14px 18px",marginBottom:16,border:"1px solid #E2D5B5"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2C1A0E",marginBottom:3}}>📋 Chapter Test — Three Levels</div>
      <div style={{fontSize:12,color:"#A08850"}}>5 questions each · Score ≥80% to earn badge · XP per correct</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {Object.entries(LM).map(([lk,lv])=>{
        const sc=lvlSc[lk];const qs=chapter.levels?.[lk];if(!qs)return null;
        const hasBadge=levelBadges?.[chapter.id]?.[lk];
        return(<button key={lk} onClick={()=>start(lk)} style={{background:"#FFFDF7",border:`2px solid ${hasBadge?lv.color:"#E2D5B5"}`,borderRadius:14,padding:"14px 16px",textAlign:"left",cursor:"pointer",boxShadow:"0 2px 12px rgba(44,26,14,0.10)",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
          <span style={{fontSize:26}}>{lv.emoji}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
              <span style={{fontSize:15,fontWeight:700,color:lv.color}}>{lv.label}</span>
              {hasBadge&&<span style={{fontSize:11,background:lv.color+"22",color:lv.color,padding:"2px 8px",borderRadius:99,fontWeight:700,border:`1px solid ${lv.color}44`}}>🏅 {lv.badge}</span>}
            </div>
            <div style={{fontSize:12,color:"#A08850"}}>{lv.desc} · {qs.length} Qs · +{lv.xp} XP/correct</div>
            {sc!=null&&<div style={{marginTop:5,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1}}><PBar value={sc} max={qs.length} color={lv.color} h={4}/></div><span style={{fontSize:11,color:lv.color,fontWeight:700,flexShrink:0}}>{sc}/{qs.length}</span></div>}
          </div>
          <span style={{fontSize:16,color:lv.color}}>→</span>
        </button>);})}
    </div>
  </div>);}
  const lv=LM[level];const qs=chapter.levels[level];const q=qs[step];const total=qs.length;
  function pick(i){if(!rev){setSel(i);setRev(true);}}
  function next(){
    const a=[...ans,sel===q.ans];setAns(a);
    if(step+1>=total){
      const sc=a.filter(Boolean).length;
      setLvlSc(s=>({...s,[level]:Math.max(s[level]||0,sc)}));
      if(Math.round((sc/total)*100)>=80&&onBadge)onBadge(chapter.id,level);
      if(onXP)onXP(sc*lv.xp);setDone(true);
    }else{setStep(s=>s+1);setSel(null);setRev(false);}
  }
  if(done){const sc=ans.filter(Boolean).length;const p=Math.round((sc/total)*100);const pass=p>=80;
    return(<div style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:44,marginBottom:8}}>{pass?"🏅":"📚"}</div>
      <div style={{fontSize:11,color:lv.color,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{lv.label} Level</div>
      <div style={{fontSize:30,fontWeight:800,color:lv.color,marginBottom:4}}>{sc}/{total}</div>
      {pass&&<div style={{display:"inline-block",background:lv.color+"22",color:lv.color,padding:"5px 14px",borderRadius:99,fontSize:13,fontWeight:700,border:`1px solid ${lv.color}`,marginBottom:12}}>🏅 {lv.badge} Badge Earned!</div>}
      <div style={{fontSize:13,color:"#6B4F2A",marginBottom:16}}>{pass?"Level mastered! Try the next level.":"Review concepts and retry."}</div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={()=>start(level)} style={{padding:"10px 20px",borderRadius:99,background:lv.color,border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Retry</button>
        <button onClick={()=>setLevel(null)} style={{padding:"10px 20px",borderRadius:99,background:"none",border:`1.5px solid ${lv.color}`,color:lv.color,fontWeight:700,fontSize:13,cursor:"pointer"}}>Choose Level</button>
      </div>
    </div>);}
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <button onClick={()=>setLevel(null)} style={{background:"none",border:"none",color:"#A08850",cursor:"pointer",fontSize:12,padding:0}}>←</button>
      <span style={{fontSize:13,fontWeight:700,color:lv.color}}>{lv.emoji} {lv.label}</span>
      <div style={{flex:1}}><PBar value={step} max={total} color={lv.color} h={5}/></div>
      <span style={{fontSize:12,color:lv.color,fontWeight:700}}>Q{step+1}/{total}</span>
    </div>
    <div style={{background:"#F3EDD8",border:"1px solid #E2D5B5",borderRadius:12,padding:"16px 18px",marginBottom:16,fontSize:15,fontWeight:600,color:"#2C1A0E",lineHeight:1.5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {q.opts.map((opt,i)=>{let bg="#FFFDF7",bdr="#E2D5B5",col="#2C1A0E";
        if(rev){if(i===q.ans){bg="#E8F5EA";bdr="#4A7C59";col="#2A5C39";}else if(i===sel){bg="#FDE8E8";bdr="#B03030";col="#8B2020";}}
        else if(sel===i){bg=lv.color+"15";bdr=lv.color;}
        return(<button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${bdr}`,borderRadius:10,padding:"12px 14px",color:col,fontSize:13,textAlign:"left",cursor:rev?"default":"pointer",transition:"all 0.2s",fontWeight:i===sel?700:400}}>{opt}</button>);})}
    </div>
    {rev&&<div style={{marginTop:12,padding:"12px 14px",background:"#FFFBF0",border:"1px solid #C9B98A",borderRadius:10,fontSize:13,color:"#6B4F2A",lineHeight:1.55}}>💡 {q.exp}</div>}
    {rev&&<button onClick={next} style={{marginTop:12,width:"100%",padding:13,borderRadius:10,background:lv.color,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{step+1>=total?"See Results 🎯":"Next →"}</button>}
  </div>);
}

/* ── VEDIC VIEW ──────────────────────────────────────────────────────── */
function VedicView({vedic}){
  if(!vedic||!vedic.length)return<div style={{padding:20,color:"#A08850",fontSize:13}}>Vedic references coming soon.</div>;
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {vedic.map((r,i)=>(
      <div key={i} style={{background:"#FFFDF7",border:"1px solid #C9B98A",borderLeft:"4px solid #B8860B",borderRadius:12,padding:"16px 18px",boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
        <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,color:"#2C1A0E",lineHeight:1.8,marginBottom:8,whiteSpace:"pre-line"}}>{r.dev}</div>
        <div style={{fontSize:12,color:"#A08850",fontStyle:"italic",marginBottom:6,lineHeight:1.6,whiteSpace:"pre-line"}}>{r.roman}</div>
        <div style={{fontSize:13,color:"#6B4F2A",lineHeight:1.6,marginBottom:10,padding:"8px 12px",background:"#F3EDD8",borderRadius:8}}>"{r.trans}"</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:r.rel?10:0}}>
          <span style={{fontSize:11,background:"#B8860B22",color:"#B8860B",padding:"3px 10px",borderRadius:99,fontWeight:700,border:"1px solid #B8860B44"}}>📜 {r.source}</span>
          {r.link&&<a href={r.link} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#3B6B9A",textDecoration:"none",fontWeight:600}}>Read Source →</a>}
        </div>
        {r.rel&&<div style={{fontSize:12,color:"#6B4F2A",lineHeight:1.6,padding:"8px 12px",background:"#3B6B9A0D",borderRadius:8,borderLeft:"3px solid #3B6B9A"}}>
          <span style={{fontWeight:700,color:"#3B6B9A"}}>📌 Grammar Connection: </span>{r.rel}
        </div>}
      </div>
    ))}
  </div>);
}

/* ── GLOSSARY ────────────────────────────────────────────────────────── */
function GlossaryScreen(){
  const[q,setQ]=useState("");const[catF,setCatF]=useState("all");
  const all=CHAPTERS.flatMap(ch=>ch.concepts.map(c=>({...c,chTitle:ch.title,chColor:ch.color})));
  const cats=[...new Set(all.map(t=>t.cat))].sort();
  const filtered=all.filter(t=>(q===""||t.term.toLowerCase().includes(q.toLowerCase())||t.meaning.toLowerCase().includes(q.toLowerCase()))&&(catF==="all"||t.cat===catF));
  return(<div style={{paddingBottom:40}}>
    <div style={{background:"linear-gradient(135deg,#FDF6E3,#F3EDD8)",borderBottom:"2px solid #E2D5B5",padding:"18px 18px 14px"}}>
      <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:"#2C1A0E",margin:"0 0 4px"}}>📖 Glossary</h2>
      <p style={{fontSize:13,color:"#A08850",margin:"0 0 10px"}}>{all.length} terms across all 7 chapters</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms or meanings…" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #E2D5B5",background:"#FFFDF7",fontSize:14,color:"#2C1A0E",outline:"none",boxSizing:"border-box"}}/>
    </div>
    <div style={{padding:"12px 18px 0",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        <Pill text="All" active={catF==="all"} color="#B8860B" onClick={()=>setCatF("all")}/>
        {cats.map(c=><Pill key={c} text={c} active={catF===c} color={CC[c]||"#B8860B"} onClick={()=>setCatF(c===catF?"all":c)}/>)}
      </div>
      <div style={{fontSize:12,color:"#A08850",marginBottom:8}}>{filtered.length} results</div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map((t,i)=>{const cc=CC[t.cat]||"#A08850";return(
          <div key={i} style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderLeft:`3px solid ${cc}`,borderRadius:10,padding:"11px 14px",boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:14,fontWeight:700,color:"#2C1A0E"}}>{t.term}</span>
                {t.sutra&&<span style={{fontSize:10,color:"#A08850",fontStyle:"italic"}}>({t.sutra})</span>}
              </div>
              <Badge text={t.cat} color={cc}/>
            </div>
            <div style={{fontSize:12,color:"#6B4F2A",marginBottom:4}}>{t.meaning}</div>
            <div style={{fontSize:11,color:cc,background:cc+"12",padding:"3px 8px",borderRadius:5,display:"inline-block",fontFamily:"'Palatino Linotype',Georgia,serif"}}>{t.example}</div>
            <div style={{fontSize:10,color:"#A08850",marginTop:4}}>→ {t.chTitle}</div>
          </div>
        );})}
      </div>
    </div>
  </div>);
}

/* ── CHAPTER DETAIL ──────────────────────────────────────────────────── */
function ChapterDetail({ch,onBack}){
  const{scores,completed,recordScore,recordLevelBadge,addXP,levelBadges}=useProgress();
  const[tab,setTab]=useState("concepts");
  const chScore=scores[ch.id]||0;const isDone=completed.has(ch.id);
  const C=ch.color;
  const TABS=[{k:"concepts",l:"📚 Concepts"},{k:"flashcards",l:"🃏 Flashcards"},{k:"quiz",l:"❓ Quiz"},{k:"test",l:"📋 Test"},{k:"vedic",l:"📜 Vedic"},{k:"watch",l:"📺 Watch"}];
  return(<div style={{minHeight:"100vh",background:"#FAF6EF"}}>
    <div style={{background:`linear-gradient(135deg,${ch.accent},#FDF6E3)`,borderBottom:`2px solid ${C}44`}}>
      <div style={{maxWidth:680,margin:"0 auto",padding:"12px 16px 0"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#A08850",cursor:"pointer",fontSize:13,padding:"0 0 10px"}}>← Back</button>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",paddingBottom:4}}>
          <div style={{width:46,height:46,borderRadius:12,background:"#FFFDF7",border:`2px solid ${C}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 2px 12px rgba(44,26,14,0.10)",flexShrink:0}}>{ch.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:C,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>CH {ch.num}</div>
            <h1 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:"clamp(14px,4vw,19px)",fontWeight:900,color:"#2C1A0E",margin:"0 0 3px"}}>{ch.title}</h1>
            <p style={{fontSize:12,color:"#6B4F2A",margin:"0 0 6px"}}>{ch.subtitle}</p>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"#EDE3C8",color:"#6B4F2A"}}>📚{ch.concepts.length}</span>
              <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"#EDE3C8",color:"#6B4F2A"}}>❓{ch.quiz.length}</span>
              {isDone&&<span style={{fontSize:11,color:"#2A5C39",background:"#E8F5EA",padding:"2px 8px",borderRadius:99,border:"1px solid #4A7C59",fontWeight:700}}>✅ Mastered</span>}
              {chScore>0&&<span style={{fontSize:11,background:`linear-gradient(90deg,#B8860B,#D4A843)`,color:"#fff",padding:"2px 8px",borderRadius:99,fontWeight:700}}>+{chScore*15}XP</span>}
            </div>
          </div>
        </div>
        {chScore>0&&<div style={{margin:"8px 0 0"}}><PBar value={chScore} max={ch.quiz.length} color={C} h={5}/></div>}
        <div style={{display:"flex",gap:2,marginTop:12,overflowX:"auto"}}>
          {TABS.map(tb=>(
            <button key={tb.k} onClick={()=>setTab(tb.k)} style={{padding:"7px 10px",borderRadius:"8px 8px 0 0",border:`1px solid ${tab===tb.k?C:"#E2D5B5"}`,borderBottom:tab===tb.k?`2px solid #FAF6EF`:`1px solid #E2D5B5`,background:tab===tb.k?"#FAF6EF":"#F3EDD8",color:tab===tb.k?C:"#6B4F2A",fontSize:11,fontWeight:tab===tb.k?700:500,cursor:"pointer",whiteSpace:"nowrap",marginBottom:tab===tb.k?-1:0}}>{tb.l}</button>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:680,margin:"0 auto",padding:"16px 16px 40px"}}>
      {tab==="concepts"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {ch.concepts.map((c,i)=>{const cc=CC[c.cat]||"#A08850";return(
          <div key={i} style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderLeft:`4px solid ${cc}`,borderRadius:10,padding:"14px 16px",boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8}}>
              <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,fontWeight:800,color:"#2C1A0E"}}>{c.term}</span>
              <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <Badge text={c.cat} color={cc}/>
                {c.sutra&&<Badge text={c.sutra} color="#B8860B"/>}
              </div>
            </div>
            <div style={{fontSize:13,color:"#6B4F2A",lineHeight:1.6,marginBottom:8}}>{c.meaning}</div>
            <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:12,color:cc,padding:"5px 10px",background:cc+"14",borderRadius:7,display:"inline-block"}}>{c.example}</div>
          </div>
        );})}
      </div>}
      {tab==="flashcards"&&<div>
        <p style={{fontSize:13,color:"#A08850",margin:"0 0 14px"}}>Tap each card to flip. Test yourself before the quiz!</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
          {ch.concepts.map((c,i)=><FlipCard key={i} concept={c}/>)}
        </div>
      </div>}
      {tab==="quiz"&&<div>
        <p style={{fontSize:13,color:"#A08850",margin:"0 0 14px"}}>Score ≥75% to mark chapter mastered</p>
        <div style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
          <QuizView chapter={ch} onScore={(s,t)=>recordScore(ch.id,s,t)}/>
        </div>
      </div>}
      {tab==="test"&&<div>
        <div style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
          <LevelTest chapter={ch} onXP={addXP} levelBadges={levelBadges} onBadge={recordLevelBadge}/>
        </div>
      </div>}
      {tab==="vedic"&&<div>
        <p style={{fontSize:13,color:"#A08850",margin:"0 0 14px"}}>Vedic verses connecting grammar to sacred tradition</p>
        <VedicView vedic={ch.vedic}/>
      </div>}
      {tab==="watch"&&<div style={{textAlign:"center",padding:"28px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>📺</div>
        <h3 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:18,color:"#2C1A0E",margin:"0 0 8px"}}>Watch: {ch.title}</h3>
        <p style={{fontSize:13,color:"#6B4F2A",lineHeight:1.7,margin:"0 0 16px",maxWidth:420,marginLeft:"auto",marginRight:"auto"}}>Lectures by <strong>Pushpa Dikshit</strong> · Aṣṭādhyāyī Sahajabodha · Pauspi Prakriyā method</p>
        <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:99,background:"#FF0000",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:"0 4px 14px rgba(255,0,0,0.3)"}}>▶ Open YouTube Playlist</a>
        <div style={{marginTop:14,fontSize:11,color:"#A08850",fontFamily:"'Palatino Linotype',Georgia,serif"}}>ॐ पाणिनये नमः</div>
      </div>}
    </div>
  </div>);
}

/* ── PROGRESS SCREEN ─────────────────────────────────────────────────── */
function ProgressScreen(){
  const{scores,completed,totalXP,streak,syncing}=useProgress();
  const tc=CHAPTERS.length;
  return(<div style={{paddingBottom:40}}>
    <div style={{background:"linear-gradient(135deg,#FDF6E3,#F3EDD8)",borderBottom:"2px solid #E2D5B5",padding:"18px 18px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:"#2C1A0E",margin:"0 0 3px"}}>📈 My Progress</h2>
        <p style={{fontSize:13,color:"#A08850",margin:0}}>Auto-synced to cloud</p></div>
        <div style={{fontSize:12,display:"flex",alignItems:"center",gap:5,color:syncing?"#B8860B":"#4A7C59"}}>{syncing?"⏳ Saving…":"✅ Saved"}</div>
      </div>
    </div>
    <div style={{padding:"16px 18px",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
        {[{v:`${completed.size}/${tc}`,l:"Chapters Done",c:"#B8860B"},{v:`${totalXP}XP`,l:"Experience",c:"#4A7C59"},{v:`🔥${streak}`,l:"Day Streak",c:"#C8503A"},{v:`${Object.keys(scores).length*4}`,l:"Qs Answered",c:"#3B6B9A"}].map(s=>(
          <div key={s.l} style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderRadius:12,padding:14,boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:12,color:"#A08850"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderRadius:12,padding:"14px 16px",marginBottom:16,boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:700,color:"#2C1A0E"}}>Overall Mastery</span>
          <span style={{fontSize:13,color:"#B8860B",fontWeight:700}}>{Math.round((completed.size/tc)*100)}%</span>
        </div>
        <PBar value={completed.size} max={tc} color="#B8860B" h={10}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {CHAPTERS.map(ch=>{const s=scores[ch.id]||0;const done=completed.has(ch.id);
          return(<div key={ch.id} style={{background:"#FFFDF7",border:`1.5px solid ${done?ch.color:"#E2D5B5"}`,borderRadius:10,padding:"11px 14px",boxShadow:"0 2px 12px rgba(44,26,14,0.10)",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18,minWidth:24}}>{ch.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:"#2C1A0E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.title}</span>
                <span style={{fontSize:11,color:ch.color,fontWeight:700,flexShrink:0,marginLeft:8}}>{s}/{ch.quiz.length}</span>
              </div>
              <PBar value={s} max={ch.quiz.length} color={ch.color} h={4}/>
            </div>
            {done&&<span style={{fontSize:15,flexShrink:0}}>✅</span>}
          </div>);
        })}
      </div>
    </div>
  </div>);
}

/* ── HOME SCREEN ─────────────────────────────────────────────────────── */
function HomeScreen({onOpen}){
  const{scores,completed,totalXP,streak}=useProgress();
  const{userProfile}=useAuth();
  const next=CHAPTERS.find(ch=>!completed.has(ch.id));
  const inProg=CHAPTERS.filter(ch=>scores[ch.id]&&!completed.has(ch.id)).slice(0,3);
  const firstName=(userProfile?.displayName||"").split(" ")[0]||"Scholar";
  return(<div style={{paddingBottom:40}}>
    <div style={{background:"linear-gradient(160deg,#FDF6E3,#F0E6C8 50%,#FDF6E3)",borderBottom:"2px solid #E2D5B5",padding:"24px 18px 18px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-40,right:-40,width:150,height:150,borderRadius:"50%",border:"2px solid #B8860B20",background:"radial-gradient(circle,#B8860B08,transparent 70%)"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"inline-flex",width:62,height:62,borderRadius:"50%",background:"linear-gradient(135deg,#B8860B,#D4A843)",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 8px 24px #B8860B50",marginBottom:10}}>🕉️</div>
        <div style={{fontSize:14,color:"#6B4F2A",marginBottom:2}}>नमस्ते, <strong>{firstName}</strong>!</div>
        <h1 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:"clamp(16px,5vw,24px)",fontWeight:900,color:"#2C1A0E",margin:"0 0 4px"}}>Aṣṭādhyāyī Sahajabodha</h1>
        <p style={{fontSize:12,color:"#6B4F2A",margin:"0 0 14px"}}>Pāṇini's Sanskrit Grammar · Pauspi Prakriyā</p>
        <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
          {[{v:`${completed.size}/${CHAPTERS.length}`,l:"Chapters",c:"#B8860B"},{v:`${totalXP}XP`,l:"Points",c:"#4A7C59"},{v:`🔥${streak}`,l:"Streak",c:"#C8503A"}].map(s=>(
            <div key={s.l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"#A08850"}}>{s.l}</div></div>
          ))}
        </div>
      </div>
    </div>
    <div style={{padding:"16px 16px 0",maxWidth:680,margin:"0 auto"}}>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#A08850",marginBottom:5}}>
          <span>Overall Progress</span><span style={{color:"#B8860B",fontWeight:700}}>{Math.round((completed.size/CHAPTERS.length)*100)}%</span>
        </div>
        <PBar value={completed.size} max={CHAPTERS.length} color="#B8860B" h={10}/>
      </div>
      {next&&<div style={{marginBottom:16}}>
        <h3 style={{fontSize:10,fontWeight:700,color:"#A08850",letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>Continue Learning</h3>
        <button onClick={()=>onOpen(next)} style={{width:"100%",background:"#FFFDF7",border:`2px solid ${next.color}`,borderRadius:14,padding:"14px 16px",textAlign:"left",cursor:"pointer",boxShadow:`0 4px 18px ${next.color}25`,display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:26}}>{next.icon}</span>
          <div style={{flex:1}}><div style={{fontSize:9,color:next.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>{next.num}</div><div style={{fontSize:14,fontWeight:700,color:"#2C1A0E"}}>{next.title}</div><div style={{fontSize:11,color:"#6B4F2A"}}>{next.subtitle}</div></div>
          <span style={{fontSize:18,color:next.color}}>→</span>
        </button>
      </div>}
      {inProg.length>0&&<div style={{marginBottom:16}}>
        <h3 style={{fontSize:10,fontWeight:700,color:"#A08850",letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>In Progress</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {inProg.map(ch=>(
            <button key={ch.id} onClick={()=>onOpen(ch)} style={{background:"#FFFDF7",border:"1px solid #E2D5B5",borderRadius:12,padding:"10px 14px",textAlign:"left",cursor:"pointer",boxShadow:"0 2px 12px rgba(44,26,14,0.10)",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{ch.icon}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#2C1A0E",marginBottom:4}}>{ch.title}</div><PBar value={scores[ch.id]||0} max={ch.quiz.length} color={ch.color} h={4}/></div>
              <span style={{fontSize:11,color:ch.color,fontWeight:700}}>{scores[ch.id]||0}/{ch.quiz.length}</span>
            </button>
          ))}
        </div>
      </div>}
      <h3 style={{fontSize:10,fontWeight:700,color:"#A08850",letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>All 7 Chapters</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:20}}>
        {CHAPTERS.map((ch,i)=>{const done=completed.has(ch.id);const locked=i>0&&!completed.has(CHAPTERS[i-1].id)&&!scores[ch.id];
          return(<button key={ch.id} onClick={()=>!locked&&onOpen(ch)} style={{background:done?ch.accent:"#FFFDF7",border:`1.5px solid ${done?ch.color:"#E2D5B5"}`,borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:locked?"not-allowed":"pointer",opacity:locked?0.4:1,boxShadow:"0 2px 12px rgba(44,26,14,0.10)"}}>
            <div style={{fontSize:16,marginBottom:2}}>{locked?"🔒":ch.icon}</div>
            <div style={{fontSize:8,color:ch.color,fontWeight:700}}>{ch.num}</div>
            {done&&<div style={{fontSize:10,marginTop:1}}>✅</div>}
          </button>);
        })}
      </div>
      <div style={{background:"#F3EDD8",border:"1px solid #E2D5B5",borderRadius:12,padding:14,textAlign:"center"}}>
        <div style={{fontSize:12,color:"#A08850",marginBottom:5}}>🙏 Based on <strong style={{color:"#6B4F2A"}}>Pushpa Dikshit</strong>'s Aṣṭādhyāyī Sahajabodha</div>
        <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"#C8503A",textDecoration:"none",fontWeight:700}}>🎬 Watch Full Playlist →</a>
        <div style={{fontSize:10,color:"#A08850",marginTop:5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>ॐ पाणिनये नमः</div>
      </div>
    </div>
  </div>);
}

/* ══ ROOT APP ════════════════════════════════════════════════════════════ */
export default function App(){
  const{user,loading:authLoading}=useAuth();
  const{loaded:progressLoaded}=useProgress();
  const[nav,setNav]=useState("home");
  const[activeChap,setActiveChap]=useState(null);

  if(authLoading||(user&&!progressLoaded))
    return <LoadingScreen message={authLoading?"Checking your account…":"Loading your progress…"}/>;
  if(!user) return <AuthScreen/>;

  function openChapter(ch){setActiveChap(ch);setNav("chapter");}
  const NAV=[{id:"home",icon:"🏠",label:"Home"},{id:"chapters",icon:"📚",label:"Chapters"},{id:"progress",icon:"📈",label:"Progress"},{id:"glossary",icon:"📖",label:"Glossary"}];

  return(<div style={{minHeight:"100vh",background:"#FAF6EF",fontFamily:"'Trebuchet MS',Verdana,sans-serif",display:"flex",flexDirection:"column"}}>
    <nav style={{position:"sticky",top:0,zIndex:100,background:"#FFFDF7",borderBottom:"2px solid #E2D5B5",boxShadow:"0 2px 10px rgba(44,26,14,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",height:52}}>
      <button onClick={()=>setNav("home")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}>
        <span style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#B8860B,#D4A843)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🕉️</span>
        <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:13,fontWeight:800,color:"#2C1A0E"}}>Aṣṭādhyāyī</span>
      </button>
      <div style={{display:"flex",gap:1,overflowX:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>{setNav(n.id);if(n.id!=="chapter")setActiveChap(null);}} style={{padding:"4px 8px",borderRadius:8,border:"none",background:nav===n.id?"#F3EDD8":"none",color:nav===n.id?"#B8860B":"#6B4F2A",fontSize:10,fontWeight:nav===n.id?700:500,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
            <span style={{fontSize:13}}>{n.icon}</span><span style={{fontSize:8}}>{n.label}</span>
          </button>
        ))}
      </div>
      <UserAvatar/>
    </nav>
    {nav==="chapter"&&activeChap&&(
      <div style={{background:"#F3EDD8",borderBottom:"1px solid #E2D5B5",padding:"5px 16px",display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#A08850"}}>
        <button onClick={()=>{setNav("chapters");setActiveChap(null);}} style={{background:"none",border:"none",cursor:"pointer",color:"#A08850",fontSize:12,padding:0}}>📚 Chapters</button>
        <span>›</span><span style={{color:"#6B4F2A",fontWeight:600}}>{activeChap.icon} {activeChap.title}</span>
      </div>
    )}
    <main style={{flex:1,overflowY:"auto"}}>
      {nav==="home"&&<HomeScreen onOpen={openChapter}/>}
      {nav==="chapters"&&!activeChap&&(
        <div style={{paddingBottom:40}}>
          <div style={{background:"linear-gradient(135deg,#FDF6E3,#F3EDD8)",borderBottom:"2px solid #E2D5B5",padding:"18px 18px 14px"}}>
            <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:"#2C1A0E",margin:"0 0 3px"}}>All Chapters</h2>
            <p style={{fontSize:13,color:"#A08850",margin:0}}>7 modules · Pushpa Dikshit's Aṣṭādhyāyī Sahajabodha</p>
          </div>
          <div style={{padding:"14px 16px",maxWidth:680,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {CHAPTERS.map((ch,i)=>{
              const{scores,completed}=useProgress();
              const done=completed.has(ch.id);const cs=scores[ch.id]||0;
              const locked=i>0&&!completed.has(CHAPTERS[i-1].id)&&!scores[ch.id];
              return(<button key={ch.id} onClick={()=>!locked&&openChapter(ch)} style={{background:locked?"#F8F4EC":"#FFFDF7",border:`1.5px solid ${done?ch.color:"#E2D5B5"}`,borderRadius:14,padding:14,textAlign:"left",cursor:locked?"not-allowed":"pointer",opacity:locked?0.55:1,boxShadow:done?`0 4px 14px ${ch.color}25`:"0 2px 12px rgba(44,26,14,0.10)"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:22}}>{locked?"🔒":ch.icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:9,color:ch.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>{ch.num}</div><div style={{fontSize:13,fontWeight:700,color:"#2C1A0E"}}>{ch.title}</div></div>
                  {done&&<span style={{fontSize:14}}>✅</span>}
                </div>
                <div style={{fontSize:11,color:"#A08850",marginBottom:8}}>{ch.subtitle}</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#A08850"}}>
                  <span>📚{ch.concepts.length} terms</span><span>❓{ch.quiz.length} Qs</span>
                  {cs>0&&<span style={{color:ch.color,fontWeight:700}}>🏅{cs*15}XP</span>}
                </div>
                {cs>0&&<div style={{marginTop:7}}><PBar value={cs} max={ch.quiz.length} color={ch.color} h={4}/></div>}
              </button>);
            })}
          </div>
        </div>
      )}
      {nav==="chapter"&&activeChap&&<ChapterDetail ch={activeChap} onBack={()=>{setNav("chapters");setActiveChap(null);}}/>}
      {nav==="progress"&&<ProgressScreen/>}
      {nav==="glossary"&&<GlossaryScreen/>}
    </main>
    <div style={{position:"sticky",bottom:0,zIndex:100,background:"#FFFDF7",borderTop:"2px solid #E2D5B5",display:"flex",boxShadow:"0 -2px 10px rgba(44,26,14,0.07)"}}>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>{setNav(n.id);if(n.id!=="chapter")setActiveChap(null);}} style={{flex:1,padding:"7px 4px",border:"none",background:nav===n.id?"#F3EDD8":"#FFFDF7",borderTop:nav===n.id?"2px solid #B8860B":"2px solid transparent",color:nav===n.id?"#B8860B":"#A08850",fontSize:10,fontWeight:nav===n.id?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
          <span style={{fontSize:14}}>{n.icon}</span><span style={{fontSize:8}}>{n.label}</span>
        </button>
      ))}
    </div>
  </div>);
}
