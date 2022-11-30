import UserTypeEnum from '~/models/UserTypeEnum'

  export default{
    watch:{
      created(){
        // if ( this.$auth.user.role !== UserTypeEnum.FREE) {   
        //   this.$nuxt.$router.push("/dashboard")
        //  }
      },
      "$auth.user" : function(){
        if ( this.$auth.user.role !== UserTypeEnum.FREE) {   
         this.$nuxt.$router.push("/dashboard")
        }
      }
    }
  }