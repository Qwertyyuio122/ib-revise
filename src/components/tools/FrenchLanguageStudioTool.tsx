'use client';

import React, { useState, useEffect } from 'react';
import { KaTeXText } from '@/components/math/KaTeXText';

type FrenchStudioTab = 'text-types' | 'grammar-lab';

function resolveFrenchTab(tab?: string): FrenchStudioTab {
  if (tab === 'grammar' || tab === 'grammar-lab') return 'grammar-lab';
  return 'text-types';
}

const FRENCH_IB_THEMES = [
  'Identités',
  'Expériences',
  'Ingéniosité humaine',
  'Organisation sociale',
  'Partage de la planète',
] as const;

interface FrenchTextTypeSpec {
  id: string;
  nameFr: string;
  nameEn: string;
  typicalRegister: 'Vous (Formel)' | 'Tu / Vous (Semi-formel)' | 'Variable selon le public';
  suggestedThemes: string[];
  criterionCConventions: string[];
  openingFormulas: string[];
  closingFormulas: string[];
  modelSnippet: string;
}

interface GrammarModuleSpec {
  id: string;
  title: string;
  criterionImpact: string;
  ruleSummary: string;
  examples: {
    triggerOrContext: string;
    frenchSentence: string;
    englishGloss: string;
    conjugationNote: string;
  }[];
}

