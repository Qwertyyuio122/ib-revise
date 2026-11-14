'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { KaTeXText } from '@/components/math/KaTeXText';

type BookletTab =
  | 'constants'
  | 'periodic-table'
  | 'energetics';

function resolveBookletTab(tab?: string): BookletTab {
  const normalized = tab?.trim().toLowerCase();
  if (normalized === 'periodic' || normalized === 'periodic-table') return 'periodic-table';
  if (normalized === 'energetics' || normalized === 'bonds' || normalized === 'enthalpies') {
    return 'energetics';
  }
  return 'constants';
}

interface ConstantEquationItem {
  id: string;
  section: string;
  title: string;
  formula: string;
  unitsAndNotes: string;
}

type ElementCategory =
  | 'nonmetal'
  | 'alkali'
  | 'alkaline'
  | 'metalloid'
  | 'halogen'
  | 'noble'
  | 'transition'
  | 'post-transition'
  | 'lanthanide'
  | 'actinide';

interface ElementItem {
  symbol: string;
  name: string;
  atomicNumber: number;
  relativeMass: string;
  group: string;
  period: number;
  category: ElementCategory;
  electronConfig: string;
  electronegativity: string;
  firstIE: string;
  atomicRadiusPm: number | null;
  gridCol: number;
  gridRow: number;
  slTrendNote: string;
}

interface BondEnthalpyItem {
  bond: string;
  formulaLatex: string;
  enthalpyKjMol: number;
  bondLengthPm: number;
  contextNote: string;
}

const CONSTANTS_AND_EQUATIONS: ConstantEquationItem[] = [
  {
    id: 'avogadro',
    section: 'Section 2 · Physical Constants',
    title: 'Avogadro Constant ($N_A$ or $L$)',
    formula: '$N_A = 6.02 \\times 10^{23}\\text{ mol}^{-1}$',
    unitsAndNotes: 'Converts between amount of substance ($n$ in $\\text{mol}$) and number of elementary entities ($N = nN_A$).',
  },
  {
    id: 'gas-constant',
    section: 'Section 2 · Physical Constants',
    title: 'Gas Constant ($R$)',
    formula: '$R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$',
    unitsAndNotes: 'When using $PV = nRT$ with $R = 8.31$, pressure $P$ MUST be in $\\text{Pa}$ ($\\text{N m}^{-2}$) and volume $V$ in $\\text{m}^3$ (or $P$ in $\\text{kPa}$ and $V$ in $\\text{dm}^3$).',
  },
  {
    id: 'molar-volume',
    section: 'Section 2 · Physical Constants',
    title: 'Molar Volume of an Ideal Gas at STP',
    formula: '$V_m = 2.27 \\times 10^{-2}\\text{ m}^3\\text{ mol}^{-1} = 22.7\\text{ dm}^3\\text{ mol}^{-1}$',
    unitsAndNotes: 'IB STP is defined at $T = 273.15\\text{ K}$ ($0^\\circ\\text{C}$) and $P = 100\\text{ kPa}$ (never use legacy $22.4\\text{ dm}^3\\text{ mol}^{-1}$).',
  },
  {
    id: 'specific-heat-water',
    section: 'Section 2 · Physical Constants',
    title: 'Specific Heat Capacity of Water ($c$)',
    formula: '$c = 4.18\\text{ kJ kg}^{-1}\\text{ K}^{-1} = 4.18\\text{ J g}^{-1}\\text{ K}^{-1}$',
    unitsAndNotes: 'Assume aqueous solution density $= 1.00\\text{ g cm}^{-3}$, so $100\\text{ cm}^3$ solution has mass $m = 100\\text{ g}$.',
  },
  {
    id: 'ionic-product-water',
    section: 'Section 2 · Physical Constants',
    title: 'Ionic Product Constant of Water ($K_w$)',
    formula: '$K_w = [\\text{H}^+][\\text{OH}^-] = 1.00 \\times 10^{-14}\\text{ mol}^2\\text{ dm}^{-6}\\text{ at }298.15\\text{ K}$',
    unitsAndNotes: 'In pure water at $298.15\\text{ K}$, $[\\text{H}^+] = [\\text{OH}^-] = 1.00 \\times 10^{-7}\\text{ mol dm}^{-3}$ ($\\text{pH} = 7.00$). Dissociation of water is endothermic.',
  },
  {
    id: 'moles-concentration',
    section: 'Section 1 · Relevant Equations',
    title: 'Amount of Substance & Solution Concentration',
    formula: '$n = \\frac{m}{M} \\quad \\text{and} \\quad n = cV \\quad \\text{and} \\quad n_{\\text{STP}} = \\frac{V}{22.7\\text{ dm}^3\\text{ mol}^{-1}}$',
    unitsAndNotes: 'Sum molar mass $M$ using $A_r$ to 2 decimal places from Section 7; convert titration volumes from $\\text{cm}^3$ to $\\text{dm}^3$ ($\\div 1000$).',
  },
  {
    id: 'ideal-gas-eq',
    section: 'Section 1 · Relevant Equations',
    title: 'Ideal Gas Equation',
    formula: '$PV = nRT \\quad \\text{and} \\quad \\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$',
    unitsAndNotes: 'Temperature $T$ must always be in Kelvin: $T(\\text{K}) = T(^\\circ\\text{C}) + 273.15$.',
  },
  {
    id: 'calorimetry-eq',
    section: 'Section 1 · Relevant Equations',
    title: 'Heat Change & Molar Enthalpy',
    formula: '$Q = mc\\Delta T \\quad \\text{and} \\quad \\Delta H = -\\frac{Q}{n_{\\text{limiting}}}$',
    unitsAndNotes: 'Convert $Q$ from $\\text{J}$ to $\\text{kJ}$ ($\\div 1000$) and assign negative sign ($-\\Delta H$) when temperature increases ($\\Delta T > 0$).',
  },
  {
    id: 'ph-equation',
    section: 'Section 1 · Relevant Equations',
    title: 'pH Scale (Reactivity 3.1)',
    formula: '$\\text{pH} = -\\log_{10}[\\text{H}_3\\text{O}^+] = -\\log_{10}[\\text{H}^+]$',
    unitsAndNotes: 'Each unit change in pH corresponds to a $10$-fold change in $[\\text{H}^+]$. Reverse with $[\\text{H}^+] = 10^{-\\text{pH}}$.',
  },
  {
    id: 'atom-economy-eq',
    section: 'Section 1 · Relevant Equations',
    title: 'Percentage Atom Economy',
    formula: '$\\%\\text{ Atom Economy} = \\frac{\\text{Molar mass of desired product}}{\\text{Total molar mass of all reactants}} \\times 100$',
    unitsAndNotes: 'Must multiply each formula mass by its stoichiometric coefficient in the balanced chemical equation.',
  },
  {
    id: 'photon-energy',
    section: 'Section 1 · Relevant Equations',
    title: 'Photon Energy & Wavelength (Structure 1.3)',
    formula: '$E = hf \\quad \\text{and} \\quad c = f\\lambda \\quad (h = 6.63 \\times 10^{-34}\\text{ J s},\\; c = 3.00 \\times 10^8\\text{ m s}^{-1})$',
    unitsAndNotes: 'Qualitative SL trend (frequency $f$ or $\\nu$): shorter wavelength ($\\lambda$) corresponds to higher frequency and higher photon energy ($E$).',
  },
  {
    id: 'unit-conversions-sec4',
    section: 'Section 4 · Unit Conversions',
    title: 'Temperature, Volume & Standard Conditions',
    formula: '$T(\\text{K}) = T(^\\circ\\text{C}) + 273.15 \\qquad 1\\text{ dm}^3 = 1\\text{ L} = 10^{-3}\\text{ m}^3 = 10^3\\text{ cm}^3$',
    unitsAndNotes: 'STP is $273.15\\text{ K}$ ($0^\\circ\\text{C}$) and $100\\text{ kPa}$; SATP is $298.15\\text{ K}$ ($25^\\circ\\text{C}$) and $100\\text{ kPa}$.',
  },
  {
    id: 'uncertainties-sec23',
    section: 'Section 23 · Uncertainties',
    title: 'Uncertainty Propagation Rules (Paper 1B & IA)',
    formula: '$\\Delta y = \\Delta a + \\Delta b \\quad \\text{and} \\quad \\frac{\\Delta y}{y} = \\frac{\\Delta a}{a} + \\frac{\\Delta b}{b}$',
    unitsAndNotes: 'Add absolute uncertainties for $+$/$-$; add fractional/percentage uncertainties for $\\times$/$\\div$. Match final value decimal places to its absolute uncertainty.',
  },
];

