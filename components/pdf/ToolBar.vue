<template>
  <section>
    <div class="bg-[#ec7272] text-white text-base px-6 py-2 flex items-center"
      v-if="isConfirm && !isLoading && $auth.loggedIn && !isScrollBottom && isCreator">
      <exclamation-icon class="text-white mr-2" />
      Please scroll to the end of file to confirm that you have read this file
    </div>
    <div class="flex justify-between h-full pt-2" v-if="userRole == 'free_user' && isSign && isAgreedSign === -1">
      <span class="float-left m-2 text-sm font-bold ">I agree to apply my electronic signature/initials.
        <input type="checkbox" class="ml-1" @change="checkBoxChange" /></span>
      <div class="float-right mr-4 pt-[2px]">
        <button class="bg-paperdazgreen-400 py-2 px-3 rounded mr-1 text-white font-semibold"
          @click="signContinue">Continue</button>
        <button class="bg-[#979797] px-2 rounded py-2 text-white font-semibold" @click="signCancel">Cancel</button>
      </div>
    </div>
    <div v-else v-if="userRole == 'free_user' && isSign && isAgreedSign === 1"
      class="h-full pt-2 font-bold pl-2 text-[#77b450]">
      You can sign and initial now.
    </div>
    <div v-else v-if="userRole == 'free_user' && isSign && isAgreedSign === 0"
      class="h-full pt-2 font-bold pl-2 text-[#77b450]">
      You can't sign and initial action.
    </div>
    <div v-if="!isLoading"
      class="tools-container-wrapper flex flex-wrap items-center justify-between bg-[#E8EAEC] w-full gap-x-1 gap-y-2 px-6 text-[#757575] text-base sm:text-2xl"
      :class="[isConfirm ? 'py-0' : 'py-2']">
      <button :class="[activeTool == TOOL_TYPE.text ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : 'opacity-100']" @click="setSelectedType(TOOL_TYPE.text)" v-if="isComplete">
        <pdf-text-tool-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.tick ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.tick)" v-if="isComplete">
        <pdf-tick-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.cross ? 'bg-paperdazgreen-300/40  tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.cross)" v-if="isComplete">
        <pdf-times-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.dot ? 'bg-paperdazgreen-300/40  tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.dot)" v-if="isComplete" class="text-base">
        <solid-circle-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.circle ? 'bg-paperdazgreen-300/40  tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.circle)" v-if="isComplete">
        <hollow-circle-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.line ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.line)" v-if="isComplete">
        <pdf-rectangle-tool-icon />
      </button>
      <button v-if="isComplete" :class="[activeTool == TOOL_TYPE.highlight ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.highlight)" class="text-[#FFCF27]">
        <pdf-highlight-tool-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.draw ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.draw)" v-if="isComplete">
        <pdf-pen-tool-icon />
      </button>
      <button :class="[activeTool == TOOL_TYPE.date ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.date)" v-if="isComplete">
        <calendar-icon />
      </button>
      <!-- <button 
      :class="[activeTool == TOOL_TYPE.date ? 'bg-paperdazgreen-300/40 tool' : '']"
      @click="setSelectedType(TOOL_TYPE.star)" v-if="isComplete">
        <star-icon />
      </button> -->
      <button :class="[activeTool == TOOL_TYPE.name ? 'bg-paperdazgreen-300/40 tool' : '',
      isCreator ? 'opacity-40' : '']" @click="setSelectedType(TOOL_TYPE.name)" v-if="isComplete">
        <user-profile-solid-icon />
      </button>

      <button class="text-[#5FA348]" @click="onImageClick" v-if="isComplete">
        <input type="file" ref="image" class="hidden" />
        <star-icon />
      </button>
      <!-- <button
        v-if="isComplete || isSign"
        @click="onSignClick"
        class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 text-white text-sm"
      >
        Sign
        <span
          class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"
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
      </button> -->
      <div v-if="isComplete" @click="onSignClick">
        <button
          class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 text-white text-sm">
          Sign
          <img src="../../assets/img/sign-icon.png" width="18" class="bg-slate-200 p-[2px]" />
          <!-- <span
          class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"
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
        </span> -->
        </button>
        <div v-if="!isCreator" class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-red-600 ml-11 cursor-pointer"
          @click="openSignModal">
        </div>
      </div>

      <!-- <button v-if="isSign && isCreator" @click="setSelectedType(TOOL_TYPE.appendSignature)" -->

      <button v-if="isSign && isCreator" @click="onSignClick"
        class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 text-white text-sm">
        Sign
        <!-- <span class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"><svg
            width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.2869 8.24112L14.905 6.85919L9.42629 12.3281V0.400391H7.46611V12.3281L1.9972 6.84939L0.605469 8.24112L8.4462 16.0818L16.2869 8.24112Z"
              fill="currentColor" />
          </svg>
        </span> -->
        <img src="../../assets/img/sign-icon.png" width="18" class="bg-slate-200 p-[2px]" />
      </button>

      <div v-if="isComplete">
        <button
          class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 tool-item text-white text-sm"
          @click="onInitialsClick">
          Initial
          <img src="../../assets/img/initial-icon.png" width="18" class="bg-slate-200 p-[2px]" />
          <!-- <span
          class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"
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
        </span> -->
        </button>
        <div v-if="!isCreator" class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-red-600 ml-12 cursor-pointer"
          @click="openInitialModal">
        </div>
      </div>

      <button v-if="isSign && isCreator"
        class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 tool-item text-white text-sm"
        @click="onInitialsClick">
        <!-- @click="setSelectedType(TOOL_TYPE.appendInitial)"> -->

        Initial
        <!-- <span class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"><svg
            width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.2869 8.24112L14.905 6.85919L9.42629 12.3281V0.400391H7.46611V12.3281L1.9972 6.84939L0.605469 8.24112L8.4462 16.0818L16.2869 8.24112Z"
              fill="currentColor" />
          </svg>
        </span> -->
        <img src="../../assets/img/initial-icon.png" width="18" class="bg-slate-200 p-[2px]" />

      </button>

      <!-- <p @click="signaturePad = !signaturePad">Signature Pad</p> -->
      <!--   
      <button
        @click="downloadPdf"
        class="text-xs text-white bg-paperdazgreen-400 px-2 rounded h-8"
      >
        Download
      </button> -->

      <button @click="undoFunction" v-if="isComplete && !isCreator" class="text-sm">UNDO</button>
    </div>

    <draw-or-type-modal v-model="showSignatureModal" :src="`${$auth?.user?.signatureURL}`"
      @image-exported="imageExportedLocal($event, true)" use-default-button />
    <draw-or-type-modal v-model="showInitialsModal" :src="`${$auth?.user?.initialURL}`"
      @image-exported="imageExportedLocal($event, false)" use-default-button />
    <div v-if="isLoading" class="w-full bg-paperdazgray-200 text-center">Loading PDF...</div>
    <pdf-not-logged-user v-model="showPdfNotLoggedInUser" />
    <AlertModal v-model="showAlert" />
  </section>

