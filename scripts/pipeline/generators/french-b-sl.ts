import type { QuestionItem } from '../../../src/content/schemas';
import { SeededRng, buildMcqOptions, makeId } from './utils';

type FrFamilyFn = (rng: SeededRng, idx: number) => QuestionItem;

/* --------------------- 1. SUBJUNCTIVE VS INDICATIVE ENGINE (fr-GRAMMAR) --------------------- */

const SUBJ_TRIGGERS = [
  { text: 'Il faut que', mode: 'subjonctif', reason: 'expression d\'obligation impersonnelle' },
  { text: 'Bien que', mode: 'subjonctif', reason: 'conjonction de concession régissant le subjonctif' },
  { text: 'Pour que', mode: 'subjonctif', reason: 'conjonction de but régissant le subjonctif' },
  { text: 'Avant que', mode: 'subjonctif', reason: 'conjonction de temps antérieur régissant le subjonctif' },
  { text: 'Il est essentiel que', mode: 'subjonctif', reason: 'expression de nécessité' },
  { text: 'Je doute que', mode: 'subjonctif', reason: 'expression de doute/incertitude' },
  { text: 'À moins que', mode: 'subjonctif', reason: 'conjonction de restriction régissant le subjonctif' },
  { text: 'Quoique', mode: 'subjonctif', reason: 'conjonction concessive régissant le subjonctif' },
  { text: 'Il est important que', mode: 'subjonctif', reason: 'jugement de valeur / nécessité' },
  { text: 'Je crains que', mode: 'subjonctif', reason: 'verbe de crainte/sentiment' },
  { text: 'Il est certain que', mode: 'indicatif', reason: 'expression de certitude à la forme affirmative' },
  { text: 'Parce que', mode: 'indicatif', reason: 'conjonction de cause factuelle' },
  { text: 'Je sais que', mode: 'indicatif', reason: 'verbe de connaissance affirmative' },
  { text: 'Il est évident que', mode: 'indicatif', reason: 'constatation objective certaine' },
  { text: 'Après que', mode: 'indicatif', reason: 'postériorité factuelle (indicatif en français standard)' },
] as const;

