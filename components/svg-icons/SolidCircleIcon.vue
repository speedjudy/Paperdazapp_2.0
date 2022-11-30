<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <path
      d="M16 8.5C16 3.80558 12.4183 0 8 0C3.58172 0 0 3.80558 0 8.5C0 13.1944 3.58172 17 8 17C12.4183 17 16 13.1944 16 8.5Z"
    />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'SolidCircleIcon',
})
</script>
