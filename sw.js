'use strict';
const CACHE='vaaardstar-v7';
const ASSETS=[
  './',
  './index.html',
  './vaaard.html',
  './google-config.js',
  './js/vs-lib.js',
  './js/vs-features.js',
  './js/vs-ext.js',
  './assets/WebPlus_IBM_VGA_9x16.woff',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './manifest.webmanifest'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

function isAppRequest(url){
  return url.pathname.endsWith('.html')||url.pathname.endsWith('.js')||url.pathname.endsWith('.webmanifest');
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(!url.origin.startsWith(self.location.origin))return;
  if(isAppRequest(url)){
    e.respondWith(
      fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
        }
        return res;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached)return cached;
      return fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
        }
        return res;
      });
    })
  );
});
