<template>
  <main class="mb-24">
    <top-details-card-container v-model="activeTab" class="mb-5" :tabs="tabs" />
    <!-- <leaves-details-container class="mb-12" /> -->

    <div
      class="flex items-center flex-wrap gap-4 justify-between mb-6 relative"
    >
      <h5 class="text-lg font-semibold text-[#272727]">My Files</h5>

      <div
        class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end"
      >
          <span 
           class="el-dropdown-link"
          :class="[show ? 'left-roll' : 'no-roll']"
          >
            <input
              type="text"

              class="search-input h-10 pl-4 mr-2 bg-transparent flex-1 border border-paperdazgreen-300 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
              placeholder="Search Files"
              :value="searchParam"
              @keypress="searchFiles"
            />
          </span>
        <button 
        @click="show = !show"
        class="circle circle-18 bg-paperdazgreen-400 text-white">
          <search-icon width="16" height="16" currentcolor="white"/>
        </button>
      </div>
    </div>

    <div class="rounded-2xl bg-white overflow-x-auto custom-scrollbar relative">
     <!-- START: spinner container -->
      <div
        v-if="spinner"
        class="absolute z-10 w-full h-[100%] bg-white top-0 left-0 rounded-lg flex justify-center items-center"
      >
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- END: spinner container -->

        <!--START: No file container-->
          <EmptyFileLedger v-if="pdfUser < 1 && searchValue == ''" class="h-min-[55vh]"/>
        <!--END: No folder container-->

      <table class="custom-table" v-else>
        <thead class="text-[#414142]">
          <tr>
            <th class="w-12 text-center fixed-col left">No</th>
            <th class="text-left">File Name</th>
            <th class="">Action Request</th>
            <th class="">Date &amp; Time</th>
            <th class="w-28 text-center">Mission Shared</th>
            <th class="text-center fixed-col right">Action</th>
          </tr>
        </thead>
        <tbody class="text-[#505050]">
          <tr v-for="(file, i) in pdfUser" :key="i">
            <td class="w-12 text-center fixed-col left">{{ i + 1 + returnedDataPage }}</td>
            <td>
              <div class="flex items-center gap-3">
                <span
                  class="circle circle-17 p-0.5 border border-paperdazgreen-400"
                >
                  <img
                    :src="
                      (file.user || {}).profile_picture ||
                      '/img/placeholder_picture.png'
                    "
                    alt=""
                    class="circle"
                  />
                </span>
                <div>
                  <p class="text-sm font-medium text-[#505050]">
                    <nuxt-link :to="`/pdf/${file.paperLink}`">
                      {{ file.fileName }}
                    </nuxt-link>
                  </p>
                  <p class="text-xs font-light text-[#727272]">
                    {{ file.userName }}
                  </p>
                </div>
              </div>
            </td>
            <td class="text-center">{{ file.fileAction || "-"}}</td>
            <td class="text-sm text-center">
              {{ formatDateTime(file.updatedAt) }}
            </td>
            <td class="text-center">
              <div class="grid place-items-center">
                <button
                  class="circle circle-17 bg-paperdazgreen-400 text-white"
                >
                <component :is="displayShare(file.shared)" 
                
                />
                  <!-- <facebook-icon width="8" /> -->
                </button>
              </div>
            </td>
            <td class="fixed-col right">
              <div class="w-full h-full grid place-items-center text-red-600">
                <el-dropdown>
                  <button class="el-dropdown-link px-3 cursor-pointer">
                    <ellipsis-icon-vertical-icon style="fill: grey;" />
                  </button>
                  <el-dropdown-menu
                    slot="dropdown"
                    class="table-menu-dropdown-menu"
                  >
                    <ul class="min-w-[150px]">
                      <li class="dropdown-item">
                        <span @click="showShareCompanyFileFunc(file)"
                          >Share</span
                        >
                      </li>
                      <li
                        class="dropdown-item"
                        @click="showRemoveCompanyFileFunc(file)"
                      >
                        <span>Remove</span>
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
           
      
      <FilePagination :totalFile="totalFile" @setPage="setPage"/>

    <floating-action-button @click.native="showUploadDocumentModal = true" />
    <upload-document-modal v-model="showUploadDocumentModal" />
    <RemoveCompanyFile
      @refresh="setRefresh"
      :userFile="userFile"
      v-model="showRemoveCompanyFiles"
    />

    <share-files-modal
    @refresh="setRefresh" 
    @qrLoad="showQrcodeFileFunc"
    :userFile="userFile" 
    v-model="showShareCompanyFiles" />

    <QrcodeShare 
    :userFile="userFile" 
    v-model="showQrcodeFiles" />
  </main>
</template>

