import type { Meta, StoryObj } from '@storybook/react';
import { publicDesktopArgs, publicMobileArgs, publicPageParameters, renderPublicPageRoute } from '../storybook';

const meta: Meta = {
  title: 'Public Site/Pages/Book',
  parameters: publicPageParameters,
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderPublicPageRoute({ ...publicDesktopArgs, route: '/book', storyName: 'book-desktop' }),
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const Mobile: Story = {
  render: () => renderPublicPageRoute({ ...publicMobileArgs, route: '/book', storyName: 'book-mobile' }),
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};
