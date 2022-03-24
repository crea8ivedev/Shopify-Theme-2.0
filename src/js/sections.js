import AppInstagramCarousel from './apps/AppInstagramCarousel.svelte';
import AppHomeReviewsImageCarousel from './apps/AppHomeReviewsImageCarousel.svelte';
import AppHomeReviewsTextCarousel from './apps/AppHomeReviewsTextCarousel.svelte';

const instagramCarousel = document.getElementById('instagram-carousel__wrap');
const imageCarousel = document.getElementById('home-reviews-carousel-image-custom__wrap');
const textCarousel = document.getElementById('home-reviews-carousel-text-custom__wrap');

if (instagramCarousel) {
  const appInstagramCarousel = new AppInstagramCarousel({
    target: instagramCarousel,
  });
}

if (imageCarousel) {
  const appHomeReviewsImageCarousel = new AppHomeReviewsImageCarousel({
    target: imageCarousel,
  });
}

if (textCarousel) {
  const appHomeReviewsTextCarousel = new AppHomeReviewsTextCarousel({
    target: textCarousel,
    props: {
      centered: true,
    },
  });
}
