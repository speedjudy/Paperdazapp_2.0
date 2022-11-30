<template>
  <div>
    <!-- Start:: header -->
    <header class="flex items-center flex-wrap gap-4 justify-between mb-6">
      <h5
        class="text-lg font-semibold text-[#272727] inline-flex items-center gap-2"
      >
        Company Files <a :href="`/public/profile/${mainUserLink}`" target="_blanck"><company-icon /></a>
      </h5>
      <div class="text-white flex items-center">
        <div
          action=""
          class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end mr-2"
          @submit.prevent="$event.preventDefault()"
        >
          <span
            class="el-dropdown-link"
            :class="[show ? 'left-roll' : 'no-roll']"
          >
            <input
              type="text"
              class="search-input h-10 pl-4 mr-2 text-black bg-transparent flex-1 border border-paperdazgreen-300 rounded-lg focus:border-paperdazgreen-700 outline-none"
              placeholder="Search Files"
              v-model="folderSearch"
            />
          </span>

          <button
            @click="show = !show"
            class="circle circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150"
          >
            <search-icon width="16" height="16" currentcolor="white"/>
          </button>
        </div>
        <button
          @click="showCreateCompanyFolderFunc"
          class="circle circle-18 bg-paperdazgreen-400 text-xl hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150"
        >
          <folder-plus-icon />
        </button>
      </div>
    </header>
    <!-- End:: header -->

    <transition name="fade" mode="out-in" :duration="100">
      <empty-file-ledger class="min-h-[55vh]" v-if="folders < 1 && pdfUser < 1" />
      <div
        v-else
        class="bg-white rounded-3xl pb-4 text-[#272727] min-h-[55vh] overflow-hidden"
      >
        <!-- Start:: Folders -->
        <h4
          class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 flex items-center"
        >
          Folders
        </h4>
        <div class="overflow-x-auto custom-scrollbar relative">
          <!-- START: spinner container -->
          <div
            v-if="folderSpinner"
            class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
          >
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->

          <!--START: No folder container-->
          <div v-if="folders < 1">
            <span
              class="w-full text-[17px] justify-center font-normal flex h-20 items-center py-3"
            >
              No Folders
            </span>
          </div>
          <!--END: No folder container-->

          <table class="custom-table" v-else>
            <thead class="text-[#414142]">
              <tr>
                <th class="w-12 text-left">Folder Name</th>
                <th class="text-center">Date &amp; Time</th>
                <th class="text-center">Files</th>
                <th class="text-center fixed-col right"></th>
              </tr>
            </thead>
            <!-- <tr
            class="py text-center w-100%"
             v-if="folders.length < 1"> <td class="w-full my-4 font-semibold text-paperdazgray-300">No folder created</td></tr> -->
            <tbody class="text-[#505050]">
              <tr v-for="(content, i) in folders" :key="i">
                <td class="text-left">
                  <div
                    class="flex items-center gap-3 whitespace-nowrap min-w-[150px] max-w-[600px]"
                  >
                    <span class="border-none">
                      <img
                        class="w-6"
                        :src="(content.profilePicture) || require(`/assets/recent-icons/OpenedFolder.svg`)"
                      />
                    </span>
                    <div class="overflow-hidden">
                      <p 
                      @click="showFolderFilesFunc(content)"
                      class="text-base font-medium text-[#414142] truncate cursor-pointer">
                        {{ content.name }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatDateTime(content.updatedAt) }}
                </td>
                <td class="text-sm text-center">{{ content.files.length }}</td>
                <td class="fixed-col right w-[50px]">
                  <div class="w-full h-full grid place-items-center">
                    <el-dropdown trigger="click">
                      <button class="el-dropdown-link w-8 h-8 cursor-pointer grid place-items-center rounded-full"
                      :class="[createdByTeamMember(content.createdBy) && isTeam ? 'bg-paperdazgreen-300/20' : '']"
                      >
                        <ellipsis-icon-vertical-icon/>
                      </button>
                      <el-dropdown-menu
                        slot="dropdown"
                        class="table-menu-dropdown-menu"
                      >
                       <div class="no-access" v-if="!createdByTeamMember(content.createdBy)">no access right</div>
                        <ul v-else class="min-w-[150px]">
                          <li
                            class="dropdown-item"
                            @click="showEditCompanyFolderFunc(content)"
                          >
                            <span>Edit</span>
                          </li>
                          <li
                            class="dropdown-item"
                            @click="showDeleteCompanyFolderFunc(content)"
                          >
                            <span>Remove</span>
                          </li>
                          <li
                            class="dropdown-item"
                            @click="showAddCompanyFolderFunc(content)"
                          >
                            <span>Add Files</span>
                          </li>
                        </ul>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- End:: Folders -->
                  <FilePagination :totalFile="totalFolder" @setPage="setFolderPage"/>


        <!-- Start:: Files -->
        <h4
          class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 flex items-center"
        >
          Files
        </h4>
        <div class="overflow-x-auto custom-scrollbar relative">
          <!-- START: spinner container -->
          <div
            v-if="fileSpinner"
            class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
          >
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->

          <!--START: No files container-->
          <div v-if="pdfUser < 1">
            <span
              class="w-full text-[17px] justify-center font-normal flex h-40 items-center py-3"
            >
              No Files
            </span>
          </div>
          <!--END: No files container-->
          <table class="custom-table" v-else>
            <thead class="text-[#414142]">
              <tr>
                <th class="w-12 text-left fixed-col left">No</th>
                <th class="text-left">File name</th>
                <th class="text-center">Action required</th>
                <th class="text-center">Privacy</th>
                <th class="text-center">Date &amp; Time</th>
                <th class="text-center fixed-col right"></th>
              </tr>
            </thead>
            <tbody class="text-[#505050]">
              <tr v-for="(file, i) in pdfUser" :key="i">
                <td class="fixed-col left">{{ i + 1 + returnedDataPage  }}</td>
                <td class="text-left">
                  <div
                    class="flex items-center gap-3 whitespace-nowrap min-w-[150px] max-w-[400px]"
                  >
                    <span
                      class="p-0.5 border border-paperdazgreen-400"
                      :class="[file.role == userType.PAID ? 'rounded-md w-9 h-9' : 'circle circle-17']"
                    >
                      <img
                        :src="
                          (file.user || {}).profile_picture ||
                          '/img/placeholder_picture.png'
                        "
                        alt=""
                        :class="[file.role == userType.PAID ?'w-full h-full rounded-md':'w-full h-full rounded-full']"
                      />
                    </span>
                    <div class="overflow-hidden">
                      <p class="text-base font-medium text-[#414142] truncate">
                        <nuxt-link :to="`/pdf/${file.paperLink}`">
                          {{ file.fileName }}
                        </nuxt-link>
                      </p>
                      <p class="text-xs text-[#878686] truncate">
                        {{ file.userName }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="text-sm text-center">{{ (file || {}).fileAction }}</td>
                <td class="text-sm text-center capitalize">{{ (file || {}).filePrivacy }}</td>
                <td class="text-center">
                  {{ formatDateTime(file.updatedAt) }}
                </td>
                <td class="fixed-col right w-[50px]">
                  <div class="w-full h-full grid place-items-center">
                    <el-dropdown>
                      <button class="el-dropdown-link w-8 h-8 cursor-pointer grid place-items-center rounded-full"
                      :class="[createdByTeamMember(file.uploadedBy) && isTeam ? 'bg-paperdazgreen-300/20' : '']">
                        <ellipsis-icon-vertical-icon />
                      </button>
                      <el-dropdown-menu
                        slot="dropdown"
                        class="table-menu-dropdown-menu"
                      >
                       <div class="no-access" v-if="!createdByTeamMember(file.uploadedBy)">no access right</div>
                        <ul class="min-w-[150px]" v-else>
                          <li
                            class="dropdown-item"
                            @click="showShareCompanyFileFunc(file)"
                          >
                            <span>Share</span>
                          </li>
                          <li 
                          @click="showRequestModalFunc(file)"
                          class="dropdown-item"><span>Request</span></li>
                          <li
                            class="dropdown-item"
                            @click="showRemoveCompanyFileFunc(file)"
                          >
                            <span>Remove</span>
                          </li>
                          <li
                            class="dropdown-item"
                            @click="showMoveCompanyFileFunc(file)"
                          >
                            <span>Move</span>
                          </li>
                        </ul>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- End:: Files -->
      </div>
    </transition>

    <FilePagination :totalFile="totalFile" @setPage="setPage" />

    <floating-action-button @click.native="showUploadModalFunction" />

    <upload-document-modal 
    @resetUserFolder="resetUserFolder"
    :folder="fileProps" 
    v-model="showUploadDocumentModal"
    />

    <CreateCompanyFolder
      @refresh="setRefresh"
      :userFile="userFile"
      @resetUserFile="resetUserFile"
      v-model="showCreateCompanyFolder"
    />
    <EditCompanyFolder
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showEditCompanyFolder"
    />
    <DeleteCompanyFolder
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showDeleteCompanyFolder"
    />

    <AddCompanyfiles
      @refresh="setRefresh"
      :file="fileProps"
      :totalFile="totalFile"
      @createFile="showUploadDocumentModal = true"
      v-model="showAddCompanyFiles"
    />
    <RemoveCompanyFile
      @refresh="setRefresh"
      :userFile="userFile"
      v-model="showRemoveCompanyFiles"
    />
    <MoveCompanyFiles
      @refresh="setRefresh"
      :userFile="userFile"
      @resetUserFile="resetUserFile"
      @createFolderEmit="showCreateCompanyFolderFunc"
      v-model="showMoveCompanyFiles"
    />
    <ShareFilesModal
      @refresh="setRefresh"
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
    />

     <RequestModal
      @refresh="setRefresh"
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showRequestModal"
    />

    <FilesInFolder :folder="FilesInFolerContent"  v-model="showFilesInFolder"/>
    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
    <MaxPaperlinkModal v-model="showMaxPaperlinkModal" :totalFile="totalFile"/>

  </div>
</template>

<script>
import Vue from 'vue'
import UploadDocumentModal from '../dashboard/UploadDocumentModal.vue'
import CompanyIcon from '../svg-icons/CompanyIcon.vue'
import EllipsisIconVerticalIcon from '../svg-icons/EllipsisIconVerticalIcon.vue'
import FolderPlusIcon from '../svg-icons/FolderPlusIcon.vue'
import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import EmptyFileLedger from '../widgets/EmptyFileLedger.vue'
import FloatingActionButton from '../widgets/FloatingActionButton.vue'
import CreateCompanyFolder from './Tabs/CreateCompanyFolder.vue'
import EditCompanyFolder from './Tabs/EditCompanyFolder.vue'
import DeleteCompanyFolder from './Tabs/DeleteCompanyFolder.vue'
import AddCompanyfiles from './Tabs/AddCompanyfiles.vue'
import RemoveCompanyFile from './Tabs/RemoveCompanyFile.vue'
import MoveCompanyFiles from './Tabs/MoveCompanyFiles.vue'
import ShareFilesModal from './Tabs/ShareFilesModal.vue'
import { mapState } from 'vuex'
import DateFormatter from '~/utils/DateFormatter'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import QrcodeShare from './Tabs/QrcodeShare.vue'
import FilePagination from '../pagination/FilePagination.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import RequestModal from './Tabs/RequestModal.vue'
import TeamAccess from '~/models/TeamAccess'
import FilesInFolder from './Tabs/FilesInFolder.vue'
import MaxPaperlinkModal from './Tabs/MaxPaperlinkModal.vue'


export default Vue.extend({
  components: {
    EmptyFileLedger,
    FloatingActionButton,
    UploadDocumentModal,
    SearchIcon,
    CompanyIcon,
    FolderPlusIcon,
    EllipsisIconVerticalIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    CreateCompanyFolder,
    EditCompanyFolder,
    DeleteCompanyFolder,
    AddCompanyfiles,
    RemoveCompanyFile,
    MoveCompanyFiles,
    SpinnerDottedIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    FilePagination,
    RequestModal,
    FilesInFolder,
    MaxPaperlinkModal
},
  name: 'CompanyFileLedger',
  data() {
    return {
      showUploadDocumentModal: false,
      searchParam: '',
      returnedDataPage: 0,
      totalFile: null,
      showCreateCompanyFolder: false,
      showEditCompanyFolder: false,
      showDeleteCompanyFolder: false,
      folderProperty: '',
      showAddCompanyFiles: false,
      showRemoveCompanyFiles: false,
      showMoveCompanyFiles: false,
      showShareCompanyFiles: false,
      showQrcodeFiles: false,
      showRequestModal:false,
      fileSpinner: true,
      folderSpinner: true,
      folders: [],
      fileProps: {},
      userFile: {},
      refresh: false,
      show: false,
      folderSearch:'',
      returnedFolderPage:0,
      totalFolder: null,
      showFilesInFolder:false,
      FilesInFolerContent: {},
      showUploadIcon: false,
      totalRegisteredPaperlink: null,
      showMaxPaperlinkModal: false,
    }
  },
  methods: {
    async maxFileUpload(){
     await this.$axios.get(`/subscriptions/${this.$auth.user.subscriptionId}`)
     .then((response)=>{
       console.log(">>>>>>>>>> max file",response.data)
       this.totalRegisteredPaperlink = response?.data?.paperlink
     })
     .finally(()=>{this.showUploadIcon = true})
    },
    showUploadModalFunction(){
       if(!this.showUploadIcon) return
        if(this.totalFile >= this.totalRegisteredPaperlink) 
         this.showMaxPaperlinkModal = true
        else
        this.showUploadDocumentModal = true
    },
    createdByTeamMember(val){
         switch (this.$auth.user.role) {
          case (UserTypeEnum.TEAM):
            if(this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE) 
            return true
            else if(this.$auth.user.teamAccess == TeamAccess.OWN_FILE) 
            return (this.$auth.user.id == val)
          case (UserTypeEnum.PAID):
            return true
         }
         
    },
    showFolderFilesFunc(val){
      this.FilesInFolerContent = val
      this.showFilesInFolder = true
    },
    resetUserFolder(){
      this.fileProps = {}
    },
    resetUserFile(){
       this.userFile = {}
    },
    setFolderPage(val){
       this.returnedFolderPage = val
    },
    setPage(page) {
      this.returnedDataPage = page
    },
    setRefresh() {
      this.refresh = !this.refresh
    },
    showCreateCompanyFolderFunc() {
      this.showCreateCompanyFolder = true
    },
    showEditCompanyFolderFunc(file) {
      this.fileProps = file
      this.showEditCompanyFolder = true
    },
    showDeleteCompanyFolderFunc(file) {
      this.fileProps = file
      this.showDeleteCompanyFolder = true
    },
    showAddCompanyFolderFunc(file) {
      this.fileProps = file
      this.showAddCompanyFiles = true
    },
    showRemoveCompanyFileFunc(file) {
      this.userFile = file
      this.showRemoveCompanyFiles = true
    },
    showMoveCompanyFileFunc(file) {
      this.userFile = file
      this.showMoveCompanyFiles = true
    },
    showShareCompanyFileFunc(file) {
      this.userFile = file
      this.showShareCompanyFiles = true
    },
    showRequestModalFunc(file) {
      this.userFile = file
      this.showRequestModal = true
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true
    },
    formatDateTime(dateVal) {
      return `${DateFormatter.getDateString(
      dateVal
      )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    async fetchFiles(page, search) {
       //---- checking the user role --- 
      let paramsId = (this.$auth.user.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user.id)
      
     //<------------------- START: fetching of folder ------------>>
      await this.$axios.$get(`/files/?userId=${paramsId}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`,{
        params:{
          isEditing:0
        }
      })
        .then((response) => {
          console.log("file",response)
          const filesData = response.data.map((el) => {
            return el
          })

          // set the data.file
          this.files = filesData

          // push files to store
          this.$store.commit('ADD_USER', this.files)

          // to stop spinner
          this.fileSpinner = false
          this.totalFile = response.total
        })
        .finally(() => {
          this.fileSpinner = false
        })
      //<------------------- START: fetching of folder ------------>>
    },
    
    async fetchFolder(page,search) {
      //---- checking the user role --- 
      let paramsId = this.$auth.user.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user.id

    //<------------------- START: fetching of folder ------------>>
      await this.$axios
        .$get(`/folders/?userId=${paramsId}&name[$like]=${search}%&$sort[updatedAt]=-1&$skip=${page}`)
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el
          })
          this.totalFolder = response.total
          // set the data.file
          this.folders = filesData
           console.log("folder",this.folders)
          // to stop spinner
          this.folderSpinner = false
        })
        .finally(() => {
          this.folderSpinner = false
        })
     //<------------------- START: fetching of folder ------------>>

    },
  },
  mounted() {
    this.fetchFiles(this.returnedDataPage, this.folderSearch)
    this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    this.maxFileUpload()
  },
  computed: {
    // getting state from the store
    ...mapState(['filterUser', 'pdfUser']),
    userType(){
      return (UserTypeEnum)
    },
    teamMemberCanAccess(){
      switch (this.$auth.user.role + this.$auth.user.teamAccess) {
      case (UserTypeEnum.TEAM + TeamAccess.OWN_FILE):
        return false
      case (UserTypeEnum.TEAM + TeamAccess.COMPANY_FILE):
        return true
      }
    },
    isTeam(){
      return (this.$auth.user.role == UserTypeEnum.TEAM)
    },
    mainUserLink(){
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
        return (this.$auth.user || {}).id

        case UserTypeEnum.TEAM:
        return (this.$auth.user || {}).mainAccountId
      }
     (this.$auth.user || {}).id
    }
  },
  watch: {
    refresh: function () {
      this.$nuxt.refresh()
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    },
    returnedDataPage: function () {
      this.fileSpinner = true
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
    },
    returnedFolderPage: function(){
      this.folderSpinner = true
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
    },
     folderSearch: function(){
      this.folderSpinner = true 
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
      this.fileSpinner = true
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
    },
    "$auth.user": function(){
      this.fetchFiles(this.returnedDataPage, this.folderSearch)
      this.fetchFolder(this.returnedFolderPage, this.folderSearch)
      this.maxFileUpload()
    }
  },
})
</script>

<style lang="scss" scoped>
.no-access{
  @apply p-2 text-[14px] capitalize;
}
.custom-table th {
  padding-top: 20px;
}
</style>
