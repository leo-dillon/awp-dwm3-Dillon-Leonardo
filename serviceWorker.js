if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
        .then(function (registration) {
        })
        .catch(function (error) {
        });
}

// Nombre del caché
var cacheName = 'rickAndMortyCache';

// Archivos que queremos almacenar en caché
var filesToCache = [
    '/',
    '/index.html',
    '/pag/favoritos.html',
    '/estilos/index.css',
    '/estilos/general.css',
    '/IMG/logo.png',
    '/IMG/rickMorty.png',
    '/IMG/smoke.png',
];

// Evento de instalación
self.addEventListener('install', function (event) {
    // Esperar hasta que el caché esté abierto y los archivos hayan sido añadidos
    event.waitUntil(
        caches.open(cacheName)  // Abre el caché con el nombre dado
            .then(function (cache) {
                return cache.addAll(filesToCache);  // Añade todos los archivos en caché
            })
            .finally(()=>{
                console.log(`cache almacenado ` )
            })
    );
});

// Evento de activación (usualmente usado para limpiar cachés antiguos)
self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (thisCacheName) {
                    if (thisCacheName !== cacheName) {
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch (intercepta las solicitudes de red)
self.addEventListener('fetch', function (event) {

    event.respondWith(
        caches.match(event.request)  // Busca en el caché
            .then(function (response) {
                if(response?.status == 200){
                    // Si el archivo está en caché, devuélvelo
                    return response;

                }                

                // Si no está en caché, hacer la solicitud de red y luego almacenarlo en caché
                    return fetch(event.request)
                        .then(function (response) {
                            return caches.open(cacheName)   
                                .then(function (cache) {
                                // Guardar una copia del archivo en el caché
                                cache.put(event.request, response.clone());
                                return response;  // Devolver el recurso solicitado
                            }
                                .catch(err)
                            );
                        }
                        )
            })
            .catch(err =>  {
                console.error("Error", err)
            })
    );
});
