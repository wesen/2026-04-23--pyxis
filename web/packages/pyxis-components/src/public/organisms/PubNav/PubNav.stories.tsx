import type { Meta, StoryObj } from '@storybook/react';
import { PubNav } from './PubNav';

const meta: Meta<typeof PubNav> = {
  title: 'Public Site/Components/Organisms/PubNav',
  component: PubNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The public site navigation bar with Pyxis logo and nav links.',
      },
    },
  },
  args: {
    currentPage: 'shows',
  },
  argTypes: {
    currentPage: {
      control: 'select',
      options: ['shows', 'archive', 'book', 'about'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 'shows',
  },
};

export const ArchiveActive: Story = {
  args: {
    currentPage: 'archive',
  },
};

export const BookActive: Story = {
  args: {
    currentPage: 'book',
  },
};

export const AboutActive: Story = {
  args: {
    currentPage: 'about',
  },
};

/** Interactive — demonstrates page-change behavior */
export const Interactive: Story = {
  render: () => (
    <div style={{ minHeight: 200 }}>
      <PubNav currentPage="shows" onNavigate={(page) => alert(`Navigate to: ${page}`)} />
      <div style={{ padding: 32, color: 'var(--color-text-secondary)' }}>Try clicking the nav links</div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
