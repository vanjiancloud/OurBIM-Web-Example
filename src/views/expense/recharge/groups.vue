<template>
    <div>
        <el-form ref="rechargeForm" :model="rechargeForm" label-position="right" label-width="110px" :rules="rules">
            
            <el-form-item class="flexCenter" label="充值方式：">
                <div class="formInputWidth pay-box">
                    <div
                        :class="['weixin', payType === 'weixin' ? 'weixin-pay-active' : '']"
                        @click="selectPayWay('weixin')"
                    >
                        <img src="../../../assets/images/common/weixin.png" alt="" />
                        <span>微信支付</span>
                    </div>
                    <div
                        :class="['zhifubao', payType === 'zhifubao' ? 'zhifubao-pay-active' : '']"
                        @click="selectPayWay('zhifubao')"
                    >
                        <img src="../../../assets/images/common/zhifubao.png" alt="" />
                        <span>支付宝支付</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="充值金额：" prop="payNum">
                <div class="formInputWidth flexCenter">
                    <el-input
                        v-model="rechargeForm.payNum"
                        placeholder="请输入充值金额"
                        type="number"
                        @keydown.native="channelInputLimit"
                    ></el-input>
                    <span class="left10">元</span>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="优惠券：" prop="coupon">
                <div class="formInputWidth flexCenter">
                    <el-input
                        v-model="rechargeForm.coupon"
                        placeholder="请输入优惠券"
                        @change="changeCoupon"
                    ></el-input>
                    <el-button class="left10" type="primary" @click="verifyCode">校验</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="pay-price-box">
            <div class="price-content">
                <div>
                    购买资源点：<span class="buy-source">{{ rechargeForm.payNum }} 资源点</span>
                </div>
                <div>
                    购买金额： <span class="buy-num">￥{{ rechargeForm.payNum }}</span>
                </div>
                <div>
                    优惠金额： <span>￥{{ discountMoney }}</span>
                </div>
                <div>
                    订单总价：<span class="all-price">￥{{ sumOrderPrice }}</span>
                </div>
            </div>
            <el-button class="submit-btn" type="warning" @click="submitOrder">提交订单</el-button>
        </div>
    </div>
</template>
<script>
import { verifyUserDiscountCode } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
export default {
    props: {
        payType: {
            type: String,
            required: true
        }
    },
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
                payNum: '',
                coupon: ''
            },
            rules: {
                payNum: [{ required: true, validator: checkPayNum, trigger: ['blur', 'change'] }]
            },
            accountMoney: '',
            discountMoney: '', // 优惠金额
            isCheckCoupon: false, // 优惠券是否完成校验
        }
    },
    computed: {
        sumOrderPrice() {
            return (this.rechargeForm.payNum - this.discountMoney).toFixed(2)
        }
    },
    created() {
        // 订单管理跳转支付
        if (this.$route.params.buyResourceNumber) {
            const { buyResourceNumber, discountMoney, discountCode } = this.$route.params
            this.rechargeForm.payNum = buyResourceNumber
            this.rechargeForm.coupon = discountCode
            this.discountMoney = typeof discountMoney == 'number' ? discountMoney : 0
        }
    },
    methods: {
        selectPayWay(way) {
            this.$emit('changePayType', way)
        },

        verifyCode() {
            if (!this.rechargeForm.coupon) {
                this.$message.warning("请填写优惠券")
                return
            }
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
                    this.$emit('getData', this.rechargeForm)
                }
            })
        },

        channelInputLimit(e) {
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
<style scoped lang="less">
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
