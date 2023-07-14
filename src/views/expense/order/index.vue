<template>
  <!-- 服务订单 -->
  <div class="box">
    <div class="title">
      <!-- 服务订单 -->
      {{ $t('servicesorder') }}
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%;" class="sheet">
        <el-table-column
          prop="dingdancode"
          :label="$t('number')"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('time')"
        ></el-table-column>
        <el-table-column :label="$t('services')">
          <template slot-scope="scope">
            {{ formatDingdanStatus(scope.row.dingdanStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="sqm" :label="$t('authorizationcode')">
          <template slot-scope="scope">
            <template v-if="scope.row.eyseShow">
              ****************************************
            </template>
            <template v-if="!scope.row.eyseShow">
              {{ scope.row.sqm }}
            </template>
            <div class="imageEye" @click="lookEyes(scope.row)">
              <div :class="scope.row.imgeeyes"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sqMISUsed" :label="$t('state')">
          <template slot-scope="scope">
            {{ formatSqMISUsed(scope.row.sqMISUsed) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :hide-on-single-page="value"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>


<script>
import { getOrder } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  name: 'order',
  data () {
    return {
      show: true,
      tableData: [], //数据列表数组
      total: 0, //总条数
      value: true, //只有一页时隐藏分页
      editForm: {
        dingdancode: '', //编号
        createTime: '', //时间
        dingdanStatus: '', //服务
        sqm: '', //授权码默认隐藏，点击查看
        sqMISUsed: '', //状态
        pageSize: 10, //每页条数
        currentPage: 1 //当前页
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取数据列表
    getList () {
      getOrder({
        pageNo: this.editForm.currentPage,
        pageSize: this.editForm.pageSize,
        // userid: getuserid()
      })
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            // this.$message.success(res.data.message)
            let arr = res.data.data
            arr.forEach(b => {
              b.eyseShow = true
              b.imgeeyes = 'closeEye'
            })
            this.tableData = res.data.data
            this.editForm.currentPage = res.data.page //当前页
            this.editForm.pageSize = res.data.pageSize //每页条数
            this.total = res.data.count //总条数
          } else if (res.data.code === 1) {
            // this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取数据失败')
        })
    },

    // 显示隐藏授权码
    lookEyes (row) {
      row.eyseShow = !row.eyseShow
      if (row.eyseShow) {
        row.imgeeyes = 'closeEye'
      } else {
        row.imgeeyes = 'openEye'
      }
    },

    // 以当前点击的页数作为参数去请求当前页的数据
    pageChange (page) {
      this.editForm.currentPage = page
      this.getList()
    },

    //服务栏状态适配，根据传入的dingdanStatus做适配
    formatDingdanStatus (dingdanStatus) {
      const statusObj = {
        0: '升级旗舰版',
        1: '购买节点',
        2: '购买空间'
      }
      return statusObj[dingdanStatus]
    },

    //状态栏状态适配，根据传入的sqMISUsed做适配
    formatSqMISUsed (sqMISUsed) {
      const statusObj = {
        0: '未使用',
        1: '已使用'
      }
      return statusObj[sqMISUsed]
    }
  },
  watch: {
    // 监听路由变化，当路由发生变化的时候，重新加载列表信息
    $route (to, from) {
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
// 眼睛图片
.imageEye {
  display: inline-block;
  cursor: pointer;
  div {
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }
}
.closeEye {
  background-image: url('./img/close.png');
}
.openEye {
  background-image: url('./img/open.png');
}
.box {
  min-height: 961px;
  position: relative;
  .title {
    height: 54px;
    text-align: center;
    line-height: 54px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #f1f1f1;
  }
  .table {
    margin: 20px;
    /deep/ .el-table thead {
      color: #fff;
    }
    /deep/ .el-table th {
      background-color: #00aaf0;
      text-align: center;
      font-size: 17px;
      font-weight: normal;
    }
    /deep/ .el-table td {
      text-align: center;
    }
    .sheet {
      font-size: 16px;
    }
    //表格去横线
    // /deep/ .el-table__row > td {
    //   border: none;
    // }
    //表格去横线之去掉最下面的那一条线
    // /deep/ .el-table::before {
    //   height: 0px;
    // }
    // 第二列字体颜色
    // /deep/ .el-table_1_column_2 {
    //   color: #00aaf0;
    // }
    // 表头字体颜色
    /deep/ .el-table th > .cell {
      color: #fff;
    }
    .icon {
      width: 10px;
      height: 10px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .page {
    position: absolute;
    bottom: 25px;
    left: 40%;
  }
}
</style>
