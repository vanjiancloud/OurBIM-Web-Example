<template>
  <div class="rongqi">
    <!-- 头部 -->
    <div class="header">
      <div class="container">
        <!-- logo -->
        <div class="logo">
          <img src="./logo.png" alt="" class="img" />
        </div>
        <!-- 导航 -->
        <ul>
          <li>
            <a href="">{{ $t('introduction') }}</a>
          </li>
          <li>
            <a href="">{{ $t('Solution') }}</a>
          </li>
          <li>
            <a href="">{{ $t('cases') }}</a>
          </li>
          <li>
            <a href="">{{ $t('Pricing') }}</a>
          </li>
          <li>
            <a href="">{{ $t('consultation') }}</a>
          </li>
          <li>
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ $t('consultation')
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{ $t('APIdov') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('project') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('Mcenter') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('Service') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('log') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="first">
            <!-- <transition>
              <div class="serach" v-if="islive">
                <div class="menu">
                  <el-dropdown @command="checkitem">
                    <span class="el-dropdown-link">
                      {{ classify
                      }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="$t('whole')">{{
                        $t('whole')
                      }}</el-dropdown-item>
                      <el-dropdown-item :command="$t('info')">{{
                        $t('info')
                      }}</el-dropdown-item>
                      <el-dropdown-item :command="$t('case')">{{
                        $t('case')
                      }}</el-dropdown-item>
                      <el-dropdown-item :command="$t('activity')">{{
                        $t('activity')
                      }}</el-dropdown-item>
                      <el-dropdown-item :command="$t('Model')">{{
                        $t('Model')
                      }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="in">
                  <el-input v-model="input" placeholder="请输入搜索内容">
                  </el-input>
                </div>
              </div>
            </transition> -->
            <!-- <div @click="toshow">
            <span class="span"><i class="el-icon-search"></i></span>
          </div> -->
          </li>
          <li class="second">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="imgUrl" alt="未上传" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toUserCenter">{{
                  $t('userCenter')
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="toLogin">{{
                  $t('quit')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="forth">
            <a @click="English" href="javascript:;">English</a>
            <span style="margin: 0 5px;font-size: 10px;">|</span>
            <a @click="Chinese" href="javascript:;">中文</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 个人信息展示 -->
    <div class="main">
      <div class="container">
        <!-- 上半部分 -->
        <div class="top">
          <div class="left">
            <div class="im">
              <img :src="imgUrl" alt="未上传头像" />
            </div>
            <div class="Info">
              <h3>{{ name }}</h3>
              {{ note }}
            </div>
          </div>
          <div class="line"></div>
          <div class="middle">
            <h3>{{ $t('occupancy') }}</h3>
            <div class="tiao">
              <h3 style="color: #00AAF0;">{{ spacePer }}%</h3>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="Number(spacePer)"
                :show-text="false"
                :color="customColor"
              >
              </el-progress>
              <div class="tu">
                <div class="icon">
                  <img src="./cunchu.png" alt="" />
                </div>
                {{ $t('storage') }}&nbsp;&nbsp;{{ currentCountSpace }}/{{
                  countSpace
                }}
              </div>
            </div>
          </div>
          <div class="jindu">
            <h3>{{ bfPer }}%</h3>
            <el-progress
              :text-inside="true"
              :stroke-width="15"
              :percentage="Number(bfPer)"
              :show-text="false"
              :color="customColor"
            >
            </el-progress>
            <div class="tutu">
              <div class="icon">
                <img src="./jiedian.png" alt="" />
              </div>
              {{ $t('Node') }}&nbsp;&nbsp;{{ currentCountBF }}/{{ countBF }}
            </div>
          </div>
          <div class="line"></div>
          <div class="right">
            <div class="content">
              <div>{{ $t('service') }}</div>
              <div>{{ countStartTime }}{{ $t('to') }}{{ countendTime }}</div>
              <el-button
                plain
                round
                size="mini"
                style="color: #00AAF0;border-color:#00aaf0;font-size: 16px;"
                @click="toOrder"
              >
                {{ $t('Extension') }}
              </el-button>
            </div>
          </div>
        </div>
        <!-- tab栏 -->
        <el-menu
          :default-active="this.$route.path"
          :router="true"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/userCenter">我的应用</el-menu-item>
          <el-menu-item index="/manage">应用管理</el-menu-item>
          <el-menu-item index="/found">创建应用</el-menu-item>
          <el-menu-item index="/bill">账户管理</el-menu-item>
        </el-menu>

        <!-- <div class="tab">
          <span>
            <el-button type="text" @click="goUserCenter">{{
              $t('app')
            }}</el-button>
          </span>
          <span>
            <el-button type="text" @click="toManage">{{
              $t('management')
            }}</el-button>
          </span>
          <span>
            <el-button type="text" @click="toFound">{{
              $t('Create')
            }}</el-button>
          </span>
          <span class="last">
            <el-button type="text" @click="toBill">{{
              $t('Account')
            }}</el-button>
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { showDetail } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
export default {
  name: 'myHeader',
  data () {
    return {
      customColor: '#00AAF0',
      note: '未上传签名', //签名
      name: '未上传用户名', //用户名
      imgUrl: '', //用户头像
      countStartTime: '', //账户生效开始时间
      countendTime: '', //账户生效结束时间
      spacePer: 0, //空间使用率，第一个进度条
      bfPer: 0, //并发使用率，第二个进度条
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
    English () {
      this.$i18n.locale = 'en'
      this.classify = 'whole'
      // this.isCut = 2
    },
    Chinese () {
      this.$i18n.locale = 'zh'
      this.classify = '全部'
      // this.isCut = 1
    },
    // 延长有效期按钮
    toOrder () {
      this.$router.push('../order')
    },
    toUserCenter () {
      if (this.route !== '/userCenter') {
        this.$router.push('../userCenter/')
      } else {
        this.$router.go(0)
      }
    },
    toLogin () {
      this.$router.push('../login/')

      window.localStorage.userid = ''
    },
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
    //定时器，每隔10秒更新一次数据
    // get () {
    //   this.showData()
    //   console.log('定时器运行中')
    // },
    goUserCenter () {
      this.$router.push('../userCenter')
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
    this.timer = setInterval(this.get, 30000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.rongqi {
  .header {
    a {
      text-decoration: none;
      font-size: 17px;
      color: #000;
      font-family: PingFang SC;
    }
    a:hover {
      color: #ff6600;
    }
    height: 64px;
    background-color: #fff;
    line-height: 64px;
    .logo {
      width: 151px;
      height: 30px;
      float: left;
      margin: 10px 169px 24px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    li {
      height: 16px;
      float: left;
      list-style: none;
      margin: 0;
      padding: 0;
      margin-right: 47px;
      a {
        font-size: 16px;
      }
      .li {
        font-size: 14px;
        color: #999999;
      }
      .el-dropdown {
        height: 48px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #000;
        font-size: 16px;
      }
      .el-icon-arrow-down {
        font-size: 16px;
      }
    }
    .second {
      margin-left: -20px;
      margin-right: 20px;
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
    }
    .third {
      margin-right: 40px;
    }
    .forth {
      // background-color: green;
      float: right;
      margin: 0;
      height: 16px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }
  .main {
    height: 221px;
    margin-top: 20px;
    .container {
      .top {
        height: 152px;
        background-color: #fff;
        .left {
          height: 152px;
          width: 267px;
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
            width: 187px;
            height: 115px;
            text-align: center;
          }
        }
        .line {
          width: 1px;
          height: 100px;
          float: left;
          background-color: #ccc;
          margin: 0 20px;
          margin-top: 26px;
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
            margin-left: 100px;
            .tu {
              float: left;
              width: 318px;
              margin-right: 29px;
              margin-top: 10px;
              // background-color: red;
              .icon {
                width: 20px;
                height: 20px;
                float: left;
                margin-right: 10px;
                margin-top: 3px;
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
          // height: 152px;
          // background-color: pink;
          float: left;
          h3 {
            margin-top: 37px;
            color: #00aaf0;
          }
          .tutu {
            float: left;
            margin-top: 10px;
            .icon {
              width: 20px;
              height: 20px;
              float: left;
              margin-right: 10px;
              margin-top: 4px;
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
          }
        }
      }
      // 中文tab栏
      .tab {
        height: 69px;
        // background-color: #f1f1f1;
        background-color: red;
        line-height: 69px;
        padding-left: 220px;
        .el-button {
          color: #000;
          font-size: 19px;
        }
        .el-button:hover {
          color: #ff6600;
        }
        span {
          margin-right: 210px;
          height: 50px;
          // background-color: pink;
          border-bottom: 6px solid #f1f1f1;
          border-radius: 3px;
        }
        .last {
          margin: 0;
        }
        span:hover {
          border-bottom-color: #ff6600;
        }
      }
      // 英文tab栏
      .tabTwo {
        height: 69px;
        // background-color: #f1f1f1;
        background-color: red;
        line-height: 69px;
        padding: 0 200px;
        .el-button {
          color: #000;
          font-size: 19px;
        }
        .el-button:hover {
          color: #ff6600;
        }
        span {
          margin-right: 140px;
          height: 50px;
          // background-color: pink;
          border-bottom: 6px solid #f1f1f1;
          border-radius: 3px;
        }
        .last {
          margin: 0;
        }
        span:hover {
          border-bottom-color: #ff6600;
        }
      }
    }
  }
}
</style>
