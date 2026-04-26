import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PubFooter } from './PubFooter';
const meta: Meta<typeof PubFooter> = { title: 'Public Site/Components/Organisms/PubFooter', component: PubFooter, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PubFooter>;
export const Default: Story = {};
export const Narrow: Story = { render: (args) => <div style={{ width: 360 }}><PubFooter {...args} /></div> };
export const ThemeOverride: Story = { render: (args) => <div style={{ '--pyxis-footer-border': 'var(--color-accent)', '--pyxis-footer-brand': 'var(--color-accent)', '--pyxis-footer-muted': 'var(--color-text-secondary)' } as CSSProperties}><PubFooter {...args} /></div> };
