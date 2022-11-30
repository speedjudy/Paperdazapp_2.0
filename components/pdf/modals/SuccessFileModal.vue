<template>
    <el-dialog
      :visible.sync="showModal"
      :append-to-body="true"
      style=""
      :show-close="false"
      center
      class="relative text-[#414042]"
    >
    
      <template #title>
        <span class="text-center font-semibold text-xl"></span>
      </template>
      <!-- Start:: Body -->
      <div class="flex justify-center pb-2">
        <CheckedFillIcon width="70"/>
      </div>
       <span class="w-full text-center block py-0 px-2 pb-8 text-[16px] break-normal">File {{`${(file.fileAction+'ed').replace('ee','e')}`}}, a copy sent to <span class=" text-paperdazgreen-300">{{file.user.firstName}} {{file.user.lastName}}</span> another sent to your email.</span>
      <div class="flex justify-around">
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
          :disabled="loading"
          @click="closeModal()"
        >
          <span class="inline-flex gap-1 items-center text-[16px]">
            Ok
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
  import axios from 'axios'
  import { scrapPdfData } from '../../functions/scrapPdfData'
  import { ExtractFormPdf } from '~/components/functions/extractFormPdf'
  import AuthUser from '~/models/AuthUser'
  import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
  import UserTypeEnum from '~/models/UserTypeEnum'
  import FileAction from '~/models/FileAction'
import CheckedFillIcon from '../../svg-icons/CheckedFillIcon.vue'

  export default Vue.extend({
    name: 'SuccessFileModal',
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
      file: {type: Object}
    },
    data() {
      return {
        showModal: false,
        errorMessage: '',
        loading: false,
        newSaveData: {},
        // file: {},
        sendAction: null,
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
  