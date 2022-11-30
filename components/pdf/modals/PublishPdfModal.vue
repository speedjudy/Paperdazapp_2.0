<template>
  <el-dialog :visible.sync="showModal" :append-to-body="true" style="" :show-close="false" center
    class="relative text-[#414042]">
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit;">
      <span class="circle circle-12 bg-white cursor-pointer text-red-600" @click="closeModal()">
        <svg width="12" height="12" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042" />
        </svg>
      </span>
    </div>
    <!--End:: Close Button -->
    <template #title>
      <span class="text-center font-semibold text-xl"></span>
    </template>
    <!-- Start:: Body -->
    <div v-if="isCreator" class="flex justify-center pb-2">
      <CheckedFillIcon width="90" />
    </div>
    <span v-if="!isCreator">Do you want these file to be saved as
      {{ `${(file.fileAction + 'ed').replace('ee', 'e')}` }}?</span>
    <span v-else class="w-full text-center block py-0 px-2 pb-8 text-[16px]">Publish file as
      <span class="capitalize">{{
          isCreator
            ? file.fileAction
            : `${(file.fileAction + 'ed').replace('ee', 'e')}`
      }}</span>?</span>
    <div class="flex justify-around mt-6">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-not-allowed h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgray-400"
        type="button" :disabled="isLoading" @click="closeModal()">
        Cancel
      </button>
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
        :disabled="isLoading" @click="onSubmit">
        <span class="inline-flex gap-1 items-center">
          Yes
          <spinner-dotted-icon v-show="isLoading" height="20" width="20" class="animate-spin" />
        </span>
      </button>
    </div>
    <!-- end :: body -->

    <draw-or-type-modal v-model="showInitialModal" :src="$auth?.user?.signatureURL || ' '"
      @image-exported="imageExportedLocal($event, true)" use-default-button />
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import { file } from '@babel/types'
import CheckedFillIcon from '../../svg-icons/CheckedFillIcon.vue'
import FileAction from '~/models/FileAction'
import { ExtractFormPdf } from '~/components/functions/extractFormPdf'
import TeamAccess from '~/models/TeamAccess'
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'
import { type } from 'os'
import initialURL from "~/assets/img/initials.png"
import signatureURL from "~/assets/img/sign.png"

