import { Panel } from '../Panels';
import './BookingReviewDatePanel.css';

export function BookingReviewDatePanel() {
  return (
    <Panel title="Date check" section="booking-review-date">
      <p className="app-success-note">✓ Date is available</p>
      <p className="app-muted-copy">Jun 14 is an open night. Nearest show: Zola Jesus on Jun 6.</p>
    </Panel>
  );
}
