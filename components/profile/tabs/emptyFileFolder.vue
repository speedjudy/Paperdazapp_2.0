<template>
  <div class="bg-white mt-5 rounded-lg overflow-hidden font-family">
    <!-- begin of top header -->
    <h3
      class="flex flex-wrap w-full items-center border-b-[1.5px] border-paperdazgray-200 py-2"
    >
      <div class="name-container">Folders / file</div>
    </h3>
    <!-- end of top header -->

    <div class="empty-container">
      <div class="empty-content">
        <b>Your public profile is empty</b>
        <button>Turn files to paperlink</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.name-container {
  @apply flex truncate w-4/12 justify-start pl-4 text-[17px] font-bold  text-paperdazgreen-500;
}
.empty-content {
  @apply inline-block text-center;
  b {
    @apply text-[17px] w-full block text-center mb-2;
  }
  button {
    @apply bg-paperdazgreen-400 font-[500] text-[15px] text-white py-2 px-8 rounded-md;
  }
}
.empty-container {
  @apply w-full h-[300px] flex justify-center items-center;
}
.font-family {
  font-family: inherit !important;
}
</style>
