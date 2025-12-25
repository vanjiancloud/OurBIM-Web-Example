<template>
  <div style="min-height: 100vh;background-color: #fff;" v-if="!isAutoLogging">
    <div class="mobile_top_bg" style="background: #fff;" v-if="mobile">
      <img src="./mobile_bg.png" alt="" style="width: 100%;" />
    </div>
    <div :class="mobile ? 'phone-container' : 'login-container'">
      <div class="picture" v-if="!mobile">
        <img src="./img.png" alt="" />
      </div>
      <div class="right">
        <div class="login-form-wrap">
          <!-- .logo区域 -->
          <div class="login-head">
            <a href="http://www.ourbim.com">
              <i class="el-icon-arrow-left"></i>
            </a>
            <div class="logo">
              <img src="./logo.png" alt="" />
            </div>
          </div>
          <!-- 登录的不同状态 -->
          <div class="state">
            <span @click="isshow = 0" :class="{ color: isshow == 0 }">
              <i>账号登录</i>
            </span>
            <span @click="isshow = 1" :class="{ color: isshow == 1 }">
              <i>验证码登录</i>
            </span>
          </div>
          <!-- 邮箱登录的表单 -->
          <el-form :rules="rules" :model="form" ref="form" class="login-form" v-show="isshow == 0">
            <!--  邮箱密码通过双向绑定获取 -->
            <!-- 邮箱 -->
            <el-form-item prop="loginName">
              <div class="fonts">账号</div>
              <el-input v-model="form.loginName" placeholder="请输入手机号/邮箱" @input="InputPassword">
                <i slot="prefix" class="el-input__icon el-icon-message"></i>
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <div class="fonts">密码</div>
              <el-input v-model="form.password" placeholder="请输入登录密码" type="password" show-password>
                <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="fonts">选择版本：</div>
              <el-radio-group v-model="version" @change="changeVersion">
                <el-radio :label="2">OurBIM 2.0</el-radio>
                <el-radio :label="3">OurBIM 3.0</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 勾选框 -->
            <el-form-item prop="isAgree">
              <el-checkbox class="checkbox" label="记住密码" name="type" v-model="form.isAgree"></el-checkbox>
              <span @click="changePassword" class="titles">忘记密码?</span>
              <span @click="register" class="titles">注册新用户</span>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button @click="emailLogin" type="primary" class="login-btn">
                {{ logIn }}
                <i class="el-icon-loading" v-if="isLoading"></i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <!-- <el-popover placement="top-start" width="200" trigger="hover">
                <el-button slot="reference" class="login-btn2">
                  {{ wxLogIn }}
                </el-button>
                <img src="./wxlogin.jpg" style="height: 180px;">
              </el-popover> -->
              <el-tooltip placement="top" effect="light" popper-class="custom-tooltip-wxlogin">
                <div slot="content"><img src="./wxlogin.jpg" style="height: 180px;"></div>
                <el-button class="login-btn2">
                  {{ wxLogIn }}
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>

          <!-- 手机登录的表单 -->
          <el-form :rules="rules" :model="mobForm" ref="mobForm" class="login-form" v-show="isshow == 1">
            <!--  手机号验证码通过双向绑定获取里面的值 -->
            <!-- 手机号 -->
            <el-form-item prop="mobile">
              <div class="fonts">账号</div>
              <el-input v-model="mobForm.mobile" placeholder="请输入邮箱或手机号" @input="InputPassword">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="code">
              <div class="fonts">验证码</div>
              <el-input v-model="mobForm.code" placeholder="请输入短信/邮箱验证码">
                <!-- 验证码按钮 -->
                <el-button slot="suffix" class="code" :disabled="isSend" @click="getVerification" type="text">{{ btnMes
                }}</el-button>
                <i slot="prefix" class="el-input__icon el-icon-s-comment"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="fonts">选择版本：</div>
              <el-radio-group v-model="version" @change="changeVersion">
                <el-radio :label="2">OurBIM 2.0</el-radio>
                <el-radio :label="3">OurBIM 3.0</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 勾选框 -->
            <el-form-item prop="isAgree">
              <el-checkbox class="checkbox" label="记住手机号" name="type" v-model="mobForm.checkbox"></el-checkbox>
              <span @click="changePassword" class="titles">忘记密码?</span>
              <span @click="register" class="titles">注册新用户</span>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button @click="Mobilelogin" type="primary" class="login-btn">
                {{ logIn }}
                <i class="el-icon-loading" v-if="isLoading"></i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-tooltip placement="top" effect="light" popper-class="custom-tooltip-wxlogin">
                <div slot="content"><img src="./wxlogin.jpg" style="height: 180px;"></div>
                <el-button class="login-btn2">
                  {{ wxLogIn }}
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="wenzi" v-if="!mobile">
        Copyright © 2025 www.OurBIM.com, <br />
        All Rights Reserved.
      </div>
    </div>
  </div>
  <div v-else
    style="min-height: 100vh;background-color: #fff;display: flex;align-items: center;justify-content: center;">
    <div style="text-align: center;">
      <i class="el-icon-loading" style="font-size: 48px;"></i>
      <p style="margin-top: 20px;">正在自动登录...</p>
    </div>
  </div>
