'use client';

import React, { useState } from 'react';
import { KaTeXText } from '@/components/math/KaTeXText';

interface CalcStepRule {
  id: string;
  markCode: 'M1' | 'M2' | 'A1';
  category: 'Unit Conversion' | 'Mole Ratio Logic' | 'Sign Convention' | 'Significant Figures';
  expectedExpression: string;
  auditExplanation: string;
  commonTrap: string;
}

interface CalcDrill {
  id: string;
  title: string;
  topicTag: string;
  totalMarks: number;
  questionPrompt: string;
  givenDataSummary: string;
  requiredSigFigs: number;
  expectedFinalValue: string;
  expectedUnit: string;
  acceptedUnitAliases: string[];
  sampleWorking: string;
  steps: CalcStepRule[];
}

const CHEMISTRY_DRILLS: CalcDrill[] = [
  {
    id: 'ideal-gas',
    title: 'Drill 1 · Ideal Gas Law ($PV = nRT$) with Unit Traps',
    topicTag: 'Structure 1.5 · Ideal Gases',
    totalMarks: 4,
    questionPrompt:
      'Calculate the amount of gas, in $\\text{mol}$, contained in a $250.0\\text{ cm}^3$ flask of $\\text{CO}_2\\text{(g)}$ at a pressure of $105\\text{ kPa}$ and a temperature of $27.0^\\circ\\text{C}$. ($R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$)',
    givenDataSummary: '$V = 250.0\\text{ cm}^3$ (4 s.f.), $P = 105\\text{ kPa}$ (3 s.f.), $T = 27.0^\\circ\\text{C}$ (3 s.f.)',
    requiredSigFigs: 3,
    expectedFinalValue: '0.0105',
    expectedUnit: 'mol',
    acceptedUnitAliases: ['mol', 'moles'],
    sampleWorking:
      'T = 27.0 + 273.15 = 300.15 K\nV = 250.0 / 1000 = 0.2500 dm^3 (with P = 105 kPa)\nn = PV / RT = (105 * 0.2500) / (8.31 * 300.15) = 0.010524... = 0.0105 mol',
    steps: [
      {
        id: 'ig-1',
        markCode: 'M1',
        category: 'Unit Conversion',
        expectedExpression: '$T = 27.0 + 273.15 = 300.15\\text{ K}$ and $V = 250.0 \\times 10^{-6}\\text{ m}^3$ (or $0.2500\\text{ dm}^3$ with $P$ in $\\text{kPa}$)',
        auditExplanation: 'Converts temperature from Celsius to Kelvin and matches $P, V$ units to $R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$.',
        commonTrap: 'Substituting $T = 27$ directly or leaving $V$ in $\\text{cm}^3$ with $P$ in $\\text{kPa}$ (off by factor of $10^3$).',
      },
      {
        id: 'ig-2',
        markCode: 'M2',
        category: 'Mole Ratio Logic',
        expectedExpression: '$n = \\frac{PV}{RT} = \\frac{(105 \\times 10^3\\text{ Pa})(2.500 \\times 10^{-4}\\text{ m}^3)}{8.31 \\times 300.15\\text{ K}}$',
        auditExplanation: 'Rearranges $PV = nRT$ correctly to isolate $n = PV / RT$.',
        commonTrap: 'Inverting the fraction as $RT / PV$.',
      },
      {
        id: 'ig-3',
        markCode: 'A1',
        category: 'Significant Figures',
        expectedExpression: '$n = 0.0105\\text{ mol}$ (or $1.05 \\times 10^{-2}\\text{ mol}$, 3 significant figures)',
        auditExplanation: 'Matches the lowest precision input datum ($105\\text{ kPa}$ has 3 significant figures).',
        commonTrap: 'Writing $0.01\\text{ mol}$ (1 s.f.) loses the final `A1` mark on Paper 2.',
      },
    ],
  },
  {
    id: 'calorimetry',
    title: 'Drill 2 · Coffee-Cup Calorimetry ($q = mc\\Delta T$ & $\\Delta H$ Sign)',
    topicTag: 'Reactivity 1.1 · Measuring Enthalpy',
    totalMarks: 4,
    questionPrompt:
      'When $0.654\\text{ g}$ of zinc powder ($A_r = 65.38$) is added to $50.0\\text{ cm}^3$ of excess $1.00\\text{ mol dm}^{-3}\\;\\text{CuSO}_4\\text{(aq)}$, the temperature rises from $21.5^\\circ\\text{C}$ to $31.8^\\circ\\text{C}$. Calculate $\\Delta H^\\ominus$ in $\\text{kJ mol}^{-1}$.',
    givenDataSummary: '$m(\\text{Zn}) = 0.654\\text{ g}$, $V(\\text{soln}) = 50.0\\text{ cm}^3$, $\\Delta T = +10.3\\text{ K}$ (3 s.f.)',
    requiredSigFigs: 3,
    expectedFinalValue: '-215',
    expectedUnit: 'kJ mol⁻¹',
    acceptedUnitAliases: ['kjmol-1', 'kj/mol', 'kjmol^-1'],
    sampleWorking:
      'q = 50.0 * 4.18 * 10.3 = 2152.7 J = 2.1527 kJ (keep unrounded)\nn(Zn) = 0.654 / 65.38 = 0.010003 mol\nDelta H = -2.1527 / 0.010003 = -215.20 kJ mol^-1 -> -215 kJ mol^-1 (3 s.f.)',
    steps: [
      {
        id: 'cal-1',
        markCode: 'M1',
        category: 'Unit Conversion',
        expectedExpression: '$q = m_{\\text{water}} c \\Delta T = 50.0\\text{ g} \\times 4.18\\text{ J g}^{-1}\\text{ K}^{-1} \\times 10.3\\text{ K} = 2152.7\\text{ J} = 2.1527\\text{ kJ}$',
        auditExplanation: 'Uses the mass of the aqueous solution ($50.0\\text{ g}$), NOT the mass of solid zinc ($0.654\\text{ g}$), in $q = mc\\Delta T$.',
        commonTrap: 'Using $m = 0.654\\text{ g}$ in $q = mc\\Delta T$ is the #1 IB Chemistry SL calorimetry mistake.',
      },
      {
        id: 'cal-2',
        markCode: 'M2',
        category: 'Mole Ratio Logic',
        expectedExpression: '$n(\\text{Zn}) = \\frac{0.654\\text{ g}}{65.38\\text{ g mol}^{-1}} = 0.010003\\text{ mol}$',
        auditExplanation: 'Divides heat released $q$ (in $\\text{kJ}$) by the unrounded moles of limiting reactant $\\text{Zn}$.',
        commonTrap: 'Dividing by moles of excess $\\text{CuSO}_4$ ($0.0500\\text{ mol}$) or rounding intermediates early.',
      },
      {
        id: 'cal-3',
        markCode: 'A1',
        category: 'Sign Convention',
        expectedExpression: '$\\Delta H = -\\frac{2.1527\\text{ kJ}}{0.010003\\text{ mol}} = -215\\text{ kJ mol}^{-1}$ (3 s.f., negative sign mandatory)',
        auditExplanation: 'Temperature of surroundings rose ($\\Delta T > 0$), so the reaction is exothermic and $\\Delta H$ MUST carry a negative sign ($-$).',
        commonTrap: 'Writing $+215\\text{ kJ mol}^{-1}$ or omitting the minus sign forfeits `A1`.',
      },
    ],
  },
  {
    id: 'back-titration',
    title: 'Drill 3 · Acid-Base Back-Titration ($\\text{CaCO}_3$ Eggshell Purity)',
    topicTag: 'Structure 1.4 & Reactivity 3.1 · Stoichiometry',
    totalMarks: 4,
    questionPrompt:
      'A $1.25\\text{ g}$ impure $\\text{CaCO}_3$ sample ($M_r = 100.09$) is reacted with $50.0\\text{ cm}^3$ of $1.00\\text{ mol dm}^{-3}\\;\\text{HCl}$. The unreacted excess $\\text{HCl}$ requires $28.0\\text{ cm}^3$ of $1.00\\text{ mol dm}^{-3}\\;\\text{NaOH}$ for neutralization. Calculate the percentage purity of $\\text{CaCO}_3$.',
    givenDataSummary: '$n(\\text{HCl initial}) = 0.0500\\text{ mol}$, $n(\\text{NaOH}) = 0.0280\\text{ mol}$ (3 s.f.)',
    requiredSigFigs: 3,
    expectedFinalValue: '88.1',
    expectedUnit: '%',
    acceptedUnitAliases: ['%', 'percent'],
    sampleWorking:
      'n(HCl) initial = 0.0500 * 1.00 = 0.0500 mol\nn(HCl) excess = n(NaOH) = 0.0280 * 1.00 = 0.0280 mol\nn(HCl) reacted = 0.0500 - 0.0280 = 0.0220 mol\nn(CaCO3) = 0.0220 / 2 = 0.0110 mol\nm(CaCO3) = 0.0110 * 100.09 = 1.10099 g\n% purity = (1.10099 / 1.25) * 100 = 88.1%',
    steps: [
      {
        id: 'bt-1',
        markCode: 'M1',
        category: 'Unit Conversion',
        expectedExpression: '$n(\\text{HCl})_{initial} = 0.0500\\text{ mol},\\quad n(\\text{HCl})_{excess} = n(\\text{NaOH}) = 0.0280\\text{ mol}$',
        auditExplanation: 'Converts $\\text{cm}^3 \\rightarrow \\text{dm}^3$ ($\\div 1000$) and subtracts excess moles from initial moles: $n(\\text{HCl})_{reacted} = 0.0500 - 0.0280 = 0.0220\\text{ mol}$.',
        commonTrap: 'Equating $n(\\text{NaOH})$ directly to $n(\\text{CaCO}_3)$ without subtracting from initial $\\text{HCl}$.',
      },
      {
        id: 'bt-2',
        markCode: 'M2',
        category: 'Mole Ratio Logic',
        expectedExpression: '$\\text{CaCO}_3 + 2\\text{HCl} \\rightarrow \\text{CaCl}_2 + \\text{H}_2\\text{O} + \\text{CO}_2 \\implies n(\\text{CaCO}_3) = \\frac{0.0220}{2} = 0.0110\\text{ mol}$',
        auditExplanation: 'Applies the $1 : 2$ stoichiometric mole ratio between $\\text{CaCO}_3$ and $\\text{HCl}$.',
        commonTrap: 'Assuming a $1 : 1$ ratio and getting $0.0220\\text{ mol}$ $\\text{CaCO}_3$.',
      },
      {
        id: 'bt-3',
        markCode: 'A1',
        category: 'Significant Figures',
        expectedExpression: '$m(\\text{CaCO}_3) = 0.0110 \\times 100.09 = 1.101\\text{ g} \\implies \\%\\text{ Purity} = \\frac{1.101}{1.25} \\times 100 = 88.1\\%$',
        auditExplanation: 'Reports final percentage purity to 3 significant figures ($88.1\\%$).',
        commonTrap: 'Rounding intermediate moles too early.',
      },
    ],
  },
  {
    id: 'bond-enthalpy',
    title: 'Drill 4 · Bond Enthalpy Cycle (Ethene Hydrogenation)',
    topicTag: 'Reactivity 1.2 · Bond Enthalpies',
    totalMarks: 3,
    questionPrompt:
      'Using Section 12 average bond enthalpies ($\\text{C=C} = 614$, $\\text{C-C} = 346$, $\\text{C-H} = 414$, $\\text{H-H} = 436\\text{ kJ mol}^{-1}$), calculate $\\Delta H^\\ominus$ for $\\text{C}_2\\text{H}_4\\text{(g)} + \\text{H}_2\\text{(g)} \\rightarrow \\text{C}_2\\text{H}_6\\text{(g)}$.',
    givenDataSummary: 'Reactants broken: $1\\times\\text{C=C} + 4\\times\\text{C-H} + 1\\times\\text{H-H}$. Products formed: $1\\times\\text{C-C} + 6\\times\\text{C-H}$.',
    requiredSigFigs: 3,
    expectedFinalValue: '-124',
    expectedUnit: 'kJ mol⁻¹',
    acceptedUnitAliases: ['kjmol-1', 'kj/mol', 'kjmol^-1'],
    sampleWorking:
      'Bonds broken = 614 + 4(414) + 436 = 2706 kJ mol^-1\nBonds formed = 346 + 6(414) = 2830 kJ mol^-1\nDelta H = 2706 - 2830 = -124 kJ mol^-1',
    steps: [
      {
        id: 'be-1',
        markCode: 'M1',
        category: 'Mole Ratio Logic',
        expectedExpression: '$\\sum E(\\text{broken}) = 614 + 4(414) + 436 = 2706\\text{ kJ mol}^{-1};\\quad \\sum E(\\text{formed}) = 346 + 6(414) = 2830\\text{ kJ mol}^{-1}$',
        auditExplanation: 'Counts all 6 $\\text{C-H}$ bonds in ethane and the $\\text{C-C}$ single bond remaining after breaking $\\text{C=C}$.',
        commonTrap: 'Forgetting the $\\text{C-C}$ single bond in the product $\\text{C}_2\\text{H}_6$.',
      },
      {
        id: 'be-2',
        markCode: 'A1',
        category: 'Sign Convention',
        expectedExpression: '$\\Delta H^\\ominus = \\text{Broken} - \\text{Formed} = 2706 - 2830 = -124\\text{ kJ mol}^{-1}$',
        auditExplanation: 'Uses $\\text{Broken} - \\text{Formed}$ (not Products $-$ Reactants!).',
        commonTrap: 'Doing $\\text{Products} - \\text{Reactants}$ gives $+124\\text{ kJ mol}^{-1}$ (wrong sign).',
      },
    ],
  },
  {
    id: 'atom-economy',
    title: 'Drill 5 · Percentage Atom Economy (Steam Reforming)',
    topicTag: 'Structure 1.4 · Green Chemistry Metrics',
    totalMarks: 3,
    questionPrompt:
      'Hydrogen is manufactured via $\\text{CH}_4\\text{(g)} + \\text{H}_2\\text{O(g)} \\rightarrow \\text{CO(g)} + 3\\text{H}_2\\text{(g)}$. Given $M_r(\\text{CH}_4) = 16.05$, $M_r(\\text{H}_2\\text{O}) = 18.02$, $M_r(\\text{CO}) = 28.01$, $M_r(\\text{H}_2) = 2.02$, calculate the percentage atom economy for producing $\\text{H}_2$.',
    givenDataSummary: 'Desired product: $3\\text{ mol H}_2$ ($3 \\times 2.02 = 6.06\\text{ g mol}^{-1}$). Total mass $= 34.07\\text{ g mol}^{-1}$.',
    requiredSigFigs: 3,
    expectedFinalValue: '17.8',
    expectedUnit: '%',
    acceptedUnitAliases: ['%', 'percent'],
    sampleWorking:
      'Desired product (3 H2) = 3 * 2.02 = 6.06 g mol^-1\nTotal reactants = 16.05 + 18.02 = 34.07 g mol^-1\n% Atom Economy = (6.06 / 34.07) * 100 = 17.8%',
    steps: [
      {
        id: 'ae-1',
        markCode: 'M1',
        category: 'Mole Ratio Logic',
        expectedExpression: '$m(\\text{desired}) = 3 \\times 2.02 = 6.06\\text{ g mol}^{-1};\\quad m(\\text{total reactants}) = 16.05 + 18.02 = 34.07\\text{ g mol}^{-1}$',
        auditExplanation: 'Multiplies the molar mass of $\\text{H}_2$ by its stoichiometric coefficient $3$.',
        commonTrap: 'Using $2.02$ instead of $3 \\times 2.02 = 6.06$ in the numerator.',
      },
      {
        id: 'ae-2',
        markCode: 'A1',
        category: 'Significant Figures',
        expectedExpression: '$\\%\\text{ Atom Economy} = \\frac{6.06}{34.07} \\times 100 = 17.8\\%$',
        auditExplanation: 'Expresses atom economy to 3 significant figures.',
        commonTrap: 'Confusing percentage yield with atom economy.',
      },
    ],
  },
  {
    id: 'stp-molar-volume',
    title: 'Drill 6 · Limiting Reagent & Gas Volume at STP ($22.7\\text{ dm}^3\\text{ mol}^{-1}$)',
    topicTag: 'Structure 1.4 & 1.5 · IB STP Volume',
    totalMarks: 4,
    questionPrompt:
      'When $0.486\\text{ g}$ of magnesium ($A_r = 24.31$) reacts with $50.0\\text{ cm}^3$ of $1.50\\text{ mol dm}^{-3}\\;\\text{HCl(aq)}$ via $\\text{Mg(s)} + 2\\text{HCl(aq)} \\rightarrow \\text{MgCl}_2\\text{(aq)} + \\text{H}_2\\text{(g)}$, calculate the volume of $\\text{H}_2\\text{(g)}$ in $\\text{dm}^3$ at STP ($273.15\\text{ K}, 100\\text{ kPa}$).',
    givenDataSummary: '$m(\\text{Mg}) = 0.486\\text{ g}$ (3 s.f.), $V(\\text{HCl}) = 50.0\\text{ cm}^3$ (3 s.f.), $V_m = 22.7\\text{ dm}^3\\text{ mol}^{-1}$',
    requiredSigFigs: 3,
    expectedFinalValue: '0.454',
    expectedUnit: 'dm³',
    acceptedUnitAliases: ['dm3', 'dm^3', 'l', 'litres', 'liters'],
    sampleWorking:
      'n(Mg) = 0.486 / 24.31 = 0.019992 mol\nn(HCl) = 0.0500 * 1.50 = 0.0750 mol (Mg is limiting; requires 0.0400 mol HCl)\nV(H2) at STP = 0.019992 * 22.7 dm^3 mol^-1 = 0.454 dm^3',
    steps: [
      {
        id: 'stp-1',
        markCode: 'M1',
        category: 'Mole Ratio Logic',
        expectedExpression: '$n(\\text{Mg}) = \\frac{0.486}{24.31} = 0.01999\\text{ mol};\\quad n(\\text{HCl}) = 0.0500 \\times 1.50 = 0.0750\\text{ mol}$',
        auditExplanation: 'Computes moles of both reactants and identifies $\\text{Mg}$ as limiting ($0.0750 / 2 = 0.0375 > 0.01999$).',
        commonTrap: 'Using excess $n(\\text{HCl})/2 = 0.0375\\text{ mol}$ instead of checking which reactant is limiting.',
      },
      {
        id: 'stp-2',
        markCode: 'M2',
        category: 'Unit Conversion',
        expectedExpression: '$V(\\text{H}_2) = n(\\text{H}_2) \\times V_m = 0.01999\\text{ mol} \\times 22.7\\text{ dm}^3\\text{ mol}^{-1}$',
        auditExplanation: 'Multiplies limiting moles by IB 2025 STP molar volume $22.7\\text{ dm}^3\\text{ mol}^{-1}$ ($273.15\\text{ K}, 100\\text{ kPa}$).',
        commonTrap: 'Using legacy $22.4\\text{ dm}^3\\text{ mol}^{-1}$ gives $0.448\\text{ dm}^3$ and loses the `M2` + `A1` marks.',
      },
      {
        id: 'stp-3',
        markCode: 'A1',
        category: 'Significant Figures',
        expectedExpression: '$V(\\text{H}_2) = 0.454\\text{ dm}^3$ (3 s.f.)',
        auditExplanation: 'Retains unrounded intermediate moles ($0.019992 \\times 22.7 = 0.4538$) and rounds final answer to 3 s.f. ($0.454\\text{ dm}^3$).',
        commonTrap: 'Rounding $n(\\text{Mg})$ early or reporting in $\\text{cm}^3$ instead of $\\text{dm}^3$.',
      },
    ],
  },
];

