import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '24px',
          backgroundColor: 'var(--color-canvas)',
          minHeight: '100vh',
          fontFamily: 'var(--font-body)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#F3F1EB', description: 'Warm paper background' },
        { name: 'surface', value: '#FFFFFF', description: 'Card / surface' },
        { name: 'ink', value: '#1A1A18', description: 'Ink — dark background' },
        { name: 'accent', value: '#C8270D', description: 'Crimson accent' },
      ],
    },
    layout: 'padded',
    chromatic: {
      disableSnapshot: false,
    },
  },
  loaders: [],
};

export default preview;
