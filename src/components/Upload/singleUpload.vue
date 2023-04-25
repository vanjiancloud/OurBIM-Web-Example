<!-- 单个图片上传，没有统一的上传文件接口,自动上传的传url手动的emit  file文件回去， -->
<template>
    <el-upload action="#" :show-file-list="false" :accept="accept" :on-change="onChange" :before-upload="beforeAvatarUpload" :auto-upload="autoUpload" :http-request="httpRequest">
        <img v-if="value" :src="autoUpload?value:changeImg(value)" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
            formData.append("fileUpload", param.file);
            formData.append("userId", Getuserid());
            request({
                method: "post",
                url: this.url,
                data: formData,
            }).then((res) => {
                this.imageUrl = res.data;
                this.$emit("input", res.data);
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