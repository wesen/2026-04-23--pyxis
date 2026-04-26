import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { Archive } from '../src/pages/Archive';
import { seedArchive, seedStats } from 'pyxis-components/mocks/handlers';

const meta: Meta<typeof Archive> = { title: 'Pages/Archive', component: Archive };
export default meta;

type Story = StoryObj<typeof Archive>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/archive', () => {
          return HttpResponse.json({ shows: seedArchive });
        }),
        http.get('*/api/public/archive/stats', () => {
          return HttpResponse.json(seedStats);
        }),
      ],
    },
  },
};

export const WithSearch: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/archive', ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search')?.toLowerCase() ?? '';
          return HttpResponse.json({
            shows: seedArchive.filter((show) => show.artist.toLowerCase().includes(search)),
          });
        }),
        http.get('*/api/public/archive/stats', () => {
          return HttpResponse.json(seedStats);
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/archive', () => {
          return HttpResponse.json({ shows: [] });
        }),
        http.get('*/api/public/archive/stats', () => {
          return HttpResponse.json({
            totalShows: 0,
            totalAttendance: 0,
            yearsRunning: 0,
            uniqueArtists: 0,
          });
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/archive', () => {
          return HttpResponse.json(
            { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Archive search is temporarily unavailable.' } },
            { status: 503 }
          );
        }),
        http.get('*/api/public/archive/stats', () => {
          return HttpResponse.json(seedStats);
        }),
      ],
    },
  },
};

export const StatsError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/archive', () => {
          return HttpResponse.json({ shows: seedArchive });
        }),
        http.get('*/api/public/archive/stats', () => {
          return HttpResponse.json(
            { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Archive stats are temporarily unavailable.' } },
            { status: 503 }
          );
        }),
      ],
    },
  },
};
