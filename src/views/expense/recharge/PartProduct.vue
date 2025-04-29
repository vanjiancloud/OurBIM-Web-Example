/*
* author: zk
*time: 2021/1/26
*description:产品定价
*/
<template>
  <div class="page-box">
    <div class="priceWrap">
      <div class="tabs">
        <div class="tabsItem" :class="{ [item.class]: activeItem === item.id }" v-for="(item, index) in list" :key="index"
          @click="onTab(item)">
          {{ item.name }}
          <span>{{ item.subName }}</span>
        </div>
      </div>
      <el-collapse-transition>
        <part-public v-if="activeItem === 0" />
        <part-private v-if="activeItem === 1" />
        <part-license v-if="activeItem === 2" />
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import PartPublic from "./ProductPrice/PartPublic"
import PartPrivate from './ProductPrice/PartPrivate'
import PartLicense from './ProductPrice/PartLicense'
export default {
  name: "product_pricing",
  components: { PartPublic, PartPrivate, PartLicense },
  props: {
    versionType: {
      type: String,
    },
  },
  data() {
    return {
      activeItem: 0,
      list: [
        {
          id: 0,
          name: '公有云订阅',
          subName: '（按年/按需/按月）',
          activeBg: require('@/assets/images/recharge/price/tabBg1.png'),
          class: 'activeItem1'
        },
        {
          id: 1,
          name: '私有化订阅',
          subName: '（按年/按需/按月）',
          activeBg: require('@/assets/images/recharge/price/tabBg2.png'),
          class: 'activeItem2'
        },
        {
          id: 2,
          name: '私有化许可',
          subName: '（永久授权）',
          activeBg: require('@/assets/images/recharge/price/tabBg3.png'),
          class: 'activeItem3'
        }
      ]
    }
  },
  mounted() {
    this.activeItem = Number(this.versionType)
    console.log(this.activeItem);
  },
  methods: {
    onTab(item) {
      this.activeItem = item.id
    }
  },
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

.page-box {
  min-width: 1200px;
  min-height: 90vh;
  background: #f3f5fa;
  padding: 60px 0;

  .priceWrap {
    max-width: 1200px;
    margin: 0 auto;

    .tabs {
      width: 100%;
      background: #FFFFFF;
      border-radius: 100px;
      display: flex;
      align-items: center;

      .tabsItem {
        flex: 1;
        text-align: center;
        font-size: 28px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2C2424;
        cursor: pointer;
        padding: 38px 0;

        span {
          font-size: 18px;
        }
      }

      .activeItem {
        color: #FFFFFF;
        background-size: cover;
      }

      .activeItem1 {
        background: url('~@/assets/images/recharge/price//tabBg1.png') no-repeat -11px -6px;
        .activeItem();

        span {
          color: #FFCC67;
        }
      }

      .activeItem2 {
        background: url('~@/assets/images/recharge/price//tabBg2.png') no-repeat -11px -5px;
        .activeItem();

        span {
          color: #C1F2FF;
        }
      }

      .activeItem3 {
        background: url('~@/assets/images/recharge/price//tabBg3.png') no-repeat 2px -5px;
        .activeItem();

        span {
          color: #A05614;
        }
      }
    }
  }
}
</style>
