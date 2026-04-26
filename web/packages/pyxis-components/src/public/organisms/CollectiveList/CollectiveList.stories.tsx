import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CollectiveList } from './CollectiveList';
const meta: Meta<typeof CollectiveList> = { title: 'Public Site/Components/Organisms/CollectiveList', component: CollectiveList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof CollectiveList>;
export const Default: Story = { args: {}, render: (args) => <div style={{ width: 620 }}><CollectiveList {...args} /></div> };
export const Narrow: Story = { args: {}, render: (args) => <div style={{ width: 320 }}><CollectiveList {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-collective-accent': 'var(--color-text-primary)', '--pyxis-collective-border': 'var(--color-accent)', '--pyxis-collective-muted': 'var(--color-text-secondary)', width: 420 } as CSSProperties}><CollectiveList {...args} /></div> };
