<template>
  <div class="pdf-page" ref="PdfPage">
    <div class="annotationLayer" ref="annotationLayer"></div>
    <canvas v-hammer:pan="(ev) => handlePanning(ev, undefined, undefined, pageNumber)"
      @click="e => onCLickSinglePageOuter(e, pageNumber)" @mousemove="onMouseMoveOnPages"
      @mouseleave="onMouseLeaveFromPages" ref="canvas" class="pdf-canvas"></canvas>
  </div>
</template>

<script>
import * as PDFJS from "pdfjs-dist"
import "pdfjs-dist/web/pdf_viewer.css"
import FileAction from '~/models/FileAction'

export default {
  props: {
    scale: Number,
    pageNumber: Number,
    pdf: Object,
    handlePanning: Function,
    onCLickSinglePageOuter: Function,
    onMouseMoveOnPages: Function,
    onMouseLeaveFromPages: Function,
    setPageHeight: Function,
    setPageWidth: Function,
    file: Object,
  },
  data: () => ({
    scaleZ: 2,
    currentPage: 1
  }),
  mounted() {
    this.getPage();

    let pdfPage = document.getElementsByClassName("pdf-editor-view")[0];
    pdfPage.addEventListener("scroll", this.onScroll)
  },
  computed:{
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
  },
  methods: {
    async getPage() {
      this.pdf.getPage(this.pageNumber).then(page => {
        this.$store.commit('SET_PDF_OFFSET_Y', page.view[1])
        this.$store.commit('SET_PDF_OFFSET_X', page.view[0])
        // console.log("pdf_oofset_initial",this.$store.state.pdfOffset_y, this.$store.state.pdfOffset_x)
      });
      let page = await this.pdf.getPage(this.pageNumber)

      let canvas = this.$refs.canvas

      let context = canvas.getContext('2d')

      let dpr = window.devicePixelRatio || 1
      let bsr =
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      let ratio = dpr / bsr
      let originalviewport = page.getViewport({ scale: this.scaleZ })
      var viewport = page.getViewport({
        scale: this.$refs.PdfPage.clientWidth / originalviewport.width,
      })
      viewport = originalviewport
      canvas.width = viewport.width * ratio
      canvas.height = viewport.height * ratio
      this.$emit('setPageHeight', canvas.height)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      page.render({
        canvasContext: context,
        viewport: originalviewport,
      })

      this.renderAnnotation(page)
      // console.log("view-port",viewport)
      this.$emit('setPageWidth', { width: canvas.width, height: canvas.height })
    },
    async renderAnnotation(page) {
      let annotationLayer = this.$refs.annotationLayer
      let annotations = await page.getAnnotations()
      let v = page.getViewport({ scale: this.$store.state.pdfScale })
      await PDFJS.AnnotationLayer.render({
        viewport: v.clone({ dontFlip: true }),
        div: annotationLayer,
        page,
        annotations: annotations,
        renderInteractiveForms: true
      });
    },
    onScroll() {
      let pdfPage = document.getElementsByClassName("pdf-editor-view")[0];
      if (pdfPage.scrollTop + 680 > pdfPage.scrollHeight && this.isConfirm) {
        pdfPage.removeEventListener("scroll", this.onScroll)
        this.$store.commit('SET_PDF_PAGE_BOTTOM');
      }

    },
  },
}
</script>

<style lang="sass" scoped>

</style>
