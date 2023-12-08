<!-- GIS数据服务 -->
<template>
    <List v-loading="loading" @change="onChange">
        <template slot="title">
            <div class="boxHeader">
                <div class="boxHeaderTitle">您共有<span>{{total}}</span>个项目</div>
                <div>
                    <el-button style="margin-right:20px" icon="el-icon-plus" class="bluePlainBtn" plain type="primary" @click="AddGISProgect('添加')">新建GIS服务项目</el-button>
                    <!-- 上传GIS数据的关闭弹窗后显示正在上传的个数  -->
                    <el-badge :value="uploadGISNum" :hidden="!uploadGISNum">
                        <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="uploadGIS">上传GIS数据</el-button>
                    </el-badge>
                </div>
            </div>
        </template>
        <!-- 表格 -->
        <el-table :data="tableData" v-if="isList">
            <el-table-column prop="gisServerName" label="项目名称" />
            <el-table-column prop="gisId" label="项目ID" />
            <el-table-column prop="createTime" label="上传日期" />
            <el-table-column prop="fileSize" label="大小">
                <template slot-scope="scope">
                    {{ scope.row.fileSize=== '\\--' ? scope.row.fileSize : scope.row.fileSize + 'MB' }}
                </template>
            </el-table-column>
            <el-table-column prop="layerType" label="数据类型" />
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <span class="status" :class="{'status1':scope.row.status==1,'status3':scope.row.status==3,'status4':scope.row.status==4,'status5':scope.row.status==5}">{{ status[scope.row.status] }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="122">
                <template slot-scope="scope">
                    <div class="flexBetween">
                        <el-button type="text" class="blueText" @click="toProject(scope.row)" :disabled="scope.row.status!=2">进入项目</el-button>
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon-more"></i>
                            </span>
                            <!-- scope.row.status==2只有发布完成才能操作 -->
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="scope.row.status==2" @click.native="AddGISProgect('编辑',scope.row)">编辑</el-dropdown-item>
                                <!-- isSingle=true单个GIS图层的时候才有url -->
                                <el-dropdown-item v-if="scope.row.status==2&&scope.row.isSingle==='true'" @click.native="onCopy(scope.row.fileUrl)">复制URL</el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.status==2">分享</el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.status==2" @click.native="uploadRow(scope.row)">下载</el-dropdown-item>
                                <el-dropdown-item :divided="scope.row.status==2" @click.native="deleteRow(scope.row)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 盒子 -->
        <div class="listBox" v-if="!isList">
            <div class="listItem" v-for="(item,index) in tableData" :key="index">
                <el-image :src="item.thumbnail" class="defaultImg">
                    <div slot="error" class="image-slot">
                        <img :src="require('@/assets/default/listGis.png')"/>
                    </div>
                </el-image>
                <div class="title">{{ item.gisServerName }}</div>
                <div class="flexBetween">
                    <div class="type">类型：{{ item.layerType }}</div>
                    <div class="status" :class="{'status1':item.status==1,'status2':item.status==2,'status3':item.status==3,'status4':item.status==4,'status5':item.status==5}">{{ status[item.status] }}</div>
                </div>
                <div class="flexBetween">
                    <div>
                        <el-button class="blueBtn" type="primary" size="small" :disabled="item.status!=2" @click="toProject(item)">进入项目</el-button>
                    </div>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="item.status==2" @click.native="AddGISProgect('编辑',item)">编辑</el-dropdown-item>
                            <el-dropdown-item v-if="item.status==2&&item.isSingle==='true'" @click.native="onCopy(item.fileUrl)">复制URL</el-dropdown-item>
                            <el-dropdown-item v-if="item.status==2">分享</el-dropdown-item>
                            <el-dropdown-item v-if="item.status==2" @click.native="uploadRow(item)">下载</el-dropdown-item>
                            <el-dropdown-item :divided="item.status==2" @click.native="deleteRow(item)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <el-empty v-if="!isList&&!tableData.length" :image="require('@/assets/noData.png')" :image-size="100"></el-empty>
        
        <Pagination :total="total" :page.sync="pages.pageNo" :limit.sync="pages.pageSize" @pagination="handlePageChange" />
        <!-- 新建GIS服务项目 -->
        <DialogsProject ref="DialogsProject" />
        <!-- 上传GIS数据 -->
        <DialogsDrag ref="DialogsDrag" :limit="1" numType="uploadGISNum" @getFile="getFileDrag" @onSuccess="getList" @beforeUpload="beforeUpload">
            <template v-slot:append>
                <el-form :model="form" :rules="rules" ref="form" label-width="130px" class="layerForm">
                    <el-form-item label="服务支持组件：" prop="gisPlugin">
                        <el-select v-model="form.gisPlugin" placeholder="请选择" @change="changeGisPlugin" style="width:100%">
                            <el-option :value="item.key" :label="item.name" v-for="(item,index) in gisPluginList" :key="index" :disabled="item.key==='arcGIS'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="图层类型：" prop="layerType">
                        <el-select v-model="form.layerType " placeholder="请选择" style="width:100%">
                            <el-option :value="item.key" v-for="(item,index) in layerTypeList" :key="index">{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="GIS信息：" required v-if="form.layerType==='3dtiles'">
                        <el-col :span="7">
                            <el-form-item prop="longitude">
                                <el-input v-model="form.longitude" placeholder="经度" v-only-number="{min:-180,max:180,precision:8}"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="GISMark" :span="1">°</el-col>
                        <el-col :span="7">
                            <el-form-item prop="latitude">
                                <el-input v-model="form.latitude" placeholder="纬度" v-only-number="{min:-90,max:90,precision:8}"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="GISMark" :span="1">°</el-col>
                        <el-col :span="7">
                            <el-form-item prop="altitude">
                                <el-input v-model="form.altitude" placeholder="海拔高度"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="GISMark" :span="1">m</el-col>
                    </el-form-item> -->
                </el-form>
            </template>
        </DialogsDrag>
    </List>
</template>

<script>
import { gisPluginList, gisLayer } from "./json"
import { getDict } from "@/api/dict.js"
import { Getuserid } from "@/store/index.js";
import { getList, deleteList } from "@/api/GISList.js";
import DialogsProject from "./dialogsProject.vue";
import DialogsDrag from "@/components/Upload/DialogsDrag.vue";
import Pagination from "@/components/Pagination";
import List from "@/components/List/index.vue";
export default {
    components: { DialogsProject, DialogsDrag, Pagination, List },
    props: {},
    data() {
        return {
            gisPluginList,
            loading:false,
            isList: true,
            tableData: [],
            total: 0,
            pages: {
                pageNo: 1,
                pageSize: 20,
            },
            status: {
                1: "发布中",
                2: "发布完成",
                3: "发布失败",
                4: "删除中",
                5: "删除失败",
            },
            layerTypeList: [],
            form:{
                gisPlugin: 'cesium'
            },
            rules: {
                gisPlugin: [{ required: true, message: "请选择服务支持组件", trigger: "blur" }],
                layerType: [
                    {
                        required: true,
                        message: '请选择图层类型',
                        trigger: 'blur'
                    }
                ],
                // longitude: [
                //     {
                //         required: true,
                //         message: '请输入经度(-180°~180°)',
                //         trigger: 'blur'
                //     }
                // ],
                // latitude: [
                //     {
                //         required: true,
                //         message: '请输入纬度(-90°~90°)',
                //         trigger: 'blur'
                //     }
                // ],
                // altitude: [
                //     {
                //         required: true,
                //         message: '请输入海拔高度',
                //         trigger: 'blur'
                //     }
                // ],
            },
            timer: null //轮询
        };
    },
    watch: {},
    computed: {
        uploadGISNum() {
            return this.$store.state.uploadGISNum;
        },
    },
    created() {},
    mounted() {
        this.getList();
        // this.getType()
        this.setTime()
        this.changeGisPlugin(this.form.gisPlugin)
    },
    destroyed() {
        window.clearInterval(this.timer)
    },
    methods: {
        // 切换服务组件
        changeGisPlugin(val){
            this.form.layerType = ''
            this.layerTypeList = gisLayer.filter(e => { return e.type === val })
        },
        onChange(e){
            this.isList = e
        },
        // 轮询  删除中和发布中才轮询
        setTime(){
            this.timer = window.setInterval(() => {
                setTimeout(() => {
                    let res = this.tableData.find(e=>[1,4].includes(+e.status))
                    if(res){
                        this.getList()
                    }
                },0)
            },10000)
        },
        // async getType(){
        //     this.layerTypeList = (await getDict('layerType')).data
        // },
        // 新建GIS服务项目
        AddGISProgect(title, row = {}) {
            this.$refs.DialogsProject.show(title, JSON.parse(JSON.stringify(row)));
        },
        // 上传GIS数据
        uploadGIS() {
            this.form = this.$options.data().form
            this.$refs.DialogsDrag.show("上传GIS");
        },
        // 获取列表
        getList() {
            this.loading = true
            getList({ ...this.pages, userId: Getuserid() }).then((res) => {
                this.tableData = res.data.list;
                this.total = res.data.total;
                this.loading = false
            }).catch(()=>{
                this.loading = false
            });
        },
        // 分页
        handlePageChange(data) {
            this.pages.pageNo = data.pageIndex;
            this.pages.pageSize = data.pageSize;
            this.getList();
        },
        // 上传GIS数据
        getFileDrag(file, callback) {
            callback({
                ...this.form,
                fileUpload: file,
                userId: Getuserid(),
                url: "/appli/uploadGISLayerFile",
            });
        },
        // 上传GIS数据验证
        beforeUpload(callback){
            this.$refs.form.validate((valid) => {
                if (!valid){
                    callback(true)
                    return false;
                }
            })
        },
        // 复制URL
        onCopy(url){
            this.$copyText(url).then(e=>{
                this.$message.success("链接复制成功！");
            },e=>{
                this.$message.error("复制失败！")
            })
        },
        // 下载
        uploadRow(row){
            
        },
        // 删除
        deleteRow(row){
            this.$confirm(`删除【${row.gisServerName}】项目后无法恢复，确认是否删除？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning'
            }).then(() => {
                deleteList({gisId:row.gisId,userId:Getuserid()}).then(()=>{
                    this.$message.success("删除成功！");
                    this.getList();
                })
            }).catch(() => {});
        },
        toProject(row){
            this.$message.info('功能未实现')
            console.log('🚀🚀🚀',row);
        }
    },
};
</script>
<style lang="less" scoped>
.el-dropdown {
    .el-dropdown-link {
        cursor: pointer;
        margin: 0 10px;
        i {
            font-size: 22px;
            color: #999999;
        }
    }
}

.status1{
    color: #FF8434;
    &::before{
        background: #FF8434;
    }
}
.status3,.status5{
    color: #E02020;
    &::before{
        background: #E02020;
    }
}
.status4{
    color: #8692A1;
    &::before{
        background: #8692A1;
    }
}
.GISMark{
    text-align: center;
}
.layerForm{
    border-top: 1px solid #f5f5f5;
    padding-top: 20px;
    margin: 20px 0;
}
</style>