<!-- 进程详情 -->
<template>
    <el-dialog title="进程详情" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="530px" :before-close="hide">
        <div class="table">
            <div class="tableItem">
                <div class="tableTitle">TaskId</div>
                <div class="tableContent">{{ detailData.taskId }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">项目名称</div>
                <div class="tableContent">{{ detailData.projectName }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">项目类型</div>
                <div class="tableContent">{{ detailData.projectType }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">服务器ID</div>
                <div class="tableContent">{{ detailData.serverId }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">服务器IP</div>
                <div class="tableContent">{{ detailData.serverIp }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">公网IP</div>
                <div class="tableContent">{{ detailData.publicIp }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">外网出口IP</div>
                <div class="tableContent">{{ detailData.outIp }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">客户终端ID</div>
                <div class="tableContent">{{ detailData.clientId }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">客户端IP</div>
                <div class="tableContent">{{ detailData.clientIp }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">客户终端Mac地址</div>
                <div class="tableContent">{{ detailData.clientMac }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">访问地区</div>
                <div class="tableContent">{{ detailData.visitRegion }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">服务器节点分区</div>
                <div class="tableContent">{{ detailData.serverNodePartition }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">服务器节点分组</div>
                <div class="tableContent">{{ detailData.serverNodeGroup }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">是否限制最高帧率</div>
                <div class="tableContent">{{ detailData.isLimitMaxFps && (!!Number(detailData.isLimitMaxFps) ? "是" : "否") }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">最高帧率</div>
                <div class="tableContent">{{ detailData.maxFps }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">是否离屏渲染</div>
                <div class="tableContent">{{ detailData.isOffscreenRendering&&(!!Number(detailData.isOffscreenRendering) ? "是" : "否") }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">访问方式</div>
                <div class="tableContent">{{ detailData.visitMode }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">进程类型</div>
                <div class="tableContent">{{ detailData.processType }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">是否是预启动项目</div>
                <div class="tableContent">{{ detailData.isPreStartProject&&(!!Number(detailData.isPreStartProject) ? "是" : "否") }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">创建时间</div>
                <div class="tableContent">{{ detailData.createTime }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">开始时间</div>
                <div class="tableContent">{{ detailData.startTime }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">结束时间</div>
                <div class="tableContent">{{ detailData.endTime }}</div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { detail } from "@/api/server/terminal.js"
export default {
    components: { },
    props: {
        
    },
    data() {
        return {
            dialogVisible: false,
            detailData: {},
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(id) {
            detail(id).then(res=>{
                this.detailData = res.data
            })
            this.dialogVisible = true
        },
        hide() {
            this.dialogVisible = false
        },
    }
}
</script>
<style lang="less" scoped>
.table{
    border-top: 1px solid #F3F5F7;
    .tableItem{
        display: flex;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
        border-bottom: 1px solid #F3F5F7;
        border-left: 1px solid #F3F5F7;
        border-right: 1px solid #F3F5F7;
        .tableTitle{
            background-color: #E1F7FD;
            width: 32%;
            padding: 10px 16px;
        }
        .tableContent{
            width: 68%;
            padding: 10px 36px;
        }
    }
}
</style>