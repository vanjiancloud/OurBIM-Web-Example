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
        <!-- 下拉菜单 -->
        <div class="dropdown">
          <div>
            <button><i icon="el-icon-postcard"></i> 账户管理</button>
          </div>
          <div>
            <button @click="isHand = 6">个人信息</button>
          </div>
          <div>
            <button @click="isHand = 7">授权码</button>
          </div>
          <div>
            <button @click="isHand = 8">服务订单</button>
          </div>
          <div>
            <button @click="isHand = 9">团队</button>
          </div>
          <div>
            <button @click="isHand = 10">修改密码</button>
          </div>
        </div>
        <!-- 个人信息 -->
        <div class="neirong" >
          <div class="geren">
            个人信息：
          </div>
          <table>
            <tr>
              <td>ID</td>
              <td>Mark</td>
            </tr>
            <tr>
              <td>签名</td>
              <td>Mark@OurBIM</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>vanjian@ourbim.com</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>13333333333</td>
            </tr>
            <tr>
              <td>公司</td>
              <td>万间科技</td>
            </tr>
            <tr>
              <td>职位</td>
              <td>产品</td>
            </tr>
          </table>
          <div class="xia">
            <el-button type="primary">主要按钮</el-button>
          </div>
        </div>
        <!-- 授权码 -->
        <div class="neirong" v-show="isHand == 7">
          授权码：

          <el-input v-model="input" placeholder="请输入内容"></el-input>
          <el-button type="primary">主要按钮</el-button>
        </div>
        <!-- 服务订单 -->
        <div class="neirong" v-show="isHand == 8">
          <table class="dingdan">
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
        <!-- 团队 -->
        <div class="neirong" v-show="isHand == 9">
          <el-table
            :data="tableData"
            style="width: 100%"
            row-key="id"
            border
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildren'
            }"
          >
            <el-table-column prop="use" label="应用" width="180">
            </el-table-column>
            <el-table-column prop="time" label="成立时间" width="180">
            </el-table-column>
            <el-table-column prop="role" label="角色"> </el-table-column>
            <el-table-column prop="handle" label="操作"> </el-table-column>
          </el-table>
        </div>
        <!-- 修改密码 -->
        <div class="neirong" v-show="isHand == 10">
          <div class="geren">
            修改密码：
          </div>
          <table>
            <tr>
              <td>原密码</td>
              <td>请输入</td>
            </tr>
            <tr>
              <td>新密码</td>
              <td>请输入</td>
            </tr>
            <tr>
              <td>确认密码</td>
              <td>请输入</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>请输入</td>
            </tr>
            <tr>
              <td>验证码</td>
              <td>请输入</td>
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
  components: { myHeader, MyMain, MyFooter }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    .content {
      margin-left: 41px;
      overflow: hidden;
      .record {
        width: 100%;
        height: 40px;
        margin-top: 38px;
        position: relative;
        .left {
          height: 40px;
        }
        .right {
          position: absolute;
          right: 20px;
          top: 0px;
        }
      }
      .list {
        .lis {
          width: 1379px;
          height: 668px;
          li {
            width: 310px;
            height: 300px;
            margin-right: 30px;
            margin-bottom: 34px;
            float: left;
            list-style: none;
            box-sizing: border-box;
            overflow: hidden;
            .img {
              width: 315px;
              height: 200px;
              .tupian {
                width: 100%;
                height: 100%;
              }
            }
            .write {
              height: 100px;
              background-color: #fff;
              padding-top: 5px;
              padding-left: 20px;
            }
            .line {
              width: 300px;
              height: 1px;
              background-color: #e4e4e4;
            }
            .btn {
              width: 300px;
              height: 100px;
              background-color: #fff;
              padding-left: 15px;
              line-height: 100px;
            }
            .photo {
              width: 300px;
              height: 100px;
              background-color: #fff;
              padding-left: 15px;
              line-height: 100px;
              .big {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                float: left;
                margin-top: 20px;
                .min {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
      table {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 50px;
        border-collapse: collapse;
        font-size: 16px;
        tr {
          height: 50px;
        }
        th {
          background-color: #fafafa;
        }
        td {
          background-color: #fff;
        }
      }
      table,
      th,
      td {
        border: 1px solid black;
        text-align: center;
      }
      .dropdown {
        width: 200px;
        height: 300px;
        float: left;
        margin-right: 100px;
        div {
          width: 100%;
          height: 50px;
          border-bottom: 1px solid #f2f2f2;
          line-height: 50px;

          margin-right: 50px;
          button:focus {
            background-color: #fff;
          }
          button {
            padding-left: 50px;
            height: 100%;
            width: 100%;
            border: none;
            outline: none;
            font-size: 16px;
            text-align: left;
            background-color: #f9f9f9;
          }
          button:hover {
            color: #41b19c;
            cursor: pointer;
          }
        }
      }
      .neirong {
        float: left;
        width: 1000px;
        // background-color: orange;
        .geren {
          float: left;
        }
        .xinxi {
          float: left;
        }
        table,
        th,
        td {
          border: 1px solid black;
          text-align: center;
        }
        table {
          width: 400px;
        }
        .el-input {
          width: 400px;
        }
        .dingdan {
          width: 100%;
        }
        .demo-table-expand {
          font-size: 0;
        }
        .demo-table-expand label {
          width: 90px;
          color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 50%;
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
