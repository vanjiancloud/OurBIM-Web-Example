<template>
    <el-tabs v-model="activeName" class="tabs" @tab-click="search">
        <el-tab-pane label="运行中" name="true"></el-tab-pane>
        <el-tab-pane label="已结束" name="false"></el-tab-pane>

        <div class="box">
            <div class="search">               
                <el-form :inline="true" :model="form">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.projectName" placeholder="请输入项目名称" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="项目ID">
                        <el-input v-model="form.projectId" placeholder="请输入项目ID" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="进程类型">
                        <el-select v-model="form.processType" placeholder="请选择" clearable @change="search()">
                            <el-option label="所有" value=""></el-option>
                            <el-option label="3D" value="3D"></el-option>
                            <el-option label="VR" value="VR"></el-option>
                            <el-option label="AR/MR" value="AR/MR"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="searchRight" v-if="activeName==='true'">
                    <el-button size="small" class="grayBtn" @click="stop()">批量终止</el-button>
                </div>
            </div>
            <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column v-if="activeName==='true'" type="selection" width="55" :key="0"></el-table-column>
                <el-table-column prop="taskId" label="TaskId" :key="6"/>
                <el-table-column prop="projectName" label="项目名称" :key="1"/>
                <el-table-column prop="projectId" label="项目ID" :key="2"/>
                <el-table-column prop="clientIp" label="客户端IP" :key="3"/>
                <el-table-column prop="createTime" label="创建日期" :key="4"/>
                <el-table-column prop="endTime" label="结束日期" v-if="activeName!=='true'" :key="5"/>
                <el-table-column prop="visitMode" label="访问方式"/>
                <el-table-column prop="processType" label="进程类型"/>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" class="blueText" @click.stop="detail(scope.row)">查看详情</el-button>
                        <el-button v-if="activeName==='true'" type="text" class="orangeText" @click.stop="stop(scope.row)">终止</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-if="total" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        </div>
        <!-- 详情 -->
        <DialogDetail ref="DialogDetail"/>
    </el-tabs>
</template>

<script>
import { list, end, batchEnd } from "@/api/server/progress.js"
import DialogDetail from "./DialogDetail.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogDetail },
    props: {},
    data() {
        return {
            activeName: "true",
            tableData: [],
            multipleSelection: [],//表格多选
            form: {
                pageNum:1,
                pageSize:20,
                processType:''
            },
            total: 0
        };
    },
    watch: {},
    computed: {},
    created() {
        this.getList()
    },
    mounted() { },
    methods: {
        getList(){
            list({...this.form,isRunning:this.activeName}).then((res)=>{
                this.tableData = res.data
                this.total = res.count
            })
        },
        search(){
            this.form.pageNum = this.$options.data().form.pageNum
            this.form.pageSize = this.$options.data().form.pageSize
            this.getList()
        },
        // 分页
        handlePageChange(data) {
            this.form.pageNum = data.pageIndex
            this.form.pageSize = data.pageSize
            this.getList()
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        // 详情
        detail(row){
            this.$refs.DialogDetail.show(row.id)
        },
        // 终止进程
        stop(row){
            if(!row&&!this.multipleSelection.length){
                return this.$message.warning('请选择要终止的进程!')
            }
            this.$confirm(`此操作将强制终止当前所选进程，是否继续？`, "终止进程", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = row ? await end(row.id) : await batchEnd(this.multipleSelection.map(e=>{return e.id}).join(','))
                if(res){
                    this.$message.success(res.message)
                    this.getList()
                }
            }).catch(() => {});
        }
    }
};
</script>
<style lang="less" scoped>
.tabs{
    padding-top: 15px;
    /deep/.el-tabs__item{
        padding: 0 45px!important;
        text-align: center;
    }
    /deep/.el-tabs__active-bar{
        height: 3px;
        width: 102px!important;
        left: -32px;
    }
}
</style>