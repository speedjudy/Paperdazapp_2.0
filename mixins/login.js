import Vue from 'vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import StatusUser from '~/models/StatusUser'
import axios from 'axios'

export default {
  methods: {
    async checkIfTeamMemberIsExpired(teamId){
      await this.$axios.$get(`/users/${teamId}`)
      .then((response)=>{
        if(response.status == StatusUser.EXPIRED){
        this.$auth.logout()
        window.location.assign(`/login/?error=Opps, Team subscription is expired`) 
        }
      })
      return
    },

    async fetchUser(id) {
      await this.$axios.$get(`/users/?id=${id}`)
        .then(async (response) => {
        localStorage.setItem('paperdaz_userID', id)
        const [userData] = response.data
        console.log("user",userData)

        // set the user
        this.$auth.setUser(userData)
        this.$store.commit('SET_PAGE_USER', this.$auth.user)
        console.log(this.$auth.user, response)


          if(this.$auth.user.role == UserTypeEnum.TEAM) {
            this.checkIfTeamMemberIsExpired(this.$auth.user.teamId)
          }

          // route to login, if user is not paid or free
          if (
            this.$auth.user.role == UserTypeEnum.ADMIN ||
            this.$auth.user.role == UserTypeEnum.SUPER_ADMIN) {
            await this.$auth.logout()
            window.location.assign(`/login/?error=Opps, Admin cannot be logged in to  user plattform`)  
            return
          }

           // route to login, if user is not an active user
          if( this.$auth.user.status != StatusUser.ACTIVE ) {
            await this.$auth.logout()
            window.location.assign(`/login/?error=Your account is ${userData.status}, reach out to support for help`)   
          }
        })
        .catch(async ({response}) => {
          if(response.status == 401)
              await this.$auth.logout()
              this.$nuxt.$router.push('/login?error=Login session has expired')
              localStorage.removeItem('paperdaz_userID')
            })
    },
     
    // < LOGIN -- user>
    async loginUser(response) {
      const { id } = response.data.user
      localStorage.setItem("main_user_paperdaz_token",response.data.accessToken)
      this.$auth.strategy.token.set(response.data.accessToken)
      this.fetchUser(id)
    },

      // < GET_USER -- user>
    async filterUsers() {
      if (
        this.$auth.loggedIn &&
        localStorage.getItem('paperdaz_userID') &&
        this.$auth.user)
          {
          const id = localStorage.getItem('paperdaz_userID')
          this.fetchUser(id)
          return
          }
      else if(!localStorage.getItem('paperdaz_userID'))
         {
          await this.$auth.logout()  
         } 
    },
  },
  async beforeMounted() {
    await this.filterUsers()
  },
}
