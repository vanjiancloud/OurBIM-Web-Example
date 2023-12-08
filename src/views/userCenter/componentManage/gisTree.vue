<template>
    <div class="">
        <el-tree class="set-tree" ref="tree" empty-text="暂无数据" :props="props" :expand-on-click-node="false" :load="loadNode" @check="isShowCom" :filter-node-method="filterNode"
            :show-checkbox="true" highlight-current node-key="uuid" lazy>
            <span class="custom-tree-node" :class="{'tree-select': activeTree && node.data.gisId === activeTree.gisId}" slot-scope="{node,data}" @click="handleTree(node)">
                <span class="label-span">{{ data.gisServerName }}</span>

                <!-- 显示状态 -->
                <span>
                    <!-- <svg-icon class="icon" icon-class="freeze1" @click.stop="freezeCom(node)"/> -->
                    <i class="iconfont" :class="node.checked?'icon-yincang1':'icon-xianshi2'"></i>
                </span>
            </span>
        </el-tree>
    </div>
</template>

<script>
import { getGisList } from "@/api/userCenter/componentManage.js";
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default:()=> {}
        },
    },
    data() {
        return {
            props: {
                label: "name",
                isLeaf: (e) => {//指定是否为叶子结点,叶子结点即为最后一个结点
                    if (e.haveChild === "1") {
                        return false;
                    }
                    return true;
                },
            },
            treeParentData: [],//tree一级数据
            activeTree: null,//选中状态
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        loadNode(node, resolve) {
            this.getList(node).then((res) => {
                if(node.level === 0){
                    this.treeParentData = res
                }
                res.length&&res.forEach((item) => {
                    // 点击锁🔒
                    this.$set(item,'lockCheck',false)
                    //选中聚焦
                    this.$set(item,'check',false)
                });
                return resolve(res);
            }).catch(()=>{
                return resolve([]);
            });
        },
        async getList(){
            let list = await getGisList({ appId: this.data.appId }).then((res) => {
                return res.data || [];
            });
            return list;
        },
        isShowCom(){

        },
        filterNode(){

        },
        handleTree(){
            
        }
    }
}
</script>
<style lang="less" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    width: calc(100% - 50px);

    .label-span {
        padding-left: 5px;
        width: calc(100% - 30px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .icon,i,img{
        color: #ffffff;
        font-size: 15px;
        margin: 0 2px;
    }
}
</style>
