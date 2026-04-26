import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ShowDetail } from '../src/pages/ShowDetail';
import { seedShows } from 'pyxis-components/mocks/handlers';

const show42 = seedShows[0]; // Burial Hex

const meta: Meta<typeof ShowDetailRoute> = { title: 'Pages/ShowDetail', component: ShowDetailRoute };
export default meta;

type Story = StoryObj<typeof ShowDetailRoute>;

type ShowDetailRouteProps = {
  route: string;
};

function ShowDetailRoute({ route }: ShowDetailRouteProps) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/shows/:id" element={<ShowDetail />} />
        <Route path="/" element={<ShowDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

export const Default: Story = {
  args: { route: '/shows/42' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows/42', () => {
          return HttpResponse.json(show42);
        }),
      ],
    },
  },
};

export const Loading: Story = {
  args: { route: '/shows/42' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows/42', async () => {
          await delay('infinite');
          return HttpResponse.json(show42);
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  args: { route: '/shows/999' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/public/shows/999', () => {
          return HttpResponse.json(
            { error: { code: 'NOT_FOUND', message: 'Show not found' } },
            { status: 404 }
          );
        }),
      ],
    },
  },
};
