import type { QuestionItem } from '../../../src/content/schemas';
import {
  SeededRng,
  buildMcqOptions,
  makeId,
  roundSigFigs,
} from './utils';

const IB_STP_MOLAR_VOL = 22.7; // dm^3 mol^-1 at 273.15 K, 100 kPa
const IB_R_GAS = 8.31; // J K^-1 mol^-1
const WATER_C = 4.18; // J g^-1 K^-1

type ChemFamilyFn = (rng: SeededRng, idx: number) => QuestionItem;

/* --------------------- S1.4: STOICHIOMETRY, GASES, EMPIRICAL FORMULAS --------------------- */

const STP_GAS_REACTIONS = [
  {
    solid: '\\text{CaCO}_3',
    solidName: 'calcium carbonate',
    molarMass: 100.09,
    gas: '\\text{CO}_2',
    ratioGasPerSolid: 1,
    reagent: 'excess hydrochloric acid',
    eq: '\\text{CaCO}_3(\\text{s}) + 2\\text{HCl}(\\text{aq}) \\to \\text{CaCl}_2(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l}) + \\text{CO}_2(\\text{g})',
  },
  {
    solid: '\\text{Mg}',
    solidName: 'magnesium ribbon',
    molarMass: 24.31,
    gas: '\\text{H}_2',
    ratioGasPerSolid: 1,
    reagent: 'excess dilute sulfuric acid',
    eq: '\\text{Mg}(\\text{s}) + \\text{H}_2\\text{SO}_4(\\text{aq}) \\to \\text{MgSO}_4(\\text{aq}) + \\text{H}_2(\\text{g})',
  },
  {
    solid: '\\text{NaHCO}_3',
    solidName: 'sodium hydrogencarbonate',
    molarMass: 84.01,
    gas: '\\text{CO}_2',
    ratioGasPerSolid: 1,
    reagent: 'excess ethanoic acid',
    eq: '\\text{NaHCO}_3(\\text{s}) + \\text{CH}_3\\text{COOH}(\\text{aq}) \\to \\text{CH}_3\\text{COONa}(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l}) + \\text{CO}_2(\\text{g})',
  },
  {
    solid: '\\text{Zn}',
    solidName: 'zinc granules',
    molarMass: 65.38,
    gas: '\\text{H}_2',
    ratioGasPerSolid: 1,
    reagent: 'excess hydrochloric acid',
    eq: '\\text{Zn}(\\text{s}) + 2\\text{HCl}(\\text{aq}) \\to \\text{ZnCl}_2(\\text{aq}) + \\text{H}_2(\\text{g})',
  },
  {
    solid: '\\text{Na}_2\\text{CO}_3',
    solidName: 'anhydrous sodium carbonate',
    molarMass: 105.99,
    gas: '\\text{CO}_2',
    ratioGasPerSolid: 1,
    reagent: 'excess nitric acid',
    eq: '\\text{Na}_2\\text{CO}_3(\\text{s}) + 2\\text{HNO}_3(\\text{aq}) \\to 2\\text{NaNO}_3(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l}) + \\text{CO}_2(\\text{g})',
  },
  {
    solid: '\\text{Al}',
    solidName: 'aluminium foil',
    molarMass: 26.98,
    gas: '\\text{H}_2',
    ratioGasPerSolid: 1.5,
    reagent: 'excess hydrochloric acid',
    eq: '2\\text{Al}(\\text{s}) + 6\\text{HCl}(\\text{aq}) \\to 2\\text{AlCl}_3(\\text{aq}) + 3\\text{H}_2(\\text{g})',
  },
  {
    solid: '\\text{KClO}_3',
    solidName: 'potassium chlorate(V)',
    molarMass: 122.55,
    gas: '\\text{O}_2',
    ratioGasPerSolid: 1.5,
    reagent: 'thermal decomposition with MnO₂ catalyst',
    eq: '2\\text{KClO}_3(\\text{s}) \\to 2\\text{KCl}(\\text{s}) + 3\\text{O}_2(\\text{g})',
  },
] as const;

