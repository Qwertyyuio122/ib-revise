import type { QuestionItem } from '../../../src/content/schemas';
import {
  SeededRng,
  buildMcqOptions,
  makeId,
  roundSigFigs,
} from './utils';

type BioFamilyFn = (rng: SeededRng, idx: number) => QuestionItem;

const CODON_TABLE: Record<string, string> = {
  AUG: 'Met', UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  CUU: 'Leu', CUC: 'Leu', AUU: 'Ile', AUC: 'Ile', GUU: 'Val',
  GUC: 'Val', UCU: 'Ser', UCC: 'Ser', CCU: 'Pro', CCC: 'Pro',
  ACU: 'Thr', ACC: 'Thr', GCU: 'Ala', GCC: 'Ala', UAU: 'Tyr',
  UAC: 'Tyr', CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys', GAU: 'Asp',
  GAC: 'Asp', GAA: 'Glu', GAG: 'Glu', UGU: 'Cys', UGC: 'Cys',
  UGG: 'Trp', CGU: 'Arg', CGC: 'Arg', GGU: 'Gly', GGC: 'Gly',
  UAA: 'STOP', UAG: 'STOP', UGA: 'STOP',
};

const COMPLEMENT_DNA_TO_MRNA: Record<string, string> = {
  A: 'U',
  T: 'A',
  C: 'G',
  G: 'C',
};

/* --------------------- 1. MAGNIFICATION & MICROSCOPY (A2.2) --------------------- */

