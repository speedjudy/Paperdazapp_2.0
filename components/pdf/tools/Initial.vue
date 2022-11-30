<template>
  <div class="tool">
    <img
    :scaleDiff="scaleDiff"
    :src="value" alt="" v-if="value" :style="style" />
     <!-- <div class="no-signature" v-else>
      <p>No Initials</p>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    value: String,
  },
  mounted(){
     console.log(this.value)
  },
  methods: {
   
  },
  computed: {
    scaleDiff(){
      return ((this.scale || 1) * 30) - 30
    },
    style() {
      return {
        // width: `${(this.scale || 1) * 287}px`,
        // height: `${(this.scale || 1) * 60}px`,
        height: `${(this.scale || 1) * 30}px`,
        maxHeight: `${(this.scale || 1) * 30}px`,
        objectFit: 'contain',
      }
    },
  },
  watch:{
   scale:function(){
      // alert('dchdcjhlj')
   }
 }
}

</script>

<style></style>