function genStpGasVolume(rng: SeededRng, idx: number): QuestionItem {
  const rxn = STP_GAS_REACTIONS[idx % STP_GAS_REACTIONS.length];
  const mass = Number((rng.int(105, 995) / 100).toFixed(2));
  const molesSolid = mass / rxn.molarMass;
  const molesGas = molesSolid * rxn.ratioGasPerSolid;
  const volDm3 = molesGas * IB_STP_MOLAR_VOL;
  const volAns = roundSigFigs(volDm3, 3);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `Calculate the volume of $${rxn.gas}(\\text{g})$, in $\\text{dm}^3$ at STP ($273.15\\text{ K}, 100\\text{ kPa}$), produced when $${mass.toFixed(2)}\\text{ g}$ of ${rxn.solidName} ($${rxn.solid}$, $M = ${rxn.molarMass}\\text{ g mol}^{-1}$) reacts completely with ${rxn.reagent}.`,
    stimulusMarkdown: `Balanced equation: $${rxn.eq}$. IB Data Booklet molar volume of an ideal gas at STP ($273.15\\text{ K}, 100\\text{ kPa}$) $= 22.7\\text{ dm}^3\\text{ mol}^{-1}$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Amount of $${rxn.solid}$: $n = \\frac{${mass.toFixed(2)}}{${rxn.molarMass}} = ${roundSigFigs(molesSolid, 4)}\\text{ mol}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Stoichiometric mole ratio gives $n(${rxn.gas}) = ${roundSigFigs(molesGas, 4)}\\text{ mol}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Volume $V = ${roundSigFigs(molesGas, 4)} \\times 22.7 = ${volAns}\\text{ dm}^3$ (3 s.f.)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Convert mass to moles',
        explanationMarkdown: `$n(${rxn.solid}) = \\frac{${mass.toFixed(2)}}{${rxn.molarMass}} = ${roundSigFigs(molesSolid, 4)}\\text{ mol}$.`,
      },
      {
        stepNumber: 2,
        title: 'Apply stoichiometry and 2025 IB STP constant (22.7 dm³ mol⁻¹)',
        explanationMarkdown: `$n(${rxn.gas}) = ${rxn.ratioGasPerSolid} \\times ${roundSigFigs(molesSolid, 4)} = ${roundSigFigs(molesGas, 4)}\\text{ mol}$, giving $V = ${volAns}\\text{ dm}^3$.`,
      },
    ],
    commonPitfalls: [
      'Using an outdated STP molar volume instead of the IB Data Booklet constant $22.7\\text{ dm}^3\\text{ mol}^{-1}$ at $273.15\\text{ K}, 100\\text{ kPa}$.',
      'Ignoring non-1:1 stoichiometric coefficients.',
    ],
    isDailyEligible: true,
  };
}

function genIdealGasLaw(rng: SeededRng, idx: number): QuestionItem {
  const gases = [
    { name: 'nitrogen', formula: '\\text{N}_2', M: 28.02 },
    { name: 'argon', formula: '\\text{Ar}', M: 39.95 },
    { name: 'methane', formula: '\\text{CH}_4', M: 16.05 },
    { name: 'carbon dioxide', formula: '\\text{CO}_2', M: 44.01 },
    { name: 'neon', formula: '\\text{Ne}', M: 20.18 },
    { name: 'propane', formula: '\\text{C}_3\\text{H}_8', M: 44.11 },
    { name: 'helium', formula: '\\text{He}', M: 4.00 },
    { name: 'oxygen', formula: '\\text{O}_2', M: 32.00 },
  ] as const;
  const g = gases[idx % gases.length];
  const tempC = rng.int(12, 145);
  const tempK = tempC + 273.15;
  const pressKpa = rng.int(85, 320);
  const volDm3 = Number((rng.int(12, 125) / 10).toFixed(1));
  const n = (pressKpa * volDm3) / (IB_R_GAS * tempK);
  const mass = n * g.M;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.5',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `A rigid vessel of volume $${volDm3.toFixed(1)}\\text{ dm}^3$ holds ${g.name} ($${g.formula}$, $M = ${g.M}\\text{ g mol}^{-1}$) at a pressure of $${pressKpa}\\text{ kPa}$ and temperature $${tempC}^\\circ\\text{C}$. Treating the gas as ideal ($R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$), calculate the mass of ${g.name} inside the vessel to $3$ significant figures.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Converts temperature $T = ${tempC} + 273.15 = ${tempK.toFixed(2)}\\text{ K}$ and consistent $P, V$ units`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Computes $n = \\frac{PV}{RT} = \\frac{${pressKpa} \\times ${volDm3.toFixed(1)}}{8.31 \\times ${tempK.toFixed(2)}} = ${roundSigFigs(n, 4)}\\text{ mol}$`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Mass $m = nM = ${roundSigFigs(mass, 3)}\\text{ g}$ (3 s.f.)`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Convert to Kelvin and match $P, V$ units',
        explanationMarkdown: `$T = ${tempK.toFixed(2)}\\text{ K}$. Using $P$ in $\\text{kPa}$ and $V$ in $\\text{dm}^3$ satisfies $1\\text{ kPa}\\cdot\\text{dm}^3 = 1\\text{ J}$.`,
      },
      {
        stepNumber: 2,
        title: 'Solve for moles and mass',
        explanationMarkdown: `$n = ${roundSigFigs(n, 4)}\\text{ mol}$, so $m = ${roundSigFigs(mass, 3)}\\text{ g}$.`,
      },
    ],
    commonPitfalls: [
      'Substituting Celsius temperature instead of Kelvin.',
      'Mixing Pa with dm³ without a $10^{-3}\\text{ m}^3\\text{ dm}^{-3}$ factor.',
    ],
    isDailyEligible: true,
  };
}

function genTitrationMolarity(rng: SeededRng, idx: number): QuestionItem {
  const pairs = [
    { acid: '\\text{HCl}', base: '\\text{NaOH}', ratioAcidToBase: 1, eq: '\\text{HCl}(\\text{aq}) + \\text{NaOH}(\\text{aq}) \\to \\text{NaCl}(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l})' },
    { acid: '\\text{H}_2\\text{SO}_4', base: '\\text{NaOH}', ratioAcidToBase: 0.5, eq: '\\text{H}_2\\text{SO}_4(\\text{aq}) + 2\\text{NaOH}(\\text{aq}) \\to \\text{Na}_2\\text{SO}_4(\\text{aq}) + 2\\text{H}_2\\text{O}(\\text{l})' },
    { acid: '\\text{CH}_3\\text{COOH}', base: '\\text{KOH}', ratioAcidToBase: 1, eq: '\\text{CH}_3\\text{COOH}(\\text{aq}) + \\text{KOH}(\\text{aq}) \\to \\text{CH}_3\\text{COOK}(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l})' },
    { acid: '\\text{HNO}_3', base: '\\text{KOH}', ratioAcidToBase: 1, eq: '\\text{HNO}_3(\\text{aq}) + \\text{KOH}(\\text{aq}) \\to \\text{KNO}_3(\\text{aq}) + \\text{H}_2\\text{O}(\\text{l})' },
    { acid: '\\text{H}_2\\text{SO}_4', base: '\\text{KOH}', ratioAcidToBase: 0.5, eq: '\\text{H}_2\\text{SO}_4(\\text{aq}) + 2\\text{KOH}(\\text{aq}) \\to \\text{K}_2\\text{SO}_4(\\text{aq}) + 2\\text{H}_2\\text{O}(\\text{l})' },
  ] as const;
  const p = pairs[idx % pairs.length];
  const vBaseCm3 = Number((rng.int(115, 365) / 10).toFixed(2));
  const cBase = Number((rng.int(8, 55) / 100).toFixed(2));
  const vAcidCm3 = rng.pick([10.0, 15.0, 20.0, 25.0]);
  const nBase = (vBaseCm3 / 1000) * cBase;
  const nAcid = nBase * p.ratioAcidToBase;
  const cAcid = nAcid / (vAcidCm3 / 1000);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 3,
    commandTerm: 'Determine',
    stemMarkdown: `During an acid–base titration, $${vAcidCm3.toFixed(1)}\\text{ cm}^3$ of aqueous $${p.acid}$ reaches the equivalence point upon adding $${vBaseCm3.toFixed(2)}\\text{ cm}^3$ of $${cBase.toFixed(2)}\\text{ mol dm}^{-3}$ $${p.base}(\\text{aq})$. Determine the molar concentration of $${p.acid}$ in $\\text{mol dm}^{-3}$ to $3$ significant figures.`,
    stimulusMarkdown: `Balanced equation: $${p.eq}$.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `$n(${p.base}) = ${(vBaseCm3 / 1000).toFixed(5)} \\times ${cBase.toFixed(2)} = ${roundSigFigs(nBase, 4)}\\text{ mol}$`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Mole ratio gives $n(${p.acid}) = ${roundSigFigs(nAcid, 4)}\\text{ mol}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `$c(${p.acid}) = ${roundSigFigs(cAcid, 3)}\\text{ mol dm}^{-3}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Calculate moles of titrant',
        explanationMarkdown: `$n(${p.base}) = \\frac{${vBaseCm3.toFixed(2)}}{1000} \\times ${cBase.toFixed(2)} = ${roundSigFigs(nBase, 4)}\\text{ mol}$.`,
      },
      {
        stepNumber: 2,
        title: 'Use stoichiometric ratio and divide by analyte volume in dm³',
        explanationMarkdown: `$c(${p.acid}) = \\frac{${roundSigFigs(nAcid, 4)}}{${(vAcidCm3 / 1000).toFixed(4)}} = ${roundSigFigs(cAcid, 3)}\\text{ mol dm}^{-3}$.`,
      },
    ],
    commonPitfalls: [
      'Forgetting the 1:2 mole ratio when titrating diprotic $\\text{H}_2\\text{SO}_4$.',
      'Failing to convert $\\text{cm}^3$ to $\\text{dm}^3$.',
    ],
    isDailyEligible: true,
  };
}

function genDilutionAndMolarity(rng: SeededRng, idx: number): QuestionItem {
  const solutes = [
    { name: 'sodium chloride', formula: '\\text{NaCl}', M: 58.44 },
    { name: 'potassium nitrate', formula: '\\text{KNO}_3', M: 101.11 },
    { name: 'copper(II) sulfate pentahydrate', formula: '\\text{CuSO}_4\\cdot 5\\text{H}_2\\text{O}', M: 249.69 },
    { name: 'sodium hydroxide', formula: '\\text{NaOH}', M: 40.00 },
    { name: 'calcium chloride', formula: '\\text{CaCl}_2', M: 110.98 },
    { name: 'glucose', formula: '\\text{C}_6\\text{H}_{12}\\text{O}_6', M: 180.18 },
  ] as const;
  const s = solutes[idx % solutes.length];
  const c1 = Number((rng.int(40, 220) / 100).toFixed(2));
  const v1 = rng.int(10, 45);
  const v2 = rng.pick([100, 250, 500, 1000]);
  const c2 = (c1 * v1) / v2;
  const massNeeded = c2 * (v2 / 1000) * s.M;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `A student transfers $${v1}.0\\text{ cm}^3$ of a $${c1.toFixed(2)}\\text{ mol dm}^{-3}$ stock solution of ${s.name} ($${s.formula}$, $M = ${s.M}\\text{ g mol}^{-1}$) into a volumetric flask and makes it up to $${v2}.0\\text{ cm}^3$ with distilled water. Calculate (a) the diluted concentration and (b) the mass of ${s.name} dissolved in the volumetric flask, to $3$ significant figures.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Applies $c_1V_1 = c_2V_2$: $c_2 = \\frac{${c1.toFixed(2)} \\times ${v1}.0}{${v2}.0}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Diluted concentration $= ${roundSigFigs(c2, 3)}\\text{ mol dm}^{-3}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Mass of solute $= nM = ${roundSigFigs(massNeeded, 3)}\\text{ g}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Conserve moles during dilution ($c_1V_1 = c_2V_2$)',
        explanationMarkdown: `$c_2 = ${c1.toFixed(2)} \\times \\frac{${v1}.0}{${v2}.0} = ${roundSigFigs(c2, 3)}\\text{ mol dm}^{-3}$.`,
      },
      {
        stepNumber: 2,
        title: 'Convert moles to mass',
        explanationMarkdown: `$n = ${c1.toFixed(2)} \\times ${(v1 / 1000).toFixed(4)} = ${roundSigFigs((c1 * v1) / 1000, 4)}\\text{ mol}$, so $m = ${roundSigFigs(massNeeded, 3)}\\text{ g}$.`,
      },
    ],
    commonPitfalls: ['Adding $V_1 + V_2$ when the problem states "made up to a total volume of $V_2$".'],
    isDailyEligible: true,
  };
}