</template>

<script>
import { sendMsgCode, sendMsgEmailCode, login, loginMobile, loginEmailCode, loginByToken } from "@/api/my.js";
import { setuserid } from "@/store/index.js";
import { Setuserid } from "@/store/index.js";
import { setemail, getemail, delemail } from "@/store/index.js";
import { setpassword, getpassword, delpassword } from "@/store/index.js";
import { setmobile, getmobile, delmobile } from "@/store/index.js";
import { setToken } from '@/utils/auth';
import { encryption } from '@/utils/util.js';
import { encrypt, decrypt } from '@/utils/jsencrypt.js'

const phoneReg = /^1[3-9]\d{9}$/;
const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default {
  name: "login",
  data() {
    return {
      isSend: false, // 是否显示
      delay: 60, // 倒计时
      interId: null, // 定时器
      btnMes: "获取验证码", // 按钮的文本
      isshow: 0, // 切换登录类别
      isLoading: false, // 是否正在登录,默认隐藏
      logIn: "登录",
      wxLogIn: '微信小程序登录',
      // 账号登录表单
      form: {
        isAgree: false, // 复选框的状态
        password: "",
        loginName: "",
      },
      // 手机登录表单
      mobForm: {
        mobile: "",
        code: "",
        msgType: "2", // 验证状态
        checkbox: false, // 复选框的状态
      },
      // 定义验证规则rules
      rules: {
        loginName: [
          {
            required: true,
            message: "请输入邮箱或手机号",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (phoneReg.test(value) || emailReg.test(value)) {
                callback(); // 校验通过
              } else {
                callback(new Error("请输入正确的手机号或邮箱"));
              }
            },
            trigger: "blur",
          },
          // {
          //   // pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          //pattern: /^([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(1[0-9]{1}[0-9]{9})$/,
          //   message: '邮箱或手机号不正确',
          //   trigger: 'blur'
          // }
        ],
        mobile: [
          { required: true, message: "请输入手机号或邮箱", trigger: "blur" },
          //   {
          //     pattern: /^1[0-9]{1}[0-9]{9}$/,
          //     message: "请输入正确的11位手机号",
          //     trigger: "blur",
          //   },
          {
            validator: (rule, value, callback) => {
              if (phoneReg.test(value) || emailReg.test(value)) {
                callback(); // 校验通过
              } else {
                callback(new Error("请输入正确的手机号（11位数字）或邮箱（如：user@example.com）"));
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码,字符为英文&数字&英文符号，位数6-20",
            trigger: "blur",
          },
          {
            pattern: /^[\w.~!@#$%^&_+><]{6,20}$/,
            message: "请输入密码,字符为英文&数字&英文符号，位数6-20",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
          {
            pattern: /^\d{4}|\d{6}$/,
            message: "您输入的验证码不正确",
            trigger: "blur",
          },
        ],
      },
      version: 3,
      // mobile: null,
      windowWidth: window.innerWidth,
      isAutoLogging: false,
      authToken: '',
    };
  },
  computed: {
    mobile() {
      // return this.windowWidth < 768 ? '移动端' : 'PC 端';
      return this.windowWidth < 768 || this.isMobile();
    }
  },
  mounted() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
    // window.onresize = () => {
    //   this.mobile = this.isMobile();
    // };
    // window.addEventListener('resize', function () {
    //   this.mobile = this.isMobile();
    // });
  },
  beforeDestroy() {
    // 移除监听事件，防止内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  created() {
    document.onkeydown = (e) => {
      if (e.key == "Enter") {
        this.emailLogin();
        this.Mobilelogin();
      }
    };
    // 记住账号
    if (localStorage.getItem("email")) {
      this.form.loginName = getemail();
      this.form.isAgree = true;
    } else if (localStorage.getItem("email") === null) {
      this.form.loginName = "";
    }

    // 记住密码
    if (localStorage.getItem("password")) {
      this.form.password = getpassword();
      this.form.isAgree = true;
    } else if (localStorage.getItem("password") === null) {
      this.form.password = "";
    }

    // 记住手机号
    if (localStorage.getItem("mobile")) {
      this.mobForm.mobile = getmobile();
      this.mobForm.checkbox = true;
    } else if (localStorage.getItem("mobile") === null) {
      this.mobForm.mobile = "";
    }

    const authToken = this.$route.query.auth_token;
    if (authToken) {
      this.authToken = authToken;
      this.verifyExternalToken(authToken);
    }

  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    changeVersion(e) {
      if (e === 2) {
        window.location.href = `https://www.ourbim.com/project_center/`
      } else {
        window.location.href = `https://www.ourbim.com/v3/`
      }
    },
    InputPassword() {
      /**
       * @Author: zk
       * @Date: 2021-06-11 10:02:25
       * @description: 输入账号时重置密码
       */
      if (this.isshow === 0) {
        if (this.form.password) {
          this.form.password = "";
        }
      } else if (this.isshow === 1) {
        if (this.mobForm.code) {
          this.mobForm.code = "";
        }
      }
    },
    // 注册新用户
    register() {
      this.$router.push("/register");
    },
    // 忘记密码
    changePassword() {
      this.$router.push("/changePassword");
    },
    // 点击账号登录
    emailLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.doLogin()
        }
      });
    },
    // 点击手机登录
    Mobilelogin() {
      this.$refs.mobForm.validate((valid) => {
        if (valid) {
          const isPhone = phoneReg.test(this.mobForm.mobile);
          const isEmail = emailReg.test(this.mobForm.mobile);
          if (isPhone) {
            this.mobLogin()
          }
          if (isEmail) {
            this.mobLoginEmail()
          }
        }
      });
    },
    // 外部第三方登录验证
    verifyExternalToken(token) {
      try {
        loginByToken({ token }).then(res => {
          if (res.code === 0) {
            this.isLoading = false;
            this.logIn = "登录";
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            setToken(res.data.token)
            Setuserid(res.data.userid);
            this.goPage()
          } else {
            this.$message.error('系统认证失败，请手动登录');
          }
        })
      } catch (error) {
        this.$message.error('系统认证失败，请手动登录');
      }
    },
    // 账号登录接口
    doLogin() {
      const params = { loginName: this.form.loginName, password: this.form.password }
      const encryptionParams = encryption({
        data: params,
        param: ['password']
      })
      this.logIn = "登录中";
      this.isLoading = true;
      login(encryptionParams).then(res => {
        this.isLoading = false;
        this.logIn = "登录";
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        setToken(res.data.token)
        setemail(this.form.loginName);
        setpassword(this.form.password);
        Setuserid(res.data.userid);
        if (this.form.isAgree === false) {
          delemail();
          delpassword();
        }
        this.goPage()
      }).catch((err) => {
        this.logIn = "登录";
        this.isLoading = false;
      });
    },
    // 手机登录接口
    mobLogin() {
      this.logIn = "登录中";
      this.isLoading = true;
      loginMobile({ mobile: this.mobForm.mobile, code: this.mobForm.code }).then(res => {
        this.isLoading = false;
        this.logIn = "登录";
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        setToken(res.data.token)
        setuserid(res.data.userid);
        // 存储用户信息userid，到sessionStorage
        Setuserid(res.data.userid);
        setmobile(this.mobForm.mobile);
        if (this.mobForm.checkbox === false) {
          delmobile();
        }
        this.goPage()
      }).catch((err) => {
        this.logIn = "登录";
        this.isLoading = false;
      });
    },
    // 邮件验证码登录
    mobLoginEmail() {
      this.logIn = "登录中";
      this.isLoading = true;
      loginEmailCode({ loginName: this.mobForm.mobile, code: this.mobForm.code }).then(res => {
        this.isLoading = false;
        this.logIn = "登录";
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        setToken(res.data.token)
        setuserid(res.data.userid);
        // 存储用户信息userid，到sessionStorage
        Setuserid(res.data.userid);
        setmobile(this.mobForm.mobile);
        if (this.mobForm.checkbox === false) {
          delmobile();
        }
        this.goPage()
      }).catch((err) => {
        this.logIn = "登录";
        this.isLoading = false;
      });
    },
    goPage() {
      const href = window.location.href
      let oauthCallback = this.$common.getQueryString(href, 'oauth_callback')
      oauthCallback = decodeURIComponent(oauthCallback)
      this.$router.push({
        path: oauthCallback || "/",
        query: {
          ...(this.authToken && { auth_token: this.authToken }),
        }
      });
    },
    // 取cookie
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    },

    // 点击获取验证码
    getVerification() {
      this.$refs.mobForm.validateField("mobile", (codeError) => {
        // 验证通过把结构赋值写载这里
        if (!codeError) {
          const isPhone = phoneReg.test(this.mobForm.mobile);
          const isEmail = emailReg.test(this.mobForm.mobile);
          if (isPhone) {
            this.toGetCode();
          }
          if (isEmail) {
            this.toGetCodeEmail();
          }
        }
      });
    },
    // 获取验证码
    toGetCode() {
      this.isSend = true;
      this.btnMes = `正在发送验证码...`;
      sendMsgCode({
        mobile: this.mobForm.mobile,
        msgType: this.mobForm.msgType,
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("获取成功");
            // 开启定时器
            this.interId = setInterval(() => {
              this.delay--;
              this.btnMes = `${this.delay}S后继续`;
            }, 1000);
          } else if (res.data.code === 1) {
            this.$message.error("短信请求失败");
          } else {
            this.$message.error("短信请求失败，您的操作过于频繁，请稍后在试");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("获取失败");
        });
    },
    // 获取邮箱验证码
    toGetCodeEmail() {
      this.isSend = true;
      this.btnMes = `正在发送验证码...`;
      sendMsgEmailCode({
        email: this.mobForm.mobile,
        type: '1',
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("获取成功");
            // 开启定时器
            this.interId = setInterval(() => {
              this.delay--;
              this.btnMes = `${this.delay}S后继续`;
            }, 1000);
          } else if (res.data.code === 1) {
            this.$message.error("验证码请求失败");
          } else {
            this.$message.error("验证码请求失败，您的操作过于频繁，请稍后在试");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("获取失败");
        });
    },
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
      //路由跳转时账号表单清空判断
      if (this.form.isAgree === false) {
        this.form.loginName = "";
        this.form.password = "";
      }
      //路由跳转时手机表单清空判断
      if (this.mobForm.checkbox === false) {
        this.mobForm.mobile = "";
        this.mobForm.code = "";
      } else if (this.mobForm.checkbox === true) {
        this.mobForm.code = "";
      }
    },
    // 倒计时重置
    delay: function (newVal, oldVal) {
      if (oldVal === 0) {
        clearInterval(this.interId);
        this.btnMes = "获取验证码";
        (this.delay = 60), // 倒计时
          (this.isSend = false);
      }
    },
  },
};
</script>
<style lang="less">
.custom-tooltip-wxlogin {
  &.el-tooltip__popper {
    // border-color: rgba(0, 0, 0, .2);
    border: 0;
    box-shadow: 0px 2px 7px 0px rgba(219, 219, 219, 1);
  }

  &.el-tooltip__popper[x-placement^="top"] .popper__arrow {
    border: 0;
    // border-top-color: rgba(0, 0, 0, .2);
  }
}
</style>
<style scoped lang="less">
// 书写样式铺满整
.login-container {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url(./bg.png);
  background-size: 100% 100%;
  overflow: hidden;

  .picture {
    height: 100vh;
    width: 40vw;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    background-color: #fff;
    // background-color: red;
    display: flex;
    // justify-content: center;
    align-items: center;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);

    .login-form-wrap {
      max-width: 500px;
      min-height: 450px;

      // background-color: red;
      // 错误提示
      /deep/ .el-form-item__error {
        position: absolute;
        left: 0;
        bottom: 0;
      }

      // 输入框
      /deep/ .el-input__inner {
        padding-left: 60px;
        color: #000;
      }

      /deep/ .el-checkbox__label {
        font-size: 16px;
        margin-top: 10px;
        // color: #00aaf0;
      }

      /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #00aaf0;
      }

      /deep/ .el-checkbox__inner {
        width: 20px;
        height: 20px;
        border-color: #00aaf0;
      }

      // 输入框内图标
      /deep/ .el-input__prefix {
        font-size: 20px;
        line-height: 40px;
        margin-left: 16px;
      }

      /deep/ .el-checkbox__inner::after {
        width: 9px;
        height: 13px;
        color: #00aaf0;
      }

      .login-head {
        width: 100%;
        height: 15%;
        margin-top: 10px;

        .logo {
          // width: 185px;
          width: 50%;
          height: 100%;
          margin-top: -55px;
          margin-left: 125px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .el-icon-arrow-left {
          color: #00aaf0;
          font-size: 60px;
        }
      }

      .state {
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
        cursor: pointer;

        i {
          margin-left: -30px;
          font-style: normal;
        }

        .color {
          color: #00aaf0;
          // background-color: blue;
          border-bottom: 1px solid #00aaf0;
          border-width: 4px;
        }

        span {
          border-bottom: 1px solid #e9e9e9;
          border-width: 4px;
          padding: 0px 45px 5px 80px;
          font-size: 18px;
        }
      }

      .login-form {
        padding: 0 20px;


        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 15px;
        }

        .code {
          margin-top: 3px;
          font-size: 12px;
        }

        .fonts {
          font-size: 16px;
        }

        .titles {
          color: #00aaf0;
          font-size: 16px;
          margin-right: 20px;
        }

        .login-btn {
          // width: 400px;
          width: 95%;
          height: 50px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #00aaf0;
          font-size: 18px;
        }

        .login-btn2 {
          width: 95%;
          height: 50px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #fff;
          border-color: #00aaf0;
          color: #00aaf0;
          font-size: 18px;


        }



        span {
          padding-left: 20px;
          float: right;
          color: #00aaf0;
          display: inline;
          cursor: pointer;
        }
      }
    }
  }

  .wenzi {
    width: 340px;
    position: fixed;
    bottom: 15px;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}

