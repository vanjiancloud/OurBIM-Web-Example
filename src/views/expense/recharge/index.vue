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
                    <el-input v-model="rechargeForm.payNum" placeholder="请输入充值金额" type="number"  @keydown.native="channelInputLimit"></el-input>
                    <span class="left10">元</span>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="优惠券：" prop="coupon">
                <div class="formInputWidth flexCenter">
                    <el-input v-model="rechargeForm.coupon" placeholder="请输入优惠券" @change="changeCoupon"></el-input>
                    <el-button class="left10" type="primary" @click="verifyCode">校验</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="pay-price-box">
            <div class="price-content">
                <div>购买资源点：<span class="buy-source">{{ rechargeForm.payNum }} 资源点</span></div>
                <div>购买金额： <span class="buy-num">￥{{ rechargeForm.payNum }}</span></div>
                <div>优惠金额： -￥{{ discountMoney }}</div>
                <div>订单总价：<span class="all-price">￥{{ sumOrderPrice }}</span></div>
            </div>
            <el-button class="submit-btn" type="warning" @click="submitOrder">提交订单</el-button>
        </div>

        <PayDialog
            ref="payDialog"
            :rechargeForm.sync="rechargeForm"
            @changePayType="changePayType"
            @updateMoney="updateMoney"
        ></PayDialog>
    </div>
</template>

<script>
import PayDialog from './payDialog.vue'
import { getUserMoney, verifyUserDiscountCode } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
export default {
    components: {
        PayDialog
    },
    props: {},
    data() {
        const checkPayNum = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入充值金额'))
            } else if (Number(value) < 0) {
                callback(new Error('充值金额不能为负数'))
            } else {
                callback()
            }
        }
        return {
            rechargeForm: {
                payWay: '',
                payNum: '',
                coupon: ''
            },
            rules: {
                payWay: [{ required: true, message: '请选择支付方式' }],
                payNum: [{ required: true, validator: checkPayNum, trigger: ['blur', 'change'] }]
            },
            accountMoney: '',
            discountMoney: 0, // 优惠金额
            // sumOrderPrice: 0 // 订单总价
            isCheckCoupon: false, // 优惠券是否完成校验
        }
    },
    watch: {},
    computed: {
        sumOrderPrice() {
            return (this.rechargeForm.payNum - this.discountMoney).toFixed(2)
        }
    },
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
                    this.discountMoney = res.data
                    this.isCheckCoupon = true
                    this.$message.success('校验成功')
                }
            })
        },

        changeCoupon() {
            this.isCheckCoupon = false
        },

        submitOrder() {
            this.$refs.rechargeForm.validate(valid => {
                if (valid) {

                    if (this.sumOrderPrice <= 0) {
                        this.$message.warning('充值金额必须大于优惠金额')
                        return
                    } 
                    if (!this.isCheckCoupon && this.rechargeForm.coupon) {
                        this.$message.warning('请对优惠券进行校验')
                        return
                    }

                    this.rechargeForm.payNum = Number(this.rechargeForm.payNum).toFixed(2)
                    this.$refs.payDialog.show()
                }
            })
        },

        changePayType(payWay) {
            this.rechargeForm.payWay = payWay
        },

        // 更新价格，处理用户填写了优惠券，但没点校验的情况
        updateMoney(money) {
            this.discountMoney = (this.rechargeForm.payNum - money).toFixed(2)
        },

        channelInputLimit (e) {
            const key = e.key
            // 不允许输入'e'和'.'和'-'
            if (key === 'e' || key === '-') {
                e.returnValue = false
                return false
            }
            return true
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
        align-items: flex-start;
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

/deep/ .el-input__inner::-webkit-outer-spin-button,
 /deep/ .el-input__inner::-webkit-inner-spin-button {
 -webkit-appearance: none;
}

/deep/ .el-input__inner[type='number'] {
 -moz-appearance: textfield;
}
</style>
