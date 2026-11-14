'use client';

import React, { useState } from 'react';
import { KaTeXText } from '@/components/math/KaTeXText';

type BioSystemId = 'membrane' | 'mitochondria' | 'chloroplast' | 'sarcomere';

interface HotspotNode {
  id: string;
  label: string;
  x: number;
  y: number;
  syllabusCode: string;
  physiologicalRole: string;
  markschemeKeywords: string[];
  examRejectionWarning: string;
}

interface BioSystemSpec {
  id: BioSystemId;
  title: string;
  themeCode: string;
  subtitle: string;
  hotspots: HotspotNode[];
}

const BIO_SYSTEMS: BioSystemSpec[] = [
  {
    id: 'membrane',
    title: '1. Fluid Mosaic Membrane & Active/Passive Transport',
    themeCode: 'B2.1 · Membranes & Membrane Transport',
    subtitle: 'Amphipathic phospholipid bilayer, aquaporin channel, cholesterol fluidity buffer, and Na⁺/K⁺-ATPase pump.',
    hotspots: [
      {
        id: 'phospholipid',
        label: 'Amphipathic Phospholipid Bilayer',
        x: 115,
        y: 110,
        syllabusCode: 'B2.1.1 & B2.1.2',
        physiologicalRole:
          'Hydrophilic phosphate heads face aqueous extracellular/cytoplasmic fluids while hydrophobic hydrocarbon tails form an interior core with low permeability to polar/charged ions.',
        markschemeKeywords: [
          'amphipathic (hydrophilic head + hydrophobic hydrocarbon tails)',
          'hydrophobic core restricts passage of ions and polar molecules',
          'non-polar molecules ($\\text{O}_2, \\text{CO}_2$, steroid hormones) cross via simple diffusion down concentration gradient',
        ],
        examRejectionWarning:
          'Do NOT say "water-loving" or "water-fearing" without explicitly writing "hydrophilic" and "hydrophobic".',
      },
      {
        id: 'cholesterol',
        label: 'Cholesterol (Fluidity Regulator)',
        x: 245,
        y: 155,
        syllabusCode: 'B2.1.11–B2.1.12 (HL)',
        physiologicalRole:
          'Immobilizes the outer region of phospholipid fatty acid tails at warm physiological temperatures (reducing permeability to small hydrophilic ions) while preventing crystalline packing/solidification at low temperatures.',
        markschemeKeywords: [
          'modulates membrane fluidity across a range of temperatures',
          'restricts phospholipid hydrocarbon tail movement at high temperatures',
          'prevents close packing / crystallization of tails at low temperatures',
        ],
        examRejectionWarning:
          'Never state that cholesterol simply "makes the membrane stronger or rigid".',
      },
      {
        id: 'aquaporin',
        label: 'Aquaporin & Voltage-Gated Ion Channel',
        x: 380,
        y: 120,
        syllabusCode: 'B2.1.6 & B2.1.14 (HL)',
        physiologicalRole:
          'Integral transmembrane channel proteins with a hydrophilic central pore that allow rapid facilitated diffusion of water (aquaporins) or specific ions ($\\text{Na}^+/\\text{K}^+$) down their electrochemical gradient without ATP.',
        markschemeKeywords: [
          'facilitated diffusion down concentration / electrochemical gradient (passive, no ATP)',
          'selective hydrophilic pore lined with polar amino acid R-groups',
          'voltage-gated channels open/close in response to membrane potential changes',
        ],
        examRejectionWarning:
          'Facilitated diffusion uses channels/carriers but is still PASSIVE — never say it uses ATP.',
      },
      {
        id: 'nak-pump',
        label: 'Na⁺/K⁺-ATPase Active Transport Pump',
        x: 530,
        y: 125,
        syllabusCode: 'B2.1.7 & B2.1.15 (HL)',
        physiologicalRole:
          'Primary active transporter that hydrolyzes $1\\text{ ATP} \\rightarrow \\text{ADP} + \\text{P}_i$ (phosphorylating the pump to trigger a conformational change) to pump $3\\,\\text{Na}^+$ OUT and $2\\,\\text{K}^+$ IN against their concentration gradients.',
        markschemeKeywords: [
          'pumps $3\\,\\text{Na}^+$ out of axon/cell and $2\\,\\text{K}^+$ into cell per ATP hydrolyzed',
          'moves ions AGAINST their concentration / electrochemical gradients',
          'phosphorylation by ATP causes conformational change in globular pump protein',
        ],
        examRejectionWarning:
          'Reversing the ratio ($2\\,\\text{Na}^+$ out / $3\\,\\text{K}^+$ in) loses the mark immediately.',
      },
      {
        id: 'glycoprotein',
        label: 'Glycoprotein & Glycolipid (Cell Recognition)',
        x: 645,
        y: 72,
        syllabusCode: 'B2.1.9',
        physiologicalRole:
          'Extracellular carbohydrate chains conjugated to membrane proteins/lipids form the glycocalyx, mediating cell–cell adhesion, immune self/non-self recognition (ABO antigens, MHC), and hormone receptor binding.',
        markschemeKeywords: [
          'carbohydrate chain oriented exclusively on the extracellular face',
          'cell-to-cell recognition / immune antigen identification / hormone receptor',
          'forms hydrogen bonds with surrounding extracellular water to stabilize membrane',
        ],
        examRejectionWarning: 'Never draw or describe carbohydrate chains facing the cytoplasm.',
      },
    ],
  },
  {
    id: 'mitochondria',
    title: '2. Mitochondrial Chemiosmosis & Cell Respiration (HL)',
    themeCode: 'C1.2 · Cell Respiration',
    subtitle: 'Cristae inner mitochondrial membrane, Electron Transport Chain, proton motive force, and ATP synthase.',
    hotspots: [
      {
        id: 'nadh-complex1',
        label: 'Reduced NAD (NADH) Oxidation at ETC',
        x: 145,
        y: 135,
        syllabusCode: 'C1.2.13–C1.2.15 (HL)',
        physiologicalRole:
          'Reduced $\\text{NAD}$ ($\\text{NADH}$) and $\\text{FADH}_2$ from glycolysis, the link reaction, and the Krebs cycle donate high-energy electrons to inner mitochondrial membrane carriers (cristae; individual complex names I–IV are not required). Energy released during redox transfers pumps $\\text{H}^+$ from the matrix into the intermembrane space.',
        markschemeKeywords: [
          'oxidation of reduced NAD ($\\text{NADH}$) releases high-energy electrons to ETC carriers',
          'energy from sequential redox reactions drives proton ($\\text{H}^+$) pumping across inner membrane',
          'cristae infoldings increase surface area for electron transport chains and ATP synthase',
        ],
        examRejectionWarning:
          'Do not say "NADH is converted into ATP" — NADH provides electrons that power proton pumping.',
      },
      {
        id: 'ims-gradient',
        label: 'Intermembrane Space High [H⁺] Reservoir',
        x: 335,
        y: 55,
        syllabusCode: 'B2.2.4 & C1.2.14–C1.2.15 (HL)',
        physiologicalRole:
          'The narrow volume of the intermembrane space allows rapid accumulation of a steep electrochemical proton gradient (high $[\\text{H}^+]$, low pH) relative to the mitochondrial matrix.',
        markschemeKeywords: [
          'protons ($\\text{H}^+$) accumulate in the narrow intermembrane space',
          'generates a steep electrochemical proton gradient / proton motive force (low pH)',
          'inner mitochondrial membrane is impermeable to $\\text{H}^+$ except via ATP synthase',
        ],
        examRejectionWarning:
          'Be precise: protons are pumped FROM the matrix TO the intermembrane space (not into the cytoplasm).',
      },
      {
        id: 'o2-acceptor',
        label: 'Oxygen (Terminal Electron Acceptor)',
        x: 450,
        y: 195,
        syllabusCode: 'C1.2.16 (HL)',
        physiologicalRole:
          'Oxygen accepts low-energy electrons at the end of the electron transport chain and combines with matrix protons to form water ($\\frac{1}{2}\\text{O}_2 + 2\\text{H}^+ + 2e^- \\rightarrow \\text{H}_2\\text{O}$), preventing the ETC from stalling and maintaining the $\\text{H}^+$ gradient.',
        markschemeKeywords: [
          '$\\text{O}_2$ is the terminal electron acceptor at the end of the ETC',
          'combines with electrons and matrix protons ($\\text{H}^+$) to form $\\text{H}_2\\text{O}$',
          'without $\\text{O}_2$, carriers remain reduced and proton pumping / oxidative phosphorylation stops',
        ],
        examRejectionWarning:
          'Always specify that $\\text{O}_2$ also removes free $\\text{H}^+$ from the matrix to form water, helping maintain the proton gradient.',
      },
      {
        id: 'atp-synthase',
        label: 'ATP Synthase Rotary Catalysis (Chemiosmosis)',
        x: 610,
        y: 140,
        syllabusCode: 'C1.2.15 (HL)',
        physiologicalRole:
          'Protons diffuse back down their electrochemical gradient from the intermembrane space into the matrix through the hydrophilic channel of ATP synthase, driving mechanical rotation of the catalytic rotor to phosphorylate $\\text{ADP} + \\text{P}_i \\rightarrow \\text{ATP}$.',
        markschemeKeywords: [
          'chemiosmosis: diffusion of $\\text{H}^+$ down electrochemical gradient through ATP synthase',
          'causes mechanical rotation / conformational change of ATP synthase subunits',
          'catalyzes oxidative phosphorylation: $\\text{ADP} + \\text{P}_i \\rightarrow \\text{ATP}$ in the matrix',
        ],
        examRejectionWarning:
          'Movement of $\\text{H}^+$ through ATP synthase is facilitated diffusion (passive down gradient), not active transport.',
      },
    ],
  },
  {
    id: 'chloroplast',
    title: '3. Chloroplast Light-Dependent Reactions & Calvin Cycle (HL)',
    themeCode: 'C1.3 · Photosynthesis',
    subtitle: 'Thylakoid membrane PSII photolysis, cytochrome proton pumping, PSI NADP⁺ reduction, and stroma RuBisCO Calvin cycle.',
    hotspots: [
      {
        id: 'psii-photolysis',
        label: 'Photosystem II Photoactivation & Photolysis of Water',
        x: 130,
        y: 130,
        syllabusCode: 'C1.3.9 & C1.3.10 (HL)',
        physiologicalRole:
          'Photons absorbed by pigment antenna complexes excite reaction-centre chlorophyll $P_{680}$ electrons in PSII. Oxidized PSII splits water in the thylakoid lumen ($\\text{H}_2\\text{O} \\rightarrow \\frac{1}{2}\\text{O}_2 + 2\\text{H}^+ + 2e^-$) to replace lost electrons and release $\\text{O}_2$.',
        markschemeKeywords: [
          'photoactivation excites electrons in reaction-centre chlorophyll of PSII',
          'photolysis of water in thylakoid lumen provides replacement electrons for PSII',
          'generates $\\text{H}^+$ in the thylakoid space and releases $\\text{O}_2$ as a waste product',
        ],
        examRejectionWarning:
          'Light does NOT directly split water by itself — oxidized reaction-centre chlorophyll in PSII drives water splitting via the oxygen-evolving complex.',
      },
      {
        id: 'cytochrome-pump',
        label: 'Plastoquinone & Cytochrome b6f Thylakoid [H⁺] Gradient',
        x: 300,
        y: 120,
        syllabusCode: 'C1.3.11 (HL)',
        physiologicalRole:
          'Electrons pass from PSII via plastoquinone to the cytochrome complex, releasing energy used to pump protons from the stroma into the thylakoid lumen. $\\text{H}^+$ diffuses back to the stroma through ATP synthase (photophosphorylation).',
        markschemeKeywords: [
          'electrons pass along chain of carriers (plastoquinone / cytochrome complex)',
          'protons ($\\text{H}^+$) pumped from stroma into thylakoid space/lumen',
          'chemiosmosis through ATP synthase into stroma produces ATP (photophosphorylation)',
        ],
        examRejectionWarning:
          'Note the direction inversion vs mitochondria: in chloroplasts, high $[\\text{H}^+]$ is inside the **thylakoid lumen**, and ATP is synthesized in the **stroma**.',
      },
      {
        id: 'psi-nadp',
        label: 'Photosystem I & Ferredoxin Reduction of NADP⁺',
        x: 465,
        y: 125,
        syllabusCode: 'C1.3.11–C1.3.12 (HL)',
        physiologicalRole:
          'Re-excited electrons from PSI pass via ferredoxin to $\\text{NADP}^+$ reductase on the stroma side, reducing $\\text{NADP}^+ + \\text{H}^+ + 2e^- \\rightarrow \\text{NADPH}$ (reduced NADP), or cycle back through the ETC in cyclic photophosphorylation to generate extra ATP.',
        markschemeKeywords: [
          'photoactivation of PSI excites electrons passed to ferredoxin',
          '$\\text{NADP}^+$ reduced to NADPH (reduced NADP) in the stroma',
          'provides reducing power (hydrogen/electrons) for the light-independent Calvin cycle',
        ],
        examRejectionWarning:
          'Never write "NADH" in photosynthesis! Marks are strictly deducted if you write NAD/NADH instead of NADP/reduced NADP (NADPH).',
      },
      {
        id: 'rubisco-calvin',
        label: 'Calvin Cycle: RuBisCO Carboxylation of RuBP & TP Regeneration',
        x: 628,
        y: 162,
        syllabusCode: 'C1.3.15–C1.3.18 (HL)',
        physiologicalRole:
          'In the stroma, RuBisCO catalyzes carbon fixation of $\\text{CO}_2$ onto $5\\text{C}$ ribulose bisphosphate (RuBP) to form two molecules of $3\\text{C}$ glycerate 3-phosphate (GP). ATP and $\\text{NADPH}$ reduce GP to triose phosphate (TP); $5/6$ of TP regenerates RuBP using ATP.',
        markschemeKeywords: [
          'RuBisCO carboxylates ribulose bisphosphate (RuBP, $5\\text{C}$) with $\\text{CO}_2$ to form $2 \\times$ GP ($3\\text{C}$)',
          'GP reduced to triose phosphate (TP) using ATP and reduced NADP ($\\text{NADPH}$) from light-dependent reactions',
          '$5$ of every $6$ TP molecules are phosphorylated by ATP to regenerate RuBP',
        ],
        examRejectionWarning:
          'Do not say "RuBisCO converts $\\text{CO}_2$ into glucose" — name RuBP, GP (glycerate 3-phosphate), and TP (triose phosphate).',
      },
    ],
  },
  {
    id: 'sarcomere',
    title: '4. Sarcomere Sliding Filament & Neuron Action Potential (HL)',
    themeCode: 'B3.3 Muscle & Motility · C2.2 Neural Signalling',
    subtitle: 'Ca²⁺–troponin–tropomyosin unblocking, myosin ATP cross-bridge cycle, and axon depolarization/repolarization.',
    hotspots: [
      {
        id: 'ca-troponin',
        label: 'Ca²⁺ Release & Troponin–Tropomyosin Shift',
        x: 145,
        y: 95,
        syllabusCode: 'B3.3.4 & B3.3.5 (HL)',
        physiologicalRole:
          'Action potential arrival down T-tubules triggers $\\text{Ca}^{2+}$ release from the sarcoplasmic reticulum. $\\text{Ca}^{2+}$ binds to troponin, causing tropomyosin to shift and expose myosin-binding sites on the actin filament.',
        markschemeKeywords: [
          'sarcoplasmic reticulum releases $\\text{Ca}^{2+}$ ions into sarcoplasm',
          '$\\text{Ca}^{2+}$ binds to troponin, causing conformational shift in tropomyosin',
          'exposes myosin-binding sites on actin thin filaments',
        ],
        examRejectionWarning:
          'Clearly distinguish troponin ($\\text{Ca}^{2+}$ binds here) from tropomyosin (blocks binding sites on actin at rest).',
      },
      {
        id: 'myosin-atp',
        label: 'Myosin Head Cross-Bridge, Power Stroke & Titin Recoil',
        x: 345,
        y: 145,
        syllabusCode: 'B3.3.2 & B3.3.3 (HL)',
        physiologicalRole:
          'ATP binding detaches the myosin head from actin; ATP hydrolysis ($\\text{ATP} \\rightarrow \\text{ADP} + \\text{P}_i$) cocks the myosin head into its high-energy angle. Cross-bridge binding and release of $\\text{ADP} + \\text{P}_i$ drives the power stroke sliding actin toward the M-line (shortening H-zone and I-band while A-band stays constant), while elastic **titin** anchors myosin to Z-lines to prevent overstretching.',
        markschemeKeywords: [
          'ATP binding breaks cross-bridge; ATP hydrolysis cocks myosin head',
          'myosin head binds actin forming a cross-bridge; release of $\\text{ADP} + \\text{P}_i$ triggers power stroke',
          'Z-lines move closer together; H-zone and I-band narrow while A-band width remains constant; titin provides elastic recoil',
        ],
        examRejectionWarning:
          'Without fresh ATP (rigor mortis), myosin heads CANNOT detach from actin.',
      },
      {
        id: 'depolarization',
        label: 'Axon Depolarization (−70 mV Threshold to +30 mV)',
        x: 525,
        y: 85,
        syllabusCode: 'C2.2.8 & C2.2.9 (HL)',
        physiologicalRole:
          'When local currents depolarize the axon membrane from resting potential ($-70\\text{ mV}$) to threshold ($-55\\text{ mV}$), voltage-gated $\\text{Na}^+$ channels open rapidly, causing an explosive influx of $\\text{Na}^+$ down its electrochemical gradient to $+30\\text{ mV}$ (positive feedback).',
        markschemeKeywords: [
          'threshold potential ($-55\\text{ mV}$) opens voltage-gated $\\text{Na}^+$ channels',
          'rapid influx of $\\text{Na}^+$ ions into axoplasm by facilitated diffusion',
          'reverses membrane polarity from $-70\\text{ mV}$ to $+30\\text{ mV}$',
        ],
        examRejectionWarning:
          'Always specify that $\\text{Na}^+$ enters by facilitated diffusion through voltage-gated channels, NOT via the $\\text{Na}^+/\\text{K}^+$ pump.',
      },
      {
        id: 'repolarization',
        label: 'Repolarization & Refractory Period (K⁺ Efflux)',
        x: 578,
        y: 155,
        syllabusCode: 'C2.2.9 & C2.2.10 (HL)',
        physiologicalRole:
          'At $+30\\text{ mV}$, voltage-gated $\\text{Na}^+$ channels inactivate and voltage-gated $\\text{K}^+$ channels open, allowing $\\text{K}^+$ to diffuse out of the axon and restore a negative interior (briefly hyperpolarizing below $-70\\text{ mV}$, ensuring unidirectional propagation).',
        markschemeKeywords: [
          'voltage-gated $\\text{Na}^+$ channels close/inactivate and voltage-gated $\\text{K}^+$ channels open',
          'efflux of $\\text{K}^+$ ions out of axon restores negative membrane potential',
          'refractory period / hyperpolarization prevents backward propagation of action potential',
        ],
        examRejectionWarning:
          'Do not say the $\\text{Na}^+/\\text{K}^+$ pump causes repolarization — voltage-gated $\\text{K}^+$ channels cause repolarization; the pump maintains resting ion gradients.',
      },
    ],
  },
];

