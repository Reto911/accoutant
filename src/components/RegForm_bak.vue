<template>
  <div class="row front">
    <div class="col l4 m6 s12 offset-l4 offset-m3 z-depth-3 reg">
      <form>
        <div
          class="row"
          style="margin-top: 20px; margin-bottom: 0;"
        >
          <div class="input-field col l10 m10 s10 offset-l1 offset-m1 offset-s1">
            <input
              id="username"
              type="text"
              class="validate"
              name="username"
              required
            >
            <label for="username">用户名</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col l10 m10 s10 offset-l1 offset-m1 offset-s1">
            <input
              id="password"
              type="password"
              name="password"
              class="validate"
              required
            >
            <label for="password">密码</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col l10 m10 s10 offset-l1 offset-m1 offset-s1">
            <input
              id="birthday"
              v-model="birthday"
              type="date"
              name="birthday"
              class="datepicker"
            >
            <label for="birthday">生日</label>
          </div>
        </div>
        <div class="row">
          <div class="col l10 m10 offset-l1 offset-m1">
            <button
              id="register"
              type="button"
              class="btn waves-effect waves-light white-text"
            >
              注册 <i class="material-icons">send</i>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery';
// import M from 'materialize-css';

// const $ = require('jquery');

export default {
  name: "RegForm",
  data() {
    return {
      username: "",
      password: "",
      birthday: "1970-01-01"
    }
  },
}
</script>

<style scoped>
/*@import '~materialize-css/dist/css/materialize.css';*/
@import '../css/icon.css';

.front {
  z-index: 1;
  position: relative;
  top: 50%;  /* 垂直居中 */
  transform: translateY(-50%);
}

.reg {
  /*background-color: rgba(255, 255, 255, 0.7);*/
  top: 50%;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.8);
}

#register {
  width: 100%;
}
</style>