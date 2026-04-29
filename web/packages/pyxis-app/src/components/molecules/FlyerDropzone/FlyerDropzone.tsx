import { appPart } from '../../parts';
import './FlyerDropzone.css';

export type FlyerDropzoneProps = {
  id?: string;
  currentUrl?: string;
  file?: File;
  disabled?: boolean;
  onFileChange?: (file?: File) => void;
};

const isImageUrl = (value?: string) => Boolean(value && !value.toLowerCase().endsWith('.pdf'));

export function FlyerDropzone({ id = 'show-flyer-upload', currentUrl, file, disabled, onFileChange }: FlyerDropzoneProps) {
  const previewUrl = isImageUrl(currentUrl) ? currentUrl : undefined;
  const status = file ? `Selected: ${file.name}` : currentUrl ? `Current flyer: ${currentUrl}` : 'No flyer selected yet';

  return (
    <div className="app-flyer-dropzone" {...appPart('flyer-dropzone')}>
      <label className="app-flyer-dropzone__target" htmlFor={id} data-has-preview={previewUrl ? 'true' : 'false'}>
        {previewUrl ? (
          <img src={previewUrl} alt="Current show flyer" />
        ) : (
          <span className="app-flyer-dropzone__icon" aria-hidden="true">↥</span>
        )}
        <span className="app-flyer-dropzone__copy">
          <strong>Drag & drop or click to upload</strong>
          <em>PNG, JPG, WebP, or PDF. Recommended 1080×1080 or 1080×1350.</em>
        </span>
      </label>
      <input
        id={id}
        className="app-flyer-dropzone__input"
        type="file"
        accept="image/*,.pdf"
        disabled={disabled}
        onChange={(event) => onFileChange?.(event.target.files?.[0])}
      />
      <p className="app-flyer-dropzone__status">{status}</p>
    </div>
  );
}
