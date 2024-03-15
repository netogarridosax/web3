// ao fazer requisição, adiciona cabeçalho
self.addEventListener('fetch', function (event) {
    console.log('teste pwa')
    let req = new Request(event.request, {
        headers: { "foo": "bar" }
    });
    event.respondWith(fetch(req));
});

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('cache-v1').then(function(cache) {
        return cache.addAll([
          '/',
        //  '/index.html',
          '/_img/logo.png'
        ]);     
      })   
    ); 
  });
  