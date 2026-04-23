/**
 * Pyxis design tokens — TypeScript constants.
 * Use these for TypeScript types and when you need JS values.
 * For CSS styles, use the CSS custom properties in tokens.css.
 */

// ─── Colors ────────────────────────────────────────────

export const color = {
  // Canvas
  canvas:          '#F3F1EB',
  canvasRgb:       [243, 241, 235] as [number, number, number],

  // Surfaces
  surface:         '#FFFFFF',
  surfaceRaised:   '#FAF8F2',

  // Borders
  border:          '#EAE6DD',
  borderSubtle:    '#F0EDE4',
  borderStrong:    '#CCC7BB',

  // Text
  textPrimary:     '#1A1A18',
  textSecondary:   '#555048',
  textTertiary:    '#8A857B',
  textDisabled:    '#B8B2A5',
  textInverse:     '#FFFFFF',
  textInverseMuted: 'rgba(255, 255, 255, 0.7)',

  // Accent (crimson)
  accent:          '#C8270D',
  accentHover:     '#A81F09',
  accentSubtle:    '#FCEFEB',
  accentStrong:    '#8E1B08',

  // Semantic: success
  success:         '#3C7A4F',
  successHover:    '#2E5F3C',
  successSubtle:   '#EAF3EC',

  // Semantic: warning
  warning:         '#C97A0F',
  warningSubtle:   '#FBF1DC',

  // Semantic: info
  info:            '#2E5D9E',
  infoSubtle:      '#E6EDF7',

  // Semantic: muted
  muted:           '#6B6459',
  mutedSubtle:     '#EEEAE0',

  // Discord
  discord:         '#5865F2',

  // Ink
  ink:             '#1A1A18',
  inkSubtle:       '#F0EDE4',
} as const;

// ─── Font Families ──────────────────────────────────────

export const font = {
  display: '"Fraunces", Georgia, "Times New Roman", serif',
  body:    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono:    '"JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
} as const;

// ─── Radii ─────────────────────────────────────────────

export const radius = {
  xs:   '0.25rem',
  sm:   '0.375rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

// ─── Shadows ───────────────────────────────────────────

export const shadow = {
  xs:  '0 1px 2px rgba(26, 24, 22, 0.04)',
  sm:  '0 1px 3px rgba(26, 24, 22, 0.06), 0 1px 2px rgba(26, 24, 22, 0.04)',
  md:  '0 2px 10px rgba(26, 24, 22, 0.06), 0 1px 3px rgba(26, 24, 22, 0.04)',
  lg:  '0 8px 32px rgba(26, 24, 22, 0.10), 0 2px 8px rgba(26, 24, 22, 0.06)',
  xl:  '0 20px 60px rgba(26, 24, 22, 0.18), 0 8px 24px rgba(26, 24, 22, 0.10)',
  none: 'none',
} as const;

// ─── Space ──────────────────────────────────────────────

export const space = {
  px:  '1px',
  0:   '0',
  1:   '0.25rem',
  2:   '0.5rem',
  3:   '0.75rem',
  4:   '1rem',
  5:   '1.25rem',
  6:   '1.5rem',
  7:   '2rem',
  8:   '2.5rem',
  9:   '3.5rem',
  10:  '4.5rem',
  11:  '6rem',
  12:  '8rem',
} as const;

// ─── Text ───────────────────────────────────────────────

export const text = {
  xs:   '0.75rem',
  sm:   '0.8125rem',
  base: '0.875rem',
  lg:   '1rem',
  xl:   '1.125rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  '4xl': '1.875rem',
  '5xl': '2.25rem',
  '6xl': '3rem',
  '7xl': '3.75rem',
  '8xl': '4.5rem',
} as const;

export const leading = {
  none:    1,
  tight:   1.1,
  snug:    1.25,
  normal:  1.5,
  relaxed: 1.625,
  loose:   2,
} as const;

export const tracking = {
  tightest: '-0.04em',
  tight:    '-0.02em',
  normal:   '0',
  wide:     '0.02em',
  wider:    '0.04em',
  widest:   '0.08em',
} as const;

// ─── All tokens as one object ────────────────────────────

export const tokens = {
  color,
  font,
  radius,
  shadow,
  space,
  text,
  leading,
  tracking,
} as const;

export type Tokens = typeof tokens;

// ─── Badge / Status mapping ───────────────────────────────

export type BadgeStatus =
  | 'confirmed'
  | 'pending'
  | 'approved'
  | 'declined'
  | 'cancelled'
  | 'archived'
  | 'hold'
  | 'blocked'
  | 'live'
  | 'draft'
  | 'needslog'
  | 'logged';

export const badgeColors: Record<BadgeStatus, { bg: string; fg: string; label: string }> = {
  confirmed:  { bg: color.successSubtle,  fg: color.success,  label: 'Confirmed' },
  pending:    { bg: color.warningSubtle,  fg: color.warning,  label: 'Pending' },
  approved:   { bg: color.successSubtle,  fg: color.success,  label: 'Approved' },
  declined:   { bg: color.accentSubtle,   fg: color.accent,   label: 'Declined' },
  cancelled:  { bg: color.accentSubtle,   fg: color.accent,   label: 'Cancelled' },
  archived:   { bg: color.mutedSubtle,    fg: color.muted,    label: 'Archived' },
  hold:       { bg: color.infoSubtle,     fg: color.info,     label: 'Hold' },
  blocked:    { bg: color.mutedSubtle,    fg: color.muted,    label: 'Blocked' },
  live:       { bg: color.successSubtle,  fg: color.success,  label: 'Live' },
  draft:      { bg: color.mutedSubtle,    fg: color.muted,    label: 'Draft' },
  needslog:   { bg: color.warningSubtle,  fg: color.warning,  label: 'Needs log' },
  logged:     { bg: color.successSubtle,  fg: color.success,  label: 'Logged' },
};

// ─── Button variants ─────────────────────────────────────

export const buttonVariants = {
  primary: { bg: color.accent,       fg: color.textInverse, bd: color.accent,    hover: color.accentHover   },
  dark:    { bg: color.ink,          fg: color.textInverse, bd: color.ink,       hover: '#2D2B28'          },
  outline: { bg: 'transparent',      fg: color.textSecondary, bd: color.border,   hover: color.surfaceRaised },
  ghost:   { bg: 'transparent',      fg: color.textSecondary, bd: 'transparent',  hover: color.surfaceRaised },
  danger:  { bg: 'transparent',      fg: color.accent,        bd: '#F3C7BE',      hover: color.accentSubtle  },
  success: { bg: color.success,       fg: color.textInverse, bd: color.success,   hover: color.successHover  },
  discord: { bg: color.discord,       fg: color.textInverse, bd: color.discord,   hover: '#4752C4'          },
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export const buttonSizes = {
  sm: { height: 32, padding: '5px 12px',  fontSize: text.sm  },
  md: { height: 40, padding: '7px 16px', fontSize: text.base },
  lg: { height: 48, padding: '11px 22px', fontSize: text.lg  },
} as const;

export type ButtonSize = keyof typeof buttonSizes;
