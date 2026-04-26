import './DashboardMobileHeader.css';

export type DashboardMobileHeaderProps = {
  dateLabel?: string;
  initials?: string;
};

export function DashboardMobileHeader({ dateLabel = 'Wed, Apr 23', initials = 'AD' }: DashboardMobileHeaderProps) {
  return (
    <header className="app-dashboard-mobile-header" data-section="dashboard-mobile-header">
      <div><b>pyxis</b><span>{dateLabel}</span></div>
      <div className="app-dashboard-mobile-actions"><span>⌕</span><strong>{initials}</strong></div>
    </header>
  );
}
