import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReserveTicketCard } from './ReserveTicketCard';

const meta: Meta<typeof ReserveTicketCard> = {
  title: 'Public/Molecules/ReserveTicketCard',
  component: ReserveTicketCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReserveTicketCard>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ReserveTicketCard {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: { price: '$0 – $30', note: 'pay what you can.' },
  render: (args) => (
    <div style={{ width: 260 }}>
      <ReserveTicketCard {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-reserve-ticket-bg': 'var(--color-ink)',
        '--pyxis-reserve-ticket-accent-color': 'var(--color-text-inverse)',
        '--pyxis-reserve-ticket-muted-color': 'var(--color-text-inverse-muted)',
        '--pyxis-reserve-ticket-button-bg': 'var(--color-text-inverse)',
        '--pyxis-reserve-ticket-button-color': 'var(--color-ink)',
        width: 320,
      } as CSSProperties}
    >
      <ReserveTicketCard {...args} />
    </div>
  ),
};
