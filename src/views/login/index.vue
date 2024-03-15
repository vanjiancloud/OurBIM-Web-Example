<template>
    <div class="login-container">
        <div class="picture">
            <img src="./img.png" alt="" />
        </div>
        <div class="right">
            <div class="login-form-wrap">
                <!-- .logo区域 -->
                <div class="logo">
                    <img src="./logo.png" alt="" />
                </div>
                <!-- 登录的不同状态 -->
                <div class="state">账号登录</div>
                <!-- 邮箱登录的表单 -->
                <el-form :rules="rules" :model="form" ref="form" class="login-form">
                    <!-- 邮箱 -->
                    <el-form-item prop="loginName">
                        <div class="fonts">账号</div>
                        <el-input v-model="form.loginName" placeholder="请输入邮箱或手机号">
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
                    <!-- 勾选框 -->
                    <el-form-item prop="isAgree">
                        <el-checkbox class="checkbox" label="记住密码" v-model="form.isAgree"></el-checkbox>
                    </el-form-item>
                    <!-- 登录按钮 -->
                    <el-form-item>
                        <el-button @click="emailLogin" type="primary" class="login-btn">
                            {{ logIn }}
                            <i class="el-icon-loading" v-if="isLoading"></i>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="Copyright">
            Copyright © 2023 www.OurBIM.com, <br />
            All Rights Reserved.
        </div>
    </div>
</template>

<script>
import { login } from '@/api/my.js'
import { Setuserid } from '@/store/index.js'
import { setemail, getemail, delemail } from '@/store/index.js'
import { setpassword, getpassword, delpassword } from '@/store/index.js'

export default {
    name: 'login',
    data() {
        return {
            isLoading: false, // 是否正在登录,默认隐藏
            logIn: '登录',
            // 账号登录表单
            form: {
                isAgree: false, // 复选框的状态
                password: '',
                loginName: ''
            },
            // 定义验证规则rules
            rules: {
                loginName: [
                    {
                        required: true,
                        message: '请输入邮箱或手机号',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码,字符为英文&数字&英文符号，位数6-20',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[\w.~!@#$%^&*_?+><]{6,20}$/,
                        message: '请输入密码,字符为英文&数字&英文符号，位数6-20',
                        trigger: 'blur'
                    }
                ],
            },
        }
    },
    created() {
        // 记住账号
        if (localStorage.getItem('email')) {
            this.form.loginName = getemail()
            this.form.isAgree = true
        } else if (localStorage.getItem('email') === null) {
            this.form.loginName = ''
        }

        // 记住密码
        if (localStorage.getItem('password')) {
            this.form.password = getpassword()
            this.form.isAgree = true
        } else if (localStorage.getItem('password') === null) {
            this.form.password = ''
        }
    },
    methods: {
        // 点击账号登录
        emailLogin() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.doLogin()
                }
            })
        },
        // 账号登录接口
        doLogin() {
            this.logIn = '登录中'
            this.isLoading = true
            login({ loginName: this.form.loginName, password: this.form.password })
                .then(res => {
                    this.isLoading = false
                    this.logIn = '登录'
                    this.$store.commit("user/SET_USERID", res.data.userid);
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data))
                    setemail(this.form.loginName)
                    setpassword(this.form.password)
                    Setuserid(res.data.userid)
                    if (!this.form.isAgree) {
                        delemail()
                        delpassword()
                    }
                    setTimeout(()=>{
                        this.$router.push('/')
                    },200)
                })
                .catch(err => {
                    this.logIn = '登录'
                    this.isLoading = false
                })
        },
        // 取cookie
        getCookie: function(key) {
            if (document.cookie.length > 0) {
                var start = document.cookie.indexOf(key + '=')
                if (start !== -1) {
                    start = start + key.length + 1
                    var end = document.cookie.indexOf(';', start)
                    if (end === -1) end = document.cookie.length
                    return unescape(document.cookie.substring(start, end))
                }
            }
            return ''
        },
        // 存cookie
        setCookie: function(cName, value, expiredays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie =
                cName + '=' + decodeURIComponent(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
        }
    },
    watch: {}
}
</script>

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
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 25px;
        box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
        .login-form-wrap {
            max-width: 500px;
            min-width: 400px;
            // 输入框
            /deep/ .el-input__inner {
                padding-left: 60px;
                color: #000;
            }
            /deep/ .el-checkbox__label {
                font-size: 16px;
            }
            /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
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
                width: 8px;
                height: 10px;
                color: #00aaf0;
            }
            .logo {
                width: 160px;
                height: auto;
                margin: 20px auto 0 auto;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .state {
                text-align: center;
                margin-bottom: 20px;
                margin-top: 20px;
                position: relative;
                padding-bottom: 10px;
                color: #00aaf0;
                font-size: 18px;
                &::after{
                   content: '';
                   position: absolute;
                   bottom: 0;
                   left: 0;
                   right: 0;
                   margin: 0 auto;
                   width: 150px;
                   height: 4px;
                   background: #00aaf0;
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
                .login-btn {
                    width: 95%;
                    height: 50px;
                    font-size: 25px;
                    border-radius: 30px;
                    background-color: #00aaf0;
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
    .Copyright {
        width: 340px;
        position: fixed;
        bottom: 15px;
        text-align: center;
        color: #ccc;
        font-size: 16px;
    }
}
</style>
