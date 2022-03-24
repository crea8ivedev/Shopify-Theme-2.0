<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // Selectors
  const body = document.body;

  // Variable declarations
  export let showSlideOver;
  export let title;
  export let content;

  function hideSlideOver() {
    showSlideOver = false;
    body.classList.remove('overflow-hidden');
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideSlideOver();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showSlideOver}
  <div
    class="modal-bg overflow-hidden"
    transition:fade={{ duration: 250 }}
    on:click={hideSlideOver}
  />
  <div
    id="modal-content-slide-over"
    class="modal-content"
    transition:fly={{ x: 200, duration: 250, delay: 100 }}
  >
    <div class="flex flex-col p-6 md:p-10 h-full relative bg-cream-500">
      <div class="flex flex-shrink-0">
        <button class="btn-icon ml-auto" on:click={hideSlideOver}
          ><i class="material-icons-outlined text-4xl">close</i></button
        >
      </div>
      <h2 class="h2 font-header my-6">{@html title}</h2>
      <div class="overflow-y-auto">{@html content}</div>
      <div class="mt-10">
        <button class="btn-link link link--red" on:click={hideSlideOver}>&#60; Beautiful, Thanks</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-bg {
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    bottom: 0;
    max-width: 550px;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
</style>
