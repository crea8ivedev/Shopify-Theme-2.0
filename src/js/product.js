/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { addItem } from '@shopify/theme-cart';
import cartCount from './stores/cartCount';

import '../css/product.css';
import './utility/public-path'; // Needed for openCart
import enquire from 'enquire.js';
import openCart from './utility/open-cart';
import AppPDPImageCarousel from './apps/AppPDPImageCarousel.svelte';
import AppPDPFAQ from './apps/AppPDPFAQ.svelte';
import AppPDPBeforeAfterCarousel from './apps/AppPDPBeforeAfterCarousel.svelte';
import AppModalCartError from './apps/AppModalCartError.svelte';
import AppPDPMobileBar from './apps/AppPDPMobileBar.svelte';

// Selectors
const addToCartBtn = document.querySelector('[data-add-to-cart]');

// const featuredImage = document.querySelector('[data-featured-image]');
const formElement = document.querySelector('[data-product-form]');
const formElements = document.querySelectorAll('[data-product-form]'); // Used for multiple product forms on a PDP
// const stockMessages = document.querySelectorAll('[data-stock-message]');
// const thumbnailLinks = document.querySelectorAll('[data-thumbnail-links]');
const seeMoreLessHighlightsLink = document.getElementById('pdp-highlights__see-more');
const pdpHighlights = document.getElementById('pdp-highlights');
const beforeAfterCarousel = document.getElementById('pdp-before-after__carousel');
const themeStrings = window.theme.strings;
const themeMoneyFormat = window.theme.moneyFormat;
const pdpImgCarousel = document.getElementById('pdp-img-carousel')
const pdpFAQ = document.getElementById('app-pdp-faq')
const addToCartMobile = document.getElementById('pdp-add-to-cart-mobile')


// Mount Apps
if (pdpImgCarousel) {
  const appPDPImageCarousel = new AppPDPImageCarousel({
    target: pdpImgCarousel,
    props: {
      slidesShown: pdpImgCarousel.dataset.slidesShown,
    },
  });
}

if (pdpFAQ) {
  const appPDPFAQ = new AppPDPFAQ({
    target: pdpFAQ,
  });
}

if (addToCartMobile) {
  const appPDPMobileBar = new AppPDPMobileBar({
    target: addToCartMobile,
  });
}

if (beforeAfterCarousel) {
  const appPDPBeforeAfterCarousel = new AppPDPBeforeAfterCarousel({
    target: beforeAfterCarousel,

  });
}

// Okendo settings
window.okeReviewsWidgetOnInit = function () {
  const writeAReviewButton = document.querySelector('.js-okeReviews-writeReview');
  const reviewsControl = document.querySelector('.okeReviews-reviews-controls');

  // Move WaR button
  if (writeAReviewButton && reviewsControl) {
      const reviewsControlSelect = reviewsControl.querySelector('.okeReviews-reviews-controls-select');
      reviewsControlSelect.insertAdjacentElement('afterbegin', writeAReviewButton);
  }
};

// Update bag count
const unsubscribeCartCount = cartCount.subscribe((value) => {
  document
    .getElementById('cart-count')
    .setAttribute('data-cart-item-count', value);
});

/**
 * ProductForm callbacks
 *
 * onOptionChange - Callback for whenever an option input changes
 * onQuantityChange - Callback for whenever an quantity input changes
 * onPropertyChange - Callback for whenever a property input changes
 * onFormSubmit - Callback for whenever the product form is submitted
 */

function onOptionChange(event) {
  const { variant } = event.dataset;
  const price = formatMoney(variant.price, themeMoneyFormat);

  // Hide all stock message, then show for this variant
  // stockMessages.forEach((stockMessage) => stockMessage.classList.add('hidden'));
  // document
  //   .getElementById(`stock-message-${variant.id}`)
  //   .classList.remove('hidden');

  if (variant === null) {
    // The combination of selected options does not have a matching variant
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.unavailable;
  } else if (variant && !variant.available) {
    // The combination of selected options has a matching variant but it is currently unavailable
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.soldOut;
  } else if (variant && variant.available) {
    // The combination of selected options has a matching variant and it is available
    addToCartBtn.disabled = false;
    addToCartBtn.innerHTML = `${themeStrings.addToCart} &middot; ${price}`;
  }
}

