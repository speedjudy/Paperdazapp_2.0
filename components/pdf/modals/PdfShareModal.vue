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
      <h4 class="text-center font-semibold text-2xl text-gray-800 pb-2">
        Share
      </h4>
    </template>
    <!-- Start:: Body -->
    <form @submit.prevent="onSubmit" action="" class="max-w-[470px] mx-auto"
    
    >
      <div class="grid grid-cols-[1fr,min-content] items-center gap-3 mb-8">
       <div>
        <input 
        v-for="mail in emails"
        :key="email"
        placeholder="Email" type="email"  required 
        class="my-1 p-3 w-full border-[1px] border-grey rounded-[7px] outline-green resize-none"/>
       </div>

        <div
        @click="addEmails"
          class="circle circle-18 bg-gray-600 text-white font-medium text-xl cursor-pointer"
        >
          +
        </div>
      </div>

      <el-input
        type="textarea"
        :rows="6"
        placeholder="Description"
        v-model="description"
        class="resize-none"
      >
      </el-input>
   <div class="flex justify-around pt-5">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[100%] 
         text-white rounded-md shadow bg-paperdazgreen-400"
        :disabled="loading"
      >
        <span class="inline-flex gap-1 items-center text-[16px]">
         Send
          <spinner-dotted-icon
            v-show="loading"
            height="20"
            width="20"
            class="animate-spin"
          />
          
        </span>
      </button>
    </div>
    </form>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
    name: "PdfShareModal",
    model: {
        prop: "visible",
        event: "updateVisibility",
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        file:{
          type: Object
        }
    },
    data() {
        return {
            showModal: false,
            email: "",
            description: "",
            emails: [1],
            loading: false,
        };
    },
    watch: {
        visible(val) {
            this.showModal = val;
        },
        showModal(val) {
            this.$emit("updateVisibility", val);
        },
    },
    mounted() {
      console.log("pdf-files",this.file)
        this.showModal = this.visible;
    },
    methods: {
        closeModal() {
            this.$emit("updateVisibility", false);
        },
        addEmails() {
            this.emails.push(this.emails.length);
        },
    onSubmit(event) {
    event?.preventDefault()
      //  return 
    this.loading = true

    let requestData = {}
    let emails = [] 

    //<---------START: looping through the form data elements --------->>
    Array.from(event.target.elements).forEach((element) => {
    if(element.type == 'email')
     emails.push(element.value)
    });
  
    //<---------END: looping through the form data elements --------->>

    //<---------START:  setting request data payload --------->>
    requestData = {
    ...requestData,
    action: 'share_file',
    editedFileLink: this.file?.downloadLink || '',
    fileId: this.file?.id || '',
    emails,
    note: this.description || '',
    }
    //<---------END: setting request data payload --------->>
   
      this.$axios.$post(`/request`, requestData)
        .then((response) => {
           this.$notify.success({
           title: 'Request',
           message: 'Request sent Successfully',
           })
           this.$emit('updateVisibility', false)
           this.$emit('refresh')
           this.$nuxt.refresh()

          // ------ set the input field to empty ----- --- >>
          this.description = '';
          this.emails = [0];
           })
        .catch((err) => {
           this.$notify.error({
           title: 'Request',
           message: 'Request Failed',
           })
        })
        .finally(()=>{
           this.loading = false
           })
    },
    },
    components: { SpinnerDottedIcon }
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
