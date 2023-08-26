<template>
    <div class="user-page">
        <div class="expense-title">账户信息</div>
        <div class="flexColumnCenter">
            <el-form ref="userInfo" :model="userInfo" label-position="right" label-width="130px">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="userInfo.name" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="签名：" prop="note">
                    <el-input v-model="userInfo.note" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="userInfo.email" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="userInfo.mobile" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="公司：" prop="company">
                    <el-input v-model="userInfo.company" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="职位：" prop="position">
                    <el-input v-model="userInfo.position" class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="userId：" prop="userId">
                    <el-input v-model="userId" disabled class="formInputWidth" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="头像：" prop="imgUrl">
                    <div class="avator-box flexCenter" v-if="imgUrl">
                        <img :src="imgUrl" class="avator" alt="" />
                        <div class="delete-box" @click="removeAvator">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                    <el-upload
                        v-else
                        class="upload-avator-box"
                        :action="baseURL + '/CountManager/postUserImg'"
                        :limit="1"
                        :show-file-list="false"
                        name="fileUpload"
                        :on-remove="removeAvator"
                        :on-success="upLoadImg"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUpload"
                        ref="photoUpload"
                        accept=".png,.jpg,.jpeg"
                    >
                        <div class="upload-img-box flexCenter">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </el-upload>
                    <div class="tips">支持扩展名：.png .jpg .jpeg</div>
                </el-form-item>
            </el-form>

            <el-button type="primary" class="save-btn" @click="changeUserInfo">保存</el-button>
        </div>
    </div>
</template>

<script>
import { getUserInfo, modifyUserInfo } from '@/api/my.js'
import { Getuserid } from '@/store/index.js'
import axios from '@/utils/request'

export default {
    name: 'userAccount',
    data() {
        return {
            userInfo: {},
            userId: '',
            imgUrl: '', // 用户头像
            imgUrlDefault: '', // 用户头像为空,时的变量
            baseURL: axios.defaults.baseURL
        }
    },
    created() {
        this.userId = Getuserid()
        this.getData()
    },
    methods: {
        // 获取用户信息
        getData() {
            const params = {
                userid: Getuserid()
            }
            getUserInfo(params)
                .then(res => {
                    // 更新cookie里的信息
                    if (res.data && res.data.data) {
                        sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    }
                    this.userInfo = res.data.data
                    this.imgUrl = res.data.data.imgUrl
                    this.imgUrlDefault = res.data.data.imgUrl
                })
                .catch(err => {
                    this.$message.error('请求失败')
                })
        },

        //修改用户信息
        changeUserInfo() {
            const params = {
                userid: Getuserid(),
                note: this.userInfo.note,
                name: this.userInfo.name,
                imgUrl: this.imgUrl === '' ? this.imgUrlDefault : this.imgUrl,
                company: this.userInfo.company,
                position: this.userInfo.position,
                email: this.userInfo.email,
                mobile: this.userInfo.mobile,
            }
            modifyUserInfo(params)
                .then(res => {
                    console.log('第108行被执行', res.data.code)
                    if (res.data.code === 0) {
                        this.getData()
                        this.$common.closeLoading()
                        this.$message.success(res.data.message)
                    } else if (res.data.code === 1) {
                        this.$message.error(res.data.message)
                        this.$common.closeLoading()
                    }
                })
                .catch(err => {
                    this.$message.error('修改信息失败,请重新修改')
                })
        },

        // 删除文件
        removeAvator(file) {
            this.imgUrl = ''
        },

        // 上传头像成功
        upLoadImg(response, file, fileList) {
            this.imgUrl = response.data
        },

        // 限制上传头像格式
        beforeUpload(file) {
            const fileArr = ['jpg', 'jpeg', 'png']
            const fileSuffix = file.name.split('.')[1]
            const index = fileArr.findIndex(item => item === fileSuffix)
            // 是否满足头像格式要求
            const isRequired = index === -1 ? false : true
            if (!isRequired) {
                this.$message.error('头像格式只能是.jpg .jpeg .png格式!')
            }
            return isRequired
        },

        // 限制上传图片张数
        handleExceed() {
            this.$message.warning(`亲，只能上传一张图片哦！`)
        }
    }
}
</script>

<style lang="less" scoped>
.user-page {
    padding-bottom: 30px;
}
.expense-title {
    margin: 20px 0 20px 20px;
}
.formInputWidth {
    width: 360px !important;
    margin: 0 20px 0 0;
}

.avator-box {
    width: 260px;
    height: 260px;
    position: relative;
    .avator {
        width: 260px;
        height: 260px;
    }
    .delete-box {
        display: none;
    }
}
.avator-box:hover {
    .delete-box {
        width: 260px;
        height: 260px;
        background-color: rgba(0, 0, 0, 0.5);
        display: inline-block;
        position: absolute;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-icon-delete {
            font-size: 50px;
            color: white;
        }
    }
}

.upload-avator-box {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    .upload-img-box {
        width: 260px;
        height: 260px;
        position: relative;
        .avatar-uploader-icon {
            font-size: 50px;
            color: #8c939d;
            line-height: 178px;
            text-align: center;
        }
    }
}
.upload-avator-box:hover {
    border-color: #409eff;
}

.tips {
    font-size: 14px;
    color: gray;
}

.save-btn {
    width: 160px;
}
</style>
