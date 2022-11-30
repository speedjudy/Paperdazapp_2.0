<template>
  <section class="flex flex-wrap w-full md:justify-between font-family">
    <!-- logo container -->
    <div class="bg-white md:w-3/12 lg:w-[19%] w-full profile-image-container">
      <div class="icon-img relative" @click="changeProfileimage">
        <input
          type="file"
          class="hidden"
          v-show="false"
          @change="uploadProfilePicture"
          ref="referenceInput"
        />
        <img
          v-if="profilePhoto != null"
          :src="profilePhoto"
          id="referenceImg"
          class="top-profile-image cursor-pointer"
        />
        <span v-else>
          {{ firstCompanyName }}
        </span>
      </div>
      <div v-if="isUser" class="text-wrapper">Click to upload an image</div>
    </div>
    <!-- end of logo container -->

    <!-- dentals container -->
    <div class="bg-white sm:w-12/12 md:w-5/12 lg:w-[60%] w-full profile-dental-container">
      <!-- <h1>{{user.companyName || ''}}</h1> -->
      <div class="input-wrapper">
        <input
          type="text"
          v-model="address"
          placeholder="Company`s address"
          :disabled="initialInput"
          :class="[initialInput ? 'text-gray-400' : 'text-black']"
        />
        <button v-if="isUser" @click="toggleInput">
          <Pencil v-if="initialInput" :width="18" />
          <span class="text-[15px] font-[900] text-paperdazgreen-500" v-else
            >&#x2715;</span
          >
        </button>
      </div>

      <div class="input-wrapper">
        <input
          type="number"
          v-model="phone"
          placeholder="Company`s phone number"
          :disabled="initialInput2"
          :class="[initialInput2 ? 'text-gray-400' : 'text-black']"
        />
        <button v-if="isUser" @click="toggleInput2">
          <Pencil v-if="initialInput2" :width="18" />
          <span class="text-[15px] font-[900] text-paperdazgreen-500" v-else
            >&#x2715;</span
          >
        </button>
      </div>

      <div class="w-full grid place-items-center">
        <button
          class="w-[160px] flex justify-center items-center text-white py-2 mt-3 text-center border-none bg-paperdazgreen-400 rounded-md"
          v-if="showUpdateButton"
          :class="[isLoading ? 'opacity-50' : 'opacity-100']"
          :disabled="isloading"
          @click="patchUser"
        >
          Update
          <SpinnerDottedIcon
            v-if="isLoading"
            height="20"
            width="20"
            class="animate-spin ml-2"
          />
        </button>
      </div>
    </div>
    <!-- end of dentals container -->

    <!-- SCANNER CONTAINER -->
    <div
      class="scanner-container sm:w-12/12 md:w-3/12 lg:w-[18%] w-full flex items-center flex-wrap justify-center"
    >
      <b class="w-full block">Scan to show all files</b>
      <div class="flex justify-center">
        <canvas ref="qrcancas" width="200" height="200" class="object-contain"></canvas>
      </div>
    </div>
    <!-- END OF SCANNER CONTAINER -->
  </section>
</template>

<script>
import Pencil from "~/assets/recent-icons/pencil.vue";
import Vue from "vue";
//   import VueQrcode from 'vue-qrcode'
import QRCode from "qrcode";
import login from "~/mixins/login";
import mixins from "vue-typed-mixins";
import SpinnerDottedIcon from "../svg-icons/SpinnerDottedIcon.vue";
import { ErrorHandler } from "../functions/ErrorFunction";

