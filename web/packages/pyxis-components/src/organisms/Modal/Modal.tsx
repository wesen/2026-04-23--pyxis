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
const widths = { sm: 402, md: 522, lg: 722 };
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
      <div {...pyxisPart('modal', 'backdrop')} style={{ position: 'absolute', inset: 0, background: 'rgba(26, 24, 22, 0.35)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div ref={ref} {...pyxisPart('modal', 'panel')} style={{ position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 20px 60px rgba(26, 24, 22, 0.18)', width: '100%', maxWidth: widths[width], maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div {...pyxisPart('modal', 'header')} style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 id="modal-title" style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</h2>
            {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button {...pyxisPart('modal', 'close')} onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-tertiary)', borderRadius: 'var(--radius-xs)', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m5 5 10 10M15 5 5 15" /></svg>
          </button>
        </div>
        <div {...pyxisPart('modal', 'body')} style={{ padding: 22, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && <div {...pyxisPart('modal', 'footer')} style={{ padding: '14px 22px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'var(--color-surface-raised)' }}>{footer}</div>}
      </div>
    </div>
  );
};
