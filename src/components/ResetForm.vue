<template>
  <user-form
      :error="false"
      :error-tip="null">

  </user-form>
</template>

<script>
import userForm from "@/components/userForm";
import UserForm from "@/components/userForm";
export default {
  name: "ResetForm",
  components: {UserForm},
  comments:{
    userForm
  }
}
</script>

<style scoped>
@import '../css/icon.css';

</style>