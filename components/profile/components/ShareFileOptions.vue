<template>
    <div class="text-[#9D9D9D] flex items-right justify-end  gap-2">
        <button
        v-if="isLoggedIn"
        @click="showRequestModalFunc"
        >
        <forward-outline-icon width="20" height="20" />
        </button>
        <button
         v-if="isLoggedIn"
        class="mx-1 relative heart-icon mr-0"
        ref="heart"
        @click="setFileFavourite"
        >
        <heart-outline-icon :fillColor="fillHeartColor" width="22" height="22" />
        </button>

        <button @click="showShareCompanyFilesFunc">
         <share-outline-icon width="20" height="20" />
        </button>


      <ShareFilesModal
      :userFile="file"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
      />

      <RequestModal
      @refresh="setRefresh"
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showRequestModal"
    />

     <QrcodeShare :userFile="file" v-model="showQrcodeFiles" />
    </div>
</template>

<script>
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import ForwardOutlineIcon from '~/components/svg-icons/ForwardOutlineIcon.vue'
import ShareFilesModal from '~/components/company-files/Tabs/ShareFilesModal.vue'
import QrcodeShare from '~/components/company-files/Tabs/QrcodeShare.vue'
import RequestModal from '~/components/company-files/Tabs/RequestModal.vue'


    export default {
        name:"sharefileoptions",
        components:{
    HeartOutlineIcon,
    ShareOutlineIcon,
    ForwardOutlineIcon,
    ShareFilesModal,
    QrcodeShare,
    RequestModal
},
    data() {
      return {
          isHeart:false,
          fillHeartColor:'none',
          showShareCompanyFiles:false,
          showQrcodeFiles:false,
          favouriteFileId: null,
          totalShared:null,
          showRequestModal: false,
      }
    },
    props:{
      file:{}
    },
    computed:{
       isLoggedIn(){
        return this.$auth?.loggedIn
       },
       user(){
        return (this.$auth?.user || {})
       }
    },
    methods:{
       shareInDevice(){
        if (navigator.share) {
          navigator.share({
          // Title that occurs over
          // web share dialog
          title: 'Paperdaz',
          // URL to share
          url: `${window.location.origin}/pdf/${this.file.paperLink}` })
        .then(() => {})
        .catch(err => {
        // Handle errors, if occured
          });
        } else {
          // Alerts user if API not available 
          console.log("Browser doesn't support this API !");
        }
      },
      showRequestModalFunc(){
        this.showRequestModal = true
      },
      getFavouriteFile(){
        this.$axios.$get(`/favourites/?fileId=${this.file.id}&userId=${this.user.id}`)
        .then((response)=>{
           if(response.data.length > 0)
            this.fillHeartColor = '#77C360'  
            this.favouriteFileId = response.data[0].id
        })
         
         this.$axios.$get(`/favourites/?fileId=${this.file.id}`)
        .then((response)=>{
           this.totalShared = Number(response.total)
        })
      },
      showQrcodeFileFunc(){
        this.showQrcodeFiles = true
        this.showShareCompanyFiles = false
      },
      showShareCompanyFilesFunc(){
        if(this.$auth.loggedIn){
        this.showShareCompanyFiles = true
        return
        }
        this.shareInDevice()
      },
      animateElement(elem){
         elem.classList.add('scale-out')
         setTimeout(() => {
          elem.classList.remove('scale-out')
         }, 300);
      },
      setFileFavourite(){
        this.animateElement(this.$refs.heart)
        if( this.fillHeartColor == "none"){
        this.$axios.$post('/favourites', {fileId: this.file.id})
        .then((response)=>{
            this.fillHeartColor = '#77C360';
            this.favouriteFileId = response.id;
            this.getFavouriteFile()
        })
        }
        else{
          this.$axios.$delete(`/favourites/${this.favouriteFileId}`)
        .then(()=>{
            this.fillHeartColor = 'none' ;
            this.getFavouriteFile()
        })  
        }
      }
    },

        mounted(){
          this.getFavouriteFile()
           console.log("share user files", this.fileFavourite) 
        }
    }
</script>

<style scoped>
.icon-container {
  @apply flex;
  button {
    @apply w-[2rem] mr-[0em] flex justify-center text-[20px];
  }
}
.arrow-icon {
  @apply rotate-180;
}
.search-container {
  @apply flex w-8/12 justify-end pr-3 items-center;
}
.folder-search {
  @apply py-[6px] px-2 text-[0.8rem] border-[1.3px] border-paperdazgray-200 w-[160px] rounded-md;
}
.heartTopIcon{
  @apply absolute left-[7px] w-[23px] -top-1 text-[9px] px-[3px] py-[1.5px] 
  pb-[0] bg-white rounded-[20px] font-bold leading-[10px]
  grid place-items-center;
}
.heart-icon{
  transition: 0.3s;
}
.scale-out{
  transform: scale(1.4);
}
</style>