<template>
  <button class="fab-button" :class="[relativeToParent ? 'absolute' : 'fixed']">
    <plus-icon class="h-6 w-6 sm:h-8 sm:w-8" />
  </button>
</template>

<script>
import PlusIcon from '../svg-icons/PlusIcon.vue'
export default {
  components: { PlusIcon },
  props: {
    relativeToParent: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.fab-button {
  @apply bg-paperdazgreen-250 text-white
      inline-flex
      bottom-16
      right-5
      h-14
      w-14
      sm:right-10
      sm:h-16
      sm:w-16
      items-center 
      justify-center 
      shadow-lg;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
}
.fab-button:hover {
  @apply bg-paperdazgreen-70 text-white
}
</style>
