<template>
  <section class="bg-gradient-to-t from-white to-transparent">
    <div class="container py-20">
      <div
        class="w-full max-w-md mx-auto bg-white shadow-2xl rounded-xl px-6 py-10"
      >
        <h4 class="text-lg font-medium mb-8 text-center">
          Create your new password
        </h4>

        <form action="" class="text-sm" @submit.prevent="resetPassword">
          <message-alert-widget
            :message="errorMessage"
            v-show="errorMessage"
            type="error"
            class="mb-8"
          />
          <div class="mb-5">
            <label for="" class="mb-2 block text-sm font-medium text-gray-500"
              >New Password</label
            >
            <el-input
              v-model="user.password"
              :disabled="isLoading"
              type="password"
              show-password
              placeholder="New password"
              required
            />
            <transition name="fade">
              <ul
                class="password-confirmation-list mt-1"
                v-show="user.password"
              >
                <li>
                  <span class="circle circle-8 bg-white">
                    <check-icon
                      height="10"
                      width="10"
                      class="text-paperdazgreen-400"
                      v-show="user.password && user.password.length >= 8"
                    />
                    <times-icon
                      height="8"
                      width="8"
                      class="text-red-500"
                      v-show="!(user.password && user.password.length >= 8)"
                    />
                  </span>
                  <span>Password has to be at least 8 characters long.</span>
                </li>
                <li>
                  <span class="circle circle-8 bg-white">
                    <check-icon
                      height="10"
                      width="10"
                      class="text-paperdazgreen-400"
                      v-show="
                        user.password &&
                        containsCapital &&
                        containsSmall &&
                        containsSpecialCharacter
                      "
                    />
                    <times-icon
                      height="8"
                      width="8"
                      class="text-red-500"
                      v-show="
                        !(
                          user.password &&
                          containsCapital &&
                          containsSmall &&
                          containsSpecialCharacter
                        )
                      "
                    />
                  </span>
                  <span
                    >Password has to have symbols, capital and small
                    letters.</span
                  >
                </li>
              </ul>
            </transition>
          </div>
          <div class="mb-10">
            <label for="" class="mb-2 block text-sm font-medium text-gray-500"
              >Confirm new password</label
            >
            <el-input
              v-model="user.passwordConfirmation"
              :disabled="isLoading"
              type="password"
              show-password
              placeholder="Confirm new password"
              required
            />
          </div>

          <div class="flex flex-col items-center">
            <button
              class="h-10 rounded-lg shadow px-8 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
              :class="[isLoading ? 'cursor-progress' : '']"
              :disabled="isLoading"
            >
              <span class="inline-flex items-center gap-3">
                <span>Save</span>
                <transition name="fade" :duration="100">
                  <span v-show="isLoading" class="animate-spin">
                    <spinner-dotted-icon height="22" width="22" />
                  </span>
                </transition>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import SocialAuth from '~/components/auth/SocialAuth.vue'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import ExclamationIcon from '~/components/svg-icons/ExclamationIcon.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import SvgIcon from '~/components/svg-icons/SvgIcon.vue'
import TimesIcon from '~/components/svg-icons/TimesIcon.vue'
import InputField from '~/components/widgets/InputField.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import PasswordField from '~/components/widgets/PasswordField.vue'

export default Vue.extend({
  name: 'CreateNewPasswordPage',
  auth: 'guest',
  components: {
    SocialAuth,
    InputField,
    PasswordField,
    SvgIcon,
    SpinnerDottedIcon,
    ExclamationIcon,
    MessageAlertWidget,
    CheckIcon,
    TimesIcon,
  },
  layout: 'landing',
  data() {
    return {
      user: {
        password: undefined ,
        passwordConfirmation: undefined,
        action: "reset_password",
        token: this.$route.query.token,
      },
      isLoading: false,
      errorMessage: '',
    }
  },
  beforeMount(){
   if(!this.$route.query.token){
      this.$nuxt.$router.push("/login")
   }
  },
  computed: {
    containsCapital() {
      return /[A-Z]+/g.test(this.user.password || '')
    },
    containsSmall() {
      return /[a-z]+/g.test(this.user.password || '')
    },
    containsSpecialCharacter() {
      return /[^a-zA-Z0-9]+/g.test(this.user.password || '')
    },
  },
  methods: {
    resetPassword() {
      event?.preventDefault()
        
      this.isLoading = true

      if(this.user.passwordConfirmation !== this.user.password){
        this.errorMessage = "Password does not match"
        return
      }
      let cloneUserData = this.user
      cloneUserData.newPassword = cloneUserData.password

      delete cloneUserData.password
      delete cloneUserData.passwordConfirmation

      // console.log(cloneUserData)
      // return
      this.$axios.$patch('/users',{
        ...cloneUserData
      })
      .then((response)=>{
        this.$nuxt.$router.push("/login")
      })
      .catch(({response})=>{
         this.errorMessage = "Could not reset password"
      })
      .finally(()=>{this.isLoading = false})
    },
  },
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

.password-confirmation-list {
  @apply bg-paperdazgreen-400 text-white text-xs;
  & > li {
    @apply flex  gap-2 px-4 py-2.5;
  }
}
</style>
