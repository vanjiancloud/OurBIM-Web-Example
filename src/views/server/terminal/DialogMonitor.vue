<!-- 设备监测 -->
<template>
    <el-dialog title="设备监测" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="530px" :before-close="hide">
        <div class="table">
            <div class="tableItem">
                <div class="tableTitle">客户终端ID</div>
                <div class="tableContent">{{ detailData.clientId }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">设备名称</div>
                <div class="tableContent">{{ detailData.deviceName }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">设备型号</div>
                <div class="tableContent">{{ detailData.deviceType }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">头显电量</div>
                <div class="tableContent">{{ detailData.headDisplayPower }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">手柄电量（左）</div>
                <div class="tableContent">{{ detailData.leftHandleDisplayPower }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">手柄电量（右）</div>
                <div class="tableContent">{{ detailData.rightHandleDisplayPower }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">内存用量</div>
                <div class="tableContent">{{ detailData.memoryUsage }}/{{ detailData.memoryTotal }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">存储用量</div>
                <div class="tableContent">{{ detailData.storageUsage }}/{{ detailData.storageTotal }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">客户端IP</div>
                <div class="tableContent">{{ detailData.clientIp }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">客户端Mac地址</div>
                <div class="tableContent">{{ detailData.clientMac }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">运行中项目名称</div>
                <div class="tableContent">{{ detailData.projectName }}</div>
            </div>
            <div class="tableItem">
                <div class="tableTitle">网络延时</div>
                <div class="tableContent">{{ detailData.networkDelay }}</div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { getTerminalDetail } from "@/api/server/terminal.js"
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
            let data = {
                pageSize:1,
                pageNum:1,
                clientId:id
            }
            getTerminalDetail(data).then(res=>{
                this.detailData = res.data[0]
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