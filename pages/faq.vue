<template>
  <div class="bg-gradient-to-b from-[#E4F3E0] to-white">
    <section class="relative shadow">
      <div
        class="px-5 text-center text-black absolute inline-block transform top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        <h4 class="text-4xl lg:text-5xl font-semibold whitespace-nowrap">
          FAQ's
        </h4>
        <p class="text-[#414142] font-medium">Frequently Asked Questions</p>
      </div>
      <img
        src="~/assets/img/world_map.svg"
        alt=""
        class="w-full max-w-full max-h-80 min-h-[250px] object-cover"
      />
    </section>

    
    <section class="relative container min-h-[50vh] py-16">
         <!-- spinner before page loaded -->
      <div v-if="windowOnLoad" class="absolute w-full h-full min-h-[40vh] grid bg-white rounded-xl place-content-center z-10 top-0 left-0">
        <spinner-dotted-icon height="32" width="32" class="text-paperdazgray-400 animate-spin" />
      </div>

      <div>
        <ul class="tab-button-group">
          <li class="tab-button capitalize" 
          v-for="(category,index) in generalFaq"
          :key="index + category"
          :class="[ indexData == index ? 'text-white bg-paperdazgreen-500' : '']"
          :indexNum="index"
           @click="changeIndex(index)"
          >{{ category.name }}</li>
        </ul>
        <div class="w-full bg-white">
          <!-- Start:: General faqs -->
          <div v-show="tabIndex == 0">
            <ul class="w-full px-6 py-4">
              <li
                v-for="(faq, i) in subFaq[indexData]"
                :key="i"
                class="faq"
                :class="{ active: generalIndex == i }"
              >
                <div
                  class="grid grid-cols-[min-content,1fr,min-content] gap-4 items-center cursor-pointer"
                  @click="setGeneralIndex(i)"
                >
                  <!-- <span
                    class="circle circle-12 sm:circle-15 bg-paperdazgreen-400 text-white"
                  >
                    <search-icon class="w-3 sm:w-4 h-3 sm:h-4" currentcolor="white"/>
                  </span> -->
                  <span class="circle circle-12 sm:circle-15 bg-[#EFDF4D] text-paperdazgreen-400">ℚ</span>

                  <p class="text-[#505050] text-sm sm:text-base">
                    {{ faq.question }}
                  </p>
                  <span>
                    <arrow-down-icon
                      class="collapse-indicator"
                      width="16"
                      height="10"
                    />
                  </span>
                </div>
                <div class="collapsible text-xs sm:text-sm">
                  <div class="grid grid-cols-[min-content,1fr] gap-4 cursor-pointer mt-3">
                    <span class="circle circle-12 sm:circle-15 bg-[#EFDF4D] text-paperdazgreen-400">A</span>
                    <p class="text-gray-500">
                      {{ faq.answer}}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- End:: General faqs -->
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import Vue from 'vue'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import axios from "axios"
import { FAQ_URL } from '~/utils/axios-utils'
import ballloader from '~/components/loader/ballloader.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import $ from "jquery"

export default Vue.extend({
  components: { SearchIcon, ArrowDownIcon, ballloader, SpinnerDottedIcon },
  name: 'FaqPage',
  layout: 'landing',
  auth: false,
  head() {
    return {
      script: [
        // ...
        {
          hid: 'tawk.to',
          src: 'https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg',
          defer: true,
        },
      ],
    }
  },
     async fetch(){
      await this.$axios.get('/categories?$sort[position]=-1').
        then(response=> {
          let { data } = response ;
          this.generalFaq = data;
          // console.log("faqs-response",this.generalFaq)
          this.subFaq = this.generalFaq.map((e) => e.faqs)
          // console.log("faqs",this.subFaq)
          this.windowOnLoad = false
          })
         .catch(err=>{
            this.notify.error({
              message:"FAQ not loaded"
            })
       })
          .finally(()=>{
            // code goes in here
          })
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },
  data() {
    return {
      windowOnLoad : true,
      tabIndex: 0,
      indexTab:-1,
      generalIndex: -1,
      generalFaq:[],
      subFaq:[],
      indexData:0,
      offSpinner:true,
         }
  },
  methods: {
    setGeneralIndex(index) {
      this.generalIndex = this.generalIndex == index ? -1 : index
    },
    changeIndex(val){
      this.indexData = Number(val);          
      }
  },
  mounted(){},
})
</script>

<style lang="scss" scoped>
.spinner-container { 
  @apply absolute top-0 left-0 w-full h-full bg-white z-10 flex justify-center items-center;
  span{
      @apply w-9 h-9 rounded-full border-[3px] border-t-[4px] border-t-paperdazgreen-500 block animate-spin;
  }
}
.header {
  @apply text-2xl lg:text-3xl text-paperdazgreen-400 mb-1.5 lg:mb-2 font-semibold;
}

.body {
  @apply text-[#414142] font-medium text-sm lg:text-base;
}

.tab-button-group {
  @apply text-xs sm:text-sm font-medium;
  display: block;
  white-space: nowrap;
  overflow-x: scroll;
  min-width: 100%;
  // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  //grid-template-columns: repeat(4, 1fr);
  //gap: 1px;
  padding: 1px;

  & > .tab-button {
    --slide-size: 0px;
    cursor: pointer;
    width: calc(25% + 22.5px);
    // background: #CDE8CA;
    
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    transition: all 0.2s ease-in-out;

    clip-path: polygon(
      0% 0%,
      calc(100% - var(--slide-size)) 0%,
      100% 100%,
      var(--slide-size) 100%
    );

    @media only screen and (min-width: 375px) {
      --slide-size: 15px;
    }

    @media only screen and (min-width: 425px) {
      --slide-size: 20px;
    }

    @media only screen and (min-width: 640px) {
      --slide-size: 30px;
    }

    &:not(:first-child) {
      margin-left: calc(-1 * var(--slide-size));
    }

    &:first-child {
      clip-path: polygon(
        0% 0%,
        calc(100% - var(--slide-size)) 0%,
        100% 100%,
        0% 100%
      );
    }

    &:last-child {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, var(--slide-size) 100%);
    }
    &:hover {
      background: #a6e480;
    }

    &.active {
      @apply bg-paperdazgreen-400 text-white;
    }
  }
}

.faq {
  @apply py-3;

  &:not(:last-child) {
    @apply border-b border-[#C4C4C4];
  }

  & > .collapsible {
    transition: max-height 0.3s ease-in-out;
    max-height: 0;
    overflow: hidden;
  }

  & .collapse-indicator {
    transition: transform 0.3s ease-in-out;
    transform: rotateX(0deg);
  }

  &.active {
    & > .collapsible {
      max-height: 300px;
    }

    & .collapse-indicator {
      transform: rotateX(180deg);
    }
  }
} ::-webkit-scrollbar{
    width: 5px;
    height: 3px;
    cursor: pointer;

}
::-webkit-scrollbar-thumb{
    background-color:transparent;
    width: 0px; border-radius: 50px;
    cursor: pointer;
    transition: 0.2s;
}

::-webkit-scrollbar-track{
    cursor: pointer;
   @apply border-[1px] border-paperdazgreen-400
}
   ::-webkit-scrollbar-thumb:hover{ 
    background-color:#77C360 !important;
  }
</style>
