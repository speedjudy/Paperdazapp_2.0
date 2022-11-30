<template>
  <main class="">
    <top-details-card-container v-model="activeTab" class="mb-5" :tabs="tabs" />
    <leaves-details-container class="mb-12" />

    <div class="flex items-center flex-wrap gap-4 justify-between mb-6">
      <h5 class="text-lg font-semibold text-[#272727]">Team Members</h5>
      <div class="text-white flex items-center">
        <form
          action=""
          class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end mr-2"
          @submit.prevent="$event.preventDefault()"
        >

            <span class="el-dropdown-link"
            :class="[show ? 'left-roll' : 'no-roll']"
            >
              <input
                type="text"
                class="search-input text-black h-10 pl-4 mr-2 bg-transparent flex-1 border border-paperdazgreen-300 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
                placeholder="Search Files"
                v-model="teamSearch"
              />
            </span>
   
          <button 
          @click="show = !show"
          class="circle circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150">
            <search-icon width="16" height="16" currentcolor='white'/>
          </button>
        </form>
        <button
          class="circle circle-18 bg-paperdazgreen-400 hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150 transition duration-0 hover:duration-150"
          @click="showInviteTeamMemberModal = true"
        >
          <user-plus-icon width="16" height="16" />
        </button>
      </div>
    </div>


     
    <div class="rounded-2xl bg-white overflow-x-auto custom-scrollbar relative">
     <!-- START:Team container spinner -->
     <div 
     v-if="teamSpinner || updateTeamSpiunner"
     class="w-full grid place-items-center h-full h-min-[300px] absolute top-0 left-0 z-30"
     :class="[updateTeamSpiunner? 'bg-transparent': 'bg-white']"
     >
    <SpinnerDottedIcon class="animate-spin"/>
    </div>
    <!-- END:Team container spinner -->
    <div 
    v-if="teamMembers.length < 1"
    class="w-full h-[200px] grid place-items-center text-[17px] font-normal">
       You have no team member
    </div>
      <table v-else class="custom-table">
        <thead class="text-[#414142]">
          <tr>
            <th class="w-12 text-center fixed-col left">No</th>
            <th class="text-left">Member</th>
            <th class="text-left">Access</th>
            <th class="text-left">Date &amp; Time</th>
            <th class="w-28 text-center">
              <p class="w-24">Status</p>
            </th>
            <th class="text-center fixed-col right"></th>
          </tr>
        </thead>
        <tbody class="text-[#505050]">
          <tr v-for="(member, i) in teamMembers" :key="i">
            <td class="w-12 text-center fixed-col left">{{ i + 1 }}</td>
            <td>
              <div class="flex items-center gap-3">
                <span
                      class="p-0.5 border border-paperdazgreen-400"
                      :class="[member.role == userType.PAID  ? 'rounded-md w-9 h-9' : 'circle circle-17']"
                    >
                      <img
                        :src="
                          (member || {}).profilePicture ||
                          '/img/placeholder_picture.png'
                        "
                        alt=""
                        :class="[member.role == userType.PAID ?'w-full h-full rounded-md':'w-full h-full rounded-full']"
                      />
                    </span>
                <span class="text-sm">{{ `${member.firstName} ${member.lastName}`  }}</span>
              </div>
            </td>
            <td>
              {{ member.teamAccess }}
            </td>
            <td class="text-sm">
              {{ `${(member.createdAt || '').replace(/T|.000Z/g,' ')}` }}
            </td>
            <td class="w-28 text-center">
              <div
                class="w-24 text-sm font-medium flex items-center justify-center rounded-full h-8 capitalize px-1 whitespace-nowrap"
                :class="[getStatusClass(member.status || '')]"
              >
                {{ member.status }}
              </div>
            </td>
            <td class="fixed-col right w-[50px]">
              <div class="w-full h-full grid place-items-center">
                <el-dropdown trigger="click">
                  <button class="el-dropdown-link px-3">
                    <ellipsis-icon-vertical-icon />
                  </button>
                  <el-dropdown-menu
                    slot="dropdown"
                    class="table-menu-dropdown-menu"
                  >
                    <ul class="min-w-[150px]">
                      <li class="dropdown-item">
                        <input
                          hidden
                          type="radio"
                          :id="`team-member-${i}-dropdown-item-status`"
                          name="team-member-dropdown-item"
                        />
                        <label :for="`team-member-${i}-dropdown-item-status`"
                          >Status
                          <span class="suffix-icon"
                            ><arrow-down-icon width="12" height="12" /></span
                        ></label>

                        <ul class="bg-green-600 inner-dropdown">
                          <li class="inner-dropdown-item"
                          @click="setStatus(member.id,'active')"
                          >Active</li>
                          <li class="inner-dropdown-item"
                          @click="setStatus(member.id,'disable')"
                          >Disable</li>
                          <li class="inner-dropdown-item"
                          @click="setStatus(member.id,'pending')"
                          >Pending</li>
                        </ul>
                      </li>
                      <li class="dropdown-item">
                        <input
                          hidden
                          type="radio"
                          :id="`team-member-${i}-dropdown-item-access`"
                          name="team-member-dropdown-item"
                        />
                        <label :for="`team-member-${i}-dropdown-item-access`"
                          >Acces Right
                          <span class="suffix-icon"
                            ><arrow-down-icon width="12" height="12" /></span
                        ></label>

                        <ul class="bg-green-600 inner-dropdown">
                          <li class="inner-dropdown-item"
                          @click="setTeamAccess(member.id, 'own_files')"
                          >Own Files</li>
                          <li class="inner-dropdown-item"
                           @click="setTeamAccess(member.id, 'company_files')"
                          >Company Files</li>
                        </ul>
                      </li>
                    </ul>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  <FilePagination :totalFile="totalMembers" @setPage="setPage"/>
    <invite-team-member-modal
      @maxpopup="MaxInviteFunc"
      :reachLimit="canUserInvite"
      v-model="showInviteTeamMemberModal"
    />
    <max-invite-modal v-model="showMaxInvite" :teamMembers="totalTeamMembers"/>
  </main>
