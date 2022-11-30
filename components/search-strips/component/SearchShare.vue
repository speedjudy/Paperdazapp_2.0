<template>
  <div class="self-center flex items-center">
    <button
      @click="setFileFavourite"
      class="mr-1.5 pr-1.5 border-[#EBEBEB] border-r "
      v-if="$auth.loggedIn && showShareIcon && favouriteFileLoaded"
    >
    <span class="inline-block heart-icon" ref="heart">
      <heart-outline-icon
        :fillColor="toggleHeartColor ? fillHeartColor : 'rgb(119,181,80)'"
        width="22"
        height="22"
      />
      </span>
    </button>
    <button @click="shareInDevice">
      <ShareIcon />
    </button>
  </div>
</template>

<script>
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import ShareIcon from '~/components/svg-icons/ShareIcon.vue'

export default {
  name: 'searchShare',
  components: { HeartOutlineIcon, ShareIcon },
  props: {
    link: String,
    file: {
      type:Object
    },
    showShareIcon:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      fillHeartColor: 'none',
      toggleHeartColor: true,
      favouriteFileId: null,
      favouriteFileLoaded: false,
    }
  },
  watch: {
    'file': function(){
    this.getFavouriteFile()
    }
  },
  mounted(){
    this.getFavouriteFile()
  },

  computed: {
    user(){
      return this.$auth.user
    }
  },

  methods: {
    animateElement(elem){
      if(!this.$auth.loggedIn) return
         elem.classList.add('scale-out')
         setTimeout(() => {
          elem.classList.remove('scale-out')
         }, 300);
      },
    setFileFavourite(){
      if(!this.$auth.loggedIn) return
        this.animateElement(this.$refs.heart)
        if(!this.file) return;

        if( this.fillHeartColor == "none" ){
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
      },
    getFavouriteFile() {
      if(!this.$auth.loggedIn) return
      if(!this.file) return;

      this.$axios
      .$get(`/favourites/?fileId=${this.file.id}`)
      .then((response) => {
        if (response.data.length > 0) this.fillHeartColor = '#77C360'
        this.favouriteFileId = response.data[0]?.id;
        this.favouriteFileLoaded = true
      })
    },

    shareInDevice() {
      if (navigator.share) {
        navigator
          .share({
            // Title that occurs over
            // web share dialog
            title: 'Paperdaz',
            // URL to share
            url: this.link,
          })
          .then(() => {})
          .catch((err) => {
            // Handle errors, if occured
          })
      } else {
        // Alerts user if API not available
        console.log("Browser doesn't support this API !")
      }
    },
  },
}
</script>

<style scoped>
.heart-icon{
  transition: 0.3s;
}
.scale-out{
  transform: scale(1.4);
}
</style>
