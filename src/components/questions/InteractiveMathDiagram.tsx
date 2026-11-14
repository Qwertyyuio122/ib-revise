'use client';

import React, { useMemo, useState } from 'react';
import type { MathDiagramSpec } from '@/content/schemas';
import {
  evaluateMathExpr,
  numericalDerivative,
  sampleFunctionCurve,
} from '@/lib/math-eval';

interface InteractiveMathDiagramProps {
  spec: MathDiagramSpec;
  className?: string;
}

const CURVE_PALETTE = ['#18181B', '#D97706', '#0284C7', '#059669'] as const;

function fmt(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return 'undef';
  const normalized = Math.abs(n) < 1e-9 ? 0 : n;
  return Number(normalized.toFixed(decimals)).toString();
}

function niceStep(span: number, targetTicks = 6): number {
  if (span <= 0 || !Number.isFinite(span)) return 1;
  const rough = span / targetTicks;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  if (norm <= 1.5) return pow;
  if (norm <= 3) return 2 * pow;
  if (norm <= 7) return 5 * pow;
  return 10 * pow;
}

function buildTicks(min: number, max: number, targetTicks = 6): number[] {
  const step = niceStep(max - min, targetTicks);
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 1e-6; v += step) {
    ticks.push(Math.abs(v) < 1e-9 ? 0 : Number(v.toFixed(6)));
  }
  return ticks;
}

