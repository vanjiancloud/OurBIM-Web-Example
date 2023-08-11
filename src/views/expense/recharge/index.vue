<template>
    <div>
        <div class="expense-title">
            创建充值订单
        </div>

        <el-form ref="rechargeForm" :model="rechargeForm" label-position="right" label-width="110px" :rules="rules">
            <el-form-item class="flexCenter" label="账号余额：">
                <div class="formInputWidth color999">
                    <span class="font18">{{ accountMoney }}</span> 资源点
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="可用余额：">
                <div class="formInputWidth color999">
                    <span class="font18">{{ accountMoney }}</span> 资源点
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="充值方式：" prop="payWay">
                <div class="formInputWidth pay-box">
                    <div
                        :class="['weixin', rechargeForm.payWay === 'weixin' ? 'weixin-pay-active' : '']"
                        @click="selectPayWay('weixin')"
                    >
                        <img src="../../../assets/images/common/weixin.png" alt="" />
                        <span>微信支付</span>
                    </div>
                    <div
                        :class="['zhifubao', rechargeForm.payWay === 'zhifubao' ? 'zhifubao-pay-active' : '']"
                        @click="selectPayWay('zhifubao')"
                    >
                        <img src="../../../assets/images/common/zhifubao.png" alt="" />
                        <span>支付宝支付</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="充值金额：" prop="payNum">
                <div class="formInputWidth flexCenter">
                    <el-input v-model="rechargeForm.payNum" placeholder="请输入充值金额"></el-input>
                    <span class="left10">元</span>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="优惠券：" prop="coupon">
                <div class="formInputWidth flexCenter">
                    <el-input v-model="rechargeForm.coupon" placeholder="请输入优惠券"></el-input>
                    <el-button class="left10" type="primary" @click="verifyCode">校验</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="pay-price-box">
            <div class="price-content">
                <div>购买资源点：<span class="buy-source">69800资源点</span></div>
                <div>购买金额： <span class="buy-num">￥4,600</span></div>
                <div>优惠金额： -￥800</div>
                <div>订单总价：<span class="all-price">￥3,800</span></div>
            </div>
            <el-button class="submit-btn" type="warning" @click="submitOrder">提交订单</el-button>
        </div>

        <PayDialog ref="payDialog" :payType.sync="rechargeForm.payWay"></PayDialog>
    </div>
</template>

<script>
import PayDialog from './payDialog.vue'
import { getUserMoney, createTopUpOrder, verifyUserDiscountCode } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
export default {
    components: {
        PayDialog
    },
    props: {},
    data() {
        return {
            rechargeForm: {
                payWay: '',
                payNum: '',
                coupon: ''
            },
            rules: {
                payWay: [{ required: true, message: '请选择支付方式' }],
                payNum: [{ required: true, message: '请输入充值金额' }]
            },
            accountMoney: ''
        }
    },
    watch: {},
    computed: {},
    created() {
        this.getMoney()
    },
    mounted() {},
    methods: {
        getMoney() {
            const params = {
                userId: Getuserid()
            }
            getUserMoney(params).then(res => {
                if (res.code === 200) {
                    this.accountMoney = res.data.orderCountSurplusMoney
                }
            })
        },

        selectPayWay(way) {
            this.rechargeForm.payWay = way
        },

        verifyCode() {
            const params = {
                code: this.rechargeForm.coupon,
                userId: Getuserid()
            }
            verifyUserDiscountCode(params).then(res => {
                if (res.code === 200) {
                    this.$message.success('校验成功')
                }
            })
        },

        submitOrder() {
            this.$refs.rechargeForm.validate(valid => {
                if (valid) {
                    const params = {
                        discountCode: this.rechargeForm.coupon,
                        money: this.rechargeForm.payNum * 1,
                        source: this.rechargeForm.payWay === 'weixin' ? 1 : 2,
                        userId: Getuserid()
                    }
                    createTopUpOrder(params).then(res => {
                        let blob = new Blob([res])
                        let url = window.URL.createObjectURL(blob)
                        this.$refs.payDialog.show(url)
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.formInputWidth {
    width: 500px !important;
}
.weixin-pay-active {
    background-color: #61ce61;
    span {
        color: white !important;
    }
}
.zhifubao-pay-active {
    background-color: #38c5ff;
    span {
        color: white !important;
    }
}
.pay-box {
    display: flex;
    .weixin,
    .zhifubao {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 170px;
        height: 170px;
        border: 1px solid #b8cad5;
        border-radius: 6px;
        margin: 0 78px 0 0;
        cursor: pointer;
        img {
            width: 60px;
            height: 60px;
        }
        span {
            margin-top: 17px;
            font-size: 16px;
            color: #b8cad5;
        }
    }
}
.pay-price-box {
    background-color: #f3f5fa;
    margin: 0 24px;
    padding-left: 126px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .price-content {
        display: flex;
        flex-direction: column;
        align-items: start;
        width: 500px;
        margin-top: 24px;
        font-size: 16px;
        color: #999999;
        span {
            line-height: 32px;
        }
        .buy-source {
            color: #333333;
        }
        .buy-num {
            color: #ff7f28;
        }
        .all-price {
            color: #ff8434;
        }
    }
    .submit-btn {
        margin: 34px 0 42px 0;
    }
}

.left10 {
    margin-left: 10px;
}

.color999 {
    color: #999999;
}

::v-deep .el-form-item__label {
    font-size: 16px;
    color: #999999;
}
::v-deep .el-form-item__content {
    margin-left: 20px !important;
}
</style>