type RawElementTuple = readonly [
  atomicNumber: number,
  symbol: string,
  name: string,
  relativeMass: string,
  group: string,
  period: number,
  category: ElementCategory,
  electronConfig: string,
  electronegativity: string,
  firstIE: string,
  atomicRadiusPm: number | null,
  gridCol: number,
  gridRow: number,
  slTrendNote?: string,
];

const DEFAULT_TREND_NOTES: Record<ElementCategory, string> = {
  nonmetal: 'Non-metal: gains or shares valence electrons to complete an octet; typically forms acidic oxides with oxygen.',
  alkali: 'Group 1 alkali metal ($ns^1$): soft reactive metal forming $+1$ cations and basic hydroxides with water ($2\\text{M} + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{MOH} + \\text{H}_2$); reactivity increases down Group 1.',
  alkaline: 'Group 2 alkaline earth metal ($ns^2$): loses 2 valence electrons to form $+2$ ions and basic oxides.',
  metalloid: 'Metalloid along the metal/non-metal diagonal boundary; exhibits intermediate electronegativity and semiconducting behaviour.',
  halogen: 'Group 17 halogen ($ns^2 np^5$): gains 1 electron to form $-1$ halides; reactivity/oxidizing power decreases down Group 17 while boiling point increases via stronger London dispersion forces.',
  noble: 'Group 18 noble gas (full valence octet, or $1s^2$ for He): monatomic gas with highest first ionization energy in its period and negligible chemical reactivity.',
  transition: '$d$-block element: metal forming positive ions with variable charges (e.g. $\\text{Fe}^{2+}/\\text{Fe}^{3+}$, $\\text{Cu}^+/\\text{Cu}^{2+}$).',
  'post-transition': '$p$-block metal with relatively high electronegativity among metals; several form amphoteric oxides.',
  lanthanide: 'Period 6 $4f$-block lanthanoid (rare-earth metal): valence $6s^2$ electrons lead to predominantly $+3$ oxidation state with gradual lanthanoid contraction.',
  actinide: 'Period 7 $5f$-block actinoid: radioactive heavy element; early actinoids (Th–Pu) show multiple oxidation states.',
};

