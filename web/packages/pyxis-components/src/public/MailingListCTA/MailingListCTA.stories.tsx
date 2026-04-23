import type { Meta, StoryObj } from '@storybook/react';
import { MailingListCTA } from './MailingListCTA';
const meta: Meta<typeof MailingListCTA> = { title: 'Public/MailingListCTA', component: MailingListCTA, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof MailingListCTA>;
export const Default: Story = { args: {} };
