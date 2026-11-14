import React from 'react';

export type SubjectArtworkSlug = 'bio' | 'chem' | 'hist' | 'eng' | 'fr' | 'math';

interface SubjectCardArtworkProps {
  slug: SubjectArtworkSlug;
  className?: string;
}

const ARTWORK_STYLES = `
.sr-art-svg .sr-art-layer {
  transform-box: fill-box;
  transform-origin: center;
  transition:
    transform 240ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 220ms cubic-bezier(0.23, 1, 0.32, 1);
}
.sr-art-svg .sr-art-bio-leaf {
  transform-origin: 20% 85%;
}
.sr-art-svg .sr-art-bio-butterfly {
  transform-origin: 50% 60%;
}
.sr-art-svg .sr-art-chem-flask {
  transform-origin: 50% 85%;
}
.sr-art-svg .sr-art-eng-page-r {
  transform-origin: 0% 65%;
}
.sr-art-svg .sr-art-eng-nib {
  transform-origin: 70% 30%;
}
.sr-art-svg .sr-art-fr-eiffel {
  transform-origin: 50% 100%;
}
.sr-art-svg .sr-art-math-spiral {
  transform-origin: 65% 55%;
}

@media (hover: hover) and (pointer: fine) {
  .group:hover .sr-art-bio-butterfly,
  .sr-subj-card:hover .sr-art-bio-butterfly {
    transform: translate3d(3px, -5px, 0) rotate(5deg);
  }
  .group:hover .sr-art-bio-leaf,
  .sr-subj-card:hover .sr-art-bio-leaf {
    transform: translate3d(-1px, 1px, 0) rotate(-1.5deg);
  }

  .group:hover .sr-art-chem-lattice,
  .sr-subj-card:hover .sr-art-chem-lattice {
    transform: rotate(4deg);
  }
  .group:hover .sr-art-chem-flask,
  .sr-subj-card:hover .sr-art-chem-flask {
    transform: translate3d(0, -1.5px, 0);
  }
  .group:hover .sr-art-chem-b1,
  .sr-subj-card:hover .sr-art-chem-b1 {
    transform: translate3d(0, -6px, 0);
    opacity: 0.94;
  }
  .group:hover .sr-art-chem-b2,
  .sr-subj-card:hover .sr-art-chem-b2 {
    transform: translate3d(1px, -8px, 0);
    opacity: 0.96;
  }
  .group:hover .sr-art-chem-b3,
  .sr-subj-card:hover .sr-art-chem-b3 {
    transform: translate3d(-1px, -5px, 0);
    opacity: 0.9;
  }

  .group:hover .sr-art-hist-astrolabe,
  .sr-subj-card:hover .sr-art-hist-astrolabe {
    transform: rotate(7deg);
  }
  .group:hover .sr-art-hist-scroll,
  .sr-subj-card:hover .sr-art-hist-scroll {
    transform: translate3d(-2px, -1px, 0);
  }
  .group:hover .sr-art-hist-seal,
  .sr-subj-card:hover .sr-art-hist-seal {
    transform: translate3d(1px, -3px, 0) scale(1.04);
  }

  .group:hover .sr-art-eng-nib,
  .sr-subj-card:hover .sr-art-eng-nib {
    transform: translate3d(-3px, -4px, 0) rotate(-4deg);
  }
  .group:hover .sr-art-eng-page-r,
  .sr-subj-card:hover .sr-art-eng-page-r {
    transform: translate3d(1.5px, -1.5px, 0) rotate(1.5deg);
  }

  .group:hover .sr-art-fr-cloud-back,
  .sr-subj-card:hover .sr-art-fr-cloud-back {
    transform: translate3d(-5px, -1px, 0);
  }
  .group:hover .sr-art-fr-cloud-front,
  .sr-subj-card:hover .sr-art-fr-cloud-front {
    transform: translate3d(4px, -2px, 0);
  }
  .group:hover .sr-art-fr-eiffel,
  .sr-subj-card:hover .sr-art-fr-eiffel {
    transform: translate3d(0, -2px, 0);
  }

  .group:hover .sr-art-math-spiral,
  .sr-subj-card:hover .sr-art-math-spiral {
    transform: rotate(6deg);
  }
  .group:hover .sr-art-math-sine,
  .sr-subj-card:hover .sr-art-math-sine {
    transform: translate3d(2px, -2px, 0);
    opacity: 0.96;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sr-art-svg .sr-art-layer {
    transition: opacity 160ms ease;
    transform: none !important;
  }
}
`;

