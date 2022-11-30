<template>
  <div>
    <transition name="fade" mode="out-in">
      <!-- Start:: registration form -->
      <form
        class=""
        v-if="displayingForm == 'register'"
        @submit.prevent="register"
      >
        <legend class="block text-center font-semibold mb-6">
          Signup to Paperdaz
        </legend>
        <message-alert-widget
          class="mb-7"
          :message="errorMessage"
          v-if="errorMessage"
          :type="'error'"
        />
        <div class="form-group">
          <label class="input-label" for="">First Name</label>
          <el-input
            :disabled="loading"
            required
            v-model="formData.firstName"
            placeholder="First Name"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Last Name</label>
          <el-input
            :disabled="loading"
            placeholder="Last Name"
            required
            v-model="formData.lastName"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Email</label>
          <el-input
            type="email"
            :disabled="loading"
            placeholder="Email"
            required
            v-model="formData.email"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Password</label>
          <el-input
            placeholder="Password"
            :disabled="loading"
            required
            show-password
            v-model="formData.password"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Confirm Password</label>
          <el-input
            placeholder="Confirm Password"
            required
            :disabled="loading"
            show-password
            v-model="confirmPassword"
          />
          <small
            v-show="
              formData.password &&
              confirmPassword &&
              confirmPassword != formData.password
            "
            class="text-red-500"
            >Passwords don't match</small
          >
        </div>
        <div class="flex justify-between text-xs mb-10">
          <div
            class="text-paperdazgray-400 font-medium flex items-center gap-2"
          >
            <input
             @input="checktermsAndCondition"
             id="remember-me-checkbox" type="checkbox" hidden />
            <label
              for="remember-me-checkbox"
              class="cursor-pointer circle circle-8 text-white relative"
            >
              <div class="overlay circle circle-18"></div>
              <check-icon
                class="relative"
                style="z-index: 1"
                height="8"
                width="8"
                />
            </label>
            <label for="remember-me-checkbox" class="cursor-pointer"
              >Accept
              <nuxt-link to="#" class="text-paperdazgreen-300"
                >terms and conditions</nuxt-link
              ></label
            >
          </div>
        </div>

        <div class="grid place-items-center mt-6">
          <button
            class="rounded-lg bg-paperdazgreen-400 text-white shadow text-sm h-10 px-6 disabled:bg-opacity-50"
            :disabled="loading"
          >
            <span class="inline-flex items-center gap-3">
              <span>Sign up</span>
              <transition name="fade" :duration="100">
                <span v-show="loading" class="animate-spin">
                  <spinner-dotted-icon height="22" width="22" />
                </span>
              </transition>
            </span>
          </button>
        </div>

        <p class="text-sm mt-5 text-center">
          Already have an account?
          <button
            class="text-paperdazgreen-400 disabled:cursor-not-allowed"
            @click="currentForm = 'login'"
            type="button"
            :disabled="loading"
          >
            Login
          </button>
        </p>
      </form>
      <!-- End:: registration form -->

      <!-- Start:: login form -->
      <form
        class=""
        v-else-if="displayingForm == 'login'"
        @submit.prevent="login"
      >
        <legend class="block text-center font-semibold mb-6">
          Login to Paperdaz
        </legend>

        <message-alert-widget
          class="mb-7"
          :message="errorMessage"
          v-if="errorMessage"
          :type="'error'"
        />
        <div class="form-group">
          <label class="input-label" for="">Email</label>
          <el-input
            v-model="formData.email"
            :disabled="loading"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Password</label>
          <el-input
            v-model="formData.password"
            :disabled="loading"
            placeholder="Password"
            required
            show-password
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
                style="z-index: 1"
                height="8"
                width="8"
              />
            </label>
            <label for="remember-me-checkbox" class="cursor-pointer"
              >Stay signed in</label
            >
          </div>
        </div>

        <div class="grid place-items-center mt-6">
          <button
            class="rounded-lg bg-paperdazgreen-400 text-white shadow text-sm h-10 px-6 disabled:bg-opacity-50"
            :disabled="loading"
          >
            <span class="inline-flex items-center gap-3">
              <span>Login</span>
              <transition name="fade" :duration="100">
                <span v-show="loading" class="animate-spin">
                  <spinner-dotted-icon height="22" width="22" />
                </span>
              </transition>
            </span>
          </button>
        </div>

        <p class="text-sm mt-5 text-center">
          Don't have an account?
          <button
            class="text-paperdazgreen-400 disabled:cursor-not-allowed"
            @click="currentForm = 'register'"
            type="button"
            :disabled="loading"
          >
            Register
          </button>
        </p>
      </form>
      <!-- End:: login form -->

      <!-- Start:: verify details form -->
      <form
        class=""
        v-else-if="displayingForm == 'confirm'"
        @submit="updateUserRecords"
      >
        <legend class="block text-center font-semibold mb-6">
          Confirm details on Paperdaz
        </legend>
        <message-alert-widget
          class="mb-7"
          :message="errorMessage"
          v-if="errorMessage"
          :type="'error'"
        />
        <div class="form-group">
          <label class="input-label" for="">First Name</label>
          <el-input
            placeholder="First Name"
            required
            :disabled="!edittingConfirmed"
            v-model="confirmFormData.firstName"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Last Name</label>
          <el-input
            placeholder="Last Name"
            required
            :disabled="!edittingConfirmed"
            v-model="confirmFormData.lastName"
          />
        </div>
        <div class="form-group">
          <label class="input-label" for="">Email</label>
          <el-input
            type="email"
            placeholder="Email"
            required
            :disabled="true"
            v-model="confirmFormData.email"
          />
        </div>
      

        <div class="flex items-center justify-center gap-6 mt-6">
          <button
            class="rounded-lg bg-gray-400 text-white shadow text-sm h-10 px-6 w-[100px]"
            type="button"
            v-show="!edittingConfirmed"
            @click.prevent="edittingConfirmed = true"
          >
            Edit
          </button>

          <button
            v-show="edittingConfirmed"
            class="rounded-lg bg-gray-400 text-white shadow text-sm h-10 px-6 w-[100px] disabled:bg-opacity-50 disabled:cursor-progress"
            :disabled="loading"
          >
            <span class="inline-flex items-center gap-3">
              <span>Save</span>
              <transition name="fade" :duration="100">
                <span v-show="loading" class="animate-spin">
                  <spinner-dotted-icon height="22" width="22" />
                </span>
              </transition>
            </span>
          </button>

          <button
            class="rounded-lg bg-paperdazgreen-400 text-white shadow text-sm h-10 w-[100px] px-6 disabled:cursor-not-allowed disabled:bg-opacity-50"
            @click.prevent="verifyConfirmForm"
            :disabled="edittingConfirmed"
          >
            Next
          </button>
        </div>

        <p class="text-sm mt-5 text-center">
          Use another account?
          <button
            class="text-red-700 disabled:cursor-not-allowed"
            :disabled="loading"
            type="button"
            @click="logout"
          >
            Logout
          </button>
        </p>
      </form>
      <!-- End:: verify details form -->
    </transition>

    <SignUpEmailVerify :verificationEmail="verificationEmail" v-model="showEmailVerification"/>
  </div>