export default mixins(SaveSignatureInitialsMixin).extend({
  name: 'PublishPdfModal',
  components: {
    SpinnerDottedIcon,
    CheckedFillIcon,
    DrawOrTypeModal,
    AddToPageDrawOrType,
  },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tools: { type: Array },
    file: { type: Object },
    startGeneratePdf: { type: Function },
    successFileFunction: { type: Function },
    trackSubmitTools: { type: Function },
  },
  computed: {
    signature() {
      return this.$auth.user.signatureURL || signatureURL
    },
    initial() {
      return this.$auth.user.initialURL || initialURL
    },
    pdfOffsetY() {
      return this.$store.state.pdfOffset_y * this.$store.state.pdfScale
    },
    pdfOffsetX() {
      return this.$store.state.pdfOffset_x * this.$store.state.pdfScale
    },
    ledgerInfo() {
      return {
        userId: this.$auth?.user?.id,
        fileName: this.file.fileName,
        action: this.file.fileAction,
        fileId: this.file.id,
      }
    },
    isSign() {
      return this.file.fileAction == FileAction.SIGNED
    },
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    signLabel() {
      let date = new Date()
      return `P${date.getFullYear()}${this.convertToDoubleString(
        date.getUTCDate()
      )}${this.convertToDoubleString(
        date.getUTCDay()
      )}${this.convertToDoubleString(
        date.getUTCHours()
      )}${this.convertToDoubleString(
        date.getUTCMinutes()
      )}${this.$auth.user.firstName.charAt(0)}${this.$auth.user.lastName.charAt(
        0
      )}`.toUpperCase()
    },
    confirmAnnotation() {
      let date = new Date()
      return {
        signaturePath: this.base64,
        text: `P${date.getFullYear()}${this.convertToDoubleString(
          date.getUTCDate()
        )}${this.convertToDoubleString(
          date.getUTCDay()
        )}${this.convertToDoubleString(
          date.getUTCHours()
        )}${this.convertToDoubleString(
          date.getUTCMinutes()
        )}${this.$auth.user.firstName.charAt(
          0
        )}${this.$auth.user.lastName.charAt(0)}`.toUpperCase(),
        fileAction: this.file.fileAction,
      }
    },
  },
  data() {
    return {
      showModal: false,
      isLoading: false,
      base64: null,
      proceedToSendEmail: false,
      generatedPdf: {},
      showInitialModal: false,
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
    '$auth.user': function () {
      this.convertImageToBase64(this.$auth?.user?.signatureURL)
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit('signature-update', image)
      this.imageExported(image, 'signature-update')
    },
    confirmCheckedTools() {
      return (
        this.tools.filter((item, index) => item.isChecked == false).length > 0
      )
    },
    convertToDoubleString(val) {
      return Number(val) < 10 ? `0${val}` : val
    },
    async convertImageToBase64(src) {
      const response = await fetch(src)
      const imageBlob = await response.blob()
      const reader = new FileReader()
      reader.readAsDataURL(imageBlob)
      reader.onloadend = () => {
        const base64data = reader.result
        this.base64 = base64data
      }
    },
    addToLedger() {
      this.$axios
        .post(`/ledger?userId=${this.$auth?.user?.id}`, { ...this.ledgerInfo })
        .then(() => {
          this.proceedToSendEmail = true
          this.publishAsGuest()
        })
        .catch(() => {
          this.$notify.error({
            message: 'Error occcured, could not send file',
          })
        })
    },
    appendConfirmSign() {
      console.log(
        ExtractFormPdf({
          downloadLink: this.file.downloadLink,
          file: this.confirmAnnotation,
          pdfOffset_y: this.pdfOffsetY,
          pdfOffset_x: this.pdfOffsetX,
        })
      )
    },
    confirmAllSignAndInitials() {
      if (this.$auth.user.id == this.file.userId) return true
      else
        return (
          ExtractFormPdf(this.file.downloadLink)[0].data.filter(
            (item) => item.hasOwnProperty('uploaded') && item.uploaded == null
          ).length < 1
        )
    },
    async confirmRequest() {
      await this.$axios
        .post('/pdf-generator', {
          ...ExtractFormPdf({
            downloadLink: this.file.downloadLink,
            file: this.confirmAnnotation,
            pdfOffset_y: this.pdfOffsetY,
            pdfOffset_x: this.pdfOffsetX,
            signLabel: this.signLabel,
          })[0],
        })
        .then((response) => {
          this.generatedPdf = response.data
          this.addToLedger()
        })
        .catch(() => { })
        .finally(() => {
          this.isLoading = false
        })
    },
    async otherRequest() {
      await this.$axios
        .post('/pdf-generator', {
          ...ExtractFormPdf({
            downloadLink: this.file.downloadLink,
            pdfOffset_y: this.pdfOffsetY,
            pdfOffset_x: this.pdfOffsetX,
            signLabel: this.signLabel,
          })[0],
        })
        .then((response) => {
          this.addToLedger()
          this.generatedPdf = response.data
        })
        .catch(() => {
          this.$notify.error({
            message: 'Error occcured, could not save file',
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    sendPdfToEmail() {
      let requestData = {
        action: this.file.fileAction,
        link: this.generatedPdf.downloadLink,
        fileId: this.file.id,
      }
      //   // return
      this.$axios
        .$post(`/request`, requestData)
        .then((response) => {
          this.successAction()
          this.$nuxt.refresh()
          this.$store.commit('SET_PDF_EXIT', true)
          // window.location.assign('/dashboard')
        })
        .catch((err) => {
          this.$notify.error({
            title: 'Request',
            message: 'Request Failed',
          })
        })
        .finally(() => {
          this.closeModal()
          this.isLoading = false
          this.proceedToSendEmail = false
        })
    },
    allowLoadingAllAnnotations(ms) {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve()
        }, ms)
      })
    },
    async publishAsGuest() {
      this.closeModal();
      this.tools = this.tools.filter((e) => e.isDeleted != true);
      this.tools.map((val, ind) => {
        if (val.type == "star"){
          val['completed'] = true;
        }
        if (val.type == "appendSignature"){
          val['completed'] = this.signature;
        }
        if (val.type == "appendInitial"){
          val['completed'] = this.initial;
        }
      })
      this.$axios
        .patch(`/files/${this.file.id}`, {
          fileAction: this.file.fileAction,
          annotaions: JSON.stringify(this.tools),
        })
        .then(() => {
        })
        .catch(() => {
          this.$notify.error({
            message: 'Error occcured, could not save file',
          })
        })
        .finally(() => {
        })

      if (!this.proceedToSendEmail) {

        switch (this.file.fileAction) {
          case FileAction.CONFIRM:
            await this.confirmRequest()
            break
          case FileAction.SIGNED:
            await this.otherRequest()
            break
          case FileAction.COMPLETE:
            await this.otherRequest()
            break
        }
      } else {
        this.sendPdfToEmail()
      }
    },
    publishAsCreator() {

      this.tools = this.tools.filter((e) => e.isDeleted != true);

      this.$axios
        .patch(`/files/${this.file.id}`, {
          fileAction: this.file.fileAction,
          annotaions: JSON.stringify(this.tools),
        })
        .then(() => {
          this.closeModal()
          this.$notify.success({
            message: 'File publish successfully',
          })
          this.$store.commit('SET_PDF_EXIT', true)
          window.location.assign('/dashboard')
        })
        .catch(() => {
          this.$notify.error({
            message: 'Error occcured, could not save file',
          })
        })
        .finally(() => {
          this.closeModal()
          this.isLoading = false
        })
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    successAction() {
      this.$emit('successFileFunction')
      this.closeModal()
    },
    onSubmit() {
      if (!this.confirmAllSignAndInitials()) {
        this.$notify.error({
          message: 'Input all signs and initial to save',
        })
        return
      }

      if (
        !this.isCreator &&
        !this.$auth.user.signatureURL &&
        this.file.fileAction == FileAction.CONFIRM
      ) {
        this.showInitialModal = true
        return
      }
      this.$emit('startGeneratePdf', true)
      this.appendConfirmSign()
      this.isLoading = true
      // this.proceedToSendEmail = false
      if (!this.isCreator && !this.proceedToSendEmail) {
        this.$notify.info({
          message: 'Pdf generating.....',
          duration: 1000 * 7,
        })
        this.allowLoadingAllAnnotations(6000).then(() => {
          this.isCreator ? this.publishAsCreator() : this.publishAsGuest()
          this.$emit('startGeneratePdf', false)
        })
      } else {
        this.isCreator ? this.publishAsCreator() : this.publishAsGuest()
      }
      this.$emit('trackSubmitTools', this.tools)
    },
  },
})
</script>

<style scoped>
*>>>.el-dialog {
  width: 416px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}

*>>>.el-dialog__header {
  padding-bottom: 20px;
}

*>>>.el-dialog__header,
*>>>.el-dialog__footer {
  text-align: left !important;
}

*>>>.el-dialog__body {
  /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
  background: #fcfcfd;
}

*>>>.el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
