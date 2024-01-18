<template>
    <Drawer ref="Drawer" title="标签" direction="rtl" @onClose="close" class="tag-tree">
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="searchName" @click.native.stop @change="search" @keyup.enter="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"></el-input>
            <el-tooltip class="item" effect="dark" content="添加标签" placement="top">
                <img src="@/assets/images/tag/1.png" @click="saveTag(0)" alt="" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加标签组文件" placement="top">
                <img src="@/assets/images/tag/2.png" @click="saveTag(1)" alt="" />
            </el-tooltip>
        </div>
        <!-- 标签树 -->
        <div class="tree-content">
            <el-tree
                ref="refTag"
                class="tree"
                :class="{treeHeight:data.clickTagData}"
                :data="DataTagTree"
                :props="propsTag"
                :expand-on-click-node="false"
                :highlight-current="true"
                :default-expanded-keys="expandedKeys"
                empty-text="暂无数据"
                :filter-node-method="filterNode"
                node-key="id"
                :load="loadTag"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
                lazy
            >
                <div
                    class="tag-slot" :class="{'tree-select': activeTree && data.id === activeTree.id}"
                    slot-scope="{ node, data }"
                >
                    <SingleUpload v-model="data.tagUrl" :autoUpload="false" :deleteIcon="false" :showImg="false" accept="image/png" @onChangeFile="onChangeFile($event,data)"></SingleUpload>
                    <div class="label-tag" @click="handleTag(data)">{{ node.label }}</div>
                    <div class="handle-tag">
                        <img src="@/assets/images/tag/5.png" @click="editTag(data)" alt="" />
                        <img
                            v-if="data.isFolder === '0'"
                            @click="locationTag(node)"
                            src="@/assets/images/tag/7.png"
                            alt=""
                        />
                        <img src="@/assets/images/tag/6.png" @click="removeTag(node)" alt="" />
                    </div>
                </div>
            </el-tree>
            <!-- 编辑标签 -->
            <EditTag ref="EditTag" :data="data" @onSuccess="reloadTree()" style="height: 48.5%;overflow: auto;"/>
        </div>
        <!-- 编辑标签名称 -->
        <DialogEditTagName ref="DialogEditTagName" :data="data" @onSuccess="editTagName"/>
        <DialogUploadImg ref="DialogUploadImg" :data="data"/>
    </Drawer>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload.vue'
import DialogEditTagName from './DialogEditTagName.vue'
import DialogUploadImg from './DialogUploadImg.vue'
import EditTag from './editTag.vue'
import { addTag, addTagGroup, clickTag, deleteTag, getTagList } from '@/api/resource/tag.js'
import { EventBus } from '@/utils/bus.js'
import Drawer from '@/components/Drawer/index.vue'

export default {
    components: { Drawer, DialogEditTagName, SingleUpload, DialogUploadImg, EditTag },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    watch: {},
    mounted() {},
    data() {
        return {
            showDrawer: false, //是否显示
            searchName: '',
            propsTag: {
                label: 'fileName',
                isLeaf: e => {
                    if (e.isFolder === '1') {
                        return false
                    }
                    if (e.isFolder === '0') {
                        return true
                    }
                }
            },
            DataTagTree: [],
            expandedKeys: [],
            activeTree: null,//选中状态
        }
    },
    destroyed() {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            this.showDrawer = true
            this.$refs.Drawer.show()
            this.reloadTree()
        },
        close() {
            this.showDrawer = false
            this.$refs.Drawer.hide()
            if (!this.$parent.$refs.TagLibrary || !this.$parent.$refs.TagLibrary.showDrawer) {
                EventBus.$emit('eventTool', 'label')
            }
        },
        // 获取标签树
        async listTag(e) {
            let params = {
                taskId: this.data.taskId,
                tagId: e
            }
            let realTag = await getTagList(params).then(res => {
                return res.data || []
            })
            return realTag
        },
        search(e) {
            this.$refs.refTag.filter(e)
        },
        // 节点被展开时触发
        nodeExpand(data,node){
            this.expandedKeys.push(node.data.id)
        },
        // 节点被关闭时触发
        nodeCollapse(data,node){
            let index = this.expandedKeys.indexOf(node.data.id)
            this.expandedKeys.splice(index,1)
        },
        // @description: 新增 0 标签 1 标签集
        saveTag(e) {
            if (e === 0) {
                let params = {
                    taskId: this.data.taskId,
                    tagGroupId: this.activeTree?.isFolder === '1' ? this.activeTree?.id : '',
                }
                addTag(params).then(() => {
                    this.reloadTree()
                    this.$parent.hideTool(true)
                    this.$parent.escTitle = '结束添加标签'
                }).catch(() => {
                    this.$parent.hideTool(false)
                })
            } else {
                let params = {
                    taskId: this.data.taskId,
                    tagGroupId: this.activeTree?.isFolder === '1' ? this.activeTree?.id : '',
                }
                addTagGroup(params).then(() => {
                    this.reloadTree()
                })
            }
        },
        // 编辑标签名称
        editTag(e) {
            this.$refs.DialogEditTagName.show(e)
        },
        // 修改标签锚点弹窗
        onChangeFile(file, row){
            this.$refs.DialogUploadImg.show(file, row)
        },
        // 点击定位到标签
        locationTag(e) {
            let params = {
                taskId: this.data.taskId,
                tagId: e.key
            }
            clickTag(params).then(res => {
                this.$message.success(res.message)
            })
        },
        // 删除标签
        removeTag(node) {
            this.$confirm(`将删除名称为"${node.label}"的数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.activeTree && node.key === this.activeTree.id){
                    this.activeTree = null
                }
                let params = {
                    taskId: this.data.taskId,
                    tagId: node.key
                }
                deleteTag(params).then(() => {
                    this.reloadTree()
                    this.$message.success('删除成功!')
                })
            })
            .catch(() => {})
        },
        // 点击名称选中和取消
        handleTag(data) {
            data.check = !data.check
            this.activeTree = data.check ? data : null
        },
        // 重新加载tree
        reloadTree() {
            this.listTag().then((res) => {
                this.DataTagTree = res
            })
        },
        // 加载子树数据的方法，仅当 lazy 属性为true 时生效
        loadTag(node, resolve) {
            this.listTag(node.key).then(res => {
                res.length&&res.forEach((item) => {
                    //选中聚焦
                    this.$set(item,'check',false)
                });
                return resolve(res)
            })
        },
        // 搜索过滤
        filterNode(value, data) {
            if (!value) return true
            const reamVal = data.fileName.indexOf(value) !== -1
            return reamVal
        },
        // 编辑名称后更新标签信息
        editTagName(){
            if(this.data.clickTagData){
                this.reloadTree();
                this.$refs.EditTag.getAppIdTag();
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search{
    padding-top: 20px;
    .item{
        margin-left: 10px;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.tag-tree {
    .treeHeight{
        height: 49%;
        overflow: auto;
    }
    .tree{
        /deep/ .el-upload {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            background: none;
            border: none;
        }
    }
    /deep/.el-tree-node {
        margin-bottom: 10px;
    }
    .tree-content {
        margin: 0 auto;
        height: ~'calc(100% - 120px)';
        width: ~'calc(100% - 20px)';
        overflow-x: hidden;
        overflow-y: auto;
        .tag-slot {
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;
            .label-tag {
                width: ~'calc(100% - 120px)';
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .handle-tag {
                width: 90px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: absolute;
                right: 0;
                img {
                    margin-left: 10px;
                }
            }
        }
    }
}
.tree-select {
    background: rgba(255, 255, 255, 0.2);
}
</style>
