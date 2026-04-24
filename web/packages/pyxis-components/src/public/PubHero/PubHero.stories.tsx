import type { Meta, StoryObj } from '@storybook/react';
import { PubHero } from './PubHero';
import { seedShows } from '../../mocks/handlers';

const meta: Meta<typeof PubHero> = { title: 'Public/Organisms/PubHero', component: PubHero, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PubHero>;
export const Default: Story = { args: { show: seedShows[0] } };
