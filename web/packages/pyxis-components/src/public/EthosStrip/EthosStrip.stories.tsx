import type { Meta, StoryObj } from '@storybook/react';
import { EthosStrip } from './EthosStrip';
const meta: Meta<typeof EthosStrip> = { title: 'Public/Organisms/EthosStrip', component: EthosStrip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EthosStrip>;
export const Default: Story = { args: {} };