function genMagnificationScale(rng: SeededRng, idx: number): QuestionItem {
  const structures = [
    { name: 'chloroplast in a palisade mesophyll cell', actualUm: rng.int(40, 95) / 10, topicId: 'bio-C1.3', sub: 'C1.3' },
    { name: 'mitochondrion in cardiac muscle tissue', actualUm: rng.int(15, 48) / 10, topicId: 'bio-C1.2', sub: 'C1.2' },
    { name: 'prokaryotic *Escherichia coli* bacillus', actualUm: rng.int(18, 42) / 10, topicId: 'bio-B2.1', sub: 'A2.2' },
    { name: 'human erythrocyte (red blood cell)', actualUm: rng.int(65, 85) / 10, topicId: 'bio-B2.1', sub: 'B2.3' },
    { name: 'eukaryotic nucleus in root meristem', actualUm: rng.int(55, 115) / 10, topicId: 'bio-D1.1', sub: 'B2.2' },
    { name: 'starch amyloplast in a potato tuber cell', actualUm: rng.int(80, 180) / 10, topicId: 'bio-A1.1', sub: 'B1.1' },
  ] as const;

  const st = structures[idx % structures.length];
  const mag = rng.pick([1500, 2000, 2500, 3000, 4000, 5000, 7500, 8000, 10000, 12000]);
  const imageMm = (st.actualUm * mag) / 1000;
  const askActual = idx % 2 === 0;

  if (askActual) {
    return {
      id: makeId('bio-gen', idx),
      subjectSlug: 'bio',
      topicId: st.topicId,
      subtopicCode: st.sub,
      paper: 'Paper 1B',
      questionType: 'data_based',
      calculatorPolicy: 'allowed',
      difficulty: 'foundation',
      marks: 3,
      commandTerm: 'Calculate',
      stemMarkdown: `An electron micrograph of a ${st.name} shows the organelle measuring $${imageMm.toFixed(1)}\\text{ mm}$ across at a magnification of $\\times ${mag}$. Calculate its actual length in micrometres ($\\mu\\text{m}$) to $3$ significant figures.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Converts image size to $\\mu\\text{m}$: $${imageMm.toFixed(1)}\\text{ mm} = ${(imageMm * 1000).toFixed(0)}\\,\\mu\\text{m}$`,
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement: `Applies $A = \\frac{I}{M} = \\frac{${(imageMm * 1000).toFixed(0)}}{${mag}}$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `Actual size $= ${roundSigFigs(st.actualUm, 3)}\\,\\mu\\text{m}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Convert mm to $\\mu$m ($\\times 1000$)',
          explanationMarkdown: `$${imageMm.toFixed(1)}\\text{ mm} \\times 1000 = ${(imageMm * 1000).toFixed(0)}\\,\\mu\\text{m}$.`,
        },
        {
          stepNumber: 2,
          title: 'Divide image size by magnification ($M = I/A$)',
          explanationMarkdown: `$A = \\frac{${(imageMm * 1000).toFixed(0)}}{${mag}} = ${roundSigFigs(st.actualUm, 3)}\\,\\mu\\text{m}$.`,
        },
      ],
      commonPitfalls: ['Dividing by $100$ instead of $1000$ when converting $\\text{mm}$ to $\\mu\\text{m}$.'],
      isDailyEligible: true,
    };
  }

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: st.topicId,
    subtopicCode: st.sub,
    paper: 'Paper 1B',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `A ${st.name} has an actual diameter of $${st.actualUm.toFixed(1)}\\,\\mu\\text{m}$ and appears $${imageMm.toFixed(1)}\\text{ mm}$ wide in a micrograph print. Calculate the linear magnification of the micrograph.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Converts $${imageMm.toFixed(1)}\\text{ mm}$ to $${(imageMm * 1000).toFixed(0)}\\,\\mu\\text{m}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Applies $M = \\frac{I}{A} = \\frac{${(imageMm * 1000).toFixed(0)}}{${st.actualUm.toFixed(1)}}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Magnification $\\times ${mag}$ (dimensionless)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Match units ($1\\text{ mm} = 1000\\,\\mu\\text{m}$)',
        explanationMarkdown: `$I = ${(imageMm * 1000).toFixed(0)}\\,\\mu\\text{m}$, $A = ${st.actualUm.toFixed(1)}\\,\\mu\\text{m}$.`,
      },
      {
        stepNumber: 2,
        title: 'Compute magnification ratio $I / A$',
        explanationMarkdown: `$M = \\frac{${(imageMm * 1000).toFixed(0)}}{${st.actualUm.toFixed(1)}} = \\times ${mag}$.`,
      },
    ],
    commonPitfalls: ['Writing units such as $\\mu\\text{m}$ after a magnification value.'],
    isDailyEligible: true,
  };
}

/* --------------------- 2. WATER POTENTIAL & OSMOSIS (D2.3 / B2.1) --------------------- */

function genWaterPotential(rng: SeededRng, idx: number): QuestionItem {
  const tissues = ['potato tuber parenchyma', 'carrot taproot cylinder', 'onion epidermal strip', 'elodea leaf mesophyll', 'beetroot storage tissue'] as const;
  const tissue = tissues[idx % tissues.length];
  const psiS = -rng.int(350, 980);
  const psiP = rng.int(100, Math.abs(psiS) - 80);
  const cellPsi = psiS + psiP;
  const bathPsi = -rng.int(120, 900);
  const netIntoCell = bathPsi > cellPsi;
  const eqPsi = Math.abs(bathPsi - cellPsi) < 15 ? bathPsi - 120 : bathPsi;
  const finalNetInto = eqPsi > cellPsi;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-B2.1',
    subtopicCode: 'D2.3',
    paper: 'Paper 2',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Determine',
    stemMarkdown: `Cells of ${tissue} have an internal solute potential $\\Psi_s = ${psiS}\\text{ kPa}$ and pressure potential $\\Psi_p = +${psiP}\\text{ kPa}$. The tissue is immersed in an open sucrose bathing solution with water potential $\\Psi_{\\text{bath}} = ${eqPsi}\\text{ kPa}$. Calculate the cell's initial water potential $\\Psi$ and determine the direction of net water movement by osmosis.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Applies $\\Psi = \\Psi_s + \\Psi_p = ${psiS} + ${psiP}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Cell water potential $\\Psi_{\\text{cell}} = ${cellPsi}\\text{ kPa}$`,
        marks: 1,
      },
      {
        pointId: 'R1',
        requirement: `Compares $\\Psi_{\\text{bath}} = ${eqPsi}\\text{ kPa}$ vs $\\Psi_{\\text{cell}} = ${cellPsi}\\text{ kPa}$ (water moves from higher/less negative to lower/more negative $\\Psi$)`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: finalNetInto
          ? `Net water moves **into the cells** (cells become more turgid)`
          : `Net water moves **out of the cells** into the bath (incipient plasmolysis / mass loss)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Calculate $\\Psi_{\\text{cell}} = \\Psi_s + \\Psi_p$',
        explanationMarkdown: `$\\Psi_{\\text{cell}} = ${psiS} + ${psiP} = ${cellPsi}\\text{ kPa}$.`,
      },
      {
        stepNumber: 2,
        title: 'Compare water potentials',
        explanationMarkdown: `Water moves passively down a water potential gradient (from less negative to more negative): since $${finalNetInto ? `${eqPsi} > ${cellPsi}` : `${cellPsi} > ${eqPsi}`}$, net movement is **${finalNetInto ? 'into' : 'out of'}** the cells.`,
      },
    ],
    commonPitfalls: [
      'Treating $-600\\text{ kPa}$ as higher water potential than $-300\\text{ kPa}$ (confusing magnitude with signed value).',
      'Subtracting $\\Psi_p$ instead of adding $\\Psi_s + \\Psi_p$.',
    ],
    isDailyEligible: true,
  };
}

/* --------------------- 3. HARDY-WEINBERG POPULATIONS (D4.1) --------------------- */

function genHardyWeinberg(rng: SeededRng, idx: number): QuestionItem {
  const traits = [
    { organism: 'meadow clover (*Trifolium repens*)', trait: 'cyanide-free leaves', sym: 'q' },
    { organism: 'peppered moths (*Biston betularia*)', trait: 'typica pale morph', sym: 'q' },
    { organism: 'Pacific rock pocket mice', trait: 'light sandy coat', sym: 'q' },
    { organism: 'land snails (*Cepaea nemoralis*)', trait: 'unbanded shell', sym: 'q' },
    { organism: 'human carrier screening cohort', trait: 'autosomal recessive condition', sym: 'q' },
  ] as const;
  const tr = traits[idx % traits.length];
  const popN = rng.pick([400, 500, 800, 1000, 1200, 1500, 2000, 2500]);
  const q = Number((rng.int(12, 68) / 100).toFixed(2));
  const p = Number((1 - q).toFixed(2));
  const recCount = Math.round(q * q * popN);
  const trueQ2 = recCount / popN;
  const trueQ = Math.sqrt(trueQ2);
  const trueP = 1 - trueQ;
  const hetFreq = 2 * trueP * trueQ;
  const expHet = hetFreq * popN;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-D1.2',
    subtopicCode: 'D4.1',
    paper: 'Paper 2',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `In a population of $${popN}$ ${tr.organism} in Hardy–Weinberg equilibrium, $${recCount}$ individuals display the homozygous recessive phenotype (${tr.trait}). Calculate (a) the recessive allele frequency $q$, and (b) the expected number of heterozygous carriers in this population (to the nearest whole number).`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Computes $q^2 = \\frac{${recCount}}{${popN}} = ${trueQ2.toFixed(4)}$ and takes square root`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `$q \\approx ${roundSigFigs(trueQ, 3)}$ and $p = 1 - q \\approx ${roundSigFigs(trueP, 3)}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Heterozygote frequency $2pq = 2(${trueP.toFixed(3)})(${trueQ.toFixed(3)}) = ${hetFreq.toFixed(3)}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Expected heterozygotes $= ${hetFreq.toFixed(3)} \\times ${popN} \\approx ${Math.round(expHet)}$ individuals`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Extract $q$ from recessive phenotype frequency $q^2$',
        explanationMarkdown: `$q = \\sqrt{\\frac{${recCount}}{${popN}}} \\approx ${roundSigFigs(trueQ, 3)}$, so $p = 1 - q \\approx ${roundSigFigs(trueP, 3)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Compute $2pq \\times N$ for heterozygotes',
        explanationMarkdown: `$2pq = ${hetFreq.toFixed(3)}$, giving approximately $${Math.round(expHet)}$ heterozygotes.`,
      },
    ],
    commonPitfalls: [
      'Setting $q = \\frac{\\text{recessive count}}{N}$ instead of taking $\\sqrt{q^2}$.',
      'Omitting the factor of $2$ in $2pq$.',
    ],
    isDailyEligible: true,
  };
}

/* --------------------- 4. SIMPSON'S RECIPROCAL INDEX (A4.2 / C4.1) --------------------- */

function genSimpsonIndex(rng: SeededRng, idx: number): QuestionItem {
  const habitats = [
    { name: 'temperate oak woodland', sp: ['Quercus robur', 'Fagus sylvatica', 'Betula pendula', 'Acer campestre'] },
    { name: 'rocky intertidal shore', sp: ['Patella vulgata', 'Semibalanus balanoides', 'Littorina littorea', 'Mytilus edulis'] },
    { name: 'alpine wildflower meadow', sp: ['Gentiana verna', 'Trifolium alpinum', 'Primula farinosa', 'Carex curvula'] },
    { name: 'tropical mangrove fringe', sp: ['Rhizophora mangle', 'Avicennia germinans', 'Laguncularia racemosa', 'Conocarpus erectus'] },
  ] as const;
  const h = habitats[idx % habitats.length];
  const counts = [rng.int(8, 28), rng.int(6, 24), rng.int(4, 20), rng.int(3, 18)];
  const N = counts.reduce((a, b) => a + b, 0);
  const sumN = counts.reduce((s, n) => s + n * (n - 1), 0);
  const D = (N * (N - 1)) / sumN;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-A1.1',
    subtopicCode: 'A4.2',
    paper: 'Paper 1B',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `An ecological quadrat survey in a ${h.name} recorded the following individual counts: *${h.sp[0]}* ($n=${counts[0]}$), *${h.sp[1]}* ($n=${counts[1]}$), *${h.sp[2]}* ($n=${counts[2]}$), and *${h.sp[3]}* ($n=${counts[3]}$). Calculate Simpson's reciprocal index $D = \\frac{N(N-1)}{\\sum n(n-1)}$ to $3$ significant figures, and explain what a higher $D$ indicates.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Computes total individuals $N = ${N}$`, marks: 1 },
      { pointId: 'M2', requirement: `Computes $\\sum n(n-1) = ${counts.map((c) => `${c}(${c - 1})`).join(' + ')} = ${sumN}$`, marks: 1 },
      { pointId: 'A1', requirement: `$D = \\frac{${N}(${N - 1})}{${sumN}} = ${roundSigFigs(D, 3)}$`, marks: 1 },
      { pointId: 'R1', requirement: `Higher $D$ indicates greater species richness and evenness (higher biodiversity / ecosystem resilience)`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Sum $N$ and $\\sum n(n-1)$', explanationMarkdown: `$N = ${N}$, $N(N-1) = ${N * (N - 1)}$, and $\\sum n(n-1) = ${sumN}$.` },
      { stepNumber: 2, title: 'Divide and interpret biodiversity', explanationMarkdown: `$D = ${roundSigFigs(D, 3)}$. Higher $D$ reflects both high species richness and even abundance distribution.` },
    ],
    commonPitfalls: ['Squaring $n$ instead of computing $n(n-1)$, or confusing richness with evenness.'],
    isDailyEligible: true,
  };
}

