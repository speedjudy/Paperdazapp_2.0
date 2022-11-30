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
      <h4 class="text-center font-semibold text-xl">Are you sure?</h4>
    </template>
    <!-- Start:: Body -->
    <p
      class="text-center font-medium max-w-[300px] mx-auto mb-6 whitespace-normal"
    >
      You want to delete your billing information from Paperdaz?
    </p>
    <div class="flex justify-around">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-not-allowed h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
        type="button"
        :disabled="loading"
        @click="closeModal()"
      >
        Cancel
      </button>
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-red-500"
        :disabled="loading"
        @click="onSubmit"
      >
        <span class="inline-flex gap-1 items-center">
          Delete
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
  name: 'DeleteBillingInformationModal',
  components: { SpinnerDottedIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      packageId:undefined,
      errorMessage: '',
      loading: false,
      proceedToNextFunction: false
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
    async onSubmit() {
      event?.preventDefault()

      if (this.loading) return

      this.loading = true
      this.errorMessage = ''

      // setTimeout(() => {
      //   this.loading = false
      //   ;(async () => {
      //     await this.$notify.info({
      //       title: 'Unimplemented',
      //       message: 'This feature has not been implemented',
      //     })
      //   })()
      //   this.closeModal()
      // }, 1000)

    //this is an optional call can be deleted 
      await this.$axios
          .get(`/packages/?userId=${(this.$auth.user).id}`)
          .then((response )=>{
            let [packageData] = response.data
            this.proceedToNextFunction = true
            this.packageId = packageData.id
          })
          .catch((error)=>{
            console.log('')
          })
          
         if(!this.proceedToNextFunction) return
  

      await this.$axios
        .get(`/cards/?userId=${(this.$auth.user).id}`)
        .then((response) => {
          let [cardResponse] = response.data.data
         this.packageId = cardResponse.id
          ;(async () => {
               await this.$axios.delete(`/cards/${this.packageId}`)
               .then(async()=>{
                    await this.$notify.success({
                    title: 'Package Action',
                    message: 'Card deleted successfully',
                    })
                //refresh page after deleted card
                this.$nuxt.refresh()
               })
               .catch(()=>{
                    this.$notify.error({
                    title: 'Package Action',
                    message: 'Oops, error occured',
                    })
               })
          })()

            this.$emit('success')
            this.closeModal()
        })
        .catch((error) => {
          let message = ''
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message = error.response.data.message
          } else {
            message = 'Server not reachable'
          }
          this.$notify.error({
            title: 'Delete Package',
            message,
          })
          this.errorMessage = message
        })
        .finally(() => {
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
