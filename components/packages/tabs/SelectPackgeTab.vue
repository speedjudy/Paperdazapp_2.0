<!-- NOTE THE JQUERY IS USED IN THE CUSTOM SLIDER -->
<!-- jUST A LITTLE APPLICATION OF JQUERY WHICH IS FOUND IN W3SCHOOL FOR REFRENCE -->

<template>
  <div>
    <form
      @submit.prevent="sendPackageCode"
      v-if="pagesDefault"
      class="flex items-center gap-2 w-full max-w-[500px] mx-auto mb-12"
    >
      <el-input
        ref="packagecode"
        placeholder="Enter promotional codes"
        v-model="promotionCode"
      />
      <button
        class="text-sm h-6 sm:h-10 bg-paperdazgreen-400 text-white rounded-lg px-5 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150 shadow px-3"
      >
        Update
      </button>
    </form>
    <!-- Start:: already existing package -->

    <transition name="fade" mode="out-in" :duration="200">
      <!-- Start:: already existing package -->
      <div v-if="pagesDefault" key="selecting">
        <div class="relative py-4">
          <div class="swiper mySwiper overflow-hidden" ref="swiper">
            <div
              class="swiper-wrapper py-8"
              ref="wrapper"
              :class="[orderedPackages.length < 2 ? 'flex justify-center' : 'item-center']"
            >
              <!-- <div class="swiper-slide">Slide 1</div> -->
              <div
                class="swiper-slide lg:w-[calc(33.33333333%-2rem)] md:w-[calc(50%-2em)] w-[calc(100%-2em)]"
                v-for="(p, i) in orderedPackages"
                :key="i"
                :ref="`slide-${i}`"
              >
                <package-card
                  :edited="false"
                  :create="false"
                  :promoted="i == 1"
                  show-bottom-button
                  class="package-card-check-width"
                  :style="{ '--count': orderedPackages.length }"
                  @bottom-button-clicked="$emit('next-tab', $event)"
                  :stagingPackage="p"
                />
              </div>
            </div>
            <div
              @click="nextPackage"
              v-if="showNav && showNext"
              class="swiper-button-next z-20"
            >
              <button
                class="bg-white/30 backdrop-blur-sm shadow -rotate-90 transform absolute -translate-y-1/2 z-10 -translate-x-5 w-[40px] h-[40px] grid place-content-center rounded-full"
              >
                <arrow-down-icon />
              </button>
            </div>
            <div v-if="showNav && showPrev" class="swiper-button-prev z-20">
              <button
                @click="prevPackage"
                class="bg-white/30 backdrop-blur-sm shadow rotate-90 transform absolute -translate-y-1/2 z-10 translate-x-4 w-[40px] h-[40px] grid place-content-center rounded-full"
              >
                <arrow-down-icon />
              </button>
            </div>
          </div>
        </div>
        <p class="font-medium text-lg text-center">
          Need a custom package for your business?
          <nuxt-link :to="`${$auth.loggedIn ? '../package?tablevel=1' : '/register'}`"
            ><button class="text-paperdazgreen-400 cursor-pointer">
              Create one
            </button>
          </nuxt-link>
        </p>
      </div>
      <!-- End:: already existing package -->

       <!-- Start:: Create custom package -->
       <div v-else key="creating">
        <select-custom-package @next-tab="$emit('next-tab', $event)" />
        <p class="font-medium text-lg text-center">
          Want to select pre-created packaged?
          <Nuxt-link to="/packages/?type=default"><button
            class="text-paperdazgreen-400 cursor-pointer"
          >
            Select Package
          </button>
        </Nuxt-link>
        </p>
      </div>
      <!-- End:: Create custom package -->
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import PackageCard from '~/components/settings/PackageCard.vue'
import _ from 'lodash'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import SelectCustomPackage from '../SelectCustomPackage.vue'
import SelectMainPackage from '../select-package/SelectMainPackage.vue'
import { Dummypackages } from '~/assets/json/dummy'
import Slider from '~/mixins/Slider'
import $ from 'jquery'
export default Vue.extend({
  components: {
    PackageCard,
    ArrowDownIcon,
    CheckIcon,
    SelectCustomPackage,
    SelectMainPackage,
  },
  name: 'SelectPackageTab',
  // mixins:[Slider],
  data() {
    return {
      creatingCustomPackage: false,
      promotionCode: undefined,
      pages: this.packages,
      packagecontent: Dummypackages.package,
      overflow: undefined,
      initialWidth: 0,
      showNav: false,
      showNext: true,
      showPrev: false,
    }
  },
  computed: {
    showPagination() {
      return this.orderedPackages.length > 1
    },
    orderedPackages() {
      // let temp = _.cloneDeep(this.packages)
      let temp = (this.packages || []).filter((el) => !el.visibility)
      temp.sort((a, b) => a.monthly_price - b.monthly_price)
      if (this.pagesDefault) {
        return temp
      } else if (this.pagesCustom) {
        return temp.filter((item) => item.type !== 'default')
      }
    },
  },
  props: {
    packages: {
      type: Array,
      default: () => [],
    },
    pagesDefault: {
      type: String,
      default: '',
    },
    pagesCustom: {
      type: String,
      default: '',
    },
  },
  methods: {
    nextPackage() {
      let getSliderItem = document.querySelectorAll('.swiper-slide')
      if (
        this.$refs.swiper.scrollWidth - this.$refs.swiper.scrollLeft ==
        this.$refs.swiper.clientWidth
      ) {
        this.showNext = false
        return
      }
      this.initialWidth = this.initialWidth + getSliderItem[0].clientWidth + 32
      $('.mySwiper').animate({ scrollLeft: this.initialWidth }, 500);
      this.scaleCenterPackage('.swiper-slide', '.swiper')
      this.showPrev = true
    },
    prevPackage() {
      this.initialWidth =
        this.initialWidth -
        document.querySelectorAll('.swiper-slide')[0].clientWidth -
        32
      if (this.initialWidth < 0) {
        this.initialWidth = 0
        this.showPrev = false
      }
      this.$refs.wrapper.style.cssText = `transition:0.3s;`
      $('.mySwiper').animate({ scrollLeft: this.initialWidth }, 500)
      this.showNext = true
    },
     scaleCenterPackage(child, parent){
        let children = document.querySelectorAll(child);
       let parentElem = document.querySelector(parent)
       children.forEach(element => {
         console.log(element.getBoundingClientRect().right)
        });
     },
     syncAllElemHeight(child, parent){
      setTimeout(() => {
        let children = document.querySelectorAll(child);
       let parentElem = document.querySelector(parent)
       let parentHeight = parentElem.clientHeight
       children.forEach(element => {
           element.style.height = parentHeight - 48 + 'px'
        });
      }, 20);
     },
    // scrollPackages(toLeft) {
    //   const packagesContainer = this.$refs.packagesContainer
    //   if (!packagesContainer) return
    //   packagesContainer.scrollBy({
    //     top: 0,
    //     left: toLeft ? -50 : 50,
    //     behavior: 'smooth',
    //   })
    // },
    sendPackageCode(event) {
      let { value } = this.$refs.packagecode
      this.$emit('setparams', value)
      //  this.promotionCode = null;
    },
  },
  mounted() {
    let { name } = this.$route.query
    this.creatingCustomPackage = !(name == 'default-package')
    window.onresize = function(){
      if($('.mySwiper'))
      this.initialWidth = 0
      $('.mySwiper').animate({ scrollLeft: this.initialWidth }, 500);
    }
  },
  watch: {
    orderedPackages: function () {
      setTimeout(() => {
        if (
          this.$refs.swiper.scrollWidth >
          Math.round(this.$refs.wrapper.clientWidth)
        )
          this.showNav = true
        else this.showNav = false
      }, 500)
      this.syncAllElemHeight('.swiper-slide', '.mySwiper')
    },
  },
})
</script>

