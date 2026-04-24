import type { Meta, StoryObj } from '@storybook/react';
import { SpaceInfo } from './SpaceInfo';
const meta: Meta<typeof SpaceInfo> = { title: 'Public/Organisms/SpaceInfo', component: SpaceInfo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SpaceInfo>;
export const Default: Story = { args: {} };
