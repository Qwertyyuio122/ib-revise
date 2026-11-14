/**
 * Safe recursive-descent mathematical expression parser & evaluator.
 * Supports: numbers, x, pi, e, + - * / ^, unary +/-, parentheses,
 * implicit multiplication (2x, 3(x+1), (x+1)(x-1)), and math functions
 * (sin, cos, tan, asin, acos, atan, abs, sqrt, ln, log, exp, floor, ceil).
 * Strictly zero eval() or new Function().
 */

type Token =
  | { type: 'num'; value: number }
  | { type: 'ident'; value: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' }
  | { type: 'lparen' }
  | { type: 'rparen' };

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

const FUNCTIONS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  abs: Math.abs,
  sqrt: Math.sqrt,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
};

function tokenize(raw: string): Token[] {
  const input = raw.trim().replace(/\u2212/g, '-');
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let end = i;
      let sawDot = false;
      while (end < input.length && /[0-9.]/.test(input[end])) {
        if (input[end] === '.') {
          if (sawDot) break;
          sawDot = true;
        }
        end++;
      }
      const numStr = input.slice(i, end);
      const num = Number(numStr);
      if (!Number.isFinite(num)) {
        throw new Error(`Invalid number token "${numStr}"`);
      }
      tokens.push({ type: 'num', value: num });
      i = end;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let end = i;
      while (end < input.length && /[a-zA-Z0-9_]/.test(input[end])) {
        end++;
      }
      const ident = input.slice(i, end).toLowerCase();
      tokens.push({ type: 'ident', value: ident });
      i = end;
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    throw new Error(`Unsupported character "${ch}" in expression "${raw}"`);
  }

  // Insert implicit multiplication tokens where mathematically standard:
  // e.g. 2x, 2(x+1), )x, )(, x(, pi x
  const out: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const cur = tokens[idx];
    const prev = out[out.length - 1];
    if (prev) {
      const prevIsValue =
        prev.type === 'num' ||
        prev.type === 'rparen' ||
        (prev.type === 'ident' && !(prev.value in FUNCTIONS));
      const curStartsValue =
        cur.type === 'num' || cur.type === 'ident' || cur.type === 'lparen';
      if (prevIsValue && curStartsValue) {
        out.push({ type: 'op', value: '*' });
      }
    }
    out.push(cur);
  }

  return out;
}

type ExprNode = (x: number) => number;

