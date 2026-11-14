import type { SubjectPack } from '../schemas';

export const chemistrySlPack: SubjectPack = {
  subject: {
    slug: 'chem',
    name: 'Chemistry',
    level: 'SL',
    syllabusFirstAssessment: '2025',
    themeTokens: {
      wash1: 'rgba(153,246,228,0.55)',
      wash2: 'rgba(186,230,253,0.48)',
      wash3: 'rgba(236,254,255,0.6)',
      accent: '#0D9488',
      soft: '#F0FDFA',
      cardGradient: 'linear-gradient(135deg,#0F766E,#2DD4BF)',
    },
    iaConfig: {
      iaLabel: 'Chemistry IA',
      iaTitle: 'Scientific Investigation (SL)',
      maxMarks: 24,
      wordOrTimeLimit: '3,000 words max',
      weightPercent: 20,
      steps: [
        'Select reaction variable',
        'Design titration / trial',
        'Error & AI review',
      ],
      criteria: [
        {
          code: 'Criterion A',
          name: 'Research Design',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Formulate a quantitative chemical research question with chemical theory, controlled conditions, and safety/environmental protocols.',
          topBandExpectations: [
            'States exact molar concentrations, temperature range, and balanced chemical equations.',
            'Explains how side reactions, evaporation, or indicator endpoint drift are controlled.',
          ],
          commonPitfalls: [
            'Omitting justification for reagent concentrations or volume increments.',
          ],
        },
        {
          code: 'Criterion B',
          name: 'Data Analysis',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Record raw measurements with apparatus uncertainties and propagate percentage uncertainties to the final calculated value.',
          topBandExpectations: [
            'Consistent decimal places in raw burette/balance tables and matching significant figures in processed molarities/enthalpies.',
            'Full absolute and percentage uncertainty propagation shown with a sample calculation.',
          ],
          commonPitfalls: [
            'Forgetting to double the uncertainty when subtracting initial and final burette readings (±0.05 cm3 x 2 = ±0.10 cm3).',
          ],
        },
        {
          code: 'Criterion C',
          name: 'Conclusion',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Compare the experimental value against literature / IB Data Booklet values and compare percentage error vs total percentage uncertainty.',
          topBandExpectations: [
            'Calculates percentage error against a cited reference value (e.g., NIST or IB Data Booklet).',
            'Compares % error with % random uncertainty to determine whether systematic error dominates.',
          ],
          commonPitfalls: [
            'Failing to compare % experimental error against % apparatus uncertainty.',
          ],
        },
        {
          code: 'Criterion D',
          name: 'Evaluation',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Evaluate directional systematic errors (e.g. heat loss to surroundings, incomplete combustion) and propose targeted apparatus upgrades.',
          topBandExpectations: [
            'States whether each systematic error made the calculated magnitude too high or too low.',
            'Proposes specific chemical/instrumental fixes (e.g., bomb calorimeter, cooling curve extrapolation).',
          ],
          commonPitfalls: [
            'Suggesting generic improvements like "use a digital thermometer" when random uncertainty was already <1%.',
          ],
        },
      ],
      exemplarTitle:
        'Determining the Activation Energy of the Iodine Clock Reaction via Arrhenius Linearization',
      exemplarResearchQuestion:
        'What is the activation energy (Ea, in kJ mol-1) of the peroxodisulfate–iodide reaction determined by measuring initial reaction rate (1/t) across five temperatures (293 K to 333 K)?',
      exemplarScore: '23 / 24 (Grade 7)',
      exemplarSections: [
        {
          sectionTitle: 'Stoichiometric Mechanism & Uncertainty Propagation',
          excerptMarkdown:
            'Reaction rate was tracked by adding a fixed $1.00 \\times 10^{-4}\\text{ mol}$ aliquot of $\\text{S}_2\\text{O}_3^{2-}$ with starch indicator. Propagated percentage uncertainty across pipette ($\\pm 0.06\\text{ cm}^3$), burette ($\\pm 0.10\\text{ cm}^3$), and temperature ($\\pm 0.5\\text{ K}$) totaled $\\pm 2.4\\%$.',
          examinerCommentary:
            'Criterion B (6/6): Clear stoichiometric reasoning and complete percentage uncertainty summation.',
          criterionRef: 'Criterion B',
        },
        {
          sectionTitle: 'Comparison of % Error vs % Uncertainty',
          excerptMarkdown:
            'Linear regression of $\\ln(1/t)$ against $1/T$ yielded a gradient of $-6.18 \\times 10^3\\text{ K}$ ($R^2 = 0.994$), giving $E_a = 51.4 \\pm 1.2\\text{ kJ mol}^{-1}$. Compared to the literature value ($51.8\\text{ kJ mol}^{-1}$), the percentage error ($0.77\\%$) is smaller than the random uncertainty ($2.4\\%$), indicating minimal systematic bias.',
          examinerCommentary:
            'Criterion C (6/6): Directly contrasts percentage error with propagated random uncertainty.',
          criterionRef: 'Criterion C',
        },
      ],
    },
    spotlight: {
      title: 'Chemistry SL Tools & Formula Reference',
      pills: [
        {
          label: '2025 SL Structure & Reactivity',
          href: '/subjects/chem?tab=topics',
        },
        { label: 'Interactive Data Booklet', href: '/tools/data-booklet' },
        {
          label: 'Periodic Table',
          href: '/tools/data-booklet?tab=periodic',
        },
        { label: 'Stoichiometry & Energetics', href: '/tools/calc-checker' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description:
          'SL Paper 1 & Paper 2 stoichiometry, kinetics & organic drills',
        bgHex: '#F0FDFA',
        colorHex: '#0D9488',
        href: '/questions?subject=chem',
        iconName: 'questionbank',
      },
      {
        title: 'Calculation Step Checker',
        description: 'Check significant figures, units & mole ratios',
        bgHex: '#EFF6FF',
        colorHex: '#2563EB',
        href: '/tools/calc-checker',
        iconName: 'calc_checker',
      },
      {
        title: 'Blurting',
        description: 'Active recall for periodic trends & reaction conditions',
        bgHex: '#FEF3C7',
        colorHex: '#D97706',
        href: '/tools/blurting?subject=chem',
        iconName: 'blurting',
      },
      {
        title: 'Teach Sprout',
        description: 'Walk Sprout through equilibrium & enthalpy cycles',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/tools/teach-sprout?subject=chem',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Timed SL Paper 1A/1B and Paper 2 mocks',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/questions?subject=chem&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Track calculation slips & missed state symbols',
        bgHex: '#FEF2F2',
        colorHex: '#DC2626',
        href: '/questions?subject=chem&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'IB Data Booklet',
        description: 'Constants, periodic table & average bond enthalpies',
        bgHex: '#E0F2FE',
        colorHex: '#0284C7',
        href: '/tools/data-booklet',
        iconName: 'data_booklet',
      },
      {
        title: 'Study Guide',
        description: 'SL Structure 1–3 & Reactivity 1–3 concise chapters',
        bgHex: '#FEF9C3',
        colorHex: '#CA8A04',
        href: '/study-guides?subject=chem',
        iconName: 'study_guide',
      },
      {
        title: 'Flashcards',
        description: 'Functional groups, periodic trends & bond enthalpies',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/flashcards?subject=chem',
        iconName: 'flashcards',
      },
      {
        title: 'AI IA Studio',
        description: 'Audit uncertainty propagation & lab conclusion',
        bgHex: '#DCFCE7',
        colorHex: '#16A34A',
        href: '/essay-studio?subject=chem',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'chem-S1.4',
      subjectSlug: 'chem',
      unitCode: 'Structure 1',
      unitTitle: 'Models of the Particulate Nature of Matter',
      code: 'S1.4 & S1.5',
      title: 'The Mole Concept & Ideal Gases (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 10,
      guidingQuestions: [
        'How do chemists quantify particles too small to count directly?',
        'Under what conditions do real gases deviate from the ideal gas model?',
      ],
      understandings: [
        {
          code: 'S1.4.1',
          text: 'The mole (mol) as the SI unit of amount of substance containing Avogadro’s constant (NA = 6.02 x 10^23 mol-1) elementary entities.',
          isHL: false,
        },
        {
          code: 'S1.5.1',
          text: 'Ideal gas assumptions: negligible particle volume compared to container volume and zero intermolecular forces between particles.',
          isHL: false,
        },
        {
          code: 'S1.5.4',
          text: 'Ideal gas equation PV = nRT and molar volume at STP (22.7 dm3 mol-1 at 273.15 K and 100 kPa).',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**Core SL Stoichiometry Equations:**\n- Amount of substance: $$n = \\frac{m}{M} = \\frac{N}{N_A} = cV = \\frac{V_{\\text{gas}}}{22.7\\text{ dm}^3\\text{ mol}^{-1}}$$\n- **Ideal Gas Law ($PV = nRT$):** Always convert units to SI before substituting with $R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$:\n  - Pressure $P$ in **Pascals ($\\text{Pa}$)** ($1\\text{ kPa} = 10^3\\text{ Pa}$) and Volume $V$ in **$\\text{m}^3$** ($1\\text{ dm}^3 = 10^{-3}\\text{ m}^3$, $1\\text{ cm}^3 = 10^{-6}\\text{ m}^3$).\n  - Shortcut: **$P(\\text{kPa}) \\times V(\\text{dm}^3) = nRT$** works directly because $10^3 \\times 10^{-3} = 1$!\n  - Temperature $T$ in **Kelvin ($\\text{K}$)**: $T(\\text{K}) = T(^\\circ\\text{C}) + 273.15$.\n- **Real Gas Deviation:** Real gases deviate most from ideal behavior at **low temperature** (particles move slowly so intermolecular attractions become significant) and **high pressure** (particle volume is no longer negligible relative to total volume).',
      cheatsheetMarkdown:
        '- **IB STP Molar Gas Volume:** **$22.7\\text{ dm}^3\\text{ mol}^{-1}$** at $273.15\\text{ K}$ and $100\\text{ kPa}$ (never use $22.4$).\n- **Unit shortcut:** $\\text{kPa} \\times \\text{dm}^3 = \\text{Pa} \\times \\text{m}^3$.\n- **Atom Economy:** $\\%\\text{ Atom Economy} = \\frac{\\text{total molar mass of desired product}}{\\text{total molar mass of all reactants}} \\times 100$ (including stoichiometric coefficients).',
      blurtChecklist: [
        'n = m / M = cV = V / 22.7 dm3 mol-1 at STP (273.15 K, 100 kPa)',
        'In PV = nRT with R = 8.31 J K-1 mol-1, convert T to Kelvin (+273.15) and use Pa with m3 (or kPa with dm3)',
        'Real gases deviate from ideal behavior at HIGH pressure (particle volume significant) and LOW temperature (IMFs significant)',
        'Empirical formula = simplest whole-number ratio of atoms; Molecular formula = actual number of atoms per molecule',
      ],
    },
    {
      id: 'chem-S2.2',
      subjectSlug: 'chem',
      unitCode: 'Structure 2',
      unitTitle: 'Models of Bonding and Structure',
      code: 'S2.2',
      title: 'The Covalent Model, VSEPR & Intermolecular Forces (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 10,
      guidingQuestions: [
        'How does VSEPR theory predict molecular geometry and polarity from Lewis structures?',
        'How do intermolecular forces determine boiling points and solubility?',
      ],
      understandings: [
        {
          code: 'S2.2.4',
          text: 'Valence Shell Electron Pair Repulsion (VSEPR) model for 2, 3, and 4 electron domains (linear, trigonal planar, bent, tetrahedral, trigonal pyramidal).',
          isHL: false,
        },
        {
          code: 'S2.2.8',
          text: 'Relative strength of intermolecular forces: London dispersion forces < dipole-dipole < hydrogen bonding.',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**SL VSEPR Geometry Table (Up to 4 Electron Domains Only):**\n- **2 Domains ($0$ lone pairs):** **Linear**, $180^\\circ$ ($\\text{CO}_2$, $\\text{BeCl}_2$, $\\text{HCN}$).\n- **3 Domains ($0$ lone pairs):** **Trigonal planar**, $120^\\circ$ ($\\text{BF}_3$, $\\text{SO}_3$, $\\text{CO}_3^{2-}$).\n- **3 Domains ($1$ lone pair):** **Bent / V-shaped**, $\\approx 117^\\circ$ ($\\text{SO}_2$, $\\text{O}_3$).\n- **4 Domains ($0$ lone pairs):** **Tetrahedral**, $109.5^\\circ$ ($\\text{CH}_4$, $\\text{NH}_4^+$).\n- **4 Domains ($1$ lone pair):** **Trigonal pyramidal**, $107^\\circ$ ($\\text{NH}_3$, $\\text{PCl}_3$).\n- **4 Domains ($2$ lone pairs):** **Bent / V-shaped**, $104.5^\\circ$ ($\\text{H}_2\\text{O}$, $\\text{H}_2\\text{S}$).\n\n*(Note: 5 and 6 electron domains such as $\\text{PCl}_5$ and $\\text{SF}_6$ are strictly HL-only and excluded from Chemistry SL.)*',
      cheatsheetMarkdown:
        '- **Lone Pair Repulsion Order:** Lone pair–lone pair $>$ lone pair–bonding pair $>$ bonding pair–bonding pair (reduces bond angle by $\\approx 2.5^\\circ$ per lone pair).\n- **Hydrogen Bonding Requirement:** Hydrogen covalently bonded directly to **N, O, or F** interacting with a lone pair on N, O, or F of a neighboring molecule.\n- **Giant Covalent Allotropes:** Diamond ($109.5^\\circ$, 4 bonds, non-conductor), Graphite ($120^\\circ$, 3 bonds + delocalized $e^-$, conductor), $\\text{SiO}_2$ (tetrahedral giant lattice).',
      blurtChecklist: [
        '4 domains: 0 LP = tetrahedral (109.5°), 1 LP = trigonal pyramidal (107°), 2 LP = bent (104.5°)',
        'Lone pairs repel more strongly than bonding pairs, compressing bond angles',
        'Molecule is non-polar if bond dipoles cancel symmetrically (e.g. CO2, CCl4, BF3)',
        'IMF strength for comparable molar mass: London dispersion < dipole-dipole < hydrogen bonding (H-F, H-O, H-N)',
      ],
    },
    {
      id: 'chem-S3.1',
      subjectSlug: 'chem',
      unitCode: 'Structure 3',
      unitTitle: 'Classification of Matter',
      code: 'S3.1 & S3.2',
      title: 'Periodic Trends & Organic Functional Groups (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 10,
      guidingQuestions: [
        'How do effective nuclear charge and electron shielding explain trends across periods and down groups?',
      ],
      understandings: [
        {
          code: 'S3.1.3',
          text: 'Trends in atomic radius, ionic radius, first ionization energy, electron affinity, and electronegativity across Period 3 and down groups.',
          isHL: false,
        },
        {
          code: 'S3.1.5',
          text: 'Acid-base character of Period 3 oxides: basic (Na2O, MgO) to amphoteric (Al2O3) to acidic (SiO2, P4O10, SO2/SO3).',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**Period 3 Trends (Left to Right: $\\text{Na} \\to \\text{Ar}$):**\n- Nuclear charge (proton number) increases while outer electrons enter the same principal energy shell ($n=3$), so **shielding remains approximately constant** and **effective nuclear charge ($Z_{\\text{eff}}$) increases**.\n- Therefore, **atomic radius decreases**, **first ionization energy generally increases**, and **electronegativity increases** across Period 3; down a group, adding occupied energy shells increases shielding and atomic radius, so **first ionization energy decreases**.\n- **Ionic Radii:** Cations are smaller than parent atoms (outer shell lost); anions are larger than parent atoms (greater electron–electron repulsion). Across isoelectronic ions ($\\text{Na}^+ > \\text{Mg}^{2+} > \\text{Al}^{3+}$), radius decreases as nuclear charge increases.\n\n**Period 3 & Environmental Non-Metal Oxides with Water (Equations Required by IB `S3.1.5`):**\n- **Basic Ionic Oxides:** $\\text{Na}_2\\text{O}(\\text{s}) + \\text{H}_2\\text{O}(\\text{l}) \\to 2\\text{NaOH}(\\text{aq})$ ($\\text{pH } 13–14$); $\\text{MgO}(\\text{s}) + \\text{H}_2\\text{O}(\\text{l}) \\to \\text{Mg(OH)}_2(\\text{aq})$ ($\\text{pH } 9–10$).\n- **Amphoteric Oxide:** $\\text{Al}_2\\text{O}_3(\\text{s})$ (insoluble in water, reacts with both acids and bases).\n- **Acidic Covalent Oxides:** $\\text{P}_4\\text{O}_{10}(\\text{s}) + 6\\text{H}_2\\text{O}(\\text{l}) \\to 4\\text{H}_3\\text{PO}_4(\\text{aq})$; $\\text{SO}_3(\\text{g}) + \\text{H}_2\\text{O}(\\text{l}) \\to \\text{H}_2\\text{SO}_4(\\text{aq})$; $\\text{CO}_2(\\text{g}) + \\text{H}_2\\text{O}(\\text{l}) \\rightleftharpoons \\text{H}_2\\text{CO}_3(\\text{aq})$ (ocean acidification).',
      cheatsheetMarkdown:
        '- **Period 3 General Trends ($\\text{Na} \\to \\text{Ar}$):** Same shell ($n=3$), higher nuclear charge $\\implies$ smaller atomic radius, higher general $\\text{IE}_1$, higher electronegativity.\n- **Group 1 & 17 Trends:** Group 1 metal reactivity with water increases down the group ($\\text{Li} < \\text{Na} < \\text{K}$); Group 17 oxidizing ability decreases down the group ($\\text{Cl}_2 > \\text{Br}_2 > \\text{I}_2$).\n- **Amphoteric Oxide:** **$\\text{Al}_2\\text{O}_3$** (bridges basic $\\text{Na}_2\\text{O}/\\text{MgO}$ and acidic $\\text{CO}_2/\\text{SO}_2/\\text{SO}_3$).',
      blurtChecklist: [
        'Across Period 3: nuclear charge increases, shielding stays similar -> atomic radius decreases, general IE1 and electronegativity increase',
        'Isoelectronic ions (Na+ > Mg2+ > Al3+): same electron count, higher proton number pulls shell closer',
        'Group 1 + water forms MOH(aq) + H2(g) with reactivity Li < Na < K; Group 17 halogen displacement Cl2 > Br2 > I2',
        'Period 3 oxides shift from basic ionic (Na2O, MgO) -> amphoteric (Al2O3) -> acidic covalent (SiO2, P4O10, SO2, SO3)',
      ],
    },
    {
      id: 'chem-R1.1',
      subjectSlug: 'chem',
      unitCode: 'Reactivity 1',
      unitTitle: 'What Drives Chemical Reactions?',
      code: 'R1.1–R1.3',
      title: 'Measuring Enthalpy Changes, Hess’s Law & Bond Enthalpies (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 12,
      guidingQuestions: [
        'How is enthalpy change measured experimentally and calculated using Hess’s Law or average bond enthalpies?',
      ],
      understandings: [
        {
          code: 'R1.1.3',
          text: 'Calorimetry calculation q = mcΔT and molar enthalpy change ΔH = -q/n (exothermic) or +q/n (endothermic).',
          isHL: false,
        },
        {
          code: 'R1.2.1',
          text: 'Bond-breaking is endothermic (+ΔH) and bond-making is exothermic (-ΔH): ΔH = ΣE(bonds broken) - ΣE(bonds formed).',
          isHL: false,
        },
        {
          code: 'R1.2.2',
          text: 'Hess’s Law: enthalpy change of a reaction is independent of the pathway between initial and final states.',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**1. Coffee-Cup / Flame Calorimetry ($q = mc\\Delta T$):**\n- $m$ is always the **mass of the aqueous solution / water** being heated ($\\text{g}$), NOT the mass of the solid fuel or limiting solute.\n- Convert $q$ from Joules ($\\text{J}$) to kilojoules ($\\text{kJ}$) by dividing by $1000$, then divide by moles of limiting reactant $n$: $$\\Delta H = -\\frac{q(\\text{kJ})}{n_{\\text{limiting}}}$$\n- If temperature **increases** ($\\Delta T > 0$), the reaction is **exothermic** and $\\Delta H$ must carry a **negative ($-$) sign**.\n\n**2. Average Bond Enthalpies (Data Booklet Section 12) & Hess’s Law:**\n$$\\Delta H^\\ominus = \\sum E(\\text{bonds broken in gaseous reactants}) - \\sum E(\\text{bonds formed in gaseous products})$$\n- **Why Bond Enthalpy Calculations Differ from Calorimetric $\\Delta H$:**\n  1. Average bond enthalpies are defined strictly for molecules in the **gaseous state**, whereas standard calorimetry often involves **liquid** fuels (e.g., $\\text{C}_2\\text{H}_5\\text{OH}(\\text{l})$) and **liquid** water ($\\text{H}_2\\text{O}(\\text{l})$) at $298\\text{ K}$.\n  2. Bond enthalpies are **average values** across a range of similar compounds, not specific to that single molecule.\n- **Hess’s Law (SL Multistep Cycles):** $\\Delta H_{\\text{overall}} = \\sum \\Delta H_{\\text{steps}}$ — reversing a step flips the sign of $\\Delta H$, and multiplying coefficients by $k$ multiplies $\\Delta H$ by $k$.',
      cheatsheetMarkdown:
        '- **Bond Enthalpy Formula:** **$\\Delta H^\\ominus = \\sum E(\\text{bonds broken}) - \\sum E(\\text{bonds formed})$** (gaseous state only).\n- **Hess’s Law (SL Cycles):** **$\\Delta H_{\\text{overall}} = \\sum \\Delta H_{\\text{steps}}$** (reverse equation $\\implies$ flip sign; multiply equation by $k$ $\\implies$ multiply $\\Delta H$ by $k$).',
      blurtChecklist: [
        'q = mcΔT uses mass of water/solution (g) and c = 4.18 J g-1 K-1',
        'ΔH = -q / (1000 * n_limiting) in kJ mol-1 with negative sign when temperature rises',
        'Bond breaking is endothermic (+); bond forming is exothermic (-): ΔH = Σ(broken) - Σ(formed)',
        'Bond enthalpy values apply only to the gaseous state and are averages across different molecules',
      ],
    },
    {
      id: 'chem-R2.2',
      subjectSlug: 'chem',
      unitCode: 'Reactivity 2',
      unitTitle: 'How Much, How Fast and How Far?',
      code: 'R2.2 & R2.3',
      title: 'Reaction Kinetics & Dynamic Equilibrium (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 12,
      guidingQuestions: [
        'How does collision theory explain the effects of temperature, concentration, and catalysts on reaction rate?',
        'How does a reversible system at equilibrium respond to external stresses?',
      ],
      understandings: [
        {
          code: 'R2.2.2',
          text: 'Collision theory: particles must collide with sufficient kinetic energy (E >= Ea) and correct collision geometry.',
          isHL: false,
        },
        {
          code: 'R2.3.3',
          text: 'Le Chatelier’s principle and equilibrium constant expression Kc for homogeneous reactions (qualitative SL treatment).',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**Maxwell–Boltzmann Energy Distribution & Temperature:**\nIncreasing temperature increases the average kinetic energy of particles (flattening and shifting the Maxwell–Boltzmann curve peak to the right while keeping total area under the curve constant). Crucially, it **exponentially increases the proportion of particles with energy $E \\ge E_a$**, increasing the frequency of *successful* collisions.\n\n**Catalysts:**\nProvide an **alternative reaction pathway with a lower activation energy ($E_a$)** so a greater fraction of particles satisfy $E \\ge E_{\\text{cat}}$. A catalyst increases the rates of both forward and reverse reactions equally and **does not change $\\Delta H$ or the position of equilibrium ($K_c$)**.\n\n**Dynamic Equilibrium & Le Chatelier’s Principle (SL):**\n- **Only temperature changes the numerical value of $K_c$!**\n  - For an **exothermic forward reaction ($\\Delta H < 0$):** Increasing $T$ shifts equilibrium to the **left (reactants)** and **decreases $K_c$**.\n  - For an **endothermic forward reaction ($\\Delta H > 0$):** Increasing $T$ shifts equilibrium to the **right (products)** and **increases $K_c$**.',
      cheatsheetMarkdown:
        '- **Maxwell–Boltzmann Curve Rules:** Curve starts at $(0,0)$, never touches the x-axis at high energy, and area under the curve = total number of particles.\n- **$K_c$ Dependency Trap:** Concentration, pressure, and catalysts NEVER change the value of $K_c$—**only temperature changes $K_c$**.',
      blurtChecklist: [
        'Successful collision requires kinetic energy E >= Ea AND correct molecular orientation/geometry',
        'Higher temperature increases the proportion of particles with E >= Ea (primary factor) and collision frequency',
        'Catalyst provides an alternative pathway with lower Ea without changing ΔH or Kc',
        'Le Chatelier: increasing pressure shifts equilibrium toward the side with fewer moles of gas',
        'Only temperature alters the numerical value of the equilibrium constant Kc',
      ],
    },
    {
      id: 'chem-R3.1',
      subjectSlug: 'chem',
      unitCode: 'Reactivity 3',
      unitTitle: 'What Are the Mechanisms of Chemical Change?',
      code: 'R3.1 & R3.2',
      title: 'Proton Transfer (Acids/Bases) & Electron Transfer (Redox) (SL)',
      levelScope: 'SL/Core',
      recommendedHours: 14,
      guidingQuestions: [
        'How do Brønsted–Lowry proton transfer and redox electron transfer govern chemical reactivity?',
      ],
      understandings: [
        {
          code: 'R3.1.1',
          text: 'Brønsted–Lowry acid as a proton (H+) donor and base as a proton (H+) acceptor; conjugate acid-base pairs differ by one H+.',
          isHL: false,
        },
        {
          code: 'R3.1.5',
          text: 'pH scale: pH = -log10[H+], [H+] = 10^-pH, and Kw = [H+][OH-] = 1.0 x 10^-14 at 298 K.',
          isHL: false,
        },
        {
          code: 'R3.2.4',
          text: 'Voltaic (galvanic) vs electrolytic cells: anode is always oxidation, cathode is always reduction.',
          isHL: false,
        },
      ],
      studyGuideMarkdown:
        '**1. Brønsted–Lowry Acids & Bases (SL):**\n- **Strong Acids** ($\\text{HCl}, \\text{HNO}_3, \\text{H}_2\\text{SO}_4$) dissociate **completely** ($100\\%$) in water; **Weak Acids** ($\\text{CH}_3\\text{COOH}, \\text{H}_2\\text{CO}_3$) dissociate **partially** ($\\rightleftharpoons$).\n- **Exam Comparison of Equimolar Strong vs Weak Acid ($0.10\\text{ mol dm}^{-3}$ $\\text{HCl}$ vs $\\text{CH}_3\\text{COOH}$):**\n  - $\\text{HCl}$ has a higher $[\\text{H}^+]$, lower $\\text{pH}$, higher electrical conductivity, and faster initial reaction rate with $\\text{Mg}$ or $\\text{CaCO}_3$.\n  - However, equal volumes of equimolar monoprotic strong and weak acids require the **exact same volume of $\\text{NaOH}$ to neutralize**!\n\n**2. Redox & Electrochemical Cells (SL):**\n- **AN OX / RED CAT** holds in every cell: **Oxidation at the Anode**, **Reduction at the Cathode**.\n- **Voltaic (Galvanic) Cell:** Spontaneous exothermic redox converts chemical $\\to$ electrical energy. **Anode is negative ($-$)** (more reactive metal higher in the activity series); **Cathode is positive ($+$)**.\n- **Electrolytic Cell:** Non-spontaneous redox driven by external DC battery converts electrical $\\to$ chemical energy (molten ionic salt at SL). **Anode is positive ($+$)**; **Cathode is negative ($-$)**.',
      cheatsheetMarkdown:
        '- **Amphiprotic species** (e.g. $\\text{HCO}_3^-$, $\\text{H}_2\\text{PO}_4^-$, $\\text{H}_2\\text{O}$): Can both donate and accept $\\text{H}^+$.\n- **Electrode Polarity:**\n  - Voltaic: **Anode $(-)$**, **Cathode $(+)$**.\n  - Electrolytic: **Anode $(+)$**, **Cathode $(-)$**.\n- **pH & $K_w$ (298 K):** $\\text{pH} = -\\log_{10}[\\text{H}^+]$; $K_w = [\\text{H}^+][\\text{OH}^-] = 1.00 \\times 10^{-14}\\text{ mol}^2\\text{ dm}^{-6}$.',
      blurtChecklist: [
        'Conjugate acid-base pair differs by a single proton (H+); amphiprotic species can donate or accept H+',
        'Strong vs weak acid of equal molarity: strong has lower pH, higher conductivity, faster rate, but requires SAME volume of base to neutralize',
        'Oxidation = loss of electrons / increase in oxidation state (occurs at Anode)',
        'Reduction = gain of electrons / decrease in oxidation state (occurs at Cathode)',
        'Voltaic cell: spontaneous, Anode (-), Cathode (+); Electrolytic cell: non-spontaneous, Anode (+), Cathode (-)',
      ],
    },
  ],
  questions: [
    {
      id: 'chem-r1-q001',
      subjectSlug: 'chem',
      topicId: 'chem-R1.1',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Explain',
      stemMarkdown:
        'Explain why the enthalpy change of combustion of ethanol calculated using average bond enthalpies differs from the experimental calorimetry literature value.',
      stimulusMarkdown:
        '$\\text{C}_2\\text{H}_5\\text{OH}(\\text{l}) + 3\\text{O}_2(\\text{g}) \\to 2\\text{CO}_2(\\text{g}) + 3\\text{H}_2\\text{O}(\\text{l})$ · Literature combustion $\\Delta H^\\ominus = -1367\\text{ kJ mol}^{-1}$.',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Average bond enthalpies apply strictly to molecules in the gaseous state.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Under standard conditions (298 K, 100 kPa), ethanol (C2H5OH) and water (H2O) are liquids, not gases.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Enthalpy changes of vaporization / condensation (intermolecular hydrogen bonding in liquid ethanol and water) are not accounted for in bond enthalpy calculations.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Bond enthalpies in the Data Booklet are average values measured across a range of similar compounds rather than specific to ethanol alone.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Compare Standard Physical States vs Gaseous State',
          explanationMarkdown:
            'Bond enthalpy is defined for breaking $1\\text{ mol}$ of covalent bonds in the **gaseous state**, whereas standard combustion at $298\\text{ K}$ starts with **liquid ethanol** and produces **liquid water**.',
        },
        {
          stepNumber: 2,
          title: 'Account for Intermolecular Forces & Average Values',
          explanationMarkdown:
            'State that latent heats of vaporization/condensation (breaking/forming intermolecular hydrogen bonds) are omitted, and that tabulated bond enthalpies are **averages** across many compounds.',
        },
      ],
      commonPitfalls: [
        'Citing experimental heat loss to surroundings (the literature combustion value is already corrected for heat loss!).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'chem-s2-q002',
      subjectSlug: 'chem',
      topicId: 'chem-S2.2',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Predict',
      stemMarkdown:
        'Using VSEPR theory, state and explain the molecular geometry and $\\text{H–N–H}$ bond angle in ammonia ($\\text{NH}_3$) compared to the $\\text{H–C–H}$ bond angle in methane ($\\text{CH}_4$).',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Both N in NH3 and C in CH4 have 4 electron domains around the central atom (tetrahedral electron domain geometry).',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'NH3 has 3 bonding pairs and 1 lone pair of electrons, resulting in a trigonal pyramidal molecular geometry.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Lone pair–bonding pair repulsion is greater than bonding pair–bonding pair repulsion.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Therefore, the H–N–H bond angle in NH3 is compressed to approximately 107° (accept 106.5°–107.5°), compared to 109.5° in tetrahedral CH4.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Count Bonding Domains and Lone Pairs',
          explanationMarkdown:
            'In $\\text{NH}_3$, nitrogen ($5$ valence $e^-$) forms $3$ single $\\text{N–H}$ bonds and retains $1$ non-bonding lone pair ($4$ electron domains total).',
        },
        {
          stepNumber: 2,
          title: 'Apply Lone-Pair Repulsion Hierarchy',
          explanationMarkdown:
            'Because a lone pair occupies more angular space closer to the central nucleus, **lone pair–bonding pair repulsion $>$ bonding pair–bonding pair repulsion**, compressing the tetrahedral $109.5^\\circ$ angle down to **$107^\\circ$** (**trigonal pyramidal**).',
        },
      ],
      commonPitfalls: [
        'Calling the molecular shape of NH3 "tetrahedral" instead of "trigonal pyramidal" (tetrahedral is the electron domain geometry).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'chem-s3-q003',
      subjectSlug: 'chem',
      topicId: 'chem-S3.1',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 3,
      commandTerm: 'Explain',
      stemMarkdown:
        'Explain why atomic radius decreases across Period 3 from sodium ($\\text{Na}$) to chlorine ($\\text{Cl}$), and why the ionic radius of $\\text{Mg}^{2+}$ ($72\\text{ pm}$) is smaller than that of $\\text{Na}^+$ ($102\\text{ pm}$).',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Across Period 3 (Na to Cl), nuclear charge (number of protons) increases while outer electrons enter the same main energy level (n = 3), so inner-shell shielding remains approximately constant.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Stronger electrostatic attraction (higher effective nuclear charge) pulls the valence electrons closer to the nucleus, decreasing atomic radius.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Na+ and Mg2+ are isoelectronic (both 1s2 2s2 2p6, 10 electrons), but Mg2+ has more protons (12 vs 11), pulling the electron cloud closer.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Compare Nuclear Charge vs. Shielding Across Period 3',
          explanationMarkdown:
            'From $\\text{Na}$ ($Z=11$) to $\\text{Cl}$ ($Z=17$), protons are added to the nucleus while valence electrons stay in shell $n=3$ with the same $[\\text{Ne}]$ inner core, increasing effective nuclear charge.',
        },
        {
          stepNumber: 2,
          title: 'Compare Isoelectronic Cations ($\\text{Na}^+$ vs $\\text{Mg}^{2+}$)',
          explanationMarkdown:
            'Both $\\text{Na}^+$ and $\\text{Mg}^{2+}$ have $10$ electrons ($2,8$), so shielding is identical; $\\text{Mg}^{2+}$ has $12$ protons vs $11$ in $\\text{Na}^+$, giving a smaller ionic radius ($72\\text{ pm} < 102\\text{ pm}$).',
        },
      ],
      commonPitfalls: [
        'Claiming outer electrons enter a new shell across a period, or forgetting to state that $\\text{Na}^+$ and $\\text{Mg}^{2+}$ have the same number of electrons (isoelectronic).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'chem-r2-q004',
      subjectSlug: 'chem',
      topicId: 'chem-R2.2',
      paper: 'Paper 1A',
      questionType: 'mcq',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 1,
      commandTerm: 'Deduce',
      stemMarkdown:
        'Consider the reversible synthesis of methanol at equilibrium:\n$$\\text{CO}(\\text{g}) + 2\\text{H}_2(\\text{g}) \\rightleftharpoons \\text{CH}_3\\text{OH}(\\text{g}) \\quad \\Delta H^\\ominus = -91\\text{ kJ mol}^{-1}$$\nWhich change will increase **both** the rate of the forward reaction **and** the equilibrium yield of $\\text{CH}_3\\text{OH}(\\text{g})$?',
      stimulusMarkdown: null,
      options: [
        {
          id: 'A',
          text: 'Increasing the total pressure by decreasing the volume of the reaction vessel at constant temperature',
        },
        {
          id: 'B',
          text: 'Increasing the temperature at constant volume',
        },
        {
          id: 'C',
          text: 'Adding a finely divided Cu/ZnO catalyst at constant temperature',
        },
        {
          id: 'D',
          text: 'Decreasing the temperature at constant pressure',
        },
      ],
      correctOptionId: 'A',
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Decreasing volume increases gas concentration/collision frequency (increasing forward rate) and shifts equilibrium toward the side with fewer moles of gas (3 mol gas -> 1 mol gas, increasing CH3OH yield).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Check Rate Effect',
          explanationMarkdown:
            'Decreasing volume increases concentration of gaseous reactants, increasing collision frequency and reaction rate (eliminating D, which decreases rate).',
        },
        {
          stepNumber: 2,
          title: 'Check Equilibrium Shift (Le Chatelier)',
          explanationMarkdown:
            'The reactant side has $1 + 2 = 3\\text{ mol}$ of gas while the product side has $1\\text{ mol}$ of gas. Higher pressure shifts equilibrium to the right, increasing methanol yield (Option A).',
        },
      ],
      commonPitfalls: [
        'Selecting D (decreasing temperature increases exothermic yield, but DECREASES reaction rate!).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'chem-r3-q005',
      subjectSlug: 'chem',
      topicId: 'chem-R3.1',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Distinguish',
      stemMarkdown:
        'Two unlabeled beakers contain $25.0\\text{ cm}^3$ of $0.10\\text{ mol dm}^{-3}$ hydrochloric acid ($\\text{HCl}$) and $25.0\\text{ cm}^3$ of $0.10\\text{ mol dm}^{-3}$ ethanoic acid ($\\text{CH}_3\\text{COOH}$). Describe **two** experimental methods to distinguish between the solutions, and state why titrating with $0.10\\text{ mol dm}^{-3}\\ \\text{NaOH}$ to the endpoint volume alone cannot distinguish them.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'HCl is a strong acid (completely dissociated) while CH3COOH is a weak acid (partially dissociated), so HCl has a higher [H+] concentration.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Method 1 (pH measurement): HCl has pH = 1.0, whereas 0.10 mol dm-3 CH3COOH has a higher pH (approximately 2.9).',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Method 2 (Conductivity or Rate with Mg/CaCO3): HCl exhibits higher electrical conductivity (more mobile ions) or faster effervescence with Mg/CaCO3.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Both beakers contain the same total number of moles of monoprotic acid (n = cV = 0.00250 mol), so both require the exact same volume (25.0 cm3) of 0.10 mol dm-3 NaOH for complete neutralization.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Contrast Degree of Ionization ($[\\text{H}^+]$)',
          explanationMarkdown:
            'In $0.10\\text{ M}\\ \\text{HCl}$, $[\\text{H}^+] = 0.10\\text{ M}$ ($\\text{pH} = 1.0$). In $0.10\\text{ M}\\ \\text{CH}_3\\text{COOH}$, $<2\\%$ ionizes ($\\text{pH} \\approx 2.9$), giving lower electrical conductivity and slower reaction rate with $\\text{Mg}$.',
        },
        {
          stepNumber: 2,
          title: 'Explain Equal Equivalence Volume',
          explanationMarkdown:
            'As $\\text{OH}^-$ reacts with $\\text{H}^+$, weak acid equilibrium shifts right ($\\text{CH}_3\\text{COOH} \\rightleftharpoons \\text{CH}_3\\text{COO}^- + \\text{H}^+$) until all $n = cV = 2.50 \\times 10^{-3}\\text{ mol}$ of acid are neutralized.',
        },
      ],
      commonPitfalls: [
        'Claiming a strong acid requires a larger volume of NaOH to neutralize than an equimolar weak acid.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'chem-s1-q006',
      subjectSlug: 'chem',
      topicId: 'chem-S1.4',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 3,
      commandTerm: 'Calculate',
      stemMarkdown:
        'A sample of an ideal gas occupies $450\\text{ cm}^3$ at $27.0\\ ^\\circ\\text{C}$ and $105\\text{ kPa}$. Calculate the amount, in $\\text{mol}$, of gas present ($R = 8.31\\text{ J K}^{-1}\\text{ mol}^{-1}$).',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Correct unit conversions: V = 0.450 dm3 (or 4.50 x 10^-4 m3) and T = 27.0 + 273.15 = 300.15 K (accept 300 K).',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Rearrangement and substitution into PV = nRT: n = (105 x 0.450) / (8.31 x 300.15).',
          marks: 1,
        },
        {
          pointId: 'A1',
          requirement:
            'n = 0.0189 mol (or 1.89 x 10^-2 mol) to 3 significant figures (accept 0.0190 mol if T = 300 K used).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Convert Volume and Temperature to Compatible Units',
          explanationMarkdown:
            'Convert $450\\text{ cm}^3 \\div 1000 = 0.450\\text{ dm}^3$ (to pair with $P = 105\\text{ kPa}$) and $T = 27.0 + 273.15 = 300.15\\text{ K}$.',
        },
        {
          stepNumber: 2,
          title: 'Solve for Moles $n = \\frac{PV}{RT}$',
          explanationMarkdown:
            '$$n = \\frac{105 \\times 0.450}{8.31 \\times 300.15} = 0.0189\\text{ mol}$$',
        },
      ],
      commonPitfalls: [
        'Substituting T = 27 °C directly without adding 273.15 to convert to Kelvin.',
        'Substituting V = 450 cm3 with P = 105 kPa without dividing volume by 1000.',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'chem-ref-constants',
      subjectSlug: 'chem',
      toolType: 'data_booklet',
      category: 'Section 1 & 2',
      title: 'Physical Constants & Core SL Equations',
      codeOrSymbol: 'R = 8.31',
      payload: {
        constants: [
          {
            symbol: 'N_A',
            name: 'Avogadro’s constant',
            value: '6.02 x 10^23 mol-1',
          },
          { symbol: 'R', name: 'Gas constant', value: '8.31 J K-1 mol-1' },
          {
            symbol: 'V_m',
            name: 'Molar volume of ideal gas at STP (273.15 K, 100 kPa)',
            value: '22.7 dm3 mol-1',
          },
          {
            symbol: 'c',
            name: 'Specific heat capacity of water',
            value: '4.18 kJ kg-1 K-1 (4.18 J g-1 K-1)',
          },
          {
            symbol: 'K_w',
            name: 'Ionic product constant of water at 298 K',
            value: '1.00 x 10^-14 mol2 dm-6',
          },
        ],
      },
    },
    {
      id: 'chem-ref-functional-groups',
      subjectSlug: 'chem',
      toolType: 'data_booklet',
      category: 'Structure 3.2',
      title: 'Organic Functional Groups & Homologous Series (SL)',
      codeOrSymbol: 'S3.2',
      payload: {
        functionalGroups: [
          {
            group: 'Hydroxyl (Alcohol)',
            formula: 'R–OH',
            homologousFormula: 'CnH2n+1OH',
            example: 'Ethanol (CH3CH2OH)',
          },
          {
            group: 'Carbonyl (Aldehyde / Ketone)',
            formula: 'R–CHO / R–CO–R′',
            homologousFormula: 'CnH2nO',
            example: 'Propanal / Propanone',
          },
          {
            group: 'Carboxyl (Carboxylic Acid)',
            formula: 'R–COOH',
            homologousFormula: 'CnH2nO2',
            example: 'Ethanoic acid (CH3COOH)',
          },
          {
            group: 'Ester & Alkoxy (Ether)',
            formula: 'R–COO–R′ / R–O–R′',
            homologousFormula: 'CnH2nO2 / CnH2n+2O',
            example: 'Methyl ethanoate / Methoxyethane',
          },
          {
            group: 'Amino / Amido / Halogeno / Phenyl',
            formula: '–NH2 / –CONH2 / –X / –C6H5',
            homologousFormula: 'CnH2n+3N / CnH2n+1NO / CnH2n+1X',
            example: 'Ethanamine / Ethanamide / Chloroethane',
          },
        ],
      },
    },
    {
      id: 'chem-ref-calc-drills',
      subjectSlug: 'chem',
      toolType: 'calc_checker',
      category: 'Stoichiometry & Energetics',
      title: 'SL Calculation Step Checker Reference',
      codeOrSymbol: 'q = mcΔT',
      payload: {
        rules: [
          'Always match significant figures of final answer to the least precise input measurement.',
          'Include negative sign for exothermic ΔH and positive sign for endothermic ΔH.',
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'chem-deck-structure',
      subjectSlug: 'chem',
      topicId: 'chem-S2.2',
      title: 'SL Structure 1–3: VSEPR, Bonding, Periodicity & Organic',
      description:
        'VSEPR angles, intermolecular forces, Period 3 trends, and organic functional groups.',
      cards: [
        {
          id: 'chem-card-1',
          frontMarkdown:
            'State the electron domain geometry, molecular shape, and bond angle of **$\\text{SO}_2$** (`S2.2`).',
          backMarkdown:
            '- **Electron domains:** $3$ ($2$ bonding domains, $1$ lone pair)\n- **Electron domain geometry:** Trigonal planar\n- **Molecular shape:** **Bent (V-shaped)**\n- **Bond angle:** $\\approx 117^\\circ$ (accept $115^\\circ–119^\\circ$)',
          tags: ['Structure 2', 'VSEPR'],
        },
        {
          id: 'chem-card-2',
          frontMarkdown:
            'Explain why atomic radius **decreases** across Period 3 ($\\text{Na} \\to \\text{Cl}$) and **increases** down Group 1 (`S3.1`).',
          backMarkdown:
            '- **Across Period 3:** Nuclear charge increases while valence electrons occupy the same main energy level ($n=3$), so shielding stays similar and higher effective nuclear charge pulls electrons closer.\n- **Down Group 1:** Additional occupied energy levels ($n$ increases) increase shielding and distance from the nucleus.',
          tags: ['Structure 3', 'Periodicity'],
        },
        {
          id: 'chem-card-3',
          frontMarkdown:
            'Write balanced equations for the reactions of **$\\text{Na}_2\\text{O}$** and **$\\text{SO}_3$** with water (`S3.1`).',
          backMarkdown:
            '- Basic oxide: $$\\text{Na}_2\\text{O}(\\text{s}) + \\text{H}_2\\text{O}(\\text{l}) \\to 2\\text{NaOH}(\\text{aq})$$\n- Acidic oxide: $$\\text{SO}_3(\\text{g}) + \\text{H}_2\\text{O}(\\text{l}) \\to \\text{H}_2\\text{SO}_4(\\text{aq})$$',
          tags: ['Structure 3', 'Oxides'],
        },
        {
          id: 'chem-card-4',
          frontMarkdown:
            'Compare the products and experimental conditions when oxidizing a **primary ($1^\\circ$)**, **secondary ($2^\\circ$)**, and **tertiary ($3^\\circ$) alcohol** (`R3.2`).',
          backMarkdown:
            '- **$1^\\circ$ alcohol:** Distillation gives an **aldehyde**; heating under **reflux** oxidizes further to a **carboxylic acid**.\n- **$2^\\circ$ alcohol:** Heating under reflux gives a **ketone**.\n- **$3^\\circ$ alcohol:** **No oxidation** (lacks a $\\text{C–H}$ bond on the carbon bearing $-\\text{OH}$).',
          tags: ['Structure 3', 'Organic'],
        },
      ],
    },
    {
      id: 'chem-deck-reactivity',
      subjectSlug: 'chem',
      topicId: 'chem-R1.1',
      title: 'SL Reactivity 1–3: Energetics, Kinetics, Equilibrium, Acids & Redox',
      description:
        'Hess’s law, Maxwell–Boltzmann curves, Kc rules, strong vs weak acids, and electrochemical cell polarity.',
      cards: [
        {
          id: 'chem-card-5',
          frontMarkdown:
            'State the formula for calculating $\\Delta H^\\ominus$ from **average bond enthalpies** and the two rules for **Hess’s Law** step cycles (`R1.2`).',
          backMarkdown:
            '- **Bond Enthalpies (gaseous state):** $$\\Delta H^\\ominus = \\sum E(\\text{bonds broken}) - \\sum E(\\text{bonds formed})$$\n- **Hess’s Law:** $\\Delta H_{\\text{overall}} = \\sum \\Delta H_{\\text{steps}}$ — reversing a step **flips the sign** of $\\Delta H$, and multiplying coefficients by $k$ **multiplies $\\Delta H$ by $k$**.',
          tags: ['Reactivity 1', 'Energetics'],
        },
        {
          id: 'chem-card-6',
          frontMarkdown:
            'Which factors affect the numerical value of the equilibrium constant **$K_c$** (`R2.3`)?',
          backMarkdown:
            '**ONLY temperature** changes the numerical value of $K_c$. Changes in concentration, pressure/volume, or adding a catalyst never change $K_c$.',
          tags: ['Reactivity 2', 'Equilibrium'],
        },
        {
          id: 'chem-card-7',
          frontMarkdown:
            'Compare the anode and cathode signs and reactions in a **voltaic cell** vs an **electrolytic cell** (`R3.2`).',
          backMarkdown:
            '- **Both cells:** Oxidation at the **Anode**, Reduction at the **Cathode**.\n- **Voltaic (spontaneous):** Anode is **negative ($-$)**, Cathode is **positive ($+$)**.\n- **Electrolytic (non-spontaneous):** Anode is **positive ($+$)**, Cathode is **negative ($-$)**.',
          tags: ['Reactivity 3', 'Redox'],
        },
        {
          id: 'chem-card-8',
          frontMarkdown:
            'What is the conjugate base of $\\text{H}_2\\text{PO}_4^-$ and the conjugate acid of $\\text{H}_2\\text{PO}_4^-$ (`R3.1`)?',
          backMarkdown:
            '- **Conjugate base** (remove one $\\text{H}^+$): **$\\text{HPO}_4^{2-}$**\n- **Conjugate acid** (add one $\\text{H}^+$): **$\\text{H}_3\\text{PO}_4$**\n*(Because $\\text{H}_2\\text{PO}_4^-$ can do both, it is **amphiprotic**.)*',
          tags: ['Reactivity 3', 'Acids'],
        },
      ],
    },
  ],
};
