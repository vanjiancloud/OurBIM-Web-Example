<!-- 修改标签名称 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="标签样板名称:" prop="tagName">
                <el-input v-model="form.tagName" @keydown.native.stop></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { updateTag } from '@/api/resource/tag.js'
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            title:'修改标签名称',
            dialogVisible: false,
            form: {},
            rules: {
                tagName: [{ required: true, message: "请输入名称", trigger: "blur" }],
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(row) {
            this.form = this.$options.data().form
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
                if(row.id){
                    this.form = row
                    this.$set(this.form, 'tagName', row.fileName)
                }
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                let data = {
                    tagName: this.form.tagName,
                    tagId: this.form.id,
                    taskId: this.data.taskId,
                    lableVisibility: true
                };
                updateTag(data).then(() => {
                    this.$message.success('修改成功！')
                    this.hide();
                    this.$parent.$parent.reloadTree();
                });
            })
        },
    },
};
</script>
<style lang="less" scoped>
</style>