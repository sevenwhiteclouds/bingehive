const slides = document.querySelectorAll('.slide');
const staticWidth = 300; //px
const bannerWidth = 404; //px
let carouselItemsOnScreen;
let listLength;

handleCarouselResponsive();
getListLength();

async function getListLength() {
    listLength = (await (await fetch('/api/getList')).json()).length;

    if (document.querySelector('#b1') !== null){ {
        if (listLength < carouselItemsOnScreen) {
            document.querySelector("#b2").style.display = 'none';
        }
    }}
}

function handleCarouselResponsive() {

  slides.forEach((slide) => {
    slide.style.paddingRight = window.innerWidth - staticWidth + 'px';
  });

  let widthOfItem = window.getComputedStyle(slides[0]).paddingRight.replace('px', '');

  carouselItemsOnScreen = (parseInt(widthOfItem) + staticWidth)/bannerWidth;
}

window.addEventListener("resize", handleCarouselResponsive);

const listCarousel = createCarousel('list-carousel');
const trendingCarousel = createCarousel('Trending-carousel');
const genre0Carousel = createCarousel('genre0-carousel');
const genre1Carousel = createCarousel('genre1-carousel');
const genre2Carousel = createCarousel('genre2-carousel');
const genre3Carousel = createCarousel('genre3-carousel');

if (document.querySelector('#b1') !== null){
    document.querySelector('#b1').addEventListener('click', listCarousel.prevSlide);
    document.querySelector('#b2').addEventListener('click', listCarousel.nextSlide);
}

document.querySelector('#b3').addEventListener('click', trendingCarousel.prevSlide);
document.querySelector('#b4').addEventListener('click', trendingCarousel.nextSlide);

document.querySelector('#b5').addEventListener('click', genre0Carousel.prevSlide);
document.querySelector('#b6').addEventListener('click', genre0Carousel.nextSlide);

document.querySelector('#b7').addEventListener('click', genre1Carousel.prevSlide);
document.querySelector('#b8').addEventListener('click', genre1Carousel.nextSlide);

document.querySelector('#b9').addEventListener('click', genre2Carousel.prevSlide);
document.querySelector('#b10').addEventListener('click', genre2Carousel.nextSlide);

document.querySelector('#b11').addEventListener('click', genre3Carousel.prevSlide);
document.querySelector('#b12').addEventListener('click', genre3Carousel.nextSlide);

function createCarousel(elementID) {
  let currentIndex = 0;
  const carousel = document.querySelector(`#${elementID}`);
  const carouselItems = document.querySelectorAll(`#${elementID} .carousel-item`);

  function prevSlide() {

      currentIndex = (currentIndex - carouselItemsOnScreen);
      updateCarousel(this);

      // Scuffed way of changing nextSlide button display
      let id = this.id;
      id = id.substring(1);
      id = parseInt(id) + 1;
      id = 'b' + id;
      document.querySelector(`#${id}`).style.display = 'block';

      if (currentIndex === 0) {
        this.style.display = 'none';
      }

  }

  function nextSlide() {

    currentIndex = (currentIndex + carouselItemsOnScreen);
    updateCarousel(this);

    if (currentIndex === carouselItems.length/carouselItemsOnScreen) {
      this.style.display = 'none';
    }

    // Scuffed way of changing prevSlide button display
    if (currentIndex !== 0) {
      let id = this.id;
      id = id.substring(1);
      id = parseInt(id) - 1;
      id = 'b' + id;
      document.querySelector(`#${id}`).style.display = 'block';
    }

  }

  function updateCarousel(button) {

    if (currentIndex + carouselItemsOnScreen > carouselItems.length) {
      carousel.style.transform = `translateX(-${(carouselItems.length - carouselItemsOnScreen) * bannerWidth}px)`;
      button.style.display = 'none';

    }  else if (currentIndex < 0) {
      carousel.style.transform = `translateX(0px)`;
      button.style.display = 'none';
      currentIndex = 0;

    } else {
      carousel.style.transform = `translateX(-${currentIndex * bannerWidth}px)`;
    }

  }

  return { prevSlide, nextSlide };
}