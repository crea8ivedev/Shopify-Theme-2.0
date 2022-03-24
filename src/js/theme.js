/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import AOS from 'aos';
import './utility/public-path';
import './utility/newsletter-subscribe';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import 'lazysizes';
import openCart from './utility/open-cart';
import AppModalNewsletter from './apps/AppModalNewsletter.svelte';
import AppMobileMenu from './apps/AppMobileMenu.svelte';
import AppModalCartError from './apps/AppModalCartError.svelte';
import cartCount from './stores/cartCount';
import { addItem } from '@shopify/theme-cart';

// Config file for enquire JS
window.themeConfig = {
  mediaQueries: {
    sm: '(min-width: 640px)',
    smDown: '(max-width: 639px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
};

/* ----------------------- On load ---------------------- */
// JS is enabled
document.querySelector('html').classList.add('js');

// Okendo
// Widget lifecycle hook. Gets fired when Okendo Widgets are finished initializing
window.okeReviewsWidgetOnInit = function () {
  const reviewMain = document.querySelector('.js-okeReviews-reviews-main');
  if (reviewMain) {
    const callback = function (mutationList) {
      for (const mutation of mutationList) {
        mutation.addedNodes.forEach((n) => setupReview(n));
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(reviewMain, { childList: true });

    // Run callback for the first time
    const reviews = document.querySelectorAll('.okeReviews-reviews-review');
    reviews.forEach((n) => setupReview(n));
  }
};

function setupReview(nodeElement) {
  if (nodeElement) {
    const reviewRecommendation = nodeElement.querySelector(
      '.okeReviews-review-recommendation'
    );
    const reviewMainContent = nodeElement.querySelector(
      '.okeReviews-review-helpful'
    );
    if (reviewRecommendation && reviewMainContent) {
      reviewMainContent.insertAdjacentElement(
        'beforebegin',
        reviewRecommendation
      );
    }
  }
}

// Enable AOS
AOS.init();

/* ----------------------- Shopify ---------------------- */
function refreshCMS() {
  AOS.refreshHard();
}

document.addEventListener('shopify:section:load', refreshCMS);
document.addEventListener('shopify:section:unload', refreshCMS);
document.addEventListener('shopify:section:select', refreshCMS);
document.addEventListener('shopify:section:deselect', refreshCMS);
document.addEventListener('shopify:section:reorder', refreshCMS);
document.addEventListener('shopify:block:select', refreshCMS);
document.addEventListener('shopify:block:deselect', refreshCMS);

/* ----------------------- Modals ----------------------- */
const appModalNewsletter = new AppModalNewsletter({
  target: document.getElementById('modal-email'),
  props: {
    modalContentId: 'modal-content--newsletter',
  },
});

/* ------------------ Announcement Bar ------------------ */
const announcementBar = document.getElementById('announcement');
if (announcementBar) {
  const date = new Date();
  const announcementClosedTime = localStorage.getItem('announcementClosedTime');

  if (date.getTime() > announcementClosedTime) {
    localStorage.removeItem('announcementClosedTime');
  } else {
    document.getElementById('announcement').classList.add('hidden');
  }
}

const announcementClose = document.getElementById('announcement__close');
if (announcementClose) {
  announcementClose.addEventListener('click', (event) => {
    const date = new Date();
    const closeTime = 1000 * 60 * 60 * 24 * 3; // 3 days

    localStorage.setItem('announcementClosedTime', date.getTime() + closeTime);
    document.getElementById('announcement').classList.add('hidden');
  });
}

/* ------------------------ Navbar ------------------------ */
// Handle cart sidebar component
const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCart().then((res) => {
        if (res === false) {
          window.location.href = e.currentTarget.getAttribute('href');
        }
      });
    });
  });
}

// Update bag count
const unsubscribeCartCount = cartCount.subscribe((value) => {
  document
    .getElementById('cart-count')
    .setAttribute('data-cart-item-count', value);
});

// Handle menu
const mobileMenu = new AppMobileMenu({
  target: document.getElementById('app-side-menu'),
  props: {
    links: window.siteHeaderData.links,
  },
});

// Mega Menu
if (window.siteHeaderData.megaMenu.enabled && window.siteHeaderData.megaMenu.target) {
  const megaMenuTarget = document.querySelector(`a[href="${window.siteHeaderData.megaMenu.target}"]`);

  if (megaMenuTarget) {
    const megaMenu = document.getElementById('mega-menu');

    megaMenuTarget.addEventListener('click', (e) => {
      e.preventDefault();
    });

    megaMenuTarget.addEventListener('mouseover', () => {
      megaMenuTarget.parentElement.classList.add('site-navigation__link--hover');
      megaMenu.classList.add('mega-menu--shown');
    });
    
    megaMenu.addEventListener('mouseleave', () => {
      megaMenuTarget.parentElement.classList.remove('site-navigation__link--hover');
      megaMenu.classList.remove('mega-menu--shown');
    });
  }
}


const navMobileMenu = document.getElementById('site-mobile-menu');
navMobileMenu.addEventListener('click', (e) => {
  mobileMenu.showMenu();
});

/* ------------------------ Cart ------------------------ */

// Get cart count
fetch('/cart.js')
  .then((res) => res.json())
  .then((cart) => {
    cartCount.set(cart.item_count);
  })
  .catch((err) => {
    console.error(err);
  });

// Open cart on redirect
if (window.location.pathname === '/' && window.location.hash === '#cart') {
  cartLinks[0].click();
}

/* ----------------- Global Cart functions ----------------- */
const globalAddToCartBtns = document.querySelectorAll(
  '[data-global-add-to-cart]'
);

if (globalAddToCartBtns) {
  globalAddToCartBtns.forEach((globalAddToCartBtn) => {
    globalAddToCartBtn.addEventListener('click', (event) => {
      event.preventDefault();
      globalAddToCartBtn.classList.add('loading');

      // Get data
      const { variantId, quantity = 1 } = event.target.dataset;

      addItem(parseInt(variantId, 10), { quantity })
        .then((data) => {
          cartCount.increment(quantity);
          globalAddToCartBtn.classList.remove('loading');

          openCart().then((response) => {
            if (response === false) {
              window.location.href = '/cart';
            }
          });
        })
        .catch(async (err) => {
          const shopifyErr = await err.json();
          console.error('Cart Error', shopifyErr);

          globalAddToCartBtn.classList.remove('loading');

          if (!window.showAddToCartErrorModal) {
            window.showAddToCartErrorModal = new AppModalCartError({
              target: document.getElementById('body'),
            });
          }
          window.showAddToCartErrorModal.load(shopifyErr.description);
        });
    });
  });
}

/* -- Redirect account creation captcha back to account - */
const captchaTemplate = document.querySelector('.shopify-challenge__container');
if (captchaTemplate) {
  if (document.referrer.indexOf('/register') !== -1) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'return_to');
    input.setAttribute('value', '/account');
    document
      .querySelector('.shopify-challenge__container > form')
      .appendChild(input);
  }
}
