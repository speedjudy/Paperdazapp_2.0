<template>
  <section>
    <transition name="fade" mode="out-in">
      <div
        v-if="$fetchState.pending"
        class="w-full min-h-[600px] bg-white rounded-lg grid place-items-center"
      >
        <spinner-dotted-icon class="text-paperdazgreen-400/30 animate-spin" />
      </div>
      <div class="flex gap-4 flex-col lg:flex-row" v-else>
        <div
          class="lg:max-w-[300px] rounded-3xl bg-white py-6 px-8 lg:self-start grid place-items-center"
        >
          <package-card
            v-if="stagingPackage && Object.keys(stagingPackage).length > 0"
            :lockPrice="$auth.user.package_type"
            :stagingPackage="stagingPackage"
          />
        </div>
        <div class="flex-1 rounded-3xl bg-white py-6 px-8 overflow-hidden">
          <h3
            class="text-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-1 relative mb-4"
          >
            Billing
          </h3>

          <div class="w-full overflow-x-auto custom-scrollbar">
            <table
              id="billing-table"
              class="w-full table-auto text-[#909090] text-sm"
            >
              <tbody>
                <tr style="border-bottom: none;">
                  <td
                    class="text-base font-bold"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    PLAN
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    {{ stagingPackage.name }}
                  </td>
                  <td rowspan="4">
                    <div class="grid place-items-center h-full w-full">
                      <p class="mb-2">
                        <button
                        @click="showSubscriptionFunction"
                         class="billing-action-button">Upgrade</button>
                      </p>
                      <p>
                        <button
                          class="billing-action-button"
                          :class="[ !isSubscription ? 'cancel' : '']"
                          @click="showCancelSubscriptionModal = true"
                        >
                          {{ isSubscription ? 'Activate' : "Cancle" }}
                        </button>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr style="border-bottom: none;">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Subscription
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    ${{
                      $auth.user.package_type == 'yearly'
                        ? stagingPackage.yearlyPrice
                        : stagingPackage.monthlyPrice
                    }}
                    USD /
                    <span>{{
                      $auth.user.package_type == 'yearly' ? 'Year' : 'Month'
                    }}</span>
                  </td>
                </tr>
                <tr style="border-bottom: none;">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Billing cycle
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    {{ (stagingPackage.startDate || '').substring(0, 10) }} To
                    {{ (stagingPackage.endDate || '').substring(0, 10) }}
                  </td>
                </tr>
                <tr style="border-bottom: none;">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    CHARGE
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    {{ (stagingPackage.plan || '')}}
                  </td>
                </tr>
                <tr style="border-bottom: none;">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Auto Subscribe
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    {{ stagingPackage.isCancelled == 0 ? 'ACTIVE' : 'NON-ACTIVE' }}
                  </td>
                </tr>
                <tr style="border-bottom: none;">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Payment Type
                  </td>
                  <td
                    style="padding-top: 2px; padding-bottom: 2px;"
                    class="capitalize"
                  >
                    {{ stagingPackage.paymentType }}
                  </td>
                </tr>
                <tr>
                  <td class="whitespace-nowrap text-sm" style="padding-top: 0;">
                    Next payment
                  </td>
                  <td style="padding-top: 0;">
                    {{ (stagingPackage.endDate || '').substring(0, 10) }}
                  </td>
                </tr>
                <tr
                  :style="[
                    hasAdditionalFeatures ? { borderBottom: 'none' } : {},
                  ]"
                >
                  <td class="text-base font-bold">ADDITIONAL FEATURES</td>
                  <td></td>
                  <td :rowspan="checkAddedFeatures ? 5 : 1">
                    <div class="grid place-items-center h-full w-full">
                      <p :class="[checkAddedFeatures ? 'mb-2' : '']">
                        <button
                          class="billing-action-button"
                          @click="showAdditionalFeatureModal = true"
                        >
                          {{ checkAddedFeatures ? 'Update' : 'Add' }}
                        </button>
                      </p>
                      <p v-if="checkAddedFeatures">
                        <button
                          class="billing-action-button cancel"
                          @click="showDeleteFeatureModal = true"
                        >
                          Delete
                        </button>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr style="border-bottom: none;" v-if="checkAddedFeatures">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Paperlinks
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    <div class="grid grid-cols-[min-content,1fr] gap-1">
                      <span class="inline-block w-[4ch]"
                        >+{{ stagingPackage.additional_paperlink }}</span
                      >
                      <span
                        >${{ stagingPackage.additional_paperlink }} USD</span
                      >
                    </div>
                  </td>
                </tr>
                <tr style="border-bottom: none;" v-if="checkAddedFeatures">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Team Members
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    <div class="grid grid-cols-[min-content,1fr] gap-1">
                      <span class="inline-block w-[4ch]"
                        >+{{ stagingPackage.additional_teamMembers }}</span
                      >
                      <span
                        >${{ stagingPackage.additional_teamMembers }} USD</span
                      >
                    </div>
                  </td>
                </tr>
                <tr style="border-bottom: none;" v-if="checkAddedFeatures">
                  <td
                    class="text-sm"
                    style="padding-top: 2px; padding-bottom: 2px;"
                  >
                    Carbon Copy (CC) Flow
                  </td>
                  <td style="padding-top: 2px; padding-bottom: 2px;">
                    <div class="grid grid-cols-[min-content,1fr] gap-1">
                      <span class="inline-block w-[4ch]"
                        >+{{ stagingPackage.additional_cc }}</span
                      >
                      <span>${{ stagingPackage.additional_cc }} USD</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="checkAddedFeatures">
                  <td class="whitespace-nowrap text-lg">Total Cost:</td>
                  <td>
                    <div class="grid grid-cols-[min-content,1fr] gap-1">
                      <span class="inline-block w-[4ch]"></span>
                      <span class="text-lg font-medium"
                        >${{ stagingPackage.additional_amount }} USD</span
                      >
                    </div>
                  </td>
                </tr>

                <tr></tr>

                <tr style="border-bottom: none;">
                  <td class="text-base font-bold" style="padding-bottom: 2px;">
                    PAYMENT METHOD
                  </td>
                  <td style="padding-bottom: 2px;"></td>
                  <td rowspan="2">
                    <div class="grid place-items-center h-full w-full">
                      <p class="mb-2">
                        <button
                          class="billing-action-button"
                          @click="showEditCardModal"
                        >
                          {{ checkCardInfo ? 'Update' : 'Add' }}
                        </button>
                      </p>
                      <p v-if="checkCardInfo">
                        <button
                          class="billing-action-button cancel"
                          @click="showDeleteCardModal"
                        >
                          Delete
                        </button>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-base font-bold">
                    <div class="inline-grid grid-cols-2 text-xs">
                      <button
                        type="button"
                        class="payment-method-button active w-16 h-9 text-white bg-paperdazgreen-400 m-0 rounded-l-full"
                        @click="showBillingChangeModalAction('credit', 'card')"
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        class="payment-method-button w-16 h-9 text-white bg-[#FFC003] m-0 rounded-r-full"
                        @click="showBillingChangeModalAction('card', 'credit')"
                      >
                        Credit
                      </button>
                    </div>
                  </td>
                  <td>
                    <div v-if="stagingPackage.paymentType == 'card'">
                      <p class="" v-if="checkCardInfo">
                        Credit card number
                        <span class="text-paperdazgreen-300"
                          >**** **** ****
                          {{
                        (splitCard || '')
                          }}</span
                        >
                        <br />Expiration date:
                        <span class="text-paperdazgreen-300"
                          >{{ (card_month || '')
                          }}/{{ (card_year || '') }}</span
                        >
                      </p>
                      <p class="text-md" v-if="!checkCardInfo">
                        No Card Available
                      </p>
                    </div>
                    <div v-if="stagingPackage.paymentType == 'credit'">
                      <p>Referral Credits Balance</p>
                      <p>{{ `$${user.totalCreditsEarned}` }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </transition>

    <additional-feature-modal :isSubscribeActive="isSubscribeActive" v-model="showAdditionalFeatureModal" />
    <delete-additional-features-modal
      :packagename="propsPackageName"
      v-model="showDeleteFeatureModal"
    />
    <cancel-package-subscription-modal
      :packagename="propsPackageName"
      v-model="showCancelSubscriptionModal"
    />
    <delete-billing-information-modal v-model="showDeleteBillingInfoModal" />
    <update-billing-information-modal
      @success="$fetch"
      v-model="showUpdateBillingInfoModal"
    />
    <change-payment-method-modal
      v-model="showBillingChangeModal"
      :from="billingFrom"
      :to="billingTo"
      @popCredit="notEnoughCredit"
      :subscriptionPlan="subscriptionPlan"
    />
    <insufficient-credit-modal v-model="showInsufficientCreditModal" />

    <UpdateSubscriptionModal  v-model="showSubscriptionModal"/>
  </section>
</template>

<script>
import Vue from 'vue'
import AdditionalFeatureModal from '~/components/packages/modals/AdditionalFeatureModal.vue'
import CancelPackageSubscriptionModal from '~/components/packages/modals/CancelPackageSubscriptionModal.vue'
import ChangePaymentMethodModal from '~/components/packages/modals/ChangePaymentMethodModal.vue'
import DeleteAdditionalFeaturesModal from '~/components/packages/modals/DeleteAdditionalFeaturesModal.vue'
import DeleteBillingInformationModal from '~/components/packages/modals/DeleteBillingInformationModal.vue'
import InsufficientCreditModal from '~/components/packages/modals/InsufficientCreditModal.vue'
import UpdateBillingInformationModal from '~/components/packages/modals/UpdateBillingInformationModal.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import TrashCanIcon from '~/components/svg-icons/TrashCanIcon.vue'
import PackageCard from '../PackageCard.vue'
import UpdateSubscriptionModal from '~/components/packages/modals/UpdateSubscriptionModal.vue'

export default Vue.extend({
  name: 'BillingTab',
  components: {
    TrashCanIcon,
    PackageCard,
    AdditionalFeatureModal,
    DeleteAdditionalFeaturesModal,
    CancelPackageSubscriptionModal,
    DeleteBillingInformationModal,
    UpdateBillingInformationModal,
    SpinnerDottedIcon,
    ChangePaymentMethodModal,
    InsufficientCreditModal,
    UpdateSubscriptionModal
},
  async fetch() {
    const fetchCard = () =>
      this.$axios
        .$get(`/cards/?userId=${this.$auth.user?.id}`)
        .then((response) => {

          const [cardResponse] = response.data

          this.card = cardResponse
          this.splitCard = cardResponse?.card_number
          .toString()
          .substring(
          cardResponse.card_number.toString().length - 4,
          cardResponse.card_number.toString().length
          )

          this.card_month = cardResponse?.exp_month
          this.card_year = cardResponse?.exp_year
        })
        .catch(() => {
          this.showUpdateBillingInfoModal = false
        })

    const fetchSubscription = () =>
      this.$axios
        .$get(`/subscriptions/?userId=${this.$auth.user.id}`)
        .then((response) => {
          //  --setting the package card info--
          const [subscribeResponseData] = response.data

          this.stagingPackage = {
          ...subscribeResponseData,
          name: subscribeResponseData.packageName,
          monthlyPrice: subscribeResponseData.amount
          }
          //  --setting the scbscription plan props
          this.subscriptionPlan = {
            plan: this.stagingPackage.plan,
            id: this.stagingPackage.id,
            price:
              this.stagingPackage.plan == 'monthly'
              ? this.stagingPackage.monthlyPrice
              : this.stagingPackage.yearlyPrice,
              }

            this.isSubscribeActive = this.stagingPackage.isCancelled
            this.propsPackageName = this.stagingPackage

            console.log('billing-package', this.stagingPackage)
        })
        .catch((err) => {})

    await Promise.allSettled([fetchCard(), fetchSubscription()])
  },
  data() {
    return {
      refetchCard: false,
      propsPackageName: '',
      splitCard: '',
      card_month: '',
      card_year: '',
      showInsufficientCreditModal: false,
      showBillingChangeModal: false,
      billingFrom: '',
      billingTo: '',
      showAdditionalFeatureModal: false,
      showDeleteFeatureModal: false,
      showCancelSubscriptionModal: false,
      showDeleteBillingInfoModal: false,
      showUpdateBillingInfoModal: false,
      showSubscriptionModal:false,
      subscriptionPlan: {},
      card: {},
      isSubscribeActive:undefined,
      additionalFeature: {
        paperlinks: 0,
        team_members: 0,
        carbon: 0,
      },
      // additionalFeatures: undefined,
      stagingPackage: {},
    }
  },
  computed: {
    isSubscription(){
      return this.stagingPackage.isCancelled 
    },
    user() {
      return this.$auth.user
    },
    hasAdditionalFeatures() {
      return (
        this.additionalFeature && Object.keys(this.additionalFeature).length > 0
      )
    },
    checkAddedFeatures() {
      console.log('pack', this.stagingPackage.additional_amount === null)
      return this.stagingPackage.additional_amount > 0
    },
    checkCardInfo() {
      return this.splitCard != undefined
    },
  },
  methods: {
    showSubscriptionFunction(){
      this.showSubscriptionModal = true
    },
    notEnoughCredit() {
      this.showInsufficientCreditModal = true
    },
    refetchFunction(val) {
      this.refetchCard = val
    },
    showEditCardModal() {
      this.showUpdateBillingInfoModal = true
    },
    showDeleteCardModal() {
      if (this.splitCard != undefined) {
        this.showDeleteBillingInfoModal = true
      }
    },
    showBillingChangeModalAction(from, to) {
      this.billingFrom = from
      this.billingTo = to
      this.showBillingChangeModal = true
    },
  },
})
</script>

<style lang="scss" scoped>
#billing-table {
  & tr {
    @apply border-b border-paperdazgreen-300;
  }
  & td {
    @apply py-4 px-3;
    width: auto;
    &:first-child {
      @apply text-paperdazgreen-300 font-medium whitespace-nowrap;
      // min-width: ;
    }
    &:last-child {
      width: 1%;
      white-space: nowrap;
    }

    &:nth-child(2) {
      // @apply whitespace-nowrap;
      width: 100%;
    }
  }
}

.billing-action-button {
  @apply rounded-full
                h-8
                text-white
                bg-paperdazgreen-300
                font-medium
                px-1
                text-xs w-28 whitespace-nowrap;

  &.cancel {
    @apply bg-transparent border border-red-600 text-red-600;
  }
}

.payment-method-button.active {
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.25);
}
</style>
