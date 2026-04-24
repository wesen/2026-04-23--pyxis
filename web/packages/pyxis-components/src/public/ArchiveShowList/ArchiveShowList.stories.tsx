import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveShowList } from './ArchiveShowList';
const meta: Meta<typeof ArchiveShowList> = { title: 'Public/Organisms/ArchiveShowList', component: ArchiveShowList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ArchiveShowList>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><ArchiveShowList {...args} /></div> };
