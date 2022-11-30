<template>
  <section class="bg-gradient-to-t from-white to-transparent">
    <div class="container py-20">
      <div
        class="w-full max-w-md mx-auto bg-white shadow-2xl rounded-xl px-6 py-10"
      >
        <h4 class="text-lg font-medium mb-2">Reset Your Password</h4>

        <p class="text-gray-500 text-xs mb-8">
          Fear not. We'll email you instructions to reset your password.
        </p>

        <form action="" class="text-sm" @submit.prevent="onSubmit">
          <message-alert-widget
            :message="alertMessage.message"
            v-show="alertMessage.message"
            :type="alertMessage.isSuccess ? 'success' : 'error'"
            class="mb-8"
          />
          <div class="mb-5">
            <label for="" class="mb-2 block text-sm font-medium text-gray-500"
              >EMAIL</label
            >
            <el-input
              v-model="user.email"
              :disabled="isLoading"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>

          <p class="text-xs text-paperdazgreen-400 mb-10">
            Enter the email associated with your account
          </p>
          <!-- <recaptcha /> -->

          <div class="flex flex-col items-center">
            <button
              class="h-10 rounded-lg shadow px-5 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
              :class="[isLoading ? 'cursor-progress' : '']"
              :disabled="isLoading"
            >
              <span class="inline-flex items-center gap-3">
                <span>Reset Password</span>
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
import InputField from '~/components/widgets/InputField.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import PasswordField from '~/components/widgets/PasswordField.vue'

export default Vue.extend({
  name: 'LoginPage',
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
  },
  layout: 'landing',
  data() {
    return {
      user: {
        email: undefined,
        action:"forgot_password"
      },
      isLoading: false,
      alertMessage: {
        isSuccess: false,
        message: '',
      },
    }
  },
  // async mounted() {
  //   try {
  //     await this.$recaptcha.init()
  //   } catch (e) {
  //     console.error(e)
  //   }
  // },
  // beforeDestroy() {
  //   this.$recaptcha.destroy()
  // },
  methods: {
    onSubmit() {
      event?.preventDefault()

      if (!this.user.email || this.isLoading) return

      this.isLoading = true
      this.alertMessage.message = ''

      this.$axios
        .$post(`/users`, this.user)
        .then((response) => {
          this.alertMessage.isSuccess = true
          this.alertMessage.message =
            response.message.replace("token", 'link') ||
            'A password reset email has been sent to your mail check your mail to reset it'
          this.user.email = ''
          localStorage.removeItem('redirect_paperdaz_path')
          localStorage.removeItem('paperdaz_userID')
          localStorage.removeItem('main_user_paperdaz_token')
        })
        .catch(({response}) => {
          this.alertMessage.isSuccess = false
          console.log(response)
          this.alertMessage.message = response.data.message || 'unable to reset password'
        })
        .finally(() => {
          this.isLoading = false
        })

      // this.$nuxt.$router.push('/create-new-password')
    },
    // async onSubmit() {
    //   try {
    //     const token = await this.$recaptcha.execute('login')
    //     console.log('ReCaptcha token:', token)

    //     // send token to server alongside your form data
    //   } catch (error) {
    //     console.log('Login error:', error)
    //   }
    // },
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
</style>
