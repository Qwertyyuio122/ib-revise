import type {
  MathDiagramSpec,
  QuestionItem,
} from '../../../src/content/schemas';
import {
  SeededRng,
  binomialPmf,
  buildMcqOptions,
  formatFracLatex,
  makeId,
  nCr,
  normalCdf,
  roundSigFigs,
  signedTerm,
} from './utils';

type MathFamilyFn = (rng: SeededRng, idx: number) => QuestionItem;

const SEQ_CONTEXTS = [
  'solar panel installations',
  'library book acquisitions',
  'theatre seating rows',
  'battery storage capacity',
  'weekly marathon training mileage',
  'café loyalty memberships',
  'orchard tree plantings',
  'hydroelectric turbine output',
] as const;

const FINANCE_CONTEXTS = [
  'a university tuition savings bond',
  'an ecological restoration trust fund',
  'a municipal green-energy debenture',
  'a robotics lab equipment reserve',
  'a marine conservation endowment',
  'an architectural heritage grant',
] as const;

const EXP_CONTEXTS = [
  { noun: 'a radioactive medical tracer', unit: 'hours', qty: 'activity (MBq)' },
  { noun: 'a freshly brewed espresso cooling on a bench', unit: 'minutes', qty: 'excess temperature (°C)' },
  { noun: 'an invasive aquatic plant in a reservoir', unit: 'weeks', qty: 'surface area (m²)' },
  { noun: 'a bacterial culture in nutrient broth', unit: 'hours', qty: 'population (thousands)' },
  { noun: 'atmospheric pressure on a weather balloon', unit: 'km', qty: 'pressure (kPa)' },
  { noun: 'caffeine concentration in bloodstream plasma', unit: 'hours', qty: 'concentration (mg/L)' },
] as const;

const TRIG_WAVE_CONTEXTS = [
  { noun: 'harbour tide depth', yUnit: 'm', xUnit: 'h' },
  { noun: 'passenger capsule height on a Ferris wheel', yUnit: 'm', xUnit: 'min' },
  { noun: 'seasonal daylight duration', yUnit: 'h', xUnit: 'months' },
  { noun: 'alternating voltage across a resistor', yUnit: 'V', xUnit: 'ms' },
] as const;

const NORMAL_CONTEXTS = [
  { item: 'bags of roasted coffee beans', measure: 'mass', unit: 'g' },
  { item: 'machined aluminium shafts', measure: 'diameter', unit: 'mm' },
  { item: 'bottled sparkling mineral water', measure: 'volume', unit: 'mL' },
  { item: 'adult Atlantic salmon', measure: 'length', unit: 'cm' },
  { item: 'daily commute durations', measure: 'time', unit: 'min' },
  { item: 'laboratory pipette deliveries', measure: 'volume', unit: 'mL' },
] as const;

const STATS_CONTEXTS = [
  { xName: 'revision hours', xUnit: 'h', yName: 'exam score', yUnit: 'percent' },
  { xName: 'fertilizer mass', xUnit: 'g', yName: 'seedling height', yUnit: 'cm' },
  { xName: 'ambient temperature', xUnit: '°C', yName: 'iced drink sales', yUnit: 'cups' },
  { xName: 'engine speed', xUnit: 'krpm', yName: 'fuel flow', yUnit: 'L/h' },
  { xName: 'advertising spend', xUnit: 'thousand dollars', yName: 'monthly orders', yUnit: 'hundreds' },
] as const;

/* ----------------------------- TOPIC 1: NUMBER & ALGEBRA ----------------------------- */

function genArithmeticSequence(rng: SeededRng, idx: number): QuestionItem {
  const u1 = rng.int(4, 25);
  const d = rng.pick([2, 3, 4, 5, 6, 7, -2, -3, -4]);
  const n = rng.int(10, 26);
  const askSum = idx % 2 === 0;
  const ctx = rng.pick(SEQ_CONTEXTS);
  const un = u1 + (n - 1) * d;
  const sn = (n / 2) * (2 * u1 + (n - 1) * d);

  if (askSum) {
    const isMcq = idx % 4 === 0;
    const wrongNoMinusOne = (n / 2) * (2 * u1 + n * d);
    const wrongUnOnly = un;
    const wrongSign = (n / 2) * (2 * u1 - (n - 1) * d);
    const mcq = isMcq
      ? buildMcqOptions(rng, `$${sn}$`, [
          `$${wrongNoMinusOne}$`,
          `$${wrongUnOnly}$`,
          `$${wrongSign}$`,
        ])
      : null;

    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-1',
      subtopicCode: 'SL 1.2',
      paper: 'Paper 1',
      questionType: isMcq ? 'mcq' : 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: isMcq ? 1 : 4,
      commandTerm: isMcq ? 'Determine' : 'Calculate',
      stemMarkdown: `A sequence modeling ${ctx} is arithmetic with first term $u_1 = ${u1}$ and common difference $d = ${d}$. ${
        isMcq ? 'What is' : 'Find'
      } the sum $S_{${n}}$ of the first $${n}$ terms.`,
      options: mcq?.options ?? null,
      correctOptionId: mcq?.correctOptionId ?? null,
      markschemePoints: isMcq
        ? [{ pointId: 'A1', requirement: `Correct sum $S_{${n}} = ${sn}$`, marks: 1 }]
        : [
            {
              pointId: 'M1',
              requirement: `Substitutes into $S_n = \\frac{n}{2}(2u_1 + (n-1)d)$: $S_{${n}} = \\frac{${n}}{2}(2(${u1}) + (${n}-1)(${d}))$`,
              marks: 2,
            },
            {
              pointId: 'A1',
              requirement: `Evaluates $2u_1 + (n-1)d = ${2 * u1 + (n - 1) * d}$`,
              marks: 1,
            },
            {
              pointId: 'A2',
              requirement: `Final answer $S_{${n}} = ${sn}$`,
              marks: 1,
            },
          ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Select the arithmetic sum formula',
          explanationMarkdown: `From the SL 1.2 formula booklet: $S_n = \\frac{n}{2}(2u_1 + (n-1)d)$ with $u_1 = ${u1}$, $d = ${d}$, $n = ${n}$.`,
        },
        {
          stepNumber: 2,
          title: 'Compute carefully',
          explanationMarkdown: `$S_{${n}} = ${n / 2} \\times (${2 * u1} + ${(n - 1) * d}) = ${n / 2} \\times ${2 * u1 + (n - 1) * d} = ${sn}$.`,
        },
      ],
      commonPitfalls: [
        'Using $n d$ instead of $(n - 1) d$ inside the bracket.',
        'Computing $u_n$ instead of the cumulative sum $S_n$.',
      ],
      isDailyEligible: true,
    };
  }

  // Simultaneous u_p and u_q
  const p = rng.int(3, 6);
  const q = p + rng.int(4, 7);
  const up = u1 + (p - 1) * d;
  const uq = u1 + (q - 1) * d;
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.2',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `In an arithmetic sequence representing ${ctx}, the $${p}^{\\text{th}}$ term is $u_{${p}} = ${up}$ and the $${q}^{\\text{th}}$ term is $u_{${q}} = ${uq}$. Find the first term $u_1$ and the common difference $d$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Writes $u_1 + ${p - 1}d = ${up}$ and $u_1 + ${q - 1}d = ${uq}$`,
        marks: 2,
      },
      {
        pointId: 'M2',
        requirement: `Subtracts equations: $${q - p}d = ${uq - up}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Finds $d = ${d}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Substitutes back to obtain $u_1 = ${u1}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Set up two linear equations',
        explanationMarkdown: `Using $u_n = u_1 + (n-1)d$: $u_1 + ${p - 1}d = ${up}$ and $u_1 + ${q - 1}d = ${uq}$.`,
      },
      {
        stepNumber: 2,
        title: 'Eliminate $u_1$ and solve',
        explanationMarkdown: `Subtracting gives $(${q - 1} - ${p - 1})d = ${uq} - ${up} \\implies ${q - p}d = ${uq - up} \\implies d = ${d}$, then $u_1 = ${up} - ${p - 1}(${d}) = ${u1}$.`,
      },
    ],
    commonPitfalls: [
      'Writing $u_n = u_1 + nd$ instead of $u_1 + (n-1)d$.',
      'Sign errors when subtracting negative terms.',
    ],
    isDailyEligible: true,
  };
}

function genGeometricInfinite(rng: SeededRng, idx: number): QuestionItem {
  const numR = rng.pick([1, 2, 3, 4, -1, -2, -3]);
  const denR = rng.int(Math.abs(numR) + 1, 9);
  const rn = numR;
  const rd = denR;
  const k = rng.int(2, 24);
  const u1 = k * (rd - rn);
  const sInf = k * rd;
  const rLatex = formatFracLatex(rn, rd);

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.3',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Find',
    stemMarkdown: `An infinite geometric series has first term $u_1 = ${u1}$ and common ratio $r = ${rLatex}$. Justify why the sum to infinity exists, and find its exact value $S_{\\infty}$.`,
    markschemePoints: [
      {
        pointId: 'R1',
        requirement: `States convergence condition $|r| = \\left|${rLatex}\\right| < 1$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Substitutes into $S_{\\infty} = \\frac{u_1}{1 - r} = \\frac{${u1}}{1 - (${rLatex})}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Simplifies to exact value $S_{\\infty} = ${sInf}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Verify convergence',
        explanationMarkdown: `Because $|r| = \\frac{${Math.abs(rn)}}{${rd}} < 1$, the geometric series converges to a finite sum $S_{\\infty}$.`,
      },
      {
        stepNumber: 2,
        title: 'Evaluate $S_{\\infty} = \\frac{u_1}{1-r}$',
        explanationMarkdown: `$1 - r = 1 - (${rLatex}) = \\frac{${rd - rn}}{${rd}}$, so $S_{\\infty} = ${u1} \\times \\frac{${rd}}{${rd - rn}} = ${sInf}$.`,
      },
    ],
    commonPitfalls: [
      'Omitting the $|r| < 1$ justification required by "Justify why the sum to infinity exists".',
      'Subtracting a negative $r$ incorrectly ($1 - (-r) = 1 + r$).',
    ],
    isDailyEligible: true,
  };
}

function genCompoundInterest(rng: SeededRng, idx: number): QuestionItem {
  const pv = rng.int(12, 60) * 500;
  const r = rng.pick([3.2, 3.6, 4.0, 4.5, 4.8, 5.4, 6.0]);
  const k = rng.pick([1, 2, 4, 12]);
  const n = rng.int(5, 14);
  const fv = pv * Math.pow(1 + r / (100 * k), k * n);
  const ctx = rng.pick(FINANCE_CONTEXTS);
  const targetMult = rng.pick([1.5, 2, 2.5]);
  const solveForYears = idx % 2 === 1;

  if (solveForYears) {
    const exactYears = Math.log(targetMult) / (k * Math.log(1 + r / (100 * k)));
    const yearsAns = roundSigFigs(exactYears, 3);
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-1',
      subtopicCode: 'SL 1.4',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'gdc_required',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Determine',
      stemMarkdown: `An amount of $${pv}\\text{ USD}$ is invested in ${ctx} earning a nominal annual interest rate of $${r}\\%$ compounded $${k === 1 ? 'annually' : k === 2 ? 'half-yearly' : k === 4 ? 'quarterly' : 'monthly'}$. Determine the time in years required for the investment to grow by a factor of $${targetMult}$ (to $3$ significant figures).`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Sets up $${pv}\\left(1 + \\frac{${r}}{100 \\times ${k}}\\right)^{${k}n} = ${targetMult * pv}$`,
          marks: 2,
        },
        {
          pointId: 'M2',
          requirement: `Applies logarithms or GDC solver to isolate $n$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `Correct answer $n \\approx ${yearsAns}\\text{ years}$ (3 s.f.)`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Write the compound interest equation',
          explanationMarkdown: `Using $FV = PV\\left(1 + \\frac{r}{100k}\\right)^{kn}$ with $k = ${k}$ and $FV = ${targetMult}PV$, divide by $PV$: $\\left(1 + \\frac{${r}}{${100 * k}}\\right)^{${k}n} = ${targetMult}$.`,
        },
        {
          stepNumber: 2,
          title: 'Take logarithms and solve for $n$',
          explanationMarkdown: `$n = \\frac{\\ln(${targetMult})}{${k}\\ln\\left(1 + \\frac{${r}}{${100 * k}}\\right)} \\approx ${yearsAns}\\text{ years}$.`,
        },
      ],
      commonPitfalls: [
        'Forgetting to divide the annual rate $r$ by $100k$ inside the bracket.',
        'Giving an answer to fewer or more than 3 significant figures when not exact.',
      ],
      isDailyEligible: true,
    };
  }

  const fvAns = roundSigFigs(fv, 3);
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `A deposit of $${pv}\\text{ EUR}$ is placed into ${ctx} at a nominal annual rate of $${r}\\%$ compounded $${k === 1 ? 'annually' : k === 2 ? 'half-yearly' : k === 4 ? 'quarterly' : 'monthly'}$. Calculate its future value after $${n}$ years, correct to $3$ significant figures.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Substitutes $PV=${pv}, r=${r}, k=${k}, n=${n}$ into $FV = PV\\left(1 + \\frac{r}{100k}\\right)^{kn}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Correct value $FV \\approx ${fvAns}\\text{ EUR}$ (3 s.f.)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Identify compounding frequency $k$',
        explanationMarkdown: `Here $k = ${k}$ periods per year, so $kn = ${k * n}$ compounding intervals.`,
      },
      {
        stepNumber: 2,
        title: 'Evaluate and round to 3 s.f.',
        explanationMarkdown: `$FV = ${pv}\\left(1 + \\frac{${r}}{${100 * k}}\\right)^{${k * n}} = ${fv.toFixed(2)} \\approx ${fvAns}\\text{ EUR}$.`,
      },
    ],
    commonPitfalls: [
      'Using exponent $n$ instead of $kn$ when $k > 1$.',
      'Rounding intermediate base factors before raising to $kn$.',
    ],
    isDailyEligible: true,
  };
}

function genLogarithmEquation(rng: SeededRng, idx: number): QuestionItem {
  // log_a(x) + log_a(x - b) = c where roots are integer r1 > b and extraneous r2 < 0
  const base = rng.pick([2, 3, 5, 10]);
  const rootPos = rng.int(4, 16);
  const shift = rng.int(1, rootPos - 2);
  // Check if rootPos * (rootPos - shift) can match base^c cleanly:
  // Instead pick b, a, c by constructing valid integer product:
  // Choose x1 = base^p, wait better: x * (x - d) = base^c => let x = 2^m or solve (x - h)^2 - h^2 = ...
  // Simplest clean algebraic construction: log_2(x + p) + log_2(x - q) = k
  // Pick x_ans > q, then choose k such that (x_ans + p)(x_ans - q) = base^k!
  const k = rng.pick([2, 3, 4]);
  const target = Math.pow(base, k);
  // Factor target into f1 * f2 where f1 > f2 >= 1 and same parity!
  const pairs: Array<[number, number]> = [];
  for (let d = 1; d * d < target; d++) {
    if (target % d === 0) {
      const f1 = target / d;
      const f2 = d;
      if ((f1 - f2) % 2 === 0) pairs.push([f1, f2]);
    }
  }
  const [f1, f2] = pairs.length ? rng.pick(pairs) : [base, Math.pow(base, k - 1)];
  const xAns = (f1 + f2) / 2 + rng.int(2, 6);
  const pShift = f1 - xAns; // x + pShift = f1, or let's keep positive offsets:
  // Better: x1 = xAns - f2 (positive if xAns > f2), wait:
  // (x - alpha)(x + beta) = target => if alpha = xAns - f2, beta = f1 - xAns? No, let xAns = f2 + alpha where alpha >= 1:
  const alpha = rng.int(2, 7);
  const xSol = f2 + alpha;
  const beta = f1 - xSol; // can be positive or negative, wait ensure (xSol - alpha) = f2 and (xSol + beta) = f1
  // Let expr1 = x - alpha, expr2 = x + beta. Roots of x^2 + (beta-alpha)x - alpha*beta - target = 0:
  // xSol is > alpha, other root is -(f1 - alpha) = alpha - f1. If f1 > alpha, other root < 0 (or < alpha)!
  const expr2Str = beta >= 0 ? `x + ${beta}` : `x - ${Math.abs(beta)}`;
  const validDomainMin = Math.max(alpha, -beta);
  const otherRoot = alpha - f1;
  const isExtraneous = otherRoot <= validDomainMin;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.5',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Solve',
    stemMarkdown: `Solve the logarithmic equation $\\log_{${base}}(x - ${alpha}) + \\log_{${base}}(${expr2Str}) = ${k}$ for $x \\in \\mathbb{R}$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Combines logs using product law: $\\log_{${base}}((x - ${alpha})(${expr2Str})) = ${k}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Converts to exponential form $(x - ${alpha})(${expr2Str}) = ${base}^{${k}} = ${target}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Solves resulting quadratic to obtain $x = ${xSol}$ and $x = ${otherRoot}$`,
        marks: 2,
      },
      {
        pointId: 'R1',
        requirement: isExtraneous
          ? `Rejects $x = ${otherRoot}$ due to log domain $x > ${validDomainMin}$, giving unique solution $x = ${xSol}$`
          : `Verifies domain $x > ${validDomainMin}$ for final solution(s)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Apply logarithm laws and state domain restrictions',
        explanationMarkdown: `Both arguments must be strictly positive, so $x > ${validDomainMin}$. Combining via $\\log_a M + \\log_a N = \\log_a(MN)$ gives $(x - ${alpha})(${expr2Str}) = ${base}^{${k}} = ${target}$.`,
      },
      {
        stepNumber: 2,
        title: 'Factor quadratic and check extraneous roots',
        explanationMarkdown: `Expanding gives $(x - ${xSol})(x - (${otherRoot})) = 0$. Checking against $x > ${validDomainMin}$ leaves $x = ${xSol}$.`,
      },
    ],
    commonPitfalls: [
      'Keeping the negative/extraneous root without testing inside the original logarithm arguments.',
      'Rewriting $\\log_a(A) + \\log_a(B)$ as $\\log_a(A + B)$ instead of $\\log_a(AB)$.',
    ],
    isDailyEligible: true,
  };
}

