<template>
  <user-form
    :error="false"
    :error-tip="null"
  >
    <template #dialog>
      <md-dialog-alert
        :md-active.sync="error"
        :md-content="tip"
        md-confirm-text="好"
      />
    </template>
    <form>
      <div class="md-layout md-alignment-center-center">
        <div
          class="md-layout-item md-size-80"
          style="margin-top: 50px; margin-bottom: 50px"
        >
          <md-field
            md-clearable
            @md-clear="password=''"
          >
            <label>用户名</label>
            <md-input
              id="username"
              v-model="username"
              name="username"
              required
              type="text"
            />
          </md-field>
        </div>
        <div
          class="md-layout-item md-size-80"
          style="margin-bottom: 10px"
        >
          <md-field>
            <label>密码</label>
            <md-input
              id="password"
              v-model="password"
              name="password"
              required
              type="password"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-40">
          <a
            href="/users/reset"
          >忘记密码...</a>
        </div>
        <div
          class="md-layout-item md-size-40"
          style="text-align: right"
        >
          <a href="/users/register">注册账号...</a>
        </div>
        <div
          class="md-layout-item md-size-80"
          style="margin-top: 30px; margin-bottom: 30px"
        >
          <md-button
            id="login"
            class="md-primary md-raised"
            @click="submit"
          >
            登录 <md-icon style="color: white">
              login
            </md-icon>
          </md-button>
        </div>
      </div>
    </form>
  </user-form>
</template>

<script>
import userForm from "@/components/userForm";
import axios from "axios";
import hash from 'hash.js';
import UserForm from "@/components/userForm";

export default {
  name: "LoginForm",
  comments:
      {
        userForm
      },
  components: {UserForm},
  data() {
    return {
      username: "",
      password: "",
      tip: "",
      error: false
    }
  },
  methods: {
    submit: function () {
      if (this.username === "") {
        this.error = true;
        this.tip = "请输入用户名!";
        return;
      } else if (this.password === "") {
        this.error = true;
        this.tip = "请输入密码！";
        return;
      }
      let codedPsw = hash.sha256().update(this.password).digest("hex");
      let userInf = {username: this.username, password: codedPsw};
      axios.post('/users/login', userInf)
          .then(res => {
            if (res.status === 200 && res.data === "Password Error") {
              this.error = true;
              this.tip = "用户名或密码错误!";
            } else if (res.status === 200 && res.data === "Logged in") {
              window.location.href = '/';
              this.tip = "";
            }
            else{
              this.error = true;
              this.tip = "未知错误！";
            }
          })
    }
  }
}

</script>

<style scoped>
@import '../css/icon.css';

#login {
  width: 100%;
  color: white;
  /*margin-top: 50px;*/
}


</style>