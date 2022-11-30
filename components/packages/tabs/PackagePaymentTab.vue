<template>
  <div class="">
    <div class="flex flex-wrap gap-3 md:grid md:grid-cols-8">
      <div class="col-span-1"></div>
      <div class="col-span-2">
        <package-card
          :edited="false"
          :create="false"
          show-bottom-button
          class="package-card-check-width"
          :style="{ '--count': 1 }"
          @bottom-button-clicked="$emit('next-tab', $event)"
          :stagingPackage="stagingPackage"
          :disableStart = "true"
        />
      </div>
      <div class="col-span-4">
        <form class="bg-paperdazgreen-400" @submit="submit">
          <div class="form-group">
            <div v-if="tooltip" class="absolute p-2 bg-white text-sm rounded-lg border -mt-16 w-[400px]">
               Enter the name you want visitors to search for your business.
               <div class="rotate-45 bg-white w-[20px] h-[20px]" data-popper-arrow="" style="position: absolute;top:41px; left: 180px;"></div>
            </div>
            <label class="input-label font-bold" for=""
              >Create business hook  &nbsp;&nbsp;&nbsp;
              <svg
                @mouseover="tooltip = true"
                @mouseleave="tooltip = false"
                class="inline"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-bs-toggle="tooltip" title="Hi! I'm tooltip"
              >
                <path
                  d="M12.1094 0C5.42202 0 0 5.42397 0 12.1094C0 18.7987 5.42202 24.2188 12.1094 24.2188C18.7967 24.2188 24.2188 18.7987 24.2188 12.1094C24.2188 5.42397 18.7967 0 12.1094 0ZM12.1094 5.37109C13.242 5.37109 14.1602 6.28926 14.1602 7.42188C14.1602 8.55449 13.242 9.47266 12.1094 9.47266C10.9768 9.47266 10.0586 8.55449 10.0586 7.42188C10.0586 6.28926 10.9768 5.37109 12.1094 5.37109ZM14.8438 17.7734C14.8438 18.097 14.5814 18.3594 14.2578 18.3594H9.96094C9.63735 18.3594 9.375 18.097 9.375 17.7734V16.6016C9.375 16.278 9.63735 16.0156 9.96094 16.0156H10.5469V12.8906H9.96094C9.63735 12.8906 9.375 12.6283 9.375 12.3047V11.1328C9.375 10.8092 9.63735 10.5469 9.96094 10.5469H13.0859C13.4095 10.5469 13.6719 10.8092 13.6719 11.1328V16.0156H14.2578C14.5814 16.0156 14.8438 16.278 14.8438 16.6016V17.7734Z"
                  fill="black"
                />
              </svg>
            </label>
            <el-input
              :disabled="loading"
              placeholder="Name Surname"
              required
              v-model="hook"
            />
            <div class="text-xs text-red-600 py-1">{{ hookMessage }}</div>
          </div>
          <div class="h-1 bg-black"></div>
          <div class="h-4"></div>
          <div class="grid mb-10">
            <label class="input-label font-bold" for="">
              Credit Card
              <img class="float-right inline w-[134px]" src="~/assets/img/payment.png" />
            </label>
          </div>
          <message-alert-widget
            class="mb-7"
            :message="errorMessage"
            v-if="errorMessage"
            :type="'error'"
          />

          <!-- <div class="form-group">
            <label class="input-label" for="">Company name</label>
            <el-input
              :disabled="loading"
              placeholder="Name Surname"
              required
              v-model="companyName"
            />
          </div> -->
          <div class="form-group">
            <label class="input-label" for="">Name of card holder</label>
            <el-input
              :disabled="loading"
              placeholder="Name Surname"
              required
              v-model="name"
            />
          </div>
          <div class="form-group">
            <label class="input-label" for="">Card Number</label>
            <el-input
              :disabled="loading"
              placeholder="0000-0000-0000-0000"
              :value="cardNumberWithDashes"
              @input="inputCardNumber"
              required
            />
          </div>
          <div class="grid gap-5 grid-cols-2">
            <div class="form-group">
              <label class="input-label" for="">Expiration Date</label>
              <el-input
                :disabled="loading"
                placeholder="MM/YY"
                required
                :value="expirationDateWithSlashes"
                @input="inputExpirationDate"
              />
            </div>
            <div class="form-group">
              <label class="input-label" for="">CVC</label>
              <el-input
                :disabled="loading"
                placeholder="000"
                required
                v-model="cvv"
                type="password"
                maxlength="3"
              />
            </div>
          </div>

          <div class="grid place-items-center mt-6">
            <button
              class="rounded-lg bg-white shadow text-sm h-10 px-6 disabled:bg-opacity-50 w-full"
              :disabled="loading"
            >
              <span class="inline-flex items-center gap-3">
                <span>Pay via Stripe</span>
                <transition name="fade" :duration="100">
                  <span v-show="loading" class="animate-spin">
                    <spinner-dotted-icon height="22" width="22" />
                  </span>
                </transition>
              </span>
            </button>
          </div>
        </form>
      </div>
      <div class="col-span-1"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import PaymentIcon from '~/components/svg-icons/PaymentIcon.vue'
