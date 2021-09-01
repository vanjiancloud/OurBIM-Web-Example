<template>
  <div class="box">
    <div class="picture">
      <img src="./img/img.png" alt="" />
    </div>
    <!-- 注册页面 -->
    <div class="right">
      <div class="zhuce">
        <!-- 头部区域 -->
        <div class="header">
          <a @click="GoBack"> <i class="el-icon-arrow-left"></i></a>
          <div class="logo">
            <img src="./img/logo.png" alt="" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="body">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
            <!-- 邮箱 -->
            <el-form-item label="" prop="email">
              <el-input
                v-model="ruleForm.email"
                placeholder="请输入邮箱"
                @blur="emailBlur"
              >
                <i slot="prefix" class="el-icon-message"></i>
              </el-input>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item label="" prop="mobile">
              <el-input
                v-model="ruleForm.mobile"
                placeholder="请输入手机号码"
                @blur="mobileBlur"
              >
                <i slot="prefix" class="el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label="" prop="code">
              <el-input v-model="ruleForm.code" placeholder="请输入短信验证码">
                <el-button
                  class="code"
                  slot="suffix"
                  type="text"
                  :disabled="isSend"
                  @click="getcode"
                >
                  {{ btnMes }}
                </el-button>
                <i slot="prefix" class="el-icon-s-comment"></i>
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="" prop="password">
              <el-input
                show-password
                v-model="ruleForm.password"
                placeholder="请设置6至20位登录密码"
              >
                <i slot="prefix" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <!-- 再次输入密码 -->
            <el-form-item label="" prop="newPassword">
              <el-input
                show-password
                v-model="ruleForm.newPassword"
                placeholder="请再次输入登录密码"
              >
                <i slot="prefix" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <!-- 勾选状态 -->
            <el-form-item label="" prop="checked" class="check">
              <el-checkbox v-model="ruleForm.checked">我同意</el-checkbox>
              <a
                class="link"
                @click="toxieyi"
                style="text-decoration: none; font-size: 16px"
              >
                《OurBIM用户服务协议》
              </a>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <div class="footer">
            <div>
              <el-button
                type="primary"
                class="btn"
                @click="register"
                :loading="isLoading"
                >注册</el-button
              >
            </div>
            <div class="footer-size">
              <el-button type="text" @click="toLogoin"
                >已有账号，立即登录</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, <br />All Rights Reserved.
    </div>
  </div>
</template>

