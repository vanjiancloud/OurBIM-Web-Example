<!-- 新建分组 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="分组名称:" prop="groupName">
                <el-input v-model="form.groupName" @keydown.native.stop></el-input>
            </el-form-item>
            <el-form-item label="缩略图:" prop="fileUpload">
                <SingleUpload v-model="form.fileUpload" :autoUpload="false"></SingleUpload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import CHAILIAOAPI from "@/api/material_api";
import SingleUpload from "@/components/Upload/singleUpload.vue"
// import { addChartletGroup } from "@/api/material_api";
export default {
    components: { SingleUpload },
    props: {},
    data() {
        return {
            title:'',
            dialogVisible: false,
            form: {},
            rules: {
                groupName: [{ required: true, message: "请输入名称", trigger: "blur" }],
                fileUpload: [{ required: true, message: "请上传缩略图", trigger: "blur" }],
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(title, row = {}) {
            this.title = title
            this.form = this.$options.data().form
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
                if(row.groupId){
                    this.form = row
                    this.$set(this.form,'fileUpload',row.imgPath)
                }
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                if(this.form.groupId){

                }else{
                    let data = {
                        userId: this.$route.query.userId,
                        ...this.form,
                    };
                    let formData = new FormData();
                    for (const key in data) {
                        formData.append([key], data[key]);
                    }
                    CHAILIAOAPI.CREATEMATERIALTEXTUREGROUP(formData).then((res) => {
                        if(res.data.code === 0){
                            this.hide();
                            this.$emit('success')
                        }
                    });
                }
            })
        },
    },
};
</script>
<style lang="less" scoped>
</style>