import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './animations/gsap.js';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import { ScrollProgress, BackToTop } from './components/ui/ScrollHelpers.jsx';
import Glossary from './components/ui/Glossary.jsx';
import { lazyWithReload as lazy, clearChunkReloadFlag } from './utils/lazyWithReload.js';

// Secondary pages are split into their own chunks.
const AirPage = lazy(() => import('./pages/AirPage.jsx'));
const OceanPage = lazy(() => import('./pages/OceanPage.jsx'));
const ExplorePage = lazy(() => import('./pages/ExplorePage.jsx'));
const InsightsPage = lazy(() => import('./pages/InsightsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const timers = [];
    if (hash) {
      // The target may live on a lazily loaded page (e.g. /about#methodology
      // from the footer), so keep looking for it for a moment.
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const find = () => {
        const el = document.getElementById(id);
        if (el) {
          ScrollTrigger.refresh();
          requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
        } else if (tries++ < 40) {
          timers.push(setTimeout(find, 75));
        }
      };
      find();
    } else {
      window.scrollTo(0, 0);
      // Let pinned sections recalculate after the new page lays out.
      timers.push(setTimeout(() => ScrollTrigger.refresh(), 120));
    }
    return () => timers.forEach(clearTimeout);
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      <span className="page-loading__bubble" />
      <span className="visually-hidden">Memuat…</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const id = setTimeout(clearChunkReloadFlag, 5000);
    return () => clearTimeout(id);
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">
        Langsung ke konten
      </a>
      <RouteEffects />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Suspense fallback={<PageFallback />}>
          {/* Opacity-only fade: a transform here would break GSAP pinning. */}
          <div className="page-enter" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/air" element={<AirPage />} />
            <Route path="/ocean" element={<OceanPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
      <Glossary />
    </>
  );
}
