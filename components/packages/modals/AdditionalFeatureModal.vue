<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit">
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
      <h4
        class="text-center font-semibold text-xl text-paperdazgreen-400 border-b border-paperdazgreen-400 pb-2"
      >
        Additional Features
      </h4>
    </template>
    <!-- Start:: Body -->
    <div class="w-full overflow-x-auto custom-scrollbar">
      <table class="custom-table w-full">
        <tbody>
          <tr>
            <td>Paperlink</td>
            <td class="">${{paperlink_calculate}}.00</td>
            <td class="w-[150px]">
              <el-input-number
              v-model.number="updatePackage.additional_paperlink"
               size="small" 
               :min="0"  />
            </td>
          </tr>
          <tr>
            <td>Team Member</td>
            <td class="">${{team_calculate}}.00</td>
            <td class="w-[150px]">
              <el-input-number
               v-model.number="updatePackage.additional_teamMembers"
               size="small" :min="0" />
            </td>
          </tr>
          <tr>
            <td>CC Flow</td>
            <td class="">${{cc_calculate}}.00</td>
            <td class="w-[150px]">
              <el-input-number 
               v-model.number="updatePackage.additional_cc"
              size="small" :min="0" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid place-items-center mt-10">
      <button
      :disabled="isLoading == true"
      @click.prevent="updateData"
      :class="[isLoading == true ? 'opacity-50' : 'opacity-100']"
        class="text-white bg-paperdazgreen-400 px-5 h-10 text-lg rounded shadow w-[120px] flex justify-center items-center"
      >
          Save
          <spinner-dotted-icon
            v-show="isLoading == true"
            height="25"
            width="25"
            class="animate-spin ml-2"
          />
      </button>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import AuthUser from '~/models/AuthUser'

export default Vue.extend({
  name: 'AdditionalFeatureModal',
  components:{SpinnerDottedIcon},
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isSubscribeActive:{
      type: Boolean
    }
  },
  data() {
    return {
      showModal: false,
      isLoading:false,
      updatePackage:{
        upgrade:true,
        additional_paperlink:1,
        additional_teamMembers:1,
        additional_cc:1,
        action: 'upgrade'
      }
    }
  },
  computed:{
     cc_calculate(){
      return (this.updatePackage).additional_cc
     },
      team_calculate(){
      return (this.updatePackage).additional_teamMembers
     },
      paperlink_calculate(){
      return (this.updatePackage).additional_paperlink
     }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    }
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    async updateData(){
       if(this.isSubscribeActive){
         this.$notify.info({
         title:"Billing",
         message: "Your auto-subscription is not active"
         })
         return
       }
      
      this.isLoading = true
      // return
      this.$axios
        .$patch(`/subscriptions/${(this.$auth.user).subscriptionId}`,
          {...this.updatePackage}
        )
        .then((response) => {
          this.$notify.success({
          title: 'Package',
          message: 'Package updated successfully',
          })
          this.$emit('updateVisibility', false)
          this.$nuxt.refresh()
        })
        .catch((err) => {
          this.$notify.error({
          title: 'Package',
          message: 'Unable to update package',
          })
        })
        .finally(()=>{
          this.isLoading = false
          })
    }
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 600px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 20px;
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
