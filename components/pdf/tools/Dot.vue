<template>
  <div class="tool">
    <svg 
    ref="dotbox"
    viewBox="0 0 24 24" :style="style" fill="black">
  <path  options="dot"
    :svgToImage="svgToImageData"
    d="M 22 12 a 10 10 0 0 0 -10 -10 a 10 10 0 0 0 -10 10 a 10 10 0 0 0 10 10 a 10 10 0 0 0 10 -10"
    />
</svg>
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    generatePDF: Boolean,
  },
  computed: {
    style() {
      return {
        width: `${(this.scale || 1) * 12}px`,
        height: `${(this.scale || 1) * 12}px`,
        fill:`black`,
      }
    },
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
      await htmlToImage.toPng(this.$refs.dotbox)
        .then(function (dataUrl) {
          dataPAz = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        }); 

        this.svgToImageData = dataPAz
        // console.log('gggggggggggggggggg',  this.svgToImageData)
       },
  }
}
</script>

<style lang="scss" scoped></style>
