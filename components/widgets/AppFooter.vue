<template>
  <footer class="bg-paperdazgreen-50">
    <div
      class="flex flex-wrap flex-col gap-10 lg:gap-5 lg:flex-row items-center container py-12"
    >
      <div class="flex flex-col gap-2 items-center">
        <logo-with-text class="h-17 xs:h-6 sm:h-10 w-auto" />
        <span class="text-[#888392]">Contactless Paper</span>
      </div>
      <div
        class="flex-1 flex flex-wrap flex-col lg:flex-row items-center gap-15 sm:gap-16 text-[#6C6777] justify-center"
      >
        <a href="/#key-features-section">Features</a>
        <nuxt-link to="/packages/?type=default">Packages</nuxt-link>
        <!-- <a href="/#upload-file-section">Upload File</a> -->
        <nuxt-link to="/about">About</nuxt-link>
        <nuxt-link to="/faq">FAQ</nuxt-link>
        <nuxt-link to="/contact-us">Contact Us</nuxt-link>
      </div>

      <div class="flex flex-col gap-2 items-center">
        <h4 class="font-semibold text-lg">Find us on</h4>
        <div class="flex flex-wrap items-center gap-2">
          <span
            @click="socialShareFunction('facebook')"
            class="circle circle-15 cursor-pointer bg-paperdazgreen-300 text-white"
          >
            <facebook-icon height="18" />
          </span>
          <span
           @click="socialShareFunction('linkedin')"
            class="circle circle-15 cursor-pointer bg-paperdazgreen-300 text-white"
          >
            <linked-in-icon height="17" />
          </span>
          <span
          @click="socialShareFunction('instagram')"
            class="circle circle-15 cursor-pointer bg-paperdazgreen-300 text-white"
          >
            <instagram-icon height="16" />
          </span>
          <span
            @click="socialShareFunction('twitter')"
            class="circle circle-15 cursor-pointer bg-paperdazgreen-300 text-white"
          >
            <twitter-icon height="16" />
          </span>
        </div>
      </div>
    </div>
    <div class="bg-paperdazgreen-500 py-3">
      <div class="container flex items-center justify-center text-white">
        <small>iambui LLC, Paperdaz &copy; Copyright 2020, All Rights Reserved </small>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue'
import LogoWithText from '../LogoWithText.vue'
import EnvelopeIcon from '../svg-icons/EnvelopeIcon.vue'
import FacebookIcon from '../svg-icons/FacebookIcon.vue'
import LinkedInIcon from '../svg-icons/LinkedInIcon.vue'
import ReditIcon from '../svg-icons/ReditIcon.vue'
import TwitterIcon from '../svg-icons/TwitterIcon.vue'
import WhatsappIcon from '../svg-icons/WhatsappIcon.vue'
import InstagramIcon from '../svg-icons/InstagramIcon.vue'
export default Vue.extend({
  name: 'AppFooter',
  components: {
    LogoWithText,
    FacebookIcon,
    LinkedInIcon,
    EnvelopeIcon,
    TwitterIcon,
    WhatsappIcon,
    ReditIcon,
    InstagramIcon
  },
  methods:{
    socialShareFunction(val){
         switch (val) {
          case 'linkedin':
            window.open(`https://www.linkedin.com/company/80987259/`)
            break;
          case 'whatsapp':
            window.open(`whatsapp://send?text=${window.location.origin}`)
            break; 
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${window.location.origin}`)
            break; 
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`)
            break; 
          case 'instagram':
            window.open(`https://www.instagram.com/paperdaz_/`)
            break;  
         }
      },
  }
})
</script>
