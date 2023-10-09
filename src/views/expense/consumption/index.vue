<template>
    <div class="page-contain">
        <div class="flexSpaceBetween marginBottom16">
            <div class="expense-title">
                消费账单流水
            </div>
        </div>

        <el-form :model="searchForm" label-width="100px">
            <el-row>
                <el-col :xs="12" :sm="8" :lg="8">
                    <el-form-item label="账期" prop="consumerDate">
                        <el-date-picker
                            class="formInputWidth"
                            v-model="searchForm.consumerDate"
                            placeholder="请选择有效时间"
                            type="month"
                            value-format="YYYY-MM"
                        />
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :lg="8">
                    <el-form-item label="计费方式" prop="billingMode">
                        <el-select v-model="searchForm.billingMode" class="formInputWidth" placeholder="请选择计费方式">
                            <el-option
                                v-for="item in billingModeList"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :lg="8">
                    <el-form-item label="消费内容" prop="consumeContent">
                        <el-select
                            v-model="searchForm.consumeContent"
                            class="formInputWidth"
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
                </el-col>
                <el-col :xs="12" :sm="8" :lg="8">
                    <el-form-item label="授权码" prop="authorizationCode">
                        <el-select
                            v-model="searchForm.authorizationCode"
                            class="formInputWidth"
                            placeholder="请选择授权码产品版本"
                        >
                            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-button class="marginleft20" type="primary" @click="getData">查询</el-button>
                <el-button type="primary" @click="resetSearch">重置</el-button>
                <el-button type="info">导出</el-button>
            </el-row>
        </el-form>

        <el-table :data="tableData" v-loading="loading">
            <el-table-column align="center" prop="consumerDate" show-overflow-tooltip label="账期" />
            <el-table-column align="center" prop="id" show-overflow-tooltip label="消费账单ID" />
            <el-table-column align="center" prop="createTime" show-overflow-tooltip label="创建时间" />
            <el-table-column align="center" prop="versionName" show-overflow-tooltip label="产品版本" />
            <el-table-column align="center" prop="billingMode" show-overflow-tooltip label="计费方式">
                <template #default="scope">
                    {{ billingModeObj[scope.row.billingMode] }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="consumeContent" show-overflow-tooltip label="消费内容" />
            <el-table-column align="center" prop="price" show-overflow-tooltip label="服务单价(资源点)" />
            <el-table-column align="center" show-overflow-tooltip label="消费时间">
                <template #default="scope">
                    {{ scope.row.consumeStartTime }} 到 {{ scope.row.consumeEndTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="consumeTime" show-overflow-tooltip label="消费容量/时长" />
            <el-table-column align="center" prop="consumeMoney" show-overflow-tooltip label="消费资源点数" />
            <el-table-column align="center" prop="discountMoney" show-overflow-tooltip label="优惠资源点数" />
            <el-table-column align="center" prop="consumeActualMoney" show-overflow-tooltip label="实扣资源点数" />
            <el-table-column fixed="right" label="操作" width="230px">
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

        <orderDetail
            ref="orderDetailDialog"
            @get-data="getData"
        ></orderDetail>
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
