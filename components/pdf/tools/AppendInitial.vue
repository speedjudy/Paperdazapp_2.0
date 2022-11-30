<template>
  <!-- <button
    attr="initial"
    :elemFill="uploaded && initialimgDisplay"
    :uploaded="uploaded"
    @click="setInitialImgDisplay"
    class="button-contain cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 tool-item text-white text-sm annot-button"
    :class="[
      uploaded && initialimgDisplay
        ? 'bg-transparent text-transparent'
        : 'bg-paperdazgreen-300 text-white',
      $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ',
    ]"
  >
    <span v-if="!initialimgDisplay">Initial</span>
    <img
      v-if="!isCreator && initialimgDisplay && uploaded"
      class="absolute-image"
      :class="[uploaded ? 'z-[1]' : '-z-10']"
      :src="initial || ' '"
    />

    <span
      @click="popInitial"
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
      v-model="showInitialModal"
      :src="$auth?.user?.initialURL || ' '"
      @image-exported="imageExportedLocal($event, false)"
      drawType="initial"
      use-default-button
    />
  </button> -->
  <div>
    <img v-if="!isCreator && initialimgDisplay && uploaded" class="absolute-image"
      :class="[uploaded ? 'z-[1]' : '-z-10']" :src="initial || ' '" />
    <img v-else src="../../../assets/img/initial-icon.png" attr="initial" :elemFill="uploaded && initialimgDisplay"
      :uploaded="uploaded" @click="setInitialImgDisplay" class="annot-button" :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'pulse' : ' ', isAgreedSign !== 1 && isSign ? 'pointer-events-none' : ''
      ]" width="18" />
  </div>

</template>

<script>
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import TeamAccess from '~/models/TeamAccess'
import { mapState } from 'vuex'
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import FileAction from '~/models/FileAction'

export default mixins(SaveSignatureInitialsMixin).extend({
  props: {
    scale: Number,
    file: Object,
  },
  computed: {
    ...mapState(['loadedPdfFile']),
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    },
    uploaded() {
      switch (this.$auth.loggedIn) {
        case true:
          return this.$auth?.user?.initialURL !== null && !this.isCreator

        case false:
          return false
      }
    },
    style() {
      return {
        width: `${(this.scale || 1) * 22}px`,
        height: `${(this.scale || 1) * 22}px`,
      }
    }
  },
  data() {
    return {
      showInitialModal: false,
      initial: null,
      initialimgDisplay: false,
    }
  },
  components: { AddToPageDrawOrType, DrawOrTypeModal },
  methods: {
    changeInitialToBase64() {
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

      toDataURL(this.$auth?.user?.initialURL).then((dataUrl) => {
        this.initial = dataUrl
      })
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      this.imageExported(image, isSignature)
      // this.uploaded = true
    },
    popInitial() {
      !this.isCreator && (this.initialimgDisplay = true);
      if (this.isCreator || !this.$auth.loggedIn) return
      if (!this.uploaded) this.showInitialModal = true
    },
    setInitialImgDisplay() {
      !this.isCreator && (this.initialimgDisplay = true);
      this.$BUS.$emit('scrollToSignInitial', 'appendsigninitial')
    },
  },
  mounted() {
    this.changeInitialToBase64()
  },
  watch: {
    '$auth.user.initialURL': async function () {
      this.changeInitialToBase64()
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
