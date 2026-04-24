import { pyxisPart } from '../../utils/parts';
import React from 'react';
import type { BookingFormData } from '../../mocks/types';

export type BookingFormProps = {
  onSubmit?: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
};

const labelStyle = { fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: '#8E887E', fontWeight: 600, marginBottom: 6 };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1.5px solid #EAE7E0', background: 'transparent', padding: '8px 0', fontFamily: 'inherit', fontSize: 14.5, color: '#C8270D', outline: 'none', boxSizing: 'border-box' as const };

export const BookingForm = ({ onSubmit, isSubmitting, className }: BookingFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSubmit?.({ artist_name: '', links: '' }); };
  return (
    <form {...pyxisPart('booking-form')} className={className} onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 18 }}>
      <div style={{ fontSize: 13.5, color: '#8E887E', lineHeight: 1.7, fontStyle: 'italic' }}>tell us about your show. we read every submission. responses in 3–7 days. we book 6–10 weeks out; late requests get the unused-dates list.</div>
      {[['Your name', ''], ['Email', 'you@label.com'], ['Project / artist name', '']].map(([label, ph]) => (
        <label key={label} style={{ display: 'block' }}><div style={labelStyle}>{label}</div><input placeholder={ph} style={inputStyle} /></label>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <label><div style={labelStyle}>Preferred date</div><input placeholder="e.g. late April" style={inputStyle} /></label>
        <label><div style={labelStyle}>Expected draw</div><select style={{ ...inputStyle, appearance: 'none' }}><option>Under 50</option><option>50–100</option><option>100–150</option><option>150+</option></select></label>
      </div>
      <label><div style={labelStyle}>Tell us about it</div><textarea rows={6} placeholder="who's on the bill, what it sounds like, what you need from us" style={{ width: '100%', border: '1px solid #EAE7E0', background: '#fff', borderRadius: 4, padding: 12, fontFamily: 'inherit', fontSize: 14, color: '#C8270D', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} /></label>
      <div><button type="submit" disabled={isSubmitting} style={{ background: '#C8270D', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.02em' }}>Send inquiry →</button></div>
    </form>
  );
};
