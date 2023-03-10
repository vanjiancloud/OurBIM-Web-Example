<template>
  <div class="pagination">
    <el-pagination
      small
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1 // 默认第一页
    },
    limit: {
      type: Number,
      default: 18 // 默认每页20条
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50] // 默认显示可选的每页多少条数据
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    // 超过多少条隐藏分页
    pagerCount: {
      type: Number,
      default: 5 
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val) // 改变的第几页的值赋值给父组件
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val) // 改变的当前页几条数据的值赋值给父组件
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { pageIndex: 1, pageSize: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { pageIndex: val, pageSize: this.pageSize })
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
  margin-top: 20px;
  text-align: center;
}
::v-deep.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: none;
  border-radius: 100%;
}
::v-deep .el-pagination.is-background .btn-next, ::v-deep .el-pagination.is-background .btn-prev, ::v-deep .el-pagination.is-background .el-pager li{
  background: none;
}
::v-deep .el-input__inner{
  border-radius: 4px;
}
::v-deep .el-pagination__sizes{
  margin: 0 10px 0 10%;
  .el-input__inner,.el-input__inner:hover, .el-input__inner:focus{
    border: none !important;
  }
}
::v-deep .el-pager li{
  min-width: auto;
}
</style>