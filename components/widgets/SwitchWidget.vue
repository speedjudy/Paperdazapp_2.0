<template>
  <div
    class="switch-widget flex cursor-pointer w-10 rounded-full bg-[#C4C4C4]"
    :class="[active ? 'justify-end' : '']"
  >
    <div
      class="indicator circle circle-10"
      :class="[active ? 'bg-paperdazgreen-400' : 'bg-[#8C8F89]']"
    ></div>
  </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'SwitchWidget',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
