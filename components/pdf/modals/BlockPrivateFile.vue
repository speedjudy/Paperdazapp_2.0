<template>
    <el-dialog
      :visible.sync="showModal"
      :append-to-body="false"
      style=""
      :show-close="false"
      center
      class="relative text-[#414042]"
    >
      <!--Start:: Close Button -->
      <div class="absolute -top-3 -right-3" style="padding: inherit;">
        <!-- <span
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
        </span> -->
      </div>
      <!--End:: Close Button -->
      <template #title>
        <h1 class="text-center font-semibold text-xl">Alert?</h1>
      </template>
      <!-- Start:: Body -->
      
       <p class="w-[90%] ml-[5%] text-center pb-8 break-normal">These is a private file requires permission to view, Ask for permission to be granted right to view</p>
       <p class="w-[90%] ml-[5%] text-center pb-8 break-normal font-semibold" v-if="!$auth.loggedIn">Login or register to ask for permission</p>
      <div class="flex justify-around">
        <!-- <button
          class="disabled:bg-opacity-50 disabled:cursor-not-allowed h-10 text-xs w-[150px] max-w-[50%] text-red-600 border border-red-600 rounded-lg shadow bg-white"
          type="button"
          :disabled="loading"
          @click="closeModal()"
        >
          Cancel
        </button>-->
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
          :disabled="isLoading"
          @click="onSubmit"
        > 
          <span class="inline-flex gap-1 items-center">
           {{ !isLoading ? "Ask permission" : "checking permission...." }}
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
  import FilePrivacy from '~/models/FilePrivacy'
  import CheckedFillIcon from '../../svg-icons/CheckedFillIcon.vue'
  import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
  
  export default Vue.extend({
    name: 'blockPrivateFile',
    components: { SpinnerDottedIcon, CheckedFillIcon },
    model: {
      prop: 'visible',
      event: 'updateVisibility',
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      file: { type: Object }
    },
    
    data() {
      return {
        showModal: false,
        isLoading: false,
        loading: false,
        newSaveData: {},
        // file: {},
        sendAction: null,
        refuse: true
      }
    },
    watch: {
      visible(val) {
        this.showModal = val,
        this.checkParamsPermission()
       
      },
      refuse: function(){
        if(this.showModal || this.refuse)
          this.showModal = true
      },

    },
    mounted() {
      this.showModal = this.visible
    },
    methods: {
      checkParamsPermission(){
        this.isLoading = true
          this.$axios.get(`/permissions/?userId=${this.$auth?.user?.id}&fileId=${this.file.id}`)
          .then((response)=>{
            const { data } = response
             if(data.length < 1) return
               if(data[0].isGranted != 1) return
                  this.refuse = false;
                  this.showModal = false
          })
          .catch((err)=>{
            console.log(err)
          })
          .finally(()=>{
            this.isLoading = false
          })

      },
      closeModal() {
        this.$emit('updateVisibility', false)
      },
     onSubmit(){
      if(!this.$auth.loggedIn) return
      // return
      this.loading = true;
        this.$axios.post("/permissions", {
            action: "request_permission",
            "fileId": this.file.id
        })
        .then((response)=>{
          console.log(response, typeof(response.data))
          this.$notify.success({
            title:"Permission",
             message: typeof response.data == "string" ? response.data : "Request sent successful, you will recieve a notification if request granted"
          })
          this.loading = false
          setTimeout(() => {
            // this.$router.go(-1)
          }, 2500);
        })
          .catch((err)=>{
              this.$notify.error({
              title:"Permission",
              message:"Request failed"
            })
          })
          .finally(()=>{
            this.loading = false
        })
      }
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
  