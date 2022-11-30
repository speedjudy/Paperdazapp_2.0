<template>
    <button
    :style="style"
    class="cursor-pointer inline-flex items-center gap-2 bg-paperdazgreen-300 py-1 pr-1 pl-2 tool-item text-white text-sm"
  >
    Sign
    <span
      class="inline-flex items-center justify-center px-2 py-2 bg-[#EAEAEA] text-paperdazgreen-300"
      ><svg
        width="12"
        height="12"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2869 8.24112L14.905 6.85919L9.42629 12.3281V0.400391H7.46611V12.3281L1.9972 6.84939L0.605469 8.24112L8.4462 16.0818L16.2869 8.24112Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </button>
</template>

<script>
    export default {
        props: {
    position: {
      type: Object,
      top: { type: Number, default: 0 },
      left: { type: Number, default: 0 },
    },
  },
  computed: {
    style() {
      return {
        top: `${this.position.top}px`,
        left: `${this.position.left}px`,
      }
    },
  },
    }
</script>

<style scoped>

</style>