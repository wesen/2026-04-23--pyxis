import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './FieldError.css';

export type FieldErrorProps = { children?: ReactNode; id?: string };

export function FieldError({ children, id }: FieldErrorProps) {
  if (!children) return null;
  return <div id={id} className="app-field-error" role="alert" {...appPart('field-error')}>{children}</div>;
}
