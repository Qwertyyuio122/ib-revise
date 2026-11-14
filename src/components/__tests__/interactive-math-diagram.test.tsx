import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  evaluateMathExpr,
  numericalDerivative,
  sampleFunctionCurve,
} from '@/lib/math-eval';
import { InteractiveMathDiagram } from '@/components/questions/InteractiveMathDiagram';
import { MathDiagramSpecSchema } from '@/content/schemas';

describe('Safe Math Expression Evaluator & InteractiveMathDiagram', () => {
  it('evaluates polynomials, trig, logs, implicit multiplication, and numerical derivatives safely', () => {
    expect(evaluateMathExpr('2x^2 - 3x + 1', 4)).toBeCloseTo(21, 6);
    expect(evaluateMathExpr('-x^2 + 4', 2)).toBeCloseTo(0, 6);
    expect(evaluateMathExpr('sin(pi * x / 2)', 1)).toBeCloseTo(1, 6);
    expect(evaluateMathExpr('ln(e^3)', 0)).toBeCloseTo(3, 6);
    expect(evaluateMathExpr('1 / (x - 2)', 2)).toBeNaN();
    expect(numericalDerivative('x^3', 2)).toBeCloseTo(12, 3);

    const segments = sampleFunctionCurve('1 / (x - 1)', -2, 4, -5, 5, 100);
    expect(segments.length).toBeGreaterThanOrEqual(2);
  });

  it('renders and interacts with all 7 MathDiagramSpec variants', () => {
    const specs = [
      {
        kind: 'function_graph',
        title: 'Quadratic & Tangent',
        xRange: [-2, 6],
        yRange: [-2, 10],
        xLabel: 'x',
        yLabel: 'f(x)',
        functions: [{ id: 'f', expr: 'x^2 - 4x + 5', label: 'f(x) = x² - 4x + 5' }],
        shadedRegion: { exprTop: 'x^2 - 4x + 5', fromX: 1, toX: 4 },
        tangentAtX: { fnIndex: 0, x: 3 },
        keyPoints: [{ x: 2, y: 1, label: 'Min (2, 1)' }],
        interactiveTrace: true,
      },
      {
        kind: 'geometry_figure',
        title: 'Non-right Triangle ABC',
        viewBox: [0, 0, 360, 220],
        vertices: [
          { id: 'A', x: 50, y: 180, label: 'A', note: 'Angle 42°' },
          { id: 'B', x: 290, y: 180, label: 'B' },
          { id: 'C', x: 210, y: 50, label: 'C' },
        ],
        segments: [
          { from: 'A', to: 'B', label: '9.4 cm' },
          { from: 'B', to: 'C', label: '6.8 cm' },
          { from: 'A', to: 'C', label: 'x' },
        ],
        angleArcs: [{ vertex: 'A', armA: 'B', armB: 'C', label: '42°' }],
      },
      {
        kind: 'unit_circle',
        title: 'Unit Circle Exact Values',
        targetAnglesRad: [Math.PI / 6, (5 * Math.PI) / 6],
        angleLabels: ['π/6', '5π/6'],
        showExactValues: true,
      },
      {
        kind: 'probability_tree',
        title: 'Conditional Urn Draw',
        rootLabel: 'Draw 1',
        branches: [
          {
            label: 'Red',
            probDisplay: '3/7',
            probValue: 3 / 7,
            children: [
              { label: 'Red', probDisplay: '2/6', probValue: 2 / 6 },
              { label: 'Blue', probDisplay: '4/6', probValue: 4 / 6 },
            ],
          },
          {
            label: 'Blue',
            probDisplay: '4/7',
            probValue: 4 / 7,
            children: [
              { label: 'Red', probDisplay: '3/6', probValue: 3 / 6 },
              { label: 'Blue', probDisplay: '3/6', probValue: 3 / 6 },
            ],
          },
        ],
      },
      {
        kind: 'venn_diagram',
        title: 'Events A and B',
        universeLabel: 'U',
        setALabel: 'A',
        setBLabel: 'B',
        regions: {
          aOnly: '0.28',
          intersection: '0.12',
          bOnly: '0.35',
          outside: '0.25',
        },
        highlightRegion: 'intersection',
      },
      {
        kind: 'normal_curve',
        title: 'Mass Distribution',
        mean: 50,
        sd: 4,
        variableName: 'X',
        shadedIntervals: [{ from: 46, to: 58 }],
        markers: [{ x: 58, label: '58' }],
      },
      {
        kind: 'stats_plot',
        subtype: 'scatter_regression',
        title: 'Study Hours vs Score',
        xLabel: 'Hours (x)',
        yLabel: 'Score (y)',
        points: [
          { x: 2, y: 55 },
          { x: 4, y: 68 },
          { x: 6, y: 79 },
        ],
        regressionLine: { slope: 6, intercept: 43.3 },
      },
    ];

    for (const raw of specs) {
      const parsed = MathDiagramSpecSchema.parse(raw);
      const { unmount } = render(<InteractiveMathDiagram spec={parsed} />);
      expect(screen.getByTestId('interactive-math-diagram')).toBeInTheDocument();
      unmount();
    }

    // Verify interactive state change on function_graph slider & venn click
    const fnSpec = MathDiagramSpecSchema.parse(specs[0]);
    const { unmount } = render(<InteractiveMathDiagram spec={fnSpec} />);
    const slider = screen.getByLabelText('Trace x coordinate') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '2' } });
    expect(screen.getByText(/x = 2/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Hide Tangent/i }));
    expect(screen.getByRole('button', { name: /Show Tangent/i })).toBeInTheDocument();
    unmount();
  });
});
