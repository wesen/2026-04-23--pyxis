import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { create, ShowListSchema, ShowSchema, ShowStatus, toJson } from 'pyxis-types';
import { handlers } from 'pyxis-components/mocks/handlers';
import { Layout } from '../src/components/layout/Layout';
import { Shows } from '../src/pages/Shows';
import { ShowDetail } from '../src/pages/ShowDetail';
import { Archive } from '../src/pages/Archive';
import { Book } from '../src/pages/Book';
import { BookSuccess } from '../src/pages/BookSuccess';
import { About } from '../src/pages/About';
import { makeStore } from '../src/store';

const prototypeShows = [
  create(ShowSchema, {
    id: 1,
    artist: 'Redroom Inferno',
    date: 'Fri, Feb 14',
    doorsTime: '9:00 PM',
    age: '25+',
    price: '$10 adv / $15 door',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 2,
    artist: '808 Collective',
    date: 'Fri, Feb 21',
    doorsTime: '8:00 PM',
    age: '21+',
    price: '$12',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 3,
    artist: 'Petals of Love',
    date: 'Sat, Feb 28',
    doorsTime: '6:30 PM',
    age: 'All Ages',
    price: '$15',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 4,
    artist: 'Monday Meet-Ups',
    date: 'Every Monday',
    doorsTime: '7:00 PM',
    age: 'All Ages',
    price: 'Free — Sliding Scale',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 5,
    artist: 'Basement Frequencies',
    date: 'Fri, Feb 28',
    doorsTime: '9:30 PM',
    age: '21+',
    price: '$12',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 6,
    artist: 'Orphx',
    date: 'Fri, Jul 4',
    doorsTime: '9:00 PM',
    age: '18+',
    price: '$12',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 7,
    artist: 'Moor Mother',
    date: 'Fri, May 9',
    doorsTime: '7:00 PM',
    age: 'All Ages',
    price: '$15',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 8,
    artist: 'Cygnus + Guests',
    date: 'Sat, May 17',
    doorsTime: '9:00 PM',
    age: '18+',
    price: '$8',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, {
    id: 9,
    artist: 'Zola Jesus',
    date: 'Fri, Jun 6',
    doorsTime: '8:00 PM',
    age: '21+',
    price: '$20',
    genre: '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
];

const prototypePublicHandlers = [
  http.get('*/api/public/shows', () => HttpResponse.json(toJson(ShowListSchema, create(ShowListSchema, { shows: prototypeShows })))),
  http.get('*/api/public/shows/:id', ({ params }) => {
    const id = Number(params.id);
    const show = prototypeShows.find((candidate) => candidate.id === id) ?? prototypeShows[0];
    return HttpResponse.json(toJson(ShowSchema, show));
  }),
];

const meta: Meta<typeof PublicPageRoute> = {
  title: 'Public Site/Pages',
  component: PublicPageRoute,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: [...prototypePublicHandlers, ...handlers] },
  },
};

export default meta;
type Story = StoryObj<typeof PublicPageRoute>;

type PublicPageRouteProps = {
  route: string;
  storyName: string;
  width: number;
  minHeight: number;
};

function PublicPageRoute({ route, storyName, width, minHeight }: PublicPageRouteProps) {
  const store = makeStore();

  return (
    <div
      data-story="pyxis-public-page"
      data-story-name={storyName}
      style={{
        minHeight,
        width: '100%',
        background: 'var(--color-canvas)',
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <div data-story-frame="pyxis-page-shell" style={{ width, background: '#fff', minHeight }}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Shows />} />
                <Route path="shows" element={<Shows />} />
                <Route path="shows/:id" element={<ShowDetail />} />
                <Route path="archive" element={<Archive />} />
                <Route path="book" element={<Book />} />
                <Route path="book/success" element={<BookSuccess />} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      </div>
    </div>
  );
}

const desktopArgs = { width: 920, minHeight: 1100 };
const mobileArgs = { width: 390, minHeight: 844 };

export const ShowsDesktop: Story = {
  args: { ...desktopArgs, route: '/', storyName: 'shows-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const ShowsMobile: Story = {
  args: { ...mobileArgs, route: '/', storyName: 'shows-mobile' },
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};

export const ShowDetailDesktop: Story = {
  args: { ...desktopArgs, route: '/shows/42', storyName: 'show-detail-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const ShowDetailMobile: Story = {
  args: { ...mobileArgs, route: '/shows/42', storyName: 'show-detail-mobile' },
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};

export const ArchiveDesktop: Story = {
  args: { ...desktopArgs, route: '/archive', storyName: 'archive-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const ArchiveMobile: Story = {
  args: { ...mobileArgs, route: '/archive', storyName: 'archive-mobile' },
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};

export const BookDesktop: Story = {
  args: { ...desktopArgs, route: '/book', storyName: 'book-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const BookMobile: Story = {
  args: { ...mobileArgs, route: '/book', storyName: 'book-mobile' },
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};

export const BookSuccessDesktop: Story = {
  args: { ...desktopArgs, route: '/book/success', storyName: 'book-success-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const AboutDesktop: Story = {
  args: { ...desktopArgs, route: '/about', storyName: 'about-desktop' },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const AboutMobile: Story = {
  args: { ...mobileArgs, route: '/about', storyName: 'about-mobile' },
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};