const FRENCH_TEXT_TYPES: FrenchTextTypeSpec[] = [
  {
    id: 'article',
    nameFr: 'L’Article de journal / magazine scolaire',
    nameEn: 'Newspaper or School Magazine Article',
    typicalRegister: 'Tu / Vous (Semi-formel)',
    suggestedThemes: ['Identités', 'Ingéniosité humaine', 'Organisation sociale'],
    criterionCConventions: [
      'Titre accrocheur (Catchy headline — often nominal or a rhetorical question)',
      'Chapeau introductif (2-line bold lead-in summarizing the angle + Byline: Par [Prénom Nom])',
      'Intertitres thématiques (2–3 subheadings dividing the body paragraphs)',
      'Interpellation directe des lecteurs (Rhetorical question or call to reflection in conclusion)',
    ],
    openingFormulas: [
      'Qui n’a jamais rêvé de concilier réussite scolaire et bien-être ?',
      'À l’heure où les réseaux sociaux façonnent notre quotidien, une question s’impose...',
    ],
    closingFormulas: [
      'Et vous, êtes-vous prêts à relever ce défi dès demain ? Partagez vos avis dans notre prochain numéro !',
      'Par Jean Dupont, élève de Terminale',
    ],
    modelSnippet:
      'FAUT-IL BANNIR LES SMARTPHONES AU LYCÉE ?\nPar Claire Moreau — Le 14 mai 2026\n\nAlors que de nombreux établissements interdisent désormais les écrans dans la cour de récréation, les élèves s’interrogent : s’agit-il d’une mesure libératrice ou d’une restriction dépassée ?',
  },
  {
    id: 'blog',
    nameFr: 'Le Billet de blog',
    nameEn: 'Personal or Thematic Blog Post',
    typicalRegister: 'Tu / Vous (Semi-formel)',
    suggestedThemes: ['Expériences', 'Identités', 'Partage de la planète'],
    criterionCConventions: [
      'Nom du blog, date et heure de publication + titre engageant',
      'Salutation chaleureuse aux abonnés ("Salut à tous les lecteurs du blog !")',
      'Ton personnel et réflexif combinant anecdote vécue et réflexion sur le thème IB',
      'Invitation explicite à laisser un commentaire en bas de page + section Commentaires',
    ],
    openingFormulas: [
      'Salut à toutes et à tous ! J’espère que vous allez bien. Aujourd’hui, je tenais à partager avec vous une expérience qui m’a profondément marqué(e)...',
    ],
    closingFormulas: [
      'Et vous, qu’en pensez-vous ? N’hésitez pas à me raconter votre expérience dans l’espace commentaires ci-dessous et à partager ce billet !',
    ],
    modelSnippet:
      'BLOG : ÉCO-JEUNESSE · Publié le 12 novembre à 18h30 par Lucas\nTitre : Ma semaine sans plastique : bilan d’un défi pas si simple !\n\nSalut tout le monde ! Vous êtes nombreux à m’avoir demandé comment s’est passée ma semaine « zéro déchet »...',
  },
  {
    id: 'brochure',
    nameFr: 'La Brochure / Le Dépliant / Le Guide',
    nameEn: 'Informational Brochure, Leaflet, or Guide',
    typicalRegister: 'Vous (Formel)',
    suggestedThemes: ['Partage de la planète', 'Identités (Santé)', 'Organisation sociale'],
    criterionCConventions: [
      'Titre principal + slogan percutant en en-tête',
      'Sous-titres clairs sous forme de questions ou d’impératifs ("Pourquoi agir ?", "3 gestes simples")',
      'Listes à puces (bullet points) et emploi de l’impératif / de l’infinitif de conseil',
      'Encadré pratique final (Contact, site web, numéro de téléphone, adresse)',
    ],
    openingFormulas: [
      'Vous souhaitez réduire votre empreinte carbone tout en économisant ? Ce guide pratique est fait pour vous !',
    ],
    closingFormulas: [
      'Pour en savoir plus : www.eco-lycee.fr | Contactez-nous au 01 42 68 55 00',
    ],
    modelSnippet:
      'BIEN VIVRE SON ANNÉE DU BAC : LE GUIDE DE SURVIE\n« Un esprit sain dans un corps reposé »\n\n• Organisez votre emploi du temps dès le dimanche soir.\n• Privilégiez huit heures de sommeil plutôt que les révisions nocturnes.',
  },
  {
    id: 'lettre-formelle',
    nameFr: 'La Lettre formelle (au proviseur / au maire / au rédacteur)',
    nameEn: 'Formal Letter',
    typicalRegister: 'Vous (Formel)',
    suggestedThemes: ['Organisation sociale', 'Partage de la planète'],
    criterionCConventions: [
      'Coordonnées de l’expéditeur (haut gauche), du destinataire (haut droite), lieu et date',
      'Objet : [Motif précis de la lettre]',
      'Formule d’appel stricte : « Monsieur le Proviseur, » / « Madame la Maire, »',
      'Formule de politesse finale complète (« Je vous prie d’agréer, Monsieur le Proviseur, l’expression de mes salutations distinguées. »)',
    ],
    openingFormulas: [
      'Au nom des élèves de Terminale, je me permets de solliciter votre bienveillance afin de vous soumettre un projet de...',
      'Par la présente, je tiens à attirer votre attention sur...',
    ],
    closingFormulas: [
      'Dans l’attente d’une réponse favorable de votre part, je vous prie d’agréer, Madame la Directrice, l’expression de ma considération distinguée.',
    ],
    modelSnippet:
      'Objet : Proposition de création d’un jardin partagé au sein de l’établissement\n\nMonsieur le Proviseur,\n\nEn tant que délégué du comité écologique des élèves, je me permets de vous adresser cette lettre afin de...',
  },
  {
    id: 'discours',
    nameFr: 'Le Discours / L’Allocution / L’Intervention orale',
    nameEn: 'Public Speech or Assembly Address',
    typicalRegister: 'Variable selon le public',
    suggestedThemes: ['Organisation sociale', 'Partage de la planète', 'Identités'],
    criterionCConventions: [
      'Apostrophe initiale au public (« Monsieur le Directeur, chers professeurs, chers camarades, »)',
      'Procédés oratoires : questions rhétoriques, anaphores, pronoms inclusifs (« nous »)',
      'Connecteurs d’oralité structurés et remerciement final (« Je vous remercie de votre attention. »)',
    ],
    openingFormulas: [
      'Madame la Proviseure, chers enseignants, chers camarades, bonjour à toutes et à tous.',
      'Si je prends la parole devant vous aujourd’hui, c’est parce qu’une urgence nous concerne tous...',
    ],
    closingFormulas: [
      'Ensemble, faisons de notre lycée un modèle d’inclusion. Je vous remercie chaleureusement de votre écoute !',
    ],
    modelSnippet:
      'Chers camarades,\n\nCombien de fois avons-nous traversé la cour sans même lever les yeux de nos écrans ? Combien de fois avons-nous préféré un message virtuel à une vraie conversation ?',
  },
  {
    id: 'courriel',
    nameFr: 'Le Courriel (Formel ou Amical)',
    nameEn: 'Official or Personal Email',
    typicalRegister: 'Variable selon le public',
    suggestedThemes: ['Expériences', 'Ingéniosité humaine', 'Organisation sociale'],
    criterionCConventions: [
      'En-tête obligatoire : De : [...] / À : [...] / Date : [...] / Objet : [...]',
      'Salutation adaptée au destinataire (« Cher Thomas, » vs « Madame Martin, »)',
      'Paragraphes aérés + formule de congé (« Cordialement, » ou « À très bientôt, »)',
    ],
    openingFormulas: [
      'Je t’écris ce petit mail pour te raconter mon échange linguistique à Montréal...',
      'Je me permets de vous contacter au sujet de l’organisation de la journée portes ouvertes.',
    ],
    closingFormulas: [
      'Bien cordialement, / Gros bisous et à très vite,',
    ],
    modelSnippet:
      'De : camille.dubois@lycee-international.fr\nÀ : direction@asso-solidarite.fr\nObjet : Candidature au programme de bénévolat estival',
  },
];

