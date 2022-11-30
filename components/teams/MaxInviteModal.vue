<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <!-- Start:: Body -->
    <p
      class="text-center block font-medium max-w-[290px] mx-auto mb-6 whitespace-none"
    >
      You have reached
      <span class="font-semibold text-paperdazgreen-500 uppercase"
        >{{teamMembers}} team Members</span
      >
      in your plan. Do you want to upgrade?
    </p>
    <div class="flex justify-around">
      <button
        class="disabled:bg-opacity-50 disabled:cursor-not-allowed h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400"
        type="button"
        :disabled="loading"
        @click="$nuxt.$router.push('/settings?tab=billing')"
      >
        Yes
        <spinner-dotted-icon
          v-show="loading"
          height="20"
          width="20"
          class="animate-spin"
        />
      </button>
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-red-500"
        :disabled="loading"
        @click="closeModal()"
      >
        <span class="inline-flex gap-1 items-center">
          No
        </span>
      </button>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
  name: 'maxInviteModal',
  components: { SpinnerDottedIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    file: {},
    teamMembers:{
    type: Number,
    },
    visible: {
    type: Boolean,
    default: false,
    },
  },
  data() {
    return {
      showModal: false,
      folder: {},
      loading: false
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
    file: function () {
      ;(this.folder) = this.file
      console.log('dekete-mount', this.folder)
    },
  },
  mounted() {
    ;(this.folder) = this.file
  },
  methods: {
    closeModal() {
      this.$emit('updateVisibility', false)
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 416px !important;
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