</template>

<script>
import Vue from 'vue'
import LeavesDetailsContainer from '~/components/dashboard/LeavesDetailsContainer.vue'
import TopDetailsCardContainer from '~/components/dashboard/TopDetailsCardContainer.vue'
import InviteTeamMemberModal from '~/components/pdf/modals/InviteTeamMemberModal.vue'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import DisketIconVue from '~/components/svg-icons/DisketIcon.vue'
import EllipsisIconVerticalIcon from '~/components/svg-icons/EllipsisIconVerticalIcon.vue'
import NoteAndPenIconVue from '~/components/svg-icons/NoteAndPenIcon.vue'
import PageIconVue from '~/components/svg-icons/PageIcon.vue'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import ShareIconVue from '~/components/svg-icons/ShareIcon.vue'
import TickCircleIconVue from '~/components/svg-icons/TickCircleIcon.vue'
import UserPlusIcon from '~/components/svg-icons/UserPlusIcon.vue'
import Paid_User from '~/mixins/Paid_User'
import MaxInviteModal from '~/components/teams/MaxInviteModal.vue'
import AuthUser from '~/models/AuthUser'
import FilePagination from '~/components/pagination/FilePagination.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import StatusUser from '~/models/StatusUser'
import LedgerIcon from '~/components/svg-icons/LedgerIcon.vue'

