<template>
  <main>
    <ProfileTopInfo v-if="isInfoReady" :userInfo="userInfo"/>
    <FolderContentFile :folderContent="files" :header="folderName" />
  </main>
</template>

<script>
import Vue from 'vue';
import ProfileFolder from '~/components/profile/tabs/ProfileFolder.vue'
import ProfileCard from '~/components/settings/ProfileCard.vue'
import FolderContentFile from '~/components/profile/tabs/FolderContentFile.vue';
import Paid_User from '~/mixins/Paid_User';
import AuthUser from '~/models/AuthUser';
import UserTypeEnum from '~/models/UserTypeEnum';

export default Vue.extend({
  name: 'ProfilePage',
  components: { ProfileFolder, ProfileCard, FolderContentFile },
  data() {
    return {
      folderName: this.$route.params,
      files: [],
      filesPage:0,
      userInfo:{},
      isInfoReady: false,
      folderName:'',
    }
  },
  auth:false,
  // middleware:['paid_user'],
  computed:{
     isMainUser(){
      return (this.$auth.loggedIn && this.$route.params.form == (this.$auth.user).id)
     }
  },
  mounted(){
    this.getPublicFiles(this.filesPage)
    this.files = this.folder; 
    this.getTeamPublicInfo()
  },
  layout: 'profile',
  auth:false,
 methods:{
 
  async getTeamPublicInfo(val){
    await this.$axios.get(`users/?id=${val}`)
    .then((response)=>{
      const user = response.data.data
       let userInfo = user[0];
       this.isInfoReady = true
       console.log("UUUUUUUUUUUU",user)

      this.$auth.user.role == UserTypeEnum.TEAM ? this.getMainPaidUser(userInfo.id) :
      this.userInfo = user[0]
      //  if(user.role != UserTypeEnum.PAID)
      //  this.$nuxt.$router.push('/dashboard')
    })
    .catch(()=>{
      this.$notify.error({
        message:"Could not get user"
      })
    })
  },
  async getPublicFiles(page){
    await this.$axios 
      .$get(`/folders/?id=${this.$route.params.form}&$skip=${page}`)
      .then(async (response) => {
        this.files = response.data[0].files
        console.log("HHHHHHHHHHHHHHHH",response.data[0])
        await this.getTeamPublicInfo(response.data[0].userId)
        this.folderName = response.data[0].name
        console.log(response,this.files )
        })
      .catch((err) => {
        this.$notify.error({
        message: 'Could not get folder',
        })
    })
  }
 }

})
</script>
