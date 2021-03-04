<template>
  <!-- 服务订单 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <!-- <my-main></my-main> -->
    <!-- 主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 导航菜单 -->
        <el-col :span="4">
          <el-menu
            :default-active="this.$route.path"
            router
            background-color="#007BAE"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>账户管理</span>
              </template>
              <el-menu-item
                v-for="(item, i) in navList"
                :key="i"
                :index="item.name"
              >
                {{ item.navItem }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <div class="color"></div>
        <!-- 服务订单 -->
        <div class="neirong">
          <div class="title">
            <!-- 服务订单 -->
              {{ $t('servicesorder') }}
          </div>
          <template>
            <div class="table">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column
                  prop="dingdancode"
                  label="编号"
                  width="115"
                ></el-table-column>
                <el-table-column
                  prop="createTime"
                  label="时间"
                  width="135"
                ></el-table-column>
                <el-table-column label="服务">
                  <template slot-scope="scope">
                    {{ formatDingdanStatus(scope.row.dingdanStatus) }}
                  </template>
                </el-table-column>
                <el-table-column prop="sqm" label="授权码" width="260">
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
                <el-table-column prop="sqMISUsed" label="状态">
                  <template slot-scope="scope">
                    {{ formatSqMISUsed(scope.row.sqMISUsed) }}
                  </template>
                </el-table-column>
                <el-table-column prop="dcount" label="金额"> </el-table-column>
              </el-table>
            </div>
          </template>
          <!-- 分页 -->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              @current-change="pageChange"
              :hide-on-single-page="value"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
// import MyMain from '../components/myMain.vue'
import { getOrder } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  components: { myHeader,  MyFooter },
  name: 'order',
  data () {
    return {
      show: true,
      // 导航菜单跳转
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' }
      ],
      tableData: [],
      editForm: {
        dingdancode: '', //编号
        createTime: '', //时间
        dingdanStatus: '', //服务
        sqm: '', //授权码默认隐藏，点击查看
        sqMISUsed: '', //状态
        dcount: '', //金额
        pageSize: 10, //每页条数
        currentPage: 1, //当前页
        userid: getuserid()
      },
      total: 0, //总条数
      value: true //只有一页时隐藏分页
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      const { pageSize, currentPage, userid } = this.editForm
      const editParams = new FormData()
      editParams.append('userid', userid)
      editParams.append('pageNo', currentPage)
      editParams.append('pageSize', pageSize)
      getOrder(editParams)
        .then(res => {
          console.log(res)
          console.log('获取数据成功')
          let arr = res.data.data
          arr.forEach(b => {
            b.eyseShow = true
            b.imgeeyes = 'closeEye'
          })
          this.tableData = res.data.data
          this.editForm.currentPage = res.data.page  //当前页
          this.editForm.pageSize = res.data.pageSize         //每页条数
          this.total = res.data.count            //总条数

        })
        .catch(err => {
          this.$message.error('获取数据失败')
        })
    },
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
    //服务
    // 根据传入的dingdanStatus做适配
    formatDingdanStatus (dingdanStatus) {
      const statusObj = {
        0: '升级旗舰版',
        1: '购买节点',
        2: '购买空间'
      }
      return statusObj[dingdanStatus]
    },
    //状态
    // 根据传入的sqMISUsed做适配
    formatSqMISUsed (sqMISUsed) {
      const statusObj = {
        0: '未使用',
        1: '已使用'
      }
      return statusObj[sqMISUsed]
    }
  }
}
</script>

<style lang="less" scoped>
.imageEye {
  // 眼睛图片
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
  background-image: url('./close.png');
}
.openEye {
  background-image: url('./open.png');
}
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 1037px;
    .content {
      overflow: hidden;
      ul.el-menu {
        height: 1037px;
      }
      .color {
        width: 25px;
        height: 1037px;
        float: left;
        background-color: #f1f1f1;
      }
      .neirong {
        padding-left: 300px;
        height: 1037px;
        text-align: center;
        .title {
          height: 54px;
          line-height: 54px;
          // margin-left: -40px;
          font-size: 22px;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;
        }
        .table {
          margin-right: 40px;
          margin-top: 20px;
          /deep/ .el-table thead {
            color: #fff;
          }
          /deep/ .el-table th {
            background-color: #00aaf0;
            text-align: center;
            font-size: 15px;
            font-weight: normal;
          }
          /deep/ .el-table td {
            text-align: center;
          }
          //表格去横线
          /deep/ .el-table__row > td {
            border: none;
          }
          //表格去横线之去掉最下面的那一条线
          /deep/ .el-table::before {
            height: 0px;
          }
          // 第二列字体颜色
          /deep/ .el-table_1_column_2 {
            color: #00aaf0;
          }
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
      }
    }
  }
}
</style>
