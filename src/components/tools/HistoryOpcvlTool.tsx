'use client';

import React, { useState, useMemo, useEffect } from 'react';

type HistoryTab = 'opcvl' | 'essay-builder' | 'historiography' | 'timeline';

function resolveHistoryTab(tab?: string): HistoryTab {
  if (tab === 'outlines' || tab === 'essay-builder') return 'essay-builder';
  if (tab === 'historiography') return 'historiography';
  if (tab === 'timeline') return 'timeline';
  return 'opcvl';
}

interface TimelineMilestone {
  year: string;
  title: string;
  stream: 'Move to Global War' | 'Authoritarian States' | 'Cold War' | 'Rights & Protest';
  significance: string;
}

const HISTORY_TIMELINE: TimelineMilestone[] = [
  {
    year: '18 Sept 1931',
    title: 'Mukden Incident & Manchurian Crisis',
    stream: 'Move to Global War',
    significance: 'Kwantung Army stages railway explosion to seize Manchuria; Lytton Report (1932) exposes League collective-security failure.',
  },
  {
    year: '23 Mar 1933',
    title: 'Enabling Act Passed in the Reichstag',
    stream: 'Authoritarian States',
    significance: 'Legalized Hitler’s four-year decree powers; Otto Wels’s SPD was the sole remaining party voting against the bill.',
  },
  {
    year: '30 Sept 1938',
    title: 'Munich Agreement',
    stream: 'Move to Global War',
    significance: 'Britain and France concede the Sudetenland to Nazi Germany without Czechoslovak representation, emboldening revisionist aggression.',
  },
  {
    year: 'Feb – Aug 1945',
    title: 'Yalta & Potsdam Conferences',
    stream: 'Cold War',
    significance: 'Grand Alliance cracks over Polish borders, German reparations, and atomic diplomacy following FDR’s death.',
  },
  {
    year: 'Jun 1948 – May 1949',
    title: 'Berlin Blockade & Airlift',
    stream: 'Cold War',
    significance: 'Stalin severs land corridors to West Berlin; Allied airlift solidifies division of Germany into FRG and GDR and catalyzes NATO (1949).',
  },
  {
    year: 'Jun 1950 – Jul 1953',
    title: 'Korean War',
    stream: 'Cold War',
    significance: 'Militarizes US containment globally (NSC-68 defense tripling) and establishes Sino-Soviet divergence over proxy intervention.',
  },
  {
    year: 'Oct 1962',
    title: 'Cuban Missile Crisis',
    stream: 'Cold War',
    significance: 'Peak nuclear brinkmanship yields hotline and Partial Test Ban Treaty (1963), marking shift toward early détente.',
  },
  {
    year: 'Apr – May 1963',
    title: 'Project C (Birmingham Campaign)',
    stream: 'Rights & Protest',
    significance: 'SCLC and ACMHR non-violent direct action draws national media to police brutality, accelerating the 1964 Civil Rights Act.',
  },
];

interface OpcvlSource {
  id: string;
  topic: string;
  provenance: string;
  excerpt: string;
  exemplarOriginValue: string;
  exemplarPurposeValue: string;
  exemplarOriginLimitation: string;
  exemplarPurposeLimitation: string;
}

interface HistorianEntry {
  name: string;
  school: 'Orthodox' | 'Revisionist' | 'Post-Revisionist' | 'Intentionalist' | 'Structuralist / Functionalist';
  topic: 'Topic 10: Authoritarian States' | 'Topic 11: 20th-Century Wars' | 'Topic 12: The Cold War';
  year: string;
  coreThesis: string;
  keyEvidenceCited: string;
}

