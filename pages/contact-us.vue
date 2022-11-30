<template>
  <div>
    <section class="relative shadow">
      <div
        class="px-5 text-center text-black absolute inline-block transform top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        <h4 class="text-4xl lg:text-5xl font-semibold whitespace-nowrap">
          <span class="text-paperdazgreen-400">Contact</span>
          Us
        </h4>
        <p class="text-[#414142] font-medium">
          Have any questions? We'd love to hear from you.
        </p>
      </div>
      <img
        src="~/assets/img/world_map.svg"
        alt=""
        class="w-full max-w-full max-h-80 min-h-[250px] object-cover"
      />
    </section>
    <section class="container card-containers">
      <article
        class="contact-us-card"
        v-for="card in cards"
        :key="card.id"
        @mouseover="currentActiveCard = card.id"
        @mouseleave="currentActiveCard = 2"
        :class="{ active: card.id === currentActiveCard }"
      >
        <header>
          <h4 class="card-header">{{ card.heading }}</h4>
        </header>

        <div class="body">
          {{ card.content }}
        </div>

        <button class="button" @click="handleCommand(card.command || '')">
          {{ card.buttonText }}
        </button>
      </article>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'ContactUsPage',
  layout: 'landing',
  auth: false,
  head() {
    return {
      script: [
        // ...
        {
          hid: 'tawk.to',
          src: 'https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg',
          defer: true,
        },
      ],
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },
  data() {
    return {
      currentActiveCard: 2,
      cards: [
        {
          id: 1,
          heading: 'Partnership',
          content:
            "Let's strategically partner to keep everyone SAFE while reducing carbon footprint in the world we live in.",
          buttonText: 'CONTACT US',
          command: 'partners',
        },
        {
          id: 2,
          heading: "FAQ's & Support",
          content:
            'Our support team is spread across the globe to give you answers fast. We also have answers ready for many of freuqntly asked questions.',
          buttonText: "VISIT FAQ's",
          command: 'faq',
        },
        {
          id: 3,
          heading: 'Chat with us',
          content: 'Our team is ready to answer any questions you may have.',
          buttonText: 'INITIATE CHAT',
          command: 'tawk',
        },
      ],
    }
  },
  methods: {
    mouseHover(id) {},
    handleCommand(command) {
      switch (String(command).toLowerCase()) {
        case 'faq':
          this.$nuxt.$router.push('/faq')
          break
          case 'partners':
          this.$nuxt.$router.push('/partners')
          break
        case 'tawk':
          ;(Tawk_API)?.toggle()
          // ;(
          //   document.querySelector('.tawk-button') as HTMLButtonElement
          // )?.click()
          break
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.header {
  @apply text-2xl lg:text-3xl text-paperdazgreen-400 mb-1.5 lg:mb-2 font-semibold;
}

.body {
  @apply text-[#414142] font-medium text-sm lg:text-base;
}

.card-containers {
  @apply py-9;
  --col-counts: 1;
  display: grid;
  grid-template-columns: repeat(var(--col-counts), 1fr);
  gap: 24px;

  @media only screen and (min-width: 768px) {
    @apply py-20;
    --col-counts: 3;
  }
  @media only screen and (min-width: 1024px) {
    gap: 32px;
  }
}

.contact-us-card {
  @apply shadow;
  --accent-color: #e6af23;
  --scaling-factor: 1.05;
  border: 1px solid rgba(0, 0, 0, 0.17);
  border-top: 3px solid var(--accent-color);
  max-width: 100%;
  transition: all 0.3s ease-in-out;
  background: white;
  transform: scale(1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  z-index: 1;
  padding: 32px 16px;

  @media only screen and (min-width: 768px) {
    --scaling-factor: 1.2;
    box-shadow: 0px 10px 18px 10px rgba(75, 75, 75, 0.15);
    // border: none;
  }

  & .card-header {
    @apply text-center text-[#414142] text-xl font-semibold mb-8;
  }

  & .body {
    @apply text-center  font-normal mb-6;
    flex: 1;
    font-size: 13px;
  }

  & > .button {
    @apply w-full h-10 text-sm font-semibold rounded-full;
    color: var(--accent-color);
    border: 1px solid var(--accent-color);
    transition: all 0.3s ease-in-out;
  }
}

.contact-us-card.active {
  --accent-color: #77b550;
  transform: scale(var(--scaling-factor));
  z-index: 2;
  & > .button {
    color: white;
    background: var(--accent-color);
  }
}
</style>