function genBinomialExpansion(rng: SeededRng, idx: number): QuestionItem {
  const n = rng.int(5, 8);
  const r = rng.int(2, n - 2);
  const a = rng.pick([1, 2, 3]);
  const b = rng.pick([-3, -2, -1, 2, 3, 4]);
  const comb = nCr(n, r);
  const coeff = comb * Math.pow(a, n - r) * Math.pow(b, r);
  const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
  const aStr = a === 1 ? 'x' : `${a}x`;
  const xPow = n - r;

  const isMcq = idx % 3 === 0;
  const wrongNoComb = Math.pow(a, n - r) * Math.pow(b, r);
  const wrongSign = -coeff;
  const wrongPow = comb * Math.pow(a, r) * Math.pow(b, n - r);
  const mcq = isMcq
    ? buildMcqOptions(rng, `$${coeff}$`, [
        `$${wrongNoComb}$`,
        `$${wrongSign}$`,
        `$${wrongPow}$`,
      ])
    : null;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.9',
    paper: 'Paper 1',
    questionType: isMcq ? 'mcq' : 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: isMcq ? 1 : 4,
    commandTerm: 'Find',
    stemMarkdown: `Find the coefficient of $x^{${xPow}}$ in the binomial expansion of $(${aStr} ${bStr})^{${n}}$.`,
    options: mcq?.options ?? null,
    correctOptionId: mcq?.correctOptionId ?? null,
    markschemePoints: isMcq
      ? [{ pointId: 'A1', requirement: `Correct coefficient $${coeff}$`, marks: 1 }]
      : [
          {
            pointId: 'M1',
            requirement: `Writes general term $\\binom{${n}}{${r}}(${aStr})^{${xPow}}(${b})^{${r}}$`,
            marks: 2,
          },
          {
            pointId: 'A1',
            requirement: `Evaluates $\\binom{${n}}{${r}} = ${comb}$, $(${a})^{${xPow}} = ${Math.pow(a, xPow)}$, $(${b})^{${r}} = ${Math.pow(b, r)}$`,
            marks: 1,
          },
          {
            pointId: 'A2',
            requirement: `Final coefficient is $${coeff}$`,
            marks: 1,
          },
        ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Match exponent of $x$',
        explanationMarkdown: `The term containing $x^{${xPow}}$ is $\\binom{${n}}{${r}}(${aStr})^{${xPow}}(${b})^{${r}}$ (with $r = ${r}$).`,
      },
      {
        stepNumber: 2,
        title: 'Multiply binomial coefficient and powers',
        explanationMarkdown: `$${comb} \\times ${Math.pow(a, xPow)} \\times (${Math.pow(b, r)}) = ${coeff}$.`,
      },
    ],
    commonPitfalls: [
      'Forgetting to raise the coefficient $a$ inside $(ax)^{n-r}$ to the power $n-r$.',
      'Dropping the negative sign on $b^r$ when $r$ is odd.',
    ],
    isDailyEligible: true,
  };
}

/* ----------------------------- TOPIC 2: FUNCTIONS (WITH DIAGRAMS) ----------------------------- */

function genQuadraticVertexDiscriminant(rng: SeededRng, idx: number): QuestionItem {
  const a = rng.pick([1, 2, -1, -2]);
  const h = rng.int(-3, 4);
  const k = rng.int(-5, 5);
  // f(x) = a(x - h)^2 + k = a x^2 - 2ah x + (ah^2 + k)
  const b = -2 * a * h;
  const c = a * h * h + k;
  const exprPoly = `${a === 1 ? '' : a === -1 ? '-' : a}x^2${signedTerm(b, 'x')}${signedTerm(c, '')}`;
  const exprPlot = `${a}*(x - (${h}))^2 + (${k})`;
  const yMin = Math.min(-4, k - 4);
  const yMax = Math.max(6, k + 6);

  const diagram: MathDiagramSpec = {
    kind: 'function_graph',
    title: `Graph of y = ${exprPoly}`,
    xRange: [h - 5, h + 5],
    yRange: [yMin, yMax],
    xLabel: 'x',
    yLabel: 'f(x)',
    functions: [{ id: 'f', expr: exprPlot, label: `f(x) = ${exprPoly}` }],
    keyPoints: [
      { x: h, y: k, label: `Vertex (${h}, ${k})` },
      { x: 0, y: c, label: `(0, ${c})` },
    ],
    interactiveTrace: true,
  };

  if (idx % 2 === 0) {
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-2',
      subtopicCode: 'SL 2.6',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 4,
      commandTerm: 'Determine',
      stemMarkdown: `Consider the quadratic function $f(x) = ${exprPoly}$ shown in the interactive graph. Express $f(x)$ in vertex form $a(x - h)^2 + k$ and state the coordinates of the vertex and axis of symmetry.`,
      diagramSpec: diagram,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Completes the square or uses $h = -\\frac{b}{2a} = ${h}$`,
          marks: 2,
        },
        {
          pointId: 'A1',
          requirement: `Writes $f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${h >= 0 ? `- ${h}` : `+ ${-h}`})^2 ${k >= 0 ? `+ ${k}` : `- ${-k}`}$`,
          marks: 1,
        },
        {
          pointId: 'A2',
          requirement: `Vertex $(${h}, ${k})$ and axis of symmetry $x = ${h}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Find the axis of symmetry $x = h$',
          explanationMarkdown: `$h = -\\frac{${b}}{2(${a})} = ${h}$. Writing the line equation $x = ${h}$ (not just the number) is required by IB markschemes.`,
        },
        {
          stepNumber: 2,
          title: 'Evaluate $k = f(h)$',
          explanationMarkdown: `Substituting $x = ${h}$ yields $k = ${k}$, so the vertex is $(${h}, ${k})$.`,
        },
      ],
      commonPitfalls: [
        'Stating the axis of symmetry as just the number instead of an equation $x = h$.',
        'Sign error inside $(x - h)^2$ when $h$ is negative.',
      ],
      isDailyEligible: true,
    };
  }

  // Discriminant condition for parameter m: f(x) = x^2 + mx + c_p = 0 has two distinct real roots
  const mCoeff = 2 * rng.int(2, 6);
  const cConst = (mCoeff * mCoeff) / 4;
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.7',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `The quadratic equation $x^2 + kx + ${cConst} = 0$ has two distinct real roots. Using the discriminant $\\Delta$, find the range of possible values of $k \\in \\mathbb{R}$.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Limiting Tangent Case (k = ${mCoeff})`,
      xRange: [-mCoeff / 2 - 4, -mCoeff / 2 + 4],
      yRange: [-3, 12],
      xLabel: 'x',
      yLabel: 'y',
      functions: [
        {
          id: 'lim',
          expr: `x^2 + ${mCoeff}*x + ${cConst}`,
          label: `y = x² + ${mCoeff}x + ${cConst}`,
        },
      ],
      keyPoints: [{ x: -mCoeff / 2, y: 0, label: `Tangent (-${mCoeff / 2}, 0)` }],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Sets discriminant $\\Delta = k^2 - 4(1)(${cConst}) > 0$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Finds critical values $k = \\pm ${mCoeff}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Correct two-sided inequality: $k < -${mCoeff}$ or $k > ${mCoeff}$`,
        marks: 2,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Apply $\\Delta > 0$ for two distinct real roots',
        explanationMarkdown: `$\\Delta = b^2 - 4ac = k^2 - ${4 * cConst} > 0 \\implies k^2 > ${4 * cConst}$.`,
      },
      {
        stepNumber: 2,
        title: 'Solve the quadratic inequality carefully',
        explanationMarkdown: `Since $k^2 > ${4 * cConst}$, $|k| > ${mCoeff}$, meaning $k < -${mCoeff}$ or $k > ${mCoeff}$.`,
      },
    ],
    commonPitfalls: [
      'Writing $-m < k < m$ (the opposite inequality) or only $k > m$ while forgetting negative $k$.',
      'Using $\\ge 0$ instead of strict $> 0$ for "distinct" roots.',
    ],
    isDailyEligible: true,
  };
}

function genRationalFunction(rng: SeededRng, idx: number): QuestionItem {
  const a = rng.pick([2, 3, -2, -3, 4]);
  const b = rng.int(-5, 5) || 3;
  const c = rng.pick([1, 2]);
  const d = rng.pick([-4, -2, 2, 4, -6, 6]);
  // Ensure ad - bc != 0
  const safeB = a * d === b * c ? b + 1 : b;
  const vertAsym = -d / c;
  const horizAsym = a / c;

  const numStr = `${a}x ${safeB >= 0 ? `+ ${safeB}` : `- ${-safeB}`}`;
  const denStr = `${c === 1 ? '' : c}x ${d >= 0 ? `+ ${d}` : `- ${-d}`}`;
  const expr = `(${a}*x + (${safeB})) / (${c}*x + (${d}))`;

  const diagram: MathDiagramSpec = {
    kind: 'function_graph',
    title: `Rational Function f(x) = (${numStr}) / (${denStr})`,
    xRange: [vertAsym - 6, vertAsym + 6],
    yRange: [horizAsym - 6, horizAsym + 6],
    xLabel: 'x',
    yLabel: 'f(x)',
    functions: [{ id: 'rat', expr, label: `f(x)` }],
    asymptotes: [
      { axis: 'x', value: vertAsym, label: `x = ${vertAsym}` },
      { axis: 'y', value: horizAsym, label: `y = ${horizAsym}` },
    ],
    interactiveTrace: true,
  };

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.8',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `Consider the rational function $f(x) = \\frac{${numStr}}{${denStr}}$ for $x \\neq ${vertAsym}$, graphed below. Find the equations of the vertical and horizontal asymptotes, and determine the $x$- and $y$-intercepts.`,
    diagramSpec: diagram,
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Vertical asymptote: $x = ${vertAsym}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Horizontal asymptote: $y = ${formatFracLatex(a, c)}$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Sets $x = 0$ for $y$-intercept and numerator $= 0$ for $x$-intercept`,
        marks: 1,
      },
      {
        pointId: 'A3',
        requirement: `$y$-intercept $(0, ${formatFracLatex(safeB, d)})$ and $x$-intercept $(${formatFracLatex(-safeB, a)}, 0)$`,
        marks: 2,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Find asymptote equations',
        explanationMarkdown: `Set denominator $= 0$: $${denStr} = 0 \\implies x = ${vertAsym}$. As $x \\to \\pm\\infty$, ratio of leading coefficients gives $y = ${formatFracLatex(a, c)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Find intercepts',
        explanationMarkdown: `$f(0) = ${formatFracLatex(safeB, d)}$, and setting $${numStr} = 0$ gives $x = ${formatFracLatex(-safeB, a)}$.`,
      },
    ],
    commonPitfalls: [
      'Writing asymptote values without `x =` or `y =` (IB requires full line equations).',
      'Confusing horizontal asymptote ratio $\\frac{a}{c}$ with $f(0) = \\frac{b}{d}$.',
    ],
    isDailyEligible: true,
  };
}

function genFunctionTransformations(rng: SeededRng, idx: number): QuestionItem {
  const vScale = rng.pick([2, 3, -2]);
  const hShift = rng.pick([-3, -2, 2, 3]);
  const vShift = rng.pick([-2, 1, 3, 4]);
  const baseExpr = 'x^2 - 2*x';
  const baseVertexX = 1;
  const baseVertexY = -1;
  const newX = baseVertexX + hShift;
  const newY = vScale * baseVertexY + vShift;
  const shiftStr = hShift > 0 ? `x - ${hShift}` : `x + ${-hShift}`;
  const vShiftStr = vShift >= 0 ? `+ ${vShift}` : `- ${-vShift}`;
  const transExpr = `${vScale} * ((x - (${hShift}))^2 - 2*(x - (${hShift}))) + (${vShift})`;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.11',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Determine',
    stemMarkdown: `The curve $y = f(x)$ has a stationary point at $(${baseVertexX}, ${baseVertexY})$. Let $g(x) = ${vScale}f(${shiftStr}) ${vShiftStr}$, as plotted against $f(x)$ below. Describe the sequence of geometric transformations mapping $f$ to $g$, and find the image coordinates of $(${baseVertexX}, ${baseVertexY})$.`,
    diagramSpec: {
      kind: 'function_graph',
      title: 'Original f(x) vs Transformed g(x)',
      xRange: [-4, 7],
      yRange: [-6, 10],
      xLabel: 'x',
      yLabel: 'y',
      functions: [
        { id: 'f', expr: baseExpr, label: 'f(x)', color: '#71717A', dashed: true },
        { id: 'g', expr: transExpr, label: 'g(x)', color: '#D97706' },
      ],
      keyPoints: [
        { x: baseVertexX, y: baseVertexY, label: `P(${baseVertexX}, ${baseVertexY})` },
        { x: newX, y: newY, label: `P'(${newX}, ${newY})` },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Horizontal translation ${Math.abs(hShift)} units ${hShift > 0 ? 'right' : 'left'}`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement:
          vScale < 0
            ? `Vertical stretch scale factor ${Math.abs(vScale)} and reflection in the $x$-axis, then vertical translation ${Math.abs(vShift)} units ${vShift > 0 ? 'up' : 'down'}`
            : `Vertical stretch scale factor ${vScale}, then vertical translation ${Math.abs(vShift)} units ${vShift > 0 ? 'up' : 'down'}`,
        marks: 2,
      },
      {
        pointId: 'A3',
        requirement: `Image point $(${newX}, ${newY})$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Transform the $x$-coordinate',
        explanationMarkdown: `Replacing $x$ with $${shiftStr}$ shifts horizontally by $${hShift}$: $x' = ${baseVertexX} + (${hShift}) = ${newX}$.`,
      },
      {
        stepNumber: 2,
        title: 'Transform the $y$-coordinate in order',
        explanationMarkdown: `Multiply by $${vScale}$ first, then add $${vShift}$: $y' = ${vScale}(${baseVertexY}) + (${vShift}) = ${newY}$, giving $(${newX}, ${newY})$.`,
      },
    ],
    commonPitfalls: [
      'Applying vertical translation before vertical stretch.',
      'Reversing the horizontal shift sign ($f(x - h)$ shifts right by $+h$).',
    ],
    isDailyEligible: true,
  };
}

