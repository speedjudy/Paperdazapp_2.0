<template>
  <section>
    <!-- start:: Teams link -->
    <div class="grid grid-cols-1 md:grid-cols-[1fr,max-content] gap-6 mb-8">
      <div class="rounded-2xl p-4 bg-white text-paperdazgreen-400">
        <h3 class="text-lg font-semibold text-center mb-6">
          Help keep everyone safe and the world green!
        </h3>
        <p class="text-sm text-black mb-2">Referral Link</p>
        <form class="grid grid-cols-[1fr,min-content] items-center gap-4">
          <div
            class="h-10 sm:h-12 rounded-2xl border-2 border-paperdazgreen-400 flex items-center overflow-hidden gap-2 text-sm"
          >
            <input
              type="text"
              :value="referalLink"
              class="flex-1 h-full outline-none pl-4 text-[#909090]"
            />
            <span @click="copyReferalLink" class="block pr-4 cursor-pointer">
              <file-solid-icon />
            </span>
          </div>
          <div 
          @click="showShareCompanyFilesFunc"
          class="circle circle-22 bg-paperdazgreen-400 text-white cursor-pointer">
            <share-icon />
          </div>
        </form>
      </div>

      <div class="bg-white py-4 px-6 rounded-2xl grid grid-cols-1 gap-5">
        <h3 class="text-lg font-semibold text-center text-paperdazgreen-400">
          Credits Earned
        </h3>
        <div class="ref-small-card">
          <div>
              <CreditIcon width="41" height="38"/>
          </div>
          <p>
            <span class="truncate">{{ user.totalCreditsEarned }}</span> USD
          </p>
        </div>

        <div class="ref-small-card">
          <div>
             <LeavesIcon width="33" height="33"/>
          </div>
          <p>
            <span class="truncate">{{ user.totalLeavesEarned }}</span> Leaves
          </p>
        </div>
      </div>
    </div>
    <!-- end:: Teams link -->



    <div class="rounded-2xl bg-white overflow-x-auto custom-scrollbar p-6 relative">
      <h2
        class="text-center text-2xl text-paperdazgreen-400 font-semibold pb-3 border-b border-paperdazgreen-400"
      >
      {{ teamMembers.length > 0 ? 'Referral Credit Info' : 'Invite & Earn'}}
      </h2>
            <!-- << -- spinner contaier --<< -->
                 <div v-if="referalsIsLoaded" class="absolute w-full top-0 left-0 h-full z-10 bg-white flex justify-center items-center">
                     <SpinnerDottedIcon class="text-paperdazgreen-400/70 animate-spin"/>
                 </div>
            <!-- << -- end of spinner container --<< -->
      <table class="custom-table" v-if="teamMembers.length > 0">
        <thead class="text-[#414142]">
          <tr>
            <th class="text-left">Name</th>
            <th class="">Business Name</th>
            <th class="">User</th>
            <th class="">Date &amp; Time</th>
            <th>Earned Credit</th>
          </tr>
        </thead>
        <tbody class="text-[#505050]">
          <tr v-for="(member, i) in teamMembers" :key="i + 'teamMembers'">
            <td class="text-left">
              <span class="text-sm">{{ member.newUserName }}</span>
            </td>
            <td class="text-center">
              {{ (member.newUserCompanyName || "No businessname") }}
            </td>
             <td class="text-center">
              {{ member.type == 'payment'? "PAID" : "FREE"  }}
            </td>
            <td class="text-sm text-center">
              {{ (member.createdAt || '').replace(/T|.000Z/g, ' ') }}
            </td>
            <td class="text-center flex items-center justify-center font-[500]">
              <span class="inline-flex w-[50%] justify-end">
                <CreditIcon width='25' height='25' class="mr-[4px]" v-if="member.type == 'payment'"/>
                <LeavesIcon width="25" height="25" class="mr-[4px]" v-else/>
              </span>
              <span class="inline-block w-[50%] text-left"> 
                {{  member.type != 'payment' ? member.leavesEarned :  member.creditEarned}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="w-full bg-white flex justify-center py-8" v-else>
         <InviteEarnLogo width="356" height="331"/>
      </div>
    </div>
    <FilePagination :totalFile="totalreferee" @setPage="setPage"/>

      <ShareFilesModal
      :link="referalLink"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
      />

      <QrcodeShare  :link="referalLink" v-model="showQrcodeFiles" />

  </section>
</template>
<script>
import Vue from 'vue'
import FileSolidIcon from '~/components/svg-icons/FileSolidIcon.vue'
import ShareIcon from '~/components/svg-icons/ShareIcon.vue'
import AuthUser from '~/models/AuthUser'
import CreditIcon from "~/components/svg-icons/CreditIcon.vue"
import LeavesIcon from "~/components/svg-icons/leavesIcon.vue"
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import InviteEarnLogo from '~/components/svg-icons/InviteEarnLogo.vue'
import FilePagination from '~/components/pagination/FilePagination.vue'
import ShareFilesModal from '~/components/company-files/Tabs/ShareFilesModal.vue'
import QrcodeShare from '~/components/company-files/Tabs/QrcodeShare.vue'


export default Vue.extend({
  name: 'ReferralTab',
  components: { ShareIcon, FileSolidIcon, CreditIcon, LeavesIcon, SpinnerDottedIcon, InviteEarnLogo, FilePagination, ShareFilesModal, QrcodeShare },
  data() {
    return {
      user: {},
      referalLink: '',
      teamMembers: [],
      referalsIsLoaded: true,
      totalreferee:null,
      returnRefereePage:0,
      showShareCompanyFiles: false,
      showQrcodeFiles: false
    }
  },
  async fetch() {},
  mounted() {
    this.getAllReferee( this.returnRefereePage )

    ;(this.referalLink) = `${
    window.location.origin
    }/register/?referreeCode=${(this.$auth.user).referralCode}`

    this.$nuxt.$emit('tableScrollObserver')
    ;(this.user) = this.$auth.user
  },
  updated() {
    this.$nuxt.$emit('tableScrollObserver')
  },
  methods: {
    showQrcodeFileFunc(){
      (this.showQrcodeFiles) = true
    },
    showShareCompanyFilesFunc(){
      (this.showShareCompanyFiles) = true
    },
      async getAllReferee( page ){
      await this.$axios
      .$get( `/referral/?referralCode=${(this.$auth.user).referralCode}&$sort[id]=-1&$skip=${page}`)
      .then((response) => {
      this.teamMembers = response.data
      this.totalreferee = response.total
      console.log("referal-member", this.teamMembers)
      })
      .catch(() => {
       })

      .finally(()=>{
       this.referalsIsLoaded = false;
       })
    },
    setPage( page ){
       this.referalsIsLoaded = true;
      this.returnRefereePage = page
    },
    copyReferalLink() {
      navigator.clipboard.writeText(this.referalLink)
      this.$notify.info({
      title: '',
      message: 'referal copied',
      })
    },
    getStatusClass(val){
      switch (val.toLowerCase()) {
        case 'active':
          return 'text-white bg-paperdazgreen-400'
        case 'pending':
          return 'text-white bg-[#5078B5]'
        case 'disabled':
          return 'text-white bg-[#909090]'
        default:
          return 'text-white bg-[#909090]'
      }
    },
  },
  watch: {
    returnRefereePage : function(){
      this.getAllReferee( this.returnRefereePage )
    }
  }
})
</script>

<style lang="scss" scoped>
.ref-small-card {
  @apply px-4 py-2 h-[50px] rounded-xl border-2 border-paperdazgreen-400 grid grid-cols-[50px,1fr] gap-2 items-center text-sm font-medium text-[#909090];
}
</style>
