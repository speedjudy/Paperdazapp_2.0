<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 35 35"
    fill="none"
    class="stroke-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle r="15" transform="matrix(1 0 0 -1 17.5 17.5)" stroke-width="5" />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'HollowCircleIcon',
})
</script>
