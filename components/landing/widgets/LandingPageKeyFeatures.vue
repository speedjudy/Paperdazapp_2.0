<template>
  <section id="key-features-section">
    <div class="container py-20 content-center">
      <h1 class="font-bold text-4xl text-center mb-2">Key Features</h1>
      <p
        class="font-semibold text-center text-sm text-paperdazgray-300 mx-auto max-w-md mb-6"
      >
        Paperdaz will replace paper
      </p>

      <div
        class="my-12 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-2 sm:gap-x-[6.5rem] gap-y-10"
      >
        <div v-for="(block, i) in fets" :key="i">
          <img
            class="mx-auto"
            :src="'/icons/keyfeatures/' + block.img"
            alt=""
          />
          <p class="mt-5 text-center font-semibold">{{ block.tag }}</p>
          <p
            class="mt-3 text-center text-[13px] text-paperdazgray-400 font-medium"
          >
            {{ block.des }}
          </p>
        </div>
      </div>
    </div>
    <landing-divider />
  </section>
</template>

<script>
import Vue from 'vue'
import LandingDivider from './LandingDivider.vue';

export default Vue.extend({
    name: "LandingPageKeyFeatures",
    components: {
      LandingDivider,
    },
    data: () => ({
        fets: [
            {
                tag: "Paperdaz",
                des: "Direct Url link to every file",
                img: "Paperdaz_bg_white.svg",
            },
            {
                tag: "QR Code",
                des: "Simply scan to direct access to file",
                img: "QRCode_bg_white.svg",
            },
            {
                tag: "Papertag ",
                des: "Easy search with tag names for each file",
                img: "Papertag_bg_white.svg",
            },
            {
                tag: "Annotation Tools",
                des: "Type, Check, Line, Highlight, X, Circle, Draw, Signature, Name, Initials       ",
                img: "AutomationTool_bg_white.svg",
            },
            {
                tag: "Privacy Setting",
                des: "Public, Private, Do Not Post",
                img: "Privacy_bg_white.svg",
            },
            {
                tag: "Share & Request",
                des: "Easy  to share or send an action request",
                img: "ShareRequest_bg_white.svg",
            },
            {
                tag: "Transparency",
                des: "Copy of completed file will be sent to all users.",
                img: "Transparency_bg_white.svg",
            },
            {
                tag: "Security",
                des: "256-bit encryption to keep files secured",
                img: "Security_bg_white.svg",
            },
        ],
    }),
})
</script>