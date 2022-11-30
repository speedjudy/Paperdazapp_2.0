<template>
  <div class="my-8 font-family">
    <section class="relative shadow">
      <h4
        class="px-5 text-4xl lg:text-5xl text-black font-semibold absolute inline-block transform top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span class="text-paperdazgreen-400">Let`s Be</span> Partners
      </h4>
      <img
        src="~/assets/img/world_map.svg"
        alt=""
        class="w-full max-w-full max-h-80 min-h-[250px] object-cover"
      />
    </section>

    <!-- lets be partners content -->
    <section class="px-4">
      <div class="w-full text-[1.3rem] font-bold text-center px-2 py-8">
        Let’s make a difference together!
      </div>

      <div class="flex flex-wrap justify-center items-center">
        <form
        ref="form"
          @submit.prevent="onSubmit"
          class="md:w-5/12 lg:w-4/12 mx-3 sm:w-8/12 px-1 flex justify-center flex-wrap md:order-1 order-2 border-2 border-paperdazgreen-400 rounded-lg"
        >
          <div class="partner-field">
            <label>First Name <i>*</i></label>
            <input
              type="text"
              required
              v-model="partner.firstName"
              placeholder="First name"
            />
          </div>
          <div class="partner-field">
            <label>Last Name <i>*</i></label>
            <input
              type="text"
              required
              v-model="partner.lastName"
              placeholder="Last name"
            />
          </div>
          <div class="partner-field">
            <label>Email Address <i>*</i></label>
            <input
              type="email"
              required
              v-model="partner.email"
              placeholder="Email address"
            />
          </div>

          <div class="partner-field">
            <label>Message <i>*</i></label>
            <textarea
              v-model="partner.message"
              required
              placeholder="Message..."
            ></textarea>
          </div>

          <message-alert-widget
            :message="errorMessage"
            v-show="errorMessage"
            type="error"
            class="my-2 w-[80%] ml-[0%]"
          />

          <div class="w-10/12">
            <button
              :class="[isLoading ? 'opacity-60' : 'opacity-100']"
              :disabled="isLoading"
              class="w-full rounded-sm py-2 my-3 mb-4 text-white bg-paperdazgreen-500 text-[17px] flex justify-center items-center"
            >
              <span class="mr-2">Send</span>
              <transition name="fade" :duration="100">
                <span v-show="isLoading" class="animate-spin">
                  <SpinnerDottedIcon height="22" width="22" />
                </span>
              </transition>
            </button>
          </div>
        </form>

        <div
          class="px-4 md:w-5/12 sm:w-8/12 md:px-[4%] flex flex-wrap justify-center md:order-2 order-1"
        >
          <p class="font-normal text-[1rem] py-4 w-full">
            Small actions have a way of adding up to something big. When you
            find a solution to an existing problem that helps reduce your
            environmental footprint and saves energy and time, we all win
            without sacrificing anything.
          </p>
          <p class="text-[1.3rem] font-bold py-4 text-center w-10/12">
            Social Influencers, Bloggers, Non profit organizations
          </p>
          <p class="font-normal text-[1rem] py-4 w-full">
            We welcome all types of partnerships that can help spread our
            mission to the world. If you believe in our concept, please contact
            us!
          </p>
        </div>
      </div>
    </section>
    <!-- end of lets be partners content -->
  </div>
</template>

<script>
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'

export default {
  name: 'partners',
  layout: 'landing',
  auth: false,
  components: {
    SpinnerDottedIcon,
    MessageAlertWidget,
  },
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      partner: {
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        type: 'customer',
      },
    }
  },
  methods: {
    async onSubmit() {
      //  <-- validating user name -->
      let inValidName = false
      var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
      if (
        format.test(this.partner.firstName.trim()) ||
        format.test(this.partner.lastName.trim())
      ) {
        this.$refs.form.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        this.errorMessage = 'Name format not correct'
        inValidName = true
      }

      if (inValidName) return

      if (this.isLoading) return

      this.isLoading = true

      await this.$axios
        .post('/customer-support', {
          ...this.partner,
        })
        .then(() => {
          this.$notify.success({
            title: 'Partners',
            message: 'Partner registered successfully',
          })
          this.errorMessage = ''

          this.partner.firstName = ''
          this.partner.lastName = ''
          this.partner.email = ''
          this.partner.message = ''
        })
        .catch((err) => {
          this.errorMessage = 'Unable to register, try again later '
        })
        .finally(() => {
          this.isLoading = false
        })
      console.log(this.partner)
    },
  },
}
</script>

<style lang="scss" scoped>
.partner-field {
  @apply w-10/12 py-2;
  label {
    @apply block font-semibold text-[1rem] py-2 relative;
    i{
      @apply text-red-500 absolute top-3 ml-1
    }
  }
  input {
    @apply w-full text-[0.85rem] py-2 px-3 border-2 border-paperdazgray-200 rounded-md;
  }
  textarea {
    @apply outline-none resize-none w-full h-[200px] border-2 border-paperdazgray-200 rounded-md p-4 text-[0.8rem];
  }
}
.font-family {
  font-family: inherit !important;
}
</style>
