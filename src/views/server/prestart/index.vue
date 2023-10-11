<template>
    <div class="box">
        <div class="search">               
            <el-form :inline="true" :model="form">
                <el-form-item label="项目名称">
                    <el-input v-model="form.projectName" placeholder="请输入项目名称" clearable @change="search"></el-input>
                </el-form-item>
                <el-form-item label="项目ID">
                    <el-input v-model="form.projectId" placeholder="请输入项目ID" clearable @change="search"></el-input>
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
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="projectId" label="项目ID" />
            <el-table-column label="码率">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.codeRate" placeholder="请选择" @change="edit(scope.row)">
                        <el-option :label="item" :value="item" v-for="item in codeRate" :key="item"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="帧率">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.frameRate" placeholder="请选择" @change="edit(scope.row)">
                        <el-option :label="item" :value="item" v-for="item in frameRate" :key="item"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="预启动数量">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.preStartNum" placeholder="请输入正整数" v-only-number="{precision:0}" @change="edit(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="serverRunningNum" label="服务器运行数"/>
            <el-table-column prop="activeNum" label="正在使用数"/>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'" class="status">启用</span>
                    <span v-if="scope.row.status === '0'" class="status">禁用</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status==='1'" type="text" class="orangeText" @click.stop="stop(scope.row)">禁用</el-button>
                    <el-button v-if="scope.row.status==='0'" type="text" class="blueText" @click.stop="start(scope.row)">启用</el-button>
                    <el-button type="text" class="blackText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-if="total" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="handlePageChange" />
        <!-- 添加\编辑预启动项目 -->
        <DialogAdd ref="DialogAdd" :codeRate="codeRate" :frameRate="frameRate"/>
    </div>
</template>

<script>
import { list, edit, deleteRow, startRow, stopRow } from "@/api/server/prestart.js"
import DialogAdd from "./DialogAdd.vue"
import Pagination from "@/components/Pagination"
export default {
    components: { Pagination, DialogAdd },
    props: {},
    data() {
        return {
            form: {
                pageNum:1,
                pageSize:20
            },
            total: 0,
            tableData: [],
            // 码率
            codeRate:["8000","15000","20000","30000","50000","100000"],
            // 码率
            frameRate:["30","60"]
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
            list(this.form).then((res)=>{
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
        // 添加\编辑预启动项目
        add(){
            this.$refs.DialogAdd.show()
        },
        // 编辑项目
        edit(row){
            edit(row).then(()=>{
                this.$message.success("修改成功！")
                this.getList()
            })
        },
        // 启用
        start(row){
            this.$confirm(`此操作将启用当前预启动云服务，是否继续？`, "启用", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                startRow({id:row.id}).then(()=>{
                    this.$message.success("已启用！")
                    this.getList()
                })
            }).catch(() => {});
        },
        // 禁用
        stop(row){
            this.$confirm(`此操作将禁用当前预启动云服务，是否继续？`, "禁用", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                stopRow({id:row.id}).then(()=>{
                    this.$message.success("已禁用！")
                    this.getList()
                })
            }).catch(() => {});
        },
        // 删除
        deleteRow(row){
            this.$confirm(`此操作将删除当前预启动云服务，是否继续？`, "删除预启动项目", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                deleteRow({id:row.id}).then(()=>{
                    this.$message.success("删除成功！")
                    this.getList()
                })
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