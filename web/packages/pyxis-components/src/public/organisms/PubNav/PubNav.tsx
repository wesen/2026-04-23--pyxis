import { pyxisPart } from '../../../utils/parts';
import { clsx } from 'clsx';
import './PubNav.css';

export type PubNavProps = {
  currentPage: 'shows' | 'archive' | 'book' | 'about';
  onNavigate?: (page: string) => void;
  className?: string;
};

const navLinks = [
  { id: 'shows',   label: 'Shows' },
  { id: 'archive', label: 'Archive' },
  { id: 'book',    label: 'Book us' },
  { id: 'about',   label: 'About' },
] as const;

export const PubNav = ({ currentPage, onNavigate, className }: PubNavProps) => {
  return (
    <header
      className={clsx('pyxis-pub-nav', className)}
      {...pyxisPart('pub-nav')}
    >
      <div className="pyxis-pub-nav__inner">
        <button
          className="pyxis-pub-nav__logo"
          onClick={() => onNavigate?.('shows')}
          aria-label="Go to home"
        >
          ppxis
        </button>

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
        </nav>
      </div>
    </header>
  );
};
