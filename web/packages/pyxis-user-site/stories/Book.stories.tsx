import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { Book } from '../src/pages/Book';

const meta: Meta<typeof Book> = {
  title: 'Pages/Book',
  component: Book,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/book']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Book>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/public/submissions', () => {
          return HttpResponse.json({ success: true, submissionId: 42 });
        }),
      ],
    },
  },
};

export const Submitting: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/public/submissions', async () => {
          await delay('infinite');
          return HttpResponse.json({ success: true, submissionId: 42 });
        }),
      ],
    },
  },
};

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/public/submissions', () => {
          return HttpResponse.json({ success: true, submissionId: 42 });
        }),
      ],
    },
  },
};

export const ValidationError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/public/submissions', () => {
          return HttpResponse.json(
            {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'artistName and links are required',
              },
            },
            { status: 422 }
          );
        }),
      ],
    },
  },
};
