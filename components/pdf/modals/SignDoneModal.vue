<template>
    <el-dialog
      :visible.sync="showModal"
      :append-to-body="true"
      style=""
      :show-close="false"
      center
      class="relative text-[#414042]"
    >
      <!-- Start:: Body -->
      <span class="w-full text-center block py-0 px-2 pb-8 text-[20px] font-bold break-normal mb-6">You are done!</span>
      <div class="flex justify-around">
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
          :disabled="loading"
          @click="closeModal()"
        >
          <span class="inline-flex gap-1 items-center text-[16px]">
            Ok
          </span>
        </button>
      </div>
      <!-- end :: body -->
    </el-dialog>
  </template>
  
  <script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'SignDoneModal',
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
        errorMessage: '',
        loading: false,
        newSaveData: {},
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
        // window.location.assign('/dashboard')
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
  