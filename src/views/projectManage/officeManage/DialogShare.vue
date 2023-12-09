<template>
    <el-dialog title="分享文档链接" :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="有效期：" v-if="!getShareUrl">
                <el-radio-group v-model="form.timeType">
                    <el-radio label="0">永久</el-radio>
                    <el-radio label="1">30天</el-radio>
                    <el-radio label="2">7天</el-radio>
                    <el-radio label="3">1天</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="shareContent" v-if="getShareUrl">
                <div class="title">通过QQ、微信等分享给好友吧</div>
                <el-form-item label="链接：">
                    <el-input v-model="form.url" disabled style="width: 70%;margin-right: 20px;"></el-input>
                    <el-button type="primary" class="btn"
                        v-clipboard:copy="form.url"
                        v-clipboard:success="onCopyUrl"
                        v-clipboard:error="onErrorUrl">复制链接</el-button>
                </el-form-item>
                <el-form-item label="二维码：">
                    <div class="flexStart">                  
                        <img class="codeImg" :src="form.qrImUrl" alt="" />
                        <div class="copyCode">
                            将二维码分享给好友，对方微信、 钉钉等扫一扫即可访问文档<br/>
                            <el-button type="primary" @click="copyImg">复制二维码</el-button>
                        </div>
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="!getShareUrl">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { urlToblob } from "@/utils/file.js";
import { getDocShareUrl } from '@/api/projectManage/officeManage.js'
export default {
    components: {},
    props: {},
    data() {
        return {
            dialogVisible: false,
            form: {
                timeType: '3'
            },
            getShareUrl: false
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(row) {
            this.dialogVisible = true;
            this.form = { ...this.$options.data().form, userFileId: row.userFileId }
            this.getShareUrl = false
        },
        hide() {
            this.dialogVisible = false;
        },
        submit(){
            let params = {
                ...this.form,
                userId: this.$store.state.user.userId,
            }
            getDocShareUrl(params).then(res=>{
                this.$message.success(res.message);
                this.form = { ...this.form, ...res.data }
                this.getShareUrl = true
            })
        },
        //复制链接成功
        onCopyUrl(e) {
            this.$message.success("链接复制成功！");
        },
        //复制链接失败
        onErrorUrl(e) {
            this.$message.error("复制失败！");
        },
        // 复制二维码图片
        async copyImg() {
            // 剪切板只有image/png格式才行，其他图片格式报错
            urlToblob(this.form.qrImUrl, async blob => {
                const item = new ClipboardItem({[blob.type]: blob});
                navigator.clipboard.write([item]).then(res => {
                        this.$message.success("二维码复制成功！");
                    },
                    err => {
                        this.$message.error("二维码复制失败！", err);
                    }
                );
            });
        },
    }
}
</script>
<style lang="less" scoped>
.shareContent{
    .title{
        text-align: center;
        margin-bottom: 30px;
    }
    .codeImg{
        width: 150px;
        height: 150px;
        margin-right: 30px;
    }
    .copyCode{
        width: 50%;
    }
}
</style>
