<!-- 拖拽上传,救命，就不能封装个组件吗，一个个粘贴复制写的一模一样
    使用例子：
    @getFile="getFileDrag"
    getFileDrag(file, callback) {
        callback({
            参数，
            url: "/appli/uploadGISLayerFile",
        });
    },
-->
<template>
    <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <div class="dragUpLoad">
            <div class="dragUpLoadTitle">
                <img src="@/views/found/icon.png" alt="" />
                <div class="dragUpLoadText">{{ title }}</div>
            </div>
            <el-upload ref="upload" drag action="#" :auto-upload="false" :accept="accept" :on-change="onChange" :http-request="httpRequest" multiple>
                <img src="@/views/found/file.png" />
                <div class="el-upload__text">
                    <em>点击</em>或将文件拖拽到这里上传
                </div>
                <div class="el-upload__tip" slot="tip">
                    <span style="color: red">* </span>文件默认打开初始的三维视图，请将文件在对应视图打开状态下保存，再上传。上传的BIM文件需要与中心文件分离，否则可能无法转换。
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="loading" class="blueBtn" type="primary" @click="submit">开始上传</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import request from "@/utils/newRequest.js";
export default {
    components: {},
    props: {
        accept: {
            type: String,
            default: "application/x-zip-compressed",
        },
    },
    data() {
        return {
            title: "上传模型",
            dialogVisible: false,
            loading: false,
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(title) {
            this.title = title;
            this.loading = false;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.upload.clearFiles();
            });
        },
        hide() {
            this.dialogVisible = false;
        },
        onChange(file, fileList) {
            const isJPG = this.accept.split(",").includes(file.raw.type);
            if (!isJPG) {
                const idx = this.$refs.upload.uploadFiles.findIndex(
                    (e) => e.uid === file.uid
                );
                this.$refs.upload.uploadFiles.splice(idx, 1);
                // 上传格式不正确！
                this.$message.error("上传格式不正确！");
                return false;
            }
        },
        httpRequest(param) {
            this.$notify({
                title: "警告",
                message: "正在上传，上传过程请勿关闭或刷新页面!",
                type: "warning",
            });
            // 接口不是统一的，emit回去调用
            this.loading = true;
            this.$emit("getFile", param.file, (data) => {
                const formData = new FormData();
                for (const key in data) {
                    if (key !== "url") {
                        formData.append([key], data[key]);
                    }
                }
                request({
                    method: "post",
                    url: data.url,
                    data: formData,
                    onUploadProgress: (progressEvent) => {
                        let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                        param.onProgress({ percent });
                    },
                }).then((res) => {
                    // 成功状态
                    this.loading = false;
                    param.onSuccess(res);
                    this.$emit("onSuccess", res.data)
                    this.hide();
                }).catch(() => {
                    // 失败状态
                    this.loading = false;
                    param.onError();
                });
            });
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
.dragUpLoad {
    box-shadow: 0 0.0625rem 0.8125rem 0 rgb(4 0 0 / 10%);
    border-radius: 8px;
    padding: 30px 40px;
    margin: 10px 30px;
    .dragUpLoadTitle {
        text-align: center;
        .dragUpLoadText {
            font-weight: bold;
            font-size: 22px;
            margin: 20px 0;
        }
    }
    /deep/ .el-upload {
        width: 100%;
        .el-upload-dragger {
            background-color: #f5f5f5;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    }
    .dialog-footer {
        margin-top: 40px;
        .blueBtn {
            width: 150px;
        }
    }
}
</style>