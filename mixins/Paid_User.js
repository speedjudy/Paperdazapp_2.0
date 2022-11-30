import UserTypeEnum from '~/models/UserTypeEnum'

  export default{
    created(){
      // if (this.$auth.user.role !== UserTypeEnum.PAID) {
      //   this.$nuxt.$router.push("/dashboard")
      //  }
    },
    watch:{
      "$auth.user" : function(){
        if (this.$auth.user.role !== UserTypeEnum.PAID 
          && this.$auth.user.role !== UserTypeEnum.TEAM) {
         this.$nuxt.$router.push("/dashboard")
        }
      }
    }
  }