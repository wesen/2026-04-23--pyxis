import type { Meta, StoryObj } from '@storybook/react';
import { AuditLogPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Audit Log',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<AuditLogPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

