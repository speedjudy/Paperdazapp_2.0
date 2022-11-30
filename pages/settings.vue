<template>
  <div class="py-4 lg:py-10 relative">
    <!-- spinner before page loaded -->
      <div v-if="windowOnLoad" class="absolute w-full h-full min-h-[70vh] grid bg-white rounded-xl place-content-center z-10 top-0 left-0">
        <spinner-dotted-icon height="32" width="32" class="text-paperdazgray-400 animate-spin" />
      </div>

    <profile-tab v-model="currentTab" :tabs="tabs" class="mb-10" />
    <keep-alive>
      <component :is="currrentTabComponent" />
    </keep-alive>
  </div>
</template>

<script>
import Vue from 'vue'
import ProfileTab from '~/components/settings/ProfileTab.vue'
import AccountTab from '~/components/settings/tabs/AccountTab.vue'
import ChangePasswordTab from '~/components/settings/tabs/ChangePasswordTab.vue'
import SignatureInitialsTab from '~/components/settings/tabs/SignatureInitialsTab.vue'
import NotificationsTab from '~/components/settings/tabs/NotificationsTab.vue'
import BillingTab from '~/components/settings/tabs/BillingTab.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import ReferralTabVue from '~/components/settings/tabs/ReferralTab.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'

export default Vue.extend({
  name: 'SettingsPage',
  components: { ProfileTab , SpinnerDottedIcon},
  layout: 'dashboard',
  data() {
    return {
      windowOnLoad: true,
      currentTab: 'account',
      tabs: [
        { label: 'Profile Info', value: 'account', component: AccountTab },
        { label: 'Security', value: 'security', component: ChangePasswordTab },
        {
          label: 'Referral Credit',
          value: 'referral-credit',
          component: ReferralTabVue,
        },
        // {
        //   label: 'Signature/Initials',
        //   value: 'signature-initials',
        //   component: SignatureInitialsTab,
        // },
        {
          label: 'Notifications',
          value: 'notifications',
          component: NotificationsTab,
        },
      ],
    }
  },
  mounted(){
        if(this.$store.getters.userType)
           this.windowOnLoad = false;
        if(this.$route.query.tab)
           this.currentTab = this.$route.query.tab.toString()
        //check if is a social user to remove settings tabs
        if (this.$auth.user.id && this.$auth.user.socialLogin !== null){
          this.tabs.splice(1, 1)
        } 
  },
  beforeMount() {
    if (this.$store.getters.userType === UserTypeEnum.PAID) {
      this.tabs.splice(3, 0, {
        label: 'Billing',
        value: 'billing',
        component: BillingTab,
      })
    } else if (this.$store.getters.userType === UserTypeEnum.FREE) {
      this.tabs.splice(3, 0, {
        label: 'Signature/Initials',
        value: 'signature-initials',
        component: SignatureInitialsTab,
      })
    }
    else if (this.$store.getters.userType === UserTypeEnum.TEAM) {
     this.tabs.splice(1, (this.tabs.length-2))
    }
  },
  computed: {
    currrentTabComponent() {
      const tab = this.tabs.find((el) => el.value === this.currentTab)
      if (tab && tab.component) {
        return tab.component
      } else {
        return {
          render(h) {
          return h('h1', 'Loading...')
          },
        }
      }
    },
  },
  watch:{
    "$auth.user.role": function(){
       if (this.$store.getters.userType === UserTypeEnum.PAID) {
        this.tabs.splice(3, 0, {
        label: 'Billing',
        value: 'billing',
        component: BillingTab,

      })
    } else if (this.$store.getters.userType === UserTypeEnum.FREE) {
        this.tabs.splice(3, 0, {
        label: 'Signature/Initials',
        value: 'signature-initials',
        component: SignatureInitialsTab,
      })
    }
     else if (this.$store.getters.userType === UserTypeEnum.TEAM) {
        this.tabs.splice(1, (this.tabs.length-2))
    }

    //<<<<-- check if user is a social user--->>>>
   if (this.$auth.user.socialLogin !== null) {
      this.tabs.splice(1, 1)
      }
      this.windowOnLoad = false;
    },

  }
})
</script>
