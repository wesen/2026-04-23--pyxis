import type { Meta, StoryObj } from '@storybook/react';
import { FieldError } from './FieldError';

const meta: Meta<typeof FieldError> = { title: 'Pyxis App/Components/Molecules/FieldError', component: FieldError };
export default meta;
type Story = StoryObj<typeof FieldError>;

export const Default: Story = { args: { children: 'Incident notes are required when Incident is checked.' } };
