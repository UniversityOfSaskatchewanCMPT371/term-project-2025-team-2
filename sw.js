/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-3c498241'], (function (workbox) { 'use strict';

  workbox.enable();
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "android-chrome-192x192.png",
    "revision": "529682d45c12977b0999a61bf96ceddb"
  }, {
    "url": "android-chrome-512x512.png",
    "revision": "ae68a3429b51f884211cebf8011bc4eb"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "c84a151eb988fc8574c09a2eb4697489"
  }, {
    "url": "assets/AutoAnonTagsEdit-BH1Ib1Q5.js",
    "revision": null
  }, {
    "url": "assets/CheckCircleIcon-CPYMWkLM.js",
    "revision": null
  }, {
    "url": "assets/DicomParserUtils-CHc048-D.js",
    "revision": null
  }, {
    "url": "assets/DicomTable-CiSlMsNJ.js",
    "revision": null
  }, {
    "url": "assets/DictTagsEdit-FVlKzN_X.js",
    "revision": null
  }, {
    "url": "assets/FileUploader-D9efa30r.js",
    "revision": null
  }, {
    "url": "assets/index-C4q8w-ZQ.js",
    "revision": null
  }, {
    "url": "assets/index-hiibqYi6.css",
    "revision": null
  }, {
    "url": "assets/Sidebar-Oi2_Jqyt.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-B9K5rw8f.js",
    "revision": null
  }, {
    "url": "favicon.ico",
    "revision": "856dabcfc9e7a915ab877b2495e97ce3"
  }, {
    "url": "icon-512.png",
    "revision": "22479316f56895e8dd84af4c1619e1b2"
  }, {
    "url": "index.html",
    "revision": "acf1a5f36e1bb17eb063abc56659cebb"
  }, {
    "url": "maskable_icon.png",
    "revision": "ae68a3429b51f884211cebf8011bc4eb"
  }, {
    "url": "android-chrome-192x192.png",
    "revision": "529682d45c12977b0999a61bf96ceddb"
  }, {
    "url": "android-chrome-512x512.png",
    "revision": "ae68a3429b51f884211cebf8011bc4eb"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "c84a151eb988fc8574c09a2eb4697489"
  }, {
    "url": "favicon.ico",
    "revision": "856dabcfc9e7a915ab877b2495e97ce3"
  }, {
    "url": "maskable_icon.png",
    "revision": "ae68a3429b51f884211cebf8011bc4eb"
  }, {
    "url": "manifest.webmanifest",
    "revision": "517ba02653d4f9384b5807e9df5e0491"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map
