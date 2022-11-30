<template>
  <div class="flex flex-col">
    <h3
      class="text-paperdazgray-700 font-semibold text-xl mb-5 sm:mb-7 flex flex-col gap-3 xs:flex-row xs:items-center justify-between whitespace-nowrap"
    >
      <span>File Ledger {{ filterUser }}</span>
      <div
        class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end"
      >
        <span
          class="el-dropdown-link"
          :class="[show ? 'left-roll' : 'no-roll']"
        >
          <input
            type="text"
            class="search-input h-10 transition pl-4 mr-2 bg-transparent flex-1 border border-paperdazgreen-300 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
            placeholder="Search Files"
            v-model="searchParam"
          />
        </span>

        <button
          @click="show = !show"
          class="circle circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150"
        >
          <search-icon width="16" height="16" currentcolor="white"/>
        </button>
      </div>
    </h3>

    <div
      ref="ledgerContainer"
      class="bg-white rounded-2xl flex-1 min-h-[50vh] lg:min-h-[40vh]"
      :class="[
        (files || []).length <= 0 || $fetchState.pending
          ? 'p-5 flex items-center justify-center'
          : 'pb-4 overflow-x-auto custom-scrollbar',
      ]"
    >
      <scribble-icon
        v-if="(files || []).length <= 0"
        v-show="showScribble"
        class="text-paperdazgreen-250 fixed bottom-9 right-20 sm:bottom-10 sm:right-44 h-40 w-40 sm:h-64 sm:w-64 transition ease-in-out duration-200 animate-pulse"
        :class="[
          showScribble
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ]"
      />

      <!-- <transition name="fade" mode="out-in"> -->
      <div v-if="spinner" key="1" class="p-6 flex justify-center items-center">
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- Start:: empty file ledger -->
      <div
        key="2"
        v-else-if="(pdfUser || []).length <= 0"
        class="text-center flex flex-col items-center justify-between sm:justify-items-start py-8"
      >
        <h4
          class="text-paperdazgray-700 font-semibold text-base sm:text-lg lg:text-xl mb-10"
        >
          Complete file and upload files to earn leaves
        </h4>
        <tree-icon height="88" width="80" class="mb-7" />
        <span class="text-paperdazgray-700 text-sm mb-10 inline-block">
          We will plant a tree in your honor at 25,0000 leaves
        </span>
      </div>

      <!-- End:: empty file ledger -->

      <table key="3" v-else ref="fileLedgerTable" class="file-ledger-table">
        <thead>
          <tr class="text-left">
            <th class="text-center fixed-col left">No</th>
            <th>File Name</th>
            <th class="text-center">Action</th>
            <th class="text-center">Action By</th>
            <th>Date & time</th>
            <th class="fixed-col right"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(file, i) in pdfUser"
            :key="file.id"
            :class="{ highlight: file.id == highlightedFileId }"
          >
            <td class="text-center fixed-col left">{{ i + 1 + returnedDataPage }}</td>
            <td>
              <div class="flex items-center gap-1.5">
                <div
                  class="border border-paperdazgreen-300 p-0.5"
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
                </div>
                <div>
                  <p class="text-sm font-medium">
                    <nuxt-link :to="`/pdf/${file.paperLink}`">
                      {{ file.fileName}}
                    </nuxt-link>
                  </p>
                  <p class="text-xs">
                    {{ (file || {}).userName }}
                  </p>
                </div>
              </div>
            </td>
            <td class="text-center">
              {{ file.fileAction || "-" }}
            </td>
            <td class="text-center">
              {{ (file || {}).userName }}
            </td>
            <td>
              {{ formatDateTime(file.updatedAt) }}
            </td>
            <td class="fixed-col right">
              <button
                class="cursor-pointer"
                @click="showShareCompanyFilesFunc(file)"
              >
                <share-icon class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- </transition> -->
    </div>
      
      <FilePagination :totalFile="totalFile" @setPage="setPage"/>

    <ShareFilesModal
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
    />
    

    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import ScribbleIcon from '../svg-icons/ScribbleIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import TreeIcon from '../svg-icons/TreeIcon.vue'
import DateFormatter from '~/utils/DateFormatter'
import ShareIcon from '../svg-icons/ShareIcon.vue'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import ShareFilesModal from '../company-files/Tabs/ShareFilesModal.vue'
import QrcodeShare from '../company-files/Tabs/QrcodeShare.vue'
import FilePagination from '../pagination/FilePagination.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import AuthUser from '~/models/AuthUser'

