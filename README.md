# Standup Turns

**Live demo: https://arsham1024.github.io/standup-turns/**

A tiny SvelteKit app for running daily standups. Keep a list of participants,
**shuffle** the speaking order, and give each person a countdown timer so nobody
hogs the meeting. Everything is saved in your browser, so your list and settings
survive a refresh.

Built with SvelteKit, Tailwind CSS, and [shadcn-svelte](https://www.shadcn-svelte.com/)
UI components, with [lucide](https://lucide.dev/) icons.

## Features

- Add and remove participants
- Shuffle the order randomly
- Click a name to start their countdown; click again to pause. Only one person
  runs at a time (the current speaker)
- Adjustable per-person time budget (default 2 minutes)
- Live progress bar and remaining time, with a red warning in the final seconds
- Mark someone done, reset one person, or reset everyone
- Light / dark theme toggle
- State persists to `localStorage`

## Running it

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Then open the URL that Vite prints (by default http://localhost:5173/).

To build a production version:

```bash
npm run build
npm run preview
```

## Controls

- **Shuffle** — randomize the order and reset all timers
- **Reset all** — clear everyone's timers and done state
- **Minutes each** — set the per-person time budget
- Click a **name** — start / pause that speaker's countdown
- **✓** — mark a person done · **↺** — reset their timer · **🗑** — remove them
- **Add** — add a new name (or press Enter in the field)
- **☀ / ☾** — toggle light / dark theme

## Deploying to GitHub Pages

The app is hosted on GitHub Pages at
**https://arsham1024.github.io/standup-turns/**.

It builds as a fully static, client-side site:

- `@sveltejs/adapter-static` prerenders the app into a `build/` folder
- `svelte.config.js` sets `paths.base` to `/standup-turns` for production (the
  repo name), so assets resolve under the project-page URL
- `.github/workflows/deploy.yml` builds and publishes to Pages on every push to
  `main` (and can be run manually from the Actions tab)

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. After that, merging to `main` deploys automatically.

## Project layout

- `src/routes/+page.svelte` — the whole app: participant list, shuffle, timers, persistence
- `src/routes/+layout.js` — loads global styles and enables prerendering
- `src/lib/components/ui/` — shadcn-svelte components (button, card, progress)
- `src/lib/utils.ts` — `cn` class-merge helper
- `src/app.css` — Tailwind entry + theme tokens
- `tailwind.config.ts`, `postcss.config.js`, `svelte.config.js`, `vite.config.ts` — tooling config
- `.github/workflows/deploy.yml` — builds and publishes to GitHub Pages

## Tech

SvelteKit 2 · Svelte 4 · Tailwind CSS 3 · shadcn-svelte / bits-ui · lucide · Vite 5 · TypeScript
