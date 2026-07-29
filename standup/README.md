# Standup Turns

A tiny SvelteKit app for running daily standups. It keeps a list of
participants, lets you **shuffle** the speaking order, and gives each person a
2‑minute countdown timer so nobody hogs the meeting.

Built with SvelteKit, Tailwind CSS, and [shadcn-svelte](https://www.shadcn-svelte.com/)
UI components.

## Features

- Add and remove participants
- Shuffle the order randomly
- Click a name to check them off and start their 2‑minute (120s) timer
- Live "time remaining" countdown with a progress bar
- Click again to reset a person's timer

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

## Usage

- **+** button — open the modal to add a new name (press Enter or "Add Name")
- **Shuffle** — randomize the order and reset all timers
- Click a **name** — toggle it done and start/stop that person's timer
- **delete** — remove a participant

## Project layout

- `src/routes/+page.svelte` — the whole app: participant list, shuffle, timers
- `src/routes/+layout.js` — loads global styles
- `src/lib/components/ui/` — shadcn-svelte components (button, card, carousel, table, progress)
- `src/app.css` — Tailwind entry + global styles
- `tailwind.config.ts`, `postcss.config.js`, `svelte.config.js`, `vite.config.ts` — tooling config

## Tech

SvelteKit 2 · Svelte 4 · Tailwind CSS 3 · shadcn-svelte / bits-ui · Vite 5 · TypeScript
