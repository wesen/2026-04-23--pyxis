import type { ReactNode } from 'react';
import { Empty, type IconName } from 'pyxis-components';
import './AppEmptyState.css';

export type AppEmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
};

export function AppEmptyState({ title, description, icon = 'sparkle', action }: AppEmptyStateProps) {
  return <Empty className="app-empty-state" icon={icon} title={title} description={description} action={action} />;
}
