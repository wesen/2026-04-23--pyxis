import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={clsx('pyxis-pub-nav', className)}
      {...pyxisPart('pub-nav')}
      data-mobile-menu-open={mobileMenuOpen ? 'true' : undefined}
    >
      <div className="pyxis-pub-nav__inner">
        <button
          type="button"
          className="pyxis-pub-nav__logo"
          onClick={() => handleNavigate('shows')}
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
                type="button"
                className={clsx('pyxis-pub-nav__link', isActive && 'pyxis-pub-nav__link--active')}
                onClick={() => handleNavigate(link.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          className="pyxis-pub-nav__menu-button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="pyxis-pub-nav-mobile-menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav id="pyxis-pub-nav-mobile-menu" className="pyxis-pub-nav__mobile-menu" aria-label="Mobile navigation">
        {navLinks.map((link) => {
          const isActive = link.id === currentPage;
          return (
            <button
              key={link.id}
              type="button"
              className={clsx('pyxis-pub-nav__mobile-link', isActive && 'pyxis-pub-nav__mobile-link--active')}
              onClick={() => handleNavigate(link.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
