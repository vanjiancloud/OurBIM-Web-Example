<template>
  <el-container>
    <!-- 顶部导航栏和信息展示 -->
    <el-header>
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="container">
          <!-- logo -->
          <div class="logo">
            <a href="http://www.ourbim.com:7011">
              <img src="./img/logo.png" alt="" class="img"
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
                示例项目</a
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
          <!-- 退出设置 -->
          <div class="set">
            <el-dropdown>
              <span>
                <i class="el-icon-s-tools"></i>
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
          <!-- 头像和中英文切换栏 -->
          <div class="end">
            <div class="touxiang">
              <img
                :src="imgUrl ? imgUrl : require(sex==1?'./img/man.png':'./img/woman.png')"
                alt=""
              />
            </div>
            <div class="language">
              <a @click="Chinese" href="javascript:;">中文</a>
              <span style="margin: 0 5px;">|</span>
              <a href="javascript:;">English</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人信息展示 -->
      <div class="main">
        <div class="container">
          <div class="top">
            <div class="left">
              <div class="im">
                <img :src="imgUrl ? imgUrl : require(sex==1?'./img/man.png':'./img/woman.png')" />
                <!-- <img
                  :src="imgUrl"
                  :class="{
                  
                }"
                /> -->
                <!-- <img src="../register/img/man.png" v-show="sex = 1" /> -->
              </div>
              <!-- 昵称和签名栏 -->
              <div class="Info">
                {{ name ? name : mobile }}<br />
                {{ note ? note : email }}
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
                    <img src="./img/cunchu.png" alt="" />
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
                  <img src="./img/jiedian.png" alt="" />
                </div>
                {{ $t('Node') }}&nbsp;&nbsp;{{ currentCountBF }}/{{ countBF }}
              </div>
            </div>
            <div class="line"></div>
            <div class="right">
              <div class="content">
                <div>{{ $t('service') }}</div>
                <div>{{ countStartTime }}&nbsp;--&nbsp;{{ countendTime }}</div>
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
        </div>
      </div>
    </el-header>

    <!-- 主体内容区 -->
    <el-main>
      <div class="container">
        <!-- 导航菜单 -->
        <div class="nav">
          <el-menu
            :default-active="activeMenu"
            class="tac"
            text-color="#00aaf0"
            active-text-color="#fff"
            router
            background-color="#f0fbff"
          >
            <!-- 项目管理 -->
            <el-menu-item index="/manage">
              <i class="el-icon-setting"></i>
              <span slot="title" class="write">{{ $t('management') }}</span>
            </el-menu-item>
            <!-- 创建项目 -->
            <el-menu-item index="/found">
              <i class="el-icon-folder-add"></i>
              <span slot="title" class="write">{{ $t('Create') }}</span>
            </el-menu-item>
            <!-- 账户管理 -->
            <el-submenu index="account">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span class="write">{{ $t('Account') }}</span>
              </template>
              <!-- 个人信息 -->
              <el-menu-item index="/bill">{{ $t('information') }}</el-menu-item>
              <!-- 授权码 -->
              <el-menu-item index="/code">{{
                $t('Authorization')
              }}</el-menu-item>
              <!-- 服务订单 -->
              <el-menu-item index="/order">{{
                $t('Serviceorder')
              }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <!--主体区域二级路由组件渲染的地方-->
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </el-main>

    <!-- 尾部 -->
    <el-footer>
      <div class="footer">
        <div class="container">
          <div class="wenzi">
            <div>
              Copyright © 2021 www.OurBIM.com, All Rights Reserved.
            </div>
            <div>022-8633-0370</div>
            <div class="last">
              <a
                href="https://beian.miit.gov.cn/#/Integrated/index"
                target="_blank"
                >津ICP备15006036号-2</a
              >
            </div>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { showDetail } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
import { deluserid, Deluserid } from '@/store/index.js'

export default {
  name: 'myHeader',
  data () {
    return {
      time: null,
      customColor: '#00AAF0',
      note: '', //签名
      name: '', //用户名
      sex: '', //性别
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
    console.log(this.$route.path)
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
      deluserid()
      Deluserid()
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
          this.sex = res.data.data.sex
          this.note = res.data.data.note
          this.email = res.data.data.email
          this.mobile = res.data.data.mobile
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
          // this.$message.error('信息展示失败')
          // this.imgUrl = this.imgUrl
        })
    },

    // 根据传入的sex做适配
    // formatStatus (sex) {
    //   const sexObj = {
    //     1: '../register/img/man.png',
    //     2: '../register/img/woman.png'
    //   }
    //   return sexObj[sex]
    // },

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
  computed: {
    /*使用计算属性来获取到当前点击的菜单的路由路径
      然后设置default-active中的值
      使得菜单在载入时就能对应高亮
    */
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      /*
       可以在路由配置文件中设置自定义的路由路径到
       meta.activeMenu属性中，来控制菜单自定义高亮显示
      */
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  /* 把定时器放在activated事件里，当清除定时后，
  下次再次进入当前路由的话，可以再次唤起定时器 */
  activated () {
    this.time = setInterval(() => {
      this.showData()
      // console.log('个人信息')
    }, 3000)
  },
  // 路由跳转清除定时
  beforeRouteLeave (to, from, next) {
    next()
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  margin: 0;
  padding: 0;
  .el-header {
    margin: 0;
    padding: 0;
    .header {
      min-height: 60px;
      background-color: #fff;
      line-height: 60px;
      a {
        text-decoration: none;
        font-size: 17px;
        color: #000;
        font-family: PingFang SC;
      }
      a:hover {
        color: #ff6600;
      }
      .logo {
        width: 150px;
        height: 37px;
        float: left;
        margin-top: 11px;
        margin-right: 215px;
        margin-left: 10px;

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
        .el-dropdown {
          height: 35px;
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
      .set {
        float: left;
        margin-left: 100px;
        span {
          font-size: 25px;
          cursor: pointer;
        }
        .el-dropdown {
          height: 35px;
        }
      }
      .end {
        float: right;
        height: 64px;
        width: 185px;
        .touxiang {
          float: left;
          img {
            margin-top: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .language {
          float: right;
          .el-dropdown {
            height: 40px;
          }
        }
      }
    }
    .main {
      min-height: 152px;
      margin-top: 20px;
      // background-color: red;
      .top {
        height: 152px;
        background-color: #fff;
        .left {
          height: 152px;
          width: 288px;
          margin-left: 20px;
          float: left;
          // background-color: green;
          display: flex;

          .im {
            margin-top: 36px;
            width: 80px;
            height: 80px;
            // float: left;
            border-radius: 50%;
            // background-color: blue;
            margin-right: 20px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .Info {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 187px;
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
    }
  }
  .el-main {
    .container {
      margin-top: 172px;
      margin-bottom: 35px;
      display: flex;
      justify-content: center;
      .nav {
        width: 230px;
        min-height: 961px;
        margin-right: 20px;
        .tac {
          width: 100%;
          height: 100%;
          .el-menu-item {
            font-size: 16px;
            height: 60px;
            line-height: 60px;
            i {
              color: #00aaf0;
            }
          }
          .el-submenu {
            i {
              color: #00aaf0;
            }
          }
          // 每一项选中状态
          /deep/ .el-menu-item.is-active {
            background-color: #00aaf0 !important;
            i {
              color: #fff;
            }
          }
          // 每一项鼠标悬停状态
          /deep/ .el-menu-item:hover {
            background-color: #00aaf0 !important;
            color: #fff !important;
            i {
              color: #fff;
            }
          }
          // el-submenu 每一项选中状态
          // /deep/ .el-submenu.is-active {
          //   background-color: #00aaf0 !important;
          //   // color: #fff !important;
          //   i {
          //     color: #fff;
          //   }
          // }
          // el-submenu 每一项鼠标悬停状态
          /deep/ .el-submenu__title:hover {
            background-color: #00aaf0 !important;
            color: #fff !important;
            i {
              color: #fff;
            }
            i.el-submenu__icon-arrow.el-icon-arrow-down {
              color: #fff;
            }
          }
          /deep/ i.el-submenu__icon-arrow.el-icon-arrow-down {
            font-size: 20px;
            color: #00aaf0;
          }

          .write {
            font-size: 20px;
          }
          i {
            margin-right: 20px;
            margin-left: 10px;
            font-size: 25px;
            // color: #fff;
          }
        }
      }
      .content {
        width: 1170px;
        min-height: 961px;
        background-color: #fff;
      }
    }
  }

  .el-footer {
    margin: 0;
    padding: 0;
    .footer {
      // min-width: 1420px;
      min-height: 115px;
      // padding: 20px 0px;
      background-color: #000;
      display: flex;
      align-items: center;
      .wenzi {
        color: #999;
        text-align: center;
        font-size: 14px;
        div {
          margin-bottom: 8px;
        }
        .last {
          margin: 0;
          a {
            color: #999;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
