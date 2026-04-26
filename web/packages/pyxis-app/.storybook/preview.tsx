import type { Preview } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { mockHandlers } from '../src/api/mockHandlers';
import { makeStore } from '../src/store';
import '../src/styles/global.css';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      const initialEntries = context.parameters.router?.initialEntries ?? ['/'];
      return (
        <Provider store={makeStore()}>
          <MemoryRouter initialEntries={initialEntries}>
            <Story />
          </MemoryRouter>
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: mockHandlers },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#F3F1EB' },
        { name: 'mobile', value: '#E8E4DA' },
        { name: 'ink', value: '#1F1E1C' },
      ],
    },
    viewport: {
      viewports: {
        pyxisAppDesktop: { name: 'Pyxis app desktop', styles: { width: '1240px', height: '900px' } },
        pyxisAppMobile: { name: 'Pyxis app mobile', styles: { width: '390px', height: '844px' } },
      },
    },
  },
};

export default preview;
