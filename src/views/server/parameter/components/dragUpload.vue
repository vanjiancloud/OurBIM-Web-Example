<!-- 拖拽图片上传组件 -->
<template>
    <div>      
        <el-upload :show-file-list="false" :style="styles" ref="upload" drag action="#" :auto-upload="autoUpload" :accept="accept" :on-change="onChange" :on-exceed="handleExceed" :http-request="httpRequest">
            <div v-if="value" class="hasImg">
                <img :src="autoUpload ? value : changeImg(value)" class="img">
                <div class="changeText">点击更换</div>
            </div>
            <div v-else>              
                <img src="@/assets/images/common/dragImg.png" />
                <div class="el-upload__text">
                    <em>点击</em>或将文件拖到此处
                </div>
            </div>
        </el-upload>
        <div class="tips" v-if="showText">
            <slot name="tip">
                推荐尺寸：300x300 ，仅上传jpg/png格式
            </slot>
        </div>
    </div>
</template>

<script>
import { uploadLogo } from '@/api/server/parameter'
export default {
    components: {},
    props: {
        // 格式
        accept: {
            type: String,
            default: '.png,.jpg'
        },
        // 是否自动上传
        autoUpload:{
            type: Boolean,
            default: true
        },
        // 样式
        styles: {
            type: Object,
            default:()=>{ return {width: '160px',height:'160px'}}
        },
        // 是否显示提示文本
        showText:{
            type: Boolean,
            default: true
        },
        // 值
        value: {
            type: [String, File],
            default: '',
        },
        type: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            loading: false,
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        changeImg(file){
            if(typeof file === 'string'){
                return file
            }
            return URL.createObjectURL(file)
        },
        onChange(file, fileList) {
            let splitName = file.name.split('.')
            const isJPG = this.accept.split(",").includes(`.${splitName[splitName.length-1].toLowerCase()}`);
            if (!isJPG) {
                const idx = this.$refs.upload.uploadFiles.findIndex(
                    (e) => e.uid === file.uid
                );
                this.$refs.upload.uploadFiles.splice(idx, 1);
                // 上传格式不正确！
                this.$message.error("上传格式不正确！");
                return false;
            }
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
            if(!this.autoUpload){
                this.$emit("input", file.raw);
            }
        },
        handleExceed() {
            // 最多只能上传
            this.$message.warning(`最多只能上传${this.limit}个`)
        },
        httpRequest(param) {
            let data = {
                userId: this.$store.state.user.userId,
                file: param.file,
                type: this.type
            }
            const formData = new FormData();
            for (const key in data) {
                formData.append([key], data[key]);
            }
            uploadLogo(formData).then((res)=>{
                this.$message.success("修改成功！")
                this.$emit("success", this.type);
            })
        },
        submit() {
            if(!this.$refs.upload.uploadFiles.length){
                return this.$message.warning("请上传文件");
            }
            this.$refs.upload.submit();
        },
    },
};
</script>
<style lang="less" scoped>
.tips{
    color: #999999;
    font-size: 12px;
}
.img{
    max-width: 100%;
    max-height: 100%;
}
.hasImg{
    width: 100%;
    height: 100%;
    position: relative;
    display: contents;
    .changeText{
        width: 100%;
        height: 34px;
        background: #00AAF0;
        opacity: 0.63;
        filter: blur(0px);
        position: absolute;
        bottom: 0;
        font-weight: 500;
        color: #FFFFFF;
        font-size: 12px;
        line-height: 34px;
        display: none;
    }
    &:hover .changeText{
        display: block;
    }
}
/deep/ .el-upload {
    width: 100%;
    height: 100%;
    .el-upload-dragger {
        background-color: #F9F9F9;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border: 1px solid #D0DCE3;
    }
}
</style>