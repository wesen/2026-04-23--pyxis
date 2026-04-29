import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { ShowsFilterBar, type ShowsFilterValue } from './ShowsFilterBar';

const counts: Record<ShowsFilterValue, number> = {
  all: 12,
  [ShowStatus.CONFIRMED]: 6,
  [ShowStatus.HOLD]: 2,
  [ShowStatus.CANCELLED]: 1,
  [ShowStatus.DRAFT]: 1,
  [ShowStatus.ARCHIVED]: 3,
};

const meta = {
  title: 'Pyxis App/Components/Organisms/Shows/ShowsFilterBar',
  component: ShowsFilterBar,
  parameters: { layout: 'fullscreen' },
  args: { counts, activeFilter: ShowStatus.CONFIRMED, onFilterChange: () => undefined },
} satisfies Meta<typeof ShowsFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsFilterBar {...args} /></div>,
};

export const Interactive: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ShowsFilterValue>('all');
    return <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsFilterBar {...args} activeFilter={activeFilter} onFilterChange={setActiveFilter} /></div>;
  },
};

export const Empty: Story = {
  args: { counts: { all: 0, [ShowStatus.CONFIRMED]: 0, [ShowStatus.HOLD]: 0, [ShowStatus.CANCELLED]: 0, [ShowStatus.DRAFT]: 0, [ShowStatus.ARCHIVED]: 0 }, activeFilter: 'all' },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsFilterBar {...args} /></div>,
};
