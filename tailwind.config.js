const plugin = require('tailwindcss/plugin')
module.exports = {
  // mode: 'jit',
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '375px',
        xs: '425px',
      },
      colors: {
        paperdazgreen: {
          50: '#EEF7EC',
          70: '#a6e480',//hover
          100: '#EAFFE5',
          200: '#ebf4e5',
          230: '#c8ebb2',
          250: '#84C870',
          300: '#77C360',
          400: '#77B550',
          500: '#62A44E',
          700: '#009549',
        },
        paperdazgray: {
          100: '#E3E3E3',
          200: '#E2E4E8',
          300: '#9E9E9E',
          400: '#949494',
          500: '#414142',
          600: '#373737',
          700: '#272727',
        },
      },
      fontSize: {
        xxs: '.625rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities, e, theme, variants }) => {
      addUtilities({
        '.flex-gap-wrapper': {
          overflow: 'auto',
        },
        // This bit might need some work if you use a custo,
        // prefix. See https://tailwindcss.com/docs/plugins#manually-prefixing-selectors
        // for more info on manual prefixing complex selectors.
        '[class*="flex-gap-"]:not([class*="flex-gap-wrapper"])': {
          margin: 'calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap))',
          '& > *': {
            margin: 'calc(var(--gap)) 0 0 calc(var(--gap))',
          },
        },
      })

      Object.entries(theme('gap')).forEach(([key, value]) => {
        addUtilities(
          {
            [`.flex-gap-${e(key)}`]: {
              '--gap': value,
            },
          },
          variants('gap')
        )
      })
    }),
  ],
}
