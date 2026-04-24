import type { Meta, StoryObj } from '@storybook/react';
import { FindUsBlock } from './FindUsBlock';
const meta: Meta<typeof FindUsBlock> = { title: 'Public/Molecules/FindUsBlock', component: FindUsBlock, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof FindUsBlock>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><FindUsBlock {...args} /></div> };
