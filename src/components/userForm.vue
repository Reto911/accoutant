<template>
  <div class="md-layout md-alignment-center-center front">
    <slot name="dialog"></slot>
    <div class="md-layout-item md-size-33 whiteForm">
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-80">
          <span
              v-if="error"
              style="color: #FF5252"
          >{{ errorTip }}</span>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "userForm",
  props: {
    error: Boolean,
    errorTip: String
  }
}
</script>

<style scoped>

.front {
  z-index: 1;
  position: relative;
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%);
}

.whiteForm {
  /*background-color: rgba(255, 255, 255, 0.7);*/
  top: 50%;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

</style>