import type { Meta, StoryObj } from '@storybook/react';
import { TicketStub } from './TicketStub';
const meta: Meta<typeof TicketStub> = { title: 'Public/TicketStub', component: TicketStub, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof TicketStub>;
export const Default: Story = { args: {} };
