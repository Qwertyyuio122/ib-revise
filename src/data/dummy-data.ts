import {
  Subject,
  SyllabusTopic,
  SampleQuestion,
  SampleFlashcard,
  IBCoreItem,
} from '../types/database';

/**
 * Sample Dummy Data for Phase 1 UI Exploration
 * Strictly scoped to the 6 core IB subjects + 3 IB Core categories.
 * Note: Full 30,000+ question bank ingestion is deferred to Phase 3.
 */

export const DUMMY_USER = {
  id: 'usr_alex_m_2026',
  name: 'Alex M.',
  session: 'May 2026 Session',
  sessionStatus: 'Session on track',
};

export const DUMMY_SUBJECTS: Subject[] = [
  {
    id: 'sub_bio_hl',
    name: 'Biology HL',
    level: 'HL',
    code: 'BIO_HL',
    subtitle: 'Cell Biology & Genetics',
    dueCardsCount: 12,
    statusLabel: '12 cards due',
  },
  {
    id: 'sub_hist_hl',
    name: 'History HL',
    level: 'HL',
    code: 'HIST_HL',
    subtitle: 'Authoritarian States & Cold War',
    dueCardsCount: 8,
    statusLabel: '8 cards due',
  },
  {
    id: 'sub_eng_hl',
    name: 'English Literature HL',
    level: 'HL',
    code: 'ENG_LIT_HL',
    subtitle: 'Guided Literary Analysis',
    dueCardsCount: 0,
    statusLabel: 'Up to date',
  },
  {
    id: 'sub_math_aa_sl',
    name: 'Mathematics AA SL',
    level: 'SL',
    code: 'MATH_AA_SL',
    subtitle: 'Calculus & Functions',
    dueCardsCount: 15,
    statusLabel: '15 cards due',
  },
  {
    id: 'sub_fr_b_sl',
    name: 'French B SL',
    level: 'SL',
    code: 'FR_B_SL',
    subtitle: 'Language & Text Handling',
    dueCardsCount: 20,
    statusLabel: '20 cards due',
  },
  {
    id: 'sub_chem_sl',
    name: 'Chemistry SL',
    level: 'SL',
    code: 'CHEM_SL',
    subtitle: 'Stoichiometry & Structure',
    dueCardsCount: 0,
    statusLabel: 'Up to date',
  },
];

export const DUMMY_SYLLABUS_TOPICS: SyllabusTopic[] = [
  {
    id: 'top_bio_1_2',
    subjectId: 'sub_bio_hl',
    topicNumber: 'A2.2',
    title: 'Cell Structure & Membrane Transport',
    subtopics: ['Fluid mosaic model', 'Cholesterol in animal membranes', 'Osmolarity & water potential'],
  },
  {
    id: 'top_bio_2_1',
    subjectId: 'sub_bio_hl',
    topicNumber: 'D1.1',
    title: 'DNA Replication & Protein Synthesis',
    subtopics: ['Leading vs lagging strand', 'Helicase & DNA polymerase III', 'Okazaki fragments'],
  },
  {
    id: 'top_hist_2_1',
    subjectId: 'sub_hist_hl',
    topicNumber: 'P2.10',
    title: 'Authoritarian States (20th Century)',
    subtopics: ['Emergence of authoritarian states', 'Consolidation and maintenance of power', 'Domestic policies'],
  },
  {
    id: 'top_math_5_3',
    subjectId: 'sub_math_aa_sl',
    topicNumber: '5.5',
    title: 'Definite Integrals & Kinematics',
    subtopics: ['Integration by substitution', 'Area between curves', 'Displacement vs total distance'],
  },
  {
    id: 'top_chem_1_3',
    subjectId: 'sub_chem_sl',
    topicNumber: 'S2.2',
    title: 'Covalent Bonding & VSEPR Geometry',
    subtopics: ['Electron domain geometry', 'Bond angles & lone pair repulsion', 'Polarity of molecules'],
  },
];

