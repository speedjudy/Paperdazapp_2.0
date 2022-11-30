<template>
    <div class="cookie-container p-2"
    v-if="showCookieDisplay"
    >
         <div class="w-full max-w-[400px] p-2 px-3 shadow-lg bg-white h-[200px] relative rounded-md">
         <button class="absolute top-3 right-4 font-semibold"
            @click="cancleCookieDisplay"
            >&#x2715</button>
           <p class="text-[13px] mt-8">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos iure ullam ut est repellendus facere ratione itaque illo ab? Saepe modi eos itaque quisquam fugiat eligendi a magnam blanditiis quasi.</p>
           <div class="footer-button">
            
             <button class="text-[13.5px] w-auto py-1 px-2 text-white mr-4 bg-red-600 rounded mt-2"
             @click="cancleCookieDisplay"
             >Decline</button>
            
             <button class="text-[13.5px] w-auto py-1 px-2 text-white bg-paperdazgreen-400 rounded mt-2"
             @click="cancleCookieDisplay"
             >Accept</button>
           </div>
         </div>
    </div>
</template>

<script>
    export default {
       name:"cookiedisplay",
       data() {
        return {
            showCookieDisplay:true
        }
       },
       methods:{
        cancleCookieDisplay(){
          this.showCookieDisplay = false;

        }
       } 
    }
</script>

<style scoped>
   .footer-button{
    @apply w-full p-1 flex justify-center border-t-[1px] border-paperdazgray-400/50 mt-2;
   }
   .cookie-container{
    @apply fixed bottom-0 left-0 w-full h-full bg-black/20 flex justify-center z-50 items-center
   }
</style>