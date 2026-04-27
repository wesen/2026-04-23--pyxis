import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import { create, BookingFormDataSchema } from 'pyxis-types';
import type { BookingFormData } from 'pyxis-types';
import './BookingForm.css';

export type BookingFormVisibleFields = {
  name: boolean;
  email: boolean;
  artistName: boolean;
  links: boolean;
  preferredDate: boolean;
  expectedDraw: boolean;
  genre: boolean;
  showType: boolean;
  message: boolean;
  techRider: boolean;
  agreement: boolean;
};

export type BookingFormProps = {
  onSubmit?: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
  visibleFields?: Partial<BookingFormVisibleFields>;
  showTypeOptions?: string[];
  defaultShowType?: string;
  agreementLabel?: ReactNode;
  submitLabel?: string;
  intro?: ReactNode;
  disableSubmitWhenInvalid?: boolean;
  className?: string;
};

type Draft = {
  name: string;
  email: string;
  artistName: string;
  genre: string;
  links: string;
  preferredDate: string;
  expectedDraw: string;
  showType: string;
  message: string;
  techRider: string;
  agreement: boolean;
};

const defaultVisibleFields: BookingFormVisibleFields = {
  name: true,
  email: true,
  artistName: true,
  links: true,
  preferredDate: true,
  expectedDraw: true,
  genre: true,
  showType: false,
  message: true,
  techRider: true,
  agreement: false,
};

const initialDraft: Draft = {
  name: '',
  email: '',
  artistName: '',
  genre: '',
  links: '',
  preferredDate: '',
  expectedDraw: 'Under 50',
  showType: 'Live music',
  message: '',
  techRider: '',
  agreement: true,
};

const defaultShowTypeOptions = ['DJ night', 'Live music', 'Listening party', 'Workshop / meet-up', 'Screening', 'Other'];

const drawValues: Record<string, number> = {
  'Under 50': 25,
  '50–100': 75,
  '100–150': 125,
  '150+': 150,
};

const defaultIntro = 'tell us about your show. we read every submission. responses in 3–7 days. we book 6–10 weeks out; late requests get the unused-dates list.';
const defaultAgreement = <>i&apos;ve read the <a href="#">safer-space policy</a> and agree to uphold it for my show.</>;

