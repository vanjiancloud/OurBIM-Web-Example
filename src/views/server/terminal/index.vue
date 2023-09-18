<template>
    <el-tabs v-model="activeName" class="tabs" @tab-click="getList">
        <el-tab-pane label="3D" name="3D"></el-tab-pane>
        <el-tab-pane label="VR" name="VR"></el-tab-pane>
        <el-tab-pane label="AR/MR" name="AR/MR"></el-tab-pane>

        <div class="box">
            <div class="search">               
                <el-form :inline="true" :model="form">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.projectName" placeholder="请输入项目名称" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="项目ID">
                        <el-input v-model="form.projectId" placeholder="请输入项目ID" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="客户端IP" v-if="activeName==='3D'">
                        <el-input v-model="form.serverIp" placeholder="请输入客户端IP" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" v-if="['VR','AR/MR'].includes(activeName)">
                        <el-input v-model="form.deviceName" placeholder="请输入设备名称" clearable @change="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="设备型号" v-if="['VR','AR/MR'].includes(activeName)">
                        <el-input v-model="form.deviceType" placeholder="请输入设备名称" clearable @change="search()"></el-input>
                    </el-form-item>
                </el-form>
                <div class="searchRight">
                    <el-button size="small" class="grayBtn" @click="stop()">批量终止</el-button>
                </div>
            </div>
            <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :key="0" prop="serverId" label="客户终端ID" />
                <el-table-column :key="1" prop="serverIp" label="客户端IP" />
                <el-table-column :key="2" v-if="activeName==='3D'" prop="projectName" label="项目名称" />
                <el-table-column :key="3" v-if="['VR','AR/MR'].includes(activeName)" prop="deviceName" label="设备名称" />
                <el-table-column :key="4" v-if="activeName==='3D'" prop="projectId" label="项目ID" />
                <el-table-column :key="5" v-if="['VR','AR/MR'].includes(activeName)" prop="deviceType" label="设备型号" />
                <el-table-column :key="6" v-if="['VR','AR/MR'].includes(activeName)" prop="deviceMac" label="设备Mac地址" />
                <el-table-column :key="7" v-if="['VR','AR/MR'].includes(activeName)" prop="projectName" label="运行中项目名称" />
                <el-table-column prop="createTime" label="创建时间"/>
                <el-table-column prop="visitMode" label="访问方式"/>
                <el-table-column prop="processType" label="进程类型"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" class="blueText" @click.stop="detail(scope.row)">查看详情</el-button>
                        <el-button v-if="['VR','AR/MR'].includes(activeName)" type="text" class="blueText" @click.stop="monitorDetail(scope.row)">终端监测</el-button>
                        <el-button type="text" class="orangeText" @click.stop="stop(scope.row)">终止</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-if="total" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        </div>
        <!-- 进程详情 -->
        <DialogDetail ref="DialogDetail"/>
        <!-- 设备监测 -->
        <DialogMonitor ref="DialogMonitor"/>
    </el-tabs>
</template>

<script>
import { list, end, batchEnd } from "@/api/server/terminal.js"
import DialogDetail from "./DialogDetail.vue"
import DialogMonitor from "./DialogMonitor.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogDetail, DialogMonitor },
    props: {},
    data() {
        return {
            activeName: '3D',
            tableData: [],
            multipleSelection: [],//表格多选
            form: {
                pageNum:1,
                pageSize:20,
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
            list({...this.form,processType:this.activeName}).then((res)=>{
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
        // 详情
        monitorDetail(row){
            this.$refs.DialogMonitor.show(row.id)
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
            }).then(async() => {
                let res = row ? await end({id:row.id}) : await batchEnd({ids:this.multipleSelection.map(e=>{return e.id}).join(',')})
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
        padding: 0 30px!important;
        text-align: center;
    }
    /deep/.el-tabs__active-bar{
        display: none;
    }
    /deep/.is-active{
        border-bottom: 3px solid #00AAF0;
    }
    /deep/.el-tabs__nav-scroll{
        margin-left: 10px;
    }
}
</style>