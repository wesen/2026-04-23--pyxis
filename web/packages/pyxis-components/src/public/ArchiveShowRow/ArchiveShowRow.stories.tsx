import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveShowRow } from './ArchiveShowRow';
const meta: Meta<typeof ArchiveShowRow> = { title: 'Public/Molecules/ArchiveShowRow', component: ArchiveShowRow, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ArchiveShowRow>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ArchiveShowRow {...args} /></div> };
