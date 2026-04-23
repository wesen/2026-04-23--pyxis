import type { Meta, StoryObj } from '@storybook/react';
import { Shows } from '../src/pages/Shows';
import { seedShows } from 'pyxis-components/mocks/handlers';

const meta: Meta = { title: 'Pages/Shows', component: Shows };
export default meta;

export const Default: StoryObj = {
  parameters: {
    msw: {
      handlers: [
        {
          type: 'rest',
          method: 'get',
          url: '/api/public/shows',
          sts: 200,
          body: seedShows,
        },
      ],
    },
  },
};

export const Empty: StoryObj = {
  parameters: {
    msw: {
      handlers: [{ type: 'rest', method: 'get', url: '/api/public/shows', sts: 200, body: [] }],
    },
  },
};
