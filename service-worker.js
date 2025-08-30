/**
 * 图片压缩工具 Service Worker
 * 版本: 1.0.0
 */

const CACHE_NAME = 'image-compressor-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/privacy.html',
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
  '/assets/social-preview.jpg',
  '/manifest.json'
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存应用资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('删除旧缓存:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截 - 优先使用缓存，网络请求作为备用
self.addEventListener('fetch', event => {
  // 跳过不支持缓存的请求
  if (event.request.method !== 'GET') return;
  
  // 跳过非同源请求
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // 否则发起网络请求
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应是流，只能使用一次
            const responseToCache = response.clone();
            
            // 将新响应添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，尝试返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('网络请求失败，无法获取资源', {
              status: 408,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});