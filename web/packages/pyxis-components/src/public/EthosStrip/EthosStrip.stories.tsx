import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EthosStrip } from './EthosStrip';
const meta: Meta<typeof EthosStrip> = { title: 'Public/Organisms/EthosStrip', component: EthosStrip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EthosStrip>;
export const Default: Story = { args: {} };
export const Narrow: Story = { args: {}, render: (args) => <div style={{ width: 420 }}><EthosStrip {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-ethos-strip-accent': 'var(--color-text-primary)', '--pyxis-ethos-strip-border': 'var(--color-accent)', '--pyxis-ethos-strip-body': 'var(--color-text-secondary)', '--pyxis-ethos-strip-muted': 'var(--color-accent)', width: 860 } as CSSProperties}><EthosStrip {...args} /></div> };
