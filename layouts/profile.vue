<template>
  <!-- Note responsive sidebar breakpoint is lg: 1024px -->
  <div id="dashboard-layout" class="lg:p-4 bg-[#F6F5FA]">
    <div
      id="sidebar-container"
      class="h-full overflow-hidden relative"
      :class="{ active: collapseSidebar }"
    >
      <div class="overlay" @click="collapseSidebar = false"></div>
      <ProfileSidebar class="relative" @close="collapseSidebar = false" />
    </div>
     <ProfileTab/>

    <div id="main-container" class="overflow-y-auto overflow-x-hidden">
      <Nuxt class="py-4 flex-1 px-2 sm:px-4 lg:px-0 lg:pb-10" />
    </div>
    <bottom-nav
      id="bottom-nav"
      class="sticky left-0 right-0 h-12 bottom-0 mt-3 lg:hidden"
    />
  </div>
</template>

<script >
import Vue from 'vue'
import BottomNav from '~/components/navbars/BottomNav.vue'
import ProfileSidebar from '~/components/sidebars/ProfileSidebar.vue'
import login from "~/mixins/login"
import ProfileTab from '../components/widgets/profileTab.vue'
import mixins from 'vue-typed-mixins'


export default mixins(login).extend({
  name: 'ProfileLayout',
  components: { ProfileSidebar, BottomNav, ProfileTab },
  data() {
    return {
      collapseSidebar: false,
    }
  },
  watch: {
    $route() {
      this.collapseSidebar = false
    },
  },
  mounted() {
    this.resizeEventListener()
    window.addEventListener('resize', this.resizeEventListener)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEventListener)
  },
  methods: {
    resizeEventListener() {
      const root = document.querySelector(':root')
      root.style.setProperty('--viewport-height', `${window.innerHeight}px`)
    },
  },
  created(){
     this.filterUsers()
  }
})
</script>

<style lang="scss" scoped>
//     #dashboard-layout {
//   @media only screen and (min-width: 1024px) {
//     height: var(--viewport-height, 100vh);
//     min-height: var(--viewport-height, 100vh);
//     max-height: var(--viewport-height, 100vh);
//     overflow: hidden;
//     display: grid;
//     grid-template-columns: 1fr;
//     /* // grid-template-rows: 1fr; */
//     gap: 16px;
//     grid-template-columns: max-content 1fr;
//   }
// }

// #main-container {
//   /* width */
//   &::-webkit-scrollbar {
//     width: 5px;
//     width: 0;
//   }

//   /* Track */
//   &::-webkit-scrollbar-track {
//     background: #f1f1f1;
//   }

//   /* Handle */
//   &::-webkit-scrollbar-thumb {
//     background: rgba(119, 129, 113, 0.2);
//     border-radius: 2px;
//   }

//   /* Handle on hover */
//   &::-webkit-scrollbar-thumb:hover {
//     background: rgba(183, 239, 148, 1);
//   }
// }

// #sidebar-container {
//   --sidebar-container-width: 240px;
//   position: fixed;
//   z-index: 20;
//   top: 0;
//   bottom: 0;
//   left: calc(0px - var(--sidebar-container-width));
//   /* // left: calc(-1 * var(--sidebar-container-width)); */
//   box-shadow: 2px 0px 13px 2px rgb(151 151 151 / 31%);
//   transition: all ease-in-out 200ms;
//   & .overlay {
//     position: fixed;
//     top: 0;
//     right: 0;
//     left: 0;
//     bottom: 0;
//     z-index: -1;
//     background: rgba(255, 255, 255, 0.5);
//     backdrop-filter: blur(5px);
//     opacity: 0;
//     pointer-events: none;
//     transition: all ease-in-out 200ms;
//   }

//   &.active {
//     left: 0;
//     & .overlay {
//       opacity: 1;
//       pointer-events: all;
//     }
//   }

//   @media only screen and (min-width: 1024px) {
//     --sidebar-container-width: 260px;
//     position: unset;
//     z-index: 10;
//     width: var(--sidebar-container-width);
//     box-shadow: none;
//     & .overlay {
//       display: none;
//     }
//   }
// }
#dashboard-layout {
  --bottom-nav-height: 48px;
  display: grid;
  grid-template-areas:
    'navbar'
    'main-content'
    'bottom-nav-placeholder';
  grid-template-columns: 1fr;
  grid-template-rows: max-content 1fr max-content;
  position: relative;
  column-gap: 16px;
  min-height: var(--viewport-height, 100vh);

  &::after {
    content: '';
    grid-area: bottom-nav-placeholder;
    height: var(--bottom-nav-height);
    display: block;
    @media only screen and (min-width: 1024px) {
      display: none;
    }
  }

  @media only screen and (min-width: 1024px) {
    height: var(--viewport-height, 100vh);
    min-height: var(--viewport-height, 100vh);
    max-height: var(--viewport-height, 100vh);
    overflow: hidden;
    // grid-template-columns: 1fr;
    // grid-template-rows: 1fr;
    // gap: 16px;
    // grid-template-columns: max-content 1fr;
    grid-template-areas:
      'sidebar navbar'
      'sidebar main-content';
    grid-template-columns: max-content 1fr;
    grid-template-rows: max-content 1fr;
  }
}

#bottom-nav {
  grid-area: bottom-nav;
  height: var(--bottom-nav-height);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

#dashboard-navbar {
  grid-area: navbar;
  position: sticky;
  top: 0;
}

#sidebar-container {
  grid-area: sidebar;
}

#main-container {
  grid-area: main-content;
  /* width */
  &::-webkit-scrollbar {
    width: 5px;
    width: 0;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgba(119, 129, 113, 0.2);
    border-radius: 2px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(183, 239, 148, 1);
  }
}

#sidebar-container {
  --sidebar-container-width: 245px;
  position: fixed;
  z-index: 20;
  top: 0;
  bottom: 0;
  left: calc(0px - var(--sidebar-container-width));
  width: var(--sidebar-container-width);
  // left: calc(-1 * var(--sidebar-container-width));
  box-shadow: 2px 0px 13px 2px rgb(151 151 151 / 31%);
  transition: all ease-in-out 200ms;
  & .overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    opacity: 0;
    pointer-events: none;
    transition: all ease-in-out 200ms;
  }

  &.active {
    left: 0;
    .overlay {
      opacity: 1;
      pointer-events: all;
    }
  }

  @media only screen and (min-width: 1024px) {
    --sidebar-container-width: 260px;
    position: unset;
    // z-index: 10;

    box-shadow: none;
    & .overlay {
      display: none;
    }
  }
}
</style>
