<!--
 * @LastEditors: zk
 * @Description: 
-->
<template>
    <span>
        <!-- 总并发数量:concurrency -->
        <el-popover placement="right" width="200" trigger="hover" v-if="type==='concurrency'">
            <img slot="reference" src="@/assets/images/recharge/price/dian.png" class="dot"/>
            <div class="dotContent">
                <div class="dotTitle">总并发数量：</div>
                <div class="dotDetail">
                    总并发数量，是指在云3D、云VR、云AR等模式，同时打开BIM、GIS、云应用等模型场景的有效在线链接总数，云VR/AR并发数量占用总并发数。一般，并发数量普遍低于用户数量，可按用户量:并发量=5:1~20:1来评估需要的并发数量或版本授权。CAD服务模块无并发限制。
                </div>
            </div>
        </el-popover>
        <!-- 预付费：prepayment -->
        <el-popover placement="right" width="200" trigger="hover" v-if="type==='prepayment'">
            <img slot="reference" src="@/assets/images/recharge/price/dian.png" class="dot"/>
            <div class="dotContent">
                <div class="dotTitle">预付费：</div>
                <div class="dotDetail">
                    预付费版采用资源点按需计费的消费方式，充值1点=1元。
                </div>
            </div>
        </el-popover>
        <!-- 预启动服务：preStart -->
        <el-popover placement="right" width="200" trigger="hover" v-if="type==='preStart'">
            <img slot="reference" src="@/assets/images/recharge/price/dian.png" class="dot"/>
            <div class="dotContent">
                <div class="dotTitle">预启动服务：</div>
                <div class="dotDetail">
                    开启预启动服务的项目，是采用服务端项目常驻的方式，支持在1-3S内快速打开项目，一般适用于加载时间较长的大型项目。按授权的预启动并发数量计费，占用总并发数。目前仅支持云3D模式，云VR、云AR模式尚未支持。预启动服务对服务器性能有占用，对服务器稳定性有一定影响，请谨慎启用。
                </div>
            </div>
        </el-popover>
        <!-- 客服二维码 -->
        <el-popover placement="bottom" width="auto" trigger="hover" v-if="type==='kf'">
            <template slot="reference">
                <slot name="reference"></slot>
            </template>
            <div class="kf">
                <div>微信扫码加客服</div>
                <img src="@/assets/images/recharge/price/baojiaerwei.png"/>
            </div>
        </el-popover>
        <el-popover placement="bottom" width="auto" trigger="hover" v-if="type==='kfPhone'">
            <template slot="reference">
                <slot name="reference"></slot>
            </template>
            <div class="kf">
                <div>18622837275(小万)</div>
                <img src="@/assets/images/recharge/price/baojiaerwei.png"/>
            </div>
        </el-popover>
    </span>
</template>

<script>
export default {
    components: {},
    props: {
        // 总并发数量:concurrency
        type: {
            type:String,
            default:''
        }
    },
    data() {
        return {
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {}
};
</script>
<style lang="less" scoped>
@import '@/assets/css/price.less';

</style>