export function BiologyVisualizationsTool() {
  const [activeSystemId, setActiveSystemId] = useState<BioSystemId>('membrane');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('nak-pump');

  const activeSystem =
    BIO_SYSTEMS.find((s) => s.id === activeSystemId) ?? BIO_SYSTEMS[0];
  const activeHotspot =
    activeSystem.hotspots.find((h) => h.id === selectedHotspotId) ??
    activeSystem.hotspots[0];

  const handleSelectSystem = (sys: BioSystemSpec) => {
    setActiveSystemId(sys.id);
    setSelectedHotspotId(sys.hotspots[0].id);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes bioHotspotPulse {
          0% {
            transform: scale(1);
            opacity: 0.45;
          }
          70% {
            transform: scale(1.52);
            opacity: 0;
          }
          100% {
            transform: scale(1.52);
            opacity: 0;
          }
        }
        @keyframes bioInspectorEnter {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bio-hotspot-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: bioHotspotPulse 2.2s cubic-bezier(0.23, 1, 0.32, 1) infinite;
        }
        .bio-hotspot-pin {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .bio-focus-ring {
          opacity: 0;
          transition: opacity 150ms ease;
        }
        .bio-hotspot-group:focus-visible .bio-focus-ring {
          opacity: 1;
        }
        .bio-pill-interactive {
          transition:
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease,
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .bio-pill-interactive:active {
          transform: scale(0.975);
        }
        .bio-inspector-enter {
          animation: bioInspectorEnter 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (hover: hover) and (pointer: fine) {
          .bio-hotspot-group:hover .bio-hotspot-pin {
            transform: scale(1.07);
          }
          .bio-pill-interactive:hover {
            transform: translateY(-1px);
          }
          .bio-pill-interactive:active {
            transform: scale(0.975);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bio-hotspot-pulse {
            animation: none;
            opacity: 0.25;
            transform: scale(1.24);
          }
          .bio-hotspot-pin,
          .bio-pill-interactive {
            transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
          }
          .bio-hotspot-group:hover .bio-hotspot-pin,
          .bio-pill-interactive:hover,
          .bio-pill-interactive:active {
            transform: none;
          }
          .bio-inspector-enter {
            animation: bioInspectorFadeOnly 160ms ease both;
          }
        }
        @keyframes bioInspectorFadeOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header & System Tabs */}
      <div className="hairline-card">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="mini-tag bg-[#DCFCE7] text-[#065F46] border border-[#A7F3D0] font-mono">
            IB BIOLOGY HL · 2025 THEMES A–D
          </span>
          <span className="text-[12px] text-[#71717A] font-mono">
            Interactive Ultrastructure &amp; Pathway Explorer
          </span>
        </div>
        <h2
          className="text-[20px] font-semibold tracking-tight text-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Cell &amp; Pathway Visualizations (Click Hotspots for IB Markscheme Terminology)
        </h2>
        <p className="text-[13px] text-[#71717A] mt-0.5">
          Click any numbered node on the biological schematic to inspect the 2025 syllabus subtopic, mechanism, and required Paper 2 terminology.
        </p>

        <div
          role="tablist"
          aria-label="Biology pathway diagrams"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4E4E7]"
        >
          {BIO_SYSTEMS.map((sys) => {
            const active = sys.id === activeSystem.id;
            return (
              <button
                key={sys.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectSystem(sys)}
                className={`bio-pill-interactive px-3.5 py-1.5 rounded-full text-[12px] font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                  active
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#18181B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                {sys.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Canvas + Markscheme Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 hairline-card space-y-3 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-[11.5px] font-mono font-semibold text-[#059669]">
                {activeSystem.themeCode}
              </span>
              <h3
                className="text-[15.5px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {activeSystem.title}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-[11px] font-mono text-[#3F3F46] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
              Node{' '}
              {activeSystem.hotspots.findIndex((h) => h.id === activeHotspot.id) + 1}{' '}
              of {activeSystem.hotspots.length}
            </span>
          </div>

          {/* Interactive Biological Schematic SVG */}
          <div className="rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFA] p-2.5 sm:p-3 overflow-x-auto">
            <svg
              viewBox="0 0 740 245"
              className="w-full h-auto min-w-[540px]"
              role="img"
              aria-label={activeSystem.title}
            >
              <defs>
                <linearGradient id="bio-lumen-wash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="bio-matrix-wash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F4F4F5" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="bio-protein-emerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#065F46" />
                </linearGradient>
                <linearGradient id="bio-protein-teal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="bio-channel-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BAE6FD" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <marker
                  id="bio-arrow-emerald"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                </marker>
                <marker
                  id="bio-arrow-amber"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
                </marker>
                <marker
                  id="bio-arrow-sky"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
                </marker>
              </defs>

              {/* Background Compartments */}
              <rect
                x="8"
                y="8"
                width="724"
                height="72"
                rx="9"
                fill="url(#bio-lumen-wash)"
                stroke="#D1FAE5"
                strokeWidth="1"
              />
              <rect
                x="8"
                y="84"
                width="724"
                height="82"
                rx="9"
                fill="#FFFFFF"
                stroke="#E4E4E7"
                strokeWidth="1"
              />
              <rect
                x="8"
                y="170"
                width="724"
                height="67"
                rx="9"
                fill="url(#bio-matrix-wash)"
                stroke="#E4E4E7"
                strokeWidth="1"
              />

              {/* System-Specific Layered Biological Artwork */}
              {activeSystem.id === 'membrane' && (
                <g opacity="0.92" aria-hidden="true">
                  {/* Hydrophobic bilayer ribbon */}
                  <rect x="18" y="96" width="704" height="58" rx="6" fill="#ECFDF5" opacity="0.45" />

                  {/* Repeating Phospholipids (skipping transmembrane protein gaps) */}
                  {Array.from({ length: 34 }).map((_, i) => {
                    const px = 26 + i * 20;
                    if (
                      (px > 346 && px < 414) ||
                      (px > 492 && px < 568) ||
                      (px > 622 && px < 668)
                    ) {
                      return null;
                    }
                    const isCholesterolSlot = px > 228 && px < 262;
                    return (
                      <g key={px}>
                        {/* Outer phosphate head + tails */}
                        <circle
                          cx={px}
                          cy={95}
                          r={6.2}
                          fill="#A7F3D0"
                          stroke="#059669"
                          strokeWidth="1.4"
                        />
                        <circle cx={px - 1.8} cy={93.4} r={1.5} fill="#FFFFFF" opacity="0.8" />
                        <path
                          d={`M ${px - 2.3} 101 Q ${px - 4.5} 112 ${px - 2} 123`}
                          stroke="#34D399"
                          strokeWidth="1.35"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M ${px + 2.3} 101 Q ${px + 4.5} 112 ${px + 2} 123`}
                          stroke="#34D399"
                          strokeWidth="1.35"
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Inner cytoplasmic phosphate head + tails */}
                        {!isCholesterolSlot && (
                          <>
                            <circle
                              cx={px}
                              cy={157}
                              r={6.2}
                              fill="#A7F3D0"
                              stroke="#059669"
                              strokeWidth="1.4"
                            />
                            <circle cx={px - 1.8} cy={155.4} r={1.5} fill="#FFFFFF" opacity="0.8" />
                            <path
                              d={`M ${px - 2.3} 151 Q ${px - 4.5} 140 ${px - 2} 129`}
                              stroke="#34D399"
                              strokeWidth="1.35"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <path
                              d={`M ${px + 2.3} 151 Q ${px + 4.5} 140 ${px + 2} 129`}
                              stroke="#34D399"
                              strokeWidth="1.35"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* Cholesterol Sterol Rings wedged in lower leaflet near (245, 155) */}
                  <g transform="translate(232, 128)">
                    <polygon points="8,4 16,0 24,4 24,13 16,17 8,13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.4" />
                    <polygon points="15,15 23,11 31,15 31,24 23,28 15,24" fill="#FDE68A" stroke="#D97706" strokeWidth="1.4" />
                    <circle cx="14" cy="30" r="3.5" fill="#F59E0B" />
                  </g>

                  {/* Aquaporin / Ion Channel Protein at (380, 120) */}
                  <g>
                    <rect x="355" y="84" width="18" height="82" rx="9" fill="url(#bio-channel-sky)" stroke="#0369A1" strokeWidth="1.3" />
                    <rect x="387" y="84" width="18" height="82" rx="9" fill="url(#bio-channel-sky)" stroke="#0369A1" strokeWidth="1.3" />
                    <rect x="373" y="86" width="14" height="78" fill="#E0F2FE" opacity="0.85" />
                    <line
                      x1="380"
                      y1="66"
                      x2="380"
                      y2="180"
                      stroke="#0284C7"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                      markerEnd="url(#bio-arrow-sky)"
                    />
                    <circle cx="380" cy="64" r="3" fill="#38BDF8" />
                    <circle cx="380" cy="189" r="3" fill="#38BDF8" />
                  </g>

                  {/* Na+/K+-ATPase Pump at (530, 125) */}
                  <g>
                    <path
                      d="M 500 84 C 500 78, 524 78, 524 88 L 522 162 C 522 170, 500 170, 500 162 Z"
                      fill="url(#bio-protein-emerald)"
                      stroke="#064E3B"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M 536 88 C 536 78, 560 78, 560 84 L 560 162 C 560 170, 538 170, 538 162 Z"
                      fill="url(#bio-protein-emerald)"
                      stroke="#064E3B"
                      strokeWidth="1.4"
                    />
                    <rect x="522" y="92" width="16" height="66" rx="6" fill="#ECFDF5" opacity="0.7" />
                    {/* 3 Na+ out arrow & 2 K+ in arrow */}
                    <line x1="518" y1="184" x2="518" y2="62" stroke="#059669" strokeWidth="1.6" markerEnd="url(#bio-arrow-emerald)" />
                    <line x1="542" y1="62" x2="542" y2="184" stroke="#D97706" strokeWidth="1.6" markerEnd="url(#bio-arrow-amber)" />
                    {/* ATP Hydrolysis pill */}
                    <rect x="502" y="191" width="60" height="18" rx="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.1" />
                    <text x="532" y="203" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#92400E">
                      ATP→ADP+Pᵢ
                    </text>
                  </g>

                  {/* Glycoprotein + Carbohydrate Chain at (645, 72) */}
                  <g>
                    <rect x="633" y="84" width="24" height="80" rx="11" fill="url(#bio-protein-teal)" stroke="#065F46" strokeWidth="1.3" />
                    <path
                      d="M 645 84 L 645 64 L 630 50 M 645 64 L 660 48 M 660 48 L 672 39"
                      stroke="#059669"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {[
                      [645, 64],
                      [630, 50],
                      [660, 48],
                      [672, 39],
                    ].map(([hx, hy]) => (
                      <circle
                        key={`${hx}-${hy}`}
                        cx={hx}
                        cy={hy}
                        r={5}
                        fill="#34D399"
                        stroke="#065F46"
                        strokeWidth="1.3"
                      />
                    ))}
                  </g>
                </g>
              )}

              {activeSystem.id === 'mitochondria' && (
                <g opacity="0.94" aria-hidden="true">
                  {/* Outer Mitochondrial Membrane */}
                  <path
                    d="M 24 38 Q 370 18 716 38"
                    stroke="#065F46"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  {/* Folded Cristae Inner Membrane */}
                  <path
                    d="M 24 118 L 100 118 C 122 118, 128 152, 152 152 C 176 152, 184 114, 212 114 C 242 114, 248 156, 278 156 C 308 156, 316 116, 348 116 L 560 116 C 584 116, 592 152, 622 152 L 716 152"
                    stroke="#059669"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.22"
                  />
                  <path
                    d="M 24 118 L 100 118 C 122 118, 128 152, 152 152 C 176 152, 184 114, 212 114 C 242 114, 248 156, 278 156 C 308 156, 316 116, 348 116 L 560 116 C 584 116, 592 152, 622 152 L 716 152"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* ETC Complexes I - IV */}
                  {[
                    { x: 128, y: 112, w: 34, h: 48, label: 'I' },
                    { x: 204, y: 108, w: 28, h: 42, label: 'II' },
                    { x: 266, y: 112, w: 32, h: 48, label: 'III' },
                    { x: 334, y: 108, w: 34, h: 48, label: 'IV' },
                  ].map((c) => (
                    <g key={c.label}>
                      <rect
                        x={c.x}
                        y={c.y}
                        width={c.w}
                        height={c.h}
                        rx="11"
                        fill="url(#bio-protein-emerald)"
                        stroke="#064E3B"
                        strokeWidth="1.3"
                      />
                      <text
                        x={c.x + c.w / 2}
                        y={c.y + c.h / 2 + 3.5}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="#FFFFFF"
                      >
                        {c.label}
                      </text>
                    </g>
                  ))}

                  {/* Electron Flow Ribbon + H+ Pumping Arrows */}
                  <path
                    d="M 145 135 Q 250 118 351 132 Q 405 142 442 184"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    fill="none"
                    markerEnd="url(#bio-arrow-amber)"
                  />
                  {[145, 282, 351].map((px) => (
                    <line
                      key={px}
                      x1={px}
                      y1={164}
                      x2={px}
                      y2={74}
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      markerEnd="url(#bio-arrow-emerald)"
                    />
                  ))}

                  {/* Intermembrane Space H+ Gradient Badges */}
                  {[
                    [235, 58],
                    [292, 48],
                    [378, 56],
                    [445, 62],
                    [525, 54],
                  ].map(([hx, hy]) => (
                    <g key={`${hx}-${hy}`}>
                      <circle cx={hx} cy={hy} r="9" fill="#DCFCE7" stroke="#059669" strokeWidth="1" />
                      <text x={hx} y={hy + 3} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                        H⁺
                      </text>
                    </g>
                  ))}

                  {/* Oxygen Reduction Badge near (450, 195) */}
                  <rect x="386" y="182" width="144" height="24" rx="12" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
                  <text x="458" y="197.5" textAnchor="middle" fontSize="9.2" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                    ½O₂ + 2H⁺ + 2e⁻ → H₂O
                  </text>

                  {/* F0-F1 ATP Synthase Lollipop Rotor at (610, 140) */}
                  <g>
                    <rect x="598" y="112" width="24" height="36" rx="6" fill="url(#bio-protein-teal)" stroke="#065F46" strokeWidth="1.3" />
                    <rect x="605" y="148" width="10" height="16" fill="#059669" />
                    <ellipse cx="610" cy="176" rx="22" ry="15" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    <line x1="610" y1="74" x2="610" y2="160" stroke="#059669" strokeWidth="1.8" markerEnd="url(#bio-arrow-emerald)" />
                    <text x="610" y="179" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#92400E">
                      ATP
                    </text>
                  </g>
                </g>
              )}

              {activeSystem.id === 'chloroplast' && (
                <g opacity="0.94" aria-hidden="true">
                  {/* Thylakoid Membrane Band */}
                  <rect x="20" y="108" width="490" height="34" rx="17" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />

                  {/* PSII + Light Photon + Water Splitting at (130, 130) */}
                  <g>
                    <rect x="108" y="98" width="44" height="54" rx="14" fill="url(#bio-protein-emerald)" stroke="#064E3B" strokeWidth="1.4" />
                    <text x="130" y="128" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#FFFFFF">
                      PSII
                    </text>
                    {/* Photon squiggle */}
                    <path d="M 88 182 L 98 168 L 93 166 L 108 148" stroke="#D97706" strokeWidth="1.8" fill="none" markerEnd="url(#bio-arrow-amber)" />
                    <text x="72" y="186" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#B45309">
                      hν
                    </text>
                    {/* Photolysis H2O -> O2 + 2H+ in Lumen */}
                    <rect x="86" y="45" width="96" height="22" rx="11" fill="#FFFFFF" stroke="#059669" strokeWidth="1.2" />
                    <text x="134" y="59" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      H₂O→½O₂+2H⁺
                    </text>
                  </g>

                  {/* Plastoquinone & Cytochrome b6f at (300, 120) */}
                  <g>
                    <circle cx="222" cy="125" r="12" fill="#A7F3D0" stroke="#059669" strokeWidth="1.4" />
                    <text x="222" y="128" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      PQ
                    </text>
                    <rect x="280" y="96" width="40" height="56" rx="12" fill="url(#bio-protein-teal)" stroke="#065F46" strokeWidth="1.4" />
                    <text x="300" y="128" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="bold" fill="#FFFFFF">
                      Cyt
                    </text>
                    <line x1="300" y1="186" x2="300" y2="62" stroke="#059669" strokeWidth="1.7" markerEnd="url(#bio-arrow-emerald)" />
                    <text x="310" y="64" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      H⁺
                    </text>
                  </g>

                  {/* ATP Synthase on Thylakoid Membrane (Photophosphorylation) */}
                  <g>
                    <rect x="366" y="101" width="24" height="48" rx="8" fill="url(#bio-protein-teal)" stroke="#065F46" strokeWidth="1.3" />
                    <ellipse cx="378" cy="166" rx="18" ry="11" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.3" />
                    <line x1="378" y1="62" x2="378" y2="154" stroke="#059669" strokeWidth="1.7" markerEnd="url(#bio-arrow-emerald)" />
                    <text x="378" y="169" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#92400E">
                      ATP
                    </text>
                  </g>

                  {/* PSI + Ferredoxin / NADP+ Reductase at (465, 125) */}
                  <g>
                    <rect x="444" y="98" width="42" height="54" rx="14" fill="url(#bio-protein-emerald)" stroke="#064E3B" strokeWidth="1.4" />
                    <text x="465" y="128" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#FFFFFF">
                      PSI
                    </text>
                    <path d="M 156 125 L 208 125 M 236 125 L 276 125 M 322 125 L 440 125" stroke="#D97706" strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#bio-arrow-amber)" />
                    <rect x="424" y="176" width="96" height="22" rx="11" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                    <text x="472" y="190" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#92400E">
                      NADP⁺ → NADPH
                    </text>
                  </g>

                  {/* Dedicated Stroma Calvin Cycle Pocket on Right at (628, 162) */}
                  <g>
                    <rect x="546" y="88" width="176" height="142" rx="12" fill="#F4F4F5" stroke="#D4D4D8" strokeWidth="1.2" />
                    <text x="634" y="102" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#52525B">
                      STROMA (Calvin Cycle)
                    </text>
                    <circle cx="628" cy="162" r="44" fill="#ECFDF5" stroke="#059669" strokeWidth="2" strokeDasharray="7 4" />
                    <circle cx="628" cy="162" r="23" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.3" />
                    <text x="628" y="159" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      Calvin
                    </text>
                    <text x="628" y="170" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669">
                      RuBisCO
                    </text>
                    <rect x="562" y="110" width="54" height="18" rx="9" fill="#FFFFFF" stroke="#059669" strokeWidth="1" />
                    <text x="589" y="122" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      RuBP (5C)
                    </text>
                    <rect x="650" y="198" width="54" height="18" rx="9" fill="#FFFFFF" stroke="#059669" strokeWidth="1" />
                    <text x="677" y="210" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                      GP → TP
                    </text>
                  </g>
                </g>
              )}

              {activeSystem.id === 'sarcomere' && (
                <g opacity="0.94" aria-hidden="true">
                  {/* Left: Sarcomere Z-Lines, Actin, Tropomyosin & Myosin Heads */}
                  <line x1="34" y1="86" x2="34" y2="196" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="416" y1="86" x2="416" y2="196" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="225" y1="88" x2="225" y2="194" stroke="#A1A1AA" strokeWidth="1.4" strokeDasharray="3 3" />

                  {/* Actin Thin Filaments + Tropomyosin & Ca2+ near (145, 95) */}
                  {[102, 178].map((ay) => (
                    <g key={ay}>
                      <line x1="34" y1={ay} x2="188" y2={ay} stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
                      <line x1="262" y1={ay} x2="416" y2={ay} stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
                      <path
                        d={`M 42 ${ay - 3} Q 95 ${ay + 4} 145 ${ay - 3} T 186 ${ay - 2}`}
                        stroke="#065F46"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </g>
                  ))}
                  {/* Ca2+ Ions binding Troponin */}
                  {[132, 152, 168].map((cx) => (
                    <circle key={cx} cx={cx} cy={90} r="4.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
                  ))}

                  {/* Thick Myosin Filament & Cross-Bridge Heads around (345, 145) */}
                  <rect x="112" y="135" width="246" height="14" rx="7" fill="url(#bio-protein-emerald)" stroke="#064E3B" strokeWidth="1.3" />
                  {[138, 176, 274, 314, 348].map((mx) => (
                    <g key={mx}>
                      <path d={`M ${mx} 135 Q ${mx + 8} 118 ${mx + 14} 109`} stroke="#065F46" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <circle cx={mx + 14} cy={109} r="4.2" fill="#34D399" stroke="#065F46" strokeWidth="1.2" />
                      <path d={`M ${mx} 149 Q ${mx + 8} 166 ${mx + 14} 173`} stroke="#065F46" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <circle cx={mx + 14} cy={173} r="4.2" fill="#34D399" stroke="#065F46" strokeWidth="1.2" />
                    </g>
                  ))}

                  {/* Divider */}
                  <line x1="436" y1="88" x2="436" y2="206" stroke="#E4E4E7" strokeWidth="1.5" />

                  {/* Right: Action Potential Waveform Trace (Depolarization & Repolarization) */}
                  <line x1="452" y1="166" x2="718" y2="166" stroke="#D4D4D8" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="452" y1="146" x2="718" y2="146" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" />
                  <path
                    d="M 454 166 L 486 166 Q 502 164 510 146 L 530 74 Q 536 62 542 76 L 568 176 Q 584 196 616 172 L 664 166 L 716 166"
                    stroke="#059669"
                    strokeWidth="2.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text x="454" y="142" fontSize="8" fontFamily="monospace" fill="#B45309">
                    −55 mV threshold
                  </text>
                  <text x="546" y="72" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#065F46">
                    +30 mV (Na⁺ in)
                  </text>
                  <text x="582" y="198" fontSize="8" fontFamily="monospace" fill="#52525B">
                    K⁺ efflux
                  </text>
                </g>
              )}

              {/* Compartment Labels (clean frosted pills so labels stay legible over organelle graphics) */}
              <g>
                <rect x="16" y="14" width="380" height="20" rx="5" fill="#FFFFFF" opacity="0.82" />
                <text x="22" y="27.5" fontSize="10" fontFamily="monospace" fill="#065F46" fontWeight="bold">
                  {activeSystem.id === 'membrane' && 'EXTRACELLULAR FLUID (High [Na⁺])'}
                  {activeSystem.id === 'mitochondria' && 'INTERMEMBRANE SPACE (High [H⁺], Low pH Reservoir)'}
                  {activeSystem.id === 'chloroplast' && 'THYLAKOID LUMEN / SPACE (High [H⁺], Photolysis of H₂O)'}
                  {activeSystem.id === 'sarcomere' && 'SARCOPLASMIC RETICULUM / EXTRACELLULAR AXON'}
                </text>
              </g>
              <g>
                <rect x="16" y="88" width="410" height="18" rx="5" fill="#FFFFFF" opacity="0.84" />
                <text x="22" y="100.5" fontSize="10" fontFamily="monospace" fill="#52525B" fontWeight="bold">
                  {activeSystem.id === 'membrane' && 'HYDROPHOBIC PHOSPHOLIPID CORE (7–10 nm Bilayer)'}
                  {activeSystem.id === 'mitochondria' && 'INNER MITOCHONDRIAL MEMBRANE (Cristae ETC Complexes I–IV)'}
                  {activeSystem.id === 'chloroplast' && 'THYLAKOID MEMBRANE (PSII → Plastoquinone → Cytochrome → PSI)'}
                  {activeSystem.id === 'sarcomere' && 'ACTIN–MYOSIN CROSS-BRIDGE ZONE / AXOLEMMA CHANNELS'}
                </text>
              </g>
              <g>
                <rect x="16" y="210" width="446" height="20" rx="5" fill="#FFFFFF" opacity="0.86" />
                <text x="22" y="223.5" fontSize="10" fontFamily="monospace" fill="#52525B" fontWeight="bold">
                  {activeSystem.id === 'membrane' && 'CYTOPLASM (High [K⁺], ATP Hydrolysis)'}
                  {activeSystem.id === 'mitochondria' && 'MITOCHONDRIAL MATRIX (Krebs Cycle, O₂ + 4H⁺ + 4e⁻ → 2H₂O, ATP Synthesis)'}
                  {activeSystem.id === 'chloroplast' && 'CHLOROPLAST STROMA (NADPH + ATP → RuBisCO Calvin Cycle)'}
                  {activeSystem.id === 'sarcomere' && 'SARCOPLASM / AXOPLASM (−70 mV Resting → +30 mV Spike)'}
                </text>
              </g>

              {/* Structural Flow Lines between Hotspots */}
              {activeSystem.hotspots.map((node, idx) => {
                const next = activeSystem.hotspots[idx + 1];
                if (!next) return null;
                return (
                  <line
                    key={`${node.id}-${next.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#71717A"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.55"
                  />
                );
              })}

              {/* Interactive Hotspot Nodes */}
              {activeSystem.hotspots.map((node, index) => {
                const isSelected = node.id === activeHotspot.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Hotspot ${index + 1}: ${node.label}`}
                    onClick={() => setSelectedHotspotId(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedHotspotId(node.id);
                      }
                    }}
                    className="bio-hotspot-group cursor-pointer focus-visible:outline-none"
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={26}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      className="bio-focus-ring"
                    />
                    {isSelected && (
                      <circle
                        cx={0}
                        cy={0}
                        r={22}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        className="bio-hotspot-pulse"
                      />
                    )}
                    <g className="bio-hotspot-pin">
                      <circle
                        cx={0}
                        cy={0}
                        r={isSelected ? 20 : 16}
                        fill={isSelected ? '#059669' : '#FFFFFF'}
                        stroke={isSelected ? '#065F46' : '#18181B'}
                        strokeWidth={isSelected ? 2.5 : 1.75}
                      />
                      {isSelected && (
                        <circle
                          cx={0}
                          cy={0}
                          r={23.5}
                          fill="none"
                          stroke="#A7F3D0"
                          strokeWidth="1.5"
                        />
                      )}
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fontSize="12"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={isSelected ? '#FFFFFF' : '#18181B'}
                      >
                        {index + 1}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Diagram Legend Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono text-[#71717A]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A7F3D0] border border-[#059669]" aria-hidden="true" />
                <span>Lipid / Membrane</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#059669]" aria-hidden="true" />
                <span>Protein / Enzyme</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEF3C7] border border-[#D97706]" aria-hidden="true" />
                <span>ATP / Ion / Electron Flux</span>
              </span>
            </div>
            <span>Click a numbered node (1–{activeSystem.hotspots.length})</span>
          </div>

          {/* Hotspot Quick-Select Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activeSystem.hotspots.map((node, idx) => {
              const isSelected = node.id === activeHotspot.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedHotspotId(node.id)}
                  className={`bio-pill-interactive px-3 py-1.5 rounded-[9px] text-[12px] font-medium border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                    isSelected
                      ? 'border-[#059669] bg-[#ECFDF5] text-[#065F46] font-semibold'
                      : 'border-[#E4E4E7] bg-white text-[#27272A] hover:bg-[#F4F4F5]'
                  }`}
                >
                  <span className="font-mono font-bold mr-1.5">{idx + 1}.</span>
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: IB 2025 Syllabus & Markscheme Terminology Card */}
        <div
          key={activeHotspot.id}
          className="bio-inspector-enter lg:col-span-5 hairline-card bg-[#FAFAFA] border-l-[3.5px] border-l-[#059669] flex flex-col justify-between space-y-4 min-w-0"
        >
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
              <span className="mini-tag bg-[#DCFCE7] text-[#065F46] border border-[#A7F3D0] font-mono">
                Syllabus {activeHotspot.syllabusCode}
              </span>
              <span className="text-[11.5px] font-mono text-[#71717A]">
                IB Biology HL Paper 2
              </span>
            </div>

            <h3
              className="text-[18px] font-bold text-[#18181B] leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {activeHotspot.label}
            </h3>

            <div className="p-3.5 rounded-[10px] bg-white border border-[#E4E4E7] text-[13px] text-[#27272A] leading-relaxed">
              <KaTeXText text={activeHotspot.physiologicalRole} as="div" />
            </div>

            <div className="p-3.5 rounded-[10px] bg-white border border-[#E4E4E7] space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wide text-[#059669]">
                Required IB Markscheme Phrases (Award 1 Mark Each)
              </div>
              <ul className="space-y-1.5 text-[12.5px] text-[#18181B]">
                {activeHotspot.markschemeKeywords.map((kw) => (
                  <li key={kw} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#059669] mt-0.5 shrink-0">✓</span>
                    <KaTeXText text={kw} as="span" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] text-[#991B1B]">
              <span className="font-mono font-bold uppercase text-[11px] block mb-0.5">
                Examiner Rejection Note (
                <code className="px-1 py-0.5 rounded bg-white/80 font-mono text-[10.5px] normal-case">
                  Do Not Accept
                </code>
                ):
              </span>
              <KaTeXText text={activeHotspot.examRejectionWarning} as="div" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
