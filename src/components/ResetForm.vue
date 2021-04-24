<template>
  <div class="md-layout md-alignment-center-center front">
    <div class="md-layout-item md-size-33 reset">
      <div class="md-layout md-alignment-center-center">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResetForm"
}
</script>

<style scoped>
@import '../css/icon.css';
.front {
  z-index: 1;
  position: relative;
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%);
}

.reset {
  /*background-color: rgba(255, 255, 255, 0.7);*/
  top: 50%;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

#register {
  width: 100%;
}
</style>