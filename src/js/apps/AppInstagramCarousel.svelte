<script>
  // import Swiper core and required components
  import SwiperCore, { Navigation, A11y, Lazy } from 'swiper';
  import { getSizedImageUrl } from "@shopify/theme-images";

  import { Swiper, SwiperSlide } from 'swiper/svelte';

  const instagramBlocks = window.homePage.instagramCarouselBlocks
  
  // install Swiper components
  SwiperCore.use([Navigation, A11y, Lazy]);
</script>

<Swiper
  navigation={{
    nextEl: '.instagram-carousel__next',
    prevEl: '.instagram-carousel__prev',
  }}
  preloadImages={false}
  lazy={{
    loadPrevNext: 1,
    loadingClass: 'swiper-lazy-loading--blur-up',
    loadedClass: 'swiper-lazy-loaded--blur-up',
  }}
  breakpoints={{
    450: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 4,
      noSwiping: true,
    },
  }}
>
  {#each instagramBlocks as {image, url}, index}
    <SwiperSlide>
      <a target="_blank" href={url}>
        <div class="aspect-h-1 aspect-w-1 relative">
          <img
            class="swiper-lazy absolute inset-0 swiper-lazy w-full p-3 object-cover object-center"
            data-src={getSizedImageUrl(image, '600x')}
            src={getSizedImageUrl(image, '50x')}
            alt="Product {index}"
          />
        </div>
      </a>
    </SwiperSlide>
  {/each}
</Swiper>
