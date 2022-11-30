<template>
  <nav class="flex flex-col bg-white h-full w-full rounded-2xl py-8">
    <div class="flex justify-end px-8">
      <span
        class="py-2 mb-3 cursor-pointer inline-block lg:hidden"
        @click="$emit('close')"
      >
        <times-icon width="12" height="12" />
      </span>
    </div>
    <nuxt-link to="/" class="flex items-center justify-center mb-14 px-8">
      <logo-with-text class="h-8 w-auto" />
    </nuxt-link>

    <section class="text-white bg-paperdazgreen-500 rounded-[inherit] py-[15px]">
    <ul class="overflow-y-auto overflow-x-hidden flex-1 px-4 custom-scrollbar">
       <div class="middle-space-divider text-center px-2 flex justify-center items-center flex-wrap">
            
          <div>
            <p class="py-1 font-[500] text-[15px]">Contactless Paperless </p>
            <div class="py-[1em] font-[700] text-center text-[19px]">
                Responsible<br/>
                  Be Social<br/>
                    Together !
            </div>
            <span class="text-[13px] font-[400] block w-[200px]">Keep everyone safe<br/> and the world green.</span>
       </div>
     </div>  
   </ul>
  

       
    
    <div class="px-8">
      <p class="text-center text-white mb-6 font-medium">Share</p>
      <div class="flex flex-wrap items-center gap-2 justify-center">
        <span
         @click="socialShareFunction('facebook')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white"
        >
          <facebook-icon height="12" />
        </span>
        <span
          @click="socialShareFunction('linkedin')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white"
        >
          <linked-in-icon height="12" />
        </span>
        <span
        @click="socialShareFunction('linkedin')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white"
        >
          <instagram-icon height="11" />
        </span>
        <span
          @click="socialShareFunction('twitter')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white"
        >
          <twitter-icon height="11" />
        </span>
      </div>
      <p class="text-white text-[11px] mt-3 text-center">
        powered by
        <span class="font-semibold uppercase text-[15px]">Paperdaz</span>
      </p>
    </div>
</section>


  </nav>
</template>

<script>
import Vue from 'vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import LogoWithText from '../LogoWithText.vue'
import EnvelopeIcon from '../svg-icons/EnvelopeIcon.vue'
import FacebookIcon from '../svg-icons/FacebookIcon.vue'
import LinkedInIcon from '../svg-icons/LinkedInIcon.vue'
import ReditIcon from '../svg-icons/ReditIcon.vue'
import SvgIcon from '../svg-icons/SvgIcon.vue'
import TimesIcon from '../svg-icons/TimesIcon.vue'
import TwitterIcon from '../svg-icons/TwitterIcon.vue'
import WhatsappIcon from '../svg-icons/WhatsappIcon.vue'
import InstagramIcon from '../svg-icons/InstagramIcon.vue'
export default Vue.extend({
  name: 'ProfileSidebar',
  components: {
    LogoWithText,
    SvgIcon,
    FacebookIcon,
    LinkedInIcon,
    EnvelopeIcon,
    TwitterIcon,
    WhatsappIcon,
    ReditIcon,
    TimesIcon,
    InstagramIcon
  },
  data() {
    return {
      links: [
        { label: 'Dashboard', icon: 'DashboardIcon', link: '/dashboard' },
        // { label: 'Profile', icon: 'UserProfileIcon', link: '/profile' },
        // { label: 'My Files', icon: 'FileIcon', link: '/my-files' },
        // { label: 'Team', icon: 'HoldingHandsIcon', link: '/team' },
        { label: 'Home', icon: 'HomeIcon', link: '/', exact: true },
        { label: 'Packages', icon: 'NewsPaperIcon', link: '/packages' },
        { label: 'FAQ', icon: 'ConversationIcon', link: '/faq' },
        // {
        //   label: 'Public Profile',
        //   icon: 'UserProfileIcon',
        //   link: '/public/profile',
        // },
        { label: 'Contact us', icon: 'CustomerCareIcon', link: '/contact-us' },
      ],
    }
  },
  beforeMount() {
    if (this.$store.getters.userType === UserTypeEnum.PAID) {
      this.links.splice(1, 0, {
        label: 'Team',
        icon: 'HoldingHandsIcon',
        link: '/team',
      })
      this.links.splice(1, 0, {
        label: 'Company Files',
        icon: 'DocumentIcon',
        link: '/company-files',
      })
    } else if (this.$store.getters.userType === UserTypeEnum.FREE) {
      this.links.splice(1, 0, {
        label: 'My Files',
        icon: 'FileIcon',
        link: '/my-files',
      })
    }
  },
  methods: {
    socialShareFunction(val){
         switch (val) {
          case 'linkedin':
            window.open(`https://www.linkedin.com/company/80987259/`)
            break;
          case 'whatsapp':
            window.open(`whatsapp://send?text=${window.location.origin}`)
            break; 
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${window.location.origin}`)
            break; 
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`)
            break; 
          case 'instagram':
            window.open(`https://www.instagram.com/paperdaz_/`)
            break;  
         }
      },
  },
})
</script>

<style lang="postcss" scoped>
.nav-item {
  @apply flex items-center whitespace-nowrap gap-4 text-paperdazgray-300 text-sm py-4 px-4 rounded-xl transition ease-in-out overflow-hidden;
  background: transparent;
  & > * {
    position: relative;
    z-index: 1;
  }
  &.active {
    @apply text-white bg-paperdazgreen-300;
    box-shadow: 0px 5px 7px 2px rgba(95, 201, 63, 0.25);
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 13px;
      width: 13px;
      border-radius: 50%;
      top: 8px;
      right: 15%;
      background: rgba(255, 255, 255, 0.2);
    }
    &::after {
      content: '';
      position: absolute;
      height: 45px;
      width: 45px;
      border-radius: 50%;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(10%, 20%);
    }
  }
}
.middle-space-divider{
     @apply w-full;
     height: calc(100vh - 10em - 10em);
}
</style>
