import adapter from '@sveltejs/adapter-node';

import { importAssets } from 'svelte-preprocess-import-assets';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
  },
  files: {
    serviceWorker: "src/service-worker"
  },
  preprocess: [importAssets(), vitePreprocess()],
  prerender: true,
  serviceWorker: {
    register: true
  }
};
