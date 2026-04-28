import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAuditLogQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { AuditLogPanel, Panel } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function AuditLogPage() {
  const [searchParams] = useSearchParams();
  const { data: log, isLoading, isError } = useGetAuditLogQuery();
  const [actorFilter, setActorFilter] = useState(searchParams.get('actor') ?? '');
  const [actionFilter, setActionFilter] = useState(searchParams.get('action') ?? '');
  const [entityFilter, setEntityFilter] = useState(searchParams.get('entity') ?? 'all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const entityTypes = useMemo(() => {
    const types = new Set((log ?? []).map((entry) => entry.entityType).filter(Boolean));
    return Array.from(types).sort();
  }, [log]);

  const filteredLog = useMemo(() => {
    if (!log) return [];
    const actorNeedle = actorFilter.trim().toLowerCase();
    const actionNeedle = actionFilter.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : undefined;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : undefined;
    return log.filter((entry) => {
      const created = entry.createdAt ? new Date(entry.createdAt).getTime() : 0;
      return (!actorNeedle || entry.actor.toLowerCase().includes(actorNeedle))
        && (!actionNeedle || entry.action.toLowerCase().includes(actionNeedle) || entry.metadata.toLowerCase().includes(actionNeedle))
        && (entityFilter === 'all' || entry.entityType === entityFilter)
        && (fromTime === undefined || created >= fromTime)
        && (toTime === undefined || created <= toTime);
    });
  }, [actionFilter, actorFilter, dateFrom, dateTo, entityFilter, log]);

  const clearFilters = () => { setActorFilter(''); setActionFilter(''); setEntityFilter('all'); setDateFrom(''); setDateTo(''); };

  return (
    <AppShell page="audit-log" title="Audit log" eyebrow="Home / Audit log">
      {isLoading ? <LoadingState /> : isError || !log ? <ErrorState /> : log.length === 0 ? <EmptyState label="No audit log entries returned from the backend." /> : <Panel title="Activity" section="audit-log-activity">
        <div className="app-filter-grid" data-section="audit-log-filters">
          <label><span>Actor</span><input value={actorFilter} onChange={(event) => setActorFilter(event.target.value)} placeholder="manuel, bot, system…" /></label>
          <label><span>Action</span><input value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} placeholder="created, updated, archived…" /></label>
          <label><span>Entity</span><select value={entityFilter} onChange={(event) => setEntityFilter(event.target.value)}><option value="all">All entities</option>{entityTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label><span>From</span><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label>
          <label><span>To</span><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label>
          <button className="app-filter-clear" type="button" onClick={clearFilters}>Clear filters</button>
        </div>
        <p className="app-muted-copy">Showing {filteredLog.length} of {log.length} loaded entries. Backend pagination is still capped by the current API response.</p>
        {filteredLog.length > 0 ? <AuditLogPanel log={filteredLog} /> : <EmptyState label="No audit log entries match those filters." />}
      </Panel>}
    </AppShell>
  );
}
