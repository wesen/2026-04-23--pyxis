import { pyxisPart } from '../../utils/parts';
export type SafetyNoteProps = { children?: string; className?: string };
export const SafetyNote = ({ children = 'no photo / no video. take care of each other. we honor request-for-removal and safer-space principles. if anything feels off, find a staff member with a red armband.', className }: SafetyNoteProps) => (
  <div {...pyxisPart('safety-note')} className={className} style={{ fontSize: 12.5, color: '#8E887E', lineHeight: 1.65, fontStyle: 'italic', borderLeft: '2px solid #EAE7E0', paddingLeft: 14 }}>{children}</div>
);
