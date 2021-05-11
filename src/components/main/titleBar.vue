<template>
  <div>
    <md-toolbar
      class="md-primary"
      style="flex: 1;"
    >
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button md-primary">
            <md-icon>menu</md-icon>
          </md-button>
          <h1 class="md-title">
            {{ username }}
          </h1>
        </div>
        <div class="md-toolbar-section-end">
          <md-button>统计</md-button>
          <md-button>设置</md-button>
          <md-button @click="$emit('logout')">
            退出
          </md-button>
        </div>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: "TitleBar",
  props: {
    username: {
      type: String,
      default: "Unknown"
    }
  }
}
</script>

<style scoped>
@import "../../css/icon.css";
</style>