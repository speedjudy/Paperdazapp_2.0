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
      <h4 class="text-center font-semibold text-2xl text-gray-800 pb-2">
        Carbon Copy Flow
      </h4>
    </template>
    <!-- Start:: Body -->

    <div class="max-w-[470px] mx-auto">
      <form action="" class=" " @submit.prevent="addItem">
        <div class="grid grid-cols-[1fr,min-content] items-center gap-3 mb-8">
          <el-input placeholder="Email" type="email" v-model="email" required />

          <button
            type="submit"
            class="circle circle-18 bg-gray-600 text-white font-medium text-xl"
          >
            +
          </button>
        </div>
      </form>

      <div
        class="rounded-lg border border-gray-300 min-h-[200px] text-gray-700"
      >
        <div
          class="p-4 flex items-center h-12 justify-between"
          v-show="emails.length > 0"
          v-for="em in emails"
          :key="em"
        >
          {{ em }}
          <button
            class="p-2 text-red-500 text-xl font-medium"
            @click="removeItem(em)"
          >
            &times;
          </button>
        </div>
        <div v-show="emails.length == 0" class="p-4 text-gray-400">
          Add emails above
        </div>
      </div>

      <button
      :disabled="loading"
      @click="onSubmit"
      type="submit"
      class="w-full mt-8 flex justify-center items-center bg-paperdazgreen-400 rounded-lg text-white h-12"
      :class="[loading ? 'opacity-40' : 'opacity-100']"
      >
        Send
        <SpinnerDottedIcon width="20" v-if="loading" class="animate-spin ml-2"/>
      </button>
    </div>

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
    name: "PdfCCFlowModal",
    model: {
        prop: "visible",
        event: "updateVisibility",
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        },
      file:{
          type: Object
        }
    },
    data() {
        return {
            showModal: false,
            email: "",
            description: "",
            loading: false,
            emails: [],
            subscriptions: {}
        };
    },
    async fetch() {
        await this.$axios.get(`/subscriptions?userId=${localStorage.getItem("paperdaz_userID")}`)
        .then((response) => {
        this.subscriptions = response.data.data[0];
        })
        .catch((err) => { console.log(err); });
    },
    watch: {
        visible(val) {
            this.showModal = val;
        },
        showModal(val) {
            this.$emit("updateVisibility", val);
        },
    },
    mounted() {
        console.log("sub", this.subscriptions);
        this.showModal = this.visible;
    },
    methods: {
        async onSubmit() {
         if(this.loading || this.emails.length < 1) return

          this.loading = true

          await this.$axios.patch(`/files/${this.file.id}`,
          { cc:this.emails.join(",") }
          )
          .then((response) => {
            console.log(response)
           this.$notify.success({
            title:"file",
            message:'carbon copy successful'
           })
        })
        .catch((err) => {  this.$notify.error({
            title:"file",
            message:'carbon copy failled'
           }) 
           })
           .finally(()=>{
             this.loading = false
           })
        },
        closeModal() {
            this.$emit("updateVisibility", false);
        },
        removeItem(item) {
            const index = this.emails.findIndex((el) => el == item);
            if (index < 0)
                return;
            this.emails.splice(index, 1);
        },
        addItem() {
            event?.preventDefault();
            if (this.emails.length > Number(this.subscriptions.cc) -1) {
              this.$notify.info({
              message: "you have reached the max carbon copy members, go to billing to upgrade"
              });
              return;
              }
            const index = this.emails.findIndex((el) => el == this.email);
            if (index >= 0 || !this.email)
                return;
            this.emails.push(this.email);
            this.email = "";
        },
    },
    components: { SpinnerDottedIcon }
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