/* --------------------- 5. LINCOLN INDEX CAPTURE-MARK-RECAPTURE (C4.1) --------------------- */

function genLincolnIndex(rng: SeededRng, idx: number): QuestionItem {
  const organisms = ['ground beetles (*Carabus*)', 'freshwater crayfish', 'meadow voles', 'intertidal dogwhelks', 'pond snails'] as const;
  const org = organisms[idx % organisms.length];
  const n1 = rng.int(24, 95);
  const n2 = rng.int(22, 88);
  const n3 = rng.int(6, Math.min(24, n1 - 2, n2 - 2));
  const estN = (n1 * n2) / n3;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-C1.2',
    subtopicCode: 'C4.1',
    paper: 'Paper 1B',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 4,
    commandTerm: 'Estimate',
    stemMarkdown: `Biologists estimated a population of ${org} using capture–mark–recapture. In sample 1, $n_1 = ${n1}$ individuals were captured, marked harmlessly, and released. One week later, sample 2 captured $n_2 = ${n2}$ individuals, of which $n_3 = ${n3}$ bore marks. Estimate total population size $N$ using the Lincoln index, and state two assumptions required for validity.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Applies $N = \\frac{n_1 \\times n_2}{n_3} = \\frac{${n1} \\times ${n2}}{${n3}}$`, marks: 1 },
      { pointId: 'A1', requirement: `$N \\approx ${Math.round(estN)}$ individuals`, marks: 1 },
      { pointId: 'R1', requirement: `Any two valid assumptions: closed population (no migration/births/deaths), marks do not wash off or increase predation, random mixing between samples`, marks: 2 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Substitute into Lincoln index formula', explanationMarkdown: `$N = \\frac{${n1} \\times ${n2}}{${n3}} = ${estN.toFixed(1)} \\approx ${Math.round(estN)}$.` },
      { stepNumber: 2, title: 'Evaluate ecological assumptions', explanationMarkdown: `Requires closed population, non-harmful persistent marks, and thorough random remixing.` },
    ],
    commonPitfalls: ['Dividing by $n_2$ instead of the recaptured marked count $n_3$.'],
    isDailyEligible: true,
  };
}

