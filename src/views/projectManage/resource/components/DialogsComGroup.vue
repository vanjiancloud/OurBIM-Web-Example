<!-- 新建、编辑构件 -->
<template>
    <el-dialog :title="title+'分组'" :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="分组名称：" prop="groupName">
                <el-input v-model="form.groupName" placeholder="请输入"></el-input>
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
import { addComGroup, updateComGroup } from '@/api/resource/components.js'
export default {
    components: {},
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
                if(row.id){
                    this.title = '编辑'
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
                let data = {
                    userId:Getuserid(),
                    ...this.form
                }
                if(this.form.id){
                    updateComGroup({...data, groupId: this.form.id}).then(res=>{
                        this.$message.success(res.message)
                        this.hide()
                        this.$parent.$parent.getList()
                    })
                }else{
                    addComGroup(data).then(res=>{
                        this.$message.success(res.message)
                        this.hide()
                        this.$parent.$parent.getList()
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>

</style>