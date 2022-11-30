<template>
  <div
    class="bg-white rounded-3xl px-5 py-10 grid place-items-center text-[#272727]"
  >
    <div class="inline-flex items-center flex-col">
      <h4 class="font-semibold text-xl mb-10">
        Upload a file and get 100 leaves
      </h4>
      <tree-icon width="80" height="80" class="mb-2" />
      <p class="text-sm mb-1.5">You have completed any files or folders yet!</p>
      <p class="text-sm font-medium">Press + to Add</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeIcon from '../svg-icons/TreeIcon.vue'
export default Vue.extend({
  components: { TreeIcon },
  name: 'EmptyFileLedger',
})
</script>
