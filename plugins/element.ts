import Vue from 'vue'
import {
  DropdownItem,
  DropdownMenu,
  Button,
  Dropdown,
  Notification,
  Dialog,
  Input,
  InputNumber,
  Select,
  Option,
  DatePicker,
  Loading,
} from 'element-ui'
// @ts-ignore
import lang from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
import locale from 'element-ui/lib/locale'
/// ///////////////////

import { Plugin } from '@nuxt/types'
import { ElNotification } from 'element-ui/types/notification'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $notify: ElNotification
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $notify: ElNotification
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $notify: ElNotification
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $notify: ElNotification
  }
}

const myPlugin: Plugin = (context, inject) => {
  // configure language
  locale.use(lang)

  // import componentsdropdownSize
  Vue.use(Dropdown)
  Vue.use(DropdownItem)
  Vue.use(DropdownMenu)
  Vue.use(Button)
  Vue.use(Dialog)
  Vue.use(Input)
  Vue.use(InputNumber)
  Vue.use(Select)
  Vue.use(DatePicker)
  Vue.use(Option)
  Vue.use(Loading)
  inject('notify', Notification)
}

export default myPlugin
