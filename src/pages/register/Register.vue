<template>
  <div id="regPage">
    <bg-pic :img="img" />
    <reg-form />
  </div>
</template>

<script>
import bgPic from "@/components/bgPic";
import RegForm from "@/components/RegForm";
import axios from "axios";

export default {
  name: "Register",
  components: {
    bgPic, RegForm
  },
  data() {
    return {
      img: "/static/image/OHR.CarrizoPlain_ZH-CN5933565493_1920x1080.jpg"
    }
  },
  beforeCreate() {
    axios.get("/bgimg")
        .then(res => {
          console.log(res.data);
          this.img = res.data;
        })
        .catch(err => {
          console.log(err);
        })
  }
}
</script>

<style scoped>
#regPage {
  height: 100%;
}
</style>