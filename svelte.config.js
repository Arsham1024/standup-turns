import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// When building for GitHub Pages the app is served from
// https://<user>.github.io/standup-turns/, so it needs that base path.
// In dev it is served from the root.
const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Static adapter so the app can be hosted on GitHub Pages.
		// fallback gives us a single-page-app entry that boots the client router.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : '/standup-turns'
		}
	}
};

export default config;