<script>
import Vue from 'vue'
import LeavesDetailsContainer from '~/components/dashboard/LeavesDetailsContainer.vue'
import TopDetailsCardContainer from '~/components/dashboard/TopDetailsCardContainer.vue'
import UploadDocumentModal from '~/components/dashboard/UploadDocumentModal.vue'
import InviteTeamMemberModal from '~/components/pdf/modals/InviteTeamMemberModal.vue'
import DisketIconVue from '~/components/svg-icons/DisketIcon.vue'
import FacebookIcon from '~/components/svg-icons/FacebookIcon.vue'
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import NoteAndPenIconVue from '~/components/svg-icons/NoteAndPenIcon.vue'
import PageIconVue from '~/components/svg-icons/PageIcon.vue'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import ShareIconVue from '~/components/svg-icons/ShareIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import TickCircleIconVue from '~/components/svg-icons/TickCircleIcon.vue'
import TrashCanIcon from '~/components/svg-icons/TrashCanIcon.vue'
import FloatingActionButton from '~/components/widgets/FloatingActionButton.vue'
import { mapState } from 'vuex'
import DateFormatter from '~/utils/DateFormatter'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import EllipsisIconVerticalIcon from '~/components/svg-icons/EllipsisIconVerticalIcon.vue'
import RemoveCompanyFile from '~/components/company-files/Tabs/RemoveCompanyFile.vue'
import ShareFilesModal from '~/components/company-files/Tabs/ShareFilesModal.vue';
import QrcodeShare from '~/components/company-files/Tabs/QrcodeShare.vue'
import Free_Users from '~/mixins/Free_Users'
import FilePagination from '~/components/pagination/FilePagination.vue'
import EmptyFileLedger from '~/components/widgets/EmptyFileLedger.vue'
import TwitterIcon from '~/components/svg-icons/TwitterIcon.vue'
import LedgerIcon from '~/components/svg-icons/LedgerIcon.vue'
import AuthUser from '~/models/AuthUser'



export default Vue.extend({
  components: {
    TopDetailsCardContainer,
    LeavesDetailsContainer,
    SearchIcon,
    InviteTeamMemberModal,
    FacebookIcon,
    TrashCanIcon,
    FloatingActionButton,
    UploadDocumentModal,
    HeartOutlineIcon,
    ShareOutlineIcon,
    SpinnerDottedIcon,
    EllipsisIconVerticalIcon,
    RemoveCompanyFile,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    EmptyFileLedger,
    TwitterIcon,
    LedgerIcon
},
  name: 'MyFilesPage',
  layout: 'dashboard',
  //@ts-ignore
  mixins: [Free_Users],
  data() {
    return {
      returnedDataPage:0,
      totalFile:null,
      activeTab: 'ledger',
      showUploadDocumentModal: false,
      showRemoveCompanyFiles: false,
      showShareCompanyFiles: false,
      showQrcodeFiles: false,
      refresh: false,
      show:false,
      searchParam: '',
      spinner: true,
      files: [],
      userFile: {},
      searchValue: '',
      socialType:'',
      tabs: [
        {
          label: 'ledger',
          key: 'ledger',
          action:'ledger',
          count: 896,
          icon: LedgerIcon,
        },
        {
          label: 'completed',
          key: 'completed',
          count: 25,
          action:'complete',
          icon: PageIconVue,
        },
        {
          label: 'confirmed',
          key: 'confirmed',
          count: 25,
          action:'confirm',
          icon: TickCircleIconVue,
        },
        {
          label: 'signed',
          key: 'signed',
          count: 25,
          action:'sign',
          icon: NoteAndPenIconVue,
        },
        // {
        //   label: 'saved',
        //   key: 'saved',
        //   count: 25,
        //   action:'save',
        //   icon: DisketIconVue,
        // },
        // {
        //   label: 'shared',
        //   key: 'shared',
        //   count: 25,
        //   action:'share',
        //   icon: ShareIconVue,
        // },
      ],
    }
  },
  mounted() {
    this.fetchFiles(this.returnedDataPage, this.searchValue)
    console.log("pdf-user-free-file",this.pdfUser)
  },
  asyncData({ store }) {
    store.commit('SET_PAGE_NAME', { name: 'My Files' })
  },
  methods: {
    displayShare(val){
      switch (val) {
      case 'facebook':
        return FacebookIcon;
      case 'twitter':
        return TwitterIcon
      default:
        return {
            render(createElement) {
              return createElement(
                'span',
                '--'
              )
            },
          }
      }
    },
    searchFiles(event){
    if (event.key === "Enter"){ 
    this.searchValue = event.target.value
    }
    },
    setPage(page) {
     this.returnedDataPage = page
    },
    showQrcodeFileFunc() {
     this.showQrcodeFiles = true
    },
    setRefresh() {
      this.refresh = !this.refresh
    },
    showRemoveCompanyFileFunc(file) {
      this.userFile = file
      this.showRemoveCompanyFiles = true
    },
    showShareCompanyFileFunc(file) {
      this.userFile = file
      this.showShareCompanyFiles = true
    },
    async fetchFiles( page, search) {
      await this.$axios
        .$get(`/files?userId=${(this.$auth.user).id}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`,{
          params:{
            isEditing:0
          }
        })
        .then((response) => {
          const filesData = (response.data).map((el) => {
            return el
          })
          // <<-- set the data.file -->>
          this.files = filesData
          // <<--push files to store-->>
          this.$store.commit('ADD_USER', this.files)
          // <<--to stop spinner-->>
          this.spinner = false
          console.log(this.files)
          this.totalFile = response.total
        })
        .finally(() => {
          this.spinner = false
        })
    },
    formatDateTime(dateVal) {
      return `${DateFormatter.getDateString(
        dateVal
      )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
  },
  computed: {
    // getting state from the store
    ...mapState(['filterUser', 'pdfUser']),
  },
  watch: {
    refresh: function () {
      this.$nuxt.refresh()
      this.fetchFiles(this.returnedDataPage, this.searchValue)
    },
    "returnedDataPage": function(){
      this.spinner = true;
      this.fetchFiles(this.returnedDataPage, this.searchValue)
    },
    "searchValue": function(){
      this.spinner = true;
       this.fetchFiles(this.returnedDataPage, this.searchValue)
    },
    "$auth.user": function(){
       this.fetchFiles(this.returnedDataPage, this.searchValue)
    }
  },
})
</script>
