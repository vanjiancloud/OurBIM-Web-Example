<!-- 重新转换 -->
<template>
    <el-dialog title="重新转换" :visible.sync="dialogVisible" width="480px" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
            <el-form-item prop="modelActorLimitNum">
                <el-checkbox label="模型体量优化" v-model="form.modelActor"></el-checkbox>
                <span class="text">模型构件数阈值</span>
                <el-input v-model="form.modelActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
            </el-form-item>
            <el-form-item prop="singleActorLimitNum">
                <el-checkbox label="模型材质优化" v-model="form.singleActor"></el-checkbox>
                <span class="text">单构件面数阈值</span>
                <el-input v-model="form.singleActorLimitNum" placeholder="请输入" style="width:150px;" v-only-number="{min:0}"></el-input>
            </el-form-item>
            <el-form-item prop="platform" label-width="110px" label="解析模型版本">
                <el-radio-group v-model="form.platform" disabled>
                    <el-radio label="Windows">服务端版</el-radio>
                    <el-radio label="Android">Android版</el-radio>
                    <el-radio label="IOS">IOS版</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="tips"><span>*</span>重新转换开始后,之前的数据将自动删除</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { upgradeModle } from "@/api/projectManage/model.js";
export default {
    components: {},
    props: {},
    data() {
        var validateModelActorLimitNum = (rule, value, callback) => {
            if (this.form.modelActor&&!value) {
                callback(new Error('请输入模型构件数阈值'));
            } else {
                callback();
            }
        };
        var validateSingleActorLimitNum = (rule, value, callback) => {
            if (this.form.singleActor&&!value) {
                callback(new Error('请输入单构件面数阈值'));
            } else {
                callback();
            }
        };
        return {
            dialogVisible: false,
            form: {
                modelActor:true,
                singleActor:true,
                platform: 'Windows',
                modelActorLimitNum:'15000',
                singleActorLimitNum:'500'
            },
            rules: {
                modelActorLimitNum: [
                    {
                        required: true,
                        validator: validateModelActorLimitNum,
                        trigger: 'blur'
                    }
                ],
                singleActorLimitNum: [
                    {
                        required: true,
                        validator: validateSingleActorLimitNum,
                        trigger: 'blur'
                    }
                ],
                platform: [
                    {
                        required: true,
                        message:'请选择解析模型版本',
                        trigger: 'blur'
                    }
                ],
            },
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(row) {
            this.dialogVisible = true
            this.form = this.$options.data().form
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                this.form = { ...this.form, ...row }
            })
        },
        hide() {
            this.dialogVisible = false
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                let data = {
                    appId: this.form.appid,
                    userId: this.form.userId,
                    platform: this.form.platform,
                    modelActorLimitNum: this.form.modelActorLimitNum,
                    singleActorLimitNum: this.form.singleActorLimitNum,
                    modelActor: this.form.modelActor,
                    singleActor: this.form.singleActor,
                }
                upgradeModle(data).then(()=>{
                    this.hide()
                    this.$parent.$parent.getAllModelList()
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.text {
    padding: 0 30px;
}
.tips{
    padding: 0 5px;
    span{
        color: #F56C6C;
        padding-right: 3px;
    }
}
</style>