const OPCVL_SOURCES: OpcvlSource[] = [
  {
    id: 'lytton-1932',
    topic: 'Paper 1 Topic 3 · The Move to Global War (Manchurian Crisis)',
    provenance:
      'Source B: Extract from the Report of the League of Nations Commission of Enquiry into the Sino-Japanese Dispute (The Lytton Report), published in Geneva on 2 October 1932, chaired by British diplomat Lord Lytton after a six-month investigation in Manchuria.',
    excerpt:
      '"Without declaration of war, a large area of what was indisputably Chinese territory has been forcibly seized and occupied by the armed forces of Japan and has, in consequence of this operation, been separated from and declared independent of the rest of China. The military operations of the Japanese troops during the night of September 18th, 1931, cannot be regarded as measures of legitimate self-defence."',
    exemplarOriginValue:
      'Value of Origin: Authored by an official multinational League of Nations Commission led by Lord Lytton that conducted six months of direct on-site interviews with Chinese and Japanese officials in Manchuria in 1932, giving it direct institutional access to primary diplomatic testimony.',
    exemplarPurposeValue:
      'Value of Purpose: Because its purpose was to provide the League of Nations Assembly with an impartial, evidence-based arbitration report capable of reconciling Tokyo and Nanjing, it carefully documents both Japanese treaty grievances and the illegality of the Kwantung Army invasion.',
    exemplarOriginLimitation:
      'Limitation of Origin: The Commission only arrived in Manchuria in April 1932—seven months after the Mukden Incident of September 1931—meaning the Kwantung Army had already consolidated Manchukuo and intimidated local witnesses.',
    exemplarPurposeLimitation:
      'Limitation of Purpose: Designed to preserve diplomatic consensus within the League and avoid provoking Great Power confrontation, the report deliberately softened its language by avoiding formal sanctions recommendations under Article 16.',
  },
  {
    id: 'enabling-act-1933',
    topic: 'Paper 1 & 2 · Weimar & Nazi Germany (Consolidation of Power)',
    provenance:
      'Source C: Speech delivered by Social Democratic Party (SPD) Chairman Otto Wels to the Reichstag in the Kroll Opera House, Berlin, on 23 March 1933, during the parliamentary debate on the Enabling Act (Ermächtigungsgesetz).',
    excerpt:
      '"Freedom and life can be taken from us, but not our honour. After the persecutions that the Social Democratic Party has experienced recently, no one can reasonably demand or expect that it should vote for the Enabling Bill. The elections of March 5 have given the governing parties a majority, and thus the possibility of governing strictly according to the text and spirit of the constitution."',
    exemplarOriginValue:
      'Value of Origin: Delivered by Otto Wels, leader of the SPD—the only remaining party in the Reichstag to vote against the Enabling Act after the KPD deputies had been arrested—providing direct parliamentary insight into democratic resistance on 23 March 1933.',
    exemplarPurposeValue:
      'Value of Purpose: Intended as a public defence of Weimar constitutionalism and a final appeal to the Catholic Centre Party and German public opinion, revealing the legal arguments used against Hitler’s dictatorial decree powers.',
    exemplarOriginLimitation:
      'Limitation of Origin: Spoken inside the Kroll Opera House while surrounded by armed SA and SS stormtroopers under the Reichstag Fire Decree, restricting Wels from calling for extra-parliamentary general strikes or armed resistance.',
    exemplarPurposeLimitation:
      'Limitation of Purpose: Aimed to project moral dignity for the SPD in the face of certain defeat rather than analyze why the Centre Party had already negotiated behind-the-scenes concessions with Hitler.',
  },
  {
    id: 'birmingham-1963',
    topic: 'Paper 1 Topic 4 · Rights and Protest (US Civil Rights Movement)',
    provenance:
      'Source A: "The Birmingham Manifesto", issued on 3 April 1963 by Fred Shuttlesworth and the Alabama Christian Movement for Human Rights (ACMHR) alongside the SCLC at the launch of Project C in Birmingham, Alabama.',
    excerpt:
      '"The patience of an oppressed people cannot endure forever. The Negro citizen of Birmingham has waited, hoped, and prayed for years that the white power structure of this city would honour its own promises after the 1962 selective buying campaign. Having exhausted every channel of negotiation with merchants and incoming city commissioners, we now present our bodies as a personal witness to injustice."',
    exemplarOriginValue:
      'Value of Origin: Co-authored by Fred Shuttlesworth, the local grass-roots founder of the ACMHR in Birmingham, offering an authentic insider perspective on how local church networks laid the groundwork for the 1963 campaign.',
    exemplarPurposeValue:
      'Value of Purpose: Published to justify non-violent direct action to both Birmingham’s Black community and sceptical national media, demonstrating how Civil Rights leaders framed sit-ins as a last resort after broken municipal promises.',
    exemplarOriginLimitation:
      'Limitation of Origin: Written on 3 April 1963 at the very start of Project C, so it cannot reflect the subsequent tactical shift toward the Children’s Crusade in May 1963 or Kennedy’s federal intervention.',
    exemplarPurposeLimitation:
      'Limitation of Purpose: As a public mobilization manifesto intended to project unity, it omits internal tactical disagreements between local Black business leaders (such as A.G. Gaston) and SCLC organizers.',
  },
];

