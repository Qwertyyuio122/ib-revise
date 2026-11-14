import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { callGeminiStructured } from '@/lib/gemini';
import { parseJsonBody } from '@/app/api/_lib/json';

const ChatTurnSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const TutorRequestSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('bio'),
  topicTitle: z.string().optional(),
  message: z.string().min(1).max(4_000),
  history: z.array(ChatTurnSchema).max(30).optional().default([]),
});

const TutorResponseSchema = z.object({
  reply: z.string(),
  keyTakeaways: z.array(z.string()),
  followUpQuestion: z.string(),
  markschemeTip: z.string(),
});

const SUBJECT_TUTOR_KNOWLEDGE: Record<
  string,
  {
    name: string;
    defaultReply: (msg: string, topic?: string) => string;
    takeaways: string[];
    followUp: string;
    markschemeTip: string;
  }
> = {
  bio: {
    name: 'IB Biology HL',
    defaultReply: (msg, topic) =>
      `In **IB Biology HL** (${topic || 'Core & AHL Syllabus'}), examiners look for precise molecular mechanisms rather than general descriptions.\n\nRegarding *"${msg.slice(0, 90)}"*:\n1. **Water Potential & Osmosis**: Always express water movement in terms of solute potential ($\\Psi_s$) and pressure potential ($\\Psi_p$) using $\\Psi_w = \\Psi_s + \\Psi_p$. Water moves from higher (less negative) $\\Psi_w$ to lower (more negative) $\\Psi_w$ across a partially permeable membrane.\n2. **Chemiosmosis & ATP Synthase**: Protons ($\\text{H}^+$) are pumped across the inner mitochondrial membrane (or thylakoid membrane) to establish an electrochemical proton gradient, driving ATP synthesis via chemiosmosis.`,
    takeaways: [
      'Specify net movement of water molecules down a water potential gradient ($\\Psi_w = \\Psi_s + \\Psi_p$).',
      'Distinguish between active transport (ATP hydrolysis + pump conformational change) and facilitated diffusion.',
      'Reference specific membrane compartments (intermembrane space vs mitochondrial matrix).',
    ],
    followUp:
      'If a plant tissue is immersed in a hypertonic sucrose solution ($0.6\\text{ mol dm}^{-3}$), what happens to $\\Psi_p$ as incipient plasmolysis is reached?',
    markschemeTip:
      'IB Biology Paper 2 rejects "water moves from high to low concentration" without specifying "free water molecules" or "water potential ($\\Psi_w$)".',
  },
  chem: {
    name: 'IB Chemistry SL',
    defaultReply: (msg, topic) =>
      `In **IB Chemistry SL** (${topic || 'Structure & Reactivity'}), earn full marks by linking macroscopic observations to particulate-level energetics, bonding, and kinetics.\n\nAddressing *"${msg.slice(0, 90)}"*:\n- **Enthalpy & Calorimetry (Reactivity 1.1–1.2)**: Calculate heat absorbed/released using $q = mc\\Delta T$ and convert to molar enthalpy change via $\\Delta H = -\\frac{q}{n_{\\text{limiting}}}$ (in $\\text{kJ mol}^{-1}$), ensuring you identify the limiting reactant first.\n- **Kinetics & Equilibrium (Reactivity 2.2–2.3)**: Increasing temperature shifts the Maxwell–Boltzmann distribution right so a greater fraction of particles have $E \\ge E_a$. Compare the reaction quotient $Q$ against $K_c$ to predict shift direction.`,
    takeaways: [
      'Identify the limiting reactant before computing $\\Delta H = -\\frac{q}{n}$ in calorimetry problems, and watch $\\text{J}$ vs $\\text{kJ}$ unit conversions.',
      'For rate of reaction questions, always state that increasing $T$ increases the fraction of particles with $E \\ge E_a$.',
      'Use IB STP molar gas volume $22.7\\text{ dm}^3\\text{ mol}^{-1}$ at $273.15\\text{ K}$ and $100\\text{ kPa}$, and include state symbols $(s), (l), (g), (aq)$ in thermochemical equations.',
    ],
    followUp:
      'When $50.0\\text{ cm}^3$ of $1.00\\text{ mol dm}^{-3}\\text{ HCl}(aq)$ reacts with $50.0\\text{ cm}^3$ of $1.00\\text{ mol dm}^{-3}\\text{ NaOH}(aq)$ and $\\Delta T = +6.5\\text{ K}$, how do you find $\\Delta H_{\\text{neut}}$ in $\\text{kJ mol}^{-1}$?',
    markschemeTip:
      'In Paper 2 calculations, always show intermediate unrounded values and round the final answer to match the minimum significant figures in the stem.',
  },
  hist: {
    name: 'IB History HL',
    defaultReply: (msg, topic) =>
      `In **IB History HL** (${topic || 'Paper 1 Source Lab & Paper 2/3 Essays'}), top-band responses (13–15/15) synthesize **structural conditions** with **short-term triggers** and explicit historiography.\n\nAnalyzing *"${msg.slice(0, 90)}"*:\n- **Structural vs Immediate Factors**: Balance long-term systemic tensions (economic dislocation, alliance rigidity, ideological polarization) against immediate diplomatic crises.\n- **Historiographical Perspectives**: Contrast **Orthodox**, **Revisionist**, and **Post-Revisionist** interpretations with specific dated empirical evidence.`,
    takeaways: [
      'Organize Paper 2 & 3 paragraphs thematically (political, economic, ideological) rather than chronologically.',
      'For Paper 1 Q3 (OPCVL), explicitly evaluate both Origin & Purpose for Value AND Limitations.',
      'Embed counter-claims in every body paragraph to sustain a multi-causal thesis.',
    ],
    followUp:
      'How would a Revisionist historian challenge the Orthodox claim regarding primary responsibility in this period?',
    markschemeTip:
      'Avoid "narrative drift"—every historical fact must be immediately tied back to the command term ("To what extent", "Evaluate", "Compare and contrast").',
  },
  eng: {
    name: 'IB English A Literature HL',
    defaultReply: (msg, topic) =>
      `In **IB English A Literature HL** (${topic || 'Paper 1 Unseen Commentary & HL Essay'}), Criterion B rewards **how** authorial choices construct meaning rather than summarizing plot.\n\nExploring *"${msg.slice(0, 90)}"*:\n- **Micro-to-Macro Analysis**: Anchor each paragraph in a **structural or stylistic shift** (e.g., caesura, free indirect discourse, ironic juxtaposition, semantic field shift) and trace its effect on the reader's perception.\n- **Thesis Architecture**: Frame your thesis around a tension or paradox within the text rather than a list of three literary devices.`,
    takeaways: [
      'Avoid "device spotting"—explain how syntax, tone, and imagery interact to shape the overarching tension.',
      'In Paper 2 comparative essays, use alternating integrated comparison rather than writing two separate mini-essays.',
      'Track structural progression (opening establisher, pivotal turn/volta, unresolved closure).',
    ],
    followUp:
      'Where does the structural or tonal shift (volta) occur in the passage you are analyzing, and how does the syntax change at that exact moment?',
    markschemeTip:
      'Criterion B (Analysis and Evaluation) requires analyzing form and structure alongside diction and imagery—never treat a poem or prose extract as pure content.',
  },
  fr: {
    name: 'IB French B SL',
    defaultReply: (msg, topic) =>
      `En **IB French B SL** (${topic || 'Production écrite & Orale'}), le Critère A (Langue) valorise les structures idiomatiques et le subjonctif présent.\n\nÀ propos de *« ${msg.slice(0, 90)} »* :\n- **Déclencheurs du subjonctif** : Utilisez *Bien que + subjonctif* (*« Bien que cette mesure soit indispensable... »*) et *Il est primordial que + subjonctif* (*« Il faut que les citoyens prennent conscience de... »*).\n- **Connecteurs logiques** : Structurez votre argumentation avec *Force est de constater que*, *En revanche*, et *Tout porte à croire que*.`,
    takeaways: [
      'Employez au moins deux structures au subjonctif présent (*bien que ce soit*, *pour que nous puissions*).',
      'Respectez les conventions du type de texte (article, lettre formelle, discours, blog) pour le Critère B.',
      'Reliez le thème au contexte culturel francophone (France, Québec, Afrique francophone, Suisse).',
    ],
    followUp:
      'Comment reformuleriez-vous votre idée principale en commençant par « Bien que le gouvernement ait pris des mesures, il est essentiel que... » ?',
    markschemeTip:
      'Pour Paper 1, vérifiez toujours les 3 éléments du type de texte : registre (vouvoiement/tutoiement), titre accrocheur et formule de salutation/clôture.',
  },
  math: {
    name: 'IB Math AA SL',
    defaultReply: (msg, topic) =>
      `In **IB Math AA SL** (${topic || 'Functions, Calculus & Probability'}), earning both method marks ($\\text{M1}$) and accuracy marks ($\\text{A1}$) requires explicit algebraic setup.\n\nBreaking down *"${msg.slice(0, 90)}"*:\n- **Kinematics & Calculus**: Displacement $s(t)$, velocity $v(t) = s'(t)$, and acceleration $a(t) = v'(t) = s''(t)$.\n- **Total Distance vs Displacement**: Displacement on $[t_1, t_2]$ is $\\int_{t_1}^{t_2} v(t)\\,dt$, whereas total distance travelled is:\n$$d = \\int_{t_1}^{t_2} |v(t)|\\,dt$$\nAlways set $v(t) = 0$ first to identify where the particle reverses direction.`,
    takeaways: [
      'Always write down the substitution into the formula before evaluating on your GDC to secure the M1 mark.',
      'Give non-exact numerical answers to 3 significant figures unless otherwise stated.',
      'Check domain restrictions (e.g., $x > 0$ for $\\ln(x)$) when solving logarithmic equations.',
    ],
    followUp:
      'If $v(t) = 3t^2 - 12t + 9\\text{ m s}^{-1}$, at what instants $t$ does the particle change direction, and how would you split the definite integral for total distance on $0 \\le t \\le 4$?',
    markschemeTip:
      'In Paper 1 (No Calculator), leave answers in exact form ($\\frac{\\sqrt{3}}{2}$, $\\ln 5$, $e^2$). In Paper 2, sketch the GDC graph with labeled intersections for M1.',
  },
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = TutorRequestSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid tutor request payload.' },
        { status: 400 }
      );
    }

    const { subjectSlug, topicTitle, message, history } = parsed.data;
    const headerKey = request.headers.get('x-gemini-key');
    const subjectMeta =
      SUBJECT_TUTOR_KNOWLEDGE[subjectSlug] ?? SUBJECT_TUTOR_KNOWLEDGE.bio;

    const historyText = history
      .slice(-6)
      .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
      .join('\n');

    const result = await callGeminiStructured({
      headerKey,
      currentUser: user,
      schema: TutorResponseSchema,
      systemInstruction: `You are Sprout, an expert Socratic IB Diploma Tutor for ${subjectMeta.name}.
Provide concise, markscheme-aligned explanations using KaTeX math/chemistry notation ($...$ or $$...$$) where relevant.
Always return JSON with keys:
- reply (markdown with $...$ LaTeX)
- keyTakeaways (array of 3 concise bullet strings)
- followUpQuestion (one probing Socratic question to test understanding)
- markschemeTip (one specific IB examiner tip)`,
      prompt: `Subject: ${subjectMeta.name}
Topic Context: ${topicTitle || 'General IB Syllabus'}
Recent Conversation:
${historyText || '(Start of session)'}

Student Question: ${message}`,
      fallback: () => ({
        reply: subjectMeta.defaultReply(message, topicTitle),
        keyTakeaways: subjectMeta.takeaways,
        followUpQuestion: subjectMeta.followUp,
        markschemeTip: subjectMeta.markschemeTip,
      }),
    });

    return NextResponse.json({
      ...result.data,
      mode: result.mode,
      modelUsed: result.modelUsed,
      ...(result.fallbackReason ? { fallbackReason: result.fallbackReason } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate tutor response.' },
      { status: 500 }
    );
  }
}
