<!-- 创建定位码 -->
<template>
    <el-form class="addCode" ref="form" :style="{'width':'95%'}" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="编 号：">
            <span class="text">{{ form.codeId }}</span>
        </el-form-item>
        <el-form-item label="名 称：" prop="codeName">
            <el-input v-model="form.codeName" placeholder="请输入名称" @keydown.native.stop :disabled="data.type===2"></el-input>
        </el-form-item>
        <template v-if="anchorPoint || data.type===2">
            <el-form-item>            
                <el-button v-if="!updateCode && data.type!==2" class="blueBtn1" type="primary" size="mini" @click="updateLocator()">更新定位点</el-button>
                <el-button v-if="updateCode" class="blueBtn" type="primary" size="mini" @click="confirmUpdateLocator(true)">确 定</el-button>
                <el-button v-if="updateCode" class="grayPlain" type="primary" size="mini" @click="confirmUpdateLocator(false)">恢 复</el-button>
            </el-form-item>
            <el-form-item label="视 图：">
                <el-image class="codeViewImg" :src="form.codeViewImg" fit="fit" @click="focusCode({codeIds:form.codeId,focus:true})"></el-image>
            </el-form-item>
            <el-form-item label="创 建 人：">
                <span class="text">{{ form.createUser }}</span>
            </el-form-item>
            <el-form-item label="更新时间：">
                <span class="text">{{ form.updateTime }}</span>
            </el-form-item>
            <el-form-item label="定 位 码 ：">
                <el-image class="qrCode" :src="form.qrCode" fit="fit" @click="focusCode({codeIds:form.codeId,focus:true})"></el-image>
            </el-form-item>
        </template>
        <el-form-item>
            <el-button v-if="!surePlace && !anchorPoint && data.type!==2" class="blueBtn" type="primary" size="small" @click="addCode()">选择定位点</el-button>
            <el-button v-if="surePlace" class="blueBtn" type="primary" size="mini" @click="sureLocator(true)">确 定</el-button>
            <el-button v-if="surePlace" class="grayPlain" type="primary" size="mini" @click="sureLocator(false)">取 消</el-button>
            <el-button v-if="anchorPoint || data.type===2" class="blueBtn" type="primary" size="small" @click="downCode()">下 载</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import qs from "qs";
import { create, getCode, getCodeImg, sureLocator, updateLocator, confirmUpdateLocator, focusLocator } from '@/api/userCenter/locationCode.js'
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default:()=> {}
        }
    },
    data() {
        return {
            form: {
                codeId:null,
                codeViewImg: '',
                qrCode: ''
            },
            rules: {
                codeName: [{required: true, message: '请输入名称', trigger: 'blur'}]
            },
            anchorPoint: false,//是否显示定位点
            surePlace: false,//是否确认放置定位点
            updateCode: false,//是否更新定位点
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() {},
    methods: {
        show(row){
            Object.assign(this.$data, this.$options.data())
            // 新增
            if(this.data.type ===1){
                this.getCode()
            }
            // 编辑
            if(row){
                this.form = row
            }
        },
        // 1.获取编号
        getCode(){
            getCode().then(res=>{
                this.form.codeId = res.data
            })
        },
        // 2.创建定位码
        addCode(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                let data = {
                    ...this.form,
                    taskId: this.data.taskId
                }
                create(data).then(()=>{
                    this.$message.warning('请在模型中选择添加定位点的位置！')
                })
            })
        },
        // 3.定位码放置完成
        placeCode(){
            this.surePlace = true
        },
        // 4.确定/取消放置定位码
        sureLocator(status){
            let data = {
                codeId: this.form.codeId,
                taskId: this.data.taskId,
                status
            }
            sureLocator(data).then(()=>{
                this.surePlace = false
                if(status){
                    setTimeout(()=>{
                        this.anchorPoint = true
                        this.getCodeImg()
                        this.$parent.$parent.getList()
                    },2000)
                }
            })
        },
        //5.确认放置后获取图片信息
        getCodeImg(){
            getCodeImg({ codeId: this.form.codeId }).then(res=>{
                this.form = res.data
            })
        },
        // 下载
        downCode(){
            let data = {
                codeId: this.form.codeId,
                isAll: false
            }
            window.open(`${this.$config.VUE_APP_REQUEST_URL}/ar/downloadLocator?${qs.stringify(data)}`)
        },
        // 启动更新
        updateLocator(){
            let data = {
                codeId: this.form.codeId,
                taskId: this.data.taskId
            }
            updateLocator(data).then(()=>{
                this.updateCode = true
                this.$emit('update',this.updateCode)
            })
        },
        // 更新定位码------status:true/false
        confirmUpdateLocator(status){
            let data = {
                codeId: this.form.codeId,
                taskId: this.data.taskId,
                status
            }
            confirmUpdateLocator(data).then(()=>{
                this.updateCode = false
                setTimeout(()=>{
                    this.anchorPoint = true
                    this.surePlace = false
                    this.getCodeImg()
                    this.$parent.$parent.getList()
                },2000)
            })
        },
        // 选中定位码，定位到定位码位置-------focus:true/false
        focusCode({codeIds,focus}){
            let data = {
                taskId: this.data.taskId,
                codeIds,
                focus
            }
            focusLocator(data)
        }
    }
};
</script>
<style lang="less" scoped>
.addCode{
    padding-top: 20px;
    /deep/ .el-form-item__label{
        color: #C8C9CA;
    }
    .text{
        color: #D5D6D6;
        font-size: 14px;
    }
    .qrCode{
        width: 168px;
        height: 168px;
        cursor: pointer;
    }
    .codeViewImg{
        width: 100%;
        height: 110px;
        cursor: pointer;
    }
}
</style>
