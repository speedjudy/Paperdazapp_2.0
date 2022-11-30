<template>
  <div class="flex-1 rounded-3xl bg-white py-6 px-8">
    <!-- Start:: Signature section -->
    <section class="mb-16">
      <h3
        class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-2 relative mb-7"
      >
        <span class="flex items-center gap-3"
          >Signature <exclamation-icon class="text-paperdazgreen-300 w-4 h-4"
        /></span>
      </h3>
      <div
        class="border h-56 border-[#C4C4C4] rounded w-full bg-white flex flex-col justify-center items-center overflow-hidden p-4"
      >
        <div class="mb-4 text-gray-600 cursor-not-allowed">
          <img :src="signature" width="72" height="72" />
        </div>
        <button
          @click="showSignature"
          class="text-white rounded shadow bg-paperdazgreen-400 px-5 h-10 text-sm"
        >
          {{ !$auth.user.signature ? 'Create' : 'View / Update' }}
        </button>
      </div>
    </section>
    <!-- End:: Signature section -->

    <!-- Start:: Initials section -->
    <section>
      <h3
        class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-2 relative mb-7"
      >
        <span class="flex items-center gap-3"
          >Initials <exclamation-icon class="text-paperdazgreen-300 w-4 h-4"
        /></span>
      </h3>
      <div
        class="border h-56 border-[#C4C4C4] rounded w-full bg-white flex flex-col justify-center items-center overflow-hidden p-4"
      >
        <div class="mb-4 text-gray-600 cursor-not-allowed">
          <img
            :src="initial"
            width="72"
            height="72"
          />
        </div>
        <button
          @click="showInitial"
          class="text-white rounded shadow bg-paperdazgreen-400 px-5 h-10 text-sm"
        >
          {{ !$auth.user.initials ? 'Create' : 'View / Update' }}
        </button>
      </div>
    </section>
    <!-- End:: Initials section -->

    <draw-or-type-modal
      v-model="showSignatureModal"
      :src="usingSignature ? $auth.user.signatureURL : $auth.user.initialURL"
      @image-exported="imageExportedLocal($event)"
    />
  </div>
</template>

<script>
import ExclamationIcon from '~/components/svg-icons/ExclamationIcon.vue'
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import mixins from 'vue-typed-mixins'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import { initial } from 'lodash'
import initialURL from "~/assets/img/initials.png"
import signatureURL from "~/assets/img/sign.png"

export default mixins(SaveSignatureInitialsMixin).extend({
  name: 'SignatureInitialsTab',
  components: { ExclamationIcon, DrawOrTypeModal },
  data() {
    return {
      showSignatureModal: false,
      usingSignature: true,
    }
  },
  computed:{
    signature(){
        return this.$auth.user.signatureURL || signatureURL
    },
    initial(){
         return this.$auth.user.initialURL || initialURL
    }
  },
  methods: {
    showSignature() {
      this.usingSignature = true
      this.showSignatureModal = true
    },
    showInitial() {
      this.usingSignature = false
      this.showSignatureModal = true
    },
    imageExportedLocal(image) {
      this.imageExported(image, this.usingSignature)
    },
  },
})
</script>
