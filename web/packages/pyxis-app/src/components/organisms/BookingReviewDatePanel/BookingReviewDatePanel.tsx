import { Panel } from '../Panels';
import './BookingReviewDatePanel.css';

export type BookingReviewDatePanelProps = {
  statusLabel?: string;
  detail?: string;
};

export function BookingReviewDatePanel({ statusLabel = '✓ Date is available', detail = 'Jun 14 is an open night. Nearest show: Zola Jesus on Jun 6.' }: BookingReviewDatePanelProps) {
  return (
    <Panel title="Date check" section="booking-review-date">
      <p className="app-success-note">{statusLabel}</p>
      <p className="app-muted-copy">{detail}</p>
    </Panel>
  );
}
