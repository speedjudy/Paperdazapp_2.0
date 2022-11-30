<!--
 NOTE THAT JQUERY IS ONLY USE IN PFD SECTION 
 AND A VERY LITTLE KNOWLEDGE OF JQUERY IS REQUIRED
  -->

<template>
  <div class="grid grid-cols-1 md:grid-cols-[max-content,1fr] grid-rows-1 h-full max-h-full overflow-hidden"
    id="pdf-page-vue">
    <!-- pdf page aside has hidden md:grid -->
    <pdf-page-aside class="hidden md:block" @nextPage="nextPageHandler" @prevPage="prevPageHandler"
      :numPages="propsNumPages" :currentPage="currentPage" :pdf="pdf" @sideSetScrollPage="sideSetScrollPage"
      v-if="displayPDF" />
    <main v-if="displayPDF" class="grid grid-rows-[max-content,max-content,1fr] gap-1 max-w-max mx-auto px-[2%]">
      <pdf-page-action-tray :file="file" @update-file="file = $event" :tools="tools" class="w-full"
        @isDeletedFunc="isDeletedFunc" :pdfContainerDimension="pdfContainerDimension"
        @publishFileFunction="publishFileFunction" />

      <tool-bar :file="file" @tool-change="onToolChange" :selectedToolType="selectedToolType" @undo="undo"
        class="max-w-4xl" :isLoading="pdfLoading" />
      <div class="pdf-editor-view relative custom-scrollbar overflow-y-scroll max-w-4xl" @scroll="setScrollPage"
        v-if="pdf" ref="scrollingElement">
        <div class="pdf-pages-outer pb-6 relative" ref="PagesOuter" :style="pagesOuterStyle">
          <!-- <tool-wrapper
            v-for="tool in fillteredTools"
            :key="tool.id"
            :dragHandler="handlePanning"
            :id="tool.id"
            :tool="tool"
            :type="tool.type"
            :x1="tool.x1"
            :y1="tool.y1"
            :x2="tool.x2"
            :y2="tool.y2"
            :points="tool.points"
            :deleteTool="deleteTool"
            :handleIncrease="handleIncrease"
            :handleDecrease="handleDecrease"
            :fontSize="tool.fontSize"
            :scale="tool.scale"
            :signature="signature"
            @pos-change="onPosChange"
            :activeToolId="activeToolId"
            :setActiveToolId="setActiveToolId"
          /> -->
          <!-- <component :is="`${selectedToolType}-identifier`" v-if="selectedToolType && showToolIdentifier" :position="toolIdentifierPosition" /> -->
          <div class="pdf-single-pages-outer w-full" ref="pdf-single-pages-outer" v-if="pdf">
            <div :class="[
              'pdf-single-page-outer w-full',
              { 'mt-6': pI > 0 && !downloadingPdf },
            ]" :ref="`pdf-single-page-outer-${pI + 1}`" v-for="(page, pI) in pdf.numPages" :key="pI"
              style="position: relative;">
              <!-- <div id="sai" class="w-full h-full absolute"> -->

              <tool-wrapper v-for="tool in fillteredTools(pI + 1)" :key="tool.id" :dragHandler="handlePanning"
                :id="tool.id" :tool="tool" :type="tool.type" :x1="tool.x1" :y1="tool.y1" :x2="tool.x2" :y2="tool.y2"
                :points="tool.points" :deleteTool="deleteTool" :handleIncrease="handleIncrease"
                :handleDecrease="handleDecrease" :fontSize="tool.fontSize" :scale="tool.scale" @pos-change="onPosChange"
                @resetJustMounted="resetJustMounted" :activeToolId="activeToolId" :setActiveToolId="setActiveToolId"
                :pageNumber="pI + 1" :value="tool.value" :file="file" :justMounted="tool.justMounted"
                :showPublishModal="showPublishModal" :generatePDF="generatePDF"
                @toolWrapperBeforeChecked="toolWrapperBeforeChecked" @toolWrapperAfterChecked="toolWrapperAfterChecked"
                v-model="tool.value" />
              <!-- </div> -->
              <pdf-page :handlePanning="handlePanning" :onCLickSinglePageOuter="onCLickSinglePageOuter" :file="file"
                :onMouseMoveOnPages="onMouseMoveOnPages" :onMouseLeaveFromPages="onMouseLeaveFromPages"
                :page-number="pI + 1" :pdf="pdf" :scale="scale" @setPageHeight="setPageHeight"
                :initialOrigin="setInitialOrigin" @setPageWidth="onloadPdfquery" />
            </div>
          </div>
        </div>
        <!-- <button   @click="downloadPdf">download</button> -->
        <div id="bottom"></div>
      </div>
      <button class="w-full bg-paperdazgreen-400 py-2 text-white overflow-hidden duration-300"
        v-if="isScrollBottom && $auth.loggedIn && isCreator && isConfirm" id="confirmButtton"
        @click="confirmDocument()">
        Confirm
      </button>
    </main>
    <!-- <save-pdf-modal
      :sendAction="saveFunction"
      :file="file"
      :canvasHeight="setContainerPdfHeight"
      v-model="showSaveModal"
    /> -->
    <ExistFileManagerModal :file="file" :tools="tools" @confirmExistFileManager="confirmExistFileManager"
      v-model="showExitFileManager" />

    <PublishPdfModal @startGeneratePdf="startGeneratePdf" @successFileFunction="successFileFunction" :file="file"
      :tools="tools" @trackSubmitTools="trackSubmitTools" v-model="showPublishModal" />

    <BlockPrivateFile :file="file" v-model="showBlockPrivate" />
    <BlockDonotPostFile :file="file" v-model="showBlockDonotPost" />
    <SuccessFileModal :file="file" v-model="showSuccesshModal" />
    <SignDoneModal :file="file" v-model="showSignDone" />
    <!-- <AddToPageDrawOrType
    v-model="showInitialModal"
    :src="$auth?.user?.initialURL || ' '"
    @image-exported="imageExportedLocal($event, true)"
    use-default-button
  /> -->
    <!-- <PdfRequestModal :file="file" :canvasHeight="setContainerPdfHeight" v-model="showRequestModal"/> -->
  </div>
