<template>
    <div class="page-contain">
        <div class="flexSpaceBetween marginBottom16">
            <div class="expense-title">
                消费账单流水
            </div>
        </div>

        <div class="search searchBox">               
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="账期" prop="consumerDate">
                    <el-date-picker
                        clearable
                        class="formInputWidth"
                        v-model="searchForm.consumerDate"
                        @change="getData"
                        placeholder="请选择有效时间"
                        type="month"
                        value-format="yyyy-MM"
                    />
                </el-form-item>
                <el-form-item label="计费方式" prop="billingMode">
                    <el-select
                        clearable
                        v-model="searchForm.billingMode"
                        class="formInputWidth"
                        placeholder="请选择计费方式"
                        @change="getData"
                    >
                        <el-option
                            v-for="item in billingModeList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="消费内容" prop="consumeContent">
                    <el-select
                        clearable
                        v-model="searchForm.consumeContent"
                        class="formInputWidth"
                        @change="getData"
                        placeholder="请选择消费内容"
                    >
                        <el-option
                            v-for="(item, index) in consumerContentList"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="授权码" prop="authorizationCode">
                    <el-select
                        clearable
                        v-model="searchForm.authorizationCode"
                        class="formInputWidth"
                        @change="getData"
                        placeholder="请选择授权码产品版本"
                    >
                        <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button style="width: 96px;margin-top: 4px;" size="small" class="blueBtn">导出</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading">
            <el-table-column align="center" prop="consumerDate" label="账期" />
            <el-table-column align="center" prop="code" label="消费账单ID" />
            <el-table-column align="center" prop="createTime" label="创建时间" />
            <el-table-column align="center" prop="versionName" label="产品版本" />
            <el-table-column align="center" prop="billingMode" label="计费方式">
                <template #default="scope">
                    {{ billingModeObj[scope.row.billingMode] }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="consumeContent" label="消费内容" />
            <el-table-column align="center" prop="price" label="服务单价(资源点)">
                <template #default="scope">
                    {{ scope.row.price }}<span v-if="scope.row.consumeUnit && scope.row.price">/{{ scope.row.consumeUnit }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费时间" min-width="140">
                <template #default="scope">
                    {{ scope.row.consumeStartTime }} <span v-if="scope.row.consumeStartTime">到</span> {{ scope.row.consumeEndTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="consumeTime" label="消费容量/时长">
                <template #default="scope"> {{ scope.row.consumeTime }} {{ scope.row.consumeUnit }} </template>
            </el-table-column>
            <el-table-column align="center" prop="consumeMoney" label="消费资源点数">
                <template #default="scope"> {{ scope.row.consumeMoney }} </template>
            </el-table-column>
            <el-table-column align="center" prop="discountMoney" label="优惠资源点数" />
            <el-table-column align="center" prop="consumeActualMoney" label="实扣资源点数" />
            <el-table-column fixed="right" label="操作" width="120px">
                <template slot-scope="scope">
                    <div class="operate-btn color-btn" @click="orderDetail(scope.row)">账单详情</div>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            :total="pagination.total"
            :page.sync="pagination.pageNum"
            :limit.sync="pagination.pageSize"
            @pagination="handlePageChange"
        />

        <orderDetail ref="orderDetailDialog" @get-data="getData"></orderDetail>
    </div>
</template>

<script>
import { getConsumerList, getConsumerContentList, getProductList } from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
import { getDictDataByKey } from '@/utils/getDict'
import Pagination from '@/components/Pagination'
import orderDetail from './orderDetail.vue'
export default {
    name: 'authorizationCode',
    components: { Pagination, orderDetail },
    data() {
        return {
            loading: false,
            searchForm: {
                consumerDate: '', // 账期
                billingMode: '', // 计费方式
                consumeContent: '', // 消费内容
                authorizationCode: '' // 授权码
            },
            tableData: [],
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },

            billingModeList: [],
            billingModeObj: {},
            consumerContentList: [],
            productList: []
        }
    },
    created() {
        this.getData()
        this.getBillMode()
        this.getCusContentList()
        this.getProductData()
    },
    methods: {
        // 获取计费方式枚举
        getBillMode() {
            getDictDataByKey('BillingModeEnum').then(data => {
                this.billingModeList = data

                let obj = {}
                data.forEach(item => {
                    obj[item.code] = item.value
                })
                this.billingModeObj = obj
            })
        },

        // 获取消费内容下拉数据
        getCusContentList() {
            getConsumerContentList({ userId: Getuserid() }).then(res => {
                if (res.code === 200) {
                    this.consumerContentList = res.data
                }
            })
        },

        // 获取授权码产品版本数据
        getProductData() {
            getProductList().then(res => {
                if (res.code === 200) {
                    this.productList = res.data
                }
            })
        },

        getData() {
            const params = {
                ...this.searchForm,
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                userId: Getuserid()
            }
            this.loading = true
            getConsumerList(params).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data.rows
                    this.loading = false
                    this.tableData.forEach(item => {
                        item.activateTime = item.activateTime ? item.activateTime : '-'
                        item.expireTime = item.expireTime ? item.expireTime : '-'
                    })
                    this.pagination.total = res.data.total
                }
            })
        },

        resetSearch() {
            this.searchForm = {
                consumerDate: '', // 账期
                billingMode: '', // 计费方式
                consumeContent: '', // 消费内容
                authorizationCode: '' // 授权码
            }
            this.pagination.pageNum = 1
            this.pagination.pageSize = 10
            this.getData()
        },

        handlePageChange(data) {
            this.pagination.pageNum = data.pageIndex
            this.pagination.pageSize = data.pageSize
            this.getData()
        },

        orderDetail(rowData) {
            rowData.consumerBillingMode = this.billingModeObj[rowData.billingMode]
            this.$refs.orderDetailDialog.showDialog('账单详情', rowData)
        }
    }
}
</script>

<style lang="less" scoped>
.searchBox {
    align-items: flex-start !important;
}
/deep/.el-input__inner{
    background-color: #FFFFFF;
    height: 36px;
    line-height: 36px;
}
.formInputWidth {
    width: 100% !important;
    margin: 0 20px 0 0;
}

.marginleft20 {
    margin-left: 20px;
}

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
</style>
