<template>
  <!-- TODO: 改为SPA? -->
  <!-- TODO: 引入vuex? -->
  <div class="full-v">
    <title-bar
      :username="username"
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

const min = (a, b) => (a < b) ? a : b;

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
      username: "",
      data: [],
      tableInitialized: false,
      // form: new Form(),
      serverError: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    axios.get('/users/name')
        .then(res => {
          this.username = res.data;
          // this.$router.replace({
          //   name: 'home',
          //   params: {
          //     username: this.username,
          //     data: this.data,
          //     tableInitialized: this.tableInitialized
          //   }
          // })
        })
        .catch(err => {
          if (err) console.error(err);
        });
    this.refresh();
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
      this.tableInitialized = false;
      this.data = [];
      axios.get('/db/select')
          .then(res => {
            this.data = res.data;
            this.tableInitialized = true;
          })
          .catch(err => {
            console.error(err);
            console.log("Server Error");
          })
    },
    submit(e, newItem) {  // 添加或修改数据
      if (newItem) {
        axios.post('/db/insert', e)
            .then(res => {
              if (res.status === 404) {
                this.serverError = true;
              } else {
                this.data.push(e);
                // this.clear();
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
                for (let i = min(e.id - 1, this.data.length - 1); i >= 0; i--) {
                  if (this.data[i].id === e.id) {
                    this.$set(this.data, i, e);
                    // this.clear();
                    break;
                  }
                }
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
              for (let i = min(e.id - 1, this.data.length - 1); i >= 0; i--) {
                if (this.data[i].id === e.id) {
                  this.data.splice(i, 1);
                  // this.clear();
                  break;
                }
              }
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