</template>

<script >
import Vue from 'vue'
import mixins from 'vue-typed-mixins'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import axios from "axios"
import login from "~/mixins/login"
import { ErrorHandler } from '~/components/functions/ErrorFunction'
import { mapState } from 'vuex'
import SignUpEmailVerify from '~/components/pdf/modals/SignUpEmailVerify.vue'

export default mixins(login).extend({
  components: { CheckIcon, SpinnerDottedIcon, MessageAlertWidget, SignUpEmailVerify },
  name: 'PackageBasicInfoTab',
  data() {
    return {
      // register, login, confirm
      checkTermsandCondition: false,
      currentForm: 'confirm',
      confirmEmail: false,
      loading: false,
      errorMessage: '',
      showEmailVerification: false,
      verificationEmail:'',
      formData: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      },
      confirmPassword: '',
      edittingConfirmed: false,
      confirmFormData: {
        firstName: '',
        lastName: '',
        email: '',
      } ,
    }
  },
  beforeMount() {
    this.filterUsers()
    this.initializeAuthUserData()
  },
  computed: {
    ...mapState(['setPackage','createPackage']),
    user() {
      return this.$auth.user
    },
    displayingForm() {
      if(!this.$auth.loggedIn) this.$nuxt.$router.push(`/register?hasPackageId=${this.setPackage.id}`)
      alert(this.$auth.loggedIn ? 'confirm' : this.currentForm)
      return this.$auth.loggedIn ? 'confirm' : this.currentForm
    },
  },
  methods: {
    async confirmCompanyEmailInDatabase(){
      console.log(this.confirmFormData)
     await this.$axios.get(`/users/?email=${this.confirmFormData.companyEmail}`)
     .then((response)=>{
      console.log(response.data)
       if(response.data.total == 0){
          this.$store.commit('PACKAGE_INFO', {
          ...this.setPackage,
          companyName: this.confirmFormData.companyName,
          companyEmail: this.confirmFormData.companyEmail
        })
        this.confirmEmail = true
       }
       else{
        this.errorMessage = 'Company email already exist.'
       }
     })
    },
    checktermsAndCondition(event){
       this.checkTermsandCondition = event.target.checked
    },
    initializeAuthUserData() {
      if (!this.$auth.loggedIn) return
      for (const key of Object.keys(this.confirmFormData)) {
        this.confirmFormData[key] = (this.$auth.user || {})[key]
      }
    },
    async verifyConfirmForm() {
      for (const key of Object.keys(this.confirmFormData)) {
        if (!this.confirmFormData[key]) {
          this.errorMessage = 'All fields are required.'
          return
          }
      }


      this.$emit('next-tab')

    },
    updateUserRecords() {
      event?.preventDefault()

      if (this.loading) return
     
      let userId = this.$auth.user.id
         let reducedFormData = {
         firstName : this.confirmFormData.firstName,
         lastName : this.confirmFormData.lastName,
         }
      this.loading = true
      this.errorMessage = ''
      this.$axios
        .$patch(`/users/${userId}`, reducedFormData)
        .then(async () => {
          this.filterUsers()
          this.edittingConfirmed = false
          this.$notify.success({
          title: 'Data write',
          message: 'Data updated successfully!',
          })
        })
        .catch(({response}) => {
          let message = ErrorHandler(response)
          this.errorMessage = message
        })
        .finally(() => {
          this.loading = false
        })
    },
    login() {
      event?.preventDefault()
      // debugger

      if (this.loading) return

      this.loading = true
      this.errorMessage = ''

      this.$auth
        .loginWith('local', {
          data: {
            email: this.formData.email,
            password: this.formData.password,
            "strategy": "local"
          },
        })
        .then((response) => {
           this.loginUser(response)
           this.initializeAuthUserData()

          this.$notify({
            title: 'Authentication',
            message: 'Logged in successfully',
          })
        })
        .catch(({response}) => {
          this.errorMessage = ErrorHandler(response)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async logout() {
      await this.$auth.logout()
      this.$notify({
        title: 'Authentication',
        message: 'Sucessfully logged out',
        type: 'success',
      })
    },
    register() {
      event?.preventDefault()
      if (
        this.formData.password &&
        this.formData.password !== this.confirmPassword
      )
        return

      if (this.loading || !this.checkTermsandCondition) return

      this.loading = true
      this.errorMessage = ''

      const data = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        email: this.formData.email,
        password: this.formData.password,
      }

      this.$axios.post('/users', data)
        .then(async( response ) => {
          this.showEmailVerification = true,
          this.verificationEmail = response.data.email,
          console.log("papapapapapapapa",response)
          this.loading = false
        })
        .catch(({response}) => {
          let message = ErrorHandler(response)
          this.errorMessage = message
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  watch: {
    displayingForm() {
      this.errorMessage = ''
      this.formData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      }
      this.confirmPassword = ''
      this.edittingConfirmed = false
      this.confirmFormData = {
        firstName: '',
        lastName: '',
        email: '',
        companyEmail: '',
        companyName: '',
      }
    },
    "$auth.user" : function(){
     this.initializeAuthUserData()  
    }
  },
})
</script>

<style lang="scss" scoped>
form {
  @apply p-6 rounded-xl border-4 border-paperdazgreen-400 bg-white;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.input-label {
  @apply font-medium text-sm block;

  & + * {
    @apply mt-1;
  }
}

.form-group {
  &:not(:last-child) {
    @apply mb-5;
  }
}
</style>
