<template>
  <article
    class="cursor-pointer py-4 text-[#9F9F9F] grid grid-cols-[max-content,1fr,max-content] gap-4 items-center"
  >
    <img
      :src="record.profilePicture || `'/img/placeholder_picture.png'`"
      alt=""
      class="h-16 w-16 rounded-lg object-cover"
    />
    <nuxt-link class="overflow-hidden w-[100%]" :to="`/public-profile/${(record || {}).id}`" 
    :title="`${(record || {}).slogan}\n ${(record || {}).briefIntro}`">
    <div class="overflow-hidden">
      
      <p class="text-sm text-black mb-1 truncate w-[90%]">{{ (record || {}).email }}</p>

      <p class="text-xs truncate">
        {{ (record || {}).firstName }} {{ (record || {}).lastName }}
      </p>
      <!-- <p class="text-[11px] mt-0.5 truncate">patient intake</p> -->
    </div>
    </nuxt-link>
    <SearchShare :link="link"/>
  </article>
</template>

<script>
import Vue from 'vue'
import SearchShare from './component/SearchShare.vue';

export default Vue.extend({
  components: { SearchShare },
  name: 'CompanySearchStrip',
  data() {
    return {
      
    }
  },
  computed:{
    link(){
      return (`${window.location.origin}/profile-folder/${this.record.id}`)
    }
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
})
</script>
