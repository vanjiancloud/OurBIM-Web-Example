<!-- 编辑构件 -->
<template>
    <el-dialog :title="title+'构件'" :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="构件名称：" prop="comName">
                <el-input v-model="form.comName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="构件缩略图：">
                <SingleUpload v-model="form.fileUpload" :autoUpload="false"/>
                <div class="uploadTip">上传长宽比=1:1的图片</div>
            </el-form-item>
            <el-form-item label="换组:" prop="groupId">
                <el-select v-model="form.groupId" placeholder="请选择分组" style="width: 100%;">
                    <el-option :value="item.id" :label="item.groupName" v-for="(item,index) in parentData.filter(e=>e.parentId)" :key="index"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload.vue"
import { updateUserCom } from '@/api/resource/components.js'
export default {
    components: { SingleUpload },
    props: {
        parentData: {
            type: Array,
            default:()=> [],
            require: true
        },
    },
    data() {
        return {
            title: '编辑',
            dialogVisible: false,
            form: {},
            rules: {
                comName: [{required: true, message: '请输入构件名称', trigger: 'blur'}],
                groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
            }
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() { },
    methods: {
        show(row) {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                this.form = row
            })
        },
        hide() {
            this.dialogVisible = false
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                let formData = new FormData()
                for (const key in this.form) {
                    formData.append([key], this.form[key])
                }
                updateUserCom(formData).then(res=>{
                    this.$message.success(res.message)
                    this.hide()
                    this.$parent.$parent.getList(this.form.groupId)
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.uploadTip{
    font-size: 12px;
    color: #999999;
}
/deep/.el-upload{
    width: 120px;
    height: 120px;
}
</style>