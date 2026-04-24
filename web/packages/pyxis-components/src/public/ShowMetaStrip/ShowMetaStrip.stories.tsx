import type { Meta, StoryObj } from '@storybook/react';
import { ShowMetaStrip } from './ShowMetaStrip';
const meta: Meta<typeof ShowMetaStrip> = { title: 'Public/Molecules/ShowMetaStrip', component: ShowMetaStrip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ShowMetaStrip>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ShowMetaStrip {...args} /></div> };
