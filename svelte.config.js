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
		paths: {
			base: '/fmap'
		},
		prerender: {
			handleHttpError({path, referrer, message}) {
				console.info({path, referrer, message})

			}
		}
		// files: {
		// 	serviceWorker: 'src/service-worker/index.ts'
		// }
	}
};

export default config;