/**
 * Decorative right-bleeding vector illustrations for the 6 IB Diploma Homepage cards.
 * Pure CSS hover-reactive GPU transforms with self-contained reduced-motion & pointer gating.
 */
export function SubjectCardArtwork({
  slug,
  className = '',
}: SubjectCardArtworkProps) {
  const baseSvgClass =
    `sr-art-svg pointer-events-none absolute right-[-6px] bottom-[-6px] w-[132px] h-[118px] select-none ${className}`.trim();

  return (
    <>
      <style href="sr-subject-card-artwork" precedence="default">
        {ARTWORK_STYLES}
      </style>
      <svg
        className={baseSvgClass}
        viewBox="0 0 132 118"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {slug === 'bio' && <BiologyArtwork />}
        {slug === 'chem' && <ChemistryArtwork />}
        {slug === 'hist' && <HistoryArtwork />}
        {slug === 'eng' && <EnglishArtwork />}
        {slug === 'fr' && <FrenchArtwork />}
        {slug === 'math' && <MathArtwork />}
      </svg>
    </>
  );
}

function BiologyArtwork() {
  return (
    <>
      <circle cx="96" cy="64" r="46" fill="#A7F3D0" opacity="0.16" />
      <circle
        cx="96"
        cy="64"
        r="35"
        stroke="#ECFDF5"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.28"
      />

      <g className="sr-art-layer sr-art-bio-leaf">
        <path
          d="M36 112 C48 64 78 44 124 34 C112 78 78 106 36 112 Z"
          fill="#BBF7D0"
          opacity="0.34"
        />
        <path
          d="M39 109 C64 78 90 56 119 38"
          stroke="#ECFDF5"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.68"
        />
        <path
          d="M56 91 C59 80 65 72 72 67 M62 85 C72 86 81 84 90 79 M74 72 C77 62 83 54 91 49 M82 65 C91 65 100 62 108 56"
          stroke="#ECFDF5"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.52"
        />
        <path
          d="M66 114 C75 88 97 72 128 68 C122 93 100 111 66 114 Z"
          fill="#D1FAE5"
          opacity="0.26"
        />
        <path
          d="M68 112 C86 92 105 80 124 72"
          stroke="#ECFDF5"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>

      <g transform="translate(82 40) rotate(-12)">
        <g className="sr-art-layer sr-art-bio-butterfly">
          <path
            d="M-2 -1 C-10 -15 -26 -14 -24 -2 C-22 6 -10 6 -2 1 Z"
            fill="#ECFDF5"
            opacity="0.86"
          />
          <path
            d="M-2 2 C-11 4 -20 12 -14 18 C-8 22 -2 14 -2 4 Z"
            fill="#D1FAE5"
            opacity="0.72"
          />
          <path
            d="M2 -1 C10 -15 26 -14 24 -2 C22 6 10 6 2 1 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <path
            d="M2 2 C11 4 20 12 14 18 C8 22 2 14 2 4 Z"
            fill="#A7F3D0"
            opacity="0.78"
          />
          <circle cx="-13" cy="-5" r="2.2" fill="#1D6E45" opacity="0.24" />
          <circle cx="13" cy="-5" r="2.2" fill="#1D6E45" opacity="0.22" />
          <path
            d="M-4 -1 L-17 -7 M4 -1 L17 -7"
            stroke="#1D6E45"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.22"
          />
          <rect
            x="-1.4"
            y="-6"
            width="2.8"
            height="16"
            rx="1.4"
            fill="#FFFFFF"
            opacity="0.92"
          />
          <path
            d="M-0.8 -6 C-3 -12 -6 -13 -8 -11.5 M0.8 -6 C3 -12 6 -13 8 -11.5"
            stroke="#FFFFFF"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.88"
          />
          <circle cx="-8" cy="-11.5" r="1" fill="#FFFFFF" opacity="0.9" />
          <circle cx="8" cy="-11.5" r="1" fill="#FFFFFF" opacity="0.9" />
        </g>
      </g>
    </>
  );
}

