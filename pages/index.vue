<template>
  <div class="">
    <div class="bg-white min-h-[60vh] grid place-items-center">
      <hero-page />
    </div>
    <landing-divider />
    <landing-page-info />
    <landing-page-qr-scan />
    <landing-page-key-features class="bg-gradient-to-t from-white to-[rgba(119,195,96,0.1)]" />
    <landing-join-section />
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import HeroPage from '~/components/landing/widgets/HeroPageV2.vue'
import LandingJoinSection from '~/components/landing/widgets/LandingJoinSection.vue'
import LandingPageInfo from '~/components/landing/widgets/LandingPageInfo.vue'
import LandingPageKeyFeatures from '~/components/landing/widgets/LandingPageKeyFeatures.vue'
import LandingPageQrScan from '~/components/landing/widgets/LandingPageQrScan.vue'
import LandingDivider from '~/components/landing/widgets/LandingDivider.vue'

@Component({
  layout: 'landing',
  auth: false,
  components: {
    HeroPage,
    LandingPageInfo,
    LandingPageQrScan,
    LandingPageKeyFeatures,
    LandingJoinSection,
    LandingDivider,
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },

})
export default class LandingPage extends Vue {
  beforeframe = true
  gsapLoaded = false
  motionPluginLoaded = false

  get gsapReadyToSetup() {
    return this.gsapLoaded && this.motionPluginLoaded
  }

  head() {
    return {
      title: 'Paperdaz',
      script: [
        {
          hid: 'gsap',
          src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.gsapLoaded = true
          },
        },
        {
          hid: 'gsap-motion-plugin',
          src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/MotionPathPlugin.min.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.motionPluginLoaded = true
          },
        },
        {
          hid: 'tawk.to',
          src: 'https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg',
          defer: true,
        },
      ],
    }
  } // end head method

  @Watch('gsapReadyToSetup')
  watchGsap(val) {
    if (val) {
      // @ts-ignore
      gsap.registerPlugin(MotionPathPlugin)
      // Check LandingJoinSection for elements
      // @ts-ignore
      gsap.to('#email', {
        duration: 5,
        repeat: 12,
        repeatDelay: 2,
        ease: 'power1.inOut',
        motionPath: {
          path: '#path',
          align: '#path',
          autoRotate: 30,
          alignOrigin: [0.5, 0.5],
          offsetY: -3,
        },
      })
    }
  } // end watcher method watchGsap
} // end class LandingPage
</script>

