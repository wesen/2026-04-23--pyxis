import type { Meta, StoryObj } from '@storybook/react';
import { Book } from '../src/pages/Book';

const meta: Meta = { title: 'Pages/Book', component: Book };
export default meta;

export const Default: StoryObj = {
  parameters: {
    msw: {
      handlers: [
        {
          type: 'rest', method: 'post', url: '/api/public/submissions',
          sts: 200, body: { success: true, submission_id: 42 },
        },
      ],
    },
  },
};

export const Submitting: StoryObj = {
  render: () => <Book />,
  parameters: {
    msw: {
      handlers: [
        {
          type: 'rest', method: 'post', url: '/api/public/submissions',
          // No body = infinite loading
        },
      ],
    },
  },
};

export const Success: StoryObj = {
  render: () => <Book />,
  parameters: {
    msw: {
      handlers: [
        {
          type: 'rest', method: 'post', url: '/api/public/submissions',
          sts: 200, body: { success: true, submission_id: 42 },
        },
      ],
    },
  },
};
