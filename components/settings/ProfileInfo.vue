<template>
  <div class="bg-white p-6 rounded-2xl border border-paperdazgreen-400">
    <h3
      class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-1 relative mb-7"
    >
      <span>{{ headerText }} </span>
      <button
        @click="editingDetails = !editingDetails"
        type="button"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 px-2 py-1"
      >
        <pen-icon v-show="!editingDetails" />
        <times-icon v-show="editingDetails" width="16" height="16" />
      </button>
    </h3>
    <component
      :editingDetails="editingDetails"
      :is="formComponent"
      @stop-editing="editingDetails = false"
      class="mt-4"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import PenIcon from '../svg-icons/PenIcon.vue'
import InputField from '../widgets/InputField.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import UserForm from '~/components/settings/forms/UserForm.vue'
import CompanyForm from '~/components/settings/forms/CompanyForm.vue'
import TimesIcon from '../svg-icons/TimesIcon.vue'

export default Vue.extend({
  name: 'ProfileInfo',
  components: { PenIcon, InputField, TimesIcon },
  data() {
    return {
      editingDetails: false,
    }
  },
  computed: {
    userType() {
      return this.$store.getters.userType
    },
    
    headerText() {
      switch (this.userType) {
        case UserTypeEnum.FREE:
          return 'Personal Profile'
        case UserTypeEnum.PAID:
          return 'Company Profile'
        case UserTypeEnum.TEAM:
          return 'Team Profile'
        default:
          return ''
      }
    },
    formComponent() {
      switch (this.userType) {
        case UserTypeEnum.FREE:
          return UserForm
        case UserTypeEnum.PAID:
          return CompanyForm
        case UserTypeEnum.TEAM:
          return CompanyForm
        default:
          return {
            render(createElement) {
              return createElement(
                'h1',
                'Loading....'
              )
            },
          }
           return UserForm
      }
    },
  },
})
</script>
