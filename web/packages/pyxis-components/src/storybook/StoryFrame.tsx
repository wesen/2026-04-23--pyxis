import React from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../utils/parts';

export type StoryFrameProps = {
  id: string;
  component?: string;
  part?: string;
  domain?: 'generic' | 'public' | 'app';
  level?: 'atom' | 'molecule' | 'organism' | 'component' | 'page' | 'fixture';
  layout?: 'row' | 'column' | 'grid';
  gap?: number | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const layoutStyles: Record<NonNullable<StoryFrameProps['layout']>, React.CSSProperties> = {
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center' },
  column: { display: 'flex', flexDirection: 'column' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))', alignItems: 'start' },
};

export const StoryFrame = ({
  id,
  component,
  part = 'root',
  domain = 'generic',
  level = 'fixture',
  layout = 'row',
  gap = 12,
  children,
  className,
  style,
}: StoryFrameProps) => {
  const componentAttrs = component ? pyxisPart(component, part) : {};
  return (
    <div
      data-pyxis-story-root="true"
      data-pyxis-story-id={id}
      data-pyxis-domain={domain}
      data-pyxis-level={level}
      className={clsx('pyxis-story-frame', className)}
      style={{ ...layoutStyles[layout], gap, ...style }}
      {...componentAttrs}
    >
      {children}
    </div>
  );
};