const FR_VERBS_MOOD = [
  {
    inf: 'être',
    subj: { je: 'sois', tu: 'sois', on: 'soit', nous: 'soyons', vous: 'soyez', ils: 'soient' },
    ind: { je: 'suis', tu: 'es', on: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont' },
    comp: ['attentif aux coutumes locales', 'impliqué dans le bénévolat', 'prêt pour l\'examen oral'],
  },
  {
    inf: 'avoir',
    subj: { je: 'aie', tu: 'aies', on: 'ait', nous: 'ayons', vous: 'ayez', ils: 'aient' },
    ind: { je: 'ai', tu: 'as', on: 'a', nous: 'avons', vous: 'avez', ils: 'ont' },
    comp: ['accès à une éducation bilingue', 'le courage de s\'exprimer', 'assez de ressources numériques'],
  },
  {
    inf: 'faire',
    subj: { je: 'fasse', tu: 'fasses', on: 'fasse', nous: 'fassions', vous: 'fassiez', ils: 'fassent' },
    ind: { je: 'fais', tu: 'fais', on: 'fait', nous: 'faisons', vous: 'faites', ils: 'font' },
    comp: ['un effort pour recycler davantage', 'des recherches sur le patrimoine', 'preuve d\'esprit critique'],
  },
  {
    inf: 'aller',
    subj: { je: 'aille', tu: 'ailles', on: 'aille', nous: 'allions', vous: 'alliez', ils: 'aillent' },
    ind: { je: 'vais', tu: 'vas', on: 'va', nous: 'allons', vous: 'allez', ils: 'vont' },
    comp: ['à la conférence sur le climat', 'à la bibliothèque municipale', 'étudier à Montréal cet été'],
  },
  {
    inf: 'pouvoir',
    subj: { je: 'puisse', tu: 'puisses', on: 'puisse', nous: 'puissions', vous: 'puissiez', ils: 'puissent' },
    ind: { je: 'peux', tu: 'peux', on: 'peut', nous: 'pouvons', vous: 'pouvez', ils: 'peuvent' },
    comp: ['réduire notre empreinte carbone', 'participer au débat citoyen', 'protéger la biodiversité marine'],
  },
  {
    inf: 'savoir',
    subj: { je: 'sache', tu: 'saches', on: 'sache', nous: 'sachions', vous: 'sachiez', ils: 'sachent' },
    ind: { je: 'sais', tu: 'sais', on: 'sait', nous: 'savons', vous: 'savez', ils: 'savent' },
    comp: ['distinguer les sources fiables', 'gérer leur temps d\'écran', 'respecter le registre formel'],
  },
  {
    inf: 'prendre',
    subj: { je: 'prenne', tu: 'prennes', on: 'prenne', nous: 'prenions', vous: 'preniez', ils: 'prennent' },
    ind: { je: 'prends', tu: 'prends', on: 'prend', nous: 'prenons', vous: 'prenez', ils: 'prennent' },
    comp: ['les transports en commun', 'soin de sa santé mentale', 'des initiatives solidaires'],
  },
  {
    inf: 'venir',
    subj: { je: 'vienne', tu: 'viennes', on: 'vienne', nous: 'venions', vous: 'veniez', ils: 'viennent' },
    ind: { je: 'viens', tu: 'viens', on: 'vient', nous: 'venons', vous: 'venez', ils: 'viennent' },
    comp: ['présenter son projet francophone', 'rencontrer les correspondants sénégalais', 'soutenir l\'association locale'],
  },
  {
    inf: 'devoir',
    subj: { je: 'doive', tu: 'doives', on: 'doive', nous: 'devions', vous: 'deviez', ils: 'doivent' },
    ind: { je: 'dois', tu: 'dois', on: 'doit', nous: 'devons', vous: 'devez', ils: 'doivent' },
    comp: ['repenser nos habitudes alimentaires', 'limiter le gaspillage d\'eau', 'dialoguer entre générations'],
  },
  {
    inf: 'vouloir',
    subj: { je: 'veuille', tu: 'veuilles', on: 'veuille', nous: 'voulions', vous: 'vouliez', ils: 'veuillent' },
    ind: { je: 'veux', tu: 'veux', on: 'veut', nous: 'voulons', vous: 'voulez', ils: 'veulent' },
    comp: ['défendre l\'égalité d\'accès', 'préserver les langues régionales', 'innover de façon éthique'],
  },
] as const;

const SUBJECT_PRONOUNS = [
  { key: 'je', label: 'je', elide: "j'" },
  { key: 'tu', label: 'tu', elide: 'tu' },
  { key: 'on', label: 'elle', elide: 'elle' },
  { key: 'nous', label: 'nous', elide: 'nous' },
  { key: 'vous', label: 'vous', elide: 'vous' },
  { key: 'ils', label: 'les jeunes', elide: 'les jeunes' },
] as const;

const MOOD_FRAMES = [
  'Complétez correctement la phrase avec le verbe',
  'Dans un courriel formel, complétez la phrase avec le verbe',
  'Pour un article de blog scolaire, mettez au mode et au temps corrects le verbe',
  'Lors d\'une interview, complétez la réponse avec le verbe',
  'Dans un discours devant la classe, complétez la phrase avec le verbe',
  'Pour un compte rendu, choisissez la forme correcte du verbe',
  'Dans une lettre à un ami, complétez la phrase avec le verbe',
  'À l\'oral individuel, complétez l\'énoncé avec le verbe',
] as const;

function genSubjunctiveOrIndicative(rng: SeededRng, idx: number): QuestionItem {
  const trig = SUBJ_TRIGGERS[idx % SUBJ_TRIGGERS.length];
  const verb = FR_VERBS_MOOD[Math.floor(idx / SUBJ_TRIGGERS.length) % FR_VERBS_MOOD.length];
  const subj = SUBJECT_PRONOUNS[Math.floor(idx / (SUBJ_TRIGGERS.length * FR_VERBS_MOOD.length)) % SUBJECT_PRONOUNS.length];
  const comp = verb.comp[Math.floor(idx / (SUBJ_TRIGGERS.length * FR_VERBS_MOOD.length * SUBJECT_PRONOUNS.length)) % verb.comp.length];
  const frame = MOOD_FRAMES[Math.floor(idx / (SUBJ_TRIGGERS.length * FR_VERBS_MOOD.length * SUBJECT_PRONOUNS.length * 3)) % MOOD_FRAMES.length];

  const correctForm = trig.mode === 'subjonctif' ? verb.subj[subj.key] : verb.ind[subj.key];
  const oppositeForm = trig.mode === 'subjonctif' ? verb.ind[subj.key] : verb.subj[subj.key];
  const subjOtherKey = subj.key === 'nous' ? 'vous' : 'nous';
  const wrongPerson = verb.subj[subjOtherKey];

  const displayPronoun =
    subj.key === 'je' && /^[aeéèêhiouy]/i.test(correctForm) ? "j'" : `${subj.label} `;
  const blankPronoun = subj.key === 'je' ? 'je / j\'' : subj.label;

  const isMcq = idx % 2 === 0;
  const mcq = isMcq
    ? buildMcqOptions(rng, correctForm, [
        oppositeForm,
        wrongPerson,
        verb.inf,
      ])
    : null;

  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: 'fr-GRAMMAR',
    subtopicCode: 'Critère A · Subjonctif',
    paper: isMcq ? 'Paper 2' : 'Paper 1',
    questionType: isMcq ? 'mcq' : 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: isMcq ? 1 : 2,
    commandTerm: isMcq ? 'Choisissez' : 'Conjuguez',
    stemMarkdown: `${frame} **${verb.inf}** : « *${trig.text} ${blankPronoun} _____ ${comp}.* »`,
    options: mcq?.options ?? null,
    correctOptionId: mcq?.correctOptionId ?? null,
    markschemePoints: isMcq
      ? [{ pointId: 'A1', requirement: `Forme correcte : **${displayPronoun}${correctForm}** (${trig.mode} — ${trig.reason})`, marks: 1 }]
      : [
          { pointId: 'M1', requirement: `Identifie le mode requis : **${trig.mode}** (${trig.reason})`, marks: 1 },
          { pointId: 'A1', requirement: `Conjugaison exacte : **${correctForm}**`, marks: 1 },
        ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Analyser le déclencheur syntaxique',
        explanationMarkdown: `« *${trig.text}* » est une ${trig.reason}, qui exige l'**${trig.mode}**.`,
      },
      {
        stepNumber: 2,
        title: 'Accorder avec le sujet',
        explanationMarkdown: `Pour « ${subj.label} », le verbe *${verb.inf}* au ${trig.mode} donne **${correctForm}**.`,
      },
    ],
    commonPitfalls: [
      `Confondre les déclencheurs du subjonctif (*bien que, il faut que*) avec ceux de l'indicatif (*parce que, il est certain que*).`,
      `Oublier les radicaux irréguliers du subjonctif (*sois, aie, fasse, aille, puisse, sache*).`,
    ],
    isDailyEligible: true,
  };
}

/* --------------------- 2. HYPOTHETICAL SI-CLAUSES ENGINE --------------------- */

const SI_SUBJECTS = [
  {
    prot: 'je réduis mes déchets plastiques',
    imp: 'je réduisais mes déchets plastiques',
    pqp: 'j\'avais réduit mes déchets plastiques',
    subj: 'je',
  },
  {
    prot: 'tu lis la presse francophone',
    imp: 'tu lisais la presse francophone',
    pqp: 'tu avais lu la presse francophone',
    subj: 'tu',
  },
  {
    prot: 'elle adopte un mode de vie durable',
    imp: 'elle adoptait un mode de vie durable',
    pqp: 'elle avait adopté un mode de vie durable',
    subj: 'elle',
  },
  {
    prot: 'nous investissons dans les transports doux',
    imp: 'nous investissions dans les transports doux',
    pqp: 'nous avions investi dans les transports doux',
    subj: 'nous',
  },
  {
    prot: 'vous privilégiez les circuits courts',
    imp: 'vous privilégiez les circuits courts',
    pqp: 'vous aviez privilégié les circuits courts',
    subj: 'vous',
  },
  {
    prot: 'les jeunes soutiennent ces projets civiques',
    imp: 'les jeunes soutenaient ces projets civiques',
    pqp: 'les jeunes avaient soutenu ces projets civiques',
    subj: 'ils',
  },
  {
    prot: 'on valorise la diversité linguistique',
    imp: 'on valorisait la diversité linguistique',
    pqp: 'on avait valorisé la diversité linguistique',
    subj: 'on',
  },
  {
    prot: 'le conseil municipal écoute les étudiants',
    imp: 'le conseil municipal écoutait les étudiants',
    pqp: 'le conseil municipal avait écouté les étudiants',
    subj: 'il',
  },
] as const;

