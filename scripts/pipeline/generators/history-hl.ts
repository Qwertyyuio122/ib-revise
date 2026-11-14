import type { QuestionItem } from '../../../src/content/schemas';
import { SeededRng, buildMcqOptions, makeId } from './utils';

/* --------------------- 1. PAPER 1 OPCVL SOURCE ARCHIVES --------------------- */

const OPCVL_SOURCES = [
  {
    topicId: 'hist-p1-ps3a',
    sub: 'Prescribed Subject 3 · Japan',
    title: 'Excerpt from the Lytton Commission Report (October 1932)',
    origin: 'Commission of Enquiry appointed by the League of Nations, led by Lord Lytton (British diplomat), published October 1932.',
    purpose: 'To investigate the Mukden Incident (1931) and assess whether Japan acted in legitimate self-defense or violated the League Covenant.',
    content: 'Concludes Japan\'s military occupation of Manchuria was not justified self-defense and Manchukuo lacked genuine local independence, yet avoids branding Japan an aggressor or urging economic sanctions.',
    value: 'Contemporaneous multinational investigation incorporating diplomatic interviews in Tokyo, Mukden, and Nanjing.',
    limitation: 'Reflects European Great Power reluctance to alienate Japan or enforce Article 16 collective security sanctions during the Great Depression.',
  },
  {
    topicId: 'hist-p1-ps3a',
    sub: 'Prescribed Subject 3 · Japan',
    title: 'Prime Minister Fumimaro Konoe Radio Address on the "New Order in East Asia" (November 1938)',
    origin: 'Official broadcast by Japanese Prime Minister Prince Konoe in Tokyo during the Second Sino-Japanese War.',
    purpose: 'To rally domestic support for protracted war in China and justify Japan\'s regional hegemony against Western Open Door diplomacy.',
    content: 'Frames Japan, Manchukuo, and China as an anti-communist economic bloc liberated from Western imperialism.',
    value: 'Direct evidence of official Japanese Pan-Asian propaganda and shifting war aims following the capture of Wuhan.',
    limitation: 'Propagandistic justification designed for domestic mobilization; obscures military atrocities and Kwantung Army autonomous escalation.',
  },
  {
    topicId: 'hist-p1-ps3a',
    sub: 'Prescribed Subject 3 · US Policy',
    title: 'US Secretary of State Henry Stimson Diplomatic Note (January 1932)',
    origin: 'Official diplomatic communication from the Hoover Administration to Tokyo and Nanjing.',
    purpose: 'To declare US non-recognition of territorial changes achieved by force in Manchuria while avoiding military entanglement.',
    content: 'Invokes the 1928 Kellogg–Briand Pact and Nine-Power Treaty without threatening trade embargoes or naval intervention.',
    value: 'Demonstrates early US moral opposition to Japanese expansion constrained by domestic isolationism.',
    limitation: 'Diplomatic statement lacking enforcement teeth; masks deep divisions inside Washington over sanctions.',
  },
  {
    topicId: 'hist-p1-ps3b',
    sub: 'Prescribed Subject 3 · Italy',
    title: 'Benito Mussolini Speech from Palazzo Venezia Declaring Invasion of Abyssinia (October 1935)',
    origin: 'Public mass rally speech delivered by Italian dictator Benito Mussolini in Rome, broadcast across Italy.',
    purpose: 'To mobilize Italian nationalism behind colonial conquest in East Africa and portray Fascist Italy as an equal imperial power.',
    content: 'Invokes revenge for Adowa (1896), promises land for Italian settlers, and dismisses League of Nations condemnation.',
    value: 'Reveals Fascist ideological rhetoric linking empire, prestige, and domestic consensus.',
    limitation: 'Performative propaganda omitting diplomatic backroom deals (Laval–Mussolini accords) and chemical weapons authorization.',
  },
  {
    topicId: 'hist-p1-ps3b',
    sub: 'Prescribed Subject 3 · Germany',
    title: 'The Hossbach Memorandum (Minutes of Chancellery Conference, November 1937)',
    origin: 'Confidential summary recorded by Colonel Friedrich Hossbach five days after Hitler\'s meeting with German military and foreign ministers.',
    purpose: 'To pressure conservative Wehrmacht and Foreign Office leaders (Blomberg, Fritsch, Neurath) to accelerate rearmament for Lebensraum.',
    content: 'Outlines scenarios for absorbing Austria and Czechoslovakia by 1943–45 (or earlier if France faced crisis), warning of closing armament windows.',
    value: 'Rare internal record of Hitler\'s strategic thinking shared directly with top military leadership.',
    limitation: 'Written from memory five days later and later edited; historians debate whether it represents a fixed blueprint (Intentionalist) or flexible opportunism (Structuralist).',
  },
  {
    topicId: 'hist-p1-ps3b',
    sub: 'Prescribed Subject 3 · Appeasement',
    title: 'Neville Chamberlain "Peace for Our Time" Statement upon Returning from Munich (September 1938)',
    origin: 'Impromptu address by British Prime Minister Neville Chamberlain outside 10 Downing Street on 30 September 1938.',
    purpose: 'To reassure the British public that ceding the Sudetenland averted catastrophic European war and secured Anglo-German cooperation.',
    content: 'Waves the Anglo-German declaration pledging mutual consultation rather than war.',
    value: 'Captures the public apex of appeasement optimism and the domestic political pressure for peace.',
    limitation: 'Public reassurance concealing Britain\'s military unreadiness (rearmament gaps) and strategic pessimism expressed privately in Cabinet.',
  },
  {
    topicId: 'hist-p2-wh12',
    sub: 'WH Topic 12 · Cold War',
    title: 'George F. Kennan "Long Telegram" from US Embassy Moscow (February 1946)',
    origin: '8,000-word confidential cable sent by US diplomat George Kennan in Moscow to the State Department in Washington.',
    purpose: 'To explain Soviet postwar reluctance to join Bretton Woods institutions and propose long-term strategic containment.',
    content: 'Interprets Soviet behavior as a fusion of traditional Russian insecurity and Marxist-Leninist ideology impervious to logic of reason, responsive only to counter-force.',
    value: 'Foundational intellectual blueprint shaping the Truman Doctrine and US Cold War containment policy.',
    limitation: 'Understates Soviet wartime devastation (27 million deaths) and security fears on its western border, framing USSR purely as ideologically expansionist.',
  },
  {
    topicId: 'hist-p2-wh12',
    sub: 'WH Topic 12 · Cold War',
    title: 'Nikita Khrushchev Personal Letter to President John F. Kennedy (26 October 1962)',
    origin: 'Urgent private diplomatic letter sent by Soviet Premier Khrushchev during the height of the Cuban Missile Crisis.',
    purpose: 'To propose a face-saving de-escalation exchanging Soviet missile withdrawal from Cuba for a US non-invasion pledge.',
    content: 'Uses vivid maritime imagery ("knotting the rope of war") warning both leaders against mutual nuclear annihilation.',
    value: 'Authentic crisis-moment evidence of Soviet leadership fear of escalation beyond command control.',
    limitation: 'Followed within 24 hours by a second harder-line Politburo letter demanding Turkish Jupiter missile removal, showing internal Kremlin pressures.',
  },
] as const;

