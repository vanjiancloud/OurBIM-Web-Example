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
            <div class="left">
              {{ $t('Youhave') }}&nbsp;
              <span style="color:#00aaf0;">{{ appList.length }}</span
              >&nbsp;
              {{ $t('Application') }}
            </div>
          </div>
          <!-- 列表展示 -->
          <div class="list">
            <div class="lis">
              <ul style="padding: 0; margin: 0">
                <li
                  v-for="(item, index) in appList"
                  :key="index"
                  @click="GoApp(item)"
                >
                  <div class="img">
                    <img :src="item.screenImg" class="tupian" />
                  </div>
                  <div class="write">
                    <!-- 应用名称 -->
                    <h3>{{ item.appName }}</h3>
                    <!-- 节点 -->
                    {{ $t('node') }}&nbsp; {{ item.currentInstance }}/{{
                      item.maxInstance
                    }}
                    <!-- 进入应用 -->
                    <div class="button">
                      <el-button plain round>{{ $t('into') }}</el-button>
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
import { getProjectList, getModelInfo } from '@/api/my.js'

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

    // 读取cookie中userid数据
    getCookie: function (userid) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(userid + '=')
        if (start !== -1) {
          start = start + userid.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      console.log()
      return ''
    },

    // 获取应用列表
    GetList () {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:43:22
       * @description: 获取应用列表
       */
      getProjectList({
        userid: this.getCookie('userid'),
        isHandle: 1
      })
        .then(res => {
          console.log(res)
          this.appList = res.data.data
        })
        .catch(err => {
          this.$message.error('请求失败')
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
              name: "web_client",
              query: {
                appid: e.appid,
              },
            });
            window.open(href, "_blank");
    },
  },
};
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
    margin-bottom: 100px;
    .content {
      margin-left: 41px;
      overflow: hidden;
      .record {
        width: 100%;
        height: 40px;
        margin-top: 38px;
        position: relative;
        .left {
          height: 40px;
        }
        .right {
          position: absolute;
          right: 20px;
          top: 0px;
        }
      }
      .list {
        .lis {
          width: 1379px;
          overflow: hidden;
          li {
            width: 310px;
            height: 345px;
            margin-right: 30px;
            margin-bottom: 34px;
            float: left;
            list-style: none;
            box-sizing: border-box;
            overflow: hidden;
            .img {
              width: 310px;
              height: 200px;
              .tupian {
                width: 100%;
                height: 100%;
              }
            }
            .write {
              height: 145px;
              background-color: #f1f1f1;
              padding-top: 20px;
              padding-left: 20px;
              h3 {
                margin-bottom: 10px;
              }
              .button {
                margin-left: 80px;
                margin-top: 10px;
                .el-button {
                  background-color: #f1f1f1;
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
