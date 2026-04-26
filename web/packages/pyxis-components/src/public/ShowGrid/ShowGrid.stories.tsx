import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowGrid } from './ShowGrid';

const shows = [
  { artist: 'Redroom Inferno', date: 'Fri, Feb 14', doorsTime: '9:00 PM', age: '25+', price: '$10 adv / $15 door', kind: 'tickets' as const, poster: 'redroom' as const },
  { artist: '808 Collective', date: 'Fri, Feb 21', doorsTime: '8:00 PM', age: '21+', price: '$12', kind: 'tickets' as const, poster: 'pixel808' as const },
  { artist: 'Petals of Love', date: 'Sat, Feb 28', doorsTime: '6:30 PM', age: 'All Ages', price: '$15', kind: 'tickets' as const, poster: 'petals' as const },
  { artist: 'Basement Frequencies', date: 'Fri, Feb 28', doorsTime: '9:30 PM', age: '21+', price: '$12', kind: 'tickets' as const, poster: 'basement' as const },
  { artist: 'Orphx', date: 'Fri, Jul 4', doorsTime: '9:00 PM', age: '18+', price: '$12', kind: 'tickets' as const, poster: 'orphx' as const },
  { artist: 'Zola Jesus', date: 'Fri, Jun 6', doorsTime: '8:00 PM', age: '21+', price: '$20', kind: 'tickets' as const, poster: 'zola' as const },
];

const meta: Meta<typeof ShowGrid> = {
  title: 'Public/Organisms/ShowGrid',
  component: ShowGrid,
  tags: ['autodocs'],
  args: { shows },
};

export default meta;
type Story = StoryObj<typeof ShowGrid>;

export const Desktop: Story = {
  render: (args) => (
    <div style={{ width: 856 }}>
      <ShowGrid {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { compact: true },
  render: (args) => (
    <div style={{ width: 354 }}>
      <ShowGrid {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-show-tile-title-color': 'var(--color-text-primary)',
        '--pyxis-show-tile-muted-color': 'var(--color-text-secondary)',
        width: 856,
      } as CSSProperties}
    >
      <ShowGrid {...args} />
    </div>
  ),
};
