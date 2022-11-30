<template>
  <section class="bg-gradient-to-t from-white to-transparent">
    <div class="container py-20">
      <!-- show if verified -->
      <div class="reset-pass-section">
        <div class="container">
          <div class="row">
            <form @submit.prevent="submit" class="col-lg-6 md:order-2 order-1">
              <div class="left-form">
                <div class="form form-outer">
                  <div class="heading">
                    <h1>Welcome Back!</h1>
                    <h3 class="capitalize">{{ username }}</h3>
                  </div>
                  <h6>Create a password</h6>
                  <div class="form-group">
                    <label for="">New password</label>
                    <input
                      class="form-control"
                      v-model="user.password"
                      type="password"
                      :disabled="isLoading || isRedirecting"
                      required
                      placeholder="Password"
                    />
                    <span class="text-white text-[11px]"
                    v-if="ConfirmedPassword"
                    >
                      Password must contain alphabet, number, special character. length must be graeter than 8</span>
                  </div>
                  <div class="form-group">
                    <label for="">Retype new password</label>
                    <input
                      class="form-control"
                      type="password"
                      v-model="user.confirmPassword"
                      :disabled="isLoading || isRedirecting"
                      placeholder="Password"
                    />
                    <span class="text-white text-[11px]"
                    v-if="!isPasswordEqual"
                    >
                       Password does not match</span>
                  </div>
                  <button
                  class="h-10 w-full mt-4 text-black rounded-lg shadow px-5 text-sm bg-white disabled:bg-opacity-70"
                  :class="[isLoading ? 'cursor-progress' : '']"
                  :disabled="isLoading"
                >
                  <span class="inline-flex items-center gap-3">
                    <span>Register</span>
                    <transition name="fade" :duration="100">
                      <span v-show="isLoading" class="animate-spin">
                        <spinner-dotted-icon height="22" width="22" color="black"/>
                      </span>
                    </transition>
                  </span>
                </button>
                </div>
              </div>
            </form>
            <div class="col-lg-6 md:order-1 order-2">
              <div class="right-image">
                <img src="../static/card2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SignUpEmailVerify
      :verificationEmail="verificationEmail"
      v-model="showEmailVerification"
    />
  </section>
</template>

<script>
import Vue from 'vue'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import SvgIcon from '~/components/svg-icons/SvgIcon.vue'
import InputField from '~/components/widgets/InputField.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import PasswordField from '~/components/widgets/PasswordField.vue'
import login from '~/mixins/login'
import { ErrorHandler } from '~/components/functions/ErrorFunction'
import ExclamationIcon from '~/components/svg-icons/ExclamationIcon.vue'
import SignUpEmailVerify from '~/components/pdf/modals/SignUpEmailVerify.vue'
import SocialAuth from '~/components/auth/SocialAuth.vue'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'

export default Vue.extend({
  name: 'confirm-password',
  auth: false,
  mixins: [login],
  components: {
    SocialAuth,
    InputField,
    PasswordField,
    SvgIcon,
    CheckIcon,
    MessageAlertWidget,
    SpinnerDottedIcon,
    ExclamationIcon,
    SignUpEmailVerify,
    SocialAuth,
  },
  layout: 'landing',

  data() {
    return {
      confirmPassword: undefined,
      setDropDown: false,
      countrycode: '',
      country: '',
      dropDownContent: [],
      totalCountriesArray: [],
      isTeamLoggin: false,
      teamMemberLinkMessage: 'Already have an account?',
      showEmailVerification: false,
      ConfirmedPassword: false,
      verificationEmail: '',
      userParams: this.$route.query.verificationToken,
      decodedUserInfo: {},
      registered: false,
      user: {
        password: undefined,
        confirmPassword: undefined,
        action:"reset_password",
        token: "",
        isEmailVerified: true
      },
      isLoading: false,
      errorMessage: '',
      isRedirecting: false,
      acceptTermsConditions: false,
    }
  },
  watch: {
    'user.password': function () {
      this.checkPasswordStrength()
    },
  },
  computed: {
    username() {
      let userInfo = this.decodedUserInfo
      return (userInfo.firstName + ' ' + userInfo.lastName) || ""
    },
    isPasswordEqual(){
       return this.user.password == this.user.confirmPassword 
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$auth.logout()
    next()
  },
  mounted() {
    let encodedUser = jwt.verify(
      this.userParams,
      '+Erqnl5F0JnIsW++d9U0BfwpJ6w='
    )
    this.decodedUserInfo = {...encodedUser.data}
    console.log("garry-passowrd", {...encodedUser})
    this.user.token = jwt.sign(
      { data: this.decodedUserInfo.user_id },
      '+Erqnl5F0JnIsW++d9U0BfwpJ6w=')
  },
  methods: {
    checkPasswordStrength() {
      var charac = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
      var number = /[0-9]/
      var alphabet = /[A-Za-z]/

      if (
        charac.test(this.user.password) &&
        number.test(this.user.password) &&
        alphabet.test(this.user.password) &&
        this.user.password.length > 8
      ) {
        this.ConfirmedPassword = false
      } else {
        this.ConfirmedPassword = true
      }
    },
    cancleOut(e) {
      if (e.target.tagname != 'LI') {
        this.setDropDown = false
      }
    },
    termsConditionClick(event) {
      event.target.checked
        ? (this.acceptTermsConditions = true)
        : (this.acceptTermsConditions = false)
    },

    //method to submit the user data
    submit() {
      event?.preventDefault()

      // <-- checking if loading or redirecting -->
      if (this.isLoading) return

      this.isLoading = true
      this.errorMessage = ''


        if(this.user.confirmPassword !== this.user.password){
        return
        }
        let cloneUserData = this.user
        cloneUserData.newPassword = cloneUserData.password

        delete cloneUserData.password
        delete cloneUserData.confirmPassword
      // return
      this.$axios
        .$patch(`/users/1`, {...cloneUserData})
        .then(async (response) => {
           this.$nuxt.$router.push('/login')
        })
        .catch(({ response }) => {
          let message = ErrorHandler(response)
          this.errorMessage = message
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
})
</script>
<style lang="scss" scoped>
.dropdown {
  @apply absolute top-[100%] left-0 w-full bg-white;
  max-height: 150px;
  overflow-y: scroll;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: 1px 3px 5px rgba(203, 206, 206, 0.692);
}
.dropdown::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}
.dropdown::-webkit-scrollbar-thumb {
  @apply bg-paperdazgreen-400;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

.dropdown::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-transparent;
}
.dropdown > li {
  list-style-type: none;
  @apply py-2 px-1;
}
.custom-input {
  @apply w-12 text-center outline-none rounded-lg border-[1px] border-paperdazgray-200 mr-2;
}
.width-full {
  width: 100%;
  text-align: left;
}
</style>
