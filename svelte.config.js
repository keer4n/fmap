import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const productionEnv = process.env.NODE_ENV == 'production';

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
			base: productionEnv ? '/fmap' : ''
		},
		prerender: {
			handleHttpError({path, referrer, message}) {
				console.info({path, referrer, message})

			}
		},
		files: {
		}
	}
};

export default config;