function ChemistryArtwork() {
  return (
    <>
      <circle cx="95" cy="64" r="46" fill="#99F6E4" opacity="0.15" />

      <g className="sr-art-layer sr-art-chem-lattice">
        <polygon
          points="76,24 93.3,34 93.3,54 76,64 58.7,54 58.7,34"
          fill="#CCFBF1"
          fillOpacity="0.16"
          stroke="#CCFBF1"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle
          cx="76"
          cy="44"
          r="11.5"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          strokeDasharray="4 2.5"
          opacity="0.62"
        />
        <path
          d="M58.7 34 L44 26 M93.3 34 L108 26 M58.7 54 L44 62"
          stroke="#CCFBF1"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.72"
        />
        <circle cx="44" cy="26" r="5" fill="#FFFFFF" opacity="0.24" />
        <circle cx="44" cy="26" r="2.6" fill="#FFFFFF" opacity="0.88" />
        <circle cx="108" cy="26" r="5" fill="#FFFFFF" opacity="0.24" />
        <circle cx="108" cy="26" r="2.6" fill="#FFFFFF" opacity="0.88" />
        <circle cx="44" cy="62" r="5" fill="#FFFFFF" opacity="0.24" />
        <circle cx="44" cy="62" r="2.6" fill="#FFFFFF" opacity="0.88" />
      </g>

      <g className="sr-art-layer sr-art-chem-flask">
        <path
          d="M92 54 V66 L76 100 C74 104 77 108 81 108 H111 C115 108 118 104 116 100 L100 66 V54"
          fill="#FFFFFF"
          fillOpacity="0.15"
          stroke="#FFFFFF"
          strokeOpacity="0.82"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect
          x="89"
          y="52"
          width="14"
          height="3"
          rx="1.5"
          fill="#FFFFFF"
          opacity="0.72"
        />
        <path
          d="M83 86 Q96 89 109 86 L115 100 C116.5 103.5 114 106.5 110.5 106.5 H81.5 C78 106.5 75.5 103.5 77 100 Z"
          fill="#CCFBF1"
          opacity="0.52"
        />
        <path
          d="M83 86 Q96 89 109 86"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.78"
        />
        <path
          d="M82 95 H86 M85 91 H88"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M93 68 L81 97"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.38"
        />
      </g>

      <g className="sr-art-layer sr-art-chem-b1">
        <circle cx="96" cy="80" r="2.7" fill="#FFFFFF" opacity="0.74" />
      </g>
      <g className="sr-art-layer sr-art-chem-b2">
        <circle cx="101" cy="70" r="2.1" fill="#CCFBF1" opacity="0.8" />
      </g>
      <g className="sr-art-layer sr-art-chem-b3">
        <circle cx="94" cy="60" r="1.6" fill="#FFFFFF" opacity="0.68" />
      </g>
    </>
  );
}

