import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { DashboardUpcomingPanel } from '.';

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));

const meta: Meta<typeof DashboardUpcomingPanel> = {
  title: 'Pyxis App/Components/Organisms/DashboardUpcomingPanel',
  component: DashboardUpcomingPanel,
  parameters: { layout: 'fullscreen' },
  args: { shows: confirmedShows },
};

export default meta;
type Story = StoryObj<typeof DashboardUpcomingPanel>;

export const Desktop: Story = {
  render: (args) => <div style={{ width: 690, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel {...args} /></div>,
};

export const WithCallback: Story = {
  args: { onViewAll: () => console.log('view all shows') },
  render: (args) => <div style={{ width: 690, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel {...args} /></div>,
};

export const MobileCards: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardUpcomingPanel {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Empty: Story = {
  args: { shows: [] },
  render: (args) => <div style={{ width: 690, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel {...args} /></div>,
};

export const LongArtistNames: Story = {
  args: { shows: confirmedShows.map((show, index) => index === 1 ? { ...show, artist: 'Moor Mother with Special Guests and Ensemble' } : show) },
  render: (args) => <div style={{ width: 690, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel {...args} /></div>,
};
