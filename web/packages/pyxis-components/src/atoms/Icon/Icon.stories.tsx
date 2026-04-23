import type { Meta, StoryObj } from '@storybook/react';
import { Icon, PyxisMark, PyxisLogo } from './Icon';
import type { IconName } from './Icon';
import { tokens } from '../../tokens';

// ─── Meta ──────────────────────────────────────────────

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A thin-line SVG icon system built from the original Pyxis design language.

**Principles:**
- All icons are 20×20 viewBox, 1.6px stroke, round linecap/linejoin
- No icon font dependencies — pure inline SVG
- Accessible: always provide \`aria-label\` when used as a standalone interactive icon
- Responsive: \`size\` prop scales uniformly
- Data-part selectors for CSS targeting: \`[data-part="icon"]\`

**Usage:**
\`\`\`tsx
<Icon name="check" size={16} />
<Icon name="chevron-right" aria-label="Go forward" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'home', 'calendar', 'ticket', 'mail', 'users', 'log', 'cog', 'search',
        'chevron', 'plus', 'check', 'x', 'bell', 'pin', 'door', 'music',
        'discord', 'edit', 'trash', 'external', 'archive', 'filter', 'sparkle',
        'dot', 'compass', 'warning', 'copy', 'reset', 'play',
      ],
      description: 'Which icon to render',
    },
    size: { control: 'number', description: 'Pixel size' },
    color: { control: 'color', description: 'SVG stroke/fill color' },
    strokeWidth: { control: 'number', description: 'stroke-width' },
  },
  args: {
    name: 'check',
    size: 24,
    color: 'currentColor',
    strokeWidth: 1.6,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual icon stories ───────────────────────────

/** Default icon — check mark */
export const Default: Story = {
  args: {
    name: 'check',
    size: 24,
  },
};

/** All icons in a grid — use to verify the full set renders correctly */
export const AllIcons: Story = {
  render: () => {
    const iconNames: IconName[] = [
      'home', 'calendar', 'ticket', 'mail', 'users', 'log', 'cog', 'search',
      'chevron', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
      'plus', 'check', 'x', 'bell', 'pin', 'door', 'music',
      'discord', 'edit', 'trash', 'external', 'archive', 'filter', 'sparkle',
      'dot', 'compass', 'warning', 'copy', 'reset', 'play',
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          gap: '12px',
        }}
      >
        {iconNames.map((name) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '12px 8px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Icon name={name} size={20} aria-hidden />
            <span
              style={{
                fontSize: tokens.text.xs,
                color: 'var(--color-text-tertiary)',
                fontFamily: tokens.font.mono,
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/** Size variants */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="check" size={12} aria-label="12px" />
      <Icon name="check" size={16} aria-label="16px" />
      <Icon name="check" size={20} aria-label="20px" />
      <Icon name="check" size={24} aria-label="24px" />
      <Icon name="check" size={32} aria-label="32px" />
      <Icon name="check" size={48} aria-label="48px" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Color variants */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Icon name="check" size={24} color={tokens.color.accent} aria-label="Accent" />
      <Icon name="check" size={24} color={tokens.color.success} aria-label="Success" />
      <Icon name="check" size={24} color={tokens.color.warning} aria-label="Warning" />
      <Icon name="check" size={24} color={tokens.color.textTertiary} aria-label="Muted" />
      <Icon name="check" size={24} color={tokens.color.ink} aria-label="Ink" />
      <Icon name="check" size={24} color={tokens.color.discord} aria-label="Discord" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Icon with inline text (typical usage) */
export const WithInlineText: Story = {
  render: () => (
    <p style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: tokens.text.base }}>
      <Icon name="check" size={16} aria-hidden />
      This is a success message with an inline icon
    </p>
  ),
  parameters: { controls: { disable: true } },
};

/** Icon used in a button context */
export const InButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: tokens.color.accent, color: tokens.color.textInverse,
          border: 'none', borderRadius: tokens.radius.md,
          padding: '8px 16px', fontSize: tokens.text.base, cursor: 'pointer',
        }}
      >
        <Icon name="chevron-right" size={14} aria-hidden />
        Get tickets
      </button>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'transparent', color: tokens.color.textSecondary,
          border: `1px solid ${tokens.color.border}`, borderRadius: tokens.radius.md,
          padding: '8px 16px', fontSize: tokens.text.base, cursor: 'pointer',
        }}
      >
        <Icon name="calendar" size={14} aria-hidden />
        Add to calendar
      </button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** PyxisMark — logo mark */
export const PyxisMark_: Story = {
  name: 'PyxisMark',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <PyxisMark size={20} />
      <PyxisMark size={28} />
      <PyxisMark size={40} />
      <PyxisMark size={56} color={tokens.color.accent} />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** PyxisLogo — full wordmark */
export const PyxisLogo_: Story = {
  name: 'PyxisLogo',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PyxisLogo size={22} />
      <PyxisLogo size={28} stack />
      <PyxisLogo size={32} color={tokens.color.textInverse} />
      <div style={{ background: tokens.color.ink, padding: '12px 16px', borderRadius: tokens.radius.md }}>
        <PyxisLogo size={22} color={tokens.color.textInverse} />
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Playground — explore all icon combinations */
export const Playground: Story = {
  args: {
    name: 'bell',
    size: 24,
    color: 'currentColor',
    strokeWidth: 1.6,
  },
};
