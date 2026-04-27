import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppShell';

const meta = {
  title: 'Pyxis App/Components/Shell/AppSidebar',
  component: AppSidebar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppSidebar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 220, height: 760 }}>
      <AppSidebar />
    </div>
  ),
};