</template>

<script>
// import demoPdf from '@/assets/pdf/sample.pdf'
import * as pdfJs from 'pdfjs-dist/build/pdf'
import * as worker from 'pdfjs-dist/build/pdf.worker.entry'
pdfJs.GlobalWorkerOptions.workerSrc = worker

import jsPDF from 'jspdf'

import PdfPage from '@/components/pdf/PdfPage'
import ToolWrapper from '@/components/pdf/ToolWrapper'
import ToolBar from '@/components/pdf/ToolBar'
// import PdfPageAsideVue from '~/components/pdf/PdfPageAside.vue'

import TOOL_TYPE from '@/components/pdf/data/toolType'
import TOOL_DIRECTION from '@/components/pdf/data/toolDragDirection'

import TextIdentifier from '@/components/pdf/tools_identifiers/Text'
import TickIdentifier from '@/components/pdf/tools_identifiers/Tick'
import CrossIdentifier from '@/components/pdf/tools_identifiers/Cross'
import DotIdentifier from '@/components/pdf/tools_identifiers/Dot'
import CircleIdentifier from '@/components/pdf/tools_identifiers/Circle'
import LineIdentifier from '@/components/pdf/tools_identifiers/Line'
import DrawIdentifier from '@/components/pdf/tools_identifiers/Draw'
import HighlightIdentifier from '@/components/pdf/tools_identifiers/Highlight'
import DateIdentifier from '@/components/pdf/tools_identifiers/Date'
import NameIdentifier from '@/components/pdf/tools_identifiers/Name'
import InitialIdentifier from '@/components/pdf/tools_identifiers/Initial'
import SignatureIdentifier from '@/components/pdf/tools_identifiers/Signature'
import StarIdentifier from '@/components/pdf/tools_identifiers/Star'
import AppendSignature from '~/components/pdf/tools_identifiers/AppendSignature.vue'
import AppendInitial from '~/components/pdf/tools_identifiers/AppendInitial.vue'

import moment from 'moment'
import $ from 'jquery'
import { extractFormPdf } from '~/components/functions/extractFormPdf'
import PdfRequestModal from '~/components/pdf/modals/PdfRequestModal.vue'
import FileAction from '~/models/FileAction'
import mixins from 'vue-typed-mixins'
import PdfAuth from '~/mixins/PdfAuth'
import { ExtractFormPdf } from '~/components/functions/extractFormPdf'
import TeamAccess from '~/models/TeamAccess'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
import ExistFileManagerModal from '~/components/pdf/modals/ExistFileManagerModal.vue'
import PublishPdfModal from '../../components/pdf/modals/PublishPdfModal.vue'
import SuccessFileModal from '../../components/pdf/modals/SuccessFileModal.vue'
import SignDoneModal from '../../components/pdf/modals/SignDoneModal.vue'
import BlockPrivateFile from '../../components/pdf/modals/BlockPrivateFile.vue'
import FilePrivacy from '~/models/FilePrivacy'
import BlockDonotPostFile from '~/components/pdf/modals/BlockDonotPostFile.vue'
import { mapState } from 'vuex'
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'

