<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <img src="./logo.png" alt="" class="img" />
        <!-- <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="4"
            ><a href="https://www.ele.me" target="_blank"
              >订单管理</a
            ></el-menu-item
          >
        </el-menu> -->
      </div>
      <div class="nav"></div>
      <div class="national"></div>
    </div>
    <!-- 内容 -->
    <div class="main">
      <!-- 上半部分 -->
      <div class="top">
        <!-- 用户信息展示 -->
        <div class="list">
          <div class="left">
            <div class="touxiang">
              <div class="demo-fit">
                <div class="block">
                  <span class="title">{{ fit }}</span>
                  <el-avatar
                    shape="circle"
                    :size="100"
                    :fit="fit"
                    :src="url"
                  ></el-avatar>
                </div>
              </div>
              <div class="mark">
                <h3>Mark</h3>
                <span>Mark@ourbim</span>
              </div>
            </div>
            <div class="shuju">
              <div class="hezi">
                <span style="font-weight:bold">资源占用</span><br />
                剩余存储&nbsp;2.4Gb/10Gb <br />
                <span style="font-size: 30px;">78%</span>
                <el-progress :percentage="78"></el-progress>
                <div class="neicun">
                  剩余应用：无限 剩余节点 3/3
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="qixian">
              服务有效期
              <h2>2021-01-01至2026-01-01</h2>
              <el-button>延长有效期</el-button>
            </div>
          </div>
        </div>
        <!-- tab栏 -->
        <div class="tab">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            router="true"
            background-color="#f9f9f9"
            text-color="#000"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1" route="./apply">我的应用</el-menu-item>
            <el-menu-item index="2" route="./issue">我的发布</el-menu-item>
            <el-menu-item index="3" route="./manage">应用管理</el-menu-item>
            <el-menu-item index="4" route="./found">创建应用</el-menu-item>
            <el-menu-item index="5" route="./account">账户管理</el-menu-item>
          </el-menu>
        </div>
      </div>
      <!-- 中间部分 -->
      <div class="zhongjian"></div>
      <!-- 下半部分 -->
      <div class="bottom"></div>
    </div>
    <!-- 尾部 -->
    <div class="footer">
      <div class="url">
        Copyright © 2021 www.OurBIM.com, All Rights Reserved.
      </div>
      <div class="mobile">24小时客服热线<br />022-8633-0370</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 100px;
    background-color: #fff;
    .logo {
      width: 240px;
      height: 80px;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .main {
    width: 1300px;
    margin-top: 25px;
    margin-left: 60px;
    margin-right: 180px;
    margin-bottom: 25px;
    background-color: #f9f9f9;
    .top {
      width: 100%;
      .list {
        width: 100%;
        height: 180px;
        background-color: #fff;
        display: flex;
        .left {
          flex: 1;
          display: flex;
          .touxiang {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .demo-fit {
              margin-right: 20px;
            }
            // .mark {

            // }
          }
          .shuju {
            flex: 1;
            .hezi {
              width: 240px;
              height: 147px;
              border: solid 1px #f0f2f5;
              margin: 5px 0;
              padding: 10px 20px;
              .neicun {
                width: 100%;
                height: 44px;
                margin-top: 15px;
                border-top: 1px solid #f0f2f5;
                line-height: 44px;
              }
            }
          }
        }
        .right {
          flex: 1;
          padding-top: 10px;
          .qixian {
            width: 350px;
            height: 160px;
            // background-color: purple;
            margin: 0 auto;
            margin-left: 200px;
            text-align: center;
            font-size: 16px;
            border-left: solid 1px #f0f2f5;
            border-right: solid 1px #f0f2f5;
          }
        }
      }
      .tab {
        width: 100%;
        .el-menu-demo {
          height: 85px;
          // font-size: 50px;
          font-weight: bold;
          margin-right: 50px;

        }
      }
    }
    .zhongjian {
      width: 100%;
      height: 25px;
      background-color: #f0f2f5;
    }
    .bottom {
      width: 100%;
      height: 500px;
    }
  }
  .footer {
    width: 100%;
    height: 150px;
    background-color: #fff;
    .url {
      float: left;
      width: 600px;
      height: 50px;
      // background-color: green;
      margin-top: 85px;
      margin-left: 250px;
    }
    .mobile {
      float: right;
      width: 300px;
      height: 50px;
      // background-color: purple;
      margin-top: 58px;
      margin-right: 50px;
    }
  }
}
</style>
