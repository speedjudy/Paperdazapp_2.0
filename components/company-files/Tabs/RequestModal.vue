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
      <h4 class="text-center font-semibold text-xl">Request</h4>
    </template>
    <!-- Start:: Body -->
  <form 
  ref="form"
  @submit.prevent="onSubmit">
    <div
      class="text-centerfont-medium flex justify-between item mx-auto mb-4 whitespace-none"
    >
      <p class="w-[87%]">
        <input
        required
        v-for="input in inputs"
        :key="input"
        type="email"
        class="py-2 focus:border-paperdazgray-500 px-4 w-full mb-2 rounded-md border-[1px] border-paperdazgray-500"
        placeholder="E-mail"
       />
      </p>
       <button
       @click.prevent="addEmailinputs"
        class="w-[35px] h-[35px] rounded-full bg-paperdazgray-500 grid place-content-center">  
           <span class="text-white text-[30px]">&plus;</span>
       </button>
    </div>

     <p
      class="text-center block font-medium  mx-auto mb-4 whitespace-none"
    >
       <textarea
        required
        v-model="folderTextareaData"
        class="w-full py-2 px-4 focus:border-paperdazgray-500 outline-none rounded-md h-28 resize-none border-[1px] border-paperdazgray-500"
        placeholder="Note..."
       /></textarea>
     </p>
    <div class="flex justify-around">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[900%] 
         text-white rounded-xl shadow bg-paperdazgreen-400"
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
import FacebookIcon from '../../svg-icons/FacebookIcon.vue'
import TwitterIcon from '../../svg-icons/TwitterIcon.vue'
import EnvelopeIcon from '../../svg-icons/EnvelopeIcon.vue'
import PlusIcon from '~/components/svg-icons/PlusIcon.vue'
import LinkIcon from '~/components/svg-icons/LinkIcon.vue'
import EnvelopeIconShare from '~/components/svg-icons/EnvelopeIconShare.vue'
import QrcodeIcon from '../../svg-icons/QrcodeIcon.vue'
import QrcodeShare from "./QrcodeShare.vue"
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
import { ExtractFormPdf } from '~/components/functions/extractFormPdf'

export default Vue.extend({
  name: 'request-modal',
  components: { 
               SpinnerDottedIcon, 
               FacebookIcon,
               TwitterIcon, 
               EnvelopeIcon, 
               PlusIcon, 
               LinkIcon, 
               EnvelopeIconShare, 
               QrcodeIcon,
               QrcodeShare },

  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    packagename: {
       type: String
    },
    userFile: {
       type: Object
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showQrcodeFiles: false,
      folderTextareaData:'',
      showModal: false,
      // userFile:{},
      loading: false,
      twiterLink:'',
      inputs:[0],
      generateFileProperty:{},
      proceedToRequest: true,
      generatedFile: {}
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
    generateAndUploadPdf(){
      
    },
    addEmailinputs(){
      let addEmail = true;
      Array.from(this.$refs.form.elements).forEach(element => {
      if(element.type == 'email' && !element.value.trim())
          addEmail = false
      });
      if(!addEmail) return
      this.inputs.push(this.inputs.length)
    },

     showQrcodeFileFuncEmit(){
      this.$emit('qrLoad');
      this.$emit('updateVisibility', false)
     },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    async  _generatePdf(val){
      // if(val.data.length < 1) return

      //   await this.$axios.$post(`/pdf-generator`, { ...val })
      //   .then((response)=>{
      //   console.log(response)
      //   this.generateFileProperty = response
      //   })
      //   .catch((err)=>{
      //   this.proceedToRequest = false
      //   })
    },
    async uploadGeneratedFile(val){
      if(Object.keys(this.generateFileProperty).length < 1 ) return
      // console.log(this.packagename)
      // return
      const updateVal = {
        "isEditing":true,
        downloadLink:val.downloadLink,
        key:val.key,
        originalFileId: this.userFile.id,
        userId: this.$auth.user.id,
        fileAction: this.userFile.fileAction
      }
      await this.$axios.$post(`/files`, { ...updateVal })
        .then((response)=>{
        console.log(response)
         this.generatedFile = response
        })
       .catch((err)=>{
        this.proceedToRequest = false
        })
        
    },
    async onSubmit(event) {
    event?.preventDefault()
       
    this.loading = true

    let requestData = {} 
    let emails = []

    Array.from(event.target.elements).forEach(element => {
    if(element.type == 'email')
      emails.push(element.value)
    });
      
    //   let signAnnotationPos = { position : ExtractFormPdf(this.userFile.downloadLink)[1] }
    //   console.log(signAnnotationPos)
    //   let ownerLink = signAnnotationPos?.position?.length > 0 ? 
    //   jwt.sign(signAnnotationPos, process.env.ENCRYPTION_KEY) : ''

    // await this._generatePdf(ExtractFormPdf(this.userFile.downloadLink)[0])
    // await this.uploadGeneratedFile(this.generateFileProperty)

    // if(!this.proceedToRequest) return

    // return 
      requestData = {
      action: 'referral_link',
      ...requestData,
      link: `${window.location.origin}/pdf/${(this.userFile.paperLink)}`,
      fileId: this.userFile.id,
      emails : emails,
      note: this.folderTextareaData
      }

      console.log(this.generatedFile.paperLink, this.userFile.paperLink)
      // return
      this.$axios.$post(`/request`, requestData)
        .then((response) => {
           this.$notify.success({
           title: 'Request',
           message: 'Request sent Successfully',
           })
           this.$emit('updateVisibility', false)
           this.$emit('refresh')
           this.$nuxt.refresh()
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
})
</script>

<style scoped>
.color-white{
    fill: white !important;
}
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
.icons-container button{
  @apply w-[40px] h-[40px] rounded-full bg-paperdazgreen-300/20 inline-flex justify-center
   items-center
}
</style>
