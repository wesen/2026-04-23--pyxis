import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetailPage } from '../Pages';
import { renderWithFreshMockState, RoutedPage } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Show Detail',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppMobile' } },
};

