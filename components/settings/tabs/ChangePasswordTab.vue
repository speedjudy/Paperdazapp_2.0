<template>
  <section
    class="bg-white rounded-2xl px-10 py-11 flex-1 flex items-center justify-center"
  >
    <form class="w-full max-w-2xl mx-auto" @submit.prevent="submit">
      <h3
        class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-1 relative mb-12"
      >
        <span>Change Your Password</span>
        <button
          type="button"
          @click="editingDetails = !editingDetails"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 px-2 py-1"
        >
          <pen-icon v-show="!editingDetails" />
          <times-icon v-show="editingDetails" width="16" height="16" />
        </button>
      </h3>

      <div class="mb-7">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >Current Password</label
        >

        <el-input
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          show-password
          required
          v-model="formData.oldPassword"
          :disabled="!editingDetails || loading"
        ></el-input>
      </div>
      <div class="mb-7">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >New Password</label
        >
        <el-input
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          show-password
          required
          v-model="formData.password"
          :disabled="!editingDetails || loading"
        ></el-input>
      </div>
      <div class="mb-10">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >Confirm New Password</label
        >
        <el-input
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          show-password
          required
          v-model="formData.confirmPassword"
          :disabled="!editingDetails || loading"
        ></el-input>
        <small
          class="text-red-600 text-xs"
          v-show="
            editingDetails &&
            formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
          "
          >Password fields don't match
        </small>
      </div>

      <message-alert-widget
        :message="alertMessage.message"
        v-show="alertMessage.message && editingDetails"
        :type="alertMessage.isSuccess ? 'success' : 'error'"
        class="mb-8"
      />
      <div class="flex justify-center">
        <button
          class="disabled:opacity-50 disabled:cursor-not-allowed bg-paperdazgreen-300 text-white rounded-xl h-12 px-5 font-medium text-lg"
          v-show="editingDetails"
          :disabled="loading"
        >
          <span class="inline-flex gap-2 items-center">
            Update Password
            <span class="inline-block" v-show="loading && editingDetails">
              <spinner-dotted-icon
                class="animate-spin"
                height="18"
                width="18"
              />
            </span>
          </span>
        </button>
      </div>
    </form>
  </section>
</template>

<script >
import Vue from 'vue'
import PenIcon from '~/components/svg-icons/PenIcon.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import TimesIcon from '~/components/svg-icons/TimesIcon.vue'
import InputField from '~/components/widgets/InputField.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import PasswordField from '~/components/widgets/PasswordField.vue'
import mixins from 'vue-typed-mixins'
import login from '~/mixins/login'

export default mixins(login).extend({
  name: 'ChangePasswordTab',
  components: {
    InputField,
    PasswordField,
    PenIcon,
    TimesIcon,
    SpinnerDottedIcon,
    MessageAlertWidget,
    MessageAlertWidget
},
  data() {
    return {
      editingDetails: false,
      loading: false,
      formData: {
       oldPassword: '',
       password: '',
       confirmPassword: '',
      "isUpdatePassword":true,
      "test":'$2a$10$q2uLuYadYf5mars2wxBmruvdXPxDXXIoBvVffb39FQEeWVaI0Iurm'
      },
      alertMessage: {
        isSuccess: false,
        message: '',
      },
    }
  },
  methods: {
    submit(event) {
      event.preventDefault()

      if (
        this.loading ||
        !this.formData.oldPassword ||
        !this.formData.password ||
        !this.formData.confirmPassword ||
        this.formData.confirmPassword !== this.formData.password 
      )
        return

      this.loading = true
      this.alertMessage.message = ''

      let cloneFormData = this.formData

      delete cloneFormData.confirmPassword

      this.$axios
        .$patch(`/users/${(this.$auth.user).id}`, cloneFormData)
        .then(async (response) => {
          console.log("response",response)
          await this.$notify.success({
            message: 'Password updated successfully',
            title: 'Password Update',
          })

          // this.formData = {
          //   oldPassword: '',
          //   password: '',
          //   confirmPassword: '',
          //   "isUpdatePassword":true,
          //   "test":process.env.UPDATE_PASSWORD_TEST
          // }

          this.editingDetails = false
        })
        .catch((err) => {
          console.log('erroe',err)
          this.alertMessage.isSuccess = false
          this.alertMessage.message =
            err.response.data.message ||
            err.message ||
            'Unable to update password'
             this.editingDetails = true
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
</script>
