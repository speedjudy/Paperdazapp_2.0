<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
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
    <!--End:: Close Button -->
    <template #title>
      <h4 class="text-center font-semibold text-xl">Create Folder</h4>
    </template>
    <!-- Start:: Body -->
    <p
      class="text-center block font-medium  mx-auto mb-6 whitespace-none"
    >
       <input
       v-model="folderName"
       class="w-full py-4 px-4 border-[1px] border-paperdazgrey-200 rounded-md"
       placeholder="Enter Folder Name"
       />
    </p>
    <div class="flex justify-around">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[90%] 
        shadow-md
         text-white rounded-lg shadow bg-paperdazgreen-400"
        :disabled="loading"
        @click="onSubmit"
      >
        <span class="inline-flex gap-1 items-center text-[16px]">
         Create
          <spinner-dotted-icon
            v-show="loading"
            height="20"
            width="20"
            class="animate-spin"
          />
        </span>
      </button>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
  name: 'create-company-folder',
  components: { SpinnerDottedIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    packagename: {
       type: String
    },
    visible: {
      type: Boolean,
      default: false,
    },
    userFile:{
      type: Object
    }
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      folderName:'',
      loading: false,
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
    this.showModal = this.visible
  },
  methods: {
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    async moveCompanyFiles(index){
       if(Object.keys(this.userFile).length === 0) return

       this.$axios
        .$patch(`/files/${this.userFile.id}`, {
          folderId: index,
        })
        .then(() => {
          this.$notify.success({
          title: 'File',
          message: 'Moved successfully',
          })
          this.$emit('updateVisibility', false)
          this.$emit('refresh')
          this.$emit("resetUserFile")
          })
        .catch((err) => {
          this.$notify.error({
          title: 'Package',
          message: 'Unable to move file',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSubmit() {
      event?.preventDefault()
      // return
      if(this.folderName.trim().length < 1) return
      if (this.loading) return

      this.loading = true
      this.errorMessage = ''

       
       let folderData = {
        name: this.folderName
       }


      this.$axios
        .$post(`/folders`,folderData)
        .then(async(response) => {
           this.$notify.success({
           title: 'Folder',
           message: 'Folder created successfully',
           })
          await this.moveCompanyFiles(response.id)
          this.$emit("resetUserFile")
          this.$nuxt.refresh()
          this.$emit('updateVisibility', false)
          this.$emit('refresh')
          this.folderName = ''
        })
        .catch((err) => {
          this.$notify.error({
          title: 'Folder',
          message: 'Unable to created Folder',
          })
        })
          .finally(()=>{
            this.loading = false
          })
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 416px !important;
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