/* --------------------- 6. CHI-SQUARED GENETICS TEST (D3.2) --------------------- */

function genChiSquaredGenetics(rng: SeededRng, idx: number): QuestionItem {
  // 9:3:3:1 dihybrid ratio in pea/maize/Drosophila
  const total = rng.pick([160, 240, 320, 400, 480, 640]);
  const e1 = (9 / 16) * total;
  const e2 = (3 / 16) * total;
  const e3 = (3 / 16) * total;
  const e4 = (1 / 16) * total;
  const linked = idx % 2 === 1;
  const d1 = linked ? Math.round(total * 0.12) : rng.int(-4, 4);
  const d2 = linked ? -Math.round(total * 0.12) : rng.int(-3, 3);
  const obs1 = Math.round(e1 + d1);
  const obs2 = Math.round(e2 + d2);
  const obs3 = Math.round(e3 + d2);
  const obs4 = total - obs1 - obs2 - obs3;

  const chi2 =
    Math.pow(obs1 - e1, 2) / e1 +
    Math.pow(obs2 - e2, 2) / e2 +
    Math.pow(obs3 - e3, 2) / e3 +
    Math.pow(obs4 - e4, 2) / e4;
  const crit = 7.815;
  const rejectH0 = chi2 > crit;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-D1.2',
    subtopicCode: 'D3.2',
    paper: 'Paper 2',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Deduce',
    stemMarkdown: `A dihybrid cross predicts a $9:3:3:1$ phenotypic ratio among $N = ${total}$ offspring. Observed counts across the four phenotypes were $${obs1}, ${obs2}, ${obs3}, ${obs4}$. Calculate the $\\chi^2$ statistic, state the degrees of freedom, and deduce at $p = 0.05$ (critical value $= 7.815$) whether the genes assort independently.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Expected counts under $9:3:3:1$: $${e1}, ${e2}, ${e3}, ${e4}$`, marks: 1 },
      { pointId: 'M2', requirement: `Computes $\\chi^2 = \\sum \\frac{(O - E)^2}{E} \\approx ${chi2.toFixed(2)}$`, marks: 2 },
      { pointId: 'A1', requirement: `States degrees of freedom $df = 4 - 1 = 3$`, marks: 1 },
      {
        pointId: 'R1',
        requirement: rejectH0
          ? `$\\chi^2 = ${chi2.toFixed(2)} > 7.815 \\implies$ reject $H_0$; genes do **not** assort independently (evidence of autosomal linkage)`
          : `$\\chi^2 = ${chi2.toFixed(2)} \\le 7.815 \\implies$ fail to reject $H_0$; deviations are consistent with independent assortment`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Compute expected frequencies and $\\chi^2$', explanationMarkdown: `Multiply $${total}$ by $\\frac{9}{16}, \\frac{3}{16}, \\frac{3}{16}, \\frac{1}{16}$ to get $E = [${e1}, ${e2}, ${e3}, ${e4}]$, yielding $\\chi^2 = ${chi2.toFixed(2)}$.` },
      { stepNumber: 2, title: 'Compare against critical value at $df = 3, p = 0.05$', explanationMarkdown: `Since $${chi2.toFixed(2)} ${rejectH0 ? '>' : '\\le'} 7.815$, ${rejectH0 ? 'reject $H_0$ (likely autosomal linkage)' : 'do not reject $H_0$ (independent assortment supported)'}.` },
    ],
    commonPitfalls: ['Dividing $(O - E)^2$ by observed $O$ instead of expected $E$, or using $df = 4$ instead of $4 - 1 = 3$.'],
    isDailyEligible: true,
  };
}

/* --------------------- 7. MITOTIC INDEX (D2.1) --------------------- */

function genMitoticIndex(rng: SeededRng, idx: number): QuestionItem {
  const tissues = ['onion (*Allium cepa*) root apical meristem', 'garlic (*Allium sativum*) root tip', 'zebrafish blastula epithelium', 'mammalian intestinal crypt'] as const;
  const tissue = tissues[idx % tissues.length];
  const pro = rng.int(14, 34);
  const meta = rng.int(6, 18);
  const ana = rng.int(4, 14);
  const telo = rng.int(5, 16);
  const inter = rng.int(180, 420);
  const mitoticSum = pro + meta + ana + telo;
  const total = mitoticSum + inter;
  const miPct = (mitoticSum / total) * 100;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-D1.1',
    subtopicCode: 'D2.1',
    paper: 'Paper 1B',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `A light micrograph field of ${tissue} contains $${inter}$ cells in interphase, $${pro}$ in prophase, $${meta}$ in metaphase, $${ana}$ in anaphase, and $${telo}$ in telophase. Calculate the mitotic index as a percentage to $3$ significant figures.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Sums mitotic cells $= ${pro} + ${meta} + ${ana} + ${telo} = ${mitoticSum}$ and total cells $= ${total}$`, marks: 1 },
      { pointId: 'M2', requirement: `Mitotic index $= \\frac{${mitoticSum}}{${total}} \\times 100\\%$`, marks: 1 },
      { pointId: 'A1', requirement: `${roundSigFigs(miPct, 3)}\\%`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Separate mitotic stages from interphase', explanationMarkdown: `Mitotic cells $= ${mitoticSum}$; total observed cells $= ${total}$.` },
      { stepNumber: 2, title: 'Compute percentage', explanationMarkdown: `$\\frac{${mitoticSum}}{${total}} \\times 100\\% = ${roundSigFigs(miPct, 3)}\\%$.` },
    ],
    commonPitfalls: ['Including interphase inside the mitotic numerator or dividing by interphase count instead of total cells.'],
    isDailyEligible: true,
  };
}

