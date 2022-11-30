<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize"
    viewBox="0 0 39 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <rect width="39" height="5" transform="matrix(1 0 0 -1 0 5)" />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'PdfRectangleToolIcon',
  data() {
    return {
      hwRatio: 5 / 39,
    }
  },
})
</script>
