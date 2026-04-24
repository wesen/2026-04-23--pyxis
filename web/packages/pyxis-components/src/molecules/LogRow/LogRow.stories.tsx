import type { Meta, StoryObj } from '@storybook/react';
import { LogRow } from './LogRow';
import { StoryFrame } from '../../storybook';

const meta: Meta<typeof LogRow> = {
  title: 'Molecules/LogRow',
  component: LogRow,
  tags: ['autodocs'],
  args: {
    artist: 'Luna Mesa',
    role: 'headline',
    startTime: '21:30',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Lineup: Story = {
  render: () => (
    <StoryFrame id="molecules-log-row-lineup" component="log-row" level="molecule" layout="column" gap={0} style={{ width: 420 }}>
      <LogRow artist="Door" role="dj" startTime="20:00" />
      <LogRow artist="Mica and the Rooms" role="support" startTime="21:00" />
      <LogRow artist="Luna Mesa" role="headline" startTime="22:00" />
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};