const SI_RESULT_VERBS = [
  {
    inf: 'protéger',
    obj: 'l\'équilibre écologique de notre région',
    fut: { je: 'protégerai', tu: 'protégeras', elle: 'protégera', il: 'protégera', on: 'protégera', nous: 'protégerons', vous: 'protégerez', ils: 'protégeront' },
    cond: { je: 'protégerais', tu: 'protégerais', elle: 'protégerait', il: 'protégerait', on: 'protégerait', nous: 'protégerions', vous: 'protégeriez', ils: 'protégeraient' },
    condP: { je: 'aurais protégé', tu: 'aurais protégé', elle: 'aurait protégé', il: 'aurait protégé', on: 'aurait protégé', nous: 'aurions protégé', vous: 'auriez protégé', ils: 'auraient protégé' },
  },
  {
    inf: 'améliorer',
    obj: 'la cohésion culturelle du lycée',
    fut: { je: 'améliorerai', tu: 'amélioreras', elle: 'améliorera', il: 'améliorera', on: 'améliorera', nous: 'améliorerons', vous: 'améliorerez', ils: 'amélioreront' },
    cond: { je: 'améliorerais', tu: 'améliorerais', elle: 'améliorerait', il: 'améliorerait', on: 'améliorerait', nous: 'améliorerions', vous: 'amélioreriez', ils: 'amélioreraient' },
    condP: { je: 'aurais amélioré', tu: 'aurais amélioré', elle: 'aurait amélioré', il: 'aurait amélioré', on: 'aurait amélioré', nous: 'aurions amélioré', vous: 'auriez amélioré', ils: 'auraient amélioré' },
  },
  {
    inf: 'pouvoir',
    obj: 'réduire sensiblement notre empreinte carbone',
    fut: { je: 'pourrai', tu: 'pourras', elle: 'pourra', il: 'pourra', on: 'pourra', nous: 'pourrons', vous: 'pourrez', ils: 'pourront' },
    cond: { je: 'pourrais', tu: 'pourrais', elle: 'pourrait', il: 'pourrait', on: 'pourrait', nous: 'pourrions', vous: 'pourriez', ils: 'pourraient' },
    condP: { je: 'aurais pu', tu: 'aurais pu', elle: 'aurait pu', il: 'aurait pu', on: 'aurait pu', nous: 'aurions pu', vous: 'auriez pu', ils: 'auraient pu' },
  },
  {
    inf: 'faire',
    obj: 'des progrès remarquables à l\'oral',
    fut: { je: 'ferai', tu: 'feras', elle: 'fera', il: 'fera', on: 'fera', nous: 'ferons', vous: 'ferez', ils: 'feront' },
    cond: { je: 'ferais', tu: 'ferais', elle: 'ferait', il: 'ferait', on: 'ferait', nous: 'ferions', vous: 'feriez', ils: 'feraient' },
    condP: { je: 'aurais fait', tu: 'aurais fait', elle: 'aurait fait', il: 'aurait fait', on: 'aurait fait', nous: 'aurions fait', vous: 'auriez fait', ils: 'auraient fait' },
  },
  {
    inf: 'savoir',
    obj: 'défendre des arguments nuancés en français',
    fut: { je: 'saurai', tu: 'sauras', elle: 'saura', il: 'saura', on: 'saura', nous: 'saurons', vous: 'saurez', ils: 'sauront' },
    cond: { je: 'saurais', tu: 'saurais', elle: 'saurait', il: 'saurait', on: 'saurait', nous: 'saurions', vous: 'sauriez', ils: 'sauraient' },
    condP: { je: 'aurais su', tu: 'aurais su', elle: 'aurait su', il: 'aurait su', on: 'aurait su', nous: 'aurions su', vous: 'auriez su', ils: 'auraient su' },
  },
  {
    inf: 'devoir',
    obj: 'repenser nos priorités numériques',
    fut: { je: 'devrai', tu: 'devras', elle: 'devra', il: 'devra', on: 'devra', nous: 'devrons', vous: 'devrez', ils: 'devront' },
    cond: { je: 'devrais', tu: 'devrais', elle: 'devrait', il: 'devrait', on: 'devrait', nous: 'devrions', vous: 'devriez', ils: 'devraient' },
    condP: { je: 'aurais dû', tu: 'aurais dû', elle: 'aurait dû', il: 'aurait dû', on: 'aurait dû', nous: 'aurions dû', vous: 'auriez dû', ils: 'auraient dû' },
  },
  {
    inf: 'obtenir',
    obj: 'davantage de bourses d\'échange francophones',
    fut: { je: 'obtiendrai', tu: 'obtiendras', elle: 'obtiendra', il: 'obtiendra', on: 'obtiendra', nous: 'obtiendrons', vous: 'obtiendrez', ils: 'obtiendront' },
    cond: { je: 'obtiendrais', tu: 'obtiendrais', elle: 'obtiendrait', il: 'obtiendrait', on: 'obtiendrait', nous: 'obtiendrions', vous: 'obtiendriez', ils: 'obtiendraient' },
    condP: { je: 'aurais obtenu', tu: 'aurais obtenu', elle: 'aurait obtenu', il: 'aurait obtenu', on: 'aurait obtenu', nous: 'aurions obtenu', vous: 'auriez obtenu', ils: 'auraient obtenu' },
  },
  {
    inf: 'voir',
    obj: 'l\'impact concret de la solidarité urbaine',
    fut: { je: 'verrai', tu: 'verras', elle: 'verra', il: 'verra', on: 'verra', nous: 'verrons', vous: 'verrez', ils: 'verront' },
    cond: { je: 'verrais', tu: 'verrais', elle: 'verrait', il: 'verrait', on: 'verrait', nous: 'verrions', vous: 'verriez', ils: 'verraient' },
    condP: { je: 'aurais vu', tu: 'aurais vu', elle: 'aurait vu', il: 'aurait vu', on: 'aurait vu', nous: 'aurions vu', vous: 'auriez vu', ils: 'auraient vu' },
  },
] as const;

const SI_LEAD_INS = [
  'Dans un essai argumentatif,',
  'Dans une lettre ouverte,',
  'Lors d\'un discours sur l\'avenir,',
  'Dans un article d\'opinion,',
  'Dans un blogue étudiant,',
  'Lors de l\'exposé oral,',
  'Dans un éditorial scolaire,',
] as const;

