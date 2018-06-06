// Listen for install event, set callback
self.addEventListener('install', function (event) {
    // Perform some task
    event.waitUntil(
        caches.open('rg-wedding-v1').then(function (cache) {
            return cache.addAll([
                '/css/styles.css',
                '/favicon.ico',
                '/js/rsvp.js',
                '/assets/succulent1.png',
                '/assets/amazon.jpg',
                '/assets/hotelhenry.jpg',
                '/assets/us.jpg'
            ]);
        })
    );
});

