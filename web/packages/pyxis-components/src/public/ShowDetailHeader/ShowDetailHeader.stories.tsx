import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetailHeader } from './ShowDetailHeader';
const meta: Meta<typeof ShowDetailHeader> = { title: 'Public/Molecules/ShowDetailHeader', component: ShowDetailHeader, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ShowDetailHeader>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ShowDetailHeader {...args} /></div> };
