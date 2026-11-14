import type { QuestionItem } from '../../../src/content/schemas';
import { SeededRng, buildMcqOptions, makeId } from './utils';

/* --------------------- 1. ORIGINAL UNSEEN LITERARY PASSAGES (PAPER 1 & AOE 1) --------------------- */

const UNSEEN_PASSAGES = [
  {
    genre: 'Prose Fiction',
    title: 'The Salt Ledger',
    excerpt: `Every morning at five, before the harbour ferries stirred, my grandfather weighed the ledger in both palms as though numbers possessed ballast. "Paper keeps the tide from erasing us," he would say, his thumb tracing the faded blue rulings where winter storms had left pale salt rings. Yet the columns of cod and salt never recorded how my mother stared past the breakwater, counting the mail steamers she never boarded.`,
    devices: [
      'tactile metaphor ("as though numbers possessed ballast")',
      'synecdoche & physical trace ("pale salt rings" on paper)',
      'structural contrast between ledger entries and unspoken longing',
      'foreshadowing and spatial framing ("past the breakwater")',
    ],
  },
  {
    genre: 'Lyric Poetry',
    title: 'Glasshouse in November',
    excerpt: `Behind misted panes, the Meyer lemons hang like small brass lanterns, / stubborn against the iron frost outside. / We speak in whispers here, as if condensation / might fracture if startled by a sharper verb— / two syllables of summer preserved in steam, / while the orchard fence surrenders to the fog.`,
    devices: [
      'visual simile ("like small brass lanterns")',
      'enjambment across line breaks mimicking fragile breath',
      'phonological sibilance and hushed register ("whispers", "steam")',
      'juxtaposition of enclosed artificial warmth and exterior "iron frost"',
    ],
  },
  {
    genre: 'Dramatic Monologue',
    title: 'Curator\'s Inventory',
    excerpt: `Please—do not adjust the spotlight on Case Four. The cracks in the glazed amphora are not damage; they are the only honest biography the vessel possesses. When the committee restored the rim last spring, they smoothed away three centuries of thumbprints. You call it preservation; I call it polite amnesia.`,
    devices: [
      'imperative direct address ("Please—do not adjust") establishing persona',
      'extended metaphor of physical fracture as "honest biography"',
      'antithesis and epigrammatic irony ("preservation" vs "polite amnesia")',
      'caesura and dash signaling suppressed agitation',
    ],
  },
  {
    genre: 'Literary Non-Fiction / Memoir',
    title: 'Cartography of an Old Station',
    excerpt: `Timetables outlive the trains they govern. On the concourse wall, faded gold lettering still promises express departures to towns whose foundries closed thirty years ago. Travelers hurry beneath the board checking glowing phone screens, oblivious to the ghost routes overhead—two chronologies sharing one vaulted ceiling without speaking.`,
    devices: [
      'paradoxical opening aphorism ("Timetables outlive the trains")',
      'ironic contrast between "faded gold lettering" and "glowing phone screens"',
      'personification of competing eras ("two chronologies... without speaking")',
      'architectural symbolism of the vaulted ceiling',
    ],
  },
  {
    genre: 'Prose Fiction',
    title: 'The Piano Tuner\'s Daughter',
    excerpt: `Father claimed every house kept a secret pitch hidden beneath floorboards and teacup clatter. He never asked how a family fared; he struck middle C, cocked his left ear toward the wallpaper, and listened to how quickly the wood swallowed the resonance. In our own kitchen, though, no note lingered more than half a breath.`,
    devices: [
      'synesthetic/auditory characterization ("secret pitch")',
      'symbolic deflection (reading emotion through acoustic decay rather than speech)',
      'understated closing turn ("no note lingered more than half a breath")',
      'domestic metonymy ("teacup clatter", "wallpaper")',
    ],
  },
  {
    genre: 'Lyric Poetry',
    title: 'Tidal Flats at Low Water',
    excerpt: `When the sea withdraws its silver signature, / what remains is grammar stripped to bone: / gull-tracks, a rusted anchor chain, three ribs of pine / spelling out nothing the high tide cares to read. / Still, the heron steps through the mud with archival care, / punctuating the silence one slow footprint at a time.`,
    devices: [
      'extended linguistic metaphor ("silver signature", "grammar", "punctuating")',
      'terse concrete imagery ("three ribs of pine")',
      'tonal shift at "Still," introducing patient persistence',
      'measured pacing mirroring the heron\'s step',
    ],
  },
] as const;

