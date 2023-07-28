<template>
    <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="授权激活" name="0">
            <ActivateList/>
        </el-tab-pane>
        <el-tab-pane label="无操作时限" name="1">
            <TimeLimit/>
        </el-tab-pane>
        <el-tab-pane label="IP黑白名单" name="2">
            <IPList/>
        </el-tab-pane>
        <el-tab-pane label="定制Logo和启动页" name="3">
            <Logo/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import ActivateList from './activateList.vue'
import TimeLimit from './timeLimit.vue'
import IPList from './IPList.vue'
import Logo from './logo.vue'
export default {
    components: { ActivateList, TimeLimit, IPList, Logo },
    props: {},
    data() {
        return {
            activeName: '0'
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
.tabs{
    padding-top: 15px;
    /deep/.el-tabs__item{
        padding: 0 30px!important;
        text-align: center;
    }
    /deep/.el-tabs__active-bar{
        display: none;
    }
    /deep/.is-active{
        border-bottom: 3px solid #00AAF0;
    }
    /deep/.el-tabs__nav-scroll{
        margin-left: 10px;
    }
}
</style>