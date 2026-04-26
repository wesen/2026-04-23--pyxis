import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AboutHero } from './AboutHero';
const meta: Meta<typeof AboutHero> = { title: 'Public Site/Components/Organisms/AboutHero', component: AboutHero, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AboutHero>;
export const Default: Story = { args: {} };
export const LongTagline: Story = { args: { tagline: 'a worker-run music artist space for strange nights, heavy sound, and gatherings that need a careful room.' }, render: (args) => <div style={{ width: 520 }}><AboutHero {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-about-hero-accent': 'var(--color-text-primary)', '--pyxis-about-hero-muted': 'var(--color-accent)', width: 620 } as CSSProperties}><AboutHero {...args} /></div> };