function HistoryArtwork() {
  return (
    <>
      <circle cx="95" cy="64" r="46" fill="#FDE68A" opacity="0.12" />

      <g className="sr-art-layer sr-art-hist-astrolabe">
        <circle
          cx="88"
          cy="56"
          r="40"
          stroke="#FEF3C7"
          strokeWidth="1.1"
          strokeDasharray="2 3.5"
          opacity="0.4"
        />
        <circle
          cx="88"
          cy="56"
          r="30"
          stroke="#FDE68A"
          strokeWidth="1"
          opacity="0.28"
        />
        <path
          d="M110 20 L111.5 24.5 L116 26 L111.5 27.5 L110 32 L108.5 27.5 L104 26 L108.5 24.5 Z"
          fill="#FEF3C7"
          opacity="0.72"
        />
      </g>

      <g transform="translate(82 62) rotate(-6)">
        <g className="sr-art-layer sr-art-hist-scroll">
          <g transform="rotate(14)">
            <rect
              x="-20"
              y="-28"
              width="44"
              height="58"
              rx="6"
              fill="#FDE68A"
              opacity="0.18"
            />
          </g>
          <rect
            x="-24"
            y="-30"
            width="46"
            height="58"
            rx="4"
            fill="#FEF3C7"
            fillOpacity="0.26"
            stroke="#FEF3C7"
            strokeOpacity="0.46"
            strokeWidth="1.2"
          />
          <rect
            x="-27"
            y="-33"
            width="52"
            height="7"
            rx="3.5"
            fill="#FEF3C7"
            opacity="0.52"
          />
          <rect
            x="-27"
            y="24"
            width="52"
            height="7"
            rx="3.5"
            fill="#FDE68A"
            opacity="0.44"
          />
          <path
            d="M-15 -14 H12 M-15 -6 H14 M-15 2 H8 M-15 10 H4"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </g>

      <g transform="translate(97 86)">
        <g className="sr-art-layer sr-art-hist-seal">
          <path
            d="M-5 10 L-9 23 L-3 19 L0 24 L2 10 Z"
            fill="#FDE68A"
            opacity="0.48"
          />
          <path
            d="M2 10 L5 23 L9 18 L14 21 L7 9 Z"
            fill="#FEF3C7"
            opacity="0.38"
          />
          <circle cx="0" cy="0" r="14" fill="#FEF3C7" opacity="0.65" />
          <circle
            cx="0"
            cy="0"
            r="12"
            stroke="#FDE68A"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
            opacity="0.7"
          />
          <circle
            cx="0"
            cy="0"
            r="8.8"
            fill="#FFFFFF"
            fillOpacity="0.28"
            stroke="#5A3626"
            strokeOpacity="0.36"
            strokeWidth="1.2"
          />
          <path
            d="M0 -4.2 L3.4 0 L0 4.2 L-3.4 0 Z"
            fill="#5A3626"
            opacity="0.42"
          />
        </g>
      </g>
    </>
  );
}

function EnglishArtwork() {
  return (
    <>
      <circle cx="95" cy="64" r="46" fill="#BFDBFE" opacity="0.16" />

      <g className="sr-art-layer sr-art-eng-book">
        <path
          d="M40 97 Q60 89 80 96 Q100 89 120 97"
          stroke="#DBEAFE"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          d="M43 101 Q61 94 80 100 Q99 94 117 101"
          stroke="#BFDBFE"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.34"
        />
        <path
          d="M42 57 C55 49 69 49 80 56 L80 94 C68 87 54 88 39 94 Z"
          fill="#DBEAFE"
          fillOpacity="0.38"
          stroke="#FFFFFF"
          strokeOpacity="0.48"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M51 54 L49 90"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          opacity="0.32"
        />
        <path
          d="M55 62 H74 M54 68 H73 M54 74 H71 M53 80 H67"
          stroke="#FFFFFF"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.52"
        />

        <g className="sr-art-layer sr-art-eng-page-r">
          <path
            d="M80 56 C91 49 105 49 118 57 L121 94 C106 88 92 87 80 94 Z"
            fill="#EFF6FF"
            fillOpacity="0.52"
            stroke="#FFFFFF"
            strokeOpacity="0.58"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M87 62 H109 M87 68 H105 M87 75 H111 M87 81 H101"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.56"
          />
        </g>

        <path
          d="M80 56 V94"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.78"
        />
      </g>

      <path
        d="M78 52 Q86 48 93 51"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeDasharray="2 2.5"
        strokeLinecap="round"
        opacity="0.52"
      />

      <g transform="translate(102 36) rotate(32)">
        <g className="sr-art-layer sr-art-eng-nib">
          <path
            d="M0 16 L-7.5 1 L-4.5 -11 H4.5 L7.5 1 Z"
            fill="#FFFFFF"
            opacity="0.88"
          />
          <rect
            x="-5"
            y="-15"
            width="10"
            height="4"
            rx="1.2"
            fill="#BFDBFE"
            opacity="0.9"
          />
          <path
            d="M0 16 V2.5"
            stroke="#1E40AF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="0" cy="1.5" r="2" fill="#1E40AF" opacity="0.55" />
        </g>
      </g>
    </>
  );
}

