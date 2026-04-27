import { useGetAuditLogQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { AuditLogPanel, Panel } from '../../components/organisms/Panels';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function AuditLogPage() {
  const { data: log, isLoading, isError } = useGetAuditLogQuery();

  return (
    <AppShell page="audit-log" title="Audit log" eyebrow="Home / Audit log">
      {isLoading ? <LoadingState /> : isError || !log ? <ErrorState /> : log.length === 0 ? <EmptyState label="No audit log entries returned from the backend." /> : <Panel title="Activity" section="audit-log-activity"><AuditLogPanel log={log} /></Panel>}
    </AppShell>
  );
}
