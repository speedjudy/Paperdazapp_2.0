import Vue from 'vue'

export default{
  methods: {
    async logout(shouldRedirect: boolean = true) {
      // @ts-ignore
      if (shouldRedirect) await this.$nuxt.$router.push('/login')
      //@ts-ignore
      this.$notify({
        title: 'Authentication',
        message: 'Sucessfully logged out',
        type: 'success',
      })

      // @ts-ignore

      await this.$auth.logout()
      localStorage.removeItem('userID') // remove the local storage userID
    },
  },
}
