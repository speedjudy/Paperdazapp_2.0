<template>
  <div class="leaves-details-container text-xs sm:text-sm">
    <div>
      <div class="inline-flex gap-2 whitespace-nowrap sm:gap-4 items-center">
        <single-leaf-icon />
        <span class="text-paperdazgray-500 font-medium">{{(user || {}).totalLeavesEarned}} leaves</span>
      </div>
    </div>
    <div>
      <div class="inline-flex gap-2 whitespace-nowrap sm:gap-4 items-center">
        <multiple-leaf-1-icon />
        <span class="text-paperdazgray-500 font-medium"
          >{{getLeavesPerFile}} leaves per file</span
        >
      </div>
    </div>
    <div>
      <div class="inline-flex gap-2 whitespace-nowrap sm:gap-4 items-center">
        <two-leaves-icon />
        <span class="text-paperdazgray-500 font-medium"
          >{{getLeavesPerShare}} leaves per share</span
        >
      </div>
    </div>
    <div>
      <div class="inline-flex gap-2 whitespace-nowrap sm:gap-4 items-center">
        <tree-icon />
        <span class="text-paperdazgray-500 font-medium flex flex-col">
          <span>{{getMAxLeaves}} leaves</span>
          <span class="whitespace-nowrap">Plant a tree in your honor</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import MultipleLeaf1Icon from '../svg-icons/MultipleLeaf1Icon.vue'
import SingleLeafIcon from '../svg-icons/SingleLeafIcon.vue'
import TreeIcon from '../svg-icons/TreeIcon.vue'
import TwoLeavesIcon from '../svg-icons/TwoLeavesIcon.vue'
import staticData from "~/models/StacticData"

export default {
  components: { SingleLeafIcon, MultipleLeaf1Icon, TwoLeavesIcon, TreeIcon },
  data() {
    return {
      companyStaticData:[]
    }
  },
  computed:{
    user(){
      return (this.$auth.user)
    },
    getMAxLeaves(){
      if(this.companyStaticData.length < 1) return 
      let gottenData = this.companyStaticData.filter((el)=>el.name == staticData.MAX_LEAVES)[0]
      return gottenData.value
    },
    getLeavesPerFile(){
      if(this.companyStaticData.length < 1) return 
      let gottenData = this.companyStaticData.filter((el)=>el.name == staticData.LEAVES_PER_FILE)[0]
      return gottenData.value
    },
    getLeavesPerShare(){
      if(this.companyStaticData.length < 1) return 
      let gottenData = this.companyStaticData.filter((el)=>el.name == staticData.LEAVES_PER_SHARE)[0]
      return gottenData.value
    }
  },
  beforeMount(){
    this.getStaticSetting()
  },
  methods:{
    async getStaticSetting(){
      this.$axios.$get(`/admin-settings`)
      .then((response)=>{
        console.log(response)
      this.companyStaticData = response;
      })
      .catch((err)=>{})
    }
  }
}
</script>

<style lang="postcss" scoped>
.leaves-details-container {
  @apply bg-white p-4 rounded-xl flex flex-wrap;
  & > * {
    @apply px-4 py-4 sm:py-2 flex-1 flex items-center justify-center;
    border-bottom: 1px solid #e3e3e3;
    &:last-child {
      border: none;
    }
    @media screen and (min-width: 640px) {
      border: none;
      border-right: 1px solid #e3e3e3;
    }
  }
}
</style>
