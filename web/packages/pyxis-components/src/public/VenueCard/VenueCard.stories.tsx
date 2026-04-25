import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VenueCard } from './VenueCard';
const meta: Meta<typeof VenueCard> = { title: 'Public/Organisms/VenueCard', component: VenueCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof VenueCard>;
export const Default: Story = { args: {} };
export const Narrow: Story = { args: {}, render: (args) => <div style={{ width: 260 }}><VenueCard {...args} /></div> };
export const ThemeOverride: Story = { args: {}, render: (args) => <div style={{ '--pyxis-venue-card-bg': 'var(--color-surface-raised)', '--pyxis-venue-card-color': 'var(--color-text-primary)', '--pyxis-venue-card-body': 'var(--color-text-secondary)', width: 300 } as CSSProperties}><VenueCard {...args} /></div> };
