<template>
  <!-- 修改密码 -->
  <div class="box">

    <!-- 主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 导航菜单 -->
        <el-col :span="4">
          <el-menu
            :default-active="this.$route.path"
            router
            background-color="#007BAE"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ $t('accountManage') }}</span>
              </template>
              <el-menu-item index="/bill">
                <span slot="title">{{ $t('information') }}</span>
              </el-menu-item>
              <el-menu-item index="/code">
                <span slot="title">{{ $t('Authorization') }}</span> </el-menu-item
              ><el-menu-item index="/order">
                <span slot="title">{{ $t('Serviceorder') }}</span>
              </el-menu-item>
              <el-menu-item index="/changeCode">
                <span slot="title">{{ $t('ChangePassword') }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <div class="color"></div>
        <!-- 修改密码 -->
        <div class="neirong">
          <div class="title">
            修改密码
          </div>
          <template v-for="(b ,k) in inputData">
            <div class="message" v-bind:key="k+1">
              <div class="one">{{b.name}}:</div>
              <div v-if="b.type === 'button'" class="input">
                <el-input v-model="param[b.prop]" :placeholder="'请输入'+b.name">
                  <el-button
                    :disabled="timeHour"
                    style="padding-right:25px;color:#00AAF0;"
                    slot="suffix"
                    type="text"
                    @click="getCode">
                    <template v-if="timeHour">{{timeNuber}}</template>
                    <template v-if="!timeHour">发送验证码</template>
                  </el-button>
                </el-input>
              </div>
              <div v-else class="input">
                <el-input v-model="param[b.prop]" :placeholder="'请输入'+b.name"></el-input>
              </div>
            </div>
          </template>
          <div class="btn">
            <el-button  @click="revise" type="primary">修改</el-button>
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
import { getuserid } from '@/store/index.js'
import { sendMsgCode } from '@/api/my.js'

export default {
  components: {MyFooter},
  name: 'changeCode',
  data () {
    return {
      // ========= 参数 ==========
      timeHour: false, // 禁用获取验证码
      param: {}, // param
      timeNuber: 60, // 时间
      settimeNuber: null, // 定时器
      // ========= 表格参数 =========
      inputData: [
        { name: '原密码', prop: 'oldCode'},
        { name: '新密码', prop: 'newCode'},
        { name: '确认密码', prop: 'againnewCode'},
        { name: '手机号', prop: 'mobile'},
        { name: '验证码', prop: 'code', type: 'button'}
      ]
    }
  },
   watch: {
    timeNuber: function(newVal, oldVal) {
      if (newVal === 0) {
        clearInterval(this.settimeNuber)
        this.timeHour = !this.timeHour
      }
    }
  },
  created() {
    this.init() // 初始化
  },
  methods: {
    // ========= 初始化 =========
    init () {
      this.param = {
        oldCode: '', // 原密码
        newCode: '', // 新密码
        againnewCode: '', // 再次输入密码
        mobile: '', // 手机号
        code: '' // 验证码
      }
    },
    // ========= 发送验证码(修改密码) =========
    getCode () {
      let param = {
        mobile: this.getCookie('mobile'),
        msgType: 3
      }
      this.$common.openLoading('发送验证码中....')
      sendMsgCode(param).then(({data}) => {
        console.log('axios-获取验证码', data)
        this.$common.closeLoading()
        if (data.code === 0) {
          this.$message.success(data.message)
          this.timeHour = !this.timeHour
          // 开启倒计时
          this.settimeNuber = setInterval(()=>{
             this.timeNuber--
          }, 1000)
        }
      }).catch(err => {
        this.$message.error('获取失败')
      })
    },
    // ========= 修改密码 =========
    revise () {
      console.log(this.param, '参数')
      // 1.判断输入框是否为空
      let param = this.param
      const verify = {
        oldCode: '原密码',
        newCode: '新密码',
        againnewCode: '再次输入密码',
        mobile: '手机号',
        code: '验证码'
      }
      for (const k in verify) {
        const val = Array.isArray(param[k]) ? param[k][0] : param[k]
        if (!this.$common.noNull(val)) {
          this.$common.message('请输入' + verify[k], 'warning') // 提示信息
          return
        }
      }
      // 2.判断原密码是否正确
      // 3.确认两次输入新密码是否正确
      // console.log(this.getCookie('mobile'))
    },
    // 取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key)
        if (start !== -1) {
          start = start + key.length + 3
          var end = document.cookie.indexOf(',', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end-1))
        }
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 1037px;
    .content {
      overflow: hidden;
      ul.el-menu {
        min-height: 961px;
        /deep/ .el-submenu__title * {
          font-size: 17px;
        }
        /deep/ .el-menu-item {
          font-size: 17px;
        }
      }
      .color {
        width: 25px;
        height: 1037px;
        float: left;
        background-color: #f1f1f1;
      }
      .neirong {
        padding-left: 300px;
        height: 1037px;
        .title {
          height: 54px;
          line-height: 54px;
          margin-left: -40px;
          font-size: 22px;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;
        }
        .message {
          width: 660px;
          height: 46px;
          margin-bottom: 30px;
          .one {
            float: left;
            height: 46px;
            width: 80px;
            line-height: 46px;
            margin-right: 35px;
            margin-left: 56px;
          }
          .input {
            float: left;
          }
          /deep/ .el-input__inner {
            width: 460px;
            height: 46px;
          }
        }
        .btn {
          margin-left: 300px;
          /deep/ .el-button--primary {
            width: 140px;
            height: 40px;
            background-color: #00aaf0;
          }
        }
      }
    }
  }
}
</style>
