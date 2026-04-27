import type { Meta, StoryObj } from '@storybook/react';
import { publicDesktopArgs, publicMobileArgs, publicPageParameters, renderPublicPageRoute } from '../storybook';

const meta: Meta = {
  title: 'Public Site/Pages/Show Detail',
  parameters: publicPageParameters,
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderPublicPageRoute({ ...publicDesktopArgs, route: '/shows/1', storyName: 'show-detail-desktop' }),
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};

export const Mobile: Story = {
  render: () => renderPublicPageRoute({ ...publicMobileArgs, route: '/shows/1', storyName: 'show-detail-mobile' }),
  parameters: { viewport: { defaultViewport: 'pyxisMobile' } },
};
