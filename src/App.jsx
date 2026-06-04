import { useState } from "react";

/* ── THEME ──────────────────────────────────────────────────────────────── */
const T={
  bg:"#FAF6EF",bgCard:"#FFFDF7",bgAlt:"#F3EDD8",bgDeep:"#EDE3C8",
  border:"#E2D5B5",borderDk:"#C9B98A",
  text:"#2C1A0E",textMid:"#6B4F2A",textSoft:"#A08850",
  gold:"#B8860B",goldLt:"#D4A843",saffron:"#C8503A",green:"#4A7C59",
  blue:"#3B6B9A",teal:"#2A7F7F",purple:"#7B4F8A",orange:"#C8703A",
  pink:"#9B4A6A",olive:"#6B7A3A",slate:"#5A6E8A",
  shadow:"0 2px 12px rgba(44,26,14,0.10)",
};

/* ── SOUNDS DATA ─────────────────────────────────────────────────────────── */
const SOUNDS={
  vowels:[
    {dev:"अ",iast:"a",simp:"a",eng:"u in 'but'",dur:"short",sthana:"Kaṇṭha",c:T.saffron},
    {dev:"आ",iast:"ā",simp:"A",eng:"a in 'father'",dur:"long",sthana:"Kaṇṭha",c:T.saffron},
    {dev:"इ",iast:"i",simp:"i",eng:"i in 'bit'",dur:"short",sthana:"Tālu",c:T.blue},
    {dev:"ई",iast:"ī",simp:"I",eng:"ee in 'see'",dur:"long",sthana:"Tālu",c:T.blue},
    {dev:"उ",iast:"u",simp:"u",eng:"u in 'put'",dur:"short",sthana:"Oṣṭha",c:T.purple},
    {dev:"ऊ",iast:"ū",simp:"U",eng:"oo in 'pool'",dur:"long",sthana:"Oṣṭha",c:T.purple},
    {dev:"ऋ",iast:"ṛ",simp:"R",eng:"ri (retroflex)",dur:"short",sthana:"Mūrdhā",c:T.teal},
    {dev:"ॠ",iast:"ṝ",simp:"RR",eng:"long ṛ",dur:"long",sthana:"Mūrdhā",c:T.teal},
    {dev:"ऌ",iast:"ḷ",simp:"LR",eng:"l held as vowel",dur:"short",sthana:"Danta",c:T.green},
    {dev:"ए",iast:"e",simp:"E",eng:"a in 'fate'",dur:"long",sthana:"Kaṇṭha+Tālu",c:T.orange},
    {dev:"ऐ",iast:"ai",simp:"ai",eng:"i in 'aisle'",dur:"long",sthana:"Kaṇṭha+Tālu",c:T.orange},
    {dev:"ओ",iast:"o",simp:"O",eng:"o in 'go'",dur:"long",sthana:"Kaṇṭha+Oṣṭha",c:T.pink},
    {dev:"औ",iast:"au",simp:"au",eng:"ou in 'loud'",dur:"long",sthana:"Kaṇṭha+Oṣṭha",c:T.pink},
    {dev:"अं",iast:"aṃ",simp:"aM",eng:"nasal resonance",dur:"special",sthana:"Nāsikā",c:T.slate},
    {dev:"अः",iast:"aḥ",simp:"aH",eng:"breath release",dur:"special",sthana:"Kaṇṭha",c:T.slate},
  ],
  vargas:[
    {name:"Kavarga",sthana:"Kaṇṭha (Throat)",c:T.saffron,
     letters:[{dev:"क",iast:"k",simp:"k",ap:"AP"},{dev:"ख",iast:"kh",simp:"kh",ap:"MP"},{dev:"ग",iast:"g",simp:"g",ap:"AP"},{dev:"घ",iast:"gh",simp:"gh",ap:"MP"},{dev:"ङ",iast:"ṅ",simp:"nG",ap:"AP"}]},
    {name:"Chavarga",sthana:"Tālu (Palate)",c:T.blue,
     letters:[{dev:"च",iast:"c",simp:"ch",ap:"AP"},{dev:"छ",iast:"ch",simp:"Ch",ap:"MP"},{dev:"ज",iast:"j",simp:"j",ap:"AP"},{dev:"झ",iast:"jh",simp:"jh",ap:"MP"},{dev:"ञ",iast:"ñ",simp:"nJ",ap:"AP"}]},
    {name:"Ṭavarga",sthana:"Mūrdhā (Cerebral)",c:T.teal,
     letters:[{dev:"ट",iast:"ṭ",simp:"T",ap:"AP"},{dev:"ठ",iast:"ṭh",simp:"Th",ap:"MP"},{dev:"ड",iast:"ḍ",simp:"D",ap:"AP"},{dev:"ढ",iast:"ḍh",simp:"Dh",ap:"MP"},{dev:"ण",iast:"ṇ",simp:"N",ap:"AP"}]},
    {name:"Tavarga",sthana:"Danta (Teeth)",c:T.green,
     letters:[{dev:"त",iast:"t",simp:"t",ap:"AP"},{dev:"थ",iast:"th",simp:"th",ap:"MP"},{dev:"द",iast:"d",simp:"d",ap:"AP"},{dev:"ध",iast:"dh",simp:"dh",ap:"MP"},{dev:"न",iast:"n",simp:"n",ap:"AP"}]},
    {name:"Pavarga",sthana:"Oṣṭha (Lips)",c:T.purple,
     letters:[{dev:"प",iast:"p",simp:"p",ap:"AP"},{dev:"फ",iast:"ph",simp:"ph",ap:"MP"},{dev:"ब",iast:"b",simp:"b",ap:"AP"},{dev:"भ",iast:"bh",simp:"bh",ap:"MP"},{dev:"म",iast:"m",simp:"m",ap:"AP"}]},
  ],
  semivowels:[
    {dev:"य",iast:"y",simp:"y",sthana:"Tālu"},{dev:"र",iast:"r",simp:"r",sthana:"Mūrdhā"},
    {dev:"ल",iast:"l",simp:"l",sthana:"Danta"},{dev:"व",iast:"v",simp:"v",sthana:"Danta+Oṣṭha"},
  ],
  sibilants:[
    {dev:"श",iast:"ś",simp:"sh",sthana:"Tālu"},{dev:"ष",iast:"ṣ",simp:"Sh",sthana:"Mūrdhā"},
    {dev:"स",iast:"s",simp:"s",sthana:"Danta"},{dev:"ह",iast:"h",simp:"h",sthana:"Kaṇṭha"},
  ],
  conjuncts:[
    {dev:"क्ष",iast:"kṣa",simp:"kSha",note:"k+ṣ — as in kṣetra (field)"},
    {dev:"त्र",iast:"tra",simp:"tra",note:"t+r — as in mantra, tantra"},
    {dev:"ज्ञ",iast:"jña",simp:"jna",note:"j+ñ — as in jñāna (knowledge)"},
    {dev:"श्र",iast:"śra",simp:"shra",note:"ś+r — as in śrī (auspiciousness)"},
  ],
  samples:[
    {cat:"🕉️ Śiva Sūtra",dev:"चिदानन्दरूपः शिवोऽहं शिवोऽहम् ।",iast:"cidānandarūpaḥ śivo'haṃ śivo'ham",trans:"I am Śiva, of the nature of pure consciousness and bliss.",source:"Nirvāṇaṣaṭkam — Ādi Śaṅkarācārya"},
    {cat:"🌿 Āyurveda",dev:"निद्रायत्तं सुखं दुःखं पुष्टिः काश्यं बलाबलम् ।",iast:"nidrāyattaṃ sukhaṃ duḥkhaṃ puṣṭiḥ kārśyaṃ balābalam",trans:"On sleep depend happiness, sorrow, nourishment, emaciation, strength and weakness.",source:"Aṣṭāṅgahṛdayam 1.7.53"},
    {cat:"🧘 Yoga",dev:"यथैव लोहकारेण भस्त्रा वेगेन चाल्यते ।",iast:"yathaiva lohakāreṇa bhastrā vegena cālyate",trans:"Just as the bellows of a blacksmith are moved with speed...",source:"Haṭhayogapradīpikā 2.63"},
    {cat:"⭐ Jyotiṣa",dev:"धनाधिपो गुरुर्यस्य धनभावगतो भवेत् ।",iast:"dhanādhipo gururyasya dhanabhāvagato bhavet",trans:"When Jupiter, the lord of wealth, is placed in the house of wealth...",source:"Bṛhat-Parāśara-Horāśāstra 13.3"},
    {cat:"🌸 Gāyatrī",dev:"ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम् ।",iast:"oṃ bhūrbhuvaḥ svaḥ tatsaviturvareṇyam",trans:"Om — the earth, atmosphere, heaven. That adorable radiance of the Sun...",source:"Ṛgveda 3.62.10 (Gāyatrī Mantra)"},
  ]
};

/* ── VEDIC REFERENCES per chapter ────────────────────────────────────────── */
const VEDIC={
  1:[
    {dev:"चत्वारि वाक् परिमिता पदानि तानि विदुर्ब्राह्मणा ये मनीषिणः ।\nगुहा त्रीणि निहिता नेङ्गयन्ति तुरीयं वाचो मनुष्या वदन्ति ॥",
     roman:"catvāri vāk parimitā padāni — tāni viduḥ brāhmaṇā ye manīṣiṇaḥ\nguhā trīṇi nihitā neṅgayanti — turīyaṃ vāco manuṣyā vadanti",
     trans:"Speech has four measured forms. The wise Brāhmaṇas who are seers know them all. Three remain hidden in a cave, unmoving — humans speak only the fourth.",
     source:"Ṛgveda 1.164.45",link:"https://sacred-texts.com/hin/rigveda/rv01164.htm",
     rel:"The four forms of speech — Parā (transcendent), Paśyantī (visionary), Madhyamā (middle), Vaikharī (articulated) — directly map onto Pāṇini's system. Dhātus carry meaning at the Paśyantī level; Pratipadikas bring it to Vaikharī (spoken language)."},
    {dev:"अथ शब्दानुशासनम् ।",roman:"atha śabdānuśāsanam",
     trans:"Now begins the discipline of words.",
     source:"Mahābhāṣya (Paspaśāhnika) — Patañjali",link:"https://sacred-texts.com/hin/",
     rel:"Patañjali opens his commentary with this invocation. The word 'atha' itself is an Avyaya Pratipadika (indeclinable) — showing the very system in action from the first word."},
    {dev:"भूवादयो धातवः ।",roman:"bhūvādayo dhātavaḥ",
     trans:"Bhū and words like it are Dhātus (verbal roots).",
     source:"Aṣṭādhyāyī 1.3.1 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/3/1",
     rel:"The foundational Saṃjñā-sūtra for Dhātu. By naming only 'bhū and similar', Pāṇini uses Anuvṛtti to cover all 1,930 roots in six syllables. Supreme economy."},
  ],
  2:[
    {dev:"शीक्षां व्याख्यास्यामः । वर्णः स्वरः । मात्रा बलम् । साम सन्तानः ।",
     roman:"śīkṣāṃ vyākhyāsyāmaḥ · varṇaḥ svaraḥ · mātrā balam · sāma santānaḥ",
     trans:"We shall explain Phonetics: Varṇa (sound), Svara (pitch), Mātrā (duration), Bala (force), Sāma (modulation), Santāna (continuity).",
     source:"Taittirīya Upaniṣad 1.2.1 (Śīkṣāvallī)",link:"https://sacred-texts.com/hin/tmu/tmu04.htm",
     rel:"The oldest systematic phonetics text — predating Pāṇini. It defines the same six phonetic categories that underlie the Varṇamātrikā. The alphabet is not a cultural invention but a description of cosmic sound-structure."},
    {dev:"अकारो वाव ब्रह्म ।",roman:"akāro vāva brahma",
     trans:"The letter 'अ' (akāra) indeed IS Brahman.",
     source:"Chāndogya Upaniṣad 2.23.4",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"'अ' is placed FIRST in the Varṇamātrikā because it represents Brahman — the ground of all sound. Every consonant, when pronounced, adds 'अ' to itself (क = क् + अ). The cosmic significance of Svaras preceding Vyañjanas is revealed here."},
    {dev:"ॐ खं ब्रह्म ।",roman:"oṃ khaṃ brahma",
     trans:"Om, space, is Brahman.",
     source:"Chāndogya Upaniṣad 4.10.4",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"OM = अ + उ + म — whose three sounds map exactly onto the three primary Sthānas: Kaṇṭha (अ), Oṣṭha (उ), and lip-closure (म). The Varṇamātrikā is not mere linguistics — it is cosmology mapped onto the vocal tract."},
  ],
  3:[
    {dev:"रामं श्यामं ग्रामं वनम् ।",roman:"rāmaṃ śyāmaṃ grāmaṃ vanam",
     trans:"Rāma (acc.) · Śyāma (acc.) · Village (acc.) · Forest (acc.)",
     source:"Classical Sanskrit examples showing Anusvāra",link:"",
     rel:"Every Sanskrit noun in accusative singular (-am) uses the Anusvāra. This tiny dot appears in virtually every line of the Vedas — understanding it as an Āyogavāha 'travelling with' vowels is foundational to correct pronunciation and sandhi."},
    {dev:"अनुस्वारश्च विसर्गश्च जिह्वामूलीयोपध्मानीयौ च ।",
     roman:"anusvāraśca visargaśca jihvāmūlīyopadhmanīyau ca",
     trans:"The Anusvāra, Visarga, Jihvāmūlīya, and Upadhmanīya are [listed among the special sounds].",
     source:"Taittirīya Prātiśākhya 1.20-22",link:"https://sacred-texts.com/hin/",
     rel:"The TP is one of the six Vedāṅgas (auxiliary Vedic sciences). Its detailed treatment of Āyogavāhas shows these borderline sounds were a serious phonetic concern for Vedic chanters millennia before Pāṇini formalized them."},
  ],
  4:[
    {dev:"नृत्तावसाने नटराजराजो ननाद ढक्कां नवपञ्चवारम् ।\nउद्धर्तुकामः सनकादिसिद्धानेतद्विमर्शे शिवसूत्रजालम् ॥",
     roman:"nṛttāvasāne naṭarājarājo nanāda ḍhakkāṃ navapañcavāram\nuddhartukāmaḥ sanakādisiddhān etadvimarśe śivasūtrajālam",
     trans:"At the close of the cosmic dance, the King of dancers (Natarāja) sounded his small drum fourteen times, wishing to uplift the siddhas headed by Sanaka — thus the web of Śiva Sūtras was revealed.",
     source:"Traditional verse on the Māheśvara Sūtras",link:"https://ashtadhyayi.com",
     rel:"This is the traditional account of how Pāṇini received the 14 Māheśvara Sūtras. Nava-pañca = 9+5 = 14 beats of the ḍamaru. Each beat = one Sūtra. The cosmic dance encodes the entire sound system of Sanskrit."},
    {dev:"आदिरन्त्येन सहेता ।",roman:"ādirantyen sahetā",
     trans:"The first [sound], combined with the last marker [It], encompasses all [sounds between them].",
     source:"Aṣṭādhyāyī 1.1.71 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/1/71",
     rel:"Five syllables. Defines ALL 42 Pratyāhāras at once. This is the most economical rule in the history of linguistics. Ādi (first) + Antya-It (last marker) = the entire phoneme group between them."},
  ],
  5:[
    {dev:"अकुहविसर्जनीयानां कण्ठः । इचुयशानां तालु ।\nऋटुरषाणां मूर्धा । लृतुलसानां दन्ताः । उपुपध्मानीयानामोष्ठौ ॥",
     roman:"akuhavisarjanīyānāṃ kaṇṭhaḥ · icuyaśānāṃ tālu\nṛṭuraṣāṇāṃ mūrdhā · lṛtulusānāṃ dantāḥ · upupadhmanīyānāmoṣṭhau",
     trans:"Kaṇṭha for अ·Kavarga·ह·Visarga | Tālu for इ·Chavarga·य·श | Mūrdhā for ऋ·Ṭavarga·र·ष | Danta for ḷ·Tavarga·ल·स | Oṣṭha for उ·Pavarga·Upadhmanīya.",
     source:"Pāṇinīya Śikṣā, verses 13-17",link:"https://sacred-texts.com/hin/",
     rel:"Pāṇini's own phonetics manual. These five verses map every Sanskrit sound to its exact place of articulation — making all of the Aṣṭādhyāyī's phonological operations predictable and learnable from first principles."},
    {dev:"यत्र जायते स स्थानम् । येन जायते स करणम् ॥",
     roman:"yatra jāyate sa sthānam · yena jāyate sa karaṇam",
     trans:"WHERE a sound is born — that is the Sthāna. BY WHAT it is born — that is the Karaṇa.",
     source:"Taittirīya Prātiśākhya 2.48",link:"https://sacred-texts.com",
     rel:"An elegant couplet distinguishing Sthāna (place) from Karaṇa (instrument). The Prātiśākhya tradition predating Pāṇini already had this foundational distinction — showing the continuity of Sanskrit phonetic science over millennia."},
  ],
  6:[
    {dev:"प्राणो वाव शरीरं वायुर्वाव बलम् ।",roman:"prāṇo vāva śarīraṃ vāyurvāva balam",
     trans:"Prāṇa (breath) is the body; Vāyu (wind/breath) is strength.",
     source:"Chāndogya Upaniṣad 1.11.5",link:"https://sacred-texts.com/hin/sbe01/",
     rel:"The Upaniṣadic understanding of breath as the fundamental life-force directly informs the classification of Bāhya Prayatna into Alpaprāṇa (little breath = low aspiration) and Mahāprāṇa (great breath = high aspiration). Grammar and spirituality share the same breath."},
    {dev:"वर्गाणां प्रथमतृतीयपञ्चमाः यणश्च अल्पप्राणाः ।\nद्वितीयचतुर्थाः शलश्च महाप्राणाः ॥",
     roman:"vargāṇāṃ prathamatṛtīyapañcamāḥ yaṇaśca alpaprāṇāḥ\ndvitīyacaturthāḥ śalaśca mahāprāṇāḥ",
     trans:"1st·3rd·5th letters of each Varga and semi-vowels = Alpaprāṇa. 2nd·4th letters and sibilants = Mahāprāṇa.",
     source:"Commentary summarizing Śikṣā principles on the 5×5 grid",link:"https://ashtadhyayi.com",
     rel:"This alternating Alpa-Mahā pattern across the 5×5 Varga grid is not arbitrary — it mirrors the biomechanics of the vocal tract. The aspirated sounds (kh, gh…) require physically more breath volume. The grammar encodes physiology."},
  ],
  7:[
    {dev:"तुल्यास्यप्रयत्नं सवर्णम् ।",roman:"tulyāsyaprayatnaṃ savarṇam",
     trans:"Sounds with the same place of articulation and the same internal effort are Savarṇa (homogeneous).",
     source:"Aṣṭādhyāyī 1.1.9 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/1/9",
     rel:"Four words that define the concept foundational to ALL sandhi operations. When Sandhi rules say 'use the long form', Savarṇa defines exactly WHICH long form — the one sharing the same sthāna. Without this 4-word sūtra, Sandhi would collapse."},
    {dev:"ह्रस्वं त्वेकमात्रं भवति । दीर्घं द्विमात्रम् । प्लुतं त्रिमात्रम् ॥",
     roman:"hrasvaṃ tv ekamātraṃ bhavati · dīrghaṃ dvimātram · plutaṃ trimātram",
     trans:"Short is one mātrā · Long is two mātrās · Protracted is three mātrās.",
     source:"Ṛgveda Prātiśākhya 1.4-6",link:"https://sacred-texts.com",
     rel:"The same three-fold duration system that Pāṇini encodes in sūtra 1.2.27 is documented in the Ṛgveda Prātiśākhya — one of the oldest Vedāṅgas. This shows unbroken continuity of Sanskrit phonetic science from Ṛgvedic times to Pāṇini and beyond."},
  ],
  8:[
    {dev:"वृद्धिरादैच् ।",roman:"vṛddhirādaic",
     trans:"Ā, AI, and AU are called Vṛddhi.",
     source:"Aṣṭādhyāyī 1.1.1 — Pāṇini (The FIRST sūtra)",link:"https://ashtadhyayi.com/sutraani/1/1/1",
     rel:"The very first sūtra of the 3,978-sūtra Aṣṭādhyāyī is a DEFINITION — not an operation. This tells us the whole grammar is built on technical nomenclature before procedures. Pāṇini is saying: 'Before you can DO anything, you must KNOW the names.'"},
    {dev:"अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।\nहोतारं रत्नधातमम् ॥",
     roman:"agnim īḷe purohitaṃ yajñasya devam ṛtvijam\nhotāraṃ ratnadhātamam",
     trans:"I praise Agni, the household priest, the divine officiant of the sacrifice, the invoker, best bestower of treasure.",
     source:"Ṛgveda 1.1.1 — The first verse of the entire Ṛgveda",link:"https://sacred-texts.com/hin/rigveda/rv01001.htm",
     rel:"The very first verse of the Ṛgveda demonstrates Guṇa in action. 'Agni' (root) + 'īḷe' (verb) — the vowel sandhi here involves the Guṇa principle. Pāṇini placed the Guṇa sūtra at 1.1.2 specifically because Vedic recitation (starting with this verse) uses it immediately."},
  ],
  9:[
    {dev:"यज्ञेन वाचः पदवीयमायन् । तामन्वविन्दन्नृषिषु प्रविष्टाम् ।\nतामाभृत्या व्यदधुः पुरुत्रा ॥",
     roman:"yajñena vācaḥ padavīyam āyan · tāmanvavindan ṛṣiṣu praviṣṭām\ntāmābhṛtyā vyadadhuḥ purutrā",
     trans:"Through sacrifice they reached the pathway of speech. They found it established in the seers. They distributed it in many ways after bringing it.",
     source:"Ṛgveda 10.71.3 — Jñānasūkta (Hymn of Knowledge)",link:"https://sacred-texts.com/hin/rigveda/rv10071.htm",
     rel:"The Ṛgveda's Hymn of Knowledge is entirely about language, knowledge, and their distribution. The seers 'distributed' (vyadadhuḥ) speech — exactly what Pāṇini's system of substitutions (Sthānī-Ādeśa), augments (Āgama), and positions formalizes across all Sanskrit derivation."},
    {dev:"इग्यणः सम्प्रसारणम् ।",roman:"igyaṇaḥ samprasāraṇam",
     trans:"The replacement of YaN (semi-vowels) by IK (corresponding vowels) is called Samprasāraṇa.",
     source:"Aṣṭādhyāyī 1.1.45 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/1/45",
     rel:"Samprasāraṇa is visible in Vedic verbal forms. The root 'vac' (speak) → 'ucyate' (is spoken): v→u is Samprasāraṇa. These Vedic alternates that mystified later grammarians are exactly what this sūtra systematically describes and generates."},
  ],
  10:[
    {dev:"प्र देवत्रा ब्रह्माण्यृच्यसे ।",roman:"pra devatrā brahāṇy ṛcyase",
     trans:"You are praised with Brahman-hymns in the divine realm.",
     source:"Ṛgveda 1.1.3 (Agni Sūkta)",link:"https://sacred-texts.com/hin/rigveda/rv01001.htm",
     rel:"'प्र' (pra) appears as an Upasarga in the very first hymn of the Ṛgveda — the particle of 'forward motion' that Pāṇini systematically documented as one of 22 Prādi prefixes. The Ṛgveda thus provided the empirical data; Pāṇini provided the systematic theory."},
    {dev:"उपसर्गाः क्रियायोगे ।",roman:"upasargāḥ kriyāyoge",
     trans:"The 22 Prādi particles are called Upasargas when joined to a verb.",
     source:"Aṣṭādhyāyī 1.4.59 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/4/59",
     rel:"Five words that encode a profound insight: the SAME particle (pra) has a different grammatical identity depending on its syntactic context. Alone = Nipāta. With a verb = Upasarga. Context transforms essence — a principle the Vedas embody and Pāṇini formalizes."},
  ],
  11:[
    {dev:"अदर्शनं लोपः ।",roman:"adarśanaṃ lopaḥ",
     trans:"Non-perception/non-visibility is Lopa (deletion).",
     source:"Aṣṭādhyāyī 1.1.60 — Pāṇini",link:"https://ashtadhyayi.com/sutraani/1/1/60",
     rel:"A profound philosophical statement. The deleted element is NOT destroyed — it is 'adarśana' (not visible). It exists in the grammar's logic eternally. Compare Vedānta: Brahman is not absent from the world — it is merely unperceived (adarśana) beneath the māyā of appearances."},
    {dev:"नास्तो लोपः ।",roman:"nāsto lopaḥ",
     trans:"Lopa is not non-existence.",
     source:"Mahābhāṣya — Patañjali's commentary on 1.1.60",link:"https://sacred-texts.com",
     rel:"Patañjali explicitly refutes the naive reading of Lopa as 'destruction.' His insight directly parallels the Vedāntic concept of māyā — the world appears to disappear (Lopa) when Brahman is known, but the world was never truly destroyed, merely unmanifest. The grammar IS Vedānta."},
  ],
  12:[
    {dev:"अर्धमात्रालाघवेन पुत्रोत्सवं मन्यन्ते वैयाकरणाः ।",
     roman:"ardhamātrālāghavena putrotsavaṃ manyante vaiyākaraṇāḥ",
     trans:"Grammarians celebrate the saving of even half a mātrā (half-syllable) with the joy of a son's birth.",
     source:"Traditional proverb — cited in Mahābhāṣya tradition",link:"https://sacred-texts.com",
     rel:"This verse captures the entire spirit of the Aṣṭādhyāyī. Every technique — Anuvṛtti, Pratyāhāras, Adhikāra, It-markers — exists to save syllables. Pāṇini compressed what would require millions of words into 3,978 sūtras. This is the highest form of human intellectual achievement."},
    {dev:"एकः शब्दः सम्यगधीतः सुप्रयुक्तः स्वर्गे लोके च कामधुक् भवति ।",
     roman:"ekaḥ śabdaḥ samyagadhītaḥ suprayuktaḥ svarge loke ca kāmadhuk bhavati",
     trans:"One word, well-studied and properly used, becomes a wish-fulfilling cow in both the heavenly and earthly realms.",
     source:"Mahābhāṣya Paspaśāhnika — Patañjali",link:"https://sacred-texts.com",
     rel:"Patañjali's profound statement on why grammar matters: correct word-use is kāmadhuk (wish-fulfilling). The architecture of the Aṣṭādhyāyī — 7 sūtra-types, Anuvṛtti, Adhikāra, conflict rules — all serve this one purpose: teaching humans to use language correctly."},
  ],
};

