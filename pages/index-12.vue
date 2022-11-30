<template>
    <div>
       <!-- spinner before page loaded -->
      <!-- <div v-if="windowOnLoad" class="before-iframe">
        <spinner-dotted-icon height="32" width="32" class="text-paperdazgray-500 animate-spin" />
      </div>
    <iframe src="https://paperdaz-comming.netlify.app/"
      @load="windowOnLoad = false"
     class="iframe" title="coming soon page"></iframe> -->
    
    </div>
</template>

<script>
   import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'

    export default {
        auth:false,
        name:"coming-soon",
        components:{SpinnerDottedIcon},
        data() {
            return {
                windowOnLoad:true
            }
        },
    }
</script>

 <style>
   .iframe{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top:0;
    left:0;
    z-index: 10 !important;
   }
   .before-iframe{
       width: 100vw;
    height: 100vh;
    background-color: white;
    position: fixed;
    top:0;
    display:flex;
    justify-content: center;
    align-items: center;
    left:0;
    z-index: 98;
   }
 </style>