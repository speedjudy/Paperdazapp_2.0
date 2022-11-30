<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
  >
    <path
      d="M4.66667 6.75H3.11111V8.25H4.66667V6.75ZM7.77778 6.75H6.22222V8.25H7.77778V6.75ZM10.8889 6.75H9.33333V8.25H10.8889V6.75ZM12.4444 1.5H11.6667V0H10.1111V1.5H3.88889V0H2.33333V1.5H1.55556C1.143 1.5 0.747335 1.65804 0.455612 1.93934C0.163888 2.22064 0 2.60218 0 3V13.5C0 13.8978 0.163888 14.2794 0.455612 14.5607C0.747335 14.842 1.143 15 1.55556 15H12.4444C12.857 15 13.2527 14.842 13.5444 14.5607C13.8361 14.2794 14 13.8978 14 13.5V3C14 2.60218 13.8361 2.22064 13.5444 1.93934C13.2527 1.65804 12.857 1.5 12.4444 1.5ZM12.4444 13.5H1.55556V5.25H12.4444V13.5Z"
    />
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'CalendarIcon',
  data() {
    return {
      hwRatio: 15 / 14,
    }
  },
})
</script>
