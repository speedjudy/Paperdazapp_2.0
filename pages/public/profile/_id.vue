<template>
  <div class="">
   <ProfileTopInfo :userInfo="userInfo"/>
    

    <div class="mt-4 bg-white rounded-xl" v-if="checkWEmptyFileFolder">
      <header
        class="text-paperdazgreen-400 font-semibold p-4 border-b border-[#DCDCDC]"
      >
        <h4 class="text-[19px]">Folders \ Files</h4>
      </header>
      <div class="min-h-[50vh] grid place-items-center p-4">
        <div>
          <p class="text-center text-[#434242] text-md font-medium">
            Your Public Profile is empty!
          </p>
          <div class="grid place-items-center">
            <button
              class="text-sm font-medium text-white h-10 rounded-xl bg-paperdazgreen-400 shadow mt-2 px-5"
            >
              Turn files into Paperlink
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4" v-else>
      <!-- Start:: Folders -->
      <div class="bg-white rounded-xl mb-4">
        <header
          class="p-4 border-b border-[#DCDCDC] text-paperdazgreen-400 flex flex-wrap items-center gap-2 justify-between"
        >
          <h4 class="text-xl font-medium">Folders</h4>

          <div
            @submit.prevent
            class="flex flex-1 justify-end items-center gap-2 text-xs text-gray-800 relative"
          >
            <span
              class="el-dropdown-link"
              :class="[show ? 'left-roll' : 'no-roll']"
            >
              <input
                type="text"
                placeholder="Search any folder..."
                class="rounded-lg border w-12 border-paperdazgreen-400 px-2 h-8 placeholder:italic"
                v-model="searchFolderParam"
              />
            </span>

            <button
              @click="show = !show"
              type="button"
              class="circle circle-15 bg-paperdazgreen-400 text-white"
            >
              <search-icon width="14" height="14" currentcolor="white"/>
            </button>
          </div>
        </header>

        <!-- Start:: Folders-item -->
        <div class="max-h-36 overflow-y-auto custom-scrollbar relative">
          <!-- START: spinner container -->
          <div
            v-if="folderSpinner"
            class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
          >
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->

           <!-- START:display when no file -->
              <div class="w-full h-20 grid place-items-center" v-if="folders.length < 1">
                 <span class="textr-[15px]">No Folder Available</span>
              </div>
           <!-- END:display when no file -->

          <!-- Start:: Single row -->
          <div
            v-for="(item, i) in folders"
            :key="i + 'folder'"
            class="grid grid-cols-[max-content,1fr] gap-2 items-center px-4 border-b border-[#DCDCDC] py-2"
          >
             <img class="w-7" src="@/assets/recent-icons/OpenedFolder.svg" />
            <div class="overflow-hidden">
              <p class="text-[#414142] whitespace-nowrap truncate text-[15px]">
                <nuxt-link
                  :to="`/public-profile/${item.id}`"
                  class="cursor-pointer"
                  >{{ (item || {}).name }}</nuxt-link
                >
              </p>
            </div>
          </div>
          <!-- End:: Single row -->
        </div>
      </div>
      <!-- End:: Folders -->
         <FilePagination :totalFile="totalFolder" @setPage="setFolderPage"/>





      <!-- Start:: Files -->
      <div class="bg-white rounded-xl pb-4">
        <header
          class="p-4 border-b border-[#DCDCDC] text-paperdazgreen-400 flex flex-wrap items-center gap-2 justify-between"
        >
          <h4 class="text-xl font-medium">Files</h4>
          <form
            @submit.prevent
            class="flex flex-1 justify-end items-center gap-2 text-xs text-gray-800 relative"
          >
            <span
              class="el-dropdown-link"
              :class="[showFile ? 'left-roll' : 'no-roll']"
            >
              <input
                type="text"
                placeholder="Search any file..."
                class="rounded-lg border border-paperdazgreen-400 px-2 h-8 placeholder:italic"
                v-model="searchFileParam"
              />
            </span>
            <button
              @click="showFile = !showFile"
              type="button"
              class="circle circle-15 bg-paperdazgreen-400 text-white"
            >
              <search-icon width="14" height="14" currentcolor="white"/>
            </button>
          </form>
        </header>
        <div class="custom-scrollbar relative">
          <!-- START: spinner container -->
          <div
            v-if="fileSpinner"
            class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
          >
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->

          <!-- START:display when no file -->
              <div class="w-full h-20 grid place-items-center" v-if="files.length < 1">
                 <span class="textr-[15px]">No File Here...</span>
              </div>
           <!-- END:display when no file -->

          <!-- Start:: Single row -->
          <div
            v-else
            v-for="(item, i) in files"
            :key="i + 'file'"
            class="grid grid-cols-[max-content,1fr,max-content] gap-2 items-center px-4 border-b border-[#DCDCDC] py-3"
          >
            <img src="/icon.png" width="23" height="23" />

            <div class="overflow-hidden">
              <p class="text-[#414142] whitespace-nowrap truncate text-[15px]">
                <nuxt-link :to="`/pdf/${item.paperLink}`" class="cursor-pointer">
                {{ (item || {}).fileName || ' ' }}
              </nuxt-link>
              </p>
            </div>
            <ShareFileOptions :file="item" />
          </div>
          <!-- End:: Single row -->
        </div>
      </div>
      <!-- Start:: Files -->

      <FilePagination :totalFile="totalFile" @setPage="setFilePage" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import PenIcon from '~/components/svg-icons/PenIcon.vue'
