import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
const meta: Meta<typeof Avatar> = { title: 'Atoms/Avatar', component: Avatar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { name: 'Burial Hex' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar name="Burial Hex" size="sm" />
      <Avatar name="Moor Mother" size="md" />
      <Avatar name="Zola Jesus" size="lg" />
      <Avatar name="Orphx" size="xl" color="var(--color-accent)" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};
export const Playground: Story = { args: { name: 'Name' } };
