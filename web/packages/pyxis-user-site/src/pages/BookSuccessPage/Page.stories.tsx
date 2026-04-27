import type { Meta, StoryObj } from '@storybook/react';
import { publicDesktopArgs, publicPageParameters, renderPublicPageRoute } from '../storybook';

const meta: Meta = {
  title: 'Public Site/Pages/Book Success',
  parameters: publicPageParameters,
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderPublicPageRoute({ ...publicDesktopArgs, route: '/book/success', storyName: 'book-success-desktop' }),
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};
