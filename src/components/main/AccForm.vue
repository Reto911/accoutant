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
    <md-dialog-alert
      :md-active.sync="formRequired"
      md-content="还有未填写的字段！"
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
        <div class="md-layout-item md-size-50">
          <md-field>
            <label>类别</label>
            <md-select
              v-model="form.type"
              :disabled="form.balance > 0"
            >
              <md-option value="餐饮">
                餐饮
              </md-option>
              <md-option value="生活">
                生活
              </md-option>
              <md-option value="学习">
                学习
              </md-option>
              <md-option value="娱乐">
                娱乐
              </md-option>
              <md-option value="医疗">
                医疗
              </md-option>
              <md-option value="其他">
                其他
              </md-option>
              <md-option
                value="收入"
                disabled
              >
                收入
              </md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field>
            <label>描述</label>
            <md-input
              ref="usage"
              v-model.trim="form.usage"
              required
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>收支</label>
            <md-input
              v-model.number="form.balance"
              required
              type="number"
              @keyup.enter="submit"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>详情</label>
            <md-textarea
              v-model.trim="form.desc"
              md-autogrow
              @keyup.enter="submit"
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
      formRequired: false
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
    clear() {
      this.$emit('clear');
    },
    submit() {
      if (this.form.date && this.form.type && this.form.usage && this.form.balance) {
        if (this.form.balance > 0) this.form.type = '收入';
        this.$emit('submit', this.form);
      } else {
        this.formRequired = true;
      }
    },
    deleteItem() {
      this.$emit('delete', this.form);
      // this.$emit('clear');
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