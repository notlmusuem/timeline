<script lang="ts">
  import { browser } from "$app/environment";
  import { sleep, structuredCloneProto } from "$lib/utils";
  import {
    type ComponentType, type SvelteComponentTyped, onMount, onDestroy,
    beforeUpdate, tick, getAllContexts

  } from "svelte";
  let frame: HTMLIFrameElement;

  export let component: ComponentType;
  export let props: object = {};

  let instance: SvelteComponentTyped|null = null;
  let renderTarget: HTMLElement|null = null;

  let context: Map<any, any>;
  if (browser) {
    context = getAllContexts();
  }

  beforeUpdate(async () => {
    if (instance !== null && renderTarget != null && frame.contentWindow !== null) {
      instance.$set(structuredCloneProto(props));

      const frameDoc = frame.contentWindow.document;
      frameDoc.documentElement.replaceChild(renderTarget, frameDoc.body);
      await tick();
    }
  });

  // when props is updated, trigger reactivity on the frame component
  $: if (browser && instance !== null) {
    instance.$set(structuredCloneProto(props));
  }

  export async function refresh(width: string, wait_load_event = false): Promise<void> {
    return new Promise(async resolve => {
      if (frame.contentDocument == null || frame.contentWindow == null) {
        throw new Error("Frame is uninitalized.");
      }

      if (instance != null) { instance.$destroy(); }
      instance = null;
      await tick();
      if (renderTarget != null) { renderTarget.innerHTML = ""; }
      await tick();

      frame.contentWindow.focus();
      if (!wait_load_event) {
        frame.onload = async () => {
          frame.onload = null;
          await tick();
          resolve();
        };
      }

      await tick();
      frame.contentWindow.document.documentElement.style.padding = "0";
      frame.contentWindow.document.documentElement.style.margin = "0";
      frame.contentWindow.document.body.style.padding = "0";
      frame.contentWindow.document.body.style.margin = "0";
      frame.contentWindow.document.documentElement.style.width = width;
      await tick();

      renderTarget = frame.contentDocument.body;

      instance = new component({
        target: renderTarget,
        props: props,
        context: context,
        hydrate: false
      });

      if (wait_load_event) {
        instance.$on("load", async () => {
          await tick();
          resolve();
        });
      }
      await tick();
    });
  }

  export function destroy() {
    if (instance != null) { instance.$destroy(); }
    instance = null;
  }

  export async function print(): Promise<void> {
    return new Promise(async resolve => {
      if (frame.contentWindow == null) {
        throw new Error("Frame is uninitalized.");
      }

      frame.contentWindow.addEventListener("afterprint", async () => {
        await tick();
        resolve();
      });
      await tick();
      frame.contentWindow?.print();
    });
  }

  onDestroy(() => {
    instance?.$destroy();
  });
</script>

<iframe bind:this={frame} aria-hidden="true"
  style:display="none"
  style:position="fixed"
  style:top="0%"
  style:left="0%"
  title="Hidden frame for printing"
  ></iframe>
