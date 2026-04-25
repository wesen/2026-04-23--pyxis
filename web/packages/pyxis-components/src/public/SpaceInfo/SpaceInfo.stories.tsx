import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SpaceInfo } from './SpaceInfo';
const meta: Meta<typeof SpaceInfo> = { title: 'Public/Organisms/SpaceInfo', component: SpaceInfo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SpaceInfo>;
export const Default: Story = { args: { email: 'book@ppxis.space' } };
export const Narrow: Story = { args: { email: 'book@ppxis.space' }, render: (args) => <div style={{ width: 220 }}><SpaceInfo {...args} /></div> };
export const ThemeOverride: Story = { args: { email: 'book@ppxis.space' }, render: (args) => <div style={{ '--pyxis-space-info-accent': 'var(--color-text-primary)', '--pyxis-space-info-body': 'var(--color-text-secondary)', width: 300 } as CSSProperties}><SpaceInfo {...args} /></div> };
