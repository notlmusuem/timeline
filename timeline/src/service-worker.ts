/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
import { build, files, version } from "$service-worker";

let CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];


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
  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(new Promise(async () => {
    if (!await caches.has(CACHE)) { await addFilesToCache(); }

    await deleteOldCaches();
  }));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(new Promise(async () => {
    if (!await caches.has(CACHE)) { await addFilesToCache(); }

    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    if (ASSETS.includes(url.pathname)) {
      return cache.match(event.request);
    }

    try {
      const response = await fetch(event.request);

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch {
      return cache.match(event.request);
    }
  }));
});

async function ssr_update_check(): Promise<string|null> {
  const res = await fetch("/_app/version.json");
  if (res.status / 100 != 2) {
    // the server is down? we really want to avoid reloading and having a
    // browser error page pop up
    return null;
  }

  const ssr_version = (await res.json()).version as string;
  console.dir(ssr_version, version);
  return ssr_version > version ? ssr_version : null;
}

async function ssr_update_try() {
  const ssr_version = await ssr_update_check();
  if (ssr_version != null) {
    CACHE = `cache-${ssr_version}`;

    for (const client of await (
      (
        // @ts-ignore
        clients as Clients
      ).matchAll({ includeUncontrolled: true })
    )) {
      client.postMessage({ type: "reload" });
    }
  }
}

setInterval(ssr_update_try, 5*1000);  // 10 minutes
