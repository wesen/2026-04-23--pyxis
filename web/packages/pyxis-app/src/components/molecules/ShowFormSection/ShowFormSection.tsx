import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './ShowFormSection.css';

export type ShowFormSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ShowFormSection({ title, description, action, children }: ShowFormSectionProps) {
  return (
    <section className="app-show-form-section" {...appPart('show-form-section')}>
      <header className="app-show-form-section__header" {...appPart('show-form-section', 'header')}>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="app-show-form-section__action">{action}</div>}
      </header>
      <div className="app-show-form-section__body" {...appPart('show-form-section', 'body')}>
        {children}
      </div>
    </section>
  );
}