const GRAMMAR_MODULES: GrammarModuleSpec[] = [
  {
    id: 'subjonctif',
    title: '1. Le Subjonctif Présent (High-Scoring Triggers)',
    criterionImpact: 'Placing 2–3 accurate subjunctive clauses in Paper 1 is the fastest route to Band 10–12 in Criterion A (Language).',
    ruleSummary:
      'Take the `ils/elles` present tense stem, drop `-ent`, and add `-e, -es, -e, -ions, -iez, -ent`. Memorize the 7 essential irregulars: `soit (être)`, `ait (avoir)`, `fasse (faire)`, `aille (aller)`, `puisse (pouvoir)`, `sache (savoir)`, `veuille (vouloir)`.',
    examples: [
      {
        triggerOrContext: 'Concession: Bien que / Quoique (+ Subjonctif)',
        frenchSentence: 'Bien que la technologie soit indispensable, il ne faut pas qu’elle remplace le dialogue humain.',
        englishGloss: 'Although technology is indispensable, it must not replace human dialogue.',
        conjugationNote: 'être → que je sois, qu’il soit, que nous soyons',
      },
      {
        triggerOrContext: 'Necessity & Emotion: Il est essentiel que / Je crains que',
        frenchSentence: 'Il est primordial que chaque citoyen prenne conscience des enjeux climatiques avant qu’il ne soit trop tard.',
        englishGloss: 'It is vital that every citizen become aware of climate issues before it is too late.',
        conjugationNote: 'prendre → qu’il prenne / que nous prenions',
      },
      {
        triggerOrContext: 'Purpose: Pour que / Afin que (+ Subjonctif)',
        frenchSentence: 'Nous avons créé cet atelier afin que les nouveaux élèves puissent s’intégrer facilement.',
        englishGloss: 'We created this workshop so that new students can integrate easily.',
        conjugationNote: 'pouvoir → qu’ils puissent',
      },
    ],
  },
  {
    id: 'si-clauses',
    title: '2. Les Hypothèses avec « Si » (Concordance des temps)',
    criterionImpact: 'Demonstrates complex conditional syntax for proposing solutions in articles, speeches, and formal letters.',
    ruleSummary:
      'Remember the golden rule: **"Les scies (si) n’aiment pas les raies (-rais)"** — never put the conditional immediately after `si`!',
    examples: [
      {
        triggerOrContext: 'Type 1 (Real/Likely): Si + Présent → Futur simple / Impératif',
        frenchSentence: 'Si nous réduisons notre consommation d’énergie, nous protégerons durablement la biodiversité.',
        englishGloss: 'If we reduce our energy consumption, we will sustainably protect biodiversity.',
        conjugationNote: 'réduisons (présent) → protégerons (futur simple)',
      },
      {
        triggerOrContext: 'Type 2 (Hypothetical Present): Si + Imparfait → Conditionnel présent',
        frenchSentence: 'Si la mairie investissait davantage dans les pistes cyclables, moins d’habitants utiliseraient leur voiture.',
        englishGloss: 'If the city council invested more in bike lanes, fewer residents would use their cars.',
        conjugationNote: 'investissait (imparfait) → utiliseraient (conditionnel présent)',
      },
    ],
  },
  {
    id: 'pronoms-relatifs',
    title: '3. Les Pronoms Relatifs (Qui, Que, Dont, Où, Lequel)',
    criterionImpact: 'Replaces choppy short sentences with sophisticated subordinate clauses.',
    ruleSummary:
      '`Qui` = subject (followed by verb); `Que` = direct object (followed by subject + verb); `Dont` = replaces `de + noun` (`parler de, avoir besoin de, être fier de`); `Où` = place or time.',
    examples: [
      {
        triggerOrContext: 'DONT (verbs/adjectives constructed with DE)',
        frenchSentence: 'C’est un projet solidaire dont nous sommes extrêmement fiers et dont les bénéfices aideront le quartier.',
        englishGloss: 'It is a solidarity project of which we are extremely proud and whose benefits will help the neighborhood.',
        conjugationNote: 'être fier de → dont / les bénéfices de ce projet → dont les bénéfices',
      },
      {
        triggerOrContext: 'OÙ (Temporal & Spatial Relative)',
        frenchSentence: 'À l’époque où le numérique domine, la bibliothèque reste un lieu où l’on peut se concentrer.',
        englishGloss: 'In an era when digital technology dominates, the library remains a place where one can focus.',
        conjugationNote: 'où after expressions of time (le jour où, l’époque où) and place',
      },
    ],
  },
  {
    id: 'connecteurs',
    title: '4. Connecteurs Logiques de Haut Niveau (Criterion B Cohesion)',
    criterionImpact: 'Directly boosts Criterion B (Message & Organization) by structuring arguments clearly.',
    ruleSummary:
      'Replace basic connectors (`et, mais, parce que`) with varied C1-level discourse markers across your introduction, development, and conclusion.',
    examples: [
      {
        triggerOrContext: 'Introduction & Nuance',
        frenchSentence: 'Force est de constater que... / En premier lieu... / À première vue, on pourrait penser que...',
        englishGloss: 'One must acknowledge that... / First of all... / At first glance, one might think that...',
        conjugationNote: 'Ideal for opening the 1st body paragraph',
      },
      {
        triggerOrContext: 'Opposition & Counter-Argument',
        frenchSentence: 'Néanmoins / Toutefois / En revanche / Force est de reconnaître que...',
        englishGloss: 'Nevertheless / However / On the other hand / One must recognize that...',
        conjugationNote: 'Pivots smoothly to your counter-argument paragraph',
      },
      {
        triggerOrContext: 'Conclusion & Synthesis',
        frenchSentence: 'En définitive / Somme toute / Tout bien considéré, il apparaît clairement que...',
        englishGloss: 'Ultimately / All in all / All things considered, it clearly appears that...',
        conjugationNote: 'Signals the final synthesis before the closing convention',
      },
    ],
  },
  {
    id: 'conditionnel',
    title: '5. Le Conditionnel Présent & Passé (Conseil, Politesse & Hypothèse)',
    criterionImpact: 'Essential in formal letters, brochures, and speeches to propose solutions politely and express unfulfilled hypotheses (Criterion A).',
    ruleSummary:
      'Use the **futur simple stem** + **imparfait endings** (`-ais, -ais, -ait, -ions, -iez, -aient`). Key irregular stems: `ser- (être)`, `aur- (avoir)`, `fer- (faire)`, `ir- (aller)`, `pourr- (pouvoir)`, `devr- (devoir)`, `voudr- (vouloir)`.',
    examples: [
      {
        triggerOrContext: 'Polite Proposal & Recommendation (Brochure / Lettre formelle)',
        frenchSentence: 'Il serait judicieux d’installer des fontaines à eau afin que les élèves réduisent les déchets plastiques.',
        englishGloss: 'It would be wise to install water fountains so that students reduce plastic waste.',
        conjugationNote: 'être → il serait / vous devriez / nous pourrions',
      },
      {
        triggerOrContext: 'Conditionnel passé (Regret or Unfulfilled Past Hypothesis — Si + Plus-que-parfait)',
        frenchSentence: 'Si la municipalité avait agi plus tôt, nous aurions évité une telle pollution urbaine.',
        englishGloss: 'If the municipality had acted earlier, we would have avoided such urban pollution.',
        conjugationNote: 'aurait / serait + participe passé (nous aurions évité)',
      },
    ],
  },
];

