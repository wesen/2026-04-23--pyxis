import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowFlyerCard } from './ShowFlyerCard';

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowEdit/ShowFlyerCard',
  component: ShowFlyerCard,
  parameters: { layout: 'fullscreen' },
  args: { onUpload: fn(), onDelete: fn() },
} satisfies Meta<typeof ShowFlyerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = { args: { flyerUrl: '/flyers/show-31/flyer.svg' }, render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><ShowFlyerCard {...args} /></div> };
export const Missing: Story = { render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><ShowFlyerCard {...args} /></div> };
export const Uploading: Story = { args: { flyerUrl: '/flyers/show-31/flyer.svg', isUploading: true }, render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><ShowFlyerCard {...args} /></div> };
