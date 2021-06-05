<template>
  <div class="full-v">
    <title-bar
      @logout="logout"
    />
    <md-dialog-alert
      :md-active.sync="serverError"
      md-confirm-text="好"
      md-content="服务器错误，请稍后重试！"
      md-title="错误"
    />
    <transition name="fade">
      <router-view
        @refresh="refresh"
        @server-err="serverError = true"
      />
    </transition>
  </div>
</template>

<script>
import titleBar from "@/components/main/titleBar";
import axios from "axios";
import {mapMutations} from "vuex";


export default {
  name: "Main",
  components: {
    titleBar,
  },
  data() {
    return {
      serverError: false
    }
  },
  computed: {
    username(){
      return this.$store.state.username;
    }
  },
  watch: {},
  mounted() {
    this.$router.replace('/home');
  },
  methods: {
    logout() {  // 登出
      axios.get('/users/logout')
          .then(() => {
            window.location.href = '/'
          }).catch(err => {
        console.error(err);
        this.serverError = true;
      })
    },
    refresh() {  // 刷新表格
      this.$store.dispatch('refresh');
    },
    ...mapMutations([
      'deleteItem'
    ])
  }
}
</script>

<style scoped>
.full-v {
  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>