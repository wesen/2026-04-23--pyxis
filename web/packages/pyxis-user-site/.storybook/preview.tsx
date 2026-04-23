import type { Preview } from '@storybook/react';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { seedArchive, seedShows, seedStats } from 'pyxis-components/mocks/handlers';
import '../src/styles/global.css';
import '../../pyxis-components/src/tokens/tokens.css';
import '../../pyxis-components/src/atoms/Button/Button.css';
import '../../pyxis-components/src/atoms/Icon/Icon.css';
import '../../pyxis-components/src/atoms/Input/Input.css';
import '../../pyxis-components/src/atoms/Select/Select.css';
import '../../pyxis-components/src/public/PubNav/PubNav.css';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: Infinity,
            gcTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      });
      queryClient.setQueryData(['shows', 'upcoming'], seedShows);
      for (const show of seedShows) queryClient.setQueryData(['shows', show.id], show);
      queryClient.setQueryData(['archive', undefined], seedArchive);
      queryClient.setQueryData(['archive', 'stats'], seedStats);

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#F3F1EB' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'ink', value: '#1A1A18' },
      ],
    },
    viewport: {
      viewports: {
        pyxisDesktop: {
          name: 'Pyxis desktop comparison viewport',
          styles: { width: '1200px', height: '1400px' },
        },
        pyxisMobile: {
          name: 'Pyxis mobile comparison viewport',
          styles: { width: '390px', height: '844px' },
        },
      },
    },
  },
};

export default preview;
