<script>
  // import Swiper core and required components
  import SwiperCore, { Navigation, Pagination, A11y, Lazy } from 'swiper';
  import { getSizedImageUrl } from "@shopify/theme-images";

  import { Swiper, SwiperSlide } from 'swiper/svelte';

  export let slidesShown = 1.5;

  const mediaContent = window.productPageData.pdpJSON.media || [];

  // install Swiper components
  SwiperCore.use([Navigation, Pagination, A11y, Lazy]);
</script>

<style>
  :global(.pdp-img-carousel__prev.swiper-button-disabled),
  :global(.pdp-img-carousel__next.swiper-button-disabled) {
    display: none;
  }

  :global(#pdp-img-carousel .swiper-pagination-bullet) {
    border-radius: 0;
    width: 50px;
  }

  :global(#pdp-img-carousel .swiper-container) {
    padding-bottom: 30px;
  }
  
  :global(#pdp-img-carousel .swiper-pagination) {
    bottom: 0;
    text-align: left;
    margin-left: -4px;
  }

  :global(#pdp-img-carousel .swiper-pagination-bullet) {
    border: 1px solid #000;
    background: transparent;
    opacity: 1;
  }

  :global(#pdp-img-carousel .swiper-pagination-bullet.swiper-pagination-bullet-active) {
    background: #000;
  }

  .pdp-img-carousel__prev {
    left: -40px;
  }

  .pdp-img-carousel__next {
    right: -40px;
  }
  .pdp-img-carousel__next.pdp-img-carousel__next--1-and-half {
    right: 21%;
  }

  @media screen and (min-width: 992px) {
    .pdp-img-carousel__prev {
      left: -20px;
    }

    .pdp-img-carousel__next {
      right: -20px;
    }
    .pdp-img-carousel__next.pdp-img-carousel__next--1-and-half {
      right: 27%;
    }
  }
</style>

<div class="relative">
  <div class="pdp-img-carousel__prev absolute top-1/2 transform rotate-180 -translate-y-1/2 scale-50 lg:scale-75 z-10">
    <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#D23425"/><path d="M20.556 41.023H45M56.167 40.157a1 1 0 010 1.733L46 47.76V34.287l10.167 5.87z" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <div class="pdp-img-carousel__next {slidesShown == 1.5 ? "pdp-img-carousel__next--1-and-half" : ""} absolute top-1/2 transform -translate-y-1/2 scale-50 lg:scale-75 z-10">
    <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#D23425"/><path d="M20.556 41.023H45M56.167 40.157a1 1 0 010 1.733L46 47.76V34.287l10.167 5.87z" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <Swiper
    spaceBetween={20}
    slidesPerView={slidesShown}
    pagination={{ clickable: true }}
    navigation={{
      nextEl: '.pdp-img-carousel__next',
      prevEl: '.pdp-img-carousel__prev',
    }}
    preloadImages={false}
    lazy={{
      loadPrevNext: 1,
      loadingClass: 'swiper-lazy-loading--blur-up',
      loadedClass: 'swiper-lazy-loaded--blur-up',
    }}
    breakpoints={{
      768: {
        noSwiping: true,
      },
    }}
  >
    {#each mediaContent as content, index}
      <SwiperSlide>
        <div class="aspect-h-1 aspect-w-1 relative">
          {#if content.media_type === 'image'}
            <img
              class="swiper-lazy absolute inset-0 w-full object-cover object-center"
              data-src={getSizedImageUrl(content.src, '600x')}
              src={getSizedImageUrl(content.src, '50x')}
              data-sizes="auto"
              alt="Product {index}"
            />
          {:else if content.media_type === 'video'}
            <video class="h-full w-full object-cover" autoplay muted loop playsinline poster="{getSizedImageUrl(content.preview_image.src, '600x')}">
              {#each content.sources as source}
                <source src="{source.url}" type="{source.mime_type}">
              {/each}
            </video>
          {/if}
        </div>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>
