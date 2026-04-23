import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

/* ─── SVG icon paths (thin, custom-drawn at 20×20 viewBox) ─── */

export type IconName =
  | 'home'
  | 'calendar'
  | 'ticket'
  | 'mail'
  | 'users'
  | 'log'
  | 'cog'
  | 'search'
  | 'chevron'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'plus'
  | 'check'
  | 'x'
  | 'bell'
  | 'pin'
  | 'door'
  | 'music'
  | 'discord'
  | 'edit'
  | 'trash'
  | 'external'
  | 'archive'
  | 'filter'
  | 'sparkle'
  | 'dot'
  | 'compass'
  | 'warning'
  | 'copy'
  | 'reset'
  | 'play';

const paths: Record<IconName, React.ReactNode> = {
  home:      <><path d="M3 10.5 10 4l7 6.5V17a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1v-6.5Z"/></>,
  calendar:  <><rect x="3" y="4.5" width="14" height="13" rx="1.5"/><path d="M3 8h14M7 3v3M13 3v3"/><circle cx="7" cy="11" r=".8" fill="currentColor"/><circle cx="10" cy="11" r=".8" fill="currentColor"/><circle cx="13" cy="11" r=".8" fill="currentColor"/></>,
  ticket:   <><path d="M3 7.5V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1.5a1.5 1.5 0 0 0 0 3V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0 0-3Z"/><path d="M8.5 6v8" strokeDasharray="1 1.4"/></>,
  mail:      <><rect x="3" y="5" width="14" height="10" rx="1.2"/><path d="m3.5 6 6.5 5 6.5-5"/></>,
  users:     <><circle cx="7" cy="8" r="2.4"/><circle cx="13.5" cy="8.5" r="1.9"/><path d="M3 16c.4-2.2 2.1-3.5 4-3.5s3.6 1.3 4 3.5M12 16c.3-1.7 1.6-2.7 3-2.7s2.4 1 2.7 2.7"/></>,
  log:       <><path d="M4 5h12M4 9h12M4 13h8M4 17h5"/></>,
  cog:       <><circle cx="10" cy="10" r="2.3"/><path d="M10 3.5v1.8M10 14.7v1.8M16.5 10h-1.8M5.3 10H3.5M14.6 5.4l-1.3 1.3M6.7 13.3l-1.3 1.3M14.6 14.6l-1.3-1.3M6.7 6.7 5.4 5.4"/></>,
  search:    <><circle cx="8.5" cy="8.5" r="4.5"/><path d="m12 12 4 4"/></>,
  chevron:   <><path d="m7.5 5 5 5-5 5"/></>,
  'chevron-down': <><path d="m5 7.5 5 5 5-5"/></>,
  'chevron-left': <><path d="m10 5-5 5 5 5"/></>,
  'chevron-right': <><path d="m7.5 5 5 5-5 5"/></>,
  'chevron-up':   <><path d="m5 10 5-5 5 5"/></>,
  plus:      <><path d="M10 4v12M4 10h12"/></>,
  check:     <><path d="m4 10.5 4 4 8-9"/></>,
  x:         <><path d="m5 5 10 10M15 5 5 15"/></>,
  bell:      <><path d="M5.5 14V9a4.5 4.5 0 0 1 9 0v5M3.5 14.5h13M8.5 17a1.5 1.5 0 0 0 3 0"/></>,
  pin:       <><path d="M12.5 3.5 16.5 7.5M11.8 4.2 7 9l-2.2-.5c-.6-.2-1 .5-.6.9l6.4 6.4c.4.4 1.1 0 .9-.6L11 13l4.8-4.8"/><path d="m7.5 12.5-3 3"/></>,
  door:      <><rect x="5" y="3" width="10" height="14" rx=".5"/><path d="M12.5 10.5v.5"/></>,
  music:     <><path d="M8 14V5l8-1.5V13"/><circle cx="6.5" cy="14.5" r="1.6"/><circle cx="14.5" cy="13" r="1.6"/></>,
  discord:   <><path d="M15.3 5.7a12.7 12.7 0 0 0-3.1-.9l-.2.4a10 10 0 0 0-3.5 0l-.2-.4a12.7 12.7 0 0 0-3.1.9C3 9 2.5 12 2.8 15a12.9 12.9 0 0 0 3.8 1.9l.8-1.2a8 8 0 0 1-1.2-.6l.2-.2c2.5 1.1 5.3 1.1 7.7 0l.2.2a8 8 0 0 1-1.2.6l.8 1.2a12.9 12.9 0 0 0 3.8-1.9c.4-3.2-.3-6.2-2.4-9.3Z" fill="currentColor" stroke="none"/><circle cx="7.5" cy="11" r="1.1" fill="var(--color-canvas)" stroke="none"/><circle cx="12.5" cy="11" r="1.1" fill="var(--color-canvas)" stroke="none"/></>,
  edit:      <><path d="M4 16h3l8-8-3-3-8 8v3ZM12 5l3 3"/></>,
  trash:     <><path d="M4 6h12M8 6V4.5A1 1 0 0 1 9 3.5h2a1 1 0 0 1 1 1V6M6 6l.8 10a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1L14 6"/></>,
  external:  <><path d="M8 4H4v12h12v-4M11 4h5v5M10 10l6-6"/></>,
  archive:   <><rect x="3" y="4.5" width="14" height="3" rx=".8"/><path d="M4 7.5V16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.5M8.5 11h3"/></>,
  filter:    <><path d="M3 5h14l-5 6v5l-4-2v-3L3 5Z"/></>,
  sparkle:   <><path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2"/></>,
  dot:       <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none"/>,
  compass:   <><circle cx="10" cy="10" r="7"/><path d="m7.5 12.5 1.8-4.6L13.5 6.5 11.7 11 7.5 12.5Z" fill="currentColor" stroke="none" fillOpacity=".15"/><circle cx="10" cy="10" r="1" fill="currentColor" stroke="none"/></>,
  warning:   <><path d="M10 3 18 16H2L10 3ZM10 8v4"/><circle cx="10" cy="14.5" r=".8" fill="currentColor" stroke="none"/></>,
  copy:      <><rect x="6" y="6" width="10" height="10" rx="1.2"/><path d="M4 14V5a1 1 0 0 1 1-1h9"/></>,
  reset:     <><path d="M4 10a6 6 0 1 0 2-4.5M4 4v3h3"/></>,
  play:      <><path d="M6 4v12l10-6-10-6Z" fill="currentColor" stroke="none"/></>,
};

