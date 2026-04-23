import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A small label for categories, genres, or keywords.

\`\`\`tsx
<Tag>Darkwave</Tag>
<Tag color="var(--color-accent)">Featured</Tag>
\`\`\`
        `,
      },
    },
  },
  args: {
    children: 'Tag',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GenreTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      <Tag>Darkwave</Tag>
      <Tag>Noise</Tag>
      <Tag>Techno</Tag>
      <Tag>Ambient</Tag>
      <Tag>EBM</Tag>
      <Tag>Industrial</Tag>
      <Tag>Experimental</Tag>
      <Tag>Art Pop</Tag>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const ColoredTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      <Tag color="var(--color-accent)">Featured</Tag>
      <Tag color="var(--color-success)">Sold out</Tag>
      <Tag color="var(--color-warning)">Selling fast</Tag>
      <Tag color="var(--color-info)">All ages</Tag>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: { children: 'Tag' },
};