function genLimitingReactantYield(rng: SeededRng, idx: number): QuestionItem {
  // Mg + 2 HCl -> MgCl2 + H2 OR Fe2O3 + 3 CO -> 2 Fe + 3 CO2 OR 2 Al + 3 Cl2 -> 2 AlCl3
  const rxns = [
    {
      aName: 'magnesium',
      aSym: '\\text{Mg}',
      aM: 24.31,
      aCoeff: 1,
      bName: 'hydrochloric acid',
      bSym: '\\text{HCl}',
      bM: 36.46,
      bCoeff: 2,
      pName: 'magnesium chloride',
      pSym: '\\text{MgCl}_2',
      pM: 95.21,
      pCoeff: 1,
      eq: '\\text{Mg}(\\text{s}) + 2\\text{HCl}(\\text{aq}) \\to \\text{MgCl}_2(\\text{aq}) + \\text{H}_2(\\text{g})',
    },
    {
      aName: 'iron(III) oxide',
      aSym: '\\text{Fe}_2\\text{O}_3',
      aM: 159.7,
      aCoeff: 1,
      bName: 'carbon monoxide',
      bSym: '\\text{CO}',
      bM: 28.01,
      bCoeff: 3,
      pName: 'iron',
      pSym: '\\text{Fe}',
      pM: 55.85,
      pCoeff: 2,
      eq: '\\text{Fe}_2\\text{O}_3(\\text{s}) + 3\\text{CO}(\\text{g}) \\to 2\\text{Fe}(\\text{l}) + 3\\text{CO}_2(\\text{g})',
    },
    {
      aName: 'aluminium',
      aSym: '\\text{Al}',
      aM: 26.98,
      aCoeff: 2,
      bName: 'chlorine gas',
      bSym: '\\text{Cl}_2',
      bM: 70.90,
      bCoeff: 3,
      pName: 'aluminium chloride',
      pSym: '\\text{AlCl}_3',
      pM: 133.33,
      pCoeff: 2,
      eq: '2\\text{Al}(\\text{s}) + 3\\text{Cl}_2(\\text{g}) \\to 2\\text{AlCl}_3(\\text{s})',
    },
  ] as const;

  const rx = rxns[idx % rxns.length];
  const mA = Number((rng.int(25, 180) / 10).toFixed(2));
  const mB = Number((rng.int(35, 220) / 10).toFixed(2));
  const nA = mA / rx.aM;
  const nB = mB / rx.bM;
  const ratioA = nA / rx.aCoeff;
  const ratioB = nB / rx.bCoeff;
  const limitingIsA = ratioA <= ratioB;
  const limitingName = limitingIsA ? rx.aName : rx.bName;
  const limScale = Math.min(ratioA, ratioB);
  const theoProdMass = limScale * rx.pCoeff * rx.pM;
  const yieldPct = rng.int(72, 92);
  const actualMass = Number(((theoProdMass * yieldPct) / 100).toFixed(2));
  const truePctYield = (actualMass / theoProdMass) * 100;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'challenging',
    marks: 5,
    commandTerm: 'Determine',
    stemMarkdown: `In the reaction $${rx.eq}$, $${mA.toFixed(2)}\\text{ g}$ of ${rx.aName} ($M = ${rx.aM}\\text{ g mol}^{-1}$) is mixed with $${mB.toFixed(2)}\\text{ g}$ of ${rx.bName} ($M = ${rx.bM}\\text{ g mol}^{-1}$). If $${actualMass.toFixed(2)}\\text{ g}$ of ${rx.pName} ($M = ${rx.pM}\\text{ g mol}^{-1}$) is isolated, identify the limiting reactant, calculate the theoretical yield, and determine the percentage yield (to $3$ s.f.).`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Calculates $n(${rx.aSym}) = ${roundSigFigs(nA, 4)}\\text{ mol}$ and $n(${rx.bSym}) = ${roundSigFigs(nB, 4)}\\text{ mol}$`,
        marks: 1,
      },
      {
        pointId: 'A1',
        requirement: `Divides by stoichiometric coefficients to identify **${limitingName}** as limiting reactant`,
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: `Computes theoretical mass of $${rx.pSym}$ $= ${roundSigFigs(theoProdMass, 3)}\\text{ g}$`,
        marks: 2,
      },
      {
        pointId: 'A2',
        requirement: `Percentage yield $= \\frac{${actualMass.toFixed(2)}}{${roundSigFigs(theoProdMass, 4)}} \\times 100\\% = ${roundSigFigs(truePctYield, 3)}\\%$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Compare mole-to-coefficient ratios',
        explanationMarkdown: `$\\frac{n(${rx.aSym})}{${rx.aCoeff}} = ${roundSigFigs(ratioA, 3)}$ vs $\\frac{n(${rx.bSym})}{${rx.bCoeff}} = ${roundSigFigs(ratioB, 3)}$, so **${limitingName}** runs out first.`,
      },
      {
        stepNumber: 2,
        title: 'Compute theoretical yield and percentage yield',
        explanationMarkdown: `Theoretical mass $= ${roundSigFigs(theoProdMass, 3)}\\text{ g}$, giving percentage yield $= ${roundSigFigs(truePctYield, 3)}\\%$.`,
      },
    ],
    commonPitfalls: ['Choosing the reactant with smaller mass in grams instead of comparing mole-to-coefficient ratios.'],
    isDailyEligible: true,
  };
}

function genIsotopeAbundance(rng: SeededRng, idx: number): QuestionItem {
  const m1 = rng.int(10, 120);
  const m2 = m1 + rng.pick([1, 2]);
  const pct1 = Number((rng.int(150, 850) / 10).toFixed(1));
  const pct2 = Number((100 - pct1).toFixed(1));
  const ar = (m1 * pct1 + m2 * pct2) / 100;
  const arDisplay = ar.toFixed(2);
  const isMcq = idx % 3 === 0;
  const mcq = isMcq
    ? buildMcqOptions(rng, `$${arDisplay}$`, [
        `$${((m1 + m2) / 2).toFixed(2)}$`,
        `$${((m1 * pct2 + m2 * pct1) / 100).toFixed(2)}$`,
        `$${(ar + 1.0).toFixed(2)}$`,
      ])
    : null;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.2',
    paper: isMcq ? 'Paper 1A' : 'Paper 2',
    questionType: isMcq ? 'mcq' : 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: isMcq ? 1 : 2,
    commandTerm: 'Calculate',
    stemMarkdown: `Mass spectrometry of a pure element $E$ reveals two isotopes: $^{${m1}}\\text{E}$ ($${pct1.toFixed(1)}\\%$ abundance) and $^{${m2}}\\text{E}$ ($${pct2.toFixed(1)}\\%$ abundance). Calculate the relative atomic mass $A_r$ of $E$ to $2$ decimal places.`,
    options: mcq?.options ?? null,
    correctOptionId: mcq?.correctOptionId ?? null,
    markschemePoints: isMcq
      ? [{ pointId: 'A1', requirement: `$A_r = ${arDisplay}$`, marks: 1 }]
      : [
          {
            pointId: 'M1',
            requirement: `Weighted average: $A_r = \\frac{(${m1} \\times ${pct1.toFixed(1)}) + (${m2} \\times ${pct2.toFixed(1)})}{100}$`,
            marks: 1,
          },
          {
            pointId: 'A1',
            requirement: `$A_r = ${arDisplay}$ (dimensionless)`,
            marks: 1,
          },
        ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Weight each isotopic mass by abundance',
        explanationMarkdown: `$A_r = ${m1}(${(pct1 / 100).toFixed(3)}) + ${m2}(${(pct2 / 100).toFixed(3)})$.`,
      },
      {
        stepNumber: 2,
        title: 'Report dimensionless $A_r$',
        explanationMarkdown: `$A_r = ${arDisplay}$.`,
      },
    ],
    commonPitfalls: ['Attaching units ($\\text{g mol}^{-1}$) to relative atomic mass $A_r$.'],
    isDailyEligible: true,
  };
}

function genEmpiricalFormulaCombustion(rng: SeededRng, idx: number): QuestionItem {
  // Hydrocarbon CxHy (or CxHyOz) from clean integer mole ratios
  const formulas = [
    { c: 2, h: 6, o: 1, emp: '\\text{C}_2\\text{H}_6\\text{O}', mEmp: 46.08 },
    { c: 3, h: 6, o: 1, emp: '\\text{C}_3\\text{H}_6\\text{O}', mEmp: 58.09 },
    { c: 2, h: 4, o: 1, emp: '\\text{C}_2\\text{H}_4\\text{O}', mEmp: 44.06 },
    { c: 3, h: 8, o: 1, emp: '\\text{C}_3\\text{H}_8\\text{O}', mEmp: 60.11 },
    { c: 4, h: 8, o: 1, emp: '\\text{C}_4\\text{H}_8\\text{O}', mEmp: 72.12 },
    { c: 2, h: 3, o: 2, emp: '\\text{C}_2\\text{H}_3\\text{O}_2', mEmp: 59.05 },
    { c: 3, h: 4, o: 2, emp: '\\text{C}_3\\text{H}_4\\text{O}_2', mEmp: 72.07 },
  ] as const;
  const f = formulas[idx % formulas.length];
  const sampleMol = Number((rng.int(15, 95) / 1000).toFixed(3));
  const mC = f.c * sampleMol * 12.01;
  const mH = f.h * sampleMol * 1.01;
  const mO = f.o * sampleMol * 16.00;
  const totalM = mC + mH + mO;
  const mult = rng.pick([1, 2]);
  const molarMass = (f.mEmp * mult).toFixed(2);
  const molFormula = mult === 1 ? f.emp : `\\text{C}_{${f.c * mult}}\\text{H}_{${f.h * mult}}\\text{O}_{${f.o * mult}}`;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S1.4',
    subtopicCode: 'S1.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Determine',
    stemMarkdown: `Elemental analysis of $${totalM.toFixed(3)}\\text{ g}$ of an organic compound containing only carbon, hydrogen, and oxygen finds $${mC.toFixed(3)}\\text{ g}$ of $\\text{C}$, $${mH.toFixed(3)}\\text{ g}$ of $\\text{H}$, and the remainder oxygen. Given its molar mass is $${molarMass}\\text{ g mol}^{-1}$, determine its empirical formula and molecular formula.`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: `Finds $m(\\text{O}) = ${mO.toFixed(3)}\\text{ g}$ and converts masses to moles ($n_C = ${(sampleMol * f.c).toFixed(4)}, n_H = ${(sampleMol * f.h).toFixed(4)}, n_O = ${(sampleMol * f.o).toFixed(4)}$)`,
        marks: 2,
      },
      {
        pointId: 'A1',
        requirement: `Divides by smallest mole amount to get empirical formula $${f.emp}$`,
        marks: 1,
      },
      {
        pointId: 'A2',
        requirement: `Compares $M_{\\text{empirical}} = ${f.mEmp.toFixed(2)}$ with $${molarMass}$ to get molecular formula $${molFormula}$`,
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Find mass of O by difference and convert each element to moles',
        explanationMarkdown: `Divide masses by $12.01, 1.01, 16.00\\text{ g mol}^{-1}$ and normalize by the smallest mole value to obtain integer ratio ${f.c}:${f.h}:${f.o}.`,
      },
      {
        stepNumber: 2,
        title: 'Scale empirical formula to molecular molar mass',
        explanationMarkdown: `Ratio $\\frac{${molarMass}}{${f.mEmp.toFixed(2)}} = ${mult}$, giving molecular formula $${molFormula}$.`,
      },
    ],
    commonPitfalls: ['Dividing by atomic number $Z$ instead of relative atomic mass $A_r$.'],
    isDailyEligible: true,
  };
}

/* --------------------- S2.2: VSEPR, POLARITY, BONDING & IMFs --------------------- */