const CLOSE_READING_LENSES = [
  'Analyze how diction and imagery construct tension between memory and erasure.',
  'Examine how syntax, pacing, or line breaks shape the speaker\'s emotional restraint.',
  'Evaluate how spatial setting functions as an objective correlative for the speaker\'s inner conflict.',
  'Analyze how contrast or irony deepens the passage\'s central thematic paradox.',
  'Discuss how narrative perspective or persona controls what remains unsaid.',
] as const;

/* --------------------- 2. AOE, PAPER 2 COMPARATIVE & HLE / IO MATRIX --------------------- */

const GLOBAL_ISSUES_AND_AOES = [
  { topicId: 'eng-aoe-1', sub: 'AoE 1 · Readers, Writers & Texts', issue: 'how unreliable narration exposes self-deception and moral complicity' },
  { topicId: 'eng-aoe-1', sub: 'AoE 1 · Readers, Writers & Texts', issue: 'the tension between public rhetoric and private interiority' },
  { topicId: 'eng-aoe-2', sub: 'AoE 2 · Time & Space', issue: 'cultural displacement and linguistic hybridity across borders' },
  { topicId: 'eng-aoe-2', sub: 'AoE 2 · Time & Space', issue: 'how historical trauma reshapes generational memory and storytelling' },
  { topicId: 'eng-aoe-3', sub: 'AoE 3 · Intertextuality', issue: 'mythic revisionism and the reclamation of silenced voices' },
  { topicId: 'eng-aoe-3', sub: 'AoE 3 · Intertextuality', issue: 'the subversion of conventional genre expectations (tragedy, pastoral, or detective frame)' },
  { topicId: 'eng-p2-comp', sub: 'Paper 2 · Comparative', issue: 'institutional authority versus individual conscience across two distinct eras' },
  { topicId: 'eng-p2-comp', sub: 'Paper 2 · Comparative', issue: 'economic stratification and the illusion of social mobility' },
  { topicId: 'eng-hle-io', sub: 'HL Essay · Line of Inquiry', issue: 'how architectural or domestic confinement mirrors psychological entrapment' },
  { topicId: 'eng-hle-io', sub: 'IO · Global Issue', issue: 'ecological estrangement and industrial exploitation of landscape' },
] as const;

const CRAFT_FEATURES = [
  'fragmented chronology and retrospective framing',
  'contrasting dialogue and dramatic silence',
  'recurring motif transformation across acts or chapters',
  'shifting focalization and free indirect discourse',
  'structural juxtaposition of parallel subplots',
  'register shifts between formal public speech and intimate confession',
  'symbolic setting and weather pathetic fallacy',
  'ambiguous or circular endings resisting closure',
] as const;

const TASK_MODES = [
  {
    paper: 'Paper 2' as const,
    cmd: 'Compare and contrast',
    stem: (issue: string, craftA: string, craftB: string) =>
      `In a Paper 2 comparative essay, compare and contrast how two works you have studied deploy **${craftA}** and **${craftB}** to explore **${issue}**.`,
  },
  {
    paper: 'Paper 1' as const,
    cmd: 'Discuss',
    stem: (issue: string, craftA: string, craftB: string) =>
      `Using specific analytical criteria (Criterion B: Analysis & Evaluation), discuss how **${craftA}** works alongside **${craftB}** to complicate **${issue}**.`,
  },
  {
    paper: 'Paper 2' as const,
    cmd: 'Evaluate',
    stem: (issue: string, craftA: string, craftB: string) =>
      `Formulate a nuanced HL Essay or Paper 2 thesis evaluating how the interplay between **${craftA}** and **${craftB}** shapes a reader's response to **${issue}**.`,
  },
] as const;

