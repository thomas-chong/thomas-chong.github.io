'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "4435b13dc2e53b64f83f541bceb71edf",
"assets/assets/badges/1.gif": "ba13ae770d11bb70b16499bebb527973",
"assets/assets/badges/2.gif": "287da3f25e72037323fbd8dae6e2e014",
"assets/assets/badges/3.gif": "bcbd01a71cc5809c8c88df6a103bf394",
"assets/assets/badges/4.gif": "3f2b71e874e3e8427937c291e0791bdc",
"assets/assets/badges/5.gif": "0e1f6ace499d43543a62c1537037e610",
"assets/assets/badges/6.gif": "f2b619439abfc74058d9a420e7f1aae4",
"assets/assets/badges/7.gif": "1b92ec127cf7a9634d96f514dbdeedd2",
"assets/assets/badges/8.gif": "3f43bf92500ca8c8b56e3b2e79ebb27c",
"assets/assets/badges/9.gif": "51acc61233e5d0d0012fc93eb8be3608",
"assets/assets/calculators/1.gif": "46f5cfce69f48c4031d0e7cc9a44c496",
"assets/assets/calculators/2.png": "721e350d81fcb3a742acd077380d7191",
"assets/assets/calculators/3.gif": "659c7bdcf526e206e07309d16af8f63c",
"assets/assets/calculators/4.png": "9edf64d63f78392c1fdd807c5477be11",
"assets/assets/icon/arrow_back-24px.svg": "3bd6d7e475dcea75681d1f3e906afc17",
"assets/assets/icon/arrow_forward-24px.svg": "66bdaa19de6d81da504a90fd5a6abe10",
"assets/assets/icon/dashboard-24px.svg": "ac97184c7e4eab8892061afa39e65b67",
"assets/assets/icon/format_list_bulleted-24px.svg": "f3b50208677e437d17ff70c41c8f76da",
"assets/assets/icon/home-24px.svg": "2f9e50125cf088727e42620a9e7a6477",
"assets/assets/icon/timer-24px.svg": "cdca716ea099b04681104e7aadaca85e",
"assets/assets/learn/1.jpg": "9579e8f28cf99038030b930f943211eb",
"assets/assets/learn/10.jpg": "0806855d88bec2d61cbd0c777f4d9900",
"assets/assets/learn/11.jpg": "262062938047f85405242ae3bb8559b2",
"assets/assets/learn/2.jpg": "aa3e6a4045fd0be01ce604586f1ae25a",
"assets/assets/learn/3.jpg": "663fcf96c90c3ba14de4621fc7c1b3a4",
"assets/assets/learn/4.jpg": "e08f3f852d399ef2f4544308adc5ecf5",
"assets/assets/learn/5.jpg": "734327ca29bc922c5648136e84ce67ba",
"assets/assets/learn/6.jpg": "6a35fa8306c247394e47c01ea83c0431",
"assets/assets/learn/7.jpg": "7e3ca237a7edd2ee0c19b9665e0d4a68",
"assets/assets/learn/8.jpg": "695e83d86c5af33870a9c9ecb7531b40",
"assets/assets/learn/9.jpg": "22c183555f7836858b2b7a4933a99c67",
"assets/assets/logo/Picture1.png": "838d2c8f629ddcba813fb6349ff6a9f0",
"assets/assets/map/asia.json": "ee380919869b5ad3e1ea7eb7ba85b7c0",
"assets/assets/quiz_pic/image1.webp": "ed2b1bd6a087b5629f3173ec8535ebe2",
"assets/assets/quiz_pic/image10.gif": "b8ab1709a7600097829399a9e5e80d42",
"assets/assets/quiz_pic/image11.gif": "d078cb935c6f2fbf7c8ca7d42ce6d976",
"assets/assets/quiz_pic/image12.gif": "21ecb204b545e95dd0f49ea62d2f65fb",
"assets/assets/quiz_pic/image13.gif": "21a771c8640df917ccf339e4d0226e82",
"assets/assets/quiz_pic/image14.gif": "e77d553250477a8cf3811327394c52e5",
"assets/assets/quiz_pic/image15.gif": "a37f0339722c37cd1357d12429440a11",
"assets/assets/quiz_pic/image16.gif": "4846fc2608f827e79cd8450d4652ee95",
"assets/assets/quiz_pic/image17.gif": "5e56489f13c133f10463c31a11d48a47",
"assets/assets/quiz_pic/image18.jpeg": "48107922ee5e66a7518c1f49d066c896",
"assets/assets/quiz_pic/image19.jpeg": "990a31d2169110fb804943066c33427c",
"assets/assets/quiz_pic/image2.gif": "73fad6ba538cd01afe488193b254bca7",
"assets/assets/quiz_pic/image20.jpeg": "566011694f1d23e10343b59d54b8b271",
"assets/assets/quiz_pic/image21.jpeg": "de44315956feb2c36aa6f56e53fcfb18",
"assets/assets/quiz_pic/image3.gif": "785d8ed8edd924b94b4967b71d85b52a",
"assets/assets/quiz_pic/image4.gif": "f6108c00dd6cef2e476adbe51b5de70d",
"assets/assets/quiz_pic/image5.gif": "b168c0b68b8ceaa68b1196a629dfc43a",
"assets/assets/quiz_pic/image6.gif": "34342aa8c96a7da74d60367f53ff307a",
"assets/assets/quiz_pic/image7.gif": "23718cb41fe62cb5e1aa5c8dc96226fe",
"assets/assets/quiz_pic/image8.gif": "8574f300f509dbf447966022e8580f8f",
"assets/assets/quiz_pic/image9.gif": "37192114d5bdd505d40d4ddec81e6652",
"assets/assets/quiz_question/question.json": "d2ffb01f01aea9fd2cf9a6492d8c5af5",
"assets/assets/quiz_result_pic/image1.jpeg": "de44315956feb2c36aa6f56e53fcfb18",
"assets/assets/quiz_result_pic/image2.jpeg": "e7578daebad7feaab3b41c96cdbdec49",
"assets/assets/quiz_result_pic/image3.jpeg": "990a31d2169110fb804943066c33427c",
"assets/assets/quiz_result_pic/image4.jpeg": "48107922ee5e66a7518c1f49d066c896",
"assets/FontManifest.json": "609eac930dc871cd01fd03805727256c",
"assets/fonts/gilroy/Gilroy-Bold.ttf": "3cf0ee273a0b3f022234b6572c3b78f9",
"assets/fonts/gilroy/Gilroy-Medium.ttf": "6444f14adcdee041b62184f13139a56d",
"assets/fonts/gilroy/Gilroy-Regular.ttf": "ae5e7255973ffe09b53f07a2805232a8",
"assets/fonts/icons/MaterialIcons-Regular.ttf": "8ef52a15e44481b41e7db3c7eaf9bb83",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/NOTICES": "b514f93bf9d8b16df81d9b8b2d38819b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "29b8c740c5ce691422d35423e2466f32",
"/": "29b8c740c5ce691422d35423e2466f32",
"main.dart.js": "8e834f3520edf3e05e7ca740d03a4405",
"manifest.json": "c07add488385df0cd851f22303f5401a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }
  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
