import type { Meta, StoryObj } from '@storybook/react';
import { NewShowModal } from './NewShowModal';

const meta = {
  title: 'Pyxis App/Components/Organisms/NewShowModal',
  component: NewShowModal,
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof NewShowModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCallbacks: Story = {
  args: {
    onCancel: () => console.log('cancel new show'),
    onSubmit: () => console.log('submit new show'),
  },
};

export const EditMode: Story = {
  args: {
    mode: 'edit',
  },
};
