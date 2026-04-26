import './CalendarLegend.css';

export function CalendarLegend() {
  return <div className="app-calendar-legend">{[['Confirmed','confirmed'],['Hold','hold'],['Blocked','blocked']].map(([label, status]) => <span key={status} data-status={status}><i/>{label}</span>)}</div>;
}