const VSEPR_SPECIES = [
  { formula: '\\text{CH}_4', domains: 4, bp: 4, lp: 0, geom: 'tetrahedral', angle: '109.5^\\circ', polar: 'non-polar', imf: 'London dispersion forces' },
  { formula: '\\text{NH}_3', domains: 4, bp: 3, lp: 1, geom: 'trigonal pyramidal', angle: '107^\\circ', polar: 'polar', imf: 'hydrogen bonding' },
  { formula: '\\text{H}_2\\text{O}', domains: 4, bp: 2, lp: 2, geom: 'bent (V-shaped)', angle: '104.5^\\circ', polar: 'polar', imf: 'hydrogen bonding' },
  { formula: '\\text{BF}_3', domains: 3, bp: 3, lp: 0, geom: 'trigonal planar', angle: '120^\\circ', polar: 'non-polar', imf: 'London dispersion forces' },
  { formula: '\\text{SO}_2', domains: 3, bp: 2, lp: 1, geom: 'bent (V-shaped)', angle: '117^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{CO}_2', domains: 2, bp: 2, lp: 0, geom: 'linear', angle: '180^\\circ', polar: 'non-polar', imf: 'London dispersion forces' },
  { formula: '\\text{HCN}', domains: 2, bp: 2, lp: 0, geom: 'linear', angle: '180^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{NH}_4^+', domains: 4, bp: 4, lp: 0, geom: 'tetrahedral', angle: '109.5^\\circ', polar: 'symmetrical ion', imf: 'ionic / ion-dipole' },
  { formula: '\\text{CO}_3^{2-}', domains: 3, bp: 3, lp: 0, geom: 'trigonal planar', angle: '120^\\circ', polar: 'symmetrical resonance ion', imf: 'ionic' },
  { formula: '\\text{PH}_3', domains: 4, bp: 3, lp: 1, geom: 'trigonal pyramidal', angle: '107^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{CCl}_4', domains: 4, bp: 4, lp: 0, geom: 'tetrahedral', angle: '109.5^\\circ', polar: 'non-polar', imf: 'London dispersion forces' },
  { formula: '\\text{NF}_3', domains: 4, bp: 3, lp: 1, geom: 'trigonal pyramidal', angle: '107^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{O}_3', domains: 3, bp: 2, lp: 1, geom: 'bent (V-shaped)', angle: '117^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{CH}_2\\text{O}', domains: 3, bp: 3, lp: 0, geom: 'trigonal planar', angle: '120^\\circ', polar: 'polar', imf: 'dipole-dipole forces' },
  { formula: '\\text{BeCl}_2', domains: 2, bp: 2, lp: 0, geom: 'linear', angle: '180^\\circ', polar: 'non-polar', imf: 'London dispersion forces' },
  { formula: '\\text{NO}_3^-', domains: 3, bp: 3, lp: 0, geom: 'trigonal planar', angle: '120^\\circ', polar: 'symmetrical resonance ion', imf: 'ionic' },
] as const;

function genVseprGeometry(rng: SeededRng, idx: number): QuestionItem {
  // Pair distinct species or switch between single-species geometry, polarity explanation, and angle comparison!
  const spA = VSEPR_SPECIES[idx % VSEPR_SPECIES.length];
  const spB = VSEPR_SPECIES[(idx + Math.floor(idx / VSEPR_SPECIES.length) + 1) % VSEPR_SPECIES.length];
  const mode = idx % 3;

  if (mode === 0) {
    const angleType = Math.floor(idx / VSEPR_SPECIES.length) % 3;
    const stem =
      angleType === 0
        ? `Which row correctly states the molecular geometry and bond angle of $${spA.formula}$?`
        : angleType === 1
        ? `In VSEPR theory, what molecular shape and bond angle are predicted for $${spA.formula}$?`
        : `Determine the shape and approximate bond angle around the central atom in $${spA.formula}$.`;
    const mcq = buildMcqOptions(rng, `${spA.geom}, $${spA.angle}$`, [
      `linear, $180^\\circ$`,
      `trigonal planar, $120^\\circ$`,
      `tetrahedral, $109.5^\\circ$`,
      `bent (V-shaped), $104.5^\\circ$`,
    ]);
    return {
      id: makeId('chem-gen', idx),
      subjectSlug: 'chem',
      topicId: 'chem-S2.2',
      subtopicCode: 'S2.2',
      paper: 'Paper 1A',
      questionType: 'mcq',
      calculatorPolicy: 'allowed',
      difficulty: spA.lp > 0 ? 'standard' : 'foundation',
      marks: 1,
      commandTerm: 'Deduce',
      stemMarkdown: stem,
      options: mcq.options,
      correctOptionId: mcq.correctOptionId,
      markschemePoints: [
        { pointId: 'A1', requirement: `${spA.geom}, $${spA.angle}$ (${spA.domains} electron domains, ${spA.lp} lone pair(s))`, marks: 1 },
      ],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Count electron domains', explanationMarkdown: `$${spA.formula}$ has ${spA.domains} electron domains (${spA.bp} bonding, ${spA.lp} lone pair(s)).` },
        { stepNumber: 2, title: 'Deduce shape & angle', explanationMarkdown: `Molecular shape is **${spA.geom}** with angle $\\approx ${spA.angle}$.` },
      ],
      commonPitfalls: ['Confusing electron-domain geometry with molecular geometry when lone pairs exist.'],
      isDailyEligible: true,
    };
  }

  if (mode === 1) {
    return {
      id: makeId('chem-gen', idx),
      subjectSlug: 'chem',
      topicId: 'chem-S2.2',
      subtopicCode: 'S2.2',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 3,
      commandTerm: 'Compare',
      stemMarkdown: `Compare the molecular geometry and bond angles of $${spA.formula}$ and $${spB.formula}$ using VSEPR theory.`,
      markschemePoints: [
        { pointId: 'A1', requirement: `$${spA.formula}$: ${spA.domains} electron domains (${spA.lp} lone pair(s)) $\\implies$ ${spA.geom}, $\\approx ${spA.angle}$`, marks: 1 },
        { pointId: 'A2', requirement: `$${spB.formula}$: ${spB.domains} electron domains (${spB.lp} lone pair(s)) $\\implies$ ${spB.geom}, $\\approx ${spB.angle}$`, marks: 1 },
        { pointId: 'R1', requirement: `Explains electron-domain repulsion (and stronger lone-pair repulsion compressing angles where applicable)`, marks: 1 },
      ],
      walkthroughSteps: [
        { stepNumber: 1, title: 'Determine electron domains for both species', explanationMarkdown: `$${spA.formula}$ has ${spA.domains} domains; $${spB.formula}$ has ${spB.domains} domains.` },
        { stepNumber: 2, title: 'Contrast molecular shapes and bond angles', explanationMarkdown: `Compare ${spA.geom} ($${spA.angle}$) against ${spB.geom} ($${spB.angle}$).` },
      ],
      commonPitfalls: ['Counting double bonds as two electron domains or ignoring lone-pair repulsion.'],
      isDailyEligible: true,
    };
  }

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S2.2',
    subtopicCode: 'S2.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 3,
    commandTerm: 'Explain',
    stemMarkdown: `Explain why $${spA.formula}$ is classified as **${spA.polar}** while $${spB.formula}$ is **${spB.polar}**, referring to bond polarity and molecular symmetry.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Identifies individual polar covalent bonds due to electronegativity differences ($\Delta \\chi$)`, marks: 1 },
      { pointId: 'M2', requirement: `States geometries: $${spA.formula}$ (${spA.geom}) and $${spB.formula}$ (${spB.geom})`, marks: 1 },
      { pointId: 'A1', requirement: `Explains whether bond dipoles cancel symmetrically or produce a net dipole moment`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Assess bond dipoles', explanationMarkdown: `Check $\\Delta \\chi$ across bonds in $${spA.formula}$ and $${spB.formula}$.` },
      { stepNumber: 2, title: 'Evaluate vector cancellation from 3D geometry', explanationMarkdown: `$${spA.formula}$ (${spA.geom}) is ${spA.polar}; $${spB.formula}$ (${spB.geom}) is ${spB.polar}.` },
    ],
    commonPitfalls: ['Assuming any molecule with polar bonds must be a polar molecule (ignoring symmetry cancellation in $\\text{CO}_2$, $\\text{BF}_3$, $\\text{CCl}_4$).'],
    isDailyEligible: true,
  };
}

function genAllotropesAndBondingTriangle(rng: SeededRng, idx: number): QuestionItem {
  const solids = [
    { name: 'diamond', type: 'covalent network', cond: 'electrical insulator (all 4 valence electrons localized in $\\sigma$ bonds)', mp: 'very high (>3500 °C)', detail: 'tetrahedral $sp^3$-like lattice of $\\text{C}$ bonded to $4$ neighbors' },
    { name: 'graphite', type: 'layered covalent network', cond: 'good electrical conductor along planes (1 delocalized electron per $\\text{C}$)', mp: 'very high', detail: 'hexagonal planar layers ($120^\\circ$) held together by weak London dispersion forces' },
    { name: 'silicon dioxide ($\\text{SiO}_2$)', type: 'covalent network', cond: 'electrical insulator', mp: 'very high (~1710 °C)', detail: '3D tetrahedral network where each $\\text{Si}$ bonds to $4$ $\\text{O}$ atoms and each $\\text{O}$ bridges $2$ $\\text{Si}$ atoms' },
    { name: 'buckminsterfullerene ($\\text{C}_{60}$)', type: 'molecular covalent', cond: 'poor conductor (semiconductor; electrons delocalized within individual cages)', mp: 'sublimes at much lower $T$ (~600 °C) than diamond', detail: 'discrete soccer-ball molecules held together by London dispersion forces' },
    { name: 'sodium chloride ($\\text{NaCl}$)', type: 'ionic lattice', cond: 'conducts when molten or aqueous (mobile ions), insulator as solid', mp: 'high (~801 °C)', detail: 'strong electrostatic attractions between $\\text{Na}^+$ and $\\text{Cl}^-$ ions in 3D lattice' },
  ] as const;

  const s1 = solids[idx % solids.length];
  const s2 = solids[(idx + 1 + Math.floor(idx / solids.length)) % solids.length];

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S2.2',
    subtopicCode: 'S2.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Compare and contrast',
    stemMarkdown: `Compare and contrast the bonding, structure, and electrical conductivity of **${s1.name}** and **${s2.name}**.`,
    markschemePoints: [
      { pointId: 'A1', requirement: `${s1.name}: ${s1.type}; ${s1.detail}`, marks: 2 },
      { pointId: 'A2', requirement: `${s2.name}: ${s2.type}; ${s2.detail}`, marks: 1 },
      { pointId: 'A3', requirement: `Conductivity comparison: ${s1.name} (${s1.cond}) vs ${s2.name} (${s2.cond})`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Classify crystal/bonding type', explanationMarkdown: `${s1.name} is ${s1.type}; ${s2.name} is ${s2.type}.` },
      { stepNumber: 2, title: 'Relate mobile charge carriers to conductivity', explanationMarkdown: `Contrast electron/ion mobility: ${s1.cond} versus ${s2.cond}.` },
    ],
    commonPitfalls: ['Claiming graphite conducts via mobile ions rather than delocalized electrons, or calling $\\text{C}_{60}$ a giant covalent network.'],
    isDailyEligible: true,
  };
}

