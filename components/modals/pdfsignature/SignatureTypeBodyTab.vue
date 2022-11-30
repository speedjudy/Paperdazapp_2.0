<template>
  <div class="">
    <input
      type="text"
      ref="inputElement"
      v-model="textValue"
      id="pdf-signature-type-input-box"
      class="w-full bg-white border-b-2 border-paperdazgreen-400 cursor-text mt-2 py-3 px-5 rounded outline-none text-4xl sm:text-5xl caret-paperdazgreen-400 min-h-[110px]"
      :style="{
        color: activeColor,
        fontFamily: updatedFontFamily,
      }"
    />
    <div class="mt-6 flex items-center gap-3">
      <select v-model="currentFont" class="w-52 max-w-full py-2 px-1 rounded">
        <option value="" disabled hidden selected>Select Font</option>
        <option v-for="font in fonts" :key="font.key" :value="font.key">
          {{ font.family }}
        </option>
      </select>

      <transition name="fade" duration="50">
        <span
          v-show="loadingFont || $fetchState.pending"
          class="animate-spin text-paperdazgreen-400"
          ><spinner-dotted-icon height="20" width="20"
        /></span>
      </transition>
    </div>
  </div>
</template>

<script>
import mixins from 'vue-typed-mixins'
import SignatureBodyMixin from '~/mixins/SignatureBodyMixin'
import _ from 'lodash'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'

export default mixins(SignatureBodyMixin).extend({
  components: { SpinnerDottedIcon },
  name: 'SignatureTypeBodyTab',
  data() {
    return {
      textValue: '',
      activeColor: '#000',
      loading: false,
      loadingFont: false,
      currentFont: '',
      fonts: [],
      updatedFontFamily: '',
    }
  },
  async mounted() {
    await this.$nextTick()
    ;(this.$refs.inputElement).focus()

    this.changeFont = _.debounce(this.changeFont, 300)
  },

  async fetch() {
    const user = this.$auth.user
    this.textValue = `${user.first_name} ${user.last_name}`
    await this.getFonts()
  },
  computed: {
    currentFontObject() {
      const fonts = this.fonts
      const font = fonts.find((el) => el.key == this.currentFont)

      if (!font) return undefined

      return font
    },
  },
  methods: {
    getFonts() {
      return this.$axios
        .$get(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.$config.googleFontsApiKey}`
        )
        .then((response) => {
          const getWeightName = (weight) => {
            let rv = weight

            const values = {
              '100': 'thin',
              '200': 'extralight',
              '300': 'light',
              '500': 'medium',
              '600': 'semibold',
              '700': 'bold',
              '800': 'extrabold',
              '900': 'black',
            }

            for (const val in values) {
              rv = rv.replace(val, `${values[val]}-`)
            }

            return rv.replace(/-+$/, '')
          }
          for (const item of response.items) {
            const family = item.family
            for (const weight in item.files) {
              this.fonts.push({
                family: `${family} (${getWeightName(weight)})`,
                familyName: family,
                fontWeight: weight,
                file: item.files[weight].replace('http://', 'https://'),
                key: `${family} ${getWeightName(weight)}`,
              })
            }
          }

          let currentFont = 'Dancing Script semibold'
          if (!this.fonts.some((el) => el.key == currentFont)) {
            currentFont = this.fonts.length > 0 ? this.fonts[0].key : ''
          }

          if (currentFont) this.currentFont = currentFont
        })
    },
    clear() {
      this.textValue = ''
    },
    exportImage() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const text = this.textValue
      const fontSize = 100
      const VERTICAL_EXTRA_SPACE = 5
      const HORIZONTAL_EXTRA_SPACE = 2
      const dpr = window.devicePixelRatio || 1

      if (!ctx) return
      ctx.font = `${fontSize}px "${this.updatedFontFamily}"`

      const {
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        width,
      } = ctx.measureText(text)

      const canvasHeight =
        Math.max(
          Math.abs(actualBoundingBoxAscent) +
            Math.abs(actualBoundingBoxDescent),
          (Math.abs(fontBoundingBoxAscent) || 0) +
            (Math.abs(fontBoundingBoxDescent) || 0)
        ) * VERTICAL_EXTRA_SPACE
      canvas.height = canvasHeight

      // Take the larger of the width and the horizontal bounding box
      // dimensions to try to prevent cropping of the text.
      const canvasWidth =
        Math.max(
          width,
          Math.abs(actualBoundingBoxLeft) + actualBoundingBoxRight
        ) * HORIZONTAL_EXTRA_SPACE
      canvas.width = canvasWidth

      // Set the font again, since otherwise, it's not correctly set when filling.
      ctx.font = `${fontSize}px "${this.updatedFontFamily}"`
      ctx.textBaseline = 'top'
      ctx.font = `${fontSize * dpr}px "${this.updatedFontFamily}"`
      ctx.fillStyle = this.activeColor

      ctx.fillText(text, canvasWidth / 4, canvasHeight / 4)

      const trimmedCanvas = this.trimCanvas(canvas)

      this.$emit('export-image', trimmedCanvas.toDataURL())
    },

    changeFont() {
      this.loadingFont = true
      const currentFontObject = this.currentFontObject
      if (!currentFontObject) return
      // @ts-ignore
      const dynFont = new FontFace(
        currentFontObject.key,
        `url(${currentFontObject.file})`
      )

      dynFont
        .load()
        .then((loadedFont) => {
          // @ts-ignore
          document.fonts.add(loadedFont)
          this.updatedFontFamily = currentFontObject.key
        })
        .finally(() => {
          this.loadingFont = false
        })
    },
  },
  watch: {
    currentFontObject() {
      this.changeFont()
    },
  },
})
</script>
