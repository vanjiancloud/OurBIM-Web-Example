<template>
    <div class="recharge-page">
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="预付费账户充值" name="0">
                <recharge :payType="payType" @getData="getData" @changePayType="changePayType"></recharge>
            </el-tab-pane>
            <el-tab-pane label="固定套餐购买" name="1">
                <groups :payType="payType" @getData="getData" @changePayType="changePayType"></groups>
            </el-tab-pane>
        </el-tabs>

        <PayDialog ref="payDialog" :payType="payType" @changePayType="changePayType"></PayDialog>
    </div>
</template>

<script>
import PayDialog from './payDialog.vue'
import recharge from './recharge.vue'
import groups from './groups.vue'
export default {
    components: {
        recharge,
        groups,
        PayDialog
    },
    data() {
        return {
            activeName: '0',
            payType: 'weixin',
        }
    },
    mounted() {
        // 订单管理跳转支付
        if (this.$route.params.buyResourceNumber) {
            const { buyResourceNumber, discountCode } = this.$route.params
            const data = {
                payNum: buyResourceNumber,
                coupon: discountCode
            }
            this.$refs.payDialog.show(data, this.$route.params.code)
        }
    },
    methods: {
        changePayType(type) {
            this.payType = type
        },

        getData(data) {
            this.$refs.payDialog.show(data)
        }
    }
}
</script>
<style lang="less" scoped>
.recharge-page {
    padding-top: 15px;
    /deep/ .el-tabs__item {
        padding: 0 30px!important;
        text-align: center;
    }
    /deep/ .el-tabs__active-bar {
        display: none;
    }
    /deep/ .is-active {
        border-bottom: 3px solid #00AAF0;
    }
    /deep/ .el-tabs__nav-scroll {
        margin-left: 10px;
    }
}
</style>
