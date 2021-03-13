<template>
  <!-- 我的应用 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>

    <!-- 主体内容 -->
    <div class="detail">
      <div class="container">
        <!-- 我的应用 -->
        <div class="content" v-show="isShow == 1">
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
    </div>

    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import { getProjectList } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
export default {
  components: { myHeader, MyFooter },
  name: 'userCenter',
  data () {
    return {
      islive: false,
      input: '',
      isShow: 1,
      classify: '全部',
      isHand: 6,
      appList: []
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
    Get () {
      this.GetList()
      console.log('3秒更新一次我的应用')
    },

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
  mounted () {
    this.timer = setInterval(this.Get, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(150px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
a {
  text-decoration: none;
  font-size: 17px;
  color: #000;
  font-family: PingFang SC;
}
a:hover {
  color: #409eff;
}
.detail {
  .container {
    background-color: #fff;
    // background-color: green;
    height: 961px;
    margin-bottom: 34px;
    .content {
      overflow: hidden;
      .record {
        margin-top: 30px;
        margin-bottom: 20px;
        margin-left: 20px;
      }
      .list {
        .lis {
          width: 1395px;
          overflow: hidden;
          margin-left: 25px;
          // background-color: red;
          li {
            width: 300px;
            height: 340px;
            margin-right: 30px;
            margin-bottom: 30px;
            box-shadow: 0px 2px 13px 1px #ccc;
            float: left;
            list-style: none;
            box-sizing: border-box;
            overflow: hidden;
            .img {
              width: 300px;
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
      table {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 50px;
        border-collapse: collapse;
        font-size: 17px;
        tr {
          height: 50px;
        }
        th {
          background-color: #fafafa;
        }
        td {
          background-color: #fff;
        }
      }
      table,
      th,
      td {
        border: 1px solid black;
        text-align: center;
      }
      .dropdown {
        width: 200px;
        height: 300px;
        float: left;
        margin-right: 100px;
        div {
          width: 100%;
          height: 50px;
          border-bottom: 1px solid #f2f2f2;
          line-height: 50px;

          margin-right: 50px;
          button:focus {
            background-color: #fff;
          }
          button {
            padding-left: 50px;
            height: 100%;
            width: 100%;
            border: none;
            outline: none;
            font-size: 17px;
            text-align: left;
            background-color: #f9f9f9;
          }
          button:hover {
            color: #41b19c;
            cursor: pointer;
          }
        }
      }
      .neirong {
        float: left;
        width: 1000px;
        // background-color: orange;
        .geren {
          float: left;
        }
        .xinxi {
          float: left;
        }
        table,
        th,
        td {
          border: 1px solid black;
          text-align: center;
        }
        table {
          width: 400px;
        }
        .el-input {
          width: 400px;
        }
        .dingdan {
          width: 100%;
        }
        .demo-table-expand {
          font-size: 0;
        }
        .demo-table-expand label {
          width: 90px;
          color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 50%;
        }
      }
      .xia {
        text-align: center;
        margin-bottom: 100px;
      }
    }
    .page {
      width: 550px;
      margin: 0 auto;
      margin-bottom: 40px;
    }
  }
}
</style>
