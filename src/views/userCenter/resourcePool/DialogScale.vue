<!-- 设置比例尺 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px" @submit.native.prevent>
            <el-form-item label="输入绘制线段对应的实际长度：" prop="blueprintValue">
                <el-input v-model="form.blueprintValue" @keydown.native.stop placeholder="实际长度" size="small" style="width:150px"></el-input>
                <span class="unit">m</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { updateScale } from "@/api/material_api";
export default {
    components: { },
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            title:'设置比例尺',
            dialogVisible: false,
            form: {},
            rules: {
                blueprintValue: [{ required: true, message: "请输入对应的实际长度", trigger: "blur" }]
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show() {
            this.form = this.$options.data().form
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                if(!this.data.id){
                    this.$message.warning('请选择图纸测量！')
                    return
                }
                let params = {
                    taskId: this.data.taskid,
                }
                let data = [
                    {
                        ...this.form,//要更改的图纸上的数值,非必传,用于计算模型中实际图纸的长度
                        uuid: this.data.object.uuid,//要修改的图纸id,必传
                        measureValue: this.data.measureValue,//图上测量出的值,非必传,用于计算模型中实际图纸的长度
                    }
                ]
                updateScale(params,data).then(()=>{
                    this.hide();
                })
            })
        },
    },
};
</script>
<style lang="less" scoped>
.unit{
    display: inline-block;
    margin-left: 12px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ADAEB3;
}
</style>