export const BookingForm = ({
  onSubmit,
  isSubmitting,
  visibleFields,
  showTypeOptions = defaultShowTypeOptions,
  defaultShowType = 'Live music',
  agreementLabel = defaultAgreement,
  submitLabel = 'Send inquiry →',
  intro = defaultIntro,
  disableSubmitWhenInvalid = true,
  className,
}: BookingFormProps) => {
  const fields = { ...defaultVisibleFields, ...visibleFields };
  const [draft, setDraft] = useState<Draft>({ ...initialDraft, showType: defaultShowType });
  const [submitted, setSubmitted] = useState(false);
  const requiredMissing = useMemo(() => ({
    artistName: fields.artistName && !draft.artistName.trim(),
    links: fields.links && !draft.links.trim(),
    agreement: fields.agreement && !draft.agreement,
  }), [draft.agreement, draft.artistName, draft.links, fields.agreement, fields.artistName, fields.links]);
  const isInvalid = requiredMissing.artistName || requiredMissing.links || requiredMissing.agreement;
  const canSubmit = !isSubmitting && (!disableSubmitWhenInvalid || !isInvalid);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (isInvalid) return;
    const contact = [draft.name && `Name: ${draft.name}`, draft.email && `Email: ${draft.email}`, draft.showType && fields.showType && `Show type: ${draft.showType}`].filter(Boolean).join('\n');
    await onSubmit?.(create(BookingFormDataSchema, {
      artistName: draft.artistName.trim(),
      genre: draft.genre.trim() || draft.showType.trim(),
      preferredDate: draft.preferredDate.trim(),
      expectedDraw: drawValues[draft.expectedDraw] ?? 0,
      links: draft.links.trim(),
      techRider: draft.techRider.trim(),
      message: [contact, draft.message.trim()].filter(Boolean).join('\n\n'),
    }));
  };

  return (
    <form
      {...pyxisPart('booking-form')}
      className={clsx('pyxis-booking-form', className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="pyxis-booking-form__intro" {...pyxisPart('booking-form', 'intro')}>
        {intro}
      </div>

      {fields.name ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-name">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Your name</div>
          <input id="booking-name" className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} value={draft.name} onChange={(event) => set('name', event.target.value)} />
        </label>
      ) : null}

      {fields.email ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-email">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Email</div>
          <input id="booking-email" className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} placeholder="you@label.com" value={draft.email} onChange={(event) => set('email', event.target.value)} />
        </label>
      ) : null}

      {fields.artistName ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-project">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Project / artist name {fields.links ? <span aria-hidden="true">*</span> : null}</div>
          <input id="booking-project" aria-invalid={submitted && requiredMissing.artistName} className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} value={draft.artistName} onChange={(event) => set('artistName', event.target.value)} />
          {submitted && requiredMissing.artistName && <p className="pyxis-booking-form__error">Artist name is required.</p>}
        </label>
      ) : null}

      {fields.links ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-links">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Links <span aria-hidden="true">*</span></div>
          <input id="booking-links" aria-invalid={submitted && requiredMissing.links} className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} placeholder="Bandcamp, Instagram, live video…" value={draft.links} onChange={(event) => set('links', event.target.value)} />
          {submitted && requiredMissing.links && <p className="pyxis-booking-form__error">At least one link is required.</p>}
        </label>
      ) : null}

      {fields.preferredDate || fields.expectedDraw ? (
        <div className="pyxis-booking-form__field-grid" {...pyxisPart('booking-form', 'field-grid')}>
          {fields.preferredDate ? (
            <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-date">
              <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Preferred date</div>
              <input id="booking-date" className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} placeholder="e.g. late April" value={draft.preferredDate} onChange={(event) => set('preferredDate', event.target.value)} />
            </label>
          ) : null}
          {fields.expectedDraw ? (
            <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-draw">
              <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Expected draw</div>
              <select id="booking-draw" className="pyxis-booking-form__select" {...pyxisPart('booking-form', 'select')} value={draft.expectedDraw} onChange={(event) => set('expectedDraw', event.target.value)}>
                <option>Under 50</option>
                <option>50–100</option>
                <option>100–150</option>
                <option>150+</option>
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      {fields.genre ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-genre">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Genre / sound</div>
          <input id="booking-genre" className="pyxis-booking-form__input" {...pyxisPart('booking-form', 'input')} value={draft.genre} onChange={(event) => set('genre', event.target.value)} />
        </label>
      ) : null}

      {fields.showType ? (
        <div className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')}>
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Show type</div>
          <div className="pyxis-booking-form__chips" {...pyxisPart('booking-form', 'chips')}>
            {showTypeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={clsx('pyxis-booking-form__chip', option === draft.showType && 'pyxis-booking-form__chip--selected')}
                {...pyxisPart('booking-form', 'chip')}
                onClick={() => set('showType', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {fields.message ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-description">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Tell us about it</div>
          <textarea id="booking-description" className="pyxis-booking-form__textarea" {...pyxisPart('booking-form', 'textarea')} rows={6} placeholder="who's on the bill, what it sounds like, what you need from us" value={draft.message} onChange={(event) => set('message', event.target.value)} />
        </label>
      ) : null}

      {fields.techRider ? (
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-tech-rider">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>Tech rider / needs</div>
          <textarea id="booking-tech-rider" className="pyxis-booking-form__textarea" {...pyxisPart('booking-form', 'textarea')} rows={3} value={draft.techRider} onChange={(event) => set('techRider', event.target.value)} />
        </label>
      ) : null}

      {fields.agreement ? (
        <label className="pyxis-booking-form__agreement" {...pyxisPart('booking-form', 'agreement')}>
          <input type="checkbox" checked={draft.agreement} onChange={(event) => set('agreement', event.target.checked)} />
          <span>{agreementLabel}</span>
        </label>
      ) : null}

      <div className="pyxis-booking-form__actions" {...pyxisPart('booking-form', 'actions')}>
        <button className="pyxis-booking-form__submit" {...pyxisPart('booking-form', 'submit')} type="submit" disabled={!canSubmit}>
          {isSubmitting ? 'Sending…' : submitLabel}
        </button>
      </div>
    </form>
  );
};
