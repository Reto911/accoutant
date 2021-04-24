<template>
  <div
    class="bgimg"
  >
    <img
      :src="img"
      alt=""
      height="100%"
      width="100%"
      @click="ge"
    >
  </div>
</template>

<script>
export default {
  name: "BgPic",
  props: {
    img: {
      type: String,
      default: ""
    }
  },
  data: function () {
    return {
    };
  },
  methods: {
    ge: function () {
      console.log(this.img);
    }
  }
}
</script>

<style scoped>
/*@import '/node_modules/materialize-css/dist/css/materialize.css';*/
.bgimg {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
}
</style>