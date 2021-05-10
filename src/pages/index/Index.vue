<template>
  <div>
    <title-bar :username="username" />
    <div class="md-layout">
      <div class="md-layout-item md-size-50">
        <acc-table
          :data="data"
          :username="username"
          :initialized="tableInitialized"
          :row-disabled="true"
          @refresh="refresh"
          @selected="onSelect"
        />
      </div>
      <div class="md-layout-item md-size-50">
        <acc-form
          :form.sync="form"
          :new-item="newItem"
          @clear="clear"
        />
      </div>
    </div>
  </div>
</template>

<script>
import titleBar from "@/components/main/titleBar";
import AccTable from "@/components/main/AccTable/AccTable";
import AccForm from "@/components/main/AccForm";
import Form from "@/js/functions";

export default {
  name: "Index",
  components: {
    titleBar, AccTable, AccForm
  },
  data() {
    return {
      username: "H. Shiroan",
      data: [
        {id: 0, date: '2021-5-7', usage: "Test", balance: -10, desc: ""},
        {id: 1, date: '2021-5-7', usage: "Test", balance: 10, desc: ""},
        {id: 2, date: '2021-5-7', usage: "Test", balance: -20, desc: ""},
        {id: 3, date: '2021-5-7', usage: "Test", balance: -50, desc: ""},
        {id: 4, date: '2021-5-7', usage: "Test", balance: 50, desc: ""},
        {id: 5, date: '2021-5-7', usage: "Test", balance: 100, desc: "eeee"},
        {id: 6, date: '2021-5-7', usage: "Test", balance: -10, desc: "eeee"},
        {id: 7, date: '2021-5-7', usage: "Test", balance: -10, desc: "eeee"},
        {id: 8, date: '2021-5-7', usage: "Test", balance: -10, desc: "eeee"},
        {id: 9, date: '2021-5-7', usage: "Test", balance: -10, desc: "是"},
        {id: 10, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
        {id: 11, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
        {id: 12, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
        {id: 13, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
        {id: 14, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
        {id: 15, date: '2021-5-7', usage: "Test", balance: -15, desc: ""},
      ],
      tableInitialized: true,
      form: new Form(),
    }
  },
  computed: {
    lastID() {
      return this.data.length ? this.data[this.data.length - 1].id : 0;
    },
    newItem() {
      return this.form.id > this.lastID　|| !this.form.id;
    }
  },
  watch: {
    tableInitialized(n, o) {
      if (n && !o) {
        this.clear();
      }
    }
  },
  methods: {
    refresh() {
    },
    clear(){
      this.form = new Form(this.lastID+1);
    },
    onSelect(e) {
      if(e) Object.assign(this.form, e);
    }
  }
}
</script>

<style scoped>

</style>