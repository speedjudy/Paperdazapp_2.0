import Vue from 'vue'

export default {
  methods: {
    clear() {
      console.log('Clear method needs to be over-written')
    },
    exportImage() {
      console.log('exportImage method needs to be over-written')
    },
    trimCanvas2(canvas: HTMLCanvasElement) {
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const length = pixels.data.length
      let topCoord = null
      let bottomCoord = null
      let leftCoord = null
      let rightCoord = null
      let x = 0
      let y = 0

      // Iterate over every pixel to find the highest one
      // and determine where it ends on the vertical axis.
      // Each pixel is represented as RGBA.
      for (let i = 0; i < length; i += 4) {
        // We inspect the alpha channel to check
        // if the pixel is fully transparent or not.
        if (pixels.data[i + 3] !== 0) {
          x = (i / 4) % canvas.width
          y = Math.trunc(i / 4 / canvas.width)

          if (topCoord === null) {
            // Since we inspect from top to bottom,
            // the initial not-transparent pixel must
            // be the `topBound` one.
            topCoord = y
          }

          if (leftCoord === null || x < leftCoord) {
            // Since we walk in the left-right top-bottom
            // direction, we need to find the lowest
            // x coordinate as the `leftCoord`.
            leftCoord = x
          }

          if (rightCoord === null || x > rightCoord) {
            // Since we walk in the left-right top-bottom
            // direction, we need to find the highest
            // x coordinate as the `rightCoord`.
            rightCoord = x
          }

          if (bottomCoord === null || bottomCoord < y) {
            bottomCoord = y
          }
        }
      }

      if(bottomCoord == null) return

      // If some value was left as `null`, we use `0`.
      topCoord = topCoord || 0
      bottomCoord = bottomCoord || 0
      leftCoord = leftCoord || 0
      rightCoord = rightCoord || 0

      // Calculate height and width. Add 20 pixels
      // for some negative space (i.e. padding) around
      // the canvas edges.
      const trimHeight = bottomCoord - topCoord + 20
      const trimWidth = rightCoord - leftCoord + 20
      const trimmed = ctx.getImageData(
        leftCoord,
        topCoord,
        trimWidth,
        trimHeight
      )

      canvas.width = trimWidth
      canvas.height = trimHeight
      ctx.putImageData(trimmed, 10, 10)
    },
    trimCanvas(c: HTMLCanvasElement) {
      let ctx = c.getContext('2d')
      let copy = document.createElement('canvas').getContext('2d')
      if (!ctx) return c
      let pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        i,
        bound = {
          top: null as any,
          left: null as any,
          right: null as any,
          bottom: null as any,
        },
        x,
        y

      for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
          x = (i / 4) % c.width
          y = ~~(i / 4 / c.width)
         
          if (bound.top === null) {
            bound.top = y
          }

          if (bound.left === null) {
            bound.left = x
          } else if (x < bound.left) {
            bound.left = x
          }

          if (bound.right === null) {
            bound.right = x
          } else if (bound.right < x) {
            bound.right = x
          }

          if (bound.bottom === null) {
            bound.bottom = y
          } else if (bound.bottom < y) {
            bound.bottom = y
          }
        }
      }
     if(bound.bottom == null) return

      var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight)

      if (!copy) return c
      copy.canvas.width = trimWidth
      copy.canvas.height = trimHeight
      copy.putImageData(trimmed, 0, 0)

      // open new window with trimmed image:
      return copy.canvas
    },
  },
}