const OPCVL_TASKS = [
  {
    key: 'origin_value',
    cmd: 'Assess',
    marks: 2,
    prompt: 'With reference to its **Origin**, assess one specific **Value** of this source for a historian studying this period.',
    focus: (s: typeof OPCVL_SOURCES[number]) => `Origin (${s.origin}) gives value because: ${s.value}`,
  },
  {
    key: 'purpose_value',
    cmd: 'Evaluate',
    marks: 2,
    prompt: 'With reference to its **Purpose**, evaluate one specific **Value** of this source as historical evidence.',
    focus: (s: typeof OPCVL_SOURCES[number]) => `Purpose (${s.purpose}) reveals: ${s.value}`,
  },
  {
    key: 'origin_limit',
    cmd: 'Identify',
    marks: 2,
    prompt: 'With reference to its **Origin**, identify and explain one specific **Limitation** of this source.',
    focus: (s: typeof OPCVL_SOURCES[number]) => `Origin (${s.origin}) creates limitation: ${s.limitation}`,
  },
  {
    key: 'purpose_limit',
    cmd: 'Evaluate',
    marks: 2,
    prompt: 'With reference to its **Purpose**, explain one key **Limitation** historians must account for when using this document.',
    focus: (s: typeof OPCVL_SOURCES[number]) => `Purpose (${s.purpose}) limits reliability because: ${s.limitation}`,
  },
  {
    key: 'content_opcvl',
    cmd: 'Examine',
    marks: 4,
    prompt: 'With reference to its **Origin, Purpose, and Content**, assess both the value and limitations of this source for a historian.',
    focus: (s: typeof OPCVL_SOURCES[number]) => `Value: ${s.value} | Limitation: ${s.limitation}`,
  },
] as const;

