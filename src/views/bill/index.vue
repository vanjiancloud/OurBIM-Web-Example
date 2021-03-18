<template>
  <!-- 账户管理，个人信息 -->
  <div class="neirong">
    <div class="title">
      {{ $t('information') }}
    </div>
    <!-- 用户名 -->
    <div class="message" style="margin-top: 30px;">
      <div class="one">{{ $t('username') }}</div>
      <div class="input">
        <el-input
          v-model="name"
          placeholder="请输入用户名"
          maxlength="10"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <!-- 签名 -->
    <div class="message">
      <div class="one">{{ $t('autograph') }}</div>
      <div class="input">
        <el-input
          v-model="note"
          placeholder="请输入签名"
          maxlength="20"
          type="text"
          show-word-limit
        ></el-input>
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
        :limit="1"
        name="fileUpload"
        :on-remove="onremove"
        :on-success="upLoadImg"
        :on-error="errorImg"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :before-upload="beforeUpload"
        ref="photoUpload"
        accept=".png,.jpg,.jpeg"
      >
        <el-button type="primary" icon="el-icon-upload2">
          {{ $t('UploadAvatar') }}
        </el-button>
        <div slot="tip" class="el-upload__tip">
          {{ $t('extensions') }}：.png .jpg .jpeg
        </div>
      </el-upload>
    </div>
    <div class="btn">
      <el-button type="primary" @click="changeUserInfo">
        {{ $t('modify') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getUserInfo, modifyUserInfo } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
import axios from '@/utils/request'

export default {
  name: 'bill',
  data () {
    return {
      name: '', //用户名
      note: '', //签名
      email: '', //邮箱
      mobile: '', //手机号
      company: '', //公司
      position: '', //职位
      imgUrl: '', //用户头像
      fileList: [], //上传图片列表显示
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
          console.log('axios-获取用户信息', res.data.data)
          this.note = res.data.data.note
          this.name = res.data.data.name
          this.email = res.data.data.email
          this.mobile = res.data.data.mobile
          this.company = res.data.data.company
          this.position = res.data.data.position
          if (this.$common.isAssetTypeAnImage(res.data.data.imgUrl)) {
            this.imgUrl = res.data.data.imgUrl
            this.imgUrlDefault = res.data.data.imgUrl
          } else {
            this.imgUrl = ''
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求失败')
        })
    },
    //修改用户信息
    changeUserInfo () {
      // 赋值头像
      modifyUserInfo({
        userid: getuserid(),
        note: this.note,
        name: this.name,
        imgUrl: this.imgUrl === '' ? this.imgUrlDefault : this.imgUrl,
        company: this.company,
        position: this.position
      })
        .then(res => {
          if (res.data.code === 0) {
            this.getData()
            console.log(res)
            this.$refs.photoUpload.clearFiles()
            this.$message.success(res.data.message)
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('修改信息失败,请重新修改')
        })
    },
    // 删除文件
    onremove (file) {
      this.imgUrl = ''
    },
    // 上传头像成功
    upLoadImg (response, file, fileList) {
      this.imgUrl = response.data
    },

    // 上传头像失败
    errorImg (err, file, fileList) {
      console.log(err)
    },
    // 限制上传头像格式
    beforeUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const one = testmsg === 'jpg'
      const two = testmsg === 'jpeg'
      const three = testmsg === 'png'
      if (!one && !two && !three) {
        this.$message.error('头像格式只能是.jpg .jpeg .png格式!')
      }
      return one || two || three
    },
    // 限制上传图片张数
    handleExceed () {
      this.$message.warning(`亲，只能上传一张图片哦！`)
    }
  }
}
</script>

<style lang="less" scoped>
.neirong {
  min-height: 961px;
  .title {
    height: 54px;
    text-align: center;
    line-height: 54px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #f1f1f1;
  }
  .message {
    width: 660px;
    height: 46px;
    margin-bottom: 30px;
    font-size: 16px;
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
      font-size: 17px;
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
      font-size: 14px;
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
</style>
