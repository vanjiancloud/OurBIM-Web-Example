<template>
    <div class="box">
        <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="启动页中心logo" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.startUpLogo" type="startUpLogo" :styles="{width: '160px',height:'160px'}"/>
                    <div class="recover" style="margin-left: -50px;" @click="recover('startUpLogo')">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="启动页背景图" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.startUpBkgImg" type="startUpBkgImg" :styles="{width: '284px',height:'160px'}">
                        <template slot="tip">
                            推荐尺寸：1920x1080 ，仅上传jpg/png格式
                        </template>
                    </DragUpload>
                    <div class="recover" @click="recover('startUpBkgImg')">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="控制球" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.controlBallImg" type="controlBallImg" :styles="{width: '160px',height:'160px'}">
                        <template slot="tip">
                            推荐尺寸：100*100 ，仅上传jpg/png格式
                        </template>
                    </DragUpload>
                    <div class="recover" style="margin-left: -50px;" @click="recover('controlBallImg')">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getLogo, restoreImg } from '@/api/server/parameter'
import DragUpload from "./components/dragUpload.vue";
export default {
    components: { DragUpload },
    props: {},
    data() {
        return {
            form: {
                startUpLogo: require('@/assets/images/logo/logo.png'),
                startUpBkgImg: '',
                controlBallImg: require('@/assets/images/logo/logo.png')
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        for (const key in this.form) {
            this.getLogo(key)
        }
    },
    mounted() { },
    methods: {
        getLogo(type){
            let url = `${this.$config.VUE_APP_REQUEST_URL}/cloudServiceImg/downloadImg?userId=${this.$store.state.user.userId}&type=${type}`
            // this.$set(this.form, type, url)
            // let data = {
            //     userId: this.$store.state.user.userId,
            //     type
            // }
            // getLogo(data).then(res=>{
            //     console.log('🚀🚀🚀',res);
            //     if(res.data){
            //         this.$set(this.form, type, res.data)
            //     }
            // })
        },
        // 恢复
        recover(type){
            this.$confirm(`此操作将恢复为系统默认图，是否继续？`, "恢复", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let data ={
                    userId: this.$store.state.user.userId,
                    type
                }
                restoreImg(data).then(()=>{
                    this.$message.success("恢复成功！")
                    this.getLogo(type)
                })
            }).catch(() => {});
        }
    }
};
</script>
<style lang="less" scoped>
.uploadBox{
    display: flex;
    align-items: flex-start;
}
.recover{
    font-weight: 500;
    color: #999999;
    font-size: 14px;
    cursor: pointer;
    margin-top: -10px;
    margin-left: 16px;
    .svgRecover{
        color: #B8CAD5;
        font-size: 14px;
        margin-right: 5px;
    }
    &:hover{
        color: #00AAF0;
        .svgRecover{
            color: #00AAF0;
        }
    }
}
.box{
    display: flex;
    justify-content: center;
}
</style>