<template>
    <div class="page-contain">
        <div class="flexSpaceBetween marginBottom16">
            <div class="expense-title">
                订单列表
            </div>
            <div>
                <el-button type="primary" @click="manyInvoice">批量开票</el-button>
                <el-button>导出</el-button>
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
            <el-table-column fixed="right" label="操作" width="230px">
                <template slot-scope="scope">
                    <div class="operate-btn color-btn" v-if="scope.row.status == 0" @click="jumpToPay(scope.row)">去支付</div>
                    <div class="operate-btn color-btn" @click="invoice(scope.row)">开发票</div>
                    <div class="operate-btn" @click="delOrder(scope.row)">删除</div>
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
            this.$refs.invoice.show(this.selectionData)
        },

        invoice(row) {
            this.$refs.invoice.show([row])
        },

        delOrder(row) {
            const params = {
                id: row.id
            }
            deleteOrder(params).then(res => {
                console.log('订单删除', res)
            })
            deleteOrder(row.id).then(res => {
                console.log('订单删除', res)
            })
        },

        jumpToPay(row) {
            this.$router.push({
                path: 'recharge',
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
    // 待支付
    &-0::before {
        background: #ff7f28;
    }
    // 已支付
    &-1::before {
        background: #03c13f;
    }
    &-2::before {
        background: #999999;
    }
}
</style>
