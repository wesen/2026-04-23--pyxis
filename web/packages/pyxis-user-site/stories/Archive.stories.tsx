import type { Meta, StoryObj } from '@storybook/react';
import { Archive } from '../src/pages/Archive';
import { seedArchive, seedStats } from 'pyxis-components/mocks/handlers';

const meta: Meta = { title: 'Pages/Archive', component: Archive };
export default meta;

export const Default: StoryObj = {
  parameters: {
    msw: {
      handlers: [
        { type: 'rest', method: 'get', url: '/api/public/archive', sts: 200, body: seedArchive },
        { type: 'rest', method: 'get', url: '/api/public/archive/stats', sts: 200, body: seedStats },
      ],
    },
  },
};

export const WithSearch: StoryObj = {
  parameters: {
    msw: {
      handlers: [
        {
          type: 'rest', method: 'get', url: '/api/public/archive?search=Burial',
          sts: 200,
          body: seedArchive.filter(s => s.artist.toLowerCase().includes('burial')),
        },
        { type: 'rest', method: 'get', url: '/api/public/archive/stats', sts: 200, body: seedStats },
      ],
    },
  },
};

export const Empty: StoryObj = {
  parameters: {
    msw: {
      handlers: [
        { type: 'rest', method: 'get', url: '/api/public/archive', sts: 200, body: [] },
        {
          type: 'rest', method: 'get', url: '/api/public/archive/stats',
          sts: 200,
          body: { total_shows: 0, total_attendance: 0, years_running: 0, unique_artists: 0 },
        },
      ],
    },
  },
};
