<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // Selectors
  const body = document.body;

  // Variable declarations
  export let showModal;
  export let modalContentId = '';
  let errorMessage = '';

  export function load(message) {
    showModal = true;
    errorMessage = message;
  }

  function hideModal() {
    showModal = false;
    body.classList.remove('overflow-hidden');
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideModal();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
  <div
    class="modal-bg overflow-hidden"
    transition:fade={{ duration: 250 }}
    on:click={hideModal}
  />
  <div
    id={modalContentId}
    class="modal-content bg-cream-500"
    transition:fly={{ y: 200, duration: 250, delay: 100 }}
  >
    <div class="absolute" style="top: 20px; left: 50%; transform: translateX(-50%);">
      
    </div>
    <div class="text-center text-black space-y-4">
      <h2 class="h4">Sorry, an error occurred.</h2>
      <div>{@html errorMessage}</div>
      <button class="btn" on:click={hideModal}>OK</button>
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    overflow: hidden;
    width: 100%;
    position: fixed;
    z-index: 1000;
  }

  @media screen and (min-width: 640px) {
    .modal-content {
      width: 500px;
    }
  }
</style>