/* --------------------- R1.1: CALORIMETRY, HESS, BOND ENTHALPY --------------------- */

function genCalorimetry(rng: SeededRng, idx: number): QuestionItem {
  const fuels = [
    { name: 'ethanol', formula: '\\text{C}_2\\text{H}_5\\text{OH}', M: 46.08 },
    { name: 'methanol', formula: '\\text{CH}_3\\text{OH}', M: 32.05 },
    { name: 'propan-1-ol', formula: '\\text{C}_3\\text{H}_7\\text{OH}', M: 60.11 },
    { name: 'butan-1-ol', formula: '\\text{C}_4\\text{H}_9\\text{OH}', M: 74.14 },
    { name: 'pentan-1-ol', formula: '\\text{C}_5\\text{H}_{11}\\text{OH}', M: 88.17 },
    { name: 'hexane', formula: '\\text{C}_6\\text{H}_{14}', M: 86.20 },
  ] as const;
  const f = fuels[idx % fuels.length];
  const massWater = rng.pick([100.0, 125.0, 150.0, 200.0, 250.0]);
  const deltaT = Number((rng.int(95, 425) / 10).toFixed(1));
  const fuelMass = Number((rng.int(38, 240) / 100).toFixed(2));
  const qJ = massWater * WATER_C * deltaT;
  const qKj = qJ / 1000;
  const nFuel = fuelMass / f.M;
  const deltaH = -(qKj / nFuel);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R1.1',
    subtopicCode: 'R1.1',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `A student burns $${fuelMass.toFixed(2)}\\text{ g}$ of ${f.name} ($${f.formula}$, $M = ${f.M}\\text{ g mol}^{-1}$) under a calorimeter containing $${massWater.toFixed(1)}\\text{ g}$ of water. The temperature of the water rises by $${deltaT.toFixed(1)}\\text{ K}$. Calculate the experimental enthalpy of combustion $\\Delta H$ in $\\text{kJ mol}^{-1}$ to $3$ significant figures ($c(\\text{H}_2\\text{O}) = 4.18\\text{ J g}^{-1}\\text{ K}^{-1}$).`,
    markschemePoints: [
      { pointId: 'M1', requirement: `$q = mc\\Delta T = ${massWater.toFixed(1)} \\times 4.18 \\times ${deltaT.toFixed(1)} = ${roundSigFigs(qKj, 4)}\\text{ kJ}$`, marks: 1 },
      { pointId: 'M2', requirement: `$n = \\frac{${fuelMass.toFixed(2)}}{${f.M}} = ${roundSigFigs(nFuel, 4)}\\text{ mol}$`, marks: 1 },
      { pointId: 'M3', requirement: `Divides $-q / n$ with negative exothermic sign`, marks: 1 },
      { pointId: 'A1', requirement: `$\\Delta H = ${roundSigFigs(deltaH, 3)}\\text{ kJ mol}^{-1}$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Compute heat absorbed by water', explanationMarkdown: `$q = ${massWater.toFixed(1)} \\times 4.18 \\times ${deltaT.toFixed(1)} = ${qKj.toFixed(3)}\\text{ kJ}$.` },
      { stepNumber: 2, title: 'Divide by moles of fuel and apply negative sign', explanationMarkdown: `$\\Delta H = -\\frac{${qKj.toFixed(3)}}{${nFuel.toFixed(5)}} = ${roundSigFigs(deltaH, 3)}\\text{ kJ mol}^{-1}$.` },
    ],
    commonPitfalls: ['Substituting fuel mass instead of water mass into $q = mc\\Delta T$, or omitting the negative sign.'],
    isDailyEligible: true,
  };
}

function genBondEnthalpy(rng: SeededRng, idx: number): QuestionItem {
  const rxns = [
    {
      name: 'hydrogenation of ethene',
      eq: '\\text{C}_2\\text{H}_4(\\text{g}) + \\text{H}_2(\\text{g}) \\to \\text{C}_2\\text{H}_6(\\text{g})',
      brokenDesc: '1 \\times E(\\text{C=C}) + 4 \\times E(\\text{C–H}) + 1 \\times E(\\text{H–H})',
      formedDesc: '1 \\times E(\\text{C–C}) + 6 \\times E(\\text{C–H})',
      broken: 614 + 4 * 414 + 436,
      formed: 346 + 6 * 414,
      booklet: '$E(\\text{C=C}) = 614,\\; E(\\text{C–C}) = 346,\\; E(\\text{C–H}) = 414,\\; E(\\text{H–H}) = 436\\text{ kJ mol}^{-1}$',
    },
    {
      name: 'combustion of methane',
      eq: '\\text{CH}_4(\\text{g}) + 2\\text{O}_2(\\text{g}) \\to \\text{CO}_2(\\text{g}) + 2\\text{H}_2\\text{O}(\\text{g})',
      brokenDesc: '4 \\times E(\\text{C–H}) + 2 \\times E(\\text{O=O})',
      formedDesc: '2 \\times E(\\text{C=O}) + 4 \\times E(\\text{O–H})',
      broken: 4 * 414 + 2 * 498,
      formed: 2 * 804 + 4 * 463,
      booklet: '$E(\\text{C–H}) = 414,\\; E(\\text{O=O}) = 498,\\; E(\\text{C=O}) = 804,\\; E(\\text{O–H}) = 463\\text{ kJ mol}^{-1}$',
    },
    {
      name: 'Haber synthesis of ammonia',
      eq: '\\text{N}_2(\\text{g}) + 3\\text{H}_2(\\text{g}) \\to 2\\text{NH}_3(\\text{g})',
      brokenDesc: '1 \\times E(\\text{N}\\equiv\\text{N}) + 3 \\times E(\\text{H–H})',
      formedDesc: '6 \\times E(\\text{N–H})',
      broken: 945 + 3 * 436,
      formed: 6 * 391,
      booklet: '$E(\\text{N}\\equiv\\text{N}) = 945,\\; E(\\text{H–H}) = 436,\\; E(\\text{N–H}) = 391\\text{ kJ mol}^{-1}$',
    },
    {
      name: 'bromination of ethene',
      eq: '\\text{C}_2\\text{H}_4(\\text{g}) + \\text{Br}_2(\\text{g}) \\to \\text{C}_2\\text{H}_4\\text{Br}_2(\\text{g})',
      brokenDesc: '1 \\times E(\\text{C=C}) + 4 \\times E(\\text{C–H}) + 1 \\times E(\\text{Br–Br})',
      formedDesc: '1 \\times E(\\text{C–C}) + 4 \\times E(\\text{C–H}) + 2 \\times E(\\text{C–Br})',
      broken: 614 + 4 * 414 + 193,
      formed: 346 + 4 * 414 + 2 * 285,
      booklet: '$E(\\text{C=C}) = 614,\\; E(\\text{C–C}) = 346,\\; E(\\text{C–H}) = 414,\\; E(\\text{Br–Br}) = 193,\\; E(\\text{C–Br}) = 285\\text{ kJ mol}^{-1}$',
    },
    {
      name: 'combustion of ethanol',
      eq: '\\text{C}_2\\text{H}_5\\text{OH}(\\text{g}) + 3\\text{O}_2(\\text{g}) \\to 2\\text{CO}_2(\\text{g}) + 3\\text{H}_2\\text{O}(\\text{g})',
      brokenDesc: '5 \\times E(\\text{C–H}) + E(\\text{C–C}) + E(\\text{C–O}) + E(\\text{O–H}) + 3 \\times E(\\text{O=O})',
      formedDesc: '4 \\times E(\\text{C=O}) + 6 \\times E(\\text{O–H})',
      broken: 5 * 414 + 346 + 358 + 463 + 3 * 498,
      formed: 4 * 804 + 6 * 463,
      booklet: '$E(\\text{C–H})=414, E(\\text{C–C})=346, E(\\text{C–O})=358, E(\\text{O–H})=463, E(\\text{O=O})=498, E(\\text{C=O})=804\\text{ kJ mol}^{-1}$',
    },
  ] as const;
  const rx = rxns[idx % rxns.length];
  const mol = Number((rng.int(2, 240) / 10).toFixed(1));
  const deltaHPerCycle = rx.broken - rx.formed;
  const totalQ = deltaHPerCycle * mol;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R1.1',
    subtopicCode: 'R1.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `Using average bond enthalpies, calculate the enthalpy change (in $\\text{kJ}$) when $${mol.toFixed(1)}\\text{ mol}$ of reaction occurs according to $${rx.eq}$ (${rx.name}).`,
    stimulusMarkdown: `Average bond enthalpies: ${rx.booklet}.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Bonds broken: $${rx.brokenDesc} = ${rx.broken}\\text{ kJ mol}^{-1}$`, marks: 1 },
      { pointId: 'M2', requirement: `Bonds formed: $${rx.formedDesc} = ${rx.formed}\\text{ kJ mol}^{-1}$`, marks: 1 },
      { pointId: 'M3', requirement: `$\\Delta H_{\\text{rxn}} = ${rx.broken} - ${rx.formed} = ${deltaHPerCycle}\\text{ kJ mol}^{-1}$`, marks: 1 },
      { pointId: 'A1', requirement: `For $${mol.toFixed(1)}\\text{ mol}$: $\\Delta H = ${roundSigFigs(totalQ, 3)}\\text{ kJ}$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Compute molar enthalpy change', explanationMarkdown: `$\\Delta H_{\\text{rxn}} = \\sum E_{\\text{broken}} - \\sum E_{\\text{formed}} = ${deltaHPerCycle}\\text{ kJ mol}^{-1}$.` },
      { stepNumber: 2, title: 'Multiply by stoichiometric moles reacted', explanationMarkdown: `$\\Delta H = ${mol.toFixed(1)} \\times (${deltaHPerCycle}) = ${roundSigFigs(totalQ, 3)}\\text{ kJ}$.` },
    ],
    commonPitfalls: ['Reversing the formula to $\\sum E_{\\text{formed}} - \\sum E_{\\text{broken}}$.'],
    isDailyEligible: true,
  };
}

