<template>
    <div>
       <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
</template>

<script>
    export default {
   name:"google-sign",
    head() {
    return {
        meta:[
            { name: 'google-signin-client_id', content:'287621881624-vdt9hrug587dva8hvla8dlhidc73kdbu.apps.googleusercontent.com' },
        ],
      script: [
        // ...
        {
          src: 'https://apis.google.com/js/platform.js',
          defer: true,
          async: true
        },
      ],
    }
  },
  methods:{
    onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
  }
    }
</script>

<style scoped>

</style>