import type { Meta, StoryObj } from '@storybook/react';
import { AttendancePage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Attendance',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<AttendancePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

