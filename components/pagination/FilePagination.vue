<template>
  <!-- Start:: Pagination -->
  <div class="grid place-items-center py-5" v-if="totalFile > eachPageTotal">
    <div>

      <paginate
      :page-count="arrayPages.length + 1"
      :click-handler="buttonFilePage"
      :prev-text="'&#8249;'"
      :next-text="'&#8250;'"
      :container-class="'paginate'"
      :page-class="'page-item'"
      >
    </paginate>
      <!-- <button
        class="pagination-arrow-left"
        :class="[displayPrevButton == false ? 'text-paperdazgray-300/70' : 'text-black']"
        @click="prevFilePage"
        :disabled="!displayPrevButton"
      >
        <ArrowDownIcon />
      </button>

      
      <button 
      v-for="index in numberOfPages" 
       @click="buttonFilePage(--index)"
       :key="index+'pages'"
       class="pagination-button"
       :class="[activeButton == --index ? 'active' : '']"
       >
        {{ ++index }}
      </button>

      <span class="opacity-40" v-if="confirmTotalIsMany">•••</span>

      <button 
      v-if="confirmTotalIsMany"
      v-for="index in [availablePages, availablePages + 1]" 
       @click="buttonFilePage(--index)"
       :key="index+'pages'"
       class="pagination-button"
       :class="[activeButton == --index ? 'active' : '']"
       >
        {{ ++index }}
      </button>

      <!-- <button 
      :disabled="!displayNextButton"
      @click="nextFilePage" 
      class="pagination-button">
        {{ returnedDataPage / eachPageTotal + 2 }}
      </button> -->
<!-- 
      <button
        class="pagination-arrow-right"
        :class="[displayNextButton == false ? 'text-paperdazgray-300/70' : 'text-black']"
        @click="nextFilePage"
        :disabled="!displayNextButton"
      >
        <ArrowDownIcon />
      </button> --> 
    </div>
  </div>
  <!-- End:: Pagination -->
</template>

<script>
import AuthUser from '~/models/AuthUser'
import ArrowDownIcon from '../svg-icons/ArrowDownIcon.vue'

export default {
  name: 'filePagination',
  props: {
    setPage: {
      type: Function,
    },
    totalFile: {},
  },
  data() {
    return {
      returnedDataPage: 0,
      eachPageTotal:10,
    }
  },

  components: { ArrowDownIcon },
  methods: {
    buttonFilePage(val){
      this.returnedDataPage = (this.eachPageTotal * (val -1))
      this.$emit('setPage', this.returnedDataPage)
    }
  },
  watch: {
    returnedDataPage: ()=>{
       
    }
  },
  computed: {
    availablePages(){
      return Math.floor(this.totalFile/this.eachPageTotal) > 5 ? Math.floor(this.totalFile/this.eachPageTotal) : Math.floor(this.totalFile/this.eachPageTotal)+2
    },
    arrayPages(){
      let initialArray = []
      for(let i = 1; i < this.availablePages; i++){
        initialArray.push(i)
      }
      return initialArray
    },

  },
}
</script>

<style scoped>


.page-item{
  background: red !important;
}
.pagination-arrow-left {
  @apply text-xs h-9 min-w-[36px] rounded px-3 font-medium;
  transform: rotateZ(90deg);
}
.pagination-arrow-right {
  @apply text-xs h-9 min-w-[36px] rounded px-3 font-medium;
  transform: rotateZ(-90deg);
}
</style>
