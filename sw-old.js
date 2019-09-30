// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open('app-shell').then(cache => {
//       cache.add('./main-base.html');
//     })
//   );
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.response);
//     })
//   )
// });



//in webpack config 

//const WorkboxPluign = require("workbox-webpack-plugin");

//in  plugins array
// new WorkboxPluign.InjectManifest({
//   swSrc: "./src-sw.js",
//   swDest: "sw.js"
// })


//swSsrc
// Workbox.precaching.precacheAndRoute
//   (self.__precacheManifest);

//after running build script new files will be generated

//Workbox strategies
// new workbox.strategies.NetworkFirst()
// new workbox.strategies.CacheFirst()
// new workbox.strategies.StaleWhileRevalidate()

//if the filename is in the same domain then the filename is used 
//for files in different domains, use the full https url 
fetch('https://pluralsight-pwa-scratch.firebaseio.com/flights.json')
  .then(response =>
    response.json()
  )
  .then(data => {
    let html = "";
    data.forEach(flight => {
      html += `<div class="card">${flight.city}</div>`;
    });
    document.
      console.log(data);
  });