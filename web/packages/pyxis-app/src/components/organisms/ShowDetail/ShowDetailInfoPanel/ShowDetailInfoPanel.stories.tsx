import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../../api/mockData';
import { ShowDetailInfoPanel } from './ShowDetailInfoPanel';

const show = shows[0];

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowDetailInfoPanel',
  component: ShowDetailInfoPanel,
  parameters: { layout: 'fullscreen' },
  args: { show },
} satisfies Meta<typeof ShowDetailInfoPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoPanel: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailInfoPanel {...args}/></div>,
};

export const OverCapacity: Story = {
  args: { show: shows[4] },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailInfoPanel {...args}/></div>,
};

export const LongContent: Story = {
  args: { show: { ...show, genre: 'Experimental darkwave and noisy ambient electronics', price: '$12 advance / $15 at the door' } },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailInfoPanel {...args}/></div>,
};
