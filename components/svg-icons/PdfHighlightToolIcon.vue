<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 40 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <path
      d="M31.5052 0C30.5687 0 29.6676 0.335013 28.9785 1.02267L18.7123 11.2846L28.6957 21.2469L38.9796 11.0025C40.3401 9.6272 40.3401 7.40554 38.9796 6.01259L33.9613 1.02267C33.2722 0.335013 32.3887 0 31.5052 0ZM17.016 12.9597L6.48481 23.4685C5.10657 24.8438 5.10657 27.0655 6.52015 28.4937C4.36444 30.6625 2.17338 32.8312 0 35H10.0011L11.5207 33.4836C12.899 34.8237 15.1077 34.806 16.4859 33.4484L26.9994 22.9395"
    />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'PdfHighlightToolIcon',
  data() {
    return {
      hwRatio: 35 / 40,
    }
  },
})
</script>
