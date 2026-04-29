import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FlyerDropzone } from './FlyerDropzone';

const fakeFile = new File(['flyer'], 'redroom-inferno.png', { type: 'image/png' });

const meta = {
  title: 'Pyxis App/Components/Molecules/FlyerDropzone',
  component: FlyerDropzone,
  parameters: { layout: 'fullscreen' },
  args: { onFileChange: fn() },
} satisfies Meta<typeof FlyerDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-surface)' }}><FlyerDropzone {...args} /></div>,
};

export const CurrentFlyer: Story = {
  args: { currentUrl: '/flyers/show-31/flyer.svg' },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-surface)' }}><FlyerDropzone {...args} /></div>,
};

export const SelectedFile: Story = {
  args: { file: fakeFile },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-surface)' }}><FlyerDropzone {...args} /></div>,
};

export const Narrow: Story = {
  args: { currentUrl: '/flyers/show-31/flyer.svg' },
  render: (args) => <div style={{ width: 320, padding: 16, background: 'var(--app-surface)' }}><FlyerDropzone {...args} /></div>,
};
