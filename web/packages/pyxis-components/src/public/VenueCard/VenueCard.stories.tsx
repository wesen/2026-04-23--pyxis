import type { Meta, StoryObj } from '@storybook/react';
import { VenueCard } from './VenueCard';
const meta: Meta<typeof VenueCard> = { title: 'Public/Organisms/VenueCard', component: VenueCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof VenueCard>;
export const Default: Story = { args: {} };
