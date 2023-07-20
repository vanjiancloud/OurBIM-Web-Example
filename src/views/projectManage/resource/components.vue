<template>
    <List @change="onChange" style="padding: 10px 24px 20px 24px;" v-loading="loading">
        <template slot="title">
            <div class="boxHeader">
                <div class="boxHeaderTitle" v-if="isGroup">您共有<span>{{total}}</span>个构件分组</div>
                <div class="boxHeaderTitle" v-if="!isGroup">当前分组有<span>{{total}}</span>个构件</div>
                <div>
                    <el-button class="blueBtn" type="primary" @click="add()" v-if="isGroup">新建分组</el-button>
                    <el-badge :value="uploadCom" :hidden="!uploadCom" v-if="!isGroup">
                        <el-button class="blueBtn" type="primary" @click="uploadCompents()">上传构件</el-button>
                    </el-badge>
                </div>
            </div>
        </template>
        <!-- 表格--分组 -->
        <el-table :data="tableData" @cell-click="cellClick" v-if="isList&&isGroup" :row-style="{'cursor': 'pointer'}">
            <el-table-column prop="groupName" label="分组名称" />
            <el-table-column prop="id" label="分组ID" />
            <el-table-column prop="createTime" label="创建日期" />
            <el-table-column prop="num" label="包含构件数量" />
            <el-table-column prop="isGroup" label="类型">
                <template slot-scope="scope">
                    {{ scope.row.isGroup === '1' ? '构件分组' : '构件' }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="add(scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 子构件 -->
        <el-table :data="tableData" v-if="isList&&!isGroup" :header-cell-style="{'background': '#D0DCE3','color':'#333333'}">
            <el-table-column label="构件名称">
                <template slot-scope="scope">
                    {{ scope.row.ourbimComponentInfo&&scope.row.ourbimComponentInfo.comName }}
                </template>
            </el-table-column>
            <el-table-column label="构件ID">
                <template slot-scope="scope">
                    {{ scope.row.ourbimComponentInfo&&scope.row.ourbimComponentInfo.comId }}
                </template>
            </el-table-column>
            <el-table-column label="上传时间">
                <template slot-scope="scope">
                    {{ scope.row.ourbimComponentInfo&&scope.row.ourbimComponentInfo.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="文件大小">
                <template slot-scope="scope">
                    {{ scope.row.ourbimComponentInfo&&scope.row.ourbimComponentInfo.fileLongSize }}MB
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="类型">
                <template slot-scope="scope">
                    {{ scope.row.isGroup === '1' ? '构件分组' : '构件' }}
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.ourbimComponentInfo&&status[scope.row.ourbimComponentInfo.comStatus] }}
                        <!-- 转换失败 -->
                        <i class="el-icon-error error" v-if="scope.row.ourbimComponentInfo && scope.row.ourbimComponentInfo.comStatus === '3'"></i>
                    </div>
                    <!-- 转换中 -->
                    <el-progress
                        :text-inside="true"
                        :percentage="scope.row.ourbimComponentInfo.progress"
                        :show-text="true"
                        :stroke-width="13"
                        color="#00aaf0"
                        v-if="scope.row.ourbimComponentInfo && scope.row.ourbimComponentInfo.comStatus === '1' && scope.row.ourbimComponentInfo.progress !== 100"
                    >
                    </el-progress>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="openCom(scope.row)">打开构件</el-button>
                    <el-button type="text" class="blueText" @click.stop="editCom(scope.row)">编辑</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 盒子 -->
        <div class="listBox" v-if="!isList">
            <div class="listItem" v-for="(item,index) in tableData" :key="index" @click="item.isGroup === '1' ? cellClick(item):''" :style="{cursor:item.isGroup === '1'?'pointer':'auto'}">
                <el-image :src="item.isGroup === '1' ? item.url : item.ourbimComponentInfo.comUrl" class="defaultImg">
                    <div slot="error" class="image-slot">
                        <img :src="require('@/assets/default/list.png')"/>
                    </div>
                </el-image>
                <div class="title">{{ item.isGroup === '1'?item.groupName:item.ourbimComponentInfo.comName }}</div>
                <div class="flexBetween">
                    <div class="type">类型：{{ item.isGroup === '1' ? '构件分组' : '构件' }}</div>
                    <div class="status" v-if="item.isGroup === '0'">{{ status[item.ourbimComponentInfo.comStatus] }}</div>
                </div>
                <div class="flexBetween">
                    <div>
                        <el-button class="blueBtn" type="primary" size="small" @click.stop="item.isGroup === '1' ? add(item) : editCom(item)">编辑</el-button>
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

        <!-- 新建\编辑分组 -->
        <DialogsComGroup ref="DialogsComGroup"/>
        <!-- 编辑构件 -->
        <DialogsCom ref="DialogsCom" :parentData="parentData"/>
        <!-- 上传构件 -->
        <DragUpload ref="DragUpload" numType="uploadCom" @getFile="getFileDrag" @onSuccess="getList(parentId)"/>
    </List>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { list, deleteUserCom } from '@/api/resource/components.js'
import List from "@/components/List/index.vue";
import DialogsComGroup from './components/DialogsComGroup.vue'
import DragUpload from "@/components/Upload/dragUpload.vue";
import DialogsCom from './components/DialogsCom.vue'
export default {
    components: { List, DialogsComGroup, DragUpload, DialogsCom },
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
            parentData: [],//一级数据，二级编辑换组使用
            parentId: '',//父级id
            isGroup: true, //是否是分组
            status: {
                0: "正在同步",
                1: "转换中",
                2: "转换完成",
                3: "转换失败",
                4: "文件损坏",
                5: "删除中",
                6: "升级中",
            }
        };
    },
    watch: {},
    computed: {
        uploadCom() {
            return this.$store.state.uploadCom
        }
    },
    created() {
        this.getList()
    },
    mounted() { },
    methods: {
        onChange(e){
            this.isList = e
        },
        // 返回一级
        back(){
            this.getList()
            this.isGroup = true
        },
        getList(parentId='god'){
            this.$emit('update:groupName','')
            let params = {
                userId: Getuserid(),
                parentId
            }
            this.loading = true
            list(params).then(res=>{
                this.loading = false
                this.isGroup = parentId === 'god' ? true : false
                this.tableData = res.data&&res.data.ourbimComponentInfoList || []
                this.$emit('update:total',this.tableData.length)
                if(parentId!=='god' && !res.data){
                    return this.$message.warning(res.message)
                }
                if(parentId==='god'){
                    this.parentData = res.data.ourbimComponentInfoList || []
                }
                this.parentId = res.data?.parentId
            }).catch(()=>{
                this.loading = false
            })
        },
        // 新建、编辑
        add(row={}){
            this.$refs.DialogsComGroup.show({groupId: this.parentId, ...JSON.parse(JSON.stringify(row))})
        },
        // 删除,删除构件
        deleteRow(row){
            this.$confirm(`此操作将删除该【${this.isGroup?row.groupName:row.ourbimComponentInfo.comName}】${this.isGroup?'分组':'构件'}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let params = {
                    userId: Getuserid(),
                    comId: row.isGroup==='0' ? row.ourbimComponentInfo.comId : '',
                    groupId: row.isGroup==='1' ? row.id : ''
                }
                deleteUserCom(params).then(()=>{
                    this.$message.success('删除成功！')
                    this.getList(this.isGroup ? 'god' : row.parentId)
                })
            }).catch(() => {});
        },
        // 点击进入详情
        cellClick(row){
            if(this.isGroup&&row.isGroup==='1'){               
                this.getList(row.id)
                this.parentId = row.id
                this.$emit('update:groupName',row.groupName)
            }
        },
        // 上传构件
        uploadCompents(){
            this.$refs.DragUpload.show('上传构件')
        },
        // 上传构件参数
        getFileDrag(file, callback) {
            callback({
                userId: Getuserid(),
                groupId: this.parentId,
                fileUpload: file,
                url: "/comControl/uploadUserCom",
            });
        },
        // 编辑构件
        editCom(row){
            let data = {
                comName: row.ourbimComponentInfo.comName,
                fileUpload: row.ourbimComponentInfo.comUrl,
                groupId: row.parentId,
                userId: Getuserid(),
                comId: row.ourbimComponentInfo.comId
            }
            this.$refs.DialogsCom.show(data)
        },
        // 打开构件
        openCom(row){

        }
    }
};
</script>
<style lang="less" scoped>
.error{
    color: red;
    font-size: 20px;
}
</style>