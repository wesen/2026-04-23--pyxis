import type { Meta, StoryObj } from '@storybook/react';
import { CollectiveList } from './CollectiveList';
const meta: Meta<typeof CollectiveList> = { title: 'Public/Molecules/CollectiveList', component: CollectiveList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof CollectiveList>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><CollectiveList {...args} /></div> };
