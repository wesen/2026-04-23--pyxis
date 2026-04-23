import type { Meta, StoryObj } from '@storybook/react';
import { PubFooter } from './PubFooter';
const meta: Meta<typeof PubFooter> = { title: 'Public/PubFooter', component: PubFooter, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PubFooter>;
export const Default: Story = { args: {} };
