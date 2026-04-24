import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    {
      name: 'msw-storybook-addon',
      options: {
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // No staticDirs — pyxis-components ships no standalone static assets.
  // Tokens are imported as CSS; icons are inline SVG.
};

export default config;
