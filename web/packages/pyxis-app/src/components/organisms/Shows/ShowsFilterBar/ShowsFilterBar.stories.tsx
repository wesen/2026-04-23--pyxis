import type { Meta, StoryObj } from '@storybook/react';
import { ShowsFilterBar } from './ShowsFilterBar';

const meta = {
  title: 'Pyxis App/Components/Organisms/Shows/ShowsFilterBar',
  component: ShowsFilterBar,
  parameters: { layout: 'fullscreen' },
  args: { confirmedCount: 6 },
} satisfies Meta<typeof ShowsFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsFilterBar {...args} /></div>,
};

export const Empty: Story = {
  args: { confirmedCount: 0 },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsFilterBar {...args} /></div>,
};
