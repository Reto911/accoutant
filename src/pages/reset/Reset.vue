<template>
  <div id="resetPage">
    <bg-pic :img="img" />
    <reset-form />
  </div>
</template>

<script>
import ResetForm from "@/components/ResetForm";
import bgPic from "@/components/bgPic";
import axios from "axios";
export default {
  name: "Reset",
  components:{
    bgPic, ResetForm
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
#resetPage {
  height: 100%;
}
</style>