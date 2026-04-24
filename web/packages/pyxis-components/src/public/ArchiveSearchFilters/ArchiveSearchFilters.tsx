import { pyxisPart } from '../../utils/parts';
export type ArchiveSearchFiltersProps = { years?: string[]; active?: string; className?: string };
export const ArchiveSearchFilters = ({ years = ['All', '2025', '2024', '2023'], active = 'All', className }: ArchiveSearchFiltersProps) => (
  <div {...pyxisPart('archive-search-filters')} className={className} style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
    <input placeholder="Search artists, dates, tags…" style={{ flex: 1, minWidth: 200, border: '1px solid #EAE7E0', background: '#fff', borderRadius: 4, padding: '9px 12px', fontFamily: 'inherit', fontSize: 13, color: '#C8270D', outline: 'none' }} />
    <div style={{ display: 'flex', gap: 6 }}>{years.map((y) => <button key={y} style={{ background: y === active ? '#1F1E1C' : '#fff', color: y === active ? '#fff' : '#C8270D', border: y === active ? 'none' : '1px solid #EAE7E0', borderRadius: 4, padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>{y}</button>)}</div>
  </div>
);
