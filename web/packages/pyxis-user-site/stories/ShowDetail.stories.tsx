import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetail } from '../src/pages/ShowDetail';
import { seedShows } from 'pyxis-components/mocks/handlers';

const show42 = seedShows[0]; // Burial Hex

const meta: Meta = { title: 'Pages/ShowDetail', component: ShowDetail };
export default meta;

export const Default: StoryObj = {
  render: () => <ShowDetail />,
  parameters: {
    reactRouter: {
      routePath: '/shows/:id',
      routeParams: { id: '42' },
    },
    msw: {
      handlers: [
        { type: 'rest', method: 'get', url: '/api/public/shows/42', sts: 200, body: show42 },
      ],
    },
  },
};

export const Loading: StoryObj = {
  render: () => <ShowDetail />,
  parameters: {
    reactRouter: { routePath: '/shows/:id', routeParams: { id: '42' } },
    msw: {
      handlers: [
        {
          type: 'rest', method: 'get', url: '/api/public/shows/42',
          // No body = infinite loading
        },
      ],
    },
  },
};

export const NotFound: StoryObj = {
  render: () => <ShowDetail />,
  parameters: {
    reactRouter: { routePath: '/shows/:id', routeParams: { id: '999' } },
    msw: {
      handlers: [
        {
          type: 'rest', method: 'get', url: '/api/public/shows/999',
          sts: 404, body: { error: { code: 'NOT_FOUND', message: 'Show not found' } },
        },
      ],
    },
  },
};
