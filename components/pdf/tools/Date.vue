<template>
  <div class="tool">
    <p :style="style">{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    value: String,
  },
  computed: {
    style() {
      return {
        fontSize: `${this.fontSize || 11}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
