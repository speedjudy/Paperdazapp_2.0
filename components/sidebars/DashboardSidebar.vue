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
    <ul class="overflow-y-auto overflow-x-hidden flex-1 px-4 custom-scrollbar">
      <li>
        <div
          v-for="(link, i) in links"
          :key="i"
          class="nav-item cursor-pointer"
          @click="shuffleRoute(i, link.link, link.label)"
          :class="{
            active: link.exact,
            // ? $nuxt.$route.path == link.link
            // : $nuxt.$route.fullPath.startsWith(link.link),
          }"
        >
          <div class="w-5 h-5">
            <svg-icon
              class="h-full w-full"
              height="100%"
              width="100%"
              :value="link.icon"
            />
          </div>
          <span>{{ link.label }}</span>
        </div>
      </li>
    </ul>
    <div class="px-8">
      <p class="text-center text-[#909090] mb-6 font-medium">Find us on</p>
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
      <p class="text-paperdazgreen-300 text-[11px] mt-3 text-center">
        powered by
        <span class="font-semibold uppercase text-[15px]">Paperdaz</span>
      </p>
    </div>
  </nav>
</template>

<script>
import Vue from 'vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import AuthUser from "~/models/AuthUser"
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
import TeamAccess from "~/models/TeamAccess"

export default Vue.extend({
  name: 'DashboardSidebar',
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
      routeIndex: 1,
      links: [
        {
          label: 'Dashboard',
          icon: 'DashboardIcon',
          link: '/dashboard',
          exact: true,
        },
        { label: 'Home', icon: 'HomeIcon', link: '/', exact: false },
        {
          label: 'Packages',
          icon: 'NewsPaperIcon',
          link: '/packages/?type=default',
          exact: false,
        },
        { label: 'FAQ', icon: 'ConversationIcon', link: '/faq', exact: false },
        // {
        //   label: 'Public Profile',
        //   icon: 'UserProfileIcon',
        //   link: '/public/profile',
        // },
        {
          label: 'Contact us',
          icon: 'CustomerCareIcon',
          link: '/contact-us',
          exact: false,
        },
      ],
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
      getCurrentRoute(){
       let  pathHistory  = (this.$nuxt.$router).history.current.fullPath;

        (this.links) = this.links.map((item, i) => {
        if ( pathHistory == item.link ) {
        return { ...item, exact: true }
        } else {
        return { ...item, exact: false }
        }
      })
      },
    shuffleRoute(index, link, name) {
      ;(this.links) = this.links.map((item, i) => {
        if (index == i) {
          return { ...item, exact: true }
        } else {
          return { ...item, exact: false }
        }
      })

      switch (name) {
        case 'Packages':
        this.isPaidUser ? this.$nuxt.$router.push('/settings?tab=billing') : this.$nuxt.$router.push('/packages?type=default')
          break;
      
        default:
          this.$nuxt.$router.push(link)
          break;
      }
    },
    checkToRouteLinks() {
      if (this.$store.getters.userType === UserTypeEnum.PAID) {
        this.links.splice(1, 0, {
          label: 'Team',
          icon: 'HoldingHandsIcon',
          link: '/team',
          exact: false,
        })
        this.links.splice(1, 0, {
          label: 'Company Files',
          icon: 'DocumentIcon',
          link: '/company-files',
          exact: false,
        })
      }
       if (this.$store.getters.userType === UserTypeEnum.TEAM) {
        this.links.splice(1, 0, {
          label: 'Company Files',
          icon: 'DocumentIcon',
          link: '/company-files',
          exact: false,
        })
      }
      // else if (this.$store.getters.userType === UserTypeEnum.FREE) {
      //   this.links.splice(1, 0, {
      //     label: 'My Files',
      //     icon: 'FileIcon',
      //     link: '/my-files',
      //     exact: false,
      //   })
      // }
    },
  },
  computed: {
    isPaidUser(){
      return this.$auth.user.role == UserTypeEnum.PAID
    }
  },
  mounted() {
    this.checkToRouteLinks()
  },
  watch: {
    '$auth.user.role': function () {
      this.checkToRouteLinks()
      this.getCurrentRoute()
    },
    "$nuxt.$route": function(){
      this.getCurrentRoute()
    }
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
    transition: 0.25s;
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
</style>