const HISTORIANS: HistorianEntry[] = [
  {
    name: 'Ian Kershaw',
    school: 'Structuralist / Functionalist',
    topic: 'Topic 10: Authoritarian States',
    year: '1993 ("Working Towards the Führer")',
    coreThesis:
      'Synthesizes the Intentionalist–Structuralist debate: Hitler set the overarching ideological vision, but polycratic Nazi rivalries radicalized policy from below as officials competed to "work towards the Führer".',
    keyEvidenceCited: '1934 Prussian civil servant speech; chaotic rivalry between Göring’s Four-Year Plan, Himmler’s SS, and Gauleiters.',
  },
  {
    name: 'Karl Dietrich Bracher',
    school: 'Intentionalist',
    topic: 'Topic 10: Authoritarian States',
    year: '1969 (The German Dictatorship)',
    coreThesis:
      'Hitler remained the master in the Third Reich ("Herr im Dritten Reich"); administrative chaos was deliberately fostered by Hitler to divide subordinates and keep supreme ideological decision-making in his hands.',
    keyEvidenceCited: 'Consistency between Mein Kampf (1925), the Hossbach Memorandum (1937), and Operation Barbarossa (1941).',
  },
  {
    name: 'Richard Overy',
    school: 'Post-Revisionist',
    topic: 'Topic 11: 20th-Century Wars',
    year: '1995 (Why the Allies Won)',
    coreThesis:
      'Allied victory in WWII was not a foregone conclusion of sheer economic GDP alone; it required decisive operational, technological, and organizational reforms by the USSR, US, and Britain between 1942 and 1944.',
    keyEvidenceCited: 'Soviet deep-battle doctrine at Kursk/Bagration, Allied anti-submarine radar in the Battle of the Atlantic, and strategic bombing attrition.',
  },
  {
    name: 'A.J.P. Taylor',
    school: 'Revisionist',
    topic: 'Topic 11: 20th-Century Wars',
    year: '1961 (The Origins of the Second World War)',
    coreThesis:
      'Hitler was an opportunistic traditional German statesman rather than a rigid blueprint planner; the outbreak of general war in September 1939 resulted from diplomatic miscalculation over Danzig and Anglo-French appeasement.',
    keyEvidenceCited: 'Improvised nature of the Anschluss (March 1938) and Hitler’s expectation that Britain would back down over Poland as at Munich.',
  },
  {
    name: 'Arthur Schlesinger Jr.',
    school: 'Orthodox',
    topic: 'Topic 12: The Cold War',
    year: '1967 ("Origins of the Cold War")',
    coreThesis:
      'The Cold War was a necessary defensive Western response to Stalin’s Marxist-Leninist ideological expansionism and paranoid totalitarian personality across Eastern Europe.',
    keyEvidenceCited: 'Soviet violation of the Yalta Declaration on Liberated Europe in Poland (1945), the 1948 Prague Coup, and the Berlin Blockade.',
  },
  {
    name: 'William Appleman Williams',
    school: 'Revisionist',
    topic: 'Topic 12: The Cold War',
    year: '1959 (The Tragedy of American Diplomacy)',
    coreThesis:
      'US "Open Door" economic imperialism—demanding access to global markets via the Marshall Plan and Bretton Woods—threatened legitimate Soviet security buffer zones and provoked the Cold War.',
    keyEvidenceCited: 'Abrupt termination of Lend-Lease (May 1945), atomic diplomacy at Potsdam, and the 1947 Truman Doctrine.',
  },
  {
    name: 'John Lewis Gaddis',
    school: 'Post-Revisionist',
    topic: 'Topic 12: The Cold War',
    year: '1997 (We Now Know)',
    coreThesis:
      'While both superpowers sought security and misperceived each other’s intentions in 1945–47, Soviet archives confirm that Stalin’s personal authoritarianism made sustained post-war cooperation impossible.',
    keyEvidenceCited: 'Opened Soviet Politburo archives on the 1948 Berlin Blockade and Stalin’s green-lighting of Kim Il-sung’s 1950 invasion of South Korea.',
  },
];

