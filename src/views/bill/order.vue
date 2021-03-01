<template>
  <!-- 服务订单 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
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
            服务订单
          </div>
          <template>
            <div class="table">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="编号"></el-table-column>
                <el-table-column prop="name" label="时间" ></el-table-column>
                <el-table-column prop="name" label="服务"> </el-table-column>
                <el-table-column prop="name" label="授权码"></el-table-column>
                <el-table-column prop="name" label="状态"> </el-table-column>
                <el-table-column prop="name" label="金额"> </el-table-column>
              </el-table>
            </div>
          </template>
          <!-- <table>
            <tr>
              <th>编号</th>
              <th>时间</th>
              <th>服务</th>
              <th>授权码</th>
              <th>状态</th>
              <th>金额</th>
            </tr>
            <tr>
              <td>20210101123456123</td>
              <td>2021-01-01 12:34:56</td>
              <td>高级开发版</td>
              <td>高级开发版</td>
              <td>失效</td>
              <td>50,000.00</td>
            </tr>
            <tr>
              <td>20210101123456123</td>
              <td>2021-01-01 12:34:56</td>
              <td>高级开发版</td>
              <td>高级开发版</td>
              <td>失效</td>
              <td>50,000.00</td>
            </tr>
            <tr>
              <td>20210101123456123</td>
              <td>2021-01-01 12:34:56</td>
              <td>高级开发版</td>
              <td>高级开发版</td>
              <td>失效</td>
              <td>50,000.00</td>
            </tr>
            <tr>
              <td>20210101123456123</td>
              <td>2021-01-01 12:34:56</td>
              <td>高级开发版</td>
              <td>高级开发版</td>
              <td>失效</td>
              <td>50,000.00</td>
            </tr>
          </table> -->
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
import MyMain from '../components/myMain.vue'

export default {
  components: { myHeader, MyMain, MyFooter },
  name: 'order',
  data () {
    return {
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' },
        { name: '/team', navItem: '团队' },
        { name: '/changeCode', navItem: '修改密码' }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
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
        .title {
          height: 54px;
          line-height: 54px;
          margin-left: -40px;
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
        }
      }
    }
  }
}
</style>
