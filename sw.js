const CACHE_NAME = 'student-dashboard-v1';
// لیست تمام فایل‌ها و منابع خارجی حیاتی که باید برای استفاده آفلاین کش شوند.
const urlsToCache = [
  './', // صفحه اصلی (index.html)
  'index.html',
  'manifest.json',
  // منابع ثابت خارجی
  'https://cdn.tailwindcss.com', // Tailwind CSS
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght=400;500;700&display=swap', // Vazirmatn Font CSS
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', // Font Awesome
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js', // Firebase SDK
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  // مسیرهای تصحیح شده برای آیکون‌ها (استفاده از ./ به جای /)
  './icons/icon-72x72.png', 
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// رویداد نصب (Install Event): کش کردن منابع اصلی
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Opened cache and adding shell assets');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Failed to cache required assets:', err);
        });
      })
  );
});

// رویداد واکشی (Fetch Event): ارائه محتوای کش شده
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر در کش بود، آن را برگردان
        if (response) {
          return response;
        }
        // اگر در کش نبود، درخواست را به شبکه بفرست
        return fetch(event.request);
      })
  );
});

// رویداد فعال‌سازی (Activate Event): پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
