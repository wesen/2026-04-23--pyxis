import './DashboardMobileCopy.css';

export type DashboardMobileCopyProps = {
  eyebrow?: string;
  title?: string;
  summary?: string;
};

export function DashboardMobileCopy({ eyebrow = 'Welcome back', title = 'Good morning, Ada.', summary = '6 shows booked · 3 need your eye.' }: DashboardMobileCopyProps) {
  return <div className="app-dashboard-mobile-copy"><span>{eyebrow}</span><h2>{title}</h2><p>{summary}</p></div>;
}
