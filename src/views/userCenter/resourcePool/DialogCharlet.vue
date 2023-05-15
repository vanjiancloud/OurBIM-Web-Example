<!-- 上传贴图 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="贴图名称:" prop="textureName">
                <el-input v-model="form.textureName" @keydown.native.stop></el-input>
            </el-form-item>
            <el-form-item label="选择分组:" prop="groupId">
                <el-select v-model="form.groupId" placeholder="请选择分组" style="width:100%">
                    <el-option v-for="(item,index) in groupList" :key="index" :label="item.groupName" :value="item.groupId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="贴图文件:" prop="fileUpload">
                <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { addChartlet,updateMaterialTexture } from '@/api/material_api'
export default {
    components: { SingleUpload },
    props: {
        groupList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            title: '',
            dialogVisible: false,
            form: {},
            rules: {
                textureName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                fileUpload: [{required: true,message: '请上传贴图文件',trigger: 'blur'}],
                groupId: [
                    { required: true, message: '请选择分组', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(title, row) {
            this.title = title
            this.form = this.$options.data().form
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                if (row.groupId) {
                    this.form = row
                    this.$set(this.form, 'fileUpload', row.imgPath)
                }
            })
        },
        hide() {
            this.dialogVisible = false
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                if (this.form.textureId) {
                    let data = {
                        userId: this.$route.query.userId,
                        ...this.form
                    }
                    let formData = new FormData()
                    for (const key in data) {
                        formData.append([key], data[key])
                    }
                    updateMaterialTexture(formData).then(() => {
                        this.hide()
                        this.$parent.getChartletList()
                        this.$emit('onSuccess',this.form)
                    })
                } else {
                    let data = {
                        userId: this.$route.query.userId,
                        ...this.form
                    }
                    let formData = new FormData()
                    for (const key in data) {
                        formData.append([key], data[key])
                    }
                    addChartlet(formData).then(() => {
                        this.hide()
                        this.$parent.getChartletList()
                        this.$emit('onSuccess',this.form)
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>