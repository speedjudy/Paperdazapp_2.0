<template>
  <div id="pdf-layout" class="relative bg-[#E0E0E0] min-h-screen">
    <PdfNavbar
      class="sticky top-0 justify-self-stretch z-50"
      :title="$store.state.pdfPageName || ''"
      :compact="true"
    />
 
    <Nuxt />
  </div>
</template>

<script lang="js">
import Vue from 'vue'
import DashboardNavbar from '~/components/navbars/DashboardNavbar.vue'
import login from '~/mixins/login'
import mixins from 'vue-typed-mixins'
import PdfNavbar from '~/components/navbars/PdfNavbar.vue'

export default mixins(login).extend({
  components: { DashboardNavbar, PdfNavbar },
  name: 'PdfLayout',
  created() {
    //@ts-ignore
    this.filterUsers()
  },
})
</script>

<style scoped lang="scss">
#pdf-layout {
  height: var(--viewport-height, 100vh);
  min-height: var(--viewport-height, 100vh);
  max-height: var(--viewport-height, 100vh);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  // grid-template-rows: 1fr;
  /* // grid-template-rows: 1fr; */
  grid-template-rows: max-content 1fr;
}
</style>
