<template>
  <!-- 授权码 -->
  <div class="box">
    <!-- title -->
    <div class="title">
      {{ $t('Authorization') }}
      <!-- 授权码 -->
    </div>
    <div class="input">
      {{ $t('Authorizations') }}
      <!-- 授权码 -->
      <el-input v-model="SQM"></el-input>
      <el-button type="primary" class="btn" @click="verification">
        <!-- 验证 -->
        {{ $t('verification') }}
      </el-button>
      <div class="news">
        <span>*</span>
        <!-- 联系售后 -->
        {{ $t('nouse') }}
      </div>
    </div>
    <!-- 提交按钮 -->
    <div class="submit">
      <el-button type="primary" :disabled="dis" @click="update">
        {{ $t('submit') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { updateSQM, verification } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  name: 'authorizationCode',
  data () {
    return {
      SQM: '',
      dis: true
    }
  },
  methods: {
    // 验证授权码
    verification () {
      verification({
        userid: getuserid(),
        SQM: this.SQM
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('授权码验证成功')
            this.dis = false
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('授权码验证失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('授权码验证失败,请重新填写')
        })
    },
    // 提交授权码
    update () {
      updateSQM({
        userid: getuserid(),
        SQM: this.SQM
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('提交授权码成功')
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('提交授权码失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('授权码提交失败,请重新提交')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .title {
    height: 54px;
    text-align: center;
    line-height: 54px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #f1f1f1;
  }
  .input {
    // text-align: center;
    margin-top: 20px;
    margin-left: 55px;
    font-size: 16px;
    .el-input {
      width: 462px;
      margin-right: 20px;
    }
    /deep/ .el-input__inner {
      width: 462px;
      height: 46px;
      font-size: 16px;
    }
    .news {
      margin-top: 10px;
      color: #ccc;
      line-height: 36px;
      font-size: 16px;
      span {
        color: red;
        font-size: 16px;
        margin-right: 5px;
        margin-top: 3px;
      }
    }
    .btn {
      height: 46px;
      background-color: #00aaf0;
      font-size: 16px;
    }
  }
  .submit {
    margin-top: 190px;
    text-align: center;
    /deep/ .el-button--primary {
      height: 40px;
      width: 140px;
      font-size: 17px;
    }
  }
}
</style>
