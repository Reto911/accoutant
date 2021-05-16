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
          <md-button
            @click="home"
          >
            主页
          </md-button>
          <md-button
            @click="statistic"
          >
            统计
          </md-button>
          <md-button
            @click="setting"
          >
            设置
          </md-button>
          <md-button @click="$emit('logout')">
            退出
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
    home() {
      if (this.active !== 0){
        this.active = 0;
      }
    },
    statistic() {
      if (this.active !== 1){
        this.active = 1;
        this.$emit('statistic');
      }
    },
    setting() {
      if (this.active !== 2){
        this.active = 2;
        this.$emit('setting');
      }
    }
  },
}
</script>

<style scoped>
@import "../../css/icon.css";
</style>