<!-- 无操作时限 -->
<template>
    <div class="box">
        <div class="tips">单位：秒，指定时间内无操作释放连接，0:表示一直保持连续</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="form">
            <el-form-item label="无操作时限（s）" prop="time">
                <div class="flexStart">
                    <el-input v-model="form.time" placeholder="请输入时限"></el-input>
                    <span class="text">秒</span>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 96px;" size="small" class="blueBtn" @click="save()">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Getuserid } from '@/store/index.js'
import { addTime, editTime, getLimitTime } from '@/api/server/parameter'
export default {
    components: {},
    props: {},
    data() {
        return {
            form: {},
            rules:{
                time:[{ required: true, message: '请输入时限', trigger: 'blur' }]
            }
        };
    },
    watch: {},
    computed: {},
    created() { },
    mounted() {
        function getLocalIPAddress() {
  return new Promise((resolve, reject) => {
    const peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    const sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
  
    if (!peerConnection) {
      reject(new Error("WebRTC is not supported in this browser"));
      return;
    }
  
    const pc = new peerConnection({ iceServers: [] });
    pc.createDataChannel("");
  
    pc.onicecandidate = function (event) {
      if (event && event.candidate && event.candidate.candidate) {
        const ipRegex = /(?<=ip\s)([^\s]+)/g;
        const match = event.candidate.candidate.match(ipRegex);
        const ipAddress = match ? match[0] : undefined;
        const os = require('os');
        const hostname = os.hostname();
        console.log('当前计算机的主机名：', hostname);
        console.log('🚀🚀🚀',ipAddress,hostname);
        resolve(ipAddress);
      }
  
      pc.onicecandidate = null;
      pc.close();
    };
  
    pc.createOffer(function (offer) {
      pc.setLocalDescription(new sessionDescription(offer), function () {}, reject);
    }, reject);
  });
}

// 调用示例：
getLocalIPAddress()
  .then(ipAddress => console.log('本地IP地址为：', ipAddress))
  .catch(error => console.error(error));
    },
    methods: {
        save(){
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                
            })
        }
    }
};
</script>
<style lang="less" scoped>
.tips{
    font-size: 14px;
    font-weight: 400;
    color: #FF6F03;
    background: #FFF8F0;
    border-radius: 4px;
    border: 1px solid #FFC69B;
    text-align: center;
    padding: 6px;
}
.form{
    margin: 24px auto 0 auto;
    width: 400px;
    .text{
        color: #999999;
        font-size: 14px;
        margin-left: 8px;
    }
}
</style>