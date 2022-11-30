import Vue from 'vue'
const BUS = new Vue()
// Vue.prototype.$BUS = BUS

export default ({ app }, inject) => {
  inject('BUS', BUS)
}
