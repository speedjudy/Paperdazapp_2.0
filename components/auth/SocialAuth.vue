<template>
  <div>
    <div
      class="flex flex-wrap gap-2 xs:gap-4 text-sm font-medium text-paperdazgray-400"
    >
      <div
        class="flex-1 cursor-pointer social-card"
        @click="socialSignIn('facebook')"
      >
        <img
          class="object-contain w-5 h-5"
          src="/icons/authIcons/facebook.png"
          alt=""
        />
        <span>Facebook</span>
      </div>
      <div class="flex-1 social-card cursor-pointer"  @click="socialSignIn('google')">
        <img
          class="object-contain w-5 h-5"
          src="/icons/authIcons/google.png"
          alt=""
        />
        <span>Google</span>
      </div>
      <div class="flex-1 cursor-pointer social-card"  @click="socialSignIn('twitter')">
        <img
          class="object-contain w-5 h-5"
          src="/icons/authIcons/twitter.png"
          alt=""
        />
        <span>Twitter</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'

export default Vue.extend({
  created() {},
  data() {
    return {
      socialState: undefined
    }
  },
  methods: {
    async socialSignIn(val) {
      try{
       switch (val) {
        case 'facebook':
          this.socialState = new this.$fireModule.auth.FacebookAuthProvider();
          break
        case 'google':
          this.socialState = new this.$fireModule.auth.GoogleAuthProvider();
          break
        case 'twitter':
          this.socialState = new this.$fireModule.auth.TwitterAuthProvider();
          break
       }
       // You can add or remove more scopes here provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        let authData = await this.$fire.auth.signInWithPopup(this.socialState)

        authData = authData.user._delegate.providerData[0];

       authData = {
        displayName: authData?.displayName,
        email: authData.email,
        phoneNumber: authData.phoneNumber,
        photoURL: authData.photoURL,
        id: authData.uid,
        provider: authData.providerId.substring(0,authData.providerId.indexOf('.'))
        }

        const user = jwt.sign(authData, process.env.ENCRYPTION_KEY)
        window.location.assign(`/login?token=${user}`)
      }
      catch(err){
        console.log(err)
      }
    },
  },
})
</script>

<style lang="postcss" scoped>
.social-card {
  @apply flex justify-center
            items-center
            bg-white
            rounded-md
            shadow
            px-3
            py-3
            min-w-[120px]
            gap-2 hover:text-paperdazgray-500;
}
</style>
