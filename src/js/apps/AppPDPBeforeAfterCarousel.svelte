<script>
  // import Swiper core and required components
  import SwiperCore, { Navigation, Pagination, A11y, Lazy } from 'swiper';
  import { getSizedImageUrl } from '@shopify/theme-images';

  import { Swiper, SwiperSlide } from 'swiper/svelte';

  const productImages = window.productPageData.beforeAfterImages;
  const descriptions = window.productPageData.beforeAfterDescription;
  // install Swiper components
  SwiperCore.use([Navigation, Pagination, A11y, Lazy]);

  function changeDescription() {
    setTimeout(() => {
      const activeSlide = document
        .querySelector(
          '#pdp-before-after__carousel .swiper-slide.swiper-slide-active'
        )
        .getAttribute('aria-label')
        .split(' / ')[0];

      if (activeSlide) {
        const index0 = parseInt(activeSlide, 10) - 1;
        document.getElementById('before-after-description').innerHTML =
          descriptions[index0];
      }
    }, 0)
  }
</script>

<div class="relative">
  <div
    class="pdp-before-after__prev absolute top-1/2 transform -translate-y-1/2 z-10 left-0 scale-50 md:scale-75"
  >
    <svg
      class="transform rotate-180"
      width="80"
      height="80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ><circle cx="40" cy="40" r="40" fill="#D23425" /><path
        d="M20.556 41.023H45M56.167 40.157a1 1 0 010 1.733L46 47.76V34.287l10.167 5.87z"
        stroke="#fff"
        stroke-width="2"
      /></svg
    >
  </div>
  <div
    class="pdp-before-after__next absolute top-1/2 transform -translate-y-1/2 z-10 right-0 scale-50 md:scale-75"
  >
    <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><circle cx="40" cy="40" r="40" fill="#D23425" /><path
        d="M20.556 41.023H45M56.167 40.157a1 1 0 010 1.733L46 47.76V34.287l10.167 5.87z"
        stroke="#fff"
        stroke-width="2"
      /></svg
    >
  </div>
  <div class="px-6">
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation={{
        nextEl: '.pdp-before-after__next',
        prevEl: '.pdp-before-after__prev',
      }}
      pagination={{ clickable: true }}
      preloadImages={false}
      lazy={{
        loadPrevNext: 1,
        loadingClass: 'swiper-lazy-loading--blur-up',
        loadedClass: 'swiper-lazy-loaded--blur-up',
      }}
      on:swiper={changeDescription}
      on:slideChangeTransitionEnd={changeDescription}
    >
      {#each productImages as image, index}
        {#if image}
          <SwiperSlide>
            <div class="aspect-h-1 aspect-w-1 relative">
              <img
                class="absolute inset-0 swiper-lazy w-full"
                data-src={getSizedImageUrl(image, '600x')}
                src={getSizedImageUrl(image, '50x')}
                alt="Product {index}"
              />
            </div>
          </SwiperSlide>
        {/if}
      {/each}
    </Swiper>
  </div>
</div>

<style>
  :global(.pdp-before-after__prev.swiper-button-disabled),
  :global(.pdp-before-after__next.swiper-button-disabled) {
    display: none;
  }

  :global(#pdp-before-after__carousel .swiper-pagination-bullet) {
    border-radius: 0;
    width: 50px;
  }

  :global(#pdp-before-after__carousel .swiper-container) {
    padding-bottom: 30px;
  }

  :global(#pdp-before-after__carousel .swiper-pagination) {
    bottom: 0;
    margin-left: -4px;
  }

  :global(#pdp-before-after__carousel .swiper-pagination-bullet) {
    border: 1px solid #000;
    background: transparent;
    opacity: 1;
  }

  :global(#pdp-before-after__carousel
      .swiper-pagination-bullet.swiper-pagination-bullet-active) {
    background: #000;
  }
</style>
