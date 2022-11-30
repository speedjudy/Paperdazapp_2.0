<template>
  <div class="py-2 flex items-center text-black gap-4 bg-white">
    <div class="flex items-center gap-4 flex-1 justify-between max-w-4xl px-4 text-sm">
      <!-- If authenticated user is created -->
      <span v-if="!isCreator" class="capitalize font-medium">{{
          file.fileAction
      }}</span>
      <!-- else -->
      <el-dropdown v-else trigger="click" class="font-medium" @command="handleActionChange">
        <span class="el-dropdown-link capitalize">
          {{ file.fileAction }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="complete" :disabled="file.fileAction == 'completed'">Complete</el-dropdown-item>
          <el-dropdown-item command="confirm" v-if="isPaid || teamAccess" :disabled="file.fileAction == 'confirm'">
            Confirm</el-dropdown-item>
          <el-dropdown-item command="sign" v-if="isPaid || teamAccess" :disabled="file.fileAction == 'sign'">Sign
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- If authenticated user is created -->
      <span v-if="!isCreator" class="capitalize font-medium">{{ access }}</span>

      <!-- -- the content below is v-else if previous is v-if - -->
      <el-dropdown v-else trigger="click" class="font-medium" @command="handleAccessChange">
        <span class="el-dropdown-link">
          {{ access }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="private">Private</el-dropdown-item>
          <el-dropdown-item command="public">Public</el-dropdown-item>
          <el-dropdown-item command="doNotPost">Do-not-post</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <div
        class="flex-1 flex items-center gap-5 justify-end text-xs font-medium"
      > -->
      <span class="hidden md:inline">{{ file.fileName }}</span>

      <span class="hidden md:inline">
        <span class="circle circle-2 bg-[#757575]"></span>
      </span>

      <span class="hidden md:inline">{{ file.userName }}</span>

      <span class="hidden md:inline">
        <span class="circle circle-2 bg-[#757575]"></span>
      </span>

      <span class="hidden md:inline">{{
          `${(file.updatedAt || "").substring(0, 10)} - ${(file.updatedAt || "").substring(
            11,
            16
          )}`
      }}
      </span>

      <el-dropdown trigger="click" class="font-medium" v-if="$auth.loggedIn && !isConfirm"
        @command="handleCommand($event)">
        <span class="el-dropdown-link text-[#555454] px-1 flex items-center">
          <ellipsis-icon-vertical-icon />
        </span>
        <el-dropdown-menu slot="dropdown" class="text-black">
          <el-dropdown-item command="save">
            <button v-if="!isConfirm && $auth.loggedIn"
              class="text-xs text-white bg-paperdazgreen-400 rounded px-5 h-7 w-[130px]">
              Done
            </button>
          </el-dropdown-item>
          <el-dropdown-item>
            <!-- <button
            @click="$router.back()"
              class="px-2 w-[130px] rounded flex items-center justify-center bg-gray-600 py-1.5 text-white"
            >
              <export-icon />
            </button> -->
          </el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item command="share" divided>
            <div class="flex items-center gap-2">
              <share-icon width="16" height="16" /> Share
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="request" v-if="(isPaid || isTeam) && (isCreator || teamAccess)">
            <div class="flex items-center gap-2">
              <request-icon width="16" height="16" /> Request
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="papertag" v-if="(isPaid || isTeam) && (isCreator || teamAccess)">
            <div class="flex items-center gap-2">
              <span class="font-medium">#</span>
              Paper tag
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="carbon-copy" v-if="(isPaid || isTeam) && (isCreator || teamAccess)">
            <div class="flex items-center gap-2">
              <copy-icon width="16" height="16" /> Carbon Copy
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="remove" v-if="(isPaid || isTeam) && (isCreator || teamAccess)">
            <div class="flex items-center gap-2">
              <trash-can-icon width="16" height="16" /> Remove
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- </div> -->
    </div>

    <div class="lg:flex items-center hidden">
      <button v-if="!isConfirm && $auth.loggedIn" @click="saveChanges"
        class="mr-2 text-xs text-white bg-paperdazgreen-400 rounded px-5 h-7">
        Done
      </button>
      <!-- <button
      @click="$router.back()"
       class="px-2">
        <export-icon />
      </button> -->
    </div>


    <ShareFilesModal :pdfContainerDimension="pdfContainerDimension" :userFile="file" v-model="showShareCompanyFiles"
      @qrLoad="showQrcodeFileFunc" />
    <RequestModal :pdfContainerDimension="pdfContainerDimension" :userFile="file" v-model="showRequestModal" />
    <pdf-c-c-flow-modal :file="file" v-model="showCCFlowModal" />
    <pdf-papertags-modal :file="file" v-model="showPapertagsModal" />
    <!-- <save-pdf-modal :pdfContainerDimension="pdfContainerDimension" :sendAction="saveFunction" :file="file" v-model="showSaveModal" /> -->
    <QrcodeShare :userFile="file" v-model="showQrcodeFiles" />

    <RemoveFileModal :fileId="file.id" v-model="showRemoveModal" />

    <AddToPageDrawOrType :src="$auth?.user?.initialURL || ' '" @image-exported="imageExportedLocal($event, false)"
      use-default-button />
    <!-- v-model="showInitialModal" -->


  </div>
</template>

<script>
import Vue from 'vue'
import EllipsisIconVerticalIcon from '../svg-icons/EllipsisIconVerticalIcon.vue'
import ExportIcon from '../svg-icons/ExportIcon.vue'
import _ from 'lodash'
import ShareIcon from '../svg-icons/ShareIcon.vue'
import RequestIcon from '../svg-icons/RequestIcon.vue'
import CopyIcon from '../svg-icons/CopyIcon.vue'
import TrashCanSolidIcon from '../svg-icons/TrashCanSolidIcon.vue'
import TrashCanIcon from '../svg-icons/TrashCanIcon.vue'
import PdfShareModal from './modals/PdfShareModal.vue'
import PdfCCFlowModal from './modals/PdfCCFlowModal.vue'
import PdfPapertagsModal from './modals/PdfPapertagsModal.vue'
import AuthUser from '~/models/AuthUser'
import UserTypeEnum from '~/models/UserTypeEnum'
import ShareFilesModal from '../company-files/Tabs/ShareFilesModal.vue'
import RequestModal from '../company-files/Tabs/RequestModal.vue'
import QrcodeShare from '../company-files/Tabs/QrcodeShare.vue'
import TeamAccess from '~/models/TeamAccess'
import PublishPdfModal from './modals/PublishPdfModal.vue'
import FilePrivacy from "~/models/FilePrivacy"
import FileAction from '~/models/FileAction'
import RemoveFileModal from './modals/RemoveFileModal.vue'
import AddToPageDrawOrType from '../modals/AddToPageDrawOrType.vue'

export default Vue.extend({
  components: {
    EllipsisIconVerticalIcon,
    ExportIcon,
    ShareIcon,
    RequestIcon,
    CopyIcon,
    TrashCanSolidIcon,
    TrashCanIcon,
    PdfShareModal,
    PdfCCFlowModal,
    PdfPapertagsModal,
    ShareFilesModal,
    RequestModal,
    QrcodeShare,
    PublishPdfModal,
    RemoveFileModal,
    AddToPageDrawOrType
  },
  beforeMount() {
    // if(!this.$auth.loggedIn){  
    //   this.$nuxt.$router.push("/login")
    // }
  },
  name: 'PdfPageActionTray',
  props: {
    file: { type: Object, required: true },
    pdfContainerDimension: { type: Object },
    tools: { type: Array },
    successFileFunction: { type: Function },
    isDeletedFunc: { type: Function }
  },
  data() {
    return {
      showShareCompanyFiles: false,
      showRequestModal: false,
      showCCFlowModal: false,
      showPapertagsModal: false,
      showSaveModal: false,
      showQrcodeFiles: false,
      fullName: '',
      saveFunction: '',
      showPublishModal: false,
      showRemoveModal: false
    }
  },
  computed: {
    isFree() {
      return ((this.$auth?.user)?.role == UserTypeEnum.FREE)
    },
    isPaid() {
      return ((this.$auth?.user)?.role == UserTypeEnum.PAID)
    },
    isTeam() {
      return ((this.$auth?.user)?.role == UserTypeEnum.TEAM)
    },
    isCreator() {
      return (this.file.userId == this.$auth?.user?.id) || ((this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE) && this.$auth?.user?.teamId == this.file.userId)
    },
    teamAccess() {
      return ((this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE) && this.$auth?.user?.teamId == this.file.userId)
    },
    access() {
      return this.file.filePrivacy
    },
    isConfirm() {
      return this.file.fileAction == FileAction.CONFIRM && !this.isCreator
    },
    hasAccess() {
      return (this.file.filePrivacy == FilePrivacy.PRIVATE) && !this.isCreator
    }
  },
  methods: {
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true
    },
    handleActionChange(command) {
      const fileTemp = { ...this.file }
      fileTemp.fileAction = command.toLowerCase()
      console.log(fileTemp.fileAction)
      this.$emit('update-file', fileTemp)

      // this.$axios.patch(`/files/${fileTemp.id}`, {
      //   fileAction: fileTemp.fileAction
      // }).catch(()=>{
      //   this.$notify.error({
      //     message:"error occured"
      //   })
      // })
    },
    handleAccessChange(command) {
      const fileTemp = { ...this.file }
      fileTemp.filePrivacy = String(command).toLowerCase()
      this.$emit('update-file', fileTemp)

      this.$axios.patch(`/files/${fileTemp.id}`, {
        filePrivacy: fileTemp.filePrivacy
      }).catch(() => {
        this.$notify.error({
          message: "error occured"
        })
      })
    },
    checkFilePrivacy() { },
    handleCommand(command) {
      switch (String(command).toLowerCase()) {
        case 'save':
          this.saveChanges()
          break
        case 'share':
          this.showShareCompanyFiles = true
          break
        case 'request':
          this.showRequestModal = true
          break
        case 'carbon-copy':
          this.showCCFlowModal = true
          break
        case 'papertag':
          this.showPapertagsModal = true
          break
        case 'remove':
          this.showRemoveModal = true
          break
      }
    },
    saveChanges() {
      this.saveFunction = 'saved'
      this.$emit('publishFileFunction')
    },
  },
  mounted() {
    console.log(this.file)
    console.log(this.file.userId, (this.$auth?.user)?.id)
    this.checkFilePrivacy()
  },
  watch: {
    '$auth.user': function () {
      this.fullName =
        (this.$auth?.user)?.firstName +
        ' ' +
        (this.$auth?.user)?.lastName
    },
  },
})
</script>
