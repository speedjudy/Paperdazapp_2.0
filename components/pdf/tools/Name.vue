<template>
  <div class="tool">
    <p :style="style">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
  },
  // data: () => ({
  //   text: `${this.$auth.user.firstName} ${this.$auth.user.lastName}`,
  // }),
  computed: {
    text(){
      return `${this.$auth.user.firstName} ${this.$auth.user.lastName}`
    },
    style() {
      return {
        fontSize: `${this.fontSize || 12}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
