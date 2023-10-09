<!-- 计费详情 -->
<template>
    <el-dialog title="计费详情" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="50%" :before-close="hide">
        <el-table :data="tableData">
            <el-table-column prop="billingName" label="计费项目" />
            <el-table-column prop="billingUnit" label="计费规格" />
            <el-table-column prop="rule" label="判断规则"/>
            <el-table-column prop="billingPrice" label="计费单价（资源点数）"/>
        </el-table>
    </el-dialog>
</template>

<script>
import { getConsumeRule } from '@/api/server/parameter'
export default {
    components: { },
    props: {
        
    },
    data() {
        return {
            dialogVisible: false,
            tableData: [],
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(row) {
            this.dialogVisible = true
            this.getDetail(row.code)
        },
        hide() {
            this.dialogVisible = false
        },
        getDetail(code){
            getConsumeRule({code}).then((res)=>{
                this.tableData = res.data
            })
        }
    }
}
</script>
<style lang="less" scoped>
.table{
    border-top: 1px solid #F3F5F7;
    .tableItem{
        display: flex;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
        border-bottom: 1px solid #F3F5F7;
        border-left: 1px solid #F3F5F7;
        border-right: 1px solid #F3F5F7;
        .tableTitle{
            background-color: #E1F7FD;
            width: 32%;
            padding: 10px 16px;
        }
        .tableContent{
            width: 68%;
            padding: 10px 36px;
        }
    }
}
</style>