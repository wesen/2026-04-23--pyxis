import React, { useEffect, useRef } from 'react';
import { pyxisPart } from '../../utils/parts';
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
};
const widths = { sm: 400, md: 560, lg: 720 };
export const Modal = ({ isOpen, onClose, title, subtitle, width = 'md', children, footer }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      (ref.current as HTMLElement)?.querySelector<HTMLElement>('button, [href], input, select, textarea')?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div {...pyxisPart('modal')} role="dialog" aria-modal aria-labelledby="modal-title" style={{ position: 'fixed', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div {...pyxisPart('modal', 'backdrop')} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div ref={ref} {...pyxisPart('modal', 'panel')} style={{ position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: widths[width], maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div {...pyxisPart('modal', 'header')} style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 id="modal-title" style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>{title}</h2>
            {subtitle && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button {...pyxisPart('modal', 'close')} onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-tertiary)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m5 5 10 10M15 5 5 15" /></svg>
          </button>
        </div>
        <div {...pyxisPart('modal', 'body')} style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && <div {...pyxisPart('modal', 'footer')} style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
};
