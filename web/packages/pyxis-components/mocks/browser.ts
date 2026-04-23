// MSW (Mock Service Worker) setup for Storybook + Vite.
// Run `pnpm msw init` to install the service worker into public/.

import { setupWorker, type SetupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker: SetupWorker = setupWorker(...handlers);
