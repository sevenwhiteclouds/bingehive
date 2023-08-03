function createCarousel(elementID) {
    let currentIndex = 0;
    // TODO: Temp hard-code. SIZE references how many cells fit on page. Will need to do dynamically somehow.
    const SIZE = 4;
    // TODO: Temp hard-code. Lists are yet to be implemented
    const listLength = 3;
    const carousel = document.querySelector(`#${elementID}`);
    const carouselItems = document.querySelectorAll(`#${elementID} .carousel-item`);

    if (listLength < SIZE) {
        document.querySelector("#b2").style.display = 'none';
    }

    function prevSlide() {
        if (currentIndex !== 0) {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel();

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
    }

    function nextSlide() {
        if (currentIndex !== carouselItems.length/SIZE){
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel();
            if (currentIndex === carouselItems.length/SIZE) {
                this.style.display = 'none';
            }
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

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    return { prevSlide, nextSlide };
}

    const listCarousel = createCarousel('list-carousel');
    const trendingCarousel = createCarousel('Trending-carousel');
    const genre0Carousel = createCarousel('genre0-carousel');
    const genre1Carousel = createCarousel('genre1-carousel');
    const genre2Carousel = createCarousel('genre2-carousel');
    const genre3Carousel = createCarousel('genre3-carousel');

    document.querySelector('#b1').addEventListener('click', listCarousel.prevSlide);
    document.querySelector('#b2').addEventListener('click', listCarousel.nextSlide);

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