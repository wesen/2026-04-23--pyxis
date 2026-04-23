import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Shows } from './pages/Shows';
import { ShowDetail } from './pages/ShowDetail';
import { Archive } from './pages/Archive';
import { Book } from './pages/Book';
import { BookSuccess } from './pages/BookSuccess';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 min
      gcTime:    1000 * 60 * 30,      // 30 min
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Shows />} />
            <Route path="shows" element={<Shows />} />
            <Route path="shows/:id" element={<ShowDetail />} />
            <Route path="archive" element={<Archive />} />
            <Route path="book" element={<Book />} />
            <Route path="book/success" element={<BookSuccess />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
