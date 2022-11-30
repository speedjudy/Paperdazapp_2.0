<template>
  <div class="flex flex-col sm:flex-row gap-5">
    <div class="p-4 flex-1 sm:flex-initial rounded-2xl bg-white sm:self-start">
      <ul>
        <li
          class="menu-item"
          :class="{ active: currentState === 'app' }"
          @click="currentState = 'app'"
        >
          <bell-icon class="text-[#FFCF27]"/> <span>App Notification</span>
        </li>
        <li
          class="menu-item"
          :class="{ active: currentState === 'email' }"
          @click="currentState = 'email'"
        >
          <envelope-outlined-icon class="text-[#FFCF27]" />
          <span>Email Notification</span>
        </li>
      </ul>
    </div>

    <transition name="fade" mode="out-in" :duration="200">
    <main class="relative w-full">
         <!-- START: spinner container -->
          <div
            v-if="notificationSpinner || patchSpinner"
            class="absolute z-10 w-full h-full top-0 left-0 rounded-lg flex justify-center items-center"
            :class="[patchSpinner ? 'bg-transparent':'bg-white']"
          >
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->
      <!-- Start:: App notifications section -->
      <section
        v-if="currentState == 'app'"
        key="app"
        class="flex-1 px-8 py-10 bg-white rounded-2xl relative"
      >
        <h3
          class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-1 relative mb-7"
        >
          <span>App Notifications</span>
        </h3>
        <form class="w-full overflow-x-auto custom-scrollbar">
          <table class="custom-table">
            <tbody>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Users &amp; Roles</p>
                    <p>Access requests for private files</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input 
                   @input="getCheckValue"
                   data_patch="accessRequest"
                   :checked="app.accessRequest" 
                   data_family="app" 
                   type="checkbox" 
                   class="checkbox"/>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Collaborations</p>
                    <p>Invitation requests, Joining requests,</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                 <input 
                  @input="getCheckValue"
                   data_patch="inviteRequest"
                  data_family="app"
                  type="checkbox" 
                  :checked="app.inviteRequest"
                  class="checkbox"/>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Actions</p>
                    <p>Files completed, confirmed, signed</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input 
                  @input="getCheckValue"
                   data_patch="fileAction"
                  data_family="app"
                   type="checkbox"
                   :checked="app.fileAction"
                   class="checkbox"/>
                </td>
              </tr>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Referral Credits</p>
                    <p>Reference sign ups, credits earned</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input
                  @input="getCheckValue"
                   data_patch="referalCredit"
                   data_family="app" 
                  :checked="app.referalCredit"
                  type="checkbox" 
                  class="checkbox"/>
                </td>
              </tr>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Payments</p>
                    <p>Billing reminders, package expiry</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input
                  @input="getCheckValue"
                   data_patch="payment"
                   data_family="app" 
                  type="checkbox"
                  :checked="app.payment" 
                  class="checkbox"/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </section>
      <!-- End:: App notifications paymentsection -->

      <!-- Start:: Email notifications section -->
      <section
        v-if="currentState == 'email'"
        key="email"
        class="flex-1 px-8 py-10 bg-white rounded-2xl"
      >
        <h3
          class="flex justify-center text-paperdazgreen-300 border-b-2 border-paperdazgreen-300 font-semibold text-2xl gap-2 pb-1 relative mb-7"
        >
          <span>Email Notifications</span>
        </h3>
        <div class="w-full overflow-x-auto custom-scrollbar">
          <table class="custom-table">
            <tbody>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Users &amp; Roles</p>
                    <p>Access requests for private files</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input
                   @input="getCheckValue"
                   data_patch="accessRequest"
                   data_family="email" 
                  type="checkbox" 
                  :checked="email.accessRequest"
                  class="checkbox"/>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Collaborations</p>
                    <p>Invitation requests, Joining requests,</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input 
                  @input="getCheckValue"
                  data_patch="inviteRequest"
                  data_family="email" 
                  type="checkbox"
                  :checked="email.inviteRequest"
                  class="checkbox"/>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Actions</p>
                    <p>Files completed, confirmed, signed</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input 
                  @input="getCheckValue"
                  data_patch="fileAction"
                  data_family="email" 
                  type="checkbox" 
                  :checked="email.fileAction"
                  class="checkbox"/>
                </td>
              </tr>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Referral Credits</p>
                    <p>Reference sign ups, credits earned</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input data_family="email" 
                  type="checkbox" 
                  @input="getCheckValue"
                  data_patch="referalCredit"
                  :checked="email.referalCredit"
                  class="checkbox"/>
                </td>
              </tr>
              <tr v-if="isTeamMember">
                <td>
                  <div class="text-sm">
                    <p class="mb-1 font-semibold">Payments</p>
                    <p>Billing reminders, package expiry</p>
                  </div>
                </td>
                <td class="w-4 fixed-col right">
                  <input 
                  @input="getCheckValue"
                  data_patch="payment"
                  data_family="email" 
                  type="checkbox" 
                  :checked="email.payment"
                  class="checkbox"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <!-- End:: Email notifications section -->
    </main>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import BellIcon from '~/components/svg-icons/BellIcon.vue'
