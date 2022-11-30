export default {
    // data() {
    //     return {
    //         nextPackage: 0
    //     }
    // },
    head() {
      return {
        script: [
          {
            hid: 'stripe',
            src: '/slider-component/swiper.js',
            defer: true,
            callback: () => {
              //start of new swiper instance loaded immediately the component is loaded
              new Swiper('.mySwiper', {
                effect: 'coverflow',
                // loop:true,
                grabCursor: true,
                keyboard: {
                  enabled: true,
                },
                centeredSlides: false,
                // slidesPerView: 3,
                // loop:true,
                spaceBetween: 5,
                coverflowEffect: {
                  rotate: 0,
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
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                  },
                },
                pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
                },
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
              })
            },
          },
        ],
        // loading of the style sheet immediately the component is loaded
        link: [
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: '/slider-component/swiper.css',
          },
        ],
      }
    },
    mounted(){
      // if (!process.server && !window.jQuery) {
      //   const script = document.createElement("script");
      //   script.onload = this.onScriptLoaded;
      //   script.type = "text/javascript";
      //   script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js";
      //   document.head.appendChild(script);
      // } else {
      //   this.onScriptLoaded();
      // }
    //  alert(process.browser)
      // loadJsFile(url, id, onLoadedCallback, defer, async) {
      //   if (process.browser) {
      //     let test = document.getElementById(id);
      //     if (test) return onLoadedCallback();
      //     else {
      //       const script = document.createElement("script")
      //       script.src = url
      //       script.id = id
      //       script.onload = onLoadedCallback
      //       script.type = "text/javascript"
      //       script.defer = defer == true || defer == undefined ? true : false
      //       script.async = async == true || defer == undefined ? true : false
      //       document.head.appendChild(script)
      //     }
      //   }
      // }
    }
    // methods:{
    //     slideToNext(event, parent){
    //         let children = document.querySelectorAll(`${parent}>.swiper-wrapper>.swiper-slide`)
    //         let wrapper = document.querySelector(`${parent}>.swiper-wrapper`)
    //         let parentElem = document.querySelector(parent)

    //         wrapper.style.transitionDuration = `0.3s`

    //         if(children[children.length - 1].getBoundingClientRect().right - 
    //            parentElem.getBoundingClientRect().left - 
    //            parentElem.getBoundingClientRect().width < 2)
    //            {
    //          return  
    //         }
             
    //         setTimeout(() => {
    //           this.nextPackage = ++this.nextPackage
    //           let getSlideWidth = children[0].clientWidth * this.nextPackage;
    //           wrapper.style.left = `${-getSlideWidth}px`
    //           event.target.parentElement.classList.add('opacity-50')
    //         }, 200);

    //     //     let containerMidSection = Math.floor(parentElem.getBoundingClientRect().right)
    //     //    for(let i= 0; i<children.length; i++) {
    //     //         let childMidSection = Math.floor(children[i].getBoundingClientRect().right)
    //     //         if(containerMidSection === childMidSection) {
    //     //             children[i+1].classList.add("active-package")
    //     //         }
    //     //         else{
    //     //             children[i].classList.remove("active-package")
    //     //         }
    //     //     };
    //       },
    //       slideToPrev(event, parent){
    //         let children = document.querySelectorAll(`${parent}>.swiper-wrapper>.swiper-slide`)
    //         let wrapper = document.querySelector(`${parent}>.swiper-wrapper`)
    //         let parentElem = document.querySelector(parent)
      
    //         if(this.nextPackage <= 0)
    //            {
    //          return  
    //         }
            
    //        setTimeout(() => {
    //         this.nextPackage = --this.nextPackage
    //         let getSlideWidth = children[0].clientWidth * this.nextPackage;
    //         wrapper.style.transitionDuration = `0.3s`
    //         wrapper.style.left = `${-getSlideWidth}px`
    //        }, 200);
    //       },
    // }
}