</template>

<script>
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import FileAction from '~/models/FileAction'
import TeamAccess from '~/models/TeamAccess'
import DrawOrTypeModal from '../modals/DrawOrTypeModal.vue'
import CalendarIcon from '../svg-icons/CalendarIcon.vue'
import ExclamationIcon from '../svg-icons/ExclamationIcon.vue'
import HollowCircleIcon from '../svg-icons/HollowCircleIcon.vue'
import PdfHighlightToolIcon from '../svg-icons/PdfHighlightToolIcon.vue'
import PdfPenToolIcon from '../svg-icons/PdfPenToolIcon.vue'
import PdfRectangleToolIcon from '../svg-icons/PdfRectangleToolIcon.vue'
import PdfTextToolIcon from '../svg-icons/PdfTextToolIcon.vue'
import PdfTickIcon from '../svg-icons/PdfTickIcon.vue'
import PdfTimesIcon from '../svg-icons/PdfTimesIcon.vue'
import SolidCircleIcon from '../svg-icons/SolidCircleIcon.vue'
import StarIcon from '../svg-icons/StarIcon.vue'
import UserProfileSolidIcon from '../svg-icons/UserProfileSolidIcon.vue'
import TOOL_TYPE from './data/toolType'
import PdfNotLoggedUser from './modals/PdfNotLoggedUser.vue'
import AlertModal from './modals/AlertModal.vue'

