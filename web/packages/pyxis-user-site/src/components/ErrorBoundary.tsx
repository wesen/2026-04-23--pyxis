/**
 * Global error boundary — catches render errors and shows a fallback.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 480, margin: '0 auto', padding: '96px 32px', textAlign: 'center',
          fontFamily: 'var(--font-body)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            We ran into an error. Try refreshing the page.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              background: 'var(--color-surface-raised)', padding: 16, borderRadius: 8,
              fontSize: '0.75rem', textAlign: 'left', overflow: 'auto', maxHeight: 200,
              color: 'var(--color-accent)',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: 24, padding: '8px 20px', background: 'var(--color-ink)',
              color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontSize: 'var(--text-sm)',
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
