<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
      <slot
        :rows="rows"
        :currentPage="currentPage"
      />
    </div>
    <div class="md-layout-item md-size-15">
      <md-field>
        <label>行</label>
        <md-select
          id="rows"
          v-model.number="rows"
          name="rows"
          :disabled="rowDisabled"
        >
          <md-option
            v-for="i in pageOptions"
            :key="i"
            :value="i"
          >
            {{ i }}
          </md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item md-size-15">
      <span
        class="material-gray align-center"
      >
        {{ firstRow }}-{{ lastRow }} of {{ total }}
      </span>
    </div>
    <div class="md-layout-item md-size-20">
      <md-button
        :disabled="currentPage<=0"
        class="md-icon-button align-center"
        @click="currentPage--"
      >
        <md-icon>keyboard_arrow_left</md-icon>
      </md-button>
      <span class="material-gray align-center">{{ currentPage + 1 }}</span>
      <md-button
        :disabled="currentPage>=totalPages -1"
        class="md-icon-button align-center"
        @click="currentPage++"
      >
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccTablePagination",
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageOptions: {
      type: Array,
      default: () => {
        return [5, 10]
      }
    },
    rowDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: 10,
      currentPage: 0
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.rows);
    },
    firstRow() {
      if (this.total === 0) return 0;
      return this.rows * this.currentPage + 1;
    },
    lastRow() {
      return this.rows * (this.currentPage + 1) > this.total ? this.total : this.rows * (this.currentPage + 1);
    },
    info() {
      return {
        currentPage: this.currentPage,
        rows: this.rows
      }
    }
  },
  watch: {
    rows(n, o) {
      this.currentPage = Math.floor((o * this.currentPage) / n);
      this.$emit("row", n);
    },
    currentPage(n) {
      this.$emit("pagination", this.info);
      this.$emit("page", n)
    }
  },
  created() {
    this.$emit("pagination", this.info)
  }
}
</script>

<style scoped>
.material-gray {
  color: rgba(0, 0, 0, 0.54)
}

.align-center {
  top: 2em;
  position: relative;
  transform: translateY(-0.6em);
}
</style>