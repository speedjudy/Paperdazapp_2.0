module.exports = {
  root: false,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/attribute-hyphenation': [
      'error',
      'never',
      {
        ignore: [],
      },
    ],
  },
}
