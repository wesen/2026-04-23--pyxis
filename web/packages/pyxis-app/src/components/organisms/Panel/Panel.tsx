import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './Panel.css';

export type PanelProps = {
  title: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  section?: string;
};

export function Panel({ title, kicker, action, children, section }: PanelProps) {
  return <section className="app-panel" data-section={section} {...appPart('panel')}><header><div><h2>{title}</h2>{kicker && <span>{kicker}</span>}</div>{action}</header>{children}</section>;
}
