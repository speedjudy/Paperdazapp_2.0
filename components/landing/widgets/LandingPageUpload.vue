<template>
  <section
    id="upload-file-section"
    class="bg-gradient-to-t from-[rgba(119,195,96,0.1)] to-[rgba(119,195,96,0.2)]"
  >
    <div class="bg-white">
      <div class="container py-14">
        <h1 class="font-bold text-4xl text-center mb-2">
          Click to upload files to create a Paperlink
        </h1>
        <p
          class="font-semibold text-center text-sm text-paperdazgray-300 mx-auto max-w-md mb-6"
        >
          Complete a file here then share our mission on one social media
          platform!
        </p>
      </div>
    </div>
    <div class="py-20 cursor-pointer" @click="$nuxt.$router.push(`/dashboard`)">
      <div class="container">
        <div class="shadow-lg rounded-2xl bg-white px-4 py-16">
          <div
            class="mt-2 mb-14 mx-auto px-4 py-16 flex flex-col items-center border-2 border-paperdazgreen-300 border-dashed rounded-2xl max-w-3xl "
          >
            <span
              class="circle circle-46 bg-paperdazgreen-300 text-white"
            >
              <cloud-icon width="47" height="47" />
            </span>

          </div>
          <!-- Start:: not allowed icon container -->
          <div
            class="grid max-w-3xl mx-auto gap-4"
            style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"
          >
            <div
              v-for="(field, i) in notAllowedFields"
              :key="i"
              class="flex items-center gap-3 sm:gap-5"
            >
              <div
                class="h-16 w-16 rounded-lg bg-white border border-paperdazgray-200 flex items-center justify-center relative text-paperdazgreen-300"
              >
                <component :is="field.icon" />
                <not-allowed-traffic-icon
                  class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <span>{{ field.text }}</span>
            </div>
          </div>
          <!-- End:: not allowed icon container -->
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Vue from 'vue'
import CloudIcon from '~/components/svg-icons/CloudIcon.vue'
import DocumentIcon from '~/components/svg-icons/DocumentIcon.vue'
import EnvelopeIcon from '~/components/svg-icons/EnvelopeIcon.vue'
import FacebookIcon from '~/components/svg-icons/FacebookIcon.vue'
import LinkedInIcon from '~/components/svg-icons/LinkedInIcon.vue'
import NotAllowedTrafficIcon from '~/components/svg-icons/NotAllowedTrafficIcon.vue'
import PenIcon from '~/components/svg-icons/PenIcon.vue'
import PrinterIcon from '~/components/svg-icons/PrinterIcon.vue'
import ReditIcon from '~/components/svg-icons/ReditIcon.vue'
import TwitterIcon from '~/components/svg-icons/TwitterIcon.vue'
import WhatsappIcon from '~/components/svg-icons/WhatsappIcon.vue'
import DownloadIcon from '~/components/svg-icons/DownloadIcon.vue'
import UploadIcon from '~/components/svg-icons/UploadIcon.vue'
import ScannerIcon from '~/components/svg-icons/ScannerIcon.vue'
export default Vue.extend({
  name: 'LandingPageUpload',
  components: {
    CloudIcon,
    FacebookIcon,
    LinkedInIcon,
    ReditIcon,
    EnvelopeIcon,
    TwitterIcon,
    WhatsappIcon,
    NotAllowedTrafficIcon,
    PenIcon,
    DocumentIcon,
    PrinterIcon,
    DownloadIcon,
    UploadIcon,
    ScannerIcon,
  },
  data() {
    return {
      notAllowedFields: [
        {
          icon: 'pen-icon',
          text: 'No Pen',
        },
        {
          icon: 'document-icon',
          text: 'No Paper',
        },
        {
          icon: 'printer-icon',
          text: 'No Printer',
        },
        {
          icon: 'download-icon',
          text: 'No Download',
        },
        {
          icon: 'upload-icon',
          text: 'No Upload',
        },
        {
          icon: 'scanner-icon',
          text: 'No Scanner',
        },
      ],
    }
  },
})
</script>