function genSiClause(rng: SeededRng, idx: number): QuestionItem {
  const subj = SI_SUBJECTS[idx % SI_SUBJECTS.length];
  const verb = SI_RESULT_VERBS[Math.floor(idx / SI_SUBJECTS.length) % SI_RESULT_VERBS.length];
  const level = Math.floor(idx / (SI_SUBJECTS.length * SI_RESULT_VERBS.length)) % 3;
  const lead = SI_LEAD_INS[Math.floor(idx / (SI_SUBJECTS.length * SI_RESULT_VERBS.length * 3)) % SI_LEAD_INS.length];
  const topicIds = ['fr-T5', 'fr-T2', 'fr-T4', 'fr-T3', 'fr-T1'] as const;

  const conditionText = level === 0 ? subj.prot : level === 1 ? subj.imp : subj.pqp;
  const ans =
    level === 0
      ? verb.fut[subj.subj]
      : level === 1
      ? verb.cond[subj.subj]
      : verb.condP[subj.subj];
  const ruleName =
    level === 0
      ? 'Hypothèse réalisable : *Si + présent → futur simple*'
      : level === 1
      ? 'Hypothèse sur le présent : *Si + imparfait → conditionnel présent*'
      : 'Regret / hypothèse sur le passé : *Si + plus-que-parfait → conditionnel passé*';

  const mcq = buildMcqOptions(rng, ans, [
    level === 0 ? verb.cond[subj.subj] : verb.fut[subj.subj],
    level === 2 ? verb.cond[subj.subj] : verb.condP[subj.subj],
    verb.inf,
  ]);

  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: topicIds[idx % topicIds.length],
    subtopicCode: 'Critère A · Hypothèses (Si)',
    paper: 'Paper 1',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: level === 2 ? 'challenging' : 'standard',
    marks: 1,
    commandTerm: 'Choisissez',
    stemMarkdown: `${lead} complétez cette phrase hypothétique avec le verbe **${verb.inf}** : « *Si ${conditionText}, ${subj.subj} _____ ${verb.obj}.* »`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `**${ans}** (${ruleName})`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Identifier le temps de la proposition avec « si »', explanationMarkdown: ruleName },
      { stepNumber: 2, title: 'Former le temps correspondant dans la principale', explanationMarkdown: `Pour « ${subj.subj} », la forme exacte est **${ans}**.` },
    ],
    commonPitfalls: ['Utiliser le conditionnel directement après « si » (*Si j\'aurais...* — erreur grave en français).'],
    isDailyEligible: true,
  };
}

/* --------------------- 2B. ACCORD & PRONOMS COMPLÉMENTS (COD / COI / Y / EN) --------------------- */

const ACCORD_CONSTRUCTIONS = [
  { noun: 'la décision', pron: 'l\'', fem: 'prise', masc: 'pris', fpl: 'prises', mpl: 'pris', verb: 'prendre', aux: 'a' },
  { noun: 'les mesures', pron: 'les ', fem: 'adoptée', masc: 'adopté', fpl: 'adoptées', mpl: 'adoptés', verb: 'adopter', aux: 'a' },
  { noun: 'la lettre ouverte', pron: 'l\'', fem: 'écrite', masc: 'écrit', fpl: 'écrites', mpl: 'écrits', verb: 'écrire', aux: 'a' },
  { noun: 'les chansons', pron: 'les ', fem: 'découverte', masc: 'découvert', fpl: 'découvertes', mpl: 'découverts', verb: 'découvrir', aux: 'a' },
  { noun: 'le projet culturel', pron: 'l\'', fem: 'organisée', masc: 'organisé', fpl: 'organisées', mpl: 'organisés', verb: 'organiser', aux: 'a' },
  { noun: 'les reportages', pron: 'les ', fem: 'suivie', masc: 'suivi', fpl: 'suivies', mpl: 'suivis', verb: 'suivre', aux: 'a' },
  { noun: 'la proposition', pron: 'l\'', fem: 'défendue', masc: 'défendu', fpl: 'défendues', mpl: 'défendus', verb: 'défendre', aux: 'a' },
  { noun: 'les affiches', pron: 'les ', fem: 'créée', masc: 'créé', fpl: 'créées', mpl: 'créés', verb: 'créer', aux: 'a' },
  { noun: 'la brochure', pron: 'l\'', fem: 'publiée', masc: 'publié', fpl: 'publiées', mpl: 'publiés', verb: 'publier', aux: 'a' },
  { noun: 'les interviews', pron: 'les ', fem: 'menée', masc: 'mené', fpl: 'menées', mpl: 'menés', verb: 'mener', aux: 'a' },
] as const;

const ACCORD_AGENTS = [
  'la directrice',
  'le comité scolaire',
  'notre classe de français',
  'la journaliste',
  'l\'association étudiante',
  'mon correspondant',
  'la maire de Montréal',
  'l\'équipe écologique',
  'le rédacteur en chef',
  'le club de théâtre',
] as const;

const ACCORD_ADVERBS = [
  'avec beaucoup de soin',
  'pour le journal du lycée',
  'la semaine dernière',
  'sans la moindre hésitation',
  'durant le forum francophone',
  'après un long débat',
  'en vue de la conférence',
] as const;

function genCodAgreement(rng: SeededRng, idx: number): QuestionItem {
  const item = ACCORD_CONSTRUCTIONS[idx % ACCORD_CONSTRUCTIONS.length];
  const agent = ACCORD_AGENTS[Math.floor(idx / ACCORD_CONSTRUCTIONS.length) % ACCORD_AGENTS.length];
  const adv = ACCORD_ADVERBS[Math.floor(idx / (ACCORD_CONSTRUCTIONS.length * ACCORD_AGENTS.length)) % ACCORD_ADVERBS.length];
  const isFem = item.noun.startsWith('la ');
  const isPlur = item.noun.startsWith('les ');
  const ans = isPlur
    ? item.fpl
    : isFem
    ? item.fem
    : item.masc;
  const mcq = buildMcqOptions(rng, ans, [
    item.masc === ans ? item.fpl : item.masc,
    item.fem === ans ? item.mpl : item.fem,
    item.verb,
  ]);

  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: 'fr-GRAMMAR',
    subtopicCode: 'Critère A · Accord du participe passé',
    paper: 'Paper 2',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 1,
    commandTerm: 'Accordez',
    stemMarkdown: `Accordez correctement le participe passé (**${item.verb}**) : « *Voici ${item.noun} que ${agent} ${item.aux} _____ ${adv}.* »`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `**${ans}** — le COD (« ${item.noun} », remplacé par *que*) est placé devant l'auxiliaire *avoir*`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Repérer la place du COD avec l\'auxiliaire avoir', explanationMarkdown: `Le pronom relatif *que* reprend « ${item.noun} » et se trouve **avant** le verbe.` },
      { stepNumber: 2, title: 'Accorder en genre et en nombre', explanationMarkdown: `Le participe passé s'accorde avec « ${item.noun} » : **${ans}**.` },
    ],
    commonPitfalls: ['Laisser le participe passé invariable après *avoir* même lorsque le COD précède le verbe.'],
    isDailyEligible: true,
  };
}

