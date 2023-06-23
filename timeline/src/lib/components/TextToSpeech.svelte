<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onDestroy, onMount } from "svelte";

  export let texts: (string|null)[];

  let speaking = false;
  let currentUtterance: SpeechSynthesisUtterance|null;
  let voice: SpeechSynthesisVoice;

  function text2Speech() {
    if (!speaking) {
      let utterances: SpeechSynthesisUtterance[] = texts
        .filter(text => text != null)
        .map(text => new SpeechSynthesisUtterance(text as string));

      utterances.forEach((utterance) => {
        utterance.voice = voice;
        utterance.lang = "en-US";
        utterance.rate = 0.75;
        utterance.pitch = 1;
      });

      utterances = notNullArray(utterances);

      for (const utterance of utterances) {
        utterance.onend = () => {
          if (currentUtterance === utterance) {
            currentUtterance = null;
            speaking = false;
          }
        };
        speechSynthesis.speak(utterance);
      }
      currentUtterance = utterances[utterances.length - 1];
      speaking = true;
    }
  }

  function notNullArray(
    utterances: SpeechSynthesisUtterance[]
  ): SpeechSynthesisUtterance[] {
    const newUtterances: SpeechSynthesisUtterance[] = [];
    for (let i = 0; i < utterances.length; i++) {
      const utterance = utterances[i];
      if (utterance.text != "null") {
        newUtterances.push(utterance);
      }
    }
    return newUtterances;
  }

  function stop() {
    if (speaking) {
      speechSynthesis.cancel();
      currentUtterance = null;
      speaking = false;
    }
  }

  function cleanupSpeech() {
    if (speaking) {
      speechSynthesis.cancel();
    }
  }

  onMount(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      voice = window.speechSynthesis.getVoices().filter(function (voice) {
        return voice.name == "Microsoft Zira - English (United States)";
      })[0];
    };
  });

  onDestroy(() => {
    cleanupSpeech();
  });
</script>

<div class="tts-container">
  {#if speaking}
    <button title="Stop reading" class="text2Speech" on:click={stop}>
      <span class="material-symbols-rounded">stop</span>
    </button>
    <img class="playing" src="$lib/assets/icons8-audio-wave.gif" alt="Audio wave" in:slide={{axis:'x'}}/>
  {:else}
    <button title="Read aloud" class="text2Speech" on:click={text2Speech}>
      <span class="material-symbols-rounded">volume_up</span>
    </button>
  {/if}
</div>

<style>
  .tts-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .playing {
    mix-blend-mode: darken;
    opacity:0.5;
  }

  .text2Speech {
    color: var(--color-text);
    opacity: 0.5;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.5s var(--curve);
  }

  .text2Speech span {
    font-size: var(--font-size-large);
    transition: transform 0.5s var(--curve);
  }

  .text2Speech:hover span {
    transform: scale(1.1);
  }

  .text2Speech:hover, .text2Speech:active {
    opacity: 1;
    color: var(--color-theme-1);
  }
</style>
