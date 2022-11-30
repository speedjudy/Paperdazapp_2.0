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
      <h4 class="text-center font-bold text-xl">Add Files</h4>
    </template>
    <!-- Start:: Body -->

    <p
      class="text-center font-medium flex justify-center items-center w-[90%] mx-auto mb-6 whitespace-none"
    >
      <input
        class="w-[280px] w-min[150px] py-2 px-4 border-[1px] border-paperdazgrey-200 rounded-md"
        v-model="folderSearch"
        @input="searchForFiles"
        placeholder="Enter File Name"
      />
      <button class="circle circle-18 bg-paperdazgreen-400 text-white ml-2">
        <SearchIcon width="16" height="16" currentcolor="white" />
      </button>
      <button
        @click="popUpCreateFolder"
        class="circle circle-18 bg-paperdazgreen-400 text-white ml-2"
      >
        <img width="24" height="24" src="~/assets/img/Upload file.png" />
      </button>
    </p>

    <div class="w-[100%] md:w-[90%] md:ml-[5%] relative">
      <!-- START: spinner container -->
      <div
        v-if="fileSpinner"
        class="absolute z-10 w-full h-full h-min-[300px] bg-white top-0 left-0 rounded-lg flex justify-center items-center"
      >
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin my-2" />
      </div>
      <!-- END: spinner container -->
      <ul
        class="mb-3 max-h-[330px] h-auto overflow-scroll sm:px-2"
      >
        <li
          v-for="(file, i) in files"
          :key="i + 'folder'"
          class="w-full flex items-center py-3"
        >
          <img width="24" height="24" src="~/assets/img/PAPERDAZ1 2.png" />
          <p
            class="text-[15px] font-semibold flex items-center text-grey w-[90%] pr-3 truncate"
          >
            <button class="mr-1"></button>
            <span
              title="Patient Registration & Disclosure ..."
              class="truncate inline-block pr-2"
              >{{ file.fileName }}</span
            >
          </p>
          <button class="w-[10%] text-right checkbox-container">
            <input :id="file.id" class="checkbox" type="checkbox" />
          </button>
        </li>
        <div v-if="checkIfFilesAreMany" class="flex justify-center my-3">
          <button
           @click="fetchMoreFiles"
          class="w-full  rounded-lg text-center py-2">Get more files</button>
       </div>
      </ul>
    </div>
     
   

    <div class="flex justify-around">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[50%] shadow-md text-white rounded-lg shadow bg-paperdazgreen-400"
        :disabled="loading"
        @click="onSubmit"
      >
        <span class="inline-flex gap-1 items-center text-[16px]">
          Add
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
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import PaperdazIcon from '../../svg-icons/PaperdazIcon.vue'
import FileIcon from '~/components/svg-icons/FileIcon.vue'
import UserTypeEnum from '~/models/UserTypeEnum'

export default Vue.extend({
  name: 'add-company-folder',
  components: { SpinnerDottedIcon, SearchIcon, PaperdazIcon, FileIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    packagename: {
      type: String,
    },
    file: {},
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
      folderSearch: '',
      folder: {},
      files: [],
      initialFile:[],
      returnFilePage: 0,
      searchValue: '',
      fileSpinner: true,
      totalFile: null,
      filesPerPage: 10,
    }
  },
  computed: {
    checkIfFilesAreMany(){
      return ( (this.returnFilePage + this.filesPerPage) <= this.totalFile )
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
      this.fetchFiles(this.returnFilePage, this.searchValue)
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
    file: function () {
      this.folder = this.file
      console.log('add-mount', this.folder)
    },
    searchValue() {
      this.fileSpinner = true
    },
    returnFilePage: function(){
      this.fetchFiles(this.returnFilePage, this.searchValue)
    }
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    async fetchMoreFiles() {
      if( this.returnFilePage >= this.totalFile) return 
        this.returnFilePage = this.returnFilePage + 10
    },
    searchForFiles() {
      this.searchValue = this.folderSearch
    },
    popUpCreateFolder() {
      this.$emit('createFile')
      this.$emit('updateVisibility', false)
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
  fetchFiles(page, search, initial) {

      let paramsId =
        this.$auth.user.role == UserTypeEnum.TEAM
          ? this.$auth.user.teamId
          : this.$auth.user.id

     this.$axios
        .$get(`/files?userId=${paramsId}&fileName[$like]=${search || ''}%&$skip=${page || 0}&$sort[updatedAt]=-1&isEditing=0&folderId[$ne]=${this.file.id}`)
        .then((response) => {
           const filesData = response.data.map((el) => {
          return el
          })
          this.totalFile = response.total;
          console.log('company-loade-file',  response.data)
          this.files = filesData
          this.fileSpinner = false
        })
        .catch((err)=>{})
        .finally(()=>{this.fileSpinner = false})
    },
    async onSubmit() {
      event?.preventDefault()

      let getAllInput = document.querySelectorAll('.checkbox')
      let initialArray = Array.from(getAllInput).filter((item) => {
        if (item.checked) return item
      })

      if (this.loading || initialArray.length < 1) return

      this.loading = true

      // loop through all files and insert to Folder
      let storeArray = []

      for (const element of initialArray) {
        await this.$axios
        .$patch(`/files/${element.id}`, {
          folderId: this.folder.id,})
        .then(() => {
          //  pushing a hard-coded value to array
          storeArray.push('in')
        })
      }
      this.loading = false

      // loop through to cancle checked box
      Array.from(getAllInput).map((item) => {
        item.checked = false
      })

      // code to check if file moved into the <Array>
      if (storeArray.length > 0) {
        this.$emit('updateVisibility', false)
        this.$emit('refresh')
        this.$notify.success({
          message: `${storeArray.length} Files moved successfully`,
        })
      } else {
        this.$notify.error({
          message: `Files unable to move`,
        })
      }

      // } catch (err) {
      //   this.$notify.error({
      //     message: 'error occured while moving files',
      //   })
      //   this.loading = false
      // }
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
.checkbox {
  -webkit-appearance: none;
  cursor: pointer;
  margin-right: 3px;
  display: inline-block;
  width: 25px;
  height: 25px;
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 0 0.5px rgb(29, 173, 29);
  transition: 0.2s;
}
.checkbox::before {
  content: ' ';
  position: absolute;
  top: 11px;
  left: 7.5px;
  transform: rotateZ(-35deg);
  height: 7px;
  outline: none !important;
  width: 2px;
  background-color: rgb(29, 173, 29);
  border-radius: 50px 50px 0 50px;
}
.checkbox::after {
  content: ' ';
  position: absolute;
  top: 12px;
  left: 8.5px;
  transform: rotateZ(-40deg);
  height: 2px;
  width: 12px;
  background-color: rgb(29, 173, 29);
  border-radius: 0px 50px 50px 0px;
}

.checkbox:checked {
  background-color: rgb(29, 173, 29);
  box-shadow: none !important;
}
.checkbox:checked::before {
  background: rgb(252, 252, 253);
}
.checkbox:checked::after {
  background: rgb(252, 252, 253);
}
.checkbox:focus {
  border: none;
  outline: none;
}
::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  background-color: #77c360;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-paperdazgreen-400;
}
</style>
