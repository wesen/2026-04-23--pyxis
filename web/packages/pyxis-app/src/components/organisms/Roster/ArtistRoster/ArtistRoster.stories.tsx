import type { Meta, StoryObj } from '@storybook/react';
import { artists } from '../../../../api/mockData';
import { ArtistRoster } from './ArtistRoster';

const meta = {
  title: 'Pyxis App/Components/Organisms/Roster/ArtistRoster',
  component: ArtistRoster,
  parameters: { layout: 'fullscreen' },
  args: { artists },
} satisfies Meta<typeof ArtistRoster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  render: (args) => <div style={{ width: 1018, padding: 24, background: 'var(--app-canvas)' }}><ArtistRoster {...args} /></div>,
};

export const Mobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><ArtistRoster {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Empty: Story = {
  args: { artists: [] },
  render: (args) => <div style={{ width: 1018, padding: 24, background: 'var(--app-canvas)' }}><ArtistRoster {...args} /></div>,
};

export const LongContent: Story = {
  args: { artists: artists.map((artist, index) => index === 0 ? { ...artist, name: 'A Very Long Artist Collective Name', notes: 'A long note that should still sit inside the table without breaking the roster layout.' } : artist) },
  render: (args) => <div style={{ width: 1018, padding: 24, background: 'var(--app-canvas)' }}><ArtistRoster {...args} /></div>,
};
