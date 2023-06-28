<!-- 图纸管理 -->
<template>
    <div class="box" v-loading="loading">
        <div class="boxHeader">
            <div class="boxHeaderTitle">您共有<span>{{total}}</span>个项目</div>
            <div>
                <!-- <el-badge :value="uploadGISNum" :hidden="!uploadGISNum"> -->
                    <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="uploadCAD">上传图纸</el-button>
                <!-- </el-badge> -->
            </div>
        </div>
        <el-table :data="tableData">
            <el-table-column prop="fileName" label="图纸名称" />
            <el-table-column prop="userFileId" label="图纸ID" />
            <el-table-column prop="addTime" label="上传日期" />
            <el-table-column prop="fileSize" label="大小">
                <template slot-scope="scope">
                    <span>{{ scope.row.fileSize }} M</span>
                </template>
            </el-table-column>
            <el-table-column prop="extand" label="图纸类型" />
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <span class="status" :class="scope.row.fileStatus === '1' ? 'status' : scope.row.fileStatus === '2' ? 'status3' : 'status1'">{{ status[scope.row.fileStatus] }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <div class="operateBtn">
                        
                        <el-button class="blueBtn" type="primary" v-if="scope.row.fileStatus === '1'" @click="toProject(scope.row)">打开图纸</el-button>
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon-more"></i>
                            </span>
                            
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="editorCAD('编辑',scope.row)">编辑</el-dropdown-item>
                               
                                <el-dropdown-item v-if="scope.row.status==2&&scope.row.isSingle==='true'" @click.native="onCopy(scope.row.fileUrl)">复制URL</el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.status==2">分享</el-dropdown-item>
                                <el-dropdown-item @click.native="downLoad(scope.row)">下载</el-dropdown-item>
                                <el-dropdown-item :divided="scope.row.status==2" @click.native="deleteRow(scope.row)">删除</el-dropdown-item>
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
        <DragUpload ref="DragUpload" :limit="null" accept=".dwg,.dxf,.svg"  numType="uploadCADNum" @getFile="getFileDrag" @onSuccess="getList">
        </DragUpload>
    </div>
</template>

<script>
import { Getuserid } from "@/store/index.js"
import { getList, deleteList, downLoadCAD } from "@/api/CADList.js"
import DialogsProject from "./dialogsProject.vue"
import DragUpload from "@/components/Upload/dragUploadCAD.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { DragUpload, Pagination, DialogsProject },
    data() {
        return {
            loading: false,
            tableData: [],
            total: 0,
            pages: {
                pageNo: 1,
                pageSize: 20
            },
            status: {
                0: "转换中",
                1: "转换完成",
                2: "转换失败",
                // 4: "删除中",
                // 5: "删除失败",
            },
            form: {},
            timer: null //轮询
        }
    },
    // computed: {
    //     uploadGISNum() {
    //         return this.$store.state.uploadGISNum;
    //     },
    // },
    created() {
        this.getList()
    },
    destroyed() {
        window.clearInterval(this.timer)
    },
    methods: {
        
        editorCAD(title, row = {}) {
            this.$refs.DialogsProject.show(title, row)
        },
    
        uploadCAD() {
            this.form = this.$options.data().form
            this.$refs.DragUpload.show("上传图纸")
        },
    
        getList(isLoading = true) {
            // 轮询的时候不需要这个加载状态
            if (isLoading) {
                this.loading = true
            }

            const params = {
                ...this.pages,
                userId: Getuserid()
            }
            getList(params).then((res) => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data
                    this.total = this.tableData.length
                    this.watchStatus()
                } else {
                    this.tableData = []
                    this.total = 0
                }
                this.loading = false
            }).catch(()=>{
                this.loading = false
            })
        },

        watchStatus() {
            this.tableData.some(item => {
                if (item.fileStatus === '0') {
                    setTimeout(() => {
                        this.getList(false)
                    }, 2000)
                    return true
                }
            })
        },

        // 分页
        handlePageChange(data) {
            this.pages.pageNo = data.pageIndex
            this.pages.pageSize = data.pageSize
            this.getList()
        },

        // 上传图纸数据
        getFileDrag(file, callback) {
            callback({
                ...this.form,
                fileUpload: file,
                userId: Getuserid(),
                toType: 'dxf',
                url: "/CADFile/uploadFile"
            })
        },
        
        // 复制URL
        onCopy(url){
            this.$copyText(url).then(e => {
                this.$message.success("链接复制成功！")
            },e => {
                this.$message.error("复制失败！")
            })
        },

        downLoad(row){
            const params = {
                userId: row.userId,
                userFileId: row.userFileId
            }
            downLoadCAD(params).then(res => {
                if (res.data?.message) {
                    window.location.replace(res.data.message)
                } else {
                    this.$message.error("图纸下载失败")
                }
            })
        },

        deleteRow(row){
            this.$confirm(`删除【${row.fileName}】项目后无法恢复，确认是否删除？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning'
            }).then(() => {
                const params = {
                    userFileId: row.userFileId,
                    userId: Getuserid()
                }
                deleteList(params).then(()=>{
                    this.$message.success("删除成功！")
                    this.getList()
                })
            }).catch(() => {})
        },

        toProject(row){
            const splitArr = row.filePath.split('/')
            const fileName = splitArr[splitArr.length - 1].split('.dxf')[0]
            const url = `https://www.ourbim.com/bim_CAD/?file=${fileName}`
            // const url = `http://127.0.0.1:5174/bim_CAD/?file=${fileName}`
            window.open(url)
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

.status1 {
    color: #FF8434;
    &::before {
        background: #FF8434;
    }
}
.status2 {
    color: #405560;
    &::before {
        background: #14DDA6;
    }
}
.status3, .status5 {
    color: #E02020;
    &::before {
        background: #E02020;
    }
}
.status4{
    color: #8692A1;
    &::before {
        background: #8692A1;
    }
}

/deep/ .el-table th.el-table__cell {
    background-color: #00aaf0;
}
</style>