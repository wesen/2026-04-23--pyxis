import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'pyxis-components';
import { ConfirmDialog } from './ConfirmDialog';

const meta = {
  title: 'Pyxis App/Components/Organisms/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    isOpen: true,
    title: 'Cancel show?',
    description: 'This marks the show as cancelled, removes it from normal operating views, and records the action in the audit log.',
    confirmLabel: 'Cancel show',
    variant: 'danger',
    onCancel: () => undefined,
    onConfirm: () => undefined,
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: 420, padding: 32 }}>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <ConfirmDialog
          isOpen={open}
          title="Cancel show?"
          description="This marks the show as cancelled, removes it from normal operating views, and records the action in the audit log."
          confirmLabel="Cancel show"
          variant="danger"
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    title: 'Archive show?',
    description: 'Archiving moves this show into the historical record. The action is currently being saved.',
    confirmLabel: 'Archive show',
    variant: 'default',
    isLoading: true,
    onCancel: () => undefined,
    onConfirm: () => undefined,
  },
};
