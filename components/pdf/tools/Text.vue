<template>
  <div class="text-field tool">
    <input type="text" v-model="text" v-if="(isActive || justMounted) && !isCreator" :style="style" 
    class="input-annotation"
    />
    <p v-else :style="style">{{ text || 'Click to type' }}</p>
  </div>
</template>

<script>
import TeamAccess from '~/models/TeamAccess'

export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    value: String,
    file: Object,
    justMounted: Boolean,
  },
  data: () => ({
    text: null,
  }),
  created(){
    this.text = this.value
  },
  watch: {
    value(v){
      if(this.text != v) this.text = v;
    },
    text(v){
      if(this.value != v) this.$emit('input', v)
    },
  },
  computed: {
    isCreator() {
        return (this.file.userId == this.$auth.user.id) || ((this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE) && this.$auth.user.teamId == this.file.userId)
      },
    style() {
      return {
        fontSize: `${this.fontSize || 11}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
input {
  border: 0.5px solid rgb(15, 207, 15);
  background-color: transparent;
  border-radius: 4px;
}
.input-annotation:focus{
  border: 1px solid green
}
.input-annotation:blur{
  border: 1px solid transparent
}
</style>
