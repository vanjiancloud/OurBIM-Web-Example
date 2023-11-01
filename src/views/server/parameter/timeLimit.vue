<!-- 无操作时限 -->
<template>
    <div class="box">
        <div class="tips">单位：秒，指定时间内无操作释放连接，0:表示一直保持连接</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="form">
            <el-form-item label="无操作时限（s）" prop="configValue">
                <div class="flexStart">
                    <el-input v-model="form.configValue" placeholder="请输入时限"></el-input>
                    <span class="text">秒</span>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 96px;" size="small" class="blueBtn" @click="save()">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addTime, editTime, getLimitTime } from '@/api/server/parameter'
export default {
    components: {},
    props: {},
    data() {
        return {
            form: {
                configName: 'noOperationTimeLimit',
                configValue:0,
                creator: this.$store.state.user.userId
            },
            rules:{
                configValue:[{ required: true, message: '请输入时限', trigger: 'blur' }]
            }
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() {
        this.getData()
    },
    methods: {
        getData(){
            let data = {
                pageSize:1,
                pageNum:1,
                configName:this.form.configName,
                creator:this.form.creator
            }
            getLimitTime(data).then((res)=>{
                if(res.data.length){
                    this.form = res.data[0]
                }else{
                    addTime(this.form).then(()=>{
                        this.getData()
                    })
                }
            })
        },
        save(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                if(this.form.id){
                    editTime(this.form).then(res=>{
                        this.$message.success('修改成功')
                    })
                }else{
                    addTime(this.form).then(()=>{
                        this.getData()
                    })
                }
            })
        }
    }
};
</script>
<style lang="less" scoped>
.tips{
    font-size: 14px;
    font-weight: 400;
    color: #FF6F03;
    background: #FFF8F0;
    border-radius: 4px;
    border: 1px solid #FFC69B;
    text-align: center;
    padding: 6px;
}
.form{
    margin: 24px auto 0 auto;
    width: 400px;
    .text{
        color: #999999;
        font-size: 14px;
        margin-left: 8px;
    }
}
</style>