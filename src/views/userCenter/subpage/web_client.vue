<!--
 * @Author: zk
 * @Date: 2021-03-10 14:08:18
 * @LastEditors: zk
 * @LastEditTime: 2021-11-26 00:53:34
 * @description: 
-->
<template>
  <div class="bim-main">
    <iframe
      class="bim-web"
      allowfullscreen="true"
      :class="{'phone-bim':isMobile()}"
      v-if="webUrl"
      :src="webUrl"
      frameborder="0"
      id="show-bim"
    ></iframe>
    <!-- 遮罩层 -->
    <div class="hidden-bim" :class="{'phone-hidden-bim':isMobile()}" v-if="isFade">
      <div class="hidden-bim" :style="{background:`#000000 url(${logoImg.startUpBkgImg}) no-repeat center`}">
        <img v-if="logoImg.startUpLogo" :src="logoImg.startUpLogo" class="show-loading" alt="" />
        <div class="bim-progress" v-if="hiddenState === 0">
          <div class="load-tip">
            {{ exceptionMessge[hiddenState] }}
            <div>{{ propsProgress.loadData }}%</div>
          </div>
          <el-progress
            type="line"
            :show-text="false"
            :percentage="propsProgress.loadData"
          ></el-progress>
        </div>
        <div v-else-if="hiddenState === -1" class="hidden-text">{{ baseExceptMessge }}</div>
        <div v-else class="hidden-text">{{ exceptionMessge[hiddenState] }}</div>
      </div>

      <div class="proccessText" v-if="loadingProccessArr.length && hiddenState !== 2">
        {{ loadingProccessArr[loadingProccess].text }} ({{loadingProccess+1}}/{{loadingProccessArr.length || 5}})
      </div>
    </div>
    
    <div v-if="!isMobile()">      
      <transition name="el-fade-in-linear">
        <progress-bar
          v-if="isProgress"
          :propsProgress="propsProgress"
        ></progress-bar>
      </transition>
      <!-- 右上角 -->
      <view-cube
        v-if="controllerInfo.viewCube&&controllerInfo.tagUiBar"
        :userType="userType"
        @handleOrder="handleOrder"
        @goFront="goFront"
        @handleType="handleType"
        ref="getCube"
      ></view-cube>
    
    
    <!-- 协同模式弹窗 -->
    <teamwork-dialog
      ref="teamworkDialogRef"
      :shareCode="shareCode"
      :appId="appId"
    ></teamwork-dialog>
    <div class="invite-team-friend" v-if="userType === '1'">
      <div class="invite-btn" @click="openTeamDialog">
        <img src="./friend.png" alt="" /> 邀请成员
      </div>
    </div>
    <EscDialogItem ref="EscDialogItem" :title="escTitle" />
      <div v-show="controllerInfo.tagUiBar" v-if="isUiBar&&!isFade">
        <!-- 漫游导航 -->
        <roamNavigate ref="roamNavigate" :taskId="taskId" v-show="checkShow('roaming')"></roamNavigate>
        <!-- 资源库 -->
        <ResourcePool ref="ResourcePool" :data="{ taskId, userId, selectPark, materialData, pakIdMapweb }" v-show="checkShow('resource')"/>
        <!-- 构件信息 -->
        <ComponentInformation ref="ComponentInformation" :data="{ taskId, memberInfo, materialData, pakIdMapweb, selectPark }" v-show="checkShow('componentInformation')"/>
        <!-- 天气 -->
        <Weather ref="Weather" :data="{ taskId, appId }" v-show="checkShow('renderingEnvironment')"/>
        <!-- 标签 -->
        <Label ref="Label" v-show="checkShow('label')" :setProps="{ taskId, appId }" @setTagClick="setTagClick" />
        <!-- 标签库(未上线) -->
        <!-- <TagLibrary ref="TagLibrary" v-show="checkShow('label')" :data="{ taskId, appId }"/> -->
        <!-- (视图) -->
        <viewPhoto ref="viewPhoto" v-show="checkShow('view')" :viewPic="showViewPicture" :setProps="{ taskId }" :taskId="taskId" @closeClick="showViewPicture='0'"></viewPhoto>
        <!-- 浏览器构件树，构件管理 -->
        <ComponentTree ref="ComponentTree" v-show="checkShow('browser')" :memberInfo.sync="memberInfo" :data="{ taskId, appId }"/>
        <!-- 定位码 -->
        <LocationCode ref="LocationCode" v-show="checkShow('locationCode')" :data="{ taskId, appId }"/>
        <!-- 底部工具栏 -->
        <Tool ref="Tool" v-model="activeToolArr" :data="{ taskId, appId, selectPark, isGis, hideTools: controllerInfo.hideTools, showTools:controllerInfo.showTools }" @onSuccess="toolSuccess"/>
        <!-- 设置比例尺弹窗 -->
        <DialogScale ref="DialogScale" :data="copyingPictures" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Drawer from '@/components/Drawer/index.vue'
