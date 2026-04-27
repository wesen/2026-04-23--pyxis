import { useState } from 'react';
import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './FlyerField.css';

export type FlyerFieldProps = {
  flyerUrl?: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  onUpload?: (file: File) => void;
  onDelete?: () => void;
};

export function FlyerField({ flyerUrl, isUploading, isDeleting, onUpload, onDelete }: FlyerFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const submit = () => {
    if (selectedFile) {
      onUpload?.(selectedFile);
      setSelectedFile(undefined);
    }
  };

  return (
    <section className="app-flyer-field" {...appPart('flyer-field')}>
      <header>
        <div>
          <strong>Flyer</strong>
          <span>{flyerUrl ? 'Public artwork attached to this show.' : 'No flyer uploaded yet.'}</span>
        </div>
        {flyerUrl && <a href={flyerUrl} target="_blank" rel="noreferrer">Open</a>}
      </header>
      {flyerUrl && <div className="app-flyer-field-preview"><span>{flyerUrl}</span><Button variant="ghost" size="sm" iconLeft="trash" onClick={onDelete} isLoading={isDeleting}>Delete flyer</Button></div>}
      <div className="app-flyer-field-upload">
        <input type="file" accept="image/*,.pdf" onChange={(event) => setSelectedFile(event.target.files?.[0])} aria-label="Choose flyer file" />
        <Button variant="outline" size="sm" onClick={submit} disabled={!selectedFile} isLoading={isUploading}>Upload flyer</Button>
      </div>
      {selectedFile && <small>Selected: {selectedFile.name}</small>}
    </section>
  );
}
