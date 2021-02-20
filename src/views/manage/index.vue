<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写的内容 -->
    <div class="container">
      <div class="content">
        <!-- 消息提示 -->
        <div class="record">
          <!-- 消息提示 -->
          <div class="left">
            您共有3个项目
          </div>
          <!-- 按钮 -->
          <div class="right">
            <el-button type="primary">{{ $t('link') }}</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <table>
          <tr>
            <th>应用ID</th>
            <th>应用名称</th>
            <th>最大并发数量</th>
            <th>状态</th>
            <th>上传日期</th>
            <th>操作</th>
          </tr>
          <tr>
            <td>ID43321432</td>
            <td>钱龙广场1.0</td>
            <td>5</td>
            <td>转换完成</td>
            <td>2021-01-0112：34</td>
            <td>
              <button>分享</button>
              <button>编辑</button>
              <button>删除</button>
            </td>
          </tr>
          <tr>
            <td>ID43321432</td>
            <td>钱龙广场1.0</td>
            <td>5</td>
            <td>转换完成</td>
            <td>2021-01-0112：34</td>
            <td>
              <button>分享</button>
              <button>编辑</button>
              <button>删除</button>
            </td>
          </tr>
          <tr>
            <td>ID43321432</td>
            <td>钱龙广场1.0</td>
            <td>5</td>
            <td>转换完成</td>
            <td>2021-01-0112：34</td>
            <td>
              <button>分享</button>
              <button>编辑</button>
              <button>删除</button>
            </td>
          </tr>
        </table>
        <!-- 分页 -->
        <div class="page">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            background
            :total="400"
          >
          </el-pagination>
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
  a {
    text-decoration: none;
    font-size: 16px;
    color: #000;
    font-family: PingFang SC;
  }
  a:hover {
    color: #409eff;
  }
  .container {
    .content {
      margin-left: 41px;
      margin-right: 41px;
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
          right: 0px;
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
        margin-top: 15px;
        margin-bottom: 40px;
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
    }
    .page {
      width: 550px;
      margin: 0 auto;
      margin-bottom: 40px;
    }
  }
}
</style>
