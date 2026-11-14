import React from 'react';

export type SproutPose =
  | 'emblem'
  | 'avatar'
  | 'guide'
  | 'snoozing'
  | 'baby'
  | 'notepad';

export interface SproutMascotProps {
  pose?: SproutPose;
  size?: number;
  className?: string;
  animated?: boolean;
}

const SPROUT_SCOPED_CSS = `
  .sprout-root {
    display: block;
    flex-shrink: 0;
    overflow: visible;
  }
  .sprout-perk,
  .sprout-bob,
  .sprout-baby-bob,
  .sprout-sleep-breathe,
  .sprout-notepad-tilt,
  .sprout-leaf-right,
  .sprout-leaf-left,
  .sprout-leaf-baby,
  .sprout-leaf-sleep-r,
  .sprout-leaf-sleep-l,
  .sprout-eye,
  .sprout-dewdrop,
  .sprout-twinkle,
  .sprout-shadow,
  .sprout-shadow-sleep,
  .sprout-sleep-sigh,
  .sprout-zzz,
  .sprout-notepad-pad,
  .sprout-pencil {
    transform-box: fill-box;
  }
  .sprout-perk {
    transform-origin: 50% 85%;
    transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .sprout-shadow {
    opacity: 0.11;
  }
  .sprout-shadow-sleep {
    opacity: 0.55;
  }
  .sprout-twinkle {
    opacity: 0.72;
  }
  .sprout-dewdrop {
    opacity: 0.92;
  }
  .sprout-sleep-sigh {
    opacity: 0.82;
  }
  .sprout-zzz {
    transform-origin: 50% 50%;
    opacity: 0.72;
  }
  .sprout-root--animated .sprout-bob {
    transform-origin: 50% 90%;
    animation: sproutBob 4.4s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-baby-bob {
    transform-origin: 50% 88%;
    animation: sproutBob 3.8s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-notepad-tilt {
    transform-origin: 45% 90%;
    animation: sproutPadTilt 4.2s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-sleep-breathe {
    transform-origin: 50% 88%;
    animation: sproutSleepBreathe 4.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-leaf-right {
    transform-origin: 6% 90%;
    animation: sproutLeafRight 4.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-leaf-left {
    transform-origin: 94% 88%;
    animation: sproutLeafLeft 5.2s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-leaf-baby {
    transform-origin: 6% 90%;
    animation: sproutLeafBaby 3.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-leaf-sleep-r {
    transform-origin: 8% 85%;
    animation: sproutLeafSleepR 5.4s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-leaf-sleep-l {
    transform-origin: 92% 85%;
    animation: sproutLeafSleepL 5.4s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-eye {
    transform-origin: 50% 50%;
    animation: sproutBlink 4.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-eye-avatar {
    animation-duration: 4.2s;
    animation-delay: -1.3s;
  }
  .sprout-root--animated .sprout-eye-baby {
    animation-duration: 4s;
    animation-delay: -0.7s;
  }
  .sprout-root--animated .sprout-eye-notepad {
    animation-duration: 5s;
    animation-delay: -2.1s;
  }
  .sprout-root--animated .sprout-dewdrop {
    transform-origin: 50% 50%;
    animation: sproutDewdrop 3.2s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-twinkle {
    transform-origin: 50% 50%;
    animation: sproutTwinkle 3.8s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-shadow {
    transform-origin: 50% 50%;
    animation: sproutShadow 4.4s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-shadow-sleep {
    transform-origin: 50% 50%;
    animation: sproutShadowSleep 4.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-sleep-sigh {
    transform-origin: 50% 50%;
    animation: sproutSleepSigh 4.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-zzz {
    animation: sproutZzzFloat 3.9s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-zzz-1 {
    animation-delay: 0s;
  }
  .sprout-root--animated .sprout-zzz-2 {
    animation-delay: 1.3s;
  }
  .sprout-root--animated .sprout-zzz-3 {
    animation-delay: 2.6s;
  }
  .sprout-root--animated .sprout-notepad-pad {
    transform-origin: 20% 80%;
    animation: sproutPadMicro 2.6s ease-in-out infinite;
  }
  .sprout-root--animated .sprout-pencil {
    transform-origin: 20% 85%;
    animation: sproutJot 2.6s ease-in-out infinite;
  }
  @media (hover: hover) and (pointer: fine) {
    .sprout-root--animated:hover .sprout-perk--emblem,
    a:hover .sprout-root--animated .sprout-perk--emblem,
    button:hover .sprout-root--animated .sprout-perk--emblem,
    [role="button"]:hover .sprout-root--animated .sprout-perk--emblem {
      transform: translateY(-0.8px) rotate(-3.5deg) scale(1.05);
    }
    .sprout-root--animated:hover .sprout-perk--avatar,
    a:hover .sprout-root--animated .sprout-perk--avatar,
    button:hover .sprout-root--animated .sprout-perk--avatar,
    [role="button"]:hover .sprout-root--animated .sprout-perk--avatar {
      transform: translateY(-1.2px) rotate(-3deg) scale(1.08);
    }
    .sprout-root--animated:hover .sprout-perk--guide,
    a:hover .sprout-root--animated .sprout-perk--guide,
    button:hover .sprout-root--animated .sprout-perk--guide,
    [role="button"]:hover .sprout-root--animated .sprout-perk--guide {
      transform: translateY(-2px) scale(1.03);
    }
    .sprout-root--animated:hover .sprout-perk--baby,
    a:hover .sprout-root--animated .sprout-perk--baby,
    button:hover .sprout-root--animated .sprout-perk--baby,
    [role="button"]:hover .sprout-root--animated .sprout-perk--baby {
      transform: translateY(-1.8px) rotate(2.5deg) scale(1.05);
    }
    .sprout-root--animated:hover .sprout-perk--notepad,
    a:hover .sprout-root--animated .sprout-perk--notepad,
    button:hover .sprout-root--animated .sprout-perk--notepad,
    [role="button"]:hover .sprout-root--animated .sprout-perk--notepad {
      transform: translateY(-1.5px) rotate(-1.5deg) scale(1.03);
    }
  }
  @keyframes sproutBob {
    0%, 100% { transform: translateY(0px) scaleY(1); }
    50% { transform: translateY(-1.8px) scaleY(1.015); }
  }
  @keyframes sproutPadTilt {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-1px) rotate(-1.5deg); }
  }
  @keyframes sproutSleepBreathe {
    0%, 100% { transform: scaleX(1) scaleY(1); }
    50% { transform: scaleX(1.028) scaleY(0.978); }
  }
  @keyframes sproutLeafRight {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(3.2deg); }
  }
  @keyframes sproutLeafLeft {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-2.8deg); }
  }
  @keyframes sproutLeafBaby {
    0%, 100% { transform: rotate(0deg); }
    35% { transform: rotate(4.2deg); }
    70% { transform: rotate(-2.6deg); }
  }
  @keyframes sproutLeafSleepR {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(1.8deg); }
  }
  @keyframes sproutLeafSleepL {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-1.8deg); }
  }
  @keyframes sproutBlink {
    0%, 88%, 96%, 100% { transform: scaleY(1); }
    92% { transform: scaleY(0.14); }
  }
  @keyframes sproutDewdrop {
    0%, 100% { opacity: 0.72; transform: scale(0.94); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes sproutTwinkle {
    0%, 100% { opacity: 0.35; transform: scale(0.86) rotate(0deg); }
    50% { opacity: 0.95; transform: scale(1.1) rotate(12deg); }
  }
  @keyframes sproutShadow {
    0%, 100% { transform: scaleX(1); opacity: 0.11; }
    50% { transform: scaleX(0.93); opacity: 0.08; }
  }
  @keyframes sproutShadowSleep {
    0%, 100% { transform: scaleX(1); opacity: 0.55; }
    50% { transform: scaleX(1.04); opacity: 0.65; }
  }
  @keyframes sproutSleepSigh {
    0%, 100% { transform: scale(0.9); opacity: 0.6; }
    50% { transform: scale(1.12); opacity: 0.92; }
  }
  @keyframes sproutZzzFloat {
    0% { opacity: 0; transform: translate(0px, 4px) scale(0.86); }
    22% { opacity: 0.85; transform: translate(1px, 0px) scale(1); }
    75% { opacity: 0.7; transform: translate(2.5px, -5px) scale(1.04); }
    100% { opacity: 0; transform: translate(3.5px, -8px) scale(0.94); }
  }
  @keyframes sproutPadMicro {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(1deg); }
  }
  @keyframes sproutJot {
    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
    25% { transform: translate(1.4px, -0.7px) rotate(-5deg); }
    50% { transform: translate(2.8px, 0.2px) rotate(2deg); }
    75% { transform: translate(1px, 0.8px) rotate(-3deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .sprout-root,
    .sprout-root * {
      animation: none !important;
      transition: opacity 180ms ease !important;
    }
    .sprout-root .sprout-perk {
      transform: none !important;
    }
    .sprout-root .sprout-zzz {
      opacity: 0.72 !important;
      transform: none !important;
    }
  }
`;

