<!-- 上传图片 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px" :before-close="hide">
        <div class="copy-cropper">
            <vueCropper
                ref="cropper"
                :img="cropperOption.img"
                :outputSize="cropperOption.size"
                :outputType="cropperOption.outputType"
                :info="false"
                :full="cropperOption.full"
                :canMove="cropperOption.canMove"
                :canMoveBox="cropperOption.canMoveBox"
                :fixedBox="cropperOption.fixedBox"
                :original="cropperOption.original"
                :autoCrop="cropperOption.autoCrop"
                :autoCropWidth="cropperOption.autoCropWidth"
                :autoCropHeight="cropperOption.autoCropHeight"
                :centerBox="cropperOption.centerBox"
                :high="cropperOption.high"
                :infoTrue="cropperOption.infoTrue"
                :enlarge="cropperOption.enlarge"
            ></vueCropper>
        </div>
        <div class="uploadTips">*支持png格式</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { base64toFile } from '@/utils/file.js'
import { postTagImg } from '@/api/resource/tag.js'
export default {
    components: {},
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            title:'修改锚点图',
            dialogVisible: false,
            row: {},
            cropperOption: {
                img: null, // 裁剪图片的地址
                imgName: null,
                fileType: null, // 图片类型
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 200, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [7, 5], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: false, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(file, row) {
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.cropperOption.fileType = file.raw.type
                this.cropperOption.imgName = file.name
                this.cropperOption.img = URL.createObjectURL(file.raw)
                this.row = row
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        submit() {
            this.$refs.cropper.getCropData(data => {
                let formData = new FormData()
                formData.append('fileUpload', base64toFile(data), this.cropperOption.imgName)
                formData.append('tagId', this.row.id)
                formData.append('taskId', this.data.taskId)
                formData.append('lableVisibility', true)
                postTagImg(formData).then(res=>{
                    this.hide()
                    this.$parent.$parent.reloadTree()
                })
            })
        },
    },
};
</script>
<style lang="less" scoped>
.copy-cropper {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    border: 1px solid #66b3ff;
    border-radius: 6px;
    overflow: hidden;
}
.uploadTips {
    color: #f56c6c;
    margin-top: 20px;
    text-align: center;
}
</style>