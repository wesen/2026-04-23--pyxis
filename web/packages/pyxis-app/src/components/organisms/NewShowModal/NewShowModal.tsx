import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './NewShowModal.css';
export function NewShowModal() { return <div className="app-modal-backdrop" {...appPart('new-show-modal','backdrop')}><section className="app-modal" {...appPart('new-show-modal')}><header><h2>Add new show</h2><p>Create a confirmed or held date from the staff app.</p></header><div className="app-form-grid"><label>Artist<input placeholder="Artist name" /></label><label>Date<input type="date" /></label><label>Doors<input placeholder="8:00 PM" /></label><label>Price<input placeholder="$12 adv / $15 door" /></label></div><footer><Button variant="outline">Cancel</Button><Button>Add show</Button></footer></section></div>; }