interface SproutFrameProps {
  width: number;
  height: number;
  viewBox: string;
  label: string;
  animated: boolean;
  className: string;
  children: React.ReactNode;
}

function SproutFrame({
  width,
  height,
  viewBox,
  label,
  animated,
  className,
  children,
}: SproutFrameProps) {
  const rootClassName = [
    'sprout-root',
    animated ? 'sprout-root--animated' : 'sprout-root--static',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={rootClassName}
      role="img"
      aria-label={label}
    >
      <style>{SPROUT_SCOPED_CSS}</style>
      {children}
    </svg>
  );
}

function renderEmblemPose(size: number | undefined, animated: boolean, className: string) {
  const s = size ?? 26;
  return (
    <SproutFrame
      width={s}
      height={s}
      viewBox="0 0 36 36"
      label="Simple Revision Sprout Emblem"
      animated={animated}
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="9.5"
        fill="#18181B"
        stroke="#27272A"
        strokeWidth="1"
      />
      <ellipse cx="18" cy="21" rx="11" ry="9" fill="#065F46" opacity="0.32" />
      <g className="sprout-perk sprout-perk--emblem">
        <g className="sprout-bob">
          <path
            d="M18 20.2 C17.8 18 18.2 16 18 14.2"
            stroke="#A7F3D0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="sprout-leaf-right">
            <path
              d="M18 15.4 C18.2 10 22.8 7 28 8.6 C27.2 13.8 22.8 16.8 18 15.4 Z"
              fill="#10B981"
            />
            <path
              d="M18.2 15.1 C19.2 10.7 23.1 8.1 27.6 8.8 C25.2 11.4 21.8 13.4 18.2 15.1 Z"
              fill="#34D399"
            />
            <path
              d="M18.8 14.8 C21.2 12.7 23.6 11.2 25.8 10.1"
              stroke="#A7F3D0"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.88"
            />
            <circle
              cx="25.6"
              cy="9.8"
              r="0.9"
              fill="#ECFDF5"
              className="sprout-dewdrop"
            />
          </g>
          <g className="sprout-leaf-left">
            <path
              d="M18 16.8 C17.6 12.2 13 9.6 8.4 11.4 C9.4 16 13.6 18.4 18 16.8 Z"
              fill="#34D399"
            />
            <path
              d="M17.8 16.5 C16.7 12.8 13 10.7 8.9 11.5 C11.4 13.5 14.4 15.1 17.8 16.5 Z"
              fill="#A7F3D0"
            />
            <path
              d="M17.2 16.3 C15 14.6 12.8 13.4 10.6 12.6"
              stroke="#ECFDF5"
              strokeWidth="0.85"
              strokeLinecap="round"
              opacity="0.88"
            />
          </g>
          <rect x="11" y="19.5" width="14" height="11" rx="5.5" fill="#059669" />
          <path
            d="M11.2 25.5 C11.2 28.5 14 30.5 18 30.5 C22 30.5 24.8 28.5 24.8 25.5 C22.5 27.5 13.5 27.5 11.2 25.5 Z"
            fill="#065F46"
            opacity="0.72"
          />
          <path
            d="M12.5 23.2 C13 21 15 20.2 17.5 20.2"
            stroke="#34D399"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.55"
          />
          <ellipse
            cx="15.2"
            cy="24.6"
            rx="1.35"
            ry="1.6"
            fill="#FFFFFF"
            className="sprout-eye"
          />
          <ellipse
            cx="20.8"
            cy="24.6"
            rx="1.35"
            ry="1.6"
            fill="#FFFFFF"
            className="sprout-eye"
          />
          <circle cx="13.2" cy="26.8" r="1" fill="#F59E0B" opacity="0.74" />
          <circle cx="22.8" cy="26.8" r="1" fill="#F59E0B" opacity="0.74" />
          <path
            d="M16.6 26.8 Q18 28 19.4 26.8"
            stroke="#A7F3D0"
            strokeWidth="1.05"
            strokeLinecap="round"
          />
        </g>
      </g>
    </SproutFrame>
  );
}

