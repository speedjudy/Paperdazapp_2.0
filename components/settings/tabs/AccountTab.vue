<template>
  <div class="grid grid-cols-1 lg:grid-cols-[max-content,1fr] gap-6">
    <profile-card class="lg:w-[262px] max-w-full" />
    <profile-info />
  </div>
</template>

<script>
import Vue from 'vue'
import ProfileCard from '../ProfileCard.vue'
import ProfileInfo from '../ProfileInfo.vue'
export default Vue.extend({
  name: 'AccountTab',
  components: { ProfileCard, ProfileInfo },
})
</script>
