import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { publicDesktopArgs, publicMobileArgs, publicPageParameters, prototypeArchiveShows, renderPublicPageRoute } from '../storybook';
import { ArchivePageView } from './Page';

const meta: Meta = {
  title: 'Public Site/Pages/Archive',
  parameters: publicPageParameters,
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderPublicPageRoute({ ...publicDesktopArgs, route: '/archive', storyName: 'archive-desktop' }),
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const FromProps: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState('All');
    const shows = search
      ? prototypeArchiveShows.filter((show) => `${show.artist} ${show.genre}`.toLowerCase().includes(search.toLowerCase()))
      : prototypeArchiveShows;

    return (
      <div data-story="pyxis-public-page" data-story-name="archive-from-props" style={{ width: publicDesktopArgs.width, minHeight: publicDesktopArgs.minHeight, background: '#fff' }}>
        <ArchivePageView
          shows={shows}
          search={search}
          selectedYear={selectedYear}
          onSearchChange={setSearch}
          onYearChange={setSelectedYear}
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const Mobile: Story = {
  render: () => renderPublicPageRoute({ ...publicMobileArgs, route: '/archive', storyName: 'archive-mobile' }),
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};