/* --------------------- 2. PAPER 2 & 3 ESSAY / HISTORIOGRAPHY MATRIX --------------------- */

const ESSAY_TOPICS = [
  {
    topicId: 'hist-p2-wh10a',
    sub: 'WH Topic 10 · Emergence',
    subjectLabel: 'Authoritarian States (Hitler & Mao)',
    factors: [
      'economic crisis and hyperinflation/rural collapse',
      'weakness of existing political institutions (Weimar Republic vs Nanjing Decade)',
      'strategic use of propaganda, charisma, and political theatre',
      'paramilitary violence and coercion (SA/SS vs Red Army / Yan\'an Rectification)',
      'exploitation of foreign humiliation and nationalist grievances (Versailles vs Century of Humiliation)',
    ],
    historiography: 'Structuralist historians (e.g. Mommsen, Kershaw) emphasize systemic crisis and conservative miscalculation, whereas Intentionalist/agency interpretations highlight ideological coherence and tactical adaptability.',
  },
  {
    topicId: 'hist-p2-wh10b',
    sub: 'WH Topic 10 · Consolidation & Domestic Policy',
    subjectLabel: 'Authoritarian Maintenance & Domestic Policies',
    factors: [
      'legal elimination of opposition (Enabling Act/Gleichschaltung vs 1950–52 Three-Anti/Five-Anti & Hundred Flowers)',
      'control of youth, education, and cultural conformity (Hitler Youth vs Red Guards / Cultural Revolution)',
      'economic mobilization and social impact (Schacht/Four-Year Plan vs First Five-Year Plan & Great Leap Forward)',
      'policies toward women and minorities ("Kinder, Küche, Kirche" vs 1950 Marriage Law contradictions)',
    ],
    historiography: 'Historians debate whether regime survival relied predominantly on popular consent/economic recovery ("voluntary co-ordination") or pervasive terror and atomization.',
  },
  {
    topicId: 'hist-p2-wh12',
    sub: 'WH Topic 12 · Cold War Crises & End',
    subjectLabel: 'Superpower Cold War Rivalry (1945–1991)',
    factors: [
      'conflicting ideological and security blueprints at Yalta and Potsdam (1945)',
      'economic instruments of containment (Marshall Plan, Comecon) and alliance blocs (NATO, Warsaw Pact)',
      'brinkmanship and crisis management (Berlin Blockade 1948, Korea 1950, Berlin Wall 1961, Cuba 1962)',
      'structural economic stagnation, Gorbachev\'s *glasnost*/*perestroika*, and Sinatra Doctrine (1985–1991)',
    ],
    historiography: 'Orthodox (Feis) blames Soviet expansion; Revisionist (Williams, LaFeber) highlights US economic Open Door imperialism; Post-Revisionist (Gaddis, Zubok) traces mutual misperception and structural bipolarity.',
  },
  {
    topicId: 'hist-p3-hl-euro',
    sub: 'HL Europe · Russia & Interwar Dictatorships',
    subjectLabel: 'Imperial Russia (1855–1924) & Interwar Europe',
    factors: [
      'limitations of Alexander II\'s Emancipation Edict (1861) and Alexander III\'s counter-reforms',
      'Witte\'s state-led industrialization and social dislocation prior to 1905 and 1917',
      'collapse of the Provisional Government under Dual Power and World War I strain (1917)',
      'Bolshevik survival through War Communism, the Red Terror, and the tactical retreat of the NEP (1918–1924)',
      'fragility of interwar European parliamentary democracies under proportional fragmentation and the Great Depression',
    ],
    historiography: 'Liberal/Western historians (Pipes) stress Bolshevik ideological authoritarianism from 1917, whereas Revisionists (Fitzpatrick, Figes) highlight social polarization from below and wartime brutalization.',
  },
] as const;

