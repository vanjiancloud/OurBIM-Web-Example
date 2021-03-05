<template>
  <!-- 账户管理，个人信息 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间主体内容-->
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
                <span slot="title">{{ $t('Authorization') }}</span>
              </el-menu-item><el-menu-item index="/order">
                <span slot="title">{{ $t('Serviceorder') }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <div class="color"></div>
        <!-- 个人信息 -->
        <div class="neirong">
          <div class="title">
            {{ $t('information') }}
          </div>
          <!-- 用户名 -->
          <div class="message" style="margin-top: 30px;">
            <div class="one">{{ $t('username') }}</div>
            <div class="input">
              <el-input v-model="name" placeholder="请输入用户名"></el-input>
            </div>
          </div>
          <!-- 签名 -->
          <div class="message">
            <div class="one">{{ $t('autograph') }}</div>
            <div class="input">
              <el-input v-model="note" placeholder="请输入签名"></el-input>
            </div>
          </div>
          <!-- 邮箱 -->
          <div class="message">
            <div class="one">{{ $t('email') }}</div>
            <div class="input">
              <el-input
                v-model="email"
                placeholder="请输入邮箱"
                :disabled="true"
              ></el-input>
            </div>
          </div>
          <!-- 手机号 -->
          <div class="message">
            <div class="one">{{ $t('Mobilephone') }}</div>
            <div class="input">
              <el-input
                v-model="mobile"
                placeholder="请输入手机号"
                :disabled="true"
              ></el-input>
            </div>
          </div>
          <!-- 公司 -->
          <div class="message">
            <div class="one">{{ $t('company') }}</div>
            <div class="input">
              <el-input v-model="company" placeholder="请输入公司"></el-input>
            </div>
          </div>
          <!-- 职位 -->
          <div class="message">
            <div class="one">{{ $t('position') }}</div>
            <div class="input">
              <el-input v-model="position" placeholder="请输入职位"></el-input>
            </div>
          </div>
          <!-- 上传头像 -->
          <div class="photo">
            <el-upload
              :action="baseURL + '/CountManager/postUserImg'"
              multiple
              :limit="1"
            >
              <el-button type="primary" icon="el-icon-upload2">
                {{ $t('UploadAvatar') }}
              </el-button>
              <div slot="tip" class="el-upload__tip">
                {{ $t('extensions') }}：.png.jpg.jpeg
              </div>
            </el-upload>
          </div>
          <div class="btn">
            <el-button type="primary" @click="changeUserInfo">
              {{ $t('modify') }}
            </el-button>
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
import { getUserInfo } from '@/api/my.js'
import { modifyUserInfo } from '@/api/my.js'
import { uploadImg } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  components: { myHeader, MyFooter },
  name: 'bill',
  data () {
    return {
      // 导航菜单跳转
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' }
      ],
      name: '',
      note: '', //签名
      email: '',
      mobile: '',
      company: '',
      position: '', //职位
      imgUrl: '',
      baseURL: axios.defaults.baseURL
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取用户信息
    getData () {
      getUserInfo({
        userid: getuserid()
      })
        .then(res => {
          console.log(res)
          this.note = res.data.data.note
          this.imgUrl = res.data.data.imgUrl
          this.name = res.data.data.name
          this.email = res.data.data.email
          this.mobile = res.data.data.mobile
          this.company = res.data.data.company
          this.position = res.data.data.position
        })
        .catch(err => {
          this.$message.error('请求失败')
        })
    },
    //修改用户信息
    changeUserInfo () {
      
      modifyUserInfo({
        userid: getuserid(),
        note: this.note,
        name: this.name,
        imgUrl: this.imgUrl,
        company: this.company,
        position: this.position
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('修改成功')
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('修改失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('修改信息失败,请重新修改')
        })
    },
    // 上传头像
    uploadImg(response){
      this.imgUrl = response.data
    },
    upImg () {
      uploadImg({
        imgUrl: this.imgUrl
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('上传头像成功')
          } else if (res.data.code === 1) {
            this.$message.error('上传头像失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('上传失败，请重新上传头像')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .main {
    height: 221px;
    margin-top: 20px;
    .container {
      .top {
        height: 152px;
        background-color: #fff;
        .left {
          height: 152px;
          width: 192px;
          margin-right: 95px;
          margin-left: 42px;
          float: left;
          background-color: #fff;
          .im {
            margin-top: 36px;
            width: 80px;
            height: 80px;
            float: left;
            border-radius: 50%;
            margin-right: 20px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .Info {
            float: right;
            margin-top: 35px;
          }
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
            margin-top: -10px;
            margin-left: 100px;
            .tu {
              float: left;
              margin-right: 29px;
              margin-top: 15px;
              .icon {
                width: 20px;
                height: 20px;
                float: left;
                margin-right: 10px;
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
          height: 152px;
          // background-color: pink;
          float: left;
          h3 {
            margin-top: 28px;
            color: #00aaf0;
          }
          .tutu {
            float: left;
            margin-top: 15px;
            .icon {
              width: 20px;
              height: 20px;
              float: left;
              margin-right: 10px;
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
            .btn {
              width: 132px;
            }
          }
        }
      }
      .tab {
        height: 69px;
        background-color: #f1f1f1;
        line-height: 69px;
        padding: 0 220px;
        .el-button {
          color: #000;
        }
        .el-button:hover {
          color: #ff6600;
        }
        div {
          float: left;
          margin-right: 155px;
          width: 70px;
          height: 50px;
          // background-color: pink;
          border-bottom: 5px solid #f1f1f1;
          border-radius: 3px;
        }
        div:hover {
          border-bottom-color: #ff6600;
        }
        .last {
          margin: 0;
        }
      }
    }
  }
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 1037px;
    .content {
      overflow: hidden;
      ul.el-menu {
        height: 1037px;
      }
      /deep/ .el-submenu__title {
        font-size: 17px; 
      }
      /deep/ .el-menu-item   {
        font-size: 17px;
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
          text-align: center;
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
            width: 60px;
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
        .photo {
          margin-top: 35px;
          margin-left: 70px;
          /deep/ .el-button--primary {
            // width: 130px;
            height: 45px;
            background-color: #00aaf0;
          font-size: 16px;
          }
          .el-upload__tip {
            font-size: 16px;
          }
        }
        .btn {
          margin-top: 70px;
          margin-left: 300px;
          /deep/ .el-button--primary {
            width: 140px;
            height: 45px;
            background-color: #00aaf0;
          font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