function renderAvatarPose(size: number | undefined, animated: boolean, className: string) {
  const s = size ?? 16;
  return (
    <SproutFrame
      width={s}
      height={s}
      viewBox="0 0 32 32"
      label="Sprout Avatar"
      animated={animated}
      className={className}
    >
      <g className="sprout-perk sprout-perk--avatar">
        <path
          d="M16 14.2 C15.8 12.2 16.1 10.4 16 9"
          stroke="#059669"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <g className="sprout-leaf-right">
          <path
            d="M16 11.4 C16.3 6.2 21.8 3.6 27 5.5 C26 10.4 21.2 12.8 16 11.4 Z"
            fill="#10B981"
          />
          <path
            d="M16.3 11.1 C17.5 7 21.8 4.8 26.5 5.7 C24 8.2 20.3 9.9 16.3 11.1 Z"
            fill="#34D399"
          />
          <path
            d="M17 10.7 C19.5 8.8 22 7.5 24.4 6.6"
            stroke="#A7F3D0"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        <g className="sprout-leaf-left">
          <path
            d="M16 12.4 C15.4 8.6 11 6.8 6.8 8.8 C8.2 12.6 12.2 14 16 12.4 Z"
            fill="#34D399"
          />
          <path
            d="M15.6 12.1 C14.5 9.2 11 7.8 7.4 8.9 C9.8 10.6 12.6 11.6 15.6 12.1 Z"
            fill="#A7F3D0"
          />
        </g>
        <rect x="7" y="13.5" width="18" height="15.5" rx="7.75" fill="#065F46" />
        <ellipse cx="16" cy="18.2" rx="7.6" ry="4.4" fill="#059669" opacity="0.6" />
        <path
          d="M9.6 17.5 C10.6 15.2 13 14.5 15.5 14.6"
          stroke="#34D399"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <ellipse
          cx="12.6"
          cy="21"
          rx="1.65"
          ry="1.9"
          fill="#FFFFFF"
          className="sprout-eye sprout-eye-avatar"
        />
        <ellipse
          cx="19.4"
          cy="21"
          rx="1.65"
          ry="1.9"
          fill="#FFFFFF"
          className="sprout-eye sprout-eye-avatar"
        />
        <circle cx="9.8" cy="23.4" r="1.25" fill="#F59E0B" opacity="0.78" />
        <circle cx="22.2" cy="23.4" r="1.25" fill="#F59E0B" opacity="0.78" />
        <path
          d="M14.2 23.6 Q16 25.1 17.8 23.6"
          stroke="#A7F3D0"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>
    </SproutFrame>
  );
}