function parseNumericAndSigFigs(raw: string): { value: number; sigFigs: number } {
  const trimmed = raw.trim();
  if (!trimmed) return { value: Number.NaN, sigFigs: 0 };

  // Support standard decimal / e-notation (1.05e-2) and explicit "1.05 x 10^-2"
  const sciMatch = trimmed.match(
    /^([+-]?\d+(?:\.\d+)?)\s*(?:×|x|\*)\s*10\^?\(?\s*([+-]?\d+)\s*\)?$/i
  );
  if (sciMatch) {
    const mantissa = sciMatch[1];
    const exponent = Number(sciMatch[2]);
    const numeric = Number(mantissa) * Math.pow(10, exponent);
    return {
      value: numeric,
      sigFigs: countSignificantFigures(mantissa),
    };
  }

  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) return { value: Number.NaN, sigFigs: 0 };
  return {
    value: numeric,
    sigFigs: countSignificantFigures(trimmed),
  };
}

function countSignificantFigures(val: string): number {
  const stripped = val.replace(/^[+-]/, '').replace(/e[+-]?\d+$/i, '');
  if (!stripped || Number.isNaN(Number(stripped))) return 0;
  if (stripped.includes('.')) {
    return stripped.replace('.', '').replace(/^0+/, '').length;
  }
  return stripped.replace(/^0+/, '').replace(/0+$/, '').length;
}