export default Vue.extend({
  components: {
    TopDetailsCardContainer,
    LeavesDetailsContainer,
    EllipsisIconVerticalIcon,
    SearchIcon,
    UserPlusIcon,
    InviteTeamMemberModal,
    ArrowDownIcon,
    MaxInviteModal,
    FilePagination,
    SpinnerDottedIcon,
    LedgerIcon
},
  name: 'TeamsPage',
  layout: 'dashboard',
  mixins: [Paid_User],
  data() {
    return {
      activeTab: 'ledger',
      showInviteTeamMemberModal: false,
      searchParam: '',
      showMaxInvite: false,
      show: false,
      returnedTeamMember:0,
      teamMembers: [],
      totalMembers:null,
      teamSpinner: true,
      updateTeamSpiunner:false,
      reachTeamLimit:false,
      totalTeamMembers:null,
      teamSearch:'',
      tabs: [
        {
          label: 'ledger',
          key: 'ledger',
          action:'ledger',
          count: 896,
          icon: LedgerIcon,
        },
        {
          label: 'completed',
          key: 'completed',
          count: 25,
          action:'complete',
          icon: PageIconVue,
        },
        {
          label: 'confirmed',
          key: 'confirmed',
          count: 25,
          action:'confirm',
          icon: TickCircleIconVue,
        },
        {
          label: 'signed',
          key: 'signed',
          count: 25,
          action:'sign',
          icon: NoteAndPenIconVue,
        },
        {
          label: 'saved',
          key: 'saved',
          count: 25,
          action:'save',
          icon: DisketIconVue,
        },
        {
          label: 'shared',
          key: 'shared',
          count: 25,
          action:'share',
          icon: ShareIconVue,
        },
      ],
    }
  },
 asyncData({ store, $axios, $auth }) {
    store.commit('SET_PAGE_NAME', { name: 'Team' })
  },
  computed:{
     canUserInvite(){
       return (this.totalMembers >= (this.totalTeamMembers))
     },
      userType(){
      return (UserTypeEnum)
    }
  },
  mounted(){
     this.getTeamMember(this.returnedTeamMember,this.teamSearch)
     this.getUserSubscription()
  },
  methods: {
    setPage(val){
      this.teamSpinner = true
      this.returnedTeamMember = val
    },
    setStatus(val, type){
      this.updateTeamSpiunner = true
      this.$axios.$patch(`/users/${val}`, { status: type })
      .then(()=>{
      this.getTeamMember(this.returnedTeamMember)
      })
      },
    async getUserSubscription(){
        this.$axios.$get(`/subscriptions/?userId=${(this.$auth.user).id}`)
        .then((response)=>{
          console.log("subscription",response.data[0])
          this.totalTeamMembers = response.data[0].teamMembers
        })
        .catch(()=>{
          this.reachTeamLimit = true;
        })
      },
    setTeamAccess(val, type){
      this.updateTeamSpiunner = true
      this.$axios.$patch(`/users/${val}`, { teamAccess : type})
      .then(()=>{
      this.getTeamMember(this.returnedTeamMember)
      })
      },
    getTeamMember(val, search){
      this.$axios.$get(`/users?teamId=${(this.$auth.user).id}&$sort[createdAt]=-1&$skip=${val}&firstName[$like]=${search || ''}%`)
      .then((response)=>{
      console.log(response)
      this.teamMembers = response.data 
      this.totalMembers = response.total
      })
      .catch(()=>{
      this.$notify.error({
      title:"teams",
      message:"Error, could not get teams"
      })
      })
      .finally(()=>{
      this.teamSpinner = false,
      this.updateTeamSpiunner = false
      })
    },
    MaxInviteFunc() {
      this.showMaxInvite = true
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
  beforeMount(){
    if(this.$auth.user.status == StatusUser.EXPIRED){
      this.$notify.error({
        message: "Your subscription is expired, go to billing to renew"
      })
      this.$nuxt.$router.push("/dashboard")
    }
  },
  watch:{
    "$auth.user": function(){
       this.getTeamMember(this.returnedTeamMember,this.teamSearch)
       this.getUserSubscription()
    },
    returnedTeamMember: function(){
       this.getTeamMember(this.returnedTeamMember, this.teamSearch)
    },
    teamSearch: function(){
       this.getTeamMember(this.returnedTeamMember, this.teamSearch)
    }
  }
})
</script>
