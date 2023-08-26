<template>
    <div class="user-page">
        <div class="expense-title">修改密码</div>
        <div class="flexColumnCenter">
            <el-form ref="passwordForm" :model="passwordForm" label-position="right" label-width="130px" :rules="rules">
                <el-form-item label="原密码：" prop="oldPassword">
                    <el-input
                        v-model="passwordForm.oldPassword"
                        show-password
                        class="formInputWidth"
                        placeholder="请输入原密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input
                        v-model="passwordForm.newPassword"
                        show-password
                        class="formInputWidth"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="confirmPassword">
                    <el-input
                        v-model="passwordForm.confirmPassword"
                        show-password
                        class="formInputWidth"
                        placeholder="请输入确认密码"
                    ></el-input>
                </el-form-item>
            </el-form>

            <el-button type="primary" class="save-btn" @click="editPass">保存</el-button>
        </div>
    </div>
</template>

<script>
import { editPassword } from '@/api/expenseManage.js'
import { Getuserid } from '@/store/index.js'

export default {
    name: 'password',
    data() {
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认密码'))
            } else if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            rules: {
                oldPassword: [{ required: true, message: '请输入原密码' }],
                newPassword: [{ required: true, message: '请输入新密码' }],
                confirmPassword: [{ required: true, validator: validatePass2, trigger: ['blur', 'change'] }]
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        }
    },
    methods: {
        editPass() {
            const params = {
                ...this.passwordForm,
                userId: Getuserid()
            }
            this.$refs.passwordForm.validate(valid => {
                if (valid) {
                    editPassword(params).then(res => {
                        if (res.code === 200) {
                            this.$message.sucess('修改成功')
                        }
                    })
                }
            })
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

.save-btn {
    width: 160px;
}
</style>
