<!-- IP黑白名单 -->
<template>
    <div class="box">
        <div class="search">               
            <el-form ref="form" :inline="true" :model="form" :rules="rules">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="白名单" value="whiteList"></el-option>
                        <el-option label="黑名单" value="blackList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP" prop="ip">
                    <el-input v-model="form.ip" placeholder="请输入IP" clearable></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入描述" :autosize="{ minRows: 1, maxRows: 3}" style="width: 470px;height: 36px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 96px;" size="small" class="blueBtn" @click="save()">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableTitle">IP列表</div>
        <el-table :data="tableData">
            <el-table-column prop="ip" label="IP" />
            <el-table-column label="类型">
                <template slot-scope="scope">
                    {{ scope.row.type === "whiteList" ? "白名单" : "黑名单" }}
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{ scope.row.status === "1" ? "有效" : "无效" }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-if="total" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="handlePageChange" />
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { Iplist, addIp, removeIp } from '@/api/server/parameter'
export default {
    components: { Pagination },
    props: {},
    data() {
        return {
            form: {
                pageNum:1,
                pageSize:20,
                type: 'whiteList',
                status: "1",
                creator: this.$store.state.user.userId,
            },
            rules:{
                type:[{ required: true, message: '请选择类型', trigger: 'blur' }],
                ip:[{ required: true, message: '请输入IP', trigger: 'blur' }]
            },
            tableData: [],
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
            Iplist(this.form).then((res)=>{
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
        save(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                addIp(this.form).then(()=>{
                    this.getList()
                    this.$message.success("添加成功！")
                })
            })
        },
        deleteRow(row){
            this.$confirm(`此操作将删除当前IP【${row.ip}】，是否继续？`, "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                removeIp(row.id).then(()=>{
                    this.getList()
                    this.$message.success("删除成功！")
                })
            }).catch(() => {});
        }
    }
};
</script>
<style lang="less" scoped>
.tableTitle{
    color: #333333;
    position: relative;
    padding-left: 12px;
    margin-bottom: 8px;
    &::before{
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 4px;
        height: 12px;
        background: linear-gradient(180deg, #00D5F9 0%, #00AAF0 100%);
        border-radius: 4px;
    }
}
</style>
