<template>
  <div>
    <component :is="profileCardComponent" class="h-full" />

  </div>
</template>
<script>
import Vue from 'vue'
import FreeProfileCard from '~/components/settings/FreeProfileCard.vue'
import PaidProfileCard from '~/components/settings/PaidProfileCard.vue'

import UserTypeEnum from '~/models/UserTypeEnum'

export default Vue.extend({
  name: 'ProfileCard',
  components: { FreeProfileCard },
  data() {
    return {}
  },
  computed: {
    userType() {
      return this.$store.getters.userType
    },
    profileCardComponent() {
      switch (this.userType) {
        case UserTypeEnum.FREE:
          return FreeProfileCard
        case UserTypeEnum.PAID:
          return PaidProfileCard
        case UserTypeEnum.TEAM:
          return PaidProfileCard
        default:
          return {
            render(createElement) {
              return createElement('h1', 'Loading...')
            },
          }
       return FreeProfileCard
      }
      
    },
  },
})
</script>
