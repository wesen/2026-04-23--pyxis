import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './MetadataStrip.css';

export type MetadataTone = 'default' | 'muted' | 'warning' | 'danger' | 'success';
export type MetadataItem = { label: string; value: ReactNode; tone?: MetadataTone };

export type MetadataStripProps = {
  items: MetadataItem[];
  density?: 'compact' | 'comfortable';
  separator?: 'dot' | 'line' | 'none';
};

export function MetadataStrip({ items, density = 'compact', separator = 'dot' }: MetadataStripProps) {
  return <dl className="app-metadata-strip" data-density={density} data-separator={separator} {...appPart('metadata-strip')}>{items.map((item) => <div className="app-metadata-strip__item" data-tone={item.tone ?? 'default'} key={item.label} {...appPart('metadata-strip', 'item')}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
}
