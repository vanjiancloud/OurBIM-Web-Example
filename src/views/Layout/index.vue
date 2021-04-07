<template>
  <el-container>
    <!-- 顶部导航栏 -->
    <el-header>
      <div class="header">
        <div class="container">
          <!-- logo -->
          <div class="logo">
            <a href="http://www.ourbim.com">
              <img src="./img/logo.png" alt="" class="img"
            /></a>
          </div>
          <!-- 导航 -->
          <ul>
            <!-- 首页 -->
            <li>
              <a href="http://www.ourbim.com">首页</a>
            </li>
            <!-- 功能介绍 -->
            <li>
              <a href="http://www.ourbim.com/introduce">
                {{ $t('introduction') }}</a
              >
            </li>
            <!-- 解决方案 -->
            <li>
              <a href="http://www.ourbim.com/solution">
                {{ $t('Solution') }}</a
              >
            </li>
            <!-- 成功案例 -->
            <li>
              <a href="http://www.ourbim.com/sample_project"> 示例项目</a>
            </li>
            <!-- 产品定价 -->
            <li>
              <a href="http://www.ourbim.com/product_pricing">
                {{ $t('Pricing') }}</a
              >
            </li>
            <!-- 最新资讯 -->
            <li>
              <a href="http://www.ourbim.com/latest_news">
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
                  <el-dropdown-item style=" background-color: #fff; ">
                    <a
                      href="http://www.ourbim.com/developer/api_file"
                      style="text-decoration:none;color:#999;"
                    >
                      {{ $t('APIdov') }}
                    </a>
                  </el-dropdown-item>
                  <!-- 服务中心 -->
                  <!-- <el-dropdown-item>
                    <a
                      href="http://www.ourbim.com/developer/service_entre"
                      style="text-decoration:none; color:#000"
                      >{{ $t('Service') }}</a
                    >
                  </el-dropdown-item> -->
                  <!-- 更新日志 -->
                  <el-dropdown-item style=" background-color: #fff; ">
                    <a
                      href="http://www.ourbim.com/developer/update_log"
                      style="text-decoration:none; color:#999"
                      >{{ $t('log') }}</a
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
          <!-- 项目中心 -->
          <div class="project" @click="toManage">
            <span>
              <img src="./img/project.png" alt="" />
            </span>
            项目中心
          </div>
          <!-- 头像和中英文切换栏 -->
          <div class="end">
            <div class="touxiang">
              <el-dropdown>
                <span>
                  <img
                    :src="
                      imgUrl
                        ? imgUrl
                        : require(sex == 1
                            ? './img/man.png'
                            : './img/woman.png')
                    "
                    alt=""
                  />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item @click.native="toUserCenter">{{
                    $t('userCenter')
                  }}</el-dropdown-item> -->
                  <el-dropdown-item
                    @click.native="toLogin"
                    style="background-color:#fff;"
                    >{{ $t('quit') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- <div class="language">
              <a @click="Chinese" href="javascript:;">中文</a>
              <span style="margin: 0 5px;">|</span>
              <a href="javascript:;">English</a>
            </div> -->
          </div>
          <!-- 预约演示 -->
          <el-popover placement="bottom" width="840" trigger="hover">
            <img
              src="./img/1.png"
              alt=""
              style=" margin-right: 80px;margin-left: 40px;margin-top: 10px;margin-bottom: 10px;"
            />
            <img
              src="./img/2.png"
              alt=""
              style=" margin-right: 80px;margin-top: 10px;margin-bottom: 10px;"
            />
            <img
              src="./img/3.png"
              alt=""
              style=" margin-right: 80px;margin-top: 10px;margin-bottom: 10px;"
            />
            <img
              src="./img/4.png"
              alt=""
              style=" margin-right: 40px;margin-top: 10px;margin-bottom: 10px;"
            />
            <el-button slot="reference" class="btn">
              <img src="./img/yuyue.png" alt="" />
              <span>预约演示</span>
            </el-button>
          </el-popover>
        </div>
      </div>
    </el-header>

    <!-- 内容区 -->
    <el-main>
      <div class="container">
        <!-- 个人信息展示 -->
        <div class="top">
          <div class="left">
            <div class="im">
              <img
                :src="
                  imgUrl
                    ? imgUrl
                    : require(sex == 1 ? './img/man.png' : './img/woman.png')
                "
              />
            </div>
            <!-- 昵称和签名栏 -->
            <div class="Info">
              <div class="name">{{ name ? name : mobile }}</div>
              <div class="note">{{ note ? note : email }}</div>
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
                size="small"
                @click="toOrder"
                :disabled="this.$route.path === '/order' ? true : false"
              >
                {{ $t('Extension') }}
              </el-button>
            </div>
          </div>
        </div>
        <!-- 主体内容区 -->
        <div class="bottom">
          <!-- 导航菜单 -->
          <div class="nav">
            <el-menu
              :default-active="activeMenu"
              class="tac"
              text-color="#000"
              active-text-color="#fff"
              router
              background-color="#fff"
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
                <el-menu-item index="/bill">{{
                  $t('information')
                }}</el-menu-item>
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
      </div>
    </el-main>

    <!-- 尾部 -->
    <el-footer>
      <div class="footer">
        <div class="container">
          <div class="wenzi">
            <div class="first">
              <a href="https://www.vanjian.com/" target="_blank">
                Copyright © 2017-2021 万间网络科技（天津）有限公司 版权所有</a
              >
            </div>
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
import { delCookie } from '@/utils/cookie'

export default {
  name: 'myHeader',
  data () {
    return {
      time: null, //定时器
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

    // 项目中心
    toManage () {
      this.$router.push('../manage')
    },

    // 延长有效期按钮
    toOrder () {
      this.$router.push('../order')
    },

    // 退出按钮
    toLogin () {
      this.$router.push('../login')
      if (sessionStorage.getItem("userInfo")) {
        sessionStorage.removeItem("userInfo")
      }
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
          console.log(res.data.data.imgUrl)
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
    }, 1000)
  },
  // 路由跳转清除定时
  beforeRouteLeave (to, from, next) {
    next()
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  },
  //页面实例销毁后清除定时
  destroyed () {
    // 清除定时器
    clearInterval(this.time)
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
        margin-left: 112px;
        margin-right: 66px;
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
        margin-right: 30px;
        a {
          font-size: 16px;
          color: #999;
        }
        .el-dropdown {
          height: 35px;
          .el-dropdown-link {
            cursor: pointer;
            color: #999;
            font-size: 16px;
          }
          .el-dropdown-link:hover {
            color: #ff6600;
          }
          .el-icon-arrow-down {
            font-size: 16px;
          }
          a:hover {
            color: #ff6600 !important;
          }
        }
      }
      .project {
        width: 87px;
        height: 25px;
        line-height: 25px;
        background-color: #ff6600;
        color: #fff;
        float: left;
        margin-top: 17px;
        border-radius: 5px;
        margin-left: 85px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        span {
          width: 15px;
          margin-right: 5px;
          margin-bottom: 7px;
          height: 15px;
        }
      }
      .end {
        float: left;
        margin-left: 15px;
        margin-right: 15px;
        height: 64px;
        // width: 185px;
        .touxiang {
          float: left;
          .el-dropdown {
            height: 35px;
          }
          img {
            margin-top: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .language {
          float: right;
          .el-dropdown {
            height: 40px;
          }
        }
      }
      .el-popover {
        img {
          margin-right: 50px;
        }
      }
      .btn {
        width: 87px;
        height: 25px;
        background-color: #ff6600;
        color: #fff;
        font-size: 15px;
        float: left;
        margin-top: 17px;
        display: flex;
        align-items: center;
        border-radius: 5px;
        font-size: 14px;
        position: relative;
        span {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        img {
          width: 15px;
          position: absolute;
          margin-right: 5px !important;
          top: 5px;
          left: 5px;
          height: 15px;
        }
      }
    }
  }
  .el-main {
    .container {
      margin-bottom: 35px;
      .top {
        height: 152px;
        margin-bottom: 20px;
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
            width: 187px;
            .name {
              width: 100%;
              font-weight: bold;
              text-align: center;
              // background-color: red;
              margin-top: 45px;
            }
            .note {
              width: 100%;
              text-align: center;
              margin-top: 10px;
            }
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
      .bottom {
        display: flex;
        justify-content: center;
        min-height: 961px;
        .nav {
          float: left;
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
                color: #000;
              }
            }
            .el-submenu {
              i {
                color: #000;
              }
            }
            // 每一项选中状态
            /deep/ .el-menu-item.is-active {
              background-color: #ff6600 !important;
              i {
                color: #fff;
              }
            }
            // 每一项鼠标悬停状态
            /deep/ .el-menu-item:hover {
              background-color: #ff6600 !important;
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
            /deep/ .el-submenu {
              i.el-submenu__icon-arrow.el-icon-arrow-down {
                color: #000;
              }
            }
            // el-submenu 每一项鼠标悬停状态
            /deep/ .el-submenu__title:hover {
              background-color: #ff6600 !important;
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
              color: #ff6600;
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
          float: left;
          width: 1170px;
          min-height: 961px;
          background-color: #fff;
        }
      }
    }
  }

  .el-footer {
    margin: 0;
    padding: 0;
    .footer {
      min-height: 80px;
      background-color: #19283b;
      display: flex;
      align-items: center;
      .wenzi {
        color: #fff;
        text-align: center;
        font-family: 'microsoft yahei';
        font-size: 14px;
        .first {
          height: 19px;

          margin-bottom: 10px;
          a {
            color: #fff;
            text-decoration: none;
          }
        }
        .last {
          margin: 0;
          a {
            color: #fff;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
