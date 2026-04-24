import { pyxisPart } from '../../utils/parts';
export type ArchiveShowRowProps = { date: string; name: string; tag: string; href?: string; className?: string };
export const ArchiveShowRow = ({ date, name, tag, href = '#', className }: ArchiveShowRowProps) => (
  <a href={href} {...pyxisPart('archive-show-row')} className={className} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: 18, padding: '14px 0', textDecoration: 'none', alignItems: 'baseline', borderTop: '1px solid #EAE7E0' }}>
    <div style={{ fontSize: 12, color: '#8E887E', fontVariantNumeric: 'tabular-nums', letterSpacing: '.05em' }}>{date}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#C8270D', fontWeight: 500 }}>{name}</div>
    <div style={{ fontSize: 11.5, color: '#8E887E', fontStyle: 'italic' }}>{tag}</div>
    <div style={{ fontSize: 11.5, color: '#8E887E' }}>recap →</div>
  </a>
);
