import { pyxisPart } from '../../utils/parts';
export type ReserveTicketCardProps = { code?: string; price?: string; note?: string; cta?: string; className?: string };
export const ReserveTicketCard = ({ code = '№ 0214-A', price = '$10 – $15', note = 'sliding. cash or card at door.', cta = 'Reserve ticket →', className }: ReserveTicketCardProps) => (
  <div {...pyxisPart('reserve-ticket-card')} className={className} style={{ padding: '14px 16px', background: '#F8F6F1', borderRadius: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#8E887E', marginBottom: 8 }}><span style={{ letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Ticket</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{code}</span></div>
    <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#C8270D', letterSpacing: '-.015em' }}>{price}</div>
    <div style={{ fontSize: 11.5, color: '#8E887E', marginTop: 4 }}>{note}</div>
    <button style={{ marginTop: 12, width: '100%', background: '#C8270D', color: '#fff', border: 'none', borderRadius: 4, padding: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.02em' }}>{cta}</button>
  </div>
);
