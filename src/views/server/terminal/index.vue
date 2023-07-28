<template>
    <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="3D" name="3D"></el-tab-pane>
        <el-tab-pane label="VR" name="VR"></el-tab-pane>
        <el-tab-pane label="AR/MR" name="AR/MR"></el-tab-pane>

        <div class="box">
            <div class="search">               
                <el-form :inline="true" :model="form">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.user" placeholder="请输入项目名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="项目ID">
                        <el-input v-model="form.user" placeholder="请输入项目ID" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="客户端IP" v-if="activeName==='3D'">
                        <el-input v-model="form.user" placeholder="请输入客户端IP" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" v-if="['VR','AR/MR'].includes(activeName)">
                        <el-select v-model="form.region" placeholder="请选择" clearable>
                            <el-option label="所有" value="shanghai"></el-option>
                            <el-option label="3D" value="beijing"></el-option>
                            <el-option label="VR" value="beijing"></el-option>
                            <el-option label="AR/MR" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备型号" v-if="['VR','AR/MR'].includes(activeName)">
                        <el-select v-model="form.region" placeholder="请选择" clearable>
                            <el-option label="所有" value="shanghai"></el-option>
                            <el-option label="3D" value="beijing"></el-option>
                            <el-option label="VR" value="beijing"></el-option>
                            <el-option label="AR/MR" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="searchRight">
                    <el-button size="small" class="grayBtn" @click="stop()">批量终止</el-button>
                </div>
            </div>
            <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :key="0" prop="groupName" label="客户终端ID" />
                <el-table-column :key="1" prop="id" label="客户端IP" />
                <el-table-column :key="2" v-if="activeName==='3D'" prop="createTime" label="项目名称" />
                <el-table-column :key="3" v-if="['VR','AR/MR'].includes(activeName)" prop="createTime" label="设备名称" />
                <el-table-column :key="4" v-if="activeName==='3D'" prop="num" label="项目ID" />
                <el-table-column :key="5" v-if="['VR','AR/MR'].includes(activeName)" prop="num" label="设备型号" />
                <el-table-column :key="6" v-if="['VR','AR/MR'].includes(activeName)" prop="num" label="设备Mac地址" />
                <el-table-column :key="7" v-if="['VR','AR/MR'].includes(activeName)" prop="num" label="运行中项目名称" />
                <el-table-column prop="isGroup" label="创建时间"/>
                <el-table-column prop="isGroup" label="访问方式"/>
                <el-table-column prop="isGroup" label="进程类型"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" class="blueText" @click.stop="detail(scope.row)">查看详情</el-button>
                        <el-button v-if="['VR','AR/MR'].includes(activeName)" type="text" class="blueText" @click.stop="monitorDetail(scope.row)">终端监测</el-button>
                        <el-button type="text" class="orangeText" @click.stop="stop(scope.row)">终止</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-if="total" :total="total" :page.sync="form.pageNo" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        </div>
        <!-- 进程详情 -->
        <DialogDetail ref="DialogDetail"/>
        <!-- 设备监测 -->
        <DialogMonitor ref="DialogMonitor"/>
    </el-tabs>
</template>

<script>
import DialogDetail from "./DialogDetail.vue"
import DialogMonitor from "./DialogMonitor.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogDetail, DialogMonitor },
    props: {},
    data() {
        return {
            activeName: '3D',
            tableData: [{}],
            multipleSelection: [],//表格多选
            form: {},
            total: 0
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        // 分页
        handlePageChange(data) {
            this.form.pageNo = data.pageIndex
            this.form.pageSize = data.pageSize
            // this.getList()
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        // 详情
        detail(row){
            this.$refs.DialogDetail.show(row)
        },
        // 详情
        monitorDetail(row){
            this.$refs.DialogMonitor.show(row)
        },
        // 终止进程
        stop(row){
            this.$confirm(`此操作将强制终止当前所选进程，是否继续？`, "终止进程", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                
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