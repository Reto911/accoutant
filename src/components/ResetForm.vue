<template>
  <user-form
    :error="false"
    :error-tip="null"
  >
    <template #dialog>
      <md-dialog-alert
        :md-active.sync="dia_active"
        :md-title="dialog.title"
        :md-content="dialog.content"
        md-confirm-text="好"
      />
    </template>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-size-100">
        <md-steppers
          :md-active-step.sync="active"
          md-alternative
          md-dynamic-height
          md-linear
          style="background-color: rgba(255, 255, 255, 0.7)"
        >
          <md-step
            id="first"
            :md-done="first"
            :md-editable="false"
            :md-error="firstError"
            md-label="输入用户名"
          >
            <div class="md-layout md-alignment-center-center">
              <div class="md-layout-item md-size-80">
                <md-field :class="isFirstError">
                  <label>用户名</label>
                  <md-input
                    id="username"
                    v-model.lazy="username"
                    maxlength="12"
                    name="username"
                    required
                    type="text"
                    @keyup.enter="verifyUsername"
                  />
                  <span class="md-error">{{ firstError }}</span>
                </md-field>
              </div>
              <div
                class="md-layout-item md-size-80"
                style="text-align: right"
              >
                <md-button
                  class="md-raised md-primary"
                  style="margin-top: 10px"
                  @click="verifyUsername"
                >
                  下一步
                </md-button>
              </div>
            </div>
          </md-step>
          <md-step
            id="second"
            :md-done="second"
            :md-editable="false"
            :md-error="secondError"
            md-label="验证用户信息"
          >
            <div class="md-layout md-alignment-center-center">
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
                  <label>{{ v_q }}</label>
                  <md-input
                    id="v_a"
                    v-model="v_a"
                    name="v_a"
                    required
                    type="text"
                  />
                </md-field>
              </div>
              <div class="md-layout-item md-size-40">
                <md-button
                  class="md-raised md-primary"
                  @click="last('second', 'first')"
                >
                  上一步
                </md-button>
              </div>
              <div
                class="md-layout-item md-size-40"
                style="text-align: right;"
              >
                <md-button
                  class="md-raised md-primary"
                  @click="verifyUserInfo"
                >
                  下一步
                </md-button>
              </div>
            </div>
          </md-step>
          <md-step
            id="third"
            :md-done="third"
            :md-editable="false"
            md-label="设置新密码"
          >
            <div class="md-layout md-alignment-center-center">
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
                  :class="isThirdError"
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
              <div class="md-layout-item md-size-40">
                <md-button
                  class="md-raised md-primary"
                  @click="last('third', 'second')"
                >
                  上一步
                </md-button>
              </div>
              <div
                class="md-layout-item md-size-40"
                style="text-align: right;"
              >
                <md-button
                  class="md-raised md-primary"
                  @click="resetPwd"
                >
                  重置
                </md-button>
              </div>
            </div>
          </md-step>
        </md-steppers>
      </div>
    </div>
  </user-form>
</template>

<script>
import userForm from "@/components/userForm";
import UserForm from "@/components/userForm";
import format from 'date-fns/format';
import axios from 'axios';
import hash from 'hash.js';

export default {
  name: "ResetForm",
  comments: {
    userForm
  },
  components: {UserForm},
  data() {
    return {
      active: "first",
      first: false,
      second: false,
      third: false,
      username: null,
      v_q: null,
      v_a: null,
      birthday: null,
      password: null,
      confirmPwd: null,
      firstError: null,
      secondError: null,
      thirdError: null,
      dia_active: false,
      dialog: {
        title: null,
        content: null
      }
    }
  },
  computed: {
    birthdayStr: function () {
      return this.birthday ? format(this.birthday, 'yyyy-MM-dd') : "1970-01-01";
    },
    isFirstError: function () {
      return {
        'md-invalid': this.firstError
      }
    },
    isThirdError: function () {
      return {
        'md-invalid': this.password !== this.confirmPwd
      }
    }
  },
  watch: {
    dia_active: function(val, oldVal)
    {
      if (!val && oldVal)
      {
        window.location.href = "/users/login";
      }
    }
  },
  methods: {
    next: function (pre, next) {
      this[pre] = true;
      this.active = next;
    },
    last: function (cur, last) {
      this[cur] = false;
      this[last] = false;
      this.active = last;
    },
    verifyUsername: function () {
      if (!this.username) {
        this.firstError = "请输入用户名！";
        return;
      }
      axios.get('/users/avail?username=' + this.username)
          .then(res => {
            if (res.data) {
              this.firstError = "用户名不存在！"
            } else {
              this.getVQ();
              this.firstError = null;
              this.next('first', 'second');
            }
          })
    },
    getVQ: function () {
      axios.post('/users/inf', {
        username: this.username,
        req: ['val_q']
      })
          .then(res => {
            this.v_q = res.data.val_q;
          })
      .catch(err => {
        console.log(err);
      })
    },
    verifyUserInfo: function () {
      axios.post('/users/verify', {
        username: this.username,
        birthday: this.birthdayStr,
        val_a: this.v_a
      })
      .then(res => {
        if (res.data.length)
        {
          this.secondError = "生日或验证问题答案错误!";
        }
        else{
          this.secondError = null;
          this.next('second', 'third');
        }
      }).catch(err => console.error(err));
    },
    resetPwd: function () {
      if (this.password !== this.confirmPwd) return;
      axios.post('/users/reset', {
        password: hash.sha256().update(this.password).digest("hex")
      })
      .then(res => {
        if (res.data === "Failed")
        {
          this.dialog.title = "错误";
          this.dialog.content = "服务器错误, 请稍后重试！";
          this.dia_active = true;
        } else if (res.data === "Succeed")
        {
          this.dialog.title = "成功";
          this.dialog.content = "密码重置成功！";
          this.dia_active = true;
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../css/icon.css';

</style>