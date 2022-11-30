<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 36 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <path
      d="M12.7639 34.4401C11.6707 34.4401 10.6286 33.963 9.91315 33.1283L0.903652 22.6092C-0.445485 21.0337 -0.263107 18.6624 1.31128 17.3122C2.88498 15.9606 5.25439 16.1431 6.60513 17.7195L12.4951 24.5959L31.1103 2.13175C33.9918 -1.90753 37.0078 0.329253 34.1135 4.38579L15.8181 32.8667C15.147 33.8066 14.0815 34.3852 12.9291 34.4363C12.8735 34.4386 12.8187 34.4401 12.7639 34.4401Z"
    />
  </svg>
</template>
<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'PdfTickIcon',
  data() {
    return {
      hwRatio: 35 / 36,
    }
  },
})
</script>