function renderSnoozingPose(size: number | undefined, animated: boolean, className: string) {
  const s = size ?? 64;
  return (
    <SproutFrame
      width={s}
      height={s}
      viewBox="0 0 80 80"
      label="Snoozing Sprout"
      animated={animated}
      className={className}
    >
      <ellipse
        cx="38"
        cy="65.5"
        rx="16"
        ry="3.2"
        fill="#D4D4D8"
        className="sprout-shadow-sleep"
      />
      <g className="sprout-sleep-breathe">
        <path
          d="M38 33 C37.5 29.5 38.2 27 38 24.5"
          stroke="#71717A"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <g className="sprout-leaf-sleep-r">
          <path
            d="M38 26.5 C39 18 48.5 15 56.5 18.5 C54.5 26 46 29 38 26.5 Z"
            fill="#A1A1AA"
          />
          <path
            d="M38.5 26 C40.4 19.6 48.6 16.8 55.8 18.8 C51.6 22.2 45.2 24.6 38.5 26 Z"
            fill="#D4D4D8"
            opacity="0.55"
          />
          <path
            d="M39.5 25.6 C44.2 22.8 49 20.8 53.5 19.8"
            stroke="#FAFAFA"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
        <g className="sprout-leaf-sleep-l">
          <path
            d="M38 28.5 C37 21.5 28.5 18.5 22 22.5 C24.5 29 31.5 31 38 28.5 Z"
            fill="#D4D4D8"
          />
          <path
            d="M37.4 28 C35.6 22.8 28.6 20.2 22.8 22.7 C27.2 25.2 32.4 27 37.4 28 Z"
            fill="#E4E4E7"
          />
          <path
            d="M36.6 27.6 C32.8 25.4 28.8 24 25 23.2"
            stroke="#FAFAFA"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
        <rect x="22" y="32" width="32" height="31" rx="15" fill="#52525B" />
        <ellipse cx="38" cy="40" rx="13.5" ry="7" fill="#71717A" opacity="0.65" />
        <path
          d="M26 41.5 C27 36.5 31 34 36 34"
          stroke="#A1A1AA"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M29 46.5 Q32 49.5 35 46.5"
          stroke="#FAFAFA"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M41 46.5 Q44 49.5 47 46.5"
          stroke="#FAFAFA"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <ellipse cx="27.5" cy="50.5" rx="2.2" ry="1.3" fill="#A1A1AA" opacity="0.48" />
        <ellipse cx="48.5" cy="50.5" rx="2.2" ry="1.3" fill="#A1A1AA" opacity="0.48" />
        <ellipse
          cx="38"
          cy="51.5"
          rx="1.6"
          ry="1.2"
          fill="#D4D4D8"
          className="sprout-sleep-sigh"
        />
      </g>
      <text
        x="53"
        y="30"
        fill="#71717A"
        fontSize="9.5"
        fontFamily="var(--font-mono), monospace"
        fontWeight="600"
        className="sprout-zzz sprout-zzz-1"
      >
        z
      </text>
      <text
        x="59.5"
        y="22.5"
        fill="#71717A"
        fontSize="11.5"
        fontFamily="var(--font-mono), monospace"
        fontWeight="700"
        className="sprout-zzz sprout-zzz-2"
      >
        Z
      </text>
      <text
        x="66.5"
        y="14.5"
        fill="#A1A1AA"
        fontSize="8.5"
        fontFamily="var(--font-mono), monospace"
        fontWeight="600"
        className="sprout-zzz sprout-zzz-3"
      >
        z
      </text>
    </SproutFrame>
  );
}

