import type { Meta, StoryObj } from '@storybook/react';
import { AboutIntro } from './AboutIntro';
const meta: Meta<typeof AboutIntro> = { title: 'Public/Molecules/AboutIntro', component: AboutIntro, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AboutIntro>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><AboutIntro {...args} /></div> };
