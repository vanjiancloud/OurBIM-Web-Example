<template>
  <div class="box">
    <!-- 头部 -->
    <div class="header">
      <!-- logo -->
      <div class="logo">
        <img src="./logo.png" alt="" class="img" />
      </div>
      <!-- 导航 -->
      <div class="nav">
        <el-menu
          :default-active="activeIndex"
          class="demo"
          router="true"
          mode="horizontal"
          @select="handleSelect"
          active-text-color="#1890FF"
        >
          <el-menu-item index="1" route="">功能介绍</el-menu-item>
          <el-menu-item index="2" route="">解决方案</el-menu-item>
          <el-menu-item index="3" route="">成功案例</el-menu-item>
          <el-menu-item index="4" route="">产品订价</el-menu-item>
          <el-menu-item index="5" route="">最新咨询</el-menu-item>
          <el-submenu index="6">
            <template slot="title">开发者</template>
            <el-menu-item index="6-1">API文档</el-menu-item>
            <el-menu-item index="6-2">示例项目</el-menu-item>
            <el-menu-item index="6-3">模型中心</el-menu-item>
            <el-menu-item index="6-4">服务中心</el-menu-item>
            <el-menu-item index="6-5">更新日志</el-menu-item>
          </el-submenu>
          <el-menu-item index="7">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                全部
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">全部</el-dropdown-item>
                <el-dropdown-item command="b">资讯</el-dropdown-item>
                <el-dropdown-item command="c">案例</el-dropdown-item>
                <el-dropdown-item command="d">活动</el-dropdown-item>
                <el-dropdown-item command="e">模型</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-input
              v-model="input"
              placeholder="请输入搜索内容"
              class="input"
            ></el-input>
            <i class="el-icon-search"></i>
          </el-menu-item>
          <el-menu-item index="8" route="../login">
            <i class="el-icon-s-custom"></i> {{ $t('login') }}
          </el-menu-item>
          <el-menu-item index="9" route="../register">
            <i class="el-icon-edit"></i>{{ $t('register') }}
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 国际化 -->
      <div class="national">
        <a @click="English" href="javascript:;">EN</a><br />
        <a @click="Chinese" href="javascript:;">中文(CH)</a>
      </div>
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
      input: '',
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    },
    English () {
      this.$i18n.locale = 'en'
    },
    Chinese () {
      this.$i18n.locale = 'zh'
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
      float: left;
      margin-left: 25px;
      // margin-right: 15px;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .nav {
      float: left;

      .input {
        width: 200px;
      }
      .demo {
        margin-top: 20px;
      }
    }
    .national {
      padding-top: 25px;
      a:hover {
        color: #409eff;
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
        height: 85px;
        background-color: #f9f9f9;
        padding-top: 25px;
        .item {
          font-size: 16px;
          font-weight: bold;
          margin-left: 60px;
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
      color: #cccccc;
      margin-top: 85px;
      margin-left: 250px;
    }
    .mobile {
      float: right;
      width: 300px;
      height: 50px;
      margin-top: 58px;
      margin-right: 50px;
    }
  }
}
</style>
