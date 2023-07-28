<template>
    <div class="box">
        <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="启动页中心logo" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.logo" :styles="{width: '160px',height:'160px'}"/>
                    <div class="recover" style="margin-left: -50px;" @click="recover">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="启动页背景图" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.logo" :styles="{width: '284px',height:'160px'}">
                        <template slot="tip">
                            推荐尺寸：1920x1080 ，仅上传jpg/png格式
                        </template>
                    </DragUpload>
                    <div class="recover" @click="recover">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="控制球" required>
                <div class="uploadBox">
                    <DragUpload v-model="form.logo" :styles="{width: '160px',height:'160px'}">
                        <template slot="tip">
                            推荐尺寸：100*100 ，仅上传jpg/png格式
                        </template>
                    </DragUpload>
                    <div class="recover" style="margin-left: -50px;" @click="recover">
                        <svg-icon icon-class="recover" class="svgRecover"/>恢复
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import DragUpload from "./components/dragUpload.vue";
export default {
    components: { DragUpload },
    props: {},
    data() {
        return {
            form: {},
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        // 恢复
        recover(){
            this.$confirm(`此操作将恢复为系统默认图，是否继续？`, "恢复", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                
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