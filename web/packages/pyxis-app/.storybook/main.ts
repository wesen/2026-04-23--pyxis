import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions', { name: 'msw-storybook-addon', options: { serviceWorker: { url: '/mockServiceWorker.js' } } }],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  staticDirs: ['../public'],
  viteFinal: async (config) => { config.resolve = config.resolve ?? {}; config.resolve.alias = { ...(Array.isArray(config.resolve.alias) ? {} : config.resolve.alias), 'pyxis-components': resolve(__dirname, '../../pyxis-components/src'), 'pyxis-types': resolve(__dirname, '../../pyxis-types/src') }; return config; },
};
export default config;
