import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../api/mockData';
import { ShowDetailHero } from './ShowDetailHero';

const show = shows[0];

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowDetailHero',
  component: ShowDetailHero,
  parameters: { layout: 'fullscreen' },
  args: { show },
} satisfies Meta<typeof ShowDetailHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroMobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><ShowDetailHero {...args}/></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Desktop: Story = {
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowDetailHero {...args}/></div>,
};

export const Archived: Story = {
  args: { show: shows.find((item) => item.status === ShowStatus.ARCHIVED) ?? show, dateLabel: 'Fri, Mar 14, 2025' },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowDetailHero {...args}/></div>,
};

export const LongArtistName: Story = {
  args: { show: { ...show, artist: 'A Very Long Touring Artist Name + Several Guests' } },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowDetailHero {...args}/></div>,
};
