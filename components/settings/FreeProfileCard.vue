<template>
  <div class="rounded-2xl bg-white py-6 px-6 flex items-center justify-center">
    <div class="flex flex-col items-center">
      <h3
        class="uppercase text-paperdazgray-500 font-semibold text-center mb-4 text-xl"
      >
        Free Account
      </h3>
      <div
        class="circle circle-75 border-4 border-[#B7EF94] mx-auto p-0.5 mb-2"
      >
        <div
          @click="PopUpFileInput"
          class="circle w-full h-full border-2 border-[#B7EF94] p-1 cursor-pointer"
        >
          <img :src="profilePhoto" class="circle w-full h-full profilePhoto" alt="" />
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
      <div
        class="border border-paperdazgray-100 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full"
      >
        <p class="mr-2">{{ `${(user || {}).totalLeavesEarned}` }}</p>
        <single-leaf-no-stalk />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SingleLeafNoStalk from '../svg-icons/SingleLeafNoStalk.vue'
import login from "~/mixins/login"
import mixins from 'vue-typed-mixins'

export default mixins(login).extend({
  name: 'FreeProductCard',
  components: { SingleLeafNoStalk },
  computed: {
    user() {
      return this.$auth.user
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto
    },
  },
  methods: {
    PopUpFileInput() {
      try {
        (this.$refs?.profileInput).click()
      } catch (err) {
        console.log(err)
      }
    },

    async uploadProfilePicture(event) {
      let fileInput = event.target

     if(fileInput.files.length < 1 || (fileInput.files[0].size / 1024 / 1024) > 2){
       this.$notify.error({
       message: 'File size must be less than 2MB',
       })
       return
       }

      let formdata = new FormData()
      formdata.append('upload', fileInput.files[0], 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', (this.user).id)
    
      this.$axios
        .$patch(`/files`, formdata)
        .then(async () => {
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

