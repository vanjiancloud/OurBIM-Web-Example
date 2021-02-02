<template>
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
        >
          <el-menu-item index="1" route="./apply" class="item"
            >我的应用</el-menu-item
          >
          <el-menu-item index="2" route="./issue" class="item"
            >我的发布</el-menu-item
          >
          <el-menu-item index="3" route="./manage" class="item"
            >应用管理</el-menu-item
          >
          <el-menu-item index="4" route="./found" class="item"
            >创建应用</el-menu-item
          >
          <el-menu-item index="5" route="./account" class="item"
            >账户管理</el-menu-item
          >
        </el-menu>
      </div>
    </div>
    <!-- 中间部分 -->
    <div class="zhongjian"></div>
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
      height: 85px;
      background-color: #f9f9f9;
      padding-top: 25px;
      .item {
        font-size: 16px;
        font-weight: bold;
        margin-left: 60px;
      }
      // .el-menu-demo {
      //   height: 85px;
      //   // font-size: 50px;
      //   font-weight: bold;
      //   margin-right: 100px;
      // }
    }
  }
  .zhongjian {
    width: 100%;
    height: 25px;
    background-color: #f0f2f5;
  }
}
</style>
