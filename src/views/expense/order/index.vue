<template>
    <div class="page-contain">
        <div class="flexSpaceBetween">
            <div class="expense-title">
                订单列表
            </div>
            <div>
                <el-button type="primary" @click="showDialog = true">批量开票</el-button>
                <el-button @click="jumpToBuy">导出</el-button>
            </div>
        </div>
        <el-table :data="tableData" v-loading="loading">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="code" show-overflow-tooltip label="订单编号" />
            <el-table-column prop="versionName" show-overflow-tooltip label="创建时间" />
            <el-table-column prop="createTime" show-overflow-tooltip label="产品版本类型" />
            <el-table-column prop="activateTime" label="购买/充值资源点数" />
            <el-table-column prop="expireTime" label="购买金额(元)" />
            <el-table-column prop="countNumber" label="优惠码" />
            <el-table-column prop="cloudNumber" label="优惠金额" />
            <el-table-column prop="prestartNumber" label="订单金额" />
            <el-table-column prop="status" show-overflow-tooltip label="订单状态" min-width="110px">
                <template #default="scope">
                    <div :class="['status-circle', `status-${scope.row.status}`]">
                        {{ statusObj[scope.row.status] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="开票状态" />
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <span class="operate-reset" @click="resetCode(scope.row)">去支付</span>
                    <span class="operate-reset" @click="resetCode(scope.row)">开发票</span>
                    <span class="operate-reset" @click="resetCode(scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="pagination.total"
            :page.sync="pagination.pageNum"
            :limit.sync="pagination.pageSize"
            @pagination="handlePageChange"
        />

        <el-dialog title="创建授权码" :visible.sync="showDialog">
            <el-form ref="createForm" :model="createForm" :rules="rules">
                <el-row>
                    <el-col :xs="24" :sm="24" :lg="24">
                        <el-form-item label="选择授权产品版本" prop="version">
                            <el-select v-model="createForm.version" class="formInputWidth" placeholder="请选择产品版本">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="createCode">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getOrderList,
    getProductList,
    createAuthorizationCode,
    resetAuthorizationCode
} from '@/api/expenseManage'
import { Getuserid } from '@/store/index.js'
import { getDictDataByKey } from '@/utils/getDict'
import Pagination from '@/components/Pagination'
export default {
    name: 'authorizationCode',
    components: { Pagination },
    data() {
        return {
            loading: false,
            rules: {
                version: [{ required: true, message: '请输入优惠码名称' }]
            },
            createForm: {
                version: ''
            },
            showDialog: false,
            tableData: [],
            productList: [],
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            statusObj: {}
        }
    },
    created() {
        this.getData()
        this.getProductData()
        this.getCodeStatusData()
    },
    methods: {
        getCodeStatusData() {
            getDictDataByKey('AuthorizationCodeStatusEnum').then(data => {
                let obj = {}
                data.forEach(item => {
                    obj[item.code] = item.value
                })
                this.statusObj = obj
            })
        },

        getProductData() {
            getProductList().then(res => {
                if (res.code === 200) {
                    this.productList = res.data
                }
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
                        item.expireTime = item.expireTime ? item.expireTime : '-'
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

        createCode() {
            this.$refs.createForm.validate(valid => {
                if (valid) {
                    const params = {
                        userId: Getuserid(),
                        versionId: this.createForm.version
                    }
                    createAuthorizationCode(params).then(res => {
                        if (res.code === 200) {
                            this.$message.success('创建成功')
                            this.showDialog = false
                            this.getData()
                        }
                    })
                }
            })
        },

        resetCode(row) {
            resetAuthorizationCode(row.id).then(res => {
                if (res.code === 200) {
                    this.$message.success('重置成功')
                    this.getData()
                }
            })
        },

        jumpToBuy() {
            this.$router.push('recharge')
        }
    }
}
</script>

<style lang="less" scoped>
.formInputWidth {
    width: 360px !important;
    margin: 0 20px 0 0;
}
.page-contain {
    padding: 16px 24px 24px 24px;
}
.flex-right {
    display: flex;
    justify-content: end;
    margin-bottom: 16px;
}
.operate-reset {
    font-size: 14px;
    color: #00aaf0;
    cursor: pointer;
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
