<template>
  <div class="tool-identifier" :style="style">2021-12-04</div>
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

<style lang="scss" scoped>
@import '../scss/identifier.scss';
</style>
