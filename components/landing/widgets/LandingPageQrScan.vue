<template>
  <section id="qr-scan-section" class="bg-gradient-to-t from-paperdazgreen-50 to-paperdazgreen-100">
    <div class="py-16">
      <div class="container">
        <h1 class="font-bold text-4xl text-center mb-12">Paperdaz Business Profile</h1>
        <div class="flex flex-wrap gap-3">
          <div class="drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] bg-white flex-1">
            <div class="flex flex-col justify-center content-between">
              <div class="px-8 py-8 bg-paperdazgreen-300 text-center">
                <h3 class="text-white font-bold mb-4 text-[38px]">Apple Dental</h3>
                <div class="p-2 bg-white w-fit mx-auto">
                  <vue-qr-code :text="qrCodeData" :size="qrCodeSize"></vue-qr-code>
                </div>
              </div>
              <div class="pt-3 pb-4 md:pb-6 flex justify-center">
                <logo-with-text class="mr-2 h-5 xs:h-6 sm:h-12 w-auto" />
              </div>
            </div>
          </div>
          <div class="flex-1 px-3 md:px-6 lg:px-10 pb-5 pt-8 md:pb-8 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] bg-white text-center flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-3xl mb-5">
                Scan Apple Dental’s QR Code to see Business Paperdaz Files!
              </h4>
              <div class="text-md mt-5 mb-3 md:mb-7 font-[600]">
                Your customer can simply scan QR code to access each file individually or all files at once on your <span class="text-paperdazgreen-300">Business Paperdaz Files</span>!
                <!-- <nuxt-link to="#" class="text-paperdazgreen-300">your Business Paperdaz Files</nuxt-link>! -->
              </div>
              <div>
                <p class="text-md mb-4 md:mb-10 font-[400] text-[20px]">
                  Simply register for a paid package, a QR code will be generated for each business account and for each Paperdaz file.
                </p>
                <div class="flex justify-center mt-3">
                  <button class="h-10 rounded-md shadow-md text-white bg-paperdazgreen-300 px-5 text-[13px] bg-paperdazgreen-300 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150 text-white rounded shadow px-3 flex items-center justify-center whitespace-nowrap">
                    <nuxt-link to="/register" class="hover:text-white	">Paperdaz Your Business</nuxt-link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-[2px] bg-white w-full"></div>
  </section>
</template>
<script>
import Vue from 'vue'
import VueQrCode from 'vue-qrcode-component'
import LogoWithText from '~/components/LogoWithText.vue'

export default Vue.extend({
  name: 'LandingPageQrScan',
  components: {
    LogoWithText,
    VueQrCode,
  },
  data() {
    return {
      qrCodeData: process.env.HOMEPAGE_LANDING_QR_CODE_DATA ?? window.location.origin,
      qrCodeSize: 200,
    }
  },
})
</script>
  