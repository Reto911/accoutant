<template>
  <div>
    <title-bar
      :username="username"
      @logout="logout"
    />
    <div class="md-layout">
      <div class="md-layout-item md-size-50">
        <acc-table
          :data="data"
          :initialized="tableInitialized"
          :row-disabled="true"
          :username="username"
          @refresh="refresh"
          @selected="onSelect"
        />
      </div>
      <div class="md-layout-item md-size-50">
        <acc-form
          :form.sync="form"
          :new-item="newItem"
          @clear="clear"
          @submit="submit"
          @delete="del"
        />
      </div>
    </div>
  </div>
</template>

<script>
// TODO: 主组件
import titleBar from "@/components/main/titleBar";
import AccTable from "@/components/main/AccTable/AccTable";
import AccForm from "@/components/main/AccForm";
import axios from "axios";
import Form from "@/js/functions";

const min = (a, b) => (a < b) ? a : b;

export default {
  name: "Main",
  components: {
    titleBar, AccTable, AccForm
  },
  data() {
    return {
      username: "",
      data: [],
      tableInitialized: false,
      form: new Form(),
      serverError: false
    }
  },
  computed: {
    lastID() {
      return this.data.length ? this.data[this.data.length - 1].id : 0;
    },
    newItem() {
      return this.form.id > this.lastID || !this.form.id;
    }
  },
  watch: {
    tableInitialized(n, o) {
      if (n && !o) {
        this.clear();
      }
    }
  },
  mounted() {
    axios.get('/users/name')
        .then(res => {
          this.username = res.data;
        })
        .catch(err => {
          if (err) console.error(err);
        })
  },
  methods: {
    logout() {  // 登出
      axios.get('/users/logout')
          .then(res => {
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
    submit(e){  // 添加或修改数据
      if (this.newItem) {
        axios.post('/db/insert', e)
        .then(res => {
          if (res.status === 404) {
            this.serverError = true;
          } else {
            this.data.push(e);
          }
        }).catch(err => {console.error(err)});
      } else {
        axios.post('/db/update', e)
            .then(res => {
              if (res.status === 404) {
                this.serverError = true;
              } else {
                for (let i = min(e.id - 1, this.data.length-1); i >= 0; i--){
                  if (this.data[i].id === e.id) {
                    this.$set(this.data, i, e);
                    break;
                  }
                }
              }
            }).catch(err => {console.error(err)});
      }
    },
    del(){  // TODO: 删除数据

    },
    clear() {  // 清除表单
      this.form = new Form(this.lastID + 1);
    },
    onSelect(e) {  // 选择
      if (e) Object.assign(this.form, e);
    }
  }
}
</script>

<style scoped>

</style>