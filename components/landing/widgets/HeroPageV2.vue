<template>
  <div class="container py-14 sm:pb-15 sm:pt-10">
    <div
      class="grid grid-cols-1 sm:grid-cols-[1fr,max-content] gap-2 sm:gap-2 md:gap-3 lg:gap-5"
    >
      <div class="text-center sm:text-left">
        <div class="max-w-[740px] flex flex-col justify-between h-full">
          <div class="py-4">
            <h1 class="font-bold text-4xl md:text-5xl leading-[42px] md:leading-[62px] text-paperdazgreen-300 text-left">
              Paperdaz is today’s Paper
            </h1>
            <div class="mb-12 mt-5 font-medium text-md lg:text-2xl">
              <p class="text-left">Provide Paperdaz anytime anywhere for clients to complete. Save time and money for everyone!</p>
            </div>
          </div>
          <div class="py-4">
            <h3 class="font-bold text-md lg:text-2xl text-left">
              3 Simple steps to go Paperless 
            </h3>
            <div class="mt-7 mb-2">
              <div class="flex flex-wrap gap-2 md:gap-3 lg:gap-4 justify-center sm:justify-start">
                <div class="rounded drop-shadow-md bg-white cursor-pointer">
                  <div class="flex flex-wrap gap-2 py-2 px-3 md:px-3 lg:px-4">
                    <div class="rounded-full bg-paperdazgreen-300 text-white font-medium w-6 text-center">1</div>
                    <div class="text-paperdazgreen-300">Register</div>
                  </div>
                </div>
                <div class="rounded drop-shadow-md bg-white cursor-pointer">
                  <div class="flex flex-wrap gap-2 py-2 px-3 md:px-3 lg:px-4">
                    <div class="rounded-full bg-paperdazgreen-300 text-white font-medium w-6 text-center">2</div>
                    <div class="text-paperdazgreen-300">Upload</div>
                  </div>
                </div>
                <div class="rounded drop-shadow-md bg-white cursor-pointer">
                  <div class="flex flex-wrap gap-2 py-2 px-3 md:px-3 lg:px-4">
                    <div class="rounded-full bg-paperdazgreen-300 text-white font-medium w-6 text-center">3</div>
                    <div class="text-paperdazgreen-300">Paperdaz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-fit">
        <img
          class="w-screen max-h-[600px] sm:max-w-[270px] md:max-w-[320px] lg:max-w-[470px]"
          src="/img/hero_v2.svg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({ name: 'HeroPage' })
</script>
