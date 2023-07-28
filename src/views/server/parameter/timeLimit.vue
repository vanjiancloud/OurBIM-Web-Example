<!-- 无操作时限 -->
<template>
    <div class="box">
        <div class="tips">单位：秒，指定时间内无操作释放连接，0:表示一直保持连续</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="form">
            <el-form-item label="无操作时限（s）" prop="time">
                <div class="flexStart">
                    <el-input v-model="form.time" placeholder="请输入时限"></el-input>
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
export default {
    components: {},
    props: {},
    data() {
        return {
            form: {},
            rules:{
                time:[{ required: true, message: '请输入时限', trigger: 'blur' }]
            }
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        save(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                
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