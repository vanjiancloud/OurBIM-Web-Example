<template>
  <div class="main">
    <div class="container">
      <!-- 上半部分 -->
      <div class="top">
        <div class="left">
          <div class="im">
            <img src="imgUrl" alt="" />
          </div>
          <div class="Info">
            <h3>{{ name }}</h3>
            {{ note }}
          </div>
        </div>
        <div class="middle">
          <h3>资源占用</h3>
          <div class="tiao">
            <h3 style="color: #00AAF0;">{{ spacePer }}</h3>
            <el-progress
              :text-inside="true"
              :stroke-width="15"
              :percentage="0"
              :show-text="false"
              :color="customColor"
            >
            </el-progress>
            <div class="tu">
              <div class="icon">
                <img src="./cunchu.png" alt="" />
              </div>
              剩余存储&nbsp;&nbsp;{{ currentCountSpace }}/{{ countSpace }}
            </div>
          </div>
        </div>
        <div class="jindu">
          <h3>{{ bfPer }}</h3>
          <el-progress
            :text-inside="true"
            :stroke-width="15"
            :percentage="0"
            :show-text="false"
            :color="customColor"
          >
          </el-progress>
          <div class="tutu">
            <div class="icon">
              <img src="./jiedian.png" alt="" />
            </div>
            剩余节点&nbsp;{{ currentCountBF }}/{{ countBF }}
          </div>
        </div>
        <div class="right">
          <div class="content">
            <div>服务有效期</div>
            <div>{{ countStartTime }}至{{ countendTime }}</div>
            <el-button
              plain
              round
              class="btn"
              size="mini"
              style="color: #00AAF0;border-color:#00aaf0;"
              >延长有效期</el-button
            >
          </div>
        </div>
      </div>
      <!-- tab栏 -->
      <div class="tab">
        <div>
          <el-button type="text" @click="toUserCenter">我的应用 </el-button>
        </div>
        <div>
          <el-button @click="toIssue" type="text">我的发布</el-button>
        </div>
        <div>
          <el-button type="text" @click="toManage">应用管理</el-button>
        </div>
        <div>
          <el-button type="text" @click="toFound">创建应用</el-button>
        </div>
        <div class="last">
          <el-button type="text" @click="toBill">账户管理</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showDetail } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
export default {
  name: 'myMain',
  data () {
    return {
      customColor: '#00AAF0',
      note: '', //签名
      name: '', //用户名
      imgUrl: '', //用户头像
      countStartTime: '', //账户生效开始时间
      countendTime: '', //账户生效结束时间
      spacePer: '', //空间使用率，第一个进度条
      bfPer: '', //并发使用率，第二个进度条
      countSpace: '', //当前用户的存储量最大值
      currentCountSpace: '', //当前用户已使用的存储率
      countBF: '', //当前用户的并发总数最大值
      currentCountBF: '' //当前用户的并发数
    }
  },
  created () {
    this.showData()
  },
  methods: {
    //展示当前用户信息
    showData () {
      showDetail({
        userid: getuserid()
      })
        .then(res => {
          console.log(res)
          this.name = res.data.data.name
          this.note = res.data.data.note
          this.imgUrl = res.data.data.imgUrl
          this.countStartTime = res.data.data.countStartTime
          this.countendTime = res.data.data.countendTime
          this.countSpace = res.data.data.countSpace
          this.spacePer = res.data.data.spacePer
          this.bfPer = res.data.data.bfPer
          this.currentCountSpace = res.data.data.currentCountSpace
          this.countBF = res.data.data.countBF
          this.currentCountBF = res.data.data.currentCountBF
        })
        .catch(err => {
          this.$message.error('信息展示失败')
        })
    },
    //定时器，每隔5秒更新一次数据
    get () {
      this.showData()
      console.log('定时器运行中')
    },
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
  },
  mounted () {
    this.timer = setInterval(this.get, 10000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 221px;
  margin-top: 20px;
  .container {
    .top {
      height: 152px;
      background-color: #fff;
      .left {
        height: 152px;
        width: 287px;
        margin-right: 20px;
        margin-left: 42px;
        float: left;
        background-color: #fff;
        // background-color: green;
        .im {
          margin-top: 36px;
          width: 80px;
          height: 80px;
          float: left;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .Info {
          float: left;
          margin-top: 35px;
          // background-color: red;
          width: 207px;
          height: 115px;
          text-align: center;
        }
      }
      .middle {
        height: 152px;
        float: left;
        margin-right: 30px;
        // background-color: red;
        h3 {
          margin-top: 6px;
        }
        .tiao {
          width: 318px;
          float: left;
          margin-top: -10px;
          margin-left: 100px;
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
        }
      }
      .jindu {
        width: 318px;
        height: 152px;
        // background-color: pink;
        float: left;
        h3 {
          margin-top: 28px;
          color: #00aaf0;
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
      .right {
        height: 152px;
        width: 207px;
        margin-right: 42px;
        float: right;
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
        color: #000;
      }
      .el-button:hover {
        color: #ff6600;
      }
      div {
        float: left;
        margin-right: 155px;
        width: 70px;
        height: 50px;
        // background-color: pink;
        border-bottom: 5px solid #f1f1f1;
        border-radius: 3px;
      }
      div:hover {
        border-bottom-color: #ff6600;
      }
      .last {
        margin: 0;
      }
    }
  }
}
</style>
