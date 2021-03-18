<template>
  <!-- 我的应用 -->
  <div class="detail">
    <div class="box">
      <!-- 消息提示 -->
      <div class="record">
        {{ $t('Youhave') }}&nbsp;
        <span style="color:#00aaf0;">{{ appList.length }}</span
        >&nbsp;
        {{ $t('Application') }}
      </div>
      <!-- 列表展示 -->
      <div class="list">
        <div class="lis">
          <ul style="padding: 0; margin: 0">
            <li v-for="(item, index) in appList" :key="index">
              <div class="img">
                <img :src="item.screenImg" class="tupian" />
              </div>
              <div class="write">
                <!-- 应用名称 -->
                <div class="name">{{ item.appName }}</div>
                <!-- 节点 -->
                <div class="jiedian">
                  {{ $t('node') }}&nbsp; {{ item.currentInstance }}/{{
                    item.maxInstance
                  }}
                </div>
                <div class="line"></div>
                <!-- 进入应用 -->
                <div class="button">
                  <el-button round @click="GoApp(item)">
                    {{ $t('into') }}</el-button
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectList } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
export default {
  name: 'userCenter',
  data () {
    return {
      islive: false,
      input: '',
      isShow: 1,
      classify: '全部',
      isHand: 6,
      appList: [],
      timer: null
    }
  },
  created () {
    this.GetList()
  },
  methods: {
    // 切换英文
    English () {
      this.$i18n.locale = 'en'
      this.classify = 'whole'
    },

    // 切换中文
    Chinese () {
      this.$i18n.locale = 'zh'
      this.classify = '全部'
    },

    // 定时器，每隔3秒更新一次数据
    // Get () {
    //   this.GetList()
    //   console.log('3秒更新一次我的应用')
    // },

    // 获取应用列表
    GetList () {
      getProjectList({
        userid: getuserid(),
        isHandle: 1
      })
        .then(res => {
          console.log(res)
          this.appList = res.data.data
        })
        .catch(err => {
          console.log(err)
          // this.$message.error('请求失败')
        })
    },

    // 进入应用
    GoApp (e) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:52:23
       * @description: 获取应用信息
       */
      const { href } = this.$router.resolve({
        name: 'web_client',
        query: {
          appid: e.appid,
          locale: this.$i18n.locale
        }
      })
      window.open(href, '_blank')
    }
  },
  //  把定时器放在activated事件里，当清除定时后，
  // 下次再次进入当前路由的话，可以再次唤起定时器
  activated () {
    this.timer = setInterval(() => {
      this.GetList()
      console.log('3秒更新一次我的应用')
    }, 3000)
  },
  // 路由跳转清除定时
  beforeRouteLeave (to, from, next) {
    next()
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  width: 100%;
  height: 100%;
  .box {
    overflow: hidden;
    .record {
      margin-top: 20px;
      margin-bottom: 20px;
      margin-left: 30px;
      font-size: 16px;
    }
    .list {
      .lis {
        overflow: hidden;
        margin-left: 30px;
        // background-color: red;
        li {
          width: 350px;
          height: 340px;
          margin-right: 30px;
          margin-bottom: 110px;
          box-shadow: 0px 2px 13px 1px #ccc;
          float: left;
          list-style: none;
          box-sizing: border-box;
          overflow: hidden;
          .img {
            width: 350px;
            height: 200px;
            .tupian {
              width: 100%;
              height: 100%;
            }
          }
          .write {
            height: 140px;
            background-color: #fff;
            .name {
              margin-bottom: 10px;
              margin-left: 20px;
              margin-top: 10px;
              font-size: 18px;
              font-weight: bold;
            }
            .jiedian {
              margin-bottom: 15px;
              margin-left: 20px;
              font-size: 15px;
            }
            .line {
              height: 1px;
              background-color: #e9e9e9;
            }
            .button {
              text-align: center;
              margin-top: 10px;
              .el-button {
                vertical-align: middle;
                background-color: #fff;
                color: #00aafa;
                border-color: #00aafa;
              }
            }
          }
        }
      }
    }
  }
}
</style>
