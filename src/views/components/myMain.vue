<template>
  <div class="main">
    <div class="container">
      <!-- 上半部分 -->
      <div class="top">
        <div class="left">
          <div class="im">
            <img src="./vue.jpg" alt="" />
          </div>
          <div class="zi">Mark <br />2021-02-08</div>
        </div>
        <div class="middle">
          <h3>资源占用</h3>
          剩余存储 &nbsp; 2.4Gb/10Gb
          <div class="tiao">
            <h2>78%</h2>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="70"
            >
            </el-progress>
            <div class="tu">
              <div class="icon">
                <img src="./应用.png" alt="" />
              </div>
              剩余应用&nbsp;&nbsp;无限
            </div>
            <div class="tutu">
              <div class="icon">
                <img src="./节点.png" alt="" />
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
        <div class="first"><a href="">我的应用</a></div>
        <div><a href="../userCenter/issue.vue">我的发布</a></div>
        <div><a href="../userCenter/manage.vue">应用管理</a></div>
        <div><a href="../userCenter/found.vue">创建应用</a></div>
        <div class="last"><a href="../userCenter/bill.vue">账单管理</a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
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
        border-radius: 50%;
        background-color: black;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .zi {
        float: right;
        margin-top: -65px;
        font-size: 12px;
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
    display: flex;
    align-items: center;
    div {
      float: left;
      margin-right: 155px;
    }
    .first {
      margin-left: 220px;
    }
    .last {
      margin: 0;
    }
  }
}
</style>
