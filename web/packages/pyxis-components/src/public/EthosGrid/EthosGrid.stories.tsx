import type { Meta, StoryObj } from '@storybook/react';
import { EthosGrid } from './EthosGrid';
const meta: Meta<typeof EthosGrid> = { title: 'Public/Organisms/EthosGrid', component: EthosGrid, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EthosGrid>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><EthosGrid {...args} /></div> };
