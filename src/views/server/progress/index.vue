<template>
    <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="运行中" name="running"></el-tab-pane>
        <el-tab-pane label="已结束" name="end"></el-tab-pane>

        <div class="box">
            <div class="search">               
                <el-form :inline="true" :model="form">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.user" placeholder="请输入项目名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="项目ID">
                        <el-input v-model="form.user" placeholder="请输入项目ID" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="进程类型">
                        <el-select v-model="form.region" placeholder="请选择" clearable>
                            <el-option label="所有" value="shanghai"></el-option>
                            <el-option label="3D" value="beijing"></el-option>
                            <el-option label="VR" value="beijing"></el-option>
                            <el-option label="AR/MR" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="searchRight" v-if="activeName==='running'">
                    <el-button size="small" class="grayBtn" @click="stop()">批量终止</el-button>
                </div>
            </div>
            <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column v-if="activeName==='running'" type="selection" width="55"></el-table-column>
                <el-table-column prop="groupName" label="项目名称" />
                <el-table-column prop="id" label="项目ID" />
                <el-table-column prop="createTime" label="客户端IP" />
                <el-table-column prop="num" label="创建日期" />
                <el-table-column prop="isGroup" label="结束日期"/>
                <el-table-column prop="isGroup" label="访问方式"/>
                <el-table-column prop="isGroup" label="进程类型"/>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" class="blueText" @click.stop="detail(scope.row)">查看详情</el-button>
                        <el-button v-if="activeName==='running'" type="text" class="orangeText" @click.stop="stop(scope.row)">终止</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-if="total" :total="total" :page.sync="form.pageNo" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        </div>
        <!-- 详情 -->
        <DialogDetail ref="DialogDetail"/>
    </el-tabs>
</template>

<script>
import DialogDetail from "./DialogDetail.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogDetail },
    props: {},
    data() {
        return {
            activeName: 'running',
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