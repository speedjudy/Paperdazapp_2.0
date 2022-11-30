<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit;">
      <span
        class="circle circle-12 bg-white cursor-pointer text-red-600"
        @click="closeModal()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042"
          />
        </svg>
      </span>
    </div>
    <!--End:: Close Button -->
    <template #title>
      <h4 class="text-center font-semibold text-xl">Upgrade Subscription</h4>
    </template>
       
      <!-- START:: Default Packages -->
  <main>
    <!-- START:: Warning-section -->
  <section v-if="proceedToNext">
    <div class="text-center py-4">
       <ul class="w-full text-left list-disc px-4">
        <li class="py-1">To upgrade subscription, previous subscription will be deleted</li>
        <li class="py-1">These process is irreversible</li>
        <li class="py-1">Charges applies</li>
      </ul>
       <button 
       @click="proceedToNext = false"
       class="py-2 mt-8 px-4 text-[15px] bg-red-500 text-white rounded-md my-2">Proceed to package</button>
    </div>
  </section>
   <!-- END:: Warning-section -->

 <!-- START: Package section -->
  <section v-else>
    <div v-if="errorMessage || stagingPackageArray.length < 1" class="text-center w-full">
      {{ this.errorMessage || "No package found" }}
    </div>

  <div v-else class="swiper mySwiperPackage">
    <div class="swiper-wrapper" ref="scrollwrapper">
    <div  
    v-for="(stagingPackage, index) in stagingPackageArray"
    :key="index+'package'"
      class="swiper-slide reletive">
      <div
      class="border-2 border-paperdazgreen-400 w-full rounded-2xl overflow-hidden relative pb-5"
      >
    <div class="promoted-banner" v-if="tags">{{ stagingPackage.tag }}</div>
    <h4
      ref="packagename"
      class="text-lg px-5 py-4 text-center uppercase font-semibold no-outline truncate"
      :contenteditable="edited"
    >
      {{ (stagingPackage || {}).name }}
    </h4>
    <div
      class="flex items-center justify-center text-white px-5 py-4"
      :class="[promoted ? 'bg-[#FEBA0A]' : 'bg-paperdazgreen-400']"
    >
      <span
        >$
        <span class="text-5xl font-medium">{{
          isMonthly ? (stagingPackage || {}).monthlyPrice : (stagingPackage || {}).yearlyPrice
        }}</span>
        /{{ isMonthly ? 'mo' : 'yr' }}</span
      >
    </div>
    <div class="px-5 py-4">
      <div class="flex justify-center mb-10" v-show="!lockPrice">
        <span class="mr-2">Yeary</span>
        <span
          class="inline-flex bg-opacity-30 w-12 rounded-full mr-2 cursor-pointer transition ease-in-out duration-200"
          :class="[
            isMonthly
              ? 'justify-end bg-paperdazgreen-300'
              : 'bg-paperdazgray-500',
          ]"
          @click="isMonthly = !isMonthly"
          ><span
            class="circle circle-12"
            :class="[
              isMonthly ? 'bg-paperdazgreen-300' : 'bg-paperdazgray-500',
            ]"
          ></span
        ></span>
        <span class="text-paperdazgray-300">Monthly</span>
      </div>
      <ul class="package-list">
        <li class="">
          <span><tick-icon width="20" height="20" /></span>
          <span>{{ (stagingPackage || {}).paperlink }} Paperlink files</span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
          <span>{{ (stagingPackage || {}).teamMembers }} Team members </span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
          <span>{{ (stagingPackage || {}).cc }} CC Flow </span>
        </li>
        <li v-for="feature in stagingPackage.features">
          <span><tick-icon width="20" height="20" /></span>
          <span class="truncate" :title="`${feature.title}\n ${feature.description}`">
             {{feature.title}} </span>
        </li>
      </ul>
    </div>

    <div class="grid place-items-center">
      <button
        :disabled="isLoading"
        @click="changeUserSubscription(stagingPackage)"
        class="text-sm text-white bg-paperdazgreen-400 rounded-lg shadow h-9 px-5 flex items-center"
        :class="[isLoading ? 'opacity-50' : 'opacity-100']"
      >
        Start Now
        <SpinnerDottedIcon
        v-show="isLoading"
         width="20" height="20" class="animate-spin ml-2"/>
      </button>
    </div>
  </div>

  
