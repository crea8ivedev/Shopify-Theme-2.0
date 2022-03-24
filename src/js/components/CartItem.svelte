<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { createEventDispatcher } from 'svelte';
  import CartImage from '../components/CartImage.svelte';
  import AppModalCartError from '../apps/AppModalCartError.svelte';

  const dispatch = createEventDispatcher();

  export let product;
  let productQty = product.quantity
  let productQtyChanged = false
  const productQtyMin = 1
  const productQtyMax = 300

  const updateQty = (key, qty, type, variantId) => {
    let parsedQty = parseInt(qty, 10)
    if (parsedQty > productQtyMax) {
      parsedQty = productQtyMax

      // if (!window.showAddToCartErrorModal) {
      //   window.showAddToCartErrorModal = new AppModalCartError({
      //     target: document.getElementById('body'),
      //   });
      // }
      // window.showAddToCartErrorModal.load('<p class="mb-4">Oh, hi there! We\'re unable to support a larger order quantity at this time.</p><p>If you\'re looking to place a special order, please contact <a class="text-red-500" href="mailto:hello@commonheir.com">hello@commonheir.com.</a></p>');
      // return;
    }

    dispatch('updateQty', { key, parsedQty, variantId })
    productQtyChanged = false
  };

  const onQtyInput = (e) => {
    productQty = e.target.value
    productQtyChanged = true
  };

  const onQtyChange = (e) => {
    if (e.target.value > productQtyMax) {
      productQty = productQtyMax
    } else if (e.target.value < productQtyMin) {
      productQty = productQtyMin
    }
  };

  const onQtyDecrement = (e) => {
    if (productQty <= productQtyMin) {
      return
    }
    
    productQty--
    productQtyChanged = true
  };

  const onQtyIncrement = (e) => {
    if (productQty >= productQtyMax) {
      return
    }
    
    productQty++
    productQtyChanged = true
  };
</script>

<div class="flex justify-between">
  <div>
    {#if product.modifications && product.modifications.restricted}
      <CartImage bind:image={product.featured_image} />
    {:else}
      <a href={product.url}>
        <CartImage bind:image={product.featured_image} />
      </a>
    {/if}
  </div>
  <div class="flex flex-col flex-1 py-0 relative">
    <button class="btn-icon absolute top-0 right-0" on:click={() => updateQty(product.key, 0)}>
      <i class="cart-item__delete material-icons-outlined">close</i>
    </button>
    <div class="flex flex-col px-4 mb-2">
      {#if product.modifications && product.modifications.restricted}
        <p class="font-header uppercase {product.title.length > 20 ? '' : 'large'}">{product.product_title}</p>
      {:else}
        <a class="font-header uppercase {product.title.length > 20 ? '' : 'large'}" href={product.url}>
          {product.product_title}
        </a>
      {/if}
      {#if product.variant_title}
        <div class="mt-1 text-sm">
          {product.variant_title}
        </div>
      {/if}
      <div class="mt-1 text-sm leading-tight">
        {#if product.selling_plan_allocation && product.selling_plan_allocation.selling_plan}
          {product.selling_plan_allocation.selling_plan.name}
        {:else}
          Single purchase
        {/if}
      </div>
      {#if product.modifications && product.modifications.customMessage}
        <div class="mt-1 text-sm text-red-500">
          {product.modifications.customMessage}
        </div>
      {/if}
    </div>
    <div class="flex flex-col mt-auto pl-4">
      {#if productQtyChanged && !(product.modifications && product.modifications.restricted)}
        <div class="mb-2">
          <button class="btn btn--atc btn--small" on:click={() => updateQty(product.key, productQty, null, product.variant_id)}>Update</button>
        </div>
      {/if}
      <div class="flex items-center">
        <div class="flex items-center">
          <div class="qty-wrapper bg-white border-white">
            <button class="qty-increment" role="button" on:click={onQtyDecrement} disabled={(product.modifications && product.modifications.restricted) || productQty <= productQtyMin}>
              <i class="material-icons-outlined qty-icon">remove</i>
            </button>
            <input class="qty-input input--disabled-show" type="number" min="1" max="500" pattern="\d*" bind:value="{productQty}" on:input={onQtyInput} disabled={(product.modifications && product.modifications.restricted)} on:change={onQtyChange} />
            <button class="qty-increment" role="button" on:click={onQtyIncrement} disabled={(product.modifications && product.modifications.restricted) || productQty >= productQtyMax}>
              <i class="material-icons-outlined qty-icon">add</i>
            </button>
          </div>
        </div>
        <div class="flex ml-auto flex-col sm:flex-row sm:space-x-2 leading-tight">
          {#if product.selling_plan_allocation}
            <span class="{product.selling_plan_allocation.compare_at_price > product.selling_plan_allocation.price ? 'text-red-500' : ''}">
              {formatMoney(product.selling_plan_allocation.price, window.theme.moneyFormat)}
            </span>
            {#if product.selling_plan_allocation.compare_at_price > product.selling_plan_allocation.price}
              <span class="line-through">
                {formatMoney(product.selling_plan_allocation.compare_at_price, window.theme.moneyFormat)}
              </span>
            {/if}
          {:else}
            <span class="{product.original_price > product.price ? 'text-red-500' : ''}">
              {formatMoney(product.price, window.theme.moneyFormat)}
            </span>
            {#if product.original_price > product.price}
              <span class="line-through">
                {formatMoney(product.original_price, window.theme.moneyFormat)}
              </span>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
