import './PubNav.css';
import { clsx } from 'clsx';
import { PyxisLogo } from '../../atoms/Icon';

export type PubNavProps = {
  currentPage: 'shows' | 'archive' | 'book' | 'about';
  onNavigate?: (page: string) => void;
  className?: string;
  'data-part'?: string;
};

const navLinks = [
  { id: 'shows',   label: 'Shows' },
  { id: 'archive', label: 'Archive' },
  { id: 'book',    label: 'Book us' },
  { id: 'about',   label: 'About' },
] as const;

export const PubNav = ({ currentPage, onNavigate, className, 'data-part': dataPart }: PubNavProps) => {
  return (
    <header
      className={clsx('pyxis-pub-nav', className)}
      data-part={dataPart ?? 'pub-nav'}
    >
      <div className="pyxis-pub-nav__inner">
        {/* Logo */}
        <button
          className="pyxis-pub-nav__logo"
          onClick={() => onNavigate?.('shows')}
          aria-label="Go to home"
        >
          <PyxisLogo size={22} />
        </button>

        {/* Nav links */}
        <nav className="pyxis-pub-nav__links" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = link.id === currentPage;
            return (
              <button
                key={link.id}
                className={clsx('pyxis-pub-nav__link', isActive && 'pyxis-pub-nav__link--active')}
                onClick={() => onNavigate?.(link.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </button>
            );
          })}
          <button
            className="pyxis-pub-nav__cta"
            onClick={() => onNavigate?.('book')}
          >
            Get tickets
          </button>
        </nav>
      </div>
    </header>
  );
};