import QRCode from 'qrcode'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import FolderIcon from '~/components/svg-icons/FolderIcon.vue'
import FolderSolidIcon from '~/components/svg-icons/FolderSolidIcon.vue'
import ShareIcon from '~/components/svg-icons/ShareIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import ForwardOutlineIcon from '~/components/svg-icons/ForwardOutlineIcon.vue'
import FreeUser from '~/middleware/free-user'
import SpinnerDottedIcon from '../../../components/svg-icons/SpinnerDottedIcon.vue'
import Paid_User from '~/mixins/Paid_User'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import FilePagination from '~/components/pagination/FilePagination.vue'
import ShareFileOptions from '~/components/profile/components/ShareFileOptions.vue'


export default Vue.extend({
  components: {
    PenIcon,
    SearchIcon,
    FolderIcon,
    FolderSolidIcon,
    ShareIcon,
    ShareOutlineIcon,
    HeartOutlineIcon,
    ForwardOutlineIcon,
    SpinnerDottedIcon,
    ArrowDownIcon,
    FilePagination,
    ShareFileOptions
},
  name: 'PublicProfilePage',
  layout: 'profile',
  auth: false,
  // middleware: ['paid-user'],
  asyncData({ store }) {
    store.commit('SET_PAGE_NAME', { name: 'Profile' })
  },
  mounted() {
    this.getUserFolders(this.returnedFolderPage, this.searchFolderParam)
    this.getUserFiles(this.returnedDataPage, this.searchFileParam)
    this.getTeamPublicInfo()
    this.generateQR()
    // this.totalFileFolder()
  },
  computed: {},
  // middleware:['paid_user'],
  data() {
    return {
      returnedDataPage: 0,
      returnedFolderPage:0,
      totalFile: null,
      totalFolder: null,
      searchFolderParam: '',
      searchFileParam: '',
      folders: [],
      files: [],
      show: false,
      showFile: false,
      fileSpinner: true,
      folderSpinner: true,
      checkWEmptyFileFolder: false,
      userInfo:{}
    }
  },
  methods: {
    setFileFavourite(){

    },
    getMainPaidUser(val){
     this.$axios.get(`/users/?mainAccountId=${val}&role=${UserTypeEnum.PAID}`)
     .then((response)=>{
      this.userInfo = response.data.data[0]
      console.log("kkkkkkkkkkkkkk",response)
     })
  },
    setFilePage(page) {
       this.fileSpinner = true
      this.returnedDataPage = page
    },
    setFolderPage(page) {
      this.folderSpinner = true
      this.returnedFolderPage = page
    },
    getTeamPublicInfo(){
    this.$axios.get(`users/?id=${this.$route.params.id}`)
    .then((response)=>{
      const user = response.data.data
       let userInfo = user[0];
      //  this.isInfoReady = true
       console.log("UUUUUUUUUUUU",user)

      // this.$auth.user.role == UserTypeEnum.TEAM ? this.getMainPaidUser(userInfo.id) :
      this.userInfo = user[0]
      //  if(user.role != UserTypeEnum.PAID)
      //  this.$nuxt.$router.push('/dashboard')
    })
    .catch(()=>{
      this.$notify.error({
        message:"Could not get user"
      })
    })
  },
    async getUserFolders(page, search) {

      await this.$axios
        .$get(`/folders/?userId=${this.$route.params.id}&name[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`)
        .then((response) => {
          const filesData = response.data.map((el) => {
          return el
          })
          console.log(">>>>>>>>>>>fffffffff",response)
          this.folders = filesData
          this.checkWEmptyFileFolder = filesData > 0
          this.totalFolder = response.total
          this.folderSpinner = false
        })
    },
    async getUserFiles(page, search) {
      await this.$axios
        .$get(`/files/?userId=${this.$route.params.id}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`,{
          params:{
            isEditing:0
          }
        })
        .then((response) => {
          const filesData = response.data.map((el) => {
          return el
          })
          this.files = filesData
          this.checkWEmptyFileFolder = filesData > 0
          this.fileSpinner = false
          this.totalFile = response.total
        })
    },

    async generateQR() {
      QRCode.toCanvas(this.$refs.qrcancas, location.href, function () {})
      await this.$nextTick()
    },
  },
  watch: {
    '$auth.user': function () {
      this.getUserFolders(this.returnedFolderPage,this.searchFolderParam)
      this.getUserFiles(this.returnedDataPage,this.searchFileParam)
    },
    returnedDataPage: function () {
      this.fileSpinner = true;
      this.getUserFiles(this.returnedDataPage,this.searchFolderParam)
    },
    searchFolderParam(){
      this.getUserFolders(this.returnedFolderPage,this.searchFolderParam)
    },
    searchFileParam(){
      this.getUserFiles(this.returnedDataPage,this.searchFileParam)
    },
     returnedFolderPage(){
      this.getUserFolders(this.returnedFolderPage,this.searchFolderParam)
    },
    returnedDataPage(){
      this.getUserFiles(this.returnedDataPage,this.searchFileParam)
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
