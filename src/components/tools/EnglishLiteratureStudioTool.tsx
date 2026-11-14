'use client';

import React, { useState, useMemo, useEffect } from 'react';

type EnglishStudioTab = 'devices' | 'global-issues' | 'prl-planner';

function resolveEnglishTab(tab?: string): EnglishStudioTab {
  if (tab === 'global-issues') return 'global-issues';
  if (tab === 'prl-planner' || tab === 'prl') return 'prl-planner';
  return 'devices';
}

interface LiteraryDeviceDrillCard {
  id: string;
  device: string;
  genre: 'Poetry' | 'Prose Fiction' | 'Drama';
  workCitation: string;
  excerpt: string;
  weakFeatureSpotting: string;
  criterionBExemplar: string;
}

interface FieldOfInquirySpec {
  id: string;
  fieldTitle: string;
  ibDescription: string;
  narrowGlobalIssues: {
    issueStatement: string;
    suggestedPairing: string;
    ioThesisAngle: string;
  }[];
}

interface PrlWorkAllocation {
  id: string;
  title: string;
  author: string;
  form: 'Poetry' | 'Drama' | 'Prose: Novel/Novella' | 'Prose: Non-Fiction/Short Stories';
  origin: 'Original English' | 'Work in Translation';
  period: 'Pre-20th Century' | '20th/21st Century';
  assignedAssessment: 'Unassigned' | 'Individual Oral (IO)' | 'HL Essay' | 'Paper 2 Comparative';
}

const DEVICE_DRILLS: LiteraryDeviceDrillCard[] = [
  {
    id: 'caesura-enjambment',
    device: 'Medial Caesura & Enjambment',
    genre: 'Poetry',
    workCitation: 'Seamus Heaney, "Mid-Term Break" (Death of a Naturalist, 1966)',
    excerpt:
      '"A four-foot box, a foot for every year." / "Snowdrops / And candles soothed the bedside; I saw him / For the first time in six weeks. Paler now..."',
    weakFeatureSpotting:
      'Weak (Band 3): The poet uses a caesura in "six weeks. Paler now" and alliteration in "four-foot box" to make the poem flow and emphasize how sad the speaker is.',
    criterionBExemplar:
      'Band 7 Criterion B: The abrupt medial caesura after "six weeks." fractures the syntactic momentum built by the preceding enjambment ("I saw him / For the first time"), enacting the speaker’s sudden visual arrest upon confronting his brother’s corpse, while the stark monosyllabic meter of the final isolated line ("A four-foot box, a foot for every year") reduces grief to a devastating spatial-temporal equation.',
  },
  {
    id: 'free-indirect-discourse',
    device: 'Free Indirect Discourse & Irony',
    genre: 'Prose Fiction',
    workCitation: 'Jane Austen, Pride and Prejudice / Virginia Woolf, Mrs Dalloway',
    excerpt:
      '"Mrs. Dalloway said she would buy the flowers herself. For Lucy had her work cut out for her. The doors would be taken off their hinges; Rumpelmayer’s men were coming."',
    weakFeatureSpotting:
      'Weak (Band 3): The third-person narrator tells us what Clarissa Dalloway is thinking about Lucy and the party preparations so the reader understands the setting.',
    criterionBExemplar:
      'Band 7 Criterion B: Through free indirect discourse ("For Lucy had her work cut out for her"), the heterodiegetic third-person voice dissolves seamlessly into Clarissa’s colloquial interiority, blurring the boundary between social performance and private consciousness.',
  },
  {
    id: 'chiasmus-polyptoton',
    device: 'Chiasmus & Antimetabole',
    genre: 'Drama',
    workCitation: 'William Shakespeare, Macbeth / Othello',
    excerpt:
      '"Fair is foul, and foul is fair: / Hover through the fog and filthy air." (1.1.11–12)',
    weakFeatureSpotting:
      'Weak (Band 3): The Witches repeat the words "fair" and "foul" backwards to show that things are confusing in Scotland.',
    criterionBExemplar:
      'Band 7 Criterion B: The chiastic inversion of "Fair is foul, and foul is fair" establishes a linguistic mirror-structure that collapses moral binaries before Macbeth even steps on stage, acoustically reinforced by the trochaic tetrameter and labiodental fricatives (/f/) that set the Witches’ incantation apart from the court’s blank verse.',
  },
  {
    id: 'dramatic-irony-stagecraft',
    device: 'Proxemics, Lighting & Dramatic Irony',
    genre: 'Drama',
    workCitation: 'Tennessee Williams, A Streetcar Named Desire / Henrik Ibsen, A Doll’s House',
    excerpt:
      '"[Blanche] places the Chinese paper lantern over the naked light bulb... \'I can’t stand a naked light bulb, any more than I can a rude remark or a vulgar action.\'"',
    weakFeatureSpotting:
      'Weak (Band 3): The paper lantern is a symbol of how Blanche lies about her age and wants to hide the truth from Mitch.',
    criterionBExemplar:
      'Band 7 Criterion B: Williams embeds plastic theatre into the stage property of the fragile paper lantern: by diffusing the harsh realism of the "naked light bulb", Blanche spatially constructs an illusion of Southern belle gentility inside Stanley’s cramped Elysian Fields flat—making Mitch’s later tearing away of the lantern a violent theatrical unmasking.',
  },
];

