import { pyxisPart } from '../../utils/parts';
export const SaferSpaceAgreement = ({ className }: { className?: string }) => (
  <label {...pyxisPart('safer-space-agreement')} className={className} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#8E887E', lineHeight: 1.55 }}>
    <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: '#C8270D' }} />
    <span>i've read the <a href="#" style={{ color: '#C8270D' }}>safer-space policy</a> and agree to uphold it for my show.</span>
  </label>
);