<style lang="scss" scoped>
.scroll-container {
  @apply block whitespace-nowrap w-full overflow-x-scroll overflow-y-hidden py-6;
  div {
    @apply inline-block  xs:w-[300px] mx-3 whitespace-normal;
  }
}
.packages-container {
  @apply flex
        py-12
        gap-12
        sm:gap-8
        md:gap-12
        flex-col
        sm:flex-row
        mb-12;
  @apply px-3;
  //   @media only screen and (min-width: 640px) {
  //     @apply overflow-x-auto;
  //     scroll-snap-type: x mandatory;
  //   }
  // }
  .package-card-check-width {
    /* min-width: calc(100% / var(--count, 1)); */
    @media only screen and (min-width: 640px) {
      min-width: calc(100% / 2 - 16px);
      scroll-snap-align: start;
    }
    @media only screen and (min-width: 768px) {
      min-width: calc(100% / 2 - 24px);
      scroll-snap-align: start;
    }
    @media only screen and (min-width: 1024px) {
      min-width: calc(100% / 3 - calc(12px * 4) / 1.5);
    }
  }
}
::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  background-color: transparent;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}
.mySwiper {
  @apply overflow-x-hidden whitespace-nowrap;
}
.swiper-slide {
  display: inline-block;
  @apply whitespace-normal mx-4;
}
.swiper-button-prev {
  @apply absolute top-[calc(50%-20px)] left-[5px];
}
.swiper-button-next {
  @apply absolute top-[calc(50%-20px)] right-[40px];
}
</style>