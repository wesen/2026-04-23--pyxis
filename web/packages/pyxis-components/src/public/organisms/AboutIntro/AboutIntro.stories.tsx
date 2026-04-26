import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AboutIntro } from './AboutIntro';
const meta: Meta<typeof AboutIntro> = { title: 'Public Site/Components/Organisms/AboutIntro', component: AboutIntro, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AboutIntro>;
export const Default: Story = { args: {}, render: (args) => <div style={{ width: 620 }}><AboutIntro {...args} /></div> };
export const Narrow: Story = { args: {}, render: (args) => <div style={{ width: 360 }}><AboutIntro {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-about-intro-accent': 'var(--color-text-primary)', '--pyxis-about-intro-body': 'var(--color-text-secondary)', width: 620 } as CSSProperties}><AboutIntro {...args} /></div> };
