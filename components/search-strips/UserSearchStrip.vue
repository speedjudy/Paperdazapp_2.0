<template>
  <article
    class="cursor-pointer py-4 text-[#9F9F9F] grid grid-cols-[max-content,1fr,max-content] gap-4 items-center"
  >
    <img
      :src="(record || {}).profilePicture || `/img/placeholder_picture.png`"
      alt=""
      class="circle circle-32 rounded-lg object-cover"
    />
    <div class="overflow-hidden w-[100%]">
      <p class="text-sm text-black mb-1 truncate w-[90%]">{{ (record || {}).email }}</p>
      <p class="text-xs truncate">
        {{ (record || {}).firstName }} {{ (record || {}).lastName }}
      </p>
      <!-- <p class="text-[11px] mt-0.5 truncate">patient intake</p> -->
    </div>
    <SearchShare/>
  </article>
</template>

<script>
import Vue from 'vue'
import SearchShare from './component/SearchShare.vue'

export default Vue.extend({
  components: { SearchShare },
  name: 'UserSearchStrip',
  mounted(){
    console.log(this.record)
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
})
</script>
