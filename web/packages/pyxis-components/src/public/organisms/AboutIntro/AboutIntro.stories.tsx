import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AboutIntro } from './AboutIntro';

const meta: Meta<typeof AboutIntro> = {
  title: 'Public Site/Components/Organisms/AboutIntro',
  component: AboutIntro,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AboutIntro>;

export const Default: Story = {
  args: {},
  render: (args) => <div style={{ width: 620 }}><AboutIntro {...args} /></div>,
};

export const FromCmsCopy: Story = {
  args: {
    lead: 'a volunteer-run all-ages room with a tuned PA, a small stage, and a calendar built around strange local music.',
    paragraphs: [
      'this variant uses props instead of hard-coded copy so a page can pass content from RTK Query, a CMS response, or a route loader.',
      'the component still owns its typography and spacing; the page only owns the data it wants rendered.',
    ],
  },
  render: (args) => <div style={{ width: 620 }}><AboutIntro {...args} /></div>,
};

export const Narrow: Story = {
  args: {},
  render: (args) => <div style={{ width: 360 }}><AboutIntro {...args} /></div>,
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div style={{ '--pyxis-about-intro-accent': 'var(--color-text-primary)', '--pyxis-about-intro-body': 'var(--color-text-secondary)', width: 620 } as CSSProperties}>
      <AboutIntro {...args} />
    </div>
  ),
};
