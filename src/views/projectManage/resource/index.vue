<template>
    <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane :label="item" :name="key" v-for="(item,key) in tabList" :key="key"></el-tab-pane>

        <div class="bread" v-if="groupName"><span @click="back()">{{tabList[activeName]}}</span> / {{ groupName }}</div>

        <!-- BIM构件库 -->
        <Components ref="Components" v-if="activeName==='0'" :total.sync="total" :groupName.sync="groupName"/>
        <!-- 贴图库 -->
        <Chartlet ref="Chartlet" v-if="activeName==='1'" :total.sync="total" :groupName.sync="groupName"/>
        <!-- 标签库 -->
        <Tag ref="Tag" v-if="activeName==='2'"/>
    </el-tabs>
</template>

<script>
import Chartlet from './chartlet.vue'
import Components from './components.vue'
import Tag from './tag.vue'
export default {
    components: { Chartlet, Components, Tag },
    props: {},
    data() {
        return {
            activeName: '0',
            tabList:{
                '0':'BIM构件库',
                '1':'贴图库',
                '2':'标签库'
            },
            total:0,//数据条数
            groupName:''//分组名称
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        // 切换tab
        handleClick(tab) {
            switch (tab.name) {
                case '0':
                    this.$refs.Components.getList()
                    break;
                case '1':
                    this.$refs.Chartlet.getList()
                    break;
                case '2':
                    this.$refs.Tag.getList()
                    break;            
                default:
                    break;
            }
        },
        // 返回一级
        back(){
            this.groupName = ''
            switch (this.activeName) {
                case '0':
                    this.$refs.Components.back()
                    break;
                case '1':
                    this.$refs.Chartlet.back()
                    break;
                case '2':
                    this.$refs.Tag.back()
                    break;            
                default:
                    break;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.tabs{
    padding-top: 15px;
    /deep/.el-tabs__nav{
        margin-left: 40px;
    }
    .bread{
        font-size: 16px;
        font-weight: 500;
        color: #6A7C87;
        padding-left: 24px;
        span{
            color: #999999;
            cursor: pointer;
            &:hover{
                color: #00aaf0;
            }
        }
    }
}
</style>