function renderBabyPose(size: number | undefined, animated: boolean, className: string) {
  const s = size ?? 56;
  return (
    <SproutFrame
      width={s}
      height={s}
      viewBox="0 0 72 72"
      label="Baby Seed Sprout"
      animated={animated}
      className={className}
    >
      <ellipse
        cx="36"
        cy="59.5"
        rx="12.5"
        ry="2.8"
        fill="#059669"
        className="sprout-shadow"
      />
      <g className="sprout-perk sprout-perk--baby">
        <g className="sprout-baby-bob">
          <path
            d="M36 30.5 C35.5 26.5 36.2 23 36.8 20.5"
            stroke="#10B981"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <g className="sprout-leaf-baby">
            <path
              d="M36.5 22.5 C36.8 12.2 46.5 8 54.5 11.8 C52.2 21 44 24.8 36.5 22.5 Z"
              fill="#10B981"
            />
            <path
              d="M36.9 21.9 C38.5 13.8 46.4 9.8 53.8 12 C49.5 16.5 43.2 19.6 36.9 21.9 Z"
              fill="#34D399"
            />
            <path
              d="M39 20 C41.2 14.2 47 11.2 52.6 12.4 C48.4 15.2 43.5 17.8 39 20 Z"
              fill="#A7F3D0"
              opacity="0.72"
            />
            <path
              d="M37.8 21.4 C42.4 17.8 47 15 51.5 13.4"
              stroke="#ECFDF5"
              strokeWidth="1.25"
              strokeLinecap="round"
              opacity="0.92"
            />
            <g className="sprout-dewdrop">
              <circle cx="50.8" cy="13.8" r="2.2" fill="#A7F3D0" opacity="0.55" />
              <circle cx="50.8" cy="13.8" r="1.25" fill="#ECFDF5" />
            </g>
          </g>
          <rect x="22" y="29" width="28" height="27" rx="13.5" fill="#059669" />
          <ellipse cx="36" cy="36.5" rx="11.5" ry="6.2" fill="#10B981" opacity="0.72" />
          <path
            d="M23.5 47.5 C26 53 31 56 36 56 C43.5 56 49.5 50.5 50 42.5 C46.5 49 35 53.5 23.5 47.5 Z"
            fill="#065F46"
            opacity="0.34"
          />
          <path
            d="M26 37.5 C27 33 30.5 31 34.5 31"
            stroke="#34D399"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.45"
          />
          <g className="sprout-eye sprout-eye-baby">
            <ellipse cx="30.8" cy="40.8" rx="2.4" ry="2.75" fill="#FFFFFF" />
            <ellipse cx="30.8" cy="41.7" rx="1.5" ry="0.95" fill="#A7F3D0" opacity="0.6" />
          </g>
          <g className="sprout-eye sprout-eye-baby">
            <ellipse cx="41.2" cy="40.8" rx="2.4" ry="2.75" fill="#FFFFFF" />
            <ellipse cx="41.2" cy="41.7" rx="1.5" ry="0.95" fill="#A7F3D0" opacity="0.6" />
          </g>
          <ellipse cx="26.8" cy="44.8" rx="2.2" ry="1.4" fill="#A7F3D0" opacity="0.82" />
          <ellipse cx="45.2" cy="44.8" rx="2.2" ry="1.4" fill="#A7F3D0" opacity="0.82" />
          <path
            d="M34 45.2 Q36 47.4 38 45.2"
            stroke="#ECFDF5"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </g>
    </SproutFrame>
  );
}

