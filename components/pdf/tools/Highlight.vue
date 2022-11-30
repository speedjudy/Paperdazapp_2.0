<template>
  <svg preserveAspectRatio="none" :viewBox="viewBox" :style="style">
    <path
      options="opacity"
      :x="x1"
      :y="y1"
      :y2="y2"
      :x2="x2"
      :d="d"
      stroke-linecap="round"
      style="fill: rgb(255, 255, 0); opacity: 0.4; stroke-width: 0"
    ></path>
  </svg>
</template>

<script>
export default {
  props: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
  },
  computed: {
    d() {
      return `M${this.x1},${this.y1}L${this.x2},${this.y1}L${this.x2},${this.y2}L${this.x1},${this.y2}`
    },
    style() {
      return {
        width: `${this.width}px`,
      }
    },
    viewBox() {
      let x1 = Math.min(this.x1, this.x2)
      let y1 = this.y2 < this.y1 ? this.y2 : this.y1 //Math.min(this.y1, this.y2) : Math.max(this.y1, this.y2)
      return `${x1} ${y1} ${this.width} ${this.height}`
    },
    width() {
      return Math.abs(this.x2 - this.x1)
    },
    height() {
      return Math.abs(this.y2 - this.y1)
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
