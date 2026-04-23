import type { Meta, StoryObj } from '@storybook/react';
import { decorators, parameters } from '../.storybook/preview';

export default {
  title: 'MSW',
  decorators,
  parameters,
} satisfies Meta;

export const mswLoader = () => ({});