import { getTaskId, getProccess } from "@/api/userCenter/web_client";
import MODELAPI,{ doAction } from "@/api/model_api";
import CHAILIAOAPI from "@/api/material_api";   // 新增的材质库相关API （材质库）
import viewCube from "@/components/web_client/view_cube";
import roamNavigate from "@/components/web_client/roam_navigate";
import viewPhoto from "@/components/web_client/view_photo";
import progressBar from "@/components/web_client/progress_bar";
import TeamworkDialog from "@/views/projectManage/model/TeamworkDialog.vue";
import EscDialogItem from "@/components/web_client/EscDialogItem.vue";
import { Getuserid } from "@/store/index.js"; // (自定义构件)
import Weather from "../weather/index.vue"; // 天气系统
import ResourcePool from "../resourcePool/index.vue"; // 资源库
import ComponentInformation from "../componentInformation/index.vue"; //构件信息
import Label from "../label/index.vue"; //标签
import TagLibrary from "../label/tagLibrary.vue"; //标签库
import ComponentTree from "../componentManage/componentTree.vue"; //构件树
import LocationCode from "../locationCode/index.vue"; //定位码
import Tool from "../Tool/index.vue"; //底部工具栏
import DialogScale from "@/views/userCenter/resourcePool/DialogScale.vue"; //设置比例尺弹窗
import { EventBus } from '@/utils/bus.js'
var mqtt = require('@/utils/mqttws31.min.js')
import { getLogo } from '@/api/server/parameter'

