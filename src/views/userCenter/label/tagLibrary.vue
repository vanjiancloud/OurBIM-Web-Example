<!-- 标签库 -->
<template>
    <Drawer ref="Drawer" title="标签批注素材库" direction="ltr" @onClose="close">
        <Tab :data="tabList" @onTab="onTab" v-show="levels.level ===1" />
        <!-- 点击到二级构件 -->
        <div class="level2" v-if="levels.level ===2">
            <i class="el-icon-arrow-left" @click="back"></i>
            <span>{{levels.groupName}} / <span class="level2Item">{{levels.tabName}}</span></span>
        </div>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search">
            </el-input>
        </div>
        <!-- 内容 -->
        <div class="content">
            <div class="contentItem" v-for="(item,index) in (levels.level ===2 ? contentLevel2List:contentList)" :key="index" @click="toLevel2(item)">
                <el-image class="img" :src="item.comUrl" lazy></el-image>
                <div>{{item.name}}</div>
            </div>
        </div>
    </Drawer>
</template>

<script>
import { EventBus } from '@/utils/bus.js'
import Drawer from '@/components/Drawer/index.vue'
import Tab from "@/components/Tab/index.vue";
export default {
    components: { Drawer, Tab },
    props: {},
    data() {
        return {
            showDrawer: false,//是否显示
            search:'',
            tabList:[
                {
                    name: "公共库",
                },
                {
                    name: "个人库",
                }
            ],
            levels: {
                groupName: "",
                tabName: "公共库",
                level: 1,
                groupId:null,//组id
                activeContent: null
            }, //构件组名称,tab名称,默认一级
            contentList: [
                {
                    name:'假数据'
                },{
                    name:'假数据'
                },{
                    name:'假数据'
                },{
                    name:'假数据'
                }
            ], //库，一级
            contentLevel2List: [], //二级
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show() {
            this.showDrawer = true
            this.$refs.Drawer.show()
        },
        close() {
            this.showDrawer = false
            this.$refs.Drawer.hide()
            if(!this.$parent.$refs.Label.showDrawer){
                EventBus.$emit('eventTool', 'label')
            }
        },
        onTab(e) {
            
        },
        // 点击返回第一级
        back() {
            this.levels.level = 1;
        },
        // 点击去二级
        toLevel2(item){

        }
    }
}
</script>
<style lang="less" scoped>
.content {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 10px;
    height: calc(100vh - 200px);
    overflow: auto;
    padding: 0 12px;
    .contentItem {
        width: (92/3%);
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        position: relative;
        &:hover .iconBottom {
            display: block;
        }
        .img {
            width: 100%;
            height: 85px;
            object-fit: fill;
            margin-bottom: 8px;
        }
        > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .iconBottom {
            position: absolute;
            bottom: 25px;
            width: 100%;
            height: 32px;
            line-height: 32px;
            background: rgba(37, 39, 40, 0.77);
            border-radius: 0px 0px 2px 2px;
            text-align: center;
            display: none;
            i {
                margin: 0 10px;
            }
        }
    }
}
.level2 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    padding: 16px;
    i {
        margin-right: 5px;
        cursor: pointer;
    }
    .level2Item {
        color: #706c65;
    }
}
</style>