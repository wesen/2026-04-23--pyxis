import { useNavigate } from 'react-router-dom';
import { BookingSuccess } from 'pyxis-components';
import './Page.css';

export function BookSuccess() {
  const navigate = useNavigate();
  return (
    <main className="pyxis-public-page pyxis-book-success-page" data-page="book-success">
      <div className="pyxis-public-page__inner pyxis-book-success-page__inner" data-section="book-success">
        <BookingSuccess onSubmitAnother={() => navigate('/book')} />
      </div>
    </main>
  );
}
