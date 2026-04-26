import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { http, HttpResponse, delay } from 'msw';
import { create, toJson, SubmissionListSchema } from 'pyxis-types';
import { BookingsPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Bookings',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Loading: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/bookings', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const Error: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/bookings', () =>
          HttpResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Story-level bookings failure' } }, { status: 500 })
        ),
      ],
    },
  },
};

export const Empty: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: {
    viewport: { defaultViewport: 'pyxisAppDesktop' },
    msw: {
      handlers: [
        http.get('*/api/app/bookings', () =>
          HttpResponse.json(toJson(SubmissionListSchema, create(SubmissionListSchema, { submissions: [] })))
        ),
      ],
    },
  },
};

export const ApproveMutation: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Awaiting review · 3')).toBeInTheDocument();
    await userEvent.click((await canvas.findAllByRole('button', { name: /approve/i }))[0]);
    await expect(await canvas.findByText('Awaiting review · 2')).toBeInTheDocument();
  },
};

export const DeclineMutation: Story = {
  render: () => renderWithFreshMockState(<BookingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Awaiting review · 3')).toBeInTheDocument();
    await userEvent.click((await canvas.findAllByRole('button', { name: /decline/i }))[0]);
    await expect(await canvas.findByText('Awaiting review · 2')).toBeInTheDocument();
  },
};
