import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SaferSpaceAgreement } from './SaferSpaceAgreement';

const meta: Meta<typeof SaferSpaceAgreement> = {
  title: 'Public/Molecules/SaferSpaceAgreement',
  component: SaferSpaceAgreement,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SaferSpaceAgreement>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <SaferSpaceAgreement {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 280 }}>
      <SaferSpaceAgreement {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-safer-space-accent-color': 'var(--color-text-primary)',
        '--pyxis-safer-space-muted-color': 'var(--color-text-secondary)',
        width: 620,
      } as CSSProperties}
    >
      <SaferSpaceAgreement {...args} />
    </div>
  ),
};
