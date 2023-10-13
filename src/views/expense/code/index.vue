<template>
    <div class="page-contain">
        <div class="flex-right">
            <el-button type="primary" @click="showDialog = true">创建授权码</el-button>
            <el-button @click="jumpToBuy">购买套餐</el-button>
        </div>
        <el-table :data="tableData" v-loading="loading" @cell-mouse-enter="showData">
            <el-table-column prop="number" label="授权码编号" min-width="110"/>
            <el-table-column prop="code" label="授权码" min-width="140" />
            <el-table-column label="产品版本">
                <template slot-scope="scope">
                    <el-tooltip :disabled="tooltipData.length == 0" placement="right">
                        <div slot="content" class="tooltipBox">
                            <el-table :data="tooltipData">
                                <el-table-column prop="billingName" label="计费项目" />
                                <el-table-column prop="billingUnit" label="计费规格" />
                                <el-table-column prop="rule" label="判断规则" />
                                <el-table-column prop="billingPrice" label="计费单价(资源点数)" />
                            </el-table>
                        </div>
                        <div @click="showData(scope.row.versionName)">
                            <span>{{ scope.row.versionName }}</span><br>
                            <i class="el-icon-question"></i>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建/购买日期" />
            <el-table-column prop="activateTime" label="激活时间" />
            <el-table-column prop="expireTime" label="到期时间" />
            <el-table-column prop="countNumber" label="总并发数" />
            <el-table-column prop="cloudNumber" label="包含云VR/AR/MR并发数" />
            <el-table-column prop="prestartNumber" label="包含预启动并发数" />
            <el-table-column prop="store" label="存储空间" />
            <el-table-column prop="status" show-overflow-tooltip label="状态" min-width="110px">
                <template #default="scope">
                    <div :class="['status-circle', `status-${scope.row.status}`]">
                        {{ statusObj[scope.row.status] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <span class="operate-reset" @click="resetCode(scope.row)">重置</span>
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
    getAuthorizationCodeList,
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
            statusObj: {},
            productObj: {},
            tooltipData: []
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
                    this.productList.forEach(item => {
                        this.productObj[item.name] = item
                    })
                }
            })
        },

        showData(row) {
            this.tooltipData = []
            if (this.productObj[row.versionName]?.billingList) {
                this.tooltipData = this.productObj[row.versionName].billingList
            }
        },

        getData() {
            const params = {
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                userId: Getuserid()
            }
            this.loading = true
            getAuthorizationCodeList(params).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data.rows
                    this.loading = false
                    this.tableData.forEach(item => {
                        item.countNumber = item.countNumber ? item.countNumber : '不限'
                        item.cloudNumber = item.cloudNumber ? item.cloudNumber : '不限'
                        item.prestartNumber = item.prestartNumber ? item.prestartNumber : '不限'
                        item.activateTime = item.activateTime ? item.activateTime : '-'
                        item.expireTime = item.expireTime ? item.expireTime : '-'
                        item.store = item.store ? item.store + ' GB' : '不限'
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
                            this.$store.dispatch('user/getTotal')
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
                    this.$store.dispatch('user/getTotal')
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
.tooltipBox {
    min-width: 600px;
}
.formInputWidth {
    width: 360px !important;
    margin: 0 20px 0 0;
}
.page-contain {
    padding: 16px 24px 24px 24px;
}
.flex-right {
    display: flex;
    justify-content: flex-end;
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
