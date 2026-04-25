import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './SafetyNote.css';

export type SafetyNoteProps = {
  children?: string;
  className?: string;
};

export const SafetyNote = ({
  children = 'no photo / no video. take care of each other. we honor request-for-removal and safer-space principles. if anything feels off, find a staff member with a red armband.',
  className,
}: SafetyNoteProps) => (
  <div {...pyxisPart('safety-note')} className={clsx('pyxis-safety-note', className)}>
    {children}
  </div>
);