const DEVICE_MCQS = [
  { q: 'Which literary device occurs when a poem shifts its argument or emotional stance—commonly after the octave in a Petrarchan sonnet or at "Still," in a lyric?', ans: 'Volta', wrong: ['Anaphora', 'Chiasmus', 'Litotes'] },
  { q: 'What term describes free indirect discourse in prose fiction?', ans: 'Third-person narration that adopts a character\'s subjective voice and idiom without quotation marks', wrong: ['First-person epistolary diary entries', 'Strictly objective camera-eye narration with zero interiority', 'Footnoted editorial commentary by a translator'] },
  { q: 'Which rhythmic/syntactic feature occurs when a sentence or clause continues over a line break without terminal punctuation?', ans: 'Enjambment', wrong: ['Caesura', 'Spondee', 'Zeugma'] },
  { q: 'Which term describes an object, action, or motif that consistently represents an abstract psychological state without direct editorializing?', ans: 'Objective correlative / symbol', wrong: ['Dramatic monologue', 'Apostrophe', 'Onomatopoeia'] },
  { q: 'In IB English Literature HL Criterion B (Paper 1), what distinguishes top-band analysis from lower-band feature-spotting?', ans: 'Explaining *how* authorial choices construct specific meaning, tone, and effect on the reader', wrong: ['Listing as many Latin rhetorical terms as possible without quoting', 'Summarizing the plot chronologically line by line', 'Evaluating only whether the author\'s life story matches the character'] },
  { q: 'Which rule is mandatory for an IB HL Individual Oral (IO) Global Issue?', ans: 'It must be significant on a wide scale, transnational, and evident in everyday local contexts across both works', wrong: ['It must be unique to a single nation\'s twentieth-century legal statute', 'It may examine only one work in translation without a second non-translated work', 'It should avoid referencing specific extract lines in favour of broad plot summary'] },
] as const;

