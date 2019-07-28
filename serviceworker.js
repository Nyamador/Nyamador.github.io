importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// // //install service worker
// self.addEventListener('install', e => {
//  	console.log('service worker has been installed');
//  });

// // activate event
// self.addEventListener('activate', e=> {
// 	console.log("service worker activated");
// });