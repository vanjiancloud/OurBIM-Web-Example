<!-- 单个图片上传，没有统一的上传文件接口,自动上传的传url手动的emit  file文件回去， -->
<template>
    <el-upload action="#" :show-file-list="false" :accept="accept" :on-change="onChange" :before-upload="beforeAvatarUpload" :auto-upload="autoUpload" :http-request="httpRequest" :disabled="disabled">
        <img v-if="value" :src="autoUpload?value:changeImg(value)" class="avatar" />
        <slot name="icon" v-else>
            <i class="el-icon-plus avatar-uploader-icon"></i>           
        </slot>
    </el-upload>
</template>

<script>
import { Getuserid } from '@/store/index.js'
import request from "@/utils/newRequest.js";
export default {
    components: {},
    model: {
        prop: "value",
        event: "input",
    },
    props: {
        value: {
            type: [String,File],
            default: ''
        },
        accept: {
            type: String,
            default: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
        },
        url: {
            type: String,
            default: "",
            required: false,
        },
        autoUpload:{
            type: Boolean,
            default: true,
        },
        disabled:{
            type: Boolean,
            default: false,
        },
        // 当其他上传接口用的参数不是默认的参数时，可以用该字段自定义
        params:{
            type: Object,
            default:()=> {},
        }
    },
    data() {
        return {
            imageUrl: "",
        };
    },
    watch: {
        imageUrl(val) {
            this.$emit('input', val)
        }
    },
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
        onChange(file){
            if(!this.autoUpload){
                this.imageUrl = file.raw;
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = this.accept.split(",").includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error(`上传头像图片只能是 ${this.accept} 格式!`);
                return false
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
                return false
            }
            return isJPG && isLt2M;
        },
        httpRequest(param) {
            // 接口不是统一的
            const formData = new FormData();
            if(Object.keys(this.params).length){
                for (const key in this.params) {
                    formData.append([key], ["fileUpload"].includes(key) ? param.file : this.params[key]||param.file);
                }
            }else{
                formData.append("fileUpload", param.file);
                formData.append("userId", Getuserid());
            }
            request({
                method: "post",
                url: this.url,
                data: formData,
            }).then((res) => {
                this.imageUrl = res.data;
                this.$emit("input", res.data);
                this.$emit("success", res.data);
            });
        },
    },
};
</script>
<style lang="less" scoped>
/deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    background: #fcfcfc;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 160px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}
.avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill;
}
</style>