.phone-container {
  // min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  // background-image: url(./mobile_bg.png);
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-size: 100% 100%;
  overflow: hidden;

  .right {
    background-color: #fff;
    // background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    // border-radius: 25px;
    // box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);

    .login-form-wrap {
      // max-width: 500px;
      // min-height: 450px;

      // background-color: red;
      // 错误提示
      /deep/ .el-form-item__error {
        position: absolute;
        left: 0;
        bottom: 0;
      }

      // 输入框
      /deep/ .el-input__inner {
        padding-left: 60px;
        color: #000;
      }

      /deep/ .el-checkbox__label {
        font-size: 16px;
        // color: #00aaf0;
      }

      /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #00aaf0;
      }

      /deep/ .el-checkbox__inner {
        width: 20px;
        height: 20px;
        border-color: #00aaf0;
      }

      // 输入框内图标
      /deep/ .el-input__prefix {
        font-size: 20px;
        line-height: 40px;
        margin-left: 16px;
      }

      /deep/ .el-checkbox__inner::after {
        width: 9px;
        height: 13px;
        color: #00aaf0;
      }

      .login-head {
        // width: 100%;
        // height: 15%;
        // margin-top: 100px;

        .logo {
          text-align: center;
          // width: 185px;
          /*        width: 50%;
          height: 100%; */
          // margin-top: -55px;
          // margin-left: 125px;

          img {
            width: 140px;
            // height: 100%;
          }
        }

        .el-icon-arrow-left {
          color: #00aaf0;
          font-size: 60px;
        }
      }

      .state {
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
        cursor: pointer;

        i {
          margin-left: -30px;
          font-style: normal;
        }

        .color {
          color: #00aaf0;
          // background-color: blue;
          border-bottom: 1px solid #00aaf0;
          border-width: 4px;
        }

        span {
          border-bottom: 1px solid #e9e9e9;
          border-width: 4px;
          padding: 0px 45px 5px 80px;
          font-size: 18px;
        }
      }

      .login-form {
        padding: 0 20px;


        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 15px;
        }

        .code {
          margin-top: 3px;
          font-size: 12px;
        }

        .fonts {
          font-size: 16px;
        }

        .titles {
          color: #00aaf0;
          font-size: 16px;
          margin-right: 20px;
        }

        .login-btn {
          // width: 400px;
          width: 95%;
          height: 50px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #00aaf0;
          font-size: 18px;
        }

        .login-btn2 {
          width: 95%;
          height: 50px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #fff;
          border-color: #00aaf0;
          color: #00aaf0;
          font-size: 18px;
        }

        span {
          padding-left: 20px;
          float: right;
          color: #00aaf0;
          display: inline;
          cursor: pointer;
        }
      }
    }
  }

  .wenzi {
    width: 340px;
    position: fixed;
    bottom: 15px;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}
</style>