/* --------------------- 3. CONJUNCTIONS, RELATIVES & FAUX AMIS --------------------- */

const RELATIVE_CONJUNCTION_ITEMS = [
  {
    prompt: 'Le festival francophone _____ nous avons assisté à Dakar a rassemblé trente artistes.',
    ans: 'auquel',
    wrong: ['que', 'dont', 'où'],
    rule: '*assister à* + chose $\\implies$ préposition *à* + *le festival* (masculin singulier) $=$ **auquel**',
  },
  {
    prompt: 'Les enjeux environnementaux _____ elle a parlé dans son discours concernent toute la planète.',
    ans: 'dont',
    wrong: ['que', 'qui', 'auxquels'],
    rule: '*parler de* quelque chose $\\implies$ pronom relatif **dont** remplace « de + antécédent »',
  },
  {
    prompt: 'Voici le roman québécois _____ a profondément marqué ma vision de l\'identité.',
    ans: 'qui',
    wrong: ['que', 'dont', 'lequel'],
    rule: 'Le pronom relatif est sujet du verbe *a marqué* $\\implies$ **qui**',
  },
  {
    prompt: 'L\'année _____ le lycée a lancé ce programme d\'échange reste mémorable.',
    ans: 'où',
    wrong: ['qui', 'dont', 'laquelle'],
    rule: '**où** exprime aussi bien le moment dans le temps que le lieu',
  },
  {
    prompt: 'Ce _____ les citoyens réclament avant tout, c\'est une transparence totale sur les données.',
    ans: 'que',
    wrong: ['qui', 'dont', 'quoi'],
    rule: '*réclamer quelque chose* (COD) après *ce* $\\implies$ **ce que**',
  },
  {
    prompt: '_____ les efforts de la municipalité, la pollution sonore demeure élevée.',
    ans: 'Malgré',
    wrong: ['Bien que', 'Quoique', 'À cause'],
    rule: '**Malgré** est suivi directement d\'un nom (*les efforts*), jamais d\'un verbe conjugué (contrairement à *bien que + subjonctif*)',
  },
  {
    prompt: '_____ son engagement bénévole, notre quartier dispose désormais d\'un jardin partagé.',
    ans: 'Grâce à',
    wrong: ['À cause de', 'Malgré', 'Pourtant'],
    rule: '**Grâce à** introduit une cause positive, tandis qu\'*à cause de* introduit une conséquence négative',
  },
  {
    prompt: 'Je te prête ce guide culturel _____ tu puisses préparer ton séjour à Genève.',
    ans: 'afin que',
    wrong: ['afin de', 'parce que', 'grâce à'],
    rule: 'Sujets différents (*je* vs *tu*) + subjonctif (*puisses*) $\\implies$ **afin que**',
  },
] as const;

const FAUX_AMIS = [
  { word: 'actuellement', trueMeaning: 'en ce moment / présentement (currently)', trap: 'actually (en fait)' },
  { word: 'assister à', trueMeaning: 'être présent à un événement (to attend)', trap: 'to assist / help (aider)' },
  { word: 'attendre', trueMeaning: 'patienter jusqu\'à l\'arrivée de quelqu\'un (to wait for)', trap: 'to attend (assister à)' },
  { word: 'blesser', trueMeaning: 'causer une douleur physique ou morale (to injure/hurt)', trap: 'to bless (bénir)' },
  { word: 'une librairie', trueMeaning: 'un magasin où l\'on achète des livres (bookshop)', trap: 'library (bibliothèque)' },
  { word: 'sensible', trueMeaning: 'qui réagit facilement aux émotions ou stimuli (sensitive)', trap: 'sensible/reasonable (raisonnable)' },
  { word: 'éventuellement', trueMeaning: 'peut-être / le cas échéant (possibly)', trap: 'eventually (finalement)' },
  { word: 'rester', trueMeaning: 'demeurer au même endroit (to stay)', trap: 'to rest (se reposer)' },
  { word: 'supporter', trueMeaning: 'tolérer / endurer quelque chose de difficile (to tolerate)', trap: 'to support morally/financially (soutenir)' },
  { word: 'prévenir', trueMeaning: 'avertir à l\'avance ou empêcher (to warn / prevent)', trap: 'uniquement to prevent without warning' },
] as const;

function genGrammarConnectivesOrFauxAmis(rng: SeededRng, idx: number): QuestionItem {
  if (idx % 2 === 0) {
    const item = RELATIVE_CONJUNCTION_ITEMS[(idx >> 1) % RELATIVE_CONJUNCTION_ITEMS.length];
    const framing = [
      'Complétez la phrase suivante avec la structure grammaticale correcte :',
      'Choisissez le pronom ou connecteur logique qui respecte la syntaxe IB French B SL :',
      'Sélectionnez le terme exact permettant de relier ces deux propositions :',
    ][Math.floor(idx / 16) % 3];
    const mcq = buildMcqOptions(rng, item.ans, [...item.wrong]);

    return {
      id: makeId('fr-gen', idx),
      subjectSlug: 'fr',
      topicId: 'fr-GRAMMAR',
      subtopicCode: 'Critère A · Syntaxe & Connecteurs',
      paper: 'Paper 2',
      questionType: 'mcq',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 1,
      commandTerm: 'Choisissez',
      stemMarkdown: `${framing} « *${item.prompt}* »`,
      options: mcq.options,
      correctOptionId: mcq.correctOptionId,
      markschemePoints: [{ pointId: 'A1', requirement: `**${item.ans}** — ${item.rule}`, marks: 1 }],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Identifier la fonction grammaticale', explanationMarkdown: item.rule },
        { stepNumber: 2, title: 'Valider l\'accord ou la préposition', explanationMarkdown: `La seule réponse syntaxiquement correcte est **${item.ans}**.` },
      ],
      commonPitfalls: ['Traduire mot à mot depuis l\'anglais (*malgré que* au lieu de *malgré + nom* ou *bien que + subjonctif*).'],
      isDailyEligible: true,
    };
  }

  const fa = FAUX_AMIS[(idx >> 1) % FAUX_AMIS.length];
  const themes = ['fr-T1', 'fr-T2', 'fr-T3', 'fr-T4', 'fr-T5'] as const;
  const mcq = buildMcqOptions(rng, fa.trueMeaning, [
    fa.trap,
    'organiser un événement officiel à l\'école',
    'refuser poliment une invitation formelle',
  ]);
  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: themes[idx % themes.length],
    subtopicCode: 'Lexique · Faux Amis',
    paper: 'Paper 2',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 1,
    commandTerm: 'Identifiez',
    stemMarkdown: `En français authentique, que signifie le mot ou l'expression **« ${fa.word} »** (attention aux faux amis) ?`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `${fa.trueMeaning}`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Repérer le piège du faux ami anglais', explanationMarkdown: `Le calque anglais courant (« ${fa.trap} ») est incorrect.` },
      { stepNumber: 2, title: 'Retenir le sens français exact', explanationMarkdown: `**${fa.word}** signifie *${fa.trueMeaning}*.` },
    ],
    commonPitfalls: [`Confondre « ${fa.word} » avec l'anglicisme « ${fa.trap} ».`],
    isDailyEligible: true,
  };
}

