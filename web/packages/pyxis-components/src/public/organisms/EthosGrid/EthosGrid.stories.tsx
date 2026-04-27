import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EthosGrid } from './EthosGrid';

const meta: Meta<typeof EthosGrid> = {
  title: 'Public Site/Components/Organisms/EthosGrid',
  component: EthosGrid,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof EthosGrid>;

export const Default: Story = {
  args: {},
  render: (args) => <div style={{ width: 620 }}><EthosGrid {...args} /></div>,
};

export const TwoItemPolicy: Story = {
  args: {
    heading: 'House rules',
    items: [
      { number: '01', title: 'Consent first', description: 'staff can pause a night, remove a guest, or reset a room when the safer-space policy is crossed.' },
      { number: '02', title: 'Artists paid', description: 'door splits and guarantees are written down before the show so everyone knows how the night works.' },
    ],
  },
  render: (args) => <div style={{ width: 620 }}><EthosGrid {...args} /></div>,
};

export const Narrow: Story = {
  args: {},
  render: (args) => <div style={{ width: 360 }}><EthosGrid {...args} /></div>,
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div style={{ '--pyxis-ethos-accent': 'var(--color-text-primary)', '--pyxis-ethos-border': 'var(--color-accent)', '--pyxis-ethos-body': 'var(--color-text-secondary)', '--pyxis-ethos-muted': 'var(--color-accent)', width: 620 } as CSSProperties}>
      <EthosGrid {...args} />
    </div>
  ),
};
