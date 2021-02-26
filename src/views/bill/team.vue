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
          <table>
            <tr>
              <th>应用</th>
              <th>成立时间</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
            <tr>
              <td>广场</td>
              <td>2021-01-01 12:34:56</td>
              <td>组织者</td>
              <td>高级开发版</td>
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
  name: 'team',
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
        table,
        th,
        td {
          border: 1px solid black;
          text-align: center;
        }
        table {
          width: 1080px;
          margin-top: 30px;
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
      .xia {
        text-align: center;
        margin-bottom: 100px;
      }
    }
  }
}
</style>
