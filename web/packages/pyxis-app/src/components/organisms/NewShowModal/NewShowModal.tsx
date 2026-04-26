import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './NewShowModal.css';

export type NewShowModalProps = {
  title?: string;
  description?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export function NewShowModal({ title = 'Add new show', description = 'Create a confirmed or held date from the staff app.', onCancel, onSubmit }: NewShowModalProps) {
  return <div className="app-modal-backdrop" {...appPart('new-show-modal','backdrop')}><section className="app-modal" {...appPart('new-show-modal')}><header><h2>{title}</h2><p>{description}</p></header><div className="app-form-grid"><label>Artist<input placeholder="Artist name" /></label><label>Date<input type="date" /></label><label>Doors<input placeholder="8:00 PM" /></label><label>Price<input placeholder="$12 adv / $15 door" /></label></div><footer><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={onSubmit}>Add show</Button></footer></section></div>;
}
