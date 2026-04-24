import type { Meta, StoryObj } from '@storybook/react';
import { SafetyNote } from './SafetyNote';
const meta: Meta<typeof SafetyNote> = { title: 'Public/Molecules/SafetyNote', component: SafetyNote, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SafetyNote>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><SafetyNote {...args} /></div> };
