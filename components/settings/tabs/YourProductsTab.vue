<template>
  <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,min-content] gap-4">
    <section class="bg-white rounded-2xl py-6 px-8">
      <h3 class="text-[#524D5B] font-medium text-2xl mb-10">Business</h3>
      <ul class="product-list">
        <li>User Dashboard</li>
        <li>Upload up to 100 PDF files</li>
        <li>2 carbon copy Recepients</li>
        <li>Ledger of all Completed Files</li>
        <li>Complete Unlimited PDF Files</li>
        <li>50 requests for Signature</li>
        <li>5 Team members</li>
      </ul>
    </section>
    <section class="bg-white rounded-2xl py-6 px-8 min-w-[400px] flex flex-col">
      <!-- <package-card class="flex-1" /> -->
      <button
        class="text-white font-medium text-xs rounded-full h-7 bg-paperdazgreen-300 mt-5 self-center px-5"
      >
        Upgrade Plan
      </button>
    </section>
  </div>
</template>
<script>
import Vue from 'vue'
import PackageCard from '../PackageCard.vue'
export default Vue.extend({
  name: 'YourProductsTab',
  components: { PackageCard },
})
</script>

<style lang="postcss" scoped>
.product-list {
  @apply text-lg;
  & li:not(:last-child) {
    @apply mb-3;
  }
}
</style>