export const DUMMY_FLASHCARDS: SampleFlashcard[] = [
  {
    id: 'fc_bio_01',
    subjectCode: 'BIO_HL',
    topicId: 'top_bio_1_2',
    topicLabel: 'Cell Biology • Topic 1.2',
    frontPrompt: 'State the function of cholesterol in animal cell membranes.',
    backAnswer:
      'Cholesterol immobilizes the outer surface of the membrane, reducing fluidity at moderate temperatures, hindering solidification at low temperatures, and decreasing permeability to hydrophilic ions.',
    keyTerms: ['membrane fluidity', 'hydrophilic permeability', 'amphipathic'],
    nextReviewLabel: 'Next: 4 days',
    stability: 4.2,
    difficulty: 3.1,
  },
  {
    id: 'fc_bio_02',
    subjectCode: 'BIO_HL',
    topicId: 'top_bio_2_1',
    topicLabel: 'Molecular Biology • Topic D1.1',
    frontPrompt: 'Distinguish between the roles of DNA gyrase and helicase during DNA replication in prokaryotes.',
    backAnswer:
      'DNA gyrase (topoisomerase) relieves torsional strain and supercoiling ahead of the replication fork, whereas helicase unwinds the double helix by breaking hydrogen bonds between complementary bases.',
    keyTerms: ['torsional strain', 'hydrogen bonds', 'replication fork'],
    nextReviewLabel: 'Due now',
    stability: 1.8,
    difficulty: 4.5,
  },
  {
    id: 'fc_hist_01',
    subjectCode: 'HIST_HL',
    topicId: 'top_hist_2_1',
    topicLabel: 'Authoritarian States • Paper 2',
    frontPrompt: 'Identify two historiographical perspectives on how economic crisis contributed to the rise of an authoritarian leader.',
    backAnswer:
      'Structuralist historians emphasize systemic economic collapse and institutional paralysis as decisive preconditions, whereas intentionalist historians focus on opportunistic propaganda and tactical alliances by party leadership.',
    keyTerms: ['structuralist', 'intentionalist', 'economic crisis'],
    nextReviewLabel: 'Due now',
    stability: 2.5,
    difficulty: 5.0,
  },
  {
    id: 'fc_math_01',
    subjectCode: 'MATH_AA_SL',
    topicId: 'top_math_5_3',
    topicLabel: 'Calculus • Topic 5.5',
    frontPrompt: 'State the relationship between velocity v(t) and total distance travelled on the interval [a, b].',
    backAnswer:
      'Total distance travelled is the definite integral of speed: ∫[a to b] |v(t)| dt, whereas net displacement is ∫[a to b] v(t) dt.',
    keyTerms: ['absolute value', 'net displacement', 'definite integral'],
    nextReviewLabel: 'Due now',
    stability: 3.4,
    difficulty: 2.8,
  },
];