function genExponentialModel(rng: SeededRng, idx: number): QuestionItem {
  const ctx = rng.pick(EXP_CONTEXTS);
  const a0 = rng.int(4, 24) * 10;
  const k = rng.pick([0.08, 0.12, 0.15, 0.2, 0.25]);
  const isDecay = idx % 2 === 0;
  const signK = isDecay ? -k : k;
  const tEval = rng.int(3, 8);
  const valEval = a0 * Math.exp(signK * tEval);
  const halfOrDoubleT = Math.log(isDecay ? 0.5 : 2) / signK;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.9',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Determine',
    stemMarkdown: `The ${ctx.qty} of ${ctx.noun} is modeled by $Q(t) = ${a0}e^{${signK}t}$, where $t \\ge 0$ is measured in ${ctx.unit}. (a) Calculate $Q(${tEval})$. (b) Determine the time $t$ when $Q(t)$ ${isDecay ? 'falls to half of' : 'doubles'} its initial value, to $3$ significant figures.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Exponential Model Q(t) = ${a0}e^(${signK}t)`,
      xRange: [0, Math.max(10, Math.ceil(halfOrDoubleT * 1.4))],
      yRange: [0, isDecay ? a0 * 1.15 : a0 * 2.5],
      xLabel: `t (${ctx.unit})`,
      yLabel: 'Q(t)',
      functions: [{ id: 'q', expr: `${a0}*exp(${signK}*x)`, label: 'Q(t)' }],
      keyPoints: [
        { x: 0, y: a0, label: `(0, ${a0})` },
        {
          x: Number(halfOrDoubleT.toFixed(2)),
          y: isDecay ? a0 / 2 : a0 * 2,
          label: `(${roundSigFigs(halfOrDoubleT, 3)}, ${isDecay ? a0 / 2 : a0 * 2})`,
        },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Substitutes $t = ${tEval}$ into $Q(t)$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `$Q(${tEval}) \\approx ${roundSigFigs(valEval, 3)}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Sets ${a0}e^{${signK}t} = ${isDecay ? a0 / 2 : a0 * 2} $\\implies e^{${signK}t} = ${isDecay ? 0.5 : 2}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `$t = \\frac{\\ln(${isDecay ? '0.5' : '2'})}{${signK}} \\approx ${roundSigFigs(halfOrDoubleT, 3)}\\text{ ${ctx.unit}}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: `Evaluate Q(${tEval})`,
        explanationMarkdown: `$Q(${tEval}) = ${a0}e^{${(signK * tEval).toFixed(2)}} \\approx ${roundSigFigs(valEval, 3)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Take natural logarithms to solve for $t$',
        explanationMarkdown: `Taking $\\ln$ of both sides gives $${signK}t = \\ln(${isDecay ? '0.5' : '2'}) \\implies t \\approx ${roundSigFigs(halfOrDoubleT, 3)}\\text{ ${ctx.unit}}$.`,
      },
    ],
    commonPitfalls: [
      'Dividing by $Q(0)$ wrongly or using $\\log_{10}$ instead of $\\ln$.',
      'Rounding $e^{kt}$ early before solving part (b).',
    ],
    isDailyEligible: true,
  };
}

function genCompositeInverse(rng: SeededRng, idx: number): QuestionItem {
  const m = rng.pick([2, 3, 4]);
  const c = rng.int(1, 7);
  const k = rng.int(1, 5);
  const x0 = rng.int(2, 6);
  const gx0 = x0 * x0 + k;
  const fgx0 = m * gx0 - c;
  // Inverse of f(x) = mx - c is (x + c)/m
  const invInput = m * rng.int(2, 8) - c;
  const invAns = (invInput + c) / m;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.5',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Find',
    stemMarkdown: `Let $f(x) = ${m}x - ${c}$ and $g(x) = x^2 + ${k}$ for $x \\in \\mathbb{R}$. Find $(f \\circ g)(${x0})$ and determine $f^{-1}(${invInput})$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Evaluates $g(${x0}) = ${x0}^2 + ${k} = ${gx0}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `$(f \\circ g)(${x0}) = f(${gx0}) = ${fgx0}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Finds $f^{-1}(x) = \\frac{x + ${c}}{${m}}$ or solves $${m}x - ${c} = ${invInput}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `$f^{-1}(${invInput}) = ${invAns}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Evaluate composite from right to left',
        explanationMarkdown: `$g(${x0}) = ${gx0}$, then $f(${gx0}) = ${m}(${gx0}) - ${c} = ${fgx0}$.`,
      },
      {
        stepNumber: 2,
        title: 'Invert $f(x)$',
        explanationMarkdown: `Swapping $x$ and $y$ in $y = ${m}x - ${c}$ gives $f^{-1}(x) = \\frac{x + ${c}}{${m}}$, so $f^{-1}(${invInput}) = ${invAns}$.`,
      },
    ],
    commonPitfalls: [
      'Evaluating $(g \\circ f)(x)$ instead of $(f \\circ g)(x)$.',
      'Confusing $f^{-1}(x)$ with reciprocal $\\frac{1}{f(x)}$.',
    ],
    isDailyEligible: true,
  };
}

/* ----------------------------- TOPIC 3: GEOMETRY & TRIG (WITH DIAGRAMS) ----------------------------- */

