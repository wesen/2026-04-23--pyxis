import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './Card.css';

export type CardProps = {
  children: React.ReactNode;
  /** Inner padding. Default: 'md' (22px) */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Interactive — adds hover effect */
  interactive?: boolean;
  /** Optional header slot */
  header?: React.ReactNode;
  /** Optional footer slot */
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};



/**
 * A surface container with optional header/footer slots.
 *
 * ```tsx
 * <Card>
 *   <Card.Header title="Upcoming shows" />
 *   <ShowList />
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = 'md',
      interactive,
      header,
      footer,
      className,
      bodyClassName,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx('pyxis-card', interactive && 'pyxis-card--interactive', className)}
        {...pyxisPart('card')}
        data-padding={padding}
        {...rest}
      >
        {header && <div className="pyxis-card__header" {...pyxisPart('card', 'header')}>{header}</div>}
        <div className={clsx('pyxis-card__body', bodyClassName)} {...pyxisPart('card', 'body')}>{children}</div>
        {footer && <div className="pyxis-card__footer" {...pyxisPart('card', 'footer')}>{footer}</div>}
      </div>
    );
  }
);
Card.displayName = 'Card';
