<template>
  <div class="main">
    <div class="container">
      <!-- 上半部分 -->
      <div class="top">
        <div class="left">
          <div class="im">
            <img src="./touxiang.png" alt="" />
          </div>
          <div class="zi">
            <h3>Mark</h3>
            2021-02-08
            </div>
        </div>
        <div class="middle">
          <h3>资源占用</h3>
          剩余存储 &nbsp; 2.4Gb/10Gb
          <div class="tiao">
            <h2>70%</h2>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="70"
            >
            </el-progress>
            <div class="tu">
              <div class="icon">
                <img src="./yingyong.png" alt="" />
              </div>
              剩余应用&nbsp;&nbsp;无限
            </div>
            <div class="tutu">
              <div class="icon">
                <img src="./jiedian.png" alt="" />
              </div>
              剩余节点&nbsp;3/3
            </div>
          </div>
        </div>
        <div class="right">
          <div class="content">
            <div>服务有效期</div>
            <div>2021-01-01至2026-01-01</div>
            <el-button plain round class="btn" size="mini"
              >延长有效期</el-button
            >
          </div>
        </div>
      </div>
      <!-- tab栏 -->
      <div class="tab">
        <div class="first"><el-button plain @click="toUserCenter">我的应用</el-button></div>
        <div><el-button plain @click="toIssue">我的发布</el-button></div>
        <div><el-button plain @click="toManage">应用管理</el-button></div>
        <div><el-button plain @click="toFound">创建应用</el-button></div>
        <div class="last"><el-button plain @click="toBill">账单管理</el-button></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toUserCenter () {
      this.$router.push('../userCenter')
    },
    toIssue () {
      this.$router.push('../issue')
    },
    toManage () {
      this.$router.push('../manage')
    },
    toFound () {
      this.$router.push('../found')
    },
    toBill () {
      this.$router.push('../bill')
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
  font-size: 16px;
  color: #000;
  font-family: PingFang SC;
}
a:hover {
  color: #409eff;
}
.main {
  height: 221px;
  margin-top: 20px;
  .top {
    height: 152px;
    background-color: #fff;
    .left {
      height: 152px;
      width: 172px;
      margin-right: 95px;
      margin-left: 42px;
      float: left;
      background-color: #fff;
      .im {
        margin-top: 36px;
        width: 80px;
        height: 80px;
        float: left;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .zi {
        float: right;
        margin-top: -65px;
        margin-left: 20px;
      }
    }
    .middle {
      height: 152px;
      float: left;
      width: 592px;
      margin-right: 270px;
      h3 {
        margin-top: 16px;
        margin-bottom: 36px;
      }
      .tiao {
        width: 318px;
        float: right;
        margin-top: -47px;
        .tu {
          float: left;
          margin-right: 29px;
          margin-top: 15px;
          .icon {
            width: 20px;
            height: 20px;
            float: left;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .tutu {
          float: left;
          margin-top: 15px;
          .icon {
            width: 20px;
            height: 20px;
            float: left;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .right {
      height: 152px;
      width: 207px;
      margin-right: 42px;
      float: left;
      text-align: center;
      // background-color: green;
      .content {
        margin-top: 36px;
        width: 207px;
        div {
          margin-bottom: 10px;
        }
        .btn {
          width: 132px;
        }
      }
    }
  }
  .tab {
    height: 69px;
    background-color: #f1f1f1;
    line-height: 69px;
    padding: 0 220px;
    .el-button {
      border: none;
      outline: none;
      background-color: #F1F1F1;
    }
    div {
      float: left;
      margin-right: 155px;
      width: 70px;
      height: 18px;
    }
    // .first {
    //   margin-left: 220px;
    // }
    .last {
      margin: 0;
    }
  }
}
</style>
