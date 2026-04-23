import type { Meta, StoryObj } from '@storybook/react';
import { PubShowRow } from './PubShowRow';
const meta: Meta<typeof PubShowRow> = { title: 'Public/PubShowRow', component: PubShowRow, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PubShowRow>;
export const Default: Story = { args: {} };
