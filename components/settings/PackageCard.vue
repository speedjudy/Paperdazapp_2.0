<template>
  <div
    class="border-2 border-paperdazgreen-400 w-full rounded-2xl overflow-hidden relative pb-5 h-[100%]"
  >
    <!-- <div class="promoted-banner" v-if="tags">{{ stagingPackage.tag }}</div> -->
    <div class="promoted-banner">Popular</div>
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
        <span class="mr-2">Monthly</span>
        <span
          class="inline-flex bg-opacity-30 w-12 rounded-full mr-2 cursor-pointer transition ease-in-out duration-200"
          :class="[
            !isMonthly
              ? 'justify-end bg-paperdazgreen-300'
              : 'bg-paperdazgray-500',
          ]"
          @click="isMonthly = !isMonthly"
          ><span
            class="circle circle-12"
            :class="[
              !isMonthly ? 'bg-paperdazgray-500' : 'bg-paperdazgreen-300',
            ]"
          ></span
        ></span>
        <span class="text-paperdazgray-300">Yearly</span>
      </div>
      <ul class="package-list">
        <li class="">
          <span><tick-icon width="20" height="20" /></span>
          <span>{{ (stagingPackage || {}).paperlink }} Paperdaz files</span>
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
          <span class="truncate " :title="`${feature.title}\n ${feature.description}`">
             {{feature.title}} </span>
        </li>
      </ul>
    </div>

    <div class="grid place-items-center" v-if="showBottomButton">
      <button
        @click="setPackageData"
        :disabled="disableStart"
        class="text-sm text-white bg-paperdazgreen-400 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150 rounded-lg shadow h-9 px-5"
      >
        Start Now
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TickIcon from '../svg-icons/TickIcon.vue'
import Plan from "~/models/Plan"

export default Vue.extend({
  name: 'PackageCard',
  components: { TickIcon },

  props: {
    showBottomButton: {
      type: Boolean,
      default: false,
    },
    edited: {
      type: Boolean,
    },
    create: {
      type: Boolean,
    },
    stagingPackage: {
      type: Object,
      required: true,
    },
    // monthly, yearly
    lockPrice: {
      type: String,
      default: '',
    },
    disableStart: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setPackageData() {
      let inputvalue = this.$refs.packagename.textContent.trim()
      let stagingPackageNew
      let isMonthly = this.isMonthly
      if (inputvalue != '') {
        stagingPackageNew = {
          ...this.stagingPackage,
          name: inputvalue,
          isMonthly: this.isMonthly,
        }
        this.$store.commit('PACKAGE_INFO', stagingPackageNew)
        this.$store.commit('PACKAGE_CREATE', this.create)
      }
      console.log(stagingPackageNew)
      // return
      this.$emit('bottom-button-clicked', { stagingPackageNew, isMonthly })
    },
  },
  data() {
    return {
      isMonthly: true,
      promoted: undefined,
    }
  },
  computed: {
    tags() {
      this.promoted = this.stagingPackage?.tag
      return ( this.promoted != '' && this.promoted ? true : false )
    }, 
  },
  beforeMount() {
    console.log('edited', this.edited)
    if (this.lockPrice) {
      this.isMonthly = String(this.lockPrice).toLowerCase() == 'monthly'
    }
  },
  mounted() {
    if(this.create) this.$refs.packagename.focus()
  },
})
</script>

<style lang="postcss" scoped>
.no-outline {
  outline: none !important;
}
.package-list {
  width: 100%;
  @apply mx-4;
  & li {
    @apply flex justify-center items-center mb-3 text-sm w-full;
    grid-template-columns: min-content 1fr;
    & > *:nth-child(1) {
      width: 40px;
    }
    & > *:nth-child(2) {
      color: #606060;
      display: flex;
      flex: 1 1 100%;
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
