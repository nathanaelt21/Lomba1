import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero.jsx';

export default function NotFound() {
  return (
    <PageHero variant="deep" eyebrow="404 · Lost at sea" title="This page drifted away">
      Arus laut membawa halaman ini entah ke mana. <Link to="/">Berenang kembali ke beranda</Link>.
    </PageHero>
  );
}
