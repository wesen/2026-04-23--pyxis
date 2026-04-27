import type { Meta, StoryObj } from '@storybook/react';
import { publicDesktopArgs, publicMobileArgs, publicPageParameters, renderPublicPageRoute } from '../storybook';

const meta: Meta = {
  title: 'Public Site/Pages/About',
  parameters: publicPageParameters,
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderPublicPageRoute({ ...publicDesktopArgs, route: '/about', storyName: 'about-desktop' }),
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const Mobile: Story = {
  render: () => renderPublicPageRoute({ ...publicMobileArgs, route: '/about', storyName: 'about-mobile' }),
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};
