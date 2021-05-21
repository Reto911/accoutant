<template>
  <div
    class="md-layout"
    style="height: calc(100% - 64px);"
  >
    <div class="md-layout-item md-size-50">
      <acc-table
        :data="dataCopy"
        :initialized="tableInitialized"
        :row-disabled="true"
        :username="username"
        @refresh="refresh"
        @selected="onSelect"
        @new="addNew"
      />
    </div>
    <div class="md-layout-item md-size-50">
      <acc-form
        ref="form"
        :form.sync="form"
        :new-item="newItem"
        @clear="clear"
        @delete="del"
        @submit="submit"
      />
    </div>
  </div>
</template>

<script>
import AccTable from "@/components/main/AccTable/AccTable";
import AccForm from "@/components/main/AccForm";
import Form from "@/js/functions";
import {mapActions, mapState} from "vuex";

export default {
  name: "Home",
  components: {
    AccTable,
    AccForm
  },
  data() {
    return {
      form: new Form(),
      dataCopy: []
    }
  },
  computed: {
    newItem() {
      return this.form.id > this.lastID || !this.form.id;
    },
    ...mapState([
      'data',
      'username',
      'tableInitialized',
      'lastID'
    ])
  },
  watch: {
    data(n) {
      this.dataCopy = n;
    },
    tableInitialized(n, o) {
      if (n && !o) {
        this.clear();
      }
    }
  },
  mounted() {
    this.clear();
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    },
    clear() {  // 清除表单
      this.getLastId().then(() => {
        this.form = new Form(this.lastID + 1);
      })
    },
    onSelect(e) {  // 选择
      if (e) Object.assign(this.form, e);
    },
    del(e) {
      this.drop(e)
          .then(() => {
            this.clear();
          })
          .catch(() => {
            this.$emit('server-err');
          })
    },
    submit(e) {  // 异步提交, 若成功则清空表单, 否则抛出错误
      this.update({item: e, newItem: this.newItem})
          .then(() => {
            this.clear();
          })
          .catch(() => {
            this.$emit('server-err');
          })
    },
    addNew() {
      this.clear();
      this.$refs.form.$refs.usage.$el.focus();
    },
    ...mapActions([
      'update',
      'drop',
      'getLastId'
    ])
  }
}
</script>

<style scoped>

</style>