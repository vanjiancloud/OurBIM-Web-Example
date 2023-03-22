<!-- GIS数据服务 -->
<template>
    <div class="box">
        <div class="boxHeader">
            <div class="boxHeaderTitle">您共有<span>9</span>个项目</div>
            <div>
                <el-button icon="el-icon-plus" class="bluePlainBtn" plain type="primary" @click="AddGISProgect('添加')">新建GIS服务项目</el-button>
                <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="uploadGIS">上传GIS数据</el-button>
            </div>
        </div>
        <el-table :data="tableData">
            <el-table-column prop="gisServerName" label="项目名称" />
            <el-table-column prop="id" label="项目ID" />
            <el-table-column prop="createTime" label="上传日期" />
            <el-table-column prop="fileSize" label="大小" />
            <el-table-column prop="layerType" label="数据类型" />
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <span class="status" :class="{'status1':scope.row.status==1,'status2':scope.row.status==2,'status3':scope.row.status==3,'status4':scope.row.status==4,'status5':scope.row.status==5}">{{ status[scope.row.status] }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <div class="operateBtn">
                        <el-button class="blueBtn" type="primary" :disabled="scope.row.status!=2">进入项目</el-button>
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="AddGISProgect('编辑',scope.row)">编辑</el-dropdown-item>
                                <el-dropdown-item>复制URL</el-dropdown-item>
                                <el-dropdown-item>分享</el-dropdown-item>
                                <el-dropdown-item>下载</el-dropdown-item>
                                <el-dropdown-item divided>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" :page.sync="pages.pageNo" :limit.sync="pages.pageSize" @pagination="handlePageChange" />
        <!-- 新建GIS服务项目 -->
        <DialogsProject ref="DialogsProject" />
        <!-- 上传GIS数据 -->
        <DragUpload ref="DragUpload" accept="application/x-zip-compressed" @getFile="getFileDrag" @onSuccess="onSuccessDrag" />
    </div>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { getList, uploadGIS } from "@/api/GISList.js";
import DialogsProject from "./dialogsProject.vue";
import DragUpload from "@/components/Upload/dragUpload.vue";
import Pagination from "@/components/Pagination";
export default {
    components: { DialogsProject, DragUpload, Pagination },
    props: {},
    data() {
        return {
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
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.getList();
    },
    methods: {
        // 新建GIS服务项目
        AddGISProgect(title, row = {}) {
            this.$refs.DialogsProject.show(title, row);
        },
        // 上传GIS数据
        uploadGIS() {
            this.$refs.DragUpload.show("上传GIS");
        },
        // 获取列表
        getList() {
            getList({ ...this.pages, userId: Getuserid() }).then((res) => {
                this.tableData = res.data.list;
                this.total = res.data.total;
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
                fileUpload: file,
                userId: Getuserid(),
                url: "/appli/uploadGISLayerFile",
            });
        },
        // 成功上传GIS数据
        onSuccessDrag(){
            this.getList();
        }
    },
};
</script>
<style lang="less" scoped>
.operateBtn {
    display: flex;
    align-items: center;
    justify-content: center;
}
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
.status {
    position: relative;
    &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #14dda6;
        border-radius: 100%;
        margin-right: 6px;
    }
}

.status1{
    color: #FF8434;
    &::before{
        background: #FF8434;
    }
}
.status2{
    color: #405560;
    &::before{
        background: #14DDA6;
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
</style>