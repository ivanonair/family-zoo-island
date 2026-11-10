# Wildwonder Island

An original, playful 3D family zoo island. Explore with Ivan, Renee, Mike and Nina; visit the savanna, lagoon, jungle and amusement park. All 3D models are built from original Three.js primitives; no third-party character assets are used.

## Run locally

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To build a static production site, run `npm run build`; output is in `dist/`. Preview it with `npm run preview`. A static web server is needed; do not open the built HTML using `file://`.

Drag to orbit, scroll or pinch to zoom, select a destination to fly there, and use Reset view to return. The help button opens a field guide. The scene respects reduced-motion preferences.

Three.js is installed locally and bundled by Vite. The optional Google Fonts stylesheet requires an internet connection; the site uses system fallback fonts when offline. No deployment or remote repository is configured.
