<template>
  <section>
    <div
      class="bg-white mt-4 rounded-xl font-family"
      v-if="userContent.folder.length > 0"
    >
      <!-- begin of file search -->
      <h3
        class="flex flex-wrap w-full items-center border-b-[1.5px] border-paperdazgray-200 py-2"
      >
        <div class="name-container">Files</div>
        <div class="search-container">
          <input
            type="text"
            ref="searchInput"
            placeholder="search files..."
            class="folder-search"
            :class="[show ? 'left-roll' : 'no-roll']"
          />
          <button @click="filterList" class="search-icon">
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
      <!-- end of file search -->

      <!-- srart: folder content -->
      <div
        v-show="flipContainer"
        class="flex flex-wrap justify-center pl-3 max-h-[200px] overflow-y-scroll"
      >
        <div
          v-for="(folder, index) in contentDisplay"
          :key="folder.id"
          class="folder-box-container"
        >
          <img class="w-4" src="@/assets/recent-icons/PAPERDAZ-pro.svg" />
          <label class="text-[0.85rem] font-[400] pl-2 truncate">{{
            folder.foldername
          }}</label>
          <div class="icon-container">
            <!-- <FolderPlusIcon/> -->
            <button>
              <img
                class="w-[1.15em]"
                src="@/assets/recent-icons/shareGrayIcon.svg"
              />
            </button>
            <button>
              <HeartOutlineIcon style="fill: rgb(158 158 158);" />
            </button>
            <button>
              <ShareOutlineIcon style="fill: rgb(158 158 158);" />
            </button>
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

export default {
  name: 'rofile-folder',
  components: {
    SearchIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    EmptyFileFolder,
    ArrowDownIcon,
  },
  data() {
    return {
      flipContainer: true,
      contentDisplay: [],
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
            id: 3,
            foldername: 'Crazy-folder',
            totalfiles: 102,
          },
          {
            id: 4,
            foldername: 'program-Men',
            totalfiles: 102,
          },
          {
            id: 5,
            foldername: 'Spatacus',
            totalfiles: 102,
          },
          {
            id: 6,
            foldername: 'badz-bois',
            totalfiles: 102,
          },
        ],
      },
    }
  },
  mounted() {
    this.contentDisplay = [...this.userContent.folder]
  },
  methods: {
    filterList() {
      let { folder } = this.userContent
      let searchInput = this.$refs.searchInput.value.toLowerCase()
      if (typeof folder == 'object' && folder.length > 0) {
        //code to filter files base on user input
        this.contentDisplay = folder.filter((e) =>
          e.foldername.toLowerCase().includes(searchInput)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.font-family {
  font-family: inherit;
}
.folder-search {
  @apply py-[6px] px-2 text-[13px] border-[1.3px] border-paperdazgray-200 w-[160px] rounded-md;
}
.search-container {
  @apply flex w-8/12 justify-end pr-3 items-center;
}
.name-container {
  @apply flex truncate w-4/12 justify-start pl-4 text-[17px] font-bold truncate text-paperdazgreen-500;
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
  @apply w-full border-b-[1.5px] py-2 border-paperdazgray-200 flex items-center;
  label {
    width: calc(100% - 16px - 90px);
  }
}
.icon-container {
  @apply flex;
  button {
    @apply w-[30px] flex justify-center;
  }
}
.arrow-icon {
  @apply rotate-180;
}
</style>
