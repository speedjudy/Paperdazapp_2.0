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
        <h4 class="text-center font-semibold text-xl"> Folder ( <abbr class="text-paperdazgreen-300">{{folder.name}}</abbr> )</h4>
      </template>
      <!-- Start:: Body -->

      <div class="flex justify-around">
        <div v-if="this.folder?.files?.length < 1" 
        class="w-full text-center py-2"
        > Folder is empty</div>
        <ul class="w-full overflow-x-auto max-h-[330px] h-auto" v-else>
            <li 
            v-for="file in folder.files"
            class="flex w-full justify-start items-center py-3">
                <PaperdazIcon width='25'/>
             <span class="w-[calc(100%-45px)] ml-2 inline-block truncate font-[500] cursor-pointer text-[16px]"> 
                <nuxt-link :to="`/pdf/${file.paperLink}`">
                    {{ file.fileName }}
                </nuxt-link>
                </span>
            </li>
        </ul>
      </div>
      <!-- end :: body -->
    </el-dialog>
  </template>
  
  <script>
  import Vue from 'vue'
  import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import PaperdazIcon from '~/components/svg-icons/PaperdazIcon.vue'
  export default Vue.extend({
    name: 'create-company-folder',
    components: { SpinnerDottedIcon, PaperdazIcon },
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
     
    },
  })
  </script>
  
  <style scoped>
  * >>> .el-dialog {
    width: 500px !important;
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
  