function renderNotepadPose(size: number | undefined, animated: boolean, className: string) {
  const s = size ?? 64;
  return (
    <SproutFrame
      width={s}
      height={s}
      viewBox="0 0 84 80"
      label="Notepad Sprout"
      animated={animated}
      className={className}
    >
      <ellipse
        cx="40"
        cy="65.5"
        rx="17"
        ry="3.2"
        fill="#065F46"
        className="sprout-shadow"
      />
      <g className="sprout-perk sprout-perk--notepad">
        <g className="sprout-notepad-tilt">
          <path
            d="M36 30 C35.8 25.8 36.2 22.5 36 19.5"
            stroke="#059669"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <g className="sprout-leaf-right">
            <path
              d="M36 21.5 C36.5 11.5 46.5 7.5 55.5 11 C53.5 19.8 44.5 23.8 36 21.5 Z"
              fill="#10B981"
            />
            <path
              d="M36.4 21 C38.2 13.2 46.4 9.2 54.8 11.2 C50.2 15.6 43.4 18.8 36.4 21 Z"
              fill="#34D399"
            />
            <path
              d="M37.4 20.5 C42.4 17 47.4 14.4 52.4 12.6"
              stroke="#A7F3D0"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
          <g className="sprout-leaf-left">
            <path
              d="M36 23.5 C35.2 15.2 26 11.4 18.8 15.2 C21 22.8 28.5 26 36 23.5 Z"
              fill="#34D399"
            />
            <path
              d="M35.5 22.9 C33.6 16.4 26.2 13.2 19.6 15.5 C24.2 18.6 29.8 21.2 35.5 22.9 Z"
              fill="#6EE7B7"
            />
            <path
              d="M34.8 22.7 C30.6 19.6 26.4 17.6 22.2 16.5"
              stroke="#ECFDF5"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
          <rect x="21" y="28" width="30" height="30" rx="14.5" fill="#065F46" />
          <ellipse cx="36" cy="35.8" rx="12.5" ry="6.8" fill="#059669" opacity="0.72" />
          <path
            d="M22.5 48.5 C25 54.5 30.5 58 36 58 C44 58 50.5 52 51 43.5 C47.5 50.2 35 55.2 22.5 48.5 Z"
            fill="#064E3B"
            opacity="0.36"
          />
          <path
            d="M25 36.8 C26.2 32 30 29.8 34.5 29.8"
            stroke="#34D399"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.34"
          />
          <g className="sprout-eye sprout-eye-notepad">
            <ellipse cx="31.5" cy="40.5" rx="2.2" ry="2.55" fill="#FFFFFF" />
            <ellipse cx="31.9" cy="41.3" rx="1.25" ry="0.85" fill="#A7F3D0" opacity="0.55" />
          </g>
          <g className="sprout-eye sprout-eye-notepad">
            <ellipse cx="41.5" cy="40.5" rx="2.2" ry="2.55" fill="#FFFFFF" />
            <ellipse cx="41.9" cy="41.3" rx="1.25" ry="0.85" fill="#A7F3D0" opacity="0.55" />
          </g>
          <ellipse cx="27.8" cy="44.5" rx="2.1" ry="1.3" fill="#F59E0B" opacity="0.78" />
          <ellipse cx="45.2" cy="44.5" rx="2.1" ry="1.3" fill="#F59E0B" opacity="0.78" />
          <path
            d="M34.8 45.2 Q37 47 39.2 45.2"
            stroke="#A7F3D0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        <g className="sprout-notepad-pad">
          <rect
            x="50.5"
            y="36.5"
            width="19"
            height="23"
            rx="3.2"
            fill="#FDE68A"
            stroke="#D97706"
            strokeWidth="1.2"
            opacity="0.82"
          />
          <rect
            x="48"
            y="34"
            width="19.5"
            height="23.5"
            rx="3.2"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="1.6"
          />
          <rect x="48" y="34" width="19.5" height="4.8" rx="2.4" fill="#F59E0B" />
          <path
            d="M52.5 33 V36 M57.8 33 V36 M63 33 V36"
            stroke="#B45309"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M51.5 43.2 L52.6 44.3 L54.6 42"
            stroke="#059669"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="56.5"
            y1="43.5"
            x2="64"
            y2="43.5"
            stroke="#B45309"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="51.5"
            y1="48"
            x2="64"
            y2="48"
            stroke="#D97706"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="51.5"
            y1="52.5"
            x2="60.5"
            y2="52.5"
            stroke="#D97706"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <g className="sprout-pencil">
            <g transform="translate(65, 42) rotate(24)">
              <rect
                x="0"
                y="0"
                width="3.4"
                height="9.5"
                rx="1"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="0.9"
              />
              <rect x="0" y="0" width="3.4" height="2.4" rx="0.8" fill="#059669" />
              <polygon
                points="0,9.5 3.4,9.5 1.7,12.4"
                fill="#FEF3C7"
                stroke="#B45309"
                strokeWidth="0.7"
                strokeLinejoin="round"
              />
              <circle cx="1.7" cy="11.9" r="0.65" fill="#18181B" />
            </g>
          </g>
        </g>
      </g>
    </SproutFrame>
  );
}

