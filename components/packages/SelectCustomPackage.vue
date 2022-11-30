<template>
  <div class="grid md:grid-cols-[max-content,1fr] mb-12 gap-5">
    <package-card
      class="md:min-w-[300px] lg:min-w-[320px]"
      show-bottom-button
      @setName="setname"
      :staging-package="stagingPackage"
      @bottom-button-clicked="$emit('next-tab', $event)"
      :edited="true"
      :create="true"
    />
    <div
      class="border-2 border-paperdazgreen-400 w-full rounded-2xl overflow-hidden relative bg-white text-[#505050]"
    >
      <div class="p-5 overflow-x-auto custom-scrollbar">
        <table class="custom-table">
          <thead>
            <tr class="text-lg">
              <th class="text-left">
                <span class="inline-block border-b-2 border-paperdazgreen-400"
                  >Feature</span
                >
              </th>
              <th>
                <span class="inline-block border-b-2 border-paperdazgreen-400"
                  >Price <span class="text-xxs font-normal">/unit</span></span
                >
              </th>
              <th>
                <span class="inline-block border-b-2 border-paperdazgreen-400"
                  >Quantity</span
                >
              </th>
              <th>
                <span class="inline-block border-b-2 border-paperdazgreen-400"
                  >Amount</span
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paperlink</td>
              <td class="text-center">
                {{ formatPrice(settings.custom_paperlink_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <!-- <el-input
                          v-model="customPackage.paperlink"
                          style="width: 80px"
                          type="number"
                          min="1"
                        /> -->
                  <el-input-number
                    v-model.number="customPackage.paperlink"
                    size="small"
                    :min="1"
                    :max='20'
                  />
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    Number(settings.custom_paperlink_price) *
                      Number(customPackage.paperlink)
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>Team Member</td>
              <td class="text-center">
                {{ formatPrice(settings.custom_team_members_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <!-- <el-input
                          v-model="customPackage.team_members"
                          style="width: 80px"
                          type="number"
                          min="1"
                        /> -->
                  <el-input-number
                    v-model.number="customPackage.teamMembers"
                    size="small"
                    :min="1"
                    :max='20'
                  />
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    Number(settings.custom_team_members_price) *
                      Number(customPackage.teamMembers)
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>CC Flow</td>
              <td class="text-center">
                {{ formatPrice(settings.custom_cc_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <!-- <el-input
                          v-model="customPackage.carbon"
                          style="width: 80px"
                          type="number"
                          min="1"
                        /> -->
                  <el-input-number
                    v-model="customPackage.cc"
                    size="small"
                    :min="1"
                    :max='20'
                  />
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    Number(settings.custom_cc_price) *
                      Number(customPackage.cc)
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>Public Profile</td>
              <td class="text-center">Included</td>
              <td>
                <div class="grid place-items-center">
                  <input
                    type="checkbox"
                    hidden
                    id="public-profile-checkbox"
                    :disabled="true"
                    v-model="customPackage.publicProfile"
                  />
                  <label
                    for="public-profile-checkbox"
                    class="inline-grid place-items-center h-7 w-7 rounded border border-gray-300 p-1 cursor-pointer"
                  >
                    <transition name="fade" :duration="100">
                      <check-icon
                        height="12"
                        width="16"
                        v-show="customPackage.publicProfile"
                      />
                    </transition>
                  </label>
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    !customPackage.publicProfile
                      ? 0
                      : Number(settings.custom_public_profile_price)
                  )
                }}  
              </td>
            </tr>
            <tr>
              <td>Company Ledger</td>
              <td class="text-center">Included</td>
              <td>
                <div class="grid place-items-center">
                  <input
                    type="checkbox"
                    hidden
                    id="company-ledger-checkbox"
                    :disabled="true"
                    v-model="customPackage.companyLedger"
                  />
                  <label
                    for="company-ledger-checkbox"
                    class="inline-grid place-items-center h-7 w-7 rounded border border-gray-300 p-1 cursor-pointer"
                  >
                    <transition name="fade" :duration="100">
                      <check-icon
                        height="12"
                        width="16"
                        v-show="customPackage.companyLedger"
                      />
                    </transition>
                  </label>
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    !customPackage.companyLedger
                      ? 0
                      : Number(settings.custom_company_ledger_price)
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="border-t-2 border-paperdazgreen-400 py-4 px-10 text-lg font-bold flex justify-between"
      >
        <span>Total Amount</span>
        <span class="text-[#606060]">{{ formatPrice(totalCost) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import PackageCard from '../settings/PackageCard.vue'
import CheckIcon from '../svg-icons/CheckIcon.vue'
import Vue from 'vue'
import StringUtils from '~/utils/StringUtils'
export default Vue.extend({
  name: 'SelectCustomPackage',
  components: { PackageCard, CheckIcon },
  data() {
    return {
      settings: {
        custom_paperlink_price: 1,
        custom_team_members_price: 1,
        custom_cc_price: 1,
        custom_public_profile_price: 1,
        custom_company_ledger_price: 1,
      },
      customPackage: {
        name: 'Custom',
        description: 'Custom package',
        paperlink: 1,
        teamMembers: 1,
        cc: 1,
        publicProfile: true,
        companyLedger: true,
      },
    }
  },
  async fetch() {
    // await this.$axios.$get('/package/custom').then((response) => {
    //   this.settings = response.settings
    // })
  },
  computed: {
    totalCost() {
      const paperLinkPrice =
        Number(this.settings.custom_paperlink_price) *
        Number(this.customPackage.paperlink)
      const teamMembersPrice =
        Number(this.settings.custom_team_members_price) *
        Number(this.customPackage.teamMembers)
      const ccFlowPrice =
        Number(this.settings.custom_cc_price) *
        Number(this.customPackage.cc)
      const publicProfilePrice = !this.customPackage.publicProfile
        ? 0
        : Number(this.settings.custom_public_profile_price)
      const companyLedgerPrice = !this.customPackage.companyLedger
        ? 0
        : Number(this.settings.custom_company_ledger_price)

      return (
        paperLinkPrice +
        teamMembersPrice +
        ccFlowPrice +
        publicProfilePrice +
        companyLedgerPrice
      )
    },
    stagingPackage() {
      const stag = { ...this.customPackage }
      Object.assign(stag, {
        monthlyPrice: this.totalCost,
        yearlyPrice: this.totalCost * 10,
      })
          console.log("create-package",stag)
      return stag
    },
  },
  methods: {
    formatPrice(amount) {
      return StringUtils.formatPrice(Number(amount))
    },
    createAndProceed({
      stagingPackage,
      isMonthly,
    }) {
      const data = { ...this.customPackage } 
      data.plan = isMonthly ? 'monthly' : 'yearly'
      return
      // Create the custom package
      this.$axios.$post('/package/custom', data).then((response) => {
        debugger
        // this.$emit('next-tab', { stagingPackage, isMonthly })
      })
    },
  },
})
</script>
