<template>
  <div class="small-details-card-container">
    <top-details-card
      v-for="(tab, i) in tabs"
      :key="tab.key"
      :isActive="tab.key === activeTab"
      @click.native="searchFilter(tab.key, tab.action)"
    >
      <template #icon>
        <component :is="tab.icon" />
      </template>
      <template #count>{{
        isTabAction(tab.action)
      }}</template>
      <!-- <template #count v-else>{{ originalPdfFiles.length }}</template> -->
      <template #name>{{ tab.label }}</template>
    </top-details-card>
  </div>
</template>

<script>
import Vue from 'vue'
import TopDetailsCard from './TopDetailsCard.vue'
import { mapActions, mapState } from 'vuex'
import FileAction from "~/models/FileAction"
import UserTypeEnum from '~/models/UserTypeEnum'

export default Vue.extend({
  components: { TopDetailsCard },
  props: {
    // ledger, confirmed, signed, saved, shared
    activeTab: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  model: {
    prop: 'activeTab',
    event: 'updateActiveTab',
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['originalPdfFiles']),
  },
  watch: {
    "$auth.user": function(){
      this.fetchFiles()
    }
  },
  methods: {
    async fetchFiles() {
       //---- checking the user role --- 
      let paramsId = (this.$auth.user.role == UserTypeEnum.TEAM ? this.$auth.user.teamId : this.$auth.user.id)
      
     //<------------------- START: fetching of folder ------------>>
      await this.$axios.$get(`/files/?userId=${paramsId}&$sort[updatedAt]=-1`,{
        params:{
          isEditing:0
        }
      })
        .then((response) => {
          console.log("file",response)
          const filesData = response.data.map((el) => {
            return el
          })
          this.$store.commit('ADD_USER', filesData)
        })
        .finally(() => {
          this.fileSpinner = false
        })
    },
    isTabAction(label) {
      switch ((label || '').toLowerCase()) {
      case FileAction.COMPLETE:
        return this.isFilterActions(FileAction.COMPLETE)
      case FileAction.SHARED:
        return this.isFilterActions(FileAction.SHARED)
      case FileAction.SIGNED:
        return this.isFilterActions(FileAction.SIGNED)
      case FileAction.LEDGER:
        return this.isFilterActions(FileAction.LEDGER)
      case FileAction.CONFIRM:
         return this.isFilterActions(FileAction.CONFIRM)
      case FileAction.SAVED:
         return this.isFilterActions(FileAction.SAVED)
      default:
        return ''
    }
    },
    isFilterActions(val){
      switch (val) {
        case FileAction.LEDGER:
         return  (this.originalPdfFiles || []).length
        case FileAction.SHARED:
         return  (this.originalPdfFiles || []).filter((e) => e?.shared != null).length  
        case FileAction.SAVED:
         return  (this.originalPdfFiles || []).filter((e) => e?.favourites.length > 0).length 
        default:
         return (this.originalPdfFiles || []).filter((e) => e?.fileAction == val).length 
      }
       
    },
    searchFilter(tab, label) {
      this.$emit('updateActiveTab', tab)
      console.log(this.originalPdfFiles)
      // commit to store;
      this.$store.commit('FILTER_USERs', label)
    },
  },
})
</script>
<style lang="postcss" scoped>
.small-details-card-container {
  @apply gap-3 lg:gap-4;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

  @media screen and (min-width: 425px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
