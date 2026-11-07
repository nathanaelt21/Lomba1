import { useRef } from 'react';
import { useReveal } from '../animations/reveal.js';
import HeroJourney from '../sections/home/HeroJourney.jsx';
import TwoWorlds from '../sections/home/TwoWorlds.jsx';
import AirSection from '../sections/home/AirSection.jsx';
import OceanSection from '../sections/home/OceanSection.jsx';
import DataSection from '../sections/home/DataSection.jsx';
import ConnectionSection from '../sections/home/ConnectionSection.jsx';
import MapSection from '../sections/home/MapSection.jsx';
import ActionSection from '../sections/home/ActionSection.jsx';

export default function Home() {
  const scope = useRef(null);
  useReveal(scope);
  return (
    <div ref={scope} className="home">
      <HeroJourney />
      <TwoWorlds />
      <AirSection />
      <OceanSection />
      <DataSection />
      <ConnectionSection />
      <MapSection />
      <ActionSection />
    </div>
  );
}
