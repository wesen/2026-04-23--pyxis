import type { FormEvent } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import type { BookingFormData } from '../../mocks/types';
import './BookingForm.css';

export type BookingFormProps = {
  onSubmit?: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
};

const textFields = [
  { id: 'booking-name', label: 'Your name', placeholder: '' },
  { id: 'booking-email', label: 'Email', placeholder: 'you@label.com' },
  { id: 'booking-project', label: 'Project / artist name', placeholder: '' },
];

export const BookingForm = ({ onSubmit, isSubmitting, className }: BookingFormProps) => {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit?.({ artist_name: '', links: '' });
  };

  return (
    <form
      {...pyxisPart('booking-form')}
      className={clsx('pyxis-booking-form', className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="pyxis-booking-form__intro" {...pyxisPart('booking-form', 'intro')}>
        tell us about your show. we read every submission. responses in 3–7 days. we book 6–10 weeks out; late requests get the unused-dates list.
      </div>

      {textFields.map((field) => (
        <label key={field.label} className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor={field.id}>
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>
            {field.label}
          </div>
          <input
            id={field.id}
            className="pyxis-booking-form__input"
            {...pyxisPart('booking-form', 'input')}
            placeholder={field.placeholder}
          />
        </label>
      ))}

      <div className="pyxis-booking-form__field-grid" {...pyxisPart('booking-form', 'field-grid')}>
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-date">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>
            Preferred date
          </div>
          <input
            id="booking-date"
            className="pyxis-booking-form__input"
            {...pyxisPart('booking-form', 'input')}
            placeholder="e.g. late April"
          />
        </label>
        <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-draw">
          <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>
            Expected draw
          </div>
          <select id="booking-draw" className="pyxis-booking-form__select" {...pyxisPart('booking-form', 'select')}>
            <option>Under 50</option>
            <option>50–100</option>
            <option>100–150</option>
            <option>150+</option>
          </select>
        </label>
      </div>

      <label className="pyxis-booking-form__field" {...pyxisPart('booking-form', 'field')} htmlFor="booking-description">
        <div className="pyxis-booking-form__label" {...pyxisPart('booking-form', 'label')}>
          Tell us about it
        </div>
        <textarea
          id="booking-description"
          className="pyxis-booking-form__textarea"
          {...pyxisPart('booking-form', 'textarea')}
          rows={6}
          placeholder="who's on the bill, what it sounds like, what you need from us"
        />
      </label>

      <div className="pyxis-booking-form__actions" {...pyxisPart('booking-form', 'actions')}>
        <button
          className="pyxis-booking-form__submit"
          {...pyxisPart('booking-form', 'submit')}
          type="submit"
          disabled={isSubmitting}
        >
          Send inquiry →
        </button>
      </div>
    </form>
  );
};
