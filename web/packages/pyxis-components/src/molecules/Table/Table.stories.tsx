import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../atoms/Badge';
import { Table, type Column } from './Table';

type ShowRow = { date: string; artist: string; status: 'confirmed' | 'hold' | 'cancelled'; capacity: string };

const rows: ShowRow[] = [
  { date: 'May 03', artist: 'Luna Mesa', status: 'confirmed', capacity: '122 / 150' },
  { date: 'May 11', artist: 'Red Room DJs', status: 'hold', capacity: '88 / 150' },
  { date: 'May 18', artist: 'Zola Sings', status: 'cancelled', capacity: '—' },
];

const columns: Column<ShowRow>[] = [
  { key: 'date', label: 'Date', width: '100px' },
  { key: 'artist', label: 'Artist' },
  { key: 'status', label: 'Status', render: (row) => <Badge status={row.status === 'confirmed' ? 'confirmed' : row.status === 'hold' ? 'pending' : 'cancelled'}>{row.status}</Badge> },
  { key: 'capacity', label: 'Capacity', width: '120px' },
];

const meta: Meta<typeof Table<ShowRow>> = {
  title: 'Molecules/Table',
  component: Table<ShowRow>,
  tags: ['autodocs'],
  args: { columns, rows },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickableRows: Story = {
  args: { onRowClick: () => undefined },
};
