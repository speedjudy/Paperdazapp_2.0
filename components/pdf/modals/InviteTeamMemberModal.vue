<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit;">
      <span
        class="circle circle-12 bg-white cursor-pointer text-red-600"
        @click="closeModal()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042"
          />
        </svg>
      </span>
    </div>
    <!--End:: Close Button -->
    <template #title>
      <h4 class="font-semibold text-xl text-gray-800 pt-4">
        Invite Team Member
      </h4>
    </template>
    <!-- Start:: Body -->
  <form  @submit.prevent="sendInviteLink">
    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-[1fr,max-content] items-center gap-3 mb-8"
      >
        <div>
          <label for="" class="block font-medium mb-3">Email Address</label>
          <el-input 
          :disabled="isLoading"
          placeholder="Email" type="email" v-model="email" required />
        </div>

        <div>

        </div>
      </div>
    </div>

    <p class="mt-10 font-medium mb-3">Use invite link</p>
    <div class="px-3 py-2 bg-paperdazgreen-400 flex items-center h-16">
      <p
        class="bg-white h-full mr-3 flex-1 truncate flex items-center px-2 text-sm"
      >
        <span class="truncate"
          >{{ teamInviteLink }}</span
        >
      </p>
      <button @click.prevent="copyTeamLink" class="bg-paperdazgreen-700 text-white px-5 h-full">Copy</button>
    </div>

    <!-- end :: body -->


      <div class="py-3 grid place-items-center">
        <button
        :disabled="isLoading"
        :class="[isLoading? 'opacity-50' : 'opacity-100']"
          type="submit"
          class="shadow-lg w-full bg-paperdazgreen-400 rounded-lg text-white h-12 max-w-[450px] flex justify-center items-center"
        >
          INVITE
          <SpinnerDottedIcon
          v-if="isLoading"
           class="animate-spin ml-2" width="20" height="20"/>
        </button>
      </div>
    
  </form>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import AuthUser from '~/models/AuthUser'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'

export default Vue.extend({
    name: "InviteTeamMemberModal",
    model: {
        prop: "visible",
        event: "updateVisibility",
    },
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        reachLimit: {
            type: Boolean
        }
    },
    data() {
        return {
            showModal: false,
            email: "",
            access: "",
            teamInviteLink: "",
            isLoading: false,
        };
    },
    watch: {
        visible(val) {
          this.showModal = val;
          (this.teamInviteLink) = `${window.location.origin}/register/?teamId=${(this.$auth.user).id}`;

        },
        showModal(val) {
            this.$emit("updateVisibility", val);
        },
    },
    mounted() {
        this.showModal = this.visible;
        (this.teamInviteLink) = `${window.location.origin}/register/?teamId=${(this.$auth.user).id}`;
    },
    methods: {
        copyTeamLink() {
            navigator.clipboard.writeText(this.teamInviteLink);
            this.$notify.info({
                message: "Copied"
            });
        },
        async sendInviteLink() {
                
            if (this.reachLimit) {
                this.$emit("maxpopup");
                return;
            }

             if(this.isLoading) return 
             this.isLoading = true

            // <------START: payload data---------->
            let requestData = {
                action: "invite_link",
                emails: [this.email],
                link: this.teamInviteLink
            };
            // <------END: payload data---------->

            await this.$axios.$post(`/request`, requestData)
                .then(() => {
                this.$notify.success({
                    message: "Invite sent successfully"
                });
                this.closeModal();
                })
                .catch(() => {
                this.$notify.error({
                    message: "Invite sent failed"
                });
                })
                .finally(()=>{
                   this.isLoading = false;
                });
            
        },
        closeModal() {
            this.$emit("updateVisibility", false);
        },
    },
    components: { SpinnerDottedIcon }
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 830px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 20px;
  border-bottom: 1px solid #dadada;
}

* >>> .el-dialog__footer {
  border-top: 1px solid #dadada;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  /* padding-top: 0 !important;
  padding-bottom: 0 !important; */
  background: #fcfcfd;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