/* ── LEVEL TESTS (Easy 5 / Medium 5 / Hard 5 per chapter) ───────────────── */
const LVL={
  1:{
    easy:[
      {q:"Which is a Dhātu (verbal root)?",opts:["पुस्तक","भू","रामः","लेखनी"],ans:1,exp:"भू = to be/become. Pustaka (book), Rāmaḥ, Lekhanī are Pratipadikas (nominal stems)."},
      {q:"How many roots are in Pāṇini's Dhātupāṭha?",opts:["500","1,930","3,978","10,000"],ans:1,exp:"Exactly 1,930 Aupadeshika Dhātus in 10 Gaṇas."},
      {q:"'Trimuni' refers to:",opts:["3 vowel types","Pāṇini+Kātyāyana+Patañjali","3 Gaṇas","3 Pratyāhāras"],ans:1,exp:"Three sages: Pāṇini (Sūtras), Kātyāyana (Vārttikas), Patañjali (Mahābhāṣya)."},
      {q:"Sūtra 1.3.1 defines:",opts:["Pratipadika","Dhātu — Bhuvādayo Dhātavaḥ","Vowels","Sandhi"],ans:1,exp:"Bhuvādayo Dhātavaḥ (1.3.1) — the first sūtra naming the Dhātu category."},
      {q:"'पठित' (studied) is what type?",opts:["Dhātu","Kṛdanta Pratipadika","Simple noun","Upasarga"],ans:1,exp:"पठित = पठ् + क्त. The क्त suffix makes it a Kṛdanta — a sub-category of Pratipadika (1.2.46)."},
    ],
    medium:[
      {q:"Sūtra 3.1.32 'सनाद्यन्ता धातवः' creates:",opts:["Original 1930 roots","Derivative roots via suffixes like San·Nic·Yaṅ","Pratipadikas","Compounds"],ans:1,exp:"Atideshika Dhātus — formed by adding 12 suffixes (San, Nic, Yaṅ etc.) to existing roots."},
      {q:"Which is NOT one of the Pañcāṅga's 5 parts?",opts:["Dhātupāṭha","Gaṇapāṭha","Lipipāṭha","Liṅgānuśāsana"],ans:2,exp:"'Lipipāṭha' (script study) does not exist. The 5 are: Sūtrapāṭha+Dhātupāṭha+Gaṇapāṭha+Uṇādipāṭha+Liṅgānuśāsana."},
      {q:"'Kṛttaddhitasamāsāśca' (1.2.46) adds what to Pratipadika?",opts:["All words","Kṛdanta+Taddhitānta+Samāsa","Only suffixes","Vedic forms"],ans:1,exp:"1.2.46 extends 1.2.45 via Anuvṛtti to include all three derived categories as Pratipadika."},
      {q:"Why does 1.2.45 exclude 'pratyaya' (suffix) from Pratipadika?",opts:["Suffixes are Dhātus","A suffix alone lacks independent meaning — Pratipadika must be 'arthavat'","Convention","Suffixes are vowels"],ans:1,exp:"Pratipadika = independently meaningful word. A suffix like -a or -tva has no standalone meaning."},
      {q:"The Adādi Gaṇa (Group 2) is special because:",opts:["Most roots","Its Śap vikaraṇa undergoes LUK deletion","Uses Nic suffix","Only Vedic forms"],ans:1,exp:"Group 2 (ad=eat, etc.) — the vikaraṇa Śap undergoes Luk (not regular Lopa), signaling specific stem operations."},
    ],
    hard:[
      {q:"'पठ् + सन् = पिपठिषति' — the new root 'पिपठिष' is called:",opts:["Aupadeshika Dhātu","Atideshika / Sanādyanta Dhātu","Pratipadika","Āgama"],ans:1,exp:"The entire new root 'pipathiṣ-' = Atideshika Dhātu formed by San suffix. It then takes its own conjugational endings."},
      {q:"Between 1.2.45 and 1.2.46, the grammatical relationship is:",opts:["Both equally defining","1.2.45 defines core; 1.2.46 EXTENDS via Anuvṛtti of 'Pratipadikam'","1.2.46 cancels 1.2.45","Unrelated"],ans:1,exp:"1.2.46 uses Anuvṛtti of 'Pratipadikam' from 1.2.45 to extend the category — perfect example of Pāṇini's economy."},
      {q:"Why is 1.3.1 classified as a Saṃjñā Sūtra (naming rule)?",opts:["It performs phonetics","It defines/names the technical term Dhātu","It resolves conflict","It governs subsequent sūtras"],ans:1,exp:"Saṃjñā sūtras assign technical labels. 1.3.1 names the category 'Dhātu' — without this name, no subsequent rule could efficiently refer to all verbal roots."},
      {q:"In 22×1930: 22 Upasargas × 1930 Dhātus. What does this reveal about Pāṇini's grammar?",opts:["It lists 42460 words","The grammar is GENERATIVE — rules produce infinite outputs from finite inputs","Grammar is only descriptive","An error in counting"],ans:1,exp:"22 Upasargas × 1930 roots = 42,460+ potential verb compounds. Pāṇini built a word-generation engine — not just a word list. This is generative grammar over 2,500 years ago."},
      {q:"The Curādi Gaṇa (Group 10) using णिच् means all its verbs are:",opts:["Passive","Causative — the णिच् suffix itself signals causation","Desiderative","Intensive"],ans:1,exp:"Curādi roots take णिच् as their vikaraṇa, making ALL their forms causative: चोरयति (causes to steal), पाठयति (causes to study), भावयति (causes to be)."},
    ]
  },
  2:{
    easy:[
      {q:"How many Svaras (vowels) are in Sanskrit?",opts:["7","9","11","33"],ans:1,exp:"9 independent vowels (Ach): अ इ उ ऋ ऌ ए ओ ऐ औ."},
      {q:"Kavarga (क-ङ) is produced at:",opts:["Tālu","Danta","Kaṇṭha","Mūrdhā"],ans:2,exp:"Kavarga = guttural sounds at Kaṇṭha (throat)."},
      {q:"Total consonants (Hal) in Sanskrit:",opts:["25","29","33","42"],ans:2,exp:"25 Sparśa + 4 Antaḥstha + 4 Ūṣma = 33 Vyañjanas."},
      {q:"Semi-vowels (Antaḥstha / Yaṇ) are:",opts:["श ष स ह","य र ल व","क ख ग घ","अ इ उ"],ans:1,exp:"य र ल व = 4 semi-vowels (Antaḥstha / Yaṇ pratyāhāra)."},
      {q:"'Udit' names (Ku, Cu…) represent:",opts:["One consonant","The entire 5-letter Varga","A vowel","A prefix"],ans:1,exp:"'कु' = the entire Kavarga = क ख ग घ ङ. 'उ' is an It-marker signaling 'entire group.'"},
    ],
    medium:[
      {q:"Why are Svaras placed FIRST in the Varṇamātrikā?",opts:["Convention","Pradhāna (primary) — self-sufficient, independent sounds","They are shorter","Alphabet tradition"],ans:1,exp:"'Svayam rājante svarāḥ' — vowels shine by themselves. As independent (Pradhāna) entities, they precede dependent consonants. Philosophy and phonetics align."},
      {q:"ए, ऐ, ओ, औ are called 'sandhyakṣara' because:",opts:["They are long","They form at the junction of two vowels: a+i=e, a+u=o etc.","They are nasal","Only in compounds"],ans:1,exp:"Sandhyakṣara = junction letters. ए=अ+इ · ओ=अ+उ · ऐ=आ+ई · औ=आ+ऊ. Two Sthānas used simultaneously."},
      {q:"'Anyag bhavati vyañjanam' describes consonants as:",opts:["Primary","Secondary — they manifest only WITH vowel support","Nasals","Vedic only"],ans:1,exp:"Vyañjana = that which manifests (vi+añj) only with vowel help. They are Apradhāna (secondary) — placed AFTER Svaras."},
      {q:"Why exactly 5 Vargas (not 4 or 6)?",opts:["Arbitrary","Exactly 5 places of articulation produce stop consonants","Tradition","Vedic convention"],ans:1,exp:"5 Sthānas produce stops: Kaṇṭha·Tālu·Mūrdhā·Danta·Oṣṭha. The human vocal tract has exactly these 5 primary contact points."},
      {q:"'Kādayo Havantāḥ' describes consonants from क to ह. This is identical to:",opts:["Ac pratyāhāra","Hal pratyāhāra","Yan pratyāhāra","Śal pratyāhāra"],ans:1,exp:"Kādayo Havantāḥ = beginning with Ka, ending with Ha = all 33 consonants = the Hal pratyāhāra expressed in plain description form."},
    ],
    hard:[
      {q:"The principle 'Pūrve Svarāḥ' (vowels first) in Taittirīya Prātiśākhya reflects:",opts:["Alphabetical convention","Pradhāna before Apradhāna — cause before effect, independent before dependent","Length order","Vedic tradition only"],ans:1,exp:"Universal Indian philosophical principle: CAUSE precedes EFFECT, INDEPENDENT precedes DEPENDENT. Vowels = cause (vowels make consonants pronounceable). Grammar embeds cosmology."},
      {q:"The Udit Saṃjñā ('उ' in Ku, Cu, etc.) is technically called:",opts:["Pratyāhāra","Udit Saṃjñā — 'उ' is an It-marker whose presence signals 'the entire Varga'","Anuvṛtti","Adhikāra"],ans:1,exp:"The 'उ' attached to varga-names is an It-marker. Its presence triggers the rule: entire 5-member Varga is meant, not just the first letter. Perfect economy."},
      {q:"OM (अ+उ+म) maps onto which 3 Sthānas?",opts:["Random","Kaṇṭha(अ) + Oṣṭha(उ) + Nasika-closure(म)","All 5 Vargas","Tālu+Mūrdhā+Danta"],ans:1,exp:"अ=Kaṇṭha, उ=Oṣṭha, म=Nāsikā+Oṣṭha-closure. OM traverses the entire vocal tract from throat to lips, symbolizing the completeness of all sound — hence Chāndogya UP says 'OM khaṃ Brahma.'"},
      {q:"The alternating Alpa-Mahā-Alpa-Mahā-Alpa pattern within each Varga reflects:",opts:["Random assignment","The biomechanics of aspiration — adjacent consonants alternating between low and high breath volume production","Vedic counting","Grammar tradition"],ans:1,exp:"Phonetic reality: in any articulatory position, the natural alternation is unaspirated-aspirated-unaspirated-aspirated-nasal. The grammar mirrors the body's natural phonetic rhythm."},
      {q:"Why are ḷ and ḹ (ऌ and ॡ) rarely seen in classical Sanskrit?",opts:["They don't exist","They appear mainly in Vedic (especially Ṛgveda) and in a few Vedic verbal forms — classical Sanskrit replaced most ḷ forms with r forms","Grammar error","Modern invention"],ans:1,exp:"ḷ is a Ṛgvedic vowel (as in 'kḷpta' = fixed). Classical Sanskrit regularized these to more common forms. However, ḷ remains in the formal Varṇamātrikā to account for Vedic derivations."},
    ]
  },
  3:{
    easy:[
      {q:"Anusvāra (ṃ) is:",opts:["Two dots (:)","A dot above","A tilde (~)","Half a letter"],ans:1,exp:"Anusvāra = dot ABOVE: रामं. Creates nasal resonance after a vowel. Sthāna = Nāsikā."},
      {q:"Jihvāmūlīya appears before:",opts:["Pa/Pha","Ka/Kha","Ta/Tha","Any vowel"],ans:1,exp:"Jihvāmūlīya = tongue-root half-visarga before Ka (क) or Kha (ख)."},
      {q:"Total Āyogavāhas:",opts:["4","6","8","12"],ans:2,exp:"8: Anusvāra + Visarga + Jihvāmūlīya + Upadhmanīya + 4 Yamas."},
      {q:"To name letter 'म', we say:",opts:["म alone","मकार","मं","मः"],ans:1,exp:"Kāra suffix: मकार = the letter 'ma'. Avoids confusion between the letter and its name."},
      {q:"Anupūrvī means:",opts:["Random order","Sequential spoken order of sounds","Alphabetical","Reverse"],ans:1,exp:"Anupūrvī = temporal sequence as sounds emerge from the mouth — script order can differ!"},
    ],
    medium:[
      {q:"Āyogavāhas 'travel with' vowels because:",opts:["Tradition","They require a host vowel to exist — neither fully independent nor fully consonant-like","They are ancient sounds","Grammar convention"],ans:1,exp:"Āyogavāha = 'carrying without attachment.' They ride on vowels (Anusvāra after अ = अं) but also have consonant-like properties — fitting in BOTH Ac and Śar pratyāhāras depending on context."},
      {q:"In 'कि' — 'क' and 'इ' — which comes first in Anupūrvī (spoken order)?",opts:["इ (as visually appears)","क (spoken first, then इ follows)","Simultaneously","Depends on context"],ans:1,exp:"Anupūrvī = trust your ear, not your eye. In Devanagari, the इ-matra appears visually BEFORE क, but we SPEAK क first, then इ. Script represents sound; it doesn't define its order."},
      {q:"Visarga (:) alternates with 'ह' in some sandhi contexts because:",opts:["Random","Both share Kaṇṭha (throat) as their primary Sthāna","They are both vowels","Grammar tradition"],ans:1,exp:"Visarga and ह share Kaṇṭha Sthāna — this phonetic proximity is why rāmaḥ+iti can become rāmahiti in certain Vedic sandhi. Same place = similar behavior."},
      {q:"Yama sounds appear only in Vedic, between which sound pairs?",opts:["Any two consonants","A non-nasal consonant and the nasal of the SAME Varga","Two vowels","Any nasal + any consonant"],ans:1,exp:"Yamas appear between a non-nasal stop and its Varga's nasal: in अग्निः, between ग् (3rd Tavarga) and ण/न (5th Tavarga). Only within-Varga pairs generate Yamas."},
      {q:"'Rāmaṃ śyāmaṃ grāmaṃ' — what does this pattern demonstrate?",opts:["Guru syllables","Anusvāra as Āyogavāha in accusative ending -am","Sandhi rules","Consonant clusters"],ans:1,exp:"Every -am accusative ending uses Anusvāra in continuous text. Understanding Anusvāra as Āyogavāha (not a pure vowel, not a pure consonant) explains its behavior in sandhi throughout all Sanskrit texts."},
    ],
    hard:[
      {q:"Why does Anusvāra belong to BOTH Ac (vowel) AND Śar (sibilant) pratyāhāras?",opts:["Error","Dual phonetic nature: nasal resonance like vowels + requires a host like consonants — enabling different sandhi rules in each context","Vedic convention","Pāṇini's oversight"],ans:1,exp:"Dual membership enables context-sensitive grammar: in some rules, Anusvāra behaves as a vowel extension; in others, as a consonant. The grammar captures this ambiguity by placing it in BOTH pratyāhāras."},
      {q:"Jihvāmūlīya and Upadhmanīya are 'anticipatory assimilation' of Visarga because:",opts:["Random","Visarga adjusts its articulation to MATCH the upcoming consonant: tongue-root before Ka (Jihvāmūlīya), lips before Pa (Upadhmanīya)","They are Vedic only","They replace vowels"],ans:1,exp:"These are contextual Visarga variants where the pronunciation shifts toward the NEXT consonant's place. This is anticipatory coarticulation — the same principle underlying most sandhi rules."},
      {q:"The Kāra suffix (अकार, मकार) enables Pāṇini to:",opts:["Make letters longer","Use LETTERS AS SUBJECTS IN RULES — 'akāraḥ' is a noun that can take case endings in sūtras","Decorate grammar","Name scripts"],ans:1,exp:"Without Kāra: 'अ appears in this rule' is ambiguous (the sound? the word?). With Kāra: 'अकारः' = the letter-concept as a grammatical noun that can be the subject, object, or condition in any sūtra. This enables formal grammar-writing."},
      {q:"Why exactly 4 Yama sounds — not 5 per Varga?",opts:["Tradition","The 5th letter of each Varga IS already nasal — only the first 4 (non-nasal) can generate a Yama by preceding their Varga's nasal","Vedic counting","Arbitrary"],ans:1,exp:"ङ/ञ/ण/न/म are already nasals. Yamas arise when NON-nasal precedes nasal OF THE SAME Varga. So: only letters 1-4 of each Varga can generate Yamas — exactly 4 types per Varga context. Mathematics of phonology."},
      {q:"The Taittirīya Prātiśākhya's treatment of Āyogavāhas as 'essential despite being extra-alphabetical' means:",opts:["Grammar error","These sounds exist in ACTUAL LANGUAGE USE but don't fit neatly into the 42-phoneme core system — their extra-alphabetical status reflects the gap between theoretical systems and living language","They are optional","Only for priests"],ans:1,exp:"This is one of the deepest insights of the Prātiśākhya tradition: formal phonological systems (the 42-phoneme Māheśvara encoding) cannot fully capture ALL sounds used in practice. The Āyogavāhas represent the gap between theory and usage — the grammar must account for both."},
    ]
  },
  4:{
    easy:[
      {q:"How many Māheśvara Sūtras?",opts:["9","12","14","42"],ans:2,exp:"14 sūtras from Shiva's 14-beat ḍamaru. Nava-pañca (9+5=14)."},
      {q:"'अच्' includes:",opts:["All consonants","All 9 vowels","Only short vowels","Semi-vowels"],ans:1,exp:"अच् = अ (sūtra 1 start) + च् (sūtra 4 It) = all 9 vowels between them."},
      {q:"An It-marker is:",opts:["A vowel used in words","Marker used for Pratyāhāra coding, then deleted","A prefix","A compound vowel"],ans:1,exp:"It = final consonant of each Māheśvara Sūtra. Named by 1.3.3, deleted by 1.3.9."},
      {q:"How many standard Pratyāhāras?",opts:["14","22","33","42"],ans:3,exp:"42 standard Pratyāhāras from the 14 sūtras."},
      {q:"'आदिरन्त्येन सहेता' (1.1.71) in 5 syllables defines:",opts:["Dhātu","ALL 42 Pratyāhāras: Ādi-start + Antya-It = entire group between","Upasarga","Lopa"],ans:1,exp:"The most economical meta-rule in linguistics history — 5 syllables defining 42 abbreviation codes."},
    ],
    medium:[
      {q:"सूत्र 1.3.3 'हलन्त्यम्' and 1.3.9 'तस्य लोपः' together accomplish:",opts:["Define vowels","Name the It-marker (1.3.3) then DELETE it (1.3.9) — temporary coding system","Create Pratyāhāras","Define Sandhi"],ans:1,exp:"Two-step It system: first name it (हलन्त्यम्), then delete it (तस्य लोपः). This enables coding without leaving artifacts in the derived forms."},
      {q:"The pratyāhāra 'इक्' (=इ उ ऋ ऌ) is formed:",opts:["From the first sūtra only","From इ (sūtra 1 start) + क् (sūtra 2 It) — giving everything between these two points","Randomly","From 4 sūtras"],ans:1,exp:"इक् = from इ in sūtra 1 (after अ) + क् It of sūtra 2. This covers exactly the 4 short non-a vowels used in the famous rule 'इको यणचि.'"},
      {q:"One It-marker (like क्) can yield MULTIPLE Pratyāhāras because:",opts:["It changes","Different Ādi (starting) sounds chosen from earlier — अक् vs इक् vs उक् from same क् It","Adding more letters","Using Lopa"],ans:1,exp:"The same क् of sūtra 2 yields: अक् (from अ), इक् (from इ), उक् (from उ). Three Pratyāhāras from one It-marker by varying the Ādi starting point."},
      {q:"Why are the 14 sūtras in that specific order and not any other?",opts:["Shiva's choice","Mathematically precise: every intended Pratyāhāra has a unique Ādi+It code — reordering would create conflicts","Recitation convenience","Historical accident"],ans:1,exp:"The order is combinatorially optimal. Every sound-group needed by the grammar has exactly one unambiguous Ādi+It code in this arrangement. Change any element and some codes become ambiguous or impossible."},
      {q:"In 'इको यणचि', the roles of the three Pratyāhāras are:",opts:["All are targets","इक्=Avidhimān(condition), यण्=Vidhimān(target), अच्=Nimitta(trigger)","All are triggers","Random"],ans:1,exp:"This one sūtra encodes a complete sandhi operation: इक् sounds (context) BECOME यण् sounds (target) BEFORE अच् vowels (trigger). Three different grammatical roles encoded in 5 syllables."},
    ],
    hard:[
      {q:"The scientific basis of the Māheśvara Sūtras' ordering is:",opts:["Divine revelation only","The 5-4-3-2-1 distribution of consonants per sūtra reflects the frequency of sound interactions in sandhi — most-used Pratyāhāras are shortest","Arbitrary tradition","Mnemonic convenience"],ans:1,exp:"Vowels (most used in sandhi) come first in sūtras 1-4. Consonants are distributed so the most-needed abbreviations (Ac, Hal) require the fewest syllables. This is information-theoretic optimization — 2500 years before information theory."},
      {q:"'वर्णानामनुपूर्वी माहेश्वरसूत्रेषु' — the internal ORDER of sounds within each sūtra is:",opts:["Mnemonic only","Itself a grammatical principle: sounds earlier = possible Ādi, sounds later = possible Antya — the sequence IS the grammar","Random","Vedic recitation order"],ans:1,exp:"The sequence within each sūtra is not just for recitation memory — it's a grammatical resource. The Ādi (start) possibilities and Antya (end) possibilities depend entirely on position within the sūtra sequence."},
      {q:"The 14 sūtras contain ~63 sound-tokens. After deleting 14 It-markers, ~49 remain. This number reflects:",opts:["Arbitrary count","The core phoneme inventory: 9 vowels + 4 semivowels + 36 consonant-tokens = 49, with some sounds repeated for multiple Pratyāhāra possibilities","A Vedic sacred number","Error"],ans:1,exp:"The repetition of ह in sūtra 5 (ह य व र ट्) AND sūtra 14 (ह ल्) is intentional — it allows DIFFERENT ranges of the Hal Pratyāhāra (with or without the following semi-vowels). Every repetition serves a specific Pratyāhāra need."},
      {q:"Patañjali's defense of the Māheśvara Sūtras against critics who called them 'unnecessary' argues:",opts:["They are sacred","Without them, every rule mentioning a sound group would need to LIST every member — exponentially increasing the grammar's size; the Pratyāhāras compress thousands of rules into compact form","They are beautiful","Tradition must be followed"],ans:1,exp:"Patañjali mathematically demonstrates: without Pratyāhāras, a rule like 'do X before any vowel' would need to list all 9 vowels × 18 variants = 162 items EACH TIME. With अच्, it's one syllable. The compression ratio justifies the entire 14-sūtra system."},
      {q:"Why couldn't Pāṇini just use numerical abbreviations (1=अ, 2=इ, etc.) instead of Māheśvara Sūtras?",opts:["Numbers are un-Vedic","Phoneme groups don't form sequential number ranges — sounds that interact in rules are not numerically adjacent; the ḍamaru ordering groups them by FUNCTIONAL similarity, not position in alphabet","Numbers are Western","Grammar tradition"],ans:1,exp:"Brilliant question. Numerical notation assumes linearly ordered groups. But Sanskrit phoneme groups that interact in rules (like all vowels, or all velars, or all voiced stops) are defined by phonetic PROPERTIES (same Sthāna, same voicing) — not sequential position. The Māheśvara grouping captures phonetic reality; sequential numbering would not."},
    ]
  },
  5:{
    easy:[
      {q:"Kavarga (क-ङ) Sthāna is:",opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"],ans:1,exp:"Sūtra: अकुहविसर्जनीयानां कण्ठः — throat for Kavarga."},
      {q:"Ṭavarga (ट-ण) Sthāna is:",opts:["Kaṇṭha","Tālu","Mūrdhā","Danta"],ans:2,exp:"Mūrdhā (cerebral/retroflexed) = Sthāna for ऋ, Ṭavarga, र, ष."},
      {q:"Alpaprāṇa letters of a Varga are:",opts:["2nd·4th","1st·3rd·5th","All 5","Only 5th (nasal)"],ans:1,exp:"1st, 3rd, 5th = Alpaprāṇa (low breath). 2nd, 4th = Mahāprāṇa (aspirated)."},
      {q:"Savarṇa (1.1.9) means:",opts:["Both long","Same Sthāna + same Abhyantara Prayatna","Both voiced","Both nasals"],ans:1,exp:"Tulyāsyaprayatnam = same place + same internal effort = homogeneous sounds. अ and आ are Savarṇa."},
      {q:"'ह' when conjunct with a semi-vowel (as in ब्रह्म) takes Sthāna:",opts:["Kaṇṭha","Tālu","Uras (chest)","Mūrdhā"],ans:2,exp:"Unconjunct ह = Kaṇṭha. Conjunct ह + nasal/semi-vowel (like in brahma, prahlāda) = Uras (chest cavity)."},
    ],
    medium:[
      {q:"Karaṇa for Palatal sounds (Chavarga) is:",opts:["Tongue root","Middle of tongue (Jihvāmadhya)","Tongue tip","Lips"],ans:1,exp:"Jihvāmadhya (mid-tongue) reaches up to the Tālu (palate) to produce च छ ज झ ञ."},
      {q:"'Khar' consonants share which Bāhya Prayatna combination?",opts:["Saṃvāra+Nāda+Ghoṣa","Vivāra+Śvāsa+Aghoṣa","Vivāra+Nāda+Ghoṣa","Saṃvāra+Śvāsa"],ans:1,exp:"Khar = Vivāra (open cords) + Śvāsa (breathed) + Aghoṣa (unvoiced). 1st+2nd of each varga + sibilants."},
      {q:"ए and ऐ share 'Kaṇṭha+Tālu' as Sthāna because:",opts:["They are long","They are diphthongs: ए=अ(Kaṇṭha)+इ(Tālu), using both places simultaneously","Tradition","Grammar convention"],ans:1,exp:"Sandhyakṣara logic: diphthongs combine TWO Sthānas. The mouth moves from Kaṇṭha (for the अ component) to Tālu (for the इ component) in one gliding motion."},
      {q:"How many primary Sthānas are recognized in the Śikṣā texts?",opts:["5","6","7","8"],ans:3,exp:"8 Sthānas: Uras+Kaṇṭha+Śiras+Jihvāmūla+Tālu+Mūrdhā+Danta+Oṣṭha. Some texts list 5-8 depending on inclusion of Uras, Śiras, Nāsikā."},
      {q:"'Dantauṣṭha' as the Sthāna for व means:",opts:["Random","Both Danta (upper teeth) and Oṣṭha (lower lip) are used simultaneously — teeth+lip contact","Pure lip sound","Grammar convention"],ans:1,exp:"व is like English 'v' — the lower lip lightly touches the upper teeth. This dual-contact earns it the compound Sthāna name. This is why foreign learners sometimes confuse Sanskrit व with both 'v' and 'w.'"},
    ],
    hard:[
      {q:"The sūtra 'Samānahāraṇasya sthānam' (Pāṇinīya Śikṣā) about Āyogavāhas says:",opts:["They have no Sthāna","Āyogavāhas inherit the Sthāna of their HOST sound — Anusvāra after Kaṇṭhya = Kaṇṭha Sthāna; after Tālavya = Tālu Sthāna","They all use Nāsikā","They are voiceless"],ans:1,exp:"Āyogavāhas are phonetically flexible: their Sthāna depends on their environment. This dynamic Sthāna assignment is what 'Āyogavāhā vijñeyā āśrayasthānabhāginaḥ' declares — they 'share' their host's place."},
      {q:"Why is Abhyantara Prayatna crucial for GRAMMAR (beyond just phonetics)?",opts:["It is only phonetic","Savarṇa (1.1.9) is defined by SHARED Abhyantara Prayatna — and Savarṇa determines ALL vowel substitutions and sandhi scope in the Aṣṭādhyāyī","Only for Vedic recitation","Grammar tradition"],ans:1,exp:"Abhyantara Prayatna is the key variable in the Savarṇa definition. ALL sandhi substitutions, ALL vowel lengthening rules, ALL savarṇagrāhaka operations depend on identifying which sounds are Savarṇa — which requires matching Abhyantara Prayatna."},
      {q:"The Ṛgveda Prātiśākhya's 'mātrā = time for one short vowel' (1.4) defines something that Pāṇini uses in:",opts:["Definition of Dhātu","Sūtras 1.2.27 (ūkālo'jjhrasvadīrghaplutaḥ) — the three-duration system based on mātrā counting","Upasarga rules","Sandhi rules only"],ans:1,exp:"The continuity is direct: Ṛgveda Prātiśākhya defines mātrā → Pāṇini uses it in 1.2.27 to define Hrasva/Dīrgha/Pluta. Grammar is not a break from Vedic tradition but its systematic formalization."},
      {q:"Why do cerebral consonants (Ṭavarga) require 'retroflex' tongue position?",opts:["Cultural tradition","The tongue tip curls BACKWARD and upward to touch the hard palate behind the teeth ridge — the Mūrdhā (roof/head of the oral cavity)","They are ancient sounds","Foreign influence"],ans:1,exp:"Mūrdhā literally means 'head/roof.' The tongue tip curls back and upward to touch the hard palate — a position called 'retroflex' in Western linguistics. This backward curling is what distinguishes ट from त (Danta/dental). The Sanskrit nomenclature 'Mūrdhā' perfectly describes this articulatory reality."},
      {q:"How does the Karaṇa system prove that Pāṇini's phonetics is MORE precise than just listing Sthānas?",opts:["It doesn't","Sthāna alone is insufficient: both Kaṇṭha sounds AND Jihvāmūla sounds use the Kaṇṭha area. Karaṇa (which PART of tongue reaches WHERE) distinguishes them precisely","Extra information","Decorative"],ans:1,exp:"Multiple sounds share Kaṇṭha Sthāna but differ in Karaṇa: ह uses the WHOLE throat, क uses the BACK of tongue pressing up. Without Karaṇa, the phonetic description would be ambiguous. Sthāna+Karaṇa together give complete articulatory specification — centuries before Western IPA."},
    ]
  },
  6:{
    easy:[
      {q:"Udātta, Anudātta, Svarita are:",opts:["Consonant types","Vedic pitch accents for vowels","Sandhi types","Suffix types"],ans:1,exp:"Three Bāhya Prayatna of VOWELS: Udātta (high), Anudātta (low), Svarita (circumflex blend)."},
      {q:"Hrasva·Dīrgha·Pluta refer to:",opts:["Consonant types","Duration (Kāla) of vowels","Sandhi","Suffix types"],ans:1,exp:"Kāla: Hrasva=1 mātrā · Dīrgha=2 mātrās · Pluta=3+ mātrās. Defined in 1.2.27."},
      {q:"Anunāsika means produced:",opts:["Only through nose","Through both mouth AND nose","Only through mouth","From chest"],ans:1,exp:"Sūtra 1.1.8: mukhanāsikāvacanonunāsikaḥ — Anunāsika uses BOTH oral and nasal cavities."},
      {q:"How many forms does each basic short vowel (like 'अ') have?",opts:["3","9","12","18"],ans:3,exp:"3 durations × 3 tones × 2 nasality = 18 phonetically distinct forms!"},
      {q:"Pluta vowels are used for:",opts:["All words","Calling someone from a distance or Vedic chanting","Only compounds","Only Vedic"],ans:1,exp:"Pluta (3+ mātrās) = the elongated call: रा³म! Written with superscript 3 in Sanskrit texts."},
    ],
    medium:[
      {q:"Svarita (1.2.31) is defined as:",opts:["High tone","Low tone","Samāhāraḥ — blend of Udātta+Anudātta","No tone"],ans:2,exp:"Samāhāraḥ svaritaḥ = circumflex. The combination/blending of Udātta and Anudātta qualities."},
      {q:"ए ओ ऐ औ have only 12 forms (not 18) because:",opts:["They are shorter","They have no Hrasva (short) form — 2 durations × 3 tones × 2 nasality = 12","They are compound vowels","Convention"],ans:1,exp:"Diphthongs are inherently long — no short version of ए, ओ, ऐ, औ exists. So maximum 12 forms, not 18."},
      {q:"The 5th letters (ङ ञ ण न म) require DUAL Sthāna because:",opts:["Nasals are special","They use their Varga's Sthāna PLUS Nāsikā — block your nose and you cannot pronounce them","Only oral production","One Sthāna suffices"],ans:1,exp:"Block your nose and try saying ण — it becomes ड. The nasal cavity is obligatory for all Varga-nasals. They use TWO articulation sites simultaneously."},
      {q:"In the Sāma Veda, Udātta corresponds to Gāndhāra (3rd note). This reveals:",opts:["Coincidence","The IDENTITY of grammar and music in Sanskrit: pitch accents ARE musical notes — grammar IS music at a different scale","No connection","Western music theory"],ans:1,exp:"Vedic pitch accents directly correspond to Sāma Veda musical notes: Svarita=Ṣaḍja, Udātta=Gāndhāra, Anudātta=Ṛṣabha. Sanskrit grammar is embedded in music — both describe the same acoustic phenomenon at different levels."},
      {q:"'Abhinihita svarita' and 'kṣaipra svarita' are:",opts:["Errors in Vedic","Two of 7+ sub-types of Svarita identified in Prātiśākhya texts — showing extraordinary phonetic precision","Pāṇini's innovations","Modern categories"],ans:1,exp:"The Prātiśākhyas identify multiple Svarita sub-types based on phonetic environment. This granular precision — achieved thousands of years before modern linguistics — demonstrates the depth of Indian phonetic science."},
    ],
    hard:[
      {q:"Why does ऌ (ḷ) have only 12 forms (some traditions say fewer)?",opts:["Random","No widely-used long ḷ in classical Sanskrit; some Vedic schools don't use its pluta. So: max 2 durations × 3 tones × 2 nasality = 12","It is not real","Modern simplification"],ans:1,exp:"ḷ appears in Ṛgvedic forms (kḷpta, kḷp root) but was regularized to r/other forms in Classical Sanskrit. The long ḹ exists theoretically but rarely in practice. Different Vedic śākhās give different counts."},
      {q:"The total number of phonetically distinct vowel sounds in Sanskrit (all 9 base vowels × their forms) is approximately:",opts:["9","42","162-200+","18"],ans:2,exp:"अ·इ·उ·ऋ each have 18 forms = 72. ए·ओ·ऐ·औ each have 12 = 48. ऌ = 12. Total ~132-200 depending on school. Sanskrit phonology is vastly richer than the '9 vowels' label suggests."},
      {q:"'Ekā api mātrā rakṣyate' (even one mātrā must be preserved) in Vedic recitation relates to:",opts:["Contradiction","THE SAME PRINCIPLE from opposite angles: Vedic saves every mātrā in recitation; Pāṇini saves every mātrā in description. Both treat phonological units as precious","No relation","Historical coincidence"],ans:1,exp:"Deep unity: Vedic chanters were trained never to lose a single mātrā from the sacred text. Pāṇini's grammar never uses an extra mātrā in describing Sanskrit. Both traditions treat phonological units as irreducibly precious. The grammar IS an extension of the Vedic tradition."},
      {q:"Vedic Svarita in Ṛgveda vs. Sāma Veda — same or different?",opts:["Identical","DIFFERENT: Ṛgvedic Svarita marks post-Udātta position; Sāma Vedic Svarita is a sustained musical note — both are captured by 1.2.31's 'samāhāra' (combination) definition","No Sāma Veda Svarita","Both are Anudātta"],ans:1,exp:"The grammatical definition 'samāhāraḥ svaritaḥ' is broad enough to encompass both: Ṛgvedic (positional descent from Udātta) and Sāma Vedic (sustained mid-note). Pāṇini's definition is deliberately abstract to cover all Vedic schools."},
      {q:"Why is 'Nāda' (resonance) listed as Bāhya Prayatna of Haś consonants and not Khar?",opts:["Random","Khar consonants are VOICELESS — vocal cords are spread (Vivāra), air passes without cord vibration (Aghoṣa). Haś consonants are VOICED — cords vibrate (Ghoṣa), producing resonance (Nāda)","Tradition","Grammar convention"],ans:1,exp:"Nāda (resonance/voicing) requires vocal cord vibration. Khar = Aghoṣa (no voicing = no Nāda). Haś = Ghoṣa (voicing = Nāda). The grammar captures the exact physiological distinction between voiced and voiceless consonants — what modern phonetics calls +/- voice."},
    ]
  },
  7:{
    easy:[
      {q:"Sūtra for Savarṇa (1.1.9):",opts:["1.2.45","1.1.9 tulyāsyaprayatnam","1.3.1","1.4.10"],ans:1,exp:"Tulyāsyaprayatnaṃ savarṇam — same Sthāna + same Abhyantara Prayatna = Savarṇa."},
      {q:"Guṇa vowels (1.1.2) are:",opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"],ans:1,exp:"अ ए ओ = Guṇa. First-level strengthened vowels."},
      {q:"Vṛddhi vowels (1.1.1) are:",opts:["अ ए ओ","इ ई उ","आ ऐ औ","ए ओ only"],ans:2,exp:"आ ऐ औ = Vṛddhi. Second/higher strengthening. Sūtra 1.1.1 = FIRST sūtra of the Aṣṭādhyāyī."},
      {q:"'उप + इन्द्र = उपेन्द्र' demonstrates:",opts:["Vṛddhi","Guṇa: a+i→e","Lopa","Samprasāraṇa"],ans:1,exp:"a+i=e is Guṇa substitution. ए is the Guṇa vowel at the palatal position."},
      {q:"Tapara rule (1.1.70) restricts a vowel to:",opts:["All 18 variants","Its exact duration only","Long forms only","All savarṇas"],ans:1,exp:"When 'त्' follows a vowel (tapara), it represents ONLY that exact duration. 'अत्' = ONLY short अ."},
    ],
    medium:[
      {q:"महा + ऋषि = महर्षि demonstrates:",opts:["Guṇa only","Uraṇ Rapharaḥ (1.1.51) — ṛ+Guṇa requires insertion of र्","Vṛddhi","Simple vowel drop"],ans:1,exp:"No retroflex Guṇa vowel exists, so r must be inserted: a+ṛ→ar. The r preserves the retroflex quality."},
      {q:"ṛ and ḷ are Savarṇa by special Vārtika despite different Sthānas because:",opts:["Error","Kātyāyana's Vārtika grants them Savarṇa status for grammatical operations — enabling certain sandhi between them","They sound similar","Tradition"],ans:1,exp:"Normally, different Sthāna = not Savarṇa. But Kātyāyana's exception rule treats ṛ (Mūrdhā) and ḷ (Danta) as Savarṇa for specific grammatical contexts."},
      {q:"In 'इको यणचि', which is Vidhimān (target, not expanding to savarṇas)?",opts:["इक्","यण्","अच्","All three"],ans:1,exp:"यण् is the TARGET — it represents EXACTLY य र ल व, not their variants. इक् and अच् are Avidhimān (conditions) that DO expand to all their variants."},
      {q:"Vṛddhi (1.1.1) being the FIRST sūtra signals:",opts:["It is most common","The grammar begins with DEFINITIONS (Saṃjñā) before operations — almost every derivation needs to know 'what is Vṛddhi?' first","It is most beautiful","Tradition"],ans:1,exp:"The Aṣṭādhyāyī's structure: first define the vocabulary of the grammar, then use it for operations. Starting with Vṛddhi/Guṇa definitions (1.1.1-2) before any operational rule is a deliberate organizational choice."},
      {q:"Laghu requires:",opts:["Any vowel","Short (Hrasva) vowel NOT followed by a Saṃyoga cluster — sūtra 1.4.10","A long vowel","A nasal"],ans:1,exp:"Hrasva vowel + no following cluster = Laghu (light). Critical for Sanskrit meter (chandas) where Laghu=1 beat, Guru=2 beats."},
    ],
    hard:[
      {q:"Why is Guṇa defined as specifically अ+ए+ओ (not other vowels)?",opts:["Arbitrary","These represent the PHONETIC MIDPOINTS of the 3 vowel positions: Kaṇṭha(अ), Kaṇṭha+Tālu(ए), Kaṇṭha+Oṣṭha(ओ) — the 'balanced' intermediate strengthened forms","Tradition","Leftover vowels"],ans:1,exp:"Phonetic logic: Guṇa represents the first-level strengthening AT each of the 3 basic vowel positions. अ = Kaṇṭha base. ए = Kaṇṭha+Tālu combination. ओ = Kaṇṭha+Oṣṭha combination. Not arbitrary — phonetic reality."},
      {q:"The 'default-override' system of Savarṇagrāhaka (1.1.69) + Tapara (1.1.70) is:",opts:["Redundant","Elegant: DEFAULT = include all 18 variants (Savarṇagrāhaka). EXCEPTION = restrict to one duration (Tapara). Most rules need broad scope; few need precision — the system optimizes for the common case","Contradictory","Circular"],ans:1,exp:"Information-theoretically optimal design: mark the EXCEPTION (Tapara), not the rule. Since most grammatical references need broad vowel scope, the default is permissive. Only when precision is needed (Tapara) is it marked explicitly."},
      {q:"'Svara' originally meant 'musical note' before 'vowel.' This etymology reveals:",opts:["Coincidence","IDENTITY of vowel and musical note in Sanskrit — Vedic chanting tradition and grammar tradition share the SAME phonetic foundation: Nāda Brahman (sound as cosmic reality)","Unrelated terms","Modern usage change"],ans:1,exp:"Svara = sva (self) + ra (to shine/sound) = self-shining sound. In music = note. In grammar = vowel. The SAME concept expressed at different scales. This is Nāda Brahman: cosmic sound as the substrate of both music and language."},
      {q:"Sanskrit meter (Anuṣṭubh, Gāyatrī etc.) is DIRECTLY built on which grammatical principle?",opts:["Upasarga system","Guru-Laghu distinction (1.4.10-11) — grammar sūtras are the FOUNDATION of Sanskrit poetic meter","Lopa rules","Dhātu classification"],ans:1,exp:"Sanskrit meter is entirely built on the Guru-Laghu system defined by grammar. A short vowel before a Saṃyoga becomes Guru = the phonological basis of ALL Sanskrit poetic rhythm. Pāṇini's grammar IS the basis of Sanskrit poetry. Grammar IS poetry."},
      {q:"Why did Pāṇini define Vṛddhi BEFORE Guṇa (1.1.1 before 1.1.2) when Guṇa is more commonly used?",opts:["Alphabetical order","Vipratiṣedha principle: if both apply, LATER sūtra wins (1.4.2). By placing Guṇa AFTER Vṛddhi, Guṇa rules can OVERRIDE Vṛddhi rules in appropriate contexts — the placement creates the hierarchy","Vṛddhi is more common","Tradition"],ans:1,exp:"A structural masterpiece: the order of DEFINITION determines the order of PRECEDENCE in conflicts. Vṛddhi defined first (1.1.1) = Guṇa defined second (1.1.2) = Guṇa wins in conflicts (later sūtra wins per 1.4.2). The organization of the Saṃjñā section determines operational hierarchy throughout the entire grammar."},
    ]
  },
  8:{
    easy:[
      {q:"In 'पठ्', the Upadhā is:",opts:["प्","ठ्","अ","The whole root"],ans:2,exp:"Upadhā = letter just before the final. In पठ्: final=ठ्, before it = अ = Upadhā."},
      {q:"Saṃyoga means:",opts:["Two vowels together","2+ consonants with NO intervening vowel","A prefix","A sandhi type"],ans:1,exp:"Saṃyoga = consonant cluster: भक्त (क्+त), पुष्प (ष्+प), मत्स्य (त्+स्+य)."},
      {q:"Guṇa of position i/ī is:",opts:["आ","ऐ","ए","ओ"],ans:2,exp:"For palatal position (इ/ई): Guṇa = ए. उप+इन्द्र = उपेन्द्र (a+i→e)."},
      {q:"Vṛddhi of position i/ī is:",opts:["ए","आ","ऐ","औ"],ans:2,exp:"For palatal position (इ/ई): Vṛddhi = ऐ."},
      {q:"Ṭī Saṃjñā refers to:",opts:["First vowel","Final vowel + all following consonants","All vowels","The prefix"],ans:1,exp:"Ṭī = final Ach + all following consonants. In 'मनस्': अ+न्+स् = 'अनस्' is Ṭī."},
    ],
    medium:[
      {q:"Uraṇ Rapharaḥ (1.1.51) inserts 'र्' when:",opts:["Any vowel undergoes Guṇa","ṛ undergoes Guṇa/Vṛddhi — because no retroflex Guṇa vowel exists","Any sandhi occurs","Tradition"],ans:1,exp:"a+ṛ→ar (Guṇa with r-insertion). No 'retroflex e' or 'retroflex o' exists in Sanskrit, so r must be added to preserve the retroflex quality."},
      {q:"Niṣṭhā (1.1.26) suffixes क्त and क्तवतु create:",opts:["New roots","Past passive participle (kta) + past active participle (ktavat)","Compounds","Causatives"],ans:1,exp:"पठ्+क्त = पठित (studied) = past passive participle. पठ्+क्तवतु = पठितवान् (one who studied) = past active participle."},
      {q:"Samprasāraṇa (1.1.45) converts:",opts:["Vowels to consonants","YaN semi-vowels (य व र ल) → corresponding IK vowels (इ उ ṛ ḷ)","Nasals to stops","Long to short"],ans:1,exp:"Reverse of vowel-before-vowel sandhi: y→i, v→u, r→ṛ, l→ḷ. वप्→उप्ते (v becomes u)."},
      {q:"A short vowel before Saṃyoga becomes Guru because:",opts:["No reason","The cluster adds phonetic 'weight' — sūtra 1.4.11 'saṃyoge guru'","It becomes long","Grammar convention"],ans:1,exp:"Consonant clusters take time to articulate — the preceding syllable gets 'two beats' worth of weight, making it Guru. This is the basis of metrical patterns in ALL Sanskrit poetry."},
      {q:"Apṛkta Saṃjñā (1.2.41) — a suffix with only ONE vowel — has what special behavior?",opts:["It is deleted","Does NOT create sandhi at the junction in certain contexts","Stronger than regular suffix","Makes base Guru"],ans:1,exp:"An Apṛkta (single-vowel) suffix is 'unattached' — treated differently from multi-member suffixes in certain sandhi contexts. Its minimal form gives it special grammatical behavior."},
    ],
    hard:[
      {q:"The first sūtra 1.1.1 (Vṛddhirādaic) is simultaneously a Saṃjñā sūtra AND a Paribhāṣā sūtra because:",opts:["It is only Saṃjñā","It NAMES Vṛddhi (Saṃjñā function) AND CONSTRAINS how 'Vṛddhi' is used in all subsequent rules (Paribhāṣā function)","It is only Paribhāṣā","Neither"],ans:1,exp:"Dual function: (1) Names three sounds as 'Vṛddhi' — Saṃjñā. (2) Implies: wherever a rule prescribes Vṛddhi, EXACTLY these three sounds are meant — Paribhāṣā. The first sūtra models the structure of the entire grammar."},
      {q:"Sthānivadbhāva (1.1.56) — treating the Ādeśa as if it were the Sthānī for subsequent rules — is needed because:",opts:["Tradition","Without it, after substitution, all rules referring to the ORIGINAL sound's properties would fail — Sthānivadbhāva maintains grammatical continuity across transformations","Simplification","Pāṇini's preference"],ans:1,exp:"Like replacing a gear: the new gear must fit all the same connectors as the old one. Ādeśa must behave AS IF it were Sthānī for subsequent rules while being itself for the current rule. Without this, the ordered rule system collapses after every substitution."},
      {q:"Why is Upadhā especially important in the Dhātu system?",opts:["Tradition","Upadhā is the ROOT VOWEL 'workbench' — rules targeting the penultimate letter apply Guṇa/Vṛddhi during conjugation: पठ् Upadhā 'अ' stays; लिख् Upadhā 'इ'→Guṇa'ए' in certain forms","Only for nouns","Sandhi rules only"],ans:1,exp:"The Upadhā of most Dhātus is the vowel that undergoes Guṇa/Vṛddhi during conjugation. Knowing the Upadhā is prerequisite for all root-vowel change rules. It is the phonological 'active site' of derivation."},
      {q:"The 'default-override' system in grammar (Savarṇagrāhaka default + Tapara override + Vidhimān exception) is:",opts:["Complex and messy","Optimally designed: most rules need broad scope (default=all variants); specific rules needing precision use Tapara; rules specifying target use Vidhimān — three levels of scope control","Redundant","Arbitrary"],ans:1,exp:"Three-level scope system: Level 1 (default, no marker) = all 18 variants. Level 2 (Tapara marker) = only one duration. Level 3 (Vidhimān context) = restricted to exact sound. Together these three levels provide precise scope control for every vowel reference in every sūtra — without any ambiguity."},
      {q:"The ordered application of Saṃyoga → Guru → Chandas-meter shows that:",opts:["Grammar and poetry are unrelated","Grammar sūtras (1.4.10-11) are the DIRECT FOUNDATION of Sanskrit poetic meter — the entire Anuṣṭubh, Gāyatrī, Triṣṭubh etc. rhythmic systems are built on grammatical definitions of vowel weight","Meter is independent","Coincidence"],ans:1,exp:"Every Sanskrit verse meter is defined by sequences of Guru and Laghu syllables. The definition of Laghu/Guru comes DIRECTLY from grammar sūtras 1.4.10-11. Without Pāṇini's definitions, there would be no formal basis for Sanskrit prosody. Grammar = the foundation of ALL Sanskrit literary art forms."},
    ]
  },
  9:{
    easy:[
      {q:"Sthānī is:",opts:["The new element","The original element being replaced","The trigger","The augment"],ans:1,exp:"Sthānī = original sound that a rule will replace with an Ādeśa (substitute)."},
      {q:"An Āgama is:",opts:["A deletion","A sound ADDED without replacing anything","A substitution","A prefix"],ans:1,exp:"Āgama = 'mitra' (friend). Joins the word without causing any existing element to leave."},
      {q:"Samprasāraṇa: व → ?",opts:["उ","इ","ṛ","ḷ"],ans:0,exp:"Samprasāraṇa: य→इ · व→उ · र→ṛ · ल→ḷ. So वप्→उप्ते."},
      {q:"Niṣṭhā (क्त, क्तवतु) creates:",opts:["New roots","Past participles: पठित (studied), कृतवान् (who did)","Compounds","Causatives"],ans:1,exp:"Kta = past passive participle. Ktavatu = past active participle. Both are Niṣṭhā suffixes."},
      {q:"Dvirbhāva (doubling) occurs when:",opts:["Adding a regular suffix","Applying Liṭ (perfect), San (desiderative), or Yaṅ (intensive) suffixes","Making compounds","Adding Upasargas"],ans:1,exp:"Dvirbhāva = reduplication when these specific suffixes apply: लिख् → लिखलिख्. First copy = Abhyāsa."},
    ],
    medium:[
      {q:"A 'Mit' augment attaches:",opts:["At beginning","At absolute end","After the final vowel (Ach) of the root","Before first consonant"],ans:2,exp:"Mit inserts AFTER the root's final vowel — not at the word-end. vad+num→vand (n after vowel a)."},
      {q:"'Śatruvaḍādeśaḥ' — the Ādeśa is treated as:",opts:["A new word","An 'enemy' occupying the Sthānī's position AND inheriting its properties (Sthānivadbhāva)","A prefix","A suffix"],ans:1,exp:"Like an enemy occupying a throne — the Ādeśa sits in the Sthānī's position AND inherits its grammatical properties for subsequent rules."},
      {q:"In 'यज् → इज्ते', what Samprasāraṇa occurs?",opts:["v→u","y→i","r→ṛ","l→ḷ"],ans:1,exp:"य (y) → इ (i): the semi-vowel at the beginning of यज् converts to vowel इ. Result: इज्+ते = इजते."},
      {q:"The Abhyāsa (first copy in reduplication) is modified by:",opts:["No change","Using only first consonant, shortest vowel, and converting aspirates to unaspirated","Complete identity with original","Only vowel change"],ans:1,exp:"Abhyāsa modifications: take only the first consonant, use the shortest vowel, convert gh→g, bh→b etc. This creates the characteristic 'weak' look of the reduplicated syllable."},
      {q:"Samprasāraṇa operates 'against' normal sandhi because:",opts:["Error","Normal sandhi = vowel BEFORE vowel → semivowel (i→y). Samprasāraṇa = semivowel IN ROOT → vowel. Opposite direction for different reasons","Random","Vedic only"],ans:1,exp:"Normal sandhi is PHONOLOGICAL (triggered by phonetic environment). Samprasāraṇa is MORPHOLOGICAL (triggered by specific suffix contexts). Same sounds, opposite conversion direction, different triggering domains."},
    ],
    hard:[
      {q:"The three augment positions (Tit=beginning, Kit=end, Mit=after-final-vowel) are:",opts:["Random","Exhaustive: they cover ALL logically possible insertion points in a morpheme — left edge, right edge, and vowel nucleus — a complete classification","Vedic tradition","Grammar convention"],ans:1,exp:"Elegant completeness: Tit=left edge expansion, Kit=right edge expansion, Mit=nuclear (vowel-position) insertion. Together they cover every possible augmentation site in any morpheme. No overlap, no gaps."},
      {q:"Why is Sthānivadbhāva (1.1.56) considered one of the most critical Paribhāṣā sūtras?",opts:["It is long","Without it, the grammar breaks: after substitution, all rules referring to the original's properties would fail — Sthānivadbhāva maintains continuity across ALL transformations in the derivational chain","It is in chapter 1","Tradition"],ans:1,exp:"The derivational chain (sūtras applying in sequence) is only possible if each step's output can be processed by subsequent rules. Sthānivadbhāva ensures this: the Ādeśa inherits the Sthānī's properties, allowing the chain to continue. Without this, every substitution would be a dead-end."},
      {q:"The ordered sequence Dvirbhāva → Abhyāsa-modification → junction-Sandhi for Liṭ (perfect) forms demonstrates:",opts:["Simple forms","Krama (ordered sequence): the grammar operates in distinct stages, each receiving the previous stage's output — a computational pipeline designed 2500 years ago","Random application","Vedic variant"],ans:1,exp:"Stage 1: Dvirbhāva creates bhu+bhu. Stage 2: Abhyāsa rules modify first copy to bu+bhū. Stage 3: Sandhi rules clean junctions. Stage 4: Accent rules apply. Each stage feeds the next — exactly like a computational pipeline. Pāṇini designed algorithmic grammar."},
      {q:"Pāṇini's grammar is called 'generative' (not just descriptive) because:",opts:["It is large","It uses rules (not lists) to GENERATE correct forms — 1930 roots × 22 upasargas × 12 sanādyanta suffixes × 10 tenses = essentially infinite word forms from finite rules","It describes Vedic","Historical convention"],ans:1,exp:"The grammar's power: finite input (roots + rules) → infinite output (all possible Sanskrit words). This is generative grammar — the same concept Chomsky formalized in 1957 AD, which Indian grammarians achieved around 500 BC. Pāṇini's grammar is one of humanity's great intellectual achievements."},
      {q:"The 'Krama' (ordered rule application) in the Aṣṭādhyāyī is analogous to which modern concept?",opts:["A dictionary","A computer program — rules applied in sequence, each receiving the output of the previous, operating on a representation that evolves through each transformation","A word list","A translation system"],ans:1,exp:"Paninian grammar IS a program. It takes a semantic intent (what you want to say), applies ordered rules (morphology, sandhi, etc.), and outputs a phonetically correct Sanskrit word. The Pāṇinian model anticipated modern formal language theory and computational linguistics by 2500 years."},
    ]
  },
  10:{
    easy:[
      {q:"How many Upasargas are there?",opts:["10","14","22","42"],ans:2,exp:"22 Prādi particles: Pra·Para·Apa·Sam·Anu·Ava·Niṣ·Nir·Dus·Dur·Vi·Ā·Ni·Adhi·Api·Ati·Su·Ut·Abhi·Prati·Pari·Upa."},
      {q:"'प्र + हरति = प्रहार' means:",opts:["Gift","Attack/strike","Wander","Destroy"],ans:1,exp:"Pra = forward/toward. Pra+harati = Prahāra = to strike forward."},
      {q:"Parādi particles become Upasargas ONLY when:",opts:["Standing alone","Joined to a verb (Kriyāyoge) — 1.4.59","Before a noun","After a vowel"],ans:1,exp:"Upasargāḥ kriyāyoge (1.4.59). Standing alone = Nipāta. With verb = Upasarga."},
      {q:"'वि + हरति = विहार' means:",opts:["Attack","Destroy","Roam/wander","Gift"],ans:2,exp:"Vi = apart/spread. Vihāra = to roam/wander. Same root 'har', different prefix = completely different meaning."},
      {q:"Saṃhitā (1.4.109) is:",opts:["A suffix","Extreme proximity of sounds — prerequisite for all sandhi rules","Doubling a root","A deletion"],ans:1,exp:"Paraḥ sannikarṣaḥ = extreme proximity. Without Saṃhitā condition, no sandhi rule applies."},
    ],
    medium:[
      {q:"'उप + हार = उपहार' (gift) — 'उप' creates this meaning because:",opts:["Random","Upa = near/toward — 'bringing something near to someone' = offering/gift","Grammar rule","Tradition only"],ans:1,exp:"Upa- = proximity, nearness, sub-quality. Bringing near = offering = gift. Spatial metaphor of the prefix creates semantic shift."},
      {q:"Avasāna Saṃjñā (1.4.110) exists so that grammar can:",opts:["Name silence","REFER TO 'end of utterance' as a phonological context in rules — e.g. 'at Avasāna, do X'","Make pauses formal","Tradition"],ans:1,exp:"Without the Avasāna Saṃjñā, no sūtra could reference 'when the speaker stops speaking' as a phonological environment. Grammar needs to name this context to apply certain rules (like final consonant changes at utterance-end)."},
      {q:"'Sam + hara = Saṃhāra' (destruction) — 'sam' creates this because:",opts:["Random","Sam = completely/together — to take away COMPLETELY = destruction","Grammar rule","Tradition"],ans:1,exp:"Sam- = completeness, totality. Saṃhāra = completely gathered/removed = destruction. The same sam- in Sanskrit = perfectly constructed. Intensity of 'completeness' creates opposite meanings with different roots."},
      {q:"Nipāta (= Parādi when alone) comes from:",opts:["Random","Ni+pata = 'that which falls/attaches' — unchanging particles that attach without internal modification","Vedic tradition","Grammar convention"],ans:1,exp:"Nipāta = that which falls/attaches. These particles are morphologically invariant — unlike roots and stems, they don't take endings. Their invariance = 'they don't change however they fall.'"},
      {q:"Āmreḍita (doubled words) serve which semantic functions?",opts:["Just emphasis","Emphasis + distributive sense ('each and every') + Vedic repetition + variety ('different kinds')","Only Vedic","Random repetition"],ans:1,exp:"Āmreḍita functions: (1) emphasis/intensity — again and again; (2) distributive — each; (3) variety — different kinds; (4) Vedic hymn repetition. The grammar captures all these meanings under one technical name."},
    ],
    hard:[
      {q:"Why does 'pra' create different meanings in pra-vṛtti, pra-vāha, praṇāma, prabhu?",opts:["Random","'Pra' CONSISTENTLY means forward/forth/preeminent — specific meaning from COMBINING this with different roots: vṛt(turn)=engagement, vah(flow)=stream, nam(bow)=respectful bow, bhū(be)=powerful","Grammar tradition","No logic"],ans:1,exp:"Pāṇini's insight: Upasargas provide directional/qualitative modifiers; roots provide base actions. The COMBINATION creates meaning. 'Pra' = forward applied to: turning(vṛt)=engagement, flowing(vah)=stream, bowing(nam)=bow, being(bhū)=powerful/lord."},
      {q:"The same 22 particles becoming 'Gati Saṃjñā' (not Upasarga) before nouns shows:",opts:["Error","The SAME sound has DIFFERENT grammatical identity in different syntactic contexts — Pāṇini's system recognizes context-dependence of grammatical categories","They are prepositions","Grammar tradition"],ans:1,exp:"Prādi+verb = Upasarga (1.4.59). Prādi+noun = Gati Saṃjñā (1.4.60-68). Different rules, different behavior. Pāṇini formally recognizes that grammatical identity is not inherent in the sound but determined by syntactic context."},
      {q:"22 Upasargas × 1930 roots = 42,460+ possible verbal compounds. This shows Pāṇini's grammar is:",opts:["Just descriptive (it lists existing words)","GENERATIVE — rules produce infinite new words from finite inputs. Pāṇini built a word-generation engine, not a dictionary","Incomplete","Only for Vedic"],ans:1,exp:"This is the core of generative grammar: finite rules × finite inputs → infinite outputs. 22×1930 = 42,460 base compounds, but add Sanādyanta suffixes (12 types), tense/mood markers (10), person/number (9) = essentially unlimited productive capacity. Grammar IS productivity."},
      {q:"Why does Upasarga+Verb form a SINGLE lexical unit (not Upasarga + separate Verb)?",opts:["Tradition","In Sanskrit, Upasargas modify the verb's MEANING at the lexical level (creating a new word), not the syntactic level (modifying a VP) — unlike English prepositions which are phrasal","Grammar convenience","Vedic practice"],ans:1,exp:"English: 'break up' = break + up (phrasal verb, up modifies syntactically). Sanskrit: pra+bhū = prabhu (a NEW WORD meaning 'lord'). The semantic fusion is complete at the lexical level. This is why the Saṃjñā 'Upasarga' activates only with Kriyāyoga — it's a word-formation, not a phrase-formation, process."},
      {q:"The Upasarga system proves that Sanskrit vocabulary is:",opts:["Fixed and finite (dictionary-based)","INFINITELY PRODUCTIVE: any of 22 prefixes × 1930 roots × multiple suffix types = words that were never 'listed' but are immediately recognizable and correct to a trained speaker","Mostly Vedic","Limited to classical texts"],ans:1,exp:"A trained Sanskrit speaker can immediately understand 'prati-vi-sam-harati' (completely re-opposes) even if they've never encountered that exact form — because the prefix meanings are systematic and additive. The grammar generates understanding, not just recognition. This is the deep power of Pāṇini's system."},
    ]
  },
  11:{
    easy:[
      {q:"Lopa (1.1.60) means:",opts:["Adding a sound","Non-perception — invisible but theoretically present","Doubling","A prefix"],ans:1,exp:"Adarśanaṃ lopaḥ = non-visibility. The element is NOT destroyed — merely rendered invisible."},
      {q:"Bahulam provides:",opts:["Binary (yes/no)","4 modes: applies/doesn't/optional/different result","Triple modes","Unlimited"],ans:1,exp:"Four-fold Vedic flexibility: ① applies ② doesn't apply ③ optional ④ produces different result."},
      {q:"'Anyatarasyām', 'Vā', 'Vibhāṣā' all indicate:",opts:["Mandatory rule","Optionality","Deletion","Augment"],ans:1,exp:"All three = optional application, with nuances in scope."},
      {q:"Luk is for which verbal context?",opts:["Taddhita","Adādi class (Group 2) where Śap undergoes Luk deletion","Nominals","Vedic only"],ans:1,exp:"Luk deletes Śap in Adādi class. Unlike Lopa, Luk signals specific subsequent stem operations."},
      {q:"How do Luk, Ślu, Lup differ?",opts:["Pronunciation","Each signals DIFFERENT subsequent grammatical behaviors after deletion","Different languages","Volume deleted"],ans:1,exp:"All three delete a suffix, but each SIGNALS different downstream behaviors: Luk (adādi stem changes), Ślu (Juhoty-ādi reduplication), Lup (taddhita 'ghost' effect on gender)."},
    ],
    medium:[
      {q:"Patañjali's 'nāsto lopaḥ' means:",opts:["Error","Lopa ≠ non-existence. The deleted element continues logically in the grammar — it can be revived by Sthānivadbhāva","Tradition","Contradiction"],ans:1,exp:"Profound insight: Lopa = conceptual invisibility, NOT ontological destruction. The element persists as a theoretical entity. This enables Sthānivadbhāva to 'revive' deleted elements for subsequent rules."},
      {q:"Lup differs from Lopa in taddhita context because:",opts:["No difference","With Lup, the suffix is deleted but its PRESENCE IS FELT for gender assignment — a 'ghost' effect on morphology","Lup is louder","Lup only for nouns"],ans:1,exp:"'औपगव' — taddhita suffix undergoes Lup, but word takes masculine gender AS IF the suffix were present. The Lup-deleted suffix continues influencing morphology from beyond its 'deletion.'"},
      {q:"'Kvacit pravṛttiḥ, kvacit apravṛttiḥ, kvacit vibhāṣā, kvacid anyadeva' describes:",opts:["Normal rules","Bahulam's four-fold behavior for Vedic diversity","Lopa types","Upasarga behavior"],ans:1,exp:"Bahulam's 4 modes: sometimes applies, sometimes doesn't, sometimes optional, sometimes produces entirely different result. Handles ALL Vedic irregularities with one meta-principle."},
      {q:"Pāṇini handles ALL Vedic irregularities using three principles — which are they?",opts:["List every exception","Chandasi markers + Bahulam + 'chandasi dṛṣṭānuvidhiḥ' (follow observed usage)","Ignore Vedic","Separate Vedic grammar"],ans:1,exp:"Three principles cover all Vedic exceptions: (1) Chandasi marker = 'Vedic exception zone.' (2) Bahulam = 4-fold flexibility within that zone. (3) 'Follow observed usage' = catch-all for unlisted forms. No separate Vedic grammar needed."},
      {q:"'Vibhāṣā' (optionality) in grammar encodes:",opts:["Grammar incompleteness","DIALECT AND REGISTER VARIATION — both optional forms are CORRECT, reflecting that Sanskrit was spoken differently across regions, times, and contexts","Grammar errors","Old vs. new Sanskrit"],ans:1,exp:"Free variation (Vibhāṣā) shows the grammar is DESCRIPTIVE of real usage, not artificially prescriptive. Pāṇini records that both forms coexist correctly — a linguistically sophisticated position that acknowledges the natural variation of any living language."},
    ],
    hard:[
      {q:"Why THREE specific deletion terms (Luk, Ślu, Lup) rather than just one (Lopa)?",opts:["Tradition","Each is a CODED SIGNAL telling subsequent rules HOW to behave: Luk=adādi-stem-changes-apply, Ślu=reduplication-occurs, Lup=gender-felt. Three codes, three different downstream cascades","Redundancy","Historical evolution"],ans:1,exp:"Information encoding in grammar: Lopa says 'something deleted.' Luk says 'deleted + adādi-operations-still-apply.' Ślu says 'deleted + reduplication-occurs.' Lup says 'deleted + still-felt-for-gender.' Three tokens, three behavioral triggers — elegant and economical."},
      {q:"'Lopa as non-existence without non-being' (Patañjali's formulation) anticipates which modern linguistic concept?",opts:["String theory","Zero morpheme / null allomorph — a theoretically present but phonetically null grammatical element, a cornerstone of 20th-century structural linguistics","Quantum mechanics","Programming"],ans:1,exp:"Patañjali's Lopa = exactly the 'zero morpheme' or 'null allomorph' of modern morphology. The element is present in UNDERLYING REPRESENTATION but has zero phonological realization. Patañjali formulated this insight ~200 BCE — European linguists rediscovered it in the 1900s CE."},
      {q:"The cyclic, ordered nature of deletion rules shows that Sanskrit grammar is:",opts:["Simple sequential","Cyclic and derivationally ordered: It-deletion (Lopa) → Vikaraṇa-deletion (Luk/Ślu/Lup) → stem-modifications → Sandhi — each stage creating input for the next","Random","Only linear"],ans:1,exp:"Derivational cycles: Stage 1 (Lop It-markers) creates base forms → Stage 2 (Luk/Ślu/Lup vikaraṇas) signals class-specific operations → Stage 3 (stem changes) → Stage 4 (Sandhi). Each deletion triggers a new cycle. This is cyclic grammar theory realized 2500 years ago."},
      {q:"'Anupradata' — transfer of prosodic features (accent/length) when a sound is deleted — is crucial for:",opts:["Nothing important","Preserving the METRICAL INTEGRITY of Vedic hymns: when a sound is deleted, its accent transfers to the neighboring sound — without this, Lopa would destroy Vedic meter","Casual speech","Grammar decoration"],ans:1,exp:"Vedic hymns are metrically strict. If deletion (Lopa) simply removed a sound without transferring its accent, the meter would be destroyed. Anupradata ensures metrical continuity — showing that Pāṇini's grammar preserves not just morphology but the musical structure of the sacred Vedic tradition."},
      {q:"The system Lopa → Sthānivadbhāva → ordered rule application creates what modern linguists call:",opts:["Simple grammar","Derivational Morphology with Cyclicity — a derivational sequence where each rule applies to the output of previous rules, with deleted elements leaving 'traces' that influence subsequent rules","Word lists","Random changes"],ans:1,exp:"Modern linguistics: Derivational Morphology + Cyclic Rule Application + Trace Theory (deleted elements leave traces affecting subsequent rules). All of these are present in Pāṇini's system. The Aṣṭādhyāyī is a fully worked-out theory of derivational morphology — 2500 years before modern linguistics."},
    ]
  },
  12:{
    easy:[
      {q:"Total sūtras in Aṣṭādhyāyī:",opts:["1000","2000","3,978","5000"],ans:2,exp:"3,978 sūtras in 8 Adhyāyas × 4 Pādas = 32 Pādas total."},
      {q:"Anuvṛtti is:",opts:["Repeating every word","Carrying words forward from earlier sūtras to avoid repetition","Adding suffixes","Deleting sounds"],ans:1,exp:"State once → flows into next several sūtras. Pāṇini's most powerful economy tool."},
      {q:"'Ardhamātrālāghavena…' celebrates:",opts:["Grammar difficulty","Saving even half a syllable = joy of a son's birth","Vedic texts","Suffix importance"],ans:1,exp:"The supreme Laghava (brevity) principle — every technique in the Aṣṭādhyāyī serves this one goal."},
      {q:"Vipratiṣedhe paraṃ kāryam (1.4.2):",opts:["Earlier rule wins","Later rule wins in equal conflict","Both apply","Neither applies"],ans:1,exp:"Para (later) sūtra wins when two equal-authority sūtras conflict."},
      {q:"An Adhikāra sūtra is:",opts:["A naming rule","A governing rule dominating all following rules in its section","A deletion rule","An optional rule"],ans:1,exp:"Adhikāra = governing rule. Once stated, it dominates until another Adhikāra appears. Example: 'Aṅgasya' (6.4.1) governs hundreds of rules."},
    ],
    medium:[
      {q:"Why do Paribhāṣā sūtras ('rules about rules') exist?",opts:["Redundancy","Without meta-rules, operational rules would be ambiguous — Paribhāṣā defines HOW to interpret all other sūtras","Tradition","Decoration"],ans:1,exp:"Paribhāṣā = interpretive framework. Tapara (1.1.70) doesn't do anything itself — it CONTROLS how all other vowel-mentioning rules work. Without this meta-layer, every vowel rule would need its own scope specification."},
      {q:"Adhyāhāra (ellipsis supply) means:",opts:["An augment","Supplying an implied word (bhavati) to complete an elliptical sūtra","A deletion","A governing rule"],ans:1,exp:"Pāṇini omits 'bhavati' from sūtras expecting readers to supply it. This saves syllables while making the grammar appear condensed. Another economy technique."},
      {q:"The 'bouquet of flowers' analogy means the Aṣṭādhyāyī is:",opts:["Beautiful","Modular — clusters of related rules (Prakaraṇas) that can be studied independently","Complex","Fragrant"],ans:1,exp:"NOT a linear monolith — thematic clusters (Sandhi rules, Kṛt rules, Taddhita rules etc.) that are semi-independent modules. Each 'flower' (cluster) can be 'picked' and studied alone."},
      {q:"Pūrvasiddha (8.2.1) in the Tripādī reverses Vipratiṣedha because:",opts:["Error","Tripādī rules operate at the phonological SURFACE level, where all earlier morphological operations (chapters 1-6) must already be complete — temporal ordering requires earlier-comes-first in this section","Grammar error","Complexity"],ans:1,exp:"The Aṣṭādhyāyī's structure: chapters 1-6 = morphological formation (inside the word). Chapters 7-8 (Tripādī) = phonological surface operations. For surface rules to work, all deep structure operations must be 'done' — hence Pūrvasiddha reverses the normal Para-wins principle."},
      {q:"7 types of sūtras in the Aṣṭādhyāyī:",opts:["3","5","7","9"],ans:2,exp:"①Saṃjñā(naming) ②Paribhāṣā(meta) ③Vidhi(operational) ④Niyama(restricting) ⑤Adhikāra(governing) ⑥Atideśa(superimposition) ⑦Niṣedha(prohibition)."},
    ],
    hard:[
      {q:"Why is the Tripādī governed by Pūrvasiddha (not normal Vipratiṣedha)?",opts:["Tradition","Chapters 1-6 create morphological structure (deep). Chapters 7-8 apply to phonological surface (shallow). DEEP must be complete before SHALLOW applies — Pūrvasiddha enforces this derivational order","Grammar error","Complexity"],ans:1,exp:"This is ordered derivations theory: morphological processes (chapters 1-6) must be complete before phonological surface-level rules (Tripādī) apply. The reversal of conflict resolution principle enforces this ordering constraint. The grammar's overall structure MIRRORS the derivational sequence."},
      {q:"Patañjali's 'atha śabdānuśāsanam' — 'now begins the discipline of words' — signals:",opts:["A title","'Atha' in Indian śāstra = 'now begins [what you have been prepared for].' Grammar continues from Vedic tradition — śabdānuśāsana = dharmic governance of words, implying that correct speech has moral and spiritual dimensions","Random word","Traditional greeting"],ans:1,exp:"'Atha' = beginning-after-prerequisites. The entire Vedāṅga tradition (Prātiśākhyas, Śikṣā, Nirukta) PRECEDED the Aṣṭādhyāyī — it is their culmination, not their start. And 'anuśāsana' = dharmic discipline/governance. Grammar is a moral enterprise in Indian tradition."},
      {q:"The Sūtra-Vārtika-Bhāṣya tradition (Pāṇini-Kātyāyana-Patañjali) models:",opts:["Simple commentary","A self-correcting, expanding knowledge system: Sūtra(compressed, ambiguous) → Vārtika(fills gaps, adds exceptions) → Bhāṣya(philosophical treatment, examples, reconciliation). Three-tier cumulative refinement over centuries","Repetition","Simplification"],ans:1,exp:"This three-tier model is the gold standard of Indian intellectual tradition: (1) Sūtra = dense, needs interpretation. (2) Vārtika = 'what is said' — fills gaps. (3) Bhāṣya = 'what is illuminated' — full philosophical treatment. The system remained productively active for 2000+ years, with each generation adding refinement without discarding earlier work."},
      {q:"'Ekā api mātrā rakṣyate' (Vedic) and 'ardhamātrālāghavena' (Pāṇini) express the SAME principle from:",opts:["Different perspectives with no connection","OPPOSITE ANGLES of the SAME TRUTH: Vedic = preserve every mātrā in recitation (nothing may be lost); Pāṇini = use the minimum mātrās in description (nothing may be wasted). Both treat phonological units as infinitely precious","Historical coincidence","Unrelated contexts"],ans:1,exp:"The unity: Vedic recitation culture = 'protect every mātrā — the sound is sacred.' Pāṇini = 'use no extra mātrā — economy is perfection.' Both flow from the same Vedic understanding that sound (śabda) is Brahman — and therefore every unit of sound deserves infinite respect, whether in preservation or in description."},
      {q:"Pāṇini's use of Anuvṛtti creates what modern computer scientists call:",opts:["A database","'Context-free grammar with persistent context' — individual sūtras look context-free but carry inherited context (state variables) from earlier sūtras, creating a hybrid of maximum expressiveness with minimum text","A word processor","A translation system"],ans:1,exp:"This is exactly the insight: pure context-free grammars are powerful but require much text. Pure context-sensitive grammars are more powerful but unwieldy. Pāṇini's Anuvṛtti = persistent state variables (context from previous sūtras) combined with compact individual rules (context-free appearance). This hybrid achieves maximum expressiveness at minimum text cost — the Aṣṭādhyāyī as the world's first formal programming language."},
    ]
  },
};

/* ── CHAPTERS (compact but complete) ──────────────────────────────────────── */
const CAT_C={grammar:T.green,phonetics:T.blue,varga:T.orange,special:T.purple,core:T.saffron,
  sutra:T.gold,pratyahara:T.teal,articulation:"#8B5E3C",sthana:"#9B6B30",effort:"#607080",
  duration:T.teal,tone:"#7B50A0",nasality:T.pink,samjna:T.gold,meter:"#3A8050",
  position:T.blue,operation:T.saffron,agama:T.green,upasarga:T.orange,morphology:T.purple,
  process:T.blue,architecture:T.slate,vedic:T.purple,philosophy:T.textMid,history:"#8B5A30",
  rule:T.olive,precision:T.saffron,shorthand:T.teal,theory:T.slate,method:T.teal,
  classification:T.orange,conflict:T.saffron,sutratype:T.gold,optionality:T.green,
};
const CHAPTERS=[
  {id:1,num:"§1-2",title:"Dhātu & Pratipadika",subtitle:"Verbal Roots & Nominal Stems",icon:"🌱",color:T.green,accent:"#EDF5EF",
   concepts:[
    {term:"धातु (Dhātu)",meaning:"Words denoting action. Sūtra 1.3.1: भुवादयो धातवः",example:"भू·पठ्·लिख्·गम्·हस्·रुद्",cat:"grammar",sutra:"1.3.1"},
    {term:"औपदेशिक धातु",meaning:"1,930 original roots in Dhātupāṭha, 10 Gaṇas. 'Taught by Pāṇini himself'",example:"भ्वादि(1)·अदादि(2)·तुदादि(6)·चुरादि(10)",cat:"grammar",sutra:""},
    {term:"सनाद्यन्त धातु (3.1.32)",meaning:"Derivative roots via 12 suffixes: सन्·यङ्·णिच् etc.",example:"पठ्+सन्=पिपठिषति · भू+णिच्=भावयति",cat:"grammar",sutra:"3.1.32"},
    {term:"प्रातिपदिक (1.2.45)",meaning:"Meaningful words — neither root nor suffix",example:"पुस्तक·घर·गाय·कृष्ण·राम",cat:"grammar",sutra:"1.2.45"},
    {term:"कृत्तद्धितसमासाश्च (1.2.46)",meaning:"Extension: Kṛdanta+Taddhitānta+Samāsa are also Pratipadika",example:"पठित(kṛdanta) · पाठक(taddhita) · राजपुरुष(samāsa)",cat:"grammar",sutra:"1.2.46"},
    {term:"त्रिमुनि",meaning:"Three foundational sages of Sanskrit grammar",example:"पाणिनि(Sūtras)·कात्यायन(Vārttikas)·पतञ्जलि(Mahābhāṣya)",cat:"history",sutra:""},
    {term:"10 गण (Gaṇas)",meaning:"10 root-classes, each with a class-marker (vikaraṇa)",example:"1=शप् · 2=Ø(Luk) · 3=श्लु · 4=श्यन् · 6=श · 10=णिच्",cat:"grammar",sutra:""},
    {term:"पञ्चाङ्ग व्याकरण",meaning:"5 parts for complete word-derivation (Siddhi)",example:"①सूत्रपाठ ②धातुपाठ ③गणपाठ ④उणादिपाठ ⑤लिङ्गानुशासन",cat:"history",sutra:""},
   ],
   quiz:[
    {q:"How many Dhātus in Pāṇini's Dhātupāṭha?",opts:["500","1,930","3,978","42"],ans:1,exp:"1,930 Aupadeshika Dhātus in 10 Gaṇas."},
    {q:"Which sūtra defines Dhātu?",opts:["1.2.45","1.3.1","3.1.32","1.1.1"],ans:1,exp:"Bhuvādayo dhātavaḥ (1.3.1) — the foundational naming sūtra."},
    {q:"'Kṛttaddhitasamāsāśca' (1.2.46) adds to Pratipadika:",opts:["All words","Kṛdanta+Taddhitānta+Samāsa","Only nouns","Only compounds"],ans:1,exp:"1.2.46 extends 1.2.45 via Anuvṛtti to include all three derived categories."},
    {q:"Curādi Gaṇa (Group 10) vikaraṇa is:",opts:["शप्","श्ना","णिच्","उ"],ans:2,exp:"Curādi uses णिच् — all causative verbs belong here: चोरयति, पाठयति."},
   ]},
  {id:2,num:"§3-8",title:"Varṇamātrikā",subtitle:"9 Vowels · 33 Consonants · 5 Groups",icon:"🔤",color:T.blue,accent:"#EBF1F8",
   concepts:[
    {term:"स्वर (Svara/Ach)",meaning:"9 independent vowels. 'स्वयं राजन्ते स्वराः' — self-luminous, need no support",example:"अ  इ  उ  ऋ  ऌ  ए  ओ  ऐ  औ",cat:"phonetics",sutra:""},
    {term:"व्यञ्जन (Hal)",meaning:"33 consonants. 'अन्यग् भवति' — manifests only with vowel support",example:"25 sparśa + 4 antaḥstha + 4 ūṣma = 33",cat:"phonetics",sutra:""},
    {term:"5 वर्ग",meaning:"25 stops in 5 groups. Pattern per group: unvoiced·aspirated-UV·voiced·aspirated-V·nasal",example:"क-वर्ग:क ख ग घ ङ · च-वर्ग:च छ ज झ ञ · ट-वर्ग:ट ठ ड ढ ण · त-वर्ग:त थ द ध न · प-वर्ग:प फ ब भ म",cat:"varga",sutra:""},
    {term:"उदित् — कु चु टु तु पु",meaning:"Varga shorthand. 'उ'=It-marker → deleted. कु = entire Kavarga",example:"कु=क ख ग घ ङ · टु=ट ठ ड ढ ण · पु=प फ ब भ म",cat:"shorthand",sutra:""},
    {term:"अन्तःस्थ (Yaṇ)",meaning:"4 semi-vowels — between vowels and consonants in nature",example:"य  र  ल  व  (=Yaṇ pratyāhāra)",cat:"phonetics",sutra:""},
    {term:"ऊष्म (Śal)",meaning:"4 sibilants+aspirate — friction/heat sounds",example:"श  ष  स  ह  (=Śal pratyāhāra)",cat:"phonetics",sutra:""},
   ],
   quiz:[
    {q:"How many Svaras?",opts:["7","9","11","33"],ans:1,exp:"9: अ इ उ ऋ ऌ ए ओ ऐ औ."},
    {q:"Why Svaras placed first in Varṇamātrikā?",opts:["Convention","Pradhāna—self-sufficient, independent","They are shorter","Random"],ans:1,exp:"Svayam rājante — independent precedes dependent. Philosophy encoded in phonetics."},
    {q:"Total Vyañjanas (consonants):",opts:["25","29","33","42"],ans:2,exp:"25 Sparśa+4 Antaḥstha+4 Ūṣma = 33."},
    {q:"'Udit' names (Ku, Cu…) represent:",opts:["One consonant","The entire 5-letter Varga","A vowel","A prefix"],ans:1,exp:"'उ' = It-marker → signals 'entire group of 5.'"},
   ]},
  {id:3,num:"§12-18",title:"Āyogavāha & Anupūrvī",subtitle:"8 Special Sounds · Letter-naming · Sequential Order",icon:"✨",color:T.purple,accent:"#F3EEF7",
   concepts:[
    {term:"अयोगवाह (8)",meaning:"Sounds NOT in Māheśvara Sūtras but essential — 'travel with' other sounds",example:"अनुस्वार·विसर्ग·जिह्वामूलीय·उपध्मानीय·4 यम",cat:"special",sutra:""},
    {term:"अनुस्वार (ṃ)",meaning:"Nasal dot above. Sthāna=Nāsikā. In both Ac AND Śar pratyāhāras",example:"रामं · श्यामं · ग्रामं · वनम्",cat:"special",sutra:""},
    {term:"विसर्ग (ḥ)",meaning:"Breath-release (two dots). Primary Sthāna=Kaṇṭha",example:"रामः · श्यामः · ग्रामः",cat:"special",sutra:""},
    {term:"जिह्वामूलीय",meaning:"Half-visarga before Ka (क) or Kha (ख)",example:"बालकः क्रीडति → बालक˟क्रीडति",cat:"special",sutra:""},
    {term:"उपध्मानीय",meaning:"Half-visarga before Pa (प) or Pha (फ)",example:"वृक्षः पतति → वृक्ष˟पतति",cat:"special",sutra:""},
    {term:"4 यम (Vedic Yamas)",meaning:"Nasalized sounds in Vedic between non-nasal and nasal of the SAME Varga",example:"'अग्निः': between ग् and न = yama sound",cat:"vedic",sutra:""},
    {term:"कार प्रत्यय (3.3.108)",meaning:"'कार' suffix names a letter — prevents letter/name confusion",example:"अ→अकार · म→मकार · र→रेफ",cat:"method",sutra:"3.3.108"},
    {term:"आनुपूर्वी",meaning:"Sequential spoken order — independent of visual script",example:"'राम' = रेफ+आकार+मकार+अकार",cat:"method",sutra:""},
   ],
   quiz:[
    {q:"Anusvāra (ṃ) is:",opts:["Two dots (:)","Dot above","A tilde","Half-letter"],ans:1,exp:"Dot ABOVE creating nasal resonance: रामं."},
    {q:"To name letter 'म' say:",opts:["म alone","मकार","मं","मः"],ans:1,exp:"Kāra suffix: मकार. Avoids letter/name confusion."},
    {q:"Anupūrvī means:",opts:["Random order","Sequential SPOKEN order","Alphabetical","Reverse"],ans:1,exp:"Temporal sequence as sounds leave the mouth — not as script arranges them."},
    {q:"Total Āyogavāhas:",opts:["4","6","8","12"],ans:2,exp:"8: Anusvāra+Visarga+Jihvāmūlīya+Upadhmanīya+4 Yamas."},
   ]},
  {id:4,num:"§19-21",title:"Māheśvara Sūtras & Pratyāhāras",subtitle:"14 Drum-Formulas · 42 Abbreviations",icon:"🥁",color:T.saffron,accent:"#FCF0EE",
   concepts:[
    {term:"14 माहेश्वर सूत्र",meaning:"Sound-strings from Shiva's ḍamaru. Purpose = create Pratyāhāras",example:"①अ इ उ ण् ②ऋ ऌ क् ③ए ओ ङ् ④ऐ औ च् ⑤ह य व र ट् ⑥ल ण् ⑦ञ म ङ ण न म् ⑧झ भ ञ् ⑨घ ढ ध ष् ⑩ज ब ग ड द श् ⑪ख फ छ ठ थ च ट त व् ⑫क प य् ⑬श ष स र् ⑭ह ल्",cat:"core",sutra:""},
    {term:"इत् संज्ञा (1.3.3+1.3.9)",meaning:"Final consonant of each sūtra = marker. Named by हलन्त्यम्, deleted by तस्य लोपः",example:"'अ इ उ ण्' → ण् is It-marker",cat:"core",sutra:"1.3.3"},
    {term:"प्रत्याहार (1.1.71)",meaning:"Ādi(start) + Antya-It(end marker) = all sounds between. Sūtra: आदिरन्त्येन सहेता",example:"अ+च् = अच् (9 vowels) · ह+ल् = हल् (33 consonants)",cat:"core",sutra:"1.1.71"},
    {term:"42 प्रत्याहार",meaning:"~42 standard abbreviations. One It → multiple Pratyāhāras with different Ādi",example:"From क् (sūtra 2): अक्·इक्·उक् — three Pratyāhāras",cat:"pratyahara",sutra:""},
    {term:"Key Pratyāhāras",meaning:"Most used abbreviations in the Aṣṭādhyāyī",example:"अच्=9 vowels · हल्=33 consonants · इक्=इउऋऌ · यण्=यरलव · शर्=शषस · अट्=vowels+हयवर",cat:"pratyahara",sutra:""},
   ],
   quiz:[
    {q:"How many Māheśvara Sūtras?",opts:["9","12","14","42"],ans:2,exp:"14 from Shiva's 14-beat ḍamaru."},
    {q:"'अच्' includes:",opts:["All consonants","All 9 vowels","Short vowels only","Semi-vowels"],ans:1,exp:"अ(sūtra 1)+च्(sūtra 4 It) = all 9 vowels between."},
    {q:"An It-marker is:",opts:["Vowel in words","Coding marker, then deleted","A prefix","Compound vowel"],ans:1,exp:"Named by 1.3.3, deleted by 1.3.9. Temporary coding device."},
    {q:"How many standard Pratyāhāras?",opts:["14","22","33","42"],ans:3,exp:"42 standard Pratyāhāras from the 14 sūtras."},
   ]},
  {id:5,num:"§22-23",title:"Sthāna & Karaṇa",subtitle:"8 Places · Tongue Instrument · Articulation",icon:"👄",color:T.orange,accent:"#FAF0E8",
   concepts:[
    {term:"8 स्थान",meaning:"8 vocal-tract locations: Uras·Kaṇṭha·Śiras·Jihvāmūla·Tālu·Mūrdhā·Danta·Oṣṭha+Nāsikā",example:"Sūtra: अकुहविसर्जनीयानां कण्ठः (Pāṇinīya Śikṣā 13)",cat:"sthana",sutra:"Śikṣā"},
    {term:"कण्ठ",meaning:"अ, Kavarga, ह, Visarga — guttural sounds from throat",example:"क ख ग घ ङ ह :",cat:"sthana",sutra:""},
    {term:"तालु",meaning:"इ/ई, Chavarga, य, श, ए, ऐ — palatal sounds",example:"च छ ज झ ञ य श",cat:"sthana",sutra:""},
    {term:"मूर्धा",meaning:"ऋ/ॠ, Ṭavarga, र, ष — retroflex/cerebral sounds",example:"ट ठ ड ढ ण र ष",cat:"sthana",sutra:""},
    {term:"दन्त",meaning:"ḷ, Tavarga, ल, स — dental sounds",example:"त थ द ध न ल स",cat:"sthana",sutra:""},
    {term:"ओष्ठ",meaning:"उ/ऊ, Pavarga, ओ, औ · व = Dantauṣṭha (teeth+lips)",example:"प फ ब भ म",cat:"sthana",sutra:""},
    {term:"करण (Karaṇa)",meaning:"Tongue part that reaches the Sthāna. जिह्वामूलेन·जिह्वामध्येन·जिह्वोपाग्रेण·जिह्वाग्रेण",example:"Guttural=tongue-root · Palatal=mid-tongue · Cerebral=near-tip · Dental=tip",cat:"articulation",sutra:""},
    {term:"ह का विशेष स्थान",meaning:"Unconjunct ह = Kaṇṭha · Conjunct ह + 5th nasal/semi-vowel = Uras (chest)",example:"हरि→Kaṇṭha · ब्रह्म/प्रह्लाद→Uras",cat:"sthana",sutra:""},
   ],
   quiz:[
    {q:"Kavarga Sthāna:",opts:["Tālu","Kaṇṭha","Danta","Mūrdhā"],ans:1,exp:"अकुहविसर्जनीयानां कण्ठः."},
    {q:"Alpaprāṇa letters in a Varga:",opts:["2nd·4th","1st·3rd·5th","All 5","5th only"],ans:1,exp:"1st, 3rd, 5th = Alpaprāṇa. 2nd, 4th = Mahāprāṇa."},
    {q:"Two sounds are Savarṇa when:",opts:["Same duration","Same Sthāna+same Abhyantara Prayatna","Same suffix","Same prefix"],ans:1,exp:"1.1.9: tulyāsyaprayatnaṃ savarṇam."},
    {q:"ह conjunct with semi-vowel (brahma) → Sthāna:",opts:["Kaṇṭha","Tālu","Uras (chest)","Mūrdhā"],ans:2,exp:"Conjunct ह shifts to Uras (chest resonance)."},
   ]},
  {id:6,num:"§24",title:"Prayatna — Articulation Effort",subtitle:"5 Internal · 11 External · Khar & Haś",icon:"💨",color:T.teal,accent:"#EAF4F4",
   concepts:[
    {term:"प्रयत्न द्विधा",meaning:"Two types: Abhyantara (inside-mouth config) + Bāhya (breath/cord behavior)",example:"क: Spṛṣṭa(inside) + Alpaprāṇa+Aghoṣa+Vivāra(outside)",cat:"effort",sutra:""},
    {term:"5 आभ्यन्तर",meaning:"①स्पृष्ट(stops) ②ईषत्-स्पृष्ट(semi-v) ③विवृत(vowels) ④संवृत(short-a) ⑤ईषत्-विवृत(sibilants)",example:"क=Spṛṣṭa · य=Īṣat-spṛṣṭa · अ=Vivṛta",cat:"effort",sutra:""},
    {term:"11 बाह्य",meaning:"11 external efforts grouped as: Khar-set + Haś-set + Tone-set",example:"①Vivāra+Śvāsa+Aghoṣa=Khar ②Saṃvāra+Nāda+Ghoṣa=Haś ③Udātta+Anudātta+Svarita",cat:"effort",sutra:""},
    {term:"खर् (Khar)",meaning:"Unvoiced: Vivāra+Śvāsa+Aghoṣa. Rule: खरो विवाराः श्वासाऽघोषाश्च",example:"1st+2nd of each varga + शषस: क ख · च छ · ट ठ · त थ · प फ · श ष स",cat:"classification",sutra:""},
    {term:"हश् (Haś)",meaning:"Voiced: Saṃvāra+Nāda+Ghoṣa. Rule: हशः संवारा नादाघोषाश्च",example:"3rd+4th+5th of each varga + semi-vowels: ग घ ङ · ज झ ञ · ड ढ ण · द ध न · ब भ म · यरलव",cat:"classification",sutra:""},
    {term:"अल्पप्राण/महाप्राण",meaning:"Alpa=low-breath(1st·3rd·5th+semi-v+vowels) · Mahā=high-breath(2nd·4th+sibilants)",example:"क=AP · ख=MP · ग=AP · घ=MP · ङ=AP",cat:"effort",sutra:""},
    {term:"उदात्त-अनुदात्त-स्वरित",meaning:"Three pitch accents = Bāhya Prayatna of VOWELS only. Sūtras 1.2.29-31",example:"उदात्त=raised · अनुदात्त=low · स्वरित=blend",cat:"tone",sutra:"1.2.29-31"},
   ],
   quiz:[
    {q:"Alpaprāṇa of a Varga:",opts:["2nd·4th","1st·3rd·5th+semi-v","All 5","5th only"],ans:1,exp:"1st·3rd·5th + semi-vowels = Alpaprāṇa."},
    {q:"Khar consonants are:",opts:["Voiced+resonant","Unvoiced: Vivāra+Śvāsa+Aghoṣa","Nasal","Semi-vowels"],ans:1,exp:"1st+2nd of each varga + sibilants — all unvoiced."},
    {q:"Udātta·Anudātta·Svarita are Bāhya Prayatna of:",opts:["All consonants","Vowels only","Sibilants only","Nasals"],ans:1,exp:"Three tones = properties of VOWELS only."},
    {q:"Total Bāhya Prayatna:",opts:["4","8","11","25"],ans:2,exp:"11: Vivāra+Saṃvāra+Śvāsa+Nāda+Ghoṣa+Aghoṣa+Alpaprāṇa+Mahāprāṇa+Udātta+Anudātta+Svarita."},
   ]},
  {id:7,num:"§25-33",title:"Savarṇa · 18 Vowel Forms",subtitle:"Homogeneous Sounds · Duration · Tone · Nasality",icon:"🎵",color:"#6B7A3A",accent:"#F2F5E8",
   concepts:[
    {term:"सवर्ण (1.1.9)",meaning:"तुल्यास्यप्रयत्नं सवर्णम् — same Sthāna + same Abhyantara Prayatna",example:"अ and आ = Savarṇa · इ and ई = Savarṇa · But: क and ख ≠ Savarṇa",cat:"samjna",sutra:"1.1.9"},
    {term:"ह्रस्व-दीर्घ-प्लुत (1.2.27)",meaning:"ऊकालोऽज्झ्रस्वदीर्घप्लुतः — three durations",example:"Hrasva(1 mātrā):अइउऋऌ · Dīrgha(2):आईऊएओऐऔ · Pluta(3+):रा३म!",cat:"duration",sutra:"1.2.27"},
    {term:"18 भेद per vowel",meaning:"3 durations × 3 tones × 2 nasality = 18. Diphthongs = 12 (no Hrasva)",example:"अ → 18 forms · ए→ 12 forms (no short form) · ऌ→12 forms",cat:"theory",sutra:""},
    {term:"उदात्त (1.2.29)",meaning:"ऊर्ध्व भाग से — raised/high pitch vowel",example:"Marked with vertical above in Vedic manuscripts",cat:"tone",sutra:"1.2.29"},
    {term:"अनुदात्त (1.2.30)",meaning:"अधो भाग से — low pitch vowel",example:"Marked with horizontal line below in Vedic manuscripts",cat:"tone",sutra:"1.2.30"},
    {term:"स्वरित (1.2.31)",meaning:"समाहारः — blend of Udātta+Anudātta = circumflex",example:"Post-Udātta syllable in Vedic recitation",cat:"tone",sutra:"1.2.31"},
    {term:"अनुनासिक/अननुनासिक",meaning:"1.1.8: मुखनासिकावचनोऽनुनासिकः — mouth+nose vs. mouth-only",example:"हूँ (anunāsika) · हू (ananunāsika)",cat:"nasality",sutra:"1.1.8"},
   ],
   quiz:[
    {q:"Savarṇa sūtra:",opts:["1.2.45","1.1.9","1.3.1","1.4.10"],ans:1,exp:"तुल्यास्यप्रयत्नं — same Sthāna+same effort."},
    {q:"Each short vowel has how many forms?",opts:["3","9","12","18"],ans:3,exp:"3×3×2 = 18!"},
    {q:"Diphthongs (ए ओ ऐ औ) have how many forms?",opts:["6","12","18","24"],ans:1,exp:"12 — no short (Hrasva) form exists."},
    {q:"Svarita (1.2.31):",opts:["High","Low","Blend of Udātta+Anudātta","No tone"],ans:2,exp:"Samāhāraḥ = circumflex blend."},
   ]},
  {id:8,num:"§34-39",title:"Guṇa · Vṛddhi · Tapara · Laghu-Guru",subtitle:"Vowel Strengthening · Precision · Syllable Weight",icon:"⚙️",color:T.gold,accent:"#FDF3DC",
   concepts:[
    {term:"गुण (1.1.2)",meaning:"अदेङ् गुणः — अ, ए, ओ are Guṇa. First-level strengthening",example:"उप+इन्द्र = उपेन्द्र (a+i→e=Guṇa) · गो+अश्व = गवाश्व",cat:"samjna",sutra:"1.1.2"},
    {term:"वृद्धि (1.1.1)",meaning:"वृद्धिरादैच् — आ, ऐ, औ are Vṛddhi. FIRST sūtra of Aṣṭādhyāyī!",example:"इ→ऐ(Vṛddhi) · उ→औ(Vṛddhi) · ऋ→आर्(Vṛddhi)",cat:"samjna",sutra:"1.1.1"},
    {term:"उरण् रपरः (1.1.51)",meaning:"When ṛ undergoes Guṇa/Vṛddhi → insert 'र्' (no retroflex Guṇa exists)",example:"महा+ऋषि = महर्षि (a+ṛ→ar)",cat:"sutra",sutra:"1.1.51"},
    {term:"तपर (1.1.70)",meaning:"तपरस्तत्कालस्य — vowel+त् = ONLY that duration. No savarṇas",example:"अत् = only short अ (not ā, not ā3)",cat:"precision",sutra:"1.1.70"},
    {term:"सवर्णग्राहक (1.1.69)",meaning:"By default, a vowel in a rule = ALL 18 variants UNLESS it is Vidhimān",example:"'इको यणचि': इक् is Avidhimān → includes all variants",cat:"rule",sutra:"1.1.69"},
    {term:"लघु/गुरु (1.4.10-11)",meaning:"ह्रस्वं लघु · संयोगे गुरु — short vowel=Laghu; +cluster or Dīrgha=Guru",example:"'जल' में 'ज'=Laghu · 'जलप्रवाह' में 'ल'=Guru (before cluster प्र)",cat:"meter",sutra:"1.4.10-11"},
   ],
   quiz:[
    {q:"Guṇa vowels:",opts:["आ ऐ औ","अ ए ओ","इ ई उ","ऋ ॠ ऌ"],ans:1,exp:"अ ए ओ = Guṇa (1.1.2)."},
    {q:"महा+ऋषि=महर्षि demonstrates:",opts:["Guṇa only","Uraṇ Rapharaḥ — r inserted with ṛ","Vṛddhi","Lopa"],ans:1,exp:"1.1.51: a+ṛ→ar (r insertion)."},
    {q:"Tapara restricts vowel to:",opts:["All 18 variants","Exact duration only","Long only","Vedic only"],ans:1,exp:"1.1.70: exact duration only. अत् = only short अ."},
    {q:"Short vowel before cluster becomes:",opts:["Laghu","Guru","Pluta","Anunāsika"],ans:1,exp:"1.4.11: saṃyoge guru."},
   ]},
  {id:9,num:"§40-58",title:"Morphological Saṃjñās",subtitle:"Saṃyoga · Upadhā · Ṭī · Sthānī · Ādeśa · Āgama",icon:"🔧",color:T.blue,accent:"#EBF1F8",
   concepts:[
    {term:"संयोग",meaning:"2+ consonants with NO intervening vowel",example:"पुष्प:ष्+प · भक्त:क्+त · मत्स्य:त्+स्+य",cat:"phonetics",sutra:""},
    {term:"उपधा",meaning:"Penultimate letter of word/root — 'workbench' for Guṇa/Vṛddhi",example:"पठ्→Upadhā=अ · लिख्→Upadhā=इ",cat:"position",sutra:""},
    {term:"टी संज्ञा",meaning:"Final vowel + all following consonants",example:"मनस्: final अ + न्+स् = 'अनस्' is Ṭī",cat:"samjna",sutra:""},
    {term:"निष्ठा (1.1.26)",meaning:"क्त+क्तवतु = past participial suffixes",example:"पठ्+क्त=पठित · गम्+क्त=गत · कृ+क्तवतु=कृतवान्",cat:"samjna",sutra:"1.1.26"},
    {term:"सम्प्रसारण (1.1.45)",meaning:"इग्यणः — YaN semi-vowels→IK vowels. Reverse of normal vowel→semivowel",example:"वप्→उप्ते(व→उ) · यज्→इज्ते(य→इ) · ग्रह्→गृहीते(र→ṛ)",cat:"process",sutra:"1.1.45"},
    {term:"स्थानी-आदेश-निमित्त",meaning:"Original·Substitute·Trigger — Ādeśa inherits Sthānī's properties (Sthānivadbhāva)",example:"प्रति+एकः: इ=Sthānī · य्=Ādeśa · following अ=Nimitta",cat:"operation",sutra:""},
    {term:"आगम: Tit·Kit·Mit",meaning:"AUGMENT: added without replacing. Tit=beginning · Kit=end · Mit=after final vowel",example:"Tit: path+tavya→pathitavya · Mit: vad+num→vand",cat:"agama",sutra:""},
   ],
   quiz:[
    {q:"Upadhā in 'पठ्':",opts:["प्","ठ्","अ","Whole root"],ans:2,exp:"Letter before final ठ् = अ = Upadhā."},
    {q:"Samprasāraṇa: व→?",opts:["उ","इ","ṛ","ḷ"],ans:0,exp:"वप्→उप्ते: व→उ."},
    {q:"Niṣṭhā suffixes:",opts:["सन्·यङ्","क्त·क्तवतु","शप्·श्नु","लिङ्·लुङ्"],ans:1,exp:"क्त+क्तवतु = past participial suffixes."},
    {q:"An Āgama is:",opts:["A deletion","Added WITHOUT replacing anything","A substitution","A prefix"],ans:1,exp:"'Mitra' — joins without evicting anything."},
   ]},
  {id:10,num:"§56-71",title:"Upasarga & Saṃhitā",subtitle:"22 Prefixes · Pause · Proximity · Āmreḍita",icon:"🧩",color:T.orange,accent:"#FAF0E8",
   concepts:[
    {term:"22 प्रादि/उपसर्ग (1.4.59)",meaning:"22 particles. As Nipāta when alone; become Upasarga when joined to verb (Kriyāyoge)",example:"Pra·Para·Apa·Sam·Anu·Ava·Niṣ·Nir·Dus·Dur·Vi·Ā·Ni·Adhi·Api·Ati·Su·Ut·Abhi·Prati·Pari·Upa",cat:"upasarga",sutra:"1.4.59"},
    {term:"हर् + 4 upasargas",meaning:"Same root 'har' completely transforms with different prefixes",example:"प्र+हार=attack · सम्+हार=destroy · वि+हार=wander · उप+हार=gift",cat:"upasarga",sutra:""},
    {term:"संहिता (1.4.109)",meaning:"परः संनिकर्षः — extreme proximity of sounds = prerequisite for all sandhi",example:"'राम+अय'→Saṃhitā→Sandhi→'रामाय'",cat:"samjna",sutra:"1.4.109"},
    {term:"अवसान (1.4.110)",meaning:"विरामोऽवसानम् — pause/absence of sounds = technical name for post-utterance silence",example:"End of utterance — context for certain consonant-change rules",cat:"samjna",sutra:"1.4.110"},
    {term:"आमेडित (8.1.2)",meaning:"तस्य परमामेडितम् — 2nd occurrence of a doubled word gets Āmreḍita name",example:"काञ्-काञ् · वृषल-वृषल3 — emphasis, distributive sense",cat:"samjna",sutra:"8.1.2"},
   ],
   quiz:[
    {q:"हर् + वि = ?",opts:["Prahāra(attack)","Vihāra(roam)","Samhāra(destroy)","Upahāra(gift)"],ans:1,exp:"Vi=apart/spread → Vihāra=roam/wander."},
    {q:"Saṃhitā (1.4.109):",opts:["A suffix","Extreme proximity = prerequisite for sandhi","Deletion","Root-doubling"],ans:1,exp:"Paraḥ sannikarṣaḥ — without Saṃhitā, no sandhi rule applies."},
    {q:"Parādi → Upasarga when:",opts:["Alone","Joined to a verb","Before noun","After vowel"],ans:1,exp:"1.4.59: upasargāḥ kriyāyoge. Context transforms identity."},
    {q:"Āmreḍita is:",opts:["Repeated root","2nd utterance of doubled word","A suffix","A prefix group"],ans:1,exp:"8.1.2: the second of doubled words like काञ्-काञ्."},
   ]},
  {id:11,num:"§72-85",title:"Lopa · Luk-Ślu-Lup · Bahulam",subtitle:"Deletion Types · Optionality · Vedic Diversity",icon:"🔍",color:T.pink,accent:"#F8EEF4",
   concepts:[
    {term:"लोप (1.1.60)",meaning:"अदर्शनं लोपः — non-perception. Eternally present but invisible. Patañjali: 'nāsto lopaḥ'",example:"It-markers in Māheśvara Sūtras are 'lopa'd after use",cat:"operation",sutra:"1.1.60"},
    {term:"लुक्-श्लु-लुप् (1.1.61)",meaning:"Three specialized deletions triggering DIFFERENT subsequent behaviors",example:"लुक्=Adādi stem-changes · श्लु=Juhoty-ādi reduplication · लुप्=Taddhita gender-felt",cat:"operation",sutra:"1.1.61"},
    {term:"अन्यतरस्याम्/वा/विभाषा",meaning:"Three optionality markers — rule may or may not apply",example:"Both forms valid: vibhāṣā allows dialect/register variation",cat:"optionality",sutra:""},
    {term:"बाहुलक (Bahulam)",meaning:"4-fold Vedic flexibility: ①applies ②doesn't apply ③optional ④different result",example:"'बहुलं छन्दसि' covers ALL Vedic irregularities with one principle",cat:"vedic",sutra:""},
    {term:"चान्दस मार्कर",meaning:"'Chandasi'·'Mantre'·'Nigame' = Vedic-only rules. 'chandasi dṛṣṭānuvidhiḥ' = follow observed Vedic usage",example:"2.4.39: bahulaṃ chandasi · 6.1.106: chandasi pare'pi",cat:"vedic",sutra:""},
   ],
   quiz:[
    {q:"Lopa (1.1.60):",opts:["Adding a sound","Non-perception — invisible but present","Doubling","Augment"],ans:1,exp:"Adarśanaṃ = non-visibility. NOT destruction."},
    {q:"Lup is for:",opts:["Adādi class","Taddhita suffix contexts","Reduplication","Vowel sandhi"],ans:1,exp:"Lup deletes taddhita suffix but it's 'felt' for gender assignment."},
    {q:"Bahulam provides:",opts:["Binary rules","4 modes: applies/doesn't/optional/different","3 modes","Unlimited"],ans:1,exp:"4-fold flexibility — the grammar's Vedic exception handler."},
    {q:"Anyatarasyām·Vā·Vibhāṣā all indicate:",opts:["Mandatory","Optionality","Deletion","Augment"],ans:1,exp:"All three = optional application with contextual nuances."},
   ]},
  {id:12,num:"§86-96",title:"Architecture of Aṣṭādhyāyī",subtitle:"Structure · 7 Types · Anuvṛtti · Conflict · Laghava",icon:"🏛️",color:T.slate,accent:"#EEF1F6",
   concepts:[
    {term:"अष्टाध्यायी संरचना",meaning:"8 Adhyāyas × 4 Pādas = 32 Pādas. 3,978 sūtras. Ch.1-7 = Sapādhasaptādhyāyī. Ch.8 = Tripādī",example:"Sūtra 1.3.1 = Adhyāya 1, Pāda 3, Sūtra 1",cat:"architecture",sutra:""},
    {term:"7 प्रकार के सूत्र",meaning:"Seven functional sūtra-types",example:"①संज्ञा ②परिभाषा ③विधि ④नियम ⑤अधिकार ⑥अतिदेश ⑦निषेध",cat:"architecture",sutra:""},
    {term:"अनुवृत्ति",meaning:"Carrying words FORWARD from previous sūtras — Pāṇini's most powerful economy tool",example:"Word in sūtra N silently flows into sūtras N+1, N+2…",cat:"architecture",sutra:""},
    {term:"अधिकार",meaning:"Governing rule at section-start — all following rules inherit its context",example:"'धातोः' (3.1.91) governs 3.1.91-3.4.117 · 'अङ्गस्य' governs hundreds",cat:"architecture",sutra:""},
    {term:"परिभाषा",meaning:"Meta-rules — rules about HOW other rules should be interpreted",example:"तपरस्तत्कालस्य (1.1.70) = Paribhāṣā on vowel-scope",cat:"sutratype",sutra:""},
    {term:"अर्धमात्रा-लाघव",meaning:"'ardhamātrālāghavena putrotsavaṃ…' — saving half a syllable = son's birth joy",example:"Every technique (Pratyāhāra, Anuvṛtti, It) serves THIS principle",cat:"philosophy",sutra:""},
    {term:"विप्रतिषेधे परं (1.4.2)",meaning:"When two equal sūtras conflict, the LATER (para) one wins",example:"Exception: Pūrvasiddha (8.2.1) reverses this in the Tripādī",cat:"conflict",sutra:"1.4.2"},
   ],
   quiz:[
    {q:"Total sūtras in Aṣṭādhyāyī:",opts:["1000","2000","3,978","5000"],ans:2,exp:"3,978 sūtras in 8 Adhyāyas × 4 Pādas."},
    {q:"Anuvṛtti is:",opts:["Repeat every word","Carry words forward from earlier sūtras","Add suffixes","Delete sounds"],ans:1,exp:"State once → flows forward. Pāṇini's key economy."},
    {q:"'Ardhamātrālāghavena…' celebrates:",opts:["Grammar difficulty","Saving even half a syllable","Vedic texts","Suffix importance"],ans:1,exp:"Supreme Laghava principle — every technique serves this."},
    {q:"Vipratiṣedhe paraṃ kāryam:",opts:["Earlier rule wins","Later rule wins in equal conflict","Both apply","Neither applies"],ans:1,exp:"Para (later) sūtra wins. Exception: Pūrvasiddha."},
   ]},
];

/* ── UTILITY ─────────────────────────────────────────────────────────────── */
function PBar({value,max,color=T.gold,h=6}){
  const p=max>0?Math.min(100,Math.round((value/max)*100)):0;
  return <div style={{background:T.bgDeep,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${p}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.5s ease"}}/>
  </div>;
}
function Badge({text,color}){const cc=color||T.textSoft;return(
  <span style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",padding:"2px 8px",borderRadius:99,background:cc+"22",color:cc,border:`1px solid ${cc}40`,whiteSpace:"nowrap"}}>{text}</span>
);}
function Pill({text,active,color,onClick}){return(
  <button onClick={onClick} style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${active?color:T.border}`,background:active?color:T.bgCard,color:active?"#fff":T.textMid,fontSize:12,cursor:"pointer",fontWeight:active?700:500,transition:"all 0.15s"}}>{text}</button>
);}

/* ── FLIP CARD ───────────────────────────────────────────────────────────── */
function FlipCard({concept}){
  const[f,setF]=useState(false);const cc=CAT_C[concept.cat]||T.textMid;
  return(
    <div onClick={()=>setF(x=>!x)} style={{cursor:"pointer",perspective:900,height:180}}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.55s ease",transform:f?"rotateY(180deg)":"rotateY(0)"}}>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:12,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:T.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:4}}>
            <Badge text={concept.cat} color={cc}/>
            {concept.sutra&&<span style={{fontSize:10,color:T.textSoft,fontStyle:"italic",flexShrink:0}}>{concept.sutra}</span>}
          </div>
          <div>
            <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{concept.term}</div>
            <div style={{fontSize:11,color:T.textSoft}}>Tap to reveal →</div>
          </div>
        </div>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:`linear-gradient(135deg,${cc}14,${cc}06)`,border:`1.5px solid ${cc}55`,borderRadius:12,padding:14,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:T.shadow}}>
          <div style={{fontSize:12,color:T.text,lineHeight:1.55,overflow:"hidden"}}>{concept.meaning}</div>
          <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:12,color:cc,padding:"5px 10px",background:cc+"18",borderRadius:6,borderLeft:`3px solid ${cc}`}}>{concept.example}</div>
        </div>
      </div>
    </div>
  );
}

/* ── QUIZ VIEW ───────────────────────────────────────────────────────────── */
function QuizView({chapter,onScore}){
  const[step,setStep]=useState(0);const[sel,setSel]=useState(null);
  const[rev,setRev]=useState(false);const[ans,setAns]=useState([]);const[done,setDone]=useState(false);
  const q=chapter.quiz[step];const total=chapter.quiz.length;
  function pick(i){if(!rev){setSel(i);setRev(true);}}
  function next(){const a=[...ans,sel===q.ans];setAns(a);if(step+1>=total){onScore&&onScore(a.filter(Boolean).length,total);setDone(true);}else{setStep(s=>s+1);setSel(null);setRev(false);}}
  function reset(){setStep(0);setSel(null);setRev(false);setAns([]);setDone(false);}
  if(done){const sc=ans.filter(Boolean).length;const p=Math.round((sc/total)*100);
    return(<div style={{textAlign:"center",padding:"32px 0"}}>
      <div style={{fontSize:52,marginBottom:12}}>{p>=75?"🏆":p>=50?"💪":"📖"}</div>
      <div style={{fontSize:32,fontWeight:800,color:chapter.color}}>{sc}/{total}</div>
      <div style={{fontSize:14,color:T.textMid,margin:"8px 0 20px"}}>{p>=75?"Excellent! Chapter mastered.":p>=50?"Good progress — keep going!":"Review the concepts and retry."}</div>
      <button onClick={reset} style={{padding:"11px 28px",borderRadius:99,background:chapter.color,border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Try Again</button>
    </div>);}
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <span style={{fontSize:12,color:T.textSoft,whiteSpace:"nowrap"}}>Q {step+1}/{total}</span>
      <div style={{flex:1}}><PBar value={step} max={total} color={chapter.color} h={5}/></div>
      <span style={{fontSize:12,color:chapter.color,fontWeight:700}}>{Math.round((step/total)*100)}%</span>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px",marginBottom:16,fontSize:15,fontWeight:600,color:T.text,lineHeight:1.5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {q.opts.map((opt,i)=>{let bg=T.bgCard,bdr=T.border,col=T.text;if(rev){if(i===q.ans){bg="#E8F5EA";bdr="#4A7C59";col="#2A5C39";}else if(i===sel){bg="#FDE8E8";bdr="#B03030";col="#8B2020";}}else if(sel===i){bg=chapter.color+"15";bdr=chapter.color;}
        return(<button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${bdr}`,borderRadius:10,padding:"12px 14px",color:col,fontSize:13,textAlign:"left",cursor:rev?"default":"pointer",transition:"all 0.2s",fontWeight:i===sel?700:400}}>{opt}</button>);})}
    </div>
    {rev&&<div style={{marginTop:12,padding:"12px 14px",background:"#FFFBF0",border:`1px solid ${T.borderDk}`,borderRadius:10,fontSize:13,color:T.textMid,lineHeight:1.55}}>💡 <strong>Explanation:</strong> {q.exp}</div>}
    {rev&&<button onClick={next} style={{marginTop:12,width:"100%",padding:13,borderRadius:10,background:chapter.color,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{step+1>=total?"See Results 🎯":"Next →"}</button>}
  </div>);
}

