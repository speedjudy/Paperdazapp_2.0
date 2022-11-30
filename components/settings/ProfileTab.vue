<template>
  <div
    class="flex items-center overflow-x-auto overflow-y-hidden sm:border-b border-gray-200 custom-scrollbar"
  >
    <div
      v-for="(tab, i) in tabs"
      :key="i"
      class="h-8 sm:h-9 lg:h-10 border-b-2 cursor-pointer font-semibold text-sm sm:text-base lg:text-lg whitespace-nowrap"
      :class="[
      currentTab == tab.value
          ? 'border-paperdazgreen-300 text-paperdazgreen-300'
          : 'border-transparent',
        i !== tabs.length - 1 ? 'mr-6 sm:mr-8' : '',
      ]"
      @click="setSettingTab(tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'ProfileTab',
  model: {
    prop: 'currentTab',
    event: 'update-tab',
  },
  props: {
    currentTab: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [
        { label: 'Account', value: 'account' },
        { label: 'Change Password', value: 'change-password' },
        { label: 'Signature/Initials', value: 'signature-initials' },
      ],
    },
  },
  data() {
    return {}
  },
   methods:{
    setSettingTab(val){
       this.$nuxt.$router.push(`/settings?tab=${val}`)
      this.$emit(`update-tab`, val)
    }
  },
  watch:{
    '$route.query.tab': function(){
      this.setSettingTab(this.$route.query.tab)
    }
  }
})
</script>
