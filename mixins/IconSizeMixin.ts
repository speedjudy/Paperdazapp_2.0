import Vue from 'vue'
export default {
  data() {
    return {
      hwRatio: 1,
      fontSize: 16,
    }
  },
  mounted() {
    //@ts-ignore
    this.computeFontSize()
    //@ts-ignore
    window.addEventListener('resize', this.computeFontSize)
  },
  updated() {
    //@ts-ignore
    this.computeFontSize()
  },
  methods: {
    async computeFontSize() {
      //@ts-ignore
      await this.$nextTick()
      //@ts-ignore
      const style = getComputedStyle((this.$el as HTMLElement) || document)
      //@ts-ignore
      this.fontSize = parseFloat(style.fontSize)
    },
  },
  beforeDestroy() {
    //@ts-ignore
    window.removeEventListener('resize', this.computeFontSize)
  },
}
