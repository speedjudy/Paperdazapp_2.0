<template>
  <div
    id="landing-layout"
    class="relative bg-[#e4f3e0] flex flex-col min-h-screen"
  >
    <app-bar />
    <main
      class="flex-1 flex flex-col bg-paperdazgreen-400"
      style="background: linear-gradient(180deg, #e4f3e0 0%, #ffffff 36.13%)"
    >
    <div class="w-full grid place-items-center justify-center py-12">
      <div class="flex flex-wrap justify-center">
       <img src="@/assets/recent-icons/undraw_waiting__for_you_ldha.svg" class="w-60">
       <h1 class="w-full text-center text-[4em] font-[900] display-text"
       v-if="error.statusCode == 404"
       >{{error.statusCode}}</h1>
          <h3  class="w-full text-center text-[3em] font-[900] text-paperdazgray-400"
          v-else
          >
           Error Occured
          </h3>

       <p class="text-center sm:w-[400px] w-[90%] text-[15px]">
        <span v-if="error.statusCode == 404"> We couldn`t find the page you are looking for</span>
        <span  v-else-if="error.statusCode >= 500">Could not access these page</span>
        <span v-else>{{error.message}}</span>
       . Maybe our <b>FAQ (at top nav)</b> or community can help</p>
    </div>
       </div>
    </main>
    <app-footer />
  </div>
</template>
<script lang="js">
import Vue from 'vue'
import AppBar from '~/components/widgets/AppBar.vue'
import AppFooter from '~/components/widgets/AppFooter.vue'
export default Vue.extend({
  components: { AppBar, AppFooter },
  props: [`error`,`response`],
  layout:'error',
  mounted(){
    console.log(this.error)
  }
})
</script>

<style>
   
   .display-text{
       -webkit-text-fill-color: transparent;
       -webkit-text-stroke: none;
       -webkit-text-clip: text;
       animation:4s linear infinite reverse flow-out;background-size:200%;background-position:left;
       background-image: linear-gradient(30deg,rgb(122, 206, 96) 43%,white 45%, white 45.5%, rgb(158 158 158) 47%);
        animation-direction:alternate;
        background-clip:text;-webkit-background-clip:text;
        color:transparent
   }
   @keyframes flow-out {
      from{
        background-position:left
      }
      to{
        background-position:right
      }
   }
</style>
