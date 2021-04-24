<template>
  <div class="row front">
    <div class="col l4 m6 s12 offset-l4 offset-m3 z-depth-3 login">
      <div class="row">
        <div
          v-if="tip"
          id="pswError"
          class="col l10 m10 s10 offset-l1 offset-m1 offset-s1"
        >
          {{ tip }}
        </div>
      </div>
      <form>
        <div
          class="row"
          style="margin-top: 20px; margin-bottom: 0;"
        >
          <div class="input-field col l10 m10 s10 offset-l1 offset-m1 offset-s1">
            <input
              id="username"
              v-model="username"
              class="validate"
              name="username"
              required
              type="text"
            >
            <label for="username">用户名</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col l10 m10 s10 offset-l1 offset-m1 offset-s1">
            <input
              id="password"
              v-model="password"
              class="validate"
              name="password"
              required
              type="password"
            >
            <label for="password">密码</label>
          </div>
        </div>
        <div class="row">
          <div class="col l10 offset-l1">
            <button
              id="login"
              class="btn waves-effect waves-light white-text"
              type="button"
              @click="submit"
            >
              <span id="login-text">登录</span> <i class="material-icons">login</i>
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col l3 left">
            <a
              class="right"
              href="/users/reset"
            >忘记密码...</a>
          </div>
          <div class="col l3 right">
            <a href="/users/register">注册账号...</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import M from 'materialize-css'
import axios from "axios";
import hash from 'hash.js';
// import VueRouter from 'vue-router'

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      tip: ""
    }
  },
  methods: {
    submit: function () {
      if (this.username === "") {
        this.tip = "请输入用户名!";
        return;
      } else if (this.password === "") {
        this.tip = "请输入密码！";
        return;
      }
      let codedPsw = hash.sha256().update(this.password).digest("hex");
      let userInf = {username: this.username, password: codedPsw};
      axios.post('/users/login', userInf)
          .then(res => {
            if (res.status === 200 && res.data === "Password Error") {
              this.tip = "用户名或密码错误!";
            } else if (res.status === 200 && res.data === "Logged in") {
              window.location.href = '/';
              this.tip = "";
            }
            else{
              this.tip = "未知错误！";
            }
          })
    }
  }
}

</script>

<style scoped>
@import '~materialize-css/dist/css/materialize.css';
@import '../css/icon.css';

.front {
  z-index: 1;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  /*-webkit-filter: blur(2px);*/
  /*-moz-filter: blur(2px);*/
  /*-ms-filter: blur(2px);*/
  /*-o-filter: blur(2px);*/
  /*filter: blur(2px);*/
}

.login {
  /*background-color: rgba(255, 255, 255, 0.7);*/
  top: 50%;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

#login {
  width: 100%;
}

#pswError {
  color: rgba(255, 0, 0, 0.7);
  transform: translateY(120%);
  font-size: 9pt;
}

#login-text {
  transform: translateY(-10%);
  display: inline-block;
}

/*i {*/
/*  transform: translateY(10%);*/
/*}*/
</style>