const RAW_ELEMENTS_118: RawElementTuple[] = [
  [1, 'H', 'Hydrogen', '1.01', '1', 1, 'nonmetal', '$1s^1$', '2.2', '1312 kJ mol⁻¹', 32, 1, 1, 'Forms covalent hydrides with non-metals and ionic hydrides ($\\text{H}^-$) with Group 1/2 metals; $\\text{O-H}$, $\\text{N-H}$, and $\\text{H-F}$ exhibit hydrogen bonding.'],
  [2, 'He', 'Helium', '4.00', '18', 1, 'noble', '$1s^2$', '—', '2372 kJ mol⁻¹', 37, 18, 1, 'Highest first ionization energy of all elements due to full $1s^2$ shell close to nucleus with zero inner-shell shielding.'],
  [3, 'Li', 'Lithium', '6.94', '1', 2, 'alkali', '$[\\text{He}]\\,2s^1$', '1.0', '520 kJ mol⁻¹', 130, 1, 2, 'Group 1 alkali metal. Reacts with water: $2\\text{Li(s)} + 2\\text{H}_2\\text{O(l)} \\rightarrow 2\\text{LiOH(aq)} + \\text{H}_2\\text{(g)}$. Reactivity increases down Group 1.'],
  [4, 'Be', 'Beryllium', '9.01', '2', 2, 'alkaline', '$[\\text{He}]\\,2s^2$', '1.6', '900 kJ mol⁻¹', 99, 2, 2, 'Incomplete octet exception: $\\text{BeCl}_2$ is stable with only 4 valence electrons around Be (linear, $180^\\circ$).'],
  [5, 'B', 'Boron', '10.81', '13', 2, 'metalloid', '$[\\text{He}]\\,2s^2 2p^1$', '2.0', '801 kJ mol⁻¹', 84, 13, 2, 'Metalloid forming covalent network/molecular compounds; incomplete octet in $\\text{BF}_3$ (trigonal planar, $120^\\circ$).'],
  [6, 'C', 'Carbon', '12.01', '14', 2, 'nonmetal', '$[\\text{He}]\\,2s^2 2p^2$', '2.6', '1086 kJ mol⁻¹', 75, 14, 2, 'Forms covalent network allotropes: diamond (4 covalent bonds per C, tetrahedral $109.5^\\circ$, non-conductor), graphite (3 covalent bonds per C, $120^\\circ$, delocalized electrons conduct electricity), graphene, and $\\text{C}_{60}$ fullerene (molecular covalent).'],
  [7, 'N', 'Nitrogen', '14.01', '15', 2, 'nonmetal', '$[\\text{He}]\\,2s^2 2p^3$', '3.0', '1402 kJ mol⁻¹', 71, 15, 2, 'Forms a strong $\\text{N}\\equiv\\text{N}$ triple covalent bond ($945\\text{ kJ mol}^{-1}$), making $\\text{N}_2$ unreactive at room temperature; $\\text{NH}_3$ forms hydrogen bonds.'],
  [8, 'O', 'Oxygen', '16.00', '16', 2, 'nonmetal', '$[\\text{He}]\\,2s^2 2p^4$', '3.4', '1314 kJ mol⁻¹', 64, 16, 2, 'High electronegativity ($3.4$) creates polar $\\text{O}-\\text{H}$ bonds enabling strong hydrogen bonding in water ($\\text{H}_2\\text{O}$), alcohols, and carboxylic acids.'],
  [9, 'F', 'Fluorine', '19.00', '17', 2, 'halogen', '$[\\text{He}]\\,2s^2 2p^5$', '4.0', '1681 kJ mol⁻¹', 60, 17, 2, 'Most electronegative element on the Pauling scale ($4.0$). Strongest oxidizing agent among Group 17 halogens.'],
  [10, 'Ne', 'Neon', '20.18', '18', 2, 'noble', '$[\\text{He}]\\,2s^2 2p^6$', '—', '2081 kJ mol⁻¹', 62, 18, 2, 'Stable full $n=2$ octet ($2s^2 2p^6$); monatomic gas with very weak London dispersion forces ($\\text{BP} = -246.0^\\circ\\text{C}$).'],
  [11, 'Na', 'Sodium', '22.99', '1', 3, 'alkali', '$[\\text{Ne}]\\,3s^1$', '0.9', '496 kJ mol⁻¹', 160, 1, 3, 'Forms strongly basic ionic oxide $\\text{Na}_2\\text{O}$: $\\text{Na}_2\\text{O(s)} + \\text{H}_2\\text{O(l)} \\rightarrow 2\\text{NaOH(aq)}$.'],
  [12, 'Mg', 'Magnesium', '24.31', '2', 3, 'alkaline', '$[\\text{Ne}]\\,3s^2$', '1.3', '738 kJ mol⁻¹', 140, 2, 3, 'Forms basic oxide $\\text{MgO}$: $\\text{MgO(s)} + \\text{H}_2\\text{O(l)} \\rightarrow \\text{Mg(OH)}_2\\text{(aq)}$. Higher melting point than Na due to $\\text{Mg}^{2+}$ and 2 delocalized $e^-$ per atom.'],
  [13, 'Al', 'Aluminium', '26.98', '13', 3, 'post-transition', '$[\\text{Ne}]\\,3s^2 3p^1$', '1.6', '578 kJ mol⁻¹', 124, 13, 3, '$\\text{Al}_2\\text{O}_3$ is amphoteric — reacts with both acids ($\\text{HCl}$) and strong bases ($\\text{NaOH}$).'],
  [14, 'Si', 'Silicon', '28.09', '14', 3, 'metalloid', '$[\\text{Ne}]\\,3s^2 3p^2$', '1.9', '787 kJ mol⁻¹', 114, 14, 3, 'Forms giant covalent network oxide $\\text{SiO}_2$ (quartz) with tetrahedral $\\text{Si-O-Si}$ bridges; insoluble in water, reacts with hot concentrated alkali.'],
  [15, 'P', 'Phosphorus', '30.97', '15', 3, 'nonmetal', '$[\\text{Ne}]\\,3s^2 3p^3$', '2.2', '1012 kJ mol⁻¹', 109, 15, 3, 'Acidic oxide $\\text{P}_4\\text{O}_{10}$ reacts vigorously with water: $\\text{P}_4\\text{O}_{10}\\text{(s)} + 6\\text{H}_2\\text{O(l)} \\rightarrow 4\\text{H}_3\\text{PO}_4\\text{(aq)}$.'],
  [16, 'S', 'Sulfur', '32.07', '16', 3, 'nonmetal', '$[\\text{Ne}]\\,3s^2 3p^4$', '2.6', '1000 kJ mol⁻¹', 104, 16, 3, 'Acidic oxides cause acid rain: $\\text{SO}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{H}_2\\text{SO}_3\\text{(aq)}$ and $\\text{SO}_3 + \\text{H}_2\\text{O} \\rightarrow \\text{H}_2\\text{SO}_4\\text{(aq)}$.'],
  [17, 'Cl', 'Chlorine', '35.45', '17', 3, 'halogen', '$[\\text{Ne}]\\,3s^2 3p^5$', '3.2', '1251 kJ mol⁻¹', 100, 17, 3, 'Displaces $\\text{Br}^-$ and $\\text{I}^-$ from aqueous halide solutions: $\\text{Cl}_2\\text{(aq)} + 2\\text{Br}^-\\text{(aq)} \\rightarrow 2\\text{Cl}^-\\text{(aq)} + \\text{Br}_2\\text{(aq)}$.'],
  [18, 'Ar', 'Argon', '39.95', '18', 3, 'noble', '$[\\text{Ne}]\\,3s^2 3p^6$', '—', '1520 kJ mol⁻¹', 101, 18, 3, 'Period 3 noble gas ($3s^2 3p^6$). Highest first ionization energy in Period 3 due to maximum effective nuclear charge across the period.'],
  [19, 'K', 'Potassium', '39.10', '1', 4, 'alkali', '$[\\text{Ar}]\\,4s^1$', '0.8', '419 kJ mol⁻¹', 200, 1, 4, 'More reactive than Na because the $4s^1$ valence electron is further from the nucleus and more shielded, lowering ionization energy.'],
  [20, 'Ca', 'Calcium', '40.08', '2', 4, 'alkaline', '$[\\text{Ar}]\\,4s^2$', '1.0', '590 kJ mol⁻¹', 174, 2, 4, '$\\text{CaCO}_3$ thermal decomposition and reaction with acids ($\\text{CaCO}_3 + 2\\text{HCl} \\rightarrow \\text{CaCl}_2 + \\text{H}_2\\text{O} + \\text{CO}_2$) are classic SL stoichiometry contexts.'],
  [21, 'Sc', 'Scandium', '44.96', '3', 4, 'transition', '$[\\text{Ar}]\\,3d^1 4s^2$', '1.4', '633 kJ mol⁻¹', 159, 3, 4, 'First $d$-block element ($[\\text{Ar}]\\,3d^1 4s^2$); forms colourless $\\text{Sc}^{3+}$ ($[\\text{Ar}]$) with an empty $3d$ subshell.'],
  [22, 'Ti', 'Titanium', '47.87', '4', 4, 'transition', '$[\\text{Ar}]\\,3d^2 4s^2$', '1.5', '659 kJ mol⁻¹', 148, 4, 4],
  [23, 'V', 'Vanadium', '50.94', '5', 4, 'transition', '$[\\text{Ar}]\\,3d^3 4s^2$', '1.6', '651 kJ mol⁻¹', 144, 5, 4, 'Exhibits oxidation states $+2, +3, +4, +5$; $\\text{V}_2\\text{O}_5$ is the industrial catalyst in the Contact Process.'],
  [24, 'Cr', 'Chromium', '52.00', '6', 4, 'transition', '$[\\text{Ar}]\\,3d^5 4s^1$', '1.7', '653 kJ mol⁻¹', 130, 6, 4, 'Mandatory IB electron configuration exception (along with Cu $[\\text{Ar}]\\,3d^{10} 4s^1$): half-filled $3d^5$ subshell gives extra stability.'],
  [25, 'Mn', 'Manganese', '54.94', '7', 4, 'transition', '$[\\text{Ar}]\\,3d^5 4s^2$', '1.6', '717 kJ mol⁻¹', 129, 7, 4, 'Strong oxidizing agent $\\text{MnO}_4^-$ ($+7$) reduces to $\\text{Mn}^{2+}$ ($+2$) in acidic redox titrations.'],
  [26, 'Fe', 'Iron', '55.85', '8', 4, 'transition', '$[\\text{Ar}]\\,3d^6 4s^2$', '1.8', '762 kJ mol⁻¹', 124, 8, 4, 'When forming $\\text{Fe}^{2+}$ ($[\\text{Ar}]\\,3d^6$) and $\\text{Fe}^{3+}$ ($[\\text{Ar}]\\,3d^5$), the $4s$ electrons are lost BEFORE $3d$ electrons.'],
  [27, 'Co', 'Cobalt', '58.93', '9', 4, 'transition', '$[\\text{Ar}]\\,3d^7 4s^2$', '1.9', '760 kJ mol⁻¹', 118, 9, 4],
  [28, 'Ni', 'Nickel', '58.69', '10', 4, 'transition', '$[\\text{Ar}]\\,3d^8 4s^2$', '1.9', '737 kJ mol⁻¹', 117, 10, 4, 'Heterogeneous catalyst for alkene hydrogenation ($\\text{C}_2\\text{H}_4 + \\text{H}_2 \\xrightarrow{\\text{Ni},\\,150^\\circ\\text{C}} \\text{C}_2\\text{H}_6$).'],
  [29, 'Cu', 'Copper', '63.55', '11', 4, 'transition', '$[\\text{Ar}]\\,3d^{10} 4s^1$', '1.9', '745 kJ mol⁻¹', 122, 11, 4, 'Mandatory IB electron configuration exception (along with Cr $[\\text{Ar}]\\,3d^5 4s^1$): full $3d^{10}$ subshell provides extra exchange stability.'],
  [30, 'Zn', 'Zinc', '65.38', '12', 4, 'transition', '$[\\text{Ar}]\\,3d^{10} 4s^2$', '1.6', '906 kJ mol⁻¹', 120, 12, 4, 'Forms only $\\text{Zn}^{2+}$ ($[\\text{Ar}]\\,3d^{10}$) with a complete $d$-subshell; often used as a reducing agent in displacement calorimetry ($\\text{Zn} + \\text{Cu}^{2+}$).'],
  [31, 'Ga', 'Gallium', '69.72', '13', 4, 'post-transition', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^1$', '1.8', '579 kJ mol⁻¹', 123, 13, 4],
  [32, 'Ge', 'Germanium', '72.63', '14', 4, 'metalloid', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^2$', '2.0', '762 kJ mol⁻¹', 120, 14, 4],
  [33, 'As', 'Arsenic', '74.92', '15', 4, 'metalloid', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^3$', '2.2', '944 kJ mol⁻¹', 120, 15, 4],
  [34, 'Se', 'Selenium', '78.96', '16', 4, 'nonmetal', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^4$', '2.6', '941 kJ mol⁻¹', 118, 16, 4],
  [35, 'Br', 'Bromine', '79.90', '17', 4, 'halogen', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^5$', '3.0', '1140 kJ mol⁻¹', 117, 17, 4, 'Red-brown liquid at RTP. Bromine water ($\\text{Br}_2\\text{(aq)}$) decolorizes from orange-brown to colorless upon electrophilic addition to alkenes ($\\text{C=C}$).'],
  [36, 'Kr', 'Krypton', '83.80', '18', 4, 'noble', '$[\\text{Ar}]\\,3d^{10} 4s^2 4p^6$', '—', '1351 kJ mol⁻¹', 116, 18, 4],
  [37, 'Rb', 'Rubidium', '85.47', '1', 5, 'alkali', '$[\\text{Kr}]\\,5s^1$', '0.8', '403 kJ mol⁻¹', 215, 1, 5],
  [38, 'Sr', 'Strontium', '87.62', '2', 5, 'alkaline', '$[\\text{Kr}]\\,5s^2$', '1.0', '549 kJ mol⁻¹', 190, 2, 5],
  [39, 'Y', 'Yttrium', '88.91', '3', 5, 'transition', '$[\\text{Kr}]\\,4d^1 5s^2$', '1.2', '600 kJ mol⁻¹', 176, 3, 5],
  [40, 'Zr', 'Zirconium', '91.22', '4', 5, 'transition', '$[\\text{Kr}]\\,4d^2 5s^2$', '1.3', '640 kJ mol⁻¹', 164, 4, 5],
  [41, 'Nb', 'Niobium', '92.91', '5', 5, 'transition', '$[\\text{Kr}]\\,4d^4 5s^1$', '1.6', '652 kJ mol⁻¹', 156, 5, 5],
  [42, 'Mo', 'Molybdenum', '95.95', '6', 5, 'transition', '$[\\text{Kr}]\\,4d^5 5s^1$', '2.2', '684 kJ mol⁻¹', 146, 6, 5],
  [43, 'Tc', 'Technetium', '—', '7', 5, 'transition', '$[\\text{Kr}]\\,4d^5 5s^2$', '1.9', '702 kJ mol⁻¹', 138, 7, 5, 'Radioactive transition element with no stable isotopes (no standard $A_r$ listed in IB Section 7).'],
  [44, 'Ru', 'Ruthenium', '101.07', '8', 5, 'transition', '$[\\text{Kr}]\\,4d^7 5s^1$', '2.2', '710 kJ mol⁻¹', 136, 8, 5],
  [45, 'Rh', 'Rhodium', '102.91', '9', 5, 'transition', '$[\\text{Kr}]\\,4d^8 5s^1$', '2.3', '720 kJ mol⁻¹', 134, 9, 5],
  [46, 'Pd', 'Palladium', '106.42', '10', 5, 'transition', '$[\\text{Kr}]\\,4d^{10}$', '2.2', '804 kJ mol⁻¹', 130, 10, 5],
  [47, 'Ag', 'Silver', '107.87', '11', 5, 'transition', '$[\\text{Kr}]\\,4d^{10} 5s^1$', '1.9', '731 kJ mol⁻¹', 136, 11, 5, '$\\text{Ag}^+\\text{(aq)}$ forms characteristic precipitates with halide ions: $\\text{AgCl}$ (white), $\\text{AgBr}$ (cream), $\\text{AgI}$ (yellow).'],
  [48, 'Cd', 'Cadmium', '112.41', '12', 5, 'transition', '$[\\text{Kr}]\\,4d^{10} 5s^2$', '1.7', '868 kJ mol⁻¹', 140, 12, 5],
  [49, 'In', 'Indium', '114.82', '13', 5, 'post-transition', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^1$', '1.8', '558 kJ mol⁻¹', 142, 13, 5],
  [50, 'Sn', 'Tin', '118.71', '14', 5, 'post-transition', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^2$', '2.0', '709 kJ mol⁻¹', 140, 14, 5],
  [51, 'Sb', 'Antimony', '121.76', '15', 5, 'metalloid', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^3$', '2.1', '834 kJ mol⁻¹', 140, 15, 5],
  [52, 'Te', 'Tellurium', '127.60', '16', 5, 'metalloid', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^4$', '2.1', '869 kJ mol⁻¹', 137, 16, 5],
  [53, 'I', 'Iodine', '126.90', '17', 5, 'halogen', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^5$', '2.7', '1008 kJ mol⁻¹', 133, 17, 5, 'Dark grey crystalline solid at RTP that sublimes to violet vapor; stronger London dispersion forces than $\\text{F}_2,\\text{Cl}_2,\\text{Br}_2$ due to larger electron cloud.'],
  [54, 'Xe', 'Xenon', '131.29', '18', 5, 'noble', '$[\\text{Kr}]\\,4d^{10} 5s^2 5p^6$', '2.6', '1170 kJ mol⁻¹', 136, 18, 5],
  [55, 'Cs', 'Caesium', '132.91', '1', 6, 'alkali', '$[\\text{Xe}]\\,6s^1$', '0.8', '376 kJ mol⁻¹', 238, 1, 6],
  [56, 'Ba', 'Barium', '137.33', '2', 6, 'alkaline', '$[\\text{Xe}]\\,6s^2$', '0.9', '503 kJ mol⁻¹', 206, 2, 6],
  [57, 'La', 'Lanthanum', '138.91', '3', 6, 'lanthanide', '$[\\text{Xe}]\\,5d^1 6s^2$', '1.1', '538 kJ mol⁻¹', 194, 3, 6],
  [58, 'Ce', 'Cerium', '140.12', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^1 5d^1 6s^2$', '1.1', '534 kJ mol⁻¹', 184, 4, 9],
  [59, 'Pr', 'Praseodymium', '140.91', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^3 6s^2$', '1.1', '527 kJ mol⁻¹', 190, 5, 9],
  [60, 'Nd', 'Neodymium', '144.24', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^4 6s^2$', '1.1', '533 kJ mol⁻¹', 188, 6, 9],
  [61, 'Pm', 'Promethium', '—', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^5 6s^2$', '1.1', '540 kJ mol⁻¹', 186, 7, 9, 'Radioactive $4f$ lanthanoid with no stable isotopes (no standard $A_r$ listed in IB Section 7).'],
  [62, 'Sm', 'Samarium', '150.36', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^6 6s^2$', '1.2', '545 kJ mol⁻¹', 185, 8, 9],
  [63, 'Eu', 'Europium', '151.96', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^7 6s^2$', '1.2', '547 kJ mol⁻¹', 183, 9, 9],
  [64, 'Gd', 'Gadolinium', '157.25', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^7 5d^1 6s^2$', '1.2', '593 kJ mol⁻¹', 182, 10, 9],
  [65, 'Tb', 'Terbium', '158.93', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^9 6s^2$', '1.2', '566 kJ mol⁻¹', 181, 11, 9],
  [66, 'Dy', 'Dysprosium', '162.50', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{10} 6s^2$', '1.2', '573 kJ mol⁻¹', 180, 12, 9],
  [67, 'Ho', 'Holmium', '164.93', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{11} 6s^2$', '1.2', '581 kJ mol⁻¹', 179, 13, 9],
  [68, 'Er', 'Erbium', '167.26', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{12} 6s^2$', '1.2', '589 kJ mol⁻¹', 177, 14, 9],
  [69, 'Tm', 'Thulium', '168.93', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{13} 6s^2$', '1.3', '597 kJ mol⁻¹', 177, 15, 9],
  [70, 'Yb', 'Ytterbium', '173.05', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{14} 6s^2$', '1.1', '603 kJ mol⁻¹', 178, 16, 9],
  [71, 'Lu', 'Lutetium', '174.97', 'f-block', 6, 'lanthanide', '$[\\text{Xe}]\\,4f^{14} 5d^1 6s^2$', '1.3', '524 kJ mol⁻¹', 174, 17, 9],
  [72, 'Hf', 'Hafnium', '178.49', '4', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^2 6s^2$', '1.3', '659 kJ mol⁻¹', 164, 4, 6],
  [73, 'Ta', 'Tantalum', '180.95', '5', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^3 6s^2$', '1.5', '761 kJ mol⁻¹', 158, 5, 6],
  [74, 'W', 'Tungsten', '183.84', '6', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^4 6s^2$', '2.4', '770 kJ mol⁻¹', 150, 6, 6],
  [75, 'Re', 'Rhenium', '186.21', '7', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^5 6s^2$', '1.9', '760 kJ mol⁻¹', 141, 7, 6],
  [76, 'Os', 'Osmium', '190.23', '8', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^6 6s^2$', '2.2', '840 kJ mol⁻¹', 136, 8, 6],
  [77, 'Ir', 'Iridium', '192.22', '9', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^7 6s^2$', '2.2', '880 kJ mol⁻¹', 132, 9, 6],
  [78, 'Pt', 'Platinum', '195.08', '10', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^9 6s^1$', '2.3', '870 kJ mol⁻¹', 130, 10, 6],
  [79, 'Au', 'Gold', '196.97', '11', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^1$', '2.5', '890 kJ mol⁻¹', 130, 11, 6],
  [80, 'Hg', 'Mercury', '200.59', '12', 6, 'transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2$', '2.0', '1007 kJ mol⁻¹', 132, 12, 6, 'Only metal that is liquid at standard room temperature and pressure ($\\text{MP} = -38.8^\\circ\\text{C}$).'],
  [81, 'Tl', 'Thallium', '204.38', '13', 6, 'post-transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^1$', '1.6', '589 kJ mol⁻¹', 144, 13, 6],
  [82, 'Pb', 'Lead', '207.20', '14', 6, 'post-transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^2$', '2.3', '716 kJ mol⁻¹', 145, 14, 6],
  [83, 'Bi', 'Bismuth', '208.98', '15', 6, 'post-transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^3$', '2.0', '703 kJ mol⁻¹', 150, 15, 6],
  [84, 'Po', 'Polonium', '—', '16', 6, 'post-transition', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^4$', '2.0', '812 kJ mol⁻¹', 142, 16, 6],
  [85, 'At', 'Astatine', '—', '17', 6, 'halogen', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^5$', '2.2', '899 kJ mol⁻¹', 148, 17, 6],
  [86, 'Rn', 'Radon', '—', '18', 6, 'noble', '$[\\text{Xe}]\\,4f^{14} 5d^{10} 6s^2 6p^6$', '2.2', '1037 kJ mol⁻¹', 146, 18, 6],
  [87, 'Fr', 'Francium', '—', '1', 7, 'alkali', '$[\\text{Rn}]\\,7s^1$', '0.7', '380 kJ mol⁻¹', 242, 1, 7],
  [88, 'Ra', 'Radium', '—', '2', 7, 'alkaline', '$[\\text{Rn}]\\,7s^2$', '0.9', '509 kJ mol⁻¹', 211, 2, 7],
  [89, 'Ac', 'Actinium', '—', '3', 7, 'actinide', '$[\\text{Rn}]\\,6d^1 7s^2$', '1.1', '499 kJ mol⁻¹', 201, 3, 7],
  [90, 'Th', 'Thorium', '232.04', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,6d^2 7s^2$', '1.3', '587 kJ mol⁻¹', 190, 4, 10],
  [91, 'Pa', 'Protactinium', '231.04', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^2 6d^1 7s^2$', '1.5', '568 kJ mol⁻¹', 184, 5, 10],
  [92, 'U', 'Uranium', '238.03', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^3 6d^1 7s^2$', '1.4', '598 kJ mol⁻¹', 183, 6, 10],
  [93, 'Np', 'Neptunium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^4 6d^1 7s^2$', '1.4', '605 kJ mol⁻¹', 180, 7, 10],
  [94, 'Pu', 'Plutonium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^6 7s^2$', '1.3', '585 kJ mol⁻¹', 180, 8, 10],
  [95, 'Am', 'Americium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^7 7s^2$', '1.3', '578 kJ mol⁻¹', 173, 9, 10],
  [96, 'Cm', 'Curium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^7 6d^1 7s^2$', '1.3', '581 kJ mol⁻¹', 168, 10, 10],
  [97, 'Bk', 'Berkelium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^9 7s^2$', '1.3', '601 kJ mol⁻¹', 168, 11, 10],
  [98, 'Cf', 'Californium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{10} 7s^2$', '1.3', '608 kJ mol⁻¹', 168, 12, 10],
  [99, 'Es', 'Einsteinium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{11} 7s^2$', '1.3', '619 kJ mol⁻¹', 165, 13, 10],
  [100, 'Fm', 'Fermium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{12} 7s^2$', '1.3', '627 kJ mol⁻¹', 167, 14, 10],
  [101, 'Md', 'Mendelevium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{13} 7s^2$', '1.3', '635 kJ mol⁻¹', 173, 15, 10],
  [102, 'No', 'Nobelium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{14} 7s^2$', '1.3', '642 kJ mol⁻¹', 176, 16, 10],
  [103, 'Lr', 'Lawrencium', '—', 'f-block', 7, 'actinide', '$[\\text{Rn}]\\,5f^{14} 7s^2 7p^1$', '1.3', '470 kJ mol⁻¹', 161, 17, 10],
  [104, 'Rf', 'Rutherfordium', '—', '4', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^2 7s^2$', '—', '580 kJ mol⁻¹', null, 4, 7],
  [105, 'Db', 'Dubnium', '—', '5', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^3 7s^2$', '—', '—', null, 5, 7],
  [106, 'Sg', 'Seaborgium', '—', '6', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^4 7s^2$', '—', '—', null, 6, 7],
  [107, 'Bh', 'Bohrium', '—', '7', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^5 7s^2$', '—', '—', null, 7, 7],
  [108, 'Hs', 'Hassium', '—', '8', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^6 7s^2$', '—', '—', null, 8, 7],
  [109, 'Mt', 'Meitnerium', '—', '9', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^7 7s^2$', '—', '—', null, 9, 7],
  [110, 'Ds', 'Darmstadtium', '—', '10', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^8 7s^2$', '—', '—', null, 10, 7],
  [111, 'Rg', 'Roentgenium', '—', '11', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^9 7s^2$', '—', '—', null, 11, 7],
  [112, 'Cn', 'Copernicium', '—', '12', 7, 'transition', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2$', '—', '—', null, 12, 7],
  [113, 'Nh', 'Nihonium', '—', '13', 7, 'post-transition', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^1$', '—', '—', null, 13, 7],
  [114, 'Fl', 'Flerovium', '—', '14', 7, 'post-transition', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^2$', '—', '—', null, 14, 7],
  [115, 'Mc', 'Moscovium', '—', '15', 7, 'post-transition', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^3$', '—', '—', null, 15, 7],
  [116, 'Lv', 'Livermorium', '—', '16', 7, 'post-transition', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^4$', '—', '—', null, 16, 7],
  [117, 'Ts', 'Tennessine', '—', '17', 7, 'halogen', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^5$', '—', '—', null, 17, 7],
  [118, 'Og', 'Oganesson', '—', '18', 7, 'noble', '$[\\text{Rn}]\\,5f^{14} 6d^{10} 7s^2 7p^6$', '—', '—', null, 18, 7],
];

const PERIODIC_ELEMENTS: ElementItem[] = RAW_ELEMENTS_118.map(
  ([
    atomicNumber,
    symbol,
    name,
    relativeMass,
    group,
    period,
    category,
    electronConfig,
    electronegativity,
    firstIE,
    atomicRadiusPm,
    gridCol,
    gridRow,
    customNote,
  ]) => ({
    atomicNumber,
    symbol,
    name,
    relativeMass,
    group,
    period,
    category,
    electronConfig,
    electronegativity,
    firstIE,
    atomicRadiusPm,
    gridCol,
    gridRow,
    slTrendNote: customNote ?? DEFAULT_TREND_NOTES[category],
  })
);

const CATEGORY_BADGE_CLASSES: Record<ElementCategory, { label: string; cellBg: string }> = {
  nonmetal: { label: 'Non-metals', cellBg: 'bg-[#F0FDF4]' },
  alkali: { label: 'Alkali Metals', cellBg: 'bg-[#FEF3C7]' },
  alkaline: { label: 'Alkaline Earth', cellBg: 'bg-[#FFFBEB]' },
  metalloid: { label: 'Metalloids', cellBg: 'bg-[#F0FDFA]' },
  halogen: { label: 'Halogens', cellBg: 'bg-[#ECFDF5]' },
  noble: { label: 'Noble Gases', cellBg: 'bg-[#EFF6FF]' },
  transition: { label: 'Transition Metals', cellBg: 'bg-[#FAFAFA]' },
  'post-transition': { label: 'Post-Transition', cellBg: 'bg-[#F4F4F5]' },
  lanthanide: { label: 'Lanthanoids (4f)', cellBg: 'bg-[#F5F5F4]' },
  actinide: { label: 'Actinoids (5f)', cellBg: 'bg-[#FAF5EE]' },
};

const BOND_ENTHALPIES: BondEnthalpyItem[] = [
  { bond: 'C-H', formulaLatex: '$\\text{C}-\\text{H}$', enthalpyKjMol: 414, bondLengthPm: 109, contextNote: 'Standard alkane C–H bond broken in combustion and free-radical substitution.' },
  { bond: 'C-C', formulaLatex: '$\\text{C}-\\text{C}$', enthalpyKjMol: 346, bondLengthPm: 154, contextNote: 'Single covalent bond; longer and weaker than $\\text{C=C}$ and $\\text{C}\\equiv\\text{C}$.' },
  { bond: 'C=C', formulaLatex: '$\\text{C}=\\text{C}$', enthalpyKjMol: 614, bondLengthPm: 134, contextNote: 'Double covalent bond (shorter and stronger than $\\text{C}-\\text{C}$, $134\\text{ pm}$ vs $154\\text{ pm}$); high electron density makes alkenes reactive in electrophilic addition.' },
  { bond: 'C≡C', formulaLatex: '$\\text{C}\\equiv\\text{C}$', enthalpyKjMol: 839, bondLengthPm: 120, contextNote: 'Shortest and strongest carbon–carbon bond (triple bond, $120\\text{ pm}$).' },
  { bond: 'C-O', formulaLatex: '$\\text{C}-\\text{O}$', enthalpyKjMol: 358, bondLengthPm: 143, contextNote: 'Present in alcohols, ethers, and the single-bonded oxygen of esters/carboxylic acids.' },
  { bond: 'C=O', formulaLatex: '$\\text{C}=\\text{O}$', enthalpyKjMol: 804, bondLengthPm: 120, contextNote: 'In $\\text{CO}_2$ ($804\\text{ kJ mol}^{-1}$); carbonyl $\\text{C=O}$ in aldehydes/ketones is $749\\text{ kJ mol}^{-1}$.' },
  { bond: 'O=O', formulaLatex: '$\\text{O}=\\text{O}$', enthalpyKjMol: 498, bondLengthPm: 121, contextNote: 'Broken during complete combustion and ozone stratosphere photolysis ($\\lambda < 242\\text{ nm}$).' },
  { bond: 'O-H', formulaLatex: '$\\text{O}-\\text{H}$', enthalpyKjMol: 463, bondLengthPm: 96, contextNote: 'Two $\\text{O-H}$ bonds per $\\text{H}_2\\text{O}$ molecule! A common SL exam trap is forgetting to multiply $463 \\times 2$ per mole of $\\text{H}_2\\text{O}$.' },
  { bond: 'N≡N', formulaLatex: '$\\text{N}\\equiv\\text{N}$', enthalpyKjMol: 945, bondLengthPm: 110, contextNote: 'Extremely high bond enthalpy explains the high activation energy of the Haber process ($\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$).' },
  { bond: 'N-H', formulaLatex: '$\\text{N}-\\text{H}$', enthalpyKjMol: 391, bondLengthPm: 101, contextNote: 'Three $\\text{N-H}$ bonds per $\\text{NH}_3$ molecule; polar $\\text{N-H}$ enables hydrogen bonding.' },
  { bond: 'H-H', formulaLatex: '$\\text{H}-\\text{H}$', enthalpyKjMol: 436, bondLengthPm: 74, contextNote: 'Shortest covalent bond in the IB Data Booklet.' },
  { bond: 'Cl-Cl', formulaLatex: '$\\text{Cl}-\\text{Cl}$', enthalpyKjMol: 242, bondLengthPm: 199, contextNote: 'Undergoes homolytic fission under UV light ($\\text{Cl}_2 \\xrightarrow{h\\nu} 2\\text{Cl}^\\bullet$) in free-radical substitution initiation.' },
  { bond: 'Br-Br', formulaLatex: '$\\text{Br}-\\text{Br}$', enthalpyKjMol: 193, bondLengthPm: 228, contextNote: 'Longer and weaker than $\\text{Cl}-\\text{Cl}$ due to larger atomic radius down Group 17.' },
  { bond: 'C-Cl', formulaLatex: '$\\text{C}-\\text{Cl}$', enthalpyKjMol: 324, bondLengthPm: 177, contextNote: 'Formed in free-radical substitution of alkanes and nucleophilic substitution contexts.' },
  { bond: 'H-Cl', formulaLatex: '$\\text{H}-\\text{Cl}$', enthalpyKjMol: 431, bondLengthPm: 128, contextNote: 'Released as $\\text{HCl(g)}$ byproduct in alkane chlorination; strong acid in aqueous solution.' },
];

export function ChemistryDataBookletTool({ initialTab }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<BookletTab>(() => resolveBookletTab(initialTab));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementItem>(PERIODIC_ELEMENTS[5]); // Carbon default

  useEffect(() => {
    setActiveTab(resolveBookletTab(initialTab));
  }, [initialTab]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredConstants = useMemo(() => {
    if (activeTab !== 'constants') return [];
    return CONSTANTS_AND_EQUATIONS.filter(
      (item) =>
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.section.toLowerCase().includes(normalizedSearch) ||
        item.unitsAndNotes.toLowerCase().includes(normalizedSearch)
    );
  }, [activeTab, normalizedSearch]);

  const filteredElements = useMemo(() => {
    if (activeTab !== 'periodic-table') return [];
    return PERIODIC_ELEMENTS.filter(
      (el) =>
        !normalizedSearch ||
        el.name.toLowerCase().includes(normalizedSearch) ||
        el.symbol.toLowerCase().includes(normalizedSearch) ||
        String(el.atomicNumber) === normalizedSearch ||
        CATEGORY_BADGE_CLASSES[el.category].label.toLowerCase().includes(normalizedSearch) ||
        el.slTrendNote.toLowerCase().includes(normalizedSearch)
    );
  }, [activeTab, normalizedSearch]);

  const matchingAtomicNumbers = useMemo(
    () => new Set(filteredElements.map((el) => el.atomicNumber)),
    [filteredElements]
  );

  const filteredBonds = useMemo(() => {
    if (activeTab !== 'energetics') return [];
    return BOND_ENTHALPIES.filter(
      (b) =>
        !normalizedSearch ||
        b.bond.toLowerCase().includes(normalizedSearch) ||
        b.contextNote.toLowerCase().includes(normalizedSearch)
    );
  }, [activeTab, normalizedSearch]);

  return (
    <div className="space-y-6">
      {/* Top Spotlight Header & Global Search */}
      <div className="hairline-card bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="mini-tag bg-[#CCFBF1] text-[#0F766E] font-mono">
                IB CHEMISTRY SL · 2025 SYLLABUS
              </span>
              <span className="text-[12px] text-[#71717A] font-mono">
                2025 SL Sections 1–12 &amp; 23
              </span>
            </div>
            <h2
              className="text-[20px] font-semibold tracking-tight text-[#18181B]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Interactive IB Chemistry SL Data Booklet
            </h2>
            <p className="text-[13px] text-[#71717A] mt-0.5">
              Search SL constants and equations, inspect all 118 elements, and look up average bond enthalpies.
            </p>
          </div>

          <div className="w-full md:w-72 shrink-0">
            <label htmlFor="booklet-search" className="sr-only">
              Search Chemistry Data Booklet
            </label>
            <input
              id="booklet-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter equations, elements, C=O, kJ..."
              className="w-full px-3.5 py-2 text-[13px] rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus:bg-white focus:border-[#0D9488] focus-visible:ring-2 focus-visible:ring-[#0D9488] transition-colors duration-150"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Chemistry Data Booklet sections"
          className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#E4E4E7]"
        >
          {[
            { id: 'constants', label: 'Constants & Equations' },
            { id: 'periodic-table', label: 'Interactive Periodic Table (118)' },
            { id: 'energetics', label: 'Bond Enthalpies & Energetics' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as BookletTab)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
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

      {/* TAB 1: Constants & Equations */}
      {activeTab === 'constants' && (
        filteredConstants.length === 0 ? (
          <div className="hairline-card text-center py-10 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                className="text-[15px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                No matching constants or equations
              </h3>
              <p className="text-[13px] text-[#71717A] mt-1">
                No SL equations matched &ldquo;{searchQuery.trim()}&rdquo;. Clear the filter to inspect Sections 1, 2, 4, and 23.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="pill-btn-dark text-[12px]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConstants.map((item) => (
              <div key={item.id} className="hairline-card flex flex-col justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-[#0D9488] uppercase tracking-wider">
                    {item.section}
                  </span>
                  <h3
                    className="text-[15px] font-semibold text-[#18181B] mt-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <KaTeXText text={item.title} as="span" />
                  </h3>
                  <div className="my-3 px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#E4E4E7] text-[14px] text-[#18181B] overflow-x-auto">
                    <KaTeXText text={item.formula} as="div" />
                  </div>
                </div>
                <div className="text-[12.5px] text-[#71717A] leading-relaxed">
                  <KaTeXText text={item.unitsAndNotes} as="div" />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 2: Interactive Periodic Table (All 118 Elements) */}
      {activeTab === 'periodic-table' && (
        <div className="space-y-5">
          <div className="hairline-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3
                  className="text-[15px] font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Official 118-Element Periodic Table (IB Sections 6–10)
                </h3>
                <p className="text-[12px] text-[#71717A]">
                  Relative atomic masses (<KaTeXText text="$A_r$" as="span" />) printed to 2 decimal places per Data Booklet Section 7.
                </p>
              </div>
              <span className="text-[11.5px] font-mono text-[#71717A]">
                {normalizedSearch
                  ? `${filteredElements.length} / 118 matching`
                  : '118 elements · Click any tile to inspect'}
              </span>
            </div>

            {filteredElements.length === 0 ? (
              <div className="py-10 text-center space-y-3 border border-dashed border-[#E4E4E7] rounded-[12px] bg-[#FAFAFA]">
                <p className="text-[13px] text-[#71717A]">
                  No elements matched &ldquo;{searchQuery.trim()}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="pill-btn-dark text-[12px]"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {normalizedSearch && (
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {filteredElements.slice(0, 18).map((el) => {
                      const isSelected = selectedElement.atomicNumber === el.atomicNumber;
                      return (
                        <button
                          key={`match-${el.atomicNumber}`}
                          type="button"
                          onClick={() => setSelectedElement(el)}
                          className={`cursor-pointer px-2.5 py-1 rounded-full text-[11.5px] font-mono border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                            isSelected
                              ? 'border-[#0D9488] bg-[#CCFBF1] text-[#0F766E] font-semibold'
                              : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B] hover:bg-[#F4F4F5]'
                          }`}
                        >
                          {el.atomicNumber} {el.symbol} · {el.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="overflow-x-auto pb-1">
                  <div className="min-w-[740px] space-y-1.5">
                    {/* Group 1-18 Header Row */}
                    <div
                      className="grid gap-1 text-center text-[10px] font-mono font-semibold text-[#71717A]"
                      style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                    >
                      {Array.from({ length: 18 }).map((_, idx) => (
                        <div key={`grp-${idx + 1}`}>{idx + 1}</div>
                      ))}
                    </div>

                    {/* 18-Column Periodic Table Grid (Rows 1-7 + Spacer 8 + f-block 9-10) */}
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                        gridTemplateRows: 'repeat(7, auto) 10px repeat(2, auto)',
                      }}
                    >
                      {/* f-block row markers in col 1-3 */}
                      <div
                        style={{ gridColumn: '1 / span 3', gridRow: 9 }}
                        className="flex items-center justify-end pr-1.5 text-[10px] font-mono font-semibold text-[#71717A]"
                      >
                        58–71 Lanthanoids
                      </div>
                      <div
                        style={{ gridColumn: '1 / span 3', gridRow: 10 }}
                        className="flex items-center justify-end pr-1.5 text-[10px] font-mono font-semibold text-[#71717A]"
                      >
                        90–103 Actinoids
                      </div>

                      {PERIODIC_ELEMENTS.map((el) => {
                        const isSelected = selectedElement.atomicNumber === el.atomicNumber;
                        const isMatched = !normalizedSearch || matchingAtomicNumbers.has(el.atomicNumber);
                        const catStyle = CATEGORY_BADGE_CLASSES[el.category];
                        return (
                          <button
                            key={el.atomicNumber}
                            type="button"
                            aria-label={`${el.atomicNumber} ${el.name} (${el.symbol})`}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedElement(el)}
                            style={{ gridColumn: el.gridCol, gridRow: el.gridRow }}
                            className={`cursor-pointer p-1 rounded-[7px] border text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                              isSelected
                                ? 'border-[#0D9488] bg-[#CCFBF1] ring-1 ring-[#0D9488]'
                                : `border-[#E4E4E7] ${catStyle.cellBg} hover:border-[#0D9488]/60 hover:bg-[#F4F4F5]`
                            } ${isMatched ? 'opacity-100' : 'opacity-25'}`}
                          >
                            <div className="text-[8.5px] leading-none font-mono text-[#71717A]">
                              {el.atomicNumber}
                            </div>
                            <div
                              className="text-[12px] leading-tight font-bold text-[#18181B] mt-0.5"
                              style={{ fontFamily: 'var(--font-display)' }}
                            >
                              {el.symbol}
                            </div>
                            <div className="text-[8px] leading-none font-mono text-[#52525B] truncate mt-0.5">
                              {el.relativeMass}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category Legend */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E4E4E7]">
                  {(Object.keys(CATEGORY_BADGE_CLASSES) as ElementCategory[]).map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#52525B]"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-[3px] border border-[#E4E4E7] ${CATEGORY_BADGE_CLASSES[cat].cellBg}`}
                        aria-hidden="true"
                      />
                      {CATEGORY_BADGE_CLASSES[cat].label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Element Inspector Card */}
          <div className="hairline-card flex flex-col justify-between bg-[#FAFAFA]">
            <div>
              <div className="flex items-start justify-between border-b border-[#E4E4E7] pb-4 gap-3">
                <div>
                  <span className="mini-tag bg-[#CCFBF1] text-[#0F766E] font-mono">
                    Z = {selectedElement.atomicNumber} · Group {selectedElement.group} · Period {selectedElement.period}
                  </span>
                  <h3
                    className="text-[24px] font-bold text-[#18181B] mt-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {selectedElement.name} ({selectedElement.symbol})
                  </h3>
                </div>
                <div className="text-right font-mono shrink-0">
                  <div className="text-[11px] text-[#71717A]">Relative Atomic Mass</div>
                  <div className="text-[18px] font-semibold text-[#0D9488]">
                    {selectedElement.relativeMass}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-[10px] bg-white border border-[#E4E4E7]">
                  <div className="text-[11px] text-[#71717A]">Electron Configuration</div>
                  <div className="text-[13.5px] font-semibold text-[#18181B] mt-1 overflow-x-auto">
                    <KaTeXText text={selectedElement.electronConfig} as="span" />
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-white border border-[#E4E4E7]">
                  <div className="text-[11px] text-[#71717A]">
                    <KaTeXText text={'Pauling Electronegativity ($\\chi_P$)'} as="span" />
                  </div>
                  <div className="text-[13.5px] font-mono font-semibold text-[#18181B] mt-1">
                    {selectedElement.electronegativity}
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-white border border-[#E4E4E7]">
                  <div className="text-[11px] text-[#71717A]">1st Ionization Energy</div>
                  <div className="text-[13.5px] font-mono font-semibold text-[#18181B] mt-1">
                    {selectedElement.firstIE}
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-white border border-[#E4E4E7]">
                  <div className="text-[11px] text-[#71717A]">Covalent/Atomic Radius</div>
                  <div className="text-[13.5px] font-mono font-semibold text-[#18181B] mt-1">
                    {selectedElement.atomicRadiusPm !== null ? `${selectedElement.atomicRadiusPm} pm` : '—'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-[10px] bg-white border border-[#E4E4E7]">
                <div className="text-[11.5px] font-semibold text-[#0F766E] uppercase tracking-wider mb-1">
                  IB SL Periodicity &amp; Reactivity Note
                </div>
                <div className="text-[13px] text-[#18181B] leading-relaxed">
                  <KaTeXText text={selectedElement.slTrendNote} as="div" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Bond Enthalpies & Energetics */}
      {activeTab === 'energetics' && (
        <div className="space-y-4">
          <div className="hairline-card bg-[#FAFAFA]">
            <div className="flex flex-col gap-2">
              <div className="text-[13.5px] font-semibold text-[#18181B]">
                Sections 11 &amp; 12 · Covalent Bond Lengths &amp; Average Bond Enthalpies at 298.15 K
              </div>
              <div className="text-[13px] text-[#0F766E] font-medium overflow-x-auto">
                <KaTeXText
                  text="Formula: $\Delta H^\ominus = \sum E(\text{bonds broken in reactants}) - \sum E(\text{bonds formed in products})$"
                  as="span"
                />
              </div>
            </div>
          </div>

          {filteredBonds.length === 0 ? (
            <div className="hairline-card text-center py-10 space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                <Search className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3
                  className="text-[15px] font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  No matching bond enthalpies
                </h3>
                <p className="text-[13px] text-[#71717A] mt-1">
                  No bonds matched &ldquo;{searchQuery.trim()}&rdquo;. Clear your search to inspect Section 11–12 values.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="pill-btn-dark text-[12px]"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="hairline-card overflow-x-auto">
              <table className="w-full min-w-[540px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E4E4E7] text-[11.5px] font-mono text-[#71717A] uppercase">
                    <th className="py-2.5 pr-4">Bond</th>
                    <th className="py-2.5 px-4">Bond Enthalpy (kJ mol⁻¹)</th>
                    <th className="py-2.5 px-4">Bond Length (pm)</th>
                    <th className="py-2.5 pl-4">SL Exam Context &amp; Markscheme Trap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7] text-[13px]">
                  {filteredBonds.map((item) => (
                    <tr key={item.bond} className="hover:bg-[#FAFAFA] transition-colors duration-150">
                      <td className="py-3 pr-4 font-mono font-semibold text-[#18181B]">
                        <KaTeXText text={item.formulaLatex} as="span" />
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#0D9488]">
                        +{item.enthalpyKjMol}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#71717A]">{item.bondLengthPm} pm</td>
                      <td className="py-3 pl-4 text-[#27272A]">
                        <KaTeXText text={item.contextNote} as="span" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
