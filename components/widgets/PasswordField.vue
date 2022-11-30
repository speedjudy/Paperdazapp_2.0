<template>
  <div
    class="input-field flex items-center"
    :class="[
      focus ? 'border-paperdazgray-500' : 'border-paperdazgray-200',
      showAsError ? 'error' : '',
    ]"
  >
    <input
      ref="inputField"
      v-model="value"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      class="outline-none focus:outline-none border-none flex-1 h-full disabled:cursor-not-allowed"
      :required="required"
      :disabled="disabled"
      @focus="focus = true"
      @focusout="focus = false"
    />
    <span
      class="cursor-pointer"
      :class="{ 'text-paperdazgray-300': !showPassword }"
      @click="showPassword = !showPassword"
    >
      <eye-icon v-if="showPassword" />
      <eye-slashed-icon v-else />
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import EyeIcon from '../svg-icons/EyeIcon.vue'
import EyeSlashedIcon from '../svg-icons/EyeSlashedIcon.vue'
export default Vue.extend({
  name: 'PasswordField',
  components: { EyeIcon, EyeSlashedIcon },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showAsError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPassword: false,
      value: undefined,
      focus: false,
    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    },
  },
  mounted() {},
})
</script>
<style lang="postcss" scoped>
.input-field {
  @apply w-full
                rounded-xl
                px-2
                border 
                bg-white
                h-10
                focus:outline-none;
  &.error {
    @apply border-red-300 focus:border-red-600 focus:border-opacity-70 text-red-600 placeholder-red-300;

    & > input {
      @apply placeholder-red-300;
    }
  }
}
</style>
