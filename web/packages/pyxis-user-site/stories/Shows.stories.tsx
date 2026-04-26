import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { Shows } from '../src/pages/Shows';
import { seedShows } from 'pyxis-components/mocks/handlers';

const meta: Meta<typeof Shows> = {
  title: 'Pages/Shows',
  component: Shows,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Shows>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows', () => {
          return HttpResponse.json({ shows: seedShows });
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows', () => {
          return HttpResponse.json({ shows: [] });
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows', () => {
          return HttpResponse.json(
            { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Public shows are temporarily unavailable.' } },
            { status: 503 }
          );
        }),
      ],
    },
  },
};
