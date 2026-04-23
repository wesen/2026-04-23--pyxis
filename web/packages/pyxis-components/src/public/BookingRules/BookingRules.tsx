export type BookingRulesProps = {
  className?: string;
  'data-part'?: string;
};
export const BookingRules = ({ className, 'data-part': dataPart }: BookingRulesProps) => (
  <div data-part={dataPart ?? 'booking-rules'} className={className} style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
    <h4 style={{ fontWeight: 600, margin: '0 0 12px', fontSize: 'var(--text-base)' }}>What to know</h4>
    <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
      <li>We book 4–8 weeks out. Don't reach out too early.</li>
      <li>Live, DJ, or hybrid — all formats considered.</li>
      <li>Door split or flat rate depending on draw and format.</li>
      <li>Soft holds for up to a week without commitment.</li>
    </ol>
  </div>
);
