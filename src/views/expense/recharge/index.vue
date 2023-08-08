<template>
    <div>
        <div class="expense-title">
            创建充值订单
        </div>

        <el-form label-position="right" label-width="70px">
            <el-form-item class="flexCenter" label="账号余额" prop="version">
                <div class="formInputWidth">资源点</div>    
            </el-form-item>
            <el-form-item class="flexCenter" label="可用余额" prop="version">
                <div class="formInputWidth">资源点</div>
            </el-form-item>
            <el-form-item class="flexCenter" label="充值方式" prop="version">
                <div class="formInputWidth pay-box">
                    <div class="weixin">
                        <img src="../../../assets/images/common/weixin.png" alt="" />
                        <span>微信支付</span>
                    </div>
                    <div class="zhifubao">
                        <img src="../../../assets/images/common/zhifubao.png" alt="" />
                        <span>支付宝支付</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="flexCenter" label="充值金额" prop="version">
                <el-input class="formInputWidth" v-model="rechargeForm.payNum" placeholder="请输入充值金额"></el-input>
            </el-form-item>
            <el-form-item class="flexCenter" label="优惠券" prop="version">
                <el-input class="formInputWidth" v-model="rechargeForm.payNum" placeholder="请输入充值金额"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            rechargeForm: {
                payWay: '',
                payNum: 0
            }
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {}
}
</script>
<style lang="less" scoped>
.formInputWidth {
    width: 500px !important;
}
.pay-box {
    display: flex;
    .weixin, .zhifubao {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 170px;
        height: 170px;
        border: 1px solid #B8CAD5;
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
            color: #B8CAD5;
        }
    }
}
::v-deep .el-form-item__content {
    margin-left: 20px !important;
}
</style>
