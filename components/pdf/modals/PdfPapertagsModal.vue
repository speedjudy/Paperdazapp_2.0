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
        Papertags
      </h4>
    </template>
    <!-- Start:: Body -->

    <div class="max-w-[470px] mx-auto">
      <form action="" class=" " @submit.prevent="addItem">
        <div class="grid grid-cols-[1fr,min-content] items-center gap-3 mb-8">
          <el-input placeholder="Papertag" type="text" v-model="tag" required />

          <button
            type="submit"
            class="circle circle-18 bg-gray-600 text-white font-medium text-xl"
          >
            +
          </button>
        </div>
      </form>

      <div
        class="rounded-lg border border-gray-300 min-h-[200px] text-gray-700 p-4"
      >
        <div v-show="tags.length > 0" class="flex flex-wrap gap-4 flex-wrap">
          <div
            class="p-2 flex items-center h-8 gap-1 rounded-full bg-gray-100 border border-gray-300 text-xs"
            v-for="em in tags"
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
        </div>
        <div v-show="tags.length == 0" class="text-gray-400">
          Add tags above
        </div>
      </div>

      <button
      @click="onSubmit"
        type="submit"
        class="w-full flex justify-center items-center mt-8 bg-paperdazgreen-400 rounded-lg text-white h-12"
       :class="[ isLoading ? 'opacity-50' : 'opacity-100']"
       :disabled="isLoading"
      >
        Send
        <SpinnerDottedIcon 
        class="ml-2 animate-spin" width="18" height="18"
        :class="[ isLoading ? 'inline-block' : 'hidden']"
        />
      </button>
    </div>

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
    name: "PdfPapertagsModal",
    model: {
        prop: "visible",
        event: "updateVisibility",
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        file: {
            type: Object
        }
    },
    data() {
        return {
            showModal: false,
            tag: "",
            description: "",
            tags: [],
            isLoading: false,
        };
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
        this.showModal = this.visible;
    },
    methods: {
        onSubmit() {
           
           if(this.isLoading) return

           this.isLoading = true

            this.$axios.post("/filetags", {
                tags: [...this.tags],
                fileId: this.file.id
                })
                .then(() => {
                this.$notify.success({
                    title: "file-tags",
                    message: "Tags saved successful"
                });
                this.$emit("updateVisibility", false);
                })
                .catch(() => {
                this.$notify.error({
                    title: "file-tags",
                    message: "Tags not saved"
                });
            }).finally(()=>{this.isLoading = false})
        },
        closeModal() {
            this.$emit("updateVisibility", false);
        },
        removeItem(item) {
            const index = this.tags.findIndex((el) => el == item);
            if (index < 0)
                return;
            this.tags.splice(index, 1);
        },
        addItem() {
            event?.preventDefault();
            const index = this.tags.findIndex((el) => el == this.tag);
            if (index >= 0 || !this.tag)
                return;
            this.tag = String(this.tag).replace(/^#*(.+)/, "#$1");
            this.tags.push(this.tag);
            this.tag = "";
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
