
/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
import {cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute} from 'workbox-precaching';
import {NavigationRoute, registerRoute, Route} from 'workbox-routing';
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
    if (event.data && DeviceOrientationEvent.data.type === 'SKIP_WAITING')
    {
        self.skipWaiting()
    }
})

// self.__WP_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

//clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
allowlist  = [/^\/\/$/]

const handlerUrl = import.meta.env.DEV ? '/' : '/fmap/'

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL(handlerUrl),
    {allowlist}
))

/**
 * Cache all same origin requests with stale while revalidate
 */
registerRoute(new Route(({request, sameOrigin}) => {
    return sameOrigin;
}, new StaleWhileRevalidate({
    cacheName: 'networkRequests'
})))

/**
 * Cache opaque response from maps
 */
registerRoute(new Route(({url}) => {
    console.log({url, tsTest: url.toString().startsWith('https://tile.openstreetmap.org')})
    return url.toString().startsWith('https://tile.openstreetmap.org');
}, new CacheFirst({
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200]
        })
    ]
})))

console.info('registered sw')