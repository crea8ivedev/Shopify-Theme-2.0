<script>
  import { fade, fly } from 'svelte/transition';

  let showMobileMenu = false;
  let megaMenuShown = false;
  const links = window.siteHeaderData.links;
  const megaMenuData = window.siteHeaderData.megaMenu;

  export function showMenu() {
    showMobileMenu = true;
  }

  const hideMenu = () => {
    showMobileMenu = false;
  };

  function handleKeydown(e) {
    if (e.keyCode === 27) hideMenu();
  }

  function handleMegaMenu(e) {
    megaMenuShown = !megaMenuShown;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showMobileMenu}
  <div
    class="modal-bg overflow-hidden"
    transition:fade={{ duration: 250 }}
    on:click={hideMenu}
  />
  <div
    id="modal-content-slide-over"
    class="modal-content text-white relative"
    transition:fly={{ x: -200, duration: 250, delay: 100 }}
  >
    <button class="btn-icon absolute top-0 right-0 p-4" on:click={hideMenu}
      ><i class="material-icons-outlined text-4xl">close</i>
    </button>
    <div class="flex h-full w-full justify-center items-center">
      <ul class="flex flex-col items-center space-y-6">
        {#each links as { title, url, active } (title)}
          <li class="flex flex-col justify-center items-center text-center font-header uppercase h2 text-white relative {active ? 'site-navigation__link--active' : ''}">
            {#if url == megaMenuData.target}
              <a class="megamenu-mobile {megaMenuShown ? 'megamenu-mobile--shown' : ''} flex items-center" href={megaMenuData.target} on:click|preventDefault={handleMegaMenu}>{title} 
                <svg class="ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" style="width: 16px; height: 16px; fill: #ffffff;"><path d="M3 12v-2a1.002 1.002 0 0 1 1.634-.774L15 17.708l10.367-8.482A1.001 1.001 0 0 1 27 10v2a1 1 0 0 1-.367.774l-11 9a1.002 1.002 0 0 1-1.267 0l-11-9A1.003 1.003 0 0 1 3 12z" /></svg>
              </a>
              {#if megaMenuShown}
                <ul 
                  class="flex flex-col space-y-4 mt-4 pl-4 text-md leading-none"
                  in:fly={{ y: -50, duration: 300 }}
                  out:fade={{ duration: 300 }}>
                  {#each megaMenuData.items as {title, url} (title)}
                    <li class="megamenu-mobile__item text-gray-400">
                      <a href={url}>
                        {title}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            {:else}
              {#if active}
                <span>{title}</span>
              {:else}
                <a href="{url}">{title}</a>
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
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
    background: #000000;
    bottom: 0;
    max-width: 550px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
</style>
