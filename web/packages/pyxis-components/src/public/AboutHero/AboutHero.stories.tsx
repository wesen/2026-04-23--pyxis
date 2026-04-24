import type { Meta, StoryObj } from '@storybook/react';
import { AboutHero } from './AboutHero';
const meta: Meta<typeof AboutHero> = { title: 'Public/Organisms/AboutHero', component: AboutHero, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AboutHero>;
export const Default: Story = { args: {} };
