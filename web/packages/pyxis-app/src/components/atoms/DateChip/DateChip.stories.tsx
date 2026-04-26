import type { Meta, StoryObj } from '@storybook/react';
import { DateChip } from './DateChip';
const meta: Meta = { title: 'Pyxis App/Components/Atoms/DateChip' };
export default meta;
type Story = StoryObj;
export const DateChipDefault: Story = { render: () => <div style={{ padding: 24 }}><DateChip date="2025-05-02"/></div> };