export default {
  components: {
    DrawOrTypeModal,
    PdfTextToolIcon,
    PdfTickIcon,
    PdfTimesIcon,
    SolidCircleIcon,
    HollowCircleIcon,
    PdfRectangleToolIcon,
    PdfHighlightToolIcon,
    PdfPenToolIcon,
    CalendarIcon,
    UserProfileSolidIcon,
    StarIcon,
    ExclamationIcon,
    PdfNotLoggedUser,
    AlertModal
  },
  mixins: [SaveSignatureInitialsMixin],
  data: () => ({
    showAlert: false,
    selectedType: null,
    activeTool: '',
    components: { PdfTextToolIcon },
    signaturePad: false,
    showSignatureModal: false,
    showInitialsModal: false,
    showPdfNotLoggedInUser: false,
    signAgreeChecked: false,
  }),
  props: {
    file: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    selectedToolType: {}
  },
  computed: {
    TOOL_TYPE() {
      return TOOL_TYPE
    },
    isCreator() {
      try {
        return (this.file.userId == this.$auth?.user?.id) ||
          ((this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE) && this.$auth?.user?.teamId == this.file.userId)
      } catch (e) {
        return false
      }
    },
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isScrollBottom() {
      return this.$store.state.scrollPosition;
    },
    userRole() {
      return this.$auth.user.role;
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    }
  },
  methods: {
    onImageClick() {
      if (this.isCreator) {
        this.setSelectedType(this.TOOL_TYPE.star)
      }
    },
    signContinue() {
      if (this.signAgreeChecked) {
        this.$store.commit('SET_AGREE_SIGN');
      } else {
        this.showAlert = true;
      }
    },
    signCancel() {
      this.$store.commit('UN_SET_AGREE_SIGN');
    },
    checkBoxChange(e) {
      this.signAgreeChecked = e.target.checked
    },
    allowAnnotationsSign_Initial(type) {
      switch (this.isCreator && (this.isComplete || this.isSign)) {
        case true:
          if (type == (this.TOOL_TYPE.appendSignature))
            return type == (this.TOOL_TYPE.appendSignature)
          else if (type == this.TOOL_TYPE.appendInitial)
            return type == this.TOOL_TYPE.appendInitial
          else if (type == this.TOOL_TYPE.star)
            return type == this.TOOL_TYPE.star

        default:
          return this.isCreator ? false : true
      }

    },
    undoFunction() {
      if (!this.$auth.loggedIn) {
        !this.$auth.loggedIn ? this.showPdfNotLoggedInUser = true : null
        return
      }
      this.$emit('undo')
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      this.imageExported(image, isSignature)
    },
    setSelectedType(type) {
      if (!this.$auth.loggedIn) {
        !this.$auth.loggedIn ? this.showPdfNotLoggedInUser = true : null
        return
      }
      if (!this.allowAnnotationsSign_Initial(type)) return

      if (this.selectedType == type) this.selectedType = this.selectedType
      else this.selectedType = type
      this.$emit('tool-change', this.selectedType)
      this.activeTool = this.selectedType || ''
    },
    downloadPdf() {
      this.$BUS.$emit('download-pdf')
    },
    onSignClick() {
      if (!this.$auth.loggedIn) {
        !this.$auth.loggedIn ? this.showPdfNotLoggedInUser = true : null
        return
      }
      if (!this.isCreator) {
        this.setSelectedType(this.TOOL_TYPE.signature)
      }
      else {
        this.setSelectedType(this.TOOL_TYPE.appendSignature)
      }
    },
    openSignModal() {
      if (!this.isCreator) {
        this.showSignatureModal = true
      }
    },
    openInitialModal() {
      if (!this.isCreator) {
        this.showInitialsModal = true
      }
    },
    onInitialsClick() {
      if (!this.$auth.loggedIn) {
        !this.$auth.loggedIn ? this.showPdfNotLoggedInUser = true : null
        return
      }
      if (!this.isCreator) {
        this.setSelectedType(this.TOOL_TYPE.initial)
      }
      else {
        this.setSelectedType(this.TOOL_TYPE.appendInitial)
      }
    },
  },
  watch: {
    'file.fileAction': function () {
      this.setSelectedType(null)
    },
    selectedToolType: function () {
      this.activeTool = this.selectedToolType == null ? null : this.activeTool
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.tools-container-wrapper {
  button {
    @apply p-2
  }

  .tool {
    @apply w-12 h-12 grid place-items-center rounded-full;
  }
}
</style>