/* --------------------- 4. PAPER 2 READING COMPREHENSION PASSAGES --------------------- */

const READING_PASSAGES = [
  {
    topicId: 'fr-T1',
    sub: 'T1 · Identités',
    region: 'Montréal, Québec',
    text: `À Montréal, de nombreux jeunes issus de familles multiculturelles naviguent quotidiennement entre le français québécois, l'anglais et la langue d'origine de leurs parents. Loin de ressentir ce bilinguisme comme un obstacle, Nadia explique que changer de langue selon l'interlocuteur lui permet d'exprimer différentes facettes de son identité. Néanmoins, elle avoue que préserver les expressions locales dans un monde numérique dominé par l'anglais demande une vigilance constante.`,
    qa: [
      { q: 'Comment Nadia perçoit-elle son plurilinguisme au quotidien ?', ans: 'Comme une richesse qui lui permet d\'exprimer plusieurs facettes de son identité.', wrong: ['Comme une contrainte qui ralentit ses études.', 'Comme une obligation imposée uniquement par le lycée.', 'Comme une perte progressive de sa langue maternelle.'] },
      { q: 'Selon le texte, quel défi menace les expressions locales ?', ans: 'La prédominance de l\'anglais dans l\'espace numérique.', wrong: ['Le manque d\'intérêt des parents pour l\'éducation.', 'L\'absence de bibliothèques publiques à Montréal.', 'Le coût élevé des abonnements téléphoniques.'] },
      { q: 'Trouvez dans le texte le nom qui signifie « attention soutenue / prudence ».', ans: 'une vigilance', wrong: ['un obstacle', 'une facette', 'un interlocuteur'] },
    ],
  },
  {
    topicId: 'fr-T2',
    sub: 'T2 · Expériences',
    region: 'Dakar, Sénégal',
    text: `Lors de son séjour d'échange scolaire à Dakar, Lucas a découvert que l'hospitalité sénégalaise — appelée « teranga » — ne se limite pas à un accueil poli. Partager le repas autour d'un même plat favorise spontanément le dialogue entre générations. Au début, Lucas craignait que la barrière culturelle l'empêche de s'intégrer, mais sa participation aux projets communautaires du quartier a vite dissipé ses inquiétudes.`,
    qa: [
      { q: 'Que révèle la pratique de la « teranga » selon le texte ?', ans: 'Elle encourage naturellement l\'échange intergénérationnel au-delà de la simple politesse.', wrong: ['Elle impose des règles strictes réservées aux touristes étrangers.', 'Elle consiste à éviter les repas collectifs.', 'Elle vise à enseigner le français écrit uniquement.'] },
      { q: 'Qu\'est-ce qui a permis à Lucas de surmonter ses appréhensions initiales ?', ans: 'Son engagement actif dans des initiatives locales du quartier.', wrong: ['Un cours intensif de grammaire suivi à distance.', 'Son retour anticipé dans son pays d\'origine.', 'L\'achat d\'un dictionnaire bilingue.'] },
      { q: 'Quel mot du texte signifie « craintes / soucis » ?', ans: 'inquiétudes', wrong: ['échanges', 'coutumes', 'générations'] },
    ],
  },
  {
    topicId: 'fr-T3',
    sub: 'T3 · Ingéniosité humaine',
    region: 'Lyon, France',
    text: `Dans plusieurs lycées de la région lyonnaise, l'introduction de l'intelligence artificielle générative suscite des débats passionnés. Certains enseignants redoutent que les élèves délèguent leur réflexion personnelle aux algorithmes, tandis que d'autres y voient un tuteur disponible à toute heure pour vérifier la syntaxe et enrichir le lexique. Tous s'accordent cependant sur un point : l'outil ne saurait remplacer l'esprit critique humain.`,
    qa: [
      { q: 'Quelle crainte expriment certains professeurs face aux algorithmes ?', ans: 'Que les élèves confient leur réflexion personnelle à l\'outil au lieu de penser par eux-mêmes.', wrong: ['Que les ordinateurs consomment trop d\'électricité en classe.', 'Que les dictionnaires papier deviennent obligatoires.', 'Que la grammaire française disparaisse complètement.'] },
      { q: 'Sur quel principe tous les enseignants se rejoignent-ils ?', ans: 'La technologie ne peut pas se substituer au jugement critique de l\'élève.', wrong: ['Il faut interdire tout appareil numérique au lycée.', 'Les examens doivent être supprimés.', 'Seuls les professeurs de sciences doivent utiliser l\'IA.'] },
      { q: 'Dans le texte, que remplace le pronom « y » dans « d\'autres y voient un tuteur » ?', ans: 'l\'intelligence artificielle générative', wrong: ['la région lyonnaise', 'la syntaxe française', 'la réflexion personnelle'] },
    ],
  },
  {
    topicId: 'fr-T4',
    sub: 'T4 · Organisation sociale',
    region: 'Bruxelles, Belgique',
    text: `Face à l'isolement croissant des personnes âgées dans les grandes métropoles, une association bruxelloise a créé des logements intergénérationnels. En échange d'un loyer modéré, un étudiant consacre quelques heures par semaine à faire les courses ou à partager un moment convivial avec son voisin senior. Ce dispositif renforce la solidarité urbaine tout en soulageant la précarité financière des jeunes.`,
    qa: [
      { q: 'Quel double avantage offre ce programme bruxellois ?', ans: 'Il réduit la solitude des aînés et diminue les frais de logement des étudiants.', wrong: ['Il remplace les universités par des cours à domicile.', 'Il augmente les impôts municipaux pour financer des hôtels.', 'Il interdit aux étudiants de travailler à temps partiel.'] },
      { q: 'Quelle contrepartie l\'étudiant s\'engage-t-il à fournir ?', ans: 'Offrir quelques heures hebdomadaires d\'entraide et de compagnie.', wrong: ['Financer les réparations complètes de l\'immeuble.', 'Donner des cours d' + "'informatique rémunérés.", 'Quitter son emploi universitaire.'] },
    ],
  },
  {
    topicId: 'fr-T5',
    sub: 'T5 · Partage de la planète',
    region: 'Genève, Suisse romande',
    text: `À Genève, le transport public gratuit pour les moins de vingt-cinq ans vise à modifier durablement les habitudes de mobilité. Bien que le financement municipal de cette mesure ait d'abord été critiqué, les premiers bilans montrent une baisse sensible du trafic automobile aux heures de pointe. Les urbanistes soulignent toutefois que la gratuité doit s'accompagner d'horaires plus fréquents dans les communes périphériques.`,
    qa: [
      { q: 'Quel résultat concret a été observé après le lancement de la mesure ?', ans: 'Une diminution notable des voitures aux heures de pointe.', wrong: ['Une hausse immédiate des accidents de tramway.', 'L\'abandon complet des pistes cyclables.', 'Une augmentation du prix des billets pour les adultes.'] },
      { q: 'Quelle condition les urbanistes jugent-ils encore nécessaire ?', ans: 'Améliorer la fréquence des dessertes en banlieue.', wrong: ['Réduire le nombre de lignes de bus.', 'Limiter l\'accès aux seuls touristes.', 'Construire de nouvelles autoroutes urbaines.'] },
    ],
  },
] as const;