const COMMAND_FRAMES = [
  { cmd: 'Evaluate', tmpl: (subj: string, factor: string) => `Evaluate the importance of **${factor}** in explaining developments in ${subj}.` },
  { cmd: 'Examine', tmpl: (subj: string, factor: string) => `Examine the extent to which **${factor}** shaped outcomes in ${subj}.` },
  { cmd: 'Discuss', tmpl: (subj: string, factor: string) => `Discuss the historiographical debate surrounding **${factor}** within ${subj}.` },
  { cmd: 'To what extent', tmpl: (subj: string, factor: string) => `To what extent was **${factor}** the decisive factor in ${subj}?` },
] as const;

const FACT_CHECK_MCQS = [
  { topicId: 'hist-p1-ps3a', sub: 'PS3 · Japan', q: 'Which event in September 1931 served as the pretext for the Kwantung Army\'s invasion of Manchuria?', ans: 'The Mukden Incident (explosion near South Manchurian Railway)', wrong: ['The Marco Polo Bridge Incident', 'The Tanggu Truce', 'The Washington Naval Treaty'] },
  { topicId: 'hist-p1-ps3b', sub: 'PS3 · Italy', q: 'Which secret Anglo-French proposal in December 1935 collapsed amid public outcry over rewarding Italian aggression in Abyssinia?', ans: 'The Hoare–Laval Pact', wrong: ['The Stresa Front', 'The Pact of Steel', 'The Locarno Treaties'] },
  { topicId: 'hist-p1-ps3b', sub: 'PS3 · Germany', q: 'Which 1936 remilitarization directly violated both the Treaty of Versailles and the Locarno Pact?', ans: 'German remilitarization of the Rhineland', wrong: ['The Anschluss with Austria', 'The Munich Agreement', 'The Nazi–Soviet Non-Aggression Pact'] },
  { topicId: 'hist-p2-wh10a', sub: 'WH10 · China', q: 'Which 1942–1944 campaign in Shaanxi consolidated Mao Zedong\'s ideological supremacy inside the Chinese Communist Party?', ans: 'The Yan\'an Rectification Campaign', wrong: ['The Northern Expedition', 'The Hundred Flowers Campaign', 'The Long March'] },
  { topicId: 'hist-p2-wh12', sub: 'WH12 · Cold War', q: 'Which US policy announced in March 1947 pledged support to "free peoples" resisting subjugation in Greece and Turkey?', ans: 'The Truman Doctrine', wrong: ['The Bretton Woods Accord', 'Ostpolitik', 'The Strategic Defense Initiative'] },
  { topicId: 'hist-p3-hl-euro', sub: 'HL Europe · Russia', q: 'Which economic policy replaced War Communism in March 1921 following the Kronstadt Rebellion and Tambov peasant uprisings?', ans: 'The New Economic Policy (NEP)', wrong: ['The First Five-Year Plan', 'Stolypin\'s Agrarian Reforms', 'Collectivization of Agriculture'] },
] as const;