function FrenchArtwork() {
  return (
    <>
      <circle cx="95" cy="64" r="46" fill="#BAE6FD" opacity="0.16" />

      <g className="sr-art-layer sr-art-fr-cloud-back">
        <path
          d="M40 43 H74 C77.5 43 80 40.5 80 37.5 C80 34.8 77.8 32.6 75.2 32.5 C74 28.5 70.4 26 66 26 C62.2 26 59 28.2 57.6 31.4 C56.6 31 55.4 30.8 54.2 30.8 C50.5 30.8 47.6 33.4 47 36.8 C43.2 37 40 39.8 40 43 Z"
          fill="#E0F2FE"
          opacity="0.34"
        />
      </g>

      <g className="sr-art-layer sr-art-fr-eiffel">
        <path
          d="M88 18 L89.5 34 C91 54 95 72 103 90 L114 114 H100.5 C99.5 102 94.5 94 88 94 C81.5 94 76.5 102 75.5 114 H62 L73 90 C81 72 85 54 86.5 34 Z"
          fill="#E0F2FE"
          fillOpacity="0.42"
          stroke="#FFFFFF"
          strokeOpacity="0.72"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M88 12 V20"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.86"
        />
        <rect
          x="75.5"
          y="81"
          width="25"
          height="3.2"
          rx="1"
          fill="#FFFFFF"
          opacity="0.78"
        />
        <rect
          x="81"
          y="59"
          width="14"
          height="2.8"
          rx="1"
          fill="#FFFFFF"
          opacity="0.78"
        />
        <path
          d="M84 62 L92 70 M92 62 L84 70 M83 71 L93 80 M93 71 L83 80 M79 85 L97 93 M97 85 L79 93"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d="M77.5 104 C80 96 96 96 98.5 104"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.68"
        />
      </g>

      <g className="sr-art-layer sr-art-fr-cloud-front">
        <path
          d="M88 56 H123 C126 56 128 53.8 128 51 C128 48.5 126 46.5 123.5 46.4 C122.4 42.8 119 40.5 115 40.5 C111.4 40.5 108.4 42.6 107.1 45.6 C103.5 45.8 100.8 48.3 100.4 51.5 H91 C89 51.5 87.5 53 87.5 54.5 C87.5 55.4 87.8 56 88 56 Z"
          fill="#FFFFFF"
          opacity="0.48"
        />
      </g>
    </>
  );
}

function MathArtwork() {
  return (
    <>
      <circle cx="95" cy="64" r="46" fill="#FEF3C7" opacity="0.15" />

      <g className="sr-art-layer sr-art-math-reticle">
        <path
          d="M40 66 H126 M86 18 V110"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.34"
        />
        <path
          d="M54 64 V68 M70 64 V68 M102 64 V68 M118 64 V68 M84 34 H88 M84 50 H88 M84 82 H88 M84 98 H88"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.45"
        />
        <rect
          x="54"
          y="30"
          width="60"
          height="37"
          rx="1"
          stroke="#FEF3C7"
          strokeWidth="1"
          strokeDasharray="2.5 2.5"
          opacity="0.32"
        />
      </g>

      <g className="sr-art-layer sr-art-math-spiral">
        <path
          d="M54 67 A37 37 0 0 1 91 30 A23 23 0 0 1 114 53 A14 14 0 0 1 100 67 A9 9 0 0 1 91 58 A5 5 0 0 1 96 53"
          stroke="#FEF3C7"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.78"
        />
        <circle
          cx="96"
          cy="56"
          r="4"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          opacity="0.72"
        />
        <circle cx="96" cy="56" r="1.5" fill="#FFFFFF" opacity="0.92" />
      </g>

      <g className="sr-art-layer sr-art-math-sine">
        <path
          d="M36 96 C 54 64, 68 64, 84 86 C 100 108, 114 102, 128 74"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.82"
        />
        <circle cx="61" cy="72" r="3" fill="#FFFFFF" opacity="0.92" />
        <circle
          cx="61"
          cy="72"
          r="5.5"
          stroke="#FEF3C7"
          strokeWidth="1"
          opacity="0.45"
        />
        <circle cx="84" cy="86" r="2.5" fill="#FEF3C7" opacity="0.88" />
      </g>
    </>
  );
}