<script>
import {
  getRegister,
  repeatMobile,
  repeatEmail,
  sendMsgCode,
} from "@/api/my.js";
export default {
  name: "register",
  data() {
    return {
      isSend: false, // 是否显示
      isLoading: false, // 是否正在登陆
      delay: 60, // 倒计时
      interId: null, // 定时器
      btnMes: "获取验证码", // 按钮的文本
      // 验证表单数据
      ruleForm: {
        sex: "1",
        email: "",
        mobile: "",
        name: "",
        company: "",
        code: "",
        password: "",
        newPassword: "",
        msgType: "1",
        checked: false, // 复选框的状态
        activeUrl: "window.location.href",
      },
      // 验证规则
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[0-9]{1}[0-9]{9}$/,
            message: "请输入正确的11位手机号",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入正确邮箱,字符为英文&数字，结尾必须有“@xx.com/cn”",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "请输入正确的邮箱",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请设置密码,字符为英文&数字&英文符号，位数6-20",
            trigger: "blur",
          },
          {
            pattern: /^[\w.]{6,20}$/,
            message: "请设置密码,字符为英文&数字&英文符号，位数6-20",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请再次输入您设置的密码",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
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
        name: [
          {
            required: true,
            message: "请输入真实姓名，2-4个汉字或2-8个英文字母，不支持混编",
            trigger: "blur",
          },
          {
            pattern: /^[\u4e00-\u9fa5]{2,4}$|^[\dA-Za-z_]{2,8}$/,
            message: "请输入真实姓名，2-4个汉字或2-8个英文字母，不支持混编",
            trigger: "blur",
          },
        ],
        company: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur",
          },
        ],
        checked: [
          {
            // 自定义规则
            validator: function (rule, value, callback) {
              if (value) {
                // 选中
                callback();
              } else {
                // 用户不同意
                callback(new Error("请先同意服务协议"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
    delay: function (newVal, oldVal) {
      if (oldVal === 0) {
        clearInterval(this.interId);
        this.btnMes = "获取验证码";
        this.isSend = false;
        this.delay = 60; // 倒计时
      }
    },
  },
  methods: {
    GoBack() {
      /**
       * @Author: zk
       * @Date: 2021-07-06 17:48:43
       * @description: 返回登录页面
       */
      let source = this.getUrlKey("source");
      if (source === null) {
        window.location.href = "http://www.ourbim.com";
      } else if (source === 'docs') {
        window.location.href = "http://yun.vanjian.com/Docs/#/login";
      } else if (source === 'beta_docs') {
        window.location.href = "http://yun.vanjian.com/DocsBeta/#/login";
      }
    },
    getUrlKey(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    // 点击注册校验
    register() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.doRegister();
        }
      });
    },
    // 返回登录页
    toReturn() {
      this.$router.push("../../login");
    },
    toLogoin() {
      let source = this.getUrlKey("source");
      if (source === null) {
        this.$router.push("../login");
      } else if (source === 'docs') {
        window.location.href = "http://yun.vanjian.com/Docs/#/login";
      } else if (source === 'beta_docs') {
        window.location.href = "http://yun.vanjian.com/DocsBeta/#/login";
      }
    },
    // 点击注册
    doRegister() {
      getRegister({
        email: this.ruleForm.email,
        name: this.ruleForm.name,
        company: this.ruleForm.company,
        sex: this.ruleForm.sex,
        mobile: this.ruleForm.mobile,
        code: this.ruleForm.code,
        password: this.ruleForm.password,
        activeUrl: window.location.href.split('?')[0],
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("注册成功");
            this.$router.push("/registerSucceed");
          } else if (res.data.code === 1) {
            this.$message.warning(res.data.message);
          } else if (res.data.code === 2) {
            this.$message.error(res.data.message);
          } else if (res.data.code === 3) {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("注册失败，请检查网络或稍后重试");
        });
    },
    // 点击跳转用户协议
    toxieyi() {
      this.$router.push("/protocol");
    },

    // 点击获取验证码
    getcode() {
      this.$refs.ruleForm.validateField("mobile", (codeError) => {
        if (!codeError) {
          this.toGetCode();
        }
      });
    },
    // 获取验证码
    toGetCode() {
      // 禁用发送验证码按钮
      this.isSend = true;
      this.btnMes = `发送验证码中...`;
      sendMsgCode({
        mobile: this.ruleForm.mobile,
        msgType: this.ruleForm.msgType,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success("获取成功");
            // 监听定时器
            this.interId = setInterval(() => {
              this.btnMes = `${this.delay}S后继续`;
              this.delay--;
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
    // 失去焦点获取手机号
    mobileBlur() {
      this.$refs.ruleForm.validateField("mobile", (mobileError) => {
        if (!mobileError) {
          this.getmobileBlur();
        }
      });
    },
    getmobileBlur() {
      repeatMobile({
        mobile: this.ruleForm.mobile,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
          } else if (res.data.code === 1) {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("校验失败，请检查网络");
        });
    },
    // 失去焦点获取邮箱
    emailBlur() {
      this.$refs.ruleForm.validateField("email", (emailError) => {
        if (!emailError) {
          this.getemailBlur();
        }
      });
    },
    getemailBlur() {
      repeatEmail({
        email: this.ruleForm.email,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
          } else if (res.data.code === 1) {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("校验失败，请检查网络");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url(./img/bg.png);
  background-size: cover;
  background-size: 100% 100%;
  .picture {
    height: 100vh;
    width: 40vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: 28vw;
    // height: 85vh;
    padding: 2vh;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .zhuce {
      height: 100%;
      // background-color: red;
      .header {
        width: 100%;
        height: 7vh;
        display: flex;
        align-items: center;
        // background-color: green;
        .logo {
          width: 50%;
          height: 100%;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .el-icon-arrow-left {
          color: #00aaf0;
          font-size: 8vh;
        }
      }
      .body {
        // overflow-y:scroll;
        padding-top: 2vh;
        width: 100%;
        height: 80%;
        // background-color: green;
        .news {
          font-size: 2vh;
        }
        // 单选框
        .el-radio {
          margin-left: 15%;
          img {
            width: 3vw;
            height: 5vh;
          }
          /deep/ .el-radio__input {
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
        // 整体校验站位和框内图标位置
        /deep/ .el-form-item__content {
          line-height: 0px;
        }
        // 输入框
        /deep/ .el-input__inner {
          font-size: 16px;
          width: 100%;
          padding-left: 70px;
          background-color: #f4f4f4;
          color: #000;
        }
        // 输入框名字字段字数限制的背景色
        /deep/ .el-input .el-input__count .el-input__count-inner {
          background-color: #f4f4f4;
        }
        /deep/ .el-checkbox__label {
          font-size: 16px;
          margin-top: 10px;
        }
        // 我同意选中框
        /deep/ .el-checkbox__inner {
          width: 16px;
          height: 16px;
        }
        // 输入框内图标
        /deep/ .el-input__prefix {
          font-size: 16px;
          line-height: 4vh;
          margin: 0 20px;
        }
        // 对钩
        /deep/ .el-checkbox__inner::after {
          width: 6px;
          height: 9px;
        }
        .link {
          cursor: pointer;
        }
        .code {
          margin-top: -0.1vh;
          font-size: 12px;
        }
        .check {
          margin-top: -15px;
          color: #00aaf0;
          font-size: 14px;
        }
      }
      .footer {
        // height: 20vh;
        // background-color: red;
        .btn {
          height: 5vh;
          width: 100%;
          font-size: 2.5vh;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          background-color: #00aaf0;
        }
        .footer-size {
          text-align: center;
          .el-button {
            color: #00aaf0;
            font-size: 2vh;
          }
        }
      }
    }
  }
  .wenzi {
    width: 340px;
    position: fixed;
    bottom: 21px;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}
</style>
