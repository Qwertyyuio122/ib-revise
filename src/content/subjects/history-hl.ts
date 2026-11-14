import type { SubjectPack } from '../schemas';

export const historyHlPack: SubjectPack = {
  subject: {
    slug: 'hist',
    name: 'History',
    level: 'HL',
    syllabusFirstAssessment: '2020',
    themeTokens: {
      wash1: 'rgba(253,230,138,0.52)',
      wash2: 'rgba(254,215,170,0.48)',
      wash3: 'rgba(241,245,249,0.5)',
      accent: '#B45309',
      soft: '#FFFBEB',
      cardGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FED7AA 50%, #F1F5F9 100%)',
    },
    iaConfig: {
      iaLabel: 'History IA',
      iaTitle: 'Historical Investigation',
      maxMarks: 25,
      wordOrTimeLimit: '2,200 words max',
      weightPercent: 20,
      steps: [
        'Section A: Evaluate 2 sources',
        'Section B: Investigation',
        'Section C: Reflection',
      ],
      criteria: [
        {
          code: 'A',
          name: 'Identification and evaluation of sources',
          maxMarks: 6,
          weightPercent: 24,
          summary:
            'Clearly state an appropriate focused research question and evaluate two key sources (one primary, one secondary recommended) explicitly using Origin, Purpose, and Content to assess Value and Limitations (OPCVL).',
          topBandExpectations: [
            'Research question is sharply bounded by time period, place, and causal/evaluative scope.',
            'Two relevant sources are identified and analyzed explicitly for two values and two limitations each tied to Origin, Purpose, and Content.',
            'Values and limitations are directly linked to the specific investigation rather than generic source-type generalizations.',
          ],
          commonPitfalls: [
            'Describing what a source says without evaluating how its origin or purpose creates value or limitation for the RQ.',
            'Using generic phrases like "this secondary source is biased because the author was not there".',
          ],
        },
        {
          code: 'B',
          name: 'Investigation',
          maxMarks: 15,
          weightPercent: 60,
          summary:
            'Present a structured, evidence-rich critical analysis that addresses the research question using multiple historical perspectives and primary/secondary evidence.',
          topBandExpectations: [
            'Coherent thematic or analytical organization rather than chronological narrative storytelling.',
            'Specific factual evidence (dates, statistics, archival decrees, named historians) integrated into every paragraph.',
            'Explicit engagement with competing historiographical interpretations (e.g., Intentionalist vs. Structuralist, Orthodox vs. Revisionist) leading to a reasoned conclusion.',
          ],
          commonPitfalls: [
            'Narrative drift: recounting events chronologically instead of analyzing why or to what extent.',
            'Name-dropping historians without explaining the evidence or reasoning behind their interpretation.',
          ],
        },
        {
          code: 'C',
          name: 'Reflection',
          maxMarks: 4,
          weightPercent: 16,
          summary:
            'Reflect on what carrying out the historical investigation revealed about the methods used by historians and the challenges they face.',
          topBandExpectations: [
            'Explicitly connects the student’s own experience with archival gaps, translation bias, censorship, or hindsight to the wider methodology of historians.',
            'Addresses how historians select, corroborate, and weigh conflicting evidence.',
          ],
          commonPitfalls: [
            'Writing a personal diary about time management or library struggles instead of historiographical methodology.',
          ],
        },
      ],
      exemplarTitle:
        'To what extent was the failure of the 1905 Russian Revolution primarily caused by the loyalty of the Imperial army rather than the division of opposition groups?',
      exemplarResearchQuestion:
        'To what extent was the survival of the Tsarist autocracy in 1905–1906 determined by military coercion rather than the October Manifesto’s fracturing of the liberal-socialist coalition?',
      exemplarScore: '23 / 25 (Band 7)',
      exemplarSections: [
        {
          sectionTitle: 'Section A: OPCVL Evaluation of Sergei Witte’s Memoirs (1921)',
          excerptMarkdown:
            '**Origin & Purpose:** Written by Count Sergei Witte in exile between 1907 and 1912 and published posthumously in 1921, *The Memoirs of Count Witte* sought to vindicate his authorship of the October Manifesto while attributing the regime’s crisis to Nicholas II’s vacillation.\n\n**Value & Limitation:** Its origin gives exceptional **value** because Witte served as Chairman of the Council of Ministers during October 1905 and recorded direct cabinet deliberations on whether concessions could detach the Zemstvo liberals (*Kadets*) from revolutionary workers. However, its apologetic **purpose** introduces a clear **limitation**: Witte systematically downplays the role of Pyotr Durnovo’s ruthless military punitive expeditions along the Trans-Siberian Railway in December 1905 so as to credit his own constitutional strategy for saving the dynasty.',
          examinerCommentary:
            'Earns 6/6 on Criterion A by tying Origin and Purpose directly to concrete values and limitations for answering the 1905 survival question.',
          criterionRef: 'A',
        },
        {
          sectionTitle: 'Section B: Analytical Paragraph — Liberal Defection vs. Military Suppression',
          excerptMarkdown:
            'While Abraham Ascher emphasizes that the October Manifesto successfully split Pavel Milyukov’s liberals from the St. Petersburg Soviet, political concessions alone did not disarm the Moscow uprising or peasant jacqueries. As Orlando Figes demonstrates, between December 1905 and April 1906, over 15,000 workers and peasants were executed and 45,000 deported by Semyonovsky Guard and Cossack punitive detachments. Once the Treaty of Portsmouth (September 1905) ended the Russo-Japanese War and Witte secured the 2.25-billion-franc French loan in April 1906, the regime possessed both the fiscal solvency and loyal regiments needed to crush urban barricades.',
          examinerCommentary:
            'Synthesizes Ascher’s liberal-fracture thesis with Figes’s coercion statistics and fiscal context, demonstrating top-band Criterion B counter-argumentation.',
          criterionRef: 'B',
        },
      ],
    },
    spotlight: {
      title: 'History HL Essay & Source Architecture',
      pills: [
        { label: 'Paper 1 OPCVL Source Drills', href: '/tools/opcvl-trainer' },
        { label: 'Paper 2 & 3 Comparative Essays', href: '/questions?subject=hist&paper=Paper+2' },
        { label: 'Historiography Schools', href: '/tools/opcvl-trainer?tab=historiography' },
        { label: 'Timeline Builder', href: '/tools/opcvl-trainer?tab=timeline' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description: 'Paper 1 OPCVL source sets & Paper 2/3 essay prompts',
        bgHex: '#FFFBEB',
        colorHex: '#B45309',
        href: '/questions?subject=hist',
        iconName: 'questionbank',
      },
      {
        title: 'OPCVL Source Trainer',
        description: 'Drills on Origin, Purpose, Content, Value & Limitation',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/tools/opcvl-trainer',
        iconName: 'opcvl',
      },
      {
        title: 'Essay Outline Builder',
        description: 'Structure thesis + counter-arguments + historian quotes',
        bgHex: '#EFF6FF',
        colorHex: '#2563EB',
        href: '/tools/opcvl-trainer?tab=essay-builder',
        iconName: 'outline',
      },
      {
        title: 'Teach Sprout',
        description: 'Defend causal arguments & historical perspectives aloud',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/tools/teach-sprout?subject=hist',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Timed 45-minute essay & 1-hour Paper 1 practice',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/questions?subject=hist&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Fix narrative drift & weak historiographical links',
        bgHex: '#FEF2F2',
        colorHex: '#DC2626',
        href: '/questions?subject=hist&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'Historiography Timelines',
        description: 'Orthodox, Revisionist & Post-Revisionist schools',
        bgHex: '#FEF9C3',
        colorHex: '#CA8A04',
        href: '/tools/opcvl-trainer?tab=historiography',
        iconName: 'timeline',
      },
      {
        title: 'Study Notes',
        description: 'Authoritarian states, Cold War & HL regional topics',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/study-guides?subject=hist',
        iconName: 'study_guide',
      },
      {
        title: 'Flashcards',
        description: 'Key dates, treaties, statistics & historian names',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/flashcards?subject=hist',
        iconName: 'flashcards',
      },
      {
        title: 'AI Essay & IA Editor',
        description: 'Inline highlights, historiography comments & edits',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/essay-studio?subject=hist',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'hist-p1-ps3a',
      subjectSlug: 'hist',
      unitCode: 'Paper 1 · PS3',
      unitTitle: 'The Move to Global War (1931–1941)',
      code: 'PS3.1',
      title: 'Japanese Expansion in East Asia (1931–1941)',
      levelScope: 'SL/Core',
      recommendedHours: 20,
      guidingQuestions: [
        'How did ultranationalism, military faction politics, and the Great Depression drive the Kwantung Army’s invasion of Manchuria in 1931?',
        'Why did the League of Nations fail to halt Japanese expansion following the Lytton Report (1932) and the Marco Polo Bridge Incident (1937)?',
      ],
      understandings: [
        {
          code: 'PS3.1a',
          text: 'Causes of expansion: Meiji constitutional flaw (independence of supreme command, Tōsuiken), Zaibatsu economic dominance, Shōwa Depression (silk prices collapsed 65% in 1929–1931), and Kwantung Army resource ambitions in Manchuria.',
          isHL: false,
        },
        {
          code: 'PS3.1b',
          text: 'Key events: Mukden Incident (18 Sept 1931), establishment of Manchukuo (1932), Second Sino-Japanese War (1937), Tripartite Pact (Sept 1940), US oil freezing/embargo (July 1941), and attack on Pearl Harbor (7 Dec 1941).',
          isHL: false,
        },
        {
          code: 'PS3.1c',
          text: 'International responses: Lytton Commission report (Oct 1932), Japan’s withdrawal from the League (Feb 1933), Stimson Doctrine of non-recognition, and escalating US economic sanctions.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Japanese Expansion in East Asia (1931–1941)

#### 1. Structural & Economic Drivers
- **Constitutional Vulnerability:** Under the 1889 Meiji Constitution, the Imperial Japanese Army (IJA) and Navy (IJN) answered directly to Emperor Hirohito rather than the civilian cabinet (*Tōsuiken*), holding veto power over cabinet formation via service ministers.
- **Great Depression Impact (1929–1931):** The Smoot-Hawley Tariff (1930) and collapse of US demand caused Japanese raw silk export prices to fall by **65%**, devastating rural tenant farmers (from whom most IJA conscripts were drawn) and discrediting *Shidehara Diplomacy* (international cooperation).
- **Manchurian Lifeline:** Lt. Col. Kanji Ishiwara and Seishirō Itagaki of the Kwantung Army viewed Manchuria's coal (Fushun), iron (Anshan), and agricultural land as vital for *autarky* and total war preparation against the USSR.

#### 2. Key Escalation Milestones
1. **Mukden Incident (18 Sept 1931):** Kwantung Army officers detonated dynamite near the South Manchurian Railway and used it as a pretext to seize all of Manchuria despite Prime Minister Wakatsuki Reijirō's calls for non-expansion (*gekokujō* — insubordination from below).
2. **Lytton Report & League Withdrawal (Oct 1932 – Mar 1933):** Lord Lytton's commission condemned the invasion as unprovoked aggression while recognizing Japanese economic interests; Matsuoka Yōsuke led the Japanese delegation out of the League Assembly on 24 Feb 1933 (with formal withdrawal notice submitted on 27 March 1933).
3. **Marco Polo Bridge & Second Sino-Japanese War (July 1937):** Skirmish near Beijing escalated under PM Konoe Fumimaro into full-scale war in China, followed by the Nanjing Massacre (Dec 1937) and proclamation of the "New Order in East Asia" (1938).
4. **Northern vs. Southern Advance & Pearl Harbor (1939–1941):** After defeat by Zhukov at **Nomonhan / Khalkhin Gol (Aug 1939)**, the Strike South (*Nanshin-ron*) faction prevailed. Occupation of Southern French Indochina (July 1941) triggered the US-British-Dutch asset freeze and oil embargo (cutting 80% of Japan's oil), precipitating the Pearl Harbor strike (7 Dec 1941).

#### 3. Historiography
- **Orthodox / Tokyo War Crimes Trial View (R.J.C. Butow):** Depicts a coherent militarist conspiracy from 1931 to 1941 to conquer Asia.
- **Revisionist / Structural View (Akira Iriye, James Crowley):** Emphasizes reactive decision-making, factional rivalry between *Tōseiha* (Control) and *Kōdōha* (Imperial Way), and the breakdown of the Washington Treaty system.`,
      cheatsheetMarkdown: `- **18 Sept 1931:** Mukden Incident -> Manchukuo proclaimed (March 1932) under Puyi.
- **Oct 1932:** Lytton Report; **Feb 1933:** Japan exits League of Nations; **Stimson Doctrine** (non-recognition).
- **26 Feb 1936:** Feb 26 Incident (*Kōdōha* coup crushed -> *Tōseiha* military control consolidated).
- **7 July 1937:** Marco Polo Bridge Incident -> full Sino-Japanese War.
- **July 1941:** Japan occupies southern Indochina -> US freezes assets & embargoes oil -> **7 Dec 1941:** Pearl Harbor.`,
      blurtChecklist: [
        'Meiji Constitution Tōsuiken (supreme command independence) and gekokujō',
        'Shōwa Depression silk export collapse (65%) and Manchurian autarky',
        'Mukden Incident (18 Sept 1931) and puppet state Manchukuo (1932)',
        'Lytton Commission Report (Oct 1932) and Stimson Doctrine',
        'Marco Polo Bridge Incident (July 1937) and Nanjing (Dec 1937)',
        'US oil embargo (July 1941) after southern Indochina occupation',
      ],
    },
    {
      id: 'hist-p1-ps3b',
      subjectSlug: 'hist',
      unitCode: 'Paper 1 · PS3',
      unitTitle: 'The Move to Global War (1931–1941)',
      code: 'PS3.2',
      title: 'German and Italian Expansion (1933–1940)',
      levelScope: 'SL/Core',
      recommendedHours: 20,
      guidingQuestions: [
        'To what extent did Hitler follow a premeditated blueprint in foreign policy between 1933 and 1939?',
        'How did the Abyssinian Crisis (1935–1936) shatter the Stresa Front and realign Mussolini toward Berlin?',
      ],
      understandings: [
        {
          code: 'PS3.2a',
          text: 'Italian expansionism: Corporate State economic weaknesses, Fascist Romanita ideology, invasion of Abyssinia (Oct 1935), Hoare-Laval Pact, Rome-Berlin Axis (1936), Pact of Steel (May 1939), and invasion of Albania (April 1939).',
          isHL: false,
        },
        {
          code: 'PS3.2b',
          text: 'German foreign policy: Withdrawal from Disarmament Conference/League (1933), Conscription & Anglo-German Naval Agreement (1935), Rhineland remilitarization (March 1936), Hossbach Memorandum (Nov 1937), Anschluss (March 1938), Munich Agreement (Sept 1938), Nazi-Soviet Pact (Aug 1939), and invasion of Poland (1 Sept 1939).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### German and Italian Expansion (1933–1940)

#### 1. Mussolini's Foreign Policy & The Abyssinian Turning Point
- **Domestic & Ideological Drivers:** Following the Great Depression and the failures of the *Battle for the Lira* and *Battle for Grain*, Mussolini sought *Spazio Vitale* (vital space) and revenge for the 1896 defeat at Adowa.
- **Collapse of the Stresa Front (1935–1936):** In April 1935, Britain, France, and Italy formed the **Stresa Front** to oppose Hitler's rearmament. However, Mussolini's invasion of Abyssinia (Oct 1935), the leaked **Hoare-Laval Pact** (Dec 1935), and half-hearted League sanctions (excluding oil, coal, steel, and closure of the Suez Canal) alienated Italy from Britain/France without saving Haile Selassie.
- **Axis Alignment:** Joint intervention in the Spanish Civil War (1936–1939), the **Rome-Berlin Axis (Oct 1936)**, Italy's acceptance of the **Anschluss (March 1938)**, the **invasion of Albania (April 1939)**, and the **Pact of Steel (May 1939)** locked Italy into German hegemony.

#### 2. Hitler's Foreign Policy & Appeasement
- **Revision to Expansion:** Rearmament announcement & **Anglo-German Naval Agreement** (June 1935, allowing 35% of Royal Navy tonnage); **Remilitarization of the Rhineland** (7 March 1936) during the Abyssinian distraction; **Four-Year Plan** (1936) under Göring to prepare Germany for war within four years.
- **1938–1939 Crisis Chain:** **Anschluss** with Austria (March 1938) -> Sudetenland Crisis & **Munich Agreement** (29–30 Sept 1938) -> liquidation of rump Bohemia-Moravia (15 March 1939, ending British appeasement and prompting the Polish Guarantee) -> **Molotov-Ribbentrop Nazi-Soviet Pact** (23 Aug 1939) -> Invasion of Poland (1 Sept 1939).

#### 3. Historiography of German Expansion
- **Intentionalist (Hugh Trevor-Roper, Eberhard Jäckel):** Hitler possessed a consistent *Stufenplan* (stage-by-stage plan) rooted in *Mein Kampf* (1925) and the *Zweites Buch* (1928) aiming at *Lebensraum* in Eastern Europe.
- **Structuralist / Opportunist (A.J.P. Taylor, *The Origins of the Second World War*, 1961):** Argued Hitler was a traditional German statesman exploiting Anglo-French blunders without a rigid timetable.
- **Synthesis (Ian Kershaw, Richard Overy):** Hitler held unwavering ideological goals (*Lebensraum* and racial hegemony) while improvising tactical timing and propelled by domestic rearmament crises (Karl-Heinz Janssen / Timothy Mason economic crisis debate).`,
      cheatsheetMarkdown: `- **April 1935:** Stresa Front -> **June 1935:** Anglo-German Naval Agreement -> **Oct 1935:** Italy invades Abyssinia.
- **7 March 1936:** Rhineland remilitarized; **Oct 1936:** Rome-Berlin Axis; **Nov 1937:** Hossbach Memorandum.
- **March 1938:** Anschluss; **Sept 1938:** Munich Agreement (Sudetenland); **March 1939:** Prague occupied.
- **May 1939:** Pact of Steel; **23 Aug 1939:** Nazi-Soviet Pact; **1 Sept 1939:** Invasion of Poland.`,
      blurtChecklist: [
        'Stresa Front (April 1935) and Anglo-German Naval Agreement (June 1935)',
        'Abyssinian Crisis (Oct 1935), Hoare-Laval Pact, and missing oil sanction',
        'Rhineland remilitarization (March 1936) and Four-Year Plan',
        'Anschluss (March 1938), Munich Agreement (Sept 1938), and Prague (March 1939)',
        'Nazi-Soviet Molotov-Ribbentrop Pact (23 Aug 1939)',
        'Intentionalist (Trevor-Roper) vs Structuralist/Opportunist (A.J.P. Taylor, Overy)',
      ],
    },
    {
      id: 'hist-p2-wh10a',
      subjectSlug: 'hist',
      unitCode: 'Paper 2 · WH10',
      unitTitle: 'Authoritarian States (20th Century)',
      code: 'WH10.1',
      title: 'Emergence & Consolidation of Power: Mao Zedong & Adolf Hitler',
      levelScope: 'SL/Core',
      recommendedHours: 25,
      guidingQuestions: [
        'Compare and contrast the conditions that enabled Hitler (1933) and Mao (1949) to emerge as authoritarian leaders.',
        'Evaluate the relative importance of coercion versus persuasion/charisma in consolidating power in Nazi Germany (1933–1934) and Maoist China (1949–1957).',
      ],
      understandings: [
        {
          code: 'WH10.1a',
          text: 'Emergence conditions: Economic crisis (Great Depression 6 million unemployed in Germany vs GMD hyperinflation and rural destitution in China), war aftermath (Versailles vs Second Sino-Japanese War 1937–1945), and ideological appeal.',
          isHL: false,
        },
        {
          code: 'WH10.1b',
          text: 'Consolidation mechanisms: Legal/structural revolution (Reichstag Fire Decree, Enabling Act, Gleichschaltung, Night of the Long Knives) vs mass mobilization campaigns (Agrarian Reform Law 1950, Three/Five-Anti Campaigns, Campaign to Suppress Counter-Revolutionaries, Hundred Flowers & Anti-Rightist Campaign 1957).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Authoritarian States: Emergence & Consolidation (Hitler vs. Mao)

#### 1. Comparative Emergence of Authoritarian States
| Analytical Dimension | Adolf Hitler (Germany, 1919–1933) | Mao Zedong (China, 1921–1949) |
| :--- | :--- | :--- |
| **Route to Power** | Constitutional appointment via backroom conservative intrigue (Papen, Hindenburg, Jan 1933) backed by mass electoral growth (37.3% July 1932) | Protracted rural guerrilla insurgency & Civil War victory (Long March 1934–35, Yan'an Soviet, PLA defeat of Chiang Kai-shek's GMD 1946–49) |
| **Economic Catalyst** | Great Depression (1929): US loans recalled, unemployment hit **6 million (1932)**, collapse of Müller's Grand Coalition | GMD wartime & post-war hyperinflation (*fabì* collapse), corrupt taxation, and failure of GMD rural land reform |
| **Impact of War** | *Dolchstosslegende* (1918 defeat), Treaty of Versailles (Art. 231, 132bn gold marks), Ruhr crisis (1923) | Second Sino-Japanese War (1937–45): Operation Ichigo (1944) decimated GMD conventional forces while CCP expanded to 1.2m members |

#### 2. Consolidation of Power
- **Hitler (Jan 1933 – Aug 1934):**
  - *Legal-Terror Synthesis:* **Reichstag Fire Decree** (28 Feb 1933) suspended civil liberties under Art. 48; **Enabling Act** (23 March 1933, passed 444–94 after KPD arrests and Zentrum promises); **Gleichschaltung** (abolition of trade unions May 1933, banning of parties July 1933, Law for the Reconstruction of the Reich Jan 1934).
  - *Elite Co-option:* **Night of the Long Knives** (30 June 1934) purged Ernst Röhm's SA leadership, winning Reichswehr loyalty ahead of Hindenburg's death (2 Aug 1934) and the personal *Führereid* army oath.
- **Mao Zedong (1949–1957):**
  - *Mass Terror Campaigns:* **Agrarian Reform Law (June 1950)** mobilized peasants in *struggle sessions* (*douzhenghui*) against landlords (1–2 million executed, complicity binding the peasantry to the CCP); **Campaign to Suppress Counter-Revolutionaries (1950–51)** during the Korean War (~712,000 executed per official figures, higher in Dikötter); **Three-Anti (1951) & Five-Anti (1952)** broke urban bourgeoisie.
  - *Ideological Conformity:* **Hundred Flowers Campaign (1956–57)** invited criticism of bureaucracy, followed immediately by the **Anti-Rightist Campaign (1957)** under Deng Xiaoping that purged ~550,000 intellectuals.

#### 3. Historiography
- **Nazi Germany:** *Coercion vs. Consensus* — Karl Dietrich Bracher & Richard J. Evans (top-down totalitarian terror) vs. **Robert Gellately** & **Ian Kershaw** (selective terror against out-groups combined with widespread social consensus and *working towards the Führer*).
- **Maoist China:** **Jung Chang & Jon Halliday** (Mao ruled entirely through calculated terror) vs. **Maurice Meisner & Rebecca Karl** (genuine peasant revolutionary mobilization alongside coercive state-building) vs. **Frank Dikötter** (*The Tragedy of Liberation*: systematic terror quotas from 1949).`,
      cheatsheetMarkdown: `- **Hitler Emergence:** 1929 Depression (6m unemployed) + Brüning's Art. 48 rule + Papen/Hindenburg backstairs intrigue (30 Jan 1933).
- **Hitler Consolidation:** Reichstag Fire Decree (Feb 1933) -> Enabling Act (March 1933) -> Gleichschaltung -> Night of the Long Knives (June 1934).
- **Mao Emergence:** Long March (1934–35, Zunyi Conference) -> Yan'an Rectification -> Sino-Japanese War (1937–45) -> Civil War (1946–49).
- **Mao Consolidation:** Land Reform struggle sessions (1950) -> Three/Five-Anti (1951–52) -> Hundred Flowers & Anti-Rightist purge (1956–57).`,
      blurtChecklist: [
        'Weimar structural weaknesses (Article 48, proportional representation) and 6m unemployed',
        'Reichstag Fire Decree, Enabling Act (March 1933), and Gleichschaltung',
        'Night of the Long Knives (June 1934) and Reichswehr Führer oath',
        'Yan’an Soviet, Sino-Japanese War (Operation Ichigo), and GMD hyperinflation',
        'Agrarian Reform Law (1950) struggle sessions and Three/Five-Anti campaigns',
        'Hundred Flowers (1956) and Anti-Rightist Campaign (1957) + Gellately vs Dikötter',
      ],
    },
    {
      id: 'hist-p2-wh10b',
      subjectSlug: 'hist',
      unitCode: 'Paper 2 · WH10',
      unitTitle: 'Authoritarian States (20th Century)',
      code: 'WH10.2',
      title: 'Domestic Policies, Social Impact & Control: Hitler & Mao',
      levelScope: 'SL/Core',
      recommendedHours: 25,
      guidingQuestions: [
        'To what extent did authoritarian economic and social policies achieve their stated goals in Nazi Germany and Maoist China?',
        'Evaluate the impact of authoritarian policies on women, youth, and ethnic/political minorities.',
      ],
      understandings: [
        {
          code: 'WH10.2a',
          text: 'Economic policies: Schacht’s New Plan (Mefo bills) and Göring’s Four-Year Plan in Germany vs Mao’s First Five-Year Plan (1953–57) and Great Leap Forward (1958–62).',
          isHL: false,
        },
        {
          code: 'WH10.2b',
          text: 'Social & cultural transformation: Volksgemeinschaft, Kinder Küche Kirche vs Marriage Law (1950), youth indoctrination (Hitler Youth vs Red Guards in the Cultural Revolution 1966–76), and treatment of minorities.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Authoritarian Domestic Policies & Social Impact (Hitler vs. Mao)

#### 1. Economic Transformation & Results
- **Nazi Germany (1933–1939):**
  - **Hjalmar Schacht's *New Plan* (1934):** Bilateral trade treaties and **Mefo bills** (12 billion RM off-budget credit) cut registered unemployment from 6 million (1933) to 1.6 million (1936).
  - **Göring's *Four-Year Plan* (1936):** Shifted priority to synthetic rubber (*Buna*), fuel, and rearmament ("guns before butter"). As **Adam Tooze** (*The Wages of Destruction*) shows, Germany faced severe foreign exchange and raw material bottlenecks by 1938–39.
- **Maoist China (1952–1962):**
  - **First Five-Year Plan (1953–1957):** Soviet-assisted heavy industry (156 industrial projects); industrial output grew ~15–18% annually.
  - **Great Leap Forward (1958–1962):** Forced collectivization into 26,000 People's Communes, backyard steel furnaces, and Lysenkoist agriculture. Resulting famine killed **30–45 million people** (Frank Dikötter, Yang Jisheng), forcing Mao to yield day-to-day economic management to Liu Shaoqi and Deng Xiaoping at the **Seven Thousand Cadres Conference (1962)**.

#### 2. Women, Youth & Cultural Control
- **Women:**
  - *Hitler:* Ideological *Kinder, Küche, Kirche*, Law for the Encouragement of Marriage (1933, 1,000 RM loans), Mother's Cross. Yet labor shortages forced female employment back up to **37% of the workforce by 1939** (Tim Mason's contradiction between ideology and rearmament).
  - *Mao:* **"Women hold up half the sky"** — **1950 New Marriage Law** abolished arranged marriage, concubinage, and bride-price; female workforce participation surged, though patriarchal rural family structures and double burdens persisted during collectivization (Kay Ann Johnson).
- **Cultural Revolution (1966–1976):** Mao launched the Great Proletarian Cultural Revolution to purge "capitalist roaders" (Liu Shaoqi, Deng Xiaoping), mobilizing **Red Guards** to smash the *Four Olds* before using the PLA and the *Up to the Mountains and Down to the Countryside* campaign (17 million urban youth rusticated) to restore order.`,
      cheatsheetMarkdown: `- **Nazi Economy:** Schacht's New Plan (Mefo bills) -> Göring's Four-Year Plan (1936, autarky/rearmament; Adam Tooze critique).
- **Mao Economy:** 1st Five-Year Plan (1953–57, Soviet heavy industry) -> Great Leap Forward (1958–62, communes, 30–45m famine deaths).
- **Women:** Nazi *Kinder, Küche, Kirche* vs 1939 labor shortage; Mao's 1950 Marriage Law vs rural double burden.
- **Cultural Control:** Goebbels' RKK & Hitler Youth (compulsory 1936/39) vs Mao's Cultural Revolution (1966–76, Red Guards, Four Olds).`,
      blurtChecklist: [
        'Schacht New Plan (Mefo bills) vs Göring Four-Year Plan (1936) and Adam Tooze',
        'First Five-Year Plan (1953–57) vs Great Leap Forward (1958–62) famine (Dikötter)',
        'Nazi women policies (Marriage loans, Mother’s Cross vs 1939 labor shortage)',
        'Mao 1950 New Marriage Law vs persistence of rural patriarchy',
        'Hitler Youth / BDM and Concordat / Confessing Church (Niemöller)',
        'Great Proletarian Cultural Revolution (1966–76), Red Guards, and Liu Shaoqi purge',
      ],
    },
    {
      id: 'hist-p2-wh12',
      subjectSlug: 'hist',
      unitCode: 'Paper 2 · WH12',
      unitTitle: 'The Cold War: Superpower Tensions and Rivalries (20th Century)',
      code: 'WH12.1',
      title: 'Cold War Origins, Crises (Berlin, Korea, Cuba) & End of the Cold War',
      levelScope: 'SL/Core',
      recommendedHours: 40,
      guidingQuestions: [
        'To what extent was ideological incompatibility rather than security dilemmas responsible for the breakdown of the Grand Alliance (1945–1949)?',
        'Compare the impact of two Cold War crises from different regions on superpower relations.',
      ],
      understandings: [
        {
          code: 'WH12.1a',
          text: 'Breakdown of the Grand Alliance: Yalta & Potsdam (1945), Kennan’s Long Telegram & Novikov Telegram (1946), Truman Doctrine & Marshall Plan (1947), Cominform/Comecon, and Berlin Blockade (1948–1949).',
          isHL: false,
        },
        {
          code: 'WH12.1b',
          text: 'Cross-regional Cold War crises & Détente/End: Korean War (1950–53) and NSC-68, Berlin Wall (1961), Cuban Missile Crisis (Oct 1962), Sino-Soviet Split, Détente (SALT I, Helsinki Accords 1975), Soviet invasion of Afghanistan (1979), Reagan’s Second Cold War, and Gorbachev’s Glasnost/Perestroika/Sinatra Doctrine (1985–1991).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### The Cold War: Origins, Crises & Collapse (1945–1991)

#### 1. Origins of the Cold War (1945–1949) & Historiographical Schools
- **Key Escalation Steps:** Yalta (Feb 1945, Declaration on Liberated Europe) -> Potsdam (July–Aug 1945, atomic diplomacy & German reparations) -> Kennan's Long Telegram (Feb 1946) & Churchill's Iron Curtain Speech (March 1946) -> **Truman Doctrine (March 1947)** & **Marshall Plan / ERP (\\$13bn, June 1947)** -> **Berlin Blockade & Airlift (June 1948 – May 1949)** -> NATO (April 1949).
- **Four Historiographical Schools:**
  1. **Orthodox / Traditionalist (Arthur Schlesinger Jr., Herbert Feis):** Blames Stalin's ideological Marxism-Leninism and paranoia for violating Yalta in Poland and Eastern Europe.
  2. **Revisionist (William Appleman Williams, Walter LaFeber, Gar Alperovitz):** Argues US "Open Door" economic imperialism and Hiroshima "atomic diplomacy" provoked defensive Soviet buffer creation.
  3. **Post-Revisionist Synthesis (John Lewis Gaddis, *We Now Know*):** Dual responsibility rooted in security dilemmas, though Soviet archives harvested after 1991 confirmed Stalin's personal authoritarian ambition.
  4. **New Cold War / Third World School (Odd Arne Westad, *The Global Cold War*):** Highlights agency of Global South leaders (Kim Il-sung, Fidel Castro, Ho Chi Minh) who pulled superpowers into regional crises.

#### 2. Comparative Cross-Regional Crises
- **Berlin Blockade (1948–49) & Berlin Wall (Aug 1961):** Triggered by Western Deutschmark currency reform (1948) and East German brain drain (3.5 million fled by 1961); hardened European division into FRG/GDR while stabilizing status quo ("a wall is a hell of a lot better than a war" — JFK).
- **Korean War (1950–1953):** Kim Il-sung persuaded Stalin (after Acheson's Jan 1950 Defense Perimeter Speech and Mao's 1949 victory) to approve the 25 June 1950 invasion; globalized containment via **NSC-68** (tripling US defense budget to \\$50bn), militarized NATO, and froze Sino-US relations for two decades.
- **Cuban Missile Crisis (Oct 1962):** Khrushchev's Operation Anadyr deployed MRBMs/IRBMs to deter US invasion after Bay of Pigs (1961) and offset US Jupiter missiles in Turkey. Resolved via JFK's naval quarantine and secret Robert Kennedy–Dobrynin trade (Jupiter removal + non-invasion pledge), leading to the **1963 Hotline**, **Partial Test Ban Treaty**, and eventual **Détente**.

#### 3. End of the Cold War (1985–1991)
- **Structural Soviet Stagnation + Gorbachev's Reforms:** Brezhnev-era stagnation, the war in Afghanistan (1979–89), and falling oil prices met Mikhail Gorbachev's **Perestroika** (economic restructuring), **Glasnost** (political openness), and **Sinatra Doctrine (1989)** (abandoning the Brezhnev Doctrine), enabling the peaceful 1989 Eastern European revolutions, while Reagan's **SDI (1983)** and **Geneva/Reykjavik/INF Treaty (1987)** summits accelerated nuclear de-escalation.`,
      cheatsheetMarkdown: `- **Origins Historiography:** Orthodox (Schlesinger) vs Revisionist (Williams/Alperovitz) vs Post-Revisionist (Gaddis) vs Global South agency (Westad).
- **1947–49:** Truman Doctrine -> Marshall Plan (\\$13bn) -> Cominform -> Berlin Blockade (1948–49) -> NATO (1949).
- **Crises:** Korea (1950–53, NSC-68) | Berlin Wall (Aug 1961) | Cuba (Oct 1962, Hotline & Test Ban Treaty 1963).
- **End (1985–91):** Gorbachev's *Glasnost*, *Perestroika*, *Sinatra Doctrine* (1989) + Reagan's SDI & INF Treaty (1987).`,
      blurtChecklist: [
        'Yalta vs Potsdam (1945), Kennan Long Telegram, Truman Doctrine & Marshall Plan (1947)',
        'Orthodox (Schlesinger), Revisionist (Williams/Alperovitz), Post-Revisionist (Gaddis), and Westad',
        'Berlin Blockade (1948–49) and Berlin Wall (1961)',
        'Korean War (1950–53) and NSC-68 globalization of containment',
        'Cuban Missile Crisis (Oct 1962), Turkey Jupiters, and 1963 Test Ban Treaty',
        'Gorbachev (Glasnost, Perestroika, Sinatra Doctrine) vs Triumphalist Reagan school (Schweizer)',
      ],
    },
    {
      id: 'hist-p3-hl-euro',
      subjectSlug: 'hist',
      unitCode: 'Paper 3 · HL Europe',
      unitTitle: 'HL Regional Option: History of Europe (Sections 12, 14 & 15)',
      code: 'HL.EUR',
      title: 'Imperial Russia & Soviet Union (1855–1924) and Interwar European Dictatorships',
      levelScope: 'HL Only',
      recommendedHours: 60,
      guidingQuestions: [
        'Why did Alexander II’s Great Reforms fail to prevent the rise of revolutionary opposition, whereas the Bolsheviks succeeded in seizing and consolidating power between 1917 and 1924?',
        'To what extent did the Treaty of Versailles and Weimar structural flaws cause the collapse of German democracy by 1933?',
      ],
      understandings: [
        {
          code: 'HL.EUR.1',
          text: 'Imperial Russia to Bolshevik Consolidation (1855–1924): Emancipation Edict (1861), Witte’s industrialization, 1905 Revolution & Stolypin’s "wager on the strong", February & October 1917 Revolutions, Russian Civil War (1918–20), War Communism vs NEP (1921).',
          isHL: true,
        },
        {
          code: 'HL.EUR.2',
          text: 'Versailles Diplomacy & Interwar Europe (1919–1939): Paris Peace Treaties (Versailles, St Germain, Trianon, Sèvres/Lausanne), Locarno Honeymoon (1925), Kellogg-Briand (1928), Collective Security collapse, Mussolini’s Corporate State, and Weimar Republic (1919–1933).',
          isHL: true,
        },
      ],
      studyGuideMarkdown: `### Paper 3 HL Regional Depth: Russia (1855–1924) & Interwar Europe (1919–1939)

#### 1. Imperial Russia & The 1917 Revolutions (Section 12)
- **Alexander II's "Tsar Liberator" Paradox (1855–1881):** Emancipation of the Serfs (1861) burdened peasants with **49-year redemption payments** and *mir* (commune) control; *Zemstva* (1864) and judicial reforms raised liberal expectations without granting a national constitution, fueling *Narodnaya Volya* (People's Will), who assassinated him in 1881.
- **1905 vs. Feb 1917 vs. Oct 1917:**
  - In **1905**, the army remained predominantly loyal after the Treaty of Portsmouth, and Witte's October Manifesto detached liberals from workers.
  - In **February 1917**, WWI casualties (1.7m dead), inflation, and the **Petrograd garrison mutiny** forced Nicholas II's abdication, creating **Dual Power (*Dvoevlastie*)** between the Provisional Government (Lvov/Kerensky) and the Petrograd Soviet (Order No. 1).
  - **October 1917:** The Provisional Government's decision to stay in WWI (June Offensive), delay land reform, and the **Kornilov Affair (Aug 1917)** enabled Lenin's *April Theses* ("Peace, Bread, Land; All Power to the Soviets") and Trotsky's MRC seizure of power.
- **Bolshevik Consolidation (1918–1924):** Treaty of Brest-Litovsk (March 1918), Red victory in the Civil War (1918–20: interior railway hub, Trotsky's 5-million Red Army, White division, Cheka Red Terror), and Lenin's tactical retreat from **War Communism** to the **New Economic Policy (NEP, March 1921)** after the **Kronstadt Mutiny** and Tambov rebellion.

#### 2. Versailles Diplomacy & Weimar Germany (Sections 14 & 15)
- **Paris Peace Settlement Historiography:** **John Maynard Keynes** (*The Economic Consequences of the Peace*, 1919) condemned Versailles as a Carthaginian peace, whereas **Margaret MacMillan** (*Paris 1919*) and **Sally Marks** argue the treaty left Germany geopolitically intact and the real failure was lack of enforcement in the 1930s.
- **Stresemann Recovery (1924–1929):** Dawes Plan (1924, 800m mark US loan), Rentenmark stabilization, **Locarno Treaties (1925)**, League entry (1926), and Young Plan (1929) created a fragile recovery ("dancing on a volcano") dependent on short-term Wall Street credit.`,
      cheatsheetMarkdown: `- **Russia 1861–1917:** 1861 Emancipation (redemption payments/mir) -> 1905 (army loyal + Oct Manifesto) -> Feb 1917 (WWI + garrison mutiny + Dual Power) -> Oct 1917 (April Theses + Kornilov Affair).
- **Bolshevik Consolidation:** Brest-Litovsk (1918) -> Civil War (Trotsky's Red Army + White disunity) -> Kronstadt Mutiny (1921) -> NEP (1921).
- **Paper 3 Historiography:** Soviet School vs Liberal (Pipes: Bolshevik coup) vs Revisionist Social History (Fitzpatrick, Figes: bottom-up worker/soldier radicalization).`,
      blurtChecklist: [
        '1861 Emancipation Edict redemption payments and mir restrictions',
        'Comparison of 1905 survival vs February 1917 Petrograd garrison mutiny',
        'Dual Power (Order No. 1), Lenin’s April Theses, and Kornilov Affair (Aug 1917)',
        'Pipes (coup d’état) vs Fitzpatrick & Figes (bottom-up social revolution)',
        'War Communism vs Kronstadt Mutiny (March 1921) and New Economic Policy (NEP)',
        'Keynes vs Margaret MacMillan & Sally Marks on Treaty of Versailles (1919)',
      ],
    },
  ],
  questions: [
    {
      id: 'hist-q1-p1-mukden',
      subjectSlug: 'hist',
      topicId: 'hist-p1-ps3a',
      paper: 'Paper 1',
      questionType: 'source_opcvl',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'With reference to its origin, purpose and content, analyse the value and limitations',
      stemMarkdown:
        'With reference to its origin, purpose and content, analyse the value and limitations of **Source A** for a historian studying the international response to the Manchurian Crisis (1931–1933).',
      stimulusMarkdown:
        '**Source A:** Extract from the *Report of the Commission of Enquiry* (the Lytton Report), submitted by Lord Lytton to the League of Nations Council in Geneva on **2 October 1932**.\n\n> "Without declaration of war, a large area of what was indisputably Chinese territory has been forcibly seized and occupied by the armed forces of Japan and has, in consequence of this action, been separated from and declared independent of the rest of China. The military operations of the Japanese troops during the night of September 18th, 1931, cannot be regarded as measures of legitimate self-defence... Nevertheless, a mere restoration of the *status quo ante* would be no solution, since it would ignore the economic rights and historical interests of Japan in Manchuria."',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'val-1',
          requirement:
            'Value (Origin/Content): Official League of Nations Commission report published in October 1932 after six months of on-site investigation in Manchuria, Tokyo, and Nanjing; provides direct primary evidence of the League’s official conclusion that the Mukden Incident was not legitimate self-defense.',
          marks: 2,
        },
        {
          pointId: 'lim-1',
          requirement:
            'Limitation (Purpose/Origin): Designed as a diplomatic compromise document to preserve League unity and avoid alienating Japan or committing Britain/France to military sanctions; published in October 1932 so it cannot reveal Japan’s subsequent withdrawal from the League in February 1933 or the Tanggu Truce.',
          marks: 2,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Anchor Value in Origin, Purpose, and Content',
          explanationMarkdown:
            'Identify that Lord Lytton chaired the official League Commission of Enquiry in 1932 (**Origin**), giving historians authoritative insight into how the League sought to balance condemnation of Japanese aggression with appeasement of Japanese economic interests (**Content/Purpose**).',
        },
        {
          stepNumber: 2,
          title: 'Anchor Limitation in Diplomatic Purpose and Temporal Scope',
          explanationMarkdown:
            'Explain that because the report’s **Purpose** was to reach a negotiated conciliation acceptable to the Great Powers without triggering war, its tone softens criticism of Japanese imperialism; moreover, its **Origin** in October 1932 limits it from showing the failure of the report when Matsuoka walked out in February 1933.',
        },
      ],
      commonPitfalls: [
        'Listing Origin, Purpose, Value, and Limitation as disconnected sentences without showing how the Origin/Purpose causes the Value or Limitation.',
        'Paraphrasing the quote without evaluating its utility to a historian.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'hist-q2-p1-abyssinia',
      subjectSlug: 'hist',
      topicId: 'hist-p1-ps3b',
      paper: 'Paper 1',
      questionType: 'source_opcvl',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'With reference to its origin, purpose and content, analyse the value and limitations',
      stemMarkdown:
        'With reference to its origin, purpose and content, analyse the value and limitations of **Source B** for a historian studying the failure of collective security during the Abyssinian Crisis (1935–1936).',
      stimulusMarkdown:
        '**Source B:** Speech delivered by **Emperor Haile Selassie I of Ethiopia** to the General Assembly of the League of Nations in Geneva on **30 June 1936** *(adapted extract)*.\n\n> "I, Haile Selassie I, Emperor of Ethiopia, am here today to claim that justice which is due to my people, and the assistance promised to it eight months ago, when fifty nations asserted that aggression had been committed in violation of international treaties... What have become of the promises made to me? Fifty-two nations rejected the forces of aggression in theory, yet hesitated to impose an embargo on oil or close the Suez Canal for fear of provoking the aggressor. It is us today. It will be you tomorrow."',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'val-1',
          requirement:
            'Value (Origin/Content): Delivered by the head of state of the victim nation directly to the League Assembly in June 1936; captures the moral indictment of Article 16 sanctions and specifically identifies the critical omission of oil and the Suez Canal.',
          marks: 2,
        },
        {
          pointId: 'lim-1',
          requirement:
            'Limitation (Purpose): As a public appeal aimed at shaming the League into refusing recognition of Italian conquest and granting financial loans, it does not reveal the private Anglo-French strategic calculations (fear of pushing Mussolini into an alliance with Hitler after the Stresa Front).',
          marks: 2,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Evaluate Value via Origin and Content',
          explanationMarkdown:
            'Haile Selassie’s speech (**Origin**: 30 June 1936, after Addis Ababa fell in May 1936) provides contemporary testimony on how small nations viewed the betrayal of Article 16 collective security and pinpoints the exact economic loopholes (oil, Suez Canal).',
        },
        {
          stepNumber: 2,
          title: 'Evaluate Limitation via Purpose and Perspective',
          explanationMarkdown:
            'Because the speech’s **Purpose** is a public plea to the League Assembly for non-recognition and aid, a historian cannot rely on it alone to understand British Admiralty fears in the Mediterranean or French anxiety over German remilitarization of the Rhineland (March 1936).',
        },
      ],
      commonPitfalls: [
        'Dismissing the speech as "too emotional to be useful" instead of analyzing what its emotional purpose reveals and conceals.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'hist-q3-p2-emergence',
      subjectSlug: 'hist',
      topicId: 'hist-p2-wh10a',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 15,
      commandTerm: 'Compare and contrast',
      stemMarkdown:
        '**Compare and contrast** the conditions that gave rise to **two** authoritarian states, each chosen from a different region.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'struct-1',
          requirement:
            'Selects two valid authoritarian states from different IB regions (e.g., Hitler’s Germany in Europe and Mao’s China in Asia) and maintains an integrated comparative structure addressing both similarities (compare) and differences (contrast).',
          marks: 3,
        },
        {
          pointId: 'econ-1',
          requirement:
            'Compares economic crises: Great Depression (1929, 6 million German unemployed, collapse of Weimar coalition) vs GMD hyperinflation (*fabì* collapse) and rural land tenancy crisis in China.',
          marks: 4,
        },
        {
          pointId: 'war-1',
          requirement:
            'Compares and contrasts impact of war: WWI defeat, Treaty of Versailles (Art. 231), and *Dolchstosslegende* in Germany vs active protracted warfare during the Second Sino-Japanese War (1937–1945, Operation Ichigo) and Chinese Civil War (1946–1949).',
          marks: 4,
        },
        {
          pointId: 'pol-1',
          requirement:
            'Contrasts political/constitutional pathways and historiography: Weimar constitutional flaws (Article 48, proportional representation, Papen/Hindenburg intrigue — Kershaw) vs complete state collapse and rural guerrilla mobilization in China (Meisner, Bianco).',
          marks: 4,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Establish a Thematic Comparative Thesis (Not Two Separate Mini-Essays)',
          explanationMarkdown:
            'Group your paragraphs by **analytical theme** — (1) Impact of War, (2) Economic Collapse, (3) Political Weakness of the Existing Regime, and (4) Ideological/Social Appeal — comparing and contrasting **Hitler (Europe)** and **Mao (Asia)** inside every single paragraph.',
        },
        {
          stepNumber: 2,
          title: 'Deploy Specific Evidence and Historiography',
          explanationMarkdown:
            'Support Germany with 1932 unemployment (6 million), Article 48 decrees under Brüning, and Ian Kershaw’s analysis of conservative elite miscalculation; support China with the Second Sino-Japanese War (1937–45), Operation Ichigo (1944), GMD hyperinflation, and Lucien Bianco’s thesis on peasant nationalism.',
        },
      ],
      commonPitfalls: [
        'Writing 3 paragraphs solely on Hitler followed by 3 paragraphs solely on Mao ("block method") instead of running thematic comparison.',
        'Choosing two leaders from the same IB region (e.g., Hitler and Mussolini, both Europe).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'hist-q4-p2-consolidation',
      subjectSlug: 'hist',
      topicId: 'hist-p2-wh10b',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 15,
      commandTerm: 'Evaluate',
      stemMarkdown:
        '"The maintenance of power in authoritarian states depended more on **consent and propaganda** than on **coercion and terror**." With reference to **two** authoritarian states, **evaluate** this statement.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'thesis-1',
          requirement:
            'Articulates a nuanced evaluative thesis arguing that terror and consent operated symbiotically rather than as mutually exclusive alternatives in Hitler’s Germany and Mao’s China.',
          marks: 3,
        },
        {
          pointId: 'coercion-1',
          requirement:
            'Analyzes coercion with concrete statistics/laws: Reichstag Fire Decree, Dachau (1933), Night of the Long Knives (1934), Gestapo/SS in Germany; Agrarian Reform struggle sessions (1–2m killed, 1950), Counter-Revolutionaries campaign (712,000 executed), Anti-Rightist purge (550,000, 1957), and Cultural Revolution in China (Dikötter).',
          marks: 4,
        },
        {
          pointId: 'consent-1',
          requirement:
            'Analyzes consent, propaganda, and social policy: Goebbels’ RKK, Volksgemeinschaft, KdF (Strength Through Joy), full employment, and foreign policy triumphs (Rhineland, Anschluss); Mao’s land redistribution to 300m peasants, 1950 Marriage Law, literacy drives, and Little Red Book cult.',
          marks: 4,
        },
        {
          pointId: 'historiography-1',
          requirement:
            'Integrates historiography: Gellately and Kershaw ("selective terror" backed by popular denunciation and consensus in Germany) vs Meisner and Dikötter (participatory mass terror and ideological mobilization in China).',
          marks: 4,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Deconstruct the Coercion–Consent Dichotomy',
          explanationMarkdown:
            'Frame your opening thesis around **Robert Gellately’s** insight that Nazi terror was selective (targeting communists, Jews, and outsiders) which actively generated majority consent, whereas Mao fused mass participation with terror through rural *struggle sessions*.',
        },
        {
          stepNumber: 2,
          title: 'Weigh Shifts Over Time',
          explanationMarkdown:
            'Show that coercion peaked during initial consolidation (1933–34 in Germany; 1950–52 in China) and crisis periods (1957 Anti-Rightist, 1966–68 Cultural Revolution), while economic recovery (1934–38 in Germany; 1950–56 land reform/1st FYP in China) sustained genuine popular support.',
        },
      ],
      commonPitfalls: [
        'Asserting that citizens were 100% brainwashed or 100% terrified without differentiating social groups (workers, peasants, intellectuals, minorities).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'hist-q5-p2-coldwar-crises',
      subjectSlug: 'hist',
      topicId: 'hist-p2-wh12',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 15,
      commandTerm: 'Examine',
      stemMarkdown:
        '**Examine** the impact of **two** Cold War crises, each chosen from a different region, on the development of the Cold War.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'selection-1',
          requirement:
            'Selects two crises from different regions (e.g., Berlin Blockade 1948–49 in Europe and Korean War 1950–53 in Asia, or Cuban Missile Crisis 1962 in the Americas) and maintains focus on their *impact* on the Cold War rather than just their causes.',
          marks: 3,
        },
        {
          pointId: 'crisis-a',
          requirement:
            'Analyzes first crisis impact (e.g., Berlin Blockade 1948–49 or Korean War 1950–53): permanent division of Germany (FRG/GDR 1949) and creation of NATO; or implementation of NSC-68 (\\$50bn defense budget), globalization of containment to Asia, and Sino-US hostility.',
          marks: 6,
        },
        {
          pointId: 'crisis-b',
          requirement:
            'Analyzes second crisis impact (e.g., Cuban Missile Crisis Oct 1962): shift from brinkmanship to institutional restraint (1963 Moscow–Washington Hotline, 1963 Partial Test Ban Treaty), removal of US Jupiter missiles from Turkey, and Soviet drive for nuclear parity under Brezhnev alongside Khrushchev’s 1964 ouster.',
          marks: 6,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Focus Strictly on Impact (Consequences), Not Narrative Retelling',
          explanationMarkdown:
            'Spend no more than 2–3 sentences establishing the crisis context; dedicate 80% of each paragraph to structural impacts: alliance formation (NATO/Warsaw Pact), military spending (NSC-68), nuclear arms control (PTBT 1963), and intra-bloc fractures (Sino-Soviet Split).',
        },
        {
          stepNumber: 2,
          title: 'Contrast Escalatory vs. Stabilizing Impacts',
          explanationMarkdown:
            'Contrast how the **Korean War (1950–53)** globalized and militarized the Cold War (Gaddis), whereas the **Cuban Missile Crisis (1962)** shocked both superpowers into direct communication and paved the road to 1970s Détente.',
        },
      ],
      commonPitfalls: [
        'Spending two pages narrating the 13 days of October 1962 without analyzing post-1962 diplomatic and strategic consequences.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'hist-q6-p3-russia1917',
      subjectSlug: 'hist',
      topicId: 'hist-p3-hl-euro',
      paper: 'Paper 3',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 15,
      commandTerm: 'To what extent',
      stemMarkdown:
        '**To what extent** was the Provisional Government’s decision to continue fighting in the First World War the main cause of the October 1917 Revolution?',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'wwi-1',
          requirement:
            'Evaluates the war factor: Milyukov Note (April 1917) and Kerensky’s disastrous June Offensive (June 1917) shattered army morale, sparked the July Days, and drove soldiers/sailors toward Bolshevik anti-war platform.',
          marks: 4,
        },
        {
          pointId: 'structural-1',
          requirement:
            'Weighs competing structural & socioeconomic factors: Dual Power (*Dvoevlastie*) institutional paralysis (Petrograd Soviet Order No. 1), postponement of land redistribution until the Constituent Assembly (alienating peasants seizing estates), and urban bread/inflation crisis.',
          marks: 4,
        },
        {
          pointId: 'kornilov-1',
          requirement:
            'Analyzes the Kornilov Affair (August 1917) and Bolshevik agency: Kerensky arming the Bolshevik Red Guards to defend Petrograd, Lenin’s *April Theses* ("Peace, Bread, Land"), and Trotsky’s chairmanship of the Petrograd Soviet & Military Revolutionary Committee.',
          marks: 4,
        },
        {
          pointId: 'hist-1',
          requirement:
            'Integrates historiography: Liberal school (Richard Pipes: Lenin’s disciplined conspiratorial coup) vs Revisionist school (Orlando Figes, Sheila Fitzpatrick, Alexander Rabinowitch: Provisional Government lost legitimacy by failing to meet autonomous worker/soldier/peasant demands).',
          marks: 3,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Show Why the War Was the Catalyst That Magnified Every Other Crisis',
          explanationMarkdown:
            'Argue that continuing WWI was not merely one factor among many, but the **root constraint** that prevented the Provisional Government from stabilizing transportation, halting inflation, or conducting a land survey before the Constituent Assembly.',
        },
        {
          stepNumber: 2,
          title: 'Integrate Kornilov, Lenin/Trotsky, and Revisionist Historiography',
          explanationMarkdown:
            'Balance the structural collapse of Dual Power with the **Kornilov Affair (Aug 1917)** — which rehabilitated the Bolsheviks after the July Days — and contrast **Richard Pipes** with **Orlando Figes** and **Alexander Rabinowitch**.',
        },
      ],
      commonPitfalls: [
        'Confusing the causes of the February 1917 Revolution (fall of Nicholas II) with the October 1917 Revolution (fall of the Provisional Government).',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'hist-ref-opcvl-1',
      subjectSlug: 'hist',
      toolType: 'opcvl_source',
      category: 'Paper 1 · Move to Global War',
      title: 'Hossbach Memorandum (5 November 1937)',
      codeOrSymbol: 'PS3.2',
      payload: {
        sourceTitle:
          'Minutes recorded by Colonel Friedrich Hossbach of a secret conference in the Reich Chancellery between Adolf Hitler and his military/foreign policy chiefs (Blomberg, Fritsch, Raeder, Göring, Neurath) on 5 November 1937.',
        excerpt:
          '"The aim of German policy was to make secure and to preserve the racial community and to enlarge it. It was therefore a question of space (Lebensraum)... Germany’s problem could only be solved by means of force and this was never without attendant risk. If the Führer was still living, it was his unalterable resolve to solve Germany’s problem of space at the latest by 1943–1945, and earlier if France were incapacitated by internal crisis or war against another state."',
        origin:
          'Confidential summary written on 10 November 1937 by Hitler’s military adjutant Colonel Friedrich Hossbach from memory five days after the closed-door Reich Chancellery meeting on 5 November 1937.',
        purpose:
          'To record Hitler’s strategic directive — and press sluggish military leaders (Fritsch and Blomberg) and Foreign Minister Neurath to accelerate rearmament and accept risk in Austria and Czechoslovakia.',
        valuePoints: [
          'Origin/Purpose: Reveals private, top-level strategic deliberations among the exact decision-makers of the Third Reich rather than public propaganda.',
          'Content: Provides direct evidence of Hitler’s ideological commitment to Lebensraum by force and explicitly targets Austria and Czechoslovakia first.',
        ],
        limitationPoints: [
          'Origin: Written by Hossbach five days later without stenographic notes and never formally initialed by Hitler.',
          'Purpose (A.J.P. Taylor critique): Partly a domestic maneuver orchestrated with Göring to bypass Hjalmar Schacht and overcome Blomberg/Fritsch’s fiscal caution regarding steel quotas; the 1943–1945 timeline did not match actual events in 1938–1939.',
        ],
      },
    },
    {
      id: 'hist-ref-opcvl-2',
      subjectSlug: 'hist',
      toolType: 'opcvl_source',
      category: 'Paper 1 · Move to Global War',
      title: 'Konoe Fumimaro’s "New Order in East Asia" Proclamation (3 November 1938)',
      codeOrSymbol: 'PS3.1',
      payload: {
        sourceTitle:
          'Radio declaration by Japanese Prime Minister Prince Konoe Fumimaro on 3 November 1938, following the capture of Wuhan and Canton.',
        excerpt:
          '"What Japan seeks is the establishment of a New Order which will insure the permanent stability of East Asia... This New Order has for its foundation a tripartite relationship of mutual aid and coordination between Japan, Manchukuo, and China in political, economic, and cultural fields, so as to secure international justice, carry out joint defense against Communism, and create a new culture and economic cohesion throughout East Asia."',
        origin:
          'Official public broadcast by Prime Minister Prince Konoe Fumimaro of Japan on 3 November 1938, sixteen months into the Second Sino-Japanese War.',
        purpose:
          'To justify protracted war in China to the Japanese public, persuade Chinese collaborators (such as Wang Jingwei) to defect from Chiang Kai-shek, and signal to Western powers that the Washington Nine-Power Treaty (Open Door) was obsolete.',
        valuePoints: [
          'Origin: Official policy statement by the sitting Japanese Prime Minister demonstrating how pan-Asian and anti-Comintern rhetoric was used at the highest state level.',
          'Content: Clearly marks Japan’s formal repudiation of the Washington Treaty system in favor of an exclusive yen-bloc sphere.',
        ],
        limitationPoints: [
          'Purpose: Propagandistic framing of "mutual aid and coordination" masks harsh military occupation, economic exploitation by Zaibatsu conglomerates, and atrocities such as the Nanjing Massacre (Dec 1937).',
        ],
      },
    },
    {
      id: 'hist-ref-historiography-1',
      subjectSlug: 'hist',
      toolType: 'historiography_timeline',
      category: 'Paper 2 & Paper 3 Schools',
      title: 'Historiography Matrix: Authoritarian States, Cold War & 1917 Russia',
      codeOrSymbol: 'HIST-MATRIX',
      payload: {
        debates: [
          {
            topic: 'Nazi Foreign Policy & WWII Origins (PS3 / WH10)',
            schools: [
              {
                school: 'Intentionalist',
                historians: 'Hugh Trevor-Roper, Andreas Hillgruber, Eberhard Jäckel',
                claim:
                  'Hitler followed a consistent ideological Stufenplan (stage-by-stage blueprint) for Lebensraum laid out in Mein Kampf (1925).',
              },
              {
                school: 'Structuralist / Opportunist',
                historians: 'A.J.P. Taylor, Hans Mommsen, Martin Broszat',
                claim:
                  'Foreign expansion was improvised opportunistically or driven by polycratic rivalries and domestic rearmament bottlenecks (Tim Mason / Adam Tooze).',
              },
              {
                school: 'Synthesis ("Working Towards the Führer")',
                historians: 'Ian Kershaw, Richard Overy',
                claim:
                  'Unwavering ideological end-goals (racial empire in the East) combined with flexible tactical opportunism.',
              },
            ],
          },
          {
            topic: 'Cold War Origins & Crises (WH12)',
            schools: [
              {
                school: 'Orthodox / Traditionalist',
                historians: 'Arthur Schlesinger Jr., Herbert Feis',
                claim:
                  'Stalin’s Marxist-Leninist expansionism and violation of the Yalta accords in Poland/Eastern Europe forced defensive US containment.',
              },
              {
                school: 'Revisionist',
                historians: 'William Appleman Williams, Walter LaFeber, Gar Alperovitz',
                claim:
                  'US "Open Door" capitalist hegemony, Marshall Plan dollar diplomacy, and atomic intimidation provoked Soviet defensive buffer zones.',
              },
              {
                school: 'Post-Revisionist & Global Cold War',
                historians: 'John Lewis Gaddis (We Now Know), Odd Arne Westad',
                claim:
                  'Mutual misperception exacerbated by Stalin’s autocratic paranoia (Gaddis) and Third World revolutionary leaders pulling superpowers into regional conflicts (Westad).',
              },
            ],
          },
          {
            topic: 'Russian Revolutions of 1917 (Paper 3 Section 12)',
            schools: [
              {
                school: 'Liberal / Totalitarian',
                historians: 'Richard Pipes, Leonard Schapiro',
                claim:
                  'October 1917 was a clandestine coup d’état by Lenin’s disciplined vanguard party exploiting wartime chaos.',
              },
              {
                school: 'Revisionist Social History',
                historians: 'Sheila Fitzpatrick, Orlando Figes, Alexander Rabinowitch',
                claim:
                  'Bottom-up radicalization of Petrograd factory committees, soldiers, and peasants drove the revolution; Bolsheviks succeeded because their program matched popular demands.',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'hist-ref-outline-1',
      subjectSlug: 'hist',
      toolType: 'essay_outline',
      category: 'Paper 2 · WH10 Authoritarian States',
      title: 'Model Essay Blueprint: Emergence of Hitler vs. Mao',
      codeOrSymbol: 'WH10-OUTLINE',
      payload: {
        prompt:
          'Compare and contrast the conditions that gave rise to two authoritarian states, each chosen from a different region.',
        thesis:
          'While both Adolf Hitler in Germany (1933) and Mao Zedong in China (1949) emerged from severe economic dislocation, national humiliation in war, and the delegitimization of fragile predecessor regimes, Hitler rose through constitutional manipulation of an industrial parliamentary democracy within four years of the Great Depression, whereas Mao waged a twenty-two-year rural guerrilla insurgency amidst complete state fragmentation.',
        paragraphs: [
          {
            theme: '1. Impact of War & National Humiliation (Compare + Contrast)',
            evidence:
              'Germany: 1918 defeat, Dolchstosslegende, Versailles Art. 231 & 132bn gold marks (symbolic grievance, no foreign troops on soil after 1930). China: Second Sino-Japanese War (1937–45) actively destroyed GMD tax base and best divisions (Operation Ichigo 1944) while allowing CCP base areas to expand to 100m people (Chalmers Johnson / Lucien Bianco).',
          },
          {
            theme: '2. Economic Crisis as Catalyst (Compare + Contrast)',
            evidence:
              'Germany: Industrial/financial collapse after 1929 Wall Street Crash — US loans recalled, unemployment hit 6 million (1932), middle-class fear of communism. China: Chronic agrarian land-hunger + GMD wartime/post-war hyperinflation (fabì collapse) alienating urban salaried classes.',
          },
          {
            theme: '3. Political Weakness of Predecessor Regime & Route to Power (Contrast)',
            evidence:
              'Germany: Weimar Article 48 presidential rule (Brüning/Papen) and conservative elite miscalculation (Hindenburg appointing Hitler Jan 1933 — Kershaw). China: Military defeat of Chiang Kai-shek’s corrupt GMD in the Huaihai/Liaoshen campaigns (1948–49) by Lin Biao’s PLA.',
          },
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'hist-deck-ps3-wh10',
      subjectSlug: 'hist',
      topicId: 'hist-p1-ps3a',
      title: 'Move to Global War & Authoritarian States Key Dates & Historians',
      description:
        'High-yield Paper 1 (Japan/Germany/Italy) and Paper 2 (Hitler & Mao) dates, treaties, statistics, and historiography.',
      cards: [
        {
          id: 'hist-fc-1',
          frontMarkdown: 'What was **Tōsuiken** under the 1889 Meiji Constitution and why did it matter in 1931?',
          backMarkdown:
            'The **independence of the supreme command**: the Imperial Japanese Army and Navy answered directly to the Emperor rather than the civilian Prime Minister, enabling the Kwantung Army to stage the **Mukden Incident (18 Sept 1931)** via *gekokujō* (insubordination from below).',
          tags: ['Paper 1', 'Japan', 'PS3.1'],
        },
        {
          id: 'hist-fc-2',
          frontMarkdown: 'What were the key findings and limitations of the **Lytton Report (October 1932)**?',
          backMarkdown:
            'Chaired by Lord Lytton, it rejected Japan’s claim that the Mukden Incident was self-defense and labeled Manchukuo a puppet state, **but** acknowledged Japanese economic grievances and recommended Manchurian autonomy rather than sanctions — prompting Japan to leave the League in **February 1933**.',
          tags: ['Paper 1', 'League of Nations', 'PS3.1'],
        },
        {
          id: 'hist-fc-3',
          frontMarkdown: 'Contrast **Intentionalist** vs. **Structuralist/Synthesis** historians on Hitler’s foreign policy.',
          backMarkdown:
            '- **Intentionalist (Hugh Trevor-Roper, Eberhard Jäckel):** Hitler followed a premeditated *Stufenplan* from *Mein Kampf* (1925).\n- **Opportunist (A.J.P. Taylor):** Exploited Anglo-French blunders.\n- **Synthesis (Ian Kershaw, Richard Overy):** Fixed ideological goal (*Lebensraum*) pursued with tactical opportunism and driven by Four-Year Plan economic pressures (Adam Tooze).',
          tags: ['Historiography', 'Hitler', 'PS3.2'],
        },
        {
          id: 'hist-fc-4',
          frontMarkdown: 'How did Mao’s **Agrarian Reform Law (June 1950)** consolidate CCP political control?',
          backMarkdown:
            'Rather than distributing land by administrative decree, CCP cadres mobilized peasants in public **struggle sessions (*douzhenghui*)** to denounce and execute 1–2 million landlords, binding 300 million peasants to the regime through shared revolutionary complicity (Frank Dikötter / Maurice Meisner).',
          tags: ['Paper 2', 'Mao', 'WH10'],
        },
        {
          id: 'hist-fc-5',
          frontMarkdown: 'What were the four main historiographical schools on the **Origins of the Cold War**?',
          backMarkdown:
            '1. **Orthodox (Schlesinger, Feis):** Stalin’s ideological expansionism in Eastern Europe.\n2. **Revisionist (Williams, Alperovitz):** US Open Door economic hegemony & atomic diplomacy.\n3. **Post-Revisionist (John Lewis Gaddis):** Security dilemma + Stalin’s personal autocracy.\n4. **Global Cold War (Odd Arne Westad):** Third World leaders pulling superpowers into regional conflicts.',
          tags: ['Paper 2', 'Cold War', 'WH12'],
        },
        {
          id: 'hist-fc-6',
          frontMarkdown: 'Contrast **Richard Pipes** and **Orlando Figes / Sheila Fitzpatrick** on the October 1917 Revolution.',
          backMarkdown:
            '- **Liberal School (Richard Pipes):** October 1917 was a minority conspiratorial coup d’état orchestrated by Lenin and Trotsky.\n- **Revisionist Social School (Figes, Fitzpatrick, Rabinowitch):** Autonomous radicalization of workers, soldiers, and peasants hollowed out the Provisional Government; Bolsheviks won by adopting Soviet demands ("Peace, Bread, Land").',
          tags: ['Paper 3', 'Russia', 'HL.EUR'],
        },
      ],
    },
  ],
};
