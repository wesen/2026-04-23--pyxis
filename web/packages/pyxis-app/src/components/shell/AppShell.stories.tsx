import type { Meta, StoryObj } from '@storybook/react';
import { AppMobileBottomNav, AppSidebar, AppTopBar } from './AppShell';

const meta: Meta = {
  title: 'Pyxis App/Components/Shell/AppShell',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Sidebar: Story = {
  render: () => <div style={{ width: 220, height: 760 }}><AppSidebar /></div>,
};

export const TopBarDashboard: Story = {
  render: () => <div style={{ width: 1020 }}><AppTopBar title="Welcome back, Ada" eyebrow="Home / Dashboard" subtitle="Wednesday, April 23 · 6 shows booked this month" /></div>,
};

export const MobileBottomNavigation: Story = {
  render: () => <div style={{ width: 390, paddingTop: 700, background: 'var(--app-mobile-canvas)' }}><AppMobileBottomNav /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
