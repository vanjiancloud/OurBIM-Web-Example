<template>
    <el-dialog :title="payType === 'weixin' ? '微信支付' : '支付宝支付'" :visible.sync="showDialog" @close="closeDialog">
        <template v-if="!payStatus">
            <div class="pay-message flexColumnCenter">
                <span class="font20 bold">订单提交成功！请尽快付款</span>
                <span class="font14">订单号: {{ orderCode }}</span>
                <span class="font16">应付金额: <span class="pay-num">{{ orderPayNum }}元</span></span>
            </div>
            <div class="flexColumnCenter">
                <div :class="['qr-code-box', payType]" v-loading="loadPayUrl">
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
        </template>

        <template v-else>
            <div class="flexColumnCenter pay-success">
                <img src="../../../assets/images/common/weixin-pay.svg" v-if="payType === 'weixin'" alt="" />
                <img src="../../../assets/images/common/zhifubao-pay.svg" v-else alt="" />
                <span :class="['font25', 'bold', payType === 'weixin' ? 'weixinColor' : 'zhifubaoColor']"
                    >支付成功</span
                >
                <span class="link font14" @click="jumpToOrderManagement">请前往订单管理页面查看</span>
                <div class="font14">
                    <span class="order-num">订单号：{{ orderCode }}</span>
                    <span>实付金额：<span class="pay-num">{{ orderPayNum }}元</span></span>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import QRCode from 'qrcode'
import { getPayStatus, createTopUpOrder, getPayUrl } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
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
            rechargeForm: {},
            payUrl: '',
            orderCode: '',
            showDialog: false,
            payStatus: false,
            payStatusWatcher: '',
            orderPayNum: '',
            getPayStaTimer: '',
            loadPayUrl: true
        }
    },
    methods: {
        show(formData, code) {
            this.rechargeForm = JSON.parse(JSON.stringify(formData))
            if (code) {
                this.orderCode = code
                this.getPayUrl()
            } else {
                this.createOrder()
            }
            this.showDialog = true
        },

        changePayWay() {
            this.loadPayUrl = true
            const payWay = this.payType === 'weixin' ? 'zhifubao' : 'weixin'
            this.$emit('changePayType', payWay)
            this.getPayUrl(payWay)
        },

        getPayUrl(payWay) {
            const payType = payWay ? payWay : this.payType
            const params = {
                source: payType === 'weixin' ? 1 : 2,
                userId: Getuserid(),
                code: this.orderCode
            }
            getPayUrl(params).then(res => {
                if (res.code == 200) {
                    this.payUrl = res.data.url
                    this.orderPayNum = res.data.money
                    this.drawCode()
                    clearInterval(this.getPayStaTimer)
                    this.getPayStaTimer = null
                    // 获取支付状态
                    this.getPayStaTimer = setInterval(() => {
                        this.getPaySta()
                    }, 1000)
                }
            })
        },

        createOrder() {
            const params = {
                discountCode: this.rechargeForm.coupon,
                money: this.rechargeForm.payNum,
                source: this.payType === 'weixin' ? 1 : 2,
                userId: Getuserid()
            }
            createTopUpOrder(params).then(res => {
                if (res.code === 200) {
                    const { code, money } = res.data
                    this.orderCode = code
                    this.orderPayNum = money
                    this.$emit('updateMoney', money)
                    this.getPayUrl()
                }
            })
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
                QRCode.toCanvas(container, this.payUrl, qrCodeOptions, error => {
                    this.loadPayUrl = false
                    if (error) {
                        console.log(error)
                        return
                    }
                })
            }
        },

        getPaySta() {
            getPayStatus({ code: this.orderCode }).then(res => {
                if (res.code === 200 && res.data.status === 1) {
                    this.$message.success('支付成功')
                    this.payStatus = true
                    clearInterval(this.getPayStaTimer)
                    this.getPayStaTimer = null

                    setTimeout(() => {
                        this.jumpToOrderManagement()
                    }, 2000)
                }
            })
        },

        closeDialog() {
            clearInterval(this.getPayStaTimer)
            this.getPayStaTimer = null
            this.showDialog = false
        },

        jumpToOrderManagement() {
            this.$router.push('order')
        }
    }
}
</script>
<style lang="less" scoped>
.pay-num {
    color: #ff7f28;
}
.pay-message {
    color: #405560;
    line-height: 30px;
    background-color: #f4f4f4;
    padding: 18px 0 14px 0;
    margin: 0 40px;
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
    color: #11c5fc;
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

.pay-success {
    padding: 53px 0 66px 0;
    margin: 0 40px;
    background-color: #f4f4f4;
    img {
        width: 50px;
        height: 50px;
        margin-bottom: 12px;
    }
    .link {
        cursor: pointer;
        color: #11c5fc;
        margin: 6px 0 19px 0;
    }
    .order-num {
        margin-right: 28px;
    }
}
</style>
