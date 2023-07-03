<!-- 构件树 -->
<template>
    <Drawer ref="Drawer" title="模型浏览器" direction="ltr" @onClose="close()">
        <template v-slot="{ drawer }">
            <div class="search">
                <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"
                    @change="searchContent()" @keydown.native.stop>
                </el-input>
            </div>
            <!-- 树 -->
            <el-tree class="set-tree" ref="setTree" @check="checkTree" :empty-text="treeEmpty" @node-expand="ExpandNode"
                :props="propsMember" :expand-on-click-node="false" :load="loadNode" :filter-node-method="filterNode"
                show-checkbox highlight-current node-key="uuid" lazy>
                <span class="custom-tree-node" :class="activeTree &&
                    node.data.uuid === activeTree.uuid &&
                    activeLeaf
                    ? 'tree-select'
                    : ''
                    " slot-scope="{ node,data}" @click="handleTree(node, 0)">
                    <span class="label-span">{{ node.label }}</span>
                    <!-- 合模 -->
                    <img src="@/assets/images/tag/6.png" @click.stop="deleteCom(node)" class="delect-com-icon" v-if="appType === '3' &&
                        node.data.typeId === 'comp' &&
                        checkedNodeVanjian(node)
                        " />
                    <!-- 非合模 -->
                    <img src="@/assets/images/tag/6.png" @click.stop="deleteCom(node)" class="delect-com-icon"
                        v-if="appType !== '3' && node.data.typeId === 'comp'" />
                    <span v-if="node.level === 1 && (appType === '3' || appType === '0') && node.data.name != '自定义构件'">
                        <!-- 开锁和闭锁 -->
                        <i class="iconfont icon-24gl-lock2 lockLock" v-if="!data[`lockView${+node.id}`]"
                            @click.stop="handleToggleLock(node, data, node.id)"></i>
                        <i v-else class="iconfont icon-24gl-unlock4 lockLock"
                            @click.stop="handleToggleLock(node, data, node.id)"></i>
                    </span>
                    <span>
                        <!-- 显示状态 -->
                        <i class="iconfont icon-xianshi2" v-if="!node.checked"></i>
                        <i v-else class="iconfont icon-yincang1"></i>
                    </span>
                </span>
            </el-tree>
        </template>
    </Drawer>
</template>

<script>
import { doAction } from '@/api/model_api.js'
import COMPONENTLIBRARY, { controlComShowOrHide } from "@/api/component-library";
import Drawer from "@/components/Drawer/index.vue";
import { EventBus } from '@/utils/bus.js'
export default {
    components: { Drawer },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            search: '',
            leafInfo: null,
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        show() {
            this.$refs.Drawer.show()
        },
        close() {
            this.$refs.Drawer.hide()
            EventBus.$emit('eventTool', 'browser')
        },
        // 搜索
        searchContent() {
            this.$refs.setTree.filter(this.search);
        },
        checkTree(data, e) {
            this.leafInfo = data;
            if (e.checkedKeys.includes(data.uuid)) {
                // this.handleState = 8;
                data.activeState = 1;
                // 如果是自定义构件
                if (data.typeId === "comp") {
                    this.componentShowHide(data.uuid);
                    return;
                }
                this.updateOrder();
            } else {
                // this.handleState = 8;
                data.activeState = 0;
                // 如果是自定义构件
                if (data.typeId === "comp") {
                    this.componentShowHide(data.uuid);
                    return;
                }
                this.updateOrder();
            }
        },
        // 自定义构件显示隐藏
        componentShowHide(uuid) {
            const lableVisibility = this.leafInfo.activeState == 1 ? false : true;
            controlComShowOrHide({comId: uuid, taskId: this.data.taskId,lableVisibility}).then((res) => {
                this.$message.success(res.message);
            });
        },
        // action事件
        updateEdit(obj) {
            let params = {
                taskid: this.data.taskId,
                ...obj
            }
            doAction(params).then((res) => {
                this.$message.success(res.message)
            })
        },
    }
};
</script>
<style lang="less" scoped>
.search {
    margin: 10px;
}

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
}
</style>
