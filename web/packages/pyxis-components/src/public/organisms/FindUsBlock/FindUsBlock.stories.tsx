import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FindUsBlock } from './FindUsBlock';
const meta: Meta<typeof FindUsBlock> = { title: 'Public Site/Components/Organisms/FindUsBlock', component: FindUsBlock, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof FindUsBlock>;
export const Default: Story = { args: {}, render: (args) => <div style={{ width: 620 }}><FindUsBlock {...args} /></div> };
export const Narrow: Story = { args: {}, render: (args) => <div style={{ width: 320 }}><FindUsBlock {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-find-us-accent': 'var(--color-text-primary)', '--pyxis-find-us-body': 'var(--color-text-secondary)', '--pyxis-find-us-muted': 'var(--color-accent)', width: 420 } as CSSProperties}><FindUsBlock {...args} /></div> };
