import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketStub } from './TicketStub';
import { seedShows } from '../../../mocks/handlers';

const meta: Meta<typeof TicketStub> = {
  title: 'Public Site/Components/Molecules/TicketStub',
  component: TicketStub,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TicketStub>;

export const Default: Story = {
  args: { show: seedShows[0] },
};

export const LongArtist: Story = {
  args: { show: seedShows[2] },
  render: (args) => (
    <div style={{ width: 240 }}>
      <TicketStub {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: { show: seedShows[0] },
  render: (args) => (
    <div
      style={{
        '--pyxis-ticket-stub-bg': 'var(--color-ink)',
        '--pyxis-ticket-stub-border-color': 'var(--color-accent)',
        '--pyxis-ticket-stub-color': 'var(--color-ink-subtle)',
        '--pyxis-ticket-stub-muted-color': 'var(--color-text-inverse-muted)',
        '--pyxis-ticket-stub-title-color': 'var(--color-text-inverse)',
        padding: 24,
        width: 260,
      } as CSSProperties}
    >
      <TicketStub {...args} />
    </div>
  ),
};