function renderGuidePose(size: number | undefined, animated: boolean, className: string) {
  const w = size ?? 96;
  const h = size ? Math.round(size * 0.8125) : 78;
  return (
    <SproutFrame
      width={w}
      height={h}
      viewBox="0 0 96 78"
      label="Guide Sprout"
      animated={animated}
      className={className}
    >
      <ellipse
        cx="48"
        cy="67.5"
        rx="16.5"
        ry="3.4"
        fill="#065F46"
        className="sprout-shadow"
      />
      <path
        d="M72 20.5 L73 23.2 L75.7 24.2 L73 25.2 L72 27.9 L71 25.2 L68.3 24.2 L71 23.2 Z"
        fill="#34D399"
        className="sprout-twinkle"
      />
      <g className="sprout-perk sprout-perk--guide">
        <g className="sprout-bob">
          <path
            d="M48 32.5 C47.6 28 48.3 24 48 20.5"
            stroke="#059669"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M47.6 31.5 C47.3 27.8 47.9 24.4 47.7 21.2"
            stroke="#34D399"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <g className="sprout-leaf-right">
            <path
              d="M48 22.8 C48.4 11.5 60 6.5 70.5 10.5 C68.2 21 58.2 25.6 48 22.8 Z"
              fill="#059669"
            />
            <path
              d="M48.4 22.2 C50.5 13.2 60.2 8.2 69.8 10.7 C64.2 15.8 56.5 19.6 48.4 22.2 Z"
              fill="#10B981"
            />
            <path
              d="M50.5 20.5 C53.2 13.5 61 9.6 68.5 11.1 C63.2 14.2 56.5 17.5 50.5 20.5 Z"
              fill="#34D399"
              opacity="0.72"
            />
            <path
              d="M49.5 21.6 C55.2 17.4 61 14.2 66.8 12.2"
              stroke="#A7F3D0"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M56.5 17.2 C58.2 15.2 59.8 13.8 61.5 12.9"
              stroke="#A7F3D0"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g className="sprout-dewdrop">
              <circle cx="65.8" cy="12.5" r="2.1" fill="#A7F3D0" opacity="0.5" />
              <circle cx="65.8" cy="12.5" r="1.25" fill="#ECFDF5" />
            </g>
          </g>
          <g className="sprout-leaf-left">
            <path
              d="M48 25 C47.2 15.8 36.8 11.4 28 15.6 C30.4 24.4 39.2 28.2 48 25 Z"
              fill="#34D399"
            />
            <path
              d="M47.4 24.3 C45 17 36.8 13.4 29 15.9 C34.5 19.4 41 22.4 47.4 24.3 Z"
              fill="#6EE7B7"
            />
            <path
              d="M45.5 23 C42.4 17.4 35.8 14.8 30.2 16.3 C35.2 18.8 40.4 21 45.5 23 Z"
              fill="#A7F3D0"
              opacity="0.7"
            />
            <path
              d="M46.6 24.2 C41.6 20.6 36.6 18.2 31.8 16.9"
              stroke="#ECFDF5"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
          <rect x="31" y="31" width="34" height="33" rx="16" fill="#065F46" />
          <ellipse cx="48" cy="39.5" rx="14.5" ry="7.8" fill="#059669" opacity="0.75" />
          <path
            d="M32 53.5 C34.5 60.5 41 64 48 64 C57 64 64.5 57.5 65 48 C61 55.5 47 61 32 53.5 Z"
            fill="#064E3B"
            opacity="0.38"
          />
          <path
            d="M35.5 41 C36.8 35.5 41.2 33 46.5 33"
            stroke="#34D399"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.38"
          />
          <g className="sprout-eye">
            <ellipse cx="41.8" cy="45.8" rx="2.7" ry="3.1" fill="#FFFFFF" />
            <ellipse cx="41.8" cy="46.8" rx="1.7" ry="1.1" fill="#A7F3D0" opacity="0.55" />
          </g>
          <g className="sprout-eye">
            <ellipse cx="54.2" cy="45.8" rx="2.7" ry="3.1" fill="#FFFFFF" />
            <ellipse cx="54.2" cy="46.8" rx="1.7" ry="1.1" fill="#A7F3D0" opacity="0.55" />
          </g>
          <ellipse cx="37.2" cy="50.4" rx="2.6" ry="1.7" fill="#F59E0B" opacity="0.82" />
          <ellipse cx="58.8" cy="50.4" rx="2.6" ry="1.7" fill="#F59E0B" opacity="0.82" />
          <path
            d="M44.8 50.8 Q48 53.5 51.2 50.8"
            stroke="#A7F3D0"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </g>
      </g>
    </SproutFrame>
  );
}

export function SproutMascot({
  pose = 'guide',
  size,
  className = '',
  animated = true,
}: SproutMascotProps) {
  switch (pose) {
    case 'emblem':
      return renderEmblemPose(size, animated, className);
    case 'avatar':
      return renderAvatarPose(size, animated, className);
    case 'snoozing':
      return renderSnoozingPose(size, animated, className);
    case 'baby':
      return renderBabyPose(size, animated, className);
    case 'notepad':
      return renderNotepadPose(size, animated, className);
    case 'guide':
    default:
      return renderGuidePose(size, animated, className);
  }
}
