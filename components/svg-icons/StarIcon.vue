<template>
  <svg
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 37 36"
    fill="none"
    class="fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36.9674 13.9044C36.8893 13.6711 36.682 13.501 36.4323 13.4656L24.4515 11.7715L19.0936 1.20869C18.9823 0.988309 18.7519 0.849121 18.5002 0.849121C18.2485 0.849121 18.0174 0.988309 17.9068 1.20869L12.5482 11.7721L0.567435 13.4662C0.317753 13.5017 0.11112 13.6711 0.0323073 13.9051C-0.0451803 14.1377 0.0190616 14.3941 0.199866 14.5649L8.86987 22.7873L6.82274 34.3979C6.78035 34.6395 6.88234 34.8837 7.08567 35.0281C7.29031 35.1737 7.56119 35.1924 7.78305 35.0771L18.5002 29.5959L29.216 35.0771C29.3127 35.1267 29.4193 35.1512 29.5246 35.1512C29.6617 35.1512 29.7981 35.1099 29.914 35.0281C30.118 34.8837 30.22 34.6395 30.177 34.3979L28.1305 22.7879L36.8005 14.5649C36.9807 14.3929 37.0456 14.137 36.9674 13.9044Z"
    />
  </svg>
  <!-- <img :height="fontSize * hwRatio" :width="fontSize / hwRatio" viewBox="0 0 37 36" src="../../assets/img/star.png" /> -->
</template>
<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'StarIcon',
  data() {
    return {
      hwRatio: 45 / 37,
    }
  },
})
</script>
