<!--
 * @LastEditors: zk
 * @Description: 
-->
<template>
  <div class="recharge-page">

    <!-- 套餐购买暂时还没做，先注释 -->
    <el-tabs v-model="activeName" class="tabs recharge-tabs">
      <el-tab-pane label="预付费账户充值" name="0">
        <recharge :payType="payType" @getData="getData" @changePayType="changePayType"></recharge>
      </el-tab-pane>
      <!-- <el-tab-pane label="固定套餐购买" name="1">
                <groups :payType="payType" @getData="getData" @changePayType="changePayType"></groups>
            </el-tab-pane> -->
    </el-tabs>
    <!-- 产品定价 -->
    <el-button class="product-box" type="primary" @click="onShow">产品定价</el-button>

    <PayDialog ref="payDialog" :payType="payType" @changePayType="changePayType"></PayDialog>
    <!-- 产品定价 -->
    <part-product v-if="activeName === '2'" :versionType="versionType" />
  </div>
</template>

<script>
import PayDialog from './payDialog.vue'
import recharge from './recharge.vue'
import groups from './groups.vue'
import PartProduct from './PartProduct'

export default {
  components: {
    recharge,
    groups,
    PayDialog,
    PartProduct
  },
  data() {
    return {
      activeName: '0',
      versionType: '0',
      productType: null,
      payType: 'weixin',
    }
  },
  created() {
    this.getPath();
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
    onShow() {
      this.activeName = '2'
    },
    getPath() {
      const href = window.location.href
      let type = this.$common.getQueryString(href, 'type')
      let version = this.$common.getQueryString(href, 'versionType')
      this.activeName = type || '0'
      this.versionType = version
    },
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
  position: relative;
  padding-top: 15px;

  /deep/ .el-tabs__item {
    padding: 0 30px !important;
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

.product-box {
  position: absolute;
  top: 8px;
  right: 10px;
}
</style>
<style lang="less">
.recharge-tabs {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
