<!-- 添加\编辑预启动项目 -->
<template>
    <el-dialog :title="title+'预启动项目'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="选择项目:" prop="projectName">
                <el-autocomplete style="width: 100%;" v-model="form.projectName" :trigger-on-focus="false" value-key="appName" :fetch-suggestions="querySearchAsync" placeholder="请输入项目名称并查找" @select="handleSelect">
                    <template slot-scope="{ item }">
                        {{ item.appName }}
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="预启动数量:" prop="preStartNum">
                <el-input v-model="form.preStartNum" placeholder="请输入正整数" v-only-number="{precision:0}"></el-input>
            </el-form-item>
            <el-form-item label="码率:" prop="codeRate">
                <el-select v-model="form.codeRate" placeholder="请选择">
                    <el-option :label="item" :value="item" v-for="item in codeRate" :key="item"></el-option>
                </el-select>
                <span style="margin-left: 16px;">kbps</span>
            </el-form-item>
            <el-form-item label="帧率:" prop="frameRate">
                <el-select v-model="form.frameRate" placeholder="请选择">
                    <el-option :label="item" :value="item" v-for="item in frameRate" :key="item"></el-option>
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
import { Getuserid } from '@/store/index.js'
import { add, findProject } from "@/api/server/prestart.js"
export default {
    components: { },
    props: {
        codeRate:{
            type: Array,
            default:()=>[]
        },
        frameRate:{
            type: Array,
            default:()=>[]
        }
    },
    data() {
        return {
            title: '',
            dialogVisible: false,
            form: {
                status: "0"
            },
            rules: {
                projectName: [{ required: true, message: '请选择项目', trigger: 'blur' }],
                preStartNum: [{required: true,message: '请输入预启动数量',trigger: 'blur'}],
                codeRate: [{ required: true, message: '请选择码率', trigger: 'blur' }],
                frameRate: [{ required: true, message: '请选择帧率', trigger: 'blur' }]
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
                if (row.id) {
                    this.title = '编辑'
                }else{
                    this.title = '添加'
                }
            })
        },
        hide() {
            this.dialogVisible = false
        },
        // 查找项目
        async querySearchAsync(queryString, cb) {
            this.form.projectId = null
            if(!queryString){
                return cb([]);
            }

            var results = (await findProject({userId:Getuserid(),appName:queryString})).data
            setTimeout(() => {
                cb(results);
            }, 3000);
        },
        // 选中项目
        handleSelect(item) {
            this.$set(this.form,"projectId",item.appid)
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                if(!this.form.projectId) return this.$message.warning('请选择项目')
                add(this.form).then(()=>{
                    this.$message.success("新增成功")
                    this.hide()
                    this.$parent.getList()
                    this.$parent.getOpenPreTotalData()
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>