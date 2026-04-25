import type { Meta, StoryObj } from '@storybook/react';
import { BookingSuccess } from './BookingSuccess';

const meta: Meta<typeof BookingSuccess> = {
  title: 'Public/Organisms/BookingSuccess',
  component: BookingSuccess,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookingSuccess>;

export const Default: Story = {
  args: {},
};

export const WithArtist: Story = {
  args: { artistName: 'Burial Hex' },
};

export const Narrow: Story = {
  args: { artistName: 'A Very Long Project Name' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <BookingSuccess {...args} />
    </div>
  ),
};
