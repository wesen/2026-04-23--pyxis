import React from 'react';
import { Icon, type IconName } from '../../atoms/Icon';
import { pyxisPart } from '../../utils/parts';
export type EmptyProps = {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};
export const Empty = ({ icon = 'sparkle', title, description, action, className }: EmptyProps) => (
  <div
    className={className}
    {...pyxisPart('empty')}
    style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--color-text-tertiary)',
    }}
  >
    <div
      {...pyxisPart('empty', 'icon')}
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: 'var(--color-muted-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      <Icon name={icon} size={18} color="var(--color-text-tertiary)" />
    </div>
    <div {...pyxisPart('empty', 'title')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</div>
    {description && (
      <div {...pyxisPart('empty', 'description')} style={{ fontSize: 12.5, marginBottom: 14 }}>
        {description}
      </div>
    )}
    {action}
  </div>
);