export const DUMMY_SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: 'q_math_m23_p1_06',
    subjectCode: 'MATH_AA_SL',
    topicId: 'top_math_5_3',
    topicLabel: 'Calculus • Definite Integrals',
    paper: 'P1',
    session: 'M23-TZ2-SL-P1-Q6',
    questionType: 'SHORT',
    promptMarkdown:
      'Let $f(x) = \\frac{6x}{x^2 + 1}$. Find the exact value of $\\int_0^{\\sqrt{3}} f(x)\\,dx$, giving your answer in the form $a \\ln b$ where $a, b \\in \\mathbb{Z}^+$.',
    markSchemeMarkdown:
      '- **M1**: Recognizes substitution $u = x^2 + 1 \\implies du = 2x\\,dx$ or inspection of $\\int \\frac{f\'(x)}{f(x)}dx$\n- **A1**: Antiderivative written as $3\\ln(x^2 + 1)$\n- **M1**: Substitutes limits $x = \\sqrt{3}$ and $x = 0$: $3\\ln(3 + 1) - 3\\ln(1)$\n- **A1**: Final answer $3\\ln 4$ (or $6\\ln 2$)',
    maxMarks: 6,
    difficulty: 4,
    status: 'BOOKMARKED',
  },
  {
    id: 'q_bio_n23_p2_03',
    subjectCode: 'BIO_HL',
    topicId: 'top_bio_1_2',
    topicLabel: 'Cell Biology • Membrane Transport',
    paper: 'P2',
    session: 'N23-TZ0-HL-P2-Q3a',
    questionType: 'SHORT',
    promptMarkdown:
      'Explain how the amphipathic properties of phospholipids maintain the stability of the plasma membrane in aqueous environments.',
    markSchemeMarkdown:
      '- **1 mark**: Phosphate heads are hydrophilic / polar and face outward toward aqueous extracellular fluid and cytoplasm.\n- **1 mark**: Hydrocarbon fatty acid tails are hydrophobic / non-polar and orient inward away from water.\n- **1 mark**: Hydrophobic interactions between tails create a stable bilayer core that acts as a barrier to polar molecules.',
    maxMarks: 3,
    difficulty: 3,
    status: 'MASTERED',
  },
  {
    id: 'q_hist_m23_p2_19',
    subjectCode: 'HIST_HL',
    topicId: 'top_hist_2_1',
    topicLabel: 'Authoritarian States • Paper 2',
    paper: 'P2',
    session: 'M23-TZ1-HL-P2-Q19',
    questionType: 'EXTENDED',
    promptMarkdown:
      '“The maintenance of power in authoritarian states depended more on popular consent than on coercion.” Discuss with reference to **two** authoritarian states, each chosen from a different region.',
    markSchemeMarkdown:
      '- **Focus**: Candidates must offer a considered and balanced review of both popular consent (propaganda, social policies, economic stability, charismatic authority) and coercion (secret police, purges, censorship, legal repression).\n- **Regional requirement**: Two states from different IB regions required for marks above 9/15.\n- **Markband 13–15**: Explicit synthesis weighing how coercion and consent reinforced one another rather than treating them in isolation.',
    maxMarks: 15,
    difficulty: 6,
    status: 'ATTEMPTED',
  },
];

export const DUMMY_IB_CORE_ITEMS: IBCoreItem[] = [
  {
    id: 'core_tok_01',
    categoryLabel: 'Theory of Knowledge',
    type: 'TOK_ESSAY',
    title: 'Prescribed Title #3: Models & Simplification in Natural Sciences and History',
    statusSummary: 'TOK Exhibition Passed',
    highlightNote: 'Essay Outline in review',
    draftStatus: 'OUTLINE',
    wordCount: 640,
    targetWordCount: 1600,
    deadline: '2026-11-28',
    supervisorFeedback: 'Strong AOK contrast between History and Biology; refine your second counterclaim.',
  },
  {
    id: 'core_ee_01',
    categoryLabel: 'Extended Essay',
    type: 'EXTENDED_ESSAY',
    subjectCode: 'HIST_HL',
    title: 'World Studies / History EE: Economic Reconstruction & Urban Policy (1948–1956)',
    statusSummary: 'First Draft (4,000w)',
    highlightNote: 'Due Dec 4',
    draftStatus: 'FIRST_DRAFT',
    wordCount: 3420,
    targetWordCount: 4000,
    deadline: '2026-12-04',
    supervisorFeedback: 'Primary archival citations are well integrated. Condense section 2 narrative to leave room for historiography.',
  },
  {
    id: 'core_ia_01',
    categoryLabel: 'Internal Assessment',
    type: 'IA',
    subjectCode: 'CHEM_SL',
    title: 'Chemistry & Math Drafts',
    statusSummary: 'Chemistry & Math Drafts',
    highlightNote: '3 of 6 Submitted',
    draftStatus: 'SUPERVISOR_REVIEW',
    wordCount: 2150,
    targetWordCount: 3000,
    deadline: '2027-01-15',
    supervisorFeedback: 'Propagation of random uncertainty tables verified; add systematic error evaluation.',
  },
];
