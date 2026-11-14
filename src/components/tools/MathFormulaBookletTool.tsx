'use client';

import React, { useState, useMemo } from 'react';
import { Star, Search, X } from 'lucide-react';
import { KaTeXText } from '@/components/math/KaTeXText';

type MathTopicFilter =
  | 'ALL'
  | 'Topic 1: Number & Algebra'
  | 'Topic 2: Functions'
  | 'Topic 3: Geometry & Trig'
  | 'Topic 4: Stats & Probability'
  | 'Topic 5: Calculus';

interface MathFormulaEntry {
  id: string;
  topic: Exclude<MathTopicFilter, 'ALL'>;
  subtopicCode: string;
  title: string;
  inBooklet: boolean;
  paperTag: 'Paper 1 & 2' | 'Paper 1 Non-Calc Focus' | 'Paper 2 GDC Focus';
  formulaLatex: string;
  variableTrap: string;
  workedExampleQuestion: string;
  workedExampleSolution: string;
}

const MATH_FORMULAS: MathFormulaEntry[] = [
  {
    id: 'arith-seq',
    topic: 'Topic 1: Number & Algebra',
    subtopicCode: 'SL 1.2',
    title: 'Arithmetic Sequence $n$th Term & Sum of $n$ Terms',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$u_n = u_1 + (n - 1)d \\qquad S_n = \\frac{n}{2}\\left(2u_1 + (n - 1)d\\right) = \\frac{n}{2}(u_1 + u_n)$$',
    variableTrap:
      'Always check whether the question asks for the $n$th term $u_n$ or the cumulative sum $S_n$. Also remember $u_n = S_n - S_{n-1}$ for $n \\ge 2$ (often tested when a quadratic expression for $S_n$ is given!).',
    workedExampleQuestion:
      'An arithmetic sequence has $u_3 = 11$ and $S_{10} = 205$. Find $u_1$ and the common difference $d$.',
    workedExampleSolution:
      '`M1` Set up simultaneous equations: $u_1 + 2d = 11$ and $5(2u_1 + 9d) = 205 \\implies 2u_1 + 9d = 41$.\n`M1` Multiply first equation by $2$: $2u_1 + 4d = 22$. Subtract to obtain $5d = 19 \\implies d = 3.8$.\n`A1` Substitute back: $u_1 = 11 - 2(3.8) = 3.4$.',
  },
  {
    id: 'geom-seq-inf',
    topic: 'Topic 1: Number & Algebra',
    subtopicCode: 'SL 1.3 & 1.8',
    title: 'Geometric Sequence, Finite Sum & Infinite Convergent Series',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$u_n = u_1 r^{n-1} \\qquad S_n = \\frac{u_1(r^n - 1)}{r - 1} \\qquad S_\\infty = \\frac{u_1}{1 - r},\\quad |r| < 1$$',
    variableTrap:
      'To justify convergence of $S_\\infty$ on Paper 1/2, you MUST explicitly state the inequality $|r| < 1$ (or $-1 < r < 1$) and show the numeric value of $r$ to earn the reasoning mark `R1`.',
    workedExampleQuestion:
      'A geometric series has first term $u_1 = 18$ and sum to infinity $S_\\infty = 27$. Find the common ratio $r$ and $u_4$.',
    workedExampleSolution:
      '`M1` Substitute into $S_\\infty$: $27 = \\frac{18}{1 - r} \\implies 1 - r = \\frac{18}{27} = \\frac{2}{3}$.\n`A1` $r = \\frac{1}{3}$ (satisfies $|r| < 1$).\n`A1` $u_4 = u_1 r^3 = 18 \\times \\left(\\frac{1}{3}\\right)^3 = \\frac{18}{27} = \\frac{2}{3}$.',
  },
  {
    id: 'compound-interest',
    topic: 'Topic 1: Number & Algebra',
    subtopicCode: 'SL 1.4',
    title: 'Compound Interest & Depreciation',
    inBooklet: true,
    paperTag: 'Paper 2 GDC Focus',
    formulaLatex:
      '$$FV = PV \\times \\left(1 + \\frac{r}{100k}\\right)^{kn}$$',
    variableTrap:
      'Check compounding frequency $k$ ($k=12$ monthly, $k=4$ quarterly, $k=2$ semi-annually) and keep $r$ as a percentage (e.g. $3.6\\% \\implies r = 3.6$). Annual depreciation $FV = PV(1 - \\frac{r}{100})^n$ is NOT printed separately.',
    workedExampleQuestion:
      'An investment of $4000\\text{ EUR}$ earns $3.6\\%$ nominal annual interest compounded monthly. Find its value after $5$ years to the nearest euro.',
    workedExampleSolution:
      '`M1` Identify $PV = 4000$, $r = 3.6$, $k = 12$, $n = 5$: $FV = 4000\\left(1 + \\frac{3.6}{1200}\\right)^{60}$.\n`A1` $FV = 4000(1.003)^{60} = 4787.58\\dots \\approx 4788\\text{ EUR}$.',
  },
  {
    id: 'log-change-base',
    topic: 'Topic 1: Number & Algebra',
    subtopicCode: 'SL 1.7',
    title: 'Laws of Logarithms & Change of Base Formula',
    inBooklet: true,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y, \\quad \\log_a x^m = m\\log_a x, \\quad \\log_a x = \\frac{\\log_b x}{\\log_b a}$$',
    variableTrap:
      '$\\log_a(x + y)$ CANNOT be split! Also, when solving logarithmic equations, always check domain restrictions ($x > 0$ inside every original log argument) and reject extraneous negative roots.',
    workedExampleQuestion:
      'Solve $\\log_2 x + \\log_4 x = 6$ without a calculator.',
    workedExampleSolution:
      '`M1` Apply change of base to base $2$: $\\log_4 x = \\frac{\\log_2 x}{\\log_2 4} = \\frac{\\log_2 x}{2}$.\n`M1` Combine terms: $\\log_2 x + \\frac{1}{2}\\log_2 x = 6 \\implies \\frac{3}{2}\\log_2 x = 6 \\implies \\log_2 x = 4$.\n`A1` $x = 2^4 = 16$.',
  },
  {
    id: 'binomial-theorem',
    topic: 'Topic 1: Number & Algebra',
    subtopicCode: 'SL 1.9',
    title: 'Binomial Theorem General Term $(a + b)^n$',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$(a + b)^n = a^n + {}^nC_1 a^{n-1}b + \\dots + {}^nC_r a^{n-r}b^r + \\dots + b^n, \\qquad {}^nC_r = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}$$',
    variableTrap:
      'Include the negative sign inside $b$ when expanding $(a - b)^n = (a + (-b))^n$, and remember to raise the coefficient inside $b$ to the power $r$ as well: e.g. $(-2x)^r = (-2)^r x^r$.',
    workedExampleQuestion:
      'Find the term independent of $x$ in the expansion of $\\left(2x^2 - \\frac{1}{x}\\right)^6$.',
    workedExampleSolution:
      '`M1` Write general term: $T_{r+1} = \\binom{6}{r}(2x^2)^{6-r}(-x^{-1})^r = \\binom{6}{r} 2^{6-r} (-1)^r x^{12 - 2r - r}$.\n`M1` Set power of $x$ to zero: $12 - 3r = 0 \\implies r = 4$.\n`A1` Coefficient $= \\binom{6}{4} 2^2 (-1)^4 = 15 \\times 4 \\times 1 = 60$.',
  },
  {
    id: 'linear-equations',
    topic: 'Topic 2: Functions',
    subtopicCode: 'SL 2.1',
    title: 'Gradient & Forms of a Straight Line',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$m = \\frac{y_2 - y_1}{x_2 - x_1}, \\qquad y = mx + c, \\qquad ax + by + d = 0, \\qquad y - y_1 = m(x - x_1)$$',
    variableTrap:
      'Parallel ($m_1 = m_2$) and perpendicular ($m_1 m_2 = -1$, i.e. $m_2 = -\\frac{1}{m_1}$) rules are NOT printed in the booklet! Remember perpendicular bisectors pass through the segment midpoint $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$.',
    workedExampleQuestion:
      'Find the equation of the perpendicular bisector of segment $AB$ joining $A(1, 2)$ and $B(5, 10)$ in the form $ax + by + d = 0$.',
    workedExampleSolution:
      '`M1` Midpoint $M = \\left(\\frac{1+5}{2}, \\frac{2+10}{2}\\right) = (3, 6)$, gradient $m_{AB} = \\frac{10 - 2}{5 - 1} = 2$.\n`M1` Perpendicular gradient $m_\\perp = -\\frac{1}{2}$, so $y - 6 = -\\frac{1}{2}(x - 3)$.\n`A1` Multiply by $2$: $2y - 12 = -x + 3 \\implies x + 2y - 15 = 0$.',
  },
  {
    id: 'quad-vertex-discriminant',
    topic: 'Topic 2: Functions',
    subtopicCode: 'SL 2.6 & 2.7',
    title: 'Quadratic Formula, Axis of Symmetry & Discriminant $\\Delta$',
    inBooklet: true,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$x = -\\frac{b}{2a}, \\qquad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\;(a \\ne 0), \\qquad \\Delta = b^2 - 4ac$$',
    variableTrap:
      '**Must Memorize (NOT in Booklet):** Vertex form $a(x - h)^2 + k$ and discriminant interpretations: $\\Delta > 0 \\iff 2$ distinct real roots; $\\Delta = 0 \\iff 1$ repeated real root (tangent to $x$-axis); $\\Delta < 0 \\iff$ no real roots.',
    workedExampleQuestion:
      'Find the values of $k$ for which $kx^2 + (k - 3)x + 1 = 0$ has two equal real roots.',
    workedExampleSolution:
      '`M1` Set $\\Delta = b^2 - 4ac = 0$: $(k - 3)^2 - 4(k)(1) = 0$.\n`M1` Expand and factorize: $k^2 - 6k + 9 - 4k = k^2 - 10k + 9 = (k - 1)(k - 9) = 0$.\n`A1` Therefore $k = 1$ or $k = 9$ (both satisfy $k \\ne 0$, keeping the equation quadratic).',
  },
  {
    id: 'rational-asymptotes',
    topic: 'Topic 2: Functions',
    subtopicCode: 'SL 2.8',
    title: 'Homographic Rational Function Asymptotes (NOT in Booklet!)',
    inBooklet: false,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$f(x) = \\frac{ax + b}{cx + d} \\implies \\text{Vertical Asymptote: } x = -\\frac{d}{c}, \\quad \\text{Horizontal Asymptote: } y = \\frac{a}{c}$$',
    variableTrap:
      'NOT in the IB Formula Booklet! You must also know that the inverse $f^{-1}(x)$ swaps the vertical and horizontal asymptotes: domain of $f^{-1}$ is $x \\ne \\frac{a}{c}$ and range is $y \\ne -\\frac{d}{c}$.',
    workedExampleQuestion:
      'Let $f(x) = \\frac{6x - 5}{2x + 4}$ for $x \\ne -2$. State the equations of the vertical and horizontal asymptotes.',
    workedExampleSolution:
      '`A1` Vertical asymptote where denominator $= 0$: $2x + 4 = 0 \\implies x = -2$.\n`A1` Horizontal asymptote from leading ratio: $y = \\frac{6}{2} \\implies y = 3$ (Must be written as equations $x = -2$ and $y = 3$, not just numbers!).',
  },
  {
    id: 'sine-cosine-triangle',
    topic: 'Topic 3: Geometry & Trig',
    subtopicCode: 'SL 3.2',
    title: 'Sine Rule, Cosine Rule & Area of a Triangle',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}, \\qquad c^2 = a^2 + b^2 - 2ab\\cos C, \\qquad A = \\frac{1}{2}ab\\sin C$$',
    variableTrap:
      'Check degree vs radian mode on your GDC! When using the Sine Rule to find an angle opposite a shorter side, check the ambiguous case ($180^\\circ - \\theta$) to see if an obtuse triangle also fits.',
    workedExampleQuestion:
      'In $\\triangle ABC$, $a = 7\\text{ cm}$, $b = 10\\text{ cm}$, and $C = 60^\\circ$. Find the exact length of side $c$.',
    workedExampleSolution:
      '`M1` Apply Cosine Rule: $c^2 = 7^2 + 10^2 - 2(7)(10)\\cos 60^\\circ$.\n`A1` $c^2 = 49 + 100 - 140(0.5) = 79 \\implies c = \\sqrt{79}\\text{ cm}$.',
  },
  {
    id: 'radian-arc-sector',
    topic: 'Topic 3: Geometry & Trig',
    subtopicCode: 'SL 3.4',
    title: 'Arc Length & Area of a Sector (Radians)',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$l = r\\theta \\qquad A_{\\text{sector}} = \\frac{1}{2}r^2\\theta$$',
    variableTrap:
      'Angle $\\theta$ MUST be in **radians**! Note that circular segment area $A_{\\text{segment}} = A_{\\text{sector}} - A_{\\text{triangle}} = \\frac{1}{2}r^2(\\theta - \\sin\\theta)$ is **NOT printed in the Formula Booklet** and must be derived.',
    workedExampleQuestion:
      'A circle of radius $r = 8\\text{ cm}$ has a chord subtending an angle of $\\theta = 1.2\\text{ rad}$ at the centre. Find the area of the minor segment.',
    workedExampleSolution:
      '`M1` $A_{\\text{sector}} = \\frac{1}{2}(8)^2(1.2) = 38.4\\text{ cm}^2$ and $A_{\\text{triangle}} = \\frac{1}{2}(8)^2\\sin(1.2) = 32\\sin(1.2)$.\n`A1` $A_{\\text{segment}} = 38.4 - 29.825 = 8.57\\text{ cm}^2$ (3 s.f., GDC in RAD mode).',
  },
  {
    id: 'trig-pythag-double',
    topic: 'Topic 3: Geometry & Trig',
    subtopicCode: 'SL 3.6',
    title: 'Pythagorean Identity & Double-Angle Identities',
    inBooklet: true,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$\\cos^2\\theta + \\sin^2\\theta = 1 \\qquad \\sin 2\\theta = 2\\sin\\theta\\cos\\theta \\qquad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$',
    variableTrap:
      'When given $\\sin\\theta = \\frac{3}{5}$ for an **obtuse** angle ($\\frac{\\pi}{2} < \\theta < \\pi$), $\\cos\\theta$ is NEGATIVE ($\\cos\\theta = -\\frac{4}{5}$)! Forgetting the CAST quadrant sign loses `A1` on both $\\cos\\theta$ and $\\sin 2\\theta$.',
    workedExampleQuestion:
      'Given $\\sin\\theta = \\frac{2}{3}$ where $\\frac{\\pi}{2} < \\theta < \\pi$, find the exact value of $\\sin 2\\theta$ and $\\cos 2\\theta$.',
    workedExampleSolution:
      '`M1` In Quadrant II, $\\cos\\theta = -\\sqrt{1 - \\left(\\frac{2}{3}\\right)^2} = -\\frac{\\sqrt{5}}{3}$.\n`A1` $\\sin 2\\theta = 2\\left(\\frac{2}{3}\\right)\\left(-\\frac{\\sqrt{5}}{3}\\right) = -\\frac{4\\sqrt{5}}{9}$.\n`A1` $\\cos 2\\theta = 1 - 2\\left(\\frac{2}{3}\\right)^2 = 1 - \\frac{8}{9} = \\frac{1}{9}$.',
  },
  {
    id: 'linear-regression-rule',
    topic: 'Topic 4: Stats & Probability',
    subtopicCode: 'SL 4.4',
    title: 'Mean Point $(\\bar{x}, \\bar{y})$ on Regression Line (NOT in Booklet!)',
    inBooklet: false,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$\\text{The regression line } y = ax + b \\text{ ALWAYS passes through the mean point } (\\bar{x}, \\bar{y}): \\quad \\bar{y} = a\\bar{x} + b$$',
    variableTrap:
      'NOT in the Formula Booklet! Paper 1 non-calculator questions frequently give $\\bar{x}$, $\\bar{y}$, and the slope $a$, asking you to find the $y$-intercept $b$ using $\\bar{y} = a\\bar{x} + b$. Also remember only the $y$-on-$x$ line can predict $y$ from $x$.',
    workedExampleQuestion:
      'For a bivariate dataset, $\\bar{x} = 12$, $\\bar{y} = 30$, and the regression line of $y$ on $x$ has gradient $a = 1.5$. Find the equation of the regression line.',
    workedExampleSolution:
      '`M1` Substitute $(\\bar{x}, \\bar{y}) = (12, 30)$ into $y = 1.5x + b$: $30 = 1.5(12) + b$.\n`A1` $b = 30 - 18 = 12 \\implies y = 1.5x + 12$.',
  },
  {
    id: 'conditional-indep-prob',
    topic: 'Topic 4: Stats & Probability',
    subtopicCode: 'SL 4.6',
    title: 'Conditional Probability, Combined Events & Independence vs Mutually Exclusive',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$\\mathrm{P}(A \\mid B) = \\frac{\\mathrm{P}(A \\cap B)}{\\mathrm{P}(B)}, \\quad \\mathrm{P}(A \\cup B) = \\mathrm{P}(A) + \\mathrm{P}(B) - \\mathrm{P}(A \\cap B), \\quad \\text{Indep: } \\mathrm{P}(A \\cap B) = \\mathrm{P}(A)\\mathrm{P}(B)$$',
    variableTrap:
      '**Never confuse Independent with Mutually Exclusive!** Mutually exclusive means $\\mathrm{P}(A \\cap B) = 0$ (NOT in booklet — must memorize!), whereas Independent means $\\mathrm{P}(A \\cap B) = \\mathrm{P}(A)\\mathrm{P}(B)$.',
    workedExampleQuestion:
      'Events $A$ and $B$ are independent with $P(A) = 0.4$ and $P(A \\cup B) = 0.7$. Find $P(B)$.',
    workedExampleSolution:
      '`M1` Since $A, B$ are independent, $P(A \\cap B) = 0.4\\,P(B)$.\n`M1` Substitute into combined events formula: $0.7 = 0.4 + P(B) - 0.4\\,P(B) \\implies 0.3 = 0.6\\,P(B)$.\n`A1` $P(B) = \\frac{0.3}{0.6} = 0.5$.',
  },
  {
    id: 'binomial-dist',
    topic: 'Topic 4: Stats & Probability',
    subtopicCode: 'SL 4.8',
    title: 'Binomial Distribution Mean & Variance',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$X \\sim \\mathrm{B}(n, p) \\implies \\mathrm{E}(X) = np, \\qquad \\mathrm{Var}(X) = np(1 - p)$$',
    variableTrap:
      'The PMF $\\mathrm{P}(X = r) = {}^nC_r p^r(1 - p)^{n-r}$ is **NOT printed in the Formula Booklet**! Also remember standard deviation is $\\sigma = \\sqrt{\\mathrm{Var}(X)}$ and on GDC `binomCdf` gives $\\mathrm{P}(X \\le k)$ (so $\\mathrm{P}(X \\ge k) = 1 - \\mathrm{P}(X \\le k - 1)$).',
    workedExampleQuestion:
      'Let $X \\sim \\mathrm{B}(n, p)$ with $\\mathrm{E}(X) = 6$ and $\\mathrm{Var}(X) = 4.2$. Find $n$ and $p$.',
    workedExampleSolution:
      '`M1` Divide variance by mean: $\\frac{np(1 - p)}{np} = 1 - p = \\frac{4.2}{6} = 0.7 \\implies p = 0.3$.\n`A1` Substitute into $np = 6$: $0.3n = 6 \\implies n = 20$.',
  },
  {
    id: 'normal-z-score',
    topic: 'Topic 4: Stats & Probability',
    subtopicCode: 'SL 4.9 & 4.12',
    title: 'Standard Normal $Z$-Transformation $Z = \\frac{X - \\mu}{\\sigma}$',
    inBooklet: true,
    paperTag: 'Paper 2 GDC Focus',
    formulaLatex:
      '$$X \\sim \\text{N}(\\mu, \\sigma^2) \\implies Z = \\frac{X - \\mu}{\\sigma} \\sim \\text{N}(0, 1)$$',
    variableTrap:
      'Whenever $\\mu$ or $\\sigma$ is unknown, you MUST standardize to $Z = \\frac{x - \\mu}{\\sigma}$ and use `invNorm(area_to_left, 0, 1)` on your GDC. Remember IB notation $\\text{N}(\\mu, \\sigma^2)$ gives the variance $\\sigma^2$, so take the square root to get $\\sigma$!',
    workedExampleQuestion:
      'Let $X \\sim \\text{N}(\\mu, 4^2)$ with $P(X > 25) = 0.15$. Find $\\mu$ to 3 significant figures.',
    workedExampleSolution:
      '`M1` $P(X < 25) = 1 - 0.15 = 0.85 \\implies z = \\text{invNorm}(0.85, 0, 1) = 1.0364$.\n`M1` Set up $Z$-equation: $\\frac{25 - \\mu}{4} = 1.0364$.\n`A1` $\\mu = 25 - 4(1.0364) = 20.9$ (3 s.f.).',
  },
  {
    id: 'standard-deriv-int',
    topic: 'Topic 5: Calculus',
    subtopicCode: 'SL 5.3, 5.5, 5.6 & 5.10',
    title: 'Standard Derivatives & Standard Integrals',
    inBooklet: true,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$(\\sin x)\' = \\cos x, \\; (\\cos x)\' = -\\sin x, \\; (e^x)\' = e^x, \\; (\\ln x)\' = \\frac{1}{x} \\qquad \\int \\frac{1}{x}\\,\\text{d}x = \\ln|x| + C, \\; \\int \\sin x\\,\\text{d}x = -\\cos x + C$$',
    variableTrap:
      'Watch the $\\pm$ sign flip between differentiation and integration of $\\sin x$ and $\\cos x$: $\\int \\cos x\\,\\text{d}x = +\\sin x + C$ whereas $(\\cos x)\' = -\\sin x$. Angle $x$ MUST be in radians!',
    workedExampleQuestion:
      'Evaluate $\\int_1^e \\left(\\frac{2}{x} + \\cos x\\right)\\text{d}x$ in exact form.',
    workedExampleSolution:
      '`M1` Integrate term-by-term: $\\left[2\\ln|x| + \\sin x\\right]_1^e$.\n`A1` Substitute limits: $(2\\ln e + \\sin e) - (2\\ln 1 + \\sin 1) = 2 + \\sin e - \\sin 1$.',
  },
  {
    id: 'chain-product-quotient',
    topic: 'Topic 5: Calculus',
    subtopicCode: 'SL 5.6',
    title: 'Chain Rule, Product Rule & Quotient Rule',
    inBooklet: true,
    paperTag: 'Paper 1 & 2',
    formulaLatex:
      '$$\\frac{\\text{d}y}{\\text{d}x} = \\frac{\\text{d}y}{\\text{d}u}\\frac{\\text{d}u}{\\text{d}x}, \\qquad (uv)\' = u v\' + v u\', \\qquad \\left(\\frac{u}{v}\\right)\' = \\frac{v u\' - u v\'}{v^2}$$',
    variableTrap:
      'In the Quotient Rule numerator, $v u\'$ comes FIRST ($v\\frac{\\text{d}u}{\\text{d}x} - u\\frac{\\text{d}v}{\\text{d}x}$). Also remember the Chain Rule inner derivative on $\\frac{\\text{d}}{\\text{d}x}[e^{kx}] = k e^{kx}$ and $\\frac{\\text{d}}{\\text{d}x}[\\ln(g(x))] = \\frac{g\'(x)}{g(x)}$.',
    workedExampleQuestion:
      'Find the gradient of the normal to $y = x^2 e^{3x}$ at $x = 1$.',
    workedExampleSolution:
      '`M1` Product rule: $\\frac{\\text{d}y}{\\text{d}x} = x^2(3e^{3x}) + e^{3x}(2x) = e^{3x}(3x^2 + 2x)$.\n`A1` At $x = 1$, tangent gradient $m_T = e^3(3 + 2) = 5e^3$.\n`A1` Normal gradient $m_N = -\\frac{1}{m_T} = -\\frac{1}{5e^3}$.',
  },
  {
    id: 'tangent-normal-inflection',
    topic: 'Topic 5: Calculus',
    subtopicCode: 'SL 5.4, 5.7 & 5.8',
    title: 'Tangent/Normal Equations & Second-Derivative Tests (NOT in Booklet!)',
    inBooklet: false,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$\\text{Tangent: } y - f(a) = f\'(a)(x - a), \\qquad \\text{Normal: } y - f(a) = -\\frac{1}{f\'(a)}(x - a)$$',
    variableTrap:
      'NOT in the Formula Booklet! Also remember $f\'\'(x) = 0$ alone does NOT prove a point of inflexion (e.g. $y = x^4$ at $x=0$ is a minimum) — you MUST verify that $f\'\'(x)$ **changes sign** across the point!',
    workedExampleQuestion:
      'For $f(x) = x^3 - 3x^2 + 4$, classify the stationary points and verify the point of inflexion.',
    workedExampleSolution:
      '`M1` $f\'(x) = 3x^2 - 6x = 3x(x - 2) = 0 \\implies x = 0, 2$.\n`A1` $f\'\'(x) = 6x - 6$: $f\'\'(0) = -6 < 0 \\implies$ local max at $(0, 4)$; $f\'\'(2) = 6 > 0 \\implies$ local min at $(2, 0)$.\n`A1` $f\'\'(x) = 0 \\implies x = 1$; since $f\'\'(0.5) < 0$ and $f\'\'(1.5) > 0$ (sign change), $(1, 2)$ is a point of inflexion.',
  },
  {
    id: 'kinematics-displacement-distance',
    topic: 'Topic 5: Calculus',
    subtopicCode: 'SL 5.9',
    title: 'Kinematics: Displacement vs Total Distance Travelled',
    inBooklet: true,
    paperTag: 'Paper 2 GDC Focus',
    formulaLatex:
      '$$v(t) = s\'(t), \\quad a(t) = v\'(t), \\quad \\Delta s = \\int_{t_1}^{t_2} v(t)\\,\\text{d}t, \\quad d_{\\text{total}} = \\int_{t_1}^{t_2} |v(t)|\\,\\text{d}t$$',
    variableTrap:
      '"At rest" or "changes direction" means $v(t) = 0$ (with a sign change in $v(t)$). On Paper 1, to find total distance when $v(t)$ changes sign at $t = c$, split the integral at $t = c$ and take absolute values!',
    workedExampleQuestion:
      'A particle moves with velocity $v(t) = 6t - 12\\text{ m s}^{-1}$ for $0 \\le t \\le 5$. Find its displacement and total distance travelled.',
    workedExampleSolution:
      '`M1` Particle changes direction when $6t - 12 = 0 \\implies t = 2\\text{ s}$.\n`A1` Displacement $\\Delta s = \\int_0^5 (6t - 12)\\,\\text{d}t = [3t^2 - 12t]_0^5 = 75 - 60 = 15\\text{ m}$.\n`A1` Total distance $= \\left|\\int_0^2 (6t - 12)\\,\\text{d}t\\right| + \\int_2^5 (6t - 12)\\,\\text{d}t = |-12| + 27 = 39\\text{ m}$.',
  },
  {
    id: 'reverse-chain-inspection',
    topic: 'Topic 5: Calculus',
    subtopicCode: 'SL 5.10',
    title: 'Reverse Chain Rule / Integration by Inspection (NOT in Booklet!)',
    inBooklet: false,
    paperTag: 'Paper 1 Non-Calc Focus',
    formulaLatex:
      '$$\\int g\'(x)\\,[g(x)]^n\\,\\text{d}x = \\frac{[g(x)]^{n+1}}{n+1} + C, \\qquad \\int \\frac{g\'(x)}{g(x)}\\,\\text{d}x = \\ln|g(x)| + C$$',
    variableTrap:
      'NOT explicitly in the IB Formula Booklet! Whenever an integrand is a fraction on Paper 1, immediately check if the numerator is a constant multiple of the derivative of the denominator. Never forget $+C$ on indefinite integrals!',
    workedExampleQuestion:
      'Find $\\int \\frac{6x}{3x^2 + 4}\\,\\text{d}x$.',
    workedExampleSolution:
      '`M1` Notice that $\\frac{\\text{d}}{\\text{d}x}(3x^2 + 4) = 6x$, so the integrand is of the form $\\frac{g\'(x)}{g(x)}$.\n`A1` $\\int \\frac{6x}{3x^2 + 4}\\,\\text{d}x = \\ln(3x^2 + 4) + C$.',
  },
];

