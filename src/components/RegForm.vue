<template>
  <div class="md-layout md-alignment-center-center front">
    <md-dialog-alert
      :md-active.sync="regSuc"
      md-title="注册成功"
      md-content="欢迎加入我们！"
      md-confirm-text="好"
    />
    <div class="md-layout-item md-size-33 reg">
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-80">
          <span
            v-if="error"
            style="color: #FF5252"
          >服务器错误</span>
        </div>
      </div>
      <form>
        <div class="md-layout md-alignment-center-center">
          <div
            class="md-layout-item md-size-80"
            style="margin-top: 10px;"
          >
            <md-field
              md-clearable
              :class="usedError"
              @md-clear="password=null;confirmPwd=null;"
            >
              <label>用户名</label>
              <md-input
                id="username"
                v-model.lazy="username"
                name="username"
                maxlength="12"
                required
                type="text"
                @change="usernameAvailable"
              />
              <span class="md-error">用户名已被使用!</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-80">
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
          <div class="md-layout-item md-size-80">
            <md-field
              :class="incoherentError"
              :md-toggle-password="false"
            >
              <label>确认密码</label>
              <md-input
                id="confirmPassword"
                v-model.lazy="confirmPwd"
                name="confirmPassword"
                required
                type="password"
              />
              <span class="md-error">两次输入不一致！</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-80">
            <md-datepicker
              v-model="birthday"
              md-immediately
            >
              <label>生日</label>
            </md-datepicker>
          </div>
          <div class="md-layout-item md-size-80">
            <md-field>
              <label>安全问题</label>
              <md-input
                id="v_q"
                v-model="v_q"
                name="v_q"
                required
                type="text"
              />
            </md-field>
          </div>
          <div class="md-layout-item md-size-80">
            <md-field>
              <label>安全答案</label>
              <md-input
                id="v_a"
                v-model="v_a"
                name="v_a"
                required
                type="text"
              />
            </md-field>
          </div>
          <div class="md-layout-item md-size-60">
            <md-field :class="captchaError">
              <label>验证码</label>
              <md-input
                id="captcha"
                v-model="captcha"
                name="captcha"
                required
                maxlength="4"
                type="text"
              />
              <span class="md-error">验证码错误！</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-20">
            <img
              ref="captcha"
              src="/utils/captcha"
              alt="captcha"
              style="transform: translateY(-15%);"
              @click="refreshCap"
            >
          </div>
          <div
            class="md-layout-item md-size-80"
            style="margin-bottom: 20px;margin-top: 10px;"
          >
            <md-button
              id="register"
              class="md-primary md-raised"
              style="color:white;"
              @click="submit"
            >
              注册 <md-icon style="color: white">
                send
              </md-icon>
            </md-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
const hash = require('hash.js')
import axios from "axios";
import format from 'date-fns/format'
export default {
  name: "RegForm",
  data() {
    return {
      username: null,
      password: null,
      confirmPwd: null,
      birthday: null,
      v_q: null,
      v_a: null,
      captcha: null,
      isUsed: false,
      capErr: false,
      error: false,
      regSuc: false
    }
  },
  computed: {
    usedError: function() {
      return {
        'md-invalid': this.isUsed
      }
    },
    incoherentError: function() {
      return {
        'md-invalid': this.password !== this.confirmPwd
      }
    },
    captchaError: function() {
      return {
        'md-invalid': this.capErr
      }
    },
    birthdayStr: function() {
      return this.birthday ? format(this.birthday, 'yyyy-MM-dd') : "1970-01-01";
    }
  },
  watch: {
    regSuc: function(val, oldVal)
    {
      if (!val && oldVal)
      {
        window.location.href = "/";
      }
    }
  },
  methods: {
    usernameAvailable: function () {
      axios.get('/users/avail?username=' + this.username)
          .then(res => {
            this.isUsed = !res.data;
          })
          .catch(err => {
            console.log(err);
          })
    },
    submit: function () {
      if (this.isUsed || this.password !== this.confirmPwd || !this.username || !this.password || !this.birthday || !this.v_q || !this.v_a || !this.captcha)
      {
        return;
      }
      let info = {
        code: this.captcha.toLowerCase(),
        username: this.username,
        password: hash.sha256().update(this.password).digest("hex"),
        birthday: this.birthdayStr,
        val_q: this.v_q,
        val_a: this.v_a
      }
      axios.post('/users/register', info)
      .then(res => {
        if(res.data === "CAP_ERROR")
        {
          this.capErr = true;
          this.refreshCap();
        }else if (res.data === 'ERROR'){
          this.error = true;
          this.refreshCap();
        }
        else if (res.data === "OK")
        {
          this.capErr = false;
          this.error = false;
          this.regSuc = true;
        }
      })
      .catch(err => {
        console.log(err);})
    },
    refreshCap: function(){
      this.$refs.captcha.src = "/utils/captcha?d="+Math.random();
    }
  }
}
</script>

<style scoped>
@import '../css/icon.css';

.front {
  z-index: 1;
  position: relative;
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%);
}

.reg {
  /*background-color: rgba(255, 255, 255, 0.7);*/
  top: 50%;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

#register {
  width: 100%;
}
</style>