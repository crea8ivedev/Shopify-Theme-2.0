<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { fade } from 'svelte/transition';

  const themeMoneyFormat = '${{amount_no_decimals_with_comma_separator}}';
  const addToCartBtn = document.querySelector('[data-add-to-cart]');
  const addToCartBtnMobile = document.getElementById('#data-add-to-cart-mobile');

  let show = false;
  let quantity = 1;

  // Show / hide bottom mobile add to cart
  function onScroll() {
    const bodyRect = document.body.getBoundingClientRect();
    const offset = window.screen.height || document.clientHeight;

    if (document.documentElement.scrollTop > offset) {
      show = true;
    } else {
      show = false;
    }
  }

  function onAddToCart() {
    addToCartBtn.click();
  }
</script>

<svelte:window on:scroll={onScroll} />

{#if show}
  <div class="{show ? '' : 'hidden'} h-full" transition:fade>
    <div class="add-to-cart-mobile__wrap flex items-center bg-white h-full">
      <h2 class="h4 hidden md:flex flex-grow ml-4">{window.productPageData.pdpJSON.title}</h2>
      <button id="add-to-cart-mobile-btn" class="add-to-bag btn btn--sm bg-red-500 text-white border-0 h-full" on:click={onAddToCart} disabled={!window.productPageData.pdpJSON.available}>
        {#if window.productPageData.pdpJSON.available}
          Add to bag - <span>{formatMoney(window.productPageData.pdpJSON.price, themeMoneyFormat)}</span>
        {:else}
          Sold Out
        {/if}
      </button>
    </div>
  </div>
{/if}