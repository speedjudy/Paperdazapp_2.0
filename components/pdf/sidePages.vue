<template>
  <div 
  class="text-sm cursor-pointer w-full p-2" ref="sideCanvasContainer"
  :class="[activePage ? 'box-shadow' : '']"
  >
    <canvas ref="sideCanvas"></canvas>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'side-pages-pdf',
  props: {
    pdf: {
      type: Object,
    },
    slideDimentions: {
      type: Object,
    },
    pageNum: {
      type: Number,
    },
    activePage:{
      type:Boolean
    }
  },
  methods: {
    async getPdfPages() {


      await this.pdf.getPage(this.pageNum).then((page) => {
        let canvas = this.$refs.sideCanvas
        let ctx = canvas.getContext('2d')
        let viewport = page.getViewport({ scale: 0.30 })

       // --setting the canvas width and height--
        canvas.width = 180
        canvas.height = 300
        canvas.style.width = '100%'
        canvas.style.height = '100%'

      // --Rendering the pdf to the canvas
        page.render({
          canvasContext: ctx,
          viewport: viewport,
        })
      })
    },
  },
  mounted() {
    this.getPdfPages()
  },
  watch: {
    pdf: function () {
      this.getPdfPages()
    },
  },
}
</script>

<style scoped>
  .box-shadow{
    @apply border-[5px] border-paperdazgreen-400;
    transition: 0.2s;
  }
</style>