function genReadingComprehension(rng: SeededRng, idx: number): QuestionItem {
  const p = READING_PASSAGES[idx % READING_PASSAGES.length];
  const qa = p.qa[Math.floor(idx / READING_PASSAGES.length) % p.qa.length];
  const mcq = buildMcqOptions(rng, qa.ans, [...qa.wrong]);

  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: p.topicId,
    subtopicCode: p.sub,
    paper: 'Paper 2',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 1,
    commandTerm: 'Répondez',
    stimulusMarkdown: `**Extrait culturel (${p.region}) :** ${p.text}`,
    stemMarkdown: qa.q,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `Réponse exacte : ${qa.ans}`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Repérer l\'indice textuel pertinent', explanationMarkdown: `Relisez attentivement l'extrait de ${p.region} pour identifier l'idée explicite ou le synonyme demandé.` },
      { stepNumber: 2, title: 'Éliminer les distracteurs hors-texte', explanationMarkdown: `La proposition fidèle au passage est : « ${qa.ans} ».` },
    ],
    commonPitfalls: ['Choisir une affirmation plausible mais absente du texte ou qui en inverse la nuance.'],
    isDailyEligible: true,
  };
}

/* --------------------- 5. PAPER 1 TEXT-TYPE & REGISTER STUDIO --------------------- */

const TEXT_TYPES_SL = [
  {
    type: 'un courriel formel au proviseur',
    register: 'registre soutenu (vouvoiement)',
    open: 'Madame la Proviseure / Monsieur le Proviseur,',
    close: 'Je vous prie d\'agréer, Madame/Monsieur, l\'expression de mes salutations distinguées.',
    elements: 'objet précis, formules de politesse conventionnelles, paragraphes argumentatifs structurés',
  },
  {
    type: 'un article de presse scolaire',
    register: 'registre courant / journalistique',
    open: 'Titre accrocheur + chapeau résumant Qui/Quoi/Où/Quand',
    close: 'Ouverture ou citation conclusive marquante',
    elements: 'titre, sous-titre (chapeau), nom du journaliste, objectivité/exemples concrets',
  },
  {
    type: 'un billet de blogue personnel',
    register: 'registre courant à familier contrôlé',
    open: 'Titre engageant + adresse directe aux lecteurs (« Salut à tous ! »)',
    close: 'Question ouverte invitant les commentaires',
    elements: 'ton personnel engagé, date de publication, appel à l\'interaction',
  },
  {
    type: 'un discours devant le conseil municipal',
    register: 'registre soutenu / oratoire',
    open: '« Mesdames et Messieurs les élus, chers citoyens... »',
    close: 'Appel à l\'action solennel et remerciements (« Je vous remercie de votre attention. »)',
    elements: 'interpellation de l\'auditoire, anaphores rhétoriques, connecteurs logiques fermes',
  },
  {
    type: 'une brochure d\'information touristique ou écologique',
    register: 'registre courant clair et incitatif',
    open: 'Slogan d\'accroche + introduction informative',
    close: 'Coordonnées pratiques / encadré « Bon à savoir »',
    elements: 'intertitres, listes à puces concises, impératif ou présent incitatif',
  },
] as const;

const P1_SCENARIOS = [
  'proposer l\'installation de fontaines d\'eau et la suppression des bouteilles plastiques au lycée',
  'sensibiliser les jeunes à l\'équilibre entre vie numérique et santé mentale',
  'promouvoir un programme d\'échange culturel avec une école partenaire en Suisse romande',
  'débattre de l\'intégration éthique de l\'intelligence artificielle dans les devoirs scolaires',
  'encourager la création d\'un potager communautaire intergénérationnel dans votre ville',
  'présenter les retombées culturelles d\'un festival de cinéma francophone local',
] as const;

