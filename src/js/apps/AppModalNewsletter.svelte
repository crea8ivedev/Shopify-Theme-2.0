<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // ! TODO: Turn this into a store
  import ModalContentNewsletter from '../components/ModalNewsletter.svelte';

  // Selectors
  const body = document.body;

  // Variable declarations
  export let showModal;
  export let modalContentId = '';

  function hideModal() {
    showModal = false;
    body.classList.remove('overflow-hidden');
    const dateClosed = new Date();
    window.localStorage.setItem('newsletterModalDate', dateClosed);
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideModal();
  }

  onMount(() => {
    if (!window.emailModal.enable) return;

    const currentDate = new Date();
    const dateLastOpened = window.localStorage.getItem('newsletterModalDate');
    const difference =
      (currentDate.getTime() - new Date(dateLastOpened).getTime()) /
      (1000 * 3600 * 24);
    const expiryDate = window.emailModal.expiry_date;
    const timeToShow = window.emailModal.time_to_show * 1000;

    if (!dateLastOpened) {
      setTimeout(() => {
        showModal = true;
      }, timeToShow);
      return;
    }

    // Show modal after 7 days
    if (difference > expiryDate && !showModal) {
      window.localStorage.removeItem('newsletterModalDate');

      // Show modal after 5 seconds
      setTimeout(() => {
        showModal = true;
      }, timeToShow);
    }
  });
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
    class="modal-content"
    transition:fly={{ y: 200, duration: 250, delay: 100 }}
  >
    <div class="absolute" style="top: 20px; left: 50%; transform: translateX(-50%);">
      <button class="btn-icon" on:click={hideModal}
        ><i class="material-icons-outlined text-4xl text-white">close</i></button
      >
    </div>
    <ModalContentNewsletter />
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000;
  }

  @media screen and (min-width: 640px) {
    .modal-content {
      width: 500px;
      height: 500px;
    }
  }
</style>
