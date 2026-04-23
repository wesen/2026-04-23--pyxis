import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import type { BadgeStatus } from './Badge';
import { badgeColors } from '../../tokens';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A small status indicator with a dot and label.
Used to communicate state at a glance.

**Statuses:** \`confirmed\` · \`pending\` · \`approved\` · \`declined\` · \`cancelled\` · \`archived\` · \`hold\` · \`blocked\` · \`live\` · \`draft\` · \`needslog\` · \`logged\`

\`\`\`tsx
<Badge status="confirmed" />
<Badge status="cancelled">Cancelled</Badge>
\`\`\`
        `,
      },
    },
  },
  args: {
    status: 'confirmed',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ────────────────────────────────────────────

/** Default badge */
export const Default: Story = {
  args: {
    status: 'confirmed',
  },
};

/** All statuses — use to verify the full set renders correctly */
export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(Object.keys(badgeColors) as BadgeStatus[]).map((status) => (
        <Badge key={status} status={status} />
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** On dark background */
export const OnDarkBackground: Story = {
  render: () => (
    <div
      style={{
        background: 'var(--color-ink)',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      <Badge status="live" />
      <Badge status="pending" />
      <Badge status="draft" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** With custom text */
export const CustomText: Story = {
  args: {
    status: 'cancelled',
    children: 'Show cancelled',
  },
};

/** Live indicator — used in dashboards or presence UIs */
export const LiveIndicator: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Badge status="live" />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        Live now
      </span>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Playground */
export const Playground: Story = {
  args: {
    status: 'confirmed',
  },
};
