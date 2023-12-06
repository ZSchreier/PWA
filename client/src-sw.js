const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// Set up page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// I have removed some of the commented section provided by our instructor Gary Almes to shorten the length of the file while leaving in the main to-do statements provided to us for this assignment.
/*

  TODO:

  In the code below, we only want to register a route if the requested 
  destination contains "style", "script", or "worker". So, first, create an 
  array with these three strings.

  Something like:
     const paths = []   // complete the array

  We also need to be able to reference whatever destination is being sought. This 
  is part of the {request} object being injected below. So we would get that value 
  from  request.destination

  We then want to verify that the requested destination contains one item in that 
  array. There is an array method called includes() which does this.

  Once we have identified a viable route, we will instantiate the strategy we wish 
  to use. Remember that it's called StaleWhileRevalidate.

  If you supply the correct values below, this file is complete.
*/

const paths = ['style', 'script', 'worker']

registerRoute( ({ request }) => paths.includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
