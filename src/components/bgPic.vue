<template>
  <div
    class="bgimg"
    :style="bg"
  >
  <!--    <img-->
  <!--      :src="img"-->
  <!--      alt=""-->
  <!--      height="100%"-->
  <!--      width="100%"-->
  <!--    >-->
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
  computed: {
    bg() {
      return {
        backgroundImage: `url(${this.img})`
      }
    }
  },
  methods: {

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
  -webkit-transition: background 4s;
}
</style>