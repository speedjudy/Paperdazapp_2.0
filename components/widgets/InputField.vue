<template>
  <input
    type="text"
    class="input-field"
    :class="{ error: showAsError }"
    placeholder=""
    @input="$emit('input', $event.currentTarget.value)"
  />
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'InputField',
  props: {
    showAsError: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="postcss" scoped>
.input-field {
  @apply w-full disabled:cursor-not-allowed
                rounded-xl
                px-2
                border border-paperdazgray-200
                bg-white
                h-10
                focus:outline-none focus:border-paperdazgray-500;
  &.error {
    @apply border-red-300 focus:border-red-600 focus:border-opacity-70 text-red-600 placeholder-red-300;
  }
}
</style>
