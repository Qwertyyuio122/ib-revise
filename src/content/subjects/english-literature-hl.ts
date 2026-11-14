import type { SubjectPack } from '../schemas';

export const englishLitHlPack: SubjectPack = {
  subject: {
    slug: 'eng',
    name: 'English Literature',
    level: 'HL',
    syllabusFirstAssessment: '2021',
    themeTokens: {
      wash1: 'rgba(191,219,254,0.58)',
      wash2: 'rgba(224,231,255,0.45)',
      wash3: 'rgba(248,250,252,0.6)',
      accent: '#1D4ED8',
      soft: '#EFF6FF',
      cardGradient: 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 50%, #F8FAFC 100%)',
    },
    iaConfig: {
      iaLabel: 'HL Essay & IO',
      iaTitle: 'HL Essay (20% · 20m) & IO (20% · 40m)',
      maxMarks: 20,
      wordOrTimeLimit: '1,200–1,500w HL Essay · 15-min IO',
      weightPercent: 20,
      steps: [
        'Choose literary works',
        'Define Global Issue',
        'Line of inquiry & edit',
      ],
      criteria: [
        {
          code: 'A',
          name: 'Knowledge, understanding and interpretation',
          maxMarks: 5,
          weightPercent: 25,
          summary:
            'Demonstrate perceptive knowledge and understanding of the chosen work(s) and draw persuasive conclusions directly connected to the line of inquiry (HL Essay) or Global Issue (Individual Oral).',
          topBandExpectations: [
            'Nuanced interpretation of subtle textual complexities and subtext rather than plot summary.',
            'Every textual reference directly advances the overarching line of inquiry or Global Issue.',
          ],
          commonPitfalls: [
            'Retelling plot events before arriving at an analytical claim at the very end of the paragraph.',
            'Treating characters as real people without examining how they are constructed as literary vehicles.',
          ],
        },
        {
          code: 'B',
          name: 'Analysis and evaluation',
          maxMarks: 5,
          weightPercent: 25,
          summary:
            'Analyze and evaluate how the writer’s choices of language, structure, technique, and style construct meaning and shape reader response.',
          topBandExpectations: [
            'Evaluates both micro-level stylistic choices (diction, syntax, prosody, imagery) and macro-level structural architecture (framing, temporal shifts, juxtaposition, focalization).',
            'Explicitly evaluates how formal choices generate specific emotional or intellectual effects on the reader/audience.',
          ],
          commonPitfalls: [
            'Feature-spotting: naming a device ("this is a metaphor/enjambment") without explaining its interpretive effect.',
            'Ignoring genre-specific conventions (e.g., analyzing a play like a novel without stagecraft, lighting, or proxemics).',
          ],
        },
        {
          code: 'C',
          name: 'Focus, organization and development',
          maxMarks: 5,
          weightPercent: 25,
          summary:
            'Present a sustained, coherent, and logically developed argument along a focused line of inquiry (HL Essay) or balanced extract-to-whole structure (IO).',
          topBandExpectations: [
            'Topic sentences state clear conceptual sub-claims linked to the central thesis.',
            'Seamless transitions that build a cumulative argument rather than a list of isolated paragraphs.',
            'For the IO: strictly balanced 50/50 time allocation between the work in translation and the work originally in English, and 50/50 between the 40-line extract and the wider work.',
          ],
          commonPitfalls: [
            'Organizing an essay chronologically ("In the beginning... in the middle... at the end") or device-by-device ("Paragraph 1: Diction; Paragraph 2: Imagery").',
          ],
        },
        {
          code: 'D',
          name: 'Language',
          maxMarks: 5,
          weightPercent: 25,
          summary:
            'Use clear, precise, and sophisticated academic register with accurate literary terminology.',
          topBandExpectations: [
            'Varied, assured academic syntax and precise critical vocabulary (e.g., free indirect discourse, anagnorisis, polyphony, bathos).',
            'Short quotations woven grammatically into analytical prose.',
          ],
          commonPitfalls: [
            'Dropping multi-line block quotes without dissecting specific words within them.',
            'Informal or vague praise ("the author uses amazing imagery to make the reader feel sad").',
          ],
        },
      ],
      exemplarTitle:
        'How does Toni Morrison employ fragmented non-linear temporality and polyphonic focalization in Beloved to represent the intergenerational persistence of traumatic memory?',
      exemplarResearchQuestion:
        'In what ways does Toni Morrison’s disruption of linear chronology and shifting narrative focalization in Beloved enact the psychologically inescapable return of slavery’s trauma ("rememory")?',
      exemplarScore: '19 / 20 (Band 7 HL Essay)',
      exemplarSections: [
        {
          sectionTitle: 'Thesis & Line of Inquiry Framing',
          excerptMarkdown:
            'In *Beloved* (1987), Toni Morrison refuses the consolations of linear historical progression, constructing instead a spiral narrative architecture in which the past physically intrudes upon the present. Through the concept of **"rememory"**—where traumatic events remain spatially anchored in the world even after their witnesses attempt to "beat back the past"—Morrison aligns formal fragmentation with psychological survival. By oscillating between defensive third-person focalization in Part I, polyphonic stream-of-consciousness monologues in Part II, and communal choral exorcism in Part III, Morrison demonstrates that the trauma of chattel slavery cannot be repressed into silence without consuming the self.',
          examinerCommentary:
            'Establishes a crystal-clear literary line of inquiry linking macro-structural progression (Parts I–III) and focalization directly to thematic meaning (Criterion A & C: 5/5).',
          criterionRef: 'C',
        },
        {
          sectionTitle: 'Close Stylistic & Structural Analysis (Part II Monologues)',
          excerptMarkdown:
            'When Sethe, Denver, and Beloved converge in the unpunctuated triadic monologues of Part II ("Beloved, she my daughter. She mine"), Morrison strips away syntactic subordination and temporal markers altogether. The parataxis and absence of periods dissolve the boundary between speaking subject and possessed object, formally enacting how Sethe’s maternal love—warped by the institutional violence of Sweet Home into what Paul D terms "too thick" love—collapses into claustrophobic fusion.',
          examinerCommentary:
            'Exemplifies top-band Criterion B & D: identifies a precise formal feature (unpunctuated parataxis and pronominal fusion) and evaluates its psychological and thematic effect.',
          criterionRef: 'B',
        },
      ],
    },
    spotlight: {
      title: 'English Literature HL Works & Craft',
      pills: [
        { label: 'Paper 1 Unseen Prose/Poetry', href: '/questions?subject=eng&paper=Paper+1' },
        { label: 'Paper 2 Comparative Essay', href: '/questions?subject=eng&paper=Paper+2' },
        { label: '1,200–1,500w HL Essay', href: '/essay-studio?subject=eng' },
        { label: 'Literary Device Matrix', href: '/tools/english-studio' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description: 'Paper 1 unseen passages & Paper 2 comparative prompts',
        bgHex: '#EFF6FF',
        colorHex: '#1D4ED8',
        href: '/questions?subject=eng',
        iconName: 'questionbank',
      },
      {
        title: 'Literary Device Drill',
        description: 'Spot syntax, caesura, motif, tone & narrative shift',
        bgHex: '#E0F2FE',
        colorHex: '#0284C7',
        href: '/tools/english-studio',
        iconName: 'literary_device',
      },
      {
        title: 'Blurting',
        description: 'Recall key quotes, motifs & structural turns per text',
        bgHex: '#FEF3C7',
        colorHex: '#D97706',
        href: '/tools/blurting?subject=eng',
        iconName: 'blurting',
      },
      {
        title: 'Teach Sprout',
        description: 'Test your Global Issue & thesis against Socratic prompts',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/tools/teach-sprout?subject=eng',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Timed Paper 1 guided commentary & Paper 2 mocks',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/questions?subject=eng&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Refine feature-spotting into effect-driven analysis',
        bgHex: '#FEF2F2',
        colorHex: '#DC2626',
        href: '/questions?subject=eng&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'Text & Author Guides',
        description: 'Themes, context & formal craft across set works',
        bgHex: '#EFF6FF',
        colorHex: '#2563EB',
        href: '/study-guides?subject=eng',
        iconName: 'study_guide',
      },
      {
        title: 'Quote Flashcards',
        description: 'Spaced repetition tagged by theme & Global Issue',
        bgHex: '#FEF9C3',
        colorHex: '#CA8A04',
        href: '/flashcards?subject=eng',
        iconName: 'flashcards',
      },
      {
        title: 'Global Issue Bank',
        description: 'Curated IB fields of inquiry & cross-text pairings',
        bgHex: '#DCFCE7',
        colorHex: '#16A34A',
        href: '/tools/english-studio?tab=global-issues',
        iconName: 'global_issue',
      },
      {
        title: 'AI Essay & HL Editor',
        description: 'Rubric A–D scoring, passage highlights & prose edits',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/essay-studio?subject=eng',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'eng-aoe-1',
      subjectSlug: 'eng',
      unitCode: 'AoE 1',
      unitTitle: 'Readers, Writers and Texts',
      code: 'AOE.1',
      title: 'Close Reading, Formal Craft & Aesthetic Meaning',
      levelScope: 'SL/Core',
      recommendedHours: 50,
      guidingQuestions: [
        'In what ways is meaning constructed, negotiated, expressed, and interpreted by readers and writers?',
        'How do micro-level language choices interact with macro-level structural shifts to shape reader response?',
      ],
      understandings: [
        {
          code: 'AOE.1a',
          text: 'Poetic & Prose Micro-Craft: Semantic fields, connotations, prosody (meter, caesura, enjambment, sibilance, plosives), syntax (parataxis, hypotaxis, chiasmus), and figurative patterns.',
          isHL: false,
        },
        {
          code: 'AOE.1b',
          text: 'Narrative & Dramatic Macro-Craft: Focalization (free indirect discourse, unreliable narrator, polyphony), temporal ordering (analepsis, prolepsis, in medias res), and dramatic stagecraft (proxemics, lighting, soundscapes, fourth wall).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### AoE 1: Readers, Writers and Texts — From Feature-Spotting to Effect Analysis

#### 1. The Three-Tier Analytical Formula
Never stop at naming a literary device. Every analytical sentence in Paper 1, Paper 2, the HL Essay, and the IO should connect three layers:
1. **Formal Choice (The "How"):** Specific technique + embedded micro-quote (e.g., *enjambment across stanza breaks*, *free indirect discourse*, *claustrophobic domestic proxemics*).
2. **Immediate Aesthetic/Psychological Effect:** What tension, sensory impression, or tonal instability this choice creates on the page or stage.
3. **Conceptual Meaning (The "Why"):** How that effect advances the text's central philosophical inquiry or Global Issue.

#### 2. Genre-Specific Toolkits
- **Lyric & Narrative Poetry (e.g., Carol Ann Duffy, Seamus Heaney):**
  - *Prosody & Lineation:* **Caesura** (medial punctuation arresting momentum to mimic hesitation or trauma); **Enjambment** (spilling syntax across line endings to enact overflow, urgency, or duality between line-end and sentence-end meaning); **Volta** (the structural pivot in tone or realization).
- **Prose Fiction (e.g., Toni Morrison's *Beloved*, Albert Camus's *The Stranger*):**
  - *Focalization:* **Free indirect discourse** blends third-person narration with a character's internal idiom and blind spots, creating simultaneous intimacy and ironic distance.
  - *Syntax:* Camus's Meursault speaks in clipped, paratactic *passé composé* clauses (*"Maman died today. Or yesterday maybe, I don't know"* in Matthew Ward's translation), refusing causal conjunctions because the absurd universe lacks inherent moral hierarchy.
- **Drama (e.g., Henrik Ibsen's *A Doll's House*, Sophocles' *Antigone*):**
  - *Stagecraft & Non-Verbal Semiotics:* Analyze **props** (Nora's macaroons, the locked mailbox, the tarantella tambourine), **spatial thresholds** (Helmer's closed study door vs. the final slam of the downstairs door), and **dramatic irony**.`,
      cheatsheetMarkdown: `- **Analytical Triad:** Formal Choice + Embedded Micro-Quote -> Aesthetic/Tonal Effect -> Conceptual/Thematic Meaning.
- **Poetry Essentials:** Enjambment vs End-stopped | Medial Caesura | Volta | Semantic Fields | Plosive/Sibilant Phonetics.
- **Prose Essentials:** Free Indirect Discourse | Internal Focalization | Parataxis vs Hypotaxis | Analepsis/Rememory.
- **Drama Essentials:** Proxemics | Stage Directions | Symbolic Props | Stichomythia | Anagnorisis & Peripeteia.`,
      blurtChecklist: [
        'Three-tier formula: Formal Choice -> Aesthetic Effect -> Conceptual Meaning',
        'Prosody: Enjambment, medial caesura, volta, sibilance vs plosives',
        'Prose focalization: Free indirect discourse, unreliable narrator, polyphony',
        'Syntax: Parataxis (Camus) vs hypotaxis and stream-of-consciousness (Morrison)',
        'Dramatic semiotics: Proxemics, stage thresholds, props, stichomythia, anagnorisis',
      ],
    },
    {
      id: 'eng-aoe-2',
      subjectSlug: 'eng',
      unitCode: 'AoE 2',
      unitTitle: 'Time and Space',
      code: 'AOE.2',
      title: 'Cultural Contexts, Reception & Works in Translation',
      levelScope: 'SL/Core',
      recommendedHours: 50,
      guidingQuestions: [
        'How important is cultural or historical context to the production and reception of a literary text?',
        'How do works in translation (Camus, Ibsen, Sophocles) challenge or subvert the dominant ideologies of their era?',
      ],
      understandings: [
        {
          code: 'AOE.2a',
          text: 'Context of Production vs. Context of Reception: How 19th-century bourgeois Norwegian patriarchy (Ibsen, 1879), French colonial Algeria and post-WWII existentialism (Camus, 1942), and 5th-century BCE Athenian civic religion (Sophocles, 441 BCE) shape textual tensions.',
          isHL: false,
        },
        {
          code: 'AOE.2b',
          text: 'Translation Nuances: Understanding how key conceptual terms (e.g., Sophocles’ nomos vs physis and philia; Ibsen’s dukkehjem and vidunderlige; Camus’s Maman and tendre indifférence) carry cultural weight across languages.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### AoE 2: Time and Space — Anchor Works in Translation

#### 1. Henrik Ibsen, *A Doll's House* (*Et dukkehjem*, 1879, trans. from Norwegian)
- **Context of Production:** Written in 19th-century bourgeois Scandinavia where married women lacked independent legal or financial agency. Ibsen's realist "well-made play" (*pièce bien faite*) subverts the genre's expected domestic reconciliation in Act III.
- **Formal & Symbolic Architecture:**
  - **Spatial Confinement:** The entire play is restricted to a single bourgeois drawing room heated by a stove, bordered by Torvald's offstage study (patriarchal surveillance) and the glass-paned hall door containing the **locked letterbox**.
  - **Props & Performance:** The **Christmas tree** (Act I adorned -> Act II stripped and disheveled with burnt-out candle stubs mirroring Nora's unravelling facade); the **Tarantella** (frenzied performative exoticism used by Nora as a tactical delay to stop Torvald reading Krogstad's letter).
  - **Denouement:** When Torvald reacts to Krogstad's first letter with narcissistic panic (*"No man would sacrifice his honor for the one he loves"*) and Nora replies *"That is what hundreds of thousands of women have done"*, the stage transforms from melodrama into ideological reckoning, culminating in the iconic sound effect: *"from below is heard the reverberation of a heavy door closing."*

#### 2. Albert Camus, *The Stranger* (*L'Étranger*, 1942, trans. Matthew Ward)
- **Context & Philosophy of the Absurd:** Set in French colonial Algiers. For Camus, the **Absurd** is not merely that life is meaningless, but the confrontation between humanity's innate desire for rational moral order and the **"benign indifference of the world"** (*la tendre indifférence du monde*).
- **Bipartite Symmetry:**
  - **Part I (6 chapters):** Sensory immediacy—sun, sea, heat, Marie's dress, Celeste's restaurant—culminating in the blinding solar hostility on the beach where Meursault fires **one shot**, pauses, and fires **"four more times at the motionless body"** of the unnamed Arab.
  - **Part II (5 chapters):** Judicial and religious abstraction. The Colonial Court tries Meursault not for killing an Arab (whom colonial hierarchy renders nameless), but for **not crying at his mother's funeral** and swimming with Marie the next day.

#### 3. Sophocles, *Antigone* (c. 441 BCE)
- **Civic vs. Divine Law:** Collision between Creon's state decree (*kerygma* / human *nomos*) and Antigone's appeal to unwritten, eternal divine justice (*agrapta nomima* of the gods).
- **Tragic Structure:** **Stichomythia** (rapid-fire single-line verbal duels between Antigone and Ismene, Creon and Antigone, Creon and Haemon) dramatizes ideological irreconcilability; the **Chorus of Theban Elders** shifts allegiance as Creon's *hamartia* (tyrannical rigidity / *hubris*) leads to belated *anagnorisis* after Eurydice and Haemon's suicides.`,
      cheatsheetMarkdown: `- **Ibsen, *A Doll's House* (1879):** Single bourgeois room | Christmas tree decay | Tarantella delay | *"the most wonderful thing"* (*det vidunderlige*) | Final door slam.
- **Camus, *The Stranger* (1942):** Part I (sensory sun/beach + 4 extra shots) vs Part II (courtroom tries Meursault for not weeping at Maman's funeral) | *"benign indifference of the world"*.
- **Sophocles, *Antigone* (441 BCE):** *Nomos* (Creon's edict) vs *Agrapta nomima* (divine law) | Stichomythia duels | Live burial in stone vault | Creon's belated *anagnorisis*.`,
      blurtChecklist: [
        'Ibsen A Doll’s House: Single-room set, locked letterbox, Christmas tree, Tarantella',
        'Ibsen Act III subversion of the well-made play and final door slam',
        'Camus The Stranger: Part I sensory parataxis vs Part II courtroom abstraction',
        'Camus philosophy of the Absurd and "benign indifference of the world"',
        'Sophocles Antigone: Creon’s civic nomos vs Antigone’s unwritten divine laws',
        'Sophocles dramatic devices: Stichomythia, Choral odes (Ode to Man), hamartia & anagnorisis',
      ],
    },
    {
      id: 'eng-aoe-3',
      subjectSlug: 'eng',
      unitCode: 'AoE 3',
      unitTitle: 'Intertextuality: Connecting Texts',
      code: 'AOE.3',
      title: 'Comparative Architecture, Mythic Revisionism & Cross-Text Synthesis',
      levelScope: 'SL/Core',
      recommendedHours: 50,
      guidingQuestions: [
        'How can diverse literary texts share points of similarity while employing radically different generic and stylistic strategies?',
        'How do modern writers (Duffy, Morrison) revise classical myth or historical archives to reclaim silenced voices?',
      ],
      understandings: [
        {
          code: 'AOE.3a',
          text: 'Mythic & Historical Revisionism: Carol Ann Duffy’s dramatic monologues in The World’s Wife (1999) subverting patriarchal myth and fairy tale alongside Toni Morrison’s reclamation of the Margaret Garner archival silence in Beloved (1987).',
          isHL: false,
        },
        {
          code: 'AOE.3b',
          text: 'Cross-Genre Comparative Synthesis: Contrasting how drama (Ibsen/Sophocles), prose fiction (Morrison/Camus), and lyric/dramatic poetry (Duffy/Heaney) stage resistance against institutional orthodoxy.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### AoE 3: Intertextuality — Anchor Works Originally in English

#### 1. Toni Morrison, *Beloved* (1987) — Postmodern Neo-Slave Narrative
- **Archival Intertextuality:** Inspired by the historical 1856 case of **Margaret Garner**, an enslaved mother who escaped from Kentucky to Ohio and killed her two-year-old daughter rather than let slave catchers under the Fugitive Slave Act return her to Sweet Home. Whereas 19th-century slave narratives had to "draw a veil" over interior horrors to avoid offending white abolitionist readers, Morrison excavates psychological interiority.
- **Key Motifs & Symbols:**
  - **"Rememory" & 124 Bluestone Road:** Part I opens *"124 was spiteful. Full of a baby's venom"* | Part II *"124 was loud"* | Part III *"124 was quiet."* Trauma is spatialized in the house itself.
  - **The "Chokecherry Tree" vs. Real Trees:** Schoolteacher's nephew carves a branching scar into Sethe's back while Amy Denver romantically names it a *"chokecherry tree"*; Paul D reduces it to *"a revolting clump of scars."* Meanwhile, Sixo and Paul D find temporary sanctuary among real trees ("Brother") at Sweet Home.
  - **Paul D's "Tobacco Tin" Heart:** Rusted shut in his chest after the chain gang in Alfred, Georgia, until Beloved forces its lid open.
  - **Schoolteacher's Notebook:** Divides Sethe's "human" and "animal" characteristics on lined paper—symbolizing how Enlightenment pseudo-science and written discourse perpetrated epistemic violence.

#### 2. Carol Ann Duffy, *The World's Wife* (1999) — Feminist Dramatic Monologue
- **Intertextual Strategy:** Adopts the Victorian dramatic monologue form (Browning) to give colloquial, irreverent, and poignant voices to women erased behind male myth, history, and biblical narrative.
- **Anchor Poems for IO & Paper 1/2:**
  - **"Little Red Cap":** Revises Perrault/Grimm's passive victim into a 16-year-old poetic apprentice who seduces the wolf (a figure for patriarchal poetic tradition / Ted Hughes) to steal his language, eventually taking an axe to the wolf's belly (filled with the white bones of her grandmother) and emerging *"Out of the forest I came with my flowers, singing, all alone."*
  - **"Medusa":** Turns the classical monster into a vulnerability-ridden wife whose jealousy calcifies her own tenderness (*"a suspicion, a doubt, a jealousy / grew in my mind, / which turned the hairs on my head to filthy snakes"*), ending with the chilling direct address: *"Look at me now."*
  - **"Mrs Midas":** Combines domestic comedy (*"I served up the meal. For starters, corn on the cob. / Within seconds he was spitting out the teeth of the rich"*) with devastating emotional bereavement as greed turns living intimacy into cold, sterile ore (*"I miss most, / even now, his hands, his warm hands on my skin"*).
  - **"Penelope" & "Eurydice":** Penelope transforms her weaving loom from a passive symbol of wifely fidelity into a source of quiet artistic absorption—sorting threads and embroidering her own world until Odysseus's eventual return becomes a secondary interruption; Eurydice deliberately tricks Orpheus into turning around in Hell so she no longer has to act as his silent muse.`,
      cheatsheetMarkdown: `- **Morrison, *Beloved* (1987):** 124 opening lines (spiteful / loud / quiet) | Rememory | Chokecherry tree scar | Paul D's rusted tobacco tin | Schoolteacher's notebook (human vs animal column).
- **Duffy, *The World's Wife* (1999):** Dramatic monologue revisionism | *Little Red Cap* ("bones of the wolf") | *Medusa* ("Look at me now") | *Mrs Midas* (sterility of greed vs "his warm hands") | *Eurydice* & *Penelope* (female artistic autonomy).`,
      blurtChecklist: [
        'Beloved three-part structural opening ("124 was spiteful / loud / quiet")',
        'Beloved motifs: Rememory, chokecherry tree scar, Paul D’s tobacco tin, Schoolteacher’s notebook',
        'Duffy dramatic monologue subversion of patriarchal myth in The World’s Wife',
        'Duffy "Little Red Cap": poetic apprenticeship, wolf’s belly, grandmother’s bones',
        'Duffy "Mrs Midas" and "Medusa": domestic bathos shifting to elegiac grief and defiance',
      ],
    },
    {
      id: 'eng-p1-unseen',
      subjectSlug: 'eng',
      unitCode: 'Paper 1',
      unitTitle: 'Guided Literary Analysis (HL)',
      code: 'P1.HL',
      title: 'Paper 1 HL Unseen Commentary Architecture (Prose & Poetry)',
      levelScope: 'HL Extension',
      recommendedHours: 35,
      guidingQuestions: [
        'How do you construct TWO separate 20-mark guided literary commentaries in 2 hours 15 minutes at HL?',
        'How should the IB guiding question be transformed into a conceptual thesis rather than a checklist?',
      ],
      understandings: [
        {
          code: 'P1.HL.1',
          text: 'HL Requirement: Unlike SL (1 passage), HL candidates must write two complete guided literary analyses—one on each of the two unseen literary passages (prose fiction, poetry, drama, or literary non-fiction)—in 2 hours 15 minutes (40 marks total, 35% of final grade).',
          isHL: true,
        },
        {
          code: 'P1.HL.2',
          text: 'Structural Progression Method: Organize commentary around how the passage develops, shifts, or destabilizes meaning across its progression rather than listing devices statically.',
          isHL: true,
        },
      ],
      studyGuideMarkdown: `### Paper 1 HL: Mastering the Double Unseen Guided Analysis (2h 15m)

#### 1. HL Time Allocation (135 Minutes Total = 67.5 Minutes per Text)
- **Minutes 0–12 (12 min):** Annotate Passage 1 in three colors: (1) Guiding Question focus, (2) Structural shifts / Volta / Pacing, (3) Micro-patterns (diction, imagery, syntax, sound).
- **Minutes 12–67 (55 min):** Write Essay 1 (Introduction + 3 developmental body paragraphs + brief conclusion).
- **Minutes 68–80 (12 min):** Annotate Passage 2.
- **Minutes 80–135 (55 min):** Write Essay 2.

#### 2. Turning the Guiding Question into an Argumentative Thesis
- **Guiding Question Example:** *"How does the writer use contrasting settings and narrative perspective to convey the protagonist's sense of alienation?"*
- **Weak Thesis (Checklist):** *"The writer uses contrasting settings, imagery, and third-person narration to show the protagonist feels alienated."*
- **Band 7 Thesis (Conceptual Argument):** *"By juxtaposing the sterile, geometric rigidity of the boarding school interior against the untamed sensory profusion of the protagonist's childhood memories—mediated through claustrophobic free indirect discourse—the writer reveals that the protagonist's alienation stems not merely from physical displacement, but from the forced suppression of his native linguistic identity."*

#### 3. The 3-Movement Body Architecture
Instead of "Paragraph 1: Imagery, Paragraph 2: Diction, Paragraph 3: Structure", structure your body paragraphs around **3 conceptual movements** of the text (e.g., *Movement I: Initial Illusion of Belonging*, *Movement II: The Epiphanic Rupture / Volta*, *Movement III: Unresolved Irony or Resignation*), weaving diction, syntax, and structure together inside every movement.`,
      cheatsheetMarkdown: `- **HL Paper 1 Format:** **2 unseen literary texts** (write on BOTH) | 2h 15m (67m per text) | 40 marks total (20 marks each) | **35% of HL grade**.
- **Thesis Rule:** Answer the Guiding Question with **By [Formal Strategy] -> the writer reveals [Specific Conceptual/Psychological Insight]**.
- **Body Structure:** 3 Conceptual Movements (Establishment -> Shift/Volta -> Resolution/Ambiguity) integrating micro + macro craft in every paragraph.`,
      blurtChecklist: [
        'Paper 1 HL requires writing on BOTH unseen texts in 2h 15m (35% weight)',
        '67-minute split: 12 minutes annotation + 55 minutes writing per passage',
        'Thesis formula: By [Formal Strategy], the writer reveals [Conceptual Insight]',
        '3-Movement structural progression rather than device-by-device paragraphs',
      ],
    },
    {
      id: 'eng-p2-comp',
      subjectSlug: 'eng',
      unitCode: 'Paper 2',
      unitTitle: 'Comparative Essay (SL/HL)',
      code: 'P2.COMP',
      title: 'Paper 2 Comparative Essay Synthesis Across Two Works',
      levelScope: 'SL/Core',
      recommendedHours: 35,
      guidingQuestions: [
        'How do you adapt two prepared literary works (e.g., Beloved and A Doll’s House) to any of the four unseen Paper 2 prompts in 1 hour 45 minutes?',
        'How does alternating comparative synthesis outperform block-by-block comparison under Criterion B and C?',
      ],
      understandings: [
        {
          code: 'P2.COMP.1',
          text: 'Paper 2 Rules (May 2026+ Update): 1 hour 45 minutes, 25 marks (Criteria A: 5, B1: 5, B2: 5, C: 5, D: 5; pre-2026 legacy rubric was 30 marks), 25% of HL grade. Candidates cannot reuse a work already used for their Individual Oral or HL Essay.',
          isHL: false,
        },
        {
          code: 'P2.COMP.2',
          text: 'Cross-Genre & Cross-Cultural Comparison: Evaluating how both similarities in thematic concern and differences in genre/form (e.g., 19th-century realist drama vs 20th-century postmodern novel) shape meaning.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Paper 2: Comparative Essay Mastery (1h 45m · 25 Marks)

#### 1. Rubric Weighting Alert (May 2026+): B1 (Individual Craft) + B2 (Comparative Craft) = 10 of 25 Marks
In the updated Paper 2 rubric (**25 marks total**: A: 5, B1: 5, B2: 5, C: 5, D: 5), **Criterion B1** assesses analysis and evaluation of authorial choices in each work while **Criterion B2** specifically rewards **comparative evaluation** of how generic and formal differences between your two works produce different effects.

#### 2. High-Yield Cross-Genre Pairing: *Beloved* (Morrison) & *A Doll's House* (Ibsen)
| Analytical Dimension | *Beloved* (1987, Postmodern Novel) | *A Doll's House* (1879, Realist Drama) |
| :--- | :--- | :--- |
| **Spatial Confinement** | **124 Bluestone Road** — haunted gothic space where external trauma ("rememory") invades domestic refuge | **Helmer Drawing Room** — bourgeois domestic cage ("doll-house") whose locked letterbox and study door enforce patriarchal infantilization |
| **Transgressive Act of Agency** | Sethe's **infanticide** in the woodshed—an extreme maternal refusal to surrender her children to Schoolteacher's commodification | Nora's **forgery** of her father's signature and her final **abandonment of husband and children** to claim selfhood (*"first and foremost a human being"*) |
| **Formal / Generic Strategy** | Non-linear analepsis, polyphonic interior monologues (Part II), and choral community resolution (Part III) | Tightly compressed 3-act temporal unity (Christmas Eve to Boxing Day), dramatic irony, symbolic props (Tarantella, macaroons), and final acoustic door-slam |`,
      cheatsheetMarkdown: `- **Paper 2 Format:** 1h 45m | 25 Marks (**A: 5, B1: 5, B2: 5, C: 5, D: 5**; legacy pre-2026: 30 marks) | 25% of HL grade | Compare **2 works** not used in IO or HL Essay.
- **Top-Band Criterion B2 Secret:** Compare **genre conventions** (e.g., how Ibsen's visible stage props and real-time claustrophobia contrast with Morrison's non-linear interiority and analepsis).`,
      blurtChecklist: [
        'Paper 2 weighting (2026+): Criterion A (5), B1 Authorial Choices (5), B2 Comparative Craft (5), C (5), D (5) = 25 marks',
        'Cannot reuse works already submitted for the IO or HL Essay',
        'Cross-genre comparison: Drama stagecraft/proxemics (Ibsen) vs Novel focalization/temporality (Morrison)',
        'Integrated alternating synthesis structure across 3–4 conceptual themes',
      ],
    },
    {
      id: 'eng-hle-io',
      subjectSlug: 'eng',
      unitCode: 'Coursework · HL Essay & IO',
      unitTitle: 'HL Essay (20%) & Individual Oral (20%)',
      code: 'CW.HL',
      title: 'HL Essay Line of Inquiry & Individual Oral Global Issue Architecture',
      levelScope: 'HL Only',
      recommendedHours: 40,
      guidingQuestions: [
        'What distinguishes a genuine HL Essay "Line of Inquiry" from a generic thematic essay topic?',
        'How do you structure the 10-minute Individual Oral (50% extract / 50% whole work across 1 translated + 1 English text)?',
      ],
      understandings: [
        {
          code: 'CW.HL.1',
          text: 'HL Essay (1,200–1,500 words, 20 marks, 20%): Must explore a focused literary Line of Inquiry on ONE work studied (or a collection of 5–8 poems / short stories by one author), anchored in one of the 7 IB Central Concepts (Identity, Culture, Creativity, Communication, Perspective, Transformation, Representation).',
          isHL: true,
        },
        {
          code: 'CW.HL.2',
          text: 'Individual Oral (10 min presentation + 5 min teacher Q&A, 40 marks, 20%): Examines how ONE Global Issue (transnational, everyday significance, anchored in one of the 5 Fields of Inquiry) is presented in a 40-line extract and the wider work of ONE text in translation and ONE text originally in English.',
          isHL: true,
        },
      ],
      studyGuideMarkdown: `### Coursework Studio: HL Essay (20%) & Individual Oral (20%)

#### 1. The 7 IB Central Concepts for the HL Essay
1. **Identity** · 2. **Culture** · 3. **Creativity** · 4. **Communication** · 5. **Perspective** · 6. **Transformation** · 7. **Representation**
- **Formula for an HL Essay Line of Inquiry:** *[Author] + [Specific Formal/Structural Vehicle] + [Specific Text] + [Conceptual Tension/Effect]*.
- *Example (Camus, Representation/Perspective):* "How does Albert Camus utilize paratactic syntax and the structural bifurcation between sensory experience and judicial rhetoric in *The Stranger* to expose the coercive nature of social moral narratives?"

#### 2. Individual Oral (IO) Minute-by-Minute Blueprint (10:00 Total)
- **0:00 – 1:00 (1 min): Introduction:** State the exact **Global Issue** (narrowed from one of the 5 IB Fields of Inquiry), introduce both works (1 in translation, 1 in English), and state a comparative thesis on how each author's formal choices illuminate a different facet of the Global Issue.
- **1:00 – 3:15 (2m 15s): Work 1 Extract (40 lines max):** Zoom into 3–4 specific line-numbered formal choices in the translated extract and evaluate how they stage the Global Issue.
- **3:15 – 5:15 (2m 00s): Work 1 Wider Text:** Zoom out to 2–3 pivotal moments/patterns across the rest of Work 1 (or 2–3 other poems if using a poetry collection) to show macro-development.
- **5:15 – 7:30 (2m 15s): Work 2 Extract (40 lines max):** Pivot comparatively to the English work's 40-line extract; analyze 3–4 line-referenced formal choices.
- **7:30 – 9:30 (2m 00s): Work 2 Wider Text:** Connect to the broader architecture of Work 2.
- **9:30 – 10:00 (30s): Comparative Synthesis Conclusion:** Synthesize how the two genres/authors diverge or converge on the Global Issue.`,
      cheatsheetMarkdown: `- **HL Essay:** 1,200–1,500 words | 1 literary work | 7 Central Concepts | 20 Marks (A–D, 5 each) | 20% weight.
- **Individual Oral (IO):** 10m speech + 5m Q&A | 10-bullet outline (max 10 lines) | 1 work in translation + 1 work in English | 40-line extracts | 40 Marks (A–D, 10 each) | 20% weight.`,
      blurtChecklist: [
        '7 Central Concepts: Identity, Culture, Creativity, Communication, Perspective, Transformation, Representation',
        'HL Essay word limit (1,200–1,500 words) and single-work Line of Inquiry formula',
        'IO 5 Fields of Inquiry and narrow, transnational Global Issue criteria',
        'IO 10-minute timing: 1m Intro, 2m15s Extract 1, 2m Wider 1, 2m15s Extract 2, 2m Wider 2, 30s Conclusion',
      ],
    },
  ],
  questions: [
    {
      id: 'eng-q1-p1-poetry',
      subjectSlug: 'eng',
      topicId: 'eng-p1-unseen',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 20,
      commandTerm: 'Write a guided analysis',
      stemMarkdown:
        'Write a guided literary analysis of the following poem. In your answer you should consider the guiding question:\n\n**Guiding Question:** *How does the poet use sonic texture, lineation, and shifting temporal perspective to transform an ordinary domestic memory into an elegy on filial guilt?*',
      stimulusMarkdown:
        '**Unseen Lyric Study — "The Coal-Shed at Dusk"**\n\n> Every winter evening at five, the iron latch\n> clicked like a cocked trigger in the yard.\n> My father’s knuckles, whitened by the bucket’s wire bail,\n> vanished into the tar-black mouth of the lean-to.\n>\n> I sat inside behind the steamed kitchen pane,\n> conjugating Latin verbs by the paraffin lamp—\n> *amo, amas, amat*—while his shovel scraped\n> grit and slack against the concrete floor,\n> a rasping iron cough that measured out the dark.\n>\n> What did I know then of the coal-dust creases\n> etched permanent as ink into his palms,\n> or how love could weigh forty pounds of anthracite\n> carried silently across the frozen threshold?',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'crit-a',
          requirement:
            'Criterion A (5 marks): Perceptive interpretation of the tension between the child’s privileged scholarly interiority ("conjugating Latin verbs") and the father’s silent physical labor ("forty pounds of anthracite") as an unacknowledged language of love.',
          marks: 5,
        },
        {
          pointId: 'crit-b',
          requirement:
            'Criterion B (5 marks): Evaluates sonic texture (harsh velar/plosive consonants in "clicked like a cocked trigger", "scraped / grit and slack" vs liquid/nasal warmth), lineation/enjambment across stanzas, and the rhetorical volta in Stanza 3 ("What did I know then...").',
          marks: 5,
        },
        {
          pointId: 'crit-c',
          requirement:
            'Criterion C (5 marks): Coherent developmental structure tracing the spatial threshold (yard vs kitchen pane in Stanzas 1–2) to the retrospective temporal pivot in Stanza 3.',
          marks: 5,
        },
        {
          pointId: 'crit-d',
          requirement:
            'Criterion D (5 marks): Precise critical register (e.g., plosive alliteration, metonymy, spatial dichotomy, elegiac volta) with smoothly embedded micro-quotations.',
          marks: 5,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Formulate a Conceptual Thesis Answering the Guiding Question',
          explanationMarkdown:
            'Connect the **sonic and spatial contrast** (the harsh metallic plosives of the outdoor coal-shed vs. the warm indoor paraffin lamp where the speaker conjugates *"amo, amas, amat"*) to the poem’s **retrospective realization**: the speaker mastered the abstract grammar of love in Latin while failing to recognize its physical enactment in his father’s labor.',
        },
        {
          stepNumber: 2,
          title: 'Trace the Three-Stanza Movement (Observation -> Irony -> Elegiac Volta)',
          explanationMarkdown:
            'Analyze how **Stanza 1** frames the father’s labor in martial/sacrificial imagery (*"cocked trigger"*, *"tar-black mouth"*), **Stanza 2** juxtaposes academic literacy with the sonic intrusion of the shovel (*"rasping iron cough"*), and **Stanza 3** pivots via an interrogative **volta** (*"What did I know then"*) that fuses writing (*"ink"*) with manual labor (*"coal-dust creases"*).',
        },
      ],
      commonPitfalls: [
        'Summarizing what happens in each stanza without analyzing how the Latin conjugation "amo, amas, amat" ("I love, you love, he/she loves") functions as structural irony against the "forty pounds of anthracite".',
      ],
      isDailyEligible: true,
    },
    {
      id: 'eng-q2-p1-prose',
      subjectSlug: 'eng',
      topicId: 'eng-p1-unseen',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 20,
      commandTerm: 'Write a guided analysis',
      stemMarkdown:
        'Write a guided literary analysis of the following prose extract. In your answer you should consider the guiding question:\n\n**Guiding Question:** *How does the writer use narrative focalization, pacing, and symbolic detail to portray a moment of quiet psychological rebellion?*',
      stimulusMarkdown:
        '**Unseen Prose Fiction Extract — "The Inventory"**\n\n> For twenty-three years, Clara had polished the brass pendulum of the grandfather clock every Tuesday at nine. Its tick was the syntax of her marriage: measured, declarative, admitting no subordinate clauses. Arthur liked the hallway to smell of beeswax and lemon oil when he descended with his briefcase.\n>\n> Today, the cloth lay crumpled in her lap. Outside the bay window, an unseasonable October gale was stripping the copper beech in violent, joyous handfuls. Inside, the pendulum swung—left, right, left, right—slicing the morning into identical wafers of obligation. Clara reached inside the mahogany case. Her fingers closed around the warm brass disc. Slowly, deliberately, she drew it toward the side of the cabinet and let go. It struck the wood with a dull, off-key clatter, quivered twice, and hung dead center. In the sudden, ringing stillness, she heard the wind against the glass for the first time.',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'crit-a',
          requirement:
            'Criterion A (5 marks): Interprets the halting of the grandfather clock not merely as a domestic accident, but as Clara’s deliberate reclamation of temporal and personal agency from patriarchal routine.',
          marks: 5,
        },
        {
          pointId: 'crit-b',
          requirement:
            'Criterion B (5 marks): Evaluates the grammatical metaphor ("the syntax of her marriage: measured, declarative, admitting no subordinate clauses"), the foil of the "violent, joyous" wind outside the window, and the syntactic deceleration ("Slowly, deliberately...") culminating in the auditory contrast of "ringing stillness".',
          marks: 5,
        },
        {
          pointId: 'crit-c',
          requirement:
            'Criterion C (5 marks): Structured around the transition from habitual subjugation (Paragraph 1) to sensory awakening and physical intervention (Paragraph 2).',
          marks: 5,
        },
        {
          pointId: 'crit-d',
          requirement:
            'Criterion D (5 marks): Sophisticated critical vocabulary (e.g., internal focalization, metonymic symbol, hypotactic vs paratactic pacing, oxymoronic closure).',
          marks: 5,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Analyze the Metonymy of the Clock and Linguistic Metaphor',
          explanationMarkdown:
            'Highlight how the opening paragraph equates domestic order with oppressive grammar (*"syntax of her marriage: measured, declarative, admitting no subordinate clauses"*), establishing Clara as a suppressed clause within Arthur’s household.',
        },
        {
          stepNumber: 2,
          title: 'Evaluate Syntactic Pacing and Spatial Thresholds in Paragraph 2',
          explanationMarkdown:
            'Show how the repetitive binary syntax (*"left, right, left, right"*) and communion-wafer imagery (*"identical wafers of obligation"*) are broken by the tactile arrest of the brass disc, opening her auditory perception to the external wind.',
        },
      ],
      commonPitfalls: [
        'Missing the irony of "identical wafers of obligation" (sacramental ritual turned into hollow domestic servitude).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'eng-q3-p2-confinement',
      subjectSlug: 'eng',
      topicId: 'eng-p2-comp',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 25,
      commandTerm: 'Discuss',
      stemMarkdown:
        'Referring to **two** works you have studied, **discuss** how and to what effect writers use **physical or symbolic spaces of confinement** to explore human resilience or desperation.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'crit-a',
          requirement:
            'Criterion A (5 marks): Deep comparative understanding of two works (e.g., Morrison’s *Beloved* [124 Bluestone Road, the Alfred Georgia chain-gang boxes, Sweet Home] and Ibsen’s *A Doll’s House* [the single bourgeois drawing room] or Camus’s *The Stranger* [the Algiers prison cell]), sustaining comparison of resilience vs desperation.',
          marks: 5,
        },
        {
          pointId: 'crit-b1',
          requirement:
            'Criterion B1 (5 marks): Evaluates how each writer’s individual generic and stylistic choices construct confinement—Ibsen’s theatrical unity of place, threshold doors, and stage props alongside Morrison’s gothic personification ("124 was spiteful"), non-linear analepsis, and interior focalization.',
          marks: 5,
        },
        {
          pointId: 'crit-b2',
          requirement:
            'Criterion B2 (5 marks): Compares and contrasts the effects of those formal and generic differences (theatrical spatial claustrophobia vs narrated psychological haunting) on reader/audience response.',
          marks: 5,
        },
        {
          pointId: 'crit-c',
          requirement:
            'Criterion C (5 marks): Balanced, alternating comparative structure organized by conceptual sub-arguments rather than two separate essays.',
          marks: 5,
        },
        {
          pointId: 'crit-d',
          requirement:
            'Criterion D (5 marks): Precise academic register and literary terminology throughout.',
          marks: 5,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Build a Cross-Genre Comparative Thesis',
          explanationMarkdown:
            'Contrast how **Ibsen** uses a realistic, single-set bourgeois drawing room in *A Doll’s House* to expose the invisible ideological bars of 19th-century marriage, whereas **Morrison** transforms **124 Bluestone Road** in *Beloved* into a haunted psychological externalization of slavery’s lingering trauma.',
        },
        {
          stepNumber: 2,
          title: 'Compare How Characters Exit or Transform the Confined Space',
          explanationMarkdown:
            'Compare Nora’s individual exit through the downstairs door (dramatic sound effect severing bourgeois domesticity) with Denver’s step off the porch of 124 and the community of thirty women whose wordless sonic wave exorcises Beloved in Part III.',
        },
      ],
      commonPitfalls: [
        'Describing the plot of both texts without comparing how a *stage set* operates differently from a *narrated novelistic space*.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'eng-q4-p2-justice',
      subjectSlug: 'eng',
      topicId: 'eng-p2-comp',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 25,
      commandTerm: 'Compare and contrast',
      stemMarkdown:
        'In what ways and to what effect do **two** works you have studied portray the conflict between **individual conscience and institutional or societal authority**?',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'crit-a',
          requirement:
            'Criterion A (5 marks): Perceptive comparison of two works (e.g., Sophocles’ *Antigone* and Camus’s *The Stranger* or Ibsen’s *A Doll’s House*), contrasting sacred/moral defiance (Antigone) or existential authenticity (Meursault) against state/judicial orthodoxy.',
          marks: 5,
        },
        {
          pointId: 'crit-b1',
          requirement:
            'Criterion B1 (5 marks): Evaluates individual authorial craft: Sophocles’ tragic *stichomythia* between Creon and Antigone, choral odes, and live burial imagery alongside Camus’s structural split (Part I sensory beach vs Part II courtroom theater) and detached first-person parataxis.',
          marks: 5,
        },
        {
          pointId: 'crit-b2',
          requirement:
            'Criterion B2 (5 marks): Directly compares how tragic choral staging vs alienated first-person prose narration construct moral tension and shape audience judgement.',
          marks: 5,
        },
        {
          pointId: 'crit-c-d',
          requirement:
            'Criteria C & D (10 marks): Sustained comparative organization (5 marks) and fluent critical terminology (5 marks).',
          marks: 10,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Contrast Transcendent Duty vs. Absurd Authenticity',
          explanationMarkdown:
            'Show that while **Antigone** defies Creon’s civic *kerygma* in the name of higher, eternal divine laws (*agrapta nomima*), **Meursault** in *The Stranger* defies the French colonial magistrate and chaplain not for a higher moral code, but by refusing to lie about his emotional state in an absurd universe.',
        },
        {
          stepNumber: 2,
          title: 'Compare Public Agon (Stichomythia) with Internalized Trial Narration',
          explanationMarkdown:
            'Compare how Sophocles stages the clash externally through symmetrical **agon** and rapid-fire **stichomythia** before the Chorus of Theban Elders, whereas Camus filters the courtroom prosecution through Meursault’s alienated, ironic first-person interiority.',
        },
      ],
      commonPitfalls: [
        'Treating Meursault as a traditional moral hero like Antigone without addressing the ambiguity of his murder of the unnamed Arab in Part I.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'eng-q5-hle-inquiry',
      subjectSlug: 'eng',
      topicId: 'eng-hle-io',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 8,
      commandTerm: 'Evaluate and refine',
      stemMarkdown:
        '**HL Essay Coursework Diagnostic (Single-Work Line of Inquiry):** A student drafting their **HL Essay** on Carol Ann Duffy’s *The World’s Wife* (1999) proposes the following research question:\n\n> *"How does Carol Ann Duffy show that women are mistreated by men in The World’s Wife?"*\n\n**1.** Identify **two** weaknesses in this draft question under the HL Essay rubric **[4 marks]**.\n**2.** Rewrite it into a top-band **Line of Inquiry** anchored in an IB Central Concept and specific poetic craft, naming **at least three poems** from the collection **[4 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'weakness-1',
          requirement:
            'Identifies two rubric flaws: (1) Purely thematic/sociological rather than literary—lacks any formal/stylistic vehicle (Criterion B); (2) Overly simplistic and binary ("mistreated by men"), ignoring Duffy’s ironic complexity, complicity, and female artistic empowerment.',
          marks: 4,
        },
        {
          pointId: 'rewrite-1',
          requirement:
            'Rewrites into a rigorous Line of Inquiry linking a Central Concept (e.g., Representation, Transformation, or Voice/Perspective) + specific formal craft (subversion of dramatic monologue, colloquial bathos, sonic/syntactic shifts) across named poems (e.g., "Little Red Cap", "Mrs Midas", "Medusa", "Eurydice", "Penelope").',
          marks: 4,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Diagnose Why Thematic-Only Questions Cap Criterion B',
          explanationMarkdown:
            'Without naming a **formal/authorial vehicle** in the Line of Inquiry, the essay defaults to summarizing plot grievances rather than analyzing how Duffy constructs meaning through poetic form.',
        },
        {
          stepNumber: 2,
          title: 'Apply the HL Essay Line of Inquiry Formula',
          explanationMarkdown:
            'Model rewrite: *"How does Carol Ann Duffy subvert the conventions of the dramatic monologue through colloquial bathos, revisionist intertextuality, and shifting tonal registers in \'Little Red Cap\', \'Mrs Midas\', \'Medusa\', and \'Eurydice\' to transform silenced mythological women into autonomous speaking subjects?"*',
        },
      ],
      commonPitfalls: [
        'Proposing an HL Essay on a single 30-line lyric poem (IB requires a collection of 5–8 poems when writing an HL Essay on poetry).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'eng-q6-io-global-issue',
      subjectSlug: 'eng',
      topicId: 'eng-hle-io',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 8,
      commandTerm: 'Construct',
      stemMarkdown:
        '**Individual Oral (IA) Global Issue Diagnostic:** Using **one work in translation** (e.g., Ibsen’s *A Doll’s House* or Camus’s *The Stranger*) and **one work originally written in English** (e.g., Morrison’s *Beloved* or Duffy’s *The World’s Wife*), **construct** an Individual Oral opening roadmap that includes:\n1. The IB **Field of Inquiry** and a sharply narrowed **Global Issue** **[3 marks]**.\n2. Specific **40-line extracts** from each work and how each author’s **formal choices** illuminate the Global Issue **[5 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'gi-1',
          requirement:
            'States a valid Field of Inquiry (e.g., Culture, identity and community or Politics, power and justice) and narrows it into a specific, transnational Global Issue (e.g., "How patriarchal and racialized institutions weaponize language and domestic spaces to strip marginalized individuals of self-determination").',
          marks: 3,
        },
        {
          pointId: 'extracts-1',
          requirement:
            'Pairs one work in translation + one English work with concrete 40-line extracts and specific formal techniques (e.g., Ibsen Act III Nora/Torvald confrontation [diminutive epithets, spatial threshold, abandoning theatrical costume] paired with Morrison *Beloved* Schoolteacher’s notebook / woodshed passage or Duffy’s "Little Red Cap" / "Eurydice").',
          marks: 5,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Narrow the Global Issue from Broad Topic to Specific Mechanism',
          explanationMarkdown:
            'Never state a one-word topic like *"Gender"* or *"Racism"*. Instead, articulate a specific human mechanism: *"The way dominant social institutions enforce linguistic and spatial control to silence dissenting identity."*',
        },
        {
          stepNumber: 2,
          title: 'Map 50% Extract Craft + 50% Whole-Work Architecture',
          explanationMarkdown:
            'Specify the exact 40-line extract for each text and preview both micro-level language features inside the extract and macro-level structural turns across the wider work.',
        },
      ],
      commonPitfalls: [
        'Selecting two works both originally written in English or two works both in translation.',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'eng-ref-devices-1',
      subjectSlug: 'eng',
      toolType: 'literary_device',
      category: 'Micro & Macro Formal Craft',
      title: 'High-Precision Literary & Dramatic Terminology Bank',
      codeOrSymbol: 'CRIT-B/D',
      payload: {
        devices: [
          {
            term: 'Free Indirect Discourse',
            genre: 'Prose Fiction',
            definition:
              'Third-person narration that adopts the lexical idiom, emotional cadence, and ideological blind spots of a character without explicit quotation marks or "she thought" tags.',
            exemplarApplication:
              'In Beloved, Morrison slips into Sethe’s interior focalization as she justifies the woodshed act ("collected every bit of life she had made... and carried, pushed, dragged them through the veil"), immersing the reader in her maternal urgency before stepping back.',
          },
          {
            term: 'Parataxis vs. Hypotaxis',
            genre: 'Prose & Poetry',
            definition:
              'Parataxis places short independent clauses side by side without subordinating conjunctions; hypotaxis nests clauses in complex hierarchical subordination.',
            exemplarApplication:
              'In Part I of The Stranger, Camus’s Meursault narrates in flat paratactic clauses ("Maman died today. Or yesterday maybe, I don’t know"), formally refusing to impose false causal or moral hierarchies onto raw sensory existence.',
          },
          {
            term: 'Stichomythia',
            genre: 'Drama (Greek Tragedy & Modern Realism)',
            definition:
              'Rapid-fire dialogue in which two disputing characters speak alternate single lines of verse or prose, often echoing and inverting each other’s key words.',
            exemplarApplication:
              'In Sophocles’ Antigone, the stichomythic duel between Creon and Antigone ("Creon: An enemy is an enemy, even in death. / Antigone: It is my nature to join in love [sumphilein], not in hatred [sunechthein]") dramatizes the total linguistic breakdown between state decree and kinship piety.',
          },
          {
            term: 'Medial Caesura & Enjambment',
            genre: 'Poetry',
            definition:
              'Caesura is a rhythmic pause inside a line of verse triggered by punctuation; enjambment propels syntax across a line or stanza boundary without punctuation.',
            exemplarApplication:
              'In Duffy’s "Mrs Midas", abrupt medial caesurae ("Look, we all have wishes; granted. / But who has wishes granted?") mimic her incredulous conversational recoil before elegiac enjambment captures her lingering grief.',
          },
          {
            term: 'Proxemics & Threshold Semiotics',
            genre: 'Drama',
            definition:
              'The theatrical use of spatial distance between actors, stage zones, doors, and physical barriers to signify power dynamics and psychological entrapment.',
            exemplarApplication:
              'In Ibsen’s A Doll’s House, Torvald’s closed study door and the locked letterbox physically partition knowledge and financial power until Nora crosses the downstairs threshold in Act III.',
          },
        ],
      },
    },
    {
      id: 'eng-ref-global-issues-1',
      subjectSlug: 'eng',
      toolType: 'global_issue',
      category: 'Individual Oral (IO) Pairings',
      title: 'Curated IB Global Issues & Cross-Text Pairings (Translated + English)',
      codeOrSymbol: 'IO-BANK',
      payload: {
        pairings: [
          {
            fieldOfInquiry: 'Politics, Power and Justice',
            globalIssue:
              'How legal and state institutions criminalize individuals who refuse to perform socially mandated moral scripts.',
            workInTranslation:
              'Albert Camus, The Stranger (1942) — Part II Examining Magistrate & Prosecutor’s closing speech condemning Meursault’s tearless demeanour at his mother’s funeral.',
            workInEnglish:
              'Toni Morrison, Beloved (1987) — Schoolteacher’s arrival at 124 under the Fugitive Slave Act of 1850 and the post-emancipation community’s initial moral judgment of Sethe’s pride.',
          },
          {
            fieldOfInquiry: 'Culture, Identity and Community',
            globalIssue:
              'The struggle of women to reclaim autonomous voice and selfhood from infantilizing or silencing patriarchal narratives.',
            workInTranslation:
              'Henrik Ibsen, A Doll’s House (1879) — Act III reckoning where Nora discards her Capri masquerade dress and rejects Torvald’s "skylark/squirrel" diminutives.',
            workInEnglish:
              'Carol Ann Duffy, The World’s Wife (1999) — "Little Red Cap", "Eurydice", and "Penelope", where female speakers dismantle male poetic mythmaking.',
          },
          {
            fieldOfInquiry: 'Beliefs, Values and Education',
            globalIssue:
              'The tragic collision between inflexible institutional orthodoxy and sacred familial duty.',
            workInTranslation:
              'Sophocles, Antigone (441 BCE) — Creon’s civic edict forbidding Polynices’ burial vs Antigone’s appeal to unwritten divine laws.',
            workInEnglish:
              'Toni Morrison, Beloved (1987) — Sethe’s transgressive maternal protection vs institutional slavery and Paul D’s conventional moral alarm ("You got two feet, Sethe, not four").',
          },
        ],
      },
    },
    {
      id: 'eng-ref-hle-1',
      subjectSlug: 'eng',
      toolType: 'essay_outline',
      category: 'HL Essay · 1,200–1,500 Words',
      title: 'HL Essay Line of Inquiry Builder across the 7 Central Concepts',
      codeOrSymbol: 'HLE-7',
      payload: {
        concepts: [
          {
            concept: 'Representation',
            work: 'Toni Morrison, Beloved (1987)',
            lineOfInquiry:
              'How does Toni Morrison employ fragmented non-linear temporality, shifting focalization, and the motif of "rememory" in Beloved to represent the unspeakable intergenerational trauma of slavery?',
          },
          {
            concept: 'Transformation',
            work: 'Carol Ann Duffy, The World’s Wife (1999)',
            lineOfInquiry:
              'How does Carol Ann Duffy utilize colloquial bathos, dramatic monologue subversion, and bodily metamorphosis across six poems in The World’s Wife to transform silenced mythological women into autonomous subjects?',
          },
          {
            concept: 'Perspective',
            work: 'Albert Camus, The Stranger (1942)',
            lineOfInquiry:
              'In what ways does Albert Camus’s juxtaposition of sensory parataxis in Part I and theatrical judicial rhetoric in Part II of The Stranger critique society’s compulsion to impose teleological meaning onto an indifferent universe?',
          },
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'eng-deck-quotes-craft',
      subjectSlug: 'eng',
      topicId: 'eng-aoe-3',
      title: 'Set Works Anchor Quotes & Formal Craft (Beloved, Doll’s House, Stranger, Duffy, Antigone)',
      description:
        'High-yield textual quotations paired with formal device analysis for Paper 2, the HL Essay, and the Individual Oral.',
      cards: [
        {
          id: 'eng-fc-1',
          frontMarkdown:
            '**Toni Morrison, *Beloved*:** Compare the three opening sentences of Part I, Part II, and Part III.',
          backMarkdown:
            '- **Part I:** *"124 was spiteful. Full of a baby’s venom."*\n- **Part II:** *"124 was loud."*\n- **Part III:** *"124 was quiet."*\n- **Craft & Effect:** Prosopopoeia (personification) of the house tracks the structural arc of trauma from spectral haunting (I), to cacophonous possession (II), to communal exorcism and exhausted peace (III).',
          tags: ['Beloved', 'Structure', 'Paper 2'],
        },
        {
          id: 'eng-fc-2',
          frontMarkdown:
            '**Toni Morrison, *Beloved*:** How does the **"chokecherry tree"** scar function across multiple perspectives?',
          backMarkdown:
            'Wrought by Schoolteacher’s nephew’s whip, it is aestheticized by white indentured runaway **Amy Denver** as a *"chokecherry tree"* (imaginative empathy that aids survival), cherished by **Paul D** initially before he recoils at it as *"a revolting clump of scars"*, embodying how trauma is simultaneously read as text and borne as flesh.',
          tags: ['Beloved', 'Symbolism', 'Perspective'],
        },
        {
          id: 'eng-fc-3',
          frontMarkdown:
            '**Henrik Ibsen, *A Doll’s House*:** Analyze the dramatic shift in Act III when Nora says: *"I must stand quite alone, if I am to understand myself and everything about me."*',
          backMarkdown:
            'Delivered after Nora removes her **Capri fancy-dress costume** (shedding the performative "doll/skylark" role Torvald scripted for her) and demands they sit at the table for their first serious exchange; subverts the 19th-century *well-made play* reconciliation and culminates in the acoustic slam of the downstairs door.',
          tags: ['A Doll’s House', 'Stagecraft', 'Identity'],
        },
        {
          id: 'eng-fc-4',
          frontMarkdown:
            '**Albert Camus, *The Stranger*:** Analyze the closing lines: *"I opened myself to the gentle indifference of the world. Finding it so much like myself—so like a brother, really—I felt that I had been happy and that I was happy again."*',
          backMarkdown:
            'Follows Meursault’s cathartic outburst against the prison chaplain; shifts from clipped, sensory **parataxis** to lyrical, oxymoronic serenity (*"gentle indifference"* / *tendre indifférence*), encapsulating Camus’s **Absurd hero** who achieves freedom by rejecting illusory afterlife hope.',
          tags: ['The Stranger', 'Philosophy of the Absurd', 'Syntax'],
        },
        {
          id: 'eng-fc-5',
          frontMarkdown:
            '**Carol Ann Duffy, *The World’s Wife* ("Little Red Cap"):** Analyze *"I took an axe / to a willow to see how it wept. I took an axe to a salmon / to see how it leapt. I took an axe to the wolf / as he slept, one chop, scrotum to throat..."*',
          backMarkdown:
            '**Anaphora** (*"I took an axe"*), internal rhyme (*wept / leapt / slept*), and violent monosyllabic cadence mark the speaker’s progression from passive poetic apprentice to autonomous creator who dissects patriarchal literary tradition to reclaim her grandmother’s memory (her grandmother’s white *"bones"*).',
          tags: ['Duffy', 'Dramatic Monologue', 'IO'],
        },
        {
          id: 'eng-fc-6',
          frontMarkdown:
            '**Sophocles, *Antigone*:** How does **Antigone’s** defense of the *"unwritten and unfailing statutes of heaven"* (*agrapta nomima*) contrast with **Creon’s** *Ship of State* speech?',
          backMarkdown:
            'Creon relies on civic **metaphor** (*Ship of State*) and temporal political hierarchy (*kerygma*), asserting that the polis defines all friendship (*philia*); Antigone appeals to eternal, chthonic kinship duty that precedes and outlives any mortal king, exposing Creon’s *hubris* and *hamartia*.',
          tags: ['Antigone', 'Tragedy', 'Paper 2'],
        },
      ],
    },
  ],
};
