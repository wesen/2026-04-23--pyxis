import { Button } from 'pyxis-components';
import { appPart } from '../../../parts';
import './ShowEditHeader.css';

export type ShowEditHeaderProps = {
  title: string;
  subtitle?: string;
  isSaving?: boolean;
  canPreview?: boolean;
  onBack?: () => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onSave?: () => void;
};

export function ShowEditHeader({ title, subtitle = 'Update your show details, lineup, and assets.', isSaving, canPreview, onBack, onPreview, onDuplicate, onSave }: ShowEditHeaderProps) {
  return (
    <header className="app-show-edit-header" {...appPart('show-edit-header')}>
      <div className="app-show-edit-header__copy">
        <button className="app-show-edit-header__back" type="button" onClick={onBack}>All shows</button>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="app-show-edit-header__actions">
        <Button type="button" variant="outline" size="sm" onClick={onPreview} disabled={!canPreview}>Preview</Button>
        <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>Duplicate</Button>
        <Button type="button" size="sm" iconLeft="edit" onClick={onSave} isLoading={isSaving}>Save changes</Button>
      </div>
    </header>
  );
}
