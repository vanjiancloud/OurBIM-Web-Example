<!-- 授权激活 -->
<template>
    <div class="box">
        <div class="search">               
            <el-form :inline="true" :model="form">
                <el-form-item label="授权方式">
                    <el-select v-model="form.region" placeholder="请选择" clearable>
                        <el-option label="所有" value="shanghai"></el-option>
                        <el-option label="3D" value="beijing"></el-option>
                        <el-option label="VR" value="beijing"></el-option>
                        <el-option label="AR/MR" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权码">
                    <el-input v-model="form.user" placeholder="请输入授权码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 96px;" size="small" class="blueBtn" @click="stop()">验 证</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableTitle">云服务授权码信息</div>
        <el-table :data="tableData">
            <el-table-column prop="groupName" label="编号" />
            <el-table-column prop="id" label="授权码" />
            <el-table-column prop="isGroup" label="产品版本">
                <template slot-scope="scope">
                    <span class="version">
                        {{ scope.row.isGroup }}
                        <svg-icon icon-class="feeDetail" class="svgBtn" @click="openFee(scope.row)"/>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="isGroup" label="创建/购买时间"/>
            <el-table-column prop="isGroup" label="激活时间"/>
            <el-table-column prop="isGroup" label="到期时间"/>
            <el-table-column prop="isGroup" label="总并发数"/>
            <el-table-column prop="isGroup" label="预启动并发数"/>
            <el-table-column prop="isGroup" label="存储空间"/>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span class="status">{{ scope.row.isGroup }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" class="blueText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 计费详情 -->
        <DialogFeeDetial ref="DialogFeeDetial"/>
    </div>
</template>

<script>
import DialogFeeDetial from './components/DialogFeeDetial.vue'
export default {
    components: { DialogFeeDetial },
    props: {},
    data() {
        return {
            form:{},
            tableData:[{isGroup:1}]
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        openFee(row){
            this.$refs.DialogFeeDetial.show(row)
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
.version{
    .svgBtn{
        color: #CFCFCF;
        cursor: pointer;
        font-size: 14px;
        margin-left: 5px;
        &:hover{
            color: #00aaf0;
        }
    }
}
.status1::before{
    background: #999999;
}
.status2::before{
    background: #02AF5D;
}
</style>
