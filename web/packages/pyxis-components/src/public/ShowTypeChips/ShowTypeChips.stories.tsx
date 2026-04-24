import type { Meta, StoryObj } from '@storybook/react';
import { ShowTypeChips } from './ShowTypeChips';
const meta: Meta<typeof ShowTypeChips> = { title: 'Public/Molecules/ShowTypeChips', component: ShowTypeChips, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ShowTypeChips>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ShowTypeChips {...args} /></div> };
