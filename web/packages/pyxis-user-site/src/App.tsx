import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { NotFound } from './pages';
import { store } from './store';

// Lazy-loaded pages — each route is a separate JS chunk
const Shows       = lazy(() => import('./pages/ShowsPage').then(m => ({ default: m.Shows })));
const ShowDetail  = lazy(() => import('./pages/ShowDetailPage').then(m => ({ default: m.ShowDetail })));
const Archive     = lazy(() => import('./pages/ArchivePage').then(m => ({ default: m.Archive })));
const ArchiveRecap = lazy(() => import('./pages/ArchivePage').then(m => ({ default: m.ArchiveRecap })));
const Book        = lazy(() => import('./pages/BookPage').then(m => ({ default: m.Book })));
const BookSuccess = lazy(() => import('./pages/BookSuccessPage').then(m => ({ default: m.BookSuccess })));
const About       = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.About })));

export function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader />}><Shows /></Suspense>
                }
              />
              <Route
                path="shows"
                element={
                  <Suspense fallback={<PageLoader />}><Shows /></Suspense>
                }
              />
              <Route
                path="shows/:id"
                element={
                  <Suspense fallback={<PageLoader />}><ShowDetail /></Suspense>
                }
              />
              <Route
                path="archive"
                element={
                  <Suspense fallback={<PageLoader />}><Archive /></Suspense>
                }
              />
              <Route
                path="archive/:id"
                element={
                  <Suspense fallback={<PageLoader />}><ArchiveRecap /></Suspense>
                }
              />
              <Route
                path="book"
                element={
                  <Suspense fallback={<PageLoader />}><Book /></Suspense>
                }
              />
              <Route
                path="book/success"
                element={
                  <Suspense fallback={<PageLoader />}><BookSuccess /></Suspense>
                }
              />
              <Route
                path="about"
                element={
                  <Suspense fallback={<PageLoader />}><About /></Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

/** Shown while a page chunk is loading */
function PageLoader() {
  return (
    <div
      aria-label="Loading page…"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        color: 'var(--color-text-tertiary)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        gap: 8,
      }}
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      Loading…
    </div>
  );
}
