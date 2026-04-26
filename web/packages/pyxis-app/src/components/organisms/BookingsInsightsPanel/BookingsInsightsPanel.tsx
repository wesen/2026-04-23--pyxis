import { Panel } from '../Panels';
import './BookingsInsightsPanel.css';

export function BookingsInsightsPanel() {
  return (
    <aside className="app-bookings-side" data-section="bookings-insights">
      <Panel title="Inbox rhythm">
        <div className="app-mini-bars">{[2,4,1,3,5,2,6,3,4,7,5,3].map((v,i)=><span key={i} style={{ height: `${v*10}px` }} data-hot={i===9}/>)}</div>
        <p className="app-muted-copy">Submissions, last 12 weeks · avg response 2.1 days.</p>
      </Panel>
      <Panel title="Decline templates">
        <div className="app-template-list">{['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info'].map((template)=><button key={template}>{template} ›</button>)}</div>
      </Panel>
    </aside>
  );
}