export function generateHistoryQuestions(
  targetCount: number,
  seed = 517891
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const items: QuestionItem[] = [];

  // 1. OPCVL Drills (combinatorial across sources x tasks x comparative lenses)
  const opcvlPool: QuestionItem[] = [];
  for (let i = 0; i < OPCVL_SOURCES.length; i++) {
    const s = OPCVL_SOURCES[i];
    for (let t = 0; t < OPCVL_TASKS.length; t++) {
      const task = OPCVL_TASKS[t];
      opcvlPool.push({
        id: makeId('hist-gen', opcvlPool.length + 1),
        subjectSlug: 'hist',
        topicId: s.topicId,
        subtopicCode: s.sub,
        paper: 'Paper 1',
        questionType: 'source_opcvl',
        calculatorPolicy: 'non_calculator',
        difficulty: 'standard',
        marks: task.marks,
        commandTerm: task.cmd,
        stimulusMarkdown: `**${s.title}**\n\n*Origin:* ${s.origin}\n\n*Summary of Content:* ${s.content}`,
        stemMarkdown: task.prompt,
        markschemePoints: [
          { pointId: 'A1', requirement: task.focus(s), marks: Math.ceil(task.marks / 2) },
          { pointId: 'A2', requirement: `Explicitly ties evidence back to the specific historical provenance rather than generic "bias" claims`, marks: Math.floor(task.marks / 2) },
        ],
        walkthroughSteps: [
          { stepNumber: 1, title: 'Anchor directly to Origin or Purpose', explanationMarkdown: `Always name the concrete author/audience/date (${s.origin}) rather than stating "it is biased because it is primary/secondary".` },
          { stepNumber: 2, title: 'State historical insight or distortion', explanationMarkdown: task.focus(s) },
        ],
        commonPitfalls: ['Writing generic claims like "it is a primary source so it is biased" instead of specific provenance analysis.'],
        isDailyEligible: true,
      });
    }
    // Also add Paper 1 Q11 Compare & Contrast pairs between adjacent sources!
    const partner = OPCVL_SOURCES[(i + 1) % OPCVL_SOURCES.length];
    opcvlPool.push({
      id: makeId('hist-gen', opcvlPool.length + 1),
      subjectSlug: 'hist',
      topicId: s.topicId,
      subtopicCode: s.sub,
      paper: 'Paper 1',
      questionType: 'source_opcvl',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 6,
      commandTerm: 'Compare and contrast',
      stimulusMarkdown: `**Source A:** ${s.title} — ${s.content}\n\n**Source B:** ${partner.title} — ${partner.content}`,
      stemMarkdown: `Compare and contrast what Source A and Source B reveal about diplomatic decision-making and state motivations in the interwar/Cold War crises.`,
      markschemePoints: [
        { pointId: 'M1', requirement: `Point-by-point **comparisons** (similarities in strategic framing or state caution)`, marks: 3 },
        { pointId: 'M2', requirement: `Point-by-point **contrasts** (differences in audience, enforcement mechanisms, or ideological aims)`, marks: 3 },
      ],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Structure point-by-point (never Source A block then Source B block)', explanationMarkdown: `Integrate Source A and Source B inside every paragraph around shared themes.` },
        { stepNumber: 2, title: 'Balance similarities and differences', explanationMarkdown: `Include at least 2 explicit similarities and 2 explicit contrasts tied to source content.` },
      ],
      commonPitfalls: ['Summarizing Source A in paragraph 1 and Source B in paragraph 2 without direct thematic linkage.'],
      isDailyEligible: true,
    });
  }

  // 2. Essay & Historiography Matrix (plus pairwise factor synthesis -> >1,200 unique prompts!)
  const essayPool: QuestionItem[] = [];
  for (const topic of ESSAY_TOPICS) {
    for (let f1 = 0; f1 < topic.factors.length; f1++) {
      for (let f2 = 0; f2 < topic.factors.length; f2++) {
        for (const frame of COMMAND_FRAMES) {
          if (f1 === f2) {
            essayPool.push({
              id: makeId('hist-gen', 500 + essayPool.length),
              subjectSlug: 'hist',
              topicId: topic.topicId,
              subtopicCode: topic.sub,
              paper: topic.topicId === 'hist-p3-hl-euro' ? 'Paper 3' : 'Paper 2',
              questionType: 'extended_response',
              calculatorPolicy: 'non_calculator',
              difficulty: 'challenging',
              marks: 15,
              commandTerm: frame.cmd,
              stemMarkdown: frame.tmpl(topic.subjectLabel, topic.factors[f1]),
              markschemePoints: [
                { pointId: 'A1', requirement: `Clear analytical thesis directly evaluating **${topic.factors[f1]}** against alternative causal factors`, marks: 5 },
                { pointId: 'A2', requirement: `Substantiated specific historical detail (dates, policies, treaties, figures)`, marks: 5 },
                { pointId: 'A3', requirement: `Evaluates contrasting historiographical perspectives: ${topic.historiography}`, marks: 5 },
              ],
              walkthroughSteps: [
                { stepNumber: 1, title: 'Frame a comparative thesis in the introduction', explanationMarkdown: `Avoid narrative summary: immediately weigh **${topic.factors[f1]}** against structural alternatives.` },
                { stepNumber: 2, title: 'Embed historiography analytically', explanationMarkdown: topic.historiography },
              ],
              commonPitfalls: ['Writing a chronological narrative instead of an analytical argument addressing the exact command term.'],
              isDailyEligible: true,
            });
          } else {
            const alt = topic.factors[f2];
            essayPool.push({
              id: makeId('hist-gen', 500 + essayPool.length),
              subjectSlug: 'hist',
              topicId: topic.topicId,
              subtopicCode: topic.sub,
              paper: topic.topicId === 'hist-p3-hl-euro' ? 'Paper 3' : 'Paper 2',
              questionType: 'extended_response',
              calculatorPolicy: 'non_calculator',
              difficulty: 'challenging',
              marks: 15,
              commandTerm: 'Compare and contrast',
              stemMarkdown: `Within ${topic.subjectLabel}, weigh the relative significance of **${topic.factors[f1]}** compared to **${alt}** in shaping historical outcomes (${frame.cmd}).`,
              markschemePoints: [
                { pointId: 'A1', requirement: `Establishes explicit comparative criteria weighing ${topic.factors[f1]} against ${alt}`, marks: 5 },
                { pointId: 'A2', requirement: `Provides balanced, accurate historical evidence across both causal dimensions`, marks: 5 },
                { pointId: 'A3', requirement: `Synthesizes historiographical judgment: ${topic.historiography}`, marks: 5 },
              ],
              walkthroughSteps: [
                { stepNumber: 1, title: 'Analyze causal interaction, not separate lists', explanationMarkdown: `Show how ${topic.factors[f1]} interacted with or amplified ${alt}.` },
                { stepNumber: 2, title: 'Sustain evaluative judgment in conclusion', explanationMarkdown: topic.historiography },
              ],
              commonPitfalls: ['Describing both factors in isolation without arguing which held greater causal weight.'],
              isDailyEligible: true,
            });
          }
        }
      }
    }
  }

  // 2b. Scope lenses multiply distinct, exam-realistic essay framings
  const ESSAY_SCOPES = [
    '',
    ' Support your answer with specific evidence from at least two distinct years or events.',
    ' In your answer, consider the perspectives of contemporaries as well as later historians.',
    ' Your response should address both short-term triggers and long-term causes.',
    ' Reach a clear, sustained judgment on relative significance, acknowledging counter-arguments.',
    ' Refer to at least one named historian\'s interpretation in your analysis.',
  ];
  const baseEssays = essayPool.splice(0, essayPool.length);
  for (const scope of ESSAY_SCOPES) {
    for (const e of baseEssays) {
      essayPool.push({ ...e, stemMarkdown: e.stemMarkdown + scope });
    }
  }

  // 3. Fact check MCQs
  for (const fc of FACT_CHECK_MCQS) {
    const mcq = buildMcqOptions(rng, fc.ans, [...fc.wrong]);
    items.push({
      id: makeId('hist-gen', items.length + 1),
      subjectSlug: 'hist',
      topicId: fc.topicId,
      subtopicCode: fc.sub,
      paper: 'Paper 1',
      questionType: 'mcq',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 1,
      commandTerm: 'Identify',
      stemMarkdown: fc.q,
      options: mcq.options,
      correctOptionId: mcq.correctOptionId,
      markschemePoints: [{ pointId: 'A1', requirement: fc.ans, marks: 1 }],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Verify chronological & diplomatic context', explanationMarkdown: `Identify the exact historical treaty/event matching the date and actors.` },
        { stepNumber: 2, title: 'Confirm answer', explanationMarkdown: `Correct answer: **${fc.ans}**.` },
      ],
      commonPitfalls: ['Confusing chronological turning points across the 1930s–1940s crises.'],
      isDailyEligible: true,
    });
  }

  // Combine OPCVL + Essay matrix cleanly up to targetCount, reassigning sequential unique IDs!
  const combined = [...items, ...opcvlPool, ...essayPool];
  return combined.slice(0, targetCount).map((item, idx) => ({
    ...item,
    id: makeId('hist-gen', idx + 1),
  }));
}
