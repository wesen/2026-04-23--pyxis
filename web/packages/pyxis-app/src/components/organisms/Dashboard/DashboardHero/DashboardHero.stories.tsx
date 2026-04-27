import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../../api/mockData';
import { DashboardHero } from '.';

const confirmedShows = shows.filter((show) => show.status === ShowStatus.CONFIRMED).sort((a, b) => a.date.localeCompare(b.date));
const longArtistShow = { ...confirmedShows[0], artist: 'Moor Mother with Special Guests and Ensemble' };

const meta: Meta<typeof DashboardHero> = {
  title: 'Pyxis App/Components/Organisms/Dashboard/DashboardHero',
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

export const WithCallbacks: Story = {
  args: {
    onViewDiscord: (show) => console.log('view discord', show.id),
    onEditShow: (show) => console.log('edit show', show.id),
  },
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};

export const LongArtistName: Story = {
  args: { show: longArtistShow },
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};

export const NoNextShow: Story = {
  args: { show: undefined },
  render: (args) => <div style={{ width: 1014, padding: 24, background: 'var(--app-canvas)' }}><DashboardHero {...args} /></div>,
};
