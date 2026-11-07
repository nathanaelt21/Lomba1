import { useEffect, useState } from 'react';
import ConnectionDiagram from '../../components/data/ConnectionDiagram.jsx';
import { SectionHeading } from '../../components/ui/Basics.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { PATHWAYS } from '../../data/pathways.js';
import { getParameter } from '../../data/parameters.js';

export function CausationNote({ className = '' }) {
  return (
    <aside className={`causation-note ${className}`} data-reveal>
      <span className="icon-bubble">
        <Icon name="info" />
      </span>
      <div>
        <h3>Korelasi bukan berarti sebab-akibat</h3>
        <p>
          Ketika data udara dan laut naik-turun bersamaan, itu saja belum membuktikan bahwa yang satu menyebabkan yang lain.
          Musim, hujan, dan sungai sering memengaruhi keduanya sekaligus. SEAIR menampilkan polanya berdampingan dan menjelaskan
          mekanisme yang sudah diketahui. Untuk membuktikan penyebabnya dibutuhkan penelitian lapangan, pelacak, dan model.
        </p>
      </div>
    </aside>
  );
}

export default function ConnectionSection() {
  const [active, setActive] = useState(PATHWAYS[0].key);
  const [playing, setPlaying] = useState(false);
  const idx = PATHWAYS.findIndex((p) => p.key === active);
  const step = PATHWAYS[idx];

  // One timer per step: advance, or stop on the last one. (Calling
  // setPlaying inside a setActive updater was a side effect in a pure
  // function and could run twice under StrictMode.)
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (idx >= PATHWAYS.length - 1) setPlaying(false);
      else setActive(PATHWAYS[idx + 1].key);
    }, 3800);
    return () => clearTimeout(id);
  }, [playing, idx]);

  const pick = (k) => {
    setPlaying(false);
    setActive(k);
  };

  return (
    <section id="connection" className="section connection-section">
      <div className="container">
        <SectionHeading eyebrow="Where air meets the ocean" title="Six ways the sky reaches the sea" align="center">
          Ikuti perjalanan polutan dari cerobong di pesisir Jakarta sampai ke terumbu karang di teluk. Pilih salah satu langkah,
          atau putar seluruh perjalanannya.
        </SectionHeading>

        <div className="connection__grid">
          <div className="connection__visual" data-reveal="left">
            <ConnectionDiagram active={active} onSelect={pick} />
            <div className="connection__controls">
              <button
                className="btn btn--sm"
                onClick={() => {
                  if (!playing && idx === PATHWAYS.length - 1) setActive(PATHWAYS[0].key);
                  setPlaying((v) => !v);
                }}
              >
                <Icon name={playing ? 'pause' : 'play'} size={16} />
                {playing ? 'Jeda' : 'Putar perjalanan'}
              </button>
              <div className="connection__progress" aria-hidden="true">
                {PATHWAYS.map((p, i) => (
                  <span key={p.key} className={i <= idx ? 'is-done' : ''} />
                ))}
              </div>
            </div>
          </div>

          <div className="connection__side" data-reveal="right">
            <ol className="connection__steps">
              {PATHWAYS.map((p, i) => (
                <li key={p.key}>
                  <button className={active === p.key ? 'is-active' : ''} onClick={() => pick(p.key)} aria-pressed={active === p.key}>
                    <span className="connection__num">{i + 1}</span>
                    <Icon name={p.icon} size={18} />
                    {p.title}
                  </button>
                </li>
              ))}
            </ol>
            <article className="connection__detail card" key={active} aria-live="polite">
              <h3>
                {idx + 1}. {step.title}
              </h3>
              <p className="connection__summary">{step.summary}</p>
              <p className="small">{step.detail}</p>
              {(step.air.length > 0 || step.ocean.length > 0) && (
                <div className="connection__params">
                  {step.air.map((k) => (
                    <span key={k} className="pchip pchip--air">
                      {getParameter(k).name}
                    </span>
                  ))}
                  {step.ocean.map((k) => (
                    <span key={k} className="pchip pchip--ocean">
                      {getParameter(k).short || getParameter(k).name}
                    </span>
                  ))}
                </div>
              )}
              <p className="connection__evidence">
                <Icon name="shield" size={18} />
                <span>{step.evidence}</span>
              </p>
            </article>
          </div>
        </div>

        <CausationNote />
      </div>
    </section>
  );
}