/* --------------------- 8. DNA TRANSCRIPTION, TRANSLATION & MUTATIONS (D1.2 / D1.3) --------------------- */

function genDnaTranslationMutation(rng: SeededRng, idx: number): QuestionItem {
  const senseCodons = ['ATG', 'TTT', 'GCT', 'AAG', 'GGC', 'CAC', 'TAT', 'TGG', 'CTG', 'AAC'] as const;
  const c1 = 'ATG'; // start
  const c2 = rng.pick(senseCodons.slice(1));
  const c3 = rng.pick(senseCodons.slice(1));
  const c4 = rng.pick(['TAA', 'TAG', 'TGA'] as const);
  const codingStrand = `${c1}-${c2}-${c3}-${c4}`;
  const complementMap: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
  const template3to5 = codingStrand
    .replace(/-/g, '')
    .split('')
    .map((b) => complementMap[b])
    .join('');
  const mRnaCodons = [c1, c2, c3, c4].map((c) => c.replace(/T/g, 'U'));
  const aa2 = CODON_TABLE[mRnaCodons[1]] ?? 'AminoAcid';
  const aa3 = CODON_TABLE[mRnaCodons[2]] ?? 'AminoAcid';

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-D1.2',
    subtopicCode: 'D1.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Deduce',
    stemMarkdown: `A short section of the **antisense (template) DNA strand** ($3' \\to 5'$) reads \`3'-${template3to5}-5'\`. Deduce (a) the transcribed $5' \\to 3'$ mRNA sequence, (b) the tRNA anticodon complementary to the second mRNA codon, and (c) how many amino acids are encoded before termination.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Pairs $A\\to U, T\\to A, C\\to G, G\\to C$ in $5' \\to 3'$ orientation`, marks: 1 },
      { pointId: 'A1', requirement: `mRNA: \`5'-${mRnaCodons.join('')}-3'\``, marks: 1 },
      { pointId: 'A2', requirement: `Second codon \`${mRnaCodons[1]}\` (${aa2}) pairs with tRNA anticodon \`3'-${mRnaCodons[1].split('').map((b) => (b === 'A' ? 'U' : b === 'U' ? 'A' : b === 'C' ? 'G' : 'C')).join('')}-5'\``, marks: 1 },
      { pointId: 'A3', requirement: `Encodes **3 amino acids** (Met–${aa2}–${aa3}); \`${mRnaCodons[3]}\` is a stop codon`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Transcribe template DNA ($3\' \\to 5\'$) into mRNA ($5\' \\to 3\'$)', explanationMarkdown: `Use uracil ($U$) instead of thymine ($T$): \`5'-${mRnaCodons.join(' ')}-3'\`.` },
      { stepNumber: 2, title: 'Identify stop codon and count amino acids', explanationMarkdown: `\`${mRnaCodons[3]}\` signals translation termination without adding an amino acid, leaving $3$ amino acids.` },
    ],
    commonPitfalls: ['Inserting thymine ($T$) into RNA instead of uracil ($U$), or counting the stop codon as a fourth amino acid.'],
    isDailyEligible: true,
  };
}

/* --------------------- 9. ENZYME KINETICS, NPP/TROPHIC & SA:V --------------------- */

