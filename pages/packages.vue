<template>
  <div class="" style="">
    <section class="container pt-14 pb-24">
      <!-- Start:: tab indicator -->
      <div
        class="tab-indicator-container"
        :class="{ second: tabLevel >= 2, third: tabLevel >= 3 }"
      >
        <div
          class="tab-indicator-circle circle circle-30 border-8 font-medium"
          :class="{ active: tabLevel >= 1 }"
        >
          $

          <span class="highlight">1. Select Package</span>
        </div>
        <div
          class="tab-indicator-circle circle circle-30"
          :class="{ active: tabLevel >= 2 }"
        >
          <span class="highlight">2. Basic Info</span>
          <user-profile-solid-icon height="20" width="20" />
        </div>
        <div
          class="tab-indicator-circle circle circle-30"
          :class="{ active: tabLevel >= 3 }"
        >
          <span class="highlight">3. Payment</span>
          <payment-card-icon height="20" width="20" />
        </div>
      </div>
      <!-- End:: tab indicator -->

      <div class="relative">
        <div v-if="isLoading" class="absolute top-0 left-0 bg-white w-full h-[300px] flex justify-center items-center z-10">
           <SpinnerDottedIcon class="animate-spin" width="40"/>
        </div>
        <keep-alive>
          <component
            :is="currentTabComponent"
            @next-tab="nextTab($event)"
            :staging-package-info="stagingPackageInfo"
            :packages="packages"
            pagesDefault="default-package"
            @setparams="setParams"
          />
        </keep-alive>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import PackageBasicInfoTabVue from '~/components/packages/tabs/PackageBasicInfoTab.vue'
import PackagePaymentTabVue from '~/components/packages/tabs/PackagePaymentTab.vue'
import SelectPackgeTabVue from '~/components/packages/tabs/SelectPackgeTab.vue'
import MailIcon from '~/components/svg-icons/MailIcon.vue'
import PaymentCardIcon from '~/components/svg-icons/PaymentCardIcon.vue'
import UserProfileSolidIcon from '~/components/svg-icons/UserProfileSolidIcon.vue'
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'

export default mixins(GlobalMixin).extend({
  components: { UserProfileSolidIcon, MailIcon, PaymentCardIcon, SpinnerDottedIcon },
  name: 'defaultpackagepage',
  layout: 'landing',
  auth: false,
  data() {
    return {
      tabLevel: 1,
      stagingPackageInfo: undefined,
      packages: [],
      type: 'type',
      property: 'default',
      packages: [],
      isLoading:true
    }
  },
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
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },

  mounted() {
    console.log('package-query', this.$route.query)
    this.popModal()
    this.getPackages()
  },

  computed: {
    currentTabComponent() {
      switch (this.tabLevel) {
        case 1:
          this.$nuxt.$router.push(`/packages?type=default`)
          return SelectPackgeTabVue
        case 2:
          this.$nuxt.$router.push(`/packages?tablevel=2`)
          return PackageBasicInfoTabVue
        case 3:
          this.$nuxt.$router.push(`/packages?tablevel=3`)
          return PackagePaymentTabVue
        default:
          return {
            render(createElement) {
              return createElement('h1', 'Unknown tab')
            },
          }
      }
    },
  },
  methods: {
    async getPackages() {
      let query = this.$route.query
      let type = Object.keys(query)
      let property = Object.values(query)

      const packages = await this.$axios
        .$get(`/packages/?${type}=${property}&isActive=1`)
        .then((response) => {
          this.packages = response
          this.alertEmptypackage(response.length < 1)
        })
        // .$get(`/subscriptions/?status=active`)
        // .then((response) => {
        //   console.log('response=====>',response);
        //   this.packages = response.data;
        //   this.alertEmptypackage(response.length < 1)
        // })
        .catch((err) => {
          this.$notify.error({
            title: 'Alert',
            message: 'No Package not Found',
            type: 'error',
          })
        })
        .finally(()=>{
          this.isLoading = false
        })
    },
    nextTab(val) {
      if (this.tabLevel == 1) {
        this.stagingPackageInfo = val
      }
      this.tabLevel+=2
    },
    alertEmptypackage(val) {
      if (!val) return
      this.$notify({
        title: 'Package',
        message: 'No package found',
      })
    },
    setParams(val) {
      if (val != undefined && val.trim() != '') {
        this.$router.push({
          path: '/packages',
          query: { promoCode: val },
        })
        return
      }
      this.$router.push({
        path: '/default-package',
        query: { type: 'default' },
      })
    },
    popModal() {},
  },
  watch: {
    '$route.query'() {
      if(Object.keys(this.$route.query)[0] == 'type'){
        window.location.reload()
        this.getPackages()
      }
      else if(Object.keys(this.$route.query)[0] == 'promoCode'){
        this.getPackages()
      }

      if(Object.keys(this.$route.query)[0] == 'tablevel')
       this.tabLevel = Number(this.$route.query.tablevel)
    },
  },
})
</script>

<style lang="scss" scoped>
.tab-indicator-container {
  @apply mx-auto relative flex items-center justify-between mb-20 w-full max-w-[600px];
  --circle-size: 60px;

  &.second::before {
    background: #77b550;
  }

  &.third::after {
    background: #77b550;
  }

  &::before {
    content: '';
    position: absolute;
    height: 2px;
    left: calc(var(--circle-size) + 3px);
    width: calc(50% - calc(var(--circle-size)) * 1.5 - 3px * 2);
    background: #909090;
  }

  &::after {
    content: '';
    position: absolute;
    height: 2px;
    left: calc(50% + var(--circle-size) / 2 + 3px);
    width: calc(50% - calc(var(--circle-size)) * 1.5 - 3px * 2);
    background: #909090;
  }
}

.tab-indicator-circle {
  @apply border-2 border-[#909090] text-[#909090] text-2xl relative;

  &.active {
    @apply border-paperdazgreen-400 text-paperdazgreen-400;
  }

  & .highlight {
    @apply absolute text-xs whitespace-nowrap;
    top: calc(100% + 8px);
  }
}
</style>