/* ── LEVEL TEST ──────────────────────────────────────────────────────────── */
const LM={easy:{label:"Easy",desc:"Basic recall",xp:10,color:"#4A7C59",emoji:"🟢",badge:"Beginner"},medium:{label:"Medium",desc:"Application & analysis",xp:20,color:"#C8703A",emoji:"🟡",badge:"Practitioner"},hard:{label:"Hard",desc:"Deep synthesis",xp:40,color:"#C8503A",emoji:"🔴",badge:"Scholar"}};

function LevelTest({chapter,onXP}){
  const[level,setLevel]=useState(null);const[step,setStep]=useState(0);const[sel,setSel]=useState(null);
  const[rev,setRev]=useState(false);const[ans,setAns]=useState([]);const[done,setDone]=useState(false);
  const[lvlSc,setLvlSc]=useState({});
  function start(l){setLevel(l);setStep(0);setSel(null);setRev(false);setAns([]);setDone(false);}
  function goBack(){setLevel(null);}
  if(!level){return(<div>
    <div style={{background:T.bgAlt,borderRadius:12,padding:"14px 18px",marginBottom:18,border:`1px solid ${T.border}`}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>📋 Chapter Test — Three Levels</div>
      <div style={{fontSize:12,color:T.textSoft}}>5 questions each. Score ≥80% to earn the level badge.</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {Object.entries(LM).map(([lk,lv])=>{
        const sc=lvlSc[lk];const qs=LVL[chapter.id]?.[lk];if(!qs)return null;
        return(<button key={lk} onClick={()=>start(lk)} style={{background:T.bgCard,border:`2px solid ${lv.color}44`,borderRadius:14,padding:"14px 18px",textAlign:"left",cursor:"pointer",boxShadow:T.shadow,display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:28}}>{lv.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:lv.color,marginBottom:2}}>{lv.label}</div>
            <div style={{fontSize:12,color:T.textSoft}}>{lv.desc} · {qs.length} Qs · +{lv.xp} XP/correct</div>
            {sc!=null&&<div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1}}><PBar value={sc} max={qs.length} color={lv.color} h={4}/></div><span style={{fontSize:11,color:lv.color,fontWeight:700}}>{sc}/{qs.length}</span></div>}
          </div>
          {sc>=Math.ceil((qs?.length||5)*0.8)&&<span style={{fontSize:11,background:lv.color+"22",color:lv.color,padding:"3px 10px",borderRadius:99,fontWeight:700,border:`1px solid ${lv.color}44`,flexShrink:0}}>🏅 {lv.badge}</span>}
        </button>);})}
    </div>
  </div>);}
  const lv=LM[level];const qs=LVL[chapter.id][level];const q=qs[step];const total=qs.length;
  function pick(i){if(!rev){setSel(i);setRev(true);}}
  function next(){const a=[...ans,sel===q.ans];setAns(a);if(step+1>=total){const sc=a.filter(Boolean).length;setLvlSc(s=>({...s,[level]:Math.max(s[level]||0,sc)}));onXP&&onXP(sc*lv.xp);setDone(true);}else{setStep(s=>s+1);setSel(null);setRev(false);}}
  if(done){const sc=ans.filter(Boolean).length;const p=Math.round((sc/total)*100);const pass=p>=80;
    return(<div style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:48,marginBottom:8}}>{pass?"🏅":"📚"}</div>
      <div style={{fontSize:11,color:lv.color,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{lv.label} Level</div>
      <div style={{fontSize:32,fontWeight:800,color:lv.color,marginBottom:4}}>{sc}/{total}</div>
      {pass&&<div style={{display:"inline-block",background:lv.color+"22",color:lv.color,padding:"5px 16px",borderRadius:99,fontSize:13,fontWeight:700,border:`1px solid ${lv.color}`,marginBottom:12}}>🏅 {lv.badge} Badge Earned!</div>}
      <div style={{fontSize:13,color:T.textMid,marginBottom:18}}>{pass?"Level mastered! Try the next level.":"Review concepts and retry."}</div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={()=>start(level)} style={{padding:"10px 20px",borderRadius:99,background:lv.color,border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Retry</button>
        <button onClick={goBack} style={{padding:"10px 20px",borderRadius:99,background:"none",border:`1.5px solid ${lv.color}`,color:lv.color,fontWeight:700,fontSize:13,cursor:"pointer"}}>Choose Level</button>
      </div>
    </div>);}
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <button onClick={goBack} style={{background:"none",border:"none",color:T.textSoft,cursor:"pointer",fontSize:12,padding:0}}>←</button>
      <span style={{fontSize:13,fontWeight:700,color:lv.color}}>{lv.emoji} {lv.label}</span>
      <div style={{flex:1}}><PBar value={step} max={total} color={lv.color} h={5}/></div>
      <span style={{fontSize:12,color:lv.color,fontWeight:700}}>Q {step+1}/{total}</span>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px",marginBottom:16,fontSize:15,fontWeight:600,color:T.text,lineHeight:1.5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {q.opts.map((opt,i)=>{let bg=T.bgCard,bdr=T.border,col=T.text;if(rev){if(i===q.ans){bg="#E8F5EA";bdr="#4A7C59";col="#2A5C39";}else if(i===sel){bg="#FDE8E8";bdr="#B03030";col="#8B2020";}}else if(sel===i){bg=lv.color+"15";bdr=lv.color;}
        return(<button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${bdr}`,borderRadius:10,padding:"12px 14px",color:col,fontSize:13,textAlign:"left",cursor:rev?"default":"pointer",transition:"all 0.2s",fontWeight:i===sel?700:400}}>{opt}</button>);})}
    </div>
    {rev&&<div style={{marginTop:12,padding:"12px 14px",background:"#FFFBF0",border:`1px solid ${T.borderDk}`,borderRadius:10,fontSize:13,color:T.textMid,lineHeight:1.55}}>💡 {q.exp}</div>}
    {rev&&<button onClick={next} style={{marginTop:12,width:"100%",padding:13,borderRadius:10,background:lv.color,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{step+1>=total?"See Results 🎯":"Next →"}</button>}
  </div>);
}

/* ── VEDIC SECTION ───────────────────────────────────────────────────────── */
function VedicSection({chId}){
  const refs=VEDIC[chId]||[];
  if(!refs.length)return<div style={{padding:20,color:T.textSoft,fontSize:13}}>Vedic references coming soon.</div>;
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {refs.map((r,i)=>(
      <div key={i} style={{background:T.bgCard,border:`1px solid ${T.borderDk}`,borderLeft:`4px solid ${T.gold}`,borderRadius:12,padding:"16px 18px",boxShadow:T.shadow}}>
        <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,color:T.text,lineHeight:1.8,marginBottom:8,whiteSpace:"pre-line"}}>{r.dev}</div>
        <div style={{fontSize:12,color:T.textSoft,fontStyle:"italic",marginBottom:6,lineHeight:1.6,whiteSpace:"pre-line"}}>{r.roman}</div>
        <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:10,padding:"8px 12px",background:T.bgAlt,borderRadius:8}}>"{r.trans}"</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:11,background:T.gold+"22",color:T.gold,padding:"3px 10px",borderRadius:99,fontWeight:700,border:`1px solid ${T.gold}44`}}>📜 {r.source}</span>
          {r.link&&<a href={r.link} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:T.blue,textDecoration:"none",fontWeight:600}}>Read Source →</a>}
        </div>
        {r.rel&&<div style={{marginTop:10,fontSize:12,color:T.textMid,lineHeight:1.6,padding:"8px 12px",background:T.blue+"0D",borderRadius:8,borderLeft:`3px solid ${T.blue}`}}>
          <span style={{fontWeight:700,color:T.blue}}>📌 Grammar Connection: </span>{r.rel}
        </div>}
      </div>
    ))}
  </div>);
}

/* ── SOUNDS SCREEN ───────────────────────────────────────────────────────── */
function SoundsScreen(){
  const[mode,setMode]=useState("vowels");const[selV,setSelV]=useState(null);
  const SC={Kaṇṭha:T.saffron,Tālu:T.blue,Mūrdhā:T.teal,Danta:T.green,Oṣṭha:T.purple,"Kaṇṭha+Tālu":T.orange,"Kaṇṭha+Oṣṭha":T.pink,Nāsikā:T.slate,"Danta+Oṣṭha":T.pink};
  return(<div style={{paddingBottom:40}}>
    <div style={{background:`linear-gradient(135deg,#FDF6E3,#F3EDD8)`,borderBottom:`2px solid ${T.border}`,padding:"20px 20px 14px"}}>
      <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:T.text,margin:"0 0 4px"}}>🔊 Pronunciation Studio</h2>
      <p style={{fontSize:13,color:T.textSoft,margin:"0 0 12px"}}>IAST · Simplified · Place of Articulation · English Guide</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["vowels","🔵 Vowels"],["consonants","🟠 Consonants"],["conjuncts","🔗 Conjuncts"],["samples","📜 Sanskrit Texts"]].map(([k,l])=>(
          <Pill key={k} text={l} active={mode===k} color={T.gold} onClick={()=>{setMode(k);setSelV(null);}}/>
        ))}
      </div>
    </div>
    <div style={{padding:"18px 20px",maxWidth:680,margin:"0 auto"}}>
      {mode==="vowels"&&(<div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {[["Kaṇṭha",T.saffron],["Tālu",T.blue],["Mūrdhā",T.teal],["Danta",T.green],["Oṣṭha",T.purple]].map(([s,c])=>(
            <span key={s} style={{fontSize:11,padding:"3px 8px",borderRadius:4,background:c+"18",color:c,border:`1px solid ${c}30`}}>● {s}</span>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}}>
          {SOUNDS.vowels.map((v,i)=>{const sc=SC[v.sthana]||T.gold;const active=selV===i;
            return(<button key={i} onClick={()=>setSelV(active?null:i)} style={{background:active?sc+"22":T.bgCard,border:`2px solid ${active?sc:T.border}`,borderRadius:12,padding:"10px 8px",textAlign:"center",cursor:"pointer",boxShadow:active?`0 3px 14px ${sc}30`:T.shadow,transition:"all 0.2s"}}>
              <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:26,color:T.text}}>{v.dev}</div>
              <div style={{fontSize:11,color:sc,fontWeight:700}}>{v.iast}</div>
              <div style={{fontSize:10,color:T.textSoft}}>{v.simp}</div>
              {active&&<div style={{marginTop:6,fontSize:11,color:T.textMid,lineHeight:1.4,textAlign:"left",background:sc+"14",borderRadius:6,padding:"6px 8px"}}>
                <div><b>Dur:</b> {v.dur}</div>
                <div><b>Place:</b> {v.sthana}</div>
                <div><b>≈</b> {v.eng}</div>
              </div>}
            </button>);
          })}
        </div>
      </div>)}
      {mode==="consonants"&&(<div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:13}}>
            <thead><tr style={{background:T.bgDeep}}>
              {["Varga","1st AP","2nd MP","3rd AP","4th MP","5th (Nasal)"].map(h=>(
                <th key={h} style={{padding:"8px 6px",color:T.textMid,border:`1px solid ${T.border}`,fontSize:11,fontWeight:700,textAlign:"center"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {SOUNDS.vargas.map((vg,vi)=>(
                <tr key={vi}>
                  <td style={{padding:"8px",background:vg.c+"18",color:vg.c,fontWeight:700,fontSize:12,border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div>{vg.name}</div><div style={{fontSize:10,fontWeight:400,opacity:0.8}}>{vg.sthana.split(" ")[0]}</div>
                  </td>
                  {vg.letters.map((lt,li)=>(
                    <td key={li} style={{padding:"8px",textAlign:"center",border:`1px solid ${T.border}`,background:li===4?vg.c+"12":T.bgCard}}>
                      <div style={{fontSize:20}}>{lt.dev}</div>
                      <div style={{fontSize:10,color:T.textSoft}}>{lt.iast}</div>
                      <div style={{fontSize:9,color:lt.ap==="AP"?T.green:T.saffron,fontWeight:700}}>{lt.ap}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:10,fontSize:12,color:T.textSoft,display:"flex",gap:16}}>
          <span><span style={{color:T.green,fontWeight:700}}>AP</span>=Alpaprāṇa</span>
          <span><span style={{color:T.saffron,fontWeight:700}}>MP</span>=Mahāprāṇa</span>
        </div>
        <div style={{marginTop:16,display:"flex",flexWrap:"wrap",gap:8}}>
          {[...SOUNDS.semivowels,...SOUNDS.sibilants].map((c,i)=>{const sc=SC[c.sthana]||T.gold;
            return(<div key={i} style={{background:T.bgCard,border:`1.5px solid ${sc}44`,borderRadius:10,padding:"10px 12px",textAlign:"center",minWidth:72,boxShadow:T.shadow}}>
              <div style={{fontSize:22,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{c.dev}</div>
              <div style={{fontSize:11,color:sc,fontWeight:700}}>{c.iast}</div>
              <div style={{fontSize:9,color:T.textSoft}}>{c.simp}</div>
            </div>);
          })}
        </div>
      </div>)}
      {mode==="conjuncts"&&(<div>
        <p style={{fontSize:13,color:T.textSoft,margin:"0 0 14px"}}>Common conjunct consonants (Saṃyoga) used throughout Sanskrit texts:</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {SOUNDS.conjuncts.map((c,i)=>(
            <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px",boxShadow:T.shadow}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:28,color:T.text}}>{c.dev}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.gold}}>{c.iast}</div>
                  <div style={{fontSize:12,color:T.textSoft}}>{c.simp}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:T.textMid}}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>)}
      {mode==="samples"&&(<div>
        <p style={{fontSize:13,color:T.textSoft,margin:"0 0 14px"}}>Sanskrit verses from Vedas, Upaniṣads & classical texts — showing grammar in action:</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {SOUNDS.samples.map((s,i)=>(
            <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderLeft:`4px solid ${T.gold}`,borderRadius:12,padding:"16px",boxShadow:T.shadow}}>
              <div style={{fontSize:11,background:T.gold+"22",color:T.gold,padding:"2px 8px",borderRadius:99,fontWeight:700,display:"inline-block",marginBottom:8}}>{s.cat}</div>
              <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:16,color:T.text,lineHeight:1.8,marginBottom:6}}>{s.dev}</div>
              <div style={{fontSize:12,color:T.textSoft,fontStyle:"italic",marginBottom:6}}>{s.iast}</div>
              <div style={{fontSize:13,color:T.textMid,marginBottom:6,fontStyle:"italic"}}>"{s.trans}"</div>
              <div style={{fontSize:11,color:T.textSoft}}>— {s.source}</div>
            </div>
          ))}
        </div>
      </div>)}
    </div>
  </div>);
}

/* ── MIND MAP SCREEN ─────────────────────────────────────────────────────── */
function MindMapScreen(){
  const[active,setActive]=useState("sounds");
  const maps={
    sounds:{label:"Sound System",center:{text:"वर्णमातृका",sub:"Sanskrit Sound System"},nodes:[
      {label:"स्वर (9 vowels)",color:T.blue,items:["अ इ उ ऋ ऌ","ए ओ ऐ औ","Self-luminous — Ach"]},
      {label:"व्यञ्जन (33)",color:T.green,items:["स्पर्श 25 (5 Vargas)","अन्तःस्थ 4 (यरलव)","ऊष्म 4 (शषसह)"]},
      {label:"अयोगवाह (8)",color:T.purple,items:["अनुस्वार · विसर्ग","जिह्वामूलीय · उपध्मानीय","4 यम (Vedic)"]},
      {label:"5 स्थान",color:T.saffron,items:["कण्ठ·तालु·मूर्धा","दन्त·ओष्ठ","+ नासिका·उरस्"]},
      {label:"प्रत्याहार (42)",color:T.teal,items:["अच्=9 vowels","हल्=33 consonants","इक्·यण्·शर्·अट्"]},
    ]},
    grammar:{label:"Grammar Ops",center:{text:"व्याकरण क्रियाएँ",sub:"Grammatical Operations"},nodes:[
      {label:"स्थानी→आदेश",color:T.saffron,items:["Original→Substitute","Nimitta=trigger","Sthānivadbhāva"]},
      {label:"आगम (3 types)",color:T.green,items:["टित्=at beginning","कित्=at end","मित्=after vowel"]},
      {label:"लोप (4 types)",color:T.pink,items:["लोप=non-perception","लुक्=Adādi class","श्लु=reduplication","लुप्=taddhita"]},
      {label:"सन्धि",color:T.teal,items:["संहिता condition","स्वर·व्यञ्जन·विसर्ग","Sandhi types"]},
      {label:"उपसर्ग (22)",color:T.orange,items:["प्र·परा·अप·सम्","अनु·अव·नि·निस्","अधि·अपि·अति·सु"]},
    ]},
    samjna:{label:"Technical Terms",center:{text:"संज्ञा प्रकरण",sub:"Key Definitions"},nodes:[
      {label:"शब्द वर्ग",color:T.green,items:["धातु (1930)","प्रातिपदिक","प्रत्यय (Tin/Sup)"]},
      {label:"स्वर भेद",color:T.blue,items:["ह्रस्व·दीर्घ·प्लुत","उदात्त·अनुदात्त·स्वरित","18 forms per vowel"]},
      {label:"गुण-वृद्धि",color:T.gold,items:["गुण: अ ए ओ","वृद्धि: आ ऐ औ","उरण् रपरः"]},
      {label:"मात्रा",color:T.teal,items:["लघु=ह्रस्व vowel","गुरु=दीर्घ or +cluster","Basis of meter"]},
      {label:"वास्तु संज्ञाएँ",color:T.orange,items:["आदि·अन्त·उपधा·टी","संयोग·निष्ठा","अवसान·संहिता"]},
    ]},
    architecture:{label:"Aṣṭādhyāyī",center:{text:"अष्टाध्यायी",sub:"3,978 Sūtras"},nodes:[
      {label:"7 सूत्र-प्रकार",color:T.gold,items:["संज्ञा·परिभाषा·विधि","नियम·अधिकार","अतिदेश·निषेध"]},
      {label:"Economy tools",color:T.slate,items:["अनुवृत्ति (carry-forward)","अधिकार (governing)","प्रत्याहार (codes)"]},
      {label:"Conflict rules",color:T.saffron,items:["विप्रतिषेध: para wins","पूर्वसिद्ध (Tripādī)","नित्य > Anitya"]},
      {label:"Vedic coverage",color:T.purple,items:["चान्दस markers","बाहुलक (4-fold)","dṛṣṭānuvidhiḥ"]},
      {label:"Laghava",color:T.green,items:["Ardhamātrā saves","Pāṇini's supreme goal","Grammar as art"]},
    ]},
  };
  const m=maps[active];
  return(<div style={{paddingBottom:40}}>
    <div style={{background:`linear-gradient(135deg,#FDF6E3,#F3EDD8)`,borderBottom:`2px solid ${T.border}`,padding:"20px 20px 14px"}}>
      <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:T.text,margin:"0 0 4px"}}>🗺️ Mind Maps</h2>
      <p style={{fontSize:13,color:T.textSoft,margin:"0 0 12px"}}>Visual concept clusters for holistic understanding</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.entries(maps).map(([k,v])=><Pill key={k} text={v.label} active={active===k} color={T.gold} onClick={()=>setActive(k)}/>)}
      </div>
    </div>
    <div style={{padding:"18px 20px",maxWidth:680,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{display:"inline-block",padding:"14px 24px",borderRadius:99,background:`linear-gradient(135deg,${T.gold},${T.goldLt})`,color:"#fff",boxShadow:`0 4px 18px ${T.gold}40`}}>
          <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:18,fontWeight:900}}>{m.center.text}</div>
          <div style={{fontSize:11,opacity:0.85}}>{m.center.sub}</div>
        </div>
        <div style={{fontSize:16,color:T.textSoft,margin:"6px 0"}}>↕</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {m.nodes.map((node,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{minWidth:130,padding:"10px 12px",borderRadius:10,background:node.color+"18",border:`2px solid ${node.color}44`,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:700,color:node.color}}>{node.label}</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingTop:5}}>
              {node.items.map((it,j)=>(
                <span key={j} style={{fontSize:12,padding:"4px 10px",borderRadius:6,background:node.color+"14",color:T.textMid,border:`1px solid ${node.color}30`,fontFamily:"'Palatino Linotype',Georgia,serif"}}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>);
}

/* ── PROGRESS SCREEN ─────────────────────────────────────────────────────── */
function ProgressScreen({scores,completed,totalXP,streak}){
  const tc=CHAPTERS.length;
  return(<div style={{paddingBottom:40}}>
    <div style={{background:`linear-gradient(135deg,#FDF6E3,#F3EDD8)`,borderBottom:`2px solid ${T.border}`,padding:"20px 20px 14px"}}>
      <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:T.text,margin:"0 0 4px"}}>📈 Your Progress</h2>
      <p style={{fontSize:13,color:T.textSoft,margin:0}}>Track mastery across all 12 chapters</p>
    </div>
    <div style={{padding:"18px 20px",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:20}}>
        {[{v:`${completed.size}/${tc}`,l:"Chapters",c:T.gold},{v:`${totalXP} XP`,l:"Experience",c:T.green},{v:`🔥 ${streak}`,l:"Day Streak",c:T.saffron},{v:`${Object.keys(scores).length*4}`,l:"Qs Answered",c:T.blue}].map(s=>(
          <div key={s.l} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:14,boxShadow:T.shadow}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:12,color:T.textSoft}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",marginBottom:18,boxShadow:T.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:700,color:T.text}}>Overall Mastery</span>
          <span style={{fontSize:13,color:T.gold,fontWeight:700}}>{Math.round((completed.size/tc)*100)}%</span>
        </div>
        <PBar value={completed.size} max={tc} color={T.gold} h={10}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {CHAPTERS.map(ch=>{const s=scores[ch.id]||0;const done=completed.has(ch.id);
          return(<div key={ch.id} style={{background:T.bgCard,border:`1.5px solid ${done?ch.color:T.border}`,borderRadius:10,padding:"12px 14px",boxShadow:T.shadow,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20,minWidth:26}}>{ch.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.title}</span>
                <span style={{fontSize:11,color:ch.color,fontWeight:700,flexShrink:0,marginLeft:8}}>{s}/{ch.quiz.length}</span>
              </div>
              <PBar value={s} max={ch.quiz.length} color={ch.color} h={4}/>
            </div>
            {done&&<span style={{fontSize:16,flexShrink:0}}>✅</span>}
          </div>);
        })}
      </div>
    </div>
  </div>);
}

/* ── GLOSSARY SCREEN ─────────────────────────────────────────────────────── */
function GlossaryScreen(){
  const[q,setQ]=useState("");const[catF,setCatF]=useState("all");
  const all=CHAPTERS.flatMap(ch=>ch.concepts.map(c=>({...c,chTitle:ch.title,chColor:ch.color})));
  const cats=[...new Set(all.map(t=>t.cat))].sort();
  const filtered=all.filter(t=>{
    const mq=q===""||t.term.toLowerCase().includes(q.toLowerCase())||t.meaning.toLowerCase().includes(q.toLowerCase());
    return mq&&(catF==="all"||t.cat===catF);
  });
  return(<div style={{paddingBottom:40}}>
    <div style={{background:`linear-gradient(135deg,#FDF6E3,#F3EDD8)`,borderBottom:`2px solid ${T.border}`,padding:"20px 20px 14px"}}>
      <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:T.text,margin:"0 0 4px"}}>📖 Glossary</h2>
      <p style={{fontSize:13,color:T.textSoft,margin:"0 0 12px"}}>{all.length} terms across all 12 chapters</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms or meanings…" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.bgCard,fontSize:14,color:T.text,outline:"none",boxSizing:"border-box"}}/>
    </div>
    <div style={{padding:"14px 20px 0",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
        <Pill text="All" active={catF==="all"} color={T.gold} onClick={()=>setCatF("all")}/>
        {cats.map(c=><Pill key={c} text={c} active={catF===c} color={CAT_C[c]||T.gold} onClick={()=>setCatF(c===catF?"all":c)}/>)}
      </div>
      <div style={{fontSize:12,color:T.textSoft,marginBottom:10}}>{filtered.length} results</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((t,i)=>{const cc=CAT_C[t.cat]||T.textMid;return(
          <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderLeft:`3px solid ${cc}`,borderRadius:10,padding:"12px 14px",boxShadow:T.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,fontWeight:700,color:T.text}}>{t.term}</span>
                {t.sutra&&<span style={{fontSize:10,color:T.textSoft,fontStyle:"italic"}}>({t.sutra})</span>}
              </div>
              <Badge text={t.cat} color={cc}/>
            </div>
            <div style={{fontSize:13,color:T.textMid,marginBottom:5}}>{t.meaning}</div>
            <div style={{fontSize:12,color:cc,background:cc+"12",padding:"3px 8px",borderRadius:5,display:"inline-block",fontFamily:"'Palatino Linotype',Georgia,serif"}}>{t.example}</div>
            <div style={{fontSize:10,color:T.textSoft,marginTop:4}}>→ {t.chTitle}</div>
          </div>
        );})}
      </div>
    </div>
  </div>);
}

/* ── CHAPTER DETAIL ──────────────────────────────────────────────────────── */
function ChapterDetail({ch,scores,completed,onScore,onXP,onBack}){
  const[tab,setTab]=useState("concepts");
  const chScore=scores[ch.id]||0;const isDone=completed.has(ch.id);
  const TABS=[{k:"concepts",l:"📚 Concepts"},{k:"flashcards",l:"🃏 Flashcards"},{k:"quiz",l:"❓ Quiz"},{k:"test",l:"📋 Test"},{k:"vedic",l:"📜 Vedic"},{k:"watch",l:"📺 Watch"}];
  return(<div style={{minHeight:"100vh",background:T.bg}}>
    <div style={{background:`linear-gradient(135deg,${ch.accent},#FDF6E3)`,borderBottom:`2px solid ${ch.color}44`}}>
      <div style={{maxWidth:680,margin:"0 auto",padding:"14px 18px 0"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.textSoft,cursor:"pointer",fontSize:13,padding:"0 0 10px"}}>← Back</button>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",paddingBottom:4}}>
          <div style={{width:48,height:48,borderRadius:12,background:T.bgCard,border:`2px solid ${ch.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadow,flexShrink:0}}>{ch.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:ch.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>CH {ch.num}</div>
            <h1 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:"clamp(15px,4vw,20px)",fontWeight:900,color:T.text,margin:"0 0 3px"}}>{ch.title}</h1>
            <p style={{fontSize:12,color:T.textMid,margin:"0 0 6px"}}>{ch.subtitle}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:T.bgDeep,color:T.textMid}}>📚 {ch.concepts.length}</span>
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:T.bgDeep,color:T.textMid}}>❓ {ch.quiz.length}</span>
              {isDone&&<span style={{fontSize:11,color:"#2A5C39",background:"#E8F5EA",padding:"2px 8px",borderRadius:99,border:"1px solid #4A7C59",fontWeight:700}}>✅ Mastered</span>}
              {chScore>0&&<span style={{fontSize:11,background:`linear-gradient(90deg,${T.gold},${T.goldLt})`,color:"#fff",padding:"2px 10px",borderRadius:99,fontWeight:700}}>+{chScore*15} XP</span>}
            </div>
          </div>
        </div>
        {chScore>0&&<div style={{margin:"8px 0 0"}}><PBar value={chScore} max={ch.quiz.length} color={ch.color} h={5}/></div>}
        <div style={{display:"flex",gap:2,marginTop:12,overflowX:"auto",paddingBottom:0}}>
          {TABS.map(tb=>(
            <button key={tb.k} onClick={()=>setTab(tb.k)} style={{padding:"7px 11px",borderRadius:"8px 8px 0 0",border:`1px solid ${tab===tb.k?ch.color:T.border}`,borderBottom:tab===tb.k?`2px solid ${T.bg}`:`1px solid ${T.border}`,background:tab===tb.k?T.bg:T.bgAlt,color:tab===tb.k?ch.color:T.textMid,fontSize:11,fontWeight:tab===tb.k?700:500,cursor:"pointer",whiteSpace:"nowrap",marginBottom:tab===tb.k?-1:0,transition:"all 0.15s"}}>{tb.l}</button>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:680,margin:"0 auto",padding:"18px 18px 40px"}}>
      {tab==="concepts"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {ch.concepts.map((c,i)=>{const cc=CAT_C[c.cat]||T.textMid;return(
          <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderLeft:`4px solid ${cc}`,borderRadius:10,padding:"14px 16px",boxShadow:T.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8}}>
              <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:15,fontWeight:800,color:T.text}}>{c.term}</span>
              <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <Badge text={c.cat} color={cc}/>
                {c.sutra&&<Badge text={c.sutra} color={T.gold}/>}
              </div>
            </div>
            <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:8}}>{c.meaning}</div>
            <div style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:13,color:cc,padding:"5px 10px",background:cc+"14",borderRadius:7,borderBottom:`2px solid ${cc}30`,display:"inline-block"}}>{c.example}</div>
          </div>
        );})}
      </div>}
      {tab==="flashcards"&&<div>
        <p style={{fontSize:13,color:T.textSoft,margin:"0 0 14px"}}>Tap each card to flip. Test yourself before the quiz!</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {ch.concepts.map((c,i)=><FlipCard key={i} concept={c}/>)}
        </div>
      </div>}
      {tab==="quiz"&&<div>
        <p style={{fontSize:13,color:T.textSoft,margin:"0 0 14px"}}>Score ≥75% to mark chapter mastered</p>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:20,boxShadow:T.shadow}}>
          <QuizView chapter={ch} onScore={(s,t)=>onScore(s,t,ch.id)}/>
        </div>
      </div>}
      {tab==="test"&&<div>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:20,boxShadow:T.shadow}}>
          <LevelTest chapter={ch} onXP={xp=>onXP&&onXP(xp)}/>
        </div>
      </div>}
      {tab==="vedic"&&<div>
        <p style={{fontSize:13,color:T.textSoft,margin:"0 0 14px"}}>Vedic verses & śrutis that connect grammar to sacred tradition</p>
        <VedicSection chId={ch.id}/>
      </div>}
      {tab==="watch"&&<div style={{textAlign:"center",padding:"28px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>📺</div>
        <h3 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:18,color:T.text,margin:"0 0 8px"}}>Watch: {ch.title}</h3>
        <p style={{fontSize:13,color:T.textMid,lineHeight:1.7,margin:"0 0 18px",maxWidth:440,marginLeft:"auto",marginRight:"auto"}}>Lectures by <strong>Pushpa Dikshit</strong> · <em>Aṣṭādhyāyī Sahajabodha</em> · Pauspi Prakriyā method — designed to teach Pāṇini's grammar in 6–10 months.</p>
        <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 26px",borderRadius:99,background:"#FF0000",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:"0 4px 16px rgba(255,0,0,0.3)"}}>▶ Open YouTube Playlist</a>
        <div style={{marginTop:16,fontSize:11,color:T.textSoft,fontFamily:"'Palatino Linotype',Georgia,serif"}}>ॐ पाणिनये नमः</div>
      </div>}
    </div>
  </div>);
}

/* ── HOME SCREEN ─────────────────────────────────────────────────────────── */
function HomeScreen({scores,completed,totalXP,streak,onOpen}){
  const next=CHAPTERS.find(ch=>!completed.has(ch.id));
  const inProg=CHAPTERS.filter(ch=>scores[ch.id]&&!completed.has(ch.id)).slice(0,3);
  return(<div style={{paddingBottom:40}}>
    <div style={{background:"linear-gradient(160deg,#FDF6E3,#F0E6C8 50%,#FDF6E3)",borderBottom:`2px solid ${T.border}`,padding:"28px 20px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",border:`2px solid ${T.gold}20`,background:`radial-gradient(circle,${T.gold}08,transparent 70%)`}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"inline-flex",width:66,height:66,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},#E8C97A)`,alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:`0 8px 24px ${T.gold}50`,marginBottom:12}}>🕉️</div>
        <h1 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:"clamp(18px,5vw,28px)",fontWeight:900,color:T.text,margin:"0 0 4px"}}>Aṣṭādhyāyī Sahajabodha</h1>
        <p style={{fontSize:13,color:T.textMid,margin:"0 0 16px"}}>Pāṇini's Sanskrit Grammar · Pauspi Prakriyā · 12 Chapters</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
          {[{v:`${completed.size}/${CHAPTERS.length}`,l:"Chapters",c:T.gold},{v:`${totalXP} XP`,l:"Points",c:T.green},{v:`🔥 ${streak}`,l:"Streak",c:T.saffron}].map(s=>(
            <div key={s.l} style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:T.textSoft}}>{s.l}</div></div>
          ))}
        </div>
      </div>
    </div>
    <div style={{padding:"18px 18px 0",maxWidth:680,margin:"0 auto"}}>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSoft,marginBottom:5}}>
          <span>Overall Progress</span><span style={{color:T.gold,fontWeight:700}}>{Math.round((completed.size/CHAPTERS.length)*100)}%</span>
        </div>
        <PBar value={completed.size} max={CHAPTERS.length} color={T.gold} h={10}/>
      </div>
      {next&&<div style={{marginBottom:18}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.textSoft,letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>Continue Learning</h3>
        <button onClick={()=>onOpen(next)} style={{width:"100%",background:T.bgCard,border:`2px solid ${next.color}`,borderRadius:14,padding:"14px 16px",textAlign:"left",cursor:"pointer",boxShadow:`0 4px 18px ${next.color}25`,display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:28}}>{next.icon}</span>
          <div style={{flex:1}}><div style={{fontSize:9,color:next.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>{next.num}</div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{next.title}</div><div style={{fontSize:12,color:T.textSoft}}>{next.subtitle}</div></div>
          <span style={{fontSize:18,color:next.color}}>→</span>
        </button>
      </div>}
      {inProg.length>0&&<div style={{marginBottom:18}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.textSoft,letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>In Progress</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {inProg.map(ch=>(
            <button key={ch.id} onClick={()=>onOpen(ch)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",textAlign:"left",cursor:"pointer",boxShadow:T.shadow,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{ch.icon}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:4}}>{ch.title}</div><PBar value={scores[ch.id]||0} max={ch.quiz.length} color={ch.color} h={4}/></div>
              <span style={{fontSize:11,color:ch.color,fontWeight:700}}>{scores[ch.id]||0}/{ch.quiz.length}</span>
            </button>
          ))}
        </div>
      </div>}
      <h3 style={{fontSize:11,fontWeight:700,color:T.textSoft,letterSpacing:1.5,textTransform:"uppercase",margin:"0 0 8px"}}>All 12 Chapters</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
        {CHAPTERS.map((ch,i)=>{const done=completed.has(ch.id);const locked=i>0&&!completed.has(CHAPTERS[i-1].id)&&!scores[ch.id];
          return(<button key={ch.id} onClick={()=>!locked&&onOpen(ch)} style={{background:done?ch.accent:T.bgCard,border:`1.5px solid ${done?ch.color:T.border}`,borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:locked?"not-allowed":"pointer",opacity:locked?0.4:1,boxShadow:T.shadow}}>
            <div style={{fontSize:17,marginBottom:2}}>{locked?"🔒":ch.icon}</div>
            <div style={{fontSize:8,color:ch.color,fontWeight:700}}>{ch.num}</div>
            {done&&<div style={{fontSize:11,marginTop:1}}>✅</div>}
          </button>);
        })}
      </div>
      <div style={{marginTop:20,background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:14,textAlign:"center"}}>
        <div style={{fontSize:12,color:T.textSoft,marginBottom:5}}>🙏 Based on <strong style={{color:T.textMid}}>Pushpa Dikshit</strong>'s Aṣṭādhyāyī Sahajabodha</div>
        <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:T.saffron,textDecoration:"none",fontWeight:700}}>🎬 Watch Full Playlist →</a>
        <div style={{fontSize:11,color:T.textSoft,marginTop:5,fontFamily:"'Palatino Linotype',Georgia,serif"}}>ॐ पाणिनये नमः — Ohm Pannini namah</div>
      </div>
    </div>
  </div>);
}

/* ── ROOT APP ────────────────────────────────────────────────────────────── */
export default function App(){
  const[nav,setNav]=useState("home");
  const[activeChap,setActiveChap]=useState(null);
  const[scores,setScores]=useState({});
  const[totalXP,setTotalXP]=useState(0);
  const[completed,setCompleted]=useState(new Set());
  const[streak]=useState(3);

  function openChapter(ch){setActiveChap(ch);setNav("chapter");}
  function handleScore(score,total,chId){
    setScores(s=>({...s,[chId]:Math.max(s[chId]||0,score)}));
    setTotalXP(x=>x+score*15);
    if(score>=Math.ceil(total*0.75))setCompleted(s=>new Set([...s,chId]));
  }
  function addXP(xp){setTotalXP(x=>x+xp);}

  const NAV=[
    {id:"home",    icon:"🏠", label:"Home"},
    {id:"chapters",icon:"📚", label:"Chapters"},
    {id:"sounds",  icon:"🔊", label:"Sounds"},
    {id:"mindmap", icon:"🗺️", label:"Maps"},
    {id:"progress",icon:"📈", label:"Progress"},
    {id:"glossary",icon:"📖", label:"Glossary"},
  ];

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Trebuchet MS',Verdana,sans-serif",display:"flex",flexDirection:"column"}}>
    {/* TOP NAV */}
    <nav style={{position:"sticky",top:0,zIndex:100,background:T.bgCard,borderBottom:`2px solid ${T.border}`,boxShadow:`0 2px 10px rgba(44,26,14,0.08)`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",height:52}}>
      <button onClick={()=>setNav("home")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}>
        <span style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${T.gold},#E8C97A)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🕉️</span>
        <span style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:13,fontWeight:800,color:T.text}}>Aṣṭādhyāyī</span>
      </button>
      <div style={{display:"flex",gap:1,overflowX:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>{setNav(n.id);if(n.id!=="chapter")setActiveChap(null);}} style={{padding:"4px 8px",borderRadius:8,border:"none",background:nav===n.id?T.bgAlt:"none",color:nav===n.id?T.gold:T.textMid,fontSize:10,fontWeight:nav===n.id?700:500,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
            <span style={{fontSize:14}}>{n.icon}</span>
            <span style={{fontSize:8}}>{n.label}</span>
          </button>
        ))}
      </div>
      <div style={{padding:"4px 10px",borderRadius:99,background:T.bgAlt,border:`1px solid ${T.border}`,fontSize:11,color:T.textMid,fontWeight:700,flexShrink:0}}>⭐{totalXP}</div>
    </nav>
    {/* BREADCRUMB */}
    {nav==="chapter"&&activeChap&&(
      <div style={{background:T.bgAlt,borderBottom:`1px solid ${T.border}`,padding:"5px 18px",display:"flex",alignItems:"center",gap:5,fontSize:12,color:T.textSoft}}>
        <button onClick={()=>{setNav("chapters");setActiveChap(null);}} style={{background:"none",border:"none",cursor:"pointer",color:T.textSoft,fontSize:12,padding:0}}>📚 Chapters</button>
        <span>›</span>
        <span style={{color:T.textMid,fontWeight:600}}>{activeChap.icon} {activeChap.title}</span>
      </div>
    )}
    {/* MAIN */}
    <main style={{flex:1,overflowY:"auto"}}>
      {nav==="home"&&<HomeScreen scores={scores} completed={completed} totalXP={totalXP} streak={streak} onOpen={openChapter}/>}
      {nav==="chapters"&&!activeChap&&(
        <div style={{paddingBottom:40}}>
          <div style={{background:`linear-gradient(135deg,#FDF6E3,#F3EDD8)`,borderBottom:`2px solid ${T.border}`,padding:"20px 20px 14px"}}>
            <h2 style={{fontFamily:"'Palatino Linotype',Georgia,serif",fontSize:20,fontWeight:800,color:T.text,margin:"0 0 3px"}}>All Chapters</h2>
            <p style={{fontSize:13,color:T.textSoft,margin:0}}>12 modules · Aṣṭādhyāyī Sahajabodha</p>
          </div>
          <div style={{padding:"16px 18px",maxWidth:680,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>
            {CHAPTERS.map((ch,i)=>{const done=completed.has(ch.id);const cs=scores[ch.id]||0;const locked=i>0&&!completed.has(CHAPTERS[i-1].id)&&!scores[ch.id];
              return(<button key={ch.id} onClick={()=>!locked&&openChapter(ch)} style={{background:locked?"#F8F4EC":T.bgCard,border:`1.5px solid ${done?ch.color:T.border}`,borderRadius:14,padding:14,textAlign:"left",cursor:locked?"not-allowed":"pointer",opacity:locked?0.55:1,boxShadow:done?`0 4px 14px ${ch.color}25`:T.shadow}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:22}}>{locked?"🔒":ch.icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:9,color:ch.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>{ch.num}</div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{ch.title}</div></div>
                  {done&&<span style={{fontSize:15}}>✅</span>}
                </div>
                <div style={{fontSize:11,color:T.textSoft,marginBottom:8}}>{ch.subtitle}</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textSoft}}>
                  <span>📚 {ch.concepts.length} terms</span><span>❓ {ch.quiz.length} Qs</span>
                  {cs>0&&<span style={{color:ch.color,fontWeight:700}}>🏅 {cs*15} XP</span>}
                </div>
                {cs>0&&<div style={{marginTop:7}}><PBar value={cs} max={ch.quiz.length} color={ch.color} h={4}/></div>}
              </button>);
            })}
          </div>
        </div>
      )}
      {nav==="chapter"&&activeChap&&<ChapterDetail ch={activeChap} scores={scores} completed={completed} onScore={handleScore} onXP={addXP} onBack={()=>{setNav("chapters");setActiveChap(null);}}/>}
      {nav==="sounds"&&<SoundsScreen/>}
      {nav==="mindmap"&&<MindMapScreen/>}
      {nav==="progress"&&<ProgressScreen scores={scores} completed={completed} totalXP={totalXP} streak={streak}/>}
      {nav==="glossary"&&<GlossaryScreen/>}
    </main>
    {/* BOTTOM TAB BAR */}
    <div style={{position:"sticky",bottom:0,zIndex:100,background:T.bgCard,borderTop:`2px solid ${T.border}`,display:"flex",boxShadow:"0 -2px 10px rgba(44,26,14,0.07)"}}>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>{setNav(n.id);if(n.id!=="chapter")setActiveChap(null);}} style={{flex:1,padding:"7px 4px",border:"none",background:nav===n.id?T.bgAlt:T.bgCard,borderTop:nav===n.id?`2px solid ${T.gold}`:"2px solid transparent",color:nav===n.id?T.gold:T.textSoft,fontSize:10,fontWeight:nav===n.id?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,transition:"all 0.15s"}}>
          <span style={{fontSize:15}}>{n.icon}</span>
          <span style={{fontSize:8}}>{n.label}</span>
        </button>
      ))}
    </div>
  </div>);
}
