<template>
  <div
  class="single-package-special relative border-2 bg-white border-paperdazgreen-400 w-full mx-3 my-2  shadow-md rounded-2xl overflow-hidden shadow-paperdazgray-300 pb-5"
  >
    <h4 class="text-lg px-5 py-4 text-center uppercase font-semibold mt-8">
        {{pagecontent.type}} Promoted
    </h4>
      
      <div v-if="standardTag" class="custom-card-tag bg-paperdazgreen-400 text-white">Popular</div>
      
      <div
      class="flex items-center justify-center text-white px-5 py-4"
       :class="[pagecontent.promoted ? 'bg-[#FEBA0A]' : 'bg-paperdazgreen-400']"
         >
      <span>
          $
        <span class="text-5xl font-medium">
                {{pagecontent.price}} 
        </span>
        /mon
        </span
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
          <span>
          {{ pagecontent.paperlinkfiles }}
           Paperlink files</span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
          <span>
          {{ pagecontent.teammembers }} 
          Team members </span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
          <span>
          {{ pagecontent.ccflow }}
           CC Flow </span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
         
          <span> {{pagecontent.publicprofile}}
              Public Profile </span>
        </li>
        <li>
          <span><tick-icon width="20" height="20" /></span>
          <span>
           {{pagecontent.pdfcopy}}
          PDF copy of all files </span>
        </li>
      </ul>
    </div>
    <div class="grid place-items-center" v-if="showBottomButton">
      <button  @click="$emit('bottom-button-clicked', { stagingPackage, isMonthly })"
        class="text-sm text-white bg-paperdazgreen-400 rounded-lg shadow h-9 px-5"
      >
        Start Now
      </button>
     
    </div>
  </div>
</template>

<script >
import Vue from 'vue'
import TickIcon from '../../svg-icons/TickIcon.vue'
export default Vue.extend({
  name: 'SelectMainsPackage',
  components: { TickIcon },
  props: ['packagecontent',"keyId","link"],
  data() {
    return {
      pagecontent:[],
      popactive:true,
      indexPop:true,
      standardTag:false,
      isMonthly:true,
      showBottomButton:true
    }
  },
  methods:{
      show:()=>{
          
      }
  },
     beforeMount() {
       this.pagecontent=this.packagecontent;
        this.standardTag=this.pagecontent.promoted
     },
     mounted(){
      
     }
  // beforeMount() {
  //   if (this.lockPrice) {
  //     this.isMonthly = String(this.lockPrice).toLowerCase() == 'monthly'
  //   }
  // },
})
</script>

<style lang="postcss" scoped>
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
</style>
