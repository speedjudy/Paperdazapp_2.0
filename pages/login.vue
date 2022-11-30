<template>
  <section class="bg-gradient-to-t from-white to-transparent">
    <div class="container py-20">
      <div
        class="w-full max-w-md mx-auto bg-white shadow-2xl rounded-xl px-6 py-10"
      >
        <h4 class="text-lg font-medium mb-8 text-center">
          Sign in to Paperdaz
        </h4>
        <social-auth class="mb-10" />
        <div class="h-px bg-paperdazgray-100 w-full relative mb-10">
          <span
            class="inline-block bg-white p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-paperdazgray-500 font-medium text-sm"
            >OR</span
          >
        </div>

        <div v-if="isEmailVerified" class="flex items-center text-[13px] w-full bg-red-500 text-white rounded-md py-3 p-2 mb-5">
          <exclamation-icon
          width= "18"
          height="18"
          />
           <span class="inline-block pl-2">
            Email is not verified, <b class="underline">
           <button
           @click="showUpdateEmail = true"
           >Click to resend</button></b>
          </span>
          </div>

        <form action="" class="text-sm" @submit.prevent="login">
          <message-alert-widget
            :message="errorMessage"
            v-show="errorMessage"
            type="error"
            class="mb-8"
          />
          <message-alert-widget
            :message="'Please wait, redirecting'"
            v-show="isRedirecting"
            type="success"
            class="mb-8"
            :isLoading="true"
          />
          <div class="mb-6">
            <label for="" class="mb-2 block">Email</label>
            <input-field
              v-model="user.email"
              :showAsError="!!errorMessage"
              :disabled="isLoading || isRedirecting"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>
          <div class="mb-10">
            <label for="" class="mb-2 block">Password</label>
            <password-field
              :showAsError="!!errorMessage"
              v-model="user.password"
              :disabled="isLoading || isRedirecting"
              required
              placeholder="xxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div class="flex justify-between text-xs mb-10">
            <div
              class="text-paperdazgray-400 font-medium flex items-center gap-2"
            >
              <input id="remember-me-checkbox" type="checkbox" hidden />
              <label
                for="remember-me-checkbox"
                class="cursor-pointer circle circle-8 text-white relative"
              >
                <div class="overlay circle circle-18"></div>
                <check-icon
                  class="relative"
                  style="z-index: 1;"
                  height="8"
                  width="8"
                />
              </label>
              <label for="remember-me-checkbox" class="cursor-pointer"
                >Remember me</label
              >
            </div>
            <nuxt-link to="/forgot-password" class="text-paperdazgreen-300"
              >Forgot Password</nuxt-link
            >
          </div>
          <div class="flex flex-col items-center">
            <button
              class="h-10 rounded-lg shadow px-5 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
              :class="[isLoading ? 'cursor-progress' : '']"
              :disabled="isLoading || checkingEmailVerified"
            >
              <span class="inline-flex items-center gap-3">
                <span>Sign in</span>
                <transition name="fade" :duration="100">
                  <span v-show="isLoading" class="animate-spin">
                    <spinner-dotted-icon height="22" width="22" />
                  </span>
                </transition>
              </span>
            </button>

            <span class="text-xs inline-block mt-6"
              >Not a member yet?
              <nuxt-link to="/register" class="text-paperdazgreen-300"
                >Join Now</nuxt-link
              ></span
            >
          </div>
        </form>
      </div>
    </div>

    <ChangeUserEmail
      @updateSocialDataEmail="updateSocialDataEmail"
      :modalMessageError="modalMessageError"
      v-model="showUpdateEmail"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SocialAuth from '~/components/auth/SocialAuth.vue'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import ExclamationIcon from '~/components/svg-icons/ExclamationIcon.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import SvgIcon from '~/components/svg-icons/SvgIcon.vue'
import InputField from '~/components/widgets/InputField.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import PasswordField from '~/components/widgets/PasswordField.vue'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
import login from '~/mixins/login'
import { ErrorHandler } from '~/components/functions/ErrorFunction'
import ChangeUserEmail from '~/components/company-files/Tabs/ChangeUserEmail.vue'
import { NoAuthpages } from '~/components/functions/NoAuthPages'


