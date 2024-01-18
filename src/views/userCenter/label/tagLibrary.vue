<!-- 标签库 -->
<template>
    <Drawer ref="Drawer" title="标签批注素材库" direction="ltr" @onClose="close">
        <Tab v-model="levels.tab1Index" :data="tabList" @onTab="onTab" v-show="levels.level ===1" />
        <!-- 点击到二级构件 -->
        <div class="level2" v-if="levels.level ===2">
            <span @click="back" class="backLevel1"><i class="el-icon-arrow-left"></i>{{levels.groupName}}</span> / <span class="level2Item">{{levels.tabName}}</span>
        </div>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="searchParam.name" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search">
            </el-input>
            <el-button v-if="levels.tab1Index===1" class="button blueBtn1" 
            type="primary" icon="el-icon-plus" size="mini" @click="createGroup(levels.level ===1?'新建分组':'新建标签样板')">{{levels.level ===1?'新建分组':'新建'}}</el-button>
        </div>
        <!-- 内容 -->
        <div class="content">
            <div class="contentItem" v-for="(item,index) in contentList" :key="index">
                <el-image class="img" :src="item.tagUrl" lazy @click="toLevel2(item)"></el-image>
                <div>{{item.name}}</div>
                <div class="iconBottom" v-if="levels.tab1Index ===1">
                    <i class="el-icon-edit editIcon" @click.stop="createGroup(levels.level ===1?'编辑分组':'编辑标签样板',item)"></i>
                    <i class="el-icon-delete greyIcon" @click.stop="deleteGroup(item)"></i>
                </div>
            </div>
            <el-empty :image="require('@/assets/noData.png')" :image-size="100" v-if="!contentList.length"></el-empty>
        </div>
        <!-- 分页 -->
        <Pagination class="modelPage" layout="prev, pager, next" :pagerCount="5" :limit.sync="searchParam.pageSize" 
        :total="contentList.length" :page="searchParam.pageNum" @pagination="pagination" />
        <!-- 新增、编辑分组 -->
        <DialogTagGroup ref="DialogTagGroup"/>
        <!-- 新增、编辑标签 -->
        <DialogTag ref="DialogTag" :groupList="groupList" :data="data"/>
    </Drawer>
</template>

