<template>
  <div class="tool">
   <svg 
   ref="circlebox"
   :style="style" version="1.1" :scale="scale" viewBox="0 0 20 20" fill="black">
   <path
    :svgToImage="svgToImageData"
    options="fill" d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z" id="Shape"/>
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
      await htmlToImage.toPng(this.$refs.circlebox)
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
