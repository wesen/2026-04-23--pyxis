import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { handlers } from 'pyxis-components/mocks/handlers';
import { Layout } from '../src/components/layout/Layout';
import { Shows } from '../src/pages/Shows';
import { ShowDetail } from '../src/pages/ShowDetail';
import { Archive } from '../src/pages/Archive';
import { Book } from '../src/pages/Book';
import { BookSuccess } from '../src/pages/BookSuccess';
import { About } from '../src/pages/About';
import { makeStore } from '../src/store';

const meta: Meta<typeof PublicPageRoute> = {
  title: 'Public Site/Pages',
  component: PublicPageRoute,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers },
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
