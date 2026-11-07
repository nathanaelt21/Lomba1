# SEAIR — Sky to Sea

Immersive environmental intelligence platform connecting **air quality** and **ocean quality**.
Prototype focus: **Teluk Jakarta**.

> All values shown are **DEMO DATA** generated in the browser. No official source
> (BMKG, KLH, ISPU Jakarta, Unpad PODC) is connected yet.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Deploy (Vercel)

`vercel.json` is included (Vite preset, SPA rewrites, cache headers).

```bash
npx vercel deploy --prod
```

## Stack

React 18 · Vite · React Router · GSAP + ScrollTrigger · Canvas (wind & wave engines) ·
Chart.js · Leaflet (OpenStreetMap tiles)

## Project structure

```
src/
  animations/   GSAP setup, scroll reveal, canvas engines (windField, waveSurface)
  components/   brand, layout (Navbar, Footer, PageHero), ui, charts, data, map, illustrations
  sections/     landing-page sections (HeroJourney, TwoWorlds, Air, Ocean, Data, Connection, Map, Action)
  pages/        Home, Air, Ocean, Explore, Insights, About, NotFound
  data/         parameter catalogue, stations, sources, pathways, mock/demoGenerator
  services/     dataProvider.js — single entry point for all data (demo ↔ API)
  hooks/        async, motion/in-view, localStorage
  utils/        ISPU, stats, formatting, season, status helpers
  styles/       design tokens, global styles, shared components
```

## Connecting real data

All UI reads data through `src/services/dataProvider.js`. Implement `apiAdapter`
there and run with `VITE_DATA_MODE=api`. Every response must keep the same envelope
(source, retrievedAt, location, unit, points, isDemo) so the interface keeps
showing source, time, unit and location for each value.

## Notes

- Reference thresholds (PP 22/2021 Annex VII & VIII, PermenLHK P.14/2020) are
  indicative and must be verified against the official texts before using real data.
- Station coordinates are approximate.
- OpenStreetMap public tiles are fine for a prototype; use a dedicated tile provider in production.
