<template>
    <div class="stream">
        <iframe class="iframe" allowfullscreen="true" v-if="iframeUrl" :src="iframeUrl" frameborder="0" @mouseover="setFocus()" @mouseout="leaveFocus()"></iframe>
        <!-- 遮罩层 -->
        <div class="hidden-bim" v-if="mask">
            <div class="hidden-bim" :style="{background:`#000000 url(${logoImg.startUpBkgImg}) no-repeat center`}">
                <img v-if="logoImg.startUpLogo" :src="logoImg.startUpLogo" class="show-loading" alt="" />
                <div class="hidden-text">{{ baseExceptMessge }}</div>
            </div>

            <div class="proccessText" v-if="loadingProccessArr.length && baseExceptMessge === exceptionMessge[0]">
                {{ loadingProccessArr[loadingProccess].text }} ({{loadingProccess+1}}/{{loadingProccessArr.length || 5}})
            </div>
        </div>
    </div>
</template>

<script>
import { getLogo } from '@/api/server/parameter'
import { getProccess, preloadStart, doRequestOurBimStream } from "@/api/userCenter/index";
require('@/utils/mqttws31.min.js')
export default {
    components: {},
    props: {},
    data() {
        return {
            iframeUrl: '',
            mask: true,
            logoImg:{
                startUpLogo: '',
                startUpBkgImg: ''
            },
                // 加载流程
            loadingProccess:0,
            loadingProccessArr:[{
                status: "success",
                text: "准备统一权限认证"
            }],
            //   异常提示
            exceptionMessge:[
                "环境加载中…",
                "长时间未交互，已自动断开，刷新即可重连",
                "模型长时间未响应，请刷新重试"
            ],
            baseExceptMessge: "环境加载中…",
            preType:false,//是否是预启动
            taskId: '',
        }
    },
    watch: {},
    computed: {},
    created() {
        this.taskId = this.$route.query.taskId
        this.getLogo("startUpLogo")
        this.getLogo("startUpBkgImg")
        this.unLoad()
        this.initMqtt()
        this.addMessageEvent();
    },
    mounted() {},
    destroyed(){
        this.sendMqtt()
    },
    deactivated(){
        this.sendMqtt()
    },
    methods: {
        setFocus(){
            document.querySelector('.iframe').contentWindow.focus()
        },
        leaveFocus(){
            document.querySelector('.iframe').contentWindow.blur()
        },
        isMobile() {
            let flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return flag;
        },
        // 获取中logo
        getLogo(type){
            let url = `${this.$config.VUE_APP_REQUEST_URL}/cloudServiceImg/downloadImg?userId=${this.$route.query.userId}&type=${type}&time=${new Date().getTime()}`
            let data = {
                userId: this.$route.query.userId,
                type
            }
            let imgs = {
                startUpLogo: require('@/assets/images/logo/logo.png'),
                startUpBkgImg: require('@/assets/images/logo/loading.png')
            }
            getLogo(data).then(res=>{
                if(res.message === "用户已上传图片"){
                    this.$set(this.logoImg, type, url)
                }else{
                    this.$set(this.logoImg, type, imgs[type])
                }
            }).catch(()=>{
                this.$set(this.logoImg, type, imgs[type])
            })
        },
        // 获取流程文字
        getProccess(){
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let count = 0;//计算请求次数
            const getResponse = ()=>{
                if(this.baseExceptMessge !== this.exceptionMessge[0]) return
                getProccess({taskId:this.taskId}).then(async res=>{
                    this.loadingProccessArr = res.data
                    for (let i = 0; i < res.data.length; i++) {
                        if(!this.mask || this.loadingProccessArr[this.loadingProccessArr.length-1].status==='success' || count > 30) return
                        const element = res.data[i];
                        if(element.status==="waiting"){
                            this.loadingProccess = i
                            count++
                            setTimeout(getResponse(),1200)
                            return
                        }else if(element.status==="success" && (count === 0 || (this.loadingProccess < i))){
                            this.loadingProccess = i
                        }
                        await sleep(200);
                    }
                })
            }
            getResponse()
        },
        handleWindowSize() {
            const viewWidth = window.innerWidth; //获取可视区域宽度
            const viewHeight = window.innerHeight; //获取可视区域高度
            let height = "";
            let width = "";
            if (viewWidth > viewHeight) {
                // 宽大于高 横屏
                height = document.body.clientHeight;
                width = document.body.clientWidth;
            } else {
                height = document.body.clientWidth;
                width = document.body.clientHeight;
            }
            return { width, height }
        },
        // 获取流
        getUrl(){
            let size = this.handleWindowSize()
            let data = {
                appliId: this.$route.query.appid,
                token: this.$route.query.token,
                resX: size.width,
                resY: size.height,
                taskId: this.taskId
            }
            doRequestOurBimStream(data).then(res=>{
                this.iframeUrl = `${res.data.url}&webUrl=${this.$config.VUE_APP_REQUEST_URL}`
                this.preType = res.data.preType==='1' ? true : false
                if(this.preType){
                    preloadStart({ taskId: this.taskId })
                }
                this.getMonitor();
                this.client.subscribe(`task/${this.taskId}/#`);
                this.client.subscribe(`preloadEnd/${this.taskId}`);
            }).catch((e)=>{
                if(e?.message){
                    this.baseExceptMessge = e.message
                    this.sentToParentIframe(this.baseExceptMessge, 'error')
                }
            })
        },
        /*
        注释中所提到的后台即为发布端/订阅端
        */
        initMqtt(){
            const url = new URL(this.$config.VUE_APP_REQUEST_URL);
            var hostname = url.hostname,
                port = this.$config.mqttPort,
                clientId = `mqtt_${Math.random().toString(16).slice(3)}`,
                timeout = 4000,
                keepAlive = 100,
                cleanSession = false,
                ssl = url.protocol === 'https:';
            this.client = new Paho.MQTT.Client(hostname, port, clientId);
            var options = {
                invocationContext: {
                    host: hostname,
                    port: port,
                    path: this.client.path,
                    clientId: clientId
                },
                timeout: timeout,
                keepAliveInterval: keepAlive,
                cleanSession: cleanSession,
                useSSL: ssl,
                userName: "vanjian",  
                password: "vanjian666",  
                onSuccess: (e) => {
                    this.client.subscribe(`terminal/${this.$route.query.token}`);
                    this.$nextTick(()=>{
                        this.getUrl();
                    })
                },
                onFailure: (e) => {
                    console.log("onFailure",e);
                }
            };
            this.client.connect(options);

            // 注册消息接收处理事件
            this.client.onConnectionLost = (responseObject)=> {
                if (responseObject.errorCode !== 0) {
                    console.log("onConnectionLost:" + responseObject.errorMessage);
                    console.log("连接已断开");
                }
            };
            //注册连接断开处理事件  
            this.client.onMessageArrived = (message)=> {
                switch (message.destinationName) {
                    case `terminal/${this.$route.query.token}`:
                        let res = JSON.parse(message.payloadString)
                        if(res.taskId){
                            this.taskId = res.taskId
                            this.getProccess()
                        }
                        break;
                    case `preloadEnd/${this.taskId}`:
                        // 关闭视频流
                        this.sendToIframe(10400,true);
                        break;
                
                    default:
                        break;
                }
            };
        },
        // 发送关闭进程消息到mqtt
        sendMqtt() {
            if(!this.taskId) return
            if(this.preType){
                // 预启动关闭
                this.closePre()
                return
            }
            this.closeProgress()
            let mess = `task/${this.taskId}/js/close`
            var message = new Paho.MQTT.Message(JSON.stringify({timestamp:new Date().getTime()}));
            message.destinationName = mess;
            message.qos=0;
            this.client.send(message);
        },
        // 关闭预启动
        closePre(){
            fetch(`${this.$config.VUE_APP_REQUEST_URL}/cloudServicePreStart/preloadClose?taskId=${this.taskId}`, {
                method: 'POST',
                keepalive: true
            });
        },
        // 关闭普通模型
        closeProgress(){
            fetch(`${this.$config.VUE_APP_REQUEST_URL}/cloudServiceProcess/endProgressBrow?taskId=${this.taskId}`, {
                method: 'POST',
                keepalive: true
            });
        },
        // 监听刷新浏览器
        unLoad(){
            window.addEventListener('error', (e)=>{
                this.sendMqtt()
            });
            window.addEventListener('beforeunload', (event)=> {
                this.sendMqtt()
            });
            window.addEventListener('unload', (event)=> {
                this.sendMqtt()
            });
            if (this.isMobile()) {
                window.addEventListener('pagehide', ()=> {
                    this.sendMqtt()
                });
            }
        },
        getMonitor() {
            document.addEventListener("keydown", (e) => {
                if([37,38,39,40,229].includes(e.keyCode)) return
                this.sendToIframe(10010,
                    {
                        key: e.code,
                        keyCode: e.keyCode,
                        repeat: e.repeat,
                    }
                );
            },true);
            document.addEventListener("keyup", (e) => {
                if([37,38,39,40,229].includes(e.keyCode)) return
                this.sendToIframe(10011,
                    {
                        key: e.code,
                        keyCode: e.keyCode,
                        repeat: e.repeat,
                    }
                );
            },true);
        },
        // 向子页面发送消息
        sendToIframe(type, data, message) {
            let realIframe = document.querySelector('.iframe');
            if (realIframe) {
                let param = {
                    prex: "pxymessage", // 约定的消息头部
                    type, // 消息类型
                    data, // 具体数据
                    message, // 附加信息
                }
                realIframe.contentWindow.postMessage(param, "*");
            }
        },
        // 向父页面发送消息
        sentToParentIframe(message, type, data = {}) {
            let parentMessage = {
                prex: "ourbimBaseMessage",
                type,
                data,
                message,
            };
            window.parent.postMessage(parentMessage, '*');
        },
        // 接收父页面发来的消息和子页面发来的消息
        addMessageEvent() {
            window.addEventListener("message",(e) => {
                let res = e.data
                if (res.prex === "ourbimBaseMessage") {
                    if(res.type === 'error'){
                        this.mask = true;
                        this.baseExceptMessge = res.message
                        this.sentToParentIframe(this.baseExceptMessge,res.type)
                    }
                    if(res.type === 200){
                        // 模型打开成功
                        setTimeout(()=>{
                            this.mask = false;
                        },800)
                    }
                }
                if(res.prex === "pxymessage"){
                    this.sendToIframe(res.type, res.data, res.message)
                }
            },false);
        },
    }
}
</script>
<style lang="less" scoped>
@import './index.less';
.stream,.iframe{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
