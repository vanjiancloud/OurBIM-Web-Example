<template>
    <el-dialog :title="payType === 'weixin' ? '微信支付' : '支付宝支付'" :visible.sync="showDialog">
        <div class="pay-message flexColumnCenter">
            <span class="font20 bold">订单提交成功！请尽快付款</span>
            <span class="font14">订单号: 2938447464664</span>
            <span class="font16">应付金额: <span class="pay-num">3,800元</span></span>
        </div>
        <div class="flexColumnCenter">
            <div :class="['qr-code-box', payType]">
                <canvas id="buyCode"></canvas>
                <img class="logo" src="../../../assets/logo.jpg" alt="" />
            </div>

            <div class="pay-way-box flexCenter">
                <img v-if="payType === 'weixin'" src="../../../assets/images/common/weixin.png" alt="" />
                <img v-else src="../../../assets/images/common/zhifubao.png" alt="" />
                <span v-if="payType === 'weixin'" class="font18 weixinColor">微信支付</span>
                <span v-else class="font18 zhifubaoColor">支付宝支付</span>
            </div>

            <div class="change-box flexCenter" @click="changePayWay">
                <i class="el-icon-d-arrow-left"></i>
                <span class="font16">切换其他支付方式</span>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import QRCode from 'qrcode'
export default {
    components: {},
    props: {
        payType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showDialog: false
        }
    },
    watch: {},
    computed: {},
    methods: {
        show() {
            this.showDialog = true
            this.drawCode()
        },

        changePayWay() {
            const payWay = this.payType === 'weixin' ? 'zhifubao' : 'weixin'
            this.$emit('update:payType', payWay)
        },

        drawCode() {
            const container = document.getElementById('buyCode')
            if (!container) {
                setTimeout(() => {
                    this.drawCode()
                }, 100)
            } else {
                const qrCodeOptions = {
                    margin: 1,
                    width: 200,
                    height: 200
                }
                QRCode.toCanvas(container, '测试', qrCodeOptions, error => {
                    if (error) {
                        console.log(error)
                        return
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.pay-message {
    color: #405560;
    line-height: 30px;
    background-color: #f4f4f4;
    padding: 18px 0 14px 0;
    margin: 0 40px;
    .pay-num {
        color: #ff7f28;
    }
}
.qr-code-box {
    width: 210px;
    height: 210px;
    position: relative;
    margin-top: 20px;
    .logo {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 2px solid white;
        border-radius: 6px;
    }
}

.pay-way-box {
    margin: 20px 0 24px 0;
    img {
        width: 28px;
        height: 25px;
        margin-right: 10px;
    }
}

.change-box {
    cursor: pointer;
    i {
        font-size: 18px;
        margin-right: 10px;
    }
}
.change-box:hover {
    color: #11C5FC;
}

.weixin {
    border: 5px solid #12ba12;
    border-radius: 6px;
}
.zhifubao {
    border: 5px solid #00abf9;
    border-radius: 6px;
}
.weixinColor {
    color: #12ba12;
}
.zhifubaoColor {
    color: #00abf9;
}
::v-deep .el-dialog__title {
    font-size: 18px !important;
    color: #405560 !important;
    font-weight: bold !important;
}
</style>