export function FrenchLanguageStudioTool({ initialTab }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<FrenchStudioTab>(() => resolveFrenchTab(initialTab));
  const [selectedTextTypeId, setSelectedTextTypeId] = useState<string>(FRENCH_TEXT_TYPES[0].id);
  const [checkedConventions, setCheckedConventions] = useState<Record<string, boolean>>({});
  const [selectedGrammarId, setSelectedGrammarId] = useState<string>(GRAMMAR_MODULES[0].id);

  useEffect(() => {
    setActiveTab(resolveFrenchTab(initialTab));
  }, [initialTab]);

  const activeTextType =
    FRENCH_TEXT_TYPES.find((t) => t.id === selectedTextTypeId) ?? FRENCH_TEXT_TYPES[0];
  const activeGrammar =
    GRAMMAR_MODULES.find((g) => g.id === selectedGrammarId) ?? GRAMMAR_MODULES[0];

  const toggleConvention = (conv: string) => {
    setCheckedConventions((prev) => ({ ...prev, [conv]: !prev[conv] }));
  };

  const hasCheckedForActive = activeTextType.criterionCConventions.some(
    (c) => checkedConventions[c]
  );

  const resetActiveChecklist = () => {
    setCheckedConventions((prev) => {
      const next = { ...prev };
      for (const c of activeTextType.criterionCConventions) {
        delete next[c];
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="hairline-card">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="mini-tag bg-[#E0F2FE] text-[#0369A1] font-mono">
            IB FRENCH B SL · PAPER 1 (30 MARKS) &amp; IO
          </span>
          <span className="text-[11.5px] font-mono text-[#71717A]">
            5 Thèmes : {FRENCH_IB_THEMES.join(' · ')}
          </span>
        </div>
        <h2
          className="text-[20px] font-semibold tracking-tight text-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          French B Text-Type & Register Studio + Subjonctif & Grammar Lab
        </h2>
        <p className="text-[13px] text-[#71717A] mt-0.5">
          Master Criterion C format conventions across all 6 IB Paper 1 text types and drill high-scoring Criterion A grammar structures.
        </p>

        <div
          role="tablist"
          aria-label="French B SL studio tools"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4E4E7]"
        >
          {[
            { id: 'text-types', label: 'Paper 1 Text-Type & Register Studio (Criterion C)' },
            { id: 'grammar-lab', label: 'Grammar, Subjonctif & Connecteurs Lab (Criterion A)' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as FrenchStudioTab)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
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

      {/* TAB 1: Text-Type & Register Studio */}
      {activeTab === 'text-types' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 hairline-card space-y-2">
            <h3
              className="text-[15px] font-semibold text-[#18181B] pb-2 border-b border-[#E4E4E7]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              6 Core IB French B SL Text Types
            </h3>
            {FRENCH_TEXT_TYPES.map((tt) => {
              const active = tt.id === activeTextType.id;
              return (
                <button
                  key={tt.id}
                  type="button"
                  onClick={() => setSelectedTextTypeId(tt.id)}
                  className={`w-full text-left p-3 rounded-[11px] border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                    active
                      ? 'border-[#0284C7] bg-[#F0F9FF]'
                      : 'border-[#E4E4E7] bg-white hover:bg-[#F4F4F5]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[13.5px] font-semibold text-[#18181B]">
                      {tt.nameFr}
                    </span>
                    <span className="mini-tag font-mono shrink-0">{tt.typicalRegister}</span>
                  </div>
                  <div className="text-[12px] text-[#71717A] mt-0.5">{tt.nameEn}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 hairline-card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E4E4E7] pb-3">
              <div>
                <span className="mini-tag bg-[#E0F2FE] text-[#0369A1] font-mono">
                  Registre : {activeTextType.typicalRegister}
                </span>
                <h3
                  className="text-[18px] font-bold text-[#18181B] mt-1.5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {activeTextType.nameFr}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeTextType.suggestedThemes.map((theme) => (
                    <span key={theme} className="mini-tag font-mono">
                      Thème : {theme}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[12px] font-mono text-[#0284C7] font-semibold shrink-0">
                Criterion C: 6 / 6 Marks
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[12px] font-mono font-bold uppercase text-[#71717A]">
                  Mandatory Format Checklist (Click to Verify in Your Draft)
                </div>
                {hasCheckedForActive && (
                  <button
                    type="button"
                    onClick={resetActiveChecklist}
                    className="pill-btn text-[11px]"
                  >
                    Reset Checklist
                  </button>
                )}
              </div>
              {activeTextType.criterionCConventions.map((conv) => {
                const checked = !!checkedConventions[conv];
                return (
                  <button
                    key={conv}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleConvention(conv)}
                    className={`w-full text-left p-2.5 rounded-[9px] border text-[13px] flex items-center justify-between cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                      checked
                        ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                        : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B]'
                    }`}
                  >
                    <span>{conv}</span>
                    <span className="font-mono text-[11px] font-bold ml-2 shrink-0">
                      {checked ? '✓ Included' : 'Check'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[11px] font-mono font-bold uppercase text-[#0284C7] mb-1">
                  Formules d’ouverture (Opening)
                </div>
                {activeTextType.openingFormulas.map((f) => (
                  <p key={f} className="text-[12.5px] text-[#18181B] italic mt-1">
                    « {f} »
                  </p>
                ))}
              </div>
              <div className="p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[11px] font-mono font-bold uppercase text-[#0284C7] mb-1">
                  Formules de clôture (Closing)
                </div>
                {activeTextType.closingFormulas.map((f) => (
                  <p key={f} className="text-[12.5px] text-[#18181B] italic mt-1">
                    « {f} »
                  </p>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#F0F9FF] border border-[#BAE6FD]">
              <div className="text-[11px] font-mono font-bold uppercase text-[#0369A1] mb-1">
                Authentic Paper 1 Header & Opening Exemplar
              </div>
              <pre
                className="whitespace-pre-wrap text-[13px] text-[#18181B] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {activeTextType.modelSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Grammar, Subjonctif & Conjugation Lab */}
      {activeTab === 'grammar-lab' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {GRAMMAR_MODULES.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedGrammarId(mod.id)}
                className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-semibold border cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  mod.id === activeGrammar.id
                    ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0369A1]'
                    : 'border-[#E4E4E7] bg-white text-[#27272A] hover:bg-[#F4F4F5]'
                }`}
              >
                {mod.title}
              </button>
            ))}
          </div>

          <div className="hairline-card space-y-4">
            <div className="border-b border-[#E4E4E7] pb-3">
              <span className="mini-tag bg-[#E0F2FE] text-[#0369A1] font-mono">
                {activeGrammar.criterionImpact}
              </span>
              <h3
                className="text-[17px] font-bold text-[#18181B] mt-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {activeGrammar.title}
              </h3>
              <KaTeXText text={activeGrammar.ruleSummary} as="p" className="text-[13px] text-[#27272A] mt-1" />
            </div>

            <div className="space-y-3">
              {activeGrammar.examples.map((ex) => (
                <div
                  key={ex.triggerOrContext}
                  className="p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12px] font-mono font-bold text-[#0284C7]">
                      {ex.triggerOrContext}
                    </span>
                    <span className="mini-tag font-mono">{ex.conjugationNote}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#18181B]">{ex.frenchSentence}</p>
                  <p className="text-[12.5px] text-[#71717A] italic">{ex.englishGloss}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
