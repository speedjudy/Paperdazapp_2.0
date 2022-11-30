<template>
  <section>
    <div class="container pt-20">
      <h1 class="font-bold text-4xl text-center mb-2">
        Be SOCIAL RESPONSIBLE together
      </h1>
      <p
        class="font-semibold text-center text-sm text-paperdazgray-300 mx-auto max-w-md mb-6"
      >
        Keep everyone safe and the world green!
      </p>
    </div>
    <div class="container flex">
      <img
        class="img"
        src="/img/motion-first-part.svg"
        alt=""
        style="margin-top: 80px"
      />
      <div class="animation flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 550 102"
          fill="none"
          class="w-full"
        >
          <path
            id="path"
            d="M1.58008 100.792C22.5217 60.8613 91.4514 -14.4219 199.638 3.89312C334.871 26.7869 414.733 96.0012 548.901 3.89312"
            stroke="#487C38"
            stroke-width="2.12965"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="5.32 5.32"
          />
        </svg>

        <svg
          id="email"
          width="35"
          height="35"
          viewBox="0 0 29 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M10.1999 15.6288L8.55032 14.2462L5.95268 17.7586C5.94455 17.7697 5.93654 17.781 5.92919 17.7925C5.5717 18.3456 5.47498 18.907 5.65716 19.3728C5.81494 19.7769 6.16137 20.0664 6.6327 20.1877L6.63286 20.1878C6.85599 20.2452 7.10664 20.2648 7.37776 20.2458C7.39152 20.2449 7.40525 20.2435 7.41872 20.2417L11.7489 19.6635L11.3351 17.5512C11.2243 16.9865 10.6409 15.9984 10.1999 15.6288Z"
              fill="#77C360"
            />
            <path
              d="M27.8474 7.26331L12.3207 16.4313C12.4606 16.7366 12.5655 17.0362 12.6173 17.2996L14.0616 24.6695C14.2556 25.6595 14.7768 25.934 15.07 26.0095C15.3321 26.077 16.0088 26.1298 16.6329 25.1643L27.4858 8.37177C27.7291 7.99515 27.8513 7.61478 27.8474 7.26331Z"
              fill="#77C360"
            />
            <path
              d="M11.6585 15.3049L27.186 6.13642C27.0656 6.06796 26.9314 6.01406 26.7852 5.9764C26.5617 5.91886 26.311 5.89934 26.0399 5.91833L6.09434 7.31138C5.03906 7.3852 4.7163 7.90524 4.6178 8.20854C4.51927 8.512 4.47515 9.12244 5.28586 9.80175L11.0417 14.626C11.2471 14.7984 11.4588 15.0349 11.6585 15.3049Z"
              fill="#77C360"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect
                width="22.3205"
                height="22.3205"
                fill="white"
                transform="translate(6.53125 0.761719) rotate(14.4394)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <img class="img" src="/img/motion-second-part.svg" alt="" />
    </div>
    <div class="flex -mt-5">
      <img class="flex-1 w-full" src="/bg/bg.svg" alt="" />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'LandingJoinSection',
})
</script>

<style lang="scss" scoped>
.img {
  width: 20%;
}
.img:first {
  align-self: end;
  transform: translateX(5px);
}
.img:last-child {
  margin-left: -32px;
  margin-top: 20px;
}
@media screen and (max-width: 450px) {
  .img:last-child {
    margin-top: 40px;
  }
}
.animation {
  display: flex;
  align-items: flex-start;
  padding-top: 83px;
}
</style>
