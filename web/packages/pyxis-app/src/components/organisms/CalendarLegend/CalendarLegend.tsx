import './CalendarLegend.css';

export type CalendarLegendItem = {
  label: string;
  status: string;
};

export type CalendarLegendProps = {
  items?: CalendarLegendItem[];
};

const defaultItems: CalendarLegendItem[] = [
  { label: 'Confirmed', status: 'confirmed' },
  { label: 'Hold', status: 'hold' },
  { label: 'Blocked', status: 'blocked' },
];

export function CalendarLegend({ items = defaultItems }: CalendarLegendProps) {
  return <div className="app-calendar-legend">{items.map(({ label, status }) => <span key={status} data-status={status}><i/>{label}</span>)}</div>;
}
