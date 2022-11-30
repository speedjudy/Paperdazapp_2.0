<template>
  <div class="text-field tool">
  <svg 
  ref="tickbox"
  :style="style" viewBox="0 0 20 19" fill="black" xmlns="http://www.w3.org/2000/svg">
    <path 
    :svgToImage="svgToImageData"
    options="fill" d="M7.23415 19C6.61458 19 6.02394 18.7368 5.61845 18.2763L0.51216 12.4731C-0.252486 11.6039 -0.14912 10.2957 0.743192 9.55085C1.63511 8.80517 2.97802 8.90586 3.74357 9.77552L7.08178 13.5691L17.6323 1.17605C19.2654 -1.05235 20.9748 0.181643 19.3344 2.41957L8.9652 18.132C8.5848 18.6505 7.98094 18.9697 7.32779 18.9979C7.29626 18.9992 7.26523 19 7.23415 19Z" fill="black"/>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    generatePDF: Boolean,
  },
  data() {
    return {
      svgToImageData:''
    }
  },
  watch:{
    generatePDF: function(){
      if(this.generatePDF)
      this.svgToImage()
    },
  },
  computed: {
    style() {
      return {
        width: `${(this.scale || 1) * 11}px`,
        height: `${(this.scale || 1) * 11}px`,
      }
    },
  },
  methods:{
    async svgToImage(){
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.tickbox)
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

<style lang="scss" scoped>
input {
  border: 0.5px solid #e9e9e9;
  background-color: transparent;
  border-radius: 4px;
}
</style>