</div>  
 </div>
  <!-- <---- Navigation buttons --->

           <div 
           v-if="navigationButtonDisplay != 'next' && !isLoading"
           class="swiper-button-next"
           @click="nextPackage"
           >
              <button
                class="bg-white/30 backdrop-blur-sm shadow -rotate-90 transform absolute -translate-y-1/2 z-10 -translate-x-5 w-[40px] h-[40px] grid place-content-center rounded-full"
              >
                <ArrowDownIcon/>
              </button>
            </div>
            <div 
            v-if="navigationButtonDisplay != 'prev' && !isLoading" 
            @click="prevPackage"
            class="swiper-button-prev">
              <button
                class="bg-white/30 backdrop-blur-sm shadow rotate-90 transform absolute -translate-y-1/2 z-10 translate-x-4 w-[40px] h-[40px] grid place-content-center rounded-full"
              >
                <arrow-down-icon />
              </button>
            </div>
  </div>

    </section>
  <!-- START: Package section -->
</main>
      <!-- END:: Default package -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import TickIcon from '~/components/svg-icons/TickIcon.vue'
import AuthUser from '~/models/AuthUser'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import { ErrorHandler } from '~/components/functions/ErrorFunction'

export default Vue.extend({
  name: 'UpdateSubscription',
  components: { SpinnerDottedIcon, TickIcon, ArrowDownIcon, SpinnerDottedIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    subscriptionPlan:{
      type:Object
    }
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      isMonthly: true,
      promoted: undefined,
      stagingPackageArray:{},
      itemPackageWidth:null,
      navigationButtonDisplay:'prev',
      proceedToNext: true,
      isLoading:false
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible;
    this.getDefaultPackge()
  },
  computed: {
    tags() {
      this.promoted = this.stagingPackage?.tag
      return ( this.promoted != '' && this.promoted ? true : false )
    }, 
    user() {
      return this.$auth.user
    },
  },
   head() {
    return {
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

  methods: {
    nextPackage(){
     this.navigationButtonDisplay = null
     let getSlide =  document.querySelectorAll('.swiper-slide');
      if((this.itemPackageWidth/getSlide[0].clientWidth) >= getSlide.length - 1){
        this.navigationButtonDisplay = 'next'
       return
      }
     this.itemPackageWidth += getSlide[0].clientWidth
     this.$refs.scrollwrapper.style.transform= `translateX(-${this.itemPackageWidth}px)`
    },
    prevPackage(){
     this.navigationButtonDisplay = null
     let getSlide =  document.querySelectorAll('.swiper-slide');
     if((this.itemPackageWidth/getSlide[0].clientWidth) <= 0){
       this.navigationButtonDisplay = 'prev'
       return
     } 
     this.itemPackageWidth -= getSlide[0].clientWidth
     this.$refs.scrollwrapper.style.transform= `translateX(-${this.itemPackageWidth}px)`
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    getDefaultPackge(){
      this.$axios.get('/packages/?type=default&isActive=1')
      .then((response)=>{
        this.stagingPackageArray = response.data
      })
      .catch((err)=>{
        this.errorMessage = "No package gotten"
      })
    },

   changeUserSubscription(packageCard){

      if(this.isLoading) return

      this.isLoading = true;

     const subscribeData = {
                            packageId : packageCard.id,
                            isMonthly: this.isMonthly,
                            isUpdate: true
                            }
    // return
      this.$axios.post(`/subscriptions`, subscribeData)
      .then((response)=>{
        this.$notify.success({
        title:"subscription",
        message:"subscribe successful"
        })
        this.closeModal()
        this.$nuxt.refresh()
      })
      .catch(({response})=>{
        this.$notify.error({
        title:"subscription",
        message:'could not update subscription'
        })
      })
      .finally(()=>{
        this.isLoading = false
        })
   }
  },
 

})
</script>

<style scoped>
* >>> .el-dialog {
  width: 416px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 20px;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  /* padding-top: 0 !important;
  padding-bottom: 0 !important; */
  background: #fcfcfd;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.no-outline {
  outline: none !important;
}
.package-list {
  width: min-content;
  @apply mx-auto;
  & li {
    @apply inline-grid  gap-3 whitespace-nowrap mb-3 text-sm;
    grid-template-columns: min-content 1fr;
    & > *:nth-child(2) {
      color: #606060;
    }

    &:last-child {
      @apply mb-0;
    }
  }
}

.promoted-banner {
  @apply absolute
        right-0
        inline-block
        bg-paperdazgreen-400
        text-white text-xxs
        pt-6 pb-1 px-32;
  /* background: #77B550; */
  transform: translateX(50%) rotate(45deg);
  transform-origin: 50% 0%;
}
.swiper-wrapper{
  transition: 0.3s;
}
</style>
