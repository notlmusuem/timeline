/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
import { build, files, version } from "$service-worker";

let CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

let current_version = version;


async function addFilesToCache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(ASSETS);
}

async function deleteOldCaches() {
  for (const key of await caches.keys()) {
    if (key !== CACHE) { await caches.delete(key); }
  }
}


self.addEventListener("install", (event) => {
  event.waitUntil(new Promise<void>(async resolve => {
    await ssr_update_try();
    resolve();
  }));
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(new Promise<void>(async resolve => {
    await ssr_update_try();
    await deleteOldCaches();
    resolve();
  }));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(new Promise(async resolve => {
    await ssr_update_try();

    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    if (ASSETS.includes(url.pathname)) {
      resolve(cache.match(event.request));
    }

    try {
      const response = await fetch(event.request);

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      resolve(response);
    } catch {
      resolve(cache.match(event.request));
    }
  }));
});


async function ssr_update_check(): Promise<string|null> {
  // only check if the last check was longer than 10 minutes ago
  if (Date.now() <= parseInt(current_version) + 30*1000) {
    return null;
  }

  const res = await fetch("/_app/version.json");
  if (res.status / 100 != 2) {
    // the server is down? we really want to avoid reloading and having a
    // browser error page pop up
    return null;
  }

  const ssr_version = (await res.json()).version as string;
  return ssr_version > current_version ? ssr_version : null;
}

async function ssr_update_try() {
  const ssr_version = await ssr_update_check();
  if (ssr_version != null) {
    current_version = ssr_version;
    CACHE = `cache-${ssr_version}`;

    await addFilesToCache();

    // ask controlled windows to reload themselves; see app.html
    for (const client of await (
      (
        // @ts-ignore
        clients as Clients
      ).matchAll({ includeUncontrolled: true })
    )) {
      client.postMessage({ type: "reload" });
    }

    // update ourselves if changed
    await (
      // @ts-ignore
      registration as ServiceWorkerRegistration
    ).update();
  }
}
