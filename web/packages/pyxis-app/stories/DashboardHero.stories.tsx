import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../src/api/mockData';
import { DashboardHero } from '../src/components/organisms/DashboardSections';

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const longArtistShow = { ...confirmedShows[0], artist: 'Moor Mother with Special Guests and Ensemble' };

const meta: Meta<typeof DashboardHero> = {
  title: 'Pyxis App/Organisms/DashboardHero',
  component: DashboardHero,
  parameters: { layout: 'fullscreen' },
  args: { show: confirmedShows[0] },
};

export default meta;
type Story = StoryObj<typeof DashboardHero>;

export const Desktop: Story = {
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};

export const Mobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardHero {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const LongArtistName: Story = {
  args: { show: longArtistShow },
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};

export const NoNextShow: Story = {
  args: { show: undefined },
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};
