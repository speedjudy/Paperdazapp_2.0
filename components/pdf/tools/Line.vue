<template>
  <svg :viewBox="viewBox" :style="style" ref="lineBox" fill="black" type="DrawLine">
    <path
      :svgToImage="svgToImageData"
      options="fill"
      :x="x1"
      :y="y1"
      :y2="y2"
      :x2="x2"
      :length="x2"
      :d="d"
      stroke-linecap="round"
      style="stroke: rgb(0, 0, 0); stroke-width: 3"
      type="DrawLine"
    ></path>
  </svg>
</template>

<script>
export default {
  props: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    tool: Object,
    id: Number,
    generatePDF: Boolean,
    showPublishModal: Boolean,
  },
  watch:{
    generatePDF: function(){
      if(this.generatePDF)
      this.svgToImage()
    },
  },
  data() {
    return {
      svgToImageData:''
    }
  },
  methods:{
    async svgToImage(){
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.lineBox)
        .then(function (dataUrl) {
          dataPAz = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        }); 

        this.svgToImageData = dataPAz
        // console.log('gggggggggggggggggg',  this.svgToImageData)
       },
      },
 
  computed: {
    style() {
      return {
        width: `${this.width + 10}px`,
      }
    },
    viewBox() {
      let x1 = this.x2 < this.x1 ? this.x2 - 3 : this.x1 - 3
      let y1 = Math.min(this.y1, this.y2) - 3
      return `${x1} ${y1} ${this.width + 10} ${this.height + 10}`
    },
    width() {
      return Math.abs(this.x2 - this.x1)
    },
    height() {
      return Math.abs(this.y2 - this.y1)
    },
    d() {
      let x1 = this.x1
      let y1 = this.y1
      let x2 = this.x2
      let y2 = this.y2

      return `M${x1},${y1}L${x2},${y2}`
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