function genHessLaw(rng: SeededRng, idx: number): QuestionItem {
  const dh1 = -rng.int(180, 620);
  const dh2 = -rng.int(90, 420);
  const target = dh1 - dh2;
  const k = rng.pick([1, 2, 3]);
  const ans = k * target;
  const prefix = k === 1 ? '' : `${k}`;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R1.1',
    subtopicCode: 'R1.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 3,
    commandTerm: 'Determine',
    stemMarkdown: `Using Hess's Law and the thermochemical equations provided, determine $\\Delta H$ (in $\\text{kJ}$) for $${prefix}\\text{X}(\\text{s}) + ${prefix}\\text{Y}(\\text{g}) \\to ${prefix}\\text{Z}(\\text{s})$.`,
    stimulusMarkdown: `(1) $\\text{X}(\\text{s}) + 2\\text{Y}(\\text{g}) \\to \\text{W}(\\text{s}) \\quad \\Delta H_1 = ${dh1}\\text{ kJ}$<br/>(2) $\\text{Z}(\\text{s}) + \\text{Y}(\\text{g}) \\to \\text{W}(\\text{s}) \\quad \\Delta H_2 = ${dh2}\\text{ kJ}$`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Keeps (1) and reverses (2) ($-\\Delta H_2 = ${-dh2}\\text{ kJ}$)`, marks: 1 },
      { pointId: 'M2', requirement: `Cancels $\\text{W}(\\text{s})$ and $1\\,\\text{Y}(\\text{g})$${k > 1 ? `, then scales by ${k}` : ''}`, marks: 1 },
      { pointId: 'A1', requirement: `$\\Delta H = ${ans}\\text{ kJ}$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Combine equations to cancel intermediate $\\text{W}$', explanationMarkdown: `$\\Delta H_{\\text{1 mol}} = ${dh1} - (${dh2}) = ${target}\\text{ kJ}$.` },
      { stepNumber: 2, title: 'Scale to target stoichiometry', explanationMarkdown: `$${k} \\times (${target}) = ${ans}\\text{ kJ}$.` },
    ],
    commonPitfalls: ['Forgetting to negate $\\Delta H_2$ when reversing equation (2).'],
    isDailyEligible: true,
  };
}

/* --------------------- R2.2: EQUILIBRIUM & KINETICS --------------------- */

function genKcEquilibrium(rng: SeededRng, idx: number): QuestionItem {
  const systems = [
    {
      name: 'Haber synthesis',
      eq: '\\text{N}_2(\\text{g}) + 3\\text{H}_2(\\text{g}) \\rightleftharpoons 2\\text{NH}_3(\\text{g})',
      isExo: true,
      expr: 'K_c = \\frac{[\\text{NH}_3]^2}{[\\text{N}_2][\\text{H}_2]^3}',
      calc: (a: number, b: number, c: number) => (c * c) / (a * b * b * b),
      labels: ['N₂', 'H₂', 'NH₃'],
    },
    {
      name: 'Contact oxidation',
      eq: '2\\text{SO}_2(\\text{g}) + \\text{O}_2(\\text{g}) \\rightleftharpoons 2\\text{SO}_3(\\text{g})',
      isExo: true,
      expr: 'K_c = \\frac{[\\text{SO}_3]^2}{[\\text{SO}_2]^2[\\text{O}_2]}',
      calc: (a: number, b: number, c: number) => (c * c) / (a * a * b),
      labels: ['SO₂', 'O₂', 'SO₃'],
    },
    {
      name: 'hydrogen iodide equilibrium',
      eq: '\\text{H}_2(\\text{g}) + \\text{I}_2(\\text{g}) \\rightleftharpoons 2\\text{HI}(\\text{g})',
      isExo: true,
      expr: 'K_c = \\frac{[\\text{HI}]^2}{[\\text{H}_2][\\text{I}_2]}',
      calc: (a: number, b: number, c: number) => (c * c) / (a * b),
      labels: ['H₂', 'I₂', 'HI'],
    },
    {
      name: 'dinitrogen tetroxide dissociation',
      eq: '\\text{N}_2\\text{O}_4(\\text{g}) \\rightleftharpoons 2\\text{NO}_2(\\text{g})',
      isExo: false,
      expr: 'K_c = \\frac{[\\text{NO}_2]^2}{[\\text{N}_2\\text{O}_4]}',
      calc: (a: number, _b: number, c: number) => (c * c) / a,
      labels: ['N₂O₄', '', 'NO₂'],
    },
  ] as const;

  const sys = systems[idx % systems.length];
  const c1 = Number((rng.int(10, 95) / 100).toFixed(2));
  const c2 = Number((rng.int(12, 98) / 100).toFixed(2));
  const c3 = Number((rng.int(18, 160) / 100).toFixed(2));
  const kc = sys.calc(c1, c2, c3);
  const kcStr = roundSigFigs(kc, 3);
  const concDesc = sys.labels[1]
    ? `$[${sys.labels[0]}] = ${c1.toFixed(2)}$, $[${sys.labels[1]}] = ${c2.toFixed(2)}$, and $[${sys.labels[2]}] = ${c3.toFixed(2)}\\text{ mol dm}^{-3}$`
    : `$[${sys.labels[0]}] = ${c1.toFixed(2)}$ and $[${sys.labels[2]}] = ${c3.toFixed(2)}\\text{ mol dm}^{-3}$`;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R2.2',
    subtopicCode: 'R2.3',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Determine',
    stemMarkdown: `For the ${sys.name} equilibrium $${sys.eq}$ ($\\Delta H ${sys.isExo ? '< 0' : '> 0'}$), measured equilibrium concentrations are ${concDesc}. (a) Write the $K_c$ expression and calculate its numerical value to $3$ significant figures. (b) State and explain how increasing temperature affects $K_c$.`,
    markschemePoints: [
      { pointId: 'A1', requirement: `$${sys.expr}$`, marks: 1 },
      { pointId: 'M1', requirement: `Substitutes concentrations accurately`, marks: 1 },
      { pointId: 'A2', requirement: `$K_c \\approx ${kcStr}$`, marks: 1 },
      {
        pointId: 'R1',
        requirement: sys.isExo
          ? 'Forward reaction is exothermic $\\implies$ higher $T$ shifts left and **decreases $K_c$**'
          : 'Forward reaction is endothermic $\\implies$ higher $T$ shifts right and **increases $K_c$**',
        marks: 1,
      },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Write and evaluate $K_c$', explanationMarkdown: `$${sys.expr} \\approx ${kcStr}$.` },
      { stepNumber: 2, title: 'Apply Le Chatelier temperature dependence', explanationMarkdown: `Higher $T$ favors the endothermic direction, so $K_c$ ${sys.isExo ? 'decreases' : 'increases'}.` },
    ],
    commonPitfalls: ['Multiplying concentrations by stoichiometric coefficients instead of raising to powers.'],
    isDailyEligible: true,
  };
}

