import type { SubjectPack } from '../schemas';

export const biologyHlPack: SubjectPack = {
  subject: {
    slug: 'bio',
    name: 'Biology',
    level: 'HL',
    syllabusFirstAssessment: '2025',
    themeTokens: {
      wash1: 'rgba(167,243,208,0.55)',
      wash2: 'rgba(186,230,253,0.45)',
      wash3: 'rgba(240,253,244,0.6)',
      accent: '#059669',
      soft: '#F0FDF4',
      cardGradient: 'linear-gradient(135deg,#1D6E45,#49AD78)',
    },
    iaConfig: {
      iaLabel: 'Biology IA',
      iaTitle: 'Scientific Investigation',
      maxMarks: 24,
      wordOrTimeLimit: '3,000 words max',
      weightPercent: 20,
      steps: ['Choose focus', 'Set research question', 'Draft & AI review'],
      criteria: [
        {
          code: 'Criterion A',
          name: 'Research Design',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Formulate a focused research question with independent/dependent variables, controlled variables, and replicated methodology.',
          topBandExpectations: [
            'Research question names the organism (binomial nomenclature), exact IV levels (min 5 increments x 5 repeats), and measurable DV with units.',
            'Explains how and why each controlled variable is held constant.',
          ],
          commonPitfalls: [
            'Failing to justify the biological mechanism linking the IV and DV.',
            'Using fewer than 5 repeats per treatment condition for standard deviation / ANOVA.',
          ],
        },
        {
          code: 'Criterion B',
          name: 'Data Analysis',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Record raw and processed data with uncertainties, propagation, error bars, and appropriate statistical tests.',
          topBandExpectations: [
            'All raw data tables include instrument precision uncertainties (e.g., ±0.05 cm3).',
            'Appropriate inferential statistical test (t-test, ANOVA, Pearson r, or Chi-squared) is calculated and interpreted with p-values.',
          ],
          commonPitfalls: [
            'Plotting raw trial values instead of mean values with standard deviation error bars.',
          ],
        },
        {
          code: 'Criterion C',
          name: 'Conclusion',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Justify a conclusion directly from processed data and compare findings against peer-reviewed biological literature.',
          topBandExpectations: [
            'Directly references overlap of error bars and p-value threshold (p < 0.05) to accept or reject the null hypothesis.',
            'Compares experimental trends with published enzyme kinetics or physiological values.',
          ],
          commonPitfalls: [
            'Claiming a hypothesis is "proven" rather than "supported by the data".',
          ],
        },
        {
          code: 'Criterion D',
          name: 'Evaluation',
          maxMarks: 6,
          weightPercent: 25,
          summary:
            'Evaluate specific methodological weaknesses (systematic vs random error), their directional impact on data, and realistic improvements.',
          topBandExpectations: [
            'Distinguishes systematic errors from random variation and explains the direction of bias on the measured rate.',
            'Proposes concrete equipment/protocol modifications rather than "be more careful".',
          ],
          commonPitfalls: [
            'Listing human error or calculation mistakes as methodological limitations.',
          ],
        },
      ],
      exemplarTitle:
        'Effect of Sodium Bicarbonate Concentration on Photosynthetic Oxygen Evolution in Elodea canadensis',
      exemplarResearchQuestion:
        'How does increasing aqueous sodium bicarbonate (NaHCO3) concentration (0.0%, 0.2%, 0.4%, 0.6%, 0.8%, 1.0% w/v) affect the rate of oxygen production (mm3 min-1 ± 0.5 mm3) in Elodea canadensis shoots at 25.0 °C?',
      exemplarScore: '22 / 24 (Grade 7)',
      exemplarSections: [
        {
          sectionTitle: 'Research Design & Controlled Variables',
          excerptMarkdown:
            'Dissolved $\\text{HCO}_3^-$ acts as a carbon source for RuBisCO carboxylation of ribulose bisphosphate (RuBP) in the Calvin cycle. Temperature was maintained at $25.0 \\pm 0.2\\ ^\\circ\\text{C}$ using a thermostatically controlled water bath to prevent thermal denaturation of thylakoid ATP synthase.',
          examinerCommentary:
            'Criterion A (6/6): Explicitly connects the IV to the 2025 C1.3 Calvin cycle mechanism and justifies temperature control.',
          criterionRef: 'Criterion A',
        },
        {
          sectionTitle: 'Statistical Processing & Plateau Interpretation',
          excerptMarkdown:
            'Between $0.0\\%$ and $0.6\\%\\ \\text{NaHCO}_3$, mean $\\text{O}_2$ evolution rose linearly from $1.2 \\pm 0.3$ to $8.4 \\pm 0.5\\ \\text{mm}^3\\text{ min}^{-1}$ ($p = 0.0014$, one-way ANOVA). Above $0.8\\%$, the rate plateaued ($8.5 \\pm 0.6\\ \\text{mm}^3\\text{ min}^{-1}$) as light intensity ($5,000\\text{ lux}$) and RuBisCO active site saturation became rate-limiting.',
          examinerCommentary:
            'Criterion B & C (11/12): Integrates standard deviation, ANOVA p-value, and limiting factor biochemistry.',
          criterionRef: 'Criterion C',
        },
      ],
    },
    spotlight: {
      title: 'Biology HL Lab & Syllabus Focus',
      pills: [
        { label: '2025 Syllabus (Themes A–D)', href: '/subjects/bio?tab=topics' },
        { label: '20% IA Lab Weight', href: '/coursework?subject=bio' },
        { label: '44% Paper 2 Essays', href: '/questions?subject=bio&paper=Paper+2' },
        { label: 'Cell & Pathway Diagrams', href: '/tools/bio-visualizations' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description: 'Paper 1A/1B & Paper 2 Themes A–D questions & markschemes',
        bgHex: '#EFF6FF',
        colorHex: '#2563EB',
        href: '/questions?subject=bio',
        iconName: 'questionbank',
      },
      {
        title: 'Visualizations',
        description: 'Interactive cellular, membrane & metabolic pathway models',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/tools/bio-visualizations',
        iconName: 'visualizations',
      },
      {
        title: 'Blurting',
        description: 'Blank-page recall on processes (e.g. chemiosmosis)',
        bgHex: '#F5F3FF',
        colorHex: '#7C3AED',
        href: '/tools/blurting?subject=bio',
        iconName: 'blurting',
      },
      {
        title: 'Teach Sprout',
        description: 'Explain biological mechanisms step-by-step to Sprout',
        bgHex: '#F0FDF4',
        colorHex: '#16A34A',
        href: '/tools/teach-sprout?subject=bio',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Custom timed SL/HL mock builder',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/questions?subject=bio&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Redo missed markscheme terminology',
        bgHex: '#FEF2F2',
        colorHex: '#DC2626',
        href: '/questions?subject=bio&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'Study Guide',
        description: 'Bite-sized notes across Unity, Form, Continuity & Interaction',
        bgHex: '#FEF9C3',
        colorHex: '#CA8A04',
        href: '/study-guides?subject=bio',
        iconName: 'study_guide',
      },
      {
        title: 'Flashcards',
        description: 'Active recall for organelles, enzymes & HL genetics',
        bgHex: '#E0F2FE',
        colorHex: '#0284C7',
        href: '/flashcards?subject=bio',
        iconName: 'flashcards',
      },
      {
        title: 'Cheatsheets',
        description: 'High-yield experimental variables & graph rules',
        bgHex: '#DCFCE7',
        colorHex: '#16A34A',
        href: '/cheatsheets?subject=bio',
        iconName: 'cheatsheets',
      },
      {
        title: 'AI Essay & IA Studio',
        description: 'Check IA raw data analysis, uncertainty & evaluation',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/essay-studio?subject=bio',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'bio-A1.1',
      subjectSlug: 'bio',
      unitCode: 'Theme A',
      unitTitle: 'Unity and Diversity',
      code: 'A1.1',
      title: 'Water',
      levelScope: 'HL Extension',
      recommendedHours: 5,
      guidingQuestions: [
        'What physical and chemical properties of water make it essential for life?',
        'How do intermolecular hydrogen bonds explain cohesion, adhesion, and thermal stability?',
      ],
      understandings: [
        {
          code: 'A1.1.1',
          text: 'Water as the medium for life, originating in the earliest cells surrounded by hydrophilic membrane heads.',
          isHL: false,
        },
        {
          code: 'A1.1.2',
          text: 'Hydrogen bonds as a consequence of polar covalent O–H bonds (δ- oxygen and δ+ hydrogen).',
          isHL: false,
        },
        {
          code: 'A1.1.7',
          text: 'Extraplanetary origin of water on Earth via asteroidal delivery and retention within the Goldilocks zone.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Water ($\\text{H}_2\\text{O}$) exhibits **polar covalent bonding** due to oxygen’s high electronegativity, generating a partial negative charge ($\\delta^-$) on oxygen and partial positive charges ($\\delta^+$) on hydrogen atoms. Transient **hydrogen bonds** between adjacent molecules yield four emergent biological properties:\n\n1. **Cohesion:** Hydrogen bonding between water molecules enables continuous transpiration pull under negative tension in xylem vessels.\n2. **Adhesion:** Attraction between polar water molecules and hydrophilic cellulose cell walls prevents cavitation and drives capillary action.\n3. **High Specific Heat Capacity ($4.18\\text{ J g}^{-1}\\text{ K}^{-1}$):** Large thermal energy input is required to break hydrogen bonds, buffering aquatic habitats and blood plasma against rapid temperature swings.\n4. **High Latent Heat of Vaporization:** Evaporative cooling via sweat or stomatal transpiration removes substantial heat with minimal water loss.',
      cheatsheetMarkdown:
        '**Markscheme Terminology Rules (A1.1):**\n- Always write **polar covalent bond** *within* a water molecule and **hydrogen bond** *between* water molecules.\n- Cohesion = water to water (xylem tension + surface tension).\n- Adhesion = water to polar/hydrophilic surfaces (cellulose cell walls).',
      blurtChecklist: [
        'Unequal sharing of electrons in O–H polar covalent bond creates δ- on O and δ+ on H',
        'Hydrogen bonds form between δ- oxygen of one molecule and δ+ hydrogen of another',
        'Cohesion maintains continuous water column under tension in xylem',
        'Adhesion attracts water to hydrophilic cellulose walls preventing column breakage',
        'High specific heat capacity buffers temperature changes in cells and aquatic habitats',
      ],
    },
    {
      id: 'bio-A1.2',
      subjectSlug: 'bio',
      unitCode: 'Theme A',
      unitTitle: 'Unity and Diversity',
      code: 'A1.2',
      title: 'Nucleic Acids',
      levelScope: 'HL Extension',
      recommendedHours: 6,
      guidingQuestions: [
        'How does the structure of DNA and RNA allow accurate storage and transmission of genetic information?',
      ],
      understandings: [
        {
          code: 'A1.2.1',
          text: 'DNA as the universal genetic material across all living organisms.',
          isHL: false,
        },
        {
          code: 'A1.2.6',
          text: 'Complementary base pairing (A–T with 2 H-bonds; C–G with 3 H-bonds) and antiparallel 5’ to 3’ strands.',
          isHL: false,
        },
        {
          code: 'A1.2.11',
          text: 'Directionality of DNA and RNA (5’ phosphate to 3’ hydroxyl) in replication, transcription, and translation.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Nucleotides consist of a **pentose sugar** (deoxyribose in DNA, ribose with a $2\'-\\text{OH}$ group in RNA), a **phosphate group** at $C5\'$, and a **nitrogenous base** attached to $C1\'$. Nucleotides polymerize via condensation reactions forming strong covalent **phosphodiester bonds** between the $3\'-\\text{OH}$ of one sugar and the $5\'$ phosphate of the next.\n\n**HL Extension:** Purines (**Adenine**, **Guanine** — double ring) always pair with pyrimidines (**Thymine/Uracil**, **Cytosine** — single ring) to maintain uniform helix diameter ($2\\text{ nm}$). **Nucleosomes** consist of DNA wrapped around an octamer of positively charged **histone** proteins (two each of H2A, H2B, H3, H4) stabilized by an H1 linker histone, supercoiling DNA and regulating promoter accessibility.',
      cheatsheetMarkdown:
        '- **Phosphodiester bond:** Covalent bond linking $C3\'$ of one pentose to $C5\'$ phosphate of the next.\n- **Purines (2 rings):** A, G · **Pyrimidines (1 ring):** C, T, U.\n- **Hershey–Chase Experiment:** $^{32}\\text{P}$ labeled viral DNA (entered pellet); $^{35}\\text{S}$ labeled protein coat (remained in supernatant).',
      blurtChecklist: [
        'Nucleotide = pentose sugar + phosphate group at C5’ + nitrogenous base at C1’',
        'Condensation forms covalent phosphodiester bonds between 3’-OH and 5’-phosphate',
        'Antiparallel strands run 5’ to 3’ in opposite directions',
        'A pairs with T (2 hydrogen bonds); G pairs with C (3 hydrogen bonds)',
        'HL: Nucleosome = DNA wrapped around octamer of 8 histone proteins + H1 linker',
      ],
    },
    {
      id: 'bio-B1.2',
      subjectSlug: 'bio',
      unitCode: 'Theme B',
      unitTitle: 'Form and Function',
      code: 'B1.2',
      title: 'Proteins',
      levelScope: 'HL Extension',
      recommendedHours: 5,
      guidingQuestions: [
        'How does the sequence of amino acids determine the 3D conformation and biological function of a protein?',
      ],
      understandings: [
        {
          code: 'B1.2.1',
          text: 'Generalized structure of an amino acid (central alpha-carbon, amine group, carboxyl group, and variable R-group).',
          isHL: false,
        },
        {
          code: 'B1.2.6',
          text: 'Primary, secondary (alpha-helix, beta-pleated sheet), tertiary, and quaternary structure of proteins.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Twenty standard amino acids link via **condensation reactions** on ribosomes to form covalent **peptide bonds** ($-\\text{CO}-\\text{NH}-$). Protein conformation hierarchy (HL):\n- **Primary ($1^\\circ$):** Linear sequence of amino acids linked by peptide bonds.\n- **Secondary ($2^\\circ$):** Regular folding into $\\alpha$-helices and $\\beta$-pleated sheets stabilized by hydrogen bonds between backbone carbonyl ($\\text{C=O}$) and amine ($\\text{N-H}$) groups.\n- **Tertiary ($3^\\circ$):** Globular 3D folding driven by interactions between **R-groups**: hydrophobic interactions, hydrogen bonds, ionic bonds, and covalent **disulfide bridges** ($-\\text{S}-\\text{S}-$ between cysteine residues).\n- **Quaternary ($4^\\circ$):** Assembly of multiple polypeptide subunits, either **conjugated** (hemoglobin with 4 polypeptides + 4 non-protein heme prosthetic groups) or **non-conjugated** (collagen, insulin).',
      cheatsheetMarkdown:
        '- **Denaturation:** Heat or extreme pH disrupts H-bonds and ionic bonds in tertiary structure, altering active site shape.\n- **Globular (Rubisco, Insulin):** Water-soluble, hydrophilic R-groups outside.\n- **Fibrous (Collagen):** Insoluble, structural tensile strength.',
      blurtChecklist: [
        'Condensation between amine (-NH2) and carboxyl (-COOH) forms peptide bond + water',
        'Secondary structure (alpha-helix / beta-sheet) stabilized by backbone H-bonds',
        'Tertiary 3D folding stabilized by R-group H-bonds, ionic bonds, disulfide bridges, and hydrophobic interactions',
        'Quaternary structure combines multiple polypeptides (e.g. hemoglobin with 4 subunits + heme prosthetic groups)',
      ],
    },
    {
      id: 'bio-B2.1',
      subjectSlug: 'bio',
      unitCode: 'Theme B',
      unitTitle: 'Form and Function',
      code: 'B2.1',
      title: 'Membranes and Membrane Transport',
      levelScope: 'HL Extension',
      recommendedHours: 6,
      guidingQuestions: [
        'How do cell membranes selectively regulate the movement of substances into and out of cells?',
      ],
      understandings: [
        {
          code: 'B2.1.1',
          text: 'Lipid bilayers as the basis of cell membranes due to amphipathic phospholipids.',
          isHL: false,
        },
        {
          code: 'B2.1.5',
          text: 'Simple diffusion, facilitated diffusion (channel/carrier proteins), osmosis (aquaporins), and active transport (ATP pumps).',
          isHL: false,
        },
        {
          code: 'B2.1.15',
          text: 'Sodium-potassium pump and potassium channels in axons as examples of primary active and facilitated transport.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Amphipathic phospholipids self-assemble into a continuous bilayer with **hydrophilic phosphate heads** facing aqueous cytoplasm/extracellular fluid and **hydrophobic hydrocarbon tails** forming an interior core impermeable to ions and polar molecules.\n\n**Transport Mechanisms:**\n- **Simple Diffusion:** Non-polar, small molecules ($\\text{O}_2$, $\\text{CO}_2$, steroid hormones) cross the hydrophobic core directly down their concentration gradient.\n- **Facilitated Diffusion:** Polar molecules (glucose) and ions ($\\text{Na}^+$, $\\text{K}^+$, $\\text{Cl}^-$) cross passively down their gradient via transmembrane channel or carrier proteins without ATP.\n- **Osmosis:** Net passive movement of water molecules across a partially permeable membrane from a region of **higher water potential** (lower solute concentration / hypotonic) to **lower water potential** (higher solute concentration / hypertonic), accelerated by **aquaporins**.\n- **Active Transport (HL):** Pumps solutes against their concentration gradient using ATP hydrolysis. The $\\text{Na}^+/\\text{K}^+$-ATPase pump extrudes **$3\\ \\text{Na}^+$ out** and imports **$2\\ \\text{K}^+$ in** per ATP hydrolyzed.',
      cheatsheetMarkdown:
        '- **Cholesterol in mammalian membranes:** Reduces fluidity at high temperatures (restricts phospholipid motion) and prevents crystallization at low temperatures.\n- **Na+/K+ Pump Cycle:** $3\\ \\text{Na}^+$ out, $2\\ \\text{K}^+$ in per ATP.',
      blurtChecklist: [
        'Amphipathic phospholipids have hydrophilic phosphate heads and hydrophobic fatty acid tails',
        'Hydrophobic core blocks ions and large polar molecules',
        'Facilitated diffusion uses specific channel or carrier proteins passively without ATP',
        'Osmosis moves water from hypotonic (low osmolarity) to hypertonic (high osmolarity) via aquaporins',
        'HL: Na+/K+ pump uses ATP phosphorylation to pump 3 Na+ out and 2 K+ into the axon',
      ],
    },
    {
      id: 'bio-C1.2',
      subjectSlug: 'bio',
      unitCode: 'Theme C',
      unitTitle: 'Interaction and Interdependence',
      code: 'C1.2',
      title: 'Cell Respiration',
      levelScope: 'HL Extension',
      recommendedHours: 6,
      guidingQuestions: [
        'How is chemical energy in organic substrates converted into usable ATP via redox reactions and chemiosmosis?',
      ],
      understandings: [
        {
          code: 'C1.2.1',
          text: 'ATP as the immediate energy currency of cells, synthesized from ADP and Pi.',
          isHL: false,
        },
        {
          code: 'C1.2.7',
          text: 'Role of NAD+ as a hydrogen/electron carrier in glycolysis, link reaction, and Krebs cycle.',
          isHL: true,
        },
        {
          code: 'C1.2.14',
          text: 'Chemiosmosis across the inner mitochondrial membrane cristae and Oxygen as the terminal electron acceptor.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Aerobic cell respiration oxidizes glucose through four sequential stages (HL):\n1. **Glycolysis (Cytoplasm):** Phosphorylation of glucose (2 ATP used) $\\to$ lysis into two triose phosphate molecules $\\to$ oxidation yielding **2 pyruvate**, **2 net ATP**, and **2 reduced NAD ($\\text{NADH} + \\text{H}^+$)**.\n2. **Link Reaction (Mitochondrial Matrix):** Pyruvate ($3\\text{C}$) undergoes **oxidative decarboxylation** (releasing $\\text{CO}_2$ and reducing $\\text{NAD}^+$) and combines with Coenzyme A to form **acetyl-CoA ($2\\text{C}$)**.\n3. **Krebs Cycle (Matrix):** Acetyl-CoA ($2\\text{C}$) condenses with oxaloacetate ($4\\text{C}$) to form citrate ($6\\text{C}$). Two decarboxylations and four oxidations per cycle yield **$2\\ \\text{CO}_2$**, **$3\\ \\text{NADH}$**, **$1\\ \\text{FADH}_2$**, and **$1\\ \\text{ATP}$** (per acetyl-CoA).\n4. **Oxidative Phosphorylation & Chemiosmosis (Cristae):** $\\text{NADH}$ and $\\text{FADH}_2$ donate electrons to the **electron transport chain (ETC)**. Energy released as electrons pass along complexes pumps protons ($\\text{H}^+$) from the matrix into the **intermembrane space**, generating a steep electrochemical proton gradient. Protons diffuse back into the matrix through **ATP synthase**, driving phosphorylation of $\\text{ADP} + \\text{P}_i \\to \\text{ATP}$. **Oxygen** acts as the terminal electron acceptor ($\\frac{1}{2}\\text{O}_2 + 2e^- + 2\\text{H}^+ \\to \\text{H}_2\\text{O}$).',
      cheatsheetMarkdown:
        '- **Oxidation:** Loss of electrons/hydrogen, gain of oxygen.\n- **Reduction:** Gain of electrons/hydrogen, loss of oxygen.\n- **Why cristae are folded:** Increases surface area for ETC complexes and ATP synthase.\n- **Small intermembrane space volume:** Allows rapid buildup of high $[\\text{H}^+]$ proton motive force.',
      blurtChecklist: [
        'Glycolysis in cytoplasm converts glucose to 2 pyruvate + 2 net ATP + 2 NADH',
        'Link reaction in matrix decarboxylates and oxidizes pyruvate to Acetyl-CoA (2C) + CO2 + NADH',
        'Krebs cycle oxidizes Acetyl-CoA yielding 3 NADH, 1 FADH2, 1 ATP, and 2 CO2 per turn',
        'ETC pumps H+ from matrix to narrow intermembrane space creating electrochemical gradient',
        'H+ flows down gradient through ATP synthase (chemiosmosis) while O2 accepts electrons to form H2O',
      ],
    },
    {
      id: 'bio-C1.3',
      subjectSlug: 'bio',
      unitCode: 'Theme C',
      unitTitle: 'Interaction and Interdependence',
      code: 'C1.3',
      title: 'Photosynthesis',
      levelScope: 'HL Extension',
      recommendedHours: 6,
      guidingQuestions: [
        'How do photosynthetic organisms transduce light energy into chemical energy and fix inorganic carbon?',
      ],
      understandings: [
        {
          code: 'C1.3.1',
          text: 'Transformation of light energy to chemical energy when carbon compounds are produced in chloroplasts.',
          isHL: false,
        },
        {
          code: 'C1.3.9',
          text: 'Light-dependent reactions: photoactivation of Photosystem II, photolysis of water, chemiosmosis, and reduction of NADP+.',
          isHL: true,
        },
        {
          code: 'C1.3.15',
          text: 'Light-independent reactions (Calvin cycle): carboxylation of RuBP by RuBisCO, reduction of glycerate-3-phosphate to triose phosphate, and regeneration of RuBP.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        '**Light-Dependent Reactions (Thylakoid Membrane & Lumen — HL):**\n1. Photons excite electrons in the reaction center of **Photosystem II (PSII, P680)**. **Photolysis of water** ($\\text{H}_2\\text{O} \\to 2\\text{H}^+ + 2e^- + \\frac{1}{2}\\text{O}_2$) replaces the excited electrons and releases $\\text{O}_2$.\n2. Electrons pass via plastoquinone along the thylakoid ETC to the cytochrome complex, pumping $\\text{H}^+$ from the stroma into the **thylakoid lumen**. **Photophosphorylation** occurs as $\\text{H}^+$ diffuses back to the stroma through **ATP synthase**.\n3. **Photosystem I (PSI, P700)** re-excites electrons via ferredoxin and **NADP reductase** to reduce $\\text{NADP}^+ + \\text{H}^+ \\to \\text{NADPH}$.\n\n**Light-Independent Reactions / Calvin Cycle (Stroma — HL):**\n1. **Carbon Fixation:** **RuBisCO** catalyzes carboxylation of **ribulose bisphosphate (RuBP, $5\\text{C}$)** with $\\text{CO}_2$, forming an unstable $6\\text{C}$ intermediate that splits into two molecules of **glycerate-3-phosphate (GP / 3-PGA, $3\\text{C}$)**.\n2. **Reduction:** GP is phosphorylated by **ATP** and reduced by **NADPH** into **triose phosphate (TP / G3P, $3\\text{C}$)**.\n3. **Regeneration:** Out of every $6\\text{ TP}$ molecules formed, $1\\text{ TP}$ exits to synthesize glucose/starch, while $5\\text{ TP}$ molecules use **ATP** to regenerate $3\\text{ RuBP}$ molecules.',
      cheatsheetMarkdown:
        '- **Action Spectrum vs Absorption Spectrum:** Action spectrum shows rate of photosynthesis vs wavelength; absorption spectrum shows % light absorbed by chlorophyll $a/b$ and carotenoids.\n- **In Darkness:** Light-dependent stops $\\to$ ATP & NADPH drop $\\to$ **GP accumulates** and **RuBP falls**.\n- **Low $\\text{CO}_2$:** Carboxylation stops $\\to$ **RuBP accumulates** and **GP falls**.',
      blurtChecklist: [
        'PSII photoactivation and photolysis of water produce O2, electrons, and H+ in thylakoid lumen',
        'Thylakoid ETC pumps H+ into lumen driving photophosphorylation of ATP via ATP synthase',
        'PSI reduces NADP+ to NADPH in the stroma using ferredoxin',
        'RuBisCO fixes CO2 onto RuBP (5C) producing two molecules of GP (3C)',
        'ATP and NADPH reduce GP into Triose Phosphate (TP); 5 of every 6 TP regenerate RuBP',
      ],
    },
    {
      id: 'bio-D1.1',
      subjectSlug: 'bio',
      unitCode: 'Theme D',
      unitTitle: 'Continuity and Change',
      code: 'D1.1',
      title: 'DNA Replication',
      levelScope: 'HL Extension',
      recommendedHours: 5,
      guidingQuestions: [
        'How is DNA replicated semi-conservatively with high fidelity prior to cell division?',
      ],
      understandings: [
        {
          code: 'D1.1.2',
          text: 'Semi-conservative DNA replication driven by complementary base pairing (Meselson and Stahl 15N/14N proof).',
          isHL: false,
        },
        {
          code: 'D1.1.6',
          text: 'Directionality of DNA polymerase III (5’ to 3’ synthesis), continuous leading strand vs discontinuous Okazaki fragments on the lagging strand.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        'Semi-conservative replication ensures each daughter DNA molecule contains one parental template strand and one newly synthesized strand (**Meselson–Stahl** $^{15}\\text{N}/^{14}\\text{N}$ CsCl density gradient centrifugation).\n\n**HL Replication Fork Enzyme Suite:**\n1. **DNA Gyrase / Topoisomerase:** Relieves torsional strain and supercoiling ahead of the replication fork.\n2. **DNA Helicase:** Unwinds the double helix and breaks hydrogen bonds between complementary bases.\n3. **Single-Stranded Binding Proteins (SSBs):** Stabilize separated template strands and prevent re-annealing.\n4. **RNA Primase:** Synthesizes a short RNA primer providing a free $3\'-\\text{OH}$ group.\n5. **DNA Polymerase III:** Adds deoxynucleoside triphosphates (dNTPs) in the **$5\' \\to 3\'$ direction**, synthesizing the **leading strand** continuously toward the fork and the **lagging strand** discontinuously away from the fork as **Okazaki fragments**.\n6. **DNA Polymerase I:** Excises RNA primers and replaces them with DNA nucleotides.\n7. **DNA Ligase:** Seals nicks in the sugar-phosphate backbone by catalyzing covalent phosphodiester bonds between Okazaki fragments.',
      cheatsheetMarkdown:
        '- **PCR (Polymerase Chain Reaction):** Denaturation ($95\\ ^\\circ\\text{C}$) $\\to$ Primer Annealing ($55\\ ^\\circ\\text{C}$) $\\to$ Elongation by thermostable *Taq* DNA polymerase ($72\\ ^\\circ\\text{C}$).\n- **Leading vs Lagging:** DNA Pol III can ONLY add nucleotides to the $3\'-\\text{OH}$ end ($5\' \\to 3\'$).',
      blurtChecklist: [
        'Helicase breaks hydrogen bonds between bases while DNA gyrase relieves supercoiling',
        'RNA primase lays down short RNA primer with free 3’-OH group',
        'DNA Polymerase III synthesizes exclusively 5’ to 3’ (continuous leading strand, discontinuous Okazaki fragments on lagging strand)',
        'DNA Polymerase I removes RNA primers and replaces them with DNA nucleotides',
        'DNA Ligase forms covalent phosphodiester bonds joining Okazaki fragments',
      ],
    },
    {
      id: 'bio-D1.2',
      subjectSlug: 'bio',
      unitCode: 'Theme D',
      unitTitle: 'Continuity and Change',
      code: 'D1.2',
      title: 'Protein Synthesis (Transcription & Translation)',
      levelScope: 'HL Extension',
      recommendedHours: 6,
      guidingQuestions: [
        'How is the genetic code transcribed into mature mRNA and translated into polypeptides?',
      ],
      understandings: [
        {
          code: 'D1.2.1',
          text: 'Transcription of the template (antisense) DNA strand by RNA polymerase in the 5’ to 3’ direction.',
          isHL: false,
        },
        {
          code: 'D1.2.15',
          text: 'Post-transcriptional modification in eukaryotes: 5’ methyl cap, 3’ poly-A tail, and alternative splicing of introns and exons by spliceosomes.',
          isHL: true,
        },
      ],
      studyGuideMarkdown:
        '**Transcription (Nucleus):** **RNA Polymerase** binds to the **promoter** region, unwinds DNA, and reads the **template (antisense) strand** $3\' \\to 5\'$ to synthesize a complementary pre-mRNA transcript in the **$5\' \\to 3\'$ direction** (matching the coding/sense strand except $\\text{U}$ replaces $\\text{T}$).\n\n**HL Post-Transcriptional Modification (Eukaryotes):**\n- Addition of a $5\'$ methylated guanine cap and $3\'$ poly-A tail protects mRNA from exonuclease degradation and aids ribosome attachment.\n- **Spliceosomes** excise non-coding **introns** and splice together coding **exons**. **Alternative splicing** allows a single gene to produce multiple distinct protein isoforms.\n\n**Translation (Ribosome $80\\text{S}$):**\n- **tRNA-activating enzymes** attach each specific amino acid to the $3\'$ CCA stem of its cognate tRNA using ATP.\n- The ribosome binds mRNA at the start codon (**AUG = Methionine**). tRNAs cycle through the **A (Aminoacyl)**, **P (Peptidyl)**, and **E (Exit)** sites as peptide bonds form between amino acids until a stop codon (**UAA, UAG, UGA**) recruits a release factor.',
      cheatsheetMarkdown:
        '- **Template = Antisense strand** (transcribed by RNA Pol).\n- **Coding = Sense strand** (same base sequence as mRNA with T instead of U).\n- **Ribosome Sites (A $\\to$ P $\\to$ E):** **A**minoacyl (entry), **P**eptidyl (peptide bond translocation), **E**xit (deacylated tRNA leaves).',
      blurtChecklist: [
        'RNA polymerase binds promoter and transcribes template (antisense) DNA strand 5’ to 3’',
        'Eukaryotic pre-mRNA receives 5’ cap, 3’ poly-A tail, and spliceosome removal of introns',
        'Alternative exon splicing produces multiple polypeptides from a single gene',
        'tRNA-activating enzymes attach specific amino acids to tRNAs using ATP',
        'Ribosome A, P, and E sites coordinate codon-anticodon pairing from AUG start to stop codon',
      ],
    },
  ],
  questions: [
    {
      id: 'bio-c1-q001',
      subjectSlug: 'bio',
      topicId: 'bio-C1.2',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'allowed',
      difficulty: 'challenging',
      marks: 7,
      commandTerm: 'Explain',
      stemMarkdown:
        'Explain how the structure of the mitochondrion is adapted for the production of ATP by aerobic cell respiration, including the mechanism of chemiosmosis.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Inner mitochondrial membrane is folded into cristae, providing a large surface area for electron transport chain (ETC) proteins and ATP synthase.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Reduced NAD (NADH) and FADH2 from the Krebs cycle/matrix donate electrons to the electron transport chain on the inner mitochondrial membrane.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'As electrons pass along the ETC, energy is released and used by proton pumps to pump H+ ions (protons) from the matrix into the intermembrane space.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Small/narrow volume of the intermembrane space allows a high concentration of H+ (steep proton/electrochemical gradient) to build up rapidly.',
          marks: 1,
        },
        {
          pointId: 'M5',
          requirement:
            'Chemiosmosis: H+ ions diffuse back into the matrix down their concentration/electrochemical gradient through ATP synthase.',
          marks: 1,
        },
        {
          pointId: 'M6',
          requirement:
            'Flow of protons causes rotation of ATP synthase, catalyzing phosphorylation of ADP + Pi to form ATP.',
          marks: 1,
        },
        {
          pointId: 'M7',
          requirement:
            'Oxygen acts as the terminal electron acceptor at the end of the ETC, combining with electrons and H+ in the matrix to form water (maintaining the gradient).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Link Structural Adaptations to Functional Locations',
          explanationMarkdown:
            'Start with two structural adaptations: (1) **Cristae** foldings increase surface area for ETC carriers and ATP synthase; (2) the **narrow intermembrane space** permits rapid accumulation of a high $[\\text{H}^+]$ concentration.',
        },
        {
          stepNumber: 2,
          title: 'Trace Electron Flow and Proton Pumping',
          explanationMarkdown:
            'State that **NADH and $\\text{FADH}_2$** produced in the matrix donate electrons to the ETC, and energy released during electron transfer pumps $\\text{H}^+$ from the matrix into the intermembrane space.',
        },
        {
          stepNumber: 3,
          title: 'Detail Chemiosmosis and Oxygen as Terminal Acceptor',
          explanationMarkdown:
            'Explain that $\\text{H}^+$ diffuses back through **ATP synthase** (chemiosmosis) to phosphorylate $\\text{ADP} + \\text{P}_i \\to \\text{ATP}$, while **oxygen** accepts de-energized electrons and $\\text{H}^+$ to form $\\text{H}_2\\text{O}$.',
        },
      ],
      commonPitfalls: [
        'Saying "NADH turns into ATP" instead of stating that NADH donates electrons to the ETC.',
        'Confusing the direction of proton pumping (pumped from matrix TO intermembrane space; diffuses from intermembrane space TO matrix).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'bio-a1-q002',
      subjectSlug: 'bio',
      topicId: 'bio-A1.1',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Explain',
      stemMarkdown:
        'Explain how the hydrogen bonding of water enables upward transport of water in the xylem of terrestrial plants.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Water molecules are polar (δ- oxygen and δ+ hydrogen), allowing hydrogen bonds to form between adjacent water molecules.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'Cohesion between water molecules due to hydrogen bonding allows a continuous column of water to be pulled upward under tension without breaking.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Adhesion occurs where polar water molecules form hydrogen bonds with hydrophilic cellulose/lignin in the xylem vessel walls, preventing the column from dropping under gravity.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Evaporation/transpiration from mesophyll cell walls in leaves generates negative pressure (tension) that pulls the cohesive water column upward.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Define Polarity & Hydrogen Bonding',
          explanationMarkdown:
            'Identify the $\\delta^-$ on oxygen and $\\delta^+$ on hydrogen that produce intermolecular hydrogen bonds.',
        },
        {
          stepNumber: 2,
          title: 'Distinguish Cohesion from Adhesion in Xylem',
          explanationMarkdown:
            'State that **cohesion** (water-to-water attraction) resists tension in the continuous transpiration stream, while **adhesion** (water-to-hydrophilic xylem wall attraction) supports capillary movement against gravity.',
        },
      ],
      commonPitfalls: [
        'Confusing cohesion (water-water) with adhesion (water-xylem cell wall).',
        'Calling the O–H bond inside a water molecule a hydrogen bond instead of a polar covalent bond.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'bio-c1-q003',
      subjectSlug: 'bio',
      topicId: 'bio-C1.3',
      paper: 'Paper 1A',
      questionType: 'mcq',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 1,
      commandTerm: 'Identify',
      stemMarkdown:
        'A suspension of unicellular green algae (*Chlorella*) is actively photosynthesizing in bright light with abundant $\\text{CO}_2$. If the light source is suddenly switched off while $\\text{CO}_2$ supply remains constant, how do the relative concentrations of glycerate-3-phosphate (GP) and ribulose bisphosphate (RuBP) change immediately?',
      stimulusMarkdown: null,
      options: [
        { id: 'A', text: 'GP increases and RuBP decreases' },
        { id: 'B', text: 'GP decreases and RuBP increases' },
        { id: 'C', text: 'Both GP and RuBP increase' },
        { id: 'D', text: 'Both GP and RuBP decrease' },
      ],
      correctOptionId: 'A',
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Without light, light-dependent reactions stop producing ATP and NADPH; therefore GP cannot be reduced to triose phosphate (TP) and accumulates, while RuBP cannot be regenerated and continues being carboxylated with CO2.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Locate Where ATP and NADPH Act in the Calvin Cycle',
          explanationMarkdown:
            'ATP and NADPH from the light-dependent stage are required to reduce **GP $\\to$ TP** and ATP is required to regenerate **TP $\\to$ RuBP**.',
        },
        {
          stepNumber: 2,
          title: 'Deduce Metabolite Shifts in Darkness',
          explanationMarkdown:
            'When light is turned off, RuBisCO still fixes $\\text{CO}_2 + \\text{RuBP} \\to 2\\text{ GP}$ (consuming RuBP), but GP cannot be reduced to TP without ATP/NADPH—so **GP rises and RuBP falls** (Option A).',
        },
      ],
      commonPitfalls: [
        'Confusing the effect of turning off light (GP up, RuBP down) with removing CO2 (RuBP up, GP down).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'bio-b2-q004',
      subjectSlug: 'bio',
      topicId: 'bio-B2.1',
      paper: 'Paper 2',
      questionType: 'data_based',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 4,
      commandTerm: 'Analyse',
      stemMarkdown:
        'Cylinders of *Solanum tuberosum* (potato tuber) tissue were immersed for 60 minutes in sucrose solutions ranging from $0.0\\text{ mol dm}^{-3}$ to $0.8\\text{ mol dm}^{-3}$. The percentage change in mass was $+14.2\\%$ at $0.1\\text{ mol dm}^{-3}$, $+3.8\\%$ at $0.2\\text{ mol dm}^{-3}$, $-2.1\\%$ at $0.3\\text{ mol dm}^{-3}$, and $-11.5\\%$ at $0.5\\text{ mol dm}^{-3}$. Estimate the osmolarity of the potato tissue and explain the mass change at $0.5\\text{ mol dm}^{-3}$.',
      stimulusMarkdown:
        'Table 1: Mean percentage change in mass ($\\pm 0.8\\%$) of *Solanum tuberosum* cylinders ($n = 5$ per sucrose molarity) after 60 minutes at $22\\ ^\\circ\\text{C}$.',
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'Isotonic point (0% mass change intercept) lies between 0.2 and 0.3 mol dm-3 (accept 0.26 ± 0.02 mol dm-3).',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'At 0.5 mol dm-3, the external sucrose solution is hypertonic (has a higher solute concentration / lower water potential) relative to the potato cytoplasm.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'Water moves out of the potato cells by osmosis across the partially permeable plasma membrane down the water potential gradient.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'Loss of water from the vacuole/cytoplasm reduces turgor pressure and causes plasmolysis, decreasing tissue mass by 11.5%.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Interpolate the Isotonic x-Intercept',
          explanationMarkdown:
            'Between $0.2\\text{ mol dm}^{-3}$ ($+3.8\\%$) and $0.3\\text{ mol dm}^{-3}$ ($-2.1\\%$), the curve crosses $0.0\\%$ mass change at $\\approx 0.26\\text{ mol dm}^{-3}$, which equals the tissue osmolarity.',
        },
        {
          stepNumber: 2,
          title: 'Explain Osmotic Efflux in Hypertonic Solution',
          explanationMarkdown:
            'At $0.5\\text{ mol dm}^{-3}$, the external solution is **hypertonic** (lower water potential), driving net water movement **out** of the cells by **osmosis** and causing **plasmolysis**.',
        },
      ],
      commonPitfalls: [
        'Stating that sucrose moves into the cells rather than water moving out by osmosis.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'bio-d1-q005',
      subjectSlug: 'bio',
      topicId: 'bio-D1.1',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'allowed',
      difficulty: 'challenging',
      marks: 5,
      commandTerm: 'Outline',
      stemMarkdown:
        'Outline the roles of DNA helicase, DNA polymerase III, RNA primase, DNA polymerase I, and DNA ligase in the replication of the lagging strand in prokaryotes.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'DNA helicase unwinds the double helix and breaks hydrogen bonds between complementary nitrogenous bases at the replication fork.',
          marks: 1,
        },
        {
          pointId: 'M2',
          requirement:
            'RNA primase synthesizes short RNA primers complementary to the lagging template strand to provide a free 3’-OH group.',
          marks: 1,
        },
        {
          pointId: 'M3',
          requirement:
            'DNA polymerase III adds DNA nucleotides (dNTPs) in the 5’ to 3’ direction away from the replication fork, forming discontinuous Okazaki fragments.',
          marks: 1,
        },
        {
          pointId: 'M4',
          requirement:
            'DNA polymerase I removes the RNA primers and replaces them with DNA nucleotides.',
          marks: 1,
        },
        {
          pointId: 'M5',
          requirement:
            'DNA ligase joins adjacent Okazaki fragments by catalyzing covalent phosphodiester bonds in the sugar-phosphate backbone.',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Order the 5 Enzymes Chronologically',
          explanationMarkdown:
            'Follow the exact biochemical sequence: **Helicase** (unwinds) $\\to$ **RNA Primase** (makes RNA primer) $\\to$ **DNA Pol III** ($5\' \\to 3\'$ Okazaki fragments) $\\to$ **DNA Pol I** (replaces primer with DNA) $\\to$ **DNA Ligase** (seals phosphodiester bond).',
        },
        {
          stepNumber: 2,
          title: 'Specify Bond Types',
          explanationMarkdown:
            'State clearly that helicase breaks **hydrogen bonds**, whereas DNA Pol III and DNA ligase form covalent **phosphodiester bonds**.',
        },
      ],
      commonPitfalls: [
        'Confusing the roles of DNA Polymerase III (main elongation) and DNA Polymerase I (primer replacement).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'bio-d1-q006',
      subjectSlug: 'bio',
      topicId: 'bio-D1.2',
      paper: 'Paper 1A',
      questionType: 'mcq',
      calculatorPolicy: 'allowed',
      difficulty: 'standard',
      marks: 1,
      commandTerm: 'Deduce',
      stemMarkdown:
        'A fragment of the **coding (sense) strand** of a eukaryotic gene has the base sequence `5\'-ATG CCT GAC-3\'`. What is the corresponding base sequence of the **mRNA** transcript and the **template (antisense) DNA** strand?',
      stimulusMarkdown: null,
      options: [
        {
          id: 'A',
          text: "mRNA: 5'-AUG CCU GAC-3' · Template DNA: 3'-TAC GGA CTG-5'",
        },
        {
          id: 'B',
          text: "mRNA: 5'-UAC GGA CUG-3' · Template DNA: 3'-ATG CCT GAC-5'",
        },
        {
          id: 'C',
          text: "mRNA: 5'-ATG CCT GAC-3' · Template DNA: 3'-UAC GGA CUG-5'",
        },
        {
          id: 'D',
          text: "mRNA: 3'-AUG CCU GAC-5' · Template DNA: 5'-TAC GGA CTG-3'",
        },
      ],
      correctOptionId: 'A',
      markschemePoints: [
        {
          pointId: 'M1',
          requirement:
            'mRNA has the identical 5’ to 3’ sequence as the coding (sense) DNA strand with Uracil (U) replacing Thymine (T), while the template (antisense) strand is complementary and antiparallel (3’-TAC GGA CTG-5’).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Match Coding Strand to mRNA (T -> U)',
          explanationMarkdown:
            'Because both the coding strand and mRNA are complementary to the template strand, `5\'-ATG CCT GAC-3\'` directly gives mRNA `5\'-AUG CCU GAC-3\'`.',
        },
        {
          stepNumber: 2,
          title: 'Write the Antiparallel Template Strand',
          explanationMarkdown:
            'Pair each base antiparallel: `5\'-ATG CCT GAC-3\'` pairs with `3\'-TAC GGA CTG-5\'` (Option A).',
        },
      ],
      commonPitfalls: [
        'Taking the complement of the coding strand instead of replacing T with U.',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'bio-ref-membrane',
      subjectSlug: 'bio',
      toolType: 'bio_diagram',
      category: 'Theme B2.1',
      title: 'Fluid Mosaic Membrane & Active/Passive Transport',
      codeOrSymbol: 'B2.1',
      payload: {
        summary:
          'Interactive phospholipid bilayer model showing simple diffusion, aquaporin osmosis, voltage-gated channels, and Na+/K+-ATPase primary active transport.',
        examTraps: [
          'Never draw peripheral proteins spanning both phospholipid monolayers.',
          'Label the phosphate head as hydrophilic (polar) and hydrocarbon tails as hydrophobic (non-polar).',
        ],
      },
    },
    {
      id: 'bio-ref-chemiosmosis',
      subjectSlug: 'bio',
      toolType: 'bio_diagram',
      category: 'Theme C1.2',
      title: 'Mitochondrial Chemiosmosis & Electron Transport Chain',
      codeOrSymbol: 'C1.2',
      payload: {
        summary:
          'Cristae inner membrane model illustrating NADH/FADH2 oxidation, proton pumping into the narrow intermembrane space, ATP synthase rotation, and O2 reduction.',
        examTraps: [
          'Specify that protons (H+) are pumped into the intermembrane space and diffuse back into the matrix.',
        ],
      },
    },
    {
      id: 'bio-ref-photosynthesis',
      subjectSlug: 'bio',
      toolType: 'bio_diagram',
      category: 'Theme C1.3',
      title: 'Chloroplast Thylakoid Light Reactions & Calvin Cycle',
      codeOrSymbol: 'C1.3',
      payload: {
        summary:
          'Complete Z-scheme photolysis at PSII, thylakoid lumen proton gradient, NADP+ reduction at PSI, and RuBisCO carboxylation of RuBP in the stroma.',
        examTraps: [
          'Remember that photolysis occurs at PSII (thylakoid lumen), whereas NADP+ reduction occurs on the stroma side of PSI.',
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'bio-deck-core',
      subjectSlug: 'bio',
      topicId: 'bio-A1.1',
      title: 'Themes A & B: Biomolecules, Water & Membrane Transport',
      description:
        'High-yield IB markscheme definitions for water properties, nucleic acids, protein folding, and membrane transport.',
      cards: [
        {
          id: 'bio-card-1',
          frontMarkdown:
            'Distinguish between **cohesion** and **adhesion** of water in plant transport (`A1.1`).',
          backMarkdown:
            '**Cohesion:** Hydrogen bonding between adjacent water molecules, maintaining a continuous column under tension in xylem.\n\n**Adhesion:** Hydrogen bonding between polar water molecules and hydrophilic cellulose/lignin in xylem cell walls.',
          tags: ['Theme A', 'Water'],
        },
        {
          id: 'bio-card-2',
          frontMarkdown:
            'What is the role of **cholesterol** in mammalian plasma membranes (`B2.1`)?',
          backMarkdown:
            'Modulates membrane fluidity across temperatures: restricts phospholipid movement at high temperatures (reducing permeability to hydrophilic ions) and prevents tail packing/crystallization at low temperatures.',
          tags: ['Theme B', 'Membranes'],
        },
        {
          id: 'bio-card-3',
          frontMarkdown:
            'State the stoichiometry and directionality of the **$\\text{Na}^+/\\text{K}^+$-ATPase pump** (`B2.1.15`).',
          backMarkdown:
            'Per $1\\text{ ATP}$ hydrolyzed, pumps **$3\\ \\text{Na}^+$ ions out** of the axon and **$2\\ \\text{K}^+$ ions into** the axon against their concentration gradients.',
          tags: ['Theme B', 'HL'],
        },
        {
          id: 'bio-card-4',
          frontMarkdown:
            'Why did **Hershey and Chase** use radioactive $^{32}\\text{P}$ and $^{35}\\text{S}$ in T2 bacteriophages (`A1.2.14`)?',
          backMarkdown:
            'DNA contains **phosphorus ($^{32}\\text{P}$)** in its sugar-phosphate backbone but no sulfur; proteins contain **sulfur ($^{35}\\text{S}$)** in cysteine/methionine R-groups but no phosphorus. Only $^{32}\\text{P}$ entered the bacterial pellet, proving DNA is the genetic material.',
          tags: ['Theme A', 'HL'],
        },
      ],
    },
    {
      id: 'bio-deck-hl',
      subjectSlug: 'bio',
      topicId: 'bio-C1.2',
      title: 'Themes C & D: HL Bioenergetics & Gene Expression',
      description:
        'Chemiosmosis, Calvin cycle metabolites, replication enzymes, and eukaryotic mRNA splicing.',
      cards: [
        {
          id: 'bio-card-5',
          frontMarkdown:
            'What is the exact role of **Oxygen ($\\text{O}_2$)** in aerobic cell respiration (`C1.2`)?',
          backMarkdown:
            'Acts as the **terminal electron acceptor** at the end of the mitochondrial electron transport chain, combining with electrons and matrix protons ($\\text{H}^+$) to form $\\text{H}_2\\text{O}$ ($\\frac{1}{2}\\text{O}_2 + 2e^- + 2\\text{H}^+ \\to \\text{H}_2\\text{O}$).',
          tags: ['Theme C', 'Respiration'],
        },
        {
          id: 'bio-card-6',
          frontMarkdown:
            'What enzyme catalyzes carbon fixation in the Calvin cycle, and what are its substrates and product (`C1.3`)?',
          backMarkdown:
            '**RuBisCO** catalyzes the carboxylation of **ribulose bisphosphate (RuBP, $5\\text{C}$)** with $\\text{CO}_2$ ($1\\text{C}$) to form two molecules of **glycerate-3-phosphate (GP, $3\\text{C}$)**.',
          tags: ['Theme C', 'Photosynthesis'],
        },
        {
          id: 'bio-card-7',
          frontMarkdown:
            'Why is the **lagging strand** synthesized discontinuously as Okazaki fragments (`D1.1`)?',
          backMarkdown:
            'Because DNA strands are antiparallel and **DNA Polymerase III** can only add nucleotides to the free $3\'-\\text{OH}$ end in the **$5\' \\to 3\'$ direction**, moving away from the opening replication fork.',
          tags: ['Theme D', 'Replication'],
        },
        {
          id: 'bio-card-8',
          frontMarkdown:
            'How does **alternative splicing** increase proteome diversity in eukaryotes (`D1.2`)?',
          backMarkdown:
            'Spliceosomes remove introns and can selectively include or skip specific exons from the same pre-mRNA transcript, allowing one gene to encode multiple distinct polypeptide isoforms.',
          tags: ['Theme D', 'Gene Expression'],
        },
      ],
    },
  ],
};
