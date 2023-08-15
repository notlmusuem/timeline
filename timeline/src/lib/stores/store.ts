import { type Tweened, tweened } from "svelte/motion";
import { type Writable, writable } from "svelte/store";
import { default as Cookies } from "js-cookie";


// local storage stores
const localStorageN = typeof localStorage !== "undefined"
  ? localStorage : null;

// current motion preference
export const reduceMotionStore: Writable<boolean> = writable(
  localStorageN?.reduceMotion === "true" ?? false
);
reduceMotionStore.subscribe(value => {
  if (localStorageN != null) { localStorageN.reduceMotion = value; }
});

// current font size
export const currentSizeStore: Writable<number> = writable(
  parseFloat(localStorageN?.currentSize ?? "1.2")
);
currentSizeStore.subscribe(value => {
  if (localStorageN != null) { localStorageN.currentSize = value; }
});

// current theme
export const themeStore: Writable<string> = writable(localStorageN?.theme ?? "light-theme");
themeStore.subscribe(value => {
  if (localStorageN != null) { localStorageN.theme = value; }
});

export const kioskMode: Writable<boolean> = writable();
kioskMode.subscribe(value => {
  if (localStorageN != null) { localStorageN.kioskMode = value; }
});
kioskMode.update(_ =>
  localStorageN?.kioskMode === "true"
  || Cookies.get("kioskMode") === "true"
  || false
);

// current selected timeline store
export const selectedTimelineStore = writable();

// year tweened
export const year: Tweened<number> = tweened(0, {
  duration: 750,
  easing: expoOut,
  interpolate: (a, b) => (t) => a + (b - a) * t,
});

function expoOut(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// transition direction
export const direction: Writable<string> = writable("down");

// item editing mode store
export const mode: Writable<string> = writable("default");


export function resetStores() {
  reduceMotionStore.set(false);
  currentSizeStore.set(1.2);
  themeStore.set("light-theme");
  kioskMode.set(false);

  localStorageN?.clear();
}