/* ─── PyxisMark (logo mark) ─────────────────────────── */

type PyxisMarkProps = {
  size?: number;
  color?: string;
  className?: string;
};

/**
 * The Pyxis logo mark — a compass rose inscribed in a square.
 * Used as the favicon, the nav logo, and anywhere a compact brand mark is needed.
 */
export const PyxisMark = forwardRef<SVGSVGElement, PyxisMarkProps>(
  ({ size = 28, color = 'currentColor', className }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('pyxis-mark', className)}
      aria-label="Pyxis"
    >
      <rect x="3.5" y="3.5" width="25" height="25" rx="2" />
      <circle cx="16" cy="16" r="8" />
      <path d="M16 5.5v21M5.5 16h21" strokeOpacity=".25" />
      <path d="m16 9 2.4 5 4.6 2-4.6 2-2.4 5-2.4-5-4.6-2 4.6-2L16 9Z" fill={color} fillOpacity=".08" />
      <circle cx="16" cy="16" r="1.3" fill={color} stroke="none" />
    </svg>
  )
);
PyxisMark.displayName = 'PyxisMark';

/* ─── PyxisLogo ─────────────────────────────────────── */

type PyxisLogoProps = {
  size?: number;
  color?: string;
  stack?: boolean;
  className?: string;
};

/**
 * The full Pyxis logo — mark + wordmark.
 * Use in the nav bar or wherever the full brand needs to appear.
 */
export const PyxisLogo = forwardRef<HTMLDivElement, PyxisLogoProps>(
  ({ size = 28, color = 'currentColor', stack = false, className }, ref) => (
    <div
      ref={ref}
      className={clsx('pyxis-logo', className)}
      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
    >
      <PyxisMark size={size} color={color} />
      <div style={{ lineHeight: 1 }}>
        <div
          className="pyxis-logo__wordmark"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: size * 0.95,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color,
          }}
        >
          pyxis
        </div>
        {stack && (
          <div
            style={{
              fontSize: 10,
              color: 'var(--color-text-tertiary)',
              marginTop: 3,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
            }}
          >
            staff portal
          </div>
        )}
      </div>
    </div>
  )
);
PyxisLogo.displayName = 'PyxisLogo';

/* ─── Icon ──────────────────────────────────────────── */

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'data-part'?: string;
};

/**
 * A thin-line SVG icon system built from the original Pyxis design.
 *
 * ```tsx
 * <Icon name="check" size={16} />
 * <Icon name="chevron-right" aria-label="Go forward" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = 16,
      color = 'currentColor',
      strokeWidth = 1.6,
      className,
      'aria-label': ariaLabel,
      'data-part': dataPart,
    },
    ref
  ) => {
    const path = paths[name];

    if (!path) {
      return (
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className={clsx('pyxis-icon', 'pyxis-icon--unknown', className)}
          aria-label={`Unknown icon: ${name}`}
          data-part={dataPart}
        >
          <rect x="4" y="4" width="12" height="12" rx="2" strokeDasharray="2 1" />
        </svg>
      );
    }

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx('pyxis-icon', `pyxis-icon--${name}`, className)}
        aria-label={ariaLabel}
        data-part={dataPart}
        style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
      >
        {path}
      </svg>
    );
  }
);
Icon.displayName = 'Icon';

/* ─── Exports ──────────────────────────────────────────── */

export { paths as iconPaths };
