<template>
    <div class="user-page">
        <div class="expense-title">账户信息</div>
        <div class="flexColumnCenter">
            <el-form ref="userInfo" :model="userInfo" label-position="right" label-width="130px" :rules="rules">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="userInfo.name" class="formInputWidth" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="签名：" prop="note">
                    <el-input v-model="userInfo.note" class="formInputWidth" placeholder="请输入签名"></el-input>
                </el-form-item>
                <el-form-item label="公司：" prop="company">
                    <el-input v-model="userInfo.company" class="formInputWidth" placeholder="请输入公司"></el-input>
                </el-form-item>
                <el-form-item label="职位：" prop="position">
                    <el-input v-model="userInfo.position" class="formInputWidth" placeholder="请输入职位"></el-input>
                </el-form-item>
                <el-form-item label="userId：" prop="userId">
                    <el-input v-model="userInfo.userid" disabled class="formInputWidth" placeholder="请输入userId"></el-input>
                    <el-button
                        type="primary"
                        class="blueBtn"
                        v-clipboard:copy="userInfo.userid"
                        v-clipboard:success="onCopyUserId"
                        v-clipboard:error="onError"
                    >
                        复制
                    </el-button>
                </el-form-item>
                <el-form-item label="头像：" prop="imgUrl">
                    <SingleUpload v-model="userInfo.imgUrl" url="/CountManager/postUserImg" accept="image/jpeg,image/jpg,image/png" />
                    <div class="tips">支持扩展名：.png .jpg .jpeg</div>
                </el-form-item>
            </el-form>

            <el-button type="primary" class="save-btn blueBtn" @click="changeUserInfo">保存</el-button>
        </div>
    </div>
</template>

<script>
import { getUserInfo, modifyUserInfo } from '@/api/my.js'
import SingleUpload from '@/components/Upload/singleUpload.vue'

export default {
    name: 'userAccount',
    components: { SingleUpload },
    data() {
        return {
            rules: {
                name: [{ required: true, message: '请输入姓名' }],
                mobile: [{ required: true, message: '请输入手机号' }]
            },
            userInfo: {},
        }
    },
    watch:{
        '$store.state.user.userInfo':{
            handler(newValue, oldValue) {
                this.userInfo = JSON.parse(JSON.stringify(newValue || {}))
                this.userInfo.imgUrl = this.userInfo.imgUrl || require('@/views/Layout/img/man.png')
            },
            immediate: true
        }
    },
    mounted() {},
    methods: {
        onCopyUserId: function(e) {
            this.$message.success('userId复制成功！')
        },

        onError: function(e) {
            this.$message.error('userId复制失败！')
        },

        // 修改用户信息
        changeUserInfo() {
            this.$refs.userInfo.validate(valid => {
                if (valid) {
                    const params = {
                        ...this.userInfo,
                        imgUrl: this.userInfo.imgUrl,
                        userId:this.userInfo.userid
                    }
                    modifyUserInfo(params)
                        .then(res => {
                            this.$common.closeLoading()
                            this.$message.success(res.message)
                            this.$store.dispatch('user/getUser')
                        })
                        .catch(err => {
                            this.$common.closeLoading()
                        })
                }
            })
        },
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

.tips {
    font-size: 14px;
    color: gray;
}

.save-btn {
    width: 160px;
}

/deep/.el-upload{
    width: 260px;
    height: 260px;
    .avatar-uploader-icon{
        font-size: 50px;
    }
}
</style>