function normalizeUnit(unit: string): string {
  return unit
    .trim()
    .toLowerCase()
    .replace(/⁻¹/g, '-1')
    .replace(/³/g, '3')
    .replace(/\s+/g, '')
    .replace(/\^/g, '');
}

function detectWorkingTraps(workings: string, drillId: string): string[] {
  const warnings: string[] = [];
  const lower = workings.toLowerCase();
  if (/\b22\.4\b/.test(workings)) {
    warnings.push(
      'Detected 22.4 in your working: IB 2025 STP molar gas volume is 22.7 dm³ mol⁻¹ at 273.15 K and 100 kPa.'
    );
  }
  if (drillId === 'ideal-gas' && /\+\s*273(?!\.15)\b/.test(workings)) {
    warnings.push(
      'Use + 273.15 (not + 273) for exact Kelvin conversion per Data Booklet Section 4.'
    );
  }
  if (
    (drillId === 'calorimetry' || drillId === 'bond-enthalpy') &&
    workings.trim().length > 0 &&
    !workings.includes('-') &&
    !lower.includes('exothermic')
  ) {
    warnings.push(
      'No minus (−) sign or exothermic note detected in your working — check enthalpy sign convention.'
    );
  }
  return warnings;
}

export function ChemistryCalcCheckerTool() {
  const [selectedDrillId, setSelectedDrillId] = useState<string>(CHEMISTRY_DRILLS[0].id);
  const [studentWorkings, setStudentWorkings] = useState<string>(
    CHEMISTRY_DRILLS[0].sampleWorking
  );
  const [studentFinalAnswer, setStudentFinalAnswer] = useState<string>(
    CHEMISTRY_DRILLS[0].expectedFinalValue
  );
  const [studentUnit, setStudentUnit] = useState<string>(
    CHEMISTRY_DRILLS[0].expectedUnit
  );
  const [checkedStepIds, setCheckedStepIds] = useState<Record<string, boolean>>({
    'ig-1': true,
    'ig-2': true,
    'ig-3': true,
  });

  const activeDrill =
    CHEMISTRY_DRILLS.find((d) => d.id === selectedDrillId) ?? CHEMISTRY_DRILLS[0];

  const handleSelectDrill = (drill: CalcDrill) => {
    setSelectedDrillId(drill.id);
    setStudentFinalAnswer(drill.expectedFinalValue);
    setStudentUnit(drill.expectedUnit);
    const nextChecked: Record<string, boolean> = {};
    drill.steps.forEach((s) => {
      nextChecked[s.id] = true;
    });
    setCheckedStepIds(nextChecked);
    setStudentWorkings(drill.sampleWorking);
  };

  const handleClearAttempt = () => {
    setStudentWorkings('');
    setStudentFinalAnswer('');
    setStudentUnit('');
    setCheckedStepIds({});
  };

  const handleLoadModel = () => {
    handleSelectDrill(activeDrill);
  };

  // Audit student final value for sign, value, sig figs, and units
  const cleanStudentVal = studentFinalAnswer.trim();
  const { value: parsedStudentVal, sigFigs: detectedSigFigs } =
    parseNumericAndSigFigs(cleanStudentVal);
  const expectedVal = Number(activeDrill.expectedFinalValue);
  const isNumericInput = Number.isFinite(parsedStudentVal);
  const isNegativeExpected = expectedVal < 0;
  const isEnthalpyDrill = activeDrill.expectedUnit.includes('kJ');

  const isSignMatch =
    isNumericInput &&
    (isNegativeExpected
      ? parsedStudentVal < 0
      : parsedStudentVal >= 0 && !cleanStudentVal.startsWith('-'));

  const tolerance = Math.max(Math.abs(expectedVal) * 0.02, 1e-4);
  const numericDiff = isNumericInput ? Math.abs(parsedStudentVal - expectedVal) : Number.POSITIVE_INFINITY;
  const isValueMatch = isNumericInput && numericDiff <= tolerance;

  const isSigFigMatch = isNumericInput && detectedSigFigs === activeDrill.requiredSigFigs;

  const normalizedUnitInput = normalizeUnit(studentUnit);
  const isUnitMatch =
    normalizedUnitInput.length > 0 &&
    activeDrill.acceptedUnitAliases.some((alias) => normalizeUnit(alias) === normalizedUnitInput);

  const workingWarnings = detectWorkingTraps(studentWorkings, activeDrill.id);

  const signFeedback = !isNumericInput
    ? 'Enter a valid numerical answer to verify sign.'
    : isSignMatch
      ? 'Sign convention verified'
      : isNegativeExpected
        ? 'Sign error! Exothermic ΔH requires an explicit minus (−) sign.'
        : isEnthalpyDrill
          ? 'Sign error! Endothermic ΔH must be positive (+).'
          : 'Sign error! Expected a positive value without a minus sign.';

  const awardedStepCount = activeDrill.steps.filter((s) => checkedStepIds[s.id]).length;

  return (
    <div className="space-y-6">
      {/* Drill Selector */}
      <div className="hairline-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="mini-tag bg-[#CCFBF1] text-[#0F766E] font-mono">
            IB CHEMISTRY SL · PAPER 2 MARKSCHEME AUDITOR
          </span>
        </div>
        <h2
          className="text-[20px] font-semibold tracking-tight text-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <KaTeXText
            text={'Calculation Step Checker (Units, Mole Ratios, $\\Delta H$ Signs & Sig Figs)'}
            as="span"
          />
        </h2>
        <p className="text-[13px] text-[#71717A] mt-0.5">
          Select one of the {CHEMISTRY_DRILLS.length} core IB Chemistry SL calculation drills or test your own working and final value against IB{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#F4F4F5] font-mono text-[12px] text-[#18181B]">M1</code> /{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#F4F4F5] font-mono text-[12px] text-[#18181B]">A1</code>{' '}
          markscheme rules.
        </p>

        <div
          role="tablist"
          aria-label="Chemistry calculation drills"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4E4E7]"
        >
          {CHEMISTRY_DRILLS.map((drill) => {
            const active = drill.id === activeDrill.id;
            return (
              <button
                key={drill.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectDrill(drill)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  active
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#18181B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                <KaTeXText text={drill.title} as="span" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Question Prompt & Student Working Input */}
        <div className="lg:col-span-6 hairline-card space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="mini-tag font-mono">{activeDrill.topicTag}</span>
            <span className="text-[12px] font-mono font-semibold text-[#0F766E]">
              [{activeDrill.totalMarks} marks]
            </span>
          </div>

          <div className="p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] text-[13.5px] text-[#18181B] leading-relaxed">
            <KaTeXText text={activeDrill.questionPrompt} as="div" />
            <div className="mt-2.5 pt-2.5 border-t border-[#E4E4E7] text-[12px] text-[#71717A] font-mono">
              <KaTeXText text={`Input Precision: ${activeDrill.givenDataSummary}`} as="span" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="calc-workings"
                className="block text-[12.5px] font-semibold text-[#18181B]"
              >
                Your Step-by-Step Working Out
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClearAttempt}
                  className="cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[#E4E4E7] bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  Clear Attempt
                </button>
                <button
                  type="button"
                  onClick={handleLoadModel}
                  className="cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[#0D9488]/30 bg-[#F0FDFA] text-[#0F766E] hover:bg-[#CCFBF1] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  Load Model
                </button>
              </div>
            </div>
            <textarea
              id="calc-workings"
              rows={5}
              value={studentWorkings}
              onChange={(e) => setStudentWorkings(e.target.value)}
              placeholder="Write your step-by-step unit conversions, mole ratios, and intermediate values..."
              className="w-full p-3 rounded-[10px] border border-[#E4E4E7] font-mono text-[12.5px] text-[#18181B] bg-white transition-colors duration-150 focus:outline-none focus:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            />
            {workingWarnings.length > 0 && (
              <div
                role="alert"
                className="mt-2 p-2.5 rounded-[9px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#991B1B] space-y-1"
              >
                {workingWarnings.map((warn) => (
                  <div key={warn}>{warn}</div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="final-numeric"
                className="block text-[12px] font-semibold text-[#18181B] mb-1"
              >
                Your Final Numerical Answer
              </label>
              <input
                id="final-numeric"
                type="text"
                value={studentFinalAnswer}
                onChange={(e) => setStudentFinalAnswer(e.target.value)}
                placeholder="e.g. -215 or 0.0105"
                className="w-full px-3 py-2 rounded-[10px] border border-[#E4E4E7] font-mono text-[13px] text-[#18181B] transition-colors duration-150 focus:outline-none focus:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              />
            </div>
            <div>
              <label
                htmlFor="final-unit"
                className="block text-[12px] font-semibold text-[#18181B] mb-1"
              >
                Units
              </label>
              <input
                id="final-unit"
                type="text"
                value={studentUnit}
                onChange={(e) => setStudentUnit(e.target.value)}
                placeholder={`e.g. ${activeDrill.expectedUnit}`}
                className="w-full px-3 py-2 rounded-[10px] border border-[#E4E4E7] font-mono text-[13px] text-[#18181B] transition-colors duration-150 focus:outline-none focus:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              />
            </div>
          </div>

          {/* Live 4-Pillar Diagnostic Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div
              className={`p-3 rounded-[10px] border text-[12px] ${
                isValueMatch
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">1. Numerical Magnitude</div>
              <div className="mt-0.5">
                {isValueMatch
                  ? `Matches expected (${activeDrill.expectedFinalValue})`
                  : `Check unit conversion / mole ratio (expected ${activeDrill.expectedFinalValue})`}
              </div>
            </div>

            <div
              className={`p-3 rounded-[10px] border text-[12px] ${
                isSignMatch
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#DC2626]/40 bg-[#FEF2F2] text-[#991B1B]'
              }`}
            >
              <div className="font-mono font-bold">2. Sign Convention</div>
              <div className="mt-0.5">{signFeedback}</div>
            </div>

            <div
              className={`p-3 rounded-[10px] border text-[12px] ${
                isSigFigMatch
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">
                3. Significant Figures ({detectedSigFigs} s.f.)
              </div>
              <div className="mt-0.5">
                {isSigFigMatch
                  ? `Exact match (${activeDrill.requiredSigFigs} s.f. required)`
                  : `IB Paper 2 requires ${activeDrill.requiredSigFigs} s.f. to match input data`}
              </div>
            </div>

            <div
              className={`p-3 rounded-[10px] border text-[12px] ${
                isUnitMatch
                  ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                  : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              <div className="font-mono font-bold">4. Units Verification</div>
              <div className="mt-0.5">
                {isUnitMatch
                  ? `Unit verified (${activeDrill.expectedUnit})`
                  : `Expected unit: ${activeDrill.expectedUnit}`}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step M1 / A1 Markscheme Breakdown */}
        <div className="lg:col-span-6 hairline-card space-y-3.5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
            <div>
              <h3
                className="text-[15px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Official IB{' '}
                <code className="px-1.5 py-0.5 rounded bg-[#F4F4F5] font-mono text-[12px] text-[#18181B]">M1</code> /{' '}
                <code className="px-1.5 py-0.5 rounded bg-[#F4F4F5] font-mono text-[12px] text-[#18181B]">A1</code>{' '}
                Step-by-Step Audit
              </h3>
              <span className="text-[11.5px] font-mono text-[#71717A]">
                Toggle steps present in your working
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F0FDFA] border border-[#0D9488]/30 font-mono text-[11.5px] font-semibold text-[#0F766E]">
              {awardedStepCount} / {activeDrill.steps.length} Steps Verified
            </span>
          </div>

          <div className="space-y-3">
            {activeDrill.steps.map((step) => {
              const checked = !!checkedStepIds[step.id];
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-[12px] border transition-colors duration-150 ${
                    checked
                      ? 'border-[#059669]/40 bg-[#ECFDF5]/40'
                      : 'border-[#E4E4E7] bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#18181B] text-white font-mono text-[11px] font-bold">
                        {step.markCode}
                      </span>
                      <span className="text-[12.5px] font-semibold text-[#0F766E]">
                        {step.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-pressed={checked}
                      onClick={() =>
                        setCheckedStepIds((prev) => ({
                          ...prev,
                          [step.id]: !prev[step.id],
                        }))
                      }
                      className={`cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                        checked
                          ? 'bg-[#059669] text-white border-[#059669]'
                          : 'bg-white text-[#71717A] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      {checked ? '✓ Awarded' : 'Mark Missing'}
                    </button>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-[8px] bg-white border border-[#E4E4E7] text-[13px] text-[#18181B] overflow-x-auto">
                    <KaTeXText text={step.expectedExpression} as="div" />
                  </div>

                  <div className="mt-2 text-[12.5px] text-[#27272A]">
                    <KaTeXText text={`**Criterion:** ${step.auditExplanation}`} as="div" />
                  </div>
                  <div className="mt-1 text-[12px] text-[#B45309]">
                    <KaTeXText text={`**Examiner Trap:** ${step.commonTrap}`} as="div" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
