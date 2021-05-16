<template>
  <!-- TODO: 改为SPA? -->
  <!-- TODO: 引入vuex? -->
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
    <router-view
      @delete="del"
      @refresh="refresh"
      @submit="submit"
    />
  </div>
</template>

<script>
import titleBar from "@/components/main/titleBar";
// import Home from "@/components/main/Home";
import axios from "axios";
import {mapActions, mapMutations} from "vuex";


export default {
  name: "Main",
  components: {
    titleBar,
    // AccTable,
    // AccForm,
    // Home
  },
  data() {
    return {
      serverError: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.$store.dispatch('getUsername');
    this.refresh();
    this.$router.replace('/home');
  },
  methods: {
    logout() {  // 登出
      axios.get('/users/logout')
          .then(() => {
            window.location.href = '/'
          }).catch(err => {
        console.error(err)
      })
    },
    refresh() {  // 刷新表格
      this.$store.dispatch('refresh');
    },
    submit(e, newItem) {  // 添加或修改数据
      if (newItem) {
        axios.post('/db/insert', e)
            .then(res => {
              if (res.status === 404) {
                this.serverError = true;
              } else {
                this.$store.commit('addItem', e);
              }
            }).catch(err => {
          console.error(err)
        });
      } else {
        axios.post('/db/update', e)
            .then(res => {
              if (res.status === 404) {
                this.serverError = true;
              } else {
                this.$store.commit('setItem', e)
              }
            }).catch(err => {
          console.error(err)
        });
      }
    },
    del(e) {
      axios.post('/db/delete', {id: e.id})
          .then(res => {
            if (res.status === 404) {
              this.serverError = true;
            } else {
              this.$store.commit('deleteItem', e.id);
            }
          }).catch(err => {
        console.error(err)
      });
    },
    home() {
      this.$router.push({
        name: 'home',
        params: {
          username: this.username,
          data: this.data,
          tableInitialized: this.tableInitialized
        }
      });
    }
  }
}
</script>

<style scoped>
.full-v {
  height: 100%;
}
</style>