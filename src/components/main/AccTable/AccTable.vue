<template>
  <md-card class="md-elevation-2 full-v">
    <md-table
      v-model="paginated"
      style="height: calc(100% - 76px);"
      @md-selected="$emit('selected', $event)"
    >
      <!--      标题栏-->
      <md-table-toolbar>
        <div class="md-toolbar-section-start" />
        <div class="md-toolbar-section-end">
          <md-button
            class="md-icon-button"
            href="/csv"
          >
            <md-icon>file_download</md-icon>
          </md-button>
          <md-button
            class="md-icon-button"
            :class="{'rotate': rotate}"
            @click="refresh"
          >
            <md-icon>refresh</md-icon>
          </md-button>
          <md-field md-clearable>
            <md-input
              v-model="searchKey"
              placeholder="搜索..."
            />
          </md-field>
        </div>
      </md-table-toolbar>
      <!--      空页-->
      <!-- 若已初始化且搜索不到数据 -->
      <md-table-empty-state
        v-if="searchKey && initialized"
        md-label="找不到数据"
        :md-description="`找不到包含${searchKey}的数据项，请检查您的输入。`"
      />
      <!-- 若已初始化且没有进行搜索 -->
      <md-table-empty-state
        v-else-if="!searchKey && initialized"
        md-label="还没有数据"
        md-description="快来添加一条新的账目吧！"
        md-icon="note_add"
      >
        <md-button
          class="md-primary md-raised"
          @click="$emit('new')"
        >
          添加一条账目
        </md-button>
      </md-table-empty-state>
      <!-- 若未初始化 -->
      <md-table-empty-state
        v-else
      >
        <md-progress-spinner
          md-mode="indeterminate"
          :md-diameter="100"
        />
      </md-table-empty-state>
      <!--      表格体-->
      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        md-selectable="single"
      >
        <md-table-cell
          md-label="ID"
          md-numeric
          md-sort-by="id"
        >
          {{ item.id }}
        </md-table-cell>
        <md-table-cell
          md-label="日期"
          md-sort-by="date"
        >
          {{ item.date }}
        </md-table-cell>
        <md-table-cell
          md-label="类型"
          md-sort-by="type"
        >
          {{ item.type }}
        </md-table-cell>
        <md-table-cell
          md-label="描述"
        >
          {{ item.usage }}
        </md-table-cell>
        <md-table-cell
          md-label="收支"
          md-sort-by="balance"
          md-numeric
          :class="{deficit: item.balance < 0}"
        >
          {{ item.balance }}
        </md-table-cell>
        <md-table-cell
          md-label="详情"
        >
          {{ item.desc }}
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-divider />
    <!--      分页器-->
    <acc-table-pagination
      ref="pagination"
      style="height: 76px;"
      :total="total"
      :row-disabled="rowDisabled"
      @row="rows = $event"
      @page="currentPage = $event"
      @pagination="pagination"
    />
  </md-card>
</template>

<script>
import AccTablePagination from "@/components/main/AccTable/AccTablePagination";

const toLower = text => {
  return text.toString().toLowerCase()
}


const search = (items, term) => {
  if (term) {
    return items.filter(item => {
      return toLower(item.usage).includes(toLower(term)) || (item.desc ? toLower(item.desc).includes(toLower(term)) : false);
    })
  }

  return items;
}

export default {
  name: "AccTable",
  components: {
    AccTablePagination
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    username: {
      type: String,
      default: "Unknown",
    },
    initialized: {
      type: Boolean,
      default: false
    },
    rowDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: 10,
      currentPage: 0,
      searchKey: "",
      rotate: false
    }
  },
  computed: {
    total () {
      return this.data.length;
    },
    totalPages() {
      return Math.ceil(this.total / this.rows);  // begins at 1
    },
    firstRow() {
      return this.rows * this.currentPage + 1;
    },
    lastRow() {
      return this.rows * (this.currentPage + 1) > this.total ? this.total : this.rows * (this.currentPage + 1);
    },
    searched() {
      return search(this.data, this.searchKey);
    },
    reversedData() {
      return this.searched.slice().reverse();
    },
    paginated() {
      return this.reversedData.slice(this.firstRow-1, this.lastRow);
    }
  },
  watch: {
    totalPages (n) {
      if (this.currentPage >= n) this.$refs.pagination.currentPage = n - 1 >= 0 ? n-1 : 0;
    }
  },
  mounted() {
    this.$emit('refresh');
  },
  methods: {
    pagination(e) {
      this.rows = e.rows;
      this.currentPage = e.currentPage;
    },
    refresh() {
      this.$emit('refresh');
      this.currentPage = 0;
      this.rotate = true;
      setTimeout( () => {this.rotate = false;}, 500);
    }
  }
}
</script>

<style scoped>
.deficit {
  color: #FF5252
}

.rotate {
  animation: rotate .5s linear
}

@keyframes rotate {
  0% {transform: rotate(0deg);}
  25%{transform:rotate(90deg);}
  50%{transform:rotate(180deg);}
  75%{transform:rotate(270deg);}
  100%{transform:rotate(360deg);}
}

.full-v {
  height: 100%;
}
</style>