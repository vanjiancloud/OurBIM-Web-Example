<!--
 * @Autor: zk
 * @Date: 2024-08-23 19:46:00
 * @LastEditors: zk
 * @LastEditTime: 2024-10-10 21:48:39
 * @Description: 
-->
<!-- 新建序列动画 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px"
        :before-close="hide">
        <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="动画方案名称:" prop="animationName">
                <el-input v-model="form.animationName" placeholder="请输入名称" @keydown.native.stop></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { createAnim, updateAnim } from '@/api/userCenter/modelAnimation.js'
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            title: '创建序列动画方案',
            dialogVisible: false,
            form: {},
            rules: {
                animationName: [{ required: true, message: "请输入名称", trigger: "blur" }],
            },
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        show(title, row = {}) {
            this.title = title + '序列动画方案'
            this.form = this.$options.data().form
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.form = row
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                if(this.form.id){
                    updateAnim(this.form).then(() => {
                        this.$message.success('操作成功！')
                        this.hide();
                        this.$parent.$parent.getSeqList()
                    });
                }else{
                    let data = {
                        ...this.form,
                        userId: this.data.userId,
                        bimId: this.data.appId
                    }
                    createAnim(data).then(() => {
                        this.$message.success('操作成功！')
                        this.hide();
                        this.$parent.$parent.getSeqList()
                    });
                }
            })
        },
    }
};
</script>
<style lang="less" scoped></style>