<template>
  <div
    style="transform: translateY(20px);"
    class="md-layout md-alignment-top-center"
  >
    <md-dialog-alert
      :md-active.sync="serverError"
      md-title="服务器错误"
      md-confirm-text="好"
    />
    <md-dialog-confirm
      :md-active.sync="delCom"
      md-title="真的要删除该用户吗？"
      md-content="该用户的数据将永久消失，且无法恢复！"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="onCancel"
      @md-confirm="deleteUser"
    />
    <md-dialog-prompt
      :md-active.sync="chgCom"
      md-title="请输入新密码"
      md-input-placeholder="新密码..."
      md-confirm-text="完成"
      md-cancel-text="取消"
      @md-confirm="changePassword"
      @md-cancel="onCancel"
    />
    <div class="md-layout-item md-size-95">
      <md-table
        v-model="searched"
        md-card
        md-fixed-header
      >
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">
              用户列表
            </h1>
          </div>

          <div class="md-toolbar-section-end">
            <md-button
              class="md-icon-button"
              :class="{'rotate': rotate}"
              @click="getUsers"
            >
              <md-icon>refresh</md-icon>
            </md-button>
            <md-field md-clearable>
              <md-input
                v-model="searchKey"
                placeholder="搜索..."
              />
            </md-field>
          </div>
        </md-table-toolbar>
        <md-table-empty-state
          md-label="找不到数据"
          :md-description="`找不到包含${searchKey}的数据项，请检查您的输入。`"
        />
        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
        >
          <md-table-cell
            md-label="ID"
            md-numeric
            md-sort-by="ID"
          >
            {{ item.ID }}
          </md-table-cell>
          <md-table-cell
            md-label="用户名"
            md-sort-by="username"
          >
            {{ item.username }}
          </md-table-cell>
          <md-table-cell
            md-label="注册时间"
            md-sort-by="RegTime"
          >
            {{ item.RegTime }}
          </md-table-cell>
          <md-table-cell
            md-label="最大记录数"
            md-numeric
            md-sort-by="seq"
          >
            {{ item.seq }}
          </md-table-cell>
          <md-table-cell md-label="操作">
            <md-button
              class="md-primary md-raised"
              @click="changeConfirm(item.username)"
            >
              修改密码
            </md-button>
            <md-button
              :disabled="item.username === 'root'"
              class="md-accent md-raised"
              @click="deleteConfirm(item.username)"
            >
              删除用户
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import hash from 'hash.js';

const toLower = text => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.username).includes(toLower(term)))
  }

  return items
}

export default {
  name: "Root",
  data() {
    return {
      users: [],
      serverError: false,
      rotate: false,
      searchKey: null,
      deleting: null,
      changing: null,
      delCom: false,
      chgCom: false,
    }
  },
  computed: {
    searched() {
      return searchByName(this.users, this.searchKey);
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.rotate = true;
      setTimeout( () => {this.rotate = false;}, 500);
      axios.get('/users/list')
          .then((res) => {
            this.users = res.data;
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 404) {
                this.serverError = true;
              } else if (error.response.status === 403) {
                this.serverError = true;
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            console.log(error.config);
          })
    },
    deleteConfirm(username) {
      this.deleting = username;
      this.delCom = true;
    },
    changeConfirm(username) {
      this.changing = username;
      this.chgCom = true;
    },
    onCancel() {
      this.changing = null;
      this.deleting = null;
    },
    deleteUser() {
      axios.post('/users/drop/root', {username: this.deleting})
      .then(() => {
        this.getUsers();
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            this.serverError = true;
          } else if (error.response.status === 403) {
            this.serverError = true;
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      this.deleting = null;
    },
    changePassword(password){
      password = hash.sha256().update(password).digest("hex");
      axios.post('/users/change/root', {username: this.changing, password})
          .then(() => {
            this.getUsers();
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 404) {
                this.serverError = true;
              } else if (error.response.status === 403) {
                this.serverError = true;
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            console.log(error.config);
          })
      this.changing = null;
    }
  }
}
</script>

<style scoped>
.rotate {
  animation: rotate .5s linear
}

@keyframes rotate {
  0% {transform: rotate(0deg);}
  25%{transform:rotate(90deg);}
  50%{transform:rotate(180deg);}
  75%{transform:rotate(270deg);}
  100%{transform:rotate(360deg);}
}
</style>