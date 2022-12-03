<template>
  <div
    class="landing-page-search-modal custom-scrollbar py-5 z-50"
    :class="{ visible: visible }"
  >
    <button class="overlay" @click="$emit('input', false)"></button>
    <section class="container">
      <form class="relative text-xs" @submit.prevent="submit">
        <input
          type="text"
          class="search-input"
          placeholder="Search by file name or company name or papertag..."
          @input="queryString = $event.target.value"
          :value="queryString"
        />
        <button
          class="bg-paperdazgreen-400 rounded-lg text-white h-full w-10 grid place-items-center absolute right-0 top-0"
        >
          <search-white-icon height="18" width="18" class="" />
        </button>
      </form>

      <div
        class="mt-4 bg-white rounded-lg whitespace-nowrap overflow-hidden transition transform duration-200"
        :class="[
          this.queryString
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-[5%] pointer-events-none',
        ]"
      >
        <!-- <div
          v-if="this.queryString"
          class="px-4 flex h-12 text-sm border-b border-gray-100 font-medium"
        > -->
          <!-- <button
            class="tab-button"
            :class="{ active: key == activeTab }"
            v-for="key in Object.keys(searchResult || {})"
            :key="key"
            type="button"
            @click="activeTab = key"
          >
            {{ key }} ({{ searchResult[key].total }})
          </button> -->
          <!-- <h4
            class="tab-button"
            v-for="key in Object.keys(searchResult || {})"
            :key="key"
            :class="{ active: key == activeTab }"
          >
            {{ key }} ({{ searchResult[key].total }})
          </h4> -->
        <!-- </div> -->
        <div
          class="max-h-[70vh] custom-scrollbar overflow-y-auto p-4"
          v-loading="(loadingArray || []).length > 0"
        >
          <div
            class="grid place-items-center min-h-[30vh]"
            v-if="displayingResults.length <= 0"
          >
            <div class="text-center">
              <h2 class="capitalize font-medium text-xl">
                {{ activeTab }} search
              </h2>
              <p class="text-sm">Does not match any records.</p>
            </div>
          </div>
          <component
            v-else
            :is="searchStripComponent"
            v-for="record in displayingResults.data"
            :key="record.id"
            :record="record"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'

import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import SearchWhiteIcon from '../svg-icons/SearchWhiteIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import FileSearchStrip from '../search-strips/FileSearchStrip.vue'
import UserSearchStripVue from '../search-strips/UserSearchStrip.vue'
import CompanySearchStripVue from '../search-strips/CompanySearchStrip.vue'

export default Vue.extend({
  components: {
    SearchWhiteIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    FileSearchStrip,
  },
  name: 'LandingPageSearchModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'visible',
    event: 'input',
  },
  data() {
    return {
      queryString: '',
      activeTab: '',
      fileSearchStrip:[],
      searchResult: {}, //as { [key: string]: Array<any> }
      loadingArray: [] , //as Array<boolean>
      tabs:{
        file:'files',
        companies:'companies',
        users:'users'
      }
    }
  },
  created() {
    this.remoteSearch = _.debounce(this.remoteSearch, 200) 
  },
  computed: {
    displayingResults(){
      return (this.searchResult || {})[this.activeTab] || []
    },
    searchStripComponent() {
      switch (String(this.activeTab).toLowerCase()) {
        case 'companies':
          return CompanySearchStripVue
        case 'users':
          return UserSearchStripVue
        case 'files':
          return FileSearchStrip
      }
    },
  },
  methods: {
    submit(event) {
      event.preventDefault()
    },
    remoteSearch() {
      // this.loadingArray.push(true)
      let files = this.$axios.$get(`/files?$sort[createdAt]=-1&filePrivacy[$ne]=doNotPost&fileName[$like]=${this.queryString}%`,{
        params:{
          isEditing: 0
        }
      })
      let company = this.$axios.$get(`/users?$sort[createdAt]=-1&role=paid_user&companyName[$like]=${this.queryString}%`)
      let user = this.$axios.$get(`/users?firstName[$like]=${this.queryString}%`)
      
      let displayFormat = {}

      Promise.all([files, company, user])
      .then((response)=>{
          displayFormat.files = response[0]
          console.log(response[0]);
          // displayFormat.companies = response[1]
          // displayFormat.users = response[2]
         this.searchResult = displayFormat;

         if (!this.activeTab)
         this.activeTab = Object.keys(this.tabs || {}).length
          ? Object.values(this.tabs || {})[0]
          : ''
     
      })
        // .then((response) => {
        //   const temp = response
        //   if (this.queryString) {
        //     this.searchResult = response
        //   } else {
        //     for (const key in temp) {
        //       temp[key] = []
        //     }
        //     this.searchResult = temp
        //   }

        //   if (!this.activeTab)
        //     this.activeTab = Object.keys(this.tabs || {}).length
        //       ? Object.keys(this.tabs || {})[0]
        //       : ''
        // })
        // .catch((error) => {
        //   debugger
     
    },
  },
  watch: {
    visible() {
      this.queryString = ''
    },
    queryString: {
      immediate: true,
      handler() {
        this.remoteSearch()
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.landing-page-search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: var(--viewport-height, 100vh);
  max-height: var(--viewport-height, 100vh);
  overflow-y: auto;
  z-index: 50;

  transition: opacity ease-in-out 0.2s;
  opacity: 0;
  pointer-events: none;
  // display: none;

  &.visible {
    opacity: 1;
    pointer-events: all;
    // display: block;
  }

  & .overlay {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    z-index: 0;
  }
}

.container {
  max-width: 636px !important;
}

.search-input {
  @apply h-10 bg-white shadow rounded-[15px] w-full  pl-2 pr-14;
}

.tab-button {
  @apply transition duration-200 ease-in-out capitalize flex-1 h-full flex items-center justify-center border-b-2 border-transparent hover:border-paperdazgreen-400/50;
  &.active {
    @apply border-paperdazgreen-400 text-paperdazgreen-400;
  }
}
</style>
