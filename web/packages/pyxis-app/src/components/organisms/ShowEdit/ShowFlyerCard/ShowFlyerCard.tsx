import { Button } from 'pyxis-components';
import { appPart } from '../../../parts';
import './ShowFlyerCard.css';

export type ShowFlyerCardProps = {
  flyerUrl?: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  onUpload?: (file: File) => void;
  onDelete?: () => void;
};

export function ShowFlyerCard({ flyerUrl, isUploading, isDeleting, onUpload, onDelete }: ShowFlyerCardProps) {
  return (
    <section className="app-show-flyer-card" {...appPart('show-flyer-card')}>
      <header>
        <div>
          <h2>Flyer</h2>
          <p>This is what your audience will see.</p>
        </div>
      </header>
      <div className="app-show-flyer-card__preview" data-empty={flyerUrl ? 'false' : 'true'}>
        {flyerUrl ? <img src={flyerUrl} alt="Show flyer" /> : <span>No flyer uploaded</span>}
      </div>
      <div className="app-show-flyer-card__actions">
        <label className="app-show-flyer-card__replace">
          <input type="file" accept="image/*,.pdf" disabled={isUploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload?.(file); }} />
          <span>{isUploading ? 'Uploading…' : 'Replace flyer'}</span>
        </label>
        <Button type="button" variant="ghost" size="sm" iconLeft="trash" onClick={onDelete} disabled={!flyerUrl || isDeleting}>{isDeleting ? 'Deleting…' : 'Delete'}</Button>
      </div>
    </section>
  );
}
