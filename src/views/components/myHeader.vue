<template>
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
              <img
                src="../issue/touxiang.png"
                style="border-radius: 50%;margin-top: 2px;"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toUserCenter"
                >用户中心</el-dropdown-item
              >
              <el-dropdown-item @click.native="toLogin">退出</el-dropdown-item>
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
</template>

<script>
export default {
  methods: {
    English () {
      this.$i18n.locale = 'en'
      this.classify = 'whole'
    },
    Chinese () {
      this.$i18n.locale = 'zh'
      this.classify = '全部'
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
  color: #ff6600;
}
.header {
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
</style>
