<!-- 新建、编辑贴图分组 -->
<template>
    <el-dialog :title="title+'分组'" :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
            <el-form-item label="贴图分组名称：" prop="groupName">
                <el-input v-model="form.groupName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="构件缩略图：">
                <SingleUpload v-model="form.fileUpload" :autoUpload="false"/>
                <div class="uploadTip">上传长宽比=1:1的图片</div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { addChartletGroup, updateMaterialTextureGroup } from '@/api/resource/chartlet.js'
import SingleUpload from "@/components/Upload/singleUpload.vue"
export default {
    components: { SingleUpload },
    props: {},
    data() {
        return {
            title: '新建',
            dialogVisible: false,
            form: {},
            rules: {
                groupName: [{required: true, message: '请输入分组名称', trigger: 'blur'}]
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
                if(row.groupId){
                    this.title = '编辑'
                    this.$set(this.form,'fileUpload',row.imgPath)
                }else{
                    this.title = '新建'
                }
            })
        },
        hide() {
            this.dialogVisible = false
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                if(this.form.groupId){
                    let formData = new FormData();
                    for (const key in this.form) {
                        formData.append([key], this.form[key]);
                    }
                    updateMaterialTextureGroup(formData).then((res) => {
                        this.$message.success(res.message)
                        this.hide();
                        this.$parent.$parent.getList()
                    });
                }else{
                    let data = {
                        userId: Getuserid(),
                        ...this.form,
                    };
                    let formData = new FormData();
                    for (const key in data) {
                        formData.append([key], data[key]);
                    }
                    addChartletGroup(formData).then((res) => {
                        this.$message.success(res.message)
                        this.hide();
                        this.$parent.$parent.getList()
                    });
                }
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