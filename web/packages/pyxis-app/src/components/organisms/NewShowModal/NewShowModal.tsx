import type { HTMLAttributes } from 'react';
import { Button, Modal } from 'pyxis-components';
import { appPart } from '../../parts';
import './NewShowModal.css';

export type NewShowModalProps = {
  isOpen?: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  onSaveHold?: () => void;
};

export function NewShowModal({
  isOpen = true,
  title = 'Add new show',
  description = 'Will be posted to #upcoming-shows on confirmation',
  onCancel,
  onSubmit,
  onSaveHold,
}: NewShowModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onCancel?.()}
      title={title}
      subtitle={description}
      width="md"
      className="app-new-show-modal-shell"
      panelClassName="app-new-show-modal"
      bodyClassName="app-new-show-modal-body"
      footerClassName="app-new-show-modal-footer"
      panelProps={appPart('new-show-modal') as HTMLAttributes<HTMLDivElement>}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="outline" onClick={onSaveHold}>Save as hold</Button>
          <Button onClick={onSubmit}>Confirm &amp; post</Button>
        </>
      }
    >
      <div className="app-new-show-modal-form">
        <label className="app-new-show-modal-field">
          <span>Artist / act name</span>
          <input defaultValue="Pharmakon" />
        </label>
        <div className="app-new-show-modal-grid">
          <label className="app-new-show-modal-field">
            <span>Date</span>
            <input type="date" defaultValue="2025-06-14" />
          </label>
          <label className="app-new-show-modal-field">
            <span>Doors</span>
            <input defaultValue="8:00 PM" />
          </label>
          <label className="app-new-show-modal-field">
            <span>Age</span>
            <select defaultValue="All Ages">
              <option>All Ages</option>
              <option>18+</option>
              <option>21+</option>
            </select>
          </label>
          <label className="app-new-show-modal-field">
            <span>Price</span>
            <input defaultValue="$15 / $18" />
          </label>
        </div>
        <label className="app-new-show-modal-field">
          <span>Genre</span>
          <input defaultValue="Industrial" />
        </label>
        <label className="app-new-show-modal-field">
          <span>Notes</span>
          <textarea rows={2} defaultValue="Very loud — warn neighbours about curfew." />
          <small>Visible to staff only</small>
        </label>
      </div>
    </Modal>
  );
}