function genTriangleSineCosine(rng: SeededRng, idx: number): QuestionItem {
  const aSide = rng.int(7, 15);
  const bSide = rng.int(6, 14);
  const angleC = rng.pick([38, 46, 54, 62, 74, 108, 118]);
  const radC = (angleC * Math.PI) / 180;
  const cSide = Math.sqrt(aSide * aSide + bSide * bSide - 2 * aSide * bSide * Math.cos(radC));
  const area = 0.5 * aSide * bSide * Math.sin(radC);

  // Build valid 2D coordinates inside viewBox [0,0,360,230]
  const ax = 55;
  const ay = 185;
  const scale = 210 / Math.max(aSide, bSide, cSide);
  const bx = Math.round(ax + aSide * scale);
  const by = ay;
  const cx = Math.round(ax + bSide * scale * Math.cos(radC));
  const cy = Math.round(ay - bSide * scale * Math.sin(radC));

  const diagram: MathDiagramSpec = {
    kind: 'geometry_figure',
    title: `Triangle ABC (not to scale)`,
    viewBox: [0, 0, 360, 230],
    vertices: [
      { id: 'A', x: ax, y: ay, label: 'A', note: `∠A = ${angleC}°` },
      { id: 'B', x: bx, y: by, label: 'B' },
      { id: 'C', x: cx, y: cy, label: 'C' },
    ],
    segments: [
      { from: 'A', to: 'B', label: `${aSide} cm` },
      { from: 'A', to: 'C', label: `${bSide} cm` },
      { from: 'B', to: 'C', label: 'BC = ?' },
    ],
    polygons: [{ vertexIds: ['A', 'B', 'C'] }],
    angleArcs: [{ vertex: 'A', armA: 'B', armB: 'C', label: `${angleC}°` }],
  };

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-3',
    subtopicCode: 'SL 3.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Calculate',
    stemMarkdown: `In $\\triangle ABC$ shown below, $AB = ${aSide}\\text{ cm}$, $AC = ${bSide}\\text{ cm}$, and $\\angle BAC = ${angleC}^\\circ$. Calculate (a) the length $BC$, and (b) the area of $\\triangle ABC$, each to $3$ significant figures.`,
    diagramSpec: diagram,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Applies Cosine Rule: $BC^2 = ${aSide}^2 + ${bSide}^2 - 2(${aSide})(${bSide})\\cos(${angleC}^\\circ)$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `$BC \\approx ${roundSigFigs(cSide, 3)}\\text{ cm}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Area $= \\frac{1}{2}(${aSide})(${bSide})\\sin(${angleC}^\\circ)$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Area $\\approx ${roundSigFigs(area, 3)}\\text{ cm}^2$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Ensure GDC is in Degree mode and apply Cosine Rule',
        explanationMarkdown: `$BC^2 = ${aSide * aSide + bSide * bSide} - ${2 * aSide * bSide}\\cos(${angleC}^\\circ) \\implies BC \\approx ${roundSigFigs(cSide, 3)}\\text{ cm}$.`,
      },
      {
        stepNumber: 2,
        title: 'Calculate triangle area using two sides and included angle',
        explanationMarkdown: `$\\text{Area} = \\frac{1}{2}(${aSide})(${bSide})\\sin(${angleC}^\\circ) \\approx ${roundSigFigs(area, 3)}\\text{ cm}^2$.`,
      },
    ],
    commonPitfalls: [
      'Leaving the GDC in Radian mode when given angles in degrees.',
      'Forgetting the square root after computing $BC^2$.',
    ],
    isDailyEligible: true,
  };
}

function genSectorSegment(rng: SeededRng, idx: number): QuestionItem {
  const r = rng.int(5, 14);
  const thetaDeg = rng.pick([45, 60, 72, 90, 108, 120, 135]);
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const arcLen = r * thetaRad;
  const sectorArea = 0.5 * r * r * thetaRad;
  const segmentArea = 0.5 * r * r * (thetaRad - Math.sin(thetaRad));

  const cx = 150;
  const cy = 145;
  const pr = 78;
  const endX = Math.round(cx + pr * Math.cos(thetaRad));
  const endY = Math.round(cy - pr * Math.sin(thetaRad));

  const diagram: MathDiagramSpec = {
    kind: 'geometry_figure',
    title: `Circle Sector (r = ${r} cm, θ = ${thetaRad.toFixed(2)} rad)`,
    viewBox: [0, 0, 320, 240],
    vertices: [
      { id: 'O', x: cx, y: cy, label: 'O', note: `Centre · r = ${r} cm` },
      { id: 'A', x: cx + pr, y: cy, label: 'A' },
      { id: 'B', x: endX, y: endY, label: 'B' },
    ],
    segments: [
      { from: 'O', to: 'A', label: `${r} cm` },
      { from: 'O', to: 'B', label: `${r} cm` },
      { from: 'A', to: 'B', label: 'chord AB', dashed: true },
    ],
    angleArcs: [
      { vertex: 'O', armA: 'A', armB: 'B', label: `${thetaDeg}°`, highlight: true },
    ],
    circles: [
      {
        cx,
        cy,
        r: pr,
        sectorStartDeg: 0,
        sectorEndDeg: thetaDeg,
      },
    ],
  };

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-3',
    subtopicCode: 'SL 3.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Calculate',
    stemMarkdown: `A circle with centre $O$ and radius $r = ${r}\\text{ cm}$ contains sector $OAB$ with central angle $\\theta = ${thetaDeg}^\\circ$. Calculate (a) the arc length $AB$, and (b) the area of the minor segment shaded between chord $AB$ and arc $AB$, to $3$ significant figures.`,
    diagramSpec: diagram,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Converts $\\theta$ to radians: $\\theta = ${thetaDeg}^\\circ \\times \\frac{\\pi}{180} \\approx ${roundSigFigs(thetaRad, 4)}\\text{ rad}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Arc length $l = r\\theta \\approx ${roundSigFigs(arcLen, 3)}\\text{ cm}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Segment area $= \\text{Sector} - \\text{Triangle} = \\frac{1}{2}r^2(\\theta - \\sin\\theta)$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Segment area $\\approx ${roundSigFigs(segmentArea, 3)}\\text{ cm}^2$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Convert angle to radians and find arc length',
        explanationMarkdown: `$\\theta = \\frac{${thetaDeg}\\pi}{180} \\approx ${thetaRad.toFixed(4)}\\text{ rad}$, so $l = r\\theta \\approx ${roundSigFigs(arcLen, 3)}\\text{ cm}$.`,
      },
      {
        stepNumber: 2,
        title: 'Subtract $\\triangle OAB$ from sector $OAB$',
        explanationMarkdown: `Sector area $= ${sectorArea.toFixed(3)}\\text{ cm}^2$, triangle area $= \\frac{1}{2}(${r})^2\\sin(${thetaDeg}^\\circ) = ${(sectorArea - segmentArea).toFixed(3)}\\text{ cm}^2$. Subtracting gives $${roundSigFigs(segmentArea, 3)}\\text{ cm}^2$.`,
      },
    ],
    commonPitfalls: [
      'Plugging degrees directly into $l = r\\theta$ or $A = \\frac{1}{2}r^2\\theta$ without converting to radians.',
      'Computing the whole sector area when the question asks for the minor segment.',
    ],
    isDailyEligible: true,
  };
}

function genUnitCircleExact(rng: SeededRng, idx: number): QuestionItem {
  const cases = [
    { label: '\\frac{\\pi}{6}', rawLabel: 'π/6', rad: Math.PI / 6, sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}' },
    { label: '\\frac{\\pi}{4}', rawLabel: 'π/4', rad: Math.PI / 4, sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1' },
    { label: '\\frac{\\pi}{3}', rawLabel: 'π/3', rad: Math.PI / 3, sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}' },
    { label: '\\frac{2\\pi}{3}', rawLabel: '2π/3', rad: (2 * Math.PI) / 3, sin: '\\frac{\\sqrt{3}}{2}', cos: '-\\frac{1}{2}', tan: '-\\sqrt{3}' },
    { label: '\\frac{3\\pi}{4}', rawLabel: '3π/4', rad: (3 * Math.PI) / 4, sin: '\\frac{\\sqrt{2}}{2}', cos: '-\\frac{\\sqrt{2}}{2}', tan: '-1' },
    { label: '\\frac{5\\pi}{6}', rawLabel: '5π/6', rad: (5 * Math.PI) / 6, sin: '\\frac{1}{2}', cos: '-\\frac{\\sqrt{3}}{2}', tan: '-\\frac{1}{\\sqrt{3}}' },
    { label: '\\frac{7\\pi}{6}', rawLabel: '7π/6', rad: (7 * Math.PI) / 6, sin: '-\\frac{1}{2}', cos: '-\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}' },
    { label: '\\frac{5\\pi}{4}', rawLabel: '5π/4', rad: (5 * Math.PI) / 4, sin: '-\\frac{\\sqrt{2}}{2}', cos: '-\\frac{\\sqrt{2}}{2}', tan: '1' },
    { label: '\\frac{4\\pi}{3}', rawLabel: '4π/3', rad: (4 * Math.PI) / 3, sin: '-\\frac{\\sqrt{3}}{2}', cos: '-\\frac{1}{2}', tan: '\\sqrt{3}' },
    { label: '\\frac{5\\pi}{3}', rawLabel: '5π/3', rad: (5 * Math.PI) / 3, sin: '-\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '-\\sqrt{3}' },
    { label: '\\frac{7\\pi}{4}', rawLabel: '7π/4', rad: (7 * Math.PI) / 4, sin: '-\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '-1' },
    { label: '\\frac{11\\pi}{6}', rawLabel: '11π/6', rad: (11 * Math.PI) / 6, sin: '-\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '-\\frac{1}{\\sqrt{3}}' },
  ] as const;

  // Alternate between exact evaluation (with coterminal shifts) and solving trig equations on [0, 2π]
  if (idx % 2 === 1) {
    const eqCases = [
      { eq: '2\\sin x = 1', ans: '\\frac{\\pi}{6},\\; \\frac{5\\pi}{6}', r1: Math.PI / 6, r2: (5 * Math.PI) / 6, l1: 'π/6', l2: '5π/6' },
      { eq: '2\\sin x = -1', ans: '\\frac{7\\pi}{6},\\; \\frac{11\\pi}{6}', r1: (7 * Math.PI) / 6, r2: (11 * Math.PI) / 6, l1: '7π/6', l2: '11π/6' },
      { eq: '2\\cos x = \\sqrt{3}', ans: '\\frac{\\pi}{6},\\; \\frac{11\\pi}{6}', r1: Math.PI / 6, r2: (11 * Math.PI) / 6, l1: 'π/6', l2: '11π/6' },
      { eq: '2\\cos x = -1', ans: '\\frac{2\\pi}{3},\\; \\frac{4\\pi}{3}', r1: (2 * Math.PI) / 3, r2: (4 * Math.PI) / 3, l1: '2π/3', l2: '4π/3' },
      { eq: '\\sqrt{2}\\sin x = 1', ans: '\\frac{\\pi}{4},\\; \\frac{3\\pi}{4}', r1: Math.PI / 4, r2: (3 * Math.PI) / 4, l1: 'π/4', l2: '3π/4' },
      { eq: '\\sqrt{2}\\cos x = -1', ans: '\\frac{3\\pi}{4},\\; \\frac{5\\pi}{4}', r1: (3 * Math.PI) / 4, r2: (5 * Math.PI) / 4, l1: '3π/4', l2: '5π/4' },
      { eq: '\\tan x = \\sqrt{3}', ans: '\\frac{\\pi}{3},\\; \\frac{4\\pi}{3}', r1: Math.PI / 3, r2: (4 * Math.PI) / 3, l1: 'π/3', l2: '4π/3' },
      { eq: '\\tan x = -1', ans: '\\frac{3\\pi}{4},\\; \\frac{7\\pi}{4}', r1: (3 * Math.PI) / 4, r2: (7 * Math.PI) / 4, l1: '3π/4', l2: '7π/4' },
    ] as const;
    const eqc = eqCases[(idx >> 1) % eqCases.length];
    const mult = rng.int(1, 9);
    const domainMax = mult % 2 === 0 ? '2\\pi' : '2\\pi';
    const shiftTerm = mult * 2;
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-3',
      subtopicCode: 'SL 3.8',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Solve',
      stemMarkdown: `On the interval $0 \\le x \\le ${domainMax}$, solve the trigonometric equation $${eqc.eq}$ (equivalently $${shiftTerm} \\cdot (${eqc.eq.split('=')[0].trim()}) = ${shiftTerm} \\cdot (${eqc.eq.split('=')[1].trim()})$), giving all exact solutions in radians.`,
      diagramSpec: {
        kind: 'unit_circle',
        title: `Solutions on [0, 2π]`,
        targetAnglesRad: [eqc.r1, eqc.r2],
        angleLabels: [eqc.l1, eqc.l2],
        showExactValues: false,
        questionMode: 'solve_trig',
      },
      markschemePoints: [
        { pointId: 'M1', requirement: `Isolates trig ratio and identifies reference angle`, marks: 2 },
        { pointId: 'A1', requirement: `Exact solutions $x = ${eqc.ans}$`, marks: 2 },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Isolate the trigonometric function',
          explanationMarkdown: `Divide through by $${shiftTerm}$ to recover $${eqc.eq}$ and locate both matching quadrants on the unit circle.`,
        },
        {
          stepNumber: 2,
          title: 'List all exact solutions in $[0, 2\\pi]$',
          explanationMarkdown: `Reading both angles counterclockwise gives $x = ${eqc.ans}$.`,
        },
      ],
      commonPitfalls: ['Giving only the principal angle and missing the second quadrant solution in $[0, 2\\pi]$.'],
      isDailyEligible: true,
    };
  }

  const c = cases[idx % cases.length];
  const fnType = (['sin', 'cos', 'tan'] as const)[Math.floor(idx / cases.length) % 3];
  const ans = c[fnType];
  const kTurn = rng.int(1, 20);
  const cotermExpr = `${c.label} + ${2 * kTurn}\\pi`;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-3',
    subtopicCode: 'SL 3.5',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Find',
    stemMarkdown: `Using periodicity on the unit circle, find the exact value of $\\${fnType}\\left(${cotermExpr}\\right)$.`,
    diagramSpec: {
      kind: 'unit_circle',
      title: `Coterminal Angle with ${c.rawLabel}`,
      targetAnglesRad: [c.rad],
      angleLabels: [c.rawLabel],
      showExactValues: false,
      questionMode: 'angle_value',
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Reduces coterminal angle modulo $2\\pi$ to $${c.label}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Exact value $${ans}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Subtract integer multiples of $2\\pi$',
        explanationMarkdown: `Since $\\${fnType}$ is $2\\pi$-periodic (and $\\tan$ is $\\pi$-periodic), $\\${fnType}(${cotermExpr}) = \\${fnType}(${c.label})$.`,
      },
      {
        stepNumber: 2,
        title: 'Evaluate using CAST and special triangles',
        explanationMarkdown: `The exact value is $${ans}$.`,
      },
    ],
    commonPitfalls: [
      'Assigning the wrong CAST quadrant sign.',
      'Confusing $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$ special ratios.',
    ],
    isDailyEligible: true,
  };
}

function genSinusoidalWave(rng: SeededRng, idx: number): QuestionItem {
  const ctx = rng.pick(TRIG_WAVE_CONTEXTS);
  const amp = rng.int(2, 8);
  const mid = amp + rng.int(2, 10);
  const period = rng.pick([6, 8, 10, 12, 24]);
  const bStr = formatFracLatex(2, period) + '\\pi';
  const bNum = (2 * Math.PI) / period;
  const tEval = rng.int(1, period - 1);
  const yEval = mid + amp * Math.sin(bNum * tEval);

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-3',
    subtopicCode: 'SL 3.7',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Determine',
    stemMarkdown: `The ${ctx.noun} $H(t)$ (in ${ctx.yUnit}) at time $t$ (${ctx.xUnit}) is modeled by $H(t) = ${amp}\\sin\\left(${bStr}\\,t\\right) + ${mid}$ for $0 \\le t \\le ${period}$, graphed below. State the maximum and minimum values, determine the period, and calculate $H(${tEval})$ to $3$ significant figures.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Sinusoidal Model H(t)`,
      xRange: [0, period],
      yRange: [Math.max(0, mid - amp - 2), mid + amp + 2],
      xLabel: `t (${ctx.xUnit})`,
      yLabel: `H (${ctx.yUnit})`,
      functions: [
        {
          id: 'wave',
          expr: `${amp}*sin(${bNum.toFixed(6)}*x) + ${mid}`,
          label: 'H(t)',
        },
      ],
      keyPoints: [
        { x: period / 4, y: mid + amp, label: `Max (${period / 4}, ${mid + amp})` },
        { x: (3 * period) / 4, y: mid - amp, label: `Min (${(3 * period) / 4}, ${mid - amp})` },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Maximum $= ${mid + amp}\\text{ ${ctx.yUnit}}$, minimum $= ${mid - amp}\\text{ ${ctx.yUnit}}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Period $T = \\frac{2\\pi}{${bStr}} = ${period}\\text{ ${ctx.xUnit}}$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Evaluates $H(${tEval})$ in Radian mode`,
        marks: 1,
      },
      {
        pointId: 'A3',
        requirement: `$H(${tEval}) \\approx ${roundSigFigs(yEval, 3)}\\text{ ${ctx.yUnit}}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Read amplitude and midline',
        explanationMarkdown: `Amplitude $a = ${amp}$ and vertical shift $d = ${mid}$ yield $\\max = ${mid + amp}$ and $\\min = ${mid - amp}$.`,
      },
      {
        stepNumber: 2,
        title: 'Compute period and evaluate in radians',
        explanationMarkdown: `$T = \\frac{2\\pi}{b} = ${period}\\text{ ${ctx.xUnit}}$, and $H(${tEval}) = ${amp}\\sin(${bStr} \\times ${tEval}) + ${mid} \\approx ${roundSigFigs(yEval, 3)}$.`,
      },
    ],
    commonPitfalls: [
      'Evaluating $\\sin(bt)$ in Degree mode instead of Radian mode.',
      'Confusing the frequency coefficient $b$ with the period $T = \\frac{2\\pi}{b}$.',
    ],
    isDailyEligible: true,
  };
}

function genTrigDoubleAngle(rng: SeededRng, idx: number): QuestionItem {
  const triples: Array<[number, number, number]> = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
    [9, 40, 41],
    [11, 60, 61],
    [12, 35, 37],
    [20, 21, 29],
    [13, 84, 85],
    [15, 112, 113],
  ];
  const [rawOpp, rawAdj, rawHyp] = triples[idx % triples.length];
  const swapLegs = Math.floor(idx / triples.length) % 2 === 1;
  const opp = swapLegs ? rawAdj : rawOpp;
  const adj = swapLegs ? rawOpp : rawAdj;
  const hyp = rawHyp;
  const quad = (Math.floor(idx / (triples.length * 2)) % 2) === 1 ? 'Q2' : 'Q1';
  const obtuse = quad === 'Q2';
  const cosSign = obtuse ? -1 : 1;
  const scaleK = rng.int(1, 5);
  const sin2Num = 2 * opp * adj * cosSign;
  const sin2Den = hyp * hyp;
  const cos2Num = adj * adj - opp * opp;
  const askCombo = idx % 3 === 0;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-3',
    subtopicCode: 'SL 3.6',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `Given that $\\sin\\theta = \\frac{${opp}}{${hyp}}$ and $${obtuse ? '\\frac{\\pi}{2} < \\theta < \\pi' : '0 < \\theta < \\frac{\\pi}{2}'}$, find the exact value${askCombo ? ` of $${scaleK}\\sin 2\\theta + \\cos 2\\theta$` : 's of $\\sin 2\\theta$ and $\\cos 2\\theta$'}.`,
    diagramSpec: {
      kind: 'unit_circle',
      title: obtuse ? `Quadrant II Angle (${opp}/${hyp})` : `Quadrant I Angle (${opp}/${hyp})`,
      targetAnglesRad: [obtuse ? Math.PI - Math.asin(opp / hyp) : Math.asin(opp / hyp)],
      angleLabels: ['θ'],
      showExactValues: false,
      questionMode: 'solve_trig',
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Uses $\\sin^2\\theta + \\cos^2\\theta = 1$ to find $\\cos\\theta = ${formatFracLatex(cosSign * adj, hyp)}$`,
        marks: 2,
      },
      {
        pointId: 'M2',
        requirement: `Applies $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = ${formatFracLatex(sin2Num, sin2Den)}$ and $\\cos 2\\theta = 1 - 2\\sin^2\\theta = ${formatFracLatex(cos2Num, sin2Den)}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: askCombo
          ? `Combines to exact value $${formatFracLatex(scaleK * sin2Num + cos2Num, sin2Den)}$`
          : `Exact values $\\sin 2\\theta = ${formatFracLatex(sin2Num, sin2Den)}$, $\\cos 2\\theta = ${formatFracLatex(cos2Num, sin2Den)}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Determine $\\cos\\theta$ with correct quadrant sign',
        explanationMarkdown: `Using the ${opp}-${adj}-${hyp} right triangle in ${quad}, $\\cos\\theta = ${formatFracLatex(cosSign * adj, hyp)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Apply double-angle identities',
        explanationMarkdown: `$\\sin 2\\theta = ${formatFracLatex(sin2Num, sin2Den)}$ and $\\cos 2\\theta = ${formatFracLatex(cos2Num, sin2Den)}$${askCombo ? `, so $${scaleK}\\sin 2\\theta + \\cos 2\\theta = ${formatFracLatex(scaleK * sin2Num + cos2Num, sin2Den)}$` : ''}.`,
      },
    ],
    commonPitfalls: [
      'Taking the positive square root for $\\cos\\theta$ when $\\theta$ lies in Quadrant II.',
      'Computing $\\sin 2\\theta$ as $2\\sin\\theta$ instead of $2\\sin\\theta\\cos\\theta$.',
    ],
    isDailyEligible: true,
  };
}

/* ----------------------------- TOPIC 4: STATS & PROBABILITY (WITH DIAGRAMS) ----------------------------- */

function genProbabilityTree(rng: SeededRng, idx: number): QuestionItem {
  const red = rng.int(3, 6);
  const blue = rng.int(3, 7);
  const total = red + blue;
  // Two draws without replacement
  const pRR_num = red * (red - 1);
  const pBB_num = blue * (blue - 1);
  const denom = total * (total - 1);
  const pSameNum = pRR_num + pBB_num;
  const pDiffNum = 2 * red * blue;
  const askCond = idx % 2 === 1;

  const diagram: MathDiagramSpec = {
    kind: 'probability_tree',
    title: `Two Draws Without Replacement (${red} Red, ${blue} Blue)`,
    rootLabel: 'Bag',
    branches: [
      {
        label: 'Red',
        probDisplay: `${red}/${total}`,
        probValue: red / total,
        children: [
          { label: 'Red', probDisplay: `${red - 1}/${total - 1}`, probValue: (red - 1) / (total - 1) },
          { label: 'Blue', probDisplay: `${blue}/${total - 1}`, probValue: blue / (total - 1) },
        ],
      },
      {
        label: 'Blue',
        probDisplay: `${blue}/${total}`,
        probValue: blue / total,
        children: [
          { label: 'Red', probDisplay: `${red}/${total - 1}`, probValue: red / (total - 1) },
          { label: 'Blue', probDisplay: `${blue - 1}/${total - 1}`, probValue: (blue - 1) / (total - 1) },
        ],
      },
    ],
  };

  if (askCond) {
    // P(First Red | Second Red) = P(RR) / P(second Red) = pRR_num / (red*(red-1) + blue*red) = (red-1)/(total-1)
    const condAns = formatFracLatex(red - 1, total - 1);
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-4',
      subtopicCode: 'SL 4.11',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 5,
      commandTerm: 'Find',
      stemMarkdown: `A bag contains $${red}$ red marbles and $${blue}$ blue marbles. Two marbles are drawn sequentially without replacement, as shown in the interactive tree diagram. Find the exact probability that (a) the two marbles are different colours, and (b) the first marble was red given that the second marble is red.`,
      diagramSpec: diagram,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Sums paths $RB + BR = \\frac{${red}}{${total}} \\cdot \\frac{${blue}}{${total - 1}} + \\frac{${blue}}{${total}} \\cdot \\frac{${red}}{${total - 1}}$`,
          marks: 2,
        },
        {
          pointId: 'A1',
          requirement: `Different colours probability $= ${formatFracLatex(pDiffNum, denom)}$`,
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement: `Applies $P(R_1 \\mid R_2) = \\frac{P(R_1 \\cap R_2)}{P(R_1 \\cap R_2) + P(B_1 \\cap R_2)}$`,
          marks: 1,
        },
        {
          pointId: 'A2',
          requirement: `$P(R_1 \\mid R_2) = ${condAns}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Highlight the RB and BR paths',
          explanationMarkdown: `Click the Red → Blue and Blue → Red leaves on the diagram: $P(\\text{diff}) = \\frac{2 \\times ${red} \\times ${blue}}{${total} \\times ${total - 1}} = ${formatFracLatex(pDiffNum, denom)}$.`,
        },
        {
          stepNumber: 2,
          title: 'Compute conditional probability using total probability',
          explanationMarkdown: `$P(R_2) = \\frac{${red}(${red - 1}) + ${blue}(${red})}{${denom}} = \\frac{${red}}{${total}}$, so $P(R_1 \\mid R_2) = \\frac{${pRR_num}/${denom}}{${red}/${total}} = ${condAns}$.`,
        },
      ],
      commonPitfalls: [
        'Forgetting to decrement the denominator to $n - 1$ on the second stage (sampling without replacement).',
        'Including only one ordering ($RB$) when calculating "different colours".',
      ],
      isDailyEligible: true,
    };
  }

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.6',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 4,
    commandTerm: 'Find',
    stemMarkdown: `A box holds $${red}$ red counters and $${blue}$ blue counters. Two counters are drawn at random without replacement. Using the interactive probability tree, find the exact probability that both counters have the same colour.`,
    diagramSpec: diagram,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Multiplies along $RR$ and $BB$: $\\frac{${red}}{${total}} \\cdot \\frac{${red - 1}}{${total - 1}} + \\frac{${blue}}{${total}} \\cdot \\frac{${blue - 1}}{${total - 1}}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Adds branch products: $\\frac{${pRR_num} + ${pBB_num}}{${denom}}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Simplified probability $= ${formatFracLatex(pSameNum, denom)}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Multiply along each matching branch',
        explanationMarkdown: `$P(RR) = \\frac{${pRR_num}}{${denom}}$ and $P(BB) = \\frac{${pBB_num}}{${denom}}$.`,
      },
      {
        stepNumber: 2,
        title: 'Sum mutually exclusive outcomes',
        explanationMarkdown: `$P(\\text{same}) = \\frac{${pSameNum}}{${denom}} = ${formatFracLatex(pSameNum, denom)}$.`,
      },
    ],
    commonPitfalls: [
      'Treating the draws as independent (keeping denominator constant).',
    ],
    isDailyEligible: true,
  };
}

function genVennDiagramProb(rng: SeededRng, idx: number): QuestionItem {
  const vennPairs = [
    ['study Chemistry', 'study Biology'],
    ['play an instrument', 'play a team sport'],
    ['commute by train', 'commute by bicycle'],
    ['speak French', 'speak Spanish'],
    ['use the robotics lab', 'use the darkroom'],
    ['drink coffee', 'drink tea'],
  ] as const;
  const [labelA, labelB] = rng.pick(vennPairs);
  const aOnly = rng.int(10, 35) / 100;
  const both = rng.int(6, 24) / 100;
  const bOnly = rng.int(10, 32) / 100;
  const outside = Number((1 - aOnly - both - bOnly).toFixed(2));
  const pA = Number((aOnly + both).toFixed(2));
  const pB = Number((bOnly + both).toFixed(2));
  const pUnion = Number((aOnly + both + bOnly).toFixed(2));
  const pAplusB = Number((pA * pB).toFixed(4));
  const isIndep = Math.abs(both - pAplusB) < 1e-6;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.6',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Determine',
    stemMarkdown: `In a survey, event $A$ denotes students who ${labelA} and event $B$ denotes students who ${labelB}, with probabilities shown in the Venn diagram. (a) Find $P(A \\cup B)$ and $P(A \\mid B)$. (b) Determine whether events $A$ and $B$ are independent.`,
    diagramSpec: {
      kind: 'venn_diagram',
      title: 'Probability Venn Diagram (Events A and B)',
      universeLabel: 'U',
      setALabel: 'A',
      setBLabel: 'B',
      regions: {
        aOnly: aOnly.toFixed(2),
        intersection: both.toFixed(2),
        bOnly: bOnly.toFixed(2),
        outside: outside.toFixed(2),
      },
      highlightRegion: 'none',
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `$P(A \\cup B) = ${aOnly.toFixed(2)} + ${both.toFixed(2)} + ${bOnly.toFixed(2)} = ${pUnion.toFixed(2)}$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Computes $P(B) = ${pB.toFixed(2)}$ and applies $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${both.toFixed(2)}}{${pB.toFixed(2)}}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `$P(A \\mid B) \\approx ${roundSigFigs(both / pB, 3)}$`,
        marks: 1,
      },
      {
        pointId: 'R1',
        requirement: `Compares $P(A)P(B) = ${pA.toFixed(2)} \\times ${pB.toFixed(2)} = ${pAplusB.toFixed(4)}$ with $P(A \\cap B) = ${both.toFixed(2)}$ to conclude ${isIndep ? 'independent' : 'not independent'}`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Inspect Venn regions',
        explanationMarkdown: `Click the regions on the interactive Venn diagram: $P(A) = ${pA.toFixed(2)}$, $P(B) = ${pB.toFixed(2)}$, $P(A \\cup B) = ${pUnion.toFixed(2)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Test independence formally',
        explanationMarkdown: `$P(A \\mid B) = \\frac{${both.toFixed(2)}}{${pB.toFixed(2)}} \\approx ${roundSigFigs(both / pB, 3)}$. Since $P(A)P(B) = ${pAplusB.toFixed(4)} ${isIndep ? '=' : '\\neq'} ${both.toFixed(2)}$, the events are ${isIndep ? 'independent' : 'not independent'}.`,
      },
    ],
    commonPitfalls: [
      'Confusing "mutually exclusive" ($P(A \\cap B) = 0$) with "independent" ($P(A \\cap B) = P(A)P(B)$).',
      'Dividing by $P(A)$ instead of $P(B)$ in $P(A \\mid B)$.',
    ],
    isDailyEligible: true,
  };
}

function genNormalDistribution(rng: SeededRng, idx: number): QuestionItem {
  const ctx = rng.pick(NORMAL_CONTEXTS);
  const mean = rng.int(40, 120);
  const sd = rng.int(3, 12);
  const zLow = rng.pick([-1.5, -1.2, -0.8, 0.4]);
  const zHigh = rng.pick([1.0, 1.4, 1.8, 2.1]);
  const xLow = Number((mean + zLow * sd).toFixed(1));
  const xHigh = Number((mean + zHigh * sd).toFixed(1));
  const prob = normalCdf(xHigh, mean, sd) - normalCdf(xLow, mean, sd);
  const probTail = 1 - normalCdf(xHigh, mean, sd);

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.9',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Find',
    stemMarkdown: `The ${ctx.measure} $X$ (in ${ctx.unit}) of ${ctx.item} follows a normal distribution $X \\sim \\text{N}(${mean}, ${sd}^2)$, illustrated below. Find (a) $P(${xLow} < X < ${xHigh})$ and (b) $P(X > ${xHigh})$, each to $3$ significant figures.`,
    diagramSpec: {
      kind: 'normal_curve',
      title: `Normal Distribution X ~ N(${mean}, ${sd}²)`,
      mean,
      sd,
      variableName: 'X',
      shadedIntervals: [{ from: xLow, to: xHigh, label: `${xLow} < X < ${xHigh}` }],
      markers: [
        { x: xLow, label: `${xLow}` },
        { x: xHigh, label: `${xHigh}` },
      ],
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Recognizes $X \\sim \\text{N}(${mean}, ${sd}^2)$ and computes $z$-scores $z_1 = ${zLow}, z_2 = ${zHigh}$ (or uses GDC normalcdf)`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `$P(${xLow} < X < ${xHigh}) \\approx ${roundSigFigs(prob, 3)}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `$P(X > ${xHigh}) \\approx ${roundSigFigs(probTail, 3)}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Standardize or use GDC normalcdf',
        explanationMarkdown: `Scrub the interactive curve to check $z$-scores: $z_1 = \\frac{${xLow} - ${mean}}{${sd}} = ${zLow}$ and $z_2 = ${zHigh}$.`,
      },
      {
        stepNumber: 2,
        title: 'Report probabilities to 3 significant figures',
        explanationMarkdown: `$P(${xLow} < X < ${xHigh}) \\approx ${roundSigFigs(prob, 3)}$ and upper tail $P(X > ${xHigh}) \\approx ${roundSigFigs(probTail, 3)}$.`,
      },
    ],
    commonPitfalls: [
      'Entering variance $\\sigma^2$ instead of standard deviation $\\sigma = ' + sd + '$ into the GDC.',
    ],
    isDailyEligible: true,
  };
}