function onFormSubmit(event) {
  event.preventDefault();
  addToCartBtn.classList.add('loading');

  const { id } = event.dataset.variant;
  const { quantity } = event.dataset;
  const { properties } = event.dataset;
  const sellingPlanId = document.getElementById('SellingPlan')

  let productData = {
    id,
    quantity,
    properties,
    selling_plan: sellingPlanId ? sellingPlanId.value : null,
  };

  // ! 20210808 - DN - START
  // theme-cart function addItem doesn't support selling_plan_id yet
  // reference: https://github.com/Shopify/theme-scripts/issues/157
  
  // addItem(id, { quantity, properties })
  //   .then((data) => {
  //     cartCount.increment();
  //     addToCartBtn.classList.remove('loading');

  //     openCart().then((response) => {
  //       if (response === false) {
  //         window.location.href = '/cart';
  //       }
  //     });
  //   })
  //   .catch(async (err) => {
  //     const shopifyErr = await err.json();
  //     console.error('Cart Error', shopifyErr);

  //     addToCartBtn.classList.remove('loading');

  //     if (!window.showAddToCartErrorModal) {
  //       window.showAddToCartErrorModal = new AppModalCartError({
  //         target: document.getElementById('body'),
  //       });
  //     }
  //     window.showAddToCartErrorModal.load(shopifyErr.description);

  //     // Minimal error messages, so try standard form submit.
  //     // formElement.submit();
  //   });

  fetch('/cart/add.js', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        productData,
      ],
    }),
  })
  .then((data) => {
    cartCount.increment();
    addToCartBtn.classList.remove('loading');

    openCart().then((response) => {
      if (response === false) {
        window.location.href = '/cart';
      }
    });
  })
  .catch(async (err) => {
    const shopifyErr = await err.json();
    console.error('Cart Error', shopifyErr);

    addToCartBtn.classList.remove('loading');

    if (!window.showAddToCartErrorModal) {
      window.showAddToCartErrorModal = new AppModalCartError({
        target: document.getElementById('body'),
      });
    }
    window.showAddToCartErrorModal.load(shopifyErr.description);

    // Minimal error messages, so try standard form submit.
    // formElement.submit();
  });

  // ! 20210808 - DN - END
}

// Fetch the product data from the .js endpoint because it includes
// more data than the .json endpoint. Alternatively, you could inline the output
// of {{ product | json }} inside a <script> tag, with the downside that the
// data can never be cached by the browser.
//
// You will need to polyfill `fetch()` if you want to support IE11
// fetch(`/products/${formElement.dataset.productHandle}.js`)
//   .then((response) => response.json())
//   .then((productJSON) => {
//     const productForm = new ProductForm(formElement, productJSON, {
//       onOptionChange,
//       onFormSubmit,
//     });
//   })
//   .catch((e) => {console.error('Product fetch error', e)});

// ! 2021/03/01 - Disabled above solution because it was causing the js to stop working without error
formElements.forEach((formElement) => {
  const productForm = new ProductForm(formElement, window.productPageData.pdpJSON, {
    onOptionChange,
    onFormSubmit,
  });
});

// Toggle See more / less highlights
if (seeMoreLessHighlightsLink) {
  seeMoreLessHighlightsLink.addEventListener('click', (event) => {
    event.preventDefault();
  
    if (pdpHighlights.className.includes('pdp-highlights--show')) {
      pdpHighlights.classList.remove('pdp-highlights--show');
      seeMoreLessHighlightsLink.innerHTML = 'See More';
    } else {
      pdpHighlights.classList.add('pdp-highlights--show');
      seeMoreLessHighlightsLink.innerHTML = 'See Less';
    }
  });
}

// Toggle Subscription Popover
if (subscribePopoverBtns) {
  subscribePopoverBtns.forEach((btn) => {
    enquire.register(window.themeConfig.mediaQueries.smDown, {
      match: () => {
        btn.addEventListener('click', clickHandler);
      },
      unmatch: () => {
        btn.removeEventListener('click', clickHandler);
      },
    });

    enquire.register(window.themeConfig.mediaQueries.sm, {
      match: () => {
        btn.addEventListener('mouseover', mouseOverHandler);
        btn.addEventListener('mouseleave', mouseLeaveHandler);
      },
      unmatch: () => {
        btn.removeEventListener('mouseover', mouseOverHandler);
        btn.removeEventListener('mouseleave', mouseLeaveHandler);
      },
    });
  });
}