import type { Meta, StoryObj } from '@storybook/react';
import { BookingsInsightsPanel } from './BookingsInsightsPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/Bookings/BookingsInsightsPanel',
  component: BookingsInsightsPanel,
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof BookingsInsightsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsightsPanel: Story = {
  render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><BookingsInsightsPanel {...args}/></div>,
};

export const QuietInbox: Story = {
  args: {
    weeklySubmissions: [0,1,0,1,2,0,1,0,1,1,0,1],
    responseSummary: 'Submissions, last 12 weeks · avg response 8 hours.',
  },
  render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><BookingsInsightsPanel {...args}/></div>,
};

export const ManyTemplates: Story = {
  args: {
    templates: ['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info','Try the all-ages matinee slot','Send live video first'],
  },
  render: (args) => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><BookingsInsightsPanel {...args}/></div>,
};
