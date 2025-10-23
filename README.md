# Prototype Mineral AI

Prototype front-end built with [Vite](https://vitejs.dev/) (React + TypeScript) and Tailwind CSS to visualise the mineral footprint of a cuvée.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173). Hot reloading is enabled by default.

## Build & lint

```bash
npm run build
npm run preview   # optional, serve the production bundle locally
npm run lint      # run ESLint across the project
npm run format    # format source files with Prettier
```

## Project structure

```
/public
  bottle.svg        # hero bottle placeholder displayed in the product panel
/src
  components/       # UI modules (ProductPanel, RadarPanel, ElementsGrid, etc.)
  data/             # SAMPLE definition and mineral elements list
  hooks/            # shared React hooks
  lib/              # cross-cutting utilities (ActiveElementContext)
```

## Customisation

- Replace `public/bottle.svg` with the final product shot (transparent PNG or SVG recommended).
- Add any design reference imagery you need under `public/` (for example, export files from Figma) — keep them lightweight and remove them when they are no longer required.
- Edit `/src/data/sample.ts` to change the cuvée name or featured key elements.
- Edit `/src/data/elements.ts` to update the mineral matrix values, categories or order.

## Tooling

- [Tailwind CSS](https://tailwindcss.com/) powers the design tokens (see `tailwind.config.js`).
- [Apache ECharts](https://echarts.apache.org/) renders the interactive radar chart via `echarts-for-react`.
- Icons provided by [lucide-react](https://github.com/lucide-icons/lucide) (import where needed).
- ESLint + Prettier enforce consistent code style (`npm run lint` / `npm run format`).

## Deployment

The app is a static Single Page Application. Run `npm run build` to generate the production bundle under `dist/`.

Deploy the contents of `dist/` to any static host (GitHub Pages, Netlify, Vercel, etc.). For GitHub Pages you can copy the bundle to the `gh-pages` branch or wire it through an automated workflow.
