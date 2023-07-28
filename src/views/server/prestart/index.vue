<template>
    <div class="box">
        <div class="search">               
            <el-form :inline="true" :model="form">
                <el-form-item label="项目名称">
                    <el-input v-model="form.user" placeholder="请输入项目名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="项目ID">
                    <el-input v-model="form.user" placeholder="请输入项目ID" clearable></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="operate flexBetween">
            <div class="operateLeft">预启动并发已使用 <span>3/</span>15</div>
            <div class="searchRight">
                <el-button size="small" style="width: 96px;" class="bluePlainBtn" @click="add()">添加</el-button>
            </div>
        </div>
        <el-table :data="tableData">
            <el-table-column prop="groupName" label="项目名称" />
            <el-table-column prop="id" label="项目ID" />
            <el-table-column prop="createTime" label="码率">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.isGroup" placeholder="请选择">
                        <el-option label="所有" value="shanghai"></el-option>
                        <el-option label="3D" value="beijing"></el-option>
                        <el-option label="VR" value="beijing"></el-option>
                        <el-option label="AR/MR" value="beijing"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="帧率">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.isGroup" placeholder="请选择">
                        <el-option label="所有" value="shanghai"></el-option>
                        <el-option label="3D" value="beijing"></el-option>
                        <el-option label="VR" value="beijing"></el-option>
                        <el-option label="AR/MR" value="beijing"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="预启动数量">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.isGroup" placeholder="请选择">
                        <el-option label="所有" value="shanghai"></el-option>
                        <el-option label="3D" value="beijing"></el-option>
                        <el-option label="VR" value="beijing"></el-option>
                        <el-option label="AR/MR" value="beijing"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="服务器运行数"/>
            <el-table-column prop="isGroup" label="正在使用数"/>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span class="status">{{ scope.row.isGroup }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" class="orangeText" @click.stop="openRow(scope.row)">禁用</el-button>
                    <el-button type="text" class="blueText" @click.stop="openRow(scope.row)">启用</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-if="total" :total="total" :page.sync="form.pageNo" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        <!-- 添加\编辑预启动项目 -->
        <DialogAdd ref="DialogAdd"/>
    </div>
</template>

<script>
import DialogAdd from "./DialogAdd.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogAdd },
    props: {},
    data() {
        return {
            form: {},
            total: 0,
            tableData: [{isGroup:1}],
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
        // 添加\编辑预启动项目
        add(){
            this.$refs.DialogAdd.show()
        },
        // 启用\禁用
        openRow(row){

        },
        // 删除
        deleteRow(row){
            this.$confirm(`此操作将删除当前预启动云服务，是否继续？`, "删除预启动项目", {
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
.operate{
    margin-bottom: 16px;
    .operateLeft{
        font-size: 14px;
        color: #4A4A4A;
        span{
            color: #02AAF0;
        }
    }
}
.status{
    position: relative;
    padding-left: 15px;
    &::before{
        content: '';
        display: block;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
        width: 9px;
        height: 9px;
        background: #00AAF0;
        border-radius: 100%;
    }
}
.stopStatus::before{
    background: #FF7F28;
}
</style>