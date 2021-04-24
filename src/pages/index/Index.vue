<template>
  <div>
    <md-datepicker
      v-model="birthday"
      md-immediately
    >
      <label>生日</label>
    </md-datepicker>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return{
      birthday:null
    }
  }
}
</script>

<style scoped>

</style>