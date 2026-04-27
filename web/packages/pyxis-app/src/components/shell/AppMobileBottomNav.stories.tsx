import type { Meta, StoryObj } from '@storybook/react';
import { AppMobileBottomNav } from './AppShell';

const meta = {
  title: 'Pyxis App/Components/Shell/AppMobileBottomNav',
  component: AppMobileBottomNav,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'pyxisAppMobile' },
  },
} satisfies Meta<typeof AppMobileBottomNav>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 390, paddingTop: 700, background: 'var(--app-mobile-canvas)' }}>
      <AppMobileBottomNav />
    </div>
  ),
};
