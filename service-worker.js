const CACHE_NAME = 'qwzj-v1.0.3.3';

self.addEventListener('install', event => {
	console.log('进行缓存');
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll([
				'/',
				// '/unpackage/res/icons/144x144.png',
				// 'index.html',
				// 'template.html',
			]).then(() => {
				console.log('成功缓存');
			}).catch(error => {
				console.error('缓存失败:', error);
			});
		})
	);
});

self.addEventListener('fetch', event => {
	if (event.request.url.startsWith(self.location.origin)) { // 只处理同源请求
		event.respondWith(
			caches.match(event.request).then(response => {
				if (response) {
					console.log('从缓存中返回:', event.request.url);
					return response;
				}
				console.log('进行网络请求:', event.request.url);
				return fetch(event.request).then(networkResponse => {
					return caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, networkResponse.clone());
						return networkResponse;
					});
				});
			}).catch(error => {
				console.error('请求失败:', error);
			})
		);
	}
});

self.addEventListener('activate', event => {
	console.log('激活 Service Worker');
	const cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (!cacheWhitelist.includes(cacheName)) {
						console.log('删除旧缓存:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
