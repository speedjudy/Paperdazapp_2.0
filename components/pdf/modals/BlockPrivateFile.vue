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
        <h1 class="text-center font-semibold text-xl">
          <svg class="m-auto" width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect width="25" height="25" fill="url(#pattern0)"/>
          <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_10071_28127" transform="scale(0.002)"/>
          </pattern>
          <image id="image0_10071_28127" width="500" height="500" xlink:href="data:image/png;base64,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"/>
          </defs>
          </svg>
        </h1>
      </template>
      <!-- Start:: Body -->
      
       <p class="w-[90%] ml-[5%] text-center pb-8 break-normal font-semibold">File marked private. You must be logged in to ask file owner to {{this.file.fileAction}}</p>
       <!-- <p class="w-[90%] ml-[5%] text-center pb-8 break-normal font-semibold" v-if="!$auth.loggedIn">Login or register to ask for permission</p> -->
      <div class="flex justify-around">
        <button
          class="disabled:bg-opacity-50 disabled:cursor-not-allowed h-10 text-xs w-[150px] max-w-[50%] border border-red-600 rounded-lg shadow bg-white"
          type="button"
          :disabled="loading"
          @click="closeModal()"
        >
          Cancel
        </button>
        <!-- <button
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
        </button> -->
        <!-- <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
        > 
          <span class="inline-flex gap-1 items-center">
            <nuxt-link to="/login"
              >Sign in</nuxt-link
            >
          </span>
        </button> -->

        <nuxt-link
          to="/login"
          class="h-10 bg-paperdazgreen-300 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150 text-white rounded-lg shadow bg-paperdazgreen-400 px-3 flex items-center justify-center whitespace-nowrap w-[150px] text-xs max-w-[50%]"
          >Log in</nuxt-link
        >
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
      console.log(this.file.fileAction, this.file.user.companyName, this.file, "checking");
      if (this.file.filePrivacy==="private") {
        sessionStorage.setItem("fileActionWhenSearch", this.file.fileAction);
        sessionStorage.setItem("companyNameWhenSearch", this.file.user.companyName);
      }
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
  