<template>
    <el-dialog
      :visible.sync="showModal"
      :appendToBody="true"
      style=""
      :showClose="false"
      center
    >
      <template #title>
        <div class="tab-container" v-show="!displayDefault">
          <button
            class="tab-button"
            v-for="tab in tabs"
            :key="tab.value"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </template>
  
      <!-- Body -->
      <div class="text-center pb-2">Draw your {{displayDefault ? 'Signature' : 'Initial'}}</div>
      <transition mode="out-in" name="fade" :duration="200">
        <div class="w-full" v-if="displayDefault" key="updating">
          <transition mode="out-in" name="fade" :duration="200">
            <component
              ref="activeTabComponent"
              @export-image="imageExported($event)"
              :is="activeTabComponent"
            />
          </transition>
        </div>
  
        <div
          key="default"
          class="border h-56 border-[#C4C4C4] rounded w-full bg-white flex justify-center items-center overflow-hidden p-4"
          v-else
        >
          <img :src="src" class="h-full w-full object-contain" />
        </div>
      </transition>
      <!-- End:: Body -->
  
      <!-- Start:: Footer section -->
      <template #footer>
        <div class="flex items-center justify-between gap-4">
          <button
            class="h-9 rounded border border-gray-100 text-xs px-5 bg-black text-white hover:shadow"
            @click="clear"
          >
            {{ displayDefault ? 'EDIT' : 'CLEAR' }}
          </button>
          <div class="flex items-center justify-end gap-4">
            <button
              class="h-9 rounded border border-gray-100 text-paperdazgreen-300 text-xs px-3 bg-white hover:shadow"
              @click="closeModal"
            >
              CANCEL
            </button>
            <button
              class="h-9 rounded border border-gray-100 bg-paperdazgreen-300 text-xs text-white px-4 hover:shadow"
              @click="exportImage"
              v-show="!displayDefault"
            >
              SAVE
            </button>
            <button
              class="h-9 rounded border border-gray-100 bg-paperdazgreen-300 text-xs text-white px-4 hover:shadow"
              @click="useDefaultImage"
              v-show="displayDefault && useDefaultButton"
            >
              USE
            </button>
          </div>
        </div>
      </template>
      <!-- End:: Footer section -->
      <!-- End:: Body -->
    </el-dialog>
  </template>
  
  <script>
  import Vue from 'vue'
  import SignatureDrawBodyTab from './pdfsignature/SignatureDrawBodyTab.vue'
  import SignatureTypeBodyTabVue from './pdfsignature/SignatureTypeBodyTab.vue'
  export default Vue.extend({
    name: 'DrawOrTypeModal',
    model: {
      prop: 'visible',
      event: 'updateVisibility',
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      src: {
        type: String,
        default:
          'https://ichef.bbci.co.uk/news/976/cpsprodpb/B9FF/production/_117751674_satan-shoes1.jpg',
      },
      useDefaultButton: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showModal: false,
        forceDisplaySrc: true,
        activeTab: 'draw',
        tabs: [
          {
            label: 'Draw',
            value: 'draw',
            component: SignatureDrawBodyTab,
          },
          {
            label: 'Type',
            value: 'type',
            component: SignatureTypeBodyTabVue,
          },
        ],
      }
    },
    watch: {
      visible(val) {
        // this.$emit("updateVisibility", val)
        this.showModal = val
        this.forceDisplaySrc = true;
      },
      showModal(val) {
        this.$emit('updateVisibility', val)
      },
    },
    mounted() {
      this.showModal = this.visible
    },
    computed: {
      displayDefault() {
        return this.forceDisplaySrc && !!this.src
      },
      activeTabComponent() {
        const activeTab = this.tabs.find((el) => el.value === this.activeTab)
  
        if (activeTab && activeTab.component) {
          return activeTab.component
        }
  
        return {
          render(h) {
            return h('h1', 'Not Implemented')
          },
        }
      },
    },
    methods: {
      async useDefaultImage() {
        if (!this.displayDefault) return
  
        console.log('using the default image')
        ;(async () => {
          const response = await fetch(this.src)
          const imageBlob = await response.blob()
          const reader = new FileReader()
          reader.readAsDataURL(imageBlob)
          reader.onloadend = () => {
            const base64data = reader.result
            this.imageExported(base64data)
          }
        })()
      },
      closeModal() {
        this.$emit('updateVisibility', false)
      },
  
      clear() {
        if (this.displayDefault) {
          this.forceDisplaySrc = false
          return
        }
  
        const activeTabComponent = this.$refs.activeTabComponent 
  
        if (!activeTabComponent) return
        activeTabComponent.clear()
      },
  
      exportImage() {
        const activeTabComponent = this.$refs.activeTabComponent 
  
        if (!activeTabComponent) return
        activeTabComponent.exportImage()
      },
      imageExported(image) {
        if (!image) return
        this.$emit('image-exported', image)
        this.closeModal()
      },
    },
  })
  </script>
  
  <style scoped>
  * >>> .el-dialog {
    width: 500px !important;
    max-width: 95% !important;
    border-radius: 20px !important;
    border-radius: 8px !important;
    position: relative !important;
    overflow: hidden;
    background: #f6f6f6;
  }
  * >>> .el-dialog__header {
    padding: 0;
  }
  
  * >>> .el-dialog__header,
  * >>> .el-dialog__footer {
    text-align: left !important;
    padding-top: 0;
  }
  
  /* * >>> .el-dialog__body { */
  /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
  /* background: #fcfcfd; */
  /* } */
  
  * >>> .el-select .el-input__inner {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  </style>
  
  <style lang="postcss" scoped>
  .tab-container {
    @apply w-full flex border-b border-paperdazgreen-400/30;
  }
  
  .tab-button {
    @apply bg-[#858383]/80 text-white tracking-wider font-medium text-sm flex-1 px-2 py-3 transition  hover:bg-[#858383] border-none relative;
    &:not(:last-child)::after {
      @apply bg-paperdazgreen-400/30;
      content: '';
      position: absolute;
      height: 80%;
      width: 1px;
      top: 50%;
      right: 0;
  
      transform: translate(50%, -50%);
    }
    &.active {
      @apply text-white bg-paperdazgreen-400/80;
    }
  }
  </style>
  