function genScatterRegression(rng: SeededRng, idx: number): QuestionItem {
  const ctx = rng.pick(STATS_CONTEXTS);
  const slope = rng.pick([2.5, 3.2, 4.0, 5.5, 6.2]);
  const intercept = rng.int(12, 35);
  const xs = [2, 4, 6, 8, 10, 12];
  const points = xs.map((x, k) => {
    const jitter = ((k + idx) % 3 - 1) * 2;
    return { x, y: Number((slope * x + intercept + jitter).toFixed(1)) };
  });
  const xBar = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yBar = points.reduce((a, p) => a + p.y, 0) / points.length;
  const xPred = 7;
  const yPred = slope * xPred + intercept;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.4',
    paper: 'Paper 2',
    questionType: 'data_based',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Estimate',
    stemMarkdown: `The scatter plot displays measurements of ${ctx.xName} ($x$ in ${ctx.xUnit}) and ${ctx.yName} ($y$ in ${ctx.yUnit}), with regression line $y = ${slope}x + ${intercept}$. (a) State the mean point $(\\bar{x}, \\bar{y})$ through which the regression line passes if $\\bar{x} = ${xBar}$. (b) Estimate $y$ when $x = ${xPred}$, and comment on the reliability of using this line to predict $y$ at $x = 30$.`,
    diagramSpec: {
      kind: 'stats_plot',
      subtype: 'scatter_regression',
      title: `${ctx.yName} vs ${ctx.xName}`,
      xLabel: `${ctx.xName} (${ctx.xUnit})`,
      yLabel: `${ctx.yName} (${ctx.yUnit})`,
      points,
      regressionLine: { slope, intercept, label: `y = ${slope}x + ${intercept}` },
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Mean point $(\\bar{x}, \\bar{y}) = (${xBar}, ${(slope * xBar + intercept).toFixed(1)})$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Substitutes $x = ${xPred}$ into $y = ${slope}x + ${intercept}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Estimated $y = ${yPred.toFixed(1)}\\text{ ${ctx.yUnit}}$`,
        marks: 1,
      },
      {
        pointId: 'R1',
        requirement: `States prediction at $x = 30$ is unreliable because it is extrapolation well beyond $[2, 12]$`,
        marks: 2,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Recall centroid property',
        explanationMarkdown: `Every least-squares regression line passes through $(\\bar{x}, \\bar{y})$. At $\\bar{x} = ${xBar}$, $\\bar{y} = ${slope}(${xBar}) + ${intercept} = ${(slope * xBar + intercept).toFixed(1)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Evaluate interpolation vs extrapolation',
        explanationMarkdown: `$x = ${xPred}$ lies inside $[2, 12]$ (reliable interpolation giving $${yPred.toFixed(1)}$), whereas $x = 30$ is far outside the observed domain (unreliable extrapolation).`,
      },
    ],
    commonPitfalls: [
      'Calling $x = 30$ reliable without noting extrapolation outside the data range.',
    ],
    isDailyEligible: true,
  };
}

