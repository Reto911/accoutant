<template>
  <div
    class="md-layout md-alignment-top-space-around"
    style="transform: translateY(20px);"
  >
    <md-dialog-confirm
      :md-active.sync="confirmDelete"
      md-title="确定要删除您的账户吗？"
      md-content="这样做将会删除您账户下的所有数据，且无法恢复！"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-confirm="trueDelete"
    />
    <md-dialog-alert
      :md-active.sync="passwordError"
      md-title="密码错误！"
      md-content="请检查您的输入！"
      md-confirm-text="好"
    />
    <md-dialog-alert
      :md-active.sync="serverError"
      md-title="服务器错误"
      md-confirm-text="好"
    />
    <md-dialog-alert
      :md-active.sync="dropSuccess"
      md-title="删除成功"
      md-content="您的账户已被删除！"
      md-confirm-text="好"
    />
    <md-dialog-alert
      :md-active.sync="changeSuccess"
      md-title="修改成功"
      md-content="密码修改成功！"
      md-confirm-text="好"
    />
    <md-card class="md-layout-item md-size-33">
      <md-card-header>
        <div class="md-title">
          修改密码
        </div>
      </md-card-header>
      <md-card-content>
        <md-field>
          <label>原密码</label>
          <md-input
            v-model="changePassword.origin"
            type="password"
          />
        </md-field>
        <md-field>
          <label>新密码</label>
          <md-input
            v-model="changePassword.nPwd"
            type="password"
          />
        </md-field>
        <md-field
          :class="incoherentError"
          :md-toggle-password="false"
        >
          <label>确认密码</label>
          <md-input
            v-model="changePassword.confirm"
            type="password"
          />
          <span class="md-error">两次输入不一致！</span>
        </md-field>
        <md-button
          class="md-raised md-primary"
          @click="change"
        >
          修改密码
        </md-button>
      </md-card-content>
    </md-card>
    <md-card
      style="height: 364px;"
      class="md-layout-item md-size-33"
    >
      <md-card-header>
        <div class="md-title">
          删除账户
        </div>
      </md-card-header>
      <md-card-content>
        <md-field>
          <label>密码</label>
          <md-input
            v-model="dropUser.password"
            type="password"
          />
        </md-field>
        <md-field
          :class="{'md-invalid': dropUser.password!==dropUser.confirm}"
          :md-toggle-password="false"
        >
          <label>确认密码</label>
          <md-input
            v-model="dropUser.confirm"
            type="password"
          />
          <span class="md-error">两次输入不一致！</span>
        </md-field>
        <md-button
          class="md-raised md-accent"
          @click="deleteUser"
        >
          删除账户
        </md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from "axios";
const hash = require('hash.js')

export default {
  name: "Settings",
  data () {
    return {
      changePassword: {
        origin: null,
        nPwd: null,
        confirm: null
      },
      dropUser: {
        password: null,
        confirm: null
      },
      confirmDelete: false,
      serverError: false,
      passwordError: false,
      dropSuccess: false,
      changeSuccess: false
    }
  },
  computed: {
    incoherentError: function() {
      return {
        'md-invalid': this.changePassword.nPwd !== this.changePassword.confirm
      }
    },
  },
  watch: {
    dropSuccess: function(val, oldVal)
    {
      if (!val && oldVal)
      {
        window.location.href = "/";
      }
    }
  },
  methods: {
    change(){
      if (this.changePassword.origin && this.changePassword.nPwd)
      {
        axios.post('/users/change', {origin: hash.sha256().update(this.changePassword.origin).digest('hex'), nPwd: hash.sha256().update(this.changePassword.nPwd).digest('hex')})
            .then(res => {
              if (res) {
                this.changeSuccess = true;
              }
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status === 404) {
                  this.serverError = true;
                } else if (error.response.status === 403) {
                  this.passwordError = true;
                }
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log('Error', error.message);
              }
              console.log(error.config);
            })
      }
    },
    deleteUser(){
      if (this.dropUser.password && this.dropUser.password === this.dropUser.confirm) {
          this.confirmDelete = true;
      }
    },
    trueDelete() {
      axios.post('/users/drop', {password: hash.sha256().update(this.dropUser.password).digest('hex')})
      .then(res => {
        if (res) {
          this.dropSuccess = true;
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            this.serverError = true;
          } else if (error.response.status === 403) {
            this.passwordError = true;
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    }
  }
}
</script>

<style scoped>

</style>