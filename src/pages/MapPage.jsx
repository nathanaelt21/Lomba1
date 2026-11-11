import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/brand/Logo.jsx';
import EnvMap from '../components/map/EnvMap.jsx';
import './MapPage.css';

/**
 * Standalone full-screen map. Opened in a new tab from every "Open map"
 * link, so it renders without the site navbar and footer.
 */
export default function MapPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Peta · SEAIR';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="mappage">
      <header className="mappage__bar">
        <Link to="/" className="mappage__brand" aria-label="Beranda SEAIR">
          <Logo size={34} />
        </Link>
        <div className="mappage__title">
          <h1>Peta udara &amp; laut Teluk Jakarta</h1>
          <p>Geser, perbesar, ganti lapisan, lalu pilih penanda untuk melihat hasil ukurnya.</p>
        </div>
        <Link to="/" className="btn btn--sm btn--light">
          Kembali ke situs
        </Link>
      </header>
      <main id="main" className="mappage__body">
        <EnvMap initialLayer="combined" fullPage />
      </main>
      <p className="mappage__note">
        Lokasi bersifat perkiraan dan semua nilai adalah data demo. Data peta © kontributor OpenStreetMap.
      </p>
    </div>
  );
}
