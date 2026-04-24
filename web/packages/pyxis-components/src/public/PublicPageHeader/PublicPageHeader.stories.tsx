import type { Meta, StoryObj } from '@storybook/react';
import { PublicPageHeader } from './PublicPageHeader';
const meta: Meta<typeof PublicPageHeader> = { title: 'Public/Molecules/PublicPageHeader', component: PublicPageHeader, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PublicPageHeader>;
export const Default: Story = { args: { kicker: 'Providence, RI', title: 'Upcoming shows' }, render: (args) => <div style={{ width: 920 }}><PublicPageHeader {...args} /></div> };
