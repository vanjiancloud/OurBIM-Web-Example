<!-- 新建分组 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="分组名称:" prop="name">
                <el-input v-model="form.name" @keydown.native.stop></el-input>
            </el-form-item>
            <el-form-item label="缩略图:">
                <SingleUpload v-model="form.tagUrl" url="/tagControl/uploadTagImg" @success="uploadSuccess"></SingleUpload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload.vue"
import { addUserTagGroup, editUserTag } from '@/api/resource/tag.js'
export default {
    components: { SingleUpload },
    props: {},
    data() {
        return {
            title:'',
            dialogVisible: false,
            form: {},
            rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                tagUrl: [{ required: true, message: "请上传缩略图", trigger: "blur" }],
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(title, row) {
            this.title = title
            this.form = this.$options.data().form
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
                if(row.tagId){
                    this.form = row
                }
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        uploadSuccess(e){
            if(e){
                this.$set(this.form, 'tagUrl', `${this.$config.VUE_APP_REQUEST_URL}/tag/${e}`)
            }
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                let newUrl = this.form.tagUrl && this.form.tagUrl.substring(this.form.tagUrl.lastIndexOf("\/") + 1,this.form.tagUrl.length)
                if(this.form.tagId){
                    let data = {
                        ...this.form,
                        tagUrl: newUrl
                    };
                    editUserTag(data).then(() => {
                        this.hide();
                        this.$message.success('修改成功！')
                        if(this.form.parentId){
                            this.$parent.$parent.cellClick({ tagId: this.form.parentId }, true)
                        }else{
                            this.$parent.$parent.getList();
                        }
                    });
                }else{
                    let data = {
                        userId: this.$store.state.user.userId || this.$route.query.userId,
                        ...this.form,
                        tagUrl: newUrl
                    };
                    addUserTagGroup(data).then(() => {
                        this.hide();
                        this.$message.success('添加成功！')
                        this.$parent.$parent.getList();
                    });
                }
            })
        },
    },
};
</script>
<style lang="less" scoped>
</style>