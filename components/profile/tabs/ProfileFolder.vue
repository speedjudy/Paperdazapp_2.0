<template>
  <section>
    <div
      class="bg-white mt-3 rounded-xl font-family"
      v-if="userContent.folder.length > 0"
    >
      <!-- begin of folder search -->
      <h3
        class="flex flex-wrap w-full items-center border-b-[1.5px] border-paperdazgray-200 py-2"
      >
        <div class="name-container">Folders</div>
        <div class="search-container">
          <input
            type="text"
            ref="searchFolder"
            placeholder="search folder..."
            class="folder-search"
            :class="[show ? 'left-roll' : 'no-roll']"
          />
          <button class="search-icon" @click="filterList">
            <search-icon currentcolor="white" width="16" height="16" />
          </button>
          <button class="arrow-icon" @click="flipContainer = !flipContainer">
            <ArrowDownIcon
              width="16"
              height="16"
              :class="[
                flipContainer ? 'rotate-0 transition' : 'rotate-180 transition',
              ]"
            />
          </button>
        </div>
      </h3>
      <!-- end of folder search -->

        
      <!-- srart: folder content -->
      <div
        v-show="flipContainer"
        class="flex flex-wrap justify-center pl-3 max-h-[120px] overflow-y-scroll"
      >
        <div
          v-for="(folder, index) in contentFolder"
          :key="folder.id"
          class="folder-box-container"
        >
          <img class="w-5" src="@/assets/recent-icons/OpenedFolder.svg" />
          <label class="text-[0.88rem] font-[500] pl-2">
            <nuxt-link :to="'../profile-folder/' + folder.foldername">{{
              folder.foldername
            }}</nuxt-link>
          </label>
        </div>
      </div>
      <!-- end: of folder content -->
    </div>
  </section>
</template>

<script>
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import ScribbleIcon from '~/components/svg-icons/ScribbleIcon.vue'
import FolderIcon from '~/components/svg-icons/FolderIcon.vue'
import FolderSolidIcon from '~/components/svg-icons/FolderSolidIcon.vue'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import EmptyFileFolder from './emptyFileFolder.vue'

export default {
  name: 'rofile-folder',
  components: {
    SearchIcon,
    FolderIcon,
    ScribbleIcon,
    FolderSolidIcon,
    ArrowDownIcon,
    EmptyFileFolder,
  },
  data() {
    return {
      flipContainer: true,
      contentFolder: [],
      show: false,
      userContent: {
        folder: [
          {
            id: 1,
            foldername: 'azudi-folder',
            totalfiles: 102,
          },
          {
            id: 2,
            foldername: 'Jayz-branch',
            totalfiles: 102,
          },
          {
            id: 1,
            foldername: 'Crazy-folder',
            totalfiles: 102,
          },
          {
            id: 1,
            foldername: 'program-Men',
            totalfiles: 102,
          },
        ],
      },
    }
  },

  mounted() {
    this.contentFolder = [...this.userContent.folder]
  },
  methods: {
    filterList() {
      let { folder } = this.userContent
      let searchFolder = this.$refs.searchFolder.value.toLowerCase()
      if (typeof folder == 'object' && folder.length > 0) {
        //code to filter files base on user input
        this.contentFolder = folder.filter((e) =>
        e.foldername.toLowerCase().includes(searchFolder)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-search {
  @apply py-[6px] px-2 text-[13px] border-[1.3px] border-paperdazgray-200 w-[170px] rounded-md;
}
.search-container {
  @apply flex w-8/12 justify-end pr-3 items-center;
}
.name-container {
  @apply flex w-4/12 justify-start pl-4 text-[17px] truncate font-bold text-paperdazgreen-500;
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
  @apply w-full border-b-[1.5px] py-2 border-paperdazgray-200 flex;
}
.font-family {
  font-family: inherit;
}
.arrow-icon {
  @apply rotate-180;
}
</style>
