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
      />
    </div>
    <div class="md-layout-item md-size-50">
      <acc-form
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
import {mapState} from "vuex";

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
    lastID() {
      return this.data.length ? this.data[this.data.length - 1].id : 0;
    },
    newItem() {
      return this.form.id > this.lastID || !this.form.id;
    },
    ...mapState([
        'data',
        'username',
        'tableInitialized'
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
  methods: {
    refresh() {
      this.$emit('refresh');
    },
    clear() {  // 清除表单
      this.form = new Form();
    },
    onSelect(e) {  // 选择
      if (e) Object.assign(this.form, e);
    },
    del(e) {
      this.$emit('delete', e);
      this.clear();
    },
    submit(e){
      this.$emit('submit', e, this.newItem);
      this.clear();
      this.refresh();
    }
  }
}
</script>

<style scoped>

</style>