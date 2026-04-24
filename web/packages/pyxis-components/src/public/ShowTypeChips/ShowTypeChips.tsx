import { pyxisPart } from '../../utils/parts';
export type ShowTypeChipsProps = { options?: string[]; active?: string; className?: string };
export const ShowTypeChips = ({ options = ['DJ night', 'Live music', 'Listening party', 'Workshop / meet-up', 'Screening', 'Other'], active = 'Live music', className }: ShowTypeChipsProps) => (
  <div {...pyxisPart('show-type-chips')} className={className} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{options.map((t) => <button key={t} type="button" style={{ background: t === active ? '#1F1E1C' : '#fff', color: t === active ? '#fff' : '#C8270D', border: t === active ? 'none' : '1px solid #EAE7E0', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>{t}</button>)}</div>
);
