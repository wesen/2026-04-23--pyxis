import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard, type MetricCardTone } from './MetricCard';

const tones: MetricCardTone[] = ['neutral', 'accent', 'success', 'warning', 'info'];

const meta = {
  title: 'Pyxis App/Components/Molecules/MetricCard',
  component: MetricCard,
  args: {
    label: 'Upcoming',
    value: 6,
    caption: 'Next 60 days',
    tone: 'accent',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricCardDefault: Story = {
  render: (args) => <div style={{ width: 231 }}><MetricCard {...args} /></div>,
};

export const WithTrend: Story = {
  args: {
    label: 'Pending',
    value: 3,
    caption: 'Awaiting review',
    trend: '+2 this week',
    tone: 'warning',
  },
  render: (args) => <div style={{ width: 231 }}><MetricCard {...args} /></div>,
};

export const LongContent: Story = {
  args: {
    label: 'Discord automation',
    value: '98%',
    caption: 'Posts, pins, reminders, and archives healthy',
    trend: 'stable',
    tone: 'success',
  },
  render: (args) => <div style={{ width: 231 }}><MetricCard {...args} /></div>,
};

export const ToneGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 231px)', gap: 16, padding: 24 }}>
      {tones.map((tone, index) => (
        <MetricCard key={tone} label={tone} value={index + 1} caption="Component tone" tone={tone} />
      ))}
    </div>
  ),
};
