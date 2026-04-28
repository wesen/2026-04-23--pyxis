import { Panel } from '../../Panels';
import './BookingsInsightsPanel.css';

export type BookingsInsightsPanelProps = {
  weeklySubmissions?: number[];
  responseSummary?: string;
  templates?: string[];
  onSelectTemplate?: (template: string) => void;
};

const defaultWeeklySubmissions = [2,4,1,3,5,2,6,3,4,7,5,3];
const defaultTemplates = ['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info'];

export function BookingsInsightsPanel({ weeklySubmissions = defaultWeeklySubmissions, responseSummary = 'Submissions, last 12 weeks · avg response 2.1 days.', templates = defaultTemplates, onSelectTemplate }: BookingsInsightsPanelProps) {
  const hottest = weeklySubmissions.reduce((maxIndex, value, index) => value > weeklySubmissions[maxIndex] ? index : maxIndex, 0);
  return (
    <aside className="app-bookings-side" data-section="bookings-insights">
      <Panel title="Inbox rhythm">
        <div className="app-mini-bars">{weeklySubmissions.map((value,index)=><span key={index} style={{ height: `${value*10}px` }} data-hot={index===hottest}/>)}</div>
        <p className="app-muted-copy">{responseSummary}</p>
      </Panel>
      <Panel title="Decline templates">
        <div className="app-template-list">{templates.map((template)=><button key={template} type="button" onClick={() => onSelectTemplate?.(template)}>{template} ›</button>)}</div>
      </Panel>
    </aside>
  );
}
