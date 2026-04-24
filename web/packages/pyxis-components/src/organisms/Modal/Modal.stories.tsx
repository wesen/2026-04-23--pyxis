import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: () => undefined,
    title: 'Confirm booking',
    subtitle: 'Send this show to the public calendar.',
    children: <Input label="Internal note" placeholder="Optional note" />,
    footer: <><Button variant="outline">Cancel</Button><Button>Confirm</Button></>,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    width: 'lg',
    title: 'Edit settlement',
    children: <div style={{ display: 'grid', gap: 12 }}><Input label="Guarantee" defaultValue="$400" /><Input label="Door split" defaultValue="70 / 30" /></div>,
  },
};
