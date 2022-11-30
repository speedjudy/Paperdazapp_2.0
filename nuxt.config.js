const webpack = require('webpack')
import redirectSSL from 'redirect-ssl'

export default {
  loadingIndicator: {
    name: 'chasing-dots',
    color: 'black',
    background: 'white',
  },
  target: 'static',
  ssr: false,
  generate: {
    fallback: true,
  },
  server: {
    host: '0.0.0.0',
    // port: 3000,
    plugins: ['~/plugins/masked-input.js'],
  },
  privateRuntimeConfig: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'some_encryption_key',
  },
  publicRuntimeConfig: {
    APP_URL: process.env.APP_URL,
    countryApiKey: process.env.COUNTRY_STATE_CITY_API_KEY,
    googleFontsApiKey: process.env.GOOGLE_FONTS_API_KEY,
    // recaptcha: {
    //   /* reCAPTCHA options */
    //   siteKey: process.env.RECAPTCHA_SITE_KEY, // for example
    // },
  },
  env: {
    API_URL: process.env.API_URL,
    APP_URL: process.env.APP_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    HOMEPAGE_LANDING_QR_CODE_DATA: process.env.HOMEPAGE_LANDING_QR_CODE_DATA,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Paperdaz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon.png' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://site-assets.fontawesome.com/releases/v6.1.1/css/all.css',
      },
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js',
      },
    ],
  },

  router: {
    middleware: ['auth'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/styles.scss',
    '~assets/element_extension.scss',
    '~/components/script/css/splide.min.css',
  ],

  vendor: ['jquery'],
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/element.ts',
    '~/plugins/vue-carosel.client.js',
    // '~/plugins/tawkto.client.js',
    '~/plugins/axios',
    // "~plugins/slider.client.js",
    { src: '~/plugins/nuxt-hammer.js', ssr: false },
    { src: '~/plugins/bus.js' },
    { src: '~/plugins/paginate.js'},
    { src: '~/plugins/outside-click.js' },
    { src: '~/plugins/html2pdf.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    // '@nuxtjs/tailwindcss',
    '@nuxt/postcss8',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // '@nuxtjs/firebase',
    '@nuxtjs/toast',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
          measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        },
        services: {
          auth: true,
        },
      },
    ],
    [
      '@nuxtjs/recaptcha',
      {
        // hideBadge: false, // Hide badge element (v3 & v2 via size=invisible)
        // language: 'en', // Recaptcha language (v2)
        siteKey: '6LeE3ZAUAAAAANVaDO60w4ZBK44khqO7OpsitZNY', // Site key for requests
        version: 3, // Version
      },
    ],
  ],
  axios: {
    baseURL: process.env.NEW_API_URL,
    // baseURL: 'http://localhost:3030',
    // baseURL:'http://c477-197-211-58-30.ngrok.io/',
  },
  auth: {
    watchLoggedIn: false,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/dashboard',
    },
    strategies: {
      local: {
        token: {
          property: 'accessToken',
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: '/authentication',
            method: 'post',
          },
          user: false,
          logout: false,
        },
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'Paperdaz',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'standalone',
      scope: '/',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: { compact: true },
    extend(config) {
      config.module.rules.push({
        test: /\.(pdf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/pdf/[name].[hash:8].[ext]',
        },
      })
    },
    postcss: {
      plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  serverMiddleware: [
    { path: '/auth', handler: '~/server-middleware/passport.ts' },
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],
}
