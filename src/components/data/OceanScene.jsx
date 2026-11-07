import { Fish, BranchCoral, BrainCoral, Seaweed, Rock, Bubbles, LightRays } from '../illustrations/Underwater.jsx';
import { OCEAN_PARAMETERS } from '../../data/parameters.js';

/** Where each ocean parameter "lives" in the illustrated water column (% of scene). */
export const SCENE_ANCHORS = {
  temp: { x: 16, y: 16 },
  chla: { x: 70, y: 20 },
  salinity: { x: 46, y: 44 },
  do: { x: 74, y: 52 },
  ph: { x: 20, y: 70 },
  tss: { x: 82, y: 80 },
};

/**
 * Illustrated underwater cross-section. Each parameter has a numbered marker;
 * selecting one highlights its part of the scene.
 */
export default function OceanScene({ selected, onSelect }) {
  return (
    <div className={`ocean-scene sel-${selected}`}>
      <div className="ocean-scene__sky" aria-hidden="true">
        <span className="ocean-scene__sun" />
      </div>
      <svg className="ocean-scene__surface" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 18 Q37 6 75 18 T150 18 T225 18 T300 18 T375 18 T450 18 T525 18 T600 18 V40 H0Z" fill="#18A6A6" />
        <path d="M0 18 Q37 6 75 18 T150 18 T225 18 T300 18 T375 18 T450 18 T525 18 T600 18" stroke="#F8FCFA" strokeWidth="3" fill="none" />
      </svg>
      <div className="ocean-scene__water" aria-hidden="true">
        <LightRays count={5} />
        <Bubbles count={9} seed={8} />

        {/* temperature: sun-warmed surface layer */}
        <div className="scene-el scene-el--temp">
          <svg viewBox="0 0 40 90">
            <rect x="13" y="4" width="14" height="64" rx="7" fill="#F8FCFA" />
            <rect x="17" y="24" width="6" height="46" rx="3" fill="#FF927E" />
            <circle cx="20" cy="74" r="12" fill="#FF927E" stroke="#F8FCFA" strokeWidth="4" />
          </svg>
          <span className="scene-heat" />
        </div>

        {/* chlorophyll-a: phytoplankton cloud near the surface */}
        <div className="scene-el scene-el--chla">
          {Array.from({ length: 22 }, (_, i) => (
            <i key={i} style={{ '--i': i, left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }} />
          ))}
        </div>

        {/* salinity: freshwater lens from river vs salty water */}
        <div className="scene-el scene-el--salinity">
          <span className="salt-grain" style={{ left: '10%', top: '20%' }} />
          <span className="salt-grain" style={{ left: '60%', top: '10%' }} />
          <span className="salt-grain" style={{ left: '35%', top: '60%' }} />
          <span className="salt-grain" style={{ left: '80%', top: '55%' }} />
          <span className="salt-grain" style={{ left: '15%', top: '80%' }} />
        </div>

        {/* dissolved oxygen: fish school */}
        <div className="scene-el scene-el--do">
          <Fish color="coral" style={{ width: 70 }} className="scene-fish scene-fish--1" />
          <Fish color="sand" style={{ width: 48 }} className="scene-fish scene-fish--2" />
          <Fish color="glass" style={{ width: 56 }} className="scene-fish scene-fish--3" />
        </div>

        {/* pH: coral reef */}
        <div className="scene-el scene-el--ph">
          <Rock className="scene-rock" />
          <BranchCoral style={{ width: 92 }} className="scene-coral" />
          <BrainCoral style={{ width: 90 }} className="scene-brain" />
        </div>

        {/* TSS: sediment plume from a river mouth */}
        <div className="scene-el scene-el--tss">
          <span className="plume plume--1" />
          <span className="plume plume--2" />
          <span className="plume plume--3" />
        </div>

        <Seaweed className="scene-weed scene-weed--1" color="#087E8B" height={130} />
        <Seaweed className="scene-weed scene-weed--2" color="#70D6CE" height={90} blades={2} />
        <div className="ocean-scene__floor" />
      </div>

      {OCEAN_PARAMETERS.map((p, i) => {
        const a = SCENE_ANCHORS[p.key];
        return (
          <button
            key={p.key}
            className={`scene-marker ${selected === p.key ? 'is-active' : ''}`}
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
            onClick={() => onSelect(p.key)}
            aria-pressed={selected === p.key}
            aria-label={`Tampilkan ${p.name}`}
          >
            <span>{i + 1}</span>
            <em>{p.short || p.name}</em>
          </button>
        );
      })}
    </div>
  );
}
