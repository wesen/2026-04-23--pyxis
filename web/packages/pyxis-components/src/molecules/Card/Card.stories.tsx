import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A surface container with optional header/footer slots.',
      },
    },
  },
  args: {
    padding: 'md',
    children: 'Card content',
  },
  argTypes: {
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Basic card content',
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>Upcoming shows</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>6 shows</span>
        </div>
      }
    >
      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        Show list goes here…
      </p>
    </Card>
  ),
  parameters: { controls: { disable: true } },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: 'Click me — I have a hover effect',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card padding="sm"><strong>Small</strong> padding — 16px</Card>
      <Card padding="md"><strong>Medium</strong> padding — 22px</Card>
      <Card padding="lg"><strong>Large</strong> padding — 32px</Card>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    children: 'Card content',
    padding: 'md',
    interactive: false,
  },
};