function genRateStoichiometry(rng: SeededRng, idx: number): QuestionItem {
  const rxns = [
    { eq: '2\\text{N}_2\\text{O}_5(\\text{g}) \\to 4\\text{NO}_2(\\text{g}) + \\text{O}_2(\\text{g})', rCoeff: 2, pCoeff: 4, rName: '\\text{N}_2\\text{O}_5', pName: '\\text{NO}_2' },
    { eq: '4\\text{NH}_3(\\text{g}) + 5\\text{O}_2(\\text{g}) \\to 4\\text{NO}(\\text{g}) + 6\\text{H}_2\\text{O}(\\text{g})', rCoeff: 5, pCoeff: 6, rName: '\\text{O}_2', pName: '\\text{H}_2\\text{O}' },
    { eq: '2\\text{H}_2\\text{O}_2(\\text{aq}) \\to 2\\text{H}_2\\text{O}(\\text{l}) + \\text{O}_2(\\text{g})', rCoeff: 2, pCoeff: 1, rName: '\\text{H}_2\\text{O}_2', pName: '\\text{O}_2' },
    { eq: '\\text{N}_2(\\text{g}) + 3\\text{H}_2(\\text{g}) \\to 2\\text{NH}_3(\\text{g})', rCoeff: 3, pCoeff: 2, rName: '\\text{H}_2', pName: '\\text{NH}_3' },
    { eq: '2\\text{NO}(\\text{g}) + \\text{O}_2(\\text{g}) \\to 2\\text{NO}_2(\\text{g})', rCoeff: 1, pCoeff: 2, rName: '\\text{O}_2', pName: '\\text{NO}_2' },
  ] as const;
  const rx = rxns[idx % rxns.length];
  const rRate = Number((rng.int(10, 180) / 1000).toFixed(4));
  const pRate = rRate * (rx.pCoeff / rx.rCoeff);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R2.2',
    subtopicCode: 'R2.2',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 2,
    commandTerm: 'Calculate',
    stemMarkdown: `For $${rx.eq}$, the instantaneous rate of consumption of $${rx.rName}$ is $${rRate.toFixed(4)}\\text{ mol dm}^{-3}\\text{ s}^{-1}$. Calculate the instantaneous rate of formation of $${rx.pName}$ in $\\text{mol dm}^{-3}\\text{ s}^{-1}$.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Rate ratio $\\frac{${rx.pCoeff}}{${rx.rCoeff}} \\times ${rRate.toFixed(4)}$`, marks: 1 },
      { pointId: 'A1', requirement: `$${roundSigFigs(pRate, 3)}\\text{ mol dm}^{-3}\\text{ s}^{-1}$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Scale by stoichiometric coefficients', explanationMarkdown: `$\\text{rate}(${rx.pName}) = \\frac{${rx.pCoeff}}{${rx.rCoeff}} \\times ${rRate.toFixed(4)}$.` },
      { stepNumber: 2, title: 'Compute with units', explanationMarkdown: `$${roundSigFigs(pRate, 3)}\\text{ mol dm}^{-3}\\text{ s}^{-1}$.` },
    ],
    commonPitfalls: ['Inverting the stoichiometric ratio.'],
    isDailyEligible: true,
  };
}

/* --------------------- R3.1: pH (STRONG ACIDS/BASES SL), REDOX & ORGANIC --------------------- */

function genStrongAcidBasePh(rng: SeededRng, idx: number): QuestionItem {
  const isBase = idx % 2 === 1;
  const mantissa = Number((rng.int(10, 99) / 10).toFixed(1));
  const exp = rng.pick([-1, -2, -3, -4, -5]);
  const conc = mantissa * Math.pow(10, exp);
  const isDiprotic = idx % 4 === 2;
  const hConc = isBase ? 1e-14 / conc : conc * (isDiprotic ? 2 : 1);
  const ph = -Math.log10(hConc);
  const species = isBase
    ? rng.pick(['\\text{NaOH}', '\\text{KOH}'])
    : isDiprotic
    ? '\\text{H}_2\\text{SO}_4'
    : rng.pick(['\\text{HCl}', '\\text{HNO}_3']);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R3.1',
    subtopicCode: 'R3.1',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 3,
    commandTerm: 'Calculate',
    stemMarkdown: `Calculate the $\\text{pH}$ at $298\\text{ K}$ ($K_w = 1.00 \\times 10^{-14}$) of a $${mantissa.toFixed(1)} \\times 10^{${exp}}\\text{ mol dm}^{-3}$ aqueous solution of $${species}$ (assuming complete dissociation).`,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: isBase
          ? `$[\\text{OH}^-] = ${mantissa.toFixed(1)} \\times 10^{${exp}}$ $\\implies$ $[\\text{H}^+] = K_w / [\\text{OH}^-]$`
          : isDiprotic
          ? `Diprotic complete dissociation: $[\\text{H}^+] = 2 \\times ${mantissa.toFixed(1)} \\times 10^{${exp}}$`
          : `$[\\text{H}^+] = ${mantissa.toFixed(1)} \\times 10^{${exp}}\\text{ mol dm}^{-3}$`,
        marks: 1,
      },
      { pointId: 'M2', requirement: `$\\text{pH} = -\\log_{10}[\\text{H}^+]$`, marks: 1 },
      { pointId: 'A1', requirement: `$\\text{pH} = ${ph.toFixed(2)}$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Determine $[\\text{H}^+]$', explanationMarkdown: `$[\\text{H}^+] = ${hConc.toExponential(2)}\\text{ mol dm}^{-3}$.` },
      { stepNumber: 2, title: 'Calculate $\\text{pH}$ to 2 decimal places', explanationMarkdown: `$\\text{pH} = -\\log_{10}(${hConc.toExponential(2)}) = ${ph.toFixed(2)}$.` },
    ],
    commonPitfalls: [isBase ? 'Reporting $\\text{pOH}$ as $\\text{pH}$.' : 'Using $\\ln$ instead of $\\log_{10}$.'],
    isDailyEligible: true,
  };
}

