export type DashboardAttentionTone = 'warning' | 'info' | 'danger';

export type DashboardAttentionItem = {
  tone: DashboardAttentionTone;
  title: string;
  caption: string;
};

export const defaultDashboardAttentionItems: DashboardAttentionItem[] = [
  { tone: 'warning', title: '2 past shows need logging', caption: 'Planning for Burial · Actress' },
  { tone: 'info', title: 'Zola Jesus · Jun 6', caption: 'Check price for a 160-draw headliner' },
  { tone: 'danger', title: 'Discord token expires in 14d', caption: 'Reconnect to keep pinning working' },
];
