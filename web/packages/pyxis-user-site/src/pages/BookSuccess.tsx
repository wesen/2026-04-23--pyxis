import { useNavigate } from 'react-router-dom';
import { BookingSuccess } from 'pyxis-components';

export function BookSuccess() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 32px' }}>
      <BookingSuccess onSubmitAnother={() => navigate('/book')} />
    </div>
  );
}