function genPhDilutionFactor(rng: SeededRng, idx: number): QuestionItem {
  const isBase = idx % 2 === 1;
  const initPh = isBase ? rng.int(11, 13) : rng.int(1, 3);
  const power = rng.int(1, 3);
  const factor = Math.pow(10, power);
  const finalPh = isBase ? initPh - power : initPh + power;
  const species = isBase ? 'strong alkali ($\\text{NaOH}$)' : 'strong monoprotic acid ($\\text{HCl}$)';

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R3.1',
    subtopicCode: 'R3.1',
    paper: 'Paper 1A',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 2,
    commandTerm: 'Deduce',
    stemMarkdown: `An aqueous solution of a ${species} has an initial $\\text{pH}$ of $${initPh}.0$ at $298\\text{ K}$. It is diluted with distilled water by a factor of $${factor}$ (e.g. $10^{${power}}$-fold dilution). Deduce the new $\\text{pH}$.`,
    markschemePoints: [
      { pointId: 'M1', requirement: `Concentration drops by $10^{${power}}$, shifting $\\text{pH}$ by $${power}$ unit(s) toward $7$`, marks: 1 },
      { pointId: 'A1', requirement: `Final $\\text{pH} = ${finalPh}.0$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Apply logarithmic base-10 scale', explanationMarkdown: `Each $10$-fold dilution changes $[\\text{H}^+]$ (or $[\\text{OH}^-]$) by $10^{-1}$, shifting $\\text{pH}$ by $1$ unit toward $7$.` },
      { stepNumber: 2, title: 'Shift by $' + power + '$ units', explanationMarkdown: `Final $\\text{pH} = ${finalPh}.0$.` },
    ],
    commonPitfalls: ['Dividing the $\\text{pH}$ value by the dilution factor instead of shifting logarithmically.'],
    isDailyEligible: true,
  };
}

function genOrganicCombustionStoich(rng: SeededRng, idx: number): QuestionItem {
  // Complete combustion of alkanes/alcohols CxHy(Oz) -> x CO2 + (y/2) H2O
  const fuels = [
    { name: 'methane', formula: '\\text{CH}_4', c: 1, h: 4, o: 0, M: 16.05 },
    { name: 'ethane', formula: '\\text{C}_2\\text{H}_6', c: 2, h: 6, o: 0, M: 30.08 },
    { name: 'propane', formula: '\\text{C}_3\\text{H}_8', c: 3, h: 8, o: 0, M: 44.11 },
    { name: 'butane', formula: '\\text{C}_4\\text{H}_{10}', c: 4, h: 10, o: 0, M: 58.14 },
    { name: 'methanol', formula: '\\text{CH}_3\\text{OH}', c: 1, h: 4, o: 1, M: 32.05 },
    { name: 'ethanol', formula: '\\text{C}_2\\text{H}_5\\text{OH}', c: 2, h: 6, o: 1, M: 46.08 },
  ] as const;
  const f = fuels[idx % fuels.length];
  const mass = Number((rng.int(120, 960) / 100).toFixed(2));
  const nFuel = mass / f.M;
  const o2Coeff = f.c + f.h / 4 - f.o / 2;
  const nO2 = nFuel * o2Coeff;
  const vO2Stp = nO2 * IB_STP_MOLAR_VOL;

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R3.1',
    subtopicCode: 'R3.4',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'allowed',
    difficulty: 'standard',
    marks: 4,
    commandTerm: 'Calculate',
    stemMarkdown: `Write the balanced equation for the complete combustion of ${f.name} ($${f.formula}$, $M = ${f.M}\\text{ g mol}^{-1}$), and calculate the volume of $\\text{O}_2(\\text{g})$ at STP ($273.15\\text{ K}, 100\\text{ kPa}$, $V_m = 22.7\\text{ dm}^3\\text{ mol}^{-1}$) required to burn $${mass.toFixed(2)}\\text{ g}$ of ${f.name} completely.`,
    markschemePoints: [
      { pointId: 'A1', requirement: `Balanced equation: $${f.formula} + ${o2Coeff}\\text{O}_2 \\to ${f.c === 1 ? '' : f.c}\\text{CO}_2 + ${f.h / 2}\\text{H}_2\\text{O}$`, marks: 1 },
      { pointId: 'M1', requirement: `$n(${f.formula}) = \\frac{${mass.toFixed(2)}}{${f.M}} = ${roundSigFigs(nFuel, 4)}\\text{ mol}$ and $n(\\text{O}_2) = ${roundSigFigs(nO2, 4)}\\text{ mol}$`, marks: 2 },
      { pointId: 'A2', requirement: `$V(\\text{O}_2) = ${roundSigFigs(nO2, 4)} \\times 22.7 = ${roundSigFigs(vO2Stp, 3)}\\text{ dm}^3$`, marks: 1 },
    ],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Balance complete combustion equation', explanationMarkdown: `Balance $\\text{C}$ to $\\text{CO}_2$, $\\text{H}$ to $\\text{H}_2\\text{O}$, then $\\text{O}_2$ ($${o2Coeff}\\,\\text{O}_2$).` },
      { stepNumber: 2, title: 'Convert moles to STP volume using 22.7 dm³ mol⁻¹', explanationMarkdown: `$V(\\text{O}_2) = ${roundSigFigs(vO2Stp, 3)}\\text{ dm}^3$.` },
    ],
    commonPitfalls: ['Forgetting the oxygen atom already inside alcohols when balancing $\\text{O}_2$.'],
    isDailyEligible: true,
  };
}

function genElectronConfigurationSL(rng: SeededRng, idx: number): QuestionItem {
  const elements = [
    { z: 6, sym: 'C', cfg: '1s^2 2s^2 2p^2', val: 4 },
    { z: 7, sym: 'N', cfg: '1s^2 2s^2 2p^3', val: 5 },
    { z: 8, sym: 'O', cfg: '1s^2 2s^2 2p^4', val: 6 },
    { z: 9, sym: 'F', cfg: '1s^2 2s^2 2p^5', val: 7 },
    { z: 11, sym: 'Na', cfg: '1s^2 2s^2 2p^6 3s^1', val: 1 },
    { z: 12, sym: 'Mg', cfg: '1s^2 2s^2 2p^6 3s^2', val: 2 },
    { z: 13, sym: 'Al', cfg: '1s^2 2s^2 2p^6 3s^2 3p^1', val: 3 },
    { z: 14, sym: 'Si', cfg: '1s^2 2s^2 2p^6 3s^2 3p^2', val: 4 },
    { z: 15, sym: 'P', cfg: '1s^2 2s^2 2p^6 3s^2 3p^3', val: 5 },
    { z: 16, sym: 'S', cfg: '1s^2 2s^2 2p^6 3s^2 3p^4', val: 6 },
    { z: 17, sym: 'Cl', cfg: '1s^2 2s^2 2p^6 3s^2 3p^5', val: 7 },
    { z: 20, sym: 'Ca', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^2', val: 2 },
    { z: 22, sym: 'Ti', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^2', val: 4 },
    { z: 24, sym: 'Cr', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^1 3d^5', val: 6 },
    { z: 26, sym: 'Fe', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^6', val: 8 },
    { z: 29, sym: 'Cu', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^1 3d^{10}', val: 11 },
    { z: 30, sym: 'Zn', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^{10}', val: 12 },
    { z: 35, sym: 'Br', cfg: '1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^{10} 4p^5', val: 7 },
  ] as const;

  const el = elements[idx % elements.length];
  const mcq = buildMcqOptions(rng, `$${el.cfg}$`, [
    `$1s^2 2s^2 2p^6 3s^2 3p^6 3d^{10}$`,
    `$1s^2 2s^2 2p^6 3s^2 3p^4$`,
    `$1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^4$`,
    `$1s^2 2s^2 2p^5$`,
  ]);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-S3.1',
    subtopicCode: 'S1.3',
    paper: 'Paper 1A',
    questionType: 'mcq',
    calculatorPolicy: 'allowed',
    difficulty: el.z > 20 ? 'challenging' : 'foundation',
    marks: 1,
    commandTerm: 'Deduce',
    stemMarkdown: `Which full electron configuration represents a neutral ground-state atom of $\\text{${el.sym}}$ ($Z = ${el.z}$)?`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `$${el.cfg}$`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Apply Aufbau principle and exceptions for Cr/Cu', explanationMarkdown: `Fill $1s \\to 2s \\to 2p \\to 3s \\to 3p \\to 4s \\to 3d \\to 4p$ up to $Z = ${el.z}$ electrons (noting $\\text{Cr}$ is $4s^1 3d^5$ and $\\text{Cu}$ is $4s^1 3d^{10}$).` },
      { stepNumber: 2, title: 'Verify total electron count', explanationMarkdown: `The exponents sum to $${el.z}$, giving $${el.cfg}$.` },
    ],
    commonPitfalls: ['Writing $4s^2 3d^4$ for $\\text{Cr}$ or $4s^2 3d^9$ for $\\text{Cu}$.'],
    isDailyEligible: true,
  };
}

function genRedoxOxidationState(rng: SeededRng, idx: number): QuestionItem {
  const species = [
    { formula: '\\text{MnO}_4^-', elem: 'Mn', ox: '+7', context: 'manganate(VII) titrations' },
    { formula: '\\text{Cr}_2\\text{O}_7^{2-}', elem: 'Cr', ox: '+6', context: 'dichromate(VI) oxidation' },
    { formula: '\\text{NO}_3^-', elem: 'N', ox: '+5', context: 'nitrate chemistry' },
    { formula: '\\text{NO}_2^-', elem: 'N', ox: '+3', context: 'nitrite chemistry' },
    { formula: '\\text{SO}_4^{2-}', elem: 'S', ox: '+6', context: 'sulfate solutions' },
    { formula: '\\text{SO}_3^{2-}', elem: 'S', ox: '+4', context: 'sulfite reducing agents' },
    { formula: '\\text{S}_2\\text{O}_3^{2-}', elem: 'S', ox: '+2', context: 'thiosulfate-iodine titrations' },
    { formula: '\\text{ClO}_3^-', elem: 'Cl', ox: '+5', context: 'chlorate(V) disproportionation' },
    { formula: '\\text{ClO}^-', elem: 'Cl', ox: '+1', context: 'hypochlorite bleach' },
    { formula: '\\text{VO}_2^+', elem: 'V', ox: '+5', context: 'vanadium redox chemistry' },
    { formula: '\\text{Fe}_2\\text{O}_3', elem: 'Fe', ox: '+3', context: 'blast furnace iron extraction' },
    { formula: '\\text{H}_2\\text{O}_2', elem: 'O', ox: '-1', context: 'peroxide disproportionation' },
    { formula: '\\text{C}_2\\text{O}_4^{2-}', elem: 'C', ox: '+3', context: 'ethanedioate standardization' },
    { formula: '\\text{K}_2\\text{CrO}_4', elem: 'Cr', ox: '+6', context: 'chromate equilibrium' },
    { formula: '\\text{NH}_4^+', elem: 'N', ox: '-3', context: 'ammonium salts' },
  ] as const;
  const sp = species[idx % species.length];
  const oxNum = Number(sp.ox);
  const mcq = buildMcqOptions(rng, `$${sp.ox}$`, [
    `$${oxNum > 0 ? `+${oxNum - 2}` : `${oxNum - 1}`}$`,
    `$${oxNum > 0 ? `+${oxNum - 1}` : `+${Math.abs(oxNum)}`}$`,
    `$${oxNum >= 0 ? `-${oxNum}` : `+${Math.abs(oxNum) + 1}`}$`,
  ]);

  return {
    id: makeId('chem-gen', idx),
    subjectSlug: 'chem',
    topicId: 'chem-R3.1',
    subtopicCode: 'R3.2',
    paper: 'Paper 1A',
    questionType: 'mcq',
    calculatorPolicy: 'allowed',
    difficulty: 'foundation',
    marks: 1,
    commandTerm: 'Deduce',
    stemMarkdown: `In ${sp.context}, what is the oxidation state of ${sp.elem} in $${sp.formula}$?`,
    options: mcq.options,
    correctOptionId: mcq.correctOptionId,
    markschemePoints: [{ pointId: 'A1', requirement: `Oxidation state $${sp.ox}$`, marks: 1 }],
    walkthroughSteps: [
      { stepNumber: 1, title: 'Sum oxidation states to overall charge', explanationMarkdown: `Assign $\\text{O} = -2$ (except $-1$ in peroxides) and $\\text{H} = +1$ and solve for ${sp.elem}.` },
      { stepNumber: 2, title: 'Write sign before magnitude', explanationMarkdown: `IB notation puts sign first: $${sp.ox}$.` },
    ],
    commonPitfalls: ['Writing charge notation (e.g. $6+$) instead of oxidation state ($+6$).'],
    isDailyEligible: true,
  };
}

const CHEM_WEIGHTED_FAMILIES: ReadonlyArray<{ fn: ChemFamilyFn; weight: number }> = [
  { fn: genStpGasVolume, weight: 8 },
  { fn: genIdealGasLaw, weight: 7 },
  { fn: genTitrationMolarity, weight: 7 },
  { fn: genDilutionAndMolarity, weight: 6 },
  { fn: genLimitingReactantYield, weight: 7 },
  { fn: genIsotopeAbundance, weight: 5 },
  { fn: genEmpiricalFormulaCombustion, weight: 6 },
  { fn: genVseprGeometry, weight: 3 },
  { fn: genAllotropesAndBondingTriangle, weight: 1 },
  { fn: genCalorimetry, weight: 8 },
  { fn: genBondEnthalpy, weight: 7 },
  { fn: genHessLaw, weight: 6 },
  { fn: genKcEquilibrium, weight: 7 },
  { fn: genRateStoichiometry, weight: 7 },
  { fn: genStrongAcidBasePh, weight: 7 },
  { fn: genPhDilutionFactor, weight: 2 },
  { fn: genOrganicCombustionStoich, weight: 7 },
  { fn: genElectronConfigurationSL, weight: 1 },
  { fn: genRedoxOxidationState, weight: 1 },
];

export function generateChemistryQuestions(
  targetCount: number,
  seed = 204887
): QuestionItem[] {
  const rng = new SeededRng(seed);
  const items: QuestionItem[] = [];
  const totalW = CHEM_WEIGHTED_FAMILIES.reduce((s, f) => s + f.weight, 0);
  const pool: ChemFamilyFn[] = [];
  for (const entry of CHEM_WEIGHTED_FAMILIES) {
    for (let k = 0; k < entry.weight; k++) pool.push(entry.fn);
  }
  for (let i = 0; i < targetCount; i++) {
    const fn = pool[i % totalW];
    items.push(fn(rng, i + 1));
  }
  return items;
}
