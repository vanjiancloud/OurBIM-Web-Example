<template>
  <!-- 账单管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写 -->
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
          <h2>服务订单</h2>
          <table>
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
          </table>
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
  data () {
    return {
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' },
        { name: '/team', navItem: '团队' },
        { name: '/changeCode', navItem: '修改密码' }
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
        float: left;
        h2 {
          margin-top: 22px;
          margin-left: 41px;
          margin-bottom: 49px;
        }
        table,
        th,
        td {
          border: 1px solid black;
          text-align: center;
        }
        table {
          width: 1080px;
          margin-left: 40px;
          border-collapse: collapse;
          font-size: 18px;
          tr {
            height: 70px;
          }
          th {
            background-color: #409eff;
            color: #fff;
          }
          td {
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
