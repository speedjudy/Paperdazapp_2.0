<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit">
      <span
        class="circle circle-12 bg-white cursor-pointer text-red-600"
        @click="closeModal()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042"
          />
        </svg>
      </span>
    </div>

    <div
      @click="$refs.uploadFileInput.click()"
      ref="dropArea"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop.prevent="drop"
      class="cursor-pointer mt-2 mx-auto px-4 py-8 flex flex-col items-center border-2 border-paperdazgreen-300 rounded-2xl max-w-3xl"
      :class="[isDraggedOver ? 'border-solid' : 'border-dashed']"
    >
      <span class="circle circle-46 bg-paperdazgreen-300 text-white mb-5">
        <cloud-icon width="47" height="47" />
      </span>

      <p class="text-base font-semibold">
        <span v-if="isDraggedOver"> Drop Here! </span>
        <span v-else>Click to Upload or Drag and Drop File Here!</span>
      </p>

      <p class="text-red-600 text-xs mt-2" v-show="dragErrorMessage">
        {{ dragErrorMessage }}
      </p>
    </div>

    <input
      type="file"
      accept="application/pdf,application/vnd.ms-excel"
      ref="uploadFileInput"
      hidden
      @change="uploadDocumentFromInput"
    />
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import CloudIcon from '../svg-icons/CloudIcon.vue'
export default Vue.extend({
  name: 'UploadDocumentModal',
  components: { SpinnerDottedIcon, CloudIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    folder:{
      type:Object
    }
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      isDraggedOver: false,
      dragErrorMessage: '',
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible;
   
  },
  methods: {  
    async moveToFolder(id){
      
      if(Object.keys(this.folder).length < 1) return

      await this.$axios
        .$patch(`/files/${id}`, {
          folderId: this.folder.id,})
        .then(() => {
          this.$notify.success({
          title: '',
          message: 'File moved successful',
          })
        })
      this.$emit('resetUserFolder')
    },
    async uploadDocument(file) {
      const formData = new FormData()
      formData.append('upload', file, file.name);
      formData.append("type", "file");
      formData.append("userId",(this.$auth.user).id)

      const loadingNotification = this.$notify.info({
        title: 'File Upload',
        message: 'File uploading ...',
        duration: 1000 * 60,
      })

      await this.$axios
        .$post('/files', formData)
        .then((response) => {
          this.moveToFolder(response.id)
          this.$notify.success({
            title: 'File Upload',
            message: 'File uploaded successfully',
          })

          // TODO: replace this with the id
          this.$nuxt.$router.push(`/pdf/${response?.paperLink}`)
        })
        .catch((error) => {
          this.$notify.error({
            title: 'File Upload',
            message: error?.response?.data || error.message,
          })
        })
        .finally(() => {
          loadingNotification.close()
        })
    },
    dragover(event) {
      event.preventDefault()
      this.isDraggedOver = true
      this.dragErrorMessage = ''
    },
    dragleave() {
      this.isDraggedOver = false
      this.dragErrorMessage = ''
    },
    drop(event) {
      event.preventDefault()
      this.isDraggedOver = false
      const file = event.dataTransfer?.files[0]

      if (!file) return

      if (file.type !== 'application/pdf') {
        this.dragErrorMessage = 'File type not supported. Upload pdf.'
        return
      }

      this.uploadDocument(file)
    },
    uploadDocumentFromInput(event) {
      const inputElement = event.currentTarget 
      if (!inputElement) return

      const file = inputElement.files?.length
        ? inputElement.files[0]
        : undefined

      if (!file) return

      this.uploadDocument(file)
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    onSubmit() {
      event?.preventDefault()

      if (this.loading) return

      this.loading = true
      this.errorMessage = ''

      setTimeout(() => {
        this.loading = false
        ;(async () => {
          // await this.$notify.info({
          //   title: 'Unimplemented',
          //   message: 'This feature has not been implemented',
          // })
        })()
        this.closeModal()
      }, 1000)



      // this.$axios
      //   .delete(`/package/${this.stagingPackage.id}`)
      //   .then(() => {
      //     ;(async () => {
      //       await this.$notify.success({
      //         title: 'Package Action',
      //         message: 'Package deleted successfully',
      //       })
      //     })()

      //     this.$emit('success')
      //     this.closeModal()
      //   })
      //   .catch((error) => {
      //     let message = ''
      //     if (
      //       error &&
      //       error.response &&
      //       error.response.data &&
      //       error.response.data.message
      //     ) {
      //       message = error.response.data.message
      //     } else {
      //       message = 'Server not reachable'
      //     }
      //     this.$notify.error({
      //       title: 'Delete Package',
      //       message,
      //     })
      //     this.errorMessage = message
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 600px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 20px;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  /* padding-top: 0 !important;
  padding-bottom: 0 !important; */
  background: #fcfcfd;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
