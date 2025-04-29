<template>
    <List @change="onChange" style="padding: 10px 24px 20px 24px;" v-loading="loading">
        <template slot="title">
            <div class="boxHeader">
                <div class="boxHeaderTitle" v-if="isGroup">您共有<span>{{total}}</span>个标签分组</div>
                <div class="boxHeaderTitle" v-if="!isGroup">当前分组有<span>{{total}}</span>个标签文件</div>
                <div>
                    <el-button class="blueBtn" type="primary" @click="add('新建分组')" v-if="isGroup">新建分组</el-button>
                    <el-badge :value="tagUploadNum" :hidden="!tagUploadNum" v-if="!isGroup">
                        <el-button class="blueBtn" type="primary" @click="addChartlet()">上传标签</el-button>
                    </el-badge>
                </div>
            </div>
        </template>
        <!-- 表格--分组 -->
        <el-table :data="tableData" @cell-click="cellClick" v-if="isList&&isGroup" :row-style="{'cursor': 'pointer'}">
            <el-table-column prop="name" label="分组名称" />
            <el-table-column prop="tagId" label="分组ID" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="childrenCount" label="包含标签数量">
                <template slot-scope="scope">
                    {{ scope.row.childrenCount}}个
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="类型">
                <template slot-scope="scope">
                    <span>标签分组</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="add('编辑分组',scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 标签 -->
        <el-table :data="tableData" v-if="isList&&!isGroup" :header-cell-style="{'background': '#D0DCE3','color':'#333333'}">
            <el-table-column prop="name" label="标签名称" />
            <el-table-column prop="tagId" label="标签ID" />
            <el-table-column prop="createTime" label="上传时间" />
            <el-table-column label="文件大小">
                <template slot-scope="scope">
                    <!-- {{  }}MB -->
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>标签</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="add('编辑标签',scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 盒子 -->
        <div class="listBox" v-if="!isList">
            <div class="listItem" v-for="(item,index) in tableData" :key="index" @click="isGroup ? cellClick(item):''" :style="{cursor:isGroup?'pointer':'auto'}">
                <el-image :src="item.tagUrl" class="defaultImg">
                    <div slot="error" class="image-slot">
                        <img :src="require('@/assets/default/list1.png')"/>
                    </div>
                </el-image>
                <div class="title">{{ item.name }}</div>
                <div class="flexBetween">
                    <div class="type">类型：{{ isGroup ? '标签分组' : '标签' }}</div>
                </div>
                <div class="flexBetween">
                    <div>
                        <el-button class="blueBtn" type="primary" size="small" @click.stop="isGroup ? add('编辑分组',item) : add('编辑标签',item)">编辑</el-button>
                    </div>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="deleteRow(item)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <el-empty v-if="!isList&&!tableData.length" :image="require('@/assets/noData.png')" :image-size="100"></el-empty>

        <Pagination v-if="total" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize" @pagination="handlePageChange" />
        <!-- 新增编辑分组 -->
        <DialogTagGroup ref="DialogTagGroup"/>
        <!-- 上传标签 -->
        <DialogsDrag ref="DialogsDrag" numType="tagUploadNum" accept=".png" @getFile="getFileDrag" @onSuccess="addTag"></DialogsDrag>
    </List>
</template>

<script>
import DialogsDrag from "@/components/Upload/DialogsDrag.vue";
import Pagination from "@/components/Pagination/index.vue";
import { listUserTagGroup, deleteUserTag, listUserTagByGroupId, addUserTag } from '@/api/resource/tag.js'
import List from "@/components/List/index.vue";
import DialogTagGroup from "./components/DialogTagGroup.vue";
export default {
    components: { List, Pagination, DialogTagGroup, DialogsDrag },
    props: {
        total: {
            type: Number,
            default: 0,
            require: true
        },
        groupName: {
            type: String,
            default: '',
            require: true
        },
    },
    data() {
        return {
            loading: false,
            isList: true,
            tableData: [],
            parentId: '',//父级id
            isGroup: true, //是否是分组
            pages: {
                pageSize: 24,
                pageNum: 1
            }
        };
    },
    watch: {},
    computed: {
        userId() {
            return this.$store.state.user.userId
        },
        tagUploadNum() {
            return this.$store.state.tagUploadNum
        }
    },
    created() {},
    mounted() {
        this.getList()
    },
    methods: {
        onChange(e){
            this.isList = e
        },
        // 返回一级
        back(){
            this.getList()
        },
        getList(){
            this.$emit('update:groupName','')
            this.loading = true
            listUserTagGroup({...this.pages, userId: this.userId}).then(res=>{
                this.loading = false
                this.isGroup = true
                this.tableData = res.data || []
                this.$emit('update:total',this.tableData.length)
            }).catch(()=>{
                this.loading = false
            })
        },
        // 分页
        handlePageChange(data) {
            this.pages.pageNo = data.pageIndex
            this.pages.pageSize = data.pageSize
            this.getList()
        },
        // 新建、编辑
        add(title, row={}){
            this.$refs.DialogTagGroup.show(title, JSON.parse(JSON.stringify(row)));
        },
        // 点击进入详情
        cellClick(row, reFresh = false){
            if(this.isGroup || reFresh){
                let data = {
                    groupIds: row.tagId
                }
                listUserTagByGroupId(data).then(res=>{
                    this.tableData = res.data || []
                    this.parentId = row.tagId
                    if(row.name){
                        this.$emit('update:groupName',row.name)
                    }
                    this.$emit('update:total',this.tableData.length)
                    this.isGroup = false
                })
            }
        },
        // 删除组/标签
        deleteRow(row) {
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
                            this.cellClick({ tagId: row.parentId }, true)
                        }else{
                            this.getList()
                        }
                        this.$message.success('删除成功！')
                    })
                })
                .catch(() => {});
        },
        addChartlet(){
            this.$refs.DialogsDrag.show('上传标签文件')
        },
        // 上传构件参数
        getFileDrag(file, callback) {
            callback({
                userId: this.$store.state.user.userId,
                fileUpload: file,
                url: "/tagControl/uploadTagImg",
            });
        },
        // 添加标签
        addTag(e, file){
            let data = {
                name: file.fileName,
                parentId: this.parentId,
                tagUrl: e,
                type: 'default'
            }
            addUserTag(data).then(()=>{
                this.$message.success('添加成功！')
                this.cellClick({ tagId: this.parentId }, true)
            })
        }
    }
};
</script>
<style lang="less" scoped>
.List .subContent .listBox .listItem{
    width: 180px!important;
    flex: initial;
    min-width: initial;
}

</style>