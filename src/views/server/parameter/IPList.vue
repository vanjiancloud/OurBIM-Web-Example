<!-- IP黑白名单 -->
<template>
    <div class="box">
        <div class="search">               
            <el-form ref="form" :inline="true" :model="form" :rules="rules">
                <el-form-item label="类型">
                    <el-select v-model="form.region" placeholder="请选择" clearable>
                        <el-option label="所有" value="shanghai"></el-option>
                        <el-option label="3D" value="beijing"></el-option>
                        <el-option label="VR" value="beijing"></el-option>
                        <el-option label="AR/MR" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP" prop="IP">
                    <el-input v-model="form.user" placeholder="请输入IP" clearable></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.user" type="textarea" placeholder="请输入描述" :autosize="{ minRows: 1, maxRows: 3}" style="width: 470px;height: 36px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 96px;" size="small" class="blueBtn" @click="save()">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableTitle">IP列表</div>
        <el-table :data="tableData">
            <el-table-column prop="groupName" label="IP" />
            <el-table-column prop="id" label="类型" />
            <el-table-column prop="isGroup" label="状态">
                <template slot-scope="scope">
                    
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="描述"/>
            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    components: { },
    props: {},
    data() {
        return {
            form:{},
            rules:{
                IP:[{ required: true, message: '请输入IP', trigger: 'blur' }]
            },
            tableData:[{isGroup:1}]
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        save(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                
            })
        },
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
