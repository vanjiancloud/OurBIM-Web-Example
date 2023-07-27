<template>
    <div>
        <div class="flex-right">
            <el-button type="primary">创建授权码</el-button>
            <el-button>购买套餐</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column prop="code" label="授权码编号" />
            <el-table-column prop="versionName" label="产品版本" />
            <el-table-column prop="createTime" label="创建/购买日期" />
            <el-table-column prop="activateTime" label="激活时间" />
            <el-table-column prop="expireTime" label="到期时间" />
            <el-table-column prop="countNumber" label="总并发数" />
            <el-table-column prop="cloudNumber" label="包含云VR/AR/MR并发数" />
            <el-table-column prop="prestartNumber" label="包含预启动并发数" />
            <el-table-column prop="store" label="存储空间" />
            <el-table-column prop="status" label="状态" />
            <el-table-column fixed="right" label="操作" width="160">
                
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getAuthorizationCodeList } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
export default {
    name: 'authorizationCode',
    data() {
        return {
            tableData: [],
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            const params = {
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                userId: Getuserid()
            }
            getAuthorizationCodeList(params).then(res => {
                console.log(res)
                if (res.code === 200) {
                    this.tableData = res.data.rows
                    this.pagination.total = res.data.total
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.flex-right {
    display: flex;
    justify-content: end;
    margin: 10px 24px 0 0;
}
</style>
