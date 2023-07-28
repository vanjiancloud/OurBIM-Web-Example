<!-- 添加\编辑预启动项目 -->
<template>
    <el-dialog :title="title+'预启动项目'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="选择项目:" prop="textureName">
                <el-input v-model="form.textureName" placeholder="请输入项目名称并查找"></el-input>
            </el-form-item>
            <el-form-item label="预启动数量:" prop="textureName">
                <el-input v-model="form.textureName" placeholder="请输入正整数" v-only-number="{precision:0}"></el-input>
            </el-form-item>
            <el-form-item label="码率:" prop="textureName">
                <el-select v-model="form.region" placeholder="请选择" clearable>
                    <el-option label="所有" value="shanghai"></el-option>
                    <el-option label="3D" value="beijing"></el-option>
                    <el-option label="VR" value="beijing"></el-option>
                    <el-option label="AR/MR" value="beijing"></el-option>
                </el-select>
                <span style="margin-left: 16px;">kbps</span>
            </el-form-item>
            <el-form-item label="帧率:" prop="textureName">
                <el-select v-model="form.region" placeholder="请选择" clearable>
                    <el-option label="所有" value="shanghai"></el-option>
                    <el-option label="3D" value="beijing"></el-option>
                    <el-option label="VR" value="beijing"></el-option>
                    <el-option label="AR/MR" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    components: { },
    props: {},
    data() {
        return {
            title: '',
            dialogVisible: false,
            form: {},
            rules: {
                textureName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                fileUpload: [{required: true,message: '请上传贴图文件',trigger: 'blur'}],
                parentId: [{ required: true, message: '请选择分组', trigger: 'blur' }]
            }
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(row={}) {
            this.form = this.$options.data().form
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                this.form = row
                if (row.id) {
                    this.title = '编辑'
                    this.$set(this.form, 'fileUpload', row.imgPath)
                }else{
                    this.title = '添加'
                }
            })
        },
        hide() {
            this.dialogVisible = false
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>