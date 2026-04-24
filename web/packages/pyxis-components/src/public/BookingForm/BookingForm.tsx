import { pyxisPart } from '../../utils/parts';
import React, { useState } from 'react';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Textarea } from '../../atoms/Textarea';
import { Button } from '../../atoms/Button';
import type { BookingFormData } from '../../mocks/types';

export type BookingFormProps = {
  onSubmit?: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
};

const genreOptions = [
  { value: 'darkwave', label: 'Darkwave' },
  { value: 'noise', label: 'Noise' },
  { value: 'techno', label: 'Techno' },
  { value: 'ambient', label: 'Ambient' },
  { value: 'ebm', label: 'EBM / Industrial' },
  { value: 'experimental', label: 'Experimental' },
  { value: 'other', label: 'Other' },
];

type FormState = Partial<BookingFormData>;
export const BookingForm = ({ onSubmit, isSubmitting, className }: BookingFormProps) => {
  const [form, setForm] = useState<FormState>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artist_name || !form.links) return;
    await onSubmit?.(form as BookingFormData);
  };

  const set = (key: keyof BookingFormData, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      {...pyxisPart('booking-form')}
      className={className}
      onSubmit={handleSubmit}
      noValidate
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Artist / project *"
          placeholder="Artist or project name"
          value={form.artist_name ?? ''}
          onChange={(e) => set('artist_name', e.target.value)}
          required
        />
        <Select
          label="Genre"
          options={genreOptions}
          placeholder="Select a genre…"
          value={form.genre ?? ''}
          onChange={(e) => set('genre', e.target.value)}
        />
        <Input
          label="Preferred date"
          type="date"
          value={form.preferred_date ?? ''}
          onChange={(e) => set('preferred_date', e.target.value)}
        />
        <Input
          label="Expected draw"
          type="number"
          placeholder="Approximate attendance"
          value={form.expected_draw ? String(form.expected_draw) : ''}
          onChange={(e) => set('expected_draw', Number(e.target.value) || undefined)}
        />
        <Input
          label="Links *"
          placeholder="Bandcamp, Spotify, SoundCloud, website…"
          value={form.links ?? ''}
          onChange={(e) => set('links', e.target.value)}
          required
          hint="Links help us understand your sound"
        />
        <Textarea
          label="Tech rider"
          placeholder="PA size, mic needs, stage plot…"
          value={form.tech_rider ?? ''}
          onChange={(e) => set('tech_rider', e.target.value)}
          rows={3}
        />
        <Textarea
          label="Anything else"
          placeholder="Any other details…"
          value={form.message ?? ''}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
        />
        <Button
          type="submit"
          variant="primary"
          iconRight="chevron-right"
          fullWidth
          isLoading={isSubmitting}
        >
          Send inquiry
        </Button>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          * required fields
        </p>
      </div>
    </form>
  );
};
