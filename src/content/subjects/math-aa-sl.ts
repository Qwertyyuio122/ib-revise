import type { SubjectPack } from '../schemas';

export const mathAaSlPack: SubjectPack = {
  subject: {
    slug: 'math',
    name: 'Math AA',
    level: 'SL',
    syllabusFirstAssessment: '2021',
    themeTokens: {
      wash1: 'rgba(254,240,138,0.52)',
      wash2: 'rgba(253,230,138,0.45)',
      wash3: 'rgba(224,242,254,0.48)',
      accent: '#D97706',
      soft: '#FFFBEB',
      cardGradient: 'linear-gradient(135deg, #FEF08A 0%, #FDE68A 50%, #E0F2FE 100%)',
    },
    iaConfig: {
      iaLabel: 'Math AA IA',
      iaTitle: 'Mathematical Exploration',
      maxMarks: 20,
      wordOrTimeLimit: '12–20 pages',
      weightPercent: 20,
      steps: [
        'Choose personal topic',
        'Build mathematical model',
        'Verify notation & AI review',
      ],
      criteria: [
        {
          code: 'A',
          name: 'Presentation',
          maxMarks: 4,
          weightPercent: 20,
          summary:
            'The exploration is coherent, well-organized, and concise, with a clear aim that every mathematical table, graph, and derivation directly serves.',
          topBandExpectations: [
            'Explicitly stated aim in the introduction linked to a concrete conclusion.',
            'Concise 12–20 page structure without repetitive computer printouts or massive raw data appendices.',
          ],
          commonPitfalls: [
            'Pasting multi-page spreadsheets instead of showing one representative sample calculation and a summary table.',
          ],
        },
        {
          code: 'B',
          name: 'Mathematical Communication',
          maxMarks: 4,
          weightPercent: 20,
          summary:
            'Use appropriate mathematical language, notation (italic variables, upright functions, exact symbols), defined parameters, and clear multi-representation graphs.',
          topBandExpectations: [
            'Every variable, parameter, and domain is explicitly defined before or immediately after an equation appears.',
            'Proper equation typesetting ($\\int_a^b f(x)\\,\\mathrm{d}x$, $\\approx$ for rounded values, never computer syntax like `2*x^2` or `3.4E-5`).',
            'All graphs have labeled axes, units, scales, and overlaid model curves.',
          ],
          commonPitfalls: [
            'Using `=` instead of `$\\approx$` when rounding to 3 significant figures.',
            'Leaving calculator/spreadsheet notation (`*`, `^`, `E-04`) in the body text.',
          ],
        },
        {
          code: 'C',
          name: 'Personal Engagement',
          maxMarks: 3,
          weightPercent: 15,
          summary:
            'Demonstrate authentic personal ownership through primary data collection, independent mathematical modeling assumptions, or exploring "what-if" parameter perturbations.',
          topBandExpectations: [
            'Generates original data, derives a tailored functional model from physical/geometric constraints, or tests alternative models when the first fit fails.',
          ],
          commonPitfalls: [
            'Writing an artificial backstory ("I love coffee so I modeled Newton’s Law of Cooling") while copying a standard textbook derivation verbatim.',
          ],
        },
        {
          code: 'D',
          name: 'Reflection',
          maxMarks: 3,
          weightPercent: 15,
          summary:
            'Critically review, analyze, and evaluate the mathematical results, model assumptions, domain limitations, and sensitivity throughout the exploration.',
          topBandExpectations: [
            'Reflection occurs iteratively after each modeling stage (not just in the final paragraph), quantifying residual errors and testing boundary behavior (e.g., $t \\to \\infty$).',
          ],
          commonPitfalls: [
            'Superficial reflection ("human error could have affected my measurements") without analyzing mathematical model assumptions.',
          ],
        },
        {
          code: 'E',
          name: 'Use of Mathematics (SL)',
          maxMarks: 6,
          weightPercent: 30,
          summary:
            'Demonstrate thorough knowledge and understanding of mathematics commensurate with the Math AA SL syllabus (e.g., calculus optimization, integration, regression residuals, probability distributions), applied accurately.',
          topBandExpectations: [
            'Every analytical step (chain/product/quotient differentiation, integration by substitution, normal/binomial bounds) is explained and verified both algebraically and graphically.',
            'Correctly justifies why a specific function family works rather than pressing "Cubic Regression" blindly on a GDC.',
          ],
          commonPitfalls: [
            'Attempting university-level formulas (e.g., Fourier transforms or partial differential equations) without understanding or deriving the intermediate steps.',
          ],
        },
      ],
      exemplarTitle:
        'Optimizing the Cross-Sectional Profile of an Acoustic Guitar Soundhole and Body Volume Using Piecewise Bezier Curves and Solids of Revolution',
      exemplarResearchQuestion:
        'How accurately can piecewise cubic polynomials and integration of solids of revolution model the internal air cavity volume and Helmholtz resonance frequency of a dreadnought acoustic guitar?',
      exemplarScore: '19 / 20 (Band 7 Math AA SL IA)',
      exemplarSections: [
        {
          sectionTitle: 'Criterion B & E: Deriving the Upper and Lower Bout Profile with $C^1$ Continuity',
          excerptMarkdown:
            'To model the upper bout ($0 \\le x \\le 18\\text{ cm}$) and waist-to-lower bout ($18 \\le x \\le 50\\text{ cm}$) without a sharp cusp at the waist ($x = 18\\text{ cm}$), we require both positional continuity $f_1(18) = f_2(18) = 13.4\\text{ cm}$ and first-derivative continuity:\n\n$$f_1\'(18) = f_2\'(18) = 0$$\n\nSince the waist is a local minimum on $[10, 35]$, setting $f_1\'(18) = 0$ guarantees a smooth horizontal tangent transition before computing the cavity volume via $V = \\int_0^{50} A(x)\\,\\mathrm{d}x$.',
          examinerCommentary:
            'Exemplifies top-band Criterion B and E (SL): defines domains and units clearly, applies differential and integral calculus rigorously, and explains the physical reason for $f\'(18)=0$.',
          criterionRef: 'E',
        },
        {
          sectionTitle: 'Criterion D: Critical Reflection on Internal Bracing Discrepancy',
          excerptMarkdown:
            'Our integral model predicts an internal air volume of $V_{\\text{model}} = 16,420\\text{ cm}^3$ ($16.42\\text{ L}$), which exceeds the manufacturer’s measured cavity volume ($15.30\\text{ L}$) by $7.32\\%$. Mathematically, this systematic overestimation arises because our cross-sectional integral assumes a hollow shell of uniform wall thickness ($b = 0.25\\text{ cm}$), neglecting the volume occupied by the internal X-bracing, kerfed lining, and neck block ($\\Delta V_{\\text{bracing}} \\approx 950\\text{ cm}^3$).',
          examinerCommentary:
            'Earns 3/3 on Criterion D by quantifying percentage error and attributing it to specific geometric simplifying assumptions in the mathematical model.',
          criterionRef: 'D',
        },
      ],
    },
    spotlight: {
      title: 'Math AA SL Paper Split & Formula Tools',
      pills: [
        { label: 'Paper 1: Non-Calculator', href: '/questions?subject=math&paper=Paper+1' },
        { label: 'Paper 2: GDC Permitted', href: '/questions?subject=math&paper=Paper+2' },
        { label: 'Interactive Formula Booklet', href: '/tools/formula-booklet' },
        { label: 'SL Topics 1–5', href: '/study-guides?subject=math' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description: 'Paper 1 non-calc & Paper 2 GDC drills across Topics 1–5',
        bgHex: '#FFFBEB',
        colorHex: '#D97706',
        href: '/questions?subject=math',
        iconName: 'questionbank',
      },
      {
        title: 'Worked Step Walkthroughs',
        description: 'Line-by-line algebraic & calculus text solutions',
        bgHex: '#EFF6FF',
        colorHex: '#2563EB',
        href: '/questions?subject=math&mode=practice',
        iconName: 'walkthrough',
      },
      {
        title: 'Blurting Formulas',
        description: 'Active recall of identities & derivatives not in booklet',
        bgHex: '#FFEDD5',
        colorHex: '#EA580C',
        href: '/tools/blurting?subject=math',
        iconName: 'blurting',
      },
      {
        title: 'Teach Sprout',
        description: 'Explain why a proof or integration substitution works',
        bgHex: '#ECFDF5',
        colorHex: '#059669',
        href: '/tools/teach-sprout?subject=math',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Build timed 90-minute Paper 1 or Paper 2 mocks',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/questions?subject=math&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Track domain restrictions, sign errors & GDC rounding',
        bgHex: '#FEF2F2',
        colorHex: '#DC2626',
        href: '/questions?subject=math&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'Formula Booklet Reference',
        description: 'Every SL formula mapped to example problems',
        bgHex: '#FEF3C7',
        colorHex: '#B45309',
        href: '/tools/formula-booklet',
        iconName: 'formula_booklet',
      },
      {
        title: 'Study Guide',
        description: 'Number & Algebra, Functions, Trig, Stats & Calculus',
        bgHex: '#E0F2FE',
        colorHex: '#0284C7',
        href: '/study-guides?subject=math',
        iconName: 'study_guide',
      },
      {
        title: 'Flashcards',
        description: 'Trig values, derivative rules & log laws',
        bgHex: '#DCFCE7',
        colorHex: '#16A34A',
        href: '/flashcards?subject=math',
        iconName: 'flashcards',
      },
      {
        title: 'AI Exploration Studio',
        description: 'Check IA Criterion A–E clarity, math notation & reflection',
        bgHex: '#F4F4F5',
        colorHex: '#3F3F46',
        href: '/essay-studio?subject=math',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'math-sl-1',
      subjectSlug: 'math',
      unitCode: 'Topic 1',
      unitTitle: 'Number and Algebra (SL 1.1–1.9)',
      code: 'SL 1',
      title: 'Sequences & Series, Exponents, Logarithms & The Binomial Theorem',
      levelScope: 'SL/Core',
      recommendedHours: 19,
      guidingQuestions: [
        'How do arithmetic and geometric sequences model linear and exponential processes, and when does an infinite geometric series converge?',
        'How do you isolate an unknown term in a binomial expansion $(a+b)^n$ without expanding the entire polynomial?',
      ],
      understandings: [
        {
          code: 'SL 1.2–1.4',
          text: 'Arithmetic sequences ($u_n = u_1 + (n-1)d$, $S_n = \\frac{n}{2}(2u_1 + (n-1)d)$) and Geometric sequences ($u_n = u_1 r^{n-1}$, $S_n = \\frac{u_1(r^n-1)}{r-1}$), compound interest, and convergent infinite geometric series ($S_\\infty = \\frac{u_1}{1-r}$ for $|r| < 1$).',
          isHL: false,
        },
        {
          code: 'SL 1.5–1.7',
          text: 'Laws of exponents and logarithms ($\\log_a(xy) = \\log_a x + \\log_a y$, $\\log_a(x^k) = k\\log_a x$, change of base $\\log_a x = \\frac{\\ln x}{\\ln a}$) and solving exponential equations on Paper 1 and Paper 2.',
          isHL: false,
        },
        {
          code: 'SL 1.9',
          text: 'The Binomial Theorem for $n \\in \\mathbb{Z}^+$: $(a+b)^n = \\sum_{r=0}^n \\binom{n}{r} a^{n-r}b^r$, where the general $(r+1)$-th term is $T_{r+1} = \\binom{n}{r} a^{n-r}b^r$ and $\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 1: Number and Algebra (SL 1.1–1.9)

#### 1. Arithmetic vs. Geometric Sequences & Series
- **Arithmetic ($d = u_{n} - u_{n-1}$):**
  $$u_n = u_1 + (n-1)d, \\qquad S_n = \\frac{n}{2}\\bigl(2u_1 + (n-1)d\\bigr) = \\frac{n}{2}(u_1 + u_n)$$
- **Geometric ($r = \\frac{u_n}{u_{n-1}}$):**
  $$u_n = u_1 r^{n-1}, \\qquad S_n = \\frac{u_1(r^n - 1)}{r - 1} = \\frac{u_1(1 - r^n)}{1 - r} \\quad (r \\neq 1)$$
- **Infinite Geometric Convergence:** Exists **if and only if $|r| < 1$** ($-1 < r < 1$):
  $$S_\\infty = \\frac{u_1}{1 - r}$$
- **Sigma Notation Trap:** The number of terms in $\\sum_{k=m}^{n} a_k$ is **$n - m + 1$** (not $n - m$). For example, $\\sum_{k=3}^{12}$ has $12 - 3 + 1 = 10$ terms.

#### 2. Logarithms & Exponents (Paper 1 Non-Calculator Alert)
- **Definition Equivalence (Not in Booklet!):** $a^x = b \\iff x = \\log_a b$ (for $a > 0, a \\neq 1, b > 0$).
- **Key Identities Not in Booklet:** $\\log_a 1 = 0$, $\\log_a a = 1$, $a^{\\log_a x} = x$, and $\\ln(e^x) = x$.
- **Booklet Laws (SL 1.7):**
  $$\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y, \\quad \\log_a(x^m) = m\\log_a x, \\quad \\log_a x = \\frac{\\log_b x}{\\log_b a}$$

#### 3. Binomial Theorem General Term Recipe (SL 1.9)
To find the coefficient of $x^k$ or the constant term ($x^0$) in $\\left(px^p + \\frac{q}{x^m}\\right)^n$:
1. Write the general term: $T_{r+1} = \\binom{n}{r} (px^p)^{n-r} (qx^{-m})^r$.
2. Separate the numerical coefficient from the power of $x$:
   $$T_{r+1} = \\binom{n}{r} p^{n-r} q^r \\cdot x^{p(n-r) - mr}$$
3. Set the exponent $p(n-r) - mr = k$ to solve for $r$, then evaluate $\\binom{n}{r} p^{n-r} q^r$.`,
      cheatsheetMarkdown: `- **Arithmetic:** $u_n = u_1 + (n-1)d$ | $S_n = \\frac{n}{2}(2u_1 + (n-1)d)$.
- **Geometric:** $u_n = u_1 r^{n-1}$ | $S_n = \\frac{u_1(r^n-1)}{r-1}$ | **$S_\\infty = \\frac{u_1}{1-r}$ for $|r|<1$**.
- **Log Laws:** $\\log_a(xy)=\\log_a x+\\log_a y$ | $\\log_a(x/y)=\\log_a x-\\log_a y$ | $\\log_a x = \\frac{\\ln x}{\\ln a}$.
- **Binomial General Term:** $T_{r+1} = \\binom{n}{r} a^{n-r} b^r$ where $\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$.`,
      blurtChecklist: [
        'Arithmetic nth term and sum formulas (SL 1.2)',
        'Geometric nth term, finite sum, and infinite convergence condition |r| < 1 (SL 1.3, 1.8)',
        'Number of terms in sigma notation from k=m to n is n - m + 1',
        'Logarithm laws and change-of-base formula (SL 1.7)',
        'Binomial theorem general term T_{r+1} and isolating the constant (x^0) term (SL 1.9)',
      ],
    },
    {
      id: 'math-sl-2',
      subjectSlug: 'math',
      unitCode: 'Topic 2',
      unitTitle: 'Functions (SL 2.1–2.11)',
      code: 'SL 2',
      title: 'Domain & Range, Composite/Inverse Functions, Quadratics, Rational & Transformations',
      levelScope: 'SL/Core',
      recommendedHours: 21,
      guidingQuestions: [
        'How do composite functions $(f \\circ g)(x)$ and inverse functions $f^{-1}(x)$ interact geometrically and algebraically?',
        'How does the discriminant $\\Delta = b^2 - 4ac$ determine the nature of roots and intersection of curves?',
      ],
      understandings: [
        {
          code: 'SL 2.2–2.5',
          text: 'Domain and range, composite functions $(f \\circ g)(x) = f(g(x))$, inverse function $f^{-1}(x)$ as reflection in $y = x$ (where $\\text{Dom}(f^{-1}) = \\text{Ran}(f)$), and function transformations $y = a f(b(x - h)) + k$.',
          isHL: false,
        },
        {
          code: 'SL 2.6–2.8',
          text: 'Quadratic forms (vertex $f(x) = a(x-h)^2+k$, factored $a(x-p)(x-q)$, axis of symmetry $x = -\\frac{b}{2a}$), discriminant $\\Delta = b^2 - 4ac$, and rational functions $f(x) = \\frac{ax+b}{cx+d}$ (vertical asymptote $x = -\\frac{d}{c}$, horizontal asymptote $y = \\frac{a}{c}$).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 2: Functions (SL 2.1–2.11)

#### 1. Composite & Inverse Functions
- **Composite Function:** $(f \\circ g)(x) = f(g(x))$ applies **$g$ first, then $f$**.
- **Inverse Function $f^{-1}(x)$:**
  - Found by swapping $x$ and $y$ and solving for $y$, and satisfies $(f \\circ f^{-1})(x) = (f^{-1} \\circ f)(x) = x$.
  - **Domain & Range Swap:** $\\text{Domain}(f^{-1}) = \\text{Range}(f)$ and $\\text{Range}(f^{-1}) = \\text{Domain}(f)$.
  - **Geometric Property:** The graphs of $y = f(x)$ and $y = f^{-1}(x)$ are reflections across the line **$y = x$**; any intersection along the main branch lies on $y = x$, so solve $f(x) = x$.

#### 2. Quadratics & The Discriminant $\\Delta = b^2 - 4ac$
- **Three Forms of a Quadratic:**
  1. **Standard Form:** $f(x) = ax^2 + bx + c$ ($y$-intercept $(0,c)$, axis of symmetry $x = -\\frac{b}{2a}$).
  2. **Vertex Form (Completed Square):** $f(x) = a(x - h)^2 + k$ (vertex at $(h, k)$).
  3. **Factored Form:** $f(x) = a(x - p)(x - q)$ ($x$-intercepts at $p$ and $q$, axis of symmetry $x = \\frac{p+q}{2}$).
- **Discriminant $\\Delta = b^2 - 4ac$:**
  - $\\Delta > 0$: Two distinct real roots (graph crosses $x$-axis twice).
  - $\\Delta = 0$: One repeated real root / two equal roots (graph is tangent to $x$-axis).
  - $\\Delta < 0$: No real roots (graph lies entirely above $x$-axis if $a > 0$, or below if $a < 0$).

#### 3. Rational Functions & Transformations (Not in Formula Booklet!)
- **Rational Function $f(x) = \\frac{ax + b}{cx + d}$:**
  - **Vertical Asymptote:** Denominator $= 0 \\implies x = -\\frac{d}{c}$.
  - **Horizontal Asymptote:** Ratio of leading coefficients $\\implies y = \\frac{a}{c}$.
- **Order of Transformations for $y = a f(b(x - h)) + k$:**
  - Inside brackets ($x$-direction, inverted): horizontal stretch by scale factor $\\frac{1}{b}$, then translation by $\\binom{h}{0}$.
  - Outside brackets ($y$-direction, direct): vertical stretch by scale factor $a$, then translation by $\\binom{0}{k}$.`,
      cheatsheetMarkdown: `- **Inverse $f^{-1}(x)$:** Reflection in $y=x$ | $\\text{Dom}(f^{-1}) = \\text{Ran}(f)$ | Solve $f(x)=x$ for intersections on $y=x$.
- **Quadratics:** Axis $x = -\\frac{b}{2a}$ | Vertex $a(x-h)^2+k$ | $\\Delta = b^2 - 4ac$ ($>0$ two roots, $=0$ tangent, $<0$ no real roots).
- **Rational $f(x)=\\frac{ax+b}{cx+d}$:** VA at $x = -\\frac{d}{c}$ | HA at $y = \\frac{a}{c}$ *(memorize — not in booklet!)*.`,
      blurtChecklist: [
        'Composite (f o g)(x) = f(g(x)) and inverse f^{-1}(x) domain/range swap',
        'Quadratic vertex form a(x-h)^2 + k and axis of symmetry x = -b/(2a)',
        'Discriminant Delta = b^2 - 4ac conditions (> 0, = 0, < 0)',
        'Rational function (ax+b)/(cx+d) vertical asymptote x = -d/c and horizontal y = a/c',
        'Transformation sequence for y = a f(b(x - h)) + k (horizontal stretch 1/b)',
      ],
    },
    {
      id: 'math-sl-3',
      subjectSlug: 'math',
      unitCode: 'Topic 3',
      unitTitle: 'Geometry and Trigonometry (SL 3.1–3.8)',
      code: 'SL 3',
      title: 'Radian Measure, Sine/Cosine Rules, Unit Circle, Identities & Trig Equations',
      levelScope: 'SL/Core',
      recommendedHours: 25,
      guidingQuestions: [
        'How do the unit circle and exact special triangles enable solving trigonometric equations on $[0, 2\\pi]$ without a calculator?',
        'How do double-angle identities $\\cos 2\\theta$ and $\\sin 2\\theta$ reduce quadratic trigonometric equations?',
      ],
      understandings: [
        {
          code: 'SL 3.2–3.4',
          text: 'Sine rule ($\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$, including the ambiguous case), Cosine rule ($c^2 = a^2 + b^2 - 2ab\\cos C$), triangle area ($A = \\frac{1}{2}ab\\sin C$), and radian arc/sector formulas ($l = r\\theta$, $A = \\frac{1}{2}r^2\\theta$).',
          isHL: false,
        },
        {
          code: 'SL 3.5–3.8',
          text: 'Unit circle exact values ($0, \\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{\\pi}{2}$), identities ($\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$, $\\cos^2\\theta + \\sin^2\\theta = 1$, $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$, $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$), and sinusoidal models $f(x) = a\\sin(b(x-c))+d$.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 3: Geometry and Trigonometry (SL 3.1–3.8)

#### 1. Exact Trigonometric Values (Paper 1 Mandatory Memory — Not in Booklet!)
| Angle $\\theta$ (rad / deg) | $0$ ($0^\\circ$) | $\\frac{\\pi}{6}$ ($30^\\circ$) | $\\frac{\\pi}{4}$ ($45^\\circ$) | $\\frac{\\pi}{3}$ ($60^\\circ$) | $\\frac{\\pi}{2}$ ($90^\\circ$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **$\\sin\\theta$** | $0$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ | $1$ |
| **$\\cos\\theta$** | $1$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ | $0$ |
| **$\\tan\\theta$** | $0$ | $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ | Undefined |

#### 2. Non-Right Triangles & Radian Sectors (Formula Booklet SL 3.2–3.4)
- **Sine Rule:** $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$. *Ambiguous Case Alert:* When solving for an angle given SSA, check if $180^\\circ - A$ (or $\\pi - A$) also forms a valid triangle with the given angle!
- **Cosine Rule:** $c^2 = a^2 + b^2 - 2ab\\cos C \\iff \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$.
- **Radian Sector ($\\theta$ in radians):** Arc length $l = r\\theta$, Sector area $A = \\frac{1}{2}r^2\\theta$.

#### 3. Trigonometric Identities & Sinusoidal Models (SL 3.6–3.8)
- **Pythagorean & Double-Angle Identities (SL 3.6):**
  $$\\cos^2\\theta + \\sin^2\\theta = 1, \\qquad \\sin 2\\theta = 2\\sin\\theta\\cos\\theta$$
  $$\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$
- **Sinusoidal Model $f(t) = a\\sin(b(t - c)) + d$:**
  - **Amplitude:** $|a| = \\frac{\\text{Max} - \\text{Min}}{2}$
  - **Principal Axis (Vertical Shift):** $d = \\frac{\\text{Max} + \\text{Min}}{2}$
  - **Period:** $T = \\frac{2\\pi}{b} \\implies b = \\frac{2\\pi}{T}$`,
      cheatsheetMarkdown: `- **Exact Values:** $\\sin(\\pi/6)=1/2, \\sin(\\pi/4)=\\sqrt{2}/2, \\sin(\\pi/3)=\\sqrt{3}/2$ (reverse for $\\cos$).
- **Sectors (rad):** $l = r\\theta$, $A = \\frac{1}{2}r^2\\theta$ | **Triangle Area:** $A = \\frac{1}{2}ab\\sin C$.
- **Identities:** $\\cos^2\\theta + \\sin^2\\theta = 1$ | $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ | $\\cos 2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$.
- **Sinusoidal $a\\sin(b(x-c))+d$:** $|a| = \\frac{\\max-\\min}{2}$, $d = \\frac{\\max+\\min}{2}$, $\\text{Period} = \\frac{2\\pi}{b}$.`,
      blurtChecklist: [
        'Exact sin, cos, tan values for 0, pi/6, pi/4, pi/3, pi/2 and CAST quadrants',
        'Radian arc length l = r*theta and sector area A = (1/2)r^2*theta (SL 3.4)',
        'Sine rule ambiguous case (theta and pi - theta) and Cosine rule (SL 3.2)',
        'Pythagorean identity and all three forms of cos(2*theta) (SL 3.6)',
        'Sinusoidal parameters: amplitude (Max-Min)/2, principal axis (Max+Min)/2, period 2*pi/b',
      ],
    },
    {
      id: 'math-sl-4',
      subjectSlug: 'math',
      unitCode: 'Topic 4',
      unitTitle: 'Statistics and Probability (SL 4.1–4.12)',
      code: 'SL 4',
      title: 'Linear Regression, Conditional Probability, Binomial & Normal Distributions',
      levelScope: 'SL/Core',
      recommendedHours: 27,
      guidingQuestions: [
        'When do you use the Binomial distribution $X \\sim \\mathrm{B}(n,p)$ versus the Normal distribution $X \\sim \\mathrm{N}(\\mu, \\sigma^2)$, and how does $z = \\frac{x-\\mu}{\\sigma}$ allow finding unknown $\\mu$ or $\\sigma$?',
        'Why may the regression line of $y$ on $x$ not be used to predict $x$ from $y$?',
      ],
      understandings: [
        {
          code: 'SL 4.4–4.6',
          text: 'Pearson correlation coefficient $r$, regression line of $y$ on $x$ passing through $(\\bar{x}, \\bar{y})$, combined events $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, conditional probability $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$, and independent events $P(A \\cap B) = P(A)P(B)$.',
          isHL: false,
        },
        {
          code: 'SL 4.7–4.12',
          text: 'Discrete random variables ($\\sum P(X=x) = 1$, $E(X) = \\sum x P(X=x)$), Binomial distribution $X \\sim \\mathrm{B}(n,p)$ ($E(X) = np$, $\\mathrm{Var}(X) = np(1-p)$), and Normal distribution $X \\sim \\mathrm{N}(\\mu, \\sigma^2)$ with standardization $z = \\frac{x - \\mu}{\\sigma}$.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 4: Statistics and Probability (SL 4.1–4.12)

#### 1. Bivariate Regression & Probability Laws
- **Regression Line Property:** Both the $y$-on-$x$ regression line ($y = ax + b$) and the $x$-on-$y$ regression line ($x = cy + d$) always pass through the mean point **$( \\bar{x}, \\bar{y} )$**. Use $y$ on $x$ to estimate $y$ from $x$ (within the data range — **interpolation**, never unreliable **extrapolation**), and $x$ on $y$ to estimate $x$ from $y$.
- **Probability Identities (SL 4.6):**
  $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B), \\qquad P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$
  - **Mutually Exclusive:** $P(A \\cap B) = 0$.
  - **Independent:** $P(A \\cap B) = P(A)P(B) \\iff P(A \\mid B) = P(A)$.

#### 2. Discrete Random Variables & Binomial Distribution $X \\sim \\mathrm{B}(n, p)$
- **General Discrete Variable:** $\\sum P(X = x_i) = 1$ and $E(X) = \\mu = \\sum x_i P(X = x_i)$.
- **Binomial Distribution $X \\sim \\mathrm{B}(n, p)$:** Fixed number of independent trials $n$, constant probability of success $p$:
  $$P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}, \\qquad E(X) = np, \\qquad \\mathrm{Var}(X) = np(1-p)$$
- **GDC Inequality Trap:** Most GDC $\\mathrm{binomcdf}(n, p, k)$ functions compute $P(X \\le k)$.
  - For $P(X < k)$ with discrete integers: rewrite as **$P(X \\le k - 1)$**.
  - For $P(X \\ge k)$: rewrite as **$1 - P(X \\le k - 1)$**.

#### 3. Normal Distribution $X \\sim \\mathrm{N}(\\mu, \\sigma^2)$ & Inverse Normal
- When **$\\mu$ or $\\sigma$ is unknown**, convert the given probability into a standard normal quantile $z_0 = \\mathrm{invNorm}(p)$ using $Z \\sim \\mathrm{N}(0, 1)$, then substitute into:
  $$z = \\frac{x - \\mu}{\\sigma} \\implies x - \\mu = z\\sigma$$
  If both $\\mu$ and $\\sigma$ are unknown, form two simultaneous linear equations from two given probability statements.`,
      cheatsheetMarkdown: `- **Probability:** $P(A \\cup B) = P(A)+P(B)-P(A \\cap B)$ | $P(A\\mid B) = \\frac{P(A \\cap B)}{P(B)}$ | Independent: $P(A \\cap B)=P(A)P(B)$.
- **Binomial $X \\sim \\mathrm{B}(n,p)$:** $E(X)=np$, $\\mathrm{Var}(X)=np(1-p)$ | $P(X \\ge k) = 1 - P(X \\le k-1)$.
- **Normal $X \\sim \\mathrm{N}(\\mu,\\sigma^2)$:** Unknown $\\mu, \\sigma \\implies$ find $z$ from $Z \\sim \\mathrm{N}(0,1)$ and solve $x - \\mu = z\\sigma$.`,
      blurtChecklist: [
        'Regression line always passes through mean point (x-bar, y-bar); interpolation vs extrapolation',
        'Mutually exclusive (P(A n B) = 0) vs Independent (P(A n B) = P(A)P(B)) and conditional P(A|B)',
        'Discrete random variable sum of probabilities = 1 and E(X) = sum(x * P(X=x))',
        'Binomial B(n,p) formulas and P(X >= k) = 1 - P(X <= k-1) GDC conversion',
        'Normal standardization z = (x - mu)/sigma to solve for unknown mu and sigma',
      ],
    },
    {
      id: 'math-sl-5a',
      subjectSlug: 'math',
      unitCode: 'Topic 5A',
      unitTitle: 'Differential Calculus (SL 5.1–5.4, 5.6–5.8)',
      code: 'SL 5A',
      title: 'Differentiation Rules (Chain, Product, Quotient), Tangents/Normals & Optimization',
      levelScope: 'SL/Core',
      recommendedHours: 16,
      guidingQuestions: [
        'How do the chain, product, and quotient rules differentiate composite and combined transcendental functions?',
        'How do $f\'(x)$ and $f\'\'(x)$ classify stationary points ($f\'(x)=0$) and points of inflection ($f\'\'(x)=0$ with sign change)?',
      ],
      understandings: [
        {
          code: 'SL 5.3 & 5.6',
          text: 'Standard derivatives ($x^n \\to nx^{n-1}$, $\\sin x \\to \\cos x$, $\\cos x \\to -\\sin x$, $e^x \\to e^x$, $\\ln x \\to \\frac{1}{x}$) and Chain Rule ($\\frac{\\mathrm{d}y}{\\mathrm{d}x} = \\frac{\\mathrm{d}y}{\\mathrm{d}u}\\frac{\\mathrm{d}u}{\\mathrm{d}x}$), Product Rule ($uv\' + u\'v$), and Quotient Rule ($\\frac{vu\' - uv\'}{v^2}$).',
          isHL: false,
        },
        {
          code: 'SL 5.4, 5.7 & 5.8',
          text: 'Equations of tangent ($m_T = f\'(a)$) and normal ($m_N = -\\frac{1}{f\'(a)}$), stationary points ($f\'(x)=0$), second-derivative test, inflection points ($f\'\'(x)=0$ with concavity sign change), and constrained optimization.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 5A: Differential Calculus (SL 5.1–5.4, 5.6–5.8)

#### 1. Standard Derivatives & Differentiation Rules (Formula Booklet SL 5.3 & 5.6)
- **Elementary Functions:**
  $$\\frac{\\mathrm{d}}{\\mathrm{d}x}(x^n) = nx^{n-1}, \\quad \\frac{\\mathrm{d}}{\\mathrm{d}x}(\\sin x) = \\cos x, \\quad \\frac{\\mathrm{d}}{\\mathrm{d}x}(\\cos x) = -\\sin x, \\quad \\frac{\\mathrm{d}}{\\mathrm{d}x}(e^x) = e^x, \\quad \\frac{\\mathrm{d}}{\\mathrm{d}x}(\\ln x) = \\frac{1}{x}$$
- **Chain Rule Shortcut:**
  $$\\frac{\\mathrm{d}}{\\mathrm{d}x}\\bigl[g(x)\\bigr]^n = n\\bigl[g(x)\\bigr]^{n-1}g'(x), \\qquad \\frac{\\mathrm{d}}{\\mathrm{d}x}\\bigl(e^{g(x)}\\bigr) = g'(x)e^{g(x)}, \\qquad \\frac{\\mathrm{d}}{\\mathrm{d}x}\\bigl(\\ln g(x)\\bigr) = \\frac{g'(x)}{g(x)}$$
- **Product & Quotient Rules:**
  $$y = uv \\implies \\frac{\\mathrm{d}y}{\\mathrm{d}x} = u\\frac{\\mathrm{d}v}{\\mathrm{d}x} + v\\frac{\\mathrm{d}u}{\\mathrm{d}x}, \\qquad y = \\frac{u}{v} \\implies \\frac{\\mathrm{d}y}{\\mathrm{d}x} = \\frac{v\\frac{\\mathrm{d}u}{\\mathrm{d}x} - u\\frac{\\mathrm{d}v}{\\mathrm{d}x}}{v^2}$$

#### 2. Tangents, Normals, Extrema & Inflection Points
- **Tangent & Normal at $x = x_0$:**
  - Gradient of tangent: $m_T = f'(x_0) \\implies y - f(x_0) = m_T(x - x_0)$.
  - Gradient of normal: $m_N = -\\frac{1}{f'(x_0)}$.
- **Stationary Points ($f'(x) = 0$):**
  - If $f''(x_0) < 0 \\implies$ **Local Maximum** (concave down).
  - If $f''(x_0) > 0 \\implies$ **Local Minimum** (concave up).
  - If $f''(x_0) = 0 \\implies$ **Inconclusive!** Test the sign of $f'(x)$ on either side of $x_0$.
- **Point of Inflection:** Requires **BOTH $f''(x_0) = 0$ AND a sign change in $f''(x)$** across $x_0$ (for example, $f(x) = x^4$ has $f''(0) = 0$ but no sign change, so $(0,0)$ is a minimum, not an inflection point).`,
      cheatsheetMarkdown: `- **Derivatives:** $(x^n)'=nx^{n-1}$ | $(\\sin x)'=\\cos x$ | $(\\cos x)'=-\\sin x$ | $(e^{g(x)})'=g'(x)e^{g(x)}$ | $(\\ln g(x))'=\\frac{g'(x)}{g(x)}$.
- **Product:** $(uv)' = uv' + u'v$ | **Quotient:** $(u/v)' = \\frac{vu' - uv'}{v^2}$.
- **Extrema:** $f'(x)=0$ ($f''<0$ max, $f''>0$ min) | **Inflection:** $f''(x)=0$ **+ sign change in $f''(x)$**.`,
      blurtChecklist: [
        'Derivatives of x^n, sin x, cos x, e^x, ln x and chain rule composites (SL 5.3, 5.6)',
        'Product rule uv’ + u’v and Quotient rule (vu’ - uv’)/v^2 (SL 5.6)',
        'Tangent gradient m_T = f’(a) and Normal gradient m_N = -1/f’(a) (SL 5.4)',
        'First and second derivative tests for local extrema (SL 5.7, 5.8)',
        'Inflection point requirement: f’’(x) = 0 AND sign change in f’’(x) (SL 5.8)',
      ],
    },
    {
      id: 'math-sl-5b',
      subjectSlug: 'math',
      unitCode: 'Topic 5B',
      unitTitle: 'Integral Calculus & Kinematics (SL 5.5, 5.9–5.11)',
      code: 'SL 5B',
      title: 'Integration by Inspection/Substitution, Definite Area & 1D Kinematics',
      levelScope: 'SL/Core',
      recommendedHours: 12,
      guidingQuestions: [
        'How does reverse chain rule / $u$-substitution evaluate $\\int g\'(x)f(g(x))\\,\\mathrm{d}x$, and why must definite limits be updated?',
        'What is the difference between displacement $\\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$ and total distance travelled $\\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t$?',
      ],
      understandings: [
        {
          code: 'SL 5.5 & 5.10',
          text: 'Standard integrals ($\\int x^n\\,\\mathrm{d}x = \\frac{x^{n+1}}{n+1}+C$, $\\int \\frac{1}{x}\\,\\mathrm{d}x = \\ln|x|+C$, $\\int e^x\\,\\mathrm{d}x = e^x+C$, $\\int \\sin x\\,\\mathrm{d}x = -\\cos x+C$, $\\int \\cos x\\,\\mathrm{d}x = \\sin x+C$) and integration by inspection/substitution.',
          isHL: false,
        },
        {
          code: 'SL 5.9 & 5.11',
          text: 'Definite integrals, area between curves $A = \\int_a^b |f(x)-g(x)|\\,\\mathrm{d}x$, and kinematics along a line ($v = \\frac{\\mathrm{d}s}{\\mathrm{d}t}$, $a = \\frac{\\mathrm{d}v}{\\mathrm{d}t}$, displacement $\\Delta s = \\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$, total distance $d = \\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t$).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### Topic 5B: Integral Calculus & Kinematics (SL 5.5, 5.9–5.11)

#### 1. Standard Integrals & Reverse Chain Rule (SL 5.5 & 5.10)
- **Standard Integrals (Don't forget $+C$ on indefinite integrals!):**
  $$\\int x^n\\,\\mathrm{d}x = \\frac{x^{n+1}}{n+1} + C \\; (n \\neq -1), \\quad \\int \\frac{1}{x}\\,\\mathrm{d}x = \\ln|x| + C, \\quad \\int e^x\\,\\mathrm{d}x = e^x + C$$
  $$\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C, \\qquad \\int \\cos x\\,\\mathrm{d}x = \\sin x + C$$
- **Linear Reverse Chain Rule (Not in Booklet — Memorize!):**
  $$\\int e^{kx+b}\\,\\mathrm{d}x = \\frac{1}{k}e^{kx+b} + C, \\quad \\int \\sin(kx+b)\\,\\mathrm{d}x = -\\frac{1}{k}\\cos(kx+b) + C, \\quad \\int \\cos(kx+b)\\,\\mathrm{d}x = \\frac{1}{k}\\sin(kx+b) + C$$
- **Substitution Pattern $\\int g'(x)f(g(x))\\,\\mathrm{d}x$:** Let $u = g(x)$, so $\\mathrm{d}u = g'(x)\\,\\mathrm{d}x$. On a definite integral $\\int_a^b$, **transform the limits** to $u(a)$ and $u(b)$ so you never have to substitute back to $x$.

#### 2. Area Between Curves & 1D Kinematics (SL 5.9 & 5.11)
- **Signed Integral vs. Geometric Area:** If $f(x) < 0$ on $[a, b]$, then $\\int_a^b f(x)\\,\\mathrm{d}x$ is negative, whereas the geometric **Area** is $A = \\int_a^b |f(x)|\\,\\mathrm{d}x = -\\int_a^b f(x)\\,\\mathrm{d}x$.
- **Kinematics Triangle:**
  $$s(t) \\;\\xrightarrow{\\frac{\\mathrm{d}}{\\mathrm{d}t}}\\; v(t) \\;\\xrightarrow{\\frac{\\mathrm{d}}{\\mathrm{d}t}}\\; a(t) \\qquad \\text{and} \\qquad a(t) \\;\\xrightarrow{\\int \\mathrm{d}t}\\; v(t) \\;\\xrightarrow{\\int \\mathrm{d}t}\\; s(t)$$
  - **At rest / Changes direction:** $v(t) = 0$ (with sign change in $v(t)$).
  - **Displacement on $[t_1, t_2]$:** $\\Delta s = s(t_2) - s(t_1) = \\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$.
  - **Total Distance Travelled on $[t_1, t_2]$:** $d = \\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t$ (on Paper 1, split the integral at any root where $v(t) = 0$!).`,
      cheatsheetMarkdown: `- **Integrals:** $\\int x^n\\,\\mathrm{d}x = \\frac{x^{n+1}}{n+1}+C$ | $\\int \\frac{1}{x}\\,\\mathrm{d}x = \\ln|x|+C$ | $\\int \\sin(kx)\\,\\mathrm{d}x = -\\frac{1}{k}\\cos(kx)+C$.
- **Substitution:** $\\int_a^b g'(x)f(g(x))\\,\\mathrm{d}x = \\int_{g(a)}^{g(b)} f(u)\\,\\mathrm{d}u$.
- **Kinematics:** Displacement $= \\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$ | **Total Distance** $= \\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t$ (split at $v(t)=0$ on Paper 1).`,
      blurtChecklist: [
        'Standard integrals of x^n, 1/x, e^x, sin x, cos x plus linear factor 1/k (SL 5.5)',
        'Integration by substitution u = g(x) and changing definite limits (SL 5.10)',
        'Area between curves A = integral of (y_top - y_bottom) dx (SL 5.11)',
        'Kinematics: v(t) = s’(t), a(t) = v’(t), particle at rest when v(t) = 0 (SL 5.9)',
        'Displacement vs Total Distance integral of |v(t)| dt (SL 5.9)',
      ],
    },
  ],
  questions: [
    {
      id: 'math-q1-p1-binomial',
      subjectSlug: 'math',
      topicId: 'math-sl-1',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 6,
      commandTerm: 'Find',
      stemMarkdown:
        '**Paper 1 (Non-Calculator):** Consider the expansion of $\\left(2x^2 - \\frac{k}{x}\\right)^6$, where $k > 0$.\n\n**a.** Write down an expression for the general term $T_{r+1}$ in terms of $r$, $k$, and $x$ **[2 marks]**.\n**b.** Given that the constant term (the term independent of $x$) in this expansion is $240$, **find** the value of $k$ **[4 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm1-a',
          requirement:
            'Writes general term using SL 1.9: $T_{r+1} = \\binom{6}{r}(2x^2)^{6-r}(-kx^{-1})^r = \\binom{6}{r}2^{6-r}(-k)^r x^{12-3r}$.',
          marks: 2,
        },
        {
          pointId: 'm1-b1',
          requirement:
            'Sets exponent of $x$ equal to zero for the constant term: $12 - 3r = 0 \\implies r = 4$.',
          marks: 1,
        },
        {
          pointId: 'm1-b2',
          requirement:
            'Substitutes $r = 4$ and evaluates binomial coefficient: $\\binom{6}{4}2^{6-4}(-k)^4 = 15 \\times 4 \\times k^4 = 60k^4$.',
          marks: 2,
        },
        {
          pointId: 'm1-b3',
          requirement:
            'Solves $60k^4 = 240 \\implies k^4 = 4 \\implies k = \\sqrt{2}$ (rejecting $-\\sqrt{2}$ since $k > 0$).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Separate the Coefficient from the Power of x in T_{r+1}',
          explanationMarkdown:
            'Using $T_{r+1} = \\binom{6}{r}(2x^2)^{6-r}(-kx^{-1})^r$, combine the powers of $x$: $(x^2)^{6-r} \\cdot x^{-r} = x^{12-2r-r} = x^{12-3r}$.',
        },
        {
          stepNumber: 2,
          title: 'Set the Power of x to 0 and Solve for k > 0',
          explanationMarkdown:
            'Setting $12 - 3r = 0$ gives $r = 4$. Since $\\binom{6}{4} = \\frac{6 \\times 5}{2} = 15$ and $2^2 = 4$, we get $15 \\times 4 \\times (-k)^4 = 60k^4 = 240 \\implies k^4 = 4 \\implies k = \\sqrt{2}$.',
        },
      ],
      commonPitfalls: [
        'Forgetting to raise $2$ to the power $(6-r)$ or forgetting that $(x^2)^{6-r} = x^{12-2r}$.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'math-q2-p1-functions',
      subjectSlug: 'math',
      topicId: 'math-sl-2',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 7,
      commandTerm: 'Find',
      stemMarkdown:
        '**Paper 1 (Non-Calculator):** Let $f(x) = \\frac{3x - 2}{x + 1}$ for $x \\in \\mathbb{R}, x \\neq -1$.\n\n**a.** Write down the equations of the vertical and horizontal asymptotes of the graph of $f$ **[2 marks]**.\n**b.** **Find** an expression for $f^{-1}(x)$ and state its domain **[5 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm2-a',
          requirement:
            'States vertical asymptote $x = -1$ and horizontal asymptote $y = 3$ (both must be written as equations, not bare numbers).',
          marks: 2,
        },
        {
          pointId: 'm2-b1',
          requirement:
            'Swaps $x$ and $y$: $x = \\frac{3y - 2}{y + 1} \\implies x(y + 1) = 3y - 2 \\implies xy + x = 3y - 2$.',
          marks: 2,
        },
        {
          pointId: 'm2-b2',
          requirement:
            'Collects $y$ terms and factors: $y(x - 3) = -x - 2 \\implies f^{-1}(x) = \\frac{-x - 2}{x - 3}$ (or $\\frac{x + 2}{3 - x}$).',
          marks: 2,
        },
        {
          pointId: 'm2-b3',
          requirement:
            'States domain of $f^{-1}$: $x \\in \\mathbb{R}, x \\neq 3$ (since $\\text{Dom}(f^{-1}) = \\text{Ran}(f)$).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Identify Asymptotes of f(x) = (ax+b)/(cx+d)',
          explanationMarkdown:
            'Set the denominator $x + 1 = 0$ for the vertical asymptote **$x = -1$**, and take the ratio of leading coefficients $\\frac{3}{1}$ for the horizontal asymptote **$y = 3$**.',
        },
        {
          stepNumber: 2,
          title: 'Isolate y and Use Dom(f^{-1}) = Ran(f)',
          explanationMarkdown:
            'From $xy - 3y = -x - 2$, factor out $y(x - 3) = -(x + 2)$ to obtain $f^{-1}(x) = \\frac{x + 2}{3 - x}$ with domain $x \\neq 3$.',
        },
      ],
      commonPitfalls: [
        'Writing "VA = -1, HA = 3" instead of the equations $x = -1$ and $y = 3$ (loses A1 marks on IB markschemes!).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'math-q3-p1-trig',
      subjectSlug: 'math',
      topicId: 'math-sl-3',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 7,
      commandTerm: 'Solve',
      stemMarkdown:
        '**Paper 1 (Non-Calculator):** **Solve** the equation $\\cos 2x + 3\\sin x - 2 = 0$ for $0 \\le x \\le 2\\pi$. Give your answers as exact multiples of $\\pi$.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm3-1',
          requirement:
            'Substitutes the double-angle identity $\\cos 2x = 1 - 2\\sin^2 x$ (from SL 3.6): $(1 - 2\\sin^2 x) + 3\\sin x - 2 = 0$.',
          marks: 2,
        },
        {
          pointId: 'm3-2',
          requirement:
            'Rearranges and factors the quadratic in $\\sin x$: $2\\sin^2 x - 3\\sin x + 1 = 0 \\implies (2\\sin x - 1)(\\sin x - 1) = 0$.',
          marks: 2,
        },
        {
          pointId: 'm3-3',
          requirement:
            'Solves $\\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}$ and $\\sin x = 1 \\implies x = \\frac{\\pi}{2}$ on $[0, 2\\pi]$.',
          marks: 3,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Choose the Form of cos(2x) That Matches the Linear Term',
          explanationMarkdown:
            'Because the linear term is $+3\\sin x$, replace $\\cos 2x$ with **$1 - 2\\sin^2 x$** so the entire equation is in terms of $\\sin x$: $2\\sin^2 x - 3\\sin x + 1 = 0$.',
        },
        {
          stepNumber: 2,
          title: 'Factor and Find All Unit Circle Angles in [0, 2pi]',
          explanationMarkdown:
            'Factoring gives $(2\\sin x - 1)(\\sin x - 1) = 0$. From $\\sin x = \\frac{1}{2}$ (Quadrants I and II), $x = \\frac{\\pi}{6}$ and $x = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$. From $\\sin x = 1$, $x = \\frac{\\pi}{2}$.',
        },
      ],
      commonPitfalls: [
        'Using $\\cos 2x = 2\\cos^2 x - 1$, which leaves mixed $\\cos^2 x$ and $\\sin x$ terms.',
        'Giving answers in degrees ($30^\\circ, 90^\\circ, 150^\\circ$) when the domain $0 \\le x \\le 2\\pi$ specifies radians.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'math-q4-p2-stats',
      subjectSlug: 'math',
      topicId: 'math-sl-4',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'gdc_required',
      difficulty: 'challenging',
      marks: 12,
      commandTerm: 'Find',
      stemMarkdown:
        '**Paper 2 (GDC Required):** The masses of specialty coffee bags produced by a roastery are normally distributed with mean $\\mu\\text{ g}$ and standard deviation $\\sigma\\text{ g}$, so $M \\sim \\mathrm{N}(\\mu, \\sigma^2)$.\n\n**a.** Given that $10\\%$ of bags have a mass less than $242\\text{ g}$ and $5\\%$ of bags have a mass greater than $260\\text{ g}$, **find** the value of $\\mu$ and the value of $\\sigma$ correct to 3 significant figures **[6 marks]**.\n\n**b.** A café orders a box of $12$ randomly selected coffee bags. A bag is classified as "underweight" if its mass is less than $245\\text{ g}$. Using $\\mu = 250\\text{ g}$ and $\\sigma = 6.15\\text{ g}$:\n  - **(i)** Show that the probability a single bag is underweight is $0.208$ (to 3 s.f.) **[2 marks]**.\n  - **(ii)** **Find** the probability that **at least 3** bags in the box of $12$ are underweight **[4 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm4-a1',
          requirement:
            'Finds standard normal quantiles via `invNorm`: $P(Z < z_1) = 0.10 \\implies z_1 = -1.28155$ and $P(Z < z_2) = 0.95 \\implies z_2 = 1.64485$.',
          marks: 2,
        },
        {
          pointId: 'm4-a2',
          requirement:
            'Sets up simultaneous equations using $z = \\frac{x - \\mu}{\\sigma}$: $242 - \\mu = -1.28155\\sigma$ and $260 - \\mu = 1.64485\\sigma$.',
          marks: 2,
        },
        {
          pointId: 'm4-a3',
          requirement:
            'Solves system on GDC: $2.9264\\sigma = 18 \\implies \\sigma \\approx 6.15\\text{ g}$ and $\\mu \\approx 250\\text{ g}$ ($249.9\\text{ g}$).',
          marks: 2,
        },
        {
          pointId: 'm4-b1',
          requirement:
            'Computes $P(M < 245)$ with $M \\sim \\mathrm{N}(250, 6.15^2)$ via `normcdf(-1E99, 245, 250, 6.15)` $= 0.20810... \\approx 0.208$.',
          marks: 2,
        },
        {
          pointId: 'm4-b2',
          requirement:
            'Defines binomial variable $X \\sim \\mathrm{B}(12, 0.2081)$ and rewrites $P(X \\ge 3) = 1 - P(X \\le 2) = 1 - 0.5298 = 0.470$ ($0.4702$, to 3 s.f.).',
          marks: 4,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Standardize Both Tail Probabilities to Find mu and sigma',
          explanationMarkdown:
            'Notice that $P(M > 260) = 0.05$ means the left-tail area is $P(M < 260) = 0.95$, giving $z_2 = 1.6449$, while $P(M < 242) = 0.10$ gives $z_1 = -1.2816$. Subtracting $(260 - \\mu) - (242 - \\mu) = (1.6449 - (-1.2816))\\sigma$ yields $\\sigma = 6.15\\text{ g}$ and $\\mu = 250\\text{ g}$.',
        },
        {
          stepNumber: 2,
          title: 'Transition from Continuous Normal to Discrete Binomial X ~ B(12, p)',
          explanationMarkdown:
            'Once $p = P(M < 245) = 0.2081$ is found, the count of underweight bags in $12$ independent trials follows $X \\sim \\mathrm{B}(12, 0.2081)$. Use $P(X \\ge 3) = 1 - P(X \\le 2) = 1 - \\mathrm{binomcdf}(12, 0.2081, 2) = 1 - 0.5298 = 0.470$ ($0.4702$).',
        },
      ],
      commonPitfalls: [
        'Computing $1 - P(X \\le 3)$ instead of $1 - P(X \\le 2)$ for "at least 3" ($X \\ge 3$).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'math-q5-p1-diff-calc',
      subjectSlug: 'math',
      topicId: 'math-sl-5a',
      paper: 'Paper 1',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 8,
      commandTerm: 'Find',
      stemMarkdown:
        '**Paper 1 (Non-Calculator):** Let $f(x) = x e^{2x}$ for $x \\in \\mathbb{R}$.\n\n**a.** **Find** $f\'(x)$ and $f\'\'(x)$ **[4 marks]**.\n**b.** Hence **find** the exact coordinates of the stationary point and the point of inflection on the graph of $f$ **[4 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm5-a1',
          requirement:
            'Applies product and chain rules: $f\'(x) = (1)e^{2x} + x(2e^{2x}) = e^{2x}(2x + 1)$.',
          marks: 2,
        },
        {
          pointId: 'm5-a2',
          requirement:
            'Differentiates again: $f\'\'(x) = 2e^{2x}(2x + 1) + e^{2x}(2) = 2e^{2x}(2x + 2) = 4e^{2x}(x + 1)$.',
          marks: 2,
        },
        {
          pointId: 'm5-b1',
          requirement:
            'Sets $f\'(x) = 0 \\implies 2x + 1 = 0$ (since $e^{2x} > 0$) $\\implies x = -\\frac{1}{2}$, giving stationary point $\\left(-\\frac{1}{2}, -\\frac{1}{2e}\\right)$.',
          marks: 2,
        },
        {
          pointId: 'm5-b2',
          requirement:
            'Sets $f\'\'(x) = 0 \\implies x + 1 = 0 \\implies x = -1$ (where $f\'\'$ changes sign from $-$ to $+$) and finds inflection point $\\left(-1, -\\frac{1}{e^2}\\right)$.',
          marks: 2,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Factor Out e^{2x} Immediately After Using the Product Rule',
          explanationMarkdown:
            'Factoring $f\'(x) = e^{2x}(2x + 1)$ and $f\'\'(x) = 4e^{2x}(x + 1)$ makes solving $f\'(x) = 0$ and $f\'\'(x) = 0$ instantaneous because $e^{2x} > 0$ for all $x \\in \\mathbb{R}$.',
        },
        {
          stepNumber: 2,
          title: 'Evaluate Exact y-Coordinates in Terms of e',
          explanationMarkdown:
            'At $x = -\\frac{1}{2}$, $y = -\\frac{1}{2}e^{-1} = -\\frac{1}{2e}$. At $x = -1$, $y = -1 \\cdot e^{-2} = -\\frac{1}{e^2}$.',
        },
      ],
      commonPitfalls: [
        'Giving only the $x$-coordinate when the question asks for the "coordinates" $(x, y)$.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'math-q6-p2-kinematics',
      subjectSlug: 'math',
      topicId: 'math-sl-5b',
      paper: 'Paper 2',
      questionType: 'extended_response',
      calculatorPolicy: 'gdc_required',
      difficulty: 'standard',
      marks: 9,
      commandTerm: 'Find',
      stemMarkdown:
        '**Paper 2 (GDC Required):** A particle moves along a straight line so that its velocity $v\\text{ m s}^{-1}$ at time $t$ seconds ($0 \\le t \\le 5$) is given by:\n\n$$v(t) = 6\\sin(t) - 2t + 1$$\n\n**a.** **Find** the time $t > 0$ when the particle first comes to instantaneous rest **[2 marks]**.\n**b.** **Find** the acceleration of the particle at $t = 2\\text{ s}$ **[2 marks]**.\n**c.** **Find** (i) the displacement of the particle and (ii) the **total distance travelled** by the particle during the first $5$ seconds ($0 \\le t \\le 5$) **[5 marks]**.',
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'm6-a',
          requirement:
            'Sets $v(t) = 0$ on $[0, 5]$ using GDC root finder (in radians!): $t = 2.44\\text{ s}$ ($2.4389...\\text{ s}$).',
          marks: 2,
        },
        {
          pointId: 'm6-b',
          requirement:
            'Evaluates $a(2) = v\'(2) = 6\\cos(2) - 2 = -4.497... \\approx -4.50\\text{ m s}^{-2}$.',
          marks: 2,
        },
        {
          pointId: 'm6-c1',
          requirement:
            'Writes and evaluates displacement: $\\Delta s = \\int_0^5 v(t)\\,\\mathrm{d}t = -15.7\\text{ m}$ ($-15.702...\\text{ m}$).',
          marks: 2,
        },
        {
          pointId: 'm6-c2',
          requirement:
            'Writes definite integral with absolute value for total distance: $d = \\int_0^5 |v(t)|\\,\\mathrm{d}t = 29.8\\text{ m}$ ($29.841...\\text{ m}$).',
          marks: 3,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Write Out the Calculus Setup Explicitly Before Using GDC',
          explanationMarkdown:
            'Even on Paper 2, IB markschemes award **M1 (Method)** marks for writing $v(t) = 0$, $a(2) = v\'(2)$, $\\Delta s = \\int_0^5 v(t)\\,\\mathrm{d}t$, and $d = \\int_0^5 |v(t)|\\,\\mathrm{d}t$ before stating the 3 s.f. numerical answer.',
        },
        {
          stepNumber: 2,
          title: 'Distinguish Displacement from Total Distance',
          explanationMarkdown:
            'Because the particle reverses direction at $t \\approx 2.44\\text{ s}$, net displacement ($-15.7\\text{ m}$) cancels positive and negative motion, whereas $\\int_0^5 |v(t)|\\,\\mathrm{d}t = 29.8\\text{ m}$ sums both legs of the trip.',
        },
      ],
      commonPitfalls: [
        'Having the GDC set to Degrees instead of Radians when evaluating $\\sin(t)$ in calculus.',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'math-ref-booklet-t1t2',
      subjectSlug: 'math',
      toolType: 'formula_booklet',
      category: 'Topics 1 & 2 · Algebra & Functions',
      title: 'SL Formula Booklet Reference: Topics 1 & 2 + Must-Memorize Omissions',
      codeOrSymbol: 'SL 1.2–2.7',
      payload: {
        formulas: [
          {
            code: 'SL 1.2',
            name: 'Arithmetic Sequence & Series',
            latex: 'u_n = u_1 + (n-1)d, \\qquad S_n = \\frac{n}{2}(2u_1 + (n-1)d) = \\frac{n}{2}(u_1 + u_n)',
            inBooklet: true,
            notes: 'Use when consecutive terms have a constant difference $d = u_n - u_{n-1}$.',
          },
          {
            code: 'SL 1.3 & 1.8',
            name: 'Geometric Sequence, Finite Series & Infinite Series',
            latex: 'u_n = u_1 r^{n-1}, \\quad S_n = \\frac{u_1(r^n - 1)}{r - 1}, \\quad S_\\infty = \\frac{u_1}{1 - r} \\; (|r| < 1)',
            inBooklet: true,
            notes: 'Infinite series converges if and only if $-1 < r < 1$.',
          },
          {
            code: 'SL 1.9',
            name: 'Binomial Theorem ($n \\in \\mathbb{Z}^+$)',
            latex: '(a+b)^n = a^n + \\binom{n}{1}a^{n-1}b + \\dots + \\binom{n}{r}a^{n-r}b^r + \\dots + b^n, \\quad \\binom{n}{r} = \\frac{n!}{r!(n-r)!}',
            inBooklet: true,
            notes: 'General $(r+1)$-th term is $T_{r+1} = \\binom{n}{r}a^{n-r}b^r$.',
          },
          {
            code: 'SL 2.6–2.7',
            name: 'Quadratic Axis of Symmetry, Formula & Discriminant',
            latex: 'x = -\\frac{b}{2a}, \\qquad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\qquad \\Delta = b^2 - 4ac',
            inBooklet: true,
            notes: '$\\Delta > 0$: 2 distinct real roots; $\\Delta = 0$: 1 repeated root; $\\Delta < 0$: no real roots.',
          },
          {
            code: 'SL 2.8 (OMISSION)',
            name: 'Rational Function Asymptotes (NOT in Formula Booklet)',
            latex: 'f(x) = \\frac{ax + b}{cx + d} \\implies \\text{VA: } x = -\\frac{d}{c}, \\quad \\text{HA: } y = \\frac{a}{c}',
            inBooklet: false,
            notes: 'Must be memorized for Paper 1!',
          },
        ],
      },
    },
    {
      id: 'math-ref-booklet-t3t4',
      subjectSlug: 'math',
      toolType: 'formula_booklet',
      category: 'Topics 3 & 4 · Trig & Statistics',
      title: 'SL Formula Booklet Reference: Topics 3 & 4 + Exact Trig Table',
      codeOrSymbol: 'SL 3.1–4.12',
      payload: {
        formulas: [
          {
            code: 'SL 3.2 & 3.4',
            name: 'Sine Rule, Cosine Rule, Triangle Area & Radian Sector',
            latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B}, \\quad c^2 = a^2 + b^2 - 2ab\\cos C, \\quad A = \\frac{1}{2}ab\\sin C, \\quad l = r\\theta, \\quad A_{\\text{sec}} = \\frac{1}{2}r^2\\theta',
            inBooklet: true,
            notes: 'In $l = r\\theta$ and $A = \\frac{1}{2}r^2\\theta$, $\\theta$ must be in radians.',
          },
          {
            code: 'SL 3.6',
            name: 'Pythagorean & Double-Angle Identities',
            latex: '\\cos^2\\theta + \\sin^2\\theta = 1, \\quad \\sin 2\\theta = 2\\sin\\theta\\cos\\theta, \\quad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta',
            inBooklet: true,
            notes: 'Pick the form of $\\cos 2\\theta$ that produces a single trig ratio in quadratic equations.',
          },
          {
            code: 'SL 4.5–4.12',
            name: 'Conditional Probability, Binomial & Normal Standardization',
            latex: 'P(A\\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad E(X) = np, \\quad \\mathrm{Var}(X) = np(1-p), \\quad z = \\frac{x - \\mu}{\\sigma}',
            inBooklet: true,
            notes: 'For independent events, $P(A \\cap B) = P(A)P(B)$.',
          },
        ],
      },
    },
    {
      id: 'math-ref-booklet-t5',
      subjectSlug: 'math',
      toolType: 'formula_booklet',
      category: 'Topic 5 · Calculus & Kinematics',
      title: 'SL Formula Booklet Reference: Topic 5 Differential & Integral Calculus',
      codeOrSymbol: 'SL 5.3–5.11',
      payload: {
        formulas: [
          {
            code: 'SL 5.3 & 5.6',
            name: 'Derivatives, Chain Rule, Product Rule & Quotient Rule',
            latex: '(x^n)\' = nx^{n-1}, \\quad (e^x)\' = e^x, \\quad (\\ln x)\' = \\frac{1}{x}, \\quad (uv)\' = uv\' + u\'v, \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{vu\' - uv\'}{v^2}',
            inBooklet: true,
            notes: '$(\\sin x)\' = \\cos x$ and $(\\cos x)\' = -\\sin x$ (radians only!).',
          },
          {
            code: 'SL 5.5, 5.9 & 5.11',
            name: 'Standard Integrals, Area Between Curves & Kinematics Distance',
            latex: '\\int x^n\\,\\mathrm{d}x = \\frac{x^{n+1}}{n+1}+C, \\quad \\int \\frac{1}{x}\\,\\mathrm{d}x = \\ln|x|+C, \\quad A = \\int_a^b |y|\\,\\mathrm{d}x, \\quad d = \\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t',
            inBooklet: true,
            notes: 'Displacement is $\\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$; total distance requires $|v(t)|$.',
          },
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'math-deck-nonbooklet-calc',
      subjectSlug: 'math',
      topicId: 'math-sl-3',
      title: 'Math AA SL Must-Memorize Non-Booklet Identities & Calculus Traps',
      description:
        'Exact unit circle values, rational asymptotes, reverse chain rule integrals, and GDC probability/kinematics traps not printed in the SL Formula Booklet.',
      cards: [
        {
          id: 'math-fc-1',
          frontMarkdown:
            'What are the exact values of $\\sin\\theta$, $\\cos\\theta$, and $\\tan\\theta$ for $\\theta = \\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}$?',
          backMarkdown:
            '- **$\\frac{\\pi}{6}$ ($30^\\circ$):** $\\sin = \\frac{1}{2}$, $\\cos = \\frac{\\sqrt{3}}{2}$, $\\tan = \\frac{\\sqrt{3}}{3}$\n- **$\\frac{\\pi}{4}$ ($45^\\circ$):** $\\sin = \\frac{\\sqrt{2}}{2}$, $\\cos = \\frac{\\sqrt{2}}{2}$, $\\tan = 1$\n- **$\\frac{\\pi}{3}$ ($60^\\circ$):** $\\sin = \\frac{\\sqrt{3}}{2}$, $\\cos = \\frac{1}{2}$, $\\tan = \\sqrt{3}$',
          tags: ['Topic 3', 'Paper 1', 'Exact Values'],
        },
        {
          id: 'math-fc-2',
          frontMarkdown:
            'What are the vertical and horizontal asymptotes of $f(x) = \\frac{ax + b}{cx + d}$ *(not in Formula Booklet)*?',
          backMarkdown:
            '- **Vertical Asymptote:** Set denominator $cx + d = 0 \\implies x = -\\frac{d}{c}$\n- **Horizontal Asymptote:** Ratio of leading coefficients $\\implies y = \\frac{a}{c}$',
          tags: ['Topic 2', 'Rational Functions', 'Paper 1'],
        },
        {
          id: 'math-fc-3',
          frontMarkdown:
            'What is the necessary and sufficient condition for $x = x_0$ to be a **point of inflection** of $y = f(x)$?',
          backMarkdown:
            '**Both** $f\'\'(x_0) = 0$ **and** $f\'\'(x)$ must **change sign** (concavity changes from concave up to concave down, or vice versa) across $x = x_0$.',
          tags: ['Topic 5', 'Calculus', 'Inflection'],
        },
        {
          id: 'math-fc-4',
          frontMarkdown:
            'Contrast **displacement** and **total distance travelled** on $[t_1, t_2]$ given velocity $v(t)$.',
          backMarkdown:
            '- **Displacement:** $\\Delta s = \\int_{t_1}^{t_2} v(t)\\,\\mathrm{d}t$\n- **Total Distance Travelled:** $d = \\int_{t_1}^{t_2} |v(t)|\\,\\mathrm{d}t$ (on Paper 1, find where $v(t) = 0$ and split the integral!).',
          tags: ['Topic 5', 'Kinematics', 'Integration'],
        },
        {
          id: 'math-fc-5',
          frontMarkdown:
            'How do you evaluate $P(X \\ge k)$ and $P(X > k)$ on a GDC for a binomial random variable $X \\sim \\mathrm{B}(n, p)$?',
          backMarkdown:
            'Since `binomcdf(n, p, c)` computes $P(X \\le c)$:\n- $P(X \\ge k) = 1 - P(X \\le k - 1)$\n- $P(X > k) = 1 - P(X \\le k)$',
          tags: ['Topic 4', 'Binomial', 'Paper 2'],
        },
      ],
    },
  ],
};