<script>
import { throttle } from 'lodash'
import { listPublicTag, listUserTagGroup, deleteUserTag, listUserTagByGroupId, addTag } from '@/api/resource/tag.js'
import { EventBus } from '@/utils/bus.js'
import Drawer from '@/components/Drawer/index.vue'
import Tab from "@/components/Tab/index.vue";
import DialogTagGroup from "@/views/projectManage/resource/components/DialogTagGroup.vue";
import DialogTag from "./DialogTag.vue";
import Pagination from "@/components/Pagination/index.vue";
export default {
    components: { Drawer, Tab, DialogTagGroup, Pagination, DialogTag },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            showDrawer: false,//是否显示
            searchParam:{
                pageSize: 18,
                pageNum: 1
            },
            tabList:[
                {
                    name: "公共库",
                },
                {
                    name: "个人库",
                }
            ],
            levels: {
                tabName: "公共库",
                groupName: "",
                level: 1,
                groupId: null,
                tab1Index: 0
            }, //构件组名称,tab名称,默认一级
            contentList: [],
            groupList: [],//一级数据，二级编辑换组使用
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    destroyed () {
        EventBus.$off('eventTool')
    },
    methods: {
        show() {
            this.showDrawer = true
            this.$refs.Drawer.show()
            this.getList()
        },
        close() {
            this.showDrawer = false
            this.$refs.Drawer.hide()
            if(!this.$parent.$refs.Label.showDrawer){
                EventBus.$emit('eventTool', 'label')
            }
        },
        onTab:throttle(function(e) {
            this.levels = this.$options.data().levels
            this.levels.tab1Index = e.index;
            setTimeout(()=>{
                this.getList()
            },500)
        }),
        // 点击返回第一级
        back() {
            this.levels.level = 1;
            this.getList()
        },
        // 点击去二级
        toLevel2(item){
            if (this.levels.level === 1) {
                this.searchParam = this.$options.data().searchParam;
                this.levels.level = 2;
                this.levels.groupName = item.name;
                this.levels.groupId = item.tagId
                if(this.levels.tab1Index ===1){
                    this.getTagList(item.tagId)
                }else{
                    this.contentList = item.children || []
                }
                return
            }
            if(this.levels.level === 2){
                let newUrl = item.tagUrl && item.tagUrl.substring(item.tagUrl.lastIndexOf("\/") + 1,item.tagUrl.length)
                let tagGroupId = this.$parent.$refs.Label.activeTree?.isFolder === '1' ? this.$parent.$refs.Label.activeTree?.id : ''
                let data = {
                    taskId: this.data.taskId,
                    type: item.type,
                    tagName: item.name,
                    tagUrl: ['anchorCustomize','customize','customizeInWorld','default','anchor'].includes(item.type) ? newUrl : '',
                    tagGroupId
                }
                if(['anchorCustomize','customize','customizeInWorld'].includes(item.type)){
                    data = {
                        ...data,
                        tagStyleId: item.tagInfo.tagStyleId
                    }
                } else if(['webui','webui3d'].includes(item.type)){
                    data = {
                        ...data,
                        url: item?.tagInfo?.url || 'https://www.ourbim.com',
                        iconSize: item?.tagInfo?.iconSize,
                        color: this.rgbaToHex(item?.tagInfo?.color)
                    }
                }else {
                    data = {
                        ...data,
                        iconSize: item?.tagInfo?.iconSize,
                    }
                }
                this.$parent.hideTool(true);
                this.$parent.escTitle = '结束添加标签'
                addTag(data).then(()=>{
                    this.$parent.$refs.Label.reloadTree()
                }).catch(()=>{
                    this.$parent.hideTool(false);
                })
                return
            }
        },
        rgbaToHex(rgba){
            if(!rgba) return ''
            if(rgba.indexOf('#')>-1){
                return rgba
            }
            var values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(',');
            var a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
        },
        // 获取分组下的标签
        getTagList(groupIds){
            listUserTagByGroupId({ groupIds }).then(res=>{
                this.contentList = res.data || []
            })
        },
        getList(){
            if(this.levels.level !==1) return
            switch (this.levels.tab1Index) {
                case 0:
                    this.getPublic()
                    break;
                case 1:
                    this.getUserGroup()
                    break;

                default:
                    break;
            }
        },
        // 获取公共标签库
        getPublic(){
            listPublicTag().then(res=>{
                this.contentList = res.data
            })
        },
        // 获取个人库分组
        getUserGroup(){
            listUserTagGroup({...this.searchParam, userId: this.$route.query.userId}).then(res=>{
                this.contentList = res.data
                this.groupList = res.data
            })
        },
        // 分页
        pagination(e) {
            this.pages.page = e.pageIndex;
            this.pages.pageSize = e.pageSize;
            this.getList()
        },
        createGroup(title, row = {}) {
            let newRow = JSON.parse(JSON.stringify(row))
            switch (title) {
                case '新建分组': case '编辑分组':                   
                    this.$refs.DialogTagGroup.show(title, newRow);
                    break;
                case '新建标签样板': case '编辑标签样板':                   
                    this.$refs.DialogTag.show(title,  { ...newRow, parentId: this.levels.groupId });
                    break;
            
                default:
                    break;
            }
        },
        // 删除组/标签
        deleteGroup(row) {
            this.$confirm(`删除【${row.name}】后无法恢复，确认是否删除？`, "删除",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning",
                }
            )
                .then(() => {
                    deleteUserTag({ tagId: row.tagId }).then(()=>{
                        if(row.parentId){
                            this.getTagList(row.parentId)
                        }else{
                            this.getList()
                        }
                        this.$message.success('删除成功！')
                    })
                })
                .catch(() => {});
        },
    }
}
</script>
<style lang="less" scoped>

.level2 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    padding: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    i {
        margin-right: 5px;
        cursor: pointer;
    }
    .level2Item {
        color: #706c65;
    }
    .backLevel1{
        cursor: pointer;
    }
}
.content {
    overflow: auto;
    padding: 0 12px;
    height: calc(100vh - 200px);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 10px;
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
            background: #28292E;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/.el-image__error, /deep/.el-image__inner, /deep/.el-image__placeholder{
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
            }
        }
        > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .iconBottom {
            position: absolute;
            bottom: 24px;
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
</style>