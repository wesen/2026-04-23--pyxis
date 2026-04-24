import type { Meta, StoryObj } from '@storybook/react';
import { ReserveTicketCard } from './ReserveTicketCard';
const meta: Meta<typeof ReserveTicketCard> = { title: 'Public/Molecules/ReserveTicketCard', component: ReserveTicketCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ReserveTicketCard>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ReserveTicketCard {...args} /></div> };
