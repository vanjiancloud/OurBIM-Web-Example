<template>
    <div class="page-contain">
        <div class="flexSpaceBetween marginBottom16">
            <div class="expense-title">
                订单列表
            </div>
            <div>
                <el-button type="primary" class="blueBtn" @click="manyInvoice">批量开票</el-button>
                <el-button class="bluePlainBtn">导出</el-button>
            </div>
        </div>
        <el-table :data="tableData" v-loading="loading" @select="selectOrder" @select-all="selectOrder">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" label="订单编号" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="versionName" show-overflow-tooltip label="产品版本类型" />
            <el-table-column prop="buyResourceNumber" label="购买/充值资源点数" />
            <el-table-column prop="totalMoney" label="购买金额(元)" />
            <el-table-column prop="discountCode" label="优惠码" />
            <el-table-column prop="discountMoney" label="优惠金额" />
            <el-table-column prop="realMoney" label="订单金额" />
            <el-table-column prop="status" show-overflow-tooltip label="订单状态" min-width="110px">
                <template #default="scope">
                    <div :class="['status-circle', `status-${scope.row.status}`]">
                        {{ statusObj[scope.row.status] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="invoiceStatus" show-overflow-tooltip label="开票状态">
                <template #default="scope">
                    {{ invoiceStatusObj[scope.row.invoiceStatus] }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <div class="operate-btn color-btn" v-if="scope.row.status == 0" @click="jumpToPay(scope.row)">去支付</div>
                    <!-- 只有已支付和未开票的可以开发票 -->
                    <div class="operate-btn color-btn" v-if="scope.row.status == 1 && scope.row.invoiceStatus == 2" @click="invoice(scope.row)">开发票</div>
                    <!-- 只有待支付才能删除 -->
                    <div class="operate-btn" v-if="scope.row.status == 0" @click="delOrder(scope.row)">删除</div>
                </template>
            </el-table-column>
        </el-table>

        <Invoice ref="invoice"></Invoice>

        <Pagination
            :total="pagination.total"
            :page.sync="pagination.pageNum"
            :limit.sync="pagination.pageSize"
            @pagination="handlePageChange"
        />
    </div>
</template>

<script>
import { getOrderList, deleteOrder } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
import { getDictDataByKey } from '@/utils/getDict'
import Pagination from '@/components/Pagination'
import Invoice from './invoiceDialog.vue'
export default {
    name: 'authorizationCode',
    components: { Pagination, Invoice },
    data() {
        return {
            loading: false,
            selectionData: [],
            tableData: [],
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            statusObj: {},
            invoiceStatusObj: {}
        }
    },
    created() {
        this.getData()
        this.getOrderStatusData()
        this.getInvoiceStatusData()
    },
    methods: {
        getOrderStatusData() {
            getDictDataByKey('UserOrderStatusEnum').then(data => {
                let obj = {}
                data.forEach(item => {
                    obj[item.code] = item.value
                })
                this.statusObj = obj
            })
        },

        getInvoiceStatusData() {
            getDictDataByKey('UserOrderInvoiceStatusEnum').then(data => {
                let obj = {}
                data.forEach(item => {
                    obj[item.code] = item.value
                })
                this.invoiceStatusObj = obj
            })
        },

        getData() {
            const params = {
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                userId: Getuserid()
            }
            this.loading = true
            getOrderList(params).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data.rows
                    this.loading = false
                    this.tableData.forEach(item => {
                        item.activateTime = item.activateTime ? item.activateTime : '-'
                        item.versionName = item.versionName ? item.versionName : '-'
                        item.discountCode = item.discountCode ? item.discountCode : '-'
                        item.discountMoney = item.discountMoney ? item.discountMoney : '-'
                    })
                    this.pagination.total = res.data.total
                }
            })
        },

        handlePageChange(data) {
            this.pagination.pageNum = data.pageIndex
            this.pagination.pageSize = data.pageSize
            this.getData()
        },

        selectOrder(selection) {
            this.selectionData = selection
        },

        manyInvoice() {
            if (this.selectionData.length == 0) {
                this.$message.warning('请选择订单')
            } else {
                this.$refs.invoice.show(this.selectionData)
            }
        },

        invoice(row) {
            this.$refs.invoice.show([row])
        },

        delOrder(row) {
            this.$confirm(`删除【${row.code}】订单后无法恢复，确认是否删除？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning'
            }).then(() => {
                const params = {
                    userFileId: row.userFileId,
                    userId: Getuserid()
                }
                deleteOrder(row.id).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功!")
                        this.getData()
                    }
                })
            }).catch(() => {})
        },

        jumpToPay(row) {
            this.$router.push({
                name: 'recharge',
                params: row
            })
        }
    }
}
</script>

<style lang="less" scoped>
.marginBottom16 {
    margin-bottom: 16px;
}
.page-contain {
    padding: 16px 24px 24px 24px;
}
.operate-btn {
    font-size: 14px;
    margin: 0 16px;
    display: inline-block;
    cursor: pointer;
}
.color-btn {
    color: #00aaf0;
}
.status-circle::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    margin-right: 6px;
}
.status {
    &-0{
        color: #ff7f28!important;
        &::before {
            background: #ff7f28!important;
        }
    }
    &-1{
        color: #03c13f!important;
        &::before {
            background: #03c13f!important;
        }
    }
    &-2{
        color: #999999!important;
        &::before {
            background: #999999!important;
        }
    }
}
</style>