function genEnzymeAndBioenergetics(rng: SeededRng, idx: number): QuestionItem {
  if (idx % 2 === 0) {
    // NPP = GPP - R and trophic transfer
    const gpp = rng.int(18, 65) * 100;
    const respPct = rng.int(42, 62);
    const resp = Math.round((gpp * respPct) / 100);
    const npp = gpp - resp;
    const effPct = rng.pick([8, 10, 12, 14]);
    const primConsumer = (npp * effPct) / 100;

    return {
      id: makeId('bio-gen', idx),
      subjectSlug: 'bio',
      topicId: 'bio-C1.3',
      subtopicCode: 'C4.2',
      paper: 'Paper 2',
      questionType: 'data_based',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Calculate',
      stemMarkdown: `In a grassland ecosystem, gross primary productivity (GPP) is $${gpp}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$, and producer cellular respiration ($R$) consumes $${resp}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$. Calculate (a) net primary productivity (NPP), and (b) the energy assimilated by primary consumers if ecological transfer efficiency is $${effPct}\\%$.`,
      markschemePoints: [
        { pointId: 'M1', requirement: `Applies $\\text{NPP} = \\text{GPP} - R = ${gpp} - ${resp}$`, marks: 1 },
        { pointId: 'A1', requirement: `$\\text{NPP} = ${npp}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$`, marks: 1 },
        { pointId: 'M2', requirement: `Multiplies $\\text{NPP} \\times ${effPct / 100}$`, marks: 1 },
        { pointId: 'A2', requirement: `Primary consumer energy $= ${roundSigFigs(primConsumer, 3)}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$`, marks: 1 },
      ],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Subtract respiratory heat loss from GPP', explanationMarkdown: `$\\text{NPP} = ${gpp} - ${resp} = ${npp}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$.` },
        { stepNumber: 2, title: 'Apply trophic transfer efficiency', explanationMarkdown: `$${npp} \\times 0.${effPct < 10 ? `0${effPct}` : effPct} = ${roundSigFigs(primConsumer, 3)}\\text{ kJ m}^{-2}\\text{ yr}^{-1}$.` },
      ],
      commonPitfalls: ['Adding GPP + R instead of subtracting respiration R.'],
      isDailyEligible: true,
    };
  }

  // Enzyme initial rate from volume / time
  const substrates = [
    'hydrogen peroxide with catalase',
    'starch with salivary amylase',
    'sucrose with sucrase',
    'urea with urease',
    'lactose with lactase',
    'casein with trypsin',
    'tributyrin with pancreatic lipase',
    'cellulose with cellulase',
  ] as const;
  const sub = substrates[idx % substrates.length];
  const vGas = Number((rng.int(15, 195) / 2).toFixed(1));
  const timeS = rng.pick([10, 12, 15, 20, 25, 30, 40, 45, 50, 60]);
  const rate = vGas / timeS;

  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: 'bio-B1.2',
    subtopicCode: 'C1.1',
    paper: 'Paper 1B',
    questionType: 'data_based',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `During an investigation of ${sub}, $${vGas.toFixed(1)}\\text{ cm}^3$ of product is collected linearly during the first $${timeS}\\text{ s}$ at $37^\\circ\\text{C}$. Calculate the initial rate of reaction in $\\text{cm}^3\\text{ s}^{-1}$ (to $3$ significant figures) and explain why initial rate is preferred over total yield.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Divides $\\frac{${vGas.toFixed(1)}}{${timeS}}$`, marks: 1 },
      { pointId: 'A1', requirement: `Initial rate $= ${roundSigFigs(rate, 3)}\\text{ cm}^3\\text{ s}^{-1}$`, marks: 1 },
      { pointId: 'R1', requirement: `At $t \\approx 0$, substrate concentration is known and not yet depleted (and product inhibition / enzyme denaturation has not accumulated)`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Compute gradient over linear initial interval', explanationMarkdown: `$\\text{rate} = \\frac{${vGas.toFixed(1)}}{${timeS}} = ${roundSigFigs(rate, 3)}\\text{ cm}^3\\text{ s}^{-1}$.` },
      { stepNumber: 2, title: 'Justify measuring initial rate', explanationMarkdown: `Substrate has not yet become limiting, so active sites saturate proportionally to the controlled $[S]_0$.` },
    ],
    commonPitfalls: ['Claiming enzymes "get used up" during the reaction instead of substrate depletion.'],
    isDailyEligible: true,
  };
}

/* --------------------- 10. CORE 40-SUBTOPIC CONCEPT & MECHANISM BANK --------------------- */

