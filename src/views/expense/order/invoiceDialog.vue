<template>
    <el-dialog title="开票申请" :visible.sync="showDialog">
        <template v-if="tableData.length > 1">
            <div class="expense-title marginBot20">已选订单</div>
            <el-table :data="tableData">
                <el-table-column prop="code" show-overflow-tooltip label="订单编号" />
                <el-table-column prop="realMoney" show-overflow-tooltip label="订单金额(元)" />
            </el-table>
            <div class="marginBot20 invoice-money font16">
                开票合计金额：<span class="red">{{ invoiceMoney }}元</span>
            </div>
        </template>

        <div class="expense-title marginBot20">发票信息</div>
        <el-form ref="invoiceForm" :model="invoiceForm" label-position="right" label-width="130px" :rules="rules">
            <el-form-item label="发票类型：" prop="type">
                <el-select v-model="invoiceForm.type" class="w100" placeholder="请选择发票类型">
                    <el-option
                        v-for="item in invoiceTypeData"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="名称：" prop="name">
                <el-input v-model="invoiceForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="number">
                <el-input v-model="invoiceForm.number" placeholder="请输入纳税人识别号"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="phone">
                <el-input v-model="invoiceForm.phone" placeholder="请输入地址、电话"></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="address">
                <el-input v-model="invoiceForm.address" placeholder="请输入地址、电话"></el-input>
            </el-form-item>
            <el-form-item label="开户行及账户：" prop="bankAccount">
                <el-input v-model="invoiceForm.bankAccount" placeholder="请输入开户行及账户"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="getInvoice">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { doInvoice } from '@/api/expenseManage'
export default {
    components: {},
    data() {
        return {
            showDialog: false,
            tableData: [],
            rules: {
                name: [{ required: true, message: '请输入名称' }],
                type: [{ required: true, message: '请选择发票类型' }],
                number: [{ required: true, message: '请输入纳税人识别号' }]
            },
            invoiceForm: {
                name: '', // 名字
                number: '', // 纳税人识别号
                orderIdList: [], // 订单id
                type: '', // 发票类型 0:专用发票  1:普通发票
                address: '', // 地址
                bankAccount: '', // 银行账户
                bankName: '', // 银行名字
                countMoney: '', // 合计金额
                phone: '' // 电话号码
            },
            invoiceTypeData: [
                {
                    code: 0,
                    value: '增值税专用发票'
                },
                {
                    code: 1,
                    value: '增值税普通发票'
                }
            ],
            invoiceMoney: 0
        }
    },
    watch: {},
    computed: {},
    methods: {
        show(data) {
            this.invoiceForm.orderIdList = []
            this.tableData = data
            this.invoiceMoney = 0
            data.forEach(item => {
                this.invoiceForm.orderIdList.push(item.id)
                this.invoiceMoney = this.invoiceMoney + Number(item.realMoney)
            })
            this.showDialog = true
            this.$refs.invoiceForm?.resetFields()
        },

        closeDialog() {
            this.showDialog = false
        },

        getInvoice() {
            this.$refs.invoiceForm.validate(valid => {
                if (valid) {
                    doInvoice(this.invoiceForm).then(res => {
                        if (res.code === 200) {
                            this.$message.success('开票成功')
                            this.closeDialog()
                            this.$parent.getData()
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.marginBot20 {
    margin-bottom: 20px;
}

.invoice-money {
    display: flex;
    justify-content: right;
    margin-top: 10px;
    .red {
        color: red;
    }
}
</style>