function genBinomialProb(rng: SeededRng, idx: number): QuestionItem {
  const n = rng.int(8, 15);
  const p = rng.pick([0.15, 0.2, 0.25, 0.3, 0.35, 0.4]);
  const k = rng.int(2, Math.min(5, n - 2));
  const exactP = binomialPmf(n, k, p);
  let atLeastP = 0;
  for (let i = k; i <= n; i++) atLeastP += binomialPmf(n, i, p);

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.8',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'gdc_required',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `A discrete random variable $X \\sim \\text{B}(${n}, ${p})$ models the number of defective sensors in a batch of $${n}$. Calculate (a) $P(X = ${k})$ and (b) $P(X \\ge ${k})$, giving answers to $3$ significant figures.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Uses $\\binom{${n}}{${k}}(${p})^{${k}}(${(1 - p).toFixed(2)})^{${n - k}}$ or binomPdf`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `$P(X = ${k}) \\approx ${roundSigFigs(exactP, 3)}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Applies complement $P(X \\ge ${k}) = 1 - P(X \\le ${k - 1})$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `$P(X \\ge ${k}) \\approx ${roundSigFigs(atLeastP, 3)}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Compute exact probability $P(X = k)$',
        explanationMarkdown: `$P(X = ${k}) = \\binom{${n}}{${k}}(${p})^{${k}}(${(1 - p).toFixed(2)})^{${n - k}} \\approx ${roundSigFigs(exactP, 3)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Use $1 - P(X \\le k - 1)$ for $P(X \\ge k)$',
        explanationMarkdown: `Subtracting ` + `binomCdf(${n}, ${p}, ${k - 1})` + ` from $1$ yields $${roundSigFigs(atLeastP, 3)}$.`,
      },
    ],
    commonPitfalls: [
      'Writing $1 - P(X \\le k)$ instead of $1 - P(X \\le k - 1)$ for $P(X \\ge k)$.',
    ],
    isDailyEligible: true,
  };
}

function genBoxPlotOutliers(rng: SeededRng, idx: number): QuestionItem {
  const metrics = [
    { label: 'reaction times', unit: 'ms', title: 'Reaction Time Summary' },
    { label: 'battery runtimes', unit: 'h', title: 'Battery Runtime Summary' },
    { label: 'commute distances', unit: 'km', title: 'Commute Distance Summary' },
    { label: 'seedling heights', unit: 'cm', title: 'Seedling Height Summary' },
    { label: 'daily screen durations', unit: 'min', title: 'Screen Time Summary' },
    { label: 'resting heart rates', unit: 'bpm', title: 'Resting Pulse Summary' },
  ] as const;
  const met = rng.pick(metrics);
  const min = rng.int(8, 30);
  const q1 = min + rng.int(6, 15);
  const median = q1 + rng.int(5, 14);
  const q3 = median + rng.int(6, 15);
  const iqr = q3 - q1;
  const upperFence = q3 + 1.5 * iqr;
  const max = Math.round(upperFence + rng.int(2, 12));

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-4',
    subtopicCode: 'SL 4.2',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 4,
    commandTerm: 'Determine',
    stemMarkdown: `The box-and-whisker diagram summarizes ${met.label} (${met.unit}) with $Q_1 = ${q1}$, $\\text{median} = ${median}$, $Q_3 = ${q3}$, and maximum reading $${max}$. Calculate the interquartile range $\\text{IQR}$ and determine whether $${max}$ qualifies as an upper outlier.`,
    diagramSpec: {
      kind: 'stats_plot',
      subtype: 'box_plot',
      title: `${met.title} (${met.unit})`,
      xLabel: `${met.unit}`,
      yLabel: 'Distribution',
      boxSummary: { min, q1, median, q3, max },
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `$\\text{IQR} = Q_3 - Q_1 = ${q3} - ${q1} = ${iqr}$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Computes upper outlier threshold $Q_3 + 1.5 \\times \\text{IQR} = ${q3} + ${1.5 * iqr} = ${upperFence}$`,
        marks: 2,
      },
      {
        pointId: 'R1',
        requirement: `Since $${max} > ${upperFence}$, states that $${max}$ IS an outlier`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Calculate IQR',
        explanationMarkdown: `$\\text{IQR} = ${q3} - ${q1} = ${iqr}\\text{ ms}$.`,
      },
      {
        stepNumber: 2,
        title: 'Apply IB $1.5 \\times \\text{IQR}$ outlier test',
        explanationMarkdown: `Upper fence $= ${q3} + 1.5(${iqr}) = ${upperFence}$. Because $${max} > ${upperFence}$, $${max}$ is an upper outlier.`,
      },
    ],
    commonPitfalls: [
      'Adding $1.5 \\times \\text{IQR}$ to the median instead of $Q_3$.',
    ],
    isDailyEligible: true,
  };
}

/* ----------------------------- TOPIC 5: CALCULUS (WITH DIAGRAMS) ----------------------------- */

function genTangentNormal(rng: SeededRng, idx: number): QuestionItem {
  const a = rng.pick([1, 2, -1]);
  const b = rng.int(-4, 4);
  const c = rng.int(-3, 5);
  const x0 = rng.pick([1, 2, -1, 3]);
  const y0 = a * x0 * x0 + b * x0 + c;
  const slope = 2 * a * x0 + b;
  const safeSlope = slope === 0 ? 2 : slope;
  const adjB = slope === 0 ? b + 2 : b;
  const safeY0 = a * x0 * x0 + adjB * x0 + c;
  const askNormal = idx % 2 === 1;
  const expr = `${a === 1 ? '' : a === -1 ? '-' : a}x^2${signedTerm(adjB, 'x')}${signedTerm(c, '')}`;
  const exprPlot = `${a}*x^2 + (${adjB})*x + (${c})`;

  const yInterceptTan = safeY0 - safeSlope * x0;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5a',
    subtopicCode: 'SL 5.4',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `Consider the curve $f(x) = ${expr}$ shown with its interactive tangent explorer. Find the exact equation of the ${askNormal ? 'normal' : 'tangent'} line to the curve at $x = ${x0}$.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Curve y = ${expr} at x = ${x0}`,
      xRange: [x0 - 4, x0 + 4],
      yRange: [Math.min(-6, safeY0 - 6), Math.max(8, safeY0 + 8)],
      xLabel: 'x',
      yLabel: 'f(x)',
      functions: [{ id: 'f', expr: exprPlot, label: `f(x) = ${expr}` }],
      tangentAtX: { fnIndex: 0, x: x0, label: `x = ${x0}` },
      keyPoints: [{ x: x0, y: safeY0, label: `P(${x0}, ${safeY0})` }],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `$y(${x0}) = ${safeY0}$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Differentiates $f'(x) = ${2 * a}x ${adjB >= 0 ? `+ ${adjB}` : `- ${-adjB}`}$ and evaluates $f'(${x0}) = ${safeSlope}$`,
        marks: 2,
      },
      {
        pointId: 'M2',
        requirement: askNormal
          ? `Finds normal gradient $m_{\\perp} = -\\frac{1}{f'(${x0})} = ${formatFracLatex(-1, safeSlope)}$`
          : `Substitutes point $(${x0}, ${safeY0})$ and gradient $${safeSlope}$ into point-slope form`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: askNormal
          ? `Equation: $y - (${safeY0}) = ${formatFracLatex(-1, safeSlope)}(x - (${x0}))$`
          : `Equation: $y = ${safeSlope}x ${yInterceptTan >= 0 ? `+ ${yInterceptTan}` : `- ${-yInterceptTan}`}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Find point of tangency and derivative',
        explanationMarkdown: `$f(${x0}) = ${safeY0}$ and $f'(x) = ${2 * a}x ${adjB >= 0 ? `+ ${adjB}` : `- ${-adjB}`}$, so $f'(${x0}) = ${safeSlope}$.`,
      },
      {
        stepNumber: 2,
        title: askNormal ? 'Take negative reciprocal gradient for normal' : 'Write tangent equation',
        explanationMarkdown: askNormal
          ? `$m_{\\perp} = -\\frac{1}{${safeSlope}} = ${formatFracLatex(-1, safeSlope)}$, giving $y - (${safeY0}) = ${formatFracLatex(-1, safeSlope)}(x - (${x0}))$.`
          : `Using $y - ${safeY0} = ${safeSlope}(x - (${x0}))$ yields $y = ${safeSlope}x ${yInterceptTan >= 0 ? `+ ${yInterceptTan}` : `- ${-yInterceptTan}`}$.`,
      },
    ],
    commonPitfalls: [
      askNormal
        ? 'Using $+\\frac{1}{m}$ instead of the negative reciprocal $-\\frac{1}{m}$ for the normal.'
        : 'Using $f\'(x)$ as a function instead of evaluating $f\'(x_0)$ as a numerical gradient.',
    ],
    isDailyEligible: true,
  };
}

function genCubicExtremaInflexion(rng: SeededRng, idx: number): QuestionItem {
  // f(x) = 2x^3 - 3(r1+r2)x^2 + 6*r1*r2*x + d -> f'(x) = 6(x - r1)(x - r2)
  const r1 = rng.int(-2, 1);
  const r2 = r1 + rng.int(2, 4);
  const a3 = 2;
  const a2 = -3 * (r1 + r2);
  const a1 = 6 * r1 * r2;
  const a0 = rng.int(-3, 5);
  const inflexX = (r1 + r2) / 2;
  const f = (x: number) => a3 * x ** 3 + a2 * x ** 2 + a1 * x + a0;
  const expr = `2x^3${signedTerm(a2, 'x^2')}${signedTerm(a1, 'x')}${signedTerm(a0, '')}`;
  const exprPlot = `2*x^3 + (${a2})*x^2 + (${a1})*x + (${a0})`;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5a',
    subtopicCode: 'SL 5.8',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 6,
    commandTerm: 'Find',
    stemMarkdown: `Let $f(x) = ${expr}$. Find (a) the $x$-coordinates of the local maximum and local minimum, justifying each using the second derivative, and (b) the point of inflexion.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Cubic Curve f(x) = ${expr}`,
      xRange: [r1 - 2, r2 + 2],
      yRange: [
        Math.min(f(r1), f(r2), f(r1 - 1)) - 4,
        Math.max(f(r1), f(r2), f(r2 + 1)) + 4,
      ],
      xLabel: 'x',
      yLabel: 'f(x)',
      functions: [{ id: 'cub', expr: exprPlot, label: 'f(x)' }],
      keyPoints: [
        { x: r1, y: f(r1), label: `Max (${r1}, ${f(r1)})` },
        { x: r2, y: f(r2), label: `Min (${r2}, ${f(r2)})` },
        { x: inflexX, y: f(inflexX), label: `Inflexion (${inflexX}, ${f(inflexX)})` },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Finds $f'(x) = 6x^2 ${2 * a2 >= 0 ? `+ ${2 * a2}` : `- ${-2 * a2}`}x ${a1 >= 0 ? `+ ${a1}` : `- ${-a1}`} = 0$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Stationary points at $x = ${r1}$ and $x = ${r2}$`,
        marks: 1,
      },
      {
        pointId: 'R1',
        requirement: `$f''(x) = 12x ${2 * a2 >= 0 ? `+ ${2 * a2}` : `- ${-2 * a2}`}$: $f''(${r1}) < 0$ (local max) and $f''(${r2}) > 0$ (local min)`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Sets $f''(x) = 0$ (with concavity sign change) to find inflexion $(${inflexX}, ${f(inflexX)})$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Solve $f\'(x) = 0$',
        explanationMarkdown: `$f'(x) = 6(x - (${r1}))(x - (${r2})) = 0$, giving $x = ${r1}$ and $x = ${r2}$.`,
      },
      {
        stepNumber: 2,
        title: 'Classify via $f\'\'(x)$ and solve $f\'\'(x)=0$',
        explanationMarkdown: `$f''(${r1}) = ${12 * r1 + 2 * a2} < 0$ (local maximum) and $f''(${r2}) = ${12 * r2 + 2 * a2} > 0$ (local minimum). Setting $f''(x) = 0$ gives inflexion at $x = ${inflexX}$.`,
      },
    ],
    commonPitfalls: [
      'Claiming a point of inflexion solely from $f\'\'(x) = 0$ without checking that $f\'\'(x)$ changes sign.',
    ],
    isDailyEligible: true,
  };
}

function genDefiniteIntegralArea(rng: SeededRng, idx: number): QuestionItem {
  // Area between y = c*x*(R - x) and x-axis (R in 2..12, c in 1..5)
  const R = rng.int(2, 12);
  const c = rng.int(1, 5);
  const areaNum = c * R * R * R;
  const expr = `${c * R}x - ${c}x^2`;
  const exprPlot = `${c * R}*x - ${c}*x^2`;
  const peakY = (c * R * R) / 4;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5b',
    subtopicCode: 'SL 5.11',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 5,
    commandTerm: 'Find',
    stemMarkdown: `Find the exact area of the shaded region enclosed between the curve $y = ${expr}$ and the $x$-axis, illustrated in the interactive plot.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Shaded Area Under y = ${expr}`,
      xRange: [-1, R + 1],
      yRange: [-2, Math.ceil(peakY + 3)],
      xLabel: 'x',
      yLabel: 'y',
      functions: [{ id: 'curve', expr: exprPlot, label: `y = ${expr}` }],
      shadedRegion: { exprTop: exprPlot, fromX: 0, toX: R, label: 'Shaded Area' },
      keyPoints: [
        { x: 0, y: 0, label: '(0, 0)' },
        { x: R, y: 0, label: `(${R}, 0)` },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Finds $x$-intercepts $x = 0$ and $x = ${R}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Sets up definite integral $\\int_0^{${R}} (${expr})\\,\\mathrm{d}x$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Antiderivative $\\left[\\frac{${c * R}}{2}x^2 - \\frac{${c}}{3}x^3\\right]_0^{${R}}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Exact area $= ${formatFracLatex(areaNum, 6)}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Determine integration limits from $x$-intercepts',
        explanationMarkdown: `Setting $x(${c * R} - ${c}x) = 0$ gives $x = 0$ and $x = ${R}$.`,
      },
      {
        stepNumber: 2,
        title: 'Integrate and apply Fundamental Theorem of Calculus',
        explanationMarkdown: `$\\left[\\frac{${c * R}}{2}x^2 - \\frac{${c}}{3}x^3\\right]_0^{${R}} = \\frac{${c * R * R * R}}{2} - \\frac{${c * R * R * R}}{3} = ${formatFracLatex(areaNum, 6)}$.`,
      },
    ],
    commonPitfalls: [
      'Forgetting to find the intersection limits when they are not given explicitly.',
      'Arithmetic errors subtracting $\\frac{x^3}{3}$ from $\\frac{x^2}{2}$.',
    ],
    isDailyEligible: true,
  };
}

