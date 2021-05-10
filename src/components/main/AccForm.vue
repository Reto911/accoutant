<template>
  <div
    id="Form"
    class="md-layout md-alignment-center-center"
  >
    <md-dialog-confirm
      :md-active.sync="deleteDialog"
      md-title="确认"
      md-content="确定要删除该条目吗？"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-confirm="deleteItem"
    />
    <div class="md-layout-item md-size-50">
      <div
        class="md-layout md-alignment-center-center md-gutter"
      >
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>ID</label>
            <md-input
              :value="form.id"
              :disabled="true"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-80">
          <md-datepicker
            v-model="form.date"
            md-immediately
            :md-model-type="String"
          >
            <label>日期</label>
          </md-datepicker>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>描述</label>
            <md-input v-model="form.usage" />
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>收支</label>
            <md-input
              v-model.number="form.balance"
              type="number"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>详情</label>
            <md-textarea
              v-model="form.desc"
              md-autogrow
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-33">
          <md-button
            class="md-accent md-raised"
            :disabled="newItem"
            @click="deleteDialog=true"
          >
            删除
          </md-button>
        </div>
        <div class="md-layout-item md-size-33">
          <md-button
            class="md-raised"
            @click="clear"
          >
            清除
          </md-button>
        </div>
        <div class="md-layout-item md-size-33">
          <md-button
            class="md-primary md-raised"
            @click="submit"
          >
            提交
          </md-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '@/js/functions.js'

export default {
  name: "AccForm",
  props: {
    form: {
      type: Object,
      default: () => new Form()
    },
    newItem: {
      type: Boolean,
      default :true
    }
  },
  data()  {
    return {
      deleteDialog: false,
    }
  },
  computed: {
  },
  methods: {
    clear() {
      this.$emit('clear');
    },
    submit() {
      this.$emit('submit');
      this.$emit('clear');
    },
    deleteItem() {
      this.$emit('delete');
      this.$emit('clear');
    }
  }
}
</script>

<style scoped>
#Form {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
</style>