const BIO_CONCEPTS = [
  {
    topicId: 'bio-A1.1', sub: 'A1.1',
    q: 'Explain how hydrogen bonding in liquid water enables both xylem transport in tall trees and thermal buffering in aquatic organisms.',
    pts: ['Cohesion between polar water molecules via hydrogen bonds sustains an unbroken tension column in xylem', 'Adhesion to hydrophilic cellulose xylem walls resists gravity', 'High specific heat capacity (energy needed to break H-bonds) minimizes temperature fluctuations'],
    pitfall: 'Confusing cohesion (water-to-water) with adhesion (water-to-xylem wall).',
  },
  {
    topicId: 'bio-A1.2', sub: 'A1.2',
    q: 'Outline three structural differences between DNA and RNA nucleotides and strands, explaining how antiparallel strands stabilize the DNA double helix.',
    pts: ['DNA contains deoxyribose + thymine (T), whereas RNA contains ribose + uracil (U)', 'DNA is typically double-stranded antiparallel ($5\'\\to 3\'$ / $3\'\\to 5\'$), RNA is typically single-stranded', 'Complementary purine–pyrimidine base pairing ($A=T$ with 2 H-bonds, $G\\equiv C$ with 3 H-bonds) maintains uniform helix diameter'],
    pitfall: 'Stating that phosphodiester bonds hold the two opposite strands together instead of hydrogen bonds between nitrogenous bases.',
  },
  {
    topicId: 'bio-A1.2', sub: 'A2.1',
    q: 'Evaluate the Miller–Urey experiment and the RNA world hypothesis as explanations for the prebiotic origin of cells (HL).',
    pts: ['Miller–Urey synthesized amino acids from $\\text{CH}_4, \\text{NH}_3, \\text{H}_2, \\text{H}_2\\text{O}$ under electrical discharge simulating lightning', 'RNA can both store genetic sequence and act as a catalytic ribozyme (e.g. peptidyl transferase)', 'Limitation: early Earth atmosphere may have had lower $\\text{CH}_4/\\text{NH}_3$ and higher $\\text{CO}_2/\\text{N}_2$'],
    pitfall: 'Claiming Miller–Urey produced living cells rather than simple organic monomers.',
  },
  {
    topicId: 'bio-B2.1', sub: 'A2.3',
    q: 'Distinguish between the lytic and lysogenic cycles of bacteriophage lambda, and explain why antiviral therapy must target viral-specific steps (HL).',
    pts: ['Lytic cycle replicates viral genome/capsids immediately and lyses the host cell', 'Lysogenic cycle integrates viral DNA as a prophage into the host genome and replicates passively with host division', 'Antivirals target viral enzymes (e.g. reverse transcriptase, integrase, neuraminidase) without harming eukaryotic host machinery'],
    pitfall: 'Claiming antibiotics kill viruses (antibiotics target bacterial cell walls or 70S ribosomes).',
  },
  {
    topicId: 'bio-B1.2', sub: 'B1.2',
    q: 'Explain how amino acid R-group chemistry determines tertiary protein folding, contrasting globular enzymes with fibrous structural proteins.',
    pts: ['Hydrophobic R-groups cluster inward away from water; hydrophilic R-groups face aqueous exterior', 'Tertiary folding is stabilized by hydrogen bonds, ionic interactions, and covalent disulfide bridges between cysteine residues', 'Globular proteins (e.g. catalase) are water-soluble and metabolically active; fibrous proteins (e.g. collagen) are insoluble tensile sheets/fibres'],
    pitfall: 'Confusing peptide bonds (primary structure) with hydrogen/ionic/disulfide bonds (tertiary structure).',
  },
  {
    topicId: 'bio-B2.1', sub: 'B2.1',
    q: 'Explain how the fluid mosaic model accounts for selective permeability, contrasting facilitated diffusion with the $\\text{Na}^+/\\text{K}^+$ ATPase pump.',
    pts: ['Hydrophobic fatty acid tails block polar/charged ions while allowing small non-polar molecules ($\\text{O}_2, \\text{CO}_2$) to diffuse', 'Channel/carrier proteins mediate passive facilitated diffusion down a concentration gradient without ATP', 'The $\\text{Na}^+/\\text{K}^+$ pump hydrolyzes ATP to actively export $3\\,\\text{Na}^+$ and import $2\\,\\text{K}^+$ against gradients'],
    pitfall: 'Claiming facilitated diffusion requires ATP hydrolysis.',
  },
  {
    topicId: 'bio-B2.1', sub: 'B3.3',
    q: 'Outline the sliding filament mechanism of striated skeletal muscle contraction in response to a motor neuron impulse (HL).',
    pts: ['Action potential triggers $\\text{Ca}^{2+}$ release from the sarcoplasmic reticulum', '$\\text{Ca}^{2+}$ binds troponin, shifting tropomyosin to expose myosin-binding sites on actin', 'Myosin heads bind actin, execute power stroke (ADP + Pi release), and ATP binding detaches cross-bridges; H-zone and I-band shorten while A-band stays constant'],
    pitfall: 'Stating that actin or myosin filaments themselves shorten during contraction.',
  },
  {
    topicId: 'bio-C1.2', sub: 'C1.2',
    q: 'Compare aerobic cell respiration and anaerobic lactate fermentation in mammals, including the role of $\\text{NAD}^+$ regeneration and mitochondrial chemiosmosis.',
    pts: ['Glycolysis in cytoplasm yields 2 net ATP + 2 NADH + 2 pyruvate per glucose', 'In absence of $\\text{O}_2$, pyruvate is reduced to lactate, oxidizing NADH back to $\\text{NAD}^+$ so glycolysis can continue', 'In mitochondria, NADH/$\\text{FADH}_2$ donate electrons to ETC pumping $\\text{H}^+$ into intermembrane space; $\\text{O}_2$ is terminal acceptor; ATP synthase generates ~30–32 ATP via chemiosmosis'],
    pitfall: 'Stating that anaerobic fermentation produces additional ATP after glycolysis (the 2 ATP still come solely from glycolysis).',
  },
  {
    topicId: 'bio-C1.3', sub: 'C1.3',
    q: 'Explain the coupling between light-dependent reactions in thylakoids and the Calvin cycle in the chloroplast stroma.',
    pts: ['Light excites electrons in Photosystems II & I; photolysis of water supplies electrons and releases $\\text{O}_2$', 'Chemiosmosis across thylakoid membrane produces ATP, and NADP$^+$ is reduced to NADPH', 'In stroma, RuBisCO fixes $\\text{CO}_2$ with RuBP into glycerate-3-phosphate (GP), reduced to triose phosphate (TP) using ATP and NADPH'],
    pitfall: 'Writing that photolysis takes place in the stroma or that RuBisCO uses $\\text{O}_2$ as its primary photosynthetic substrate.',
  },
  {
    topicId: 'bio-C1.2', sub: 'C2.1',
    q: 'Distinguish between steroid hormone intracellular signaling and epinephrine GPCR/second-messenger signaling in mammalian target cells (HL).',
    pts: ['Lipid-soluble steroid hormones diffuse across the plasma membrane and bind cytoplasmic/nuclear receptors to regulate gene transcription directly', 'Hydrophilic amine/peptide hormones (epinephrine) bind transmembrane GPCRs on the cell surface', 'G-protein activation stimulates adenylyl cyclase to generate cAMP, triggering a rapid phosphorylation cascade'],
    pitfall: 'Claiming steroid hormones require cell-surface GPCRs or cAMP cascades.',
  },
  {
    topicId: 'bio-C1.2', sub: 'C2.2',
    q: 'Explain how resting potential, depolarization, repolarization, and saltatory conduction propagate a nerve impulse along a myelinated axon.',
    pts: ['Resting potential ($-70\\text{ mV}$) maintained by $\\text{Na}^+/\\text{K}^+$ pump and open $\\text{K}^+$ leak channels', 'Threshold stimulus opens voltage-gated $\\text{Na}^+$ channels, causing rapid $\\text{Na}^+$ influx (depolarization to $+30\\text{ mV}$)', 'Voltage-gated $\\text{K}^+$ channels open for $\\text{K}^+$ efflux (repolarization); myelin sheath restricts ion exchange to nodes of Ranvier for fast saltatory conduction'],
    pitfall: 'Saying electrons flow along the neuron instead of local ion currents across the membrane.',
  },
  {
    topicId: 'bio-D1.1', sub: 'D1.1',
    q: 'Explain the roles of helicase, DNA primase, DNA polymerase III, DNA polymerase I, and DNA ligase on leading versus lagging strands (HL).',
    pts: ['Helicase unwinds the double helix and breaks H-bonds; primase synthesizes short RNA primers', 'DNA polymerase III extends $5\' \\to 3\'$ continuously on the leading strand and discontinuously as Okazaki fragments on the lagging strand', 'DNA polymerase I replaces RNA primers with DNA nucleotides and DNA ligase seals phosphodiester nicks'],
    pitfall: 'Writing that DNA polymerase synthesizes in the $3\' \\to 5\'$ direction.',
  },
  {
    topicId: 'bio-D1.2', sub: 'D2.2',
    q: 'Explain how DNA methylation and histone acetylation regulate eukaryotic gene expression epigenetically without altering DNA base sequence (HL).',
    pts: ['Histone acetyltransferases add acetyl groups to positively charged lysine tails, loosening chromatin into euchromatin so RNA polymerase can bind', 'DNA methylation of CpG islands recruits silencing complexes and condenses chromatin into heterochromatin, repressing transcription', 'Epigenetic tags can be preserved across mitotic cell divisions and influenced by environmental stimuli'],
    pitfall: 'Claiming epigenetic modifications mutate the nucleotide sequence of DNA.',
  },
] as const;

