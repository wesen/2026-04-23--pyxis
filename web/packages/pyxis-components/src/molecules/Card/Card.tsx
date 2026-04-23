import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export type CardProps = {
  children: React.ReactNode;
  /** Inner padding. Default: 'md' (22px) */
  padding?: 'sm' | 'md' | 'lg';
  /** Interactive — adds hover effect */
  interactive?: boolean;
  /** Optional header slot */
  header?: React.ReactNode;
  /** Optional footer slot */
  footer?: React.ReactNode;
  className?: string;
  'data-part'?: string;
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
      'data-part': dataPart,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx('pyxis-card', interactive && 'pyxis-card--interactive', className)}
        data-part={dataPart ?? 'card'}
        data-padding={padding}
        {...rest}
      >
        {header && <div className="pyxis-card__header">{header}</div>}
        <div className="pyxis-card__body">{children}</div>
        {footer && <div className="pyxis-card__footer">{footer}</div>}
      </div>
    );
  }
);
Card.displayName = 'Card';
