import { type Writable, writable, type Updater, StartStopNotifier } from "svelte/store";
import { building } from "$app/environment";


/** Writable interface for both updating and subscribing. */
export interface RuntimeWritable<T> extends Writable<T> {}

/**
 * Writable which only calls it's start/stop notifiers during Svelte's runtime,
 * and are never called during the build phase.
 */
export function runtime_writable<T>(
  value?: T, start?: StartStopNotifier<T>
): RuntimeWritable<T> {
  let cleanup_prematurely = false;
  let cleanup: () => void = () => { cleanup_prematurely = true };

  const inner: Writable<T> = writable(value, () => cleanup);

  if (!building) {
    if (start != undefined) {
      const stop = start(inner.set);

      if (stop != undefined) {
        cleanup = stop;
        if (cleanup_prematurely) { cleanup(); }
      }
    }
  }

  return inner;
}
