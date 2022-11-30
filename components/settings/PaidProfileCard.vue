<template>
  <div>
    <div
      class="rounded-2xl bg-white py-6 px-6 flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <h3
          class="uppercase text-paperdazgray-500 font-semibold text-center mb-4 text-xl"
        >
          {{userAccount}}
        </h3>
         <div
        class="w-40 h-40 mx-auto p-0.5 mb-2"
      >
        <div
          @click="PopUpFileInput"
          class="w-full h-full border-2 border-[#B7EF94] p-2 cursor-pointer rounded-lg"
        >
          <img :src="profilePhoto" class="w-full h-full profilePhoto rounded-lg" alt="" />
          <input
            ref="profileInput"
            @input="uploadProfilePicture"
            type="file"
            class="hidden"
            accept="image/x-png,image/jiff,image/jpeg,image/jpg"
          />
        </div>
      </div>
        <p class="text-lg font-semibold mb-2 capitalize">
          {{ `${user.firstName} ${user.lastName}` }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 mt-4 text-[#6C6777]">
      <div class="bg-white rounded-lg px-2 py-4"
      @click="showQrcodeFunc"
      >
        <barcode-icon class="w-full h-8 text-paperdazgreen-300 mb-2 cursor-pointer" />
        <p class="text-center text-[10px] font-medium">Download</p>
      </div>
      <div class="bg-white rounded-lg px-2 py-4"
      @click="showShareCompanyFunc"
      >
        <share-icon class="w-full h-8 text-paperdazgreen-300 mb-2 cursor-pointer" />
        <p class="text-center text-[10px] font-medium">Share</p>
      </div>
      <nuxt-link
        to="/public/profile"
        class="block bg-white rounded-lg px-2 py-4"
      >
        <building-icon class="w-full h-8 text-paperdazgreen-300 mb-2" />
        <p class="text-center text-[10px] font-medium">View Profile</p>
      </nuxt-link>
    </div>

    
    <QrcodeShare :link="link" v-model="showQrcode" />

    <ShareFilesModal
    :link="link"
    v-model="showShareCompany"
  />
  </div>
</template>

<script>
import Vue from 'vue'
import BarcodeIcon from '../svg-icons/BarcodeIcon.vue'
import BuildingIcon from '../svg-icons/BuildingIcon.vue'
import ShareIcon from '../svg-icons/ShareIcon.vue'
import login from "~/mixins/login"
import mixins from 'vue-typed-mixins'
import UserTypeEnum from '~/models/UserTypeEnum'
import QrcodeShare from '../company-files/Tabs/QrcodeShare.vue'
import ShareFilesModal from '../company-files/Tabs/ShareFilesModal.vue'

export default mixins(login).extend({
  name: 'PaidProfileCard',
  components: { BarcodeIcon, ShareIcon, BuildingIcon, QrcodeShare, ShareFilesModal },
  data() {
      return {
        showQrcode: false,
        showShareCompany: false
      }
    },
  computed: {
    profilePhoto() {
      return this.$store.getters.profilePhoto
    },
    user() {
      return this.$auth.user
    },
    link(){
      return (`${window.origin}/public-profile/${this.$auth.user.id}`)
    },
    userAccount(){
      switch ((this.$auth.user).role) {
        case UserTypeEnum.PAID:
          return 'PAID ACCOUNT'
        case UserTypeEnum.TEAM:
          return 'TEAM ACCOUNT'
      }
    }
  },
  methods: {
    showQrcodeFunc(){
      this.showQrcode = true
    },
    showShareCompanyFunc(){
      this.showShareCompany = true
    },
    PopUpFileInput() {
      try {
        (this.$refs?.profileInput).click()
      } catch (err) {
        console.log(err)
      }
    },

    async uploadProfilePicture(eventy) {
      let fileInput = event.target

      if(fileInput.files.length < 1 || (fileInput.files[0].size / 1024 / 1024) > 2){
       this.$notify.error({
       message: 'File size must be less than 2MB',
       } )
       return
       }

      let formdata = new FormData()
      formdata.append('upload', fileInput.files[0], 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', (this.user).id)

      this.$axios
        .$patch(`/files`, formdata)
        .then(() => {
            //@ts-ignore
          this.filterUsers()
        })
        .catch(() => {
          this.$notify.error({
            message: 'Unable to upload profile picture',
          })
        })
    },
  },
})
</script>

