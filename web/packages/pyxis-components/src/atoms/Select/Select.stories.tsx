import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
const meta: Meta<typeof Select> = { title: 'Atoms/Select', component: Select, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Select>;
export const Default: Story = {
  args: {
    label: 'Genre',
    placeholder: 'Select a genre…',
    options: [
      { value: 'darkwave', label: 'Darkwave' },
      { value: 'noise', label: 'Noise' },
      { value: 'techno', label: 'Techno' },
      { value: 'ambient', label: 'Ambient' },
      { value: 'ebm', label: 'EBM' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'experimental', label: 'Experimental' },
    ],
  },
};
export const Playground: Story = { args: { label: 'Select', options: [{ value: 'a', label: 'A' }] } };
