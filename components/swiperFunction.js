
export function swiper(data){
  new Swiper(data, {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    // slidesPerView: 3,
    // loop:true,
    centeredSlides: true,
     spaceBetween: 10,
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 30,
      modifier: 1,
      slideShadows: false,
    },
      breakpoints: {
        456: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    pagination: {
      el: ".swiper-pagination",
       clickable: true,
    },
     navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }
  })
}