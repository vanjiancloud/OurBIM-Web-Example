<template>
  <!-- 团队 -->
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
        <!-- 团队 -->
        <div class="neirong">
          <div class="title">
            团队
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              style="width: 100%;"
              row-key="id"
              default-expand-all
            >
              <el-table-column prop="name" label="应用"></el-table-column>
              <el-table-column prop="time" label="成立时间"></el-table-column>
              <el-table-column prop="role" label="角色"> </el-table-column>
              <el-table-column prop="operation" label="操作">
                <el-button type="primary" @click="quit">退出</el-button>
              </el-table-column>
            </el-table>
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
import MyMain from '../components/myMain.vue'

export default {
  components: { myHeader, MyMain, MyFooter },
  name: 'team',
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
          id: 1,
          time: '2021-05-01',
          name: '钱龙广场',
          children: [
            {
              id: 11,
              name: 'mark',
              role: '成员',
              operation: '移除'
            },
            {
              id: 12,
              name: 'admin',
              role: '组织者',
              operation: '退出'
            }
          ]
        },
        {
          id: 2,
          time: '2021-05-01',
          name: '万达广场',
          children: [
            {
              id: 21,
              name: 'admin',
              role: '成员',
              operation: '移除'
            },
            {
              id: 22,
              name: 'user',
              role: '成员',
              operation: '移除'
            },
            {
              id: 23,
              name: 'mark',
              role: '成员',
              operation: '退出'
            }
          ]
        }
      ]
    }
  },
  methods: {
    quit () {}
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
        // background-color: red;
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