function genPaper1TextType(rng: SeededRng, idx: number): QuestionItem {
  const tt = TEXT_TYPES_SL[idx % TEXT_TYPES_SL.length];
  const scen = P1_SCENARIOS[Math.floor(idx / TEXT_TYPES_SL.length) % P1_SCENARIOS.length];
  const isPrompt = idx % 2 === 0;

  if (isPrompt) {
    return {
      id: makeId('fr-gen', idx),
      subjectSlug: 'fr',
      topicId: 'fr-P1-TEXTS',
      subtopicCode: 'Paper 1 · Critère C',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 6,
      commandTerm: 'Rédigez',
      stemMarkdown: `Pour ${scen}, vous décidez d'écrire **${tt.type}** (250–400 mots). Précisez le registre requis, les conventions formelles attendues (Critère C) et trois connecteurs logiques adaptés.`,
      markschemePoints: [
        { pointId: 'A1', requirement: `Registre et destinataire exacts : ${tt.register}`, marks: 2 },
        { pointId: 'A2', requirement: `Conventions obligatoires : ${tt.elements}`, marks: 2 },
        { pointId: 'A3', requirement: `Ouverture (« ${tt.open} ») et clôture appropriée (« ${tt.close} »)`, marks: 2 },
      ],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Fixer le registre et l\'énonciation (Critère C)', explanationMarkdown: `Adaptez pronoms et vocabulaire au format **${tt.type}** (${tt.register}).` },
        { stepNumber: 2, title: 'Intégrer la structure visuelle du type de texte', explanationMarkdown: `Incluez obligatoirement : ${tt.elements}.` },
      ],
      commonPitfalls: ['Oublier le titre/chapeau d\'un article ou passer du vouvoiement au tutoiement dans un texte formel.'],
      isDailyEligible: true,
    };
  }

  const mcq = buildMcqOptions(rng, tt.register, [
    'registre argotique très familier avec abréviations SMS',
    'style purement poétique en vers alexandrins',
    'jargon juridique exclusivement passif sans destinataire',
  ]);
  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: 'fr-P1-TEXTS',
    subtopicCode: 'Paper 1 · Critère C',
    paper: 'Paper 1',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 1,
    commandTerm: 'Identifiez',
    stemMarkdown: `Vous devez rédiger **${tt.type}** afin de ${scen}. Quel registre de langue convient le mieux selon le Critère C de l'IB ?`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `${tt.register}`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Analyser le contexte et l\'interlocuteur', explanationMarkdown: `L'objectif et le destinataire imposent le **${tt.register}**.` },
      { stepNumber: 2, title: 'Vérifier les conventions de format', explanationMarkdown: `Pensez également aux marqueurs structurels : ${tt.elements}.` },
    ],
    commonPitfalls: ['Choisir un registre familier devant une autorité institutionnelle ou dans un discours public.'],
    isDailyEligible: true,
  };
}

/* --------------------- 6. PASSÉ COMPOSÉ VS IMPARFAIT ENGINE --------------------- */

const PAST_CONTRASTS = [
  {
    bg: 'Il faisait beau à Nice',
    eventVerb: 'commencer',
    pc3: 'a commencé',
    imp3: 'commençait',
    fut3: 'commencera',
    tail: 'à pleuvoir soudainement.',
  },
  {
    bg: 'Nous préparions notre exposé',
    eventVerb: 'couper',
    pc3: 'a coupé',
    imp3: 'coupait',
    fut3: 'coupera',
    tail: 'l\'électricité dans tout le quartier.',
    subjPrefix: 'quand l\'orage ',
  },
  {
    bg: 'Pendant que Marie lisait son journal',
    eventVerb: 'arriver',
    pc3: 'est arrivée',
    imp3: 'arrivait',
    fut3: 'arrivera',
    tail: 'à la gare avec dix minutes d\'avance.',
    subjPrefix: 'son amie ',
  },
  {
    bg: 'Les bénévoles nettoyaient la plage',
    eventVerb: 'trouver',
    pc3: 'ont trouvé',
    imp3: 'trouvaient',
    fut3: 'trouveront',
    tail: 'une tortue blessée près des rochers.',
    subjPrefix: 'lorsqu\'ils ',
  },
  {
    bg: 'Chaque été, mon grand-père cultivait des tomates',
    eventVerb: 'décider',
    pc3: 'a décidé',
    imp3: 'décidait',
    fut3: 'décidera',
    tail: 'enfin d\'installer un système d\'arrosage écologique.',
    subjPrefix: 'mais en 2024 il ',
  },
] as const;

function genPasseComposeImparfait(rng: SeededRng, idx: number): QuestionItem {
  const c = PAST_CONTRASTS[idx % PAST_CONTRASTS.length];
  const prefix = 'subjPrefix' in c ? c.subjPrefix : 'quand il ';
  const mcq = buildMcqOptions(rng, c.pc3, [c.imp3, c.fut3, c.eventVerb]);
  const themes = ['fr-T2', 'fr-T1', 'fr-T5', 'fr-GRAMMAR'] as const;

  return {
    id: makeId('fr-gen', idx),
    subjectSlug: 'fr',
    topicId: themes[idx % themes.length],
    subtopicCode: 'Critère A · Temps du passé',
    paper: 'Paper 2',
    questionType: 'mcq',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 1,
    commandTerm: 'Complétez',
    stemMarkdown: `Complétez au temps du passé approprié (**${c.eventVerb}**) : « *${c.bg}, ${prefix}_____ ${c.tail}* »`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `**${c.pc3}** (action ponctuelle qui interrompt une situation d'arrière-plan à l'imparfait)`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Distinguer arrière-plan et événement ponctuel', explanationMarkdown: `L'action de premier plan soudaine/achevée requiert le **passé composé** (**${c.pc3}**).` },
      { stepNumber: 2, title: 'Vérifier l\'auxiliaire et l\'accord', explanationMarkdown: `La forme exacte est **${c.pc3}**.` },
    ],
    commonPitfalls: ['Utiliser l\'imparfait pour un événement ponctuel daté ou soudain.'],
    isDailyEligible: true,
  };
}

const FR_WEIGHTED_FAMILIES: ReadonlyArray<{ fn: FrFamilyFn; weight: number }> = [
  { fn: genSubjunctiveOrIndicative, weight: 160 },
  { fn: genSiClause, weight: 32 },
  { fn: genCodAgreement, weight: 18 },
  { fn: genGrammarConnectivesOrFauxAmis, weight: 1 },
  { fn: genReadingComprehension, weight: 1 },
  { fn: genPaper1TextType, weight: 1 },
  { fn: genPasseComposeImparfait, weight: 1 },
];

export function generateFrenchQuestions(
  targetCount: number,
  seed = 412031
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const idxOffset = (seed % 7919) * 1009;
  const items: QuestionItem[] = [];
  const pool: FrFamilyFn[] = [];
  for (const entry of FR_WEIGHTED_FAMILIES) {
    for (let k = 0; k < entry.weight; k++) pool.push(entry.fn);
  }
  for (let i = 0; i < targetCount; i++) {
    const fn = pool[i % pool.length];
    items.push(fn(rng, i + 1 + idxOffset));
  }
  return items;
}
