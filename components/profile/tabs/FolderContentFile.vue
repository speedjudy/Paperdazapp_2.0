<template>
  <section>
    <div
      class="bg-white mt-4 rounded-xl font-family"
    >
      <!-- begin of file search -->
      <h3
        class="flex flex-wrap w-full items-center border-b-[1.5px] border-paperdazgray-200 py-2"
      >
        <div class="name-container">
          <button class="mr-2">
            <abbr @click="$router.back()">
              <ArrowDownIcon width="16" height="16" class="rotate-90" />
            </abbr>
          </button>
          {{ header }}
        </div>

        <div class="search-container">
          <input
            type="text"
            v-model="fileSearch"
            placeholder="search files..."
            class="folder-search input-search"
            :class="[showSearch ? 'inline-block' : 'hidden']"
          />
          <button
           @click="showSearch = !showSearch"
           class="search-icon">
            <search-icon currentcolor="white" width="16" height="16" />
          </button>
        </div>
      </h3>
      <!-- end of file search -->

      <!-- srart: folder content -->
        <div
          class="flex justify-center items-center h-[240px]"
          v-if="isEmpty"
        >
          <span class="text-[17px] text-paperdazgrey-300 font-semibold"
            >No company`s files</span>
        </div>
        <div
          v-for="(file, index) in contentDisplay"
          :key="file"
          class="folder-box-container justify-between"
        >
        <div class="flex items-center w-[100%] truncate">
          <img class="w-5 ml-3" src="@/assets/recent-icons/PAPERDAZ-pro.svg" />
          <label class="text-[0.90rem] font-[400] pl-2 w-full white-space">
            <nuxt-link :to="`/pdf/${file.paperLink}`">
            {{ file.fileName }}
            </nuxt-link>
          </label>
        </div>
        <div class="w-[60px] justify-end flex sm:mr-6">
           <ShareFileOptions :file="file" />
          </div>
        </div>
      </div>
      <!-- end: of folder content -->
    </div>


  </section>
</template>

<script>
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import EmptyFileFolder from './emptyFileFolder.vue'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import ShareFileOptions from '../components/ShareFileOptions.vue'
import { isEmpty } from 'lodash'
import mixins from 'vue-typed-mixins'
import login from '~/mixins/login'

export default mixins(login).extend({
  name: 'profile-folder',
  props: ['header', 'folderContent'],
  components: {
    SearchIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    EmptyFileFolder,
    ArrowDownIcon,
    ShareFileOptions
},
  data() {
    return {
      header: this.header,
      flipContainer: true,
      fileSearch:'',
      showSearch:false,
      contentDisplay:[],
      contentEmptyDisplay: undefined,
    }
  },
 computed:{
    isEmpty(){
      return this.contentDisplay.length < 1
    }
 },
  mounted(){},
  methods: {
    filterList() {
      // return
      let  files  = this.folderContent
      let searchInput = this.fileSearch.toLowerCase()

      if (typeof files == 'object' && files.length > 0) {
        //code to filter files base on user input
        this.contentDisplay = files.filter((e) =>
        e.fileName.toLowerCase().startsWith(searchInput)
        )
      }
    },
  },
  watch: {
    'folderContent': function () {
      // return
      console.log('subber-files',this.folderContent)
      if(this.folderContent == undefined) return
      this.contentDisplay = [...this.folderContent]
     },
    fileSearch(){
    this.filterList()
    }
  },
})
</script>

<style lang="scss" scoped>
.font-family {
  font-family: inherit;
}
.search-container {
  @apply flex w-8/12 justify-end pr-3 items-center;
}
.name-container {
  @apply flex truncate w-4/12 justify-start pl-4 text-[1.1rem] font-bold  text-paperdazgreen-500;
}
.search-icon {
  @apply w-[28px] h-[28px] bg-paperdazgreen-400 rounded-full outline-none flex border-none
        justify-center items-center mx-2;
}
::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  background-color: #77c360;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-paperdazgreen-400;
}
.folder-box-container {
  @apply w-full border-b-[1.5px] py-3 border-paperdazgray-200 flex items-center;
  label {
    width: calc(100% - 16px - 90px);
  }
}
.input-search:focus{
  border: none;
}

</style>
