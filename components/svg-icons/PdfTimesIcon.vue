<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <path
      d="M29 26.0793L26.0793 29L14.5 17.4207L2.92071 29L0 26.0793L11.5793 14.5L0 2.92072L2.92071 0L14.5 11.5793L26.0793 0L29 2.92072L17.4207 14.5L29 26.0793Z"
    />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'PdfTimesIcon',
})
</script>
