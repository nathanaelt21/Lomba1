import { Link } from 'react-router-dom';
import Logo from '../brand/Logo.jsx';
import { NAV_ITEMS } from './Navbar.jsx';
import { DATA_SOURCES, SOURCE_STATUS } from '../../data/sources.js';
import { Seaweed, BranchCoral, Bubbles } from '../illustrations/Underwater.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="footer__seabed" aria-hidden="true">
        <Bubbles count={8} seed={11} />
        <Seaweed className="footer__weed footer__weed--1" color="#087E8B" height={160} />
        <BranchCoral className="footer__coral" color="#FF927E" tip="#FFC2B4" />
        <Seaweed className="footer__weed footer__weed--2" color="#18A6A6" height={120} blades={2} />
      </div>
      <div className="container footer__grid">
        <div className="footer__about">
          <Logo variant="light" size={44} />
          <p>
            SEAIR menyatukan data kualitas udara dan kualitas air laut di satu tempat, agar semua orang bisa melihat bagaimana
            langit di atas Teluk Jakarta dan laut di bawahnya saling memengaruhi.
          </p>
          <p className="tiny footer__note">
            Prototipe. Angka yang tampil adalah <strong>DATA DEMO</strong> sampai sumber resmi terhubung.
          </p>
        </div>

        <nav className="footer__col" aria-label="Navigasi bawah">
          <h3>Navigasi</h3>
          <ul>
            {NAV_ITEMS.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3>Sumber data</h3>
          <ul>
            {DATA_SOURCES.map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                ) : (
                  <span>{s.name}</span>
                )}
                <small>{SOURCE_STATUS[s.status]}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Kontak</h3>
          <ul>
            <li>
              <a href="mailto:hello@seair.example">hello@seair.example</a>
            </li>
            <li>
              <Link to="/about#methodology">Metodologi</Link>
            </li>
            <li>
              <Link to="/about#integrity">Integritas data</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} SEAIR · Sky to Sea</span>
        <span>Fokus prototipe: Teluk Jakarta, Indonesia</span>
      </div>
    </footer>
  );
}
