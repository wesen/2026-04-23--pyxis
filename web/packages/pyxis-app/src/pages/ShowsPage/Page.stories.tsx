import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';
import { create, toJson, ShowListSchema } from 'pyxis-types';
import { ShowsPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Shows',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Loading: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/shows', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const Error: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/shows', () =>
          HttpResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Story-level shows failure' } }, { status: 500 })
        ),
      ],
    },
  },
};

export const Empty: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/shows', () =>
          HttpResponse.json(toJson(ShowListSchema, create(ShowListSchema, { shows: [] })))
        ),
      ],
    },
  },
};
