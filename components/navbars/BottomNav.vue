<template>
  <div id="bottom-nav" class="bg-white flex items-center text-[#606060]">
    <span class="h-full flex items-center justify-center flex-1 px-1">
      <folder-icon class="w-4 h-4" />
    </span>
    <button @click="openUserFiles" class="h-full flex items-center justify-center flex-1 px-1">
      <file-icon class="h-4" />
    </button>
    <nuxt-link to="/" class="h-full flex items-center justify-center flex-1 px-1">
      <home-icon class="h-4" />
    </nuxt-link>
    <button class="h-full flex items-center justify-center flex-1 px-1">
      <search-icon class="h-4" />
    </button>
  </div>
</template>
<script>
import Vue from 'vue'
import FileIcon from '../svg-icons/FileIcon.vue'
import FolderIcon from '../svg-icons/FolderIcon.vue'
import HomeIcon from '../svg-icons/HomeIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import AuthUser from '~/models/AuthUser'

export default Vue.extend({
  name: 'BottomNav',
  components: { FolderIcon, FileIcon, HomeIcon, SearchIcon },
  computed:{
     user(){
        return (this.$auth.user)
     }
  },
  mounted(){
     
  },
  methods:{
    openUserFiles(){
      switch ((this.$auth.user).role) {
          case UserTypeEnum.PAID:
            this.$nuxt.$router.push("/company-files")
            return;
          case UserTypeEnum.FREE:
            this.$nuxt.$router.push("/my-files")
            return;

      }
    }
  },
})
</script>

<style scoped>
#bottom-nav {
  box-shadow: 0px -3px 14px rgb(0 0 0 / 11%);
}
</style>