const FIELDS_OF_INQUIRY: FieldOfInquirySpec[] = [
  {
    id: 'politics-power',
    fieldTitle: '1. Politics, Power and Justice',
    ibDescription:
      'Hierarchy, state control, resistance, gender/patriarchal authority, post-colonial subjugation, and the ethics of complicity.',
    narrowGlobalIssues: [
      {
        issueStatement:
          'How totalitarian or patriarchal regimes weaponize domestic surveillance and linguistic censorship to fracture private familial trust.',
        suggestedPairing: 'Atwood’s The Handmaid’s Tale + Satrapi’s Persepolis (or Sophocles’ Antigone)',
        ioThesisAngle:
          'Compare how claustrophobic domestic framing (graphic panels vs fragmented night-time monologues) exposes the internalization of state surveillance.',
      },
      {
        issueStatement:
          'The complicity of the passive bystander in sustaining institutionalized racial or socioeconomic violence.',
        suggestedPairing: 'Morrison’s Beloved + García Márquez’s Chronicle of a Death Foretold',
        ioThesisAngle:
          'Examine how communal polyphony and retrospective nonlinear chronology indict collective silence.',
      },
    ],
  },
  {
    id: 'culture-identity',
    fieldTitle: '2. Culture, Identity and Community',
    ibDescription:
      'Diaspora, assimilation pressure, class mobility, marginalization, and the tension between individual autonomy and social conformity.',
    narrowGlobalIssues: [
      {
        issueStatement:
          'The psychological fragmentation experienced by displaced or marginalized individuals forced to perform dominant cultural norms.',
        suggestedPairing: 'Euripides’ Medea + Rhys’s Wide Sargasso Sea (or Lahiri’s Interpreter of Maladies)',
        ioThesisAngle:
          'Contrast how spatial exclusion (threshold staging vs fractured first-person stream of consciousness) dramatizes the erasure of the outsider’s voice.',
      },
    ],
  },
  {
    id: 'beliefs-values',
    fieldTitle: '3. Beliefs, Values and Education',
    ibDescription:
      'Religious dogmatism, generational conflict, moral disillusionment, and how institutional education shapes or distorts ethics.',
    narrowGlobalIssues: [
      {
        issueStatement:
          'How rigid religious or bourgeois moral hypocrisy weaponizes public shame against female autonomy.',
        suggestedPairing: 'Ibsen’s A Doll’s House + Hawthorne’s The Scarlet Letter (or Duffy’s The World’s Wife)',
        ioThesisAngle:
          'Analyze how threshold motifs (the locked study door / the public scaffold) externalize the conflict between institutional duty and self-actualization.',
      },
    ],
  },
  {
    id: 'art-creativity',
    fieldTitle: '4. Art, Creativity and the Imagination',
    ibDescription:
      'Aesthetic escapism, metafiction, the ethics of artistic representation, and how storytelling reconstructs traumatic memory.',
    narrowGlobalIssues: [
      {
        issueStatement:
          'The use of metafictional storytelling and aesthetic illusion as a defense mechanism against historical or personal trauma.',
        suggestedPairing: 'O’Brien’s The Things They Carried + Williams’s A Streetcar Named Desire',
        ioThesisAngle:
          'Compare how self-reflexive narrative intrusion and expressionist stage lighting blur truth and fabrication.',
      },
    ],
  },
  {
    id: 'science-tech',
    fieldTitle: '5. Science, Technology and the Environment',
    ibDescription:
      'Scientific hubris, ecological degradation, industrialization’s alienation of humanity from nature, and commodification of life.',
    narrowGlobalIssues: [
      {
        issueStatement:
          'How unchecked scientific ambition and industrial rationalism commodify human life and sever ethical empathy.',
        suggestedPairing: 'Shelley’s Frankenstein + Ishiguro’s Never Let Me Go',
        ioThesisAngle:
          'Examine how concentric frame narration vs euphemistic, emotionally muted diction exposes the dehumanization of scientific "creations".',
      },
    ],
  },
];