export default Vue.extend({
  components: {
    TreeIcon,
    ScribbleIcon,
    SearchIcon,
    ShareIcon,
    SpinnerDottedIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination
},
  props: ['searchContect'],
  async fetch() {},
  data() {
    return {
      searchParam: '',
      totalFile:null,
      returnedDataPage:0,
      spinner: true,
      show: false,
      showQrcodeFiles: false,
      showShareCompanyFiles: false,
      userFile: {},
      userId: (this.$auth.user).id,
      filterTitle: '',
      searchValue:'',
      showScribble: false,
      files: [],
      copyFiles: [],
      highlightedFileId: undefined,
      scrollObserver: undefined,
    }
  },
  mounted() {
    this.handleFileHighlight()
    this.handleShowingLedger()
    this.tableScrollObserver()
    this.fetchFiles(this.returnedDataPage, this.searchValue)
  },

  methods: {
    searchFiles(event){
      this.searchValue = event.target.value
    },
    async ledgerFiles(page, search){
      // &fileName[$like]=${search}%&$skip=${page}
      let acct = this.$auth.user.role != UserTypeEnum.PAID ?
       `/ledger?userId=${this.$auth.user.id}&$sort[updatedAt]=-1&fileName[$like]=${search}%&$skip=${page}` :
       `/ledger?mainAccountId=${this.$auth.user.id}&$sort[updatedAt]=-1&fileName[$like]=${search}%&$skip=${page}`

      await this.$axios.get(acct)
      .then((response)=>{
        const files = response.data.data.map((el) => {
            return {...el,
              favourites: [],
              shared: null,
              fileAction: el.action,
              paperLink: (el.file || {}).paperLink,
              userName: this.$auth.user.firstName +" "+ this.$auth.user.lastName,
            }
          })
          this.files = files
          this.$store.commit('ADD_USER', files)
          this.totalFile = response.data.total
      })
      .finally(() => {
          this.spinner = false
        })
    },
    async fetchUserFiles(page, search){
      let paramsId = this.$auth.user?.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user?.id
    //<<---------------- START: fetching the user files --- ------>>
      await this.$axios
        .$get(`/files?userId=${paramsId}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`,{
          params:{
            isEditing:0
          }
         })
        .then((response) => {
          this.$emit('setUploadpaperlink', response.total)
          const files = (response.data).map((el) => {
            return el
          })
          this.files = files
          this.$store.commit('ADD_USER', files)
          this.totalFile = response.total
        })
        .finally(() => {
          this.spinner = false
        })
    //<<----------------END: fetching the user files --- ------>>
    },
     setPage(page) {
      this.returnedDataPage = page
    },
    showShareCompanyFilesFunc(data) {
      this.userFile = data
      this.showShareCompanyFiles = true
    },
    showQrcodeFileFunc(){
      this.showQrcodeFiles = true;
    },
    async fetchFiles(page, search) {
      // this.isPaidUser ? this.fetchUserFiles(page, search) : this.ledgerFiles(page, search)
      this.isPaidUser ? this.ledgerFiles(page, search) : this.ledgerFiles(page, search)
    },
    handleFileHighlight() {
      this.highlightedFileId = this.$nuxt.$route.query.highlight_file

      setTimeout(() => {
      this.highlightedFileId = undefined
      }, 20000)
    },
    shareFile(file) {
      const url = location.origin.replace(/\/+$/, '') + `/pdf/${file.id}`
      navigator.share({
      url,
      title: file.file_name,
      })
    },
    async tableScrollObserver() {
      await this.$nextTick()
      if (this.scrollObserver) {
        try {
          this.scrollObserver.disconnect()
          this.scrollObserver = undefined
        } catch (e) {}
      }
      const options = {
        root: this.$refs.ledgerContainer,
        // root: document,
        rootMargin: '0px',
        threshold: 1.0,
      }

      const callback = (
        entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.classList.add('scrolled')
          } else {
            entry.target.classList.remove('scrolled')
          }
        })
      }

      const observer = new IntersectionObserver(callback, options)

      const fixedCols = document.querySelectorAll('.fixed-col')

      fixedCols.forEach((el) => {
        observer.observe(el)
      })

      this.scrollObserver = observer
    },
    formatDateTime(dateVal) {
      return `${DateFormatter.getDateString(
        dateVal
      )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    handleShowingLedger() {
      const ledgerContainer = this.$refs.ledgerContainer 

      if (!ledgerContainer) return

      const options = {
        root: null,
        threshold: 0.75,
        rootMargin: '0px',
      }
      const callback = (
        entries,
        _observer
      ) => {
        entries.forEach((entry) => {
          if (entry.target === ledgerContainer) {
            if (entry.isIntersecting) {
              this.showScribble = true
            } else {
              this.showScribble = false
            }
          }
        })
      }

      const observer = new IntersectionObserver(callback, options)

      observer.observe(ledgerContainer)
    },
  },

  updated() {
    this.tableScrollObserver()
  },
  computed: {
    // getting state from the store
    ...mapState(['filterUser', 'pdfUser']),
    userType(){
      return (UserTypeEnum)
    },
    isPaidUser() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return true
        case UserTypeEnum.TEAM:
          return true
        case UserTypeEnum.FREE:
          return false
      }
    },
  },
  watch: {
    '$auth.user': function () {
      this.fetchFiles(this.returnedDataPage, this.searchParam)
    },
    'returnedDataPage': function(){
      this.spinner = true;
       this.fetchFiles(this.returnedDataPage, this.searchParam)
    },
    'searchParam': function(){
      this.spinner = true;
       this.fetchFiles(this.returnedDataPage, this.searchParam)
    }
  },
})
</script>

<style lang="postcss" scoped>
.file-ledger-table {
  --background: white;
  @apply text-sm w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;

  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }

  & th {
    @apply pt-8 pb-3;
    background: var(--background);
  }

  & td {
    @apply py-3;
  }

  & td,
  & th {
    @apply px-2 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    &:first-child {
      @apply pl-5;
    }
    &:last-child {
      @apply pr-5;
    }

    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);
      &.left {
        left: -0.1px;
        &.scrolled {
          box-shadow: 3px 0px 8px rgb(0 0 0 / 14%);
        }
      }
      &.right {
        right: -0.1px;
        &.scrolled {
          box-shadow: 0px 3px 8px rgb(0 0 0 / 14%);
        }
      }
    }
  }
}

/* .search-input {
  & ~ .search-dropdown {
    @apply opacity-0 translate-y-[5%] pointer-events-none;
  }

  &:active,
  &:focus {
    & ~ .search-dropdown {
      @apply opacity-100 translate-y-0 pointer-events-auto;
    }
  }
} */
</style>
