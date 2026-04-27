import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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

export const CreateShowMutation: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /new show/i }));
    await userEvent.type(await canvas.findByLabelText(/artist \/ act name/i), 'Story Smoke Show');
    await userEvent.type(await canvas.findByLabelText(/^date$/i), '2026-09-03');
    await userEvent.type(await canvas.findByLabelText(/^genre$/i), 'Noise');
    await userEvent.type((await canvas.findAllByLabelText(/^artist$/i))[0], 'Story Smoke Show');
    await userEvent.click(await canvas.findByRole('button', { name: /^save show$/i }));
    await expect(await canvas.findByText(/Story Smoke Show/i)).toBeInTheDocument();
  },
};