const BANNED_OPCVL_PHRASES = [
  { pattern: /\bbiased\b/i, warning: 'Avoid the vague word "biased" — explain the specific political motive, audience, or institutional agenda instead.' },
  { pattern: /\bnot there\b|\bwasn't there\b/i, warning: 'Never say "the author was/wasn’t there" without linking their exact institutional role to what they could know or conceal.' },
  { pattern: /\blie\b|\blying\b/i, warning: 'Avoid accusing a source of "lying" — use analytical terms like "propagandistic omission", "justificatory framing", or "selective emphasis".' },
  { pattern: /\bonly one source\b|\bonly in english\b/i, warning: 'Never evaluate a translation or the fact that it is a single extract as a historical limitation (strictly rejected by IB markschemes).' },
];

export function HistoryOpcvlTool({ initialTab }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<HistoryTab>(() => resolveHistoryTab(initialTab));
  const [selectedSourceId, setSelectedSourceId] = useState<string>(OPCVL_SOURCES[0].id);

  useEffect(() => {
    setActiveTab(resolveHistoryTab(initialTab));
  }, [initialTab]);
  const [studentOrigin, setStudentOrigin] = useState<string>(
    OPCVL_SOURCES[0].exemplarOriginValue
  );
  const [studentPurpose, setStudentPurpose] = useState<string>(
    OPCVL_SOURCES[0].exemplarPurposeValue
  );
  const [studentLimitation, setStudentLimitation] = useState<string>(
    `${OPCVL_SOURCES[0].exemplarOriginLimitation} Furthermore, ${OPCVL_SOURCES[0].exemplarPurposeLimitation}`
  );
  const [showModelRubric, setShowModelRubric] = useState<boolean>(true);

  // Essay Outline Builder state
  const [essayPrompt, setEssayPrompt] = useState<string>(
    'Topic 10: "Economic crisis was the most important factor in the emergence of authoritarian states." Discuss with reference to two states.'
  );
  const [essayThesis, setEssayThesis] = useState<string>(
    'While the Great Depression (1929) and post-WWI structural debt served as indispensable catalysts that polarized electorates in Weimar Germany (Hitler) and Italy (Mussolini), economic distress alone was insufficient; emergence ultimately depended on elite political connivance and the violent exploitation of anti-communist fear.'
  );
  const [para1Theme, setPara1Theme] = useState<string>(
    'Theme 1 · Economic Crisis as Catalyst: 6 million unemployed in Germany (1932) & post-WWI inflation/strikes (Biennio Rosso 1919–20) in Italy eroded faith in parliamentary centrism.'
  );
  const [para2Theme, setPara2Theme] = useState<string>(
    'Theme 2 · Political Weakness & Elite Connivance: Article 48 presidential cabinets (Von Papen / Hindenburg) in January 1933 and King Victor Emmanuel III refusing martial law in October 1922.'
  );
  const [para3Theme, setPara3Theme] = useState<string>(
    'Theme 3 · Ideological Appeal & Coercion: SA street violence + Goebbels’ flexible propaganda vs Fascist squadrismo crushing Socialist trade unions.'
  );

  // Historiography & timeline filters
  const [schoolFilter, setSchoolFilter] = useState<string>('ALL');
  const [timelineFilter, setTimelineFilter] = useState<string>('ALL');

  const activeSource =
    OPCVL_SOURCES.find((s) => s.id === selectedSourceId) ?? OPCVL_SOURCES[0];

  const handleSelectSource = (src: OpcvlSource) => {
    setSelectedSourceId(src.id);
    setStudentOrigin(src.exemplarOriginValue);
    setStudentPurpose(src.exemplarPurposeValue);
    setStudentLimitation(`${src.exemplarOriginLimitation} ${src.exemplarPurposeLimitation}`);
  };

  const combinedOpcvlText = `${studentOrigin} ${studentPurpose} ${studentLimitation}`;
  const triggeredWarnings = BANNED_OPCVL_PHRASES.filter((rule) =>
    rule.pattern.test(combinedOpcvlText)
  );

  const filteredHistorians = useMemo(
    () =>
      HISTORIANS.filter(
        (h) => schoolFilter === 'ALL' || h.school === schoolFilter || h.topic === schoolFilter
      ),
    [schoolFilter]
  );

  const filteredTimeline = useMemo(
    () =>
      HISTORY_TIMELINE.filter(
        (item) => timelineFilter === 'ALL' || item.stream === timelineFilter
      ),
    [timelineFilter]
  );

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes histPanelEnter {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hist-pill-btn {
          transition:
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease,
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hist-pill-btn:active {
          transform: scale(0.975);
        }
        .hist-card-tactile {
          transition:
            border-color 160ms ease,
            background-color 160ms ease,
            transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hist-panel-enter {
          animation: histPanelEnter 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (hover: hover) and (pointer: fine) {
          .hist-pill-btn:hover {
            transform: translateY(-1px);
          }
          .hist-pill-btn:active {
            transform: scale(0.975);
          }
          .hist-card-tactile:hover {
            border-color: #D6D3D1;
            transform: translateY(-1px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hist-pill-btn,
          .hist-card-tactile {
            transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
          }
          .hist-pill-btn:hover,
          .hist-pill-btn:active,
          .hist-card-tactile:hover {
            transform: none;
          }
          .hist-panel-enter {
            animation: histPanelFadeOnly 150ms ease both;
          }
        }
        @keyframes histPanelFadeOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header & Tabs */}
      <div className="hairline-card">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="mini-tag bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono">
            IB HISTORY HL · PAPERS 1, 2 &amp; 3
          </span>
          <span className="text-[12px] text-[#71717A] font-mono">
            Archival Source Evaluation &amp; Historiography
          </span>
        </div>
        <h2
          className="text-[20px] font-semibold tracking-tight text-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          OPCVL Source Trainer, Thematic Essay Builder &amp; Historiography Matrix
        </h2>
        <p className="text-[13px] text-[#71717A] mt-0.5">
          Practice 4-mark Paper 1 source evaluation without textbook generalizations, structure comparative Paper 2/3 essays, and trace chronology &amp; historiography.
        </p>

        <div
          role="tablist"
          aria-label="History HL study tools"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4E4E7]"
        >
          {[
            { id: 'opcvl', label: 'Paper 1 OPCVL Source Trainer' },
            { id: 'essay-builder', label: 'Paper 2/3 Essay Outline Builder' },
            { id: 'historiography', label: 'Historiography Schools' },
            { id: 'timeline', label: 'Chronological Timeline' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as HistoryTab)}
                className={`hist-pill-btn px-3.5 py-1.5 rounded-full text-[12px] font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
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

      {/* TAB 1: Paper 1 OPCVL Source Trainer */}
      {activeTab === 'opcvl' && (
        <div key="tab-opcvl" className="hist-panel-enter space-y-5">
          {/* Archival O / P / C / V / L Breakdown Matrix Strip */}
          <div className="hairline-card bg-[#FAFAFA] py-3.5 px-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#92400E]">
                  Paper 1 Question 2 · Archival OPCVL Breakdown Matrix
                </span>
              <span className="text-[11px] font-mono text-[#71717A]">
                Link O, P, C directly to V &amp; L (4 marks)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                {
                  letter: 'O',
                  name: 'Origin',
                  detail: 'Author, role & date',
                  badgeClass: 'bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]',
                },
                {
                  letter: 'P',
                  name: 'Purpose',
                  detail: 'Audience & political aim',
                  badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
                },
                {
                  letter: 'C',
                  name: 'Content',
                  detail: 'Claims, tone & omissions',
                  badgeClass: 'bg-[#F5F5F4] text-[#57534E] border-[#D6D3D1]',
                },
                {
                  letter: 'V',
                  name: 'Value',
                  detail: 'Historical utility (2m)',
                  badgeClass: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
                },
                {
                  letter: 'L',
                  name: 'Limitations',
                  detail: 'Scope & blindspots (2m)',
                  badgeClass: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
                },
              ].map((cell) => (
                <div
                  key={cell.letter}
                  className="hist-card-tactile flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] bg-white border border-[#E4E4E7]"
                >
                  <span
                    className={`w-7 h-7 rounded-[7px] font-mono text-[12px] font-extrabold border flex items-center justify-center shrink-0 ${cell.badgeClass}`}
                  >
                    {cell.letter}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-[#18181B] leading-tight">
                      {cell.name}
                    </div>
                    <div className="text-[10.5px] text-[#71717A] truncate">
                      {cell.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {OPCVL_SOURCES.map((src) => {
              const isSelected = src.id === activeSource.id;
              return (
                <button
                  key={src.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectSource(src)}
                  className={`hist-pill-btn px-3.5 py-1.5 rounded-[10px] text-[12px] font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    isSelected
                      ? 'border-[#B45309] bg-[#FEF3C7]/70 text-[#92400E]'
                      : 'border-[#E4E4E7] bg-white text-[#27272A] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {src.topic}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Source Card & Student Inputs */}
            <div className="lg:col-span-7 hairline-card space-y-4 min-w-0">
              <div className="p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-[5px] bg-[#FFEDD5] border border-[#FDBA74] font-mono text-[10px] font-extrabold text-[#9A3412]">
                    O · P
                  </span>
                  <span className="text-[11.5px] font-mono font-semibold text-[#B45309]">
                    Primary Source Provenance
                  </span>
                </div>
                <div className="text-[12px] font-mono text-[#78350F] leading-relaxed">
                  {activeSource.provenance}
                </div>
                <blockquote className="text-[13.5px] italic text-[#18181B] border-l-[3px] border-[#B45309] bg-white rounded-r-[8px] px-3.5 py-2.5 border-y border-r border-y-[#E4E4E7] border-r-[#E4E4E7]">
                  <span className="not-italic inline-flex items-center gap-1 mr-2 px-1.5 py-0.5 rounded bg-[#F5F5F4] border border-[#D6D3D1] font-mono text-[10px] font-bold text-[#57534E] align-middle">
                    C
                  </span>
                  {activeSource.excerpt}
                </blockquote>
                <div className="text-[12px] font-semibold text-[#18181B] pt-1">
                  Question 2: With reference to its origin, purpose and content, analyse the value and limitations of this source for a historian studying the topic. [4 marks]
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="opcvl-origin-input"
                    className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-[#18181B] mb-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-[#FFEDD5] border border-[#FDBA74] font-mono text-[10px] font-bold text-[#9A3412]">
                      O→V
                    </span>
                    <span>
                      Paragraph 1 · Value of Origin &amp; Purpose (Link WHO/WHEN/WHY to historical utility)
                    </span>
                  </label>
                  <textarea
                    id="opcvl-origin-input"
                    rows={3}
                    value={studentOrigin}
                    onChange={(e) => setStudentOrigin(e.target.value)}
                    className="w-full p-3 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13px] text-[#18181B] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="opcvl-purpose-input"
                    className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-[#18181B] mb-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] font-mono text-[10px] font-bold text-[#92400E]">
                      P·C→V
                    </span>
                    <span>Additional Value of Purpose / Content</span>
                  </label>
                  <textarea
                    id="opcvl-purpose-input"
                    rows={2}
                    value={studentPurpose}
                    onChange={(e) => setStudentPurpose(e.target.value)}
                    className="w-full p-3 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13px] text-[#18181B] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="opcvl-limitation-input"
                    className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-[#18181B] mb-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-[#FEF2F2] border border-[#FECACA] font-mono text-[10px] font-bold text-[#991B1B]">
                      O·P·C→L
                    </span>
                    <span>Paragraph 2 · Limitations of Origin, Purpose &amp; Content</span>
                  </label>
                  <textarea
                    id="opcvl-limitation-input"
                    rows={3}
                    value={studentLimitation}
                    onChange={(e) => setStudentLimitation(e.target.value)}
                    className="w-full p-3 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13px] text-[#18181B] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
                  />
                </div>
              </div>

              {triggeredWarnings.length > 0 ? (
                <div role="alert" className="p-3.5 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] space-y-1">
                  <div className="text-[11.5px] font-mono font-bold text-[#991B1B] uppercase">
                    Examiner Alert · Textbook Generalization Detected:
                  </div>
                  {triggeredWarnings.map((w) => (
                    <p key={w.warning} className="text-[12.5px] text-[#991B1B]">
                      • {w.warning}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] text-[12.5px] text-[#065F46] font-medium">
                  ✓ Zero banned OPCVL generalizations detected (&quot;biased&quot;, &quot;only in English&quot;, &quot;not there&quot;).
                </div>
              )}
            </div>

            {/* Official 4-Mark Exemplar Rubric */}
            <div className="lg:col-span-5 hairline-card bg-[#FAFAFA] space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
                <h3
                  className="text-[15px] font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  4/4 IB Markscheme Exemplar Breakdown
                </h3>
                <button
                  type="button"
                  aria-expanded={showModelRubric}
                  onClick={() => setShowModelRubric((p) => !p)}
                  className="pill-btn hist-pill-btn text-[11.5px] shrink-0"
                >
                  {showModelRubric ? 'Hide Model' : 'Show Model'}
                </button>
              </div>

              {showModelRubric && (
                <div className="hist-panel-enter space-y-3 text-[12.5px]">
                  {[
                    {
                      letters: [
                        { char: 'O', cls: 'bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]' },
                        { char: 'V', cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
                      ],
                      accent: 'border-l-[#059669]',
                      titleColor: 'text-[#059669]',
                      title: '[1 mark] Value of Origin',
                      body: activeSource.exemplarOriginValue,
                    },
                    {
                      letters: [
                        { char: 'P', cls: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
                        { char: 'V', cls: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
                      ],
                      accent: 'border-l-[#059669]',
                      titleColor: 'text-[#059669]',
                      title: '[1 mark] Value of Purpose',
                      body: activeSource.exemplarPurposeValue,
                    },
                    {
                      letters: [
                        { char: 'O', cls: 'bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]' },
                        { char: 'L', cls: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' },
                      ],
                      accent: 'border-l-[#B45309]',
                      titleColor: 'text-[#B45309]',
                      title: '[1 mark] Limitation of Origin',
                      body: activeSource.exemplarOriginLimitation,
                    },
                    {
                      letters: [
                        { char: 'P', cls: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
                        { char: 'L', cls: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' },
                      ],
                      accent: 'border-l-[#B45309]',
                      titleColor: 'text-[#B45309]',
                      title: '[1 mark] Limitation of Purpose',
                      body: activeSource.exemplarPurposeLimitation,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`hist-card-tactile p-3.5 rounded-[10px] bg-white border border-[#E4E4E7] border-l-[3px] ${item.accent}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`font-mono font-bold text-[11.5px] ${item.titleColor}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
                          {item.letters.map((b) => (
                            <span
                              key={b.char}
                              className={`w-5 h-5 rounded-[5px] border font-mono text-[10px] font-extrabold flex items-center justify-center ${b.cls}`}
                            >
                              {b.char}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[#27272A] leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Paper 2/3 Essay Outline Builder */}
      {activeTab === 'essay-builder' && (
        <div key="tab-essay" className="hist-panel-enter hairline-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#E4E4E7]">
            <div>
              <h3
                className="text-[16px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Paper 2 &amp; Paper 3 Band 7 (13–15/15) Thematic Essay Architect
              </h3>
              <p className="text-[12.5px] text-[#71717A]">
                IB examiners cap narrative/chronological essays at 9/15. Structure every essay comparatively across 3 thematic pillars.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEssayPrompt(
                    'Topic 10: "Economic crisis was the most important factor in the emergence of authoritarian states." Discuss with reference to two states.'
                  );
                  setEssayThesis(
                    'While the Great Depression (1929) and post-WWI structural debt served as indispensable catalysts that polarized electorates in Weimar Germany (Hitler) and Italy (Mussolini), economic distress alone was insufficient; emergence ultimately depended on elite political connivance and the violent exploitation of anti-communist fear.'
                  );
                  setPara1Theme(
                    'Theme 1 · Economic Crisis as Catalyst: 6 million unemployed in Germany (1932) & post-WWI inflation/strikes (Biennio Rosso 1919–20) in Italy eroded faith in parliamentary centrism.'
                  );
                  setPara2Theme(
                    'Theme 2 · Political Weakness & Elite Connivance: Article 48 presidential cabinets (Von Papen / Hindenburg) in January 1933 and King Victor Emmanuel III refusing martial law in October 1922.'
                  );
                  setPara3Theme(
                    'Theme 3 · Ideological Appeal & Coercion: SA street violence + Goebbels’ flexible propaganda vs Fascist squadrismo crushing Socialist trade unions.'
                  );
                }}
                className="pill-btn hist-pill-btn text-[11.5px]"
              >
                Load Topic 10 Authoritarian Preset
              </button>
              <button
                type="button"
                onClick={() => {
                  setEssayPrompt(
                    'Topic 12 Cold War: "Mutual fear rather than ideological hostility was the main cause of the breakdown of the Grand Alliance between 1945 and 1949." Discuss.'
                  );
                  setEssayThesis(
                    'While security dilemmas over Eastern European buffer zones (Poland, Germany) triggered immediate post-war friction, security fear and Marxist-Leninist vs Capitalist "Open Door" ideology were mutually reinforcing: ideology conditioned each superpower to interpret the other’s defensive security measures as aggressive expansionism.'
                  );
                  setPara1Theme(
                    'Theme 1 · Security Dilemmas & Geopolitics: USSR demand for a Polish buffer after 27M WWII casualties vs US/UK resistance at Yalta & Potsdam (1945) and the Berlin Blockade (1948–49).'
                  );
                  setPara2Theme(
                    'Theme 2 · Ideological Misperception: Kennan’s Long Telegram (1946) & Novikov Telegram framed opposing systems as inherently expansionist, turning Truman Doctrine & Marshall Plan into zero-sum blocs.'
                  );
                  setPara3Theme(
                    'Theme 3 · Synthesis & Historiography: Contrast Orthodox (Schlesinger) emphasis on Stalinist ideology against Revisionist (Williams) Open Door economics & Post-Revisionist (Gaddis) archive synthesis.'
                  );
                }}
                className="pill-btn hist-pill-btn text-[11.5px]"
              >
                Load Topic 12 Cold War Preset
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="history-essay-prompt"
                className="block text-[12px] font-semibold text-[#18181B] mb-1"
              >
                Paper 2 / Paper 3 Question Prompt
              </label>
              <input
                id="history-essay-prompt"
                type="text"
                value={essayPrompt}
                onChange={(e) => setEssayPrompt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13px] font-medium text-[#18181B] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              />
            </div>

            <div>
              <label
                htmlFor="history-essay-thesis"
                className="block text-[12px] font-semibold text-[#B45309] mb-1"
              >
                Integrative Thesis Statement (Addresses &quot;To what extent / Discuss&quot; + Counter-argument)
              </label>
              <textarea
                id="history-essay-thesis"
                rows={3}
                value={essayThesis}
                onChange={(e) => setEssayThesis(e.target.value)}
                className="w-full p-3 rounded-[10px] border border-[#FDE68A] border-l-[3.5px] border-l-[#B45309] bg-[#FFFBEB]/50 text-[13px] text-[#18181B] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'history-pillar-1',
                  num: '01',
                  label: 'Thematic Pillar 1 (Given Factor)',
                  val: para1Theme,
                  setVal: setPara1Theme,
                },
                {
                  id: 'history-pillar-2',
                  num: '02',
                  label: 'Thematic Pillar 2 (Comparative Factor)',
                  val: para2Theme,
                  setVal: setPara2Theme,
                },
                {
                  id: 'history-pillar-3',
                  num: '03',
                  label: 'Thematic Pillar 3 (Synthesis & Historiography)',
                  val: para3Theme,
                  setVal: setPara3Theme,
                },
              ].map((pillar) => (
                <div
                  key={pillar.num}
                  className="hist-card-tactile p-3 rounded-[11px] bg-[#FAFAFA] border border-[#E4E4E7]"
                >
                  <label
                    htmlFor={pillar.id}
                    className="flex items-center gap-2 text-[12px] font-semibold text-[#18181B] mb-2"
                  >
                    <span className="px-1.5 py-0.5 rounded-[5px] bg-[#FEF3C7] border border-[#FDE68A] font-mono text-[10.5px] font-bold text-[#92400E]">
                      {pillar.num}
                    </span>
                    <span>{pillar.label}</span>
                  </label>
                  <textarea
                    id={pillar.id}
                    rows={4}
                    value={pillar.val}
                    onChange={(e) => pillar.setVal(e.target.value)}
                    className="w-full p-2.5 rounded-[9px] border border-[#E4E4E7] bg-white text-[12.5px] text-[#18181B] transition-[border-color] duration-150 focus:border-[#B45309] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Historiography School Timelines */}
      {activeTab === 'historiography' && (
        <div key="tab-historiography" className="hist-panel-enter space-y-4">
          <div className="hairline-card bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[13px] font-semibold text-[#18181B]">
              Filter by Historiographical School:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'ALL',
                'Orthodox',
                'Revisionist',
                'Post-Revisionist',
                'Intentionalist',
                'Structuralist / Functionalist',
              ].map((school) => (
                <button
                  key={school}
                  type="button"
                  aria-pressed={schoolFilter === school}
                  onClick={() => setSchoolFilter(school)}
                  className={`hist-pill-btn px-3 py-1 rounded-full text-[11.5px] font-mono font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    schoolFilter === school
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : 'bg-white text-[#71717A] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {school}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistorians.map((h) => (
              <div
                key={h.name}
                className="hist-card-tactile hairline-card border-l-[3px] border-l-[#B45309] space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="mini-tag bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono">
                    {h.school}
                  </span>
                  <span className="text-[11.5px] font-mono text-[#71717A]">{h.topic}</span>
                </div>
                <h4
                  className="text-[16px] font-bold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {h.name} <span className="text-[12.5px] font-normal text-[#71717A]">— {h.year}</span>
                </h4>
                <p className="text-[13px] text-[#27272A] leading-relaxed">{h.coreThesis}</p>
                <div className="p-2.5 rounded-[9px] bg-[#FAFAFA] border border-[#E4E4E7] text-[12px] text-[#71717A]">
                  <strong className="text-[#18181B]">Anchor Evidence:</strong> {h.keyEvidenceCited}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Chronological Timeline */}
      {activeTab === 'timeline' && (
        <div key="tab-timeline" className="hist-panel-enter space-y-4">
          <div className="hairline-card bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[13px] font-semibold text-[#18181B]">
              Filter Causal Milestones by Syllabus Stream:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'ALL',
                'Move to Global War',
                'Authoritarian States',
                'Cold War',
                'Rights & Protest',
              ].map((stream) => (
                <button
                  key={stream}
                  type="button"
                  aria-pressed={timelineFilter === stream}
                  onClick={() => setTimelineFilter(stream)}
                  className={`hist-pill-btn px-3 py-1 rounded-full text-[11.5px] font-mono font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    timelineFilter === stream
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : 'bg-white text-[#71717A] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline-card space-y-4">
            {filteredTimeline.map((item) => (
              <div
                key={`${item.year}-${item.title}`}
                className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 pb-4 border-b border-[#E4E4E7] last:border-b-0 last:pb-0"
              >
                <span className="mini-tag bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono shrink-0 w-fit">
                  {item.year}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className="text-[15px] font-bold text-[#18181B]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.title}
                    </h4>
                    <span className="mini-tag font-mono border border-[#E4E4E7]">{item.stream}</span>
                  </div>
                  <p className="text-[13px] text-[#3F3F46] leading-relaxed">{item.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
