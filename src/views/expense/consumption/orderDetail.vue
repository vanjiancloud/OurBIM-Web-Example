<template>
    <el-dialog :visible.sync="dialogVisible" width="600px" :title="title" center @close="closeDialog">
        <div class="detail-message">
            <div class="detail-box">
                <span class="detail-label">taskId</span>
                <span class="detail-content border-top">{{ form.taskId }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">账期</span>
                <span class="detail-content">{{ form.consumerDate }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">用户ID</span>
                <span class="detail-content">{{ form.userId }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">用户姓名</span>
                <span class="detail-content">{{ form.userName }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">手机号</span>
                <span class="detail-content">{{ form.mobile }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">Email</span>
                <span class="detail-content">{{ form.email }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">授权码</span>
                <span class="detail-content">{{ form.authorizationCode }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">消费账单ID</span>
                <span class="detail-content">{{ form.id }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">创建时间</span>
                <span class="detail-content">{{ form.createTime }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">产品版本</span>
                <span class="detail-content">{{ form.versionName }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">计费方式</span>
                <span class="detail-content">{{ form.consumerBillingMode }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">消费内容</span>
                <span class="detail-content">{{ form.consumeContent }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">项目ID</span>
                <span class="detail-content">{{ form.appId }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">项目名称</span>
                <span class="detail-content">{{ form.appName }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">开始时间</span>
                <span class="detail-content">{{ form.consumeStartTime }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">结束时间</span>
                <span class="detail-content">{{ form.consumeEndTime }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">服务单间(资源点)</span>
                <span class="detail-content">{{ form.price }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">消费时长</span>
                <div class="detail-content">
                    <span class="detail-content" v-if="form.invoice">{{ form.invoice }}分钟</span>
                </div>
            </div>
            <div class="detail-box">
                <span class="detail-label">消费次数</span>
                <div class="detail-content">
                    <span v-if="form.consumeCount">{{ form.consumeCount }}次</span>
                </div>
            </div>
            <div class="detail-box">
                <span class="detail-label">消费资源点数</span>
                <span class="detail-content">{{ form.consumeMoney }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">优惠资源点数</span>
                <span class="detail-content">{{ form.discountMoney }}</span>
            </div>
            <div class="detail-box">
                <span class="detail-label">实扣资源点数</span>
                <span class="detail-content">{{ form.consumeActualMoney }}</span>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            title: '',
            form: ''
        }
    },
    methods: {
        showDialog(text, row) {
            if (row) {
                this.form = JSON.parse(JSON.stringify(row))
            }

            this.title = text
            this.dialogVisible = true
        },

        closeDialog() {
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
::v-deep .el-form-item {
    margin-bottom: 16px;
}
.dialog-form {
    padding: 0 20px;
}
.detail-message {
    overflow: scroll;
}
.border-top {
    border-top: 1px solid #ecf4fa;
}
.detail-box {
    display: flex;
    align-items: center;
    height: 40px;
    .detail-label {
        display: flex;
        justify-content: left;
        padding-left: 16px;
        font-size: 14px;
        width: 155px;
        height: 40px;
        line-height: 40px;
        background-color: #E1F7FD;
    }
    .detail-content {
        flex: 1;
        padding-left: 36px;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        color: gray;
        border-right: 1px solid #ecf4fa;
        border-bottom: 1px solid #ecf4fa;
    }
}
</style>

<style>
.el-dialog__body {
    padding-bottom: 10px !important;
}
.el-dialog__close {
    font-size: 24px;
}
</style>
