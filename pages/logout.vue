<template>
  <div></div>
</template>

<script>
import Vue from 'vue'
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'

export default mixins(GlobalMixin).extend({
  name: 'LogoutPage',
  async beforeMount() {
    await this.$fire.auth.signOut()
    this.logout()
  },
})
</script>
