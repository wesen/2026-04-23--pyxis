import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Button } from 'pyxis-components';
import { AppShell } from '.';

const meta = {
  title: 'Pyxis App/Components/Shell/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: {
    page: 'dashboard',
    title: 'Welcome back, Ada',
    eyebrow: 'Home / Dashboard',
    subtitle: 'Wednesday, April 23 · 6 shows booked this month',
    children: <div style={{ padding: 24 }}>Shell content</div>,
  },
} satisfies Meta<typeof AppShell>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Shell: Story = {};

export const ShellWithCustomAction: Story = {
  args: {
    action: <Button size="sm" iconLeft="plus">Add show</Button> as ReactNode,
  },
};
