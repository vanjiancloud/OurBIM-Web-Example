<template>
  <div class="rongqi">
    <!-- 头部 -->
    <div class="header">
      <div class="center">
        <!-- logo -->
        <div class="logo">
          <a href="http://www.ourbim.com:7011">
            <img src="./logo.png" alt="" class="img"
          /></a>
        </div>
        <!-- 导航 -->
        <ul>
          <!-- 功能介绍 -->
          <li>
            <a href="http://www.ourbim.com:7011/introduce">
              {{ $t('introduction') }}</a
            >
          </li>
          <!-- 解决方案 -->
          <li>
            <a href="http://www.ourbim.com:7011/solution">
              {{ $t('Solution') }}</a
            >
          </li>
          <!-- 成功案例 -->
          <li>
            <a href="http://www.ourbim.com:7011/successful_cases">
              {{ $t('cases') }}</a
            >
          </li>
          <!-- 产品定价 -->
          <li>
            <a href="http://www.ourbim.com:7011/product_pricing">
              {{ $t('Pricing') }}</a
            >
          </li>
          <!-- 最新资讯 -->
          <li>
            <a href="http://www.ourbim.com:7011/latest_news">
              {{ $t('consultation') }}</a
            >
          </li>
          <!-- 开发者下拉菜单 -->
          <li>
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ $t('developer')
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- API文档 -->
                <el-dropdown-item>
                  <span class="item">
                    <a
                      href="http://www.ourbim.com:7011/developer/api_file"
                      style="text-decoration:none;color:#000"
                    >
                      {{ $t('APIdov') }}
                    </a>
                  </span>
                </el-dropdown-item>
                <!-- 示例项目 -->
                <el-dropdown-item>
                  <a
                    href="http://www.ourbim.com:7011/developer/sample_project"
                    style="text-decoration:none; color:#000"
                    >{{ $t('projects') }}</a
                  >
                </el-dropdown-item>
                <!-- 模型中心 -->
                <el-dropdown-item>
                  <a
                    href="http://www.ourbim.com:7011/developer/model_center"
                    style="text-decoration:none; color:#000"
                    >{{ $t('Mcenter') }}</a
                  >
                </el-dropdown-item>
                <!-- 服务中心 -->
                <el-dropdown-item>
                  <a
                    href="http://www.ourbim.com:7011/developer/service_entre"
                    style="text-decoration:none; color:#000"
                    >{{ $t('Service') }}</a
                  >
                </el-dropdown-item>
                <!-- 更新日志 -->
                <el-dropdown-item>
                  <a
                    href="http://www.ourbim.com:7011/developer/update_log"
                    style="text-decoration:none; color:#000"
                    >{{ $t('log') }}</a
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
        <!-- 头像和中英文切换栏 -->
        <div class="end">
          <div class="touxiang">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img
                  :src="imgUrl ? imgUrl : require('./touxiang.png')"
                  alt=""
                />
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
          </div>
          <div class="language">
            <a @click="Chinese" href="javascript:;">中文</a>
            <span style="margin: 0 5px;font-size: 10px;">|</span>
            <a @click="English" href="javascript:;">English</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 个人信息展示 -->
    <div class="main">
      <div class="container">
        <!-- 上半部分 -->
        <div class="top">
          <div class="left">
            <div class="im">
              <img
                :src="imgUrl ? imgUrl : require('./touxiang.png')"
                alt="未上传头像"
              />
            </div>
            <div class="Info">
              <h3>{{ name ? name : $t('Noupload') }}</h3>
              {{ note ? note : $t('noupload') }}
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
                {{ $t('storage') }}&nbsp;&nbsp;{{ currentCountSpace }}GB/{{
                  countSpace
                }}GB
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
              <div>{{ countStartTime }}--{{ countendTime }}</div>
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
          background-color="#007BAE"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/userCenter">{{ $t('app') }}</el-menu-item>
          <el-menu-item index="/manage">{{ $t('management') }}</el-menu-item>
          <el-menu-item index="/found">{{ $t('Create') }}</el-menu-item>
          <el-menu-item index="/bill" class="last">{{
            $t('Account')
          }}</el-menu-item>
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
      time: null,
      customColor: '#00AAF0',
      note: '', //签名
      name: '', //用户名
      imgUrl: '', //用户头像
      email: '', //邮箱
      mobile: '', //手机号
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
    // 跳转用户中心
    toUserCenter () {
      // if (this.route !== '/userCenter') {
      //   this.$router.push('../userCenter/')
      // } else {
      //   this.$router.go(0)
      // }
      // this.$router.push('../userCenter/')
    },

    // 退出按钮
    toLogin () {
      this.$router.push('../login/')
      window.localStorage.userid = ''
      clearInterval(this.time)
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
          // this.imgUrl = this.imgUrl
        })
    },

    // 去往用户中心
    goUserCenter () {
      this.$router.push('../userCenter')
    },

    // 去往应用管理
    toManage () {
      this.$router.push('../manage')
    },

    // 去往创建应用
    toFound () {
      this.$router.push('../found')
    },

    // 去往账户管理
    toBill () {
      this.$router.push('../bill')
    }
  },
  //  把定时器放在activated事件里，当清除定时后，
  // 下次再次进入当前路由的话，可以再次唤起定时器
  activated () {
    this.time = setInterval(() => {
      this.showData()
      console.log('个人信息5秒更新一次')
    }, 5000)
  },
  // 路由跳转清除定时
  beforeRouteLeave (to, from, next) {
    next()
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  },
  mounted () {
    //在接值组声明好接值事件
    // this.$EventBus.$on('setUserPhoto',(newPhoto) => {
    //   console.log(newPhoto);
    //   this.imgUrl = newPhoto
    // })
  }
}
</script>

<style lang="less" scoped>
.rongqi {
  .header {
    height: 60px;
    background-color: #fff;
    a {
      text-decoration: none;
      font-size: 17px;
      color: #000;
      font-family: PingFang SC;
    }
    a:hover {
      color: #ff6600;
    }
    .center {
      height: 60px;
      width: 1400px;
      margin: 0 auto;
      line-height: 60px;
      .logo {
        width: 150px;
        height: 38px;
        float: left;
        margin-top: 11px;
        margin-right: 245px;
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
        margin-right: 40px;
        .el-dropdown {
          height: 48px;
        }
        .el-dropdown-link {
          cursor: pointer;
          color: #000;
          font-size: 17px;
        }
        .el-dropdown-link:hover {
          color: #ff6600;
        }
        .el-icon-arrow-down {
          font-size: 17px;
        }
      }
      .end {
        // background-color: red;
        float: right;
        height: 64px;
        width: 180px;
        .el-dropdown {
          height: 40px;
        }
        .touxiang {
          float: left;
          cursor: pointer;
          img {
            margin-top: 12px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .language {
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
    }
  }
  .main {
    height: 221px;
    margin-top: 20px;
    margin-bottom: 10px;
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
        background-color: #f1f1f1;
        // background-color: red;
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
      .el-menu {
        height: 69px;
        padding-left: 180px;
        .el-menu-item {
          font-size: 20px;
          margin-right: 180px;
          // width: 120px;
          margin-top: 5px;
        }
        .last {
          margin-right: 0px;
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