const TOPIC_OPTIONS: MathTopicFilter[] = [
  'ALL',
  'Topic 1: Number & Algebra',
  'Topic 2: Functions',
  'Topic 3: Geometry & Trig',
  'Topic 4: Stats & Probability',
  'Topic 5: Calculus',
];

export function MathFormulaBookletTool() {
  const [selectedTopic, setSelectedTopic] = useState<MathTopicFilter>('ALL');
  const [onlyMustMemorize, setOnlyMustMemorize] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'arith-seq': true,
    'rational-asymptotes': true,
  });

  const filteredFormulas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MATH_FORMULAS.filter((item) => {
      if (selectedTopic !== 'ALL' && item.topic !== selectedTopic) return false;
      if (onlyMustMemorize && item.inBooklet) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.topic.toLowerCase().includes(q) &&
        !item.subtopicCode.toLowerCase().includes(q) &&
        !item.paperTag.toLowerCase().includes(q) &&
        !item.variableTrap.toLowerCase().includes(q) &&
        !item.workedExampleQuestion.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [selectedTopic, onlyMustMemorize, searchQuery]);

  const toggleExample = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const mustMemorizeCount = useMemo(
    () => filteredFormulas.filter((f) => !f.inBooklet).length,
    [filteredFormulas]
  );

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes mathPanelEnter {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .math-pill-btn {
          transition:
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease,
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .math-pill-btn:active {
          transform: scale(0.975);
        }
        .math-formula-card {
          transition:
            border-color 160ms ease,
            background-color 160ms ease;
        }
        .math-example-panel {
          animation: mathPanelEnter 190ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (hover: hover) and (pointer: fine) {
          .math-pill-btn:hover {
            transform: translateY(-1px);
          }
          .math-pill-btn:active {
            transform: scale(0.975);
          }
          .math-formula-card:hover {
            border-color: #D4D4D8;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .math-pill-btn {
            transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
          }
          .math-pill-btn:hover,
          .math-pill-btn:active {
            transform: none;
          }
          .math-example-panel {
            animation: mathPanelFadeOnly 150ms ease both;
          }
        }
        @keyframes mathPanelFadeOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header & Controls */}
      <div className="hairline-card space-y-4">
        <div className="space-y-3.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="mini-tag bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono">
                IB MATH AA SL · TOPICS 1–5
              </span>
              <span className="text-[12px] text-[#71717A] font-mono">
                Paper 1 (Non-GDC) &amp; Paper 2 (GDC)
              </span>
            </div>
            <h2
              className="text-[20px] font-semibold tracking-tight text-[#18181B]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Interactive Math AA SL Formula Booklet &amp; Examiner Trap Companion
            </h2>
            <p className="text-[13px] text-[#71717A] mt-0.5">
              Inspect every official booklet formula alongside the unstated identities you must memorize and step-by-step worked exam solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="relative flex items-center w-full sm:w-80">
              <Search
                className="w-3.5 h-3.5 text-[#71717A] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label="Search formulas, identities, and examiner traps"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search log, discriminant, kinematics..."
                className="w-full pl-8 pr-8 py-2 text-[13px] rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B] placeholder:text-[#71717A] transition-[background-color,border-color] duration-150 focus:bg-white focus:border-[#18181B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer absolute right-2 p-1 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-pressed={onlyMustMemorize}
              onClick={() => setOnlyMustMemorize((prev) => !prev)}
              className={`math-pill-btn inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[12px] font-semibold border shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] ${
                onlyMustMemorize
                  ? 'bg-[#D97706] text-white border-[#D97706]'
                  : 'bg-[#FEF3C7]/65 text-[#92400E] border-[#FDE68A] hover:bg-[#FEF3C7]'
              }`}
            >
              {onlyMustMemorize ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
                  <span>Showing ONLY Must-Memorize Formulas</span>
                </>
              ) : (
                'Show Formulas NOT in Booklet (Must Memorize)'
              )}
            </button>
          </div>
        </div>

        {/* Responsive Coverage Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-[#71717A]">Visible Entries</span>
            <span className="font-mono text-[13px] font-bold text-[#18181B]">
              {filteredFormulas.length} / {MATH_FORMULAS.length}
            </span>
          </div>
          <div className="px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-[#71717A]">In Formula Booklet</span>
            <span className="font-mono text-[13px] font-bold text-[#065F46]">
              {filteredFormulas.length - mustMemorizeCount}
            </span>
          </div>
          <div className="px-3.5 py-2.5 rounded-[10px] bg-[#FFFBEB]/70 border border-[#FDE68A] flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-[#92400E]">Must Memorize</span>
            <span className="font-mono text-[13px] font-bold text-[#B45309]">
              {mustMemorizeCount}
            </span>
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div
          role="tablist"
          aria-label="Math AA SL formula topics"
          className="flex flex-wrap gap-2 pt-3 border-t border-[#E4E4E7]"
        >
          {TOPIC_OPTIONS.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedTopic(topic)}
                className={`math-pill-btn px-3.5 py-1.5 rounded-full text-[12px] font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] ${
                  active
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#18181B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                {topic === 'ALL' ? 'All 5 Topics' : topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formula Cards */}
      {filteredFormulas.length === 0 ? (
        <div className="hairline-card text-center py-10 space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3
              className="text-[15px] font-semibold text-[#18181B]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No matching formulas found
            </h3>
            <p className="text-[13px] text-[#71717A] mt-1">
              Try a broader search term or reset your topic and memorization filters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('ALL');
              setOnlyMustMemorize(false);
            }}
            className="pill-btn-dark text-[12px]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFormulas.map((entry) => {
            const isExpanded = !!expandedIds[entry.id];
            return (
              <div
                key={entry.id}
                className={`math-formula-card hairline-card space-y-3.5 min-w-0 ${
                  !entry.inBooklet
                    ? 'border-l-[3.5px] border-l-[#D97706]'
                    : isExpanded
                    ? 'border-l-[3.5px] border-l-[#F59E0B]'
                    : ''
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-[6px] font-mono text-[11px] font-bold bg-[#18181B] text-white tracking-tight">
                      {entry.subtopicCode}
                    </span>
                    <span className="text-[12px] text-[#71717A] font-medium">{entry.topic}</span>
                    <span className="mini-tag font-mono bg-[#F4F4F5] text-[#3F3F46] border border-[#E4E4E7]">
                      {entry.paperTag}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border justify-self-start sm:justify-self-end ${
                      entry.inBooklet
                        ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                    }`}
                  >
                    {entry.inBooklet ? (
                      'In IB Formula Booklet'
                    ) : (
                      <>
                        <Star className="w-3 h-3 fill-current shrink-0" aria-hidden="true" />
                        <span>NOT in Booklet — Must Memorize</span>
                      </>
                    )}
                  </span>
                </div>

                <h3
                  className="text-[16px] font-semibold text-[#18181B] leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <KaTeXText text={entry.title} as="span" />
                </h3>

                {/* KaTeX Display Plate */}
                <div className="px-4 py-3 rounded-[11px] border border-[#E4E4E7] bg-[#FAFAFA] overflow-x-auto text-[14px] text-[#18181B]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                      {entry.inBooklet ? 'Official Formula Plate' : 'Unstated Identity'}
                    </span>
                    <span className="font-mono text-[10px] text-[#A1A1AA]">
                      {entry.subtopicCode}
                    </span>
                  </div>
                  <KaTeXText text={entry.formulaLatex} as="div" />
                </div>

                {/* Trap + Worked Example Grid */}
                <div
                  className={
                    isExpanded
                      ? 'grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start'
                      : 'space-y-3'
                  }
                >
                  {/* Examiner Variable Trap */}
                  <div
                    className={`${
                      isExpanded ? 'md:col-span-5' : ''
                    } p-3.5 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[13px] text-[#92400E] leading-relaxed min-w-0`}
                  >
                    <span className="font-mono font-bold uppercase text-[10.5px] tracking-wide block mb-1 text-[#B45309]">
                      Variable &amp; GDC Trap
                    </span>
                    <KaTeXText text={entry.variableTrap} as="span" />
                  </div>

                  {/* Expandable Worked Exam Example */}
                  <div className={isExpanded ? 'md:col-span-7 min-w-0' : ''}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleExample(entry.id)}
                      className="pill-btn math-pill-btn text-[12px]"
                    >
                      <span>{isExpanded ? 'Hide Worked Exam Example' : 'Show Worked Exam Example'}</span>
                      <span className="font-mono font-bold">{isExpanded ? '−' : '+'}</span>
                    </button>

                    {isExpanded && (
                      <div className="math-example-panel mt-2.5 p-4 rounded-[11px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-2.5">
                        <div className="text-[13px] font-semibold text-[#18181B]">
                          <span className="font-mono text-[#D97706] mr-1.5">Exam Question:</span>
                          <KaTeXText text={entry.workedExampleQuestion} as="span" />
                        </div>
                        <div className="pt-2 border-t border-[#E4E4E7] text-[13px] text-[#27272A] leading-relaxed overflow-x-auto">
                          <KaTeXText text={entry.workedExampleSolution} as="div" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
