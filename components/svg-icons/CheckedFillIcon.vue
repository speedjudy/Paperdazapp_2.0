<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" height="104" viewBox="0 0 107 104" fill="none">
        <path d="M53.5 0C23.9989 0 0 23.326 0 52C0 80.674 23.9989 104 53.5 104C83.0011 104 107 80.674 107 52C107 23.326 83.0011 0 53.5 0Z" fill="#77C360"/>
        <path d="M78.6775 41.1786L49.3593 68.8395C48.4797 69.6693 47.3251 70.087 46.1705 70.087C45.0159 70.087 43.8614 69.6693 42.9818 68.8395L28.3231 55.009C26.559 53.3454 26.559 50.6555 28.3231 48.9918C30.0863 47.3274 32.9365 47.3274 34.7006 48.9918L46.1705 59.8137L72.3 35.1614C74.0633 33.497 76.9134 33.497 78.6775 35.1614C80.4408 36.825 80.4408 39.5141 78.6775 41.1786Z" fill="#FAFAFA"/>
        </svg>
  </template>
  
  <script>
  import Vue from 'vue'
  export default Vue.extend({
    name: 'CheckFillIcon',
    props:['width', 'height']
  })
  </script>
  