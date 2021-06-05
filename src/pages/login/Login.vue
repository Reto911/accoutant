<template>
  <div id="loginPage">
    <bg-pic :img="img" />
    <login-form />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import bgPic from "@/components/bgPic";
import axios from "axios";

export default {
  name: "Login",
  components: {
    LoginForm, bgPic
  },
  data() {
    return {
      img: "/static/image/OHR.CarrizoPlain_ZH-CN5933565493_1920x1080.jpg"
    }
  },
  beforeCreate() {
    axios.get("/bgimg")
    .then(res => {
      // console.log(res.data);
      this.img = res.data;
    })
    .catch(err => {
      console.log(err);
    })
  }
}
</script>

<style scoped>
#loginPage {
  height: 100%;
}
</style>