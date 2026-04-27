import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Button } from 'pyxis-components';
import { AppTopBar } from '.';

const meta = {
  title: 'Pyxis App/Components/Shell/AppTopBar',
  component: AppTopBar,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Welcome back, Ada',
  },
} satisfies Meta<typeof AppTopBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  render: () => (
    <div style={{ width: 1020 }}>
      <AppTopBar
        title="Welcome back, Ada"
        eyebrow="Home / Dashboard"
        subtitle="Wednesday, April 23 · 6 shows booked this month"
      />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div style={{ width: 1020 }}>
      <AppTopBar
        title="Shows"
        eyebrow="Home / Shows"
        action={<Button size="sm" iconLeft="plus">New show</Button> as ReactNode}
      />
    </div>
  ),
};

export const LongTitle: Story = {
  render: () => (
    <div style={{ width: 720 }}>
      <AppTopBar
        title="A very long route title for stress testing"
        eyebrow="Home / Long route"
        subtitle="Longer explanatory subtitle that should wrap gracefully in the shell top bar."
      />
    </div>
  ),
};
