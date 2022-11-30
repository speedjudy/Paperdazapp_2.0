<template>
    <button class="text-white bg-paperdazgreen-400 py-2 px-5 rounded-[5px] text-[14px]"
    :class="[width ? 'w-[' + width + ']' : '']"
    >
        {{ title }}
    </button>
</template>

<script>
    export default {
        name:"custom-button",
        props:["title",'width'],
    }
</script>

<style lang="scss" scoped>

</style>