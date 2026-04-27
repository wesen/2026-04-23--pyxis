import { Button } from 'pyxis-components';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '96px 32px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 500, margin: '0 0 16px' }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>This page doesn't exist.</p>
      <Button variant="primary" onClick={() => navigate('/')}>Back to shows</Button>
    </div>
  );
}
