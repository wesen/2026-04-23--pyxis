import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { AttendancePage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Attendance',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<AttendancePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const EditAttendanceMutation: Story = {
  render: () => renderWithFreshMockState(<AttendancePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const draw = (await canvas.findAllByLabelText(/draw for/i))[0];
    await userEvent.clear(draw);
    await userEvent.type(draw, '123');
    const notes = (await canvas.findAllByLabelText(/notes for/i))[0];
    await userEvent.clear(notes);
    await userEvent.type(notes, 'Storybook attendance note.');
    await userEvent.click((await canvas.findAllByRole('button', { name: /save attendance/i }))[0]);
    await expect(await canvas.findByText(/Attendance updated/i)).toBeInTheDocument();
  },
};

export const IncidentRequiresNotes: Story = {
  render: () => renderWithFreshMockState(<AttendancePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click((await canvas.findAllByLabelText(/incident for/i))[0]);
    await expect(await canvas.findByText(/Incident notes are required/i)).toBeInTheDocument();
  },
};

export const SearchNoResults: Story = {
  render: () => renderWithFreshMockState(<AttendancePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(await canvas.findByLabelText(/search attendance/i), 'zz-no-log');
    await expect(await canvas.findByText(/No attendance entries match/i)).toBeInTheDocument();
  },
};

