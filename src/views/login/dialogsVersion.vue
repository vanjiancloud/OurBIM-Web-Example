<template>
    <el-dialog title="系统版本选择" :visible.sync="dialogVisible" width="400px" :before-close="hide" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form" ref="form" label-width="120px">
            <el-form-item label="选择版本：" prop="version">
                <el-radio-group v-model="form.version">
                    <el-radio :label="2">OurBIM 2.0</el-radio>
                    <el-radio :label="3">OurBIM 3.0</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            dialogVisible: false,
            form: {
                version: 3
            }
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        show() {
            this.dialogVisible = true
        },
        hide() {
            this.dialogVisible = false
        },
        submit(){
            this.$emit("onSuccess", this.form.version)
        }
    },
};
</script>
<style lang="less" scoped></style>
