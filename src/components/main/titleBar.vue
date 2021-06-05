<template>
  <div>
    <md-toolbar
      class="md-primary"
      style="flex: 1;"
    >
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h1 class="md-title">
            {{ username }}
          </h1>
        </div>
        <div class="md-toolbar-section-end">
          <md-button
            v-if="username !== 'root'"
            to="/home"
          >
            <md-icon>home</md-icon>主页
          </md-button>
          <md-button
            v-if="username !== 'root'"
            to="/statistic"
          >
            <md-icon>leaderboard</md-icon>统计
          </md-button>
          <md-button
            v-if="username !== 'root'"
            to="/settings"
          >
            <md-icon>settings</md-icon>设置
          </md-button>
          <md-button @click="$emit('logout')">
            <md-icon>logout</md-icon>退出
          </md-button>
        </div>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "TitleBar",
  data() {
    return {
        active: 0
    }
  },
  computed: mapState([
    'username'
  ]),
  methods: {
  },
}
</script>

<style scoped>
@import "../../css/icon.css";
</style>