function genConceptOrExtended(rng: SeededRng, idx: number): QuestionItem {
  const c = BIO_CONCEPTS[idx % BIO_CONCEPTS.length];
  const angle = Math.floor(idx / BIO_CONCEPTS.length) % 3;
  if (angle === 0) {
    return {
      id: makeId('bio-gen', idx),
      subjectSlug: 'bio',
      topicId: c.topicId,
      subtopicCode: c.sub,
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'allowed',
      difficulty: 'challenging',
      marks: 6,
      commandTerm: 'Explain',
      stemMarkdown: c.q,
      markschemePoints: c.pts.map((req, i) => ({
        pointId: `A${i + 1}`,
        requirement: req,
        marks: 2,
      })),
      walkthroughSteps: c.pts.map((req, i) => ({
        stepNumber: i + 1,
        title: `Key IB Markscheme Pillar ${i + 1}`,
        explanationMarkdown: req,
      })),
      commonPitfalls: [c.pitfall],
      isDailyEligible: true,
    };
  }

  if (angle === 1) {
    // Focused 2-mark Paper 2A short answer targeting point 1 vs 2
    return {
      id: makeId('bio-gen', idx),
      subjectSlug: 'bio',
      topicId: c.topicId,
      subtopicCode: c.sub,
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 3,
      commandTerm: 'Outline',
      stemMarkdown: `With reference to IB Topic ${c.sub}, outline the primary molecular or cellular mechanisms underlying the following prompt: ${c.q}`,
      markschemePoints: c.pts.map((req, i) => ({
        pointId: `A${i + 1}`,
        requirement: req,
        marks: 1,
      })),
      walkthroughSteps: [
        { stepNumber: 1, title: 'Identify required biological terminology', explanationMarkdown: c.pts[0] },
        { stepNumber: 2, title: 'Link structure directly to function', explanationMarkdown: `${c.pts[1]} ${c.pts[2]}` },
      ],
      commonPitfalls: [c.pitfall],
      isDailyEligible: true,
    };
  }

  // Angle 2: Experimental error / Paper 1B trap critique
  return {
    id: makeId('bio-gen', idx),
    subjectSlug: 'bio',
    topicId: c.topicId,
    subtopicCode: c.sub,
    paper: 'Paper 1B',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 2,
    commandTerm: 'Evaluate',
    stemMarkdown: `A student reviewing Topic ${c.sub} wrote the following flawed claim: *"${c.pitfall}"* Identify the biological error and state the accurate IB markscheme explanation.`,
    markschemePoints: [
      { pointId: 'A1', requirement: `Identifies misconception: ${c.pitfall}`, marks: 1 },
      { pointId: 'A2', requirement: `Accurate correction: ${c.pts[0]}`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Spot the exact syllabus misconception', explanationMarkdown: `Misconception: ${c.pitfall}` },
      { stepNumber: 2, title: 'Replace with precise IB terminology', explanationMarkdown: `${c.pts[0]} ${c.pts[1]}` },
    ],
    commonPitfalls: [c.pitfall],
    isDailyEligible: true,
  };
}

const BIO_WEIGHTED_FAMILIES: ReadonlyArray<{ fn: BioFamilyFn; weight: number }> = [
  { fn: genMagnificationScale, weight: 20 },
  { fn: genWaterPotential, weight: 20 },
  { fn: genHardyWeinberg, weight: 22 },
  { fn: genSimpsonIndex, weight: 20 },
  { fn: genLincolnIndex, weight: 18 },
  { fn: genChiSquaredGenetics, weight: 20 },
  { fn: genMitoticIndex, weight: 18 },
  { fn: genDnaTranslationMutation, weight: 24 },
  { fn: genEnzymeAndBioenergetics, weight: 24 },
  { fn: genConceptOrExtended, weight: 1 },
];

export function generateBiologyQuestions(
  targetCount: number,
  seed = 309121
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const items: QuestionItem[] = [];
  const pool: BioFamilyFn[] = [];
  for (const entry of BIO_WEIGHTED_FAMILIES) {
    for (let k = 0; k < entry.weight; k++) pool.push(entry.fn);
  }
  for (let i = 0; i < targetCount; i++) {
    const fn = pool[i % pool.length];
    items.push(fn(rng, i + 1));
  }
  return items;
}
