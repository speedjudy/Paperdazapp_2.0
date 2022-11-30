<template>
  <div
    class="message-alert-widget text-white border px-4 py-3 rounded-lg text-xs flex items-center gap-2 font-medium"
    :class="{ [type]: true }"
  >
    <div class="icon-container p-1.5 bg-gray-100 bg-opacity-90 rounded-md">
      <exclamation-icon
        width="12"
        height="12"
        v-if="type === 'info' || type === 'error'"
      />
      <!-- <times-icon width="10" height="10" v-else-if="type === 'error'" /> -->
      <check-icon width="10" height="10" v-else />
    </div>
    <div class="flex-1">
      <slot :message="message">
        <div class="w-full flex justify-between gap-3 items-center">
          <p class="flex-1">{{ message }}</p>
          <div>
            <span class="animate-spin inline-block" v-show="isLoading">
              <spinner-dotted-icon height="22" width="22" />
            </span>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import CheckIcon from '../svg-icons/CheckIcon.vue'
import ExclamationIcon from '../svg-icons/ExclamationIcon.vue'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import TimesIcon from '../svg-icons/TimesIcon.vue'
export default Vue.extend({
  components: { ExclamationIcon, CheckIcon, TimesIcon, SpinnerDottedIcon },
  name: 'MessageAlertWidget',
  props: {
    // info, error, success
    type: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="postcss" scoped>
.message-alert-widget {
  &.info {
    @apply bg-yellow-600 bg-opacity-80 border-yellow-600;
    & .icon-container {
      @apply text-yellow-600 text-opacity-80;
    }
  }
  &.error {
    @apply bg-red-600 bg-opacity-80 border-red-600;
    & .icon-container {
      @apply text-red-600 text-opacity-80;
    }
  }
  &.success {
    @apply bg-green-600 bg-opacity-80 border-green-600;
    & .icon-container {
      @apply text-green-600 text-opacity-80;
    }
  }
}
</style>
