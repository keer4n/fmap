import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {

	preprocess: [
		preprocess({
			sourceMap: true,
			typescript: true
		})
	],
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false
		},
		files: {
			serviceWorker: 'src/service-worker/index.ts'
		}
	}
};

export default config;