interface PassportUserProfile {
  provider: string
  id: string
  displayName: string
  name: { familyName: string; givenName: string; middleName: string }
  emails: Array<{ value: string; type: string }>
  photos: Array<{ value: string }>
}
export default Vue.extend({
  name: 'LoginPage',
  auth: 'guest',
  //@ts-ignore
  mixins: [login],
  components: {
    SocialAuth,
    InputField,
    PasswordField,
    SvgIcon,
    SpinnerDottedIcon,
    ExclamationIcon,
    MessageAlertWidget,
    CheckIcon,
    ChangeUserEmail,
  },
  layout: 'landing',
  // beforeRouteEnter(to, from, next) {
  //   //@ts-ignore
  //   if (
  //     NoAuthpages.test(from.fullPath.slice(1)) &&
  //     from.fullPath.slice(1).trim() != ''
  //   ) {
  //     localStorage.setItem('redirect_paperdaz_path', from.fullPath)
  //   }
  //   next()
  // },
  data() {
    return {
      user: {
        email: undefined,
        password: undefined,
        strategy: 'local',
      },
      isLoading: false,
      errorMessage: '',
      showUpdateEmail: false,
      teamData: {},
      socialData: {} as any,
      modalMessageError: '',
      socialIsSignIn: undefined as any | boolean,
      loginAsTeam: Object.keys(this.$route.query).includes('teamId'),
      isRedirecting: false,
      socialUser: undefined as PassportUserProfile | undefined,
      isEmailVerified: false,
      checkingEmailVerified: false,
    }
  },
  asyncData({ query, $config, env }) {
    const encryptionKey = env.ENCRYPTION_KEY as string
    // const encryptionKey = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
    const token = query.token as string
    let socialUser = undefined as PassportUserProfile | undefined

    let errorMessage = ''

    if (query.error) {
      errorMessage = decodeURI((query.error as string) || '')
    }

    if (token) {
      try {
        socialUser = jwt.verify(token, encryptionKey) as PassportUserProfile
        if (!socialUser.name) {
          socialUser.name = { givenName: '', familyName: '', middleName: '' }
        }

        if (
          (!socialUser.name.givenName || !socialUser.name.familyName) &&
          socialUser.displayName
        ) {
          const names = socialUser.displayName.split(/\s+/)
          socialUser.name.givenName = names[0]
          socialUser.name.familyName = names[names.length - 1]
        }
      } catch (err: any) {
        errorMessage = err.message || 'Invalid token.'
      }
    }

    let isLoading = !!socialUser

    if (errorMessage) {
      isLoading = false
    }

    return { socialUser, isLoading, errorMessage, encryptionKey }
  },
  mounted() {
    //@ts-ignore
    this.socialLogin()
    this.confirmIsEmailVerified()
  },

  methods: {
    async confirmIsEmailVerified(){
      let {verificationToken} = this.$route.query
      if(!verificationToken) return
      this.checkingEmailVerified = true;
      await this.$axios.$post(`/verify`, {
        action: 'verifyEmail',
        token: verificationToken
      })
      .then(()=>{
        this.$notify.success({
          title:'',
          message: 'Email verified'
        })
      })
      .catch(()=>{
        this.$notify.error({
          title:'',
          message: 'verification failed'
        })
      })
      .finally(()=>{this.checkingEmailVerified = false;})
    },
    checkEmailValidity(data: any) {
      if (data.email == null) {
        window.location.assign(`/login?error=Oops, email is required`)
      }
    },
    //@ts-ignore
    async updateSocialDataEmail(val) {
      ;(this.socialData as any).email = val

      console.log('updated-password', this.socialData)
      //@ts-ignore
      await this.RegisterGottenSocialUser(this.socialData)
      //@ts-ignore
      await this.getSocialUser(this.socialData.socialId)
    },

    //@ts-ignore
    async loginInSocialUser(data) {
      ;(this.user as any).email = data.email
      ;(this.user as any).password = data.secret + data.socialId
      console.log('about to log in these user')
      //@ts-ignore
      await this.login()
    },

    //@ts-ignore
    async getSocialUser(socialId, email) {
      await this.$axios
        .get(`/users/?email=${email}&socialId=${socialId}`)
        .then((response) => {
          console.log(response)
          const { data } = response.data
          this.socialIsSignIn = data.length > 0
          if (this.socialIsSignIn)
            //@ts-ignore
            this.loginInSocialUser(data[0])
        })
        .catch(() => {
          ;(this.socialIsSignIn as any) = undefined
        })
    },

    //@ts-ignore
    async RegisterGottenSocialUser(data) {
      //check if email exist
      this.checkEmailValidity(data)

      await this.$axios
        .$post(`/users`, { ...data, isSocial: true })
        .then(async (response) => {
          // console.log("i registerde the user",response)
        })
        .catch(({ response }) => {
          (this.errorMessage as string | undefined) = ErrorHandler(response)
          //@ts-ignore
          if (this.errorMessage.includes('Email')) {
            // this.showUpdateEmail = true
            //@ts-ignore
            window.location.assign(
              '/login?error=Email cannot be use, User exists already'
            )
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    async socialLogin() {
      if (!(this.socialUser && (this.socialUser as any).provider)) return
      this.isLoading = false
      const provider = (this.socialUser as any).provider

      //---------->> extract the data from the social user <<-----
      //@ts-ignore
      let data = {
        socialId: (this.socialUser as any).id,
        firstName: (this.socialUser as any).name.givenName,
        lastName: (this.socialUser as any).name.familyName,
        email: (this.socialUser as any).email,
        profilePicture: (this.socialUser as any).photoURL,
        socialLogin: (this.socialUser as any).provider,
      }

      this.socialData = data as any
      console.log('xxxxxxxxxxxxxxxxxxxxxxxx-social', this.socialData)

      //check if user already exists
      //@ts-ignore
      await this.getSocialUser(this.socialData.socialId, this.socialData.email)

      if (this.socialIsSignIn) return

      //if not user exists create user
      //@ts-ignore
      await this.RegisterGottenSocialUser(this.socialData)

      // get the user and then login the user automatically
      //@ts-ignore
      await this.getSocialUser(this.socialData.socialId, this.socialData.email)
    },
    async login() {
      event?.preventDefault()
      //  this.$auth
      if (this.isLoading || this.isRedirecting) return

      this.checkEmailValidity(this.user)

      this.isLoading = true
      //@ts-ignore
      this.errorMessage = ''
      this.isRedirecting = false

      this.$auth
        .loginWith('local', { data: this.user })
        .then(async (response: any) => {
          let { user } = response.data
          console.log(">>>>>>>>>>>>>>>>>", user)
          if(user.isEmailVerified == 0 || !user.isEmailVerified){
            await this.$auth.logout()
            this.isLoading = false
            this.isEmailVerified = true
           return
          }
          //@ts-ignore
          await this.loginUser(response)
          
          this.isRedirecting = true
          // if ( user.status != StatusUser.ACTIVE ) {
          // this.isRedirecting = false;
          // this.$auth.logout()
          // return
          // }

          setTimeout(() => {
            this.$nuxt.$router.push('/dashboard')
          }, 2000)
        })
        .catch(({ response } : any) => {
          let message = ErrorHandler(response)
          ;(this.errorMessage as string | undefined) = message
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  watch: {},
})
</script>

<style lang="postcss" scoped>
#remember-me-checkbox {
  &:not(:checked) + label {
    @apply bg-paperdazgray-400;
    & .overlay {
      @apply bg-paperdazgray-400 bg-opacity-20;
    }
  }
  &:checked + label {
    @apply bg-paperdazgreen-300;
    & .overlay {
      opacity: 1;
      @apply bg-paperdazgreen-300 bg-opacity-20;
    }
  }

  & + label {
    z-index: 2;
    & .overlay {
      z-index: -1;
      opacity: 0;
      @apply transition ease-in-out  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
    }

    &:hover .overlay {
      opacity: 1;
    }
  }
}
</style>
