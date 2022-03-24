<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';
  import { updateItem, clearItems } from '@shopify/theme-cart';
  import { formatMoney } from '@shopify/theme-currency';
  import AppModalCartError from '../apps/AppModalCartError.svelte';
  import cartCount from '../stores/cartCount';
  import CartItem from '../components/CartItem.svelte';

  let bannerText = window.cartSlideout.cartMessage || '';
  let emptyCartUrl = window.cartSlideout.emptyCartUrl || '';

  let cartData = { item_count: 0, items: [] };
  let sortedCartDataItems = [];
  let loading = false;
  let showCart = false;
  const eventOpenCartDrawer = new Event('cartDrawer:load');
  const body = document.body;

  // Update this list to exclude items from going to PDP
  const modifiedProducts = window.cartSlideout.modifiedProducts || [];

  async function cartFetch() {
    const response = await fetch('/cart.js');
    return response.json();
  }

  export function cartLoad() {
    showCart = true;
    loading = true;

    body.classList.add('overflow-hidden');

    cartFetch()
      .then((res) => (cartData = res))
      .then(() => {
        loading = false;
        trapFocus(document.getElementById('modal-content-cart'));
        document.dispatchEvent(eventOpenCartDrawer);
      });
  }

  function hideCart() {
    showCart = false;
    body.classList.remove('overflow-hidden');
    removeTrapFocus();
  }

  function handleUpdateQty(e) {
    loading = true;

    updateItem(e.detail.key, { quantity: e.detail.parsedQty })
      .then((res) => {
        cartData = res;
        loading = false;

        // const lineItem = res.items.find(
        //   (item) => item.key === e.detail.key
        // );

        // if (lineItem && e.detail.parsedQty > lineItem.quantity) {
        //   if (!window.showAddToCartErrorModal) {
        //     window.showAddToCartErrorModal = new AppModalCartError({
        //       target: document.getElementById('body'),
        //     });
        //   }
        //   window.showAddToCartErrorModal.load(
        //     `<p class="mb-4">You have all ${lineItem.quantity} ${lineItem.title} in your cart.</p>`
        //   );
        // }

        document.dispatchEvent(eventOpenCartDrawer);
      })
      .catch(async (err) => {
        console.log(err);
        const shopifyErr = await err.json();
        console.error('Cart Drawer Error', shopifyErr);

        // TO DO: Figure out why error messages aren't sending back from theme-cart
        // Resource: Error message types: https://shopify.dev/docs/themes/ajax-api/reference/cart
      });
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideCart();
  }

  // Update cartCount store
  $: {
    cartCount.set(cartData.item_count);

    if (cartData.items.length) {
      // Sort items
      sortedCartDataItems = cartData.items.reduce((acc, elem) => {
        const modProd = modifiedProducts.find(modProd => modProd.productId === elem.product_id);
  
        if (modProd && modProd.endOfList) {
          return [...acc, elem];
        }
        return [elem, ...acc];
      }, []);

      // Add modifications
      sortedCartDataItems = sortedCartDataItems.map((lineItem) => {
        const foundProd = modifiedProducts.find(modProd => modProd.productId === lineItem.product_id)
        if (foundProd) {
          lineItem = {
            ...lineItem,
            modifications: foundProd,
          };
        }
        return lineItem;
      });
    } else {
      sortedCartDataItems = [];
    }
  }

  onMount(async () => cartLoad());
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showCart}
  <div
    class="modal-bg overflow-hidden"
    transition:fade={{ duration: 250 }}
    on:click={hideCart}
  />

  <div
    id="modal-content-cart"
    class="modal-content bg-cream-500"
    transition:fly={{ x: 200, duration: 250, delay: 100 }}
  >
    <div class="flex flex-col justify-between h-full relative">
      <div class="cart-header border-b border-white mx-4 py-4">
        <div class="flex justify-between items-center">
          <h4 class="h4 font-header uppercase">Bag</h4>
          <button class="btn-icon" on:click={hideCart}
            ><i class="material-icons-outlined">close</i></button
          >
        </div>
      </div>

      <div
        class="cart-contents flex-grow overflow-y-auto mx-4 py-4 space-y-4 {loading
          ? 'loading loading--cream'
          : ''}"
      >
        {#if !loading}
          {#if sortedCartDataItems.length === 0}
            <div class="my-4 text-center text-red-500 font-header uppercase">
              Your shopping bag is empty
            </div>
            <div class="mt-20 flex flex-col items-center space-y-6">
              <img
                class="logo-mark"
                src={`${window.__webpack_public_path__}logo-mark.png`}
                alt="Logo Mark"
              />
              <p class="large uppercase font-header text-center">
                Start a new beauty tradition<br />today with free shipping
              </p>
              {#if emptyCartUrl}
                <div>
                  <a class="btn" href={emptyCartUrl}>Shop Now</a>
                </div>
              {/if}
            </div>
          {:else}
            {#if bannerText}
              <div
                class="my-4 mb-8 text-center text-red-500 font-header uppercase"
              >
                {bannerText}
              </div>
            {/if}
            {#each sortedCartDataItems as product (product.key)}
              <CartItem on:updateQty={handleUpdateQty} {product} />
            {/each}
          {/if}
        {/if}
      </div>
      <div
        class="cart-footer border-t border-white bottom-0 left-0 right-0 {loading
          ? 'loading'
          : ''}"
      >
        {#if cartData.item_count > 0 && !loading}
          <div class="flex justify-between items-center mx-4 py-4">
            <div class="large">Subtotal</div>
            <div class="large">
              {formatMoney(
                cartData.items_subtotal_price,
                window.theme.moneyFormat
              )}
            </div>
          </div>
          <div class="pb-4 mx-4" id="cloverly-container" />

          <form action="/cart" method="post">
            <input
              class="checkout-btn bg-red-500 border-0 text-white btn btn--full rounded-none"
              type="submit"
              name="checkout"
              value="Checkout"
            />
          </form>
        {/if}
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
    bottom: 0;
    max-width: 500px;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  .btn-icon i {
    font-size: 30px;
  }

  .logo-mark {
    width: 150px;
  }
</style>
