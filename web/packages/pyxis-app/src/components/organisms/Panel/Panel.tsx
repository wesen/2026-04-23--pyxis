import type React from 'react';
import { appPart } from '../../parts';
import './Panel.css';

export function Panel({ title, kicker, action, children, section }: { title: string; kicker?: string; action?: React.ReactNode; children: React.ReactNode; section?: string }) {
  return <section className="app-panel" data-section={section} {...appPart('panel')}><header><div><h2>{title}</h2>{kicker && <span>{kicker}</span>}</div>{action}</header>{children}</section>;
}
