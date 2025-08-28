/**
 * Service Worker
 * 提供离线功能和缓存
 */

const CACHE_NAME = 'image-compressor-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/normalize.css',
    '/css/styles.css',
    '/js/app.js',
    '/js/image-processor.js',
    '/js/ui-manager.js',
    '/js/storage-manager.js',
    '/js/batch-processor.js',
    '/lib/browser-image-compression.min.js',
    '/lib/jszip.min.js',
    '/assets/favicon.ico',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/assets/upload-icon.svg',
    '/manifest.json'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: 安装中');
    
    // 预缓存静态资源
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: 缓存资源');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                // 强制激活
                return self.skipWaiting();
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: 激活');
    
    // 清理旧缓存
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 清理旧缓存', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // 立即接管所有客户端
            return self.clients.claim();
        })
    );
});

// 处理请求
self.addEventListener('fetch', (event) => {
    // 跳过不支持的请求
    if (event.request.method !== 'GET') return;
    
    // 跳过浏览器扩展请求
    if (!(event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))) return;
    
    // 网络优先策略
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 如果请求成功，克隆响应并缓存
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // 如果网络请求失败，尝试从缓存获取
                return caches.match(event.request);
            })
    );
});