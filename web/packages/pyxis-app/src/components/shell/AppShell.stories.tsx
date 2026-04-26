import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'pyxis-components';
import { AppMobileBottomNav, AppShell, AppSidebar, AppTopBar } from './AppShell';

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
    action: <Button size="sm" iconLeft="plus">Add show</Button>,
  },
};

export const Sidebar: Story = {
  render: () => <div style={{ width: 220, height: 760 }}><AppSidebar /></div>,
};

export const TopBarDashboard: Story = {
  render: () => <div style={{ width: 1020 }}><AppTopBar title="Welcome back, Ada" eyebrow="Home / Dashboard" subtitle="Wednesday, April 23 · 6 shows booked this month" /></div>,
};

export const TopBarWithAction: Story = {
  render: () => <div style={{ width: 1020 }}><AppTopBar title="Shows" eyebrow="Home / Shows" action={<Button size="sm" iconLeft="plus">New show</Button>} /></div>,
};

export const TopBarLongTitle: Story = {
  render: () => <div style={{ width: 720 }}><AppTopBar title="A very long route title for stress testing" eyebrow="Home / Long route" subtitle="Longer explanatory subtitle that should wrap gracefully in the shell top bar." /></div>,
};

export const MobileBottomNavigation: Story = {
  render: () => <div style={{ width: 390, paddingTop: 700, background: 'var(--app-mobile-canvas)' }}><AppMobileBottomNav /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