export default {
  name: "look_app",
  layout: "reset",
  components: {
    viewCube,
    progressBar,
    TeamworkDialog,
    EscDialogItem,
    roamNavigate,
    viewPhoto,
    Weather,
    ResourcePool,
    ComponentInformation,
    Tool,
    Label,
    TagLibrary,
    DialogScale,
    ComponentTree,
    LocationCode,
    Drawer,
  },
  data() {
    return {
      logoImg:{},
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
      baseExceptMessge: "",
      userId: this.$route.query.userId || Getuserid() || 'travels',//用户id：链接可能没有用户id取缓存的
      activeToolArr: [],//工具栏打开的内容
      isGis: false,
      showViewPicture:'0', // 传递给 viewPhoto 控制视图列表的显示 (视图)
      maxNodes:false,
      shareCode: null,
      propsProgress: {
        data: 0,
        loadData: 0,
      },

      isProgress: true,
    //   uiBar： ，viewCube：导航里的viewCube，tagUiBar：底部栏显示隐藏，
      controllerInfo: {
        uiBar: true,
        viewCube: true,
        tagUiBar: true,
        hideTools: [],//选择性隐藏工具栏数组
        showTools: [],//选择性显示工具栏数组
      },
      webUrl: null,
      appId: null,
      appToken: null,
      taskId: null,
      isFade: true,
      handleState: 0,
      listenInfo: null,
      cubeState: 6,
      memberInfo: [], //属性信息
      loadTimer: null,
      hiddenState: 0,
      websock: null,
      socketTimer: null,
      shadowType: null,
      isUiBar: true,
      uaInfo: null,
      iTime: {},
      appType: null,
      userType: null,
      // （材质库）
      materialData: {},
      selectPark: null,//选择构件
      // 贴图库 公共库的信息
      pakIdMapweb:'', // 区分点击的是自定义构件还是模型自带的构件
      pakAndAppid:[],
      escTitle: '',//esc显示名称
      copyingPictures: {},//临摹图信息
      client: null //mqtt
    };
  },
  computed: {
    ...mapGetters(["componentAllInfo", "materialAllInfo"]),
  },
  watch: {},
  created() {
    this.getLogo("startUpLogo")
    this.getLogo("startUpBkgImg")
    this.unLoad()
    this.initMqtt()
    // 用定时器给 环境加载中进度条 赋假值 让其(不再只有0和100)
    let timerTime = null;
    timerTime = setInterval(()=>{
      // 大于85 和 节点已达到最大时 就停止定时器---
      if(this.propsProgress.loadData > 90 || this.maxNodes === true){
        clearInterval(timerTime);
      }
      if(this.propsProgress.loadData <= 90 && this.maxNodes === false){
        this.propsProgress.loadData += 5;
      }
     },300);
    this.uaInfo = navigator.userAgent.toLowerCase();
    this.appId = this.$route.query.appid;
    this.appToken = this.$route.query.token;
    this.isUiBar =
      this.$route.query.uibar === undefined || this.$route.query.uibar === true
        ? true
        : false;
    if (this.$route.query.appType) {
      this.appType = this.$route.query.appType;
      // 如果是云应用就去掉遮罩层和操作栏以及加载进度---
      if(this.$route.query.appType === '5'){
        this.isFade = false;
        this.isProgress =false;
      }
    }

    // appType  0:普通模型(isGis: GIS模型)   1:漫游模型   3:链接模型(isGis: GIS链接模型)  4:示例模型    5:云应用
    this.isGis = (this.$route.query.isGis&&eval(this.$route.query.isGis.toLowerCase())) || (this.$route.query.weatherBin&&eval(this.$route.query.weatherBin.toLowerCase())) || false
  },
  mounted() {
    this.setTimeLoad();
    this.addMessageEvent();
    this.getLinkModelAppid(); // 获取appid
  },
  deactivated(){
    this.sendMqtt()
    this.clearTimePass();
    this.closeWebSocket();
  },
  methods: {
    // 获取中logo
    getLogo(type){
        let url = `${this.$config.VUE_APP_REQUEST_URL}/cloudServiceImg/downloadImg?userId=${this.$store.state.user.userId}&type=${type}&time=${new Date().getTime()}`
        let data = {
            userId: this.$store.state.user.userId,
            type
        }
        getLogo(data).then(res=>{
            if(res.message === "用户已上传图片"){
                this.$set(this.logoImg, type, url)
            }else{
                let defaultLogo = {
                    startUpLogo: require('@/assets/images/logo/logo.png'),
                    startUpBkgImg: '',
                }
                this.$set(this.logoImg, type, defaultLogo[type])
            }
        })
    },
    // 点击底部工具栏后操作
    toolSuccess(e){
        if(!this.taskId) return
        switch (e.key) {
            // 显示
            case 'show':
                
                break;
            // 框选
            case 'selection':
                
                break;
            // 漫游导航
            case 'roaming':
                this.$refs.roamNavigate.show()
                break;
            // 模型剖切
            case 'modelSectioning':
                
                break;
            // 测量
            case 'measure':
                
                break;
            // 标签
            case 'label':
                this.$refs.Label.show()
                // this.$refs.TagLibrary.show()
                break;
            // 视图
            case 'view':
                this.$refs.viewPhoto.hide()
                break;
            // 模型动画
            case 'modelAnimation':
                
                break;
            // 分解模型
            case 'decompositionModel':
                
                break;
            // 渲染环境
            case 'renderingEnvironment':
                this.$refs.Weather.show()
                break;
            // 资源库
            case 'resource':
                this.$refs.ResourcePool.show()
                break;
            // 浏览器
            case 'browser':
                this.$refs.ComponentTree.show()
                break;
            // 构件信息memberInfo:属性信息
            case 'componentInformation':
                this.$refs.ComponentInformation.show()
                break;
            // 定位码
            case 'locationCode':
                this.$refs.LocationCode.show()
                break;
        
            default:
                break;
        }
    },
    // 是否显示弹窗
    checkShow(key){
        return this.activeToolArr.includes(key)
    },
    // 操作esc的时候隐藏工具栏true隐藏，false显示
    hideTool(val = true){
        this.controllerInfo.tagUiBar = !val;//底部栏隐藏
        if(!val){
          this.escTitle = ''
        }
        this.$refs.EscDialogItem.changeVisible(val);
    },
    outPic(url){
            //实例化一个img对象
            const img = new Image();
            //设置img的图片路径
            img.src = url;
            //设置跨域解决
            img.setAttribute('crossOrigin', 'Anonymous');
            //img加载完后处理
            img.onload = function() {
                //创建一个canvas对象
                const canvas = document.createElement('canvas')
                //把图片的宽度设为canves的宽度
                canvas.width = 1200
                //把图片的高度设为canves的高度
                canvas.height = 700
                //创建一个2d画布
                const ctx = canvas.getContext('2d')
                // 将img中的内容画到画布上
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                // 将画布内容转换为base64
                let base64 = canvas.toDataURL()
                // 创建a链接
                const a = document.createElement('a')
                a.href = base64
                a.download = ''
                // 触发a链接点击事件，浏览器开始下载文件
                a.click()
            }
        },

    // 用于给 viewphoto组件传值 （视图）
    showViewPic(valModel){
      this.showViewPicture = valModel;
    },
      // 监听工具栏隐藏和显示
    addMessageEvent() {
        window.addEventListener("message",(e) => {
            let res = e.data
            if (res.prex === "ourbimBaseMessage") {
                let errType = [0,1].includes(res.type)
                if(errType){
                    this.closeWebSocket();
                    this.isFade = true;
                    this.hiddenState = -1
                    this.baseExceptMessge = res.message
                }
            }
          if (e.data.prex === "ourbimMessage") {
            // 控制栏显示隐藏
            if (e.data.type === 1001) {
              this.isUiBar = e.data.data;
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type === 1015) {
              // viewCube的显示/隐藏
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type === 1002) {
              // 选择工具栏隐藏
              this.controllerInfo.hideTools = e.data.data || []
            } else if (e.data.type === 1003) {
              // 选择工具栏显示
              this.controllerInfo.showTools = e.data.data || []
            }
          }
        },
        false
      );
    },
    listenWindowSize() {
      // 移动端不更新分辨率
      if(this.isMobile()){
        return
      }
      // 监听窗口大小变化 id=14 height
      this.handleWindowSize();
      window.onresize = () => {
        clearTimeout(this.iTime);
        this.iTime = setTimeout(() => {
          this.handleWindowSize();
        }, 200);
      };
    },
    handleWindowSize(type = false) {
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
      if(type){
        return { width, height }
      }
      let params = {
        taskid: this.taskId,
        action: "platform",
        plateType: this.isMobile() ? 1 : 0,
        height: height,
        width: width,
      };
      doAction(params)
    },
    handleType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:34:19
       * @description: 选择类型 e 0: 重置主视图 1: 透视投影 2: 正交投影 3 自定义主视图
       */
      this.shadowType = e;
      if (e === 0) {
        this.handleState = 7;
      } else if (e === 3) {
        this.handleState = 2;
      } else {
        this.handleState = 1;
      }
      this.updateOrder();
    },
    goFront() {
      /**
       * @Author: zk
       * @Date: 2021-04-08 11:47:29
       * @description: 定位主视图
       */
      this.handleState = 10;
      this.updateOrder();
    },
    openTeamDialog() {
      this.$refs.teamworkDialogRef.openDialog({
        appid: this.appId,
      });
    },
    handleOrder(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 10:40:10
       * @description: cube指令
       */
      this.handleState = 6;
      this.cubeState = e;
      this.updateOrder();
    },
    async updateOrder() {
      /**
       * @Author: zk
       * @Date: 2020-09-14 15:16:16
       * @description: 操作指令
       */
      if (!this.taskId) {
        return this.$message.error("场景未加载，请刷新");
      }
      let params = {
        taskid: this.taskId,
      };
      switch (this.handleState) {
        case 1:
          // 模式切换
          params.action = "switchViewMode";
          // 投影类型切换
          if (this.shadowType === 2) {
            // 正交 必须为上帝视角
            params.projectionMode = 2;
            params.viewMode = 2;
          }
          if (this.shadowType === 1) {
            // 透视投影
            params.projectionMode = 1;
            if (this.listenInfo) {
              params.viewMode = this.listenInfo.state === 0 ? 1 : 2;
            } else {
              params.viewMode = 2;
            }
          }
          break;
        case 2:
          // 自定义主视图
          params.action = "setGodPos";
          break;
        case 6:
          // 六面体
          params.action = "cameraPosSpecial";
          params.sjid = this.cubeState;
          break;
        case 7:
          // 重置主视图
          params.action = "clearGodCamerashot";
          break;
        case 10:
          // 定位主视图
          params.action = "cameraPosAll";
          break;
        default:
          break;
      }
      //模型操作
      await doAction(params)
        .then((res) => {
            if (params.action === "cameraPosAll" && res && res.data) {
              if (this.$refs.getCube) {
                let realProject = res.data.projectionMode === "1" ? 1 : 2;
                this.$refs.getCube.resetActive(realProject);
              }
            }
            this.$message.success("指令下发成功")
        })
    },
    // 关闭模块
    closePart(type) {
        EventBus.$emit('eventTool', type)
    },
    setTagClick(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-12 16:49:12
       * @description: 标签树是否选中
       */
      let messageInfo = {
        prex: "ourbimMessage",
        type: 30001,
        data: e,
        message: "",
      };
      this.sentParentIframe(messageInfo);
    },
    initWebSocket() {
      //初始化weosocket
      /**
       * @Author: zk
       * @Date: 2021-02-24 13:42:13
       * @description: 初始化socket通信
       * 1 单击构件
       * 2.场景部分加载
       * 3 返回关注视角
       * 4 返回主视图信息
       * 5 多选构件
       * 6 启动事件
       * 7 点击空白
       * 8 初始化成功 加载进度
       */
      const wsuri = MODELAPI.CREATESOCKET(this.taskId);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = (e) => {      
        // 没有遮罩或者加载进度的时候 发指令去掉toll
        if(this.isFade === false || this.isProgress === false){
          this.sendToIframe(10200,'false',"");
        }
        if (e.data.length > 20) {
          this.isFade = false
          let realData = JSON.parse(e.data);
          // 添加外部网站和ourbim的全部通信，有些为了兼容之前的使用请不要删除其他的通信
          let allInfo = {
            prex: "ourbimMessage",
            type: 10000,
            data: realData,
            message: realData.name,
          };
          this.sentParentIframe(allInfo);
          if (realData.id === "1") {
            if(this.$refs.ComponentInformation){
              this.$refs.ComponentInformation.activeMaterialIndex = 0 //切换点击构件默认选中为初始值
            }
            this.selectPark = realData
            // 不知道构件为啥返回的格式不一样，有dynamicData的需要新增俩个属性放在最前面
            if(realData.data?.dynamicData?.length){
              realData.data.dynamicData = [{name:'构件名称',value:realData.data.name},{name:'构件ID',value:realData.data.revitCode}].concat(realData.data.dynamicData)
            }
            this.memberInfo = realData?.data?.dynamicData || realData.rsInfo || []
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20001,
              data: realData.data ? {...realData.data,pakId:realData.pakId} : { uuid:realData.mN, pakId:realData.pakId, dynamicData:realData.rsInfo },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "3") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20005,
              data: realData,
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "5") {
            // 多选构件
            this.sentParentIframe({ prex: "ourbimMessage", type: 20002, data: "", message: "" });
          } else if(realData.id === "6"){
            this.isFade = false
          } 
          else if (realData.id === "7") {
            // 点击空白地方初始化
            this.sentParentIframe({ prex: "ourbimMessage", type: 20003, data: "", message: "" });
            this.memberInfo = []
            this.selectPark = null
            this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {} })
            this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: {} })
          } else if (realData.id === "8") {
            // 加载过程
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10003,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            this.hiddenState = 0;
            const progress = Number(
              String(Number(realData.progress) * 100).substring(0, 3)
            );
            if (
              progress >= 0 &&
              progress <= 100 &&
              this.propsProgress.data < 100
            ) {
              this.propsProgress.data = progress;
              // id为8的时候进度条大于0就隐藏第一层遮罩层
              this.isFade = false               
              if (progress === 100) {
                // 定位主视图
                setTimeout(() => {
                  doAction({taskid: this.taskId,action: "cameraPosAll"})
                }, 1000);
              }
            }
            if (Number(realData.progress) === 1) {
              this.limitZoomSpeed();
              // 加载完成
              this.listenWindowSize();
              let noneTimer = setTimeout(() => {
                this.isProgress = false;
                clearTimeout(noneTimer);
              }, 1000);
              this.getMonitor();
            }
          } else if (realData.id === "9") {
            let messageInfo = {
                prex: "ourbimMessage",
                type: 30001,
                data: {
                    state: true,
                    tagId: realData.tagId,
                    tagType: 0,
                },
                message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "10") {
            this.sentParentIframe({ prex: "ourbimMessage", type: 30002, data: {tagId: realData.tagId}, message: "" });
            this.showUiBar();
          } else if (realData.id === "11") {
            this.sentParentIframe({ prex: "ourbimMessage", type: 30003, data: {tagId: realData.tagId}, message: "" });
          } else if (realData.id === "12") {
            if (
              Number(this.propsProgress.loadData) >= 0 &&
              Number(this.propsProgress.loadData) <= 100
            ) {
              this.propsProgress.loadData = Number(
                String(Number(realData.progress) * 100).substring(0, 3)
              );
              // 加载完再发 10200---
              this.sendToIframe(10200,'false',"");
            }
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10002,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            if (Number(realData.progress) === 1) {
              if (this.uaInfo.match(/MicroMessenger/i) != "micromessenger") {
                this.delMaskTimer(500);
              } else {
                this.delMaskTimer(1000 * 5);
              }
            } // 13cube返回数据
          } else if (realData.id === "14") {
            // 添加构件，但是按了 ESC
            if (this.controllerInfo.uiBar) {
              if(this.$refs.ComponentTree){
                // 更新构件树
                this.$refs.ComponentTree.updateComTreeAfterAddComs();
              }
              this.controllerInfo.tagUiBar = true;
              this.hideTool(false)
            }
          } else if (realData.id === "15") {
            this.selectPark = realData //选择构件
              if(this.$refs.ResourcePool){
                // 点击构件打开坐标轴
                this.$refs.ResourcePool.checkOprate(realData);
              }
          } else if (realData.id === "16") {
            // 距离上一次操作时长
            this.exitMiniprogram(realData.lastOperationTime);
          } else if (realData.id === "17") {
            if(this.$refs.ComponentTree){
              realData.uuids.map((v) => {
                this.$refs.ComponentTree.updateTree(v);
              });
            }
          } else if (realData.id === "18") {
            // 构件创建成功,这个没有返回相关信息了
          } else if (realData.id === "19") {
            // 构件新建失败
            // 提示判断添加构建失败
            this.showUiBar();
            this.$message.error('指令下发失败');
          }else if(realData.id === "21"){  // 测量结果
            // 资源库图纸打开情况下数据返回成功弹出设置比例尺弹窗
            if(this.$refs.DialogScale && this.checkShow('resource')){
              this.copyingPictures['measureValue'] = realData.rsInfo.value
              if(!this.copyingPictures.id){
                return this.$message.warning('请选择图纸测量！')
              }
              this.$refs.DialogScale.show()
            }
          }else if(realData.id === "30"){
              if(realData.object){
                this.$message.success('开始下载');
                let url = realData.object;
                this.outPic(url);
              }
          }else if(realData.id === "28"){
              if(realData.rsInfo[0].pakId){
                (realData.rsInfo[0].pakId === 'MAPWEB' || realData.rsInfo[0].pakId === 'gis')  ? this.pakIdMapweb = 'public' : this.pakIdMapweb = '';
              }
            // 选中的构件信息
              this.$set(this.materialData,'matList',realData.rsInfo.length&&realData.rsInfo[0].matList || [])
              this.materialData.matList?.length&&this.materialData.matList.forEach(item=>{
                try {
                     this.materialData.rsInfo.forEach(e=>{
                        if(item.matId === e.matId){
                              this.$set(item,'imgPath',e.imgPath)
                              throw new Error()
                            }
                        })             
                    } catch (error) {}
                })
            this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {...realData.rsInfo.length&&realData.rsInfo[0],matList:this.materialData.matList} || {} })
            this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: this.materialData.matList[0] })
            if(this.$refs.ComponentInformation){
              this.$refs.ComponentInformation.getMaterial(this.materialData.matList[0].matId)
              // 显示构件信息和打开图标选中
              this.$refs.ComponentInformation.show()
            }
            if(this.$refs.Tool){
                this.$refs.Tool.list.forEach(e=>{
                    if(e.key==='componentInformation'){
                        e.check = true
                    }
                })
                this.$refs.Tool.getChecks()
            }
          }else if(realData.id === "29"){
            // 材质信息图片
            this.$set(this.materialData,'rsInfo',realData.rsInfo)
            this.materialData.matList?.length&&this.materialData.matList.forEach(item=>{
                try {
                    this.materialData.rsInfo.forEach(e=>{
                      if(item.matId === e.matId){
                        this.$set(item,'imgPath',e.imgPath)
                        throw new Error()
                      }
                    })             
                } catch (error) {}
            })
            this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList:this.materialData.matList} || {} })
          }else if(realData.id === "33"){
            // 视点动画播放
            if(this.$refs.viewPhoto){
              this.$refs.viewPhoto.WebSocketData = realData
            }
          }else if(realData.id === "41"){
            // 定位码放置完成
            if(this.$refs.LocationCode){
              this.$refs.LocationCode.placeCode(realData.codeID)
            }
          }else if(realData.id === "42"){
            // 临摹图信息
            this.copyingPictures = realData
          }
        }
      };
      this.websock.onopen = (e) => {
        this.socketTimer = setInterval(() => {
          this.websock.send("Bang");
        }, 1000 * 30);
      };
      this.websock.onerror = (e) => {};
    },
    /*
      注释中所提到的后台即为发布端/订阅端
    */
    initMqtt(){
        const url = new URL(this.$config.VUE_APP_REQUEST_URL);
        var hostname = url.hostname,
            port = 8083,
            clientId = `mqtt_${Math.random().toString(16).slice(3)}`,
            timeout = 4000,
            keepAlive = 100,
            cleanSession = false,
            ssl = false;
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
                this.client.subscribe('task/#');
                this.client.subscribe(`terminal/${this.$route.query.token}`);
                this.getModelUrl();
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
            let res = JSON.parse(message.payloadString)
            if(res.taskId){
                this.taskId = res.taskId
                this.getProccess()
            }
        };
    },
    // 发送消息到mqtt
    sendMqtt() {
        if(!this.taskId) return
        let mess = `task/${this.taskId}/js/close`
        var message = new Paho.MQTT.Message(JSON.stringify({timestamp:new Date().getTime()}));
        message.destinationName = mess;
        message.qos=0;
        this.client.send(message);
    },
    // 监听关闭浏览器
    unLoad(){
        if (this.isMobile()) {
            window.addEventListener('pagehide', ()=> {
                this.sendMqtt()
            });
            document.addEventListener('visibilitychange', (event)=> {
                if (document.visibilityState === 'hidden') {
                    this.sendMqtt()
                }
            });
        } else {
            window.addEventListener('beforeunload', (event)=> {
                this.sendMqtt()
            });
        }
    },
    limitZoomSpeed() {
      // 限制缩放速度
      if (this.isMobile()) {
        let params = {
          taskid: this.taskId,
          action: "initWorldParam",
          zoomSpeed: "0.02",
        };
        doAction(params)
      }
    },
    showUiBar() {
      // 显示面板
      this.hideTool(false)
      if (this.controllerInfo.uiBar) {
        this.controllerInfo.tagUiBar = true;
      }
    },
    exitMiniprogram(time) {
      // 微信小程序长时间未操作，返回项目列表页
      if (time > 60) {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            this.isFade = true;
            this.hiddenState = 1;
            this.clearTimePass();
            this.closeWebSocket();
          }
        });
      }
    },
    delMaskTimer(e) {
      /**
       * @Author: zk
       * @Date: 2021-06-02 18:08:55
       * @description: 去除遮罩时限
       * @param {*} setTimeout
       */
      let loadTimer = setTimeout(() => {
        this.isFade = false;
        clearTimeout(loadTimer);
      }, e);
    },
    // 获取流程文字
    getProccess(){
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        let count = 0;//计算请求次数
        const getResponse = ()=>{
            if(this.hiddenState !== 0) return
            getProccess({taskId:this.taskId}).then(async res=>{
                this.loadingProccessArr = res.data
                for (let i = 0; i < res.data.length; i++) {
                    if(this.webUrl || count > 30) return
                    const element = res.data[i];
                    if(this.loadingProccess > 0 && element.status==="waiting"){
                        this.loadingProccess = i
                        count++
                        setTimeout(getResponse(),1000)
                        return
                    }else if(element.status==="success" && (count === 0 || (this.loadingProccess > 0 && this.loadingProccess < i))){
                        this.loadingProccess = i
                    }
                    await sleep(200);
                }
            })
        }
        getResponse()
    },
    // 获取流地址
    getModelUrl() {
      let appId = this.$route.query.appid;
      let size = this.handleWindowSize(true)
      let params = {
        appliId: appId,
        token: this.appToken,
        resX: size.width,
        resY: size.height
      };
      const { userType, nickName, code } = this.$route.query;
      if (userType !== undefined && userType !== null) {
        this.userType = userType;
        params.userType = userType;
      }
      if (userType == 0) {
        this.isFade = false;
      }
      if (nickName) {
        params.nickName = nickName;
      }
      if (code) {
        params.code = code;
      }
      MODELAPI.GETMODELINFO(params)
        .then((res) => {
            this.webUrl = res.data.url;
            this.taskId = res.data.taskId;
            // 保存code
            if (res.data.code) {
              this.shareCode = res.data.code;
              let messageInfo = {
                prex: "ourbimMessage",
                type: "shareCode",
                data: this.shareCode,
                message: "",
              };
              this.sentParentIframe(messageInfo);
            }

            let messageInfo = {
              prex: "ourbimMessage",
              type: 10001,
              data: {
                taskId: res.data.taskId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            this.initWebSocket();
            if (res.data.appliType !== "1") {
              if (this.isUiBar) {
                this.controllerInfo.uiBar = true;
              } else {
                this.controllerInfo.uiBar = false;
                this.controllerInfo.viewCube = false;
              }
            } else {
              this.controllerInfo.uiBar = false;
              this.controllerInfo.viewCube = false;
            }
        })
        .catch((err) => {
          // 最大节点已达到上限时
          this.maxNodes = true;
        });
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    // 设置加载时间超时提醒
    setTimeLoad() {
      this.loadTimer = setTimeout(() => {
        if (this.isFade === true) {
          this.hiddenState = 2;
          this.closeWebSocket();
        }
        clearTimeout(this.loadTimer);
      }, 1000 * 60 * 3);
    },
    // 清除定时器
    clearTimePass() {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
    },
    closeWebSocket() {
      // 清除定时器
      if (this.socketTimer) {
        clearInterval(this.socketTimer);
        this.socketTimer = null;
      }
      if (this.websock) {
        this.websock.close(); //离开路由之后断开websocket连接
        this.websock = null;
        this.webUrl = null;
      }
    },
    getMonitor() {
        document.addEventListener("keydown", (e) => {
          if([37,38,39,40,229].includes(e.keyCode)) return
          this.sendToIframe(
            10010,
            {
              key: e.code,
              keyCode: e.keyCode,
              repeat: e.repeat,
            },
            ""
          );
        },true);
        document.addEventListener("keyup", (e) => {
          if([37,38,39,40,229].includes(e.keyCode)) return
          this.sendToIframe(
            10011,
            {
              key: e.code,
              keyCode: e.keyCode,
              repeat: e.repeat,
            },
            ""
          );
        },true);
    },
    sentParentIframe(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 11:42:25
       * @description:
       * 参考readme
       */
      window.parent.postMessage(e, "*");
    },
    sendToIframe(type, data, message) {
      /**
       * @Author: zk
       * @Date: 2020-09-29 10:18:33
       * @description: postmessage通信
       */
      let realIframe = document.getElementById("show-bim");
      if (realIframe) {
        realIframe.contentWindow.postMessage(
          {
            prex: "pxymessage", // 约定的消息头部
            type: type, // 消息类型
            data: data, // 具体数据
            message: message, // 附加信息
          },
          "*"
        );
      } else {
      }
    },
    // 获取pakid
    getLinkModelAppid(){
      let params = {
        appId:this.appId
      }
      CHAILIAOAPI.GETPAKIDBYAPPID(params).then(res=>{
          if(res.data.code === 0){
            this.pakAndAppid = res.data.data;
          }
      }).catch(()=>{})
    },
    // 根据pakId 找到appId
    pakidToAppid(str){
      let obj = this.pakAndAppid.find(e=>{return e.pakId === str})
      return obj?.appId;
    },
  },
};
</script>

<style lang="less" scoped>
.bim-main {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  .hidden-bim {
    position: absolute;
    z-index: 300;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover!important;

    @-webkit-keyframes bgp {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
    .hidden-text {
      letter-spacing: 1px;
      margin-top: 130px;
      position: absolute;
      font-size: 20px;
      background-image: linear-gradient(
        to right,
        #b9fffc,
        #a2d8f4,
        #9ab3f5,
        #7579e7,
        #9ab3f5,
        #a2d8f4,
        #b9fffc
      );
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-background-size: 200% 100%;
      animation: bgp 3s infinite linear;
    }

    .show-loading {
      width: 80px;
      height: 80px;
      margin-bottom: 30px;
    }

    .proccessText{
      color: #ffffff;
      position: absolute;
      bottom: 90px;
      z-index: 999;
    }
  }

  #show-bim {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .phone-bim {
    height: 100vh !important;
    width: 100vw !important;
  }
}
</style>
<style lang="less" >
@import './index.less';
.set-index-message {
  z-index: 5000 !important;
}
.bim-progress {
  position: absolute;
  margin-top: 120px;
  width: 260px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-progress {
    margin: 0 auto;
    width: 100%;
    .el-progress-bar__outer {
      background-color: #00a8f054!important;
    }
    .el-progress-bar__inner {
      line-height: 0;
      background-color: #00aaf0!important;
    }
  }
  .load-tip {
    width: 100%;
    display: flex;
    margin: 20px 0;
    letter-spacing: 2px;
    color: #00aaf0!important;
    div {
      margin-left: auto;
    }
  }
}

.invite-team-friend {
  padding-left: 0 !important;
  .invite-btn {
    border: 2px solid #284dba;
    display: flex;
    align-items: center;
    background-color: rgba(41, 82, 199, 1);
    height: 60%;
    width: 166px;
    justify-content: center;
    cursor: pointer;
    border-radius: 2px;
  }
  position: fixed;
  top: 0;
  right: 0;
  width: 228px;
  height: 30px;
  display: flex;
  align-items: center;
  color: #7184bb;
  padding-left: 15px;
  font-size: 14px;
  box-sizing: border-box;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>