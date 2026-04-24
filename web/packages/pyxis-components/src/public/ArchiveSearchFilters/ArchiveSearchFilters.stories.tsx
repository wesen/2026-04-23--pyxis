import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveSearchFilters } from './ArchiveSearchFilters';
const meta: Meta<typeof ArchiveSearchFilters> = { title: 'Public/Molecules/ArchiveSearchFilters', component: ArchiveSearchFilters, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ArchiveSearchFilters>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ArchiveSearchFilters {...args} /></div> };
