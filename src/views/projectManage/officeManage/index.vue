<template>
    <div class="box">
        <div class="boxHeader">
            <div class="boxHeaderTitle">
                您共有<span>{{ tableData.length }}</span>个项目
            </div>
            <el-badge :value="uploadDoc" :hidden="!uploadDoc">
                <el-button icon="el-icon-upload" class="blueBtn" type="primary" @click="addDoc">上传文档</el-button>
            </el-badge>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" class="table">
            <el-table-column prop="fileName" label="文档名称" width="190"></el-table-column>
            <el-table-column prop="userFileId" label="文档ID"></el-table-column>
            <el-table-column prop="addTime" label="上传日期" sortable></el-table-column>
            <el-table-column prop="extand" label="文档类型"></el-table-column>

            <el-table-column label="操作" width="122">
                <template slot-scope="scope" class="goapp-row">
                    <div class="flexCenter">
                        <el-button type="text" class="blueText" @click="proAndEdit(scope.row.userFileId, '0')">打开文档</el-button>
                        <el-dropdown @command="handleCommand($event, scope.row)" trigger="hover" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="shareFile">分享</el-dropdown-item>
                                <el-dropdown-item command="editFile">在线编辑</el-dropdown-item>
                                <el-dropdown-item command="downloadFile">下载</el-dropdown-item>
                                <el-dropdown-item command="deleteFile">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <DialogsDrag
            ref="DialogsDrag"
            numType="uploadDoc"
            @getFile="getFileDrag"
            @onSuccess="getList"
            accept=".doc,.docx,.xls,.xlsx,.pdf,.pps,.pptx,.ppt,.csv"
        />
        <DialogShare ref="DialogShare" />
    </div>
</template>

<script>
import DialogsDrag from '@/components/Upload/DialogsDrag.vue'
import DialogShare from './DialogShare.vue'
import { deleteCloudDoc, getDocUrl, getUserAllCloudDoc } from '@/api/projectManage/officeManage.js'
export default {
    name: 'office',
    components: {
        DialogsDrag,
        DialogShare
    },
    data() {
        return {
            tableData: [] // 自定义构件列表
        }
    },
    computed: {
        uploadDoc() {
            return this.$store.state.uploadDoc
        },
        userId() {
            return this.$store.state.user.userId
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            let params = {
                userId: this.userId
            }
            getUserAllCloudDoc(params).then(res => {
                this.tableData = res.data || []
            })
        },
        handleCommand(command, item) {
            switch (command) {
                case 'shareFile':
                    this.$refs.DialogShare.show(item)
                    break
                case 'editFile':
                    this.proAndEdit(item.userFileId, '1')
                    break
                case 'downloadFile':
                    this.downloadFile(item)
                    break
                case 'deleteFile':
                    this.deleteFile(item)
                    break
                default:
                    break
            }
        },
        // 上传文档
        addDoc() {
            this.$refs.DialogsDrag.show('上传文档')
        },
        // 上传文档参数
        getFileDrag(file, callback) {
            callback({
                fileUpload: file,
                userId: this.userId,
                url: '/cloudDoc/uploadFile'
            })
        },
        // 预览或者编辑接口
        proAndEdit(id, str) {
            let params = {
                userId: this.userId,
                userFileId: id,
                type: str
            }
            getDocUrl(params).then(res => {
                window.open(res.data)
            })
        },
        // 下载
        downloadFile(item) {
            this.$confirm('即将下载此文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    window.location.href = `https://office.ourbim.com/prod-api/office/downloadFile?userFileId=${item.userFileId}`
                })
                .catch(() => {})
        },
        // 删除
        deleteFile(item) {
            this.$confirm('此操作将删除该应用, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        userId: this.userId,
                        userFileId: item.userFileId
                    }
                    deleteCloudDoc(params).then(res => {
                        this.getList()
                        this.$message.success(res.message)
                    })
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="less" scoped>
.table {
    margin-top: 20px;
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
</style>