import MessageAlertWidget from '~/components/widgets/MessageAlertWidget.vue'
import login from '~/mixins/login'
import { ErrorHandler } from '~/components/functions/ErrorFunction'
import PackageCard from '~/components/settings/PackageCard.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
export default Vue.extend({
  components: { SpinnerDottedIcon, MessageAlertWidget, PackageCard },
  name: 'PackagePaymentTab',
  data() {
    return {
      loading: false,
      errorMessage: '',
      cardNumberWithDashes: '',
      name: '',
      cvv: '',
      cardId: undefined,
      expirationDateWithSlashes: '',
      hook: '@',
      hookMessage: '',
      companyName: '',
      tooltip : false
    }
  },
  props: {
    stagingPackageInfo: {
      type: Object,
      default: () => ({}),
    },
    packages: {
      type: Array,
      default: () => [],
    },
  },
  async beforeMount() {
    !this.$auth.loggedIn ? this.notLoggedIn() : null
    // if (Object.keys(this.stagingPackageInfo).length < 1)
    // this.$nuxt.$router.go(-1)
  },
  computed: {
    ...mapState(['setPackage', 'createPackage']),
    packageData() {
      let newPackageData
      let {
        name,
        paperlink,
        teamMembers,
        monthlyPrice,
        id,
        isMonthly,
        userId,
        yearlyPrice,
        publicProfile,
        companyLedger,
        activationCode,
        cc,
        companyName,
        companyEmail,
      } = this.setPackage
      if (this.createPackage && this.createPackage == true) {
        newPackageData = {
          plan: isMonthly ? 'monthly' : 'yearly',
          action: 'subscribe',
          companyName,
          companyEmail,
          custom: {
            name,
            paperlink,
            teamMembers,
            publicProfile,
            companyLedger,
            cc,
          },
        }
        return newPackageData
      } else if (this.createPackage == false) {
        newPackageData = {
          packageId: id,
          action: 'subscribe',
          companyName,
          companyEmail,
          plan: isMonthly ? 'monthly' : 'yearly',
        }
        return newPackageData
      }
    },
    cardNumber() {
      return this.cardNumberWithDashes.replace(/-+/g, '')
    },
    expirationDateString() {
      return this.expirationDateWithSlashes.split('/').join('') || ''
    },
    expYear() {
      return this.expirationDateString.split('').splice(2, 4).join('')
    },
    expMonth() {
      return this.expirationDateString.split('').splice(0, 2).join('')
    },
    stagingPackage() {
      return this.$store.state.setPackage
    },
  },
  methods: {
    notLoggedIn() {
      localStorage.setItem(
        'package-not-loggedin',
        JSON.stringify(this.setPackage)
      )
      localStorage.setItem('create-package-not-loggedin', this.createPackage)
      this.$nuxt.$router.push('/register')
    },
    inputCardNumber(val) {
      let temp = val.replace(/(-+)|([^0-9]+)/g, '')
      this.cardNumberWithDashes = (temp.match(/.{1,4}/g) || []).join('-')
    },
    inputExpirationDate(val) {
      let temp = val.replace(/\/+|[^0-9]+/g, '')
      if (temp.length > 4) return

      // Check if the month is greater than 12
      if (temp.length === 2) {
        if (Number(temp) > 12) temp = '0' + temp
        if (Number(temp) == 0) temp = '01'
      }

      if (temp.length == 4 && Number(temp.substring(2, 4)) == 0) {
        temp = temp.substring(0, 2) + '01'
      }

      let finalVal = (temp.match(/.{1,2}/g) || []).join('/')
      this.expirationDateWithSlashes = finalVal
    },
    updateCard(id, data) {
      return this.$axios.$patch(`/card/${id}`, data).catch((error) => {
        let message = ''
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message
        } else {
          message = 'Server not reachable'
        }
        this.errorMessage = message
        this.loading = false
      })
    },

    async submit(event) {
      event?.preventDefault()

      if (this.hookMessage) return

      if (!this.expYear || !this.expMonth || isNaN(this.cvv)) {
        this.errorMessage = 'Please review the inputed information'
        return
      }

      //code to check if name contains special symbols
      var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
      this.errorMessage = 'Name not correct'
      if (format.test(this.name.trim())) return

      var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
      this.errorMessage = 'Company name not correct'
      if (format.test(this.companyName.trim())) return

      if (this.loading) return

      const userId = (this.$auth.user || { id: '' }).id

      const data = {
        card_holder_name: this.name,
        card_number: this.cardNumber,
        exp_year: this.expYear,
        exp_month: this.expMonth,
        cvv: this.cvv,
      }
      console.log(data)
      this.loading = true
      this.errorMessage = ''

      let proceedToPayment = false

      await this.$axios
        .$post('/cards', data)
        .then((response) => {
          console.log(response)
          let { id } = response
          this.cardId = id
          proceedToPayment = true
        })
        .catch(async ({ response }) => {
          this.errorMessage = ErrorHandler(response)
          this.loading = false
        })

      if (!proceedToPayment) {
        this.loading = false
        return
      }

      this.$axios
        .$post('/subscriptions', {
          ...this.packageData,
        })
        .then(async () => {
          this.$notify.success({
            title: 'Package Subscription',
            message: 'You have successfully subscribed for this package',
          })
          setTimeout(() => {
            this.$nuxt.$router.push('/dashboard')
          }, 1000)
        })
        .catch(async ({ response }) => {
          this.errorMessage = ErrorHandler(response)
          await this.$axios.$delete(`/cards/${this.cardId}`)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  mounted() {
    // console.log(this.packages[0].name, "packages");
    console.log(this.$store.state.setPackage.name, 'packages')
    console.log(this.stagingPackage.name, 'packages')

    // if (this.$auth?.user?.role == UserTypeEnum.TEAM) {
    //   this.errorMessage =
    //     'Proceeding to payment as a team member, payment may not reflect on the account. create a free account to access payment'
    // }
  },
  watch: {
    hook: function () {
      if (!this.hook.startsWith('@'))
        this.hookMessage = 'hook must start with @'
      this.$axios
        .get(`/users?hook=${this.hook}`)
        .then((response) => {
          const { data } = response.data
          if (Array.isArray(data) && data.length) {
            console.log('not-empty', data)
          }
          this.hookMessage = ''
        })
        .catch((err) => {
          this.hookMessage = err.message
        })
    },
  },
})
</script>

<style lang="scss" scoped>
form {
  @apply p-6 rounded-xl border-4 border-paperdazgreen-400;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.input-label {
  @apply font-bold text-sm block;

  & + * {
    @apply mt-1;
  }
}

.form-group {
  &:not(:last-child) {
    @apply mb-5;
  }
}
</style>