export default mixins(PdfAuth).extend({
  layout: 'pdf',
  name: 'SinglePdfPage',
  auth: false,
  components: {
    PdfPage,
    ToolWrapper,
    ToolBar,
    TextIdentifier,
    TickIdentifier,
    CrossIdentifier,
    DotIdentifier,
    CircleIdentifier,
    LineIdentifier,
    HighlightIdentifier,
    DrawIdentifier,
    DateIdentifier,
    NameIdentifier,
    InitialIdentifier,
    SignatureIdentifier,
    StarIdentifier,
    PdfRequestModal,
    AppendSignature,
    AppendInitial,
    ExistFileManagerModal,
    PublishPdfModal,
    SuccessFileModal,
    BlockPrivateFile,
    BlockDonotPostFile,
    AddToPageDrawOrType,
    SignDoneModal
  },
  data: () => ({
    pdf: null,
    tools: [],
    selectedToolType: null,
    toolIdentifierPosition: { top: 0, left: 0 },
    showToolIdentifier: false,
    pdfLoading: true,

    propsNumPages: null,
    setInitialOrigin: 0,
    pageHeight: null,
    currentPage: 1,
    proceedRoute: false,
    pageReachBottom: false,
    setContainerPage: 0,
    setContainerPdfHeight: 0,
    showRequestModal: false,
    saveFunction: '',
    pageGapBetween: 24,
    blockAnnotationRender: false,
    pdfContainerDimension: {},
    showExitFileManager: false,
    nextRoute: null,
    initialTools: [],
    showPublishModal: false,
    showSuccesshModal: false,
    showSignDone: false,
    isBottom: false,
    generatePDF: false,
    showBlockPrivate: false,
    filePermission: true,
    displayPDF: false,
    showBlockDonotPost: false,
    initialFileAnnotation: [],
    keepErrorCount: 0,
    hasDeleted: false,
    filteredAnnotationButton: [],

    lastPosX: 0,
    lastPosY: 0,
    isPanning: false,

    selectedToolId: null,

    signature: null,
    initial: null,
    // data populated from asyncData
    file: {},

    scale: 1,
    stack: [],
    undoStack: [],

    activeToolId: null,

    toolId: 0,
    downloadingPdf: false,
    showSaveModal: false,
  }),
  created() {
    this.fetchPdf()
    this.$BUS.$on('is-deleted', this.isDeletedFunc)
    this.$BUS.$on('download-pdf', this.downloadPdf)
    this.$BUS.$on('scrollToSignInitial', this.scrollToSignInitial)
    this.$BUS.$on('signature-update', (v) => (this.signature = v))
    this.$BUS.$on('initials-update', (v) => (this.initial = v))
  },

  mounted() {
    document.addEventListener('keyup', this.keyupHandler)
    window.onresize = () => {
      // this.$refs.PagesOuter.style.width = this.setContainerPage + 'px'
    }
    this.checkFilePrivacyOnload();

  },
  destroyed() {
    document.removeEventListener('keyup', this.keyupHandler)
  },

  beforeDestroy() {
    this.$BUS.$off('download-pdf')
    this.$BUS.$off('signature-update')
    this.$BUS.$off('initials-update')
    this.$BUS.$off('scrollToSignInitial')
    this.$store.commit('SET_EDIT_ANNOTATION', true)
  },
  async asyncData({ $axios, params, error, store }) {
    const file = await $axios
      .$get(`/files/?paperLink=${params.id}`)
      .then((response) => {
        const [file] = response.data
        file.fileAction = file.fileAction || 'complete'
        return file
      })
      .catch((err) => {
        error({
          statusCode: 404,
          message: err.message || FileAction.COMPLETE,
        })
      })

    const user = await $axios
      .$get(`/users/${localStorage.getItem('paperdaz_userID')}`)
      .then((response) => {
        return response
      })
      .catch((err) => { })

    return { file, user }
  },

  updated() {
    this.handleScale()
  },
  head() {
    return {
      script: [
        // ...
        {
          integrity:
            'sha512-IetiMzopsrb75HtZydIM8zRv1mlSmV42P0iZVT4sPHxDnhM0I9O8/75bFqlfWoCKTnDB+pFqvoQrlnkgUeShaA==',
          src: '/html-to-png/htmlToPng.js',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer',
        },
      ],
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.$store.state.pdfExit == true) {
      return next(true)
    }
    if (!this.displayPDF) {
      return next(true)
    }
    if (this.isCreator) {
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    } else {
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    }
  },
  computed: {
    ...mapState(['pageName']),
    getAllPdfPages() {
      return document.querySelectorAll('.pdf-single-page-outer').length
    },
    isCreator() {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },

    pagesOuterStyle() {
      let scale = `scale(${this.scale})`
      return {
        transform: scale,
        '-webkit-transform': scale,
        'transform-origin': '0px 0px',
      }
    },
    TOOL_TYPE() {
      return TOOL_TYPE
    },
    TOOL_DIRECTION() {
      return TOOL_DIRECTION
    },
    TOOL_THRESHOLD() {
      return {
        [TOOL_TYPE.text]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.tick]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
        [TOOL_TYPE.cross]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
        [TOOL_TYPE.dot]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 10, left: 0 },
        },
        [TOOL_TYPE.circle]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
        [TOOL_TYPE.line]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 0, left: 0 },
        },
        [TOOL_TYPE.highlight]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 5, left: 0 },
        },
        [TOOL_TYPE.draw]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 0, left: 0 },
        },
        [TOOL_TYPE.date]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.name]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.initial]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.signature]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.star]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
        [TOOL_TYPE.appendSignature]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
        [TOOL_TYPE.appendInitial]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 20, left: 0 },
        },
      }
    },
    selectedTool() {
      this.selectedToolIndex < 0 ? null : this.tools[this.selectedToolIndex]
    },
    isScrollBottom() {
      return this.$store.state.scrollPosition;
    }
  },
  watch: {
    pdf(v) {
      this.handleScale()
    },
  },
  methods: {
    scrollToSignInitial(type = "") {
      if (this.isCreator || !this.$auth.loggedIn) return

      setTimeout(() => {
        let annotationButton = document.querySelectorAll('.annot-button')
        Array.from(annotationButton).forEach((element) => {
          if (element) element.classList.remove('pulse')
        })
        this.filteredAnnotationButton = Array.from(annotationButton).filter(
          (item, index) => !item.hasAttribute('elemFill')
        )
        if (this.filteredAnnotationButton.length == 0 && this.isSign && type === "appendsigninitial") {
          this.showSignDone = true;
        }
        if (this.filteredAnnotationButton[0]) {
          this.filteredAnnotationButton[0].classList.add('pulse')
          this.filteredAnnotationButton[0].scrollIntoView({ block: 'center' })
        }
      }, 100)
    },
    isDeletedFunc() {
      this.hasDeleted = true
    },
    showPrivateFunc() {
      if (!this.isCreator) {
        this.displayPDF = false
        this.showBlockPrivate = true
        this.checkUserPermission()
      } else {
        this.displayPDF = true
      }
    },
    showDonotPostFunc() {
      if (!this.isCreator) {
        this.displayPDF = false
        this.showBlockDonotPost = true
      } else {
        this.displayPDF = true
      }
    },
    checkFilePrivacyOnload() {
      switch (this.file.filePrivacy) {
        case FilePrivacy.PUBLIC:
          this.displayPDF = true
          break
        case FilePrivacy.PRIVATE:
          this.showPrivateFunc()
          break
        case FilePrivacy.DO_NOT_POST:
          this.showDonotPostFunc()
          break
      }
    },
    trackSubmitTools(val) {
      this.initialFileAnnotation = val
    },
    startGeneratePdf(val) {
      this.generatePDF = val
    },
    publishFileFunction() {
      this.scrollToSignInitial()
      if (this.filteredAnnotationButton.length > 0) {
        this.$notify.error({
          title: 'Please complete all data!',
          // message: 'Kindly fill all sign and initial placeholders',
        })
        this.scrollToSignInitial()
        return
      }
      this.showPublishModal = true
    },
    showBlockPrivateFunc() {
      this.showBlockPrivate = true
    },
    showBlockDonotPostFunc() {
      this.showBlockPrivate = true
    },
    successFileFunction() {
      this.showSuccesshModal = true
      this.showPublishModal = false
    },
    checkForPrivateFile() {
      if (this.isPrivate) {
        this.showBlockPrivate = true
      }
    },
    exitFileManager(val) {
      let is_equal =
        this.file.annotaions == JSON.stringify(this.tools) ||
        JSON.stringify(this.tools) == JSON.stringify(this.initialFileAnnotation)
      if (is_equal) {
        this.nextRoute = val
        this.$nuxt.$router.push(val)
      } else this.showExitFileManager = true
    },
    confirmExistFileManager(val) {
      val ? '' : (this.nextRoute = undefined)
      if (!this.nextRoute) return
      this.$nuxt.$router.push(this.nextRoute)
    },
    _scrollToConfirm() {
      if (this.file.fileAction == FileAction.CONFIRM && !this.isCreator) {
        let pdfPage = document.querySelectorAll('.pdf-single-page-outer')

        setTimeout(() => {
          this.isBottom = true
        }, 200 * pdfPage.length)

        $('.pdf-editor-view').animate(
          { scrollTop: $('#bottom').offset().top },
          200
        )
      }
    },
    checkUserPermission() {
      this.$axios.get(`/permissions?fileId=${this.file.id}`)
        .then((response) => {
          // console.log("?????????permission", response)
        })
    },
    onloadPdfquery(val) {
      // these function contains setting the pdf container to the same width as the pdf
      // these function also checks the pdf query for query and destructure
      // after destructure get the object and append the corresponding object to the pdf as annotations
      // if(!this.$auth.user.id) return
      const { user } = this.file
      this.$store.commit('SET_PDF_EXIT', false)
      this._setPdfToolBarCompanyName()
      // this.checkFilePrivacyOnload()

      this._scrollToConfirm()

      this._setToolsFromFileAnnotations()


      let { width, height } = val
      this.pdfContainerDimension = val
      this.setContainerPage = width
      this.setContainerPdfHeight = height

      this.pdfLoading = false

      this.blockAnnotationRender = true

      //scroll to sign or initials button
      setTimeout(() => {
        this.scrollToSignInitial()
      }, 1000)
    },
    setPageHeight(val) {
      this.pageHeight = val
    },
    nextPageHandler() {
      if (this.currentPage <= this.pdf.numPages - 1) {
        document
          .querySelectorAll('.pdf-page')
        [this.currentPage].scrollIntoView(true)
      }
    },
    _setPdfToolBarCompanyName() {
      this.$axios.get(`/users/?id=${this.file.userId}`).then((response) => {
        const company = response.data.data[0]
        this.$store.commit('SET_PDF_PAGE_NAME', {
          name:
            company.companyName || company.firstName + ' ' + company.lastName,
          route: this.file.userId,
        })
      })
    },
    prevPageHandler() {
      if (this.currentPage <= 1) return
      try {
        this.currentPage = this.currentPage - 2
        document
          .querySelectorAll('.pdf-page')
        [this.currentPage].scrollIntoView(true)
      } catch (err) { }
    },
    _setToolsFromFileAnnotations() {
      this.tools = JSON.parse(this.file.annotaions || `[]`)
      this.tools = this.tools.map((_el, index) => {
        return { ..._el, id: index + 1 }
      })
      this.initialFileAnnotation = JSON.parse(this.file.annotaions || `[]`).map(
        (_el, index) => {
          return { ..._el, id: index + 1 }
        }
      )
    },
    setScrollPage() {
      let current =
        Number(
          document.querySelector('.pdf-editor-view').scrollTop -
          (this.currentPage * this.pageGapBetween - this.pageGapBetween)
        ) / Number(document.querySelector('.pdf-page').clientHeight)

      this.currentPage = Math.floor(current) + 1
    },

    sideSetScrollPage(val) {
      this.currentPage = val
      document
        .querySelectorAll('.pdf-page')
      [this.currentPage - 1].scrollIntoView(true)
    },

    confirmDocument() {
      this.scrollToSignInitial();

      if (this.filteredAnnotationButton.length > 0) {
        this.$notify.error({
          title: 'Sign',
          message: 'Kindly fill all sign and initial placeholders',
        })
        this.scrollToSignInitial()
        return
      }
      this.showPublishModal = true
    },

    toolWrapperBeforeChecked(val) {
      if (val == undefined) return
      this.tools.map((item) => {
        return (item.isChecked = true)
      })
      this.tools[val - 1].isChecked = false
    },
    toolWrapperAfterChecked(val) {
      if (val == undefined) return
      this.tools[val - 1].isChecked = true
      // console.log('it is the outside',this.tools[val])
    },
    resetJustMounted(val) {
      this.tools[val - 1].justMounted = false
    },
    keyupHandler(event) {
      if (event.ctrlKey && eve.nt.shiftKey && event.code === 'KeyZ') {
        this.redo()
      } else if (event.ctrlKey && event.code === 'KeyZ') {
        this.undo()
      }
    },
    undo() {
      let lastId = this.stack.pop()
      if (lastId) {
        let index = this.tools.findIndex((t) => t.id == lastId)
        if (index >= 0) {
          this.undoStack.push(lastId)
          this.tools[index].isDeleted = !this.tools[index].isDeleted
        }
      }
    },
    redo() {
      let lastId = this.undoStack.pop()
      if (lastId) {
        let index = this.tools.findIndex((t) => t.id == lastId)
        if (index >= 0) {
          this.stack.push(lastId)
          this.tools[index].isDeleted = !this.tools[index].isDeleted
        }
      }
    },
    setActiveToolId(v) {
      this.activeToolId = v
    },
    onPosChange({ dx, dy, id }) {
      let index = this.tools.findIndex((t) => t.id == id)
      let type = this.tools[index].type
      if (type == this.TOOL_TYPE.line) {
        this.tools[index].x1 -= dx
        this.tools[index].x2 -= dx
        this.tools[index].y1 -= dy
        this.tools[index].y2 -= dy
      } else if (type == this.TOOL_TYPE.highlight) {
        this.tools[index].x1 -= dx
        this.tools[index].x2 -= dx
        this.tools[index].y1 -= dy
        this.tools[index].y2 -= dy
      } else if (type == this.TOOL_TYPE.draw) {
        this.tools[index].points = this.tools[index].points.map((p, i) =>
          i % 2 == 0 ? p - dx : p - dy
        )
      } else {
        this.tools[index].left -= dx
        this.tools[index].top -= dy
      }
    },
    handleIncrease(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      let tool = this.tools[index]
      if (
        tool.type == this.TOOL_TYPE.text ||
        tool.type == this.TOOL_TYPE.date ||
        tool.type == this.TOOL_TYPE.name
        // ||
        // tool.type == this.TOOL_TYPE.initial
      ) {
        let fontSize = tool.fontSize || 12
        this.tools[index].fontSize = ++fontSize
      } else if (
        tool.type == this.TOOL_TYPE.tick ||
        tool.type == this.TOOL_TYPE.cross ||
        tool.type == this.TOOL_TYPE.dot ||
        tool.type == this.TOOL_TYPE.circle ||
        tool.type == this.TOOL_TYPE.signature ||
        tool.type == this.TOOL_TYPE.star ||
        tool.type == this.TOOL_TYPE.initial
      ) {
        let scale = tool.scale || 1
        scale += 0.1
        this.tools[index].scale = scale
      }
      this.$forceUpdate()
    },
    handleDecrease(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      let tool = this.tools[index]
      if (
        tool.type == this.TOOL_TYPE.text ||
        tool.type == this.TOOL_TYPE.date ||
        tool.type == this.TOOL_TYPE.name
      ) {
        let fontSize = tool.fontSize || 12
        this.tools[index].fontSize = --fontSize
      } else if (
        tool.type == this.TOOL_TYPE.tick ||
        tool.type == this.TOOL_TYPE.cross ||
        tool.type == this.TOOL_TYPE.dot ||
        tool.type == this.TOOL_TYPE.circle ||
        tool.type == this.TOOL_TYPE.signature ||
        tool.type == this.TOOL_TYPE.initial ||
        tool.type == this.TOOL_TYPE.star
      ) {
        let scale = tool.scale || 1
        scale -= 0.1
        this.tools[index].scale = scale
      }
      this.$forceUpdate()
    },
    fillteredTools(pageNumber) {
      return this.tools.filter(
        (t) => !t.isDeleted && t.pageNumber == pageNumber
      )
    },
    async downloadPdfToLocal(source, name) {
      const arrayBuffer = await fetch(source)
      const blob = await arrayBuffer.blob()
      const url = URL.createObjectURL(blob)

      const anchorElement = document.createElement('a')
      anchorElement.href = url
      anchorElement.download = `Papeerdaz-file-${Date.now()}--${name}`
      anchorElement.target = '_blank'

      anchorElement.click()
      anchorElement.remove()
      URL.revokeObjectURL(url)
    },

    async downloadPdf() {
      await htmlToImage
        .toPng(document.querySelector('#sai'))
        .then(function (dataUrl) {
          // console.log('hwmlhtmlhtmlhtml', dataUrl)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
      // let newSaveData = ExtractFormPdf(this.file.downloadLink)[0]
      // await this.$axios
      //   .$post(`/pdf-generator`, { ...newSaveData })
      //   .then((response) => {
      //     this.downloadPdfToLocal(response.downloadLink, response.fileName)
      //   })
      //   .catch((err) => {
      //     ;(async () => {
      //     await this.$notify.error({
      //     title: 'File',
      //     message: 'Error Downloading file',
      //     })
      //     })()
      //   })
      // this.selectedToolId = null
      // this.activeToolId = null
      // let options = {
      //   // pagebreak: { after: '.pdf-single-page-outer' },
      //   image: { type: 'jpeg', quality: 1.0 },
      //   margin: [0, 0, 0, 0],
      //   html2canvas: { scale: 2 },
      //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      // }
      // let prevScale = this.scale
      // this.scale = 1
      // this.downloadingPdf = true
      // await this.$nextTick()
      // let elements = Array.from(this.$refs['pdf-single-pages-outer'].children)
      // let worker = html2pdf()
      //   .set(options)
      //   .from(elements[0])
      //   .toContainer()
      //   .toCanvas()
      //   .toPdf()

      // if (elements.length > 1) {
      //   elements.slice(1).forEach((element) => {
      //     worker = worker
      //       .get('pdf')
      //       .then((pdf) => pdf.addPage())
      //       .set(options)
      //       .from(element)
      //       .toContainer()
      //       .toCanvas()
      //       .toPdf()
      //   })
      // }

      // await worker.save()
      // this.scale = prevScale
      // this.downloadingPdf = false
    },
    async deleteTool(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      this.selectedToolId = null
      this.activeToolId = null
      // this.tools.splice(index, 1)
      // this.$forceUpdate()
      this.stack.push(id)
      this.tools[index].isDeleted = true
      await this.$nextTick()
      this.$forceUpdate()
    },
    async handlePanning(
      event,
      id = undefined,
      direction = undefined,
      pageNumber
    ) {
      var elem = this.$refs['pdf-single-pages-outer']

      if (!this.isPanning && id == undefined) {
        this.isPanning = true
        this.lastPosX = elem.offsetLeft
        this.lastPosY = elem.offsetTop
        if (this.selectedToolType == this.TOOL_TYPE.line) {
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        }
      } else if (id != undefined && this.selectedToolId != id) {
        let index = this.tools.findIndex((t) => t.id == id)
        this.selectedToolId = id
        this.selectedToolType = this.tools[index].type
      }

      var posX = event.deltaX + this.lastPosX
      var posY = event.deltaY + this.lastPosY

      const getPointPos = () => {
        let parent = this.$refs[`pdf-single-page-outer-${pageNumber}`]

        if (Array.isArray(parent)) parent = parent[0]
        let { x, y } = this.pointerPos(event.srcEvent, parent)

        if (y < 0) y = 0
        if (y > elem.clientHeight) x = elem.clientHeight
        if (x < 0) x = 0
        if (x > elem.clientWidth) x = elem.clientWidth

        return { x, y }
      }

      let index = this.tools.findIndex((t) => t.id == this.selectedToolId)
      if (this.selectedToolType == this.TOOL_TYPE.line) {
        let { x, y } = getPointPos()
        if (direction && direction == this.TOOL_DIRECTION.left) {
          this.tools[index].x1 = x
          this.tools[index].y1 = y
        } else {
          this.tools[index].x2 = x
          this.tools[index].y2 = y
        }
        this.$forceUpdate()
      } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
        let { x, y } = getPointPos()
        if (direction && direction == this.TOOL_DIRECTION.left) {
          this.tools[index].x1 = x
        } else {
          this.tools[index].x2 = x
        }
        this.tools[index].y2 = this.tools[index].y1 + 15
        this.$forceUpdate()
      } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
        let { x, y } = getPointPos()
        this.tools[index].points = this.tools[index].points.concat([x, y])
        this.$forceUpdate()
      }

      if (event.isFinal) {
        this.isPanning = false
        this.lastPosX = 0
        this.lastPosY = 0
      }
    },
    onMouseEnterOnPages() {
      if (window.innerWidth < 800) return
      this.showToolIdentifier = true
    },
    onMouseLeaveFromPages() {
      if (window.innerWidth < 800) return
      this.showToolIdentifier = false
    },
    onMouseMoveOnPages(event) {
      // if(window.innerWidth < 800) return
      // if(!this.selectedToolType) return
      // if(!this.showToolIdentifier) this.showToolIdentifier = true
      // let { x, y } = this.pointerPos(event, this.$refs.PagesOuter)
      // this.toolIdentifierPosition.top = y - this.TOOL_THRESHOLD[this.selectedToolType].identifier.top
      // this.toolIdentifierPosition.left = x - this.TOOL_THRESHOLD[this.selectedToolType].identifier.left
    },
    onToolChange(type) {
      console.log('type>>', type);
      this.selectedToolType = type
    },
    pointerPos(event, parent) {
      // console.log('cancle-obj', event.currentTarget.parentElement)
      const elParent =
        parent ||
        event.currentTarget.parentElement ||
        this.$refs.scrollingElement

      event = event || window.event

      const scrollingElement =
        parent ||
        this.$refs.scrollingElement ||
        document.scrollingElement ||
        document.body

      const boundingRect = scrollingElement.getBoundingClientRect()

      //if there is no clientX or there is no clientY on event
      // return 0, 0
      if (!(event.clientX && event.clientY)) return { x: 0, y: 0 }

      // cursor relative to the scrollingElement
      const mouseXRelativeToScrollingElement =
        event.clientX - (boundingRect.left || 0)
      const mouseYRelativeToScrollingElement =
        event.clientY - (boundingRect.top || 0)

      const x =
        mouseXRelativeToScrollingElement + (scrollingElement.scrollLeft || 0)
      const y =
        mouseYRelativeToScrollingElement + (scrollingElement.scrollTop || 0)
      return { x: x / this.scale, y: y / this.scale }
    },
    previousPointerPos(event, parent) {
      let eventDoc, doc, body
      event = event || window.event
      let x = 0
      let y = 0
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document
        doc = eventDoc.documentElement
        body = eventDoc.body

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0)
      }

      x = event.pageX
      y = event.pageY - 70

      if (parent) {
        x = x - parent.offsetLeft
        y = y - parent.offsetTop
      }

      let pdfEditorView = document.querySelector('.pdf-editor-view')

      if (pdfEditorView) {
        x += pdfEditorView.scrollLeft
        y += pdfEditorView.scrollTop
      }

      return { x, y }
    },
    onCLickSinglePageOuter(event, pageNumber) {
      if (
        !this.selectedToolType ||
        this.selectedToolType == this.TOOL_TYPE.line ||
        this.selectedToolType == this.TOOL_TYPE.highlight ||
        this.selectedToolType == this.TOOL_TYPE.draw
      )
        return
      this.placeTool(event, pageNumber)

      if (
        !(
          this.selectedToolType == this.TOOL_TYPE.line ||
          this.selectedToolType == this.TOOL_TYPE.highlight ||
          this.selectedToolType == this.TOOL_TYPE.draw
        )
      ) {
        this.onToolChange(null)
      }
      // alert(this.selectedToolType)
    },
    placeTool(e, pageNumber, initialPoint) {
      let parent = this.$refs[`pdf-single-page-outer-${pageNumber}`]
      if (Array.isArray(parent)) parent = parent[0]

      let { x, y } = !initialPoint
        ? this.pointerPos(e, parent || this.$refs.PagesOuter)
        : initialPoint
      this.toolId = this.tools.length
      let obj = {
        type: this.TOOL_TYPE[this.selectedToolType],
        top: y - this.TOOL_THRESHOLD[this.selectedToolType].tool.top,
        left: x - this.TOOL_THRESHOLD[this.selectedToolType].tool.left,
        isDeleted: false,
        id: ++this.toolId,
        pageNumber,
        isChecked: true,
        user: this.$auth?.user?.id,
        justMounted: true,
      }
      if (this.selectedToolType == this.TOOL_TYPE.line) {
        obj.x1 = obj.left
        obj.y1 = obj.top
        delete obj.left
        delete obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
        obj.x1 = obj.left
        obj.y1 = obj.top
        delete obj.left
        delete obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
        obj.points = [obj.left, obj.top]
      } else if (this.selectedToolType == this.TOOL_TYPE.date) {
        obj.value = moment().format('YYYY-MM-DD')
      } else if (this.selectedToolType == this.TOOL_TYPE.signature) {
        obj.value = this.signature
      } else if (this.selectedToolType == this.TOOL_TYPE.initial) {
        obj.value = this.initial
      } else if (this.selectedToolType == this.TOOL_TYPE.appendSignature) {
        obj.x1 = obj.left
        obj.y1 = obj.top
      }
      this.tools.push(obj)
      this.stack.push(this.toolId)
    },
    async handleScale() {
      await this.$nextTick()
      let scrollingElem = this.$refs.scrollingElement
      let pagesOuter = this.$refs.PagesOuter
      if (scrollingElem && pagesOuter) {
        let s = scrollingElem.clientWidth / pagesOuter.clientWidth
        if (s != this.scale) {
          this.scale = s
          this.$forceUpdate()
        }
      }
    },
    async fetchPdf() {
      this.$store.commit('SET_LOADED_PDF', this.file)
      // let res = await fetch(demoPdf)
      let res = await fetch(this.file.downloadLink).catch((error) => {
        this.$notify.error({
          title: 'Pdf',
          message: error.message || 'Unable to fetch pdf, check connection',
        })
        if (this.keepErrorCount < 2) {
          this.fetchPdf()
          this.keepErrorCount = this.keepErrorCount + 1
        }
      })

      if (!res) return
      let blob = await res.blob()
      let pdfAsDataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })

      let pdfAsArray = this.convertDataURIToBinary(pdfAsDataUri)
      let doc = pdfJs.getDocument(pdfAsArray)
      this.pdf = await doc.promise
      this.propsNumPages = this.pdf._pdfInfo.numPages
    },
    convertDataURIToBinary(dataURI) {
      let BASE64_MARKER = ';base64,'
      var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
      var base64 = dataURI.substring(base64Index)
      var raw = window.atob(base64)
      var rawLength = raw.length
      var array = new Uint8Array(new ArrayBuffer(rawLength))

      for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i)
      }

      return array
    },
  },
  watch: {
    setContainerPage: function () {
      this.$refs.PagesOuter.style.width = this.setContainerPage + 'px'
    },
    '$auth.user': function () {
      this.checkFilePrivacyOnload()
    },
    pdf(v) {
      this.handleScale()
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.pdfExit == true) {
      return next(true)
    }
    if (!this.displayPDF) {
      return next(true)
    }
    if (this.isCreator) {
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    } else {
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    }
  },
})
</script>

<style lang="scss" scoped>
.pdf-editor-view {
  background-color: #e9e9e9;

  .pdf-pages-outer {
    width: 100%;
    position: relative;
    max-width: 800px;
  }
}

#pdf-page-vue {
  background: #e0e0e0;
}

.custom-scrollbar {

  /* Handle */
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-500 bg-opacity-30;
    border-radius: 3px;

    &:hover {
      @apply bg-gray-700 bg-opacity-100 cursor-pointer;
    }
  }
}
</style>
