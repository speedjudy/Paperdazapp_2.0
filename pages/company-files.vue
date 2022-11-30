<template>
  <main class="">
    <top-details-card-container class="mb-5" v-model="activeTab" :tabs="tabs" />
    <leaves-details-container class="mb-9" />
    <company-file-ledger />
  </main>
</template>

<script>
import Vue from 'vue'
import CompanyFileLedger from '~/components/company-files/CompanyFileLedger.vue'
import LeavesDetailsContainer from '~/components/dashboard/LeavesDetailsContainer.vue'
import TopDetailsCardContainer from '~/components/dashboard/TopDetailsCardContainer.vue'
import DisketIconVue from '~/components/svg-icons/DisketIcon.vue'
import NoteAndPenIconVue from '~/components/svg-icons/NoteAndPenIcon.vue'
import PageIconVue from '~/components/svg-icons/PageIcon.vue'
import ShareIconVue from '~/components/svg-icons/ShareIcon.vue'
import TickCircleIconVue from '~/components/svg-icons/TickCircleIcon.vue'
import { mapState } from 'vuex'
import Paid_User from '~/mixins/Paid_User'
import StatusUser from '~/models/StatusUser'
import mixins from 'vue-typed-mixins'
import login from '~/mixins/login'

export default mixins(login).extend({
  components: {
    TopDetailsCardContainer,
    LeavesDetailsContainer,
    CompanyFileLedger,
  },
  name: 'CompanyFilesPage',
  layout: 'dashboard',
  mixins: [Paid_User],
  asyncData({ store }) {
    store.commit('SET_PAGE_NAME', { name: 'Company Files' })
  },
  
  data() {
    return {
      // ledger, confirmed, signed, saved, shared
      activeTab: 'ledger',
      tabs: [
        {
          label: 'Ledger',
          key: 'ledger',
          count: 896,
          action:'ledger',
          icon: NoteAndPenIconVue,
        },
        {
          label: 'Completed',
          key: 'completed',
          count: 25,
          action:'complete',
          icon: PageIconVue,
        },
        {
          label: 'Confirmed',
          key: 'confirmed',
          count: 25,
          action:'confirm',
          icon: TickCircleIconVue,
        },
        {
          label: 'Signed',
          key: 'signed',
          count: 25,
          action:'sign',
          icon: NoteAndPenIconVue,
        },
        {
          label: 'Saved',
          key: 'saved',
          count: 25,
          action:'save',
          icon: DisketIconVue,
        },
        {
          label: 'Shared',
          key: 'shared',
          count: 25,
          action:'share',
          icon: ShareIconVue,
        },
      ],
      showUploadDocumentModal: false,
      files:[],
    }
  },
    beforeMount(){
    if(this.$auth.user.status == StatusUser.EXPIRED){
      this.$notify.error({
      message: "Your subscription is expired, go to billing to renew"
      })
      this.$nuxt.$router.push("/dashboard")
    }
  },
})
</script>