export default mixins(login).extend({
  name: "profile-top-info",
  props: ["userInfo"],
  data() {
    return {
      initialInput: true,
      initialInput2: true,
      showScanner: false,
      profilePicsSrc: "",
      qrCls: "qrcode",
      qrText: "https://photophobic.web.app",
      size: 170,
      background: "transparent",
      phone: "",
      address: "",
      isLoading: false,
    };
  },
  // async asyncData({ params, query, $axios}) {
  //    let companyUser = $axios.get(`/users/${}`)
  // },
  components: { Pencil, SpinnerDottedIcon },
  methods: {
    getTeamPublicFolder() {
      this.$axios.get();
    },
    patchUser() {
      if ((this.address.trim() == "" && this.phone.trim() == "") || this.isLoading)
        return;
      this.isLoading = true;
      this.$axios
        .$patch(`/users/${this.$auth.user.id}`, {
          address: this.address,
          phone: this.phone,
        })
        .then(() => {
          this.$notify.success({
            message: "Updated successfully",
          });
          this.initialInput = true;
          this.initialInput2 = true;
          this.showUpdateButton = false;
          this.isLoading = false;
        })
        .catch(({ response }) => {
          let message = ErrorHandler(response);
          this.$notify
            .error({
              message: message,
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
    },
    toggleInput() {
      this.initialInput = !this.initialInput;
    },
    toggleInput2() {
      this.initialInput2 = !this.initialInput2;
    },
    changeProfileimage() {
      if (!this.isUser) return;
      this.$refs.referenceInput.click();
    },
    async uploadProfilePicture(event) {
      if (!this.isUser) return;

      let fileInput = event.target;

      if (fileInput.files.length < 1 || fileInput.files[0].size / 1024 / 1024 > 2) {
        this.$notify.error({
          message: "File size must be less than 2MB",
        });
        return;
      }

      let formdata = new FormData();
      formdata.append("upload", fileInput.files[0], "user-profile-picture.jpg");
      formdata.append("type", "profilePicture");
      formdata.append("userId", this.user.id);

      await this.$axios
        .$patch(`/files`, formdata)
        .then(() => {
          //@ts-ignore
          this.filterUsers();
        })
        .catch(() => {
          this.$notify.error({
            message: "Unable to upload profile picture",
          });
        });
    },
  },
  mounted() {
    console.log(">>>>>>>>>>>>???", this.userInfo);
    this.phone = this.userInfo?.phone;
    this.address = this.userInfo?.address;
    QRCode.toCanvas(this.$refs.qrcancas, this.qrCodeurl, function () {});
    //  await this.$nextTick()
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('style')
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('height')
    // ;(this.$refs.qrcancas as HTMLElement).removeAttribute('width')
    //     },
  },
  computed: {
    firstCompanyName() {
      return (this.userInfo?.companyName || "").charAt(0).toUpperCase();
    },
    showUpdateButton() {
      return !this.initialInput || !this.initialInput2;
    },
    qrCodeurl() {
      return `${window.origin}/public/profile/${this.userInfo?.id}`;
    },
    login() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth?.user;
    },
    isUser() {
      return this.user?.id == this.userInfo?.id;
    },
    profilePhoto() {
      return this.userInfo?.profilePicture;
    },
  },
  watch: {
    "$auth.user": function () {
      this.address = this.$auth.user?.address || "";
      this.phone = this.$auth.user?.phone || "";
      QRCode.toCanvas(this.$refs.qrcancas, this.qrCodeurl, function () {});
    },
  },
});
</script>

<style lang="scss" scoped>
.font-family {
  font-family: inherit !important;
}
.profile-image-container {
  @apply bg-white flex justify-center flex-wrap items-center py-4 rounded-[10px];
  .icon-img {
    @apply w-40 h-40 font-[900] text-[6em] text-paperdazgreen-500 cursor-pointer 
              border-2 border-paperdazgreen-400/60 grid place-items-center rounded-[8px];
    text-shadow: 1px 5px 7px rgb(148 148 148);
  }
  .text-wrapper {
    @apply block w-full text-center text-[0.8rem] text-paperdazgray-400 mt-1;
  }
}

.profile-dental-container {
  @apply py-4 rounded-[10px];
  h1 {
    @apply border-b-2 border-paperdazgray-200 py-4
        text-[1.2rem] pl-4 font-medium;
  }
  .input-wrapper {
    @apply border-b-2 border-paperdazgray-200 py-2;
    input {
      @apply border-none bg-transparent px-3 text-[16px];
      width: calc(100% - 40px);
      outline: none !important;
    }
    button {
    }
  }
}

.scanner-container {
  @apply bg-white rounded-[10px] py-4;
  b {
    @apply block text-center text-[0.8rem];
  }
}
.top-profile-image {
  @apply absolute w-[90%] h-[90%] mt-[5%] ml-[5%] object-cover rounded-lg m-2;
}
</style>
