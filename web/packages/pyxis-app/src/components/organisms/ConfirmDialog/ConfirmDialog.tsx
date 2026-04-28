import { useEffect } from 'react';
import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './ConfirmDialog.css';

export type ConfirmDialogVariant = 'default' | 'danger' | 'success';

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isLoading, isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmVariant = variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary';

  return (
    <div className="app-confirm-dialog-backdrop" {...appPart('confirm-dialog', 'backdrop')} onMouseDown={() => { if (!isLoading) onCancel(); }}>
      <section
        className="app-confirm-dialog"
        data-variant={variant}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-confirm-dialog-title"
        aria-describedby="app-confirm-dialog-description"
        {...appPart('confirm-dialog')}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="app-confirm-dialog__body" {...appPart('confirm-dialog', 'body')}>
          <span className="app-confirm-dialog__eyebrow">Please confirm</span>
          <h2 id="app-confirm-dialog-title">{title}</h2>
          <p id="app-confirm-dialog-description">{description}</p>
        </div>
        <footer className="app-confirm-dialog__actions" {...appPart('confirm-dialog', 'actions')}>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>{cancelLabel}</Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
        </footer>
      </section>
    </div>
  );
}
