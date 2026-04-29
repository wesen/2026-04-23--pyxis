import type { HTMLAttributes } from 'react';
import { appPart } from '../../parts';
import './NoteBlock.css';

export type NoteBlockTone = 'default' | 'muted' | 'warning' | 'danger';

export type NoteBlockProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: string;
  empty?: string;
  tone?: NoteBlockTone;
};

export function NoteBlock({ label, value, empty = 'No notes.', tone = 'default', className = '', ...rest }: NoteBlockProps) {
  const text = value?.trim() || empty;
  return <div className={`app-note-block ${className}`.trim()} data-tone={tone} data-empty={!value?.trim() || undefined} {...appPart('note-block')} {...rest}><span {...appPart('note-block', 'label')}>{label}</span><p {...appPart('note-block', 'value')}>{text}</p></div>;
}
