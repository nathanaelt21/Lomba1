import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../brand/Logo.jsx';
import './Navbar.css';

export const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/air', label: 'Udara' },
  { to: '/ocean', label: 'Laut' },
  { to: '/explore', label: 'Jelajahi' },
  { to: '/insights', label: 'Wawasan' },
  { to: '/about', label: 'Tentang' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    // The mobile menu is hidden on wide screens; don't leave it "open" there.
    const mq = window.matchMedia('(min-width: 901px)');
    const onWide = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Beranda SEAIR">
          <Logo size={38} />
        </Link>

        <nav className="nav__links" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/explore" className="btn btn--sm nav__cta">
          Buka peta
        </Link>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav id="mobile-menu" className="nav__mobile" aria-label="Menu ponsel" hidden={!open}>
        {NAV_ITEMS.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="nav__mobile-link"
            style={{ '--i': i }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
