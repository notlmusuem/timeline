import { Writable, writable } from "svelte/store";

// window width
export const windowWidth: Writable<number> = writable(1920);

// window height
export const windowHeight: Writable<number> = writable(1080);

// scrollY position
export const scrollY: Writable<number> = writable(0);

// scrollX position
export const scrollX: Writable<number> = writable(0);

export const mobile: Writable<boolean> = writable(false);
