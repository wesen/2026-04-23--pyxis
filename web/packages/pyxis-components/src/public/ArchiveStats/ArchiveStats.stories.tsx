import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveStats } from './ArchiveStats';
import { seedStats } from '../../mocks/handlers';
const meta: Meta<typeof ArchiveStats> = { title: 'Public/Molecules/ArchiveStats', component: ArchiveStats, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ArchiveStats>;
export const Default: Story = { args: { stats: seedStats } };