function genKinematicsTotalDistance(rng: SeededRng, idx: number): QuestionItem {
  // v(t) = 3t^2 - 6*t_turn*t? Simpler linear/quadratic: v(t) = a*(t - tStop) => distance from 0 to tEnd (tEnd > tStop)
  // v(t) = k*(t - t0), where t0 in 2..4, tEnd = t0 + d in 4..7
  const k = rng.pick([2, 3, 4]);
  const t0 = rng.int(2, 4);
  const d = rng.int(2, 4);
  const tEnd = t0 + d;
  // v(t) = k*t - k*t0
  const disp = 0.5 * k * tEnd * tEnd - k * t0 * tEnd;
  const dist = 0.5 * k * t0 * t0 + 0.5 * k * d * d;
  const vExpr = `${k}t - ${k * t0}`;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5b',
    subtopicCode: 'SL 5.9',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Calculate',
    stemMarkdown: `A particle moves in a straight line with velocity $v(t) = ${vExpr}\\text{ m s}^{-1}$ for $0 \\le t \\le ${tEnd}$, as shown on the velocity–time graph. Calculate (a) the displacement and (b) the total distance traveled over $[0, ${tEnd}]$.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Velocity-Time Graph v(t) = ${vExpr}`,
      xRange: [0, tEnd],
      yRange: [-k * t0 - 2, k * d + 2],
      xLabel: 't (s)',
      yLabel: 'v (m/s)',
      functions: [{ id: 'vel', expr: `${k}*x - ${k * t0}`, label: `v(t) = ${vExpr}` }],
      keyPoints: [{ x: t0, y: 0, label: `Reverses at t = ${t0}` }],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Displacement $= \\int_0^{${tEnd}} (${vExpr})\\,\\mathrm{d}t = ${disp}\\text{ m}$`,
        marks: 2,
      },
      {
        pointId: 'M1',
        requirement: `Identifies direction reversal $v(t) = 0 \\implies t = ${t0}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Computes $\\int_0^{${tEnd}} |v(t)|\\,\\mathrm{d}t = \\left|\\int_0^{${t0}} v(t)\\,\\mathrm{d}t\\right| + \\int_{${t0}}^{${tEnd}} v(t)\\,\\mathrm{d}t$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Total distance $= ${0.5 * k * t0 * t0} + ${0.5 * k * d * d} = ${dist}\\text{ m}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Compute net displacement',
        explanationMarkdown: `Integrating directly over $[0, ${tEnd}]$ gives $\\left[${k / 2}t^2 - ${k * t0}t\\right]_0^{${tEnd}} = ${disp}\\text{ m}$.`,
      },
      {
        stepNumber: 2,
        title: 'Split at $v(t) = 0$ for total distance',
        explanationMarkdown: `Velocity changes sign at $t = ${t0}$. Summing the unsigned triangle areas gives $\\frac{1}{2}(${t0})(${k * t0}) + \\frac{1}{2}(${d})(${k * d}) = ${dist}\\text{ m}$.`,
      },
    ],
    commonPitfalls: [
      'Reporting net displacement instead of total distance $\\int |v(t)|\\,\\mathrm{d}t$.',
    ],
    isDailyEligible: true,
  };
}

function genChainRuleDerivative(rng: SeededRng, idx: number): QuestionItem {
  const a = rng.int(2, 5);
  const b = rng.int(1, 7);
  const kind = idx % 3;

  if (kind === 0) {
    // d/dx e^(ax+b) at x=0
    const isMcq = idx % 2 === 0;
    const mcq = isMcq
      ? buildMcqOptions(rng, `$${a}e^{${a}x + ${b}}$`, [
          `$e^{${a}x + ${b}}$`,
          `$${a}e^{${a}x}$`,
          `$\\frac{1}{${a}}e^{${a}x + ${b}}$`,
        ])
      : null;

    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-5a',
      subtopicCode: 'SL 5.6',
      paper: 'Paper 1',
      questionType: isMcq ? 'mcq' : 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: isMcq ? 1 : 3,
      commandTerm: 'Differentiate',
      stemMarkdown: `Differentiate $f(x) = e^{${a}x + ${b}}$ with respect to $x$.`,
      options: mcq?.options ?? null,
      correctOptionId: mcq?.correctOptionId ?? null,
      markschemePoints: isMcq
        ? [{ pointId: 'A1', requirement: `$f'(x) = ${a}e^{${a}x + ${b}}$`, marks: 1 }]
        : [
            {
              pointId: 'M1',
              requirement: `Applies chain rule $\\frac{\\mathrm{d}}{\\mathrm{d}x}e^{u} = u' e^{u}$ with $u = ${a}x + ${b}$`,
              marks: 2,
            },
            {
              pointId: 'A1',
              requirement: `$f'(x) = ${a}e^{${a}x + ${b}}$`,
              marks: 1,
            },
          ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Identify inner linear function $u(x)$',
          explanationMarkdown: `Let $u = ${a}x + ${b}$, so $\\frac{\\mathrm{d}u}{\\mathrm{d}x} = ${a}$.`,
        },
        {
          stepNumber: 2,
          title: 'Apply chain rule',
          explanationMarkdown: `$f'(x) = ${a}e^{${a}x + ${b}}$.`,
        },
      ],
      commonPitfalls: [
        'Forgetting to multiply by the inner derivative $a = ' + a + '$.',
      ],
      isDailyEligible: true,
    };
  }

  if (kind === 1) {
    // d/dx ln(ax + b)
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-5a',
      subtopicCode: 'SL 5.6',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 3,
      commandTerm: 'Differentiate',
      stemMarkdown: `Find $f'(x)$ for $f(x) = \\ln(${a}x + ${b})$, stating the valid domain of $f$.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Applies chain rule $\\frac{u'}{u}$ with $u = ${a}x + ${b}$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `$f'(x) = \\frac{${a}}{${a}x + ${b}}$`,
          marks: 1,
        },
        {
          pointId: 'A2',
          requirement: `Domain: $x > ${formatFracLatex(-b, a)}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Differentiate composite $\\ln(u)$',
          explanationMarkdown: `$\\frac{\\mathrm{d}}{\\mathrm{d}x}\\ln(${a}x + ${b}) = \\frac{${a}}{${a}x + ${b}}$.`,
        },
        {
          stepNumber: 2,
          title: 'Verify argument $> 0$',
          explanationMarkdown: `Requiring ${a}x + ${b} > 0$ gives $x > ${formatFracLatex(-b, a)}$.`,
        },
      ],
      commonPitfalls: [
        'Omitting the numerator factor $a$ from the chain rule.',
      ],
      isDailyEligible: true,
    };
  }

  // Reverse chain rule integral int k * (ax + b)^p dx
  const p = rng.pick([2, 3, 4]);
  const cMult = a * (p + 1);
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5b',
    subtopicCode: 'SL 5.10',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Integrate',
    stemMarkdown: `Find $\\int ${cMult}(${a}x + ${b})^{${p}}\\,\\mathrm{d}x$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Substitutes $u = ${a}x + ${b}$, $\\mathrm{d}u = ${a}\\,\\mathrm{d}x$ (or reverses chain rule)`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Integrates to $(${a}x + ${b})^{${p + 1}} + C$`,
        marks: 2,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Apply substitution $u = ' + a + 'x + ' + b + '$',
        explanationMarkdown: `With $\\mathrm{d}x = \\frac{\\mathrm{d}u}{${a}}$, the integral becomes $\\int ${p + 1}u^{${p}}\\,\\mathrm{d}u = u^{${p + 1}} + C$.`,
      },
      {
        stepNumber: 2,
        title: 'Back-substitute and include $+C$',
        explanationMarkdown: `Final answer: $(${a}x + ${b})^{${p + 1}} + C$.`,
      },
    ],
    commonPitfalls: [
      'Omitting the constant of integration $+C$ on an indefinite integral.',
      'Forgetting to divide by the inner derivative $a = ' + a + '$.',
    ],
    isDailyEligible: true,
  };
}

function genOptimizationBox(rng: SeededRng, idx: number): QuestionItem {
  const halfPerim = rng.int(12, 95);
  const perim = halfPerim * 2;
  const xOpt = halfPerim / 2;
  const maxArea = xOpt * xOpt;
  const enclosures = [
    'botanical garden enclosure',
    'aquaculture breeding pen',
    'solar thermal array frame',
    'wildlife conservation paddock',
    'horticultural greenhouse plot',
    'school athletics equipment bay',
  ] as const;
  const enc = rng.pick(enclosures);

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5a',
    subtopicCode: 'SL 5.8',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 6,
    commandTerm: 'Show that',
    stemMarkdown: `A rectangular ${enc} of length $x\\text{ m}$ and width $y\\text{ m}$ is enclosed on all four sides using $${perim}\\text{ m}$ of perimeter fencing ($2x + 2y = ${perim}$). (a) Show that the enclosed area is $A(x) = ${halfPerim}x - x^2$. (b) Find the maximum area and justify that your stationary value is a maximum.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Area Objective A(x) = ${halfPerim}x - x²`,
      xRange: [0, halfPerim],
      yRange: [0, Math.ceil(maxArea * 1.15)],
      xLabel: 'x (m)',
      yLabel: 'Area (m²)',
      functions: [{ id: 'area', expr: `${halfPerim}*x - x^2`, label: 'A(x)' }],
      keyPoints: [{ x: xOpt, y: maxArea, label: `Max (${xOpt}, ${maxArea})` }],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Writes $2x + 2y = ${perim} \\implies y = ${halfPerim} - x$`,
        marks: 1,
      },
      {
        pointId: 'AG',
        requirement: `Substitutes into $A = xy = x(${halfPerim} - x) = ${halfPerim}x - x^2$ (AG)`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Sets $A'(x) = ${halfPerim} - 2x = 0 \\implies x = ${xOpt}\\text{ m}$`,
        marks: 2,
      },
      {
        pointId: 'R1',
        requirement: `Verifies maximum via $A''(x) = -2 < 0$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Maximum area $A_{\\max} = ${maxArea}\\text{ m}^2$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Eliminate $y$ using the perimeter constraint',
        explanationMarkdown: `$2x + 2y = ${perim} \\implies y = ${halfPerim} - x$, giving $A(x) = ${halfPerim}x - x^2$.`,
      },
      {
        stepNumber: 2,
        title: 'Differentiate, solve $A\'(x)=0$, and verify concavity',
        explanationMarkdown: `$A'(x) = ${halfPerim} - 2x = 0 \\implies x = ${xOpt}$. Since $A''(x) = -2 < 0$, the maximum area is $${maxArea}\\text{ m}^2$.`,
      },
    ],
    commonPitfalls: [
      'Omitting the second-derivative proof ($A\'\'(x) < 0$) when asked to justify a maximum.',
    ],
    isDailyEligible: true,
  };
}