const INITIAL_PRL_WORKS: PrlWorkAllocation[] = [
  {
    id: 'w1',
    title: 'Medea',
    author: 'Euripides',
    form: 'Drama',
    origin: 'Work in Translation',
    period: 'Pre-20th Century',
    assignedAssessment: 'Individual Oral (IO)',
  },
  {
    id: 'w2',
    title: 'The Handmaid’s Tale',
    author: 'Margaret Atwood',
    form: 'Prose: Novel/Novella',
    origin: 'Original English',
    period: '20th/21st Century',
    assignedAssessment: 'Individual Oral (IO)',
  },
  {
    id: 'w3',
    title: 'Selected Poems (Death of a Naturalist / North)',
    author: 'Seamus Heaney',
    form: 'Poetry',
    origin: 'Original English',
    period: '20th/21st Century',
    assignedAssessment: 'HL Essay',
  },
  {
    id: 'w4',
    title: 'A Doll’s House',
    author: 'Henrik Ibsen',
    form: 'Drama',
    origin: 'Work in Translation',
    period: 'Pre-20th Century',
    assignedAssessment: 'Paper 2 Comparative',
  },
  {
    id: 'w5',
    title: 'A Streetcar Named Desire',
    author: 'Tennessee Williams',
    form: 'Drama',
    origin: 'Original English',
    period: '20th/21st Century',
    assignedAssessment: 'Paper 2 Comparative',
  },
  {
    id: 'w6',
    title: 'Chronicle of a Death Foretold',
    author: 'Gabriel García Márquez',
    form: 'Prose: Novel/Novella',
    origin: 'Work in Translation',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w7',
    title: 'Persepolis',
    author: 'Marjane Satrapi',
    form: 'Prose: Non-Fiction/Short Stories',
    origin: 'Work in Translation',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w8',
    title: 'Beloved',
    author: 'Toni Morrison',
    form: 'Prose: Novel/Novella',
    origin: 'Original English',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w9',
    title: 'Othello',
    author: 'William Shakespeare',
    form: 'Drama',
    origin: 'Original English',
    period: 'Pre-20th Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w10',
    title: 'The Things They Carried',
    author: 'Tim O’Brien',
    form: 'Prose: Non-Fiction/Short Stories',
    origin: 'Original English',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w11',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    form: 'Prose: Novel/Novella',
    origin: 'Original English',
    period: 'Pre-20th Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w12',
    title: 'The Stranger (L’Étranger)',
    author: 'Albert Camus',
    form: 'Prose: Novel/Novella',
    origin: 'Work in Translation',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
  {
    id: 'w13',
    title: 'Collected Poems',
    author: 'Wisława Szymborska',
    form: 'Poetry',
    origin: 'Work in Translation',
    period: '20th/21st Century',
    assignedAssessment: 'Unassigned',
  },
];

export function EnglishLiteratureStudioTool({ initialTab }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<EnglishStudioTab>(() => resolveEnglishTab(initialTab));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(DEVICE_DRILLS[0].id);
  const [studentAnalysisDraft, setStudentAnalysisDraft] = useState<string>(
    DEVICE_DRILLS[0].criterionBExemplar
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string>(FIELDS_OF_INQUIRY[0].id);
  const [prlWorks, setPrlWorks] = useState<PrlWorkAllocation[]>(INITIAL_PRL_WORKS);

  useEffect(() => {
    setActiveTab(resolveEnglishTab(initialTab));
  }, [initialTab]);

  const activeDevice =
    DEVICE_DRILLS.find((d) => d.id === selectedDeviceId) ?? DEVICE_DRILLS[0];
  const activeField =
    FIELDS_OF_INQUIRY.find((f) => f.id === selectedFieldId) ?? FIELDS_OF_INQUIRY[0];

  const handleAssignmentChange = (
    workId: string,
    nextAssessment: PrlWorkAllocation['assignedAssessment']
  ) => {
    setPrlWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, assignedAssessment: nextAssessment } : w))
    );
  };

  const ioWorks = useMemo(
    () => prlWorks.filter((w) => w.assignedAssessment === 'Individual Oral (IO)'),
    [prlWorks]
  );
  const hleWorks = useMemo(
    () => prlWorks.filter((w) => w.assignedAssessment === 'HL Essay'),
    [prlWorks]
  );
  const p2Works = useMemo(
    () => prlWorks.filter((w) => w.assignedAssessment === 'Paper 2 Comparative'),
    [prlWorks]
  );

  const ioValid = useMemo(() => {
    const ioHasTranslation = ioWorks.some((w) => w.origin === 'Work in Translation');
    const ioHasOriginal = ioWorks.some((w) => w.origin === 'Original English');
    return ioWorks.length === 2 && ioHasTranslation && ioHasOriginal;
  }, [ioWorks]);

  const hleValid = useMemo(() => hleWorks.length === 1, [hleWorks]);
  const p2Valid = useMemo(() => p2Works.length >= 2, [p2Works]);
  const originalEnglishCount = useMemo(
    () => prlWorks.filter((w) => w.origin === 'Original English').length,
    [prlWorks]
  );
  const translationCount = useMemo(
    () => prlWorks.filter((w) => w.origin === 'Work in Translation').length,
    [prlWorks]
  );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="hairline-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="mini-tag bg-[#DBEAFE] text-[#1E40AF] font-mono">
            IB ENGLISH A: LITERATURE HL · 13-WORK PORTFOLIO
          </span>
        </div>
        <h2
          className="text-[20px] font-semibold tracking-tight text-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Literary Device Drill, Global Issue Builder & No-Double-Dipping PRL Planner
        </h2>
        <p className="text-[13px] text-[#71717A] mt-0.5">
          Convert surface "feature spotting" into Criterion B analysis, refine IO Global Issues across the 5 Fields of Inquiry, and verify assessment work allocations.
        </p>

        {/* Keep native button role intact for accessible button queries */}
        <div
          role="group"
          aria-label="English Literature HL studio tools"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4E4E7]"
        >
          {[
            { id: 'devices', label: 'Literary Device Drill (Criterion B)' },
            { id: 'global-issues', label: 'Global Issue Bank (5 Fields of Inquiry)' },
            { id: 'prl-planner', label: '13-Work PRL & No-Double-Dipping Planner' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTab(tab.id as EnglishStudioTab)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                  active
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#18181B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Literary Device Drill */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 hairline-card space-y-2.5">
            <h3
              className="text-[15px] font-semibold text-[#18181B] pb-2 border-b border-[#E4E4E7]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Select Formal Feature & Genre Passage
            </h3>
            {DEVICE_DRILLS.map((card) => {
              const active = card.id === activeDevice.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    setSelectedDeviceId(card.id);
                    setStudentAnalysisDraft(card.criterionBExemplar);
                  }}
                  className={`w-full text-left p-3.5 rounded-[11px] border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    active
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                      : 'border-[#E4E4E7] bg-white hover:bg-[#F4F4F5]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-[#18181B]">
                      {card.device}
                    </span>
                    <span className="mini-tag font-mono">{card.genre}</span>
                  </div>
                  <div className="text-[12px] text-[#71717A] mt-1">{card.workCitation}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 hairline-card space-y-4">
            <div className="p-4 rounded-[11px] bg-[#FAFAFA] border border-[#E4E4E7]">
              <div className="text-[11.5px] font-mono text-[#1D4ED8] font-semibold">
                {activeDevice.workCitation}
              </div>
              <blockquote className="mt-2 text-[14px] italic text-[#18181B] border-l-2 border-[#1D4ED8] pl-3">
                {activeDevice.excerpt}
              </blockquote>
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] text-[#991B1B]">
              {activeDevice.weakFeatureSpotting}
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] text-[13px] text-[#065F46] leading-relaxed">
              {activeDevice.criterionBExemplar}
            </div>

            <div>
              <label
                htmlFor="eng-criterion-b-draft"
                className="block text-[12px] font-semibold text-[#18181B] mb-1"
              >
                Practice Rewriting Your Own Effect-Driven Analytical Sentence (Technique → Nuance → Thematic Meaning)
              </label>
              <textarea
                id="eng-criterion-b-draft"
                rows={3}
                value={studentAnalysisDraft}
                onChange={(e) => setStudentAnalysisDraft(e.target.value)}
                className="w-full p-3 rounded-[10px] border border-[#E4E4E7] text-[13px] text-[#18181B] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Global Issue Bank (5 Fields of Inquiry) */}
      {activeTab === 'global-issues' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FIELDS_OF_INQUIRY.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setSelectedFieldId(field.id)}
                className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-semibold border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                  field.id === activeField.id
                    ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1E40AF]'
                    : 'border-[#E4E4E7] bg-white text-[#27272A] hover:bg-[#F4F4F5]'
                }`}
              >
                {field.fieldTitle}
              </button>
            ))}
          </div>

          <div className="hairline-card space-y-4">
            <div>
              <h3
                className="text-[17px] font-bold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {activeField.fieldTitle}
              </h3>
              <p className="text-[13px] text-[#71717A] mt-0.5">{activeField.ibDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeField.narrowGlobalIssues.map((gi) => (
                <div
                  key={gi.issueStatement}
                  className="p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-2.5"
                >
                  <span className="mini-tag bg-[#DBEAFE] text-[#1E40AF] font-mono">
                    Narrow IO / HL Essay Line of Inquiry
                  </span>
                  <h4 className="text-[14px] font-semibold text-[#18181B] leading-snug">
                    “{gi.issueStatement}”
                  </h4>
                  <div className="text-[12.5px] text-[#27272A]">
                    <strong>Anchor Pairing:</strong> {gi.suggestedPairing}
                  </div>
                  <div className="text-[12.5px] text-[#71717A]">
                    <strong>Criterion B Authorial Angle:</strong> {gi.ioThesisAngle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 13-Work PRL & No-Double-Dipping Planner */}
      {activeTab === 'prl-planner' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`p-3.5 rounded-[12px] border text-[12.5px] ${
                ioValid
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">1. Individual Oral (20%)</div>
              <div className="mt-1">
                {ioValid
                  ? '✓ Valid: 1 Original English + 1 Work in Translation assigned.'
                  : 'Requires exactly 1 Original English work + 1 Work in Translation.'}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-[12px] border text-[12.5px] ${
                hleValid
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">2. HL Essay (20%)</div>
              <div className="mt-1">
                {hleValid
                  ? `✓ Valid: Assigned to ${hleWorks[0].title} (distinct from IO & Paper 2).`
                  : 'Assign 1 dedicated work for your 1,200–1,500 word HL Essay.'}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-[12px] border text-[12.5px] ${
                p2Valid
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">3. Paper 2 Comparative (25%)</div>
              <div className="mt-1">
                {p2Valid
                  ? `✓ Valid: ${p2Works.length} untouched works reserved for Paper 2 comparative essay.`
                  : 'Reserve at least 2 works never used in your IO or HL Essay.'}
              </div>
            </div>
          </div>

          <div className="hairline-card bg-[#FAFAFA] py-3 px-4 flex flex-wrap items-center justify-between gap-2 text-[12px]">
            <div className="flex flex-wrap items-center gap-2 text-[#27272A]">
              <span className="mini-tag bg-[#DBEAFE] text-[#1E40AF] font-mono">
                {prlWorks.length} Works Total
              </span>
              <span className="font-mono text-[#71717A]">
                {originalEnglishCount} Original English (min 5) · {translationCount} Translation (min 4)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPrlWorks(INITIAL_PRL_WORKS)}
              className="pill-btn text-[11.5px]"
            >
              Reset Allocations
            </button>
          </div>

          <div className="hairline-card overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[11.5px] font-mono text-[#71717A] uppercase">
                  <th className="py-2.5 pr-4">Work & Author</th>
                  <th className="py-2.5 px-3">Literary Form</th>
                  <th className="py-2.5 px-3">Language Origin</th>
                  <th className="py-2.5 pl-3">Exclusive Assessment Allocation (No Double-Dipping)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] text-[13px]">
                {prlWorks.map((work) => (
                  <tr key={work.id} className="hover:bg-[#FAFAFA]">
                    <td className="py-3 pr-4 font-semibold text-[#18181B]">
                      {work.title}{' '}
                      <span className="font-normal text-[#71717A]">— {work.author}</span>
                    </td>
                    <td className="py-3 px-3 text-[#27272A]">{work.form}</td>
                    <td className="py-3 px-3">
                      <span className="mini-tag font-mono">{work.origin}</span>
                    </td>
                    <td className="py-3 pl-3">
                      <select
                        aria-label={`Assessment allocation for ${work.title}`}
                        value={work.assignedAssessment}
                        onChange={(e) =>
                          handleAssignmentChange(
                            work.id,
                            e.target.value as PrlWorkAllocation['assignedAssessment']
                          )
                        }
                        className="px-2.5 py-1.5 rounded-[8px] border border-[#E4E4E7] bg-white text-[12px] font-medium text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        <option value="Unassigned">Unassigned (Paper 2 Backup)</option>
                        <option value="Individual Oral (IO)">Individual Oral (IO)</option>
                        <option value="HL Essay">HL Essay</option>
                        <option value="Paper 2 Comparative">Paper 2 Comparative</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