function DiagramFrame({
  badge,
  title,
  hint,
  controls,
  children,
  footer,
  className = '',
}: {
  badge: string;
  title?: string;
  hint: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 rounded-[12px] border border-[#E4E4E7] bg-[#FFFFFF] p-3.5 sm:p-4 min-w-0 ${className}`}
      data-testid="interactive-math-diagram"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="min-w-0 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-mono text-[10.5px] font-semibold tracking-[0.03em]">
            {badge}
          </span>
          {title && (
            <span className="text-[12.5px] font-semibold text-[#18181B] break-words">
              {title}
            </span>
          )}
        </div>
        {controls && (
          <div className="flex flex-wrap items-center gap-1.5">{controls}</div>
        )}
      </div>

      <div className="rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] p-2 overflow-hidden">
        {children}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#71717A]">
        <span>{hint}</span>
        {footer && <div className="font-mono text-[#18181B]">{footer}</div>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Function Graph                                                          */
/* -------------------------------------------------------------------------- */

function FunctionGraphView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'function_graph' }>;
}) {
  const [xMin, xMax] = spec.xRange;
  const [yMin, yMax] = spec.yRange;
  const defaultTrace = spec.tangentAtX?.x ?? (xMin + xMax) / 2;

  const [traceX, setTraceX] = useState<number>(defaultTrace);
  const [showTangent, setShowTangent] = useState<boolean>(
    Boolean(spec.tangentAtX)
  );
  const [showShaded, setShowShaded] = useState<boolean>(
    Boolean(spec.shadedRegion)
  );

  const W = 480;
  const H = 260;
  const PAD = { l: 42, r: 18, t: 18, b: 32 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const toSx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSy = (y: number) => PAD.t + ((yMax - y) / (yMax - yMin)) * plotH;
  const clampSy = (y: number) =>
    Math.max(PAD.t - 8, Math.min(H - PAD.b + 8, toSy(y)));

  const xTicks = useMemo(() => buildTicks(xMin, xMax, 6), [xMin, xMax]);
  const yTicks = useMemo(() => buildTicks(yMin, yMax, 5), [yMin, yMax]);

  const sampledCurves = useMemo(
    () =>
      spec.functions.map((fn) => {
        const dMin = fn.domain ? Math.max(xMin, fn.domain[0]) : xMin;
        const dMax = fn.domain ? Math.min(xMax, fn.domain[1]) : xMax;
        return {
          ...fn,
          segments: sampleFunctionCurve(fn.expr, dMin, dMax, yMin, yMax, 160),
        };
      }),
    [spec.functions, xMin, xMax, yMin, yMax]
  );

  const shadedPath = useMemo(() => {
    if (!spec.shadedRegion || !showShaded) return null;
    const { exprTop, exprBottom, fromX, toX } = spec.shadedRegion;
    const steps = 64;
    const topPts: Array<{ sx: number; sy: number }> = [];
    const botPts: Array<{ sx: number; sy: number }> = [];
    for (let i = 0; i <= steps; i++) {
      const x = fromX + ((toX - fromX) * i) / steps;
      const yt = evaluateMathExpr(exprTop, x);
      const yb = exprBottom ? evaluateMathExpr(exprBottom, x) : 0;
      if (Number.isFinite(yt) && Number.isFinite(yb)) {
        topPts.push({ sx: toSx(x), sy: clampSy(yt) });
        botPts.push({ sx: toSx(x), sy: clampSy(yb) });
      }
    }
    if (topPts.length < 2) return null;
    const topStr = topPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
      .join(' ');
    const botStr = botPts
      .slice()
      .reverse()
      .map((p) => `L${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
      .join(' ');
    return `${topStr} ${botStr} Z`;
  }, [spec.shadedRegion, showShaded, xMin, xMax, yMin, yMax]);

  const primaryFn = spec.functions[0];
  const traceY = evaluateMathExpr(primaryFn.expr, traceX);
  const traceSlope = numericalDerivative(primaryFn.expr, traceX);
  const axisXZeroVisible = yMin <= 0 && yMax >= 0;
  const axisYZeroVisible = xMin <= 0 && xMax >= 0;

  const tangentSegment = useMemo(() => {
    if (!showTangent || !Number.isFinite(traceY) || !Number.isFinite(traceSlope)) {
      return null;
    }
    const fnIdx = spec.tangentAtX?.fnIndex ?? 0;
    const targetFn = spec.functions[fnIdx] ?? primaryFn;
    const tx = spec.interactiveTrace ? traceX : spec.tangentAtX?.x ?? traceX;
    const ty = evaluateMathExpr(targetFn.expr, tx);
    const m = numericalDerivative(targetFn.expr, tx);
    if (!Number.isFinite(ty) || !Number.isFinite(m)) return null;
    const dx = (xMax - xMin) * 0.25;
    const x1 = Math.max(xMin, tx - dx);
    const x2 = Math.min(xMax, tx + dx);
    return {
      x1,
      y1: ty + m * (x1 - tx),
      x2,
      y2: ty + m * (x2 - tx),
      tx,
      ty,
      m,
    };
  }, [
    showTangent,
    traceX,
    traceY,
    traceSlope,
    spec.tangentAtX,
    spec.functions,
    spec.interactiveTrace,
    primaryFn,
    xMin,
    xMax,
  ]);

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!spec.interactiveTrace) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const mathX = xMin + ((svgX - PAD.l) / plotW) * (xMax - xMin);
    const clamped = Math.max(xMin, Math.min(xMax, mathX));
    setTraceX(Number(clamped.toFixed(2)));
  }

  return (
    <DiagramFrame
      badge="INTERACTIVE GRAPH"
      title={spec.title}
      hint={
        spec.interactiveTrace
          ? 'Drag slider or hover plot to inspect coordinates'
          : 'Inspect plotted functions & features'
      }
      controls={
        <>
          {spec.tangentAtX && (
            <button
              type="button"
              onClick={() => setShowTangent((v) => !v)}
              aria-pressed={showTangent}
              className="pill-btn !py-1 !px-2.5 !text-[11px]"
            >
              {showTangent ? 'Hide Tangent' : 'Show Tangent'}
            </button>
          )}
          {spec.shadedRegion && (
            <button
              type="button"
              onClick={() => setShowShaded((v) => !v)}
              aria-pressed={showShaded}
              className="pill-btn !py-1 !px-2.5 !text-[11px]"
            >
              {showShaded ? 'Hide Area' : 'Show Area'}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setTraceX(defaultTrace);
              setShowTangent(Boolean(spec.tangentAtX));
              setShowShaded(Boolean(spec.shadedRegion));
            }}
            className="pill-btn !py-1 !px-2.5 !text-[11px]"
          >
            Reset
          </button>
        </>
      }
      footer={
        <span>
          x = {fmt(traceX)} · {primaryFn.label.split('=')[0].trim() || 'y'} ={' '}
          {fmt(traceY)}
          {Number.isFinite(traceSlope) ? ` · slope ≈ ${fmt(traceSlope)}` : ''}
        </span>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={spec.title ?? 'Interactive function graph'}
        className="w-full h-auto max-h-[290px] select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
      >
        <defs>
          <clipPath id="sr-graph-clip">
            <rect x={PAD.l} y={PAD.t} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* Gridlines */}
        {xTicks.map((t) => {
          const sx = toSx(t);
          return (
            <g key={`xg-${t}`}>
              <line
                x1={sx}
                y1={PAD.t}
                x2={sx}
                y2={H - PAD.b}
                stroke="#E4E4E7"
                strokeWidth={t === 0 ? 0 : 1}
              />
              <text
                x={sx}
                y={H - PAD.b + 14}
                textAnchor="middle"
                fontSize="10"
                fill="#71717A"
                fontFamily="var(--font-mono), monospace"
              >
                {fmt(t, 1)}
              </text>
            </g>
          );
        })}

        {yTicks.map((t) => {
          const sy = toSy(t);
          return (
            <g key={`yg-${t}`}>
              <line
                x1={PAD.l}
                y1={sy}
                x2={W - PAD.r}
                y2={sy}
                stroke="#E4E4E7"
                strokeWidth={t === 0 ? 0 : 1}
              />
              <text
                x={PAD.l - 6}
                y={sy + 3}
                textAnchor="end"
                fontSize="10"
                fill="#71717A"
                fontFamily="var(--font-mono), monospace"
              >
                {fmt(t, 1)}
              </text>
            </g>
          );
        })}

        {/* Main axes */}
        {axisXZeroVisible && (
          <line
            x1={PAD.l}
            y1={toSy(0)}
            x2={W - PAD.r}
            y2={toSy(0)}
            stroke="#52525B"
            strokeWidth={1.3}
          />
        )}
        {axisYZeroVisible && (
          <line
            x1={toSx(0)}
            y1={PAD.t}
            x2={toSx(0)}
            y2={H - PAD.b}
            stroke="#52525B"
            strokeWidth={1.3}
          />
        )}

        {/* Axis labels */}
        <text
          x={W - PAD.r}
          y={H - 6}
          textAnchor="end"
          fontSize="10.5"
          fontWeight="600"
          fill="#3F3F46"
        >
          {spec.xLabel}
        </text>
        <text
          x={PAD.l + 4}
          y={PAD.t + 10}
          textAnchor="start"
          fontSize="10.5"
          fontWeight="600"
          fill="#3F3F46"
        >
          {spec.yLabel}
        </text>

        <g clipPath="url(#sr-graph-clip)">
          {/* Shaded integral area */}
          {shadedPath && (
            <path d={shadedPath} fill="rgba(217, 119, 6, 0.22)" stroke="none" />
          )}

          {/* Asymptotes */}
          {spec.asymptotes?.map((a, idx) =>
            a.axis === 'x' ? (
              <line
                key={`asym-${idx}`}
                x1={toSx(a.value)}
                y1={PAD.t}
                x2={toSx(a.value)}
                y2={H - PAD.b}
                stroke="#DC2626"
                strokeWidth={1.3}
                strokeDasharray="4 4"
              />
            ) : (
              <line
                key={`asym-${idx}`}
                x1={PAD.l}
                y1={toSy(a.value)}
                x2={W - PAD.r}
                y2={toSy(a.value)}
                stroke="#DC2626"
                strokeWidth={1.3}
                strokeDasharray="4 4"
              />
            )
          )}

          {/* Plotted functions */}
          {sampledCurves.map((fn, idx) => {
            const stroke =
              fn.color ?? CURVE_PALETTE[idx % CURVE_PALETTE.length];
            return fn.segments.map((seg, sIdx) => {
              const d = seg
                .map(
                  (pt, pIdx) =>
                    `${pIdx === 0 ? 'M' : 'L'}${toSx(pt.x).toFixed(1)},${toSy(pt.y).toFixed(1)}`
                )
                .join(' ');
              return (
                <path
                  key={`${fn.id}-${sIdx}`}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2.2}
                  strokeDasharray={fn.dashed ? '5 4' : undefined}
                />
              );
            });
          })}

          {/* Tangent line */}
          {tangentSegment && (
            <line
              x1={toSx(tangentSegment.x1)}
              y1={toSy(tangentSegment.y1)}
              x2={toSx(tangentSegment.x2)}
              y2={toSy(tangentSegment.y2)}
              stroke="#D97706"
              strokeWidth={1.7}
              strokeDasharray="4 3"
            />
          )}

          {/* Key points */}
          {spec.keyPoints?.map((kp, idx) => (
            <g key={`kp-${idx}`}>
              <circle
                cx={toSx(kp.x)}
                cy={toSy(kp.y)}
                r={3.5}
                fill="#FFFFFF"
                stroke="#18181B"
                strokeWidth={1.8}
              />
              <text
                x={toSx(kp.x) + 6}
                y={toSy(kp.y) - 6}
                fontSize="10"
                fontWeight="600"
                fill="#18181B"
              >
                {kp.label}
              </text>
            </g>
          ))}

          {/* Interactive trace marker */}
          {spec.interactiveTrace && Number.isFinite(traceY) && (
            <g>
              <line
                x1={toSx(traceX)}
                y1={PAD.t}
                x2={toSx(traceX)}
                y2={H - PAD.b}
                stroke="#D97706"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle
                cx={toSx(traceX)}
                cy={clampSy(traceY)}
                r={4.5}
                fill="#D97706"
                stroke="#FFFFFF"
                strokeWidth={1.6}
              />
            </g>
          )}
        </g>
      </svg>

      {/* Legend + Trace Slider */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          {spec.functions.map((fn, idx) => (
            <span
              key={fn.id}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-[#E4E4E7] text-[11px] font-mono text-[#18181B]"
            >
              <span
                className="w-2.5 h-0.5 rounded-full inline-block"
                style={{
                  backgroundColor:
                    fn.color ?? CURVE_PALETTE[idx % CURVE_PALETTE.length],
                }}
              />
              {fn.label}
            </span>
          ))}
        </div>

        {spec.interactiveTrace && (
          <label className="inline-flex items-center gap-2 text-[11px] font-mono text-[#52525B]">
            <span>x</span>
            <input
              type="range"
              aria-label="Trace x coordinate"
              min={xMin}
              max={xMax}
              step={Math.max(0.05, Number(((xMax - xMin) / 100).toFixed(2)))}
              value={traceX}
              onChange={(e) => setTraceX(Number(e.target.value))}
              className="w-28 accent-[#D97706] cursor-pointer"
            />
          </label>
        )}
      </div>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Geometry Figure                                                         */
/* -------------------------------------------------------------------------- */

function GeometryFigureView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'geometry_figure' }>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAllLabels, setShowAllLabels] = useState(true);

  const vertexMap = useMemo(
    () => new Map(spec.vertices.map((v) => [v.id, v])),
    [spec.vertices]
  );

  const [vx, vy, vw, vh] = spec.viewBox;

  const selectedSummary = useMemo(() => {
    if (!selectedId) return 'Click a vertex, side, or angle to inspect';
    const v = vertexMap.get(selectedId);
    if (v) return `Vertex ${v.label}${v.note ? ` · ${v.note}` : ''}`;
    if (selectedId.startsWith('seg:')) {
      const idx = Number(selectedId.slice(4));
      const seg = spec.segments[idx];
      if (seg) {
        const a = vertexMap.get(seg.from)?.label ?? seg.from;
        const b = vertexMap.get(seg.to)?.label ?? seg.to;
        return `Segment ${a}${b}${seg.label ? ` = ${seg.label}` : ''}`;
      }
    }
    if (selectedId.startsWith('arc:')) {
      const idx = Number(selectedId.slice(4));
      const arc = spec.angleArcs?.[idx];
      if (arc) {
        const vtx = vertexMap.get(arc.vertex)?.label ?? arc.vertex;
        return `Angle at ${vtx}: ${arc.label}`;
      }
    }
    return 'Click a vertex, side, or angle to inspect';
  }, [selectedId, vertexMap, spec.segments, spec.angleArcs]);

  return (
    <DiagramFrame
      badge="INTERACTIVE GEOMETRY"
      title={spec.title}
      hint={selectedSummary}
      controls={
        <>
          <button
            type="button"
            onClick={() => setShowAllLabels((v) => !v)}
            aria-pressed={showAllLabels}
            className="pill-btn !py-1 !px-2.5 !text-[11px]"
          >
            {showAllLabels ? 'Hide Labels' : 'Show Labels'}
          </button>
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="pill-btn !py-1 !px-2.5 !text-[11px]"
            >
              Clear
            </button>
          )}
        </>
      }
    >
      <svg
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        role="img"
        aria-label={spec.title ?? 'Interactive geometry diagram'}
        className="w-full h-auto max-h-[280px] select-none"
      >
        {/* Polygons */}
        {spec.polygons?.map((poly, idx) => {
          const pts = poly.vertexIds
            .map((id) => vertexMap.get(id))
            .filter((v): v is NonNullable<typeof v> => Boolean(v))
            .map((v) => `${v.x},${v.y}`)
            .join(' ');
          return (
            <polygon
              key={`poly-${idx}`}
              points={pts}
              fill={poly.fill ?? 'rgba(217, 119, 6, 0.08)'}
              stroke="none"
            />
          );
        })}

        {/* Circles & Sectors */}
        {spec.circles?.map((c, idx) => {
          let sectorPath: string | null = null;
          if (
            c.sectorStartDeg !== undefined &&
            c.sectorEndDeg !== undefined
          ) {
            const rad1 = (c.sectorStartDeg * Math.PI) / 180;
            const rad2 = (c.sectorEndDeg * Math.PI) / 180;
            const x1 = c.cx + c.r * Math.cos(rad1);
            const y1 = c.cy - c.r * Math.sin(rad1);
            const x2 = c.cx + c.r * Math.cos(rad2);
            const y2 = c.cy - c.r * Math.sin(rad2);
            const diff = Math.abs(c.sectorEndDeg - c.sectorStartDeg);
            const largeArc = diff > 180 ? 1 : 0;
            sectorPath = `M ${c.cx} ${c.cy} L ${x1} ${y1} A ${c.r} ${c.r} 0 ${largeArc} 0 ${x2} ${y2} Z`;
          }
          return (
            <g key={`circ-${idx}`}>
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill="rgba(255,255,255,0.65)"
                stroke="#3F3F46"
                strokeWidth={1.6}
              />
              {sectorPath && (
                <path
                  d={sectorPath}
                  fill="rgba(217, 119, 6, 0.22)"
                  stroke="#D97706"
                  strokeWidth={1.8}
                />
              )}
            </g>
          );
        })}

        {/* Right-angle markers */}
        {spec.rightAngles?.map((ra, idx) => {
          const v = vertexMap.get(ra.vertex);
          const a = vertexMap.get(ra.armA);
          const b = vertexMap.get(ra.armB);
          if (!v || !a || !b) return null;
          const lenA = Math.hypot(a.x - v.x, a.y - v.y) || 1;
          const lenB = Math.hypot(b.x - v.x, b.y - v.y) || 1;
          const s = 12;
          const uAx = ((a.x - v.x) / lenA) * s;
          const uAy = ((a.y - v.y) / lenA) * s;
          const uBx = ((b.x - v.x) / lenB) * s;
          const uBy = ((b.y - v.y) / lenB) * s;
          return (
            <polyline
              key={`ra-${idx}`}
              points={`${v.x + uAx},${v.y + uAy} ${v.x + uAx + uBx},${v.y + uAy + uBy} ${v.x + uBx},${v.y + uBy}`}
              fill="none"
              stroke="#52525B"
              strokeWidth={1.3}
            />
          );
        })}

        {/* Segments */}
        {spec.segments.map((seg, idx) => {
          const a = vertexMap.get(seg.from);
          const b = vertexMap.get(seg.to);
          if (!a || !b) return null;
          const key = `seg:${idx}`;
          const isSel = selectedId === key || seg.highlight;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g
              key={key}
              className="cursor-pointer"
              onClick={() => setSelectedId(key)}
            >
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isSel ? '#D97706' : '#18181B'}
                strokeWidth={isSel ? 2.6 : 1.8}
                strokeDasharray={seg.dashed ? '5 4' : undefined}
              />
              {/* Wide transparent hit area */}
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="transparent"
                strokeWidth={14}
              />
              {showAllLabels && seg.label && (
                <g transform={`translate(${mx}, ${my - 7})`}>
                  <rect
                    x={-22}
                    y={-9}
                    width={44}
                    height={15}
                    rx={4}
                    fill="rgba(255,255,255,0.9)"
                    stroke={isSel ? '#D97706' : '#E4E4E7'}
                    strokeWidth={0.8}
                  />
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="var(--font-mono), monospace"
                    fill={isSel ? '#92400E' : '#18181B'}
                  >
                    {seg.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Angle Arcs */}
        {spec.angleArcs?.map((arc, idx) => {
          const v = vertexMap.get(arc.vertex);
          const a = vertexMap.get(arc.armA);
          const b = vertexMap.get(arc.armB);
          if (!v || !a || !b) return null;
          const angA = Math.atan2(a.y - v.y, a.x - v.x);
          const angB = Math.atan2(b.y - v.y, b.x - v.x);
          let diff = angB - angA;
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          const r = 24;
          const sx = v.x + r * Math.cos(angA);
          const sy = v.y + r * Math.sin(angA);
          const ex = v.x + r * Math.cos(angA + diff);
          const ey = v.y + r * Math.sin(angA + diff);
          const sweep = diff >= 0 ? 1 : 0;
          const midAng = angA + diff / 2;
          const lx = v.x + (r + 14) * Math.cos(midAng);
          const ly = v.y + (r + 14) * Math.sin(midAng);
          const key = `arc:${idx}`;
          const isSel = selectedId === key || arc.highlight;

          return (
            <g
              key={key}
              className="cursor-pointer"
              onClick={() => setSelectedId(key)}
            >
              <path
                d={`M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${ex} ${ey}`}
                fill="none"
                stroke={isSel ? '#D97706' : '#0284C7'}
                strokeWidth={2}
              />
              {showAllLabels && (
                <text
                  x={lx}
                  y={ly + 3}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono), monospace"
                  fill={isSel ? '#92400E' : '#0369A1'}
                >
                  {arc.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Vertices */}
        {spec.vertices.map((v) => {
          const isSel = selectedId === v.id;
          return (
            <g
              key={v.id}
              className="cursor-pointer"
              onClick={() => setSelectedId(v.id)}
            >
              <circle
                cx={v.x}
                cy={v.y}
                r={isSel ? 5.5 : 4}
                fill={isSel ? '#D97706' : '#FFFFFF'}
                stroke="#18181B"
                strokeWidth={1.8}
              />
              <text
                x={v.x + 8}
                y={v.y - 6}
                fontSize="11.5"
                fontWeight="700"
                fill="#18181B"
              >
                {v.label}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Unit Circle                                                             */
/* -------------------------------------------------------------------------- */

function UnitCircleView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'unit_circle' }>;
}) {
  const initialRad = spec.targetAnglesRad[0] ?? Math.PI / 4;
  const [angleRad, setAngleRad] = useState<number>(initialRad);

  const cx = 160;
  const cy = 120;
  const r = 84;
  const px = cx + r * Math.cos(angleRad);
  const py = cy - r * Math.sin(angleRad);

  const deg = ((angleRad * 180) / Math.PI + 360) % 360;
  const quadrant =
    deg < 90 ? 'Q1 (All +)' : deg < 180 ? 'Q2 (sin +)' : deg < 270 ? 'Q3 (tan +)' : 'Q4 (cos +)';

  return (
    <DiagramFrame
      badge="INTERACTIVE UNIT CIRCLE"
      title={spec.title}
      hint="Scrub θ or click a reference ray to inspect quadrant & projections"
      controls={
        <>
          {spec.targetAnglesRad.map((ang, idx) => (
            <button
              key={`snap-${idx}`}
              type="button"
              onClick={() => setAngleRad(ang)}
              className="pill-btn !py-1 !px-2 !text-[11px] font-mono"
            >
              {spec.angleLabels?.[idx] ?? `${fmt(ang, 2)} rad`}
            </button>
          ))}
        </>
      }
      footer={
        <span>
          θ = {fmt(deg, 1)}° ({fmt(angleRad, 2)} rad) · {quadrant}
          {spec.showExactValues
            ? ` · cos=${fmt(Math.cos(angleRad), 3)}, sin=${fmt(Math.sin(angleRad), 3)}`
            : ''}
        </span>
      }
    >
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <svg
          viewBox="0 0 320 240"
          role="img"
          aria-label={spec.title ?? 'Interactive unit circle'}
          className="w-full max-w-[320px] h-auto select-none"
        >
          {/* Axes */}
          <line x1={30} y1={cy} x2={290} y2={cy} stroke="#A1A1AA" strokeWidth={1.2} />
          <line x1={cx} y1={16} x2={cx} y2={224} stroke="#A1A1AA" strokeWidth={1.2} />

          {/* Quadrant CAST labels */}
          <text x={cx + 58} y={cy - 58} fontSize="11" fontWeight="700" fill="#71717A">A</text>
          <text x={cx - 66} y={cy - 58} fontSize="11" fontWeight="700" fill="#71717A">S</text>
          <text x={cx - 66} y={cy + 66} fontSize="11" fontWeight="700" fill="#71717A">T</text>
          <text x={cx + 58} y={cy + 66} fontSize="11" fontWeight="700" fill="#71717A">C</text>

          {/* Circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#18181B" strokeWidth={1.8} />

          {/* Target rays */}
          {spec.targetAnglesRad.map((ang, idx) => {
            const tx = cx + r * Math.cos(ang);
            const ty = cy - r * Math.sin(ang);
            return (
              <line
                key={`ray-${idx}`}
                x1={cx}
                y1={cy}
                x2={tx}
                y2={ty}
                stroke="#0284C7"
                strokeWidth={1.6}
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Projection lines */}
          <line x1={px} y1={py} x2={px} y2={cy} stroke="#059669" strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#D97706" strokeWidth={2} />

          {/* Active ray */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#D97706" strokeWidth={2.4} />
          <circle cx={px} cy={py} r={5} fill="#D97706" stroke="#FFFFFF" strokeWidth={1.6} />

          <text x={cx + r + 8} y={cy + 4} fontSize="10" fontFamily="var(--font-mono), monospace" fill="#52525B">(1,0)</text>
          <text x={cx + 5} y={cy - r - 6} fontSize="10" fontFamily="var(--font-mono), monospace" fill="#52525B">(0,1)</text>
        </svg>

        <div className="flex-1 w-full space-y-2 px-2">
          <label className="block text-[11.5px] font-medium text-[#3F3F46]">
            Explore angle θ (0 to 2π):
            <input
              type="range"
              aria-label="Unit circle angle"
              min={0}
              max={Number((2 * Math.PI).toFixed(3))}
              step={0.05}
              value={((angleRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)}
              onChange={(e) => setAngleRad(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#D97706] cursor-pointer"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11.5px] font-mono">
            <div className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5">
              cos θ ≈ {fmt(Math.cos(angleRad), 3)}
            </div>
            <div className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5">
              sin θ ≈ {fmt(Math.sin(angleRad), 3)}
            </div>
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Probability Tree                                                        */
/* -------------------------------------------------------------------------- */

function ProbabilityTreeView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'probability_tree' }>;
}) {
  const [selectedLeaf, setSelectedLeaf] = useState<{
    bIdx: number;
    cIdx: number;
  } | null>(null);

  const totalLeaves = spec.branches.reduce(
    (sum, b) => sum + b.children.length,
    0
  );
  const H = Math.max(200, totalLeaves * 44 + 24);
  const W = 480;
  const rootX = 46;
  const rootY = H / 2;
  const midX = 210;
  const leafX = 395;

  let leafCounter = 0;
  const branchCoords = spec.branches.map((b) => {
    const startIdx = leafCounter;
    const childYs = b.children.map(() => {
      const y = ((leafCounter + 0.5) / totalLeaves) * (H - 24) + 12;
      leafCounter += 1;
      return y;
    });
    const midY = (childYs[0] + childYs[childYs.length - 1]) / 2;
    return { branch: b, midY, childYs, startIdx };
  });

  const activeInfo = useMemo(() => {
    if (!selectedLeaf) return 'Click any leaf outcome to highlight its path';
    const b = spec.branches[selectedLeaf.bIdx];
    const c = b?.children[selectedLeaf.cIdx];
    if (!b || !c) return '';
    return `Path: ${b.label} → ${c.label} (${b.probDisplay} × ${c.probDisplay})`;
  }, [selectedLeaf, spec.branches]);

  return (
    <DiagramFrame
      badge="INTERACTIVE PROBABILITY TREE"
      title={spec.title}
      hint={activeInfo}
      controls={
        selectedLeaf ? (
          <button
            type="button"
            onClick={() => setSelectedLeaf(null)}
            className="pill-btn !py-1 !px-2.5 !text-[11px]"
          >
            Clear Path
          </button>
        ) : undefined
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={spec.title ?? 'Interactive probability tree'}
        className="w-full h-auto max-h-[300px] select-none"
      >
        <circle cx={rootX} cy={rootY} r={5} fill="#18181B" />
        <text x={rootX - 6} y={rootY - 10} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#52525B">
          {spec.rootLabel}
        </text>

        {branchCoords.map(({ branch, midY, childYs }, bIdx) => {
          const branchSelected = selectedLeaf?.bIdx === bIdx;
          return (
            <g key={`b-${bIdx}`}>
              <line
                x1={rootX}
                y1={rootY}
                x2={midX}
                y2={midY}
                stroke={branchSelected ? '#D97706' : '#3F3F46'}
                strokeWidth={branchSelected ? 2.5 : 1.5}
              />
              <text
                x={(rootX + midX) / 2}
                y={(rootY + midY) / 2 - 6}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="var(--font-mono), monospace"
                fontWeight="600"
                fill={branchSelected ? '#92400E' : '#18181B'}
              >
                {branch.probDisplay}
              </text>
              <rect
                x={midX - 24}
                y={midY - 12}
                width={48}
                height={24}
                rx={6}
                fill={branchSelected ? '#FEF3C7' : '#FFFFFF'}
                stroke={branchSelected ? '#D97706' : '#E4E4E7'}
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#18181B"
              >
                {branch.label}
              </text>

              {branch.children.map((child, cIdx) => {
                const cy = childYs[cIdx];
                const isLeafSel =
                  selectedLeaf?.bIdx === bIdx && selectedLeaf?.cIdx === cIdx;
                return (
                  <g
                    key={`c-${bIdx}-${cIdx}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedLeaf({ bIdx, cIdx })}
                  >
                    <line
                      x1={midX + 24}
                      y1={midY}
                      x2={leafX}
                      y2={cy}
                      stroke={isLeafSel ? '#D97706' : '#52525B'}
                      strokeWidth={isLeafSel ? 2.6 : 1.5}
                    />
                    <text
                      x={(midX + 24 + leafX) / 2}
                      y={(midY + cy) / 2 - 6}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontFamily="var(--font-mono), monospace"
                      fontWeight="600"
                      fill={isLeafSel ? '#92400E' : '#18181B'}
                    >
                      {child.probDisplay}
                    </text>
                    <rect
                      x={leafX}
                      y={cy - 12}
                      width={74}
                      height={24}
                      rx={6}
                      fill={isLeafSel ? '#FEF3C7' : '#FFFFFF'}
                      stroke={isLeafSel ? '#D97706' : '#E4E4E7'}
                    />
                    <text
                      x={leafX + 37}
                      y={cy + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#18181B"
                    >
                      {child.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Venn Diagram                                                            */
/* -------------------------------------------------------------------------- */

function VennDiagramView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'venn_diagram' }>;
}) {
  type RegionKey = 'aOnly' | 'intersection' | 'bOnly' | 'outside';
  const [selected, setSelected] = useState<RegionKey | null>(
    spec.highlightRegion !== 'none' && spec.highlightRegion !== 'union'
      ? spec.highlightRegion
      : null
  );

  const labels: Record<RegionKey, string> = {
    aOnly: `${spec.setALabel} ∩ ${spec.setBLabel}' = ${spec.regions.aOnly}`,
    intersection: `${spec.setALabel} ∩ ${spec.setBLabel} = ${spec.regions.intersection}`,
    bOnly: `${spec.setALabel}' ∩ ${spec.setBLabel} = ${spec.regions.bOnly}`,
    outside: `(${spec.setALabel} ∪ ${spec.setBLabel})' = ${spec.regions.outside}`,
  };

  return (
    <DiagramFrame
      badge="INTERACTIVE VENN DIAGRAM"
      title={spec.title}
      hint={
        selected
          ? labels[selected]
          : 'Click any region to inspect set notation and value'
      }
      controls={
        <div className="flex flex-wrap gap-1">
          {(['aOnly', 'intersection', 'bOnly', 'outside'] as RegionKey[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                aria-pressed={selected === key}
                onClick={() => setSelected(selected === key ? null : key)}
                className="pill-btn !py-0.5 !px-2 !text-[10.5px] font-mono"
              >
                {key === 'aOnly'
                  ? `${spec.setALabel} only`
                  : key === 'intersection'
                  ? `${spec.setALabel}∩${spec.setBLabel}`
                  : key === 'bOnly'
                  ? `${spec.setBLabel} only`
                  : 'Outside'}
              </button>
            )
          )}
        </div>
      }
    >
      <svg
        viewBox="0 0 380 210"
        role="img"
        aria-label={spec.title ?? 'Interactive Venn diagram'}
        className="w-full h-auto max-h-[230px] select-none"
      >
        <rect
          x={20}
          y={14}
          width={340}
          height={182}
          rx={10}
          fill={selected === 'outside' ? '#FEF3C7' : '#FFFFFF'}
          stroke="#18181B"
          strokeWidth={1.6}
          className="cursor-pointer"
          onClick={() => setSelected('outside')}
        />
        <text x={32} y={34} fontSize="12" fontWeight="700" fill="#18181B">
          {spec.universeLabel}
        </text>

        <circle
          cx={145}
          cy={105}
          r={64}
          fill={
            selected === 'aOnly' || spec.highlightRegion === 'union'
              ? 'rgba(217, 119, 6, 0.22)'
              : 'rgba(2, 132, 199, 0.1)'
          }
          stroke="#18181B"
          strokeWidth={1.8}
          className="cursor-pointer"
          onClick={() => setSelected('aOnly')}
        />
        <circle
          cx={235}
          cy={105}
          r={64}
          fill={
            selected === 'bOnly' || spec.highlightRegion === 'union'
              ? 'rgba(217, 119, 6, 0.22)'
              : 'rgba(5, 150, 105, 0.1)'
          }
          stroke="#18181B"
          strokeWidth={1.8}
          className="cursor-pointer"
          onClick={() => setSelected('bOnly')}
        />

        <text x={96} y={40} fontSize="12" fontWeight="700" fill="#0369A1">
          {spec.setALabel}
        </text>
        <text x={274} y={40} fontSize="12" fontWeight="700" fill="#065F46">
          {spec.setBLabel}
        </text>

        <text
          x={112}
          y={110}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-mono), monospace"
          fill="#18181B"
          className="cursor-pointer"
          onClick={() => setSelected('aOnly')}
        >
          {spec.regions.aOnly}
        </text>
        <text
          x={190}
          y={110}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-mono), monospace"
          fill={selected === 'intersection' ? '#92400E' : '#18181B'}
          className="cursor-pointer"
          onClick={() => setSelected('intersection')}
        >
          {spec.regions.intersection}
        </text>
        <text
          x={268}
          y={110}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-mono), monospace"
          fill="#18181B"
          className="cursor-pointer"
          onClick={() => setSelected('bOnly')}
        >
          {spec.regions.bOnly}
        </text>
        <text
          x={330}
          y={180}
          textAnchor="end"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-mono), monospace"
          fill="#52525B"
          className="cursor-pointer"
          onClick={() => setSelected('outside')}
        >
          {spec.regions.outside}
        </text>
      </svg>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Normal Curve                                                            */
/* -------------------------------------------------------------------------- */

function NormalCurveView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'normal_curve' }>;
}) {
  const { mean, sd } = spec;
  const xMin = mean - 3.6 * sd;
  const xMax = mean + 3.6 * sd;
  const [probeX, setProbeX] = useState<number>(mean);

  const W = 480;
  const H = 220;
  const PAD = { l: 24, r: 24, t: 22, b: 36 };
  const plotW = W - PAD.l - PAD.r;
  const baseY = H - PAD.b;
  const maxH = H - PAD.t - PAD.b - 10;

  const pdfNorm = (x: number) => {
    const z = (x - mean) / sd;
    return Math.exp(-0.5 * z * z);
  };
  const toSx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSy = (x: number) => baseY - pdfNorm(x) * maxH;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = xMin + ((xMax - xMin) * i) / 120;
      pts.push(
        `${i === 0 ? 'M' : 'L'}${toSx(x).toFixed(1)},${toSy(x).toFixed(1)}`
      );
    }
    return pts.join(' ');
  }, [xMin, xMax, mean, sd]);

  const zScore = (probeX - mean) / sd;

  return (
    <DiagramFrame
      badge="INTERACTIVE NORMAL CURVE"
      title={spec.title}
      hint={`${spec.variableName} ~ N(${fmt(mean)}, ${fmt(sd)}²) · Scrub marker to inspect z-score`}
      controls={
        <button
          type="button"
          onClick={() => setProbeX(mean)}
          className="pill-btn !py-1 !px-2.5 !text-[11px]"
        >
          Reset μ
        </button>
      }
      footer={
        <span>
          x = {fmt(probeX, 2)} · z = {fmt(zScore, 2)}
        </span>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={spec.title ?? 'Interactive normal distribution curve'}
        className="w-full h-auto max-h-[240px] select-none"
      >
        {/* Shaded intervals */}
        {spec.shadedIntervals.map((iv, idx) => {
          const from = Math.max(xMin, iv.from);
          const to = Math.min(xMax, iv.to);
          if (to <= from) return null;
          const steps = 48;
          const pts: string[] = [`M${toSx(from).toFixed(1)},${baseY}`];
          for (let i = 0; i <= steps; i++) {
            const x = from + ((to - from) * i) / steps;
            pts.push(`L${toSx(x).toFixed(1)},${toSy(x).toFixed(1)}`);
          }
          pts.push(`L${toSx(to).toFixed(1)},${baseY} Z`);
          return (
            <path
              key={`sh-${idx}`}
              d={pts.join(' ')}
              fill="rgba(217, 119, 6, 0.25)"
            />
          );
        })}

        {/* Baseline & sigma ticks */}
        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY} stroke="#3F3F46" strokeWidth={1.4} />
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => {
          const x = mean + k * sd;
          const sx = toSx(x);
          return (
            <g key={`k-${k}`}>
              <line
                x1={sx}
                y1={baseY}
                x2={sx}
                y2={k === 0 ? PAD.t : baseY + 5}
                stroke={k === 0 ? '#A1A1AA' : '#52525B'}
                strokeWidth={1}
                strokeDasharray={k === 0 ? '3 3' : undefined}
              />
              <text
                x={sx}
                y={baseY + 18}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono), monospace"
                fill="#52525B"
              >
                {fmt(x, 1)}
              </text>
            </g>
          );
        })}

        {/* Bell curve */}
        <path d={curvePath} fill="none" stroke="#18181B" strokeWidth={2.2} />

        {/* Question markers */}
        {spec.markers?.map((m, idx) => {
          const sx = toSx(Math.max(xMin, Math.min(xMax, m.x)));
          return (
            <g key={`mk-${idx}`}>
              <line x1={sx} y1={PAD.t + 10} x2={sx} y2={baseY} stroke="#0284C7" strokeWidth={1.5} strokeDasharray="3 3" />
              <text x={sx} y={PAD.t + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0369A1">
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Interactive probe line */}
        <line
          x1={toSx(probeX)}
          y1={PAD.t}
          x2={toSx(probeX)}
          y2={baseY}
          stroke="#D97706"
          strokeWidth={1.8}
        />
        <circle
          cx={toSx(probeX)}
          cy={toSy(probeX)}
          r={4.2}
          fill="#D97706"
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      </svg>

      <div className="mt-2 px-1 flex items-center gap-3">
        <span className="text-[11px] font-mono text-[#52525B]">Probe {spec.variableName}:</span>
        <input
          type="range"
          aria-label="Normal curve x probe"
          min={xMin}
          max={xMax}
          step={Math.max(0.05, Number((sd / 20).toFixed(2)))}
          value={probeX}
          onChange={(e) => setProbeX(Number(e.target.value))}
          className="flex-1 accent-[#D97706] cursor-pointer"
        />
      </div>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Stats Plot (Scatter, Box Plot, Ogive, Histogram)                        */
/* -------------------------------------------------------------------------- */

function StatsPlotView({
  spec,
}: {
  spec: Extract<MathDiagramSpec, { kind: 'stats_plot' }>;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showReg, setShowReg] = useState<boolean>(Boolean(spec.regressionLine));

  const W = 480;
  const H = 240;
  const PAD = { l: 46, r: 20, t: 20, b: 36 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  if (spec.subtype === 'box_plot' && spec.boxSummary) {
    const b = spec.boxSummary;
    const allVals = [b.min, b.max, ...(b.outliers ?? [])];
    const xMin = Math.min(...allVals) - Math.max(1, (b.max - b.min) * 0.12);
    const xMax = Math.max(...allVals) + Math.max(1, (b.max - b.min) * 0.12);
    const toSx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const ticks = buildTicks(xMin, xMax, 6);
    const cy = 110;
    const iqr = b.q3 - b.q1;

    return (
      <DiagramFrame
        badge="INTERACTIVE BOX PLOT"
        title={spec.title}
        hint={`Min=${fmt(b.min)} · Q1=${fmt(b.q1)} · Median=${fmt(b.median)} · Q3=${fmt(b.q3)} · Max=${fmt(b.max)} · IQR=${fmt(iqr)}`}
      >
        <svg viewBox={`0 0 ${W} 185`} role="img" aria-label={spec.title ?? 'Interactive box plot'} className="w-full h-auto max-h-[210px]">
          <line x1={PAD.l} y1={145} x2={W - PAD.r} y2={145} stroke="#52525B" strokeWidth={1.3} />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={toSx(t)} y1={145} x2={toSx(t)} y2={150} stroke="#52525B" />
              <text x={toSx(t)} y={163} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono), monospace" fill="#71717A">
                {fmt(t, 1)}
              </text>
            </g>
          ))}
          {/* Whiskers */}
          <line x1={toSx(b.min)} y1={cy} x2={toSx(b.q1)} y2={cy} stroke="#18181B" strokeWidth={1.8} />
          <line x1={toSx(b.q3)} y1={cy} x2={toSx(b.max)} y2={cy} stroke="#18181B" strokeWidth={1.8} />
          <line x1={toSx(b.min)} y1={cy - 12} x2={toSx(b.min)} y2={cy + 12} stroke="#18181B" strokeWidth={1.8} />
          <line x1={toSx(b.max)} y1={cy - 12} x2={toSx(b.max)} y2={cy + 12} stroke="#18181B" strokeWidth={1.8} />
          {/* IQR box */}
          <rect
            x={toSx(b.q1)}
            y={cy - 22}
            width={Math.max(2, toSx(b.q3) - toSx(b.q1))}
            height={44}
            fill="rgba(217, 119, 6, 0.16)"
            stroke="#18181B"
            strokeWidth={1.8}
          />
          <line x1={toSx(b.median)} y1={cy - 22} x2={toSx(b.median)} y2={cy + 22} stroke="#D97706" strokeWidth={2.5} />
          {b.outliers?.map((o, idx) => (
            <circle key={idx} cx={toSx(o)} cy={cy} r={4} fill="#DC2626" />
          ))}
          <text x={W / 2} y={179} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#3F3F46">
            {spec.xLabel}
          </text>
        </svg>
      </DiagramFrame>
    );
  }

  if (spec.subtype === 'histogram' && spec.bins && spec.bins.length > 0) {
    const xMin = spec.bins[0].xStart;
    const xMax = spec.bins[spec.bins.length - 1].xEnd;
    const yMax = Math.max(5, ...spec.bins.map((b) => b.count)) * 1.15;
    const toSx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSy = (y: number) => PAD.t + ((yMax - y) / yMax) * plotH;
    const activeBin = selectedIdx !== null ? spec.bins[selectedIdx] : null;

    return (
      <DiagramFrame
        badge="INTERACTIVE HISTOGRAM"
        title={spec.title}
        hint={
          activeBin
            ? `Interval [${fmt(activeBin.xStart)}, ${fmt(activeBin.xEnd)}) · Frequency = ${activeBin.count}`
            : 'Click or hover any bar to inspect interval frequency'
        }
      >
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title ?? 'Interactive histogram'} className="w-full h-auto max-h-[250px]">
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#52525B" strokeWidth={1.3} />
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#52525B" strokeWidth={1.3} />
          {spec.bins.map((bin, idx) => {
            const x = toSx(bin.xStart);
            const w = Math.max(2, toSx(bin.xEnd) - x);
            const y = toSy(bin.count);
            const h = H - PAD.b - y;
            const isSel = selectedIdx === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => setSelectedIdx(idx)}
                onMouseEnter={() => setSelectedIdx(idx)}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={isSel ? 'rgba(217, 119, 6, 0.35)' : 'rgba(24, 24, 27, 0.12)'}
                  stroke={isSel ? '#D97706' : '#18181B'}
                  strokeWidth={1.4}
                />
                <text x={x + w / 2} y={H - PAD.b + 14} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono), monospace" fill="#71717A">
                  {fmt(bin.xStart, 0)}
                </text>
              </g>
            );
          })}
          <text x={W - PAD.r} y={H - 6} textAnchor="end" fontSize="10" fontWeight="600" fill="#3F3F46">
            {spec.xLabel}
          </text>
          <text x={PAD.l + 6} y={PAD.t + 10} fontSize="10" fontWeight="600" fill="#3F3F46">
            {spec.yLabel}
          </text>
        </svg>
      </DiagramFrame>
    );
  }

  // Scatter + Regression OR Cumulative Frequency Ogive
  const pts = spec.points ?? [];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const xMin = xs.length ? Math.min(0, ...xs) : 0;
  const xMax = xs.length ? Math.max(...xs) * 1.08 : 10;
  const yMin = ys.length ? Math.min(0, ...ys) : 0;
  const yMax = ys.length ? Math.max(...ys) * 1.12 : 10;

  const toSx = (x: number) => PAD.l + ((x - xMin) / Math.max(1e-6, xMax - xMin)) * plotW;
  const toSy = (y: number) => PAD.t + ((yMax - y) / Math.max(1e-6, yMax - yMin)) * plotH;
  const xTicks = buildTicks(xMin, xMax, 5);
  const yTicks = buildTicks(yMin, yMax, 5);
  const activePt = selectedIdx !== null ? pts[selectedIdx] : null;

  return (
    <DiagramFrame
      badge={
        spec.subtype === 'cumulative_ogive'
          ? 'INTERACTIVE OGIVE'
          : 'INTERACTIVE SCATTER PLOT'
      }
      title={spec.title}
      hint={
        activePt
          ? `Selected point: (${fmt(activePt.x)}, ${fmt(activePt.y)})`
          : 'Hover or click points to inspect exact coordinates'
      }
      controls={
        spec.regressionLine ? (
          <button
            type="button"
            onClick={() => setShowReg((v) => !v)}
            aria-pressed={showReg}
            className="pill-btn !py-1 !px-2.5 !text-[11px]"
          >
            {showReg ? 'Hide Regression' : 'Show Regression'}
          </button>
        ) : undefined
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title ?? 'Interactive statistics plot'} className="w-full h-auto max-h-[260px]">
        {xTicks.map((t) => (
          <g key={`sx-${t}`}>
            <line x1={toSx(t)} y1={PAD.t} x2={toSx(t)} y2={H - PAD.b} stroke="#E4E4E7" />
            <text x={toSx(t)} y={H - PAD.b + 14} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono), monospace" fill="#71717A">
              {fmt(t, 1)}
            </text>
          </g>
        ))}
        {yTicks.map((t) => (
          <g key={`sy-${t}`}>
            <line x1={PAD.l} y1={toSy(t)} x2={W - PAD.r} y2={toSy(t)} stroke="#E4E4E7" />
            <text x={PAD.l - 6} y={toSy(t) + 3} textAnchor="end" fontSize="9.5" fontFamily="var(--font-mono), monospace" fill="#71717A">
              {fmt(t, 1)}
            </text>
          </g>
        ))}

        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#52525B" strokeWidth={1.3} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#52525B" strokeWidth={1.3} />

        {spec.subtype === 'cumulative_ogive' && pts.length >= 2 && (
          <path
            d={pts
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSx(p.x).toFixed(1)},${toSy(p.y).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="#18181B"
            strokeWidth={2}
          />
        )}

        {spec.regressionLine && showReg && (
          <line
            x1={toSx(xMin)}
            y1={toSy(spec.regressionLine.slope * xMin + spec.regressionLine.intercept)}
            x2={toSx(xMax)}
            y2={toSy(spec.regressionLine.slope * xMax + spec.regressionLine.intercept)}
            stroke="#D97706"
            strokeWidth={1.9}
            strokeDasharray="5 3"
          />
        )}

        {pts.map((pt, idx) => {
          const isSel = selectedIdx === idx;
          return (
            <circle
              key={`pt-${idx}`}
              cx={toSx(pt.x)}
              cy={toSy(pt.y)}
              r={isSel ? 5.5 : 4}
              fill={isSel ? '#D97706' : '#18181B'}
              stroke="#FFFFFF"
              strokeWidth={1.4}
              className="cursor-pointer"
              onClick={() => setSelectedIdx(idx)}
              onMouseEnter={() => setSelectedIdx(idx)}
            />
          );
        })}

        <text x={W - PAD.r} y={H - 6} textAnchor="end" fontSize="10" fontWeight="600" fill="#3F3F46">
          {spec.xLabel}
        </text>
        <text x={PAD.l + 6} y={PAD.t + 10} fontSize="10" fontWeight="600" fill="#3F3F46">
          {spec.yLabel}
        </text>
      </svg>
    </DiagramFrame>
  );
}

export function InteractiveMathDiagram({
  spec,
  className = '',
}: InteractiveMathDiagramProps) {
  switch (spec.kind) {
    case 'function_graph':
      return <FunctionGraphView spec={spec} />;
    case 'geometry_figure':
      return <GeometryFigureView spec={spec} />;
    case 'unit_circle':
      return <UnitCircleView spec={spec} />;
    case 'probability_tree':
      return <ProbabilityTreeView spec={spec} />;
    case 'venn_diagram':
      return <VennDiagramView spec={spec} />;
    case 'normal_curve':
      return <NormalCurveView spec={spec} />;
    case 'stats_plot':
      return <StatsPlotView spec={spec} />;
    default:
      return null;
  }
}