function genExtraLinearGeo(rng: SeededRng, idx: number): QuestionItem {
  // Perpendicular bisector between A(x1,y1) and B(x2,y2) - SL 2.1
  const x1 = rng.int(-4, 2);
  const y1 = rng.int(-4, 4);
  const dx = rng.pick([2, 4, 6]);
  const dy = rng.pick([2, -2, 4, -4]);
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // m_AB = dy / dx, perp gradient = -dx / dy
  const perpExpr = `${(-dx / dy).toFixed(4)}*(x - (${mx})) + (${my})`;

  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-2',
    subtopicCode: 'SL 2.1',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'foundation',
    marks: 4,
    commandTerm: 'Find',
    stemMarkdown: `Points $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$ lie in the coordinate plane. Find the equation of the perpendicular bisector of segment $AB$ in the form $y = mx + c$.`,
    diagramSpec: {
      kind: 'function_graph',
      title: `Perpendicular Bisector of A(${x1},${y1}) and B(${x2},${y2})`,
      xRange: [Math.min(x1, x2) - 4, Math.max(x1, x2) + 4],
      yRange: [Math.min(y1, y2) - 4, Math.max(y1, y2) + 4],
      xLabel: 'x',
      yLabel: 'y',
      functions: [{ id: 'bis', expr: perpExpr, label: 'Perpendicular bisector' }],
      keyPoints: [
        { x: x1, y: y1, label: `A(${x1}, ${y1})` },
        { x: mx, y: my, label: `M(${mx}, ${my})` },
        { x: x2, y: y2, label: `B(${x2}, ${y2})` },
      ],
      interactiveTrace: true,
    },
    markschemePoints: [
      {
        pointId: 'A1',
        requirement: `Midpoint $M = (${mx}, ${my})$`,
        marks: 1,
      },
      {
        pointId: 'M1',
        requirement: `Gradient of $AB$ is ${formatFracLatex(dy, dx)}, so perpendicular gradient is $m_{\\perp} = ${formatFracLatex(-dx, dy)}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Substitutes $M(${mx}, ${my})$ to find $y = ${formatFracLatex(-dx, dy)}x + (${formatFracLatex(my * dy + dx * mx, dy)})$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Compute midpoint and gradient of $AB$',
        explanationMarkdown: `$M = \\left(\\frac{${x1}+${x2}}{2}, \\frac{${y1}+${y2}}{2}\\right) = (${mx}, ${my})$, and $m_{AB} = ${formatFracLatex(dy, dx)}$.`,
      },
      {
        stepNumber: 2,
        title: 'Use $m_1 m_2 = -1$ and point-slope form',
        explanationMarkdown: `The perpendicular bisector passes through $(${mx}, ${my})$ with gradient $m_{\\perp} = ${formatFracLatex(-dx, dy)}$.`,
      },
    ],
    commonPitfalls: [
      'Taking the reciprocal gradient without negating it.',
      'Substituting point $A$ instead of midpoint $M$ into the line equation.',
    ],
    isDailyEligible: true,
  };
}

function genNonDiagramConceptOrCalc(rng: SeededRng, idx: number): QuestionItem {
  const variant = idx % 8;
  if (variant === 0) {
    // SL 1.1 Scientific notation & % error (Wait: % error is AI, keep exact sig figs & scientific notation!)
    const m = rng.int(12, 95) / 10;
    const p1 = rng.int(3, 8);
    const n = rng.int(15, 85) / 10;
    const p2 = rng.int(-4, -1);
    const prod = m * n;
    const normCoeff = prod >= 10 ? prod / 10 : prod;
    const normExp = p1 + p2 + (prod >= 10 ? 1 : 0);
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-1',
      subtopicCode: 'SL 1.1',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 3,
      commandTerm: 'Calculate',
      stemMarkdown: `Let $p = ${m} \\times 10^{${p1}}$ and $q = ${n} \\times 10^{${p2}}$. Calculate $pq$, expressing your answer in the form $a \\times 10^k$ where $1 \\le a < 10$ and $k \\in \\mathbb{Z}$ (to $3$ significant figures).`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Multiplies mantissas and adds powers: $(${m} \\times ${n}) \\times 10^{${p1} + (${p2})}$`,
          marks: 2,
        },
        {
          pointId: 'A1',
          requirement: `Normalizes to $${roundSigFigs(normCoeff, 3)} \\times 10^{${normExp}}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Multiply coefficients and add exponents',
          explanationMarkdown: `${m} \\times ${n} = ${prod.toFixed(2)} and $10^{${p1}} \\times 10^{${p2}} = 10^{${p1 + p2}}$.`,
        },
        {
          stepNumber: 2,
          title: 'Adjust so $1 \\le a < 10$',
          explanationMarkdown: `Writing in standard IB form gives $${roundSigFigs(normCoeff, 3)} \\times 10^{${normExp}}$.`,
        },
      ],
      commonPitfalls: ['Leaving $a \\ge 10$ instead of normalizing into $[1, 10)$.'],
      isDailyEligible: true,
    };
  }

  if (variant === 1) {
    // SL 1.8 Proof / Show that algebraic identity (AG)
    const k = rng.int(2, 7);
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-1',
      subtopicCode: 'SL 1.8',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 4,
      commandTerm: 'Prove',
      stemMarkdown: `Prove algebraically that for any integer $n$, $(n + ${k})^2 - (n - ${k})^2$ is always a multiple of $${4 * k}$.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Expands $(n + ${k})^2 = n^2 + ${2 * k}n + ${k * k}$ and $(n - ${k})^2 = n^2 - ${2 * k}n + ${k * k}$`,
          marks: 2,
        },
        {
          pointId: 'A1',
          requirement: `Simplifies difference to $${4 * k}n$`,
          marks: 1,
        },
        {
          pointId: 'AG',
          requirement: `Since $n \\in \\mathbb{Z}$, $${4 * k}n$ is a multiple of $${4 * k}$ (AG)`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Expand both squares carefully',
          explanationMarkdown: `$(n^2 + ${2 * k}n + ${k * k}) - (n^2 - ${2 * k}n + ${k * k})$.`,
        },
        {
          stepNumber: 2,
          title: 'Cancel like terms and conclude',
          explanationMarkdown: `The $n^2$ and $${k * k}$ terms cancel, leaving $${4 * k}n$, which is divisible by $${4 * k}$ for every $n \\in \\mathbb{Z}$.`,
        },
      ],
      commonPitfalls: ['Testing numerical examples only instead of writing a general algebraic proof.'],
      isDailyEligible: true,
    };
  }

  if (variant === 2) {
    // SL 4.3 Linear transformation of data Y = aX + b
    const meanX = rng.int(25, 70);
    const sdX = rng.int(4, 12);
    const mult = rng.pick([2, 3, 1.5, -2]);
    const shift = rng.int(-15, 25);
    const meanY = mult * meanX + shift;
    const sdY = Math.abs(mult) * sdX;

    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-4',
      subtopicCode: 'SL 4.3',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 3,
      commandTerm: 'Find',
      stemMarkdown: `A dataset $X$ has mean $\\bar{x} = ${meanX}$ and standard deviation $\\sigma_x = ${sdX}$. Each observation is transformed according to $Y = ${mult}X ${shift >= 0 ? `+ ${shift}` : `- ${-shift}`}$. Find the new mean $\\bar{y}$ and standard deviation $\\sigma_y$.`,
      markschemePoints: [
        {
          pointId: 'A1',
          requirement: `$\\bar{y} = ${mult}(${meanX}) ${shift >= 0 ? `+ ${shift}` : `- ${-shift}`} = ${meanY}$`,
          marks: 1,
        },
        {
          pointId: 'A2',
          requirement: `$\\sigma_y = |${mult}| \\times ${sdX} = ${sdY}$ (unaffected by translation $${shift}$)`,
          marks: 2,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Scale and shift the mean',
          explanationMarkdown: `$\\bar{y} = ${mult}\\bar{x} + (${shift}) = ${meanY}$.`,
        },
        {
          stepNumber: 2,
          title: 'Scale standard deviation using $|a|$ only',
          explanationMarkdown: `Adding a constant shifts every value equally without changing spread, and standard deviation is always non-negative: $\\sigma_y = |${mult}|\\sigma_x = ${sdY}$.`,
        },
      ],
      commonPitfalls: ['Adding the constant shift $b$ to the standard deviation or making $\\sigma_y$ negative when $a < 0$.'],
      isDailyEligible: true,
    };
  }

  if (variant === 3) {
    // SL 4.7 Discrete RV expectation E(X) & sum of probs = 1
    const kVal = rng.pick([1, 2, 3, 4]);
    const p1 = 0.15;
    const p2 = 0.35;
    const p3 = 0.3;
    const p4 = 0.2;
    const ex = kVal * p1 + (kVal + 2) * p2 + (kVal + 4) * p3 + (kVal + 6) * p4;
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-4',
      subtopicCode: 'SL 4.7',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Find',
      stemMarkdown: `A discrete random variable $X$ takes values $${kVal}, ${kVal + 2}, ${kVal + 4}, ${kVal + 6}$ with probabilities $0.15, p, 0.30, 0.20$ respectively. Find the value of $p$ and calculate the expected value $E(X)$.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Sets $0.15 + p + 0.30 + 0.20 = 1$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `$p = ${p2}$`,
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement: `$E(X) = ${kVal}(0.15) + ${kVal + 2}(${p2}) + ${kVal + 4}(0.30) + ${kVal + 6}(0.20)$`,
          marks: 1,
        },
        {
          pointId: 'A2',
          requirement: `$E(X) = ${ex.toFixed(2)}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Use $\\sum P(X = x) = 1$',
          explanationMarkdown: `$p = 1 - (0.15 + 0.30 + 0.20) = ${p2}$.`,
        },
        {
          stepNumber: 2,
          title: 'Compute weighted average $E(X) = \\sum x P(X = x)$',
          explanationMarkdown: `Summing products gives $E(X) = ${ex.toFixed(2)}$.`,
        },
      ],
      commonPitfalls: ['Taking an unweighted arithmetic mean of the $x$ values.'],
      isDailyEligible: true,
    };
  }

  if (variant === 4) {
    return genDisguisedQuadraticExp(rng, idx);
  }

  if (variant === 5) {
    // SL 4.12 Unknown mean or SD standardization
    const mean = rng.int(50, 90);
    const sd = rng.int(4, 10);
    const z = 1.6449; // 95th percentile
    const xVal = Number((mean + z * sd).toFixed(1));
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-4',
      subtopicCode: 'SL 4.12',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'gdc_required',
      difficulty: 'challenging',
      marks: 4,
      commandTerm: 'Determine',
      stemMarkdown: `A normally distributed variable $X \\sim \\text{N}(\\mu, ${sd}^2)$ satisfies $P(X < ${xVal}) = 0.95$. Determine the unknown mean $\\mu$ to $3$ significant figures.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Finds standard normal quantile $z = \\Phi^{-1}(0.95) \\approx 1.6449$`,
          marks: 2,
        },
        {
          pointId: 'M2',
          requirement: `Writes $\\frac{${xVal} - \\mu}{${sd}} = 1.6449$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `$\\mu \\approx ${roundSigFigs(xVal - 1.6449 * sd, 3)}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Use inverse normal on $Z \\sim \\text{N}(0, 1)$',
          explanationMarkdown: `Whenever $\\mu$ or $\\sigma$ is unknown, convert to $Z$: ` + `invNorm(0.95, 0, 1) ≈ 1.6449.`,
        },
        {
          stepNumber: 2,
          title: 'Solve $z = \\frac{x - \\mu}{\\sigma}$ for $\\mu$',
          explanationMarkdown: `$\\mu = ${xVal} - 1.6449(${sd}) \\approx ${roundSigFigs(xVal - 1.6449 * sd, 3)}$.`,
        },
      ],
      commonPitfalls: ['Trying to run GDC invNorm directly without converting to standard normal $Z$.'],
      isDailyEligible: true,
    };
  }

  if (variant === 6) {
    // SL 5.5 Indefinite integral with boundary condition
    const k = rng.pick([2, 3, 4]);
    const c1 = rng.int(2, 6);
    const x0 = rng.int(1, 3);
    const y0 = rng.int(4, 15);
    const cConst = y0 - (k * x0 ** 3 - c1 * x0);
    return {
      id: makeId('math-gen', idx),
      subjectSlug: 'math',
      topicId: 'math-sl-5b',
      subtopicCode: 'SL 5.5',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 4,
      commandTerm: 'Find',
      stemMarkdown: `The gradient of a curve is given by $\\frac{\\mathrm{d}y}{\\mathrm{d}x} = ${3 * k}x^2 - ${c1}$, and the curve passes through the point $(${x0}, ${y0})$. Find the equation $y(x)$ of the curve.`,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement: `Integrates $y = ${k}x^3 - ${c1}x + C$`,
          marks: 2,
        },
        {
          pointId: 'M2',
          requirement: `Substitutes $(${x0}, ${y0})$ to solve for $C$`,
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement: `$y = ${k}x^3 - ${c1}x ${cConst >= 0 ? `+ ${cConst}` : `- ${-cConst}`}$`,
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Antidifferentiate with $+C$',
          explanationMarkdown: `$y = \\int (${3 * k}x^2 - ${c1})\\,\\mathrm{d}x = ${k}x^3 - ${c1}x + C$.`,
        },
        {
          stepNumber: 2,
          title: 'Apply initial condition',
          explanationMarkdown: `$${y0} = ${k}(${x0})^3 - ${c1}(${x0}) + C \\implies C = ${cConst}$.`,
        },
      ],
      commonPitfalls: ['Omitting $+C$ and assuming $C = y_0$.'],
      isDailyEligible: true,
    };
  }

  // variant === 7: Product/Quotient rule (SL 5.6)
  const m = rng.int(2, 5);
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-5a',
    subtopicCode: 'SL 5.6',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Differentiate',
    stemMarkdown: `Using the product rule, differentiate $f(x) = x^2 e^{${m}x}$ and write $f'(x)$ in factored form.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Applies $(uv)' = u'v + uv'$ with $u = x^2, v = e^{${m}x}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `$2xe^{${m}x} + ${m}x^2 e^{${m}x}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Factored form $f'(x) = xe^{${m}x}(2 + ${m}x)$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Apply product rule',
        explanationMarkdown: `$u' = 2x$ and $v' = ${m}e^{${m}x}$, giving $2xe^{${m}x} + ${m}x^2e^{${m}x}$.`,
      },
      {
        stepNumber: 2,
        title: 'Factor out common $xe^{mx}$',
        explanationMarkdown: `$f'(x) = xe^{${m}x}(2 + ${m}x)$.`,
      },
    ],
    commonPitfalls: ['Differentiating $u$ and $v$ separately and multiplying $u\'v\'$ instead of $u\'v + uv\'$.'],
    isDailyEligible: true,
  };
}

// Clean up any prose quirk in variant 4 stem before exporting!
function genDisguisedQuadraticExp(rng: SeededRng, idx: number): QuestionItem {
  const a = rng.pick([2, 3, 4, 5, 6]);
  const r1 = rng.int(0, 2);
  const r2 = r1 + rng.int(1, 3);
  const u1 = Math.pow(a, r1);
  const u2 = Math.pow(a, r2);
  const scale = rng.int(1, 3);
  return {
    id: makeId('math-gen', idx),
    subjectSlug: 'math',
    topicId: 'math-sl-1',
    subtopicCode: 'SL 1.7',
    paper: 'Paper 1',
    questionType: 'short_answer',
    calculatorPolicy: 'non_calculator',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Solve',
    stemMarkdown: `Solve the exponential equation $${scale === 1 ? '' : scale}${a}^{2x} - ${scale * (u1 + u2)}\\cdot ${a}^{x} + ${scale * u1 * u2} = 0$ for $x \\in \\mathbb{R}$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Substitutes $u = ${a}^x$ to obtain $u^2 - ${u1 + u2}u + ${u1 * u2} = 0$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Factors $(u - ${u1})(u - ${u2}) = 0 \\implies ${a}^x = ${u1}$ or $${a}^x = ${u2}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Final exact solutions $x = ${r1}$ and $x = ${r2}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Substitute $u = a^x$',
        explanationMarkdown: `Dividing by $${scale}$ and writing $${a}^{2x} = (${a}^x)^2$ forms $u^2 - ${u1 + u2}u + ${u1 * u2} = 0$.`,
      },
      {
        stepNumber: 2,
        title: 'Solve for $x$',
        explanationMarkdown: `$${a}^x = ${u1} \\implies x = ${r1}$ and $${a}^x = ${u2} \\implies x = ${r2}$.`,
      },
    ],
    commonPitfalls: ['Stopping at $u = ' + u1 + ', ' + u2 + '$ without solving for $x$.'],
    isDailyEligible: true,
  };
}

function genNonDiagramSafe(rng: SeededRng, idx: number): QuestionItem {
  if (idx % 8 === 4) return genDisguisedQuadraticExp(rng, idx);
  return genNonDiagramConceptOrCalc(rng, idx);
}

// Weighted so ~55–60% of generated Math AA SL questions have interactive diagrams!
const DIAGRAM_FAMILIES: readonly MathFamilyFn[] = [
  genQuadraticVertexDiscriminant,
  genRationalFunction,
  genFunctionTransformations,
  genExponentialModel,
  genExtraLinearGeo,
  genTriangleSineCosine,
  genSectorSegment,
  genUnitCircleExact,
  genSinusoidalWave,
  genTrigDoubleAngle,
  genProbabilityTree,
  genVennDiagramProb,
  genNormalDistribution,
  genScatterRegression,
  genBoxPlotOutliers,
  genTangentNormal,
  genCubicExtremaInflexion,
  genDefiniteIntegralArea,
  genKinematicsTotalDistance,
  genOptimizationBox,
];

const NON_DIAGRAM_FAMILIES: readonly MathFamilyFn[] = [
  genArithmeticSequence,
  genGeometricInfinite,
  genCompoundInterest,
  genLogarithmEquation,
  genBinomialExpansion,
  genCompositeInverse,
  genBinomialProb,
  genChainRuleDerivative,
  genNonDiagramSafe,
];

export function generateMathQuestions(
  targetCount: number,
  seed = 104729
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const items: QuestionItem[] = [];
  const diagramTargetRatio = 0.56;

  for (let i = 0; i < targetCount; i++) {
    const useDiagram =
      i / Math.max(1, targetCount) < diagramTargetRatio ||
      (i % 9 < 5 && items.filter((q) => Boolean(q.diagramSpec)).length / Math.max(1, i) < diagramTargetRatio);

    const family = useDiagram
      ? DIAGRAM_FAMILIES[i % DIAGRAM_FAMILIES.length]
      : NON_DIAGRAM_FAMILIES[i % NON_DIAGRAM_FAMILIES.length];

    items.push(family(rng, i + 1));
  }
  return items;
}
