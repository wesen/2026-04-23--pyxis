import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
const meta: Meta<typeof Textarea> = { title: 'Atoms/Textarea', component: Textarea, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { label: 'Message', placeholder: 'Write your message…' } };
export const WithError: Story = { args: { label: 'Message', defaultValue: 'Too short', error: 'Must be at least 20 characters.' } };
export const Playground: Story = { args: { label: 'Textarea', rows: 4 } };