export function compileMathExpr(expr: string): ExprNode {
  const tokens = tokenize(expr);
  if (tokens.length === 0) {
    throw new Error('Empty math expression');
  }
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpression(): ExprNode {
    let left = parseTerm();
    while (true) {
      const t = peek();
      if (t?.type === 'op' && (t.value === '+' || t.value === '-')) {
        consume();
        const right = parseTerm();
        const prevLeft = left;
        left =
          t.value === '+'
            ? (x) => prevLeft(x) + right(x)
            : (x) => prevLeft(x) - right(x);
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm(): ExprNode {
    let left = parseUnary();
    while (true) {
      const t = peek();
      if (t?.type === 'op' && (t.value === '*' || t.value === '/')) {
        consume();
        const right = parseUnary();
        const prevLeft = left;
        left =
          t.value === '*'
            ? (x) => prevLeft(x) * right(x)
            : (x) => {
                const denom = right(x);
                if (Math.abs(denom) < 1e-12) return Number.NaN;
                return prevLeft(x) / denom;
              };
      } else {
        break;
      }
    }
    return left;
  }

  function parseUnary(): ExprNode {
    const t = peek();
    if (t?.type === 'op' && (t.value === '+' || t.value === '-')) {
      consume();
      const operand = parseUnary();
      return t.value === '-' ? (x) => -operand(x) : operand;
    }
    return parsePower();
  }

  function parsePower(): ExprNode {
    const base = parsePrimary();
    const t = peek();
    if (t?.type === 'op' && t.value === '^') {
      consume();
      const exp = parseUnary();
      return (x) => {
        const b = base(x);
        const p = exp(x);
        const result = Math.pow(b, p);
        return Number.isFinite(result) ? result : Number.NaN;
      };
    }
    return base;
  }

  function parsePrimary(): ExprNode {
    const t = peek();
    if (!t) {
      throw new Error(`Unexpected end of expression "${expr}"`);
    }

    if (t.type === 'num') {
      consume();
      const v = t.value;
      return () => v;
    }

    if (t.type === 'ident') {
      consume();
      if (t.value === 'x' || t.value === 't') {
        return (x) => x;
      }
      if (t.value in CONSTANTS) {
        const c = CONSTANTS[t.value];
        return () => c;
      }
      if (t.value in FUNCTIONS) {
        const fn = FUNCTIONS[t.value];
        const next = peek();
        if (next?.type === 'lparen') {
          consume();
          const inner = parseExpression();
          const close = consume();
          if (!close || close.type !== 'rparen') {
            throw new Error(`Missing closing parenthesis in "${expr}"`);
          }
          return (x) => {
            const val = fn(inner(x));
            return Number.isFinite(val) ? val : Number.NaN;
          };
        }
        const arg = parseUnary();
        return (x) => {
          const val = fn(arg(x));
          return Number.isFinite(val) ? val : Number.NaN;
        };
      }
      throw new Error(`Unknown identifier "${t.value}" in "${expr}"`);
    }

    if (t.type === 'lparen') {
      consume();
      const inner = parseExpression();
      const close = consume();
      if (!close || close.type !== 'rparen') {
        throw new Error(`Unclosed parenthesis in "${expr}"`);
      }
      return inner;
    }

    throw new Error(`Unexpected token in "${expr}"`);
  }

  const root = parseExpression();
  if (pos < tokens.length) {
    throw new Error(`Unexpected trailing tokens in "${expr}"`);
  }
  return root;
}

const COMPILED_CACHE = new Map<string, ExprNode>();

export function evaluateMathExpr(expr: string, x: number): number {
  let fn = COMPILED_CACHE.get(expr);
  if (!fn) {
    fn = compileMathExpr(expr);
    if (COMPILED_CACHE.size > 500) {
      const firstKey = COMPILED_CACHE.keys().next().value;
      if (firstKey) COMPILED_CACHE.delete(firstKey);
    }
    COMPILED_CACHE.set(expr, fn);
  }
  try {
    const val = fn(x);
    return Number.isFinite(val) ? val : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

export function numericalDerivative(
  expr: string,
  x: number,
  h = 1e-4
): number {
  const f1 = evaluateMathExpr(expr, x + h);
  const f0 = evaluateMathExpr(expr, x - h);
  if (!Number.isFinite(f1) || !Number.isFinite(f0)) return Number.NaN;
  return (f1 - f0) / (2 * h);
}

export function sampleFunctionCurve(
  expr: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  steps = 160
): Array<Array<{ x: number; y: number }>> {
  const segments: Array<Array<{ x: number; y: number }>> = [];
  let current: Array<{ x: number; y: number }> = [];
  const ySpan = Math.max(1, yMax - yMin);
  const yPad = ySpan * 0.6;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    const y = evaluateMathExpr(expr, x);
    const inBounds =
      Number.isFinite(y) && y >= yMin - yPad && y <= yMax + yPad;

    if (!inBounds) {
      if (current.length >= 2) segments.push(current);
      current = [];
      continue;
    }

    if (current.length > 0) {
      const prev = current[current.length - 1];
      if (Math.abs(y - prev.y) > ySpan * 1.1) {
        if (current.length >= 2) segments.push(current);
        current = [{ x, y }];
        continue;
      }
    }
    current.push({ x, y });
  }
  if (current.length >= 2) segments.push(current);
  return segments;
}