import EnvelopeOutlinedIcon from '~/components/svg-icons/EnvelopeOutlinedIcon.vue'
import SwitchWidget from '~/components/widgets/SwitchWidget.vue'
import AuthUser from '~/models/AuthUser'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import UserTypeEnum from '~/models/UserTypeEnum'

export default Vue.extend({
  name: 'NotificationsTab',
  components: { BellIcon, EnvelopeOutlinedIcon, SwitchWidget, SpinnerDottedIcon },
  data() {
    return {
      currentState: 'app', // app | email
      isTeamMember:undefined,
      app:{},
      email:{},
      notificationSpinner: true,
      patchSpinner: false,
    }
  },
  async fetch(){
     await this.queryNotificationApp()
     await this.queryNotificationEmail()
     this.notificationSpinner = false
  },
  methods:{
    getCheckValue(event){
        let getFamilyAttr = event.target.getAttribute("data_family");
        let getSwitchAttr = event.target.getAttribute("data_patch")
        let checked = event.target.checked;
        let dataApp = {
          object: this.checkInputAction(getSwitchAttr, checked),
          id: (this.app).id
        }
        let dataEmail = {
          object: this.checkInputAction(getSwitchAttr,checked),
          id: (this.email).id
          }
        //<<-- switch between app and email to patch -->>
        switch (getFamilyAttr) {
          case 'app':
            this.patchNotification({...dataApp})
            return    
          case 'email':
            this.patchNotification({...dataEmail})
            return;
        }
    },
    checkInputAction(action, val){
       switch (action) {
        case 'accessRequest':
          return {accessRequest: val? 1 : 0}
        case 'fileAction':
          return {fileAction: val? 1 : 0}
        case 'inviteRequest':
          return {inviteRequest: val? 1 : 0}
        case 'payment':
          return {payment: val? 1 : 0}
        case 'referalCredit':
          return {referalCredit: val? 1 : 0}
       }
    },
    async patchNotification({id, object}){
      this.patchSpinner = true
        await this.$axios
        .$patch(`/notification-settings/${id}`,{...object})
        .then(()=>{
          this.notificationSpinner = false,
          this.patchSpinner = false
        })
        .catch(()=>{
          this.$notify.error({
          title:'',
          message:"Could not make the change"
          })
        })
        
    },
    async queryNotificationApp(){
       await this.$axios
        .$get(`/notification-settings/?userId=${(this.$auth.user).id}&type=app`)
        .then((response) => { 
        let [gottenNotificationApp] = response; 

        this.app = Object.keys(gottenNotificationApp).map(function(key, index) {
          if(gottenNotificationApp[key] == '1')
           gottenNotificationApp[key] = true
          else if(gottenNotificationApp[key] == '0')
           gottenNotificationApp[key] = false
          else
           gottenNotificationApp[key]
        }); 
          this.app = gottenNotificationApp
          console.log("app",this.app)
          })
        .catch((err) => {
            
        })
    },
     async queryNotificationEmail(){
       await this.$axios
        .$get(`/notification-settings/?userId=${(this.$auth.user).id}&type=email`)
        .then((response) => { 
         let [gottenNotificationEmail] = response; 

        this.email = Object.keys(gottenNotificationEmail).map(function(key, index) {
          if(gottenNotificationEmail[key] == '1')
           gottenNotificationEmail[key] = true
          else if(gottenNotificationEmail[key] == '0')
           gottenNotificationEmail[key] = false
          else
           gottenNotificationEmail[key]
        }); 
          this.email = gottenNotificationEmail
          console.log("email",this.email)
        })
        .catch((err) => {
            
        })
    },

  },
  mounted(){
     (this.isTeamMember) = !((this.$auth.user).role == UserTypeEnum.TEAM)
  },

})
</script>

<style lang="postcss" scoped>
.checkbox{
  -webkit-appearance: none;
  cursor: pointer;
  width: 40px;
  border: none;
  height:20px;
  position: relative;
  background-color: rgba(158,158,158,0.5);
  border-radius: 50px;
}
.checkbox::after{
  content: "";
  width:20px;
  height:20px;
  border-radius: 50%;
  position: absolute;
  top:0;
  left:0;
  transition: 0.3s;
  background-color: rgba(158,158,158,1);
}
.checkbox:checked::after{
  left:20px;
  background-color: rgb(119 181 80);
}

.menu-item {
  @apply min-w-[220px] max-w-full transition ease-in-out duration-200 w-full grid gap-2 text-sm font-bold items-center h-16 border-2 border-paperdazgreen-400 rounded-2xl px-5 cursor-pointer;
  grid-template-columns: 25px 1fr;
  &:not(:last-child) {
    @apply mb-5;
  }

  &:hover {
    @apply bg-paperdazgreen-400 bg-opacity-5;
  }

  &.active {
    @apply text-white bg-paperdazgreen-400;
  }
}
</style>
