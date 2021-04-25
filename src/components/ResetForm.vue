<template>
  <user-form
    :error="false"
    :error-tip="null"
  />
</template>

<script>
import userForm from "@/components/userForm";
import UserForm from "@/components/userForm";
export default {
  name: "ResetForm",
  comments:{
    userForm
  },
  components: {UserForm}
}
</script>

<style scoped>
@import '../css/icon.css';

</style>