export function generateEnglishQuestions(
  targetCount: number,
  seed = 618203
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const items: QuestionItem[] = [];

  for (const dm of DEVICE_MCQS) {
    const mcq = buildMcqOptions(rng, dm.ans, [...dm.wrong]);
    items.push({
      id: makeId('eng-gen', items.length + 1),
      subjectSlug: 'eng',
      topicId: 'eng-aoe-1',
      subtopicCode: 'Craft & Assessment Criteria',
      paper: 'Paper 1',
      questionType: 'mcq',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 1,
      commandTerm: 'Identify',
      stemMarkdown: dm.q,
      options: mcq.options,
      correctOptionId: mcq.correctOptionId,
      markschemePoints: [{ pointId: 'A1', requirement: dm.ans, marks: 1 }],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Connect terminology to literary effect', explanationMarkdown: `Focus on how the formal feature shapes reader interpretation.` },
        { stepNumber: 2, title: 'Confirm precise definition', explanationMarkdown: `Answer: **${dm.ans}**.` },
      ],
      commonPitfalls: ['Naming a literary device without explaining its interpretive effect (Criterion B).'],
      isDailyEligible: true,
    });
  }

  // 1. Paper 1 Unseen Close-Reading combinations (6 passages x 5 lenses x 4 devices = 120)
  for (const p of UNSEEN_PASSAGES) {
    for (const lens of CLOSE_READING_LENSES) {
      for (let dIdx = 0; dIdx < p.devices.length; dIdx++) {
        const primaryDevice = p.devices[dIdx];
        const secondaryDevice = p.devices[(dIdx + 1) % p.devices.length];
        items.push({
          id: makeId('eng-gen', items.length + 1),
          subjectSlug: 'eng',
          topicId: dIdx % 2 === 0 ? 'eng-p1-unseen' : 'eng-aoe-1',
          subtopicCode: `Paper 1 · ${p.genre}`,
          paper: 'Paper 1',
          questionType: 'extended_response',
          calculatorPolicy: 'non_calculator',
          difficulty: 'standard',
          marks: 10,
          commandTerm: 'Analyze',
          stimulusMarkdown: `**${p.title}** *(${p.genre})*\n\n> ${p.excerpt}`,
          stemMarkdown: `${lens} In your commentary, pay particular attention to **${primaryDevice}** and **${secondaryDevice}**.`,
          markschemePoints: [
            { pointId: 'A1', requirement: `Demonstrates perceptive understanding of explicit and implicit tensions in "${p.title}" (Criterion A)`, marks: 3 },
            { pointId: 'A2', requirement: `Analyzes how **${primaryDevice}** and **${secondaryDevice}** shape tone, tension, and meaning (Criterion B)`, marks: 5 },
            { pointId: 'A3', requirement: `Sustains focused thesis organization and precise literary register (Criteria C & D)`, marks: 2 },
          ],
          walkthroughSteps: [
            { stepNumber: 1, title: 'Establish a unifying thematic claim (Criterion A & C)', explanationMarkdown: `Anchor your opening thesis around the central tension in "${p.title}" rather than listing isolated devices.` },
            { stepNumber: 2, title: 'Unpack micro-language choices (Criterion B)', explanationMarkdown: `Quote briefly and explain precisely how **${primaryDevice}** and **${secondaryDevice}** create emotional or structural resonance.` },
          ],
          commonPitfalls: ['Feature-spotting (naming metaphors or enjambment without analyzing their effect on meaning).'],
          isDailyEligible: true,
        });
      }
    }
  }

  // 2. Global Issue x Craft Feature A x Craft Feature B x Task Modes (~1,680 unique prompts!)
  for (const gi of GLOBAL_ISSUES_AND_AOES) {
    for (let i = 0; i < CRAFT_FEATURES.length; i++) {
      for (let j = 0; j < CRAFT_FEATURES.length; j++) {
        if (i === j) continue;
        for (const tm of TASK_MODES) {
          if (items.length >= targetCount) break;
          const craftA = CRAFT_FEATURES[i];
          const craftB = CRAFT_FEATURES[j];
          items.push({
            id: makeId('eng-gen', items.length + 1),
            subjectSlug: 'eng',
            topicId: gi.topicId,
            subtopicCode: gi.sub,
            paper: tm.paper,
            questionType: 'extended_response',
            calculatorPolicy: 'non_calculator',
            difficulty: 'challenging',
            marks: 15,
            commandTerm: tm.cmd,
            stemMarkdown: tm.stem(gi.issue, craftA, craftB),
            markschemePoints: [
              { pointId: 'A1', requirement: `Articulates a defensible, specific thesis linking authorial craft directly to **${gi.issue}**`, marks: 5 },
              { pointId: 'A2', requirement: `Evaluates **${craftA}** and **${craftB}** using close textual evidence rather than plot summary`, marks: 6 },
              { pointId: 'A3', requirement: `Sustains cohesive comparative/analytical structure and academic literary register`, marks: 4 },
            ],
            walkthroughSteps: [
              { stepNumber: 1, title: 'Avoid plot retelling — lead with authorial choices', explanationMarkdown: `Frame topic sentences around *how* writers use **${craftA}** and **${craftB}** to interrogate **${gi.issue}**.` },
              { stepNumber: 2, title: 'Compare nuances, not just similarities', explanationMarkdown: `Show how differing genres/contexts yield contrasting effects even when addressing the same global issue.` },
            ],
            commonPitfalls: ['Treating two works separately without comparative synthesis or failing to connect technique back to meaning.'],
            isDailyEligible: true,
          });
        }
        if (items.length >= targetCount) break;
      }
      if (items.length >= targetCount) break;
    }
    if (items.length >= targetCount) break;
  }

  return items.slice(0, targetCount);
}
