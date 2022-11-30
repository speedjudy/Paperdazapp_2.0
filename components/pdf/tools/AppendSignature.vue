<template>
  <!-- <button
    attr="sign"
    :elemFill="uploaded && initialimgDisplay"
    @click="setInitialImgDisplay"
    :uploaded="uploaded"
    class="button-contain cursor-pointer inline-flex items-center gap-2 py-1 pr-1 pl-2 tool-item text-white text-sm annot-button text-transparent"
    :class="[
      uploaded && initialimgDisplay
        ? 'bg-transparent text-transparent'
        : 'bg-paperdazgreen-300 text-white',
      $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ',
    ]"
  >
    <span v-if="!initialimgDisplay">Sign</span>

    <img
      v-if="!isCreator && initialimgDisplay && uploaded"
      class="absolute-image"
      :class="[uploaded ? 'z-[1]' : '-z-10']"
      :src="signature || ' '"
    />

    <span
      @click="popSign"
      class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"
      :class="[uploaded && initialimgDisplay ? 'opacity-0' : 'opacity-100']"
      ><svg
        width="12"
        height="12"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2869 8.24112L14.905 6.85919L9.42629 12.3281V0.400391H7.46611V12.3281L1.9972 6.84939L0.605469 8.24112L8.4462 16.0818L16.2869 8.24112Z"
          fill="currentColor"
        />
      </svg>
    </span>
    <DrawOrTypeModal
      v-model="showSignatureModal"
      :src="$auth?.user?.signatureURL || ' '"
      @image-exported="imageExportedLocal($event, true)"
      drawType="signature"
      use-default-button
    />
  </button> -->
  <div>
    <img v-if="!isCreator && initialimgDisplay && uploaded" class="absolute-image"
      :class="[uploaded ? 'z-[1]' : '-z-10']" :src="signature || ' '" />
    <img v-else src="../../../assets/img/sign-icon.png" attr="sign" :elemFill="uploaded && initialimgDisplay"
      :uploaded="uploaded" @click="setInitialImgDisplay" class="annot-button" :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ', isAgreedSign !== 1 && isSign ? 'pointer-events-none' : ''
      ]" width="18" />
  </div>

</template>

<script>
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import TeamAccess from '~/models/TeamAccess'
import { mapState } from 'vuex'
import FileAction from '~/models/FileAction'


export default mixins(SaveSignatureInitialsMixin).extend({
  props: {
    scale: Number,
    file: Object,
  },
  data() {
    return {
      showSignatureModal: false,
      signature: null,
      initialimgDisplay: false,
    }
  },
  mounted() {
    this.changeSignToBase64()
    console.log(this.loadedPdfFile, this.$auth?.user?.id)
  },
  computed: {
    ...mapState(['loadedPdfFile']),
    uploaded() {
      switch (this.$auth.loggedIn) {
        case true:
          return this.$auth?.user?.signatureURL !== null && !this.isCreator

        case false:
          return false
      }
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    },
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    style() {
      return {
        width: `${(this.scale || 1) * 22}px`,
        height: `${(this.scale || 1) * 22}px`,
      }
    },
  },
  methods: {
    changeSignToBase64() {
      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
          )

      toDataURL(this.$auth?.user?.signatureURL).then((dataUrl) => {
        this.signature = dataUrl
      })
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      console.log(image)
      this.imageExported(image, isSignature)
      // this.uploaded = true
    },
    popSign() {
      !this.isCreator && (this.initialimgDisplay = true);

      if (this.isCreator || !this.$auth.loggedIn) return
      if (!this.uploaded) this.showSignatureModal = true
    },
    setInitialImgDisplay() {
      !this.isCreator && (this.initialimgDisplay = true);
      this.$BUS.$emit('scrollToSignInitial', 'appendsigninitial')
    },
  },
  components: { DrawOrTypeModal },
  watch: {
    '$auth.user.signatureURL': async function () {
      this.changeSignToBase64()
    },
  },
})
</script>

<style scoped>
.absolute-image {
  transition: 0.25s;
  max-width: 200px;
  width: 70px;
  height: auto;
  @apply absolute top-0 left-[5%] opacity-100;
}
</style>
