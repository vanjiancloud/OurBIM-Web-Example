<!-- 授权激活 -->
<template>
    <div class="box">
        <div class="search">               
            <el-form :inline="true" :model="form">
                <el-form-item label="授权方式">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="云授权" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权码">
                    <el-input v-model="form.code" placeholder="请输入授权码" clearable style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 96px;" size="small" class="blueBtn" @click="verity()">验 证</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableTitle">云服务授权码信息</div>
        <el-table :data="tableData">
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="code" label="授权码" />
            <el-table-column prop="isGroup" label="产品版本">
                <template slot-scope="scope">
                    <span class="version">
                        {{ scope.row.versionName }}
                        <svg-icon v-if="scope.row.billingMode==='0'" icon-class="feeDetail" class="svgBtn" @click="openFee(scope.row)"/>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建/购买时间"/>
            <el-table-column prop="activateTime" label="激活时间"/>
            <el-table-column prop="expireTime" label="到期时间"/>
            <el-table-column prop="countNumber" label="总并发数"/>
            <el-table-column prop="prestartNumber" label="预启动并发数"/>
            <el-table-column prop="store" label="存储空间">
                <template slot-scope="scope">
                    <span class="version">
                        {{ scope.row.store }}GB
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span class="status" :class="[`status-${scope.row.status}`]">{{ statusObj[scope.row.status] }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status!=='2'" type="text" class="blueText" @click.stop="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <!-- 计费详情 -->
        <DialogFeeDetial ref="DialogFeeDetial"/>
    </div>
</template>

<script>
import { Getuserid } from '@/store/index.js'
import { verifyUserAuthorizationCode, authorizationCodeList, deleteAuthorizationCode } from '@/api/server/parameter'
import DialogFeeDetial from './components/DialogFeeDetial.vue'
import { getDictDataByKey } from '@/utils/getDict'
export default {
    components: { DialogFeeDetial },
    props: {},
    data() {
        return {
            form:{
                pageNum: 1,
                pageSize: 200,
                type:"1"
            },
            tableData:[],
            statusObj:{}
        };
    },
    watch: {},
    computed: {},
    created() {
        this.getDict()
        this.getList()
    },
    mounted() { },
    methods: {
        getDict() {
            getDictDataByKey('AuthorizationCodeStatusEnum').then(data => {
                let obj = {}
                data.forEach(item => {
                    obj[item.code] = item.value
                })
                this.statusObj = obj
            })
        },
        getList(){
            authorizationCodeList({authorizationType:this.form.type,userId: Getuserid()}).then((res)=>{
                this.tableData = res.data
            })
        },
        openFee(row){
            this.$refs.DialogFeeDetial.show(row)
        },
        deleteRow(row){
            this.$confirm(`此操作将删除当前授权码，是否继续？`, "删除授权码", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                deleteAuthorizationCode({code:row.code}).then(()=>{
                    this.$message.success("删除成功！")
                    this.getList()
                })
            }).catch(() => {});
        },
        // 授权码
        verity(){
            if(!this.form.code){
                return this.$message.warning("请输入授权码！")
            }
            this.$confirm(`确认验证此授权码吗`, "验证", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let data = {
                    type:this.form.type,
                    code:this.form.code,
                    userId: Getuserid()
                }
                verifyUserAuthorizationCode(data).then(()=>{
                    this.$message.success("验证成功！")
                    this.getList()
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

.status {
    &-1::before {
        // 未激活
        background: #b8cad5;
    }
    &-2::before {
        // 已激活
        background: #03c13f;
    }
    &-3::before,
    &-4::before,
    &-5::before {
        background: #999999;
    }
}
</style>
