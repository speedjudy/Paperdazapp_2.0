<template>
  <aside class="pdf-page-aside">
    <div class="overflow-y-auto custom-scrollbar px-5 side-scroll-container">
      <div
        class="bg-white h-56 mb-5 sideScroll overflow-hidden flex justify-center"
        ref="sidescroll"
        v-for="i in numPages"
        :key="i"
        @click="$emit('sideSetScrollPage', i)"
      >
        <side-pages
          :pdf="pdf"
          :pageNum="i"
          :activePage="currentPage == i ? true : false"
          :slideDimentions="slideDimentions"
        />
      </div>
    </div>
    <div class="px-5">
      <div class="flex gap-2">
        <button
        @click="$emit('prevPage')"
         class="circle circle-15 bg-[#626262] text-white">
          <arrow-with-stick-icon />
        </button>
        <div
          class="flex-1 grid place-items-center h-7 bg-white text-sm px-1 py-0.5"
        >
          {{ currentPage <= numPages ? currentPage + '/' : ''}} {{ numPages }}
        </div>
        <button
          @click="$emit('nextPage')"
          class="circle circle-15 bg-[#626262] text-white"
        >
          <arrow-with-stick-icon class="transform rotate-180" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import Vue from 'vue'
import ArrowWithStickIcon from '../svg-icons/ArrowWithStickIcon.vue'
//@ts-ignore
import $ from 'jquery'
import * as PDFJS from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import SidePages from './sidePages.vue'

export default Vue.extend({
  components: { ArrowWithStickIcon, SidePages },
  name: 'PdfPageAside',
  data() {
    return {
      slideDimentions: {},
      currentPages: 1,
    }
  },
  props: {
    numPages: {
      type: Number,
    },
    prevPage: {
       type: Function
    },
    currentPage: {
      type: Number,
    },
    nextPage:{
      type: Function,
    },
    pdf: {
      type: Object,
    },
    sideSetScrollPage: {
      type: Function,
    },
  },
  mounted() {},
  watch: {
    currentPage: function () {
      let itemHeight = $('.sideScroll').outerHeight(true)
      if (this.currentPage <= 1) {
        $('.side-scroll-container').animate({ scrollTop: 0 }, 0)
        return
      }

      $('.side-scroll-container').animate(
        { scrollTop: this.currentPage * itemHeight - itemHeight },
        0
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.pdf-page-aside {
  @apply bg-[#717171] bg-opacity-40
      w-[250px]
      py-4
      h-full
      max-h-full
      gap-3
      overflow-hidden hidden md:grid;
  grid-template-rows: 1fr max-content;
}
.custom-scrollbar {
  /* Handle */
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-500 bg-opacity-30;
    border-radius: 3px;

    &:hover {
      @apply bg-gray-700 bg-opacity-100 cursor-pointer;
    }
  }
}
</style>
