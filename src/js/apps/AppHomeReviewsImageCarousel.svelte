<script>
  // import Swiper core and required components
  import SwiperCore, { Navigation, A11y } from 'swiper';
  import { getSizedImageUrl } from '@shopify/theme-images';

  import { Swiper, SwiperSlide } from 'swiper/svelte';

  const reviews = window.homePage.homeReviewsImageCarousel;

  // install Swiper components
  SwiperCore.use([Navigation, A11y]);
</script>

<div class="relative h-full flex flex-col overflow-hidden">
  <div>
    <Swiper
      slidesPerView={1}
      navigation={{
        prevEl: '.home-reviews-carousel-image-custom__prev',
        nextEl: '.home-reviews-carousel-image-custom__next',
      }}
    >
      {#each reviews as review, index}
        <SwiperSlide>
          <h3 class="h3 font-header uppercase">{review.title}</h3>
          {#if review.cta_url && review.cta_label}
            <div class="mt-4">
              <a class="link link--red" href={review.cta_url}
                >{review.cta_label}</a
              >
            </div>
          {/if}
          <div class="flex mt-4">
            {#each Array(review.stars) as star, index}
              <i class="material-icons-outlined">star</i>
            {/each}
            {#each Array(5 - review.stars) as star, index}
              <i class="material-icons-outlined">star_border</i>
            {/each}
          </div>
          <blockquote class="mt-8 large">{review.review}</blockquote>
          <cite class="block font-header not-italic mt-4 uppercase"
            >{review.reviewer}</cite
          >
        </SwiperSlide>
      {/each}
    </Swiper>
  </div>
  <div class="py-8 flex space-x-4 mt-auto">
    <svg
      class="home-reviews-carousel-image-custom__prev"
      width="60"
      height="60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ><circle r="30" transform="matrix(-1 0 0 1 30 30)" fill="#fff" /><path
        d="M44.583 30.767H26.25M18.75 31.634l6.5 3.752V26.15l-6.5 3.752a1 1 0 000 1.733z"
        stroke="#D23425"
        stroke-width="2"
      /></svg
    >
    <svg
      class="home-reviews-carousel-image-custom__next transform rotate-180"
      width="60"
      height="60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ><circle r="30" transform="matrix(-1 0 0 1 30 30)" fill="#fff" /><path
        d="M44.583 30.767H26.25M18.75 31.634l6.5 3.752V26.15l-6.5 3.752a1 1 0 000 1.733z"
        stroke="#D23425"
        stroke-width="2"
      /></svg
    >
  </div>
</div>

<style>
  :global(.home-reviews-carousel-image-custom__prev.swiper-button-disabled),
  :global(.home-reviews-carousel-image-custom__next.swiper-button-disabled) {
    opacity